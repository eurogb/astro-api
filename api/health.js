export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405
    return res.end('Method Not Allowed')
  }
  res.setHeader('Content-Type', 'application/json')
  return res.end(JSON.stringify({ status: 'ok' }))
}
