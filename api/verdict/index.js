import { Hono } from 'hono'
const app = new Hono()

app.post('/', async (c) => {
  return c.json({ ok: true, now: Date.now() })
})

export const config = { runtime: 'edge' }
export default app
