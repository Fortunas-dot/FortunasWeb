import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { handleCapi } from './capi.js'
import { handleCheckout, handleRegister, handleStripeWebhook } from './stripe.js'

// Production server for fortunas.nl on Railway (`npm start`).
//
// It does what the Aurora website gets from Next.js: serves the built site, gives
// the quizzes clean URLs with no-store headers, and runs the /api/capi events
// bridge. Plain Node, no dependencies.

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const PORT = Number(process.env.PORT) || 3000

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
}

// Quizzes are hand-edited static pages we ship often. Same rule as Aurora's
// funnels: no-store, so neither Cloudflare nor a browser cache can serve an
// older build of a quiz (and its pixel setup) after a deploy.
const NO_STORE = 'no-store, no-cache, max-age=0, must-revalidate'
const isQuiz = (file) => /[\\/]timewell[\\/]quiz\.html$/.test(file)

function cacheFor(file) {
  if (isQuiz(file)) return NO_STORE
  if (file.includes(`${path.sep}assets${path.sep}`) && /-[A-Za-z0-9_-]{8}\.(js|css)$/.test(file)) {
    return 'public, max-age=31536000, immutable' // Vite's hashed bundles
  }
  if (file.endsWith('.html')) return 'no-cache'
  return 'public, max-age=3600'
}

// /timewell/quiz → timewell/quiz.html, /x/ → x/index.html, else the file itself.
function resolveFile(urlPath) {
  let p
  try {
    p = decodeURIComponent(urlPath)
  } catch {
    return null
  }
  const base = path.normalize(path.join(ROOT, p))
  if (!base.startsWith(ROOT)) return null // no ../ escapes
  for (const candidate of [base, base + '.html', path.join(base, 'index.html')]) {
    try {
      if (fs.statSync(candidate).isFile()) return candidate
    } catch {
      /* try the next one */
    }
  }
  return null
}

function sendFile(res, file, status = 200) {
  res.writeHead(status, {
    'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': cacheFor(file),
    'X-Content-Type-Options': 'nosniff',
  })
  fs.createReadStream(file).pipe(res)
}

function sendJson(res, status, json, cookies = []) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  if (cookies.length) headers['Set-Cookie'] = cookies
  res.writeHead(status, headers)
  res.end(JSON.stringify(json))
}

function readRaw(req, limit) {
  return new Promise((resolve) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > limit) {
        resolve(null)
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', () => resolve(null))
  })
}

function readBody(req, limit = 32 * 1024) {
  return new Promise((resolve) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > limit) {
        resolve(null)
        req.destroy()
      } else chunks.push(c)
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(Buffer.concat(chunks).toString('utf8')))
      } catch {
        resolve(null)
      }
    })
    req.on('error', () => resolve(null))
  })
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', 'http://localhost')

  if (url.pathname === '/api/capi') {
    if (req.method !== 'POST') return sendJson(res, 405, { message: 'POST only' })
    const out = await handleCapi(req, await readBody(req))
    return sendJson(res, out.status, out.json, out.cookies)
  }
  // TimeWell Pro checkout. Namespaced per app: each company on this site has its own Stripe account.
  if (url.pathname === '/api/timewell/register' || url.pathname === '/api/timewell/checkout') {
    if (req.method !== 'POST') return sendJson(res, 405, { message: 'POST only' })
    const body = await readBody(req)
    const out = url.pathname === '/api/timewell/register' ? await handleRegister(req, body) : await handleCheckout(req, body)
    return sendJson(res, out.status, out.json)
  }
  if (url.pathname === '/api/timewell/stripe-webhook') {
    if (req.method !== 'POST') return sendJson(res, 405, { message: 'POST only' })
    // Stripe signs the exact bytes, so the body is read raw, never parsed first.
    const raw = await readRaw(req, 512 * 1024)
    if (!raw) return sendJson(res, 400, { message: 'Invalid body' })
    const out = await handleStripeWebhook(req, raw)
    return sendJson(res, out.status, out.json)
  }
  if (url.pathname.startsWith('/api/')) return sendJson(res, 404, { message: 'Not found' })
  if (req.method !== 'GET' && req.method !== 'HEAD') return sendJson(res, 405, { message: 'Method not allowed' })

  const file = resolveFile(url.pathname)
  if (file) return sendFile(res, file)
  // Everything else is a client-side route of the React app.
  return sendFile(res, path.join(ROOT, 'index.html'))
})

server.listen(PORT, () => {
  console.log(`[fortunas-web] serving ${ROOT} on :${PORT}`)
  if (!process.env.META_CAPI_ACCESS_TOKEN) {
    console.log('[fortunas-web] META_CAPI_ACCESS_TOKEN not set — /api/capi will skip Meta')
  }
})
