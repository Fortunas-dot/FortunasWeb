# Quiz event tracking (Meta Pixel + Conversions API)

How the web quizzes on fortunas.nl report to Meta (and TikTok, once a pixel
exists). Modelled on the Aurora website — its `META-EVENTS.md` has the long
history of what went wrong there and why; read it before debugging.

## Where things live

| Piece | File |
| --- | --- |
| Quiz page + browser pixel | `public/timewell/quiz.html` (config block `TW_FUNNEL` at the top) |
| Events bridge `/api/capi` | `server/capi.js` (Meta) + `server/tiktok.js` (TikTok) |
| Production server | `server/index.js` — `npm start` on Railway |

The site is a static Vite build, so it needs `server/index.js` to run any server
code: it serves `dist/`, gives quizzes clean URLs (`/timewell/quiz`) with
`no-store` caching (as Aurora does for its funnels), and handles `/api/capi`.

## Pixels

- TimeWell quiz → Meta dataset **`3209611159230624`** ("TimeWell").
- A quiz can feed **several** pixels: `metaPixelIds` in the quiz config is a list,
  and every event goes to all of them. The server only forwards to pixels on its
  allowlist (`META_PIXEL_IDS`), so add a new pixel in **both** places.
- The number in the Events Manager URL after `act=` is the **ad account**, not a
  pixel. Use the id from the base code: `fbq('init', '<id>')`.

## Events

| Event (Meta) | TikTok | Fires when | Browser | Server copy |
| --- | --- | --- | --- | --- |
| PageView | page | quiz opens | ✅ | — |
| QuizStarted (custom) | — | first answer | ✅ | — |
| ViewContent | ViewContent | plan page reached (once per visitor) | ✅ | ✅ |
| Lead | SubmitForm | email submitted (only if `leadEndpoint` is set) | ✅ | ✅ |
| InitiateCheckout | ClickButton | App Store button clicked | ✅ | ✅ |

Browser and server copies carry the **same event id**, so Meta/TikTok count each
event once (they de-duplicate on event name + event id). The server copy is what
still lands when the pixel is blocked (adblock, iOS, Instagram/Facebook in-app
browsers). Each carries hashed email (if given) and visitor id, raw `_fbp` / `_fbc`,
IP (from Cloudflare's `cf-connecting-ip`) and user agent. If the pixel never set
`_fbp`, the server creates one in Meta's documented format and sets the cookie.

`/api/capi` accepts only the events in `ALLOWED_EVENTS` — add a new one there
when the quiz starts mirroring it.

## Railway variables

| Var | Purpose |
| --- | --- |
| `META_CAPI_ACCESS_TOKEN` | **Required** for server events. Events Manager → dataset → Settings → Conversions API → *Generate access token*. Without it every server event is skipped (no error). |
| `META_PIXEL_IDS` | Optional comma list of allowed pixels. Default `3209611159230624`. |
| `META_TEST_EVENT_CODE` | Only while checking **Test events**; remove afterwards. |
| `TIKTOK_PIXEL_ID`, `TIKTOK_ACCESS_TOKEN` | TikTok leg; skipped until both are set. |

## Checking it works

1. Set `META_TEST_EVENT_CODE` to the code shown in Events Manager → **Test
   events**, redeploy, finish the quiz on fortunas.nl/timewell/quiz.
2. The response of `/api/capi` (browser devtools → Network) shows Meta's answer
   per pixel: `events_received: 1` means accepted.
3. Remove `META_TEST_EVENT_CODE` again. Real traffic shows in **Overview**, which
   lags up to ~30 minutes — Aurora's notes: Test events often shows only PageView
   for server events even when they arrive; Overview is the source of truth.
