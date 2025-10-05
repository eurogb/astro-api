// api/verdict/index.js  (Node 22.x serverless) — with logging and in-memory rate limiter
import { allow } from '../_rateLimit.js'

export default async function handler(req, res) {
  const start = Date.now()
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown'
  const method = req.method
  const url = req.url || '/api/verdict'

  try {
    console.log(`${method} ${url} from ${ip} — start`)

    if (!allow(ip)) {
      res.statusCode = 429
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'rate_limited' }))
    }

    if (req.method !== 'POST') {
      res.statusCode = 405
      return res.end('Method Not Allowed')
    }

    let body = null
    try {
      let data = ''
      req.on('data', chunk => data += chunk)
      await new Promise((r, rej) => req.on('end', r).on('error', rej))
      body = JSON.parse(data || 'null')
    } catch (e) {
      body = null
    }

    if (!Array.isArray(body)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'expected array' }))
    }

    const score = body.reduce((s, v) => s + (Number(v) || 0), 0)
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ ok: true, score }))

    const dur = Date.now() - start
    console.log(`${method} ${url} from ${ip} — ok score=${score} took=${dur}ms`)
  } catch (err) {
    const dur = Date.now() - start
    console.error(`${method} ${url} from ${ip} — error took=${dur}ms`, err && err.stack ? err.stack : String(err))
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'internal' }))
  }
}
