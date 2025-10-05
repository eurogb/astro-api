export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405
      return res.end('Method Not Allowed')
    }
    let body = null
    try { body = await new Promise((r, rej) => {
      let data = ''
      req.on('data', chunk => data += chunk)
      req.on('end', () => r(JSON.parse(data || 'null')))
      req.on('error', rej)
    }) } catch (e) { body = null }

    if (!Array.isArray(body)) {
      res.statusCode = 400
      res.setHeader('Content-Type', 'application/json')
      return res.end(JSON.stringify({ error: 'expected array' }))
    }

    const score = body.reduce((s, v) => s + (Number(v) || 0), 0)

    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ ok: true, score }))
  } catch (err) {
    console.error('verdict-node handler error', err && err.stack ? err.stack : String(err))
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    return res.end(JSON.stringify({ error: 'internal' }))
  }
}

// redeploy marker 2025-10-05T21:49:56Z
