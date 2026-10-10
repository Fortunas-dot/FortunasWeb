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
| ChoseFree (custom) | — | Free plan → App Store | ✅ | — |
| InitiateCheckout | ClickButton | "Start my 7-day free trial" (Pro) | ✅ | ✅ |
| CompleteRegistration | CompleteRegistration | TimeWell account created on the paywall | ✅ | ✅ |
| StartTrial | StartTrial | Stripe checkout completed — id `trial_<session>` | ✅ | ✅ + Stripe webhook |
| Purchase | Purchase | first paid invoice (day 7) — id `purchase_<subscription>` | — | Stripe webhook |

Browser and server copies carry the **same event id**, so Meta/TikTok count each
event once (they de-duplicate on event name + event id). The server copy is what
still lands when the pixel is blocked (adblock, iOS, Instagram/Facebook in-app
browsers). Each carries hashed email (if given) and visitor id, raw `_fbp` / `_fbc`,
IP (from Cloudflare's `cf-connecting-ip`) and user agent. If the pixel never set
`_fbp`, the server creates one in Meta's documented format and sets the cookie.

`/api/capi` accepts only the events in `ALLOWED_EVENTS` — add a new one there
when the quiz starts mirroring it.

## Paywall and web checkout (TimeWell Pro)

Aurora's model (`docs/mobile-app-entitlement-integration.md` in Aurora-Website):
quiz paywall → `/api/timewell/register` (TimeWell account, proxied to the TimeWell server) →
`/api/timewell/checkout` (Stripe Embedded Checkout, 7-day trial then €6.99/month) → the
subscription's metadata carries `app_user_id` = the TimeWell account id →
RevenueCat's Stripe provider grants `timewell_pro` → the app, signed in with the
same account, logs RevenueCat in with that id and Pro is there.

The pixel cookies, IP and user agent are stored on the subscription's metadata at
checkout, so the day-7 Purchase (sent by the webhook, long after the browser is
gone) is still matched to the ad click.

## Railway variables

Stripe settings are per company (each has its own Stripe account), so they carry the
app's name: `TIMEWELL_STRIPE_…`. A future quiz for another company gets its own set
and its own `/api/<app>/…` routes.

| Var | Purpose |
| --- | --- |
| `META_CAPI_ACCESS_TOKEN` | **Required** for server events. Events Manager → dataset → Settings → Conversions API → *Generate access token*. Without it every server event is skipped (no error). |
| `META_PIXEL_IDS` | Optional comma list of allowed pixels. Default `3209611159230624`. |
| `META_TEST_EVENT_CODE` | Only while checking **Test events**; remove afterwards. |
| `TIKTOK_PIXEL_ID`, `TIKTOK_ACCESS_TOKEN` | TikTok leg; skipped until both are set. |
| `TIMEWELL_STRIPE_MODE` | `test` or `live` — which set below the checkout uses. Switch here; nothing else changes. |
| `TIMEWELL_STRIPE_TEST_SECRET_KEY` / `TIMEWELL_STRIPE_LIVE_SECRET_KEY` | `sk_test_…` / `sk_live_…` |
| `TIMEWELL_STRIPE_TEST_PUBLISHABLE_KEY` / `…_LIVE_PUBLISHABLE_KEY` | `pk_test_…` / `pk_live_…` — sent to the quiz with each checkout session. |
| `TIMEWELL_STRIPE_TEST_PRICE_PRO` / `…_LIVE_PRICE_PRO` | `price_…` of TimeWell Pro (€6.99 / month) in that account. |
| `TIMEWELL_STRIPE_TEST_WEBHOOK_SECRET` / `…_LIVE_WEBHOOK_SECRET` | `whsec_…` of that account's webhook to `https://fortunas.nl/api/timewell/stripe-webhook` (events `checkout.session.completed`, `invoice.paid`). The endpoint accepts both accounts, each checked against its own secret. |
| `TIMEWELL_FUNNEL_SHARED_SECRET` | Same value as `FUNNEL_SHARED_SECRET` on the TimeWell server, so its sign-up rate limit counts each visitor instead of this one server. |
| `TIMEWELL_API` | Optional; defaults to `https://timewell-production.up.railway.app`. |

Test-mode (sandbox) trials and purchases are never sent to Meta, from the browser or
the webhook, so testing with card 4242… cannot skew the ad data. The older single set
(`TIMEWELL_STRIPE_SECRET_KEY`, …) still works and is filed under test or live by its
key prefix.

## Checking it works

1. Set `META_TEST_EVENT_CODE` to the code shown in Events Manager → **Test
   events**, redeploy, finish the quiz on fortunas.nl/timewell/quiz.
2. The response of `/api/capi` (browser devtools → Network) shows Meta's answer
   per pixel: `events_received: 1` means accepted.
3. Remove `META_TEST_EVENT_CODE` again. Real traffic shows in **Overview**, which
   lags up to ~30 minutes — Aurora's notes: Test events often shows only PageView
   for server events even when they arrive; Overview is the source of truth.
