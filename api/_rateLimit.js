/*
  Very small in-memory token-bucket per IP.
  Not distributed. Keeps state in process memory.
*/
const buckets = new Map()
const MAX_TOKENS = 20
const REFILL_PER_SEC = 1

function nowSec() { return Math.floor(Date.now() / 1000) }

export function allow(ip) {
  const t = nowSec()
  let b = buckets.get(ip)
  if (!b) {
    b = { tokens: MAX_TOKENS - 1, last: t }
    buckets.set(ip, b)
    return true
  }
  const dt = t - b.last
  if (dt > 0) {
    b.tokens = Math.min(MAX_TOKENS, b.tokens + dt * REFILL_PER_SEC)
    b.last = t
  }
  if (b.tokens <= 0) return false
  b.tokens -= 1
  return true
}
