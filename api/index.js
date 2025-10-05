import { Hono } from 'hono'
import { evaluateVerdict } from './evaluate.js'

const app = new Hono()

// 🛡️ CORS Middleware
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'POST, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, x-quiz-token')
  await next()
})

// 🧠 Verdict Route
app.post('/verdict', evaluateVerdict)

export default app
