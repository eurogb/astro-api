export async function evaluateVerdict(c) {
  const req = c.req
  const headers = req.header()
  const origin = headers.get('origin') || ''
  const referer = headers.get('referer') || ''
  const userAgent = headers.get('user-agent') || ''
  const token = headers.get('x-quiz-token') || ''
  const originHeader = origin || referer

  const allowedOrigins = ['https://yourdomain.com'] // update this list
  const isBot = !userAgent.includes('Mozilla') || originHeader === ''

  if (token !== 'samja-astro-2025') {
    return c.json({ error: 'Forbidden' }, 403)
  }

  if (isBot) {
    console.warn('🤖 Suspicious request detected:', {
      ip: headers.get('x-forwarded-for') || 'unknown',
      userAgent,
      originHeader,
    })
  }

  console.log('🔍 Request received:')
  console.log('IP:', headers.get('x-forwarded-for') || 'unknown')
  console.log('Token:', token)
  console.log('User-Agent:', userAgent)
  console.log('Origin:', originHeader)
  console.log('Timestamp:', new Date().toISOString())

  try {
    const rawBody = await req.text()
    const answers = JSON.parse(rawBody)

    if (!Array.isArray(answers)) throw new Error('Expected an array')

    const score = answers.length
    let verdict = ''
    if (score < 5) verdict = '🌑 Tiho šaptanje svemira prati tvoje korake.'
    else if (score < 10) verdict = '🌤 Zvijezde se pomiču — ostani otvoren/a.'
    else verdict = '🌟 Sudbina pleše u tvoju korist danas.'

    return c.json({ score, verdict }, 200)
  } catch (err) {
    return c.json({ error: 'Invalid input' }, 400)
  }
}
