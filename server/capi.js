import crypto from 'node:crypto'
import { sendToTikTok, toTikTokEventName } from './tiktok.js'

// Browser → server events bridge for the quizzes' key events (Meta Conversions
// API + TikTok Events API). A port of the Aurora website's app/api/capi/route.ts.
//
// The quiz already fires these events with the browser pixels (fbq + ttq). It
// also POSTs here with the SAME event_id, so Meta/TikTok each de-duplicate the
// browser+server pair, and we still capture the conversion when the browser
// pixels are blocked (adblock / iOS / ITP / in-app browsers).
//
// One difference from Aurora: a quiz can feed SEVERAL Meta pixels. The browser
// sends `pixel_ids`; the event goes to each one that is on META_PIXEL_IDS. A
// Conversions API token belongs to the business, not to one dataset, so one
// token serves them all (verified on Aurora when it switched datasets).
//
// Only a small allowlist of events is accepted so this public endpoint can't be
// used to inject arbitrary conversions.
//
// Env (Railway → FortunasWeb service → Variables):
//   META_CAPI_ACCESS_TOKEN - Conversions API token (Events Manager → dataset →
//                            Settings → Generate access token). Required, or
//                            every Meta server event is skipped.
//   META_PIXEL_IDS         - optional comma list of allowed pixels; defaults to
//                            the TimeWell dataset.
//   META_TEST_EVENT_CODE   - optional; set ONLY while checking Test Events.

const META_PIXEL_IDS = new Set(
  (process.env.META_PIXEL_IDS || '3209611159230624')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)
const META_CAPI_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || ''
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || ''
const GRAPH_VERSION = 'v21.0'

// StartTrial is mirrored from the browser when Stripe checkout completes; the
// Stripe webhook sends the same event with the same id (trial_<session id>).
const ALLOWED_EVENTS = new Set(['ViewContent', 'Lead', 'InitiateCheckout', 'CompleteRegistration', 'StartTrial'])

/** The allowlisted subset of the given pixel ids (all allowlisted pixels if none given). */
export function allowedPixels(ids) {
  const list = (Array.isArray(ids) ? ids : String(ids || '').split(',')).map((s) => String(s).trim()).filter(Boolean)
  return list.length ? list.filter((id) => META_PIXEL_IDS.has(id)) : [...META_PIXEL_IDS]
}

/**
 * POST one event to each pixel's Conversions API endpoint. Shared by the browser
 * bridge below and the Stripe webhook (server/stripe.js). Never throws.
 */
export async function sendMetaEvent(pixels, event) {
  if (!META_CAPI_TOKEN) return { ok: true, skipped: 'no-capi-token' }
  if (!pixels.length) return { ok: true, skipped: 'no-allowed-pixel' }
  const payload = { ...(META_TEST_EVENT_CODE ? { test_event_code: META_TEST_EVENT_CODE } : {}), data: [event] }
  const results = await Promise.all(
    pixels.map(async (pixel) => {
      try {
        const res = await fetch(
          `https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(META_CAPI_TOKEN)}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) },
        )
        const data = await res.json().catch(() => ({}))
        if (!res.ok) console.error('[capi] Meta CAPI error:', pixel, event.event_name, res.status, data)
        return { pixel, ok: res.ok, data }
      } catch (e) {
        console.error('[capi] Meta CAPI request failed:', pixel, event.event_name, e?.message || e)
        return { pixel, ok: false }
      }
    }),
  )
  return { ok: results.every((r) => r.ok), results }
}

/** Meta user_data from what we know about a person. Email / external id hashed, fbp/fbc raw. */
export function buildUserData({ email, externalId, fbp, fbc, ip, ua }) {
  const u = {}
  if (email) u.em = [sha256(String(email).trim().toLowerCase())]
  if (externalId) u.external_id = [sha256(String(externalId).trim())]
  if (fbp) u.fbp = fbp
  if (fbc) u.fbc = fbc
  if (ua) u.client_user_agent = ua
  if (ip) u.client_ip_address = ip
  return u
}

function sha256(v) {
  return crypto.createHash('sha256').update(v).digest('hex')
}

// Read a cookie value from the incoming request (Meta's _fbp / _fbc).
function readCookie(req, name) {
  const raw = req.headers.cookie || ''
  const m = raw.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}

/** Returns { status, json, cookies } — the HTTP layer lives in server/index.js. */
export async function handleCapi(req, body) {
  if (!body || typeof body !== 'object') {
    return { status: 400, json: { message: 'Invalid body' } }
  }

  const eventName = String(body.event_name || '')
  if (!ALLOWED_EVENTS.has(eventName)) {
    return { status: 200, json: { ok: true, skipped: 'event-not-allowed' } }
  }
  const pixels = (Array.isArray(body.pixel_ids) ? body.pixel_ids : [])
    .map(String)
    .filter((id) => META_PIXEL_IDS.has(id))

  // Build hashed user_data for matching. Email / external_id come from the body.
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const externalId = typeof body.external_id === 'string' ? body.external_id.trim() : ''
  // Prefer the _fbp / _fbc the browser sent explicitly in the body (per Meta
  // docs, user_data.fbp/fbc carry the pixel cookie values); fall back to the
  // request cookie.
  const fbc = (typeof body.fbc === 'string' && body.fbc) || readCookie(req, '_fbc')

  // _fbp: use the pixel's value if present. If the pixel never set one (blocked
  // / iOS / webview), Meta documents constructing it as fb.1.<ms>.<random>. We
  // generate ONCE and set it as the _fbp cookie, so every later event (pixel +
  // CAPI) reuses the SAME id and stays matched.
  let fbp = (typeof body.fbp === 'string' && body.fbp) || readCookie(req, '_fbp')
  let generatedFbp = ''
  if (!fbp) {
    fbp = `fb.1.${Date.now()}.${Math.floor(1e15 + Math.random() * 9e15)}`
    generatedFbp = fbp
  }
  const ua = req.headers['user-agent'] || ''
  // Cloudflare sits in front of Railway, so the visitor's address is in
  // cf-connecting-ip; x-forwarded-for is the fallback.
  const ip = String(req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || '')
    .split(',')[0]
    .trim()

  const userData = {}
  if (email) userData.em = [sha256(email)]
  if (externalId) userData.external_id = [sha256(externalId)]
  if (fbp) userData.fbp = fbp // sent raw, not hashed
  if (fbc) userData.fbc = fbc
  if (ua) userData.client_user_agent = ua
  if (ip) userData.client_ip_address = ip

  const custom = body.custom_data && typeof body.custom_data === 'object' ? body.custom_data : {}
  const eventSourceUrl =
    typeof body.event_source_url === 'string' && body.event_source_url
      ? body.event_source_url
      : 'https://fortunas.nl/timewell/quiz'

  // ── TikTok leg ── same event_id, kicked off first so both calls run together.
  const tiktokEventName = toTikTokEventName(eventName)
  const ttclid = (typeof body.ttclid === 'string' && body.ttclid) || readCookie(req, 'tw_ttclid')
  const ttp = (typeof body.ttp === 'string' && body.ttp) || readCookie(req, '_ttp')
  const tiktokPromise = tiktokEventName
    ? sendToTikTok({
        eventName: tiktokEventName,
        eventId: String(body.event_id || ''),
        eventSourceUrl,
        email: email || undefined,
        userId: externalId || undefined,
        ttclid: ttclid || undefined,
        ttp: ttp || undefined,
        ip: ip || undefined,
        ua: ua || undefined,
      }).catch((e) => console.error('[tiktok] browser-mirror forward failed:', e?.message || e))
    : Promise.resolve()

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    // Same id the browser pixel used → Meta de-duplicates the pair.
    event_id: String(body.event_id || ''),
    event_source_url: eventSourceUrl,
    user_data: userData,
    custom_data: custom,
  }

  const cookies = generatedFbp
    ? [`_fbp=${generatedFbp}; Path=/; Max-Age=7776000; SameSite=Lax`] // 90 days, Meta's _fbp lifetime
    : []

  try {
    const sent = await sendMetaEvent(pixels, event)
    const meta = sent.results || { skipped: sent.skipped }
    await tiktokPromise
    return {
      status: 200,
      json: sent.ok ? { ok: true, forwarded: eventName, meta } : { ok: false, meta },
      cookies,
    }
  } catch (e) {
    console.error('[capi] forward failed:', e)
    return { status: 200, json: { message: 'Forwarding failed' }, cookies }
  }
}
