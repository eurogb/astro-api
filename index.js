// Keep a small root entrypoint so Vercel detects Hono for bundling
import { Hono } from 'hono'

// Minimal handler to keep the file valid
export default function handler(req, res) {
  res.status(200).send('API-only project')
}
