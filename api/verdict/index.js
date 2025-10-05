// api/verdict/index.js  (Node 22.x serverless)
export default async function handler(req, res) {
  try {
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

    // Use same logic as verdict-node (safe, Node-compatible)
    const score = body.reduce((s, v) => s + (Number(v) || 0), 0)
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ ok: true, score }))
  } catch (err) {
    console.error('verdict node handler error', err && err.stack ? err.stack : String(err))
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'internal' }))
  }
}
