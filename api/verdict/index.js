
import { Hono } from 'hono'
const app = new Hono()

app.post('/', async (c) => {
  try {
    return c.json({ ok: true, now: Date.now() })
  } catch (err) {
    // ensure any unexpected error is logged
    console.error('verdict handler top-level error', err)
    return c.json({ error: 'handler failure' }, 500)
  }
})

export const config = { runtime: 'edge' }
export default app
