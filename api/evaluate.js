export async function evaluateVerdict(c) {
  try {
    const body = await c.req.json().catch(e => { throw new Error('invalid-json:' + String(e)) })
    if (!Array.isArray(body)) return c.json({ error: 'expected array' }, 400)

    // Safe scoring fallback for debugging
    const score = body.reduce((s, v) => s + (Number(v) || 0), 0)
    return c.json({ ok: true, score })
  } catch (err) {
    console.error('evaluateVerdict unexpected error', err && err.stack ? err.stack : String(err))
    return c.json({ error: 'internal' }, 500)
  }
}
