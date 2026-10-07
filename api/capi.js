import crypto from 'node:crypto'

// Browser → server bridge for the web quizzes' key events (Meta Conversions API).
// Modelled on the Aurora website's app/api/capi/route.ts.
//
// The quiz fires each key event with the browser pixel AND posts it here with the
// SAME event_id. Meta de-duplicates the pair (event_name + event_id), and the
// conversion still lands when the pixel is blocked (adblock / iOS / in-app browsers).
//
// One quiz can feed several pixels: the browser sends `pixel_ids`, and the event
// goes to each of them that is on the allowlist below. A Conversions API token is
// tied to the business, not to one dataset, so one token serves every pixel.
//
// Env (Vercel → Project → Settings → Environment Variables):
//   META_CAPI_ACCESS_TOKEN  required; without it every event is skipped (no error)
//   META_PIXEL_IDS          optional comma list; replaces the default allowlist

const ALLOWED_PIXELS = new Set(
  (process.env.META_PIXEL_IDS || '3209611159230624')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
)
const TOKEN = process.env.META_CAPI_ACCESS_TOKEN || ''
const GRAPH_VERSION = 'v21.0'

// Only these can be sent, so this public endpoint can't inject other conversions.
const ALLOWED_EVENTS = new Set(['ViewContent', 'Lead', 'InitiateCheckout'])

const sha256 = (v) => crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex')

function readCookie(req, name) {
  const m = (req.headers.cookie || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return m ? decodeURIComponent(m[1]) : ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'POST only' })
    return
  }
  let body = req.body
  if (typeof body === 'string') {
    try { body = JSON.parse(body) } catch { body = null }
  }
  if (!body || typeof body !== 'object') {
    res.status(400).json({ message: 'Invalid body' })
    return
  }

  const eventName = String(body.event_name || '')
  if (!ALLOWED_EVENTS.has(eventName)) {
    res.status(200).json({ ok: true, skipped: 'event-not-allowed' })
    return
  }
  const pixels = (Array.isArray(body.pixel_ids) ? body.pixel_ids : [])
    .map(String)
    .filter((id) => ALLOWED_PIXELS.has(id))
  if (!pixels.length) {
    res.status(200).json({ ok: true, skipped: 'no-allowed-pixel' })
    return
  }

  // _fbp: the pixel's value if it set one. If it never did (blocked / iOS /
  // webview), Meta documents building it as fb.1.<ms>.<random>; we do that once
  // and set it as the _fbp cookie so every later event reuses the same id.
  let fbp = (typeof body.fbp === 'string' && body.fbp) || readCookie(req, '_fbp')
  if (!fbp) {
    fbp = `fb.1.${Date.now()}.${Math.floor(1e15 + Math.random() * 9e15)}`
    res.setHeader('Set-Cookie', `_fbp=${fbp}; Path=/; Max-Age=7776000; SameSite=Lax`)
  }
  const fbc = (typeof body.fbc === 'string' && body.fbc) || readCookie(req, '_fbc')
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
  const externalId = typeof body.external_id === 'string' ? body.external_id.trim() : ''
  const ua = req.headers['user-agent'] || ''
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()

  const userData = { fbp } // _fbp / _fbc are sent raw, not hashed
  if (fbc) userData.fbc = fbc
  if (email) userData.em = [sha256(email)]
  if (externalId) userData.external_id = [sha256(externalId)]
  if (ua) userData.client_user_agent = ua
  if (ip) userData.client_ip_address = ip

  if (!TOKEN) {
    res.status(200).json({ ok: true, skipped: 'no-capi-token' })
    return
  }

  const event = {
    event_name: eventName,
    event_time: Math.floor(Date.now() / 1000),
    action_source: 'website',
    event_id: String(body.event_id || ''),
    event_source_url: typeof body.event_source_url === 'string' ? body.event_source_url : '',
    user_data: userData,
    custom_data: body.custom_data && typeof body.custom_data === 'object' ? body.custom_data : {},
  }

  const results = await Promise.all(
    pixels.map(async (pixel) => {
      try {
        const r = await fetch(
          `https://graph.facebook.com/${GRAPH_VERSION}/${pixel}/events?access_token=${encodeURIComponent(TOKEN)}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data: [event] }) },
        )
        const data = await r.json().catch(() => ({}))
        if (!r.ok) console.error('[capi]', pixel, eventName, r.status, JSON.stringify(data))
        return { pixel, ok: r.ok }
      } catch (e) {
        console.error('[capi]', pixel, eventName, e)
        return { pixel, ok: false }
      }
    }),
  )
  res.status(200).json({ ok: results.every((r) => r.ok), results })
}
