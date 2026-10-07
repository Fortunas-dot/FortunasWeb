import crypto from 'node:crypto'

// Single place that builds and sends a server-side event to TikTok's Events API.
// A port of the Aurora website's app/lib/tiktok.ts.
//
// Spec: TikTok Events API v1.3 — POST /open_api/v1.3/event/track/ with an
// Access-Token header. Success is HTTP 200 AND body.code === 0. TikTok
// de-duplicates a pixel event and an API event when BOTH the event name AND
// event_id match — same rule as Meta, so we reuse the exact same event ids.
//
// user fields per spec: email / external_id are SHA-256 hashed; ttclid (the
// ?ttclid= landing param) and ttp (the _ttp cookie the pixel sets) are sent raw;
// ip + user_agent improve matching.
//
// Env:
//   TIKTOK_ACCESS_TOKEN    - Events API access token. Server-only. Unset = skipped.
//   TIKTOK_PIXEL_ID        - the TikTok web pixel. Unset = skipped (no pixel yet).
//   TIKTOK_TEST_EVENT_CODE - optional; set ONLY while testing in Test Events.

const TIKTOK_PIXEL_ID = process.env.TIKTOK_PIXEL_ID || ''
const TIKTOK_ACCESS_TOKEN = process.env.TIKTOK_ACCESS_TOKEN || ''
const TIKTOK_TEST_EVENT_CODE = process.env.TIKTOK_TEST_EVENT_CODE || ''
const TIKTOK_ENDPOINT = 'https://business-api.tiktok.com/open_api/v1.3/event/track/'

export function sha256(v) {
  return crypto.createHash('sha256').update(String(v).trim().toLowerCase()).digest('hex')
}

// Meta event name → the TikTok event the quiz's browser pixel fires for it, so
// the browser and server copies share a name and de-duplicate.
export function toTikTokEventName(name) {
  switch (name) {
    case 'ViewContent':
      return 'ViewContent'
    case 'Lead':
      return 'SubmitForm'
    case 'InitiateCheckout':
      return 'ClickButton'
    case 'StartTrial':
      return 'StartTrial'
    case 'CompleteRegistration':
      return 'CompleteRegistration'
    default:
      return null
  }
}

export async function sendToTikTok(ev) {
  if (!TIKTOK_ACCESS_TOKEN || !TIKTOK_PIXEL_ID) {
    return { ok: false, skipped: 'no-tiktok-config' }
  }

  const user = {}
  if (ev.email) user.email = sha256(ev.email)
  if (ev.userId) user.external_id = sha256(ev.userId)
  if (ev.ttclid) user.ttclid = ev.ttclid // click id + _ttp are NOT hashed
  if (ev.ttp) user.ttp = ev.ttp
  if (ev.ip) user.ip = ev.ip
  if (ev.ua) user.user_agent = ev.ua

  const body = {
    event_source: 'web',
    event_source_id: TIKTOK_PIXEL_ID,
    ...(TIKTOK_TEST_EVENT_CODE ? { test_event_code: TIKTOK_TEST_EVENT_CODE } : {}),
    data: [
      {
        event: ev.eventName,
        event_time: ev.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: ev.eventId,
        user,
        page: { url: ev.eventSourceUrl || 'https://fortunas.nl/timewell/quiz' },
        properties: {
          content_type: 'product',
          contents: [{ content_id: 'timewell', content_type: 'product', content_name: 'TimeWell' }],
        },
      },
    ],
  }

  const res = await fetch(TIKTOK_ENDPOINT, {
    method: 'POST',
    headers: { 'Access-Token': TIKTOK_ACCESS_TOKEN, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  // TikTok signals rejection with HTTP 200 + a non-zero body.code — check both.
  if (!res.ok || data.code !== 0) {
    console.error('[tiktok]', ev.eventName, 'TikTok error:', res.status, data)
    return { ok: false, status: res.status, data }
  }
  return { ok: true, data }
}
