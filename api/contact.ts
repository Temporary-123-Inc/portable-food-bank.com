type ContactRequest = {
  url?: unknown
  name?: unknown
  email?: unknown
  phone?: unknown
  message?: unknown
  service?: unknown
  duration?: unknown
  industry?: unknown
  location?: unknown
  startDate?: unknown
  consent?: unknown
  website?: unknown
}

const requiredEnvironment = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`Missing ${name}`)
  return value
}

const clean = (value: unknown, maximum: number) => typeof value === 'string' ? value.trim().slice(0, maximum) : ''

const canonicalUrl = (value: unknown) => {
  const candidate = clean(value, 500)
  try {
    const path = candidate.startsWith('/') ? candidate : new URL(candidate).pathname
    return new URL(path, 'https://portable-food-bank.com').toString()
  } catch {
    return 'https://portable-food-bank.com/contact-us/'
  }
}

const allowedOrigin = (request: Request) => {
  const origin = request.headers.get('origin')
  if (!origin) return true
  try {
    const hostname = new URL(origin).hostname
    return hostname === 'portable-food-bank.com' || hostname === 'www.portable-food-bank.com' || hostname === 'localhost' || hostname.endsWith('.vercel.app')
  } catch {
    return false
  }
}

export async function POST(request: Request) {
  if (!allowedOrigin(request)) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 })
  if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({ error: 'Expected a JSON request.' }, { status: 415 })

  let input: ContactRequest
  try {
    input = await request.json() as ContactRequest
  } catch {
    return Response.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  if (clean(input.website, 200)) return Response.json({ ok: true })

  const data = {
    url: canonicalUrl(input.url),
    name: clean(input.name, 120),
    email: clean(input.email, 254),
    phone: clean(input.phone, 40),
    message: clean(input.message, 4000),
    service: clean(input.service, 120),
    duration: clean(input.duration, 80),
    industry: clean(input.industry, 80),
    location: clean(input.location, 240),
    startDate: clean(input.startDate, 40),
    consent: input.consent === true,
  }

  if (!data.name || !data.email || !data.phone || !data.message || !data.service || !data.location || !data.consent) {
    return Response.json({ error: 'Please complete all required fields and accept the consent checkbox.' }, { status: 400 })
  }

  try {
    const response = await fetch(requiredEnvironment('GLIDE_WEBHOOK_URL'), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${requiredEnvironment('GLIDE_WEBHOOK_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    })

    if (!response.ok) {
      console.error('Glide webhook rejected contact submission', { status: response.status })
      return Response.json({ error: 'We could not send your request. Please call 888-385-5513.' }, { status: 502 })
    }

    return Response.json({ ok: true })
  } catch (error) {
    console.error('Glide webhook contact submission failed', error)
    return Response.json({ error: 'We could not send your request. Please call 888-385-5513.' }, { status: 502 })
  }
}
