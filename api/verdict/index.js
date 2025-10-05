import { Hono } from 'hono'
const app = new Hono()

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, x-quiz-token')
  await next()
})

app.post('/', async (c) => {
  try {
    const mod = await import('../evaluate.js')
    const fn = mod.evaluateVerdict || mod.default
    if (typeof fn !== 'function') {
      console.error('evaluate module missing function export', Object.keys(mod))
      return c.json({ error: 'evaluate module not available' }, 500)
    }
    return await fn(c)
  } catch (err) {
    console.error('verdict route error', err && err.stack ? err.stack : String(err))
    return c.json({ error: 'internal' }, 500)
  }
})

export const config = { runtime: 'edge' }
export default app
