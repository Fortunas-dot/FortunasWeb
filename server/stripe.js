import Stripe from 'stripe'
import { allowedPixels, buildUserData, sendMetaEvent } from './capi.js'
import { sendToTikTok } from './tiktok.js'

// TimeWell Pro, sold on the web — the Aurora website's model (see its
// app/api/checkout, app/api/stripe-webhook and docs/mobile-app-entitlement-
// integration.md):
//
//   quiz paywall → /api/register (TimeWell account) → /api/checkout (Stripe
//   Embedded Checkout, 7-day free trial, then €6.99/month) → the subscription
//   carries metadata.app_user_id = the TimeWell account id → RevenueCat's Stripe
//   provider (App User ID read from metadata `app_user_id`) grants `timewell_pro`
//   → the person signs in to the app with the same account and Pro is there.
//
// Events, Aurora-style, browser + server with shared ids so Meta counts once:
//   StartTrial  trial_<checkout session id>   browser on completion + webhook
//   Purchase    purchase_<subscription id>    webhook, first paid invoice (day 7)
//
// The pixel cookies (_fbp/_fbc), IP and user agent are saved on the subscription's
// metadata at checkout, so the day-7 Purchase — long after the browser is gone —
// is still matched to the ad click. (Aurora parks them in Redis; Stripe metadata
// does the same job here without a database.)
//
// Env (Railway → FortunasWeb → Variables):
// Every name starts with TIMEWELL_: the Fortunas site hosts quizzes for several companies,
// each with its own Stripe account, so each app gets its own keys and its own webhook path.
//
// Test (Stripe sandbox) and live keys sit side by side; one switch picks the active set:
//
//   TIMEWELL_STRIPE_MODE                    test | live — which set the checkout uses
//   TIMEWELL_STRIPE_{TEST,LIVE}_SECRET_KEY        sk_test_… / sk_live_…
//   TIMEWELL_STRIPE_{TEST,LIVE}_PUBLISHABLE_KEY   pk_test_… / pk_live_… — handed to the quiz
//   TIMEWELL_STRIPE_{TEST,LIVE}_PRICE_PRO         price_… of "TimeWell Pro" €6.99 / month
//   TIMEWELL_STRIPE_{TEST,LIVE}_WEBHOOK_SECRET    whsec_… of that account's webhook to
//                                                 /api/timewell/stripe-webhook
//
// The webhook accepts events from both accounts — each is verified against its own
// secret and handled with its own client — so the sandbox stays usable after going
// live. Test-mode trials and purchases are never sent to Meta.
// (The earlier single set, TIMEWELL_STRIPE_SECRET_KEY etc., still works: it is filed
// under test or live by its key prefix.)
//   TIMEWELL_API                 optional; the TimeWell account server
//                                (default https://timewell-production.up.railway.app)
//   TIMEWELL_FUNNEL_SHARED_SECRET     same value as FUNNEL_SHARED_SECRET on the TimeWell server, so its sign-up
//                                limits count each visitor, not this one server

const env = (name) => (process.env[name] || '').trim()

/** One Stripe account's settings: the sandbox ('test') or the real one ('live'). */
function accountFor(mode) {
  const M = mode.toUpperCase()
  let a = {
    mode,
    secret: env(`TIMEWELL_STRIPE_${M}_SECRET_KEY`),
    publishable: env(`TIMEWELL_STRIPE_${M}_PUBLISHABLE_KEY`),
    price: env(`TIMEWELL_STRIPE_${M}_PRICE_PRO`),
    webhookSecret: env(`TIMEWELL_STRIPE_${M}_WEBHOOK_SECRET`),
  }
  // The first setup used one unprefixed set; keep it working, filed by key prefix.
  const legacy = env('TIMEWELL_STRIPE_SECRET_KEY')
  if (!a.secret && legacy.startsWith(mode === 'live' ? 'sk_live_' : 'sk_test_')) {
    a = {
      mode,
      secret: legacy,
      publishable: env('TIMEWELL_STRIPE_PUBLISHABLE_KEY'),
      price: env('TIMEWELL_STRIPE_PRICE_PRO'),
      webhookSecret: env('TIMEWELL_STRIPE_WEBHOOK_SECRET'),
    }
  }
  a.client = a.secret ? new Stripe(a.secret) : null
  return a
}
const ACCOUNTS = { test: accountFor('test'), live: accountFor('live') }
const MODE = env('TIMEWELL_STRIPE_MODE').toLowerCase() === 'live' ? 'live' : 'test'
/** The account new checkouts go to. */
const active = () => ACCOUNTS[MODE]
const TIMEWELL_API = (process.env.TIMEWELL_API || 'https://timewell-production.up.railway.app').replace(/\/+$/, '')
const FUNNEL_SHARED_SECRET = process.env.TIMEWELL_FUNNEL_SHARED_SECRET || ''

const TRIAL_DAYS = 7
const PRO_PRICE = 6.99
const CURRENCY = 'EUR'
const QUIZ_PATH = '/timewell/quiz'

// Same reasoning as Aurora's checkout route: Stripe retired ui_mode 'embedded';
// 'embedded_page' replaces it and needs this API version, passed per request.
const EMBEDDED_API_VERSION = '2026-03-25.dahlia'
const EMBEDDED_UI_MODE = 'embedded_page'

export const checkoutConfigured = () => {
  const a = active()
  return Boolean(a.secret && a.publishable && a.price)
}
export const stripeMode = () => MODE

const clip = (v, n = 450) => String(v || '').slice(0, n) // Stripe metadata values max 500 chars
const visitorIp = (req) =>
  String(req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || '').split(',')[0].trim()
const emailOk = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)

/* ------------------------------------------------------------------ */
/* /api/timewell/register — create (or sign in to) the TimeWell account         */
/* ------------------------------------------------------------------ */

/**
 * The quiz's account step. Proxies to the TimeWell server's own /auth routes
 * server-side (no CORS, and the account server stays the only place passwords
 * are handled). An address that already has an account is signed in with the
 * password given instead, so someone who had the app first can still upgrade.
 * Returns only the account id and email — never the session token.
 */
export async function handleRegister(req, body) {
  const email = String(body?.email || '').trim().toLowerCase()
  const password = String(body?.password || '')
  if (!emailOk(email)) return { status: 400, json: { error: "That doesn't look like an email address." } }
  if (password.length < 8) return { status: 400, json: { error: 'Use at least 8 characters for your password.' } }

  const ip = visitorIp(req)
  const call = (path) =>
    fetch(`${TIMEWELL_API}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(FUNNEL_SHARED_SECRET && ip ? { 'X-Funnel-Key': FUNNEL_SHARED_SECRET, 'X-Funnel-Client-IP': ip } : {}),
      },
      body: JSON.stringify({ email, password }),
    })
  try {
    let res = await call('/auth/register')
    if (res.status === 409) {
      // Already registered: those credentials may simply be theirs — sign in instead.
      const signin = await call('/auth/signin')
      if (!signin.ok) {
        return { status: 409, json: { error: 'This email already has a TimeWell account. Enter its password to continue.' } }
      }
      res = signin
    }
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.account?.id) {
      return { status: 400, json: { error: data?.message || data?.error || 'Could not create your account.' } }
    }
    return { status: 200, json: { account: { id: String(data.account.id), email: data.account.email || email } } }
  } catch (e) {
    console.error('[register] account server unreachable:', e?.message || e)
    return { status: 502, json: { error: 'Could not reach the account server. Try again in a moment.' } }
  }
}

/* ------------------------------------------------------------------ */
/* /api/timewell/checkout — Stripe Embedded Checkout for TimeWell Pro           */
/* ------------------------------------------------------------------ */

async function findCustomer(s, userId, email) {
  try {
    const found = await s.customers.search({ query: `metadata['app_user_id']:'${userId.replace(/'/g, '')}'`, limit: 1 })
    if (found.data[0]) return found.data[0]
  } catch {
    /* search can lag a few seconds behind writes — fall through to email */
  }
  const byEmail = await s.customers.list({ email, limit: 1 })
  return byEmail.data[0] || null
}

export async function handleCheckout(req, body) {
  if (!checkoutConfigured()) return { status: 503, json: { error: "Payments aren't switched on yet." } }
  const userId = String(body?.userId || '').trim()
  const email = String(body?.email || '').trim().toLowerCase()
  if (!userId || !emailOk(email)) return { status: 400, json: { error: 'Create your account first.' } }

  const origin = `https://${req.headers['x-forwarded-host'] || req.headers.host}`
  const pixels = allowedPixels(body?.pixel_ids).join(',')
  // Kept on the subscription so the webhook can match day-7 Purchase to the ad click.
  const attribution = {
    fbp: clip(body?.fbp, 120),
    fbc: clip(body?.fbc, 300),
    ip: clip(visitorIp(req), 60),
    ua: clip(req.headers['user-agent'], 450),
    pixels: clip(pixels, 300),
    source_url: clip(body?.event_source_url, 450),
  }

  try {
    const acct = active()
    const s = acct.client
    let customer = await findCustomer(s, userId, email)
    if (customer) {
      if (customer.metadata?.app_user_id !== userId) {
        customer = await s.customers.update(customer.id, { metadata: { ...customer.metadata, app_user_id: userId } })
      }
    } else {
      customer = await s.customers.create({ email, metadata: { app_user_id: userId } })
    }

    // A second trial for someone who already had one is not on offer.
    const hadTrial = customer.metadata?.timewell_trial_used === '1'

    const session = await s.checkout.sessions.create(
      {
        mode: 'subscription',
        line_items: [{ price: acct.price, quantity: 1 }],
        customer: customer.id,
        client_reference_id: userId,
        metadata: { plan: 'pro_monthly', email, app_user_id: userId },
        subscription_data: {
          ...(hadTrial ? {} : { trial_period_days: TRIAL_DAYS }),
          metadata: { plan: 'pro_monthly', app_user_id: userId, ...attribution },
        },
        payment_method_collection: 'always',
        custom_text: {
          submit: {
            message: hadTrial
              ? `€${PRO_PRICE} per month, recurring, until you cancel. Cancel any time in the app.`
              : `Nothing to pay today. After ${TRIAL_DAYS} days your subscription renews at €${PRO_PRICE} per month until you cancel. Cancel before then and you pay nothing.`,
          },
        },
        ui_mode: EMBEDDED_UI_MODE,
        redirect_on_completion: 'if_required',
        payment_method_types: ['card'],
        return_url: `${origin}${QUIZ_PATH}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      },
      { apiVersion: EMBEDDED_API_VERSION },
    )
    return {
      status: 200,
      json: {
        clientSecret: session.client_secret, sessionId: session.id, publishableKey: acct.publishable,
        trial: !hadTrial, live: acct.mode === 'live',
      },
    }
  } catch (e) {
    console.error('[checkout] error:', e?.message || e)
    return { status: 500, json: { error: 'Could not start checkout.' } }
  }
}

/* ------------------------------------------------------------------ */
/* /api/timewell/stripe-webhook                                        */
/* ------------------------------------------------------------------ */
//
// Stripe → Developers → Webhooks → add endpoint https://fortunas.nl/api/timewell/stripe-webhook
// with events: checkout.session.completed, invoice.paid.
// Lean on purpose (Aurora's lesson): fire the event, answer 200 fast.

function eventFromSubscription(sub, extra) {
  const m = sub?.metadata || {}
  return {
    pixels: allowedPixels(m.pixels),
    userData: buildUserData({ email: extra.email, externalId: m.app_user_id, fbp: m.fbp, fbc: m.fbc, ip: m.ip, ua: m.ua }),
    sourceUrl: m.source_url || `https://fortunas.nl${QUIZ_PATH}`,
    userId: m.app_user_id,
    ip: m.ip,
    ua: m.ua,
  }
}

export async function handleStripeWebhook(req, rawBody) {
  // Try each account's secret: the sandbox and the live account both post here.
  const candidates = [ACCOUNTS.live, ACCOUNTS.test].filter((a) => a.client && a.webhookSecret)
  if (!candidates.length) return { status: 503, json: { error: 'not configured' } }
  let event = null
  let acct = null
  for (const a of candidates) {
    try {
      event = a.client.webhooks.constructEvent(rawBody, req.headers['stripe-signature'], a.webhookSecret)
      acct = a
      break
    } catch {
      /* not this account's signature — try the next */
    }
  }
  if (!event) {
    console.error('[stripe-webhook] bad signature')
    return { status: 400, json: { error: 'bad signature' } }
  }
  // Sandbox trials and purchases must not reach the real pixel and skew ad stats.
  const toMeta = event.livemode === true

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      if (session.mode !== 'subscription' || !session.subscription) return { status: 200, json: { ok: true } }
      const s = acct.client
      const sub = await s.subscriptions.retrieve(String(session.subscription))
      const email = session.customer_details?.email || session.metadata?.email || ''
      const ctx = eventFromSubscription(sub, { email })
      const trialing = sub.status === 'trialing'
      const id = `trial_${session.id}` // the browser fires StartTrial with this same id

      if (trialing && toMeta) {
        await sendMetaEvent(ctx.pixels, {
          event_name: 'StartTrial',
          event_time: Math.floor(Date.now() / 1000),
          action_source: 'website',
          event_id: id,
          event_source_url: ctx.sourceUrl,
          user_data: ctx.userData,
          custom_data: { value: 0, currency: CURRENCY, predicted_ltv: PRO_PRICE * 3 },
        })
        sendToTikTok({ eventName: 'StartTrial', eventId: id, email, userId: ctx.userId, ip: ctx.ip, ua: ctx.ua, eventSourceUrl: ctx.sourceUrl }).catch(() => {})
      }
      // One free trial per customer.
      if (session.customer) {
        await s.customers.update(String(session.customer), { metadata: { timewell_trial_used: '1' } }).catch(() => {})
      }
      return { status: 200, json: { ok: true } }
    }

    if (event.type === 'invoice.paid') {
      const inv = event.data.object
      const subId = inv.subscription || inv.parent?.subscription_details?.subscription
      if (!subId || !(inv.amount_paid > 0)) return { status: 200, json: { ok: true } } // the €0 trial invoice
      const s = acct.client
      const sub = await s.subscriptions.retrieve(String(subId))
      // Purchase is the FIRST real payment only; renewals are not new conversions.
      if (sub.metadata?.purchase_sent === '1') return { status: 200, json: { ok: true, skipped: 'already-sent' } }
      const ctx = eventFromSubscription(sub, { email: inv.customer_email || '' })
      const id = `purchase_${sub.id}` // stable: a webhook retry collapses into one event
      const value = inv.amount_paid / 100
      if (toMeta) await sendMetaEvent(ctx.pixels, {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        event_id: id,
        event_source_url: ctx.sourceUrl,
        user_data: ctx.userData,
        custom_data: { value, currency: String(inv.currency || 'eur').toUpperCase() },
      })
      if (toMeta) sendToTikTok({
        eventName: 'Purchase', eventId: id, email: inv.customer_email || '', userId: ctx.userId,
        ip: ctx.ip, ua: ctx.ua, eventSourceUrl: ctx.sourceUrl, value, currency: CURRENCY,
      }).catch(() => {})
      await s.subscriptions.update(sub.id, { metadata: { purchase_sent: '1' } }).catch(() => {})
      return { status: 200, json: { ok: true } }
    }
  } catch (e) {
    // Answer 200 anyway: a non-2xx makes Stripe retry, and the events above are
    // idempotent by id, but a handler stuck failing would block the queue.
    console.error('[stripe-webhook]', event.type, 'failed:', e?.message || e)
  }
  return { status: 200, json: { ok: true } }
}
