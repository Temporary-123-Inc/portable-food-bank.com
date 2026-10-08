import { afterEach, describe, expect, it, vi } from 'vitest'
import { POST } from '../api/contact'

const validPayload = {
  url: '/contact-us/',
  name: 'Visitor name',
  email: 'visitor@example.com',
  phone: '5551234567',
  message: 'Visitor message',
  service: 'temporary-facilities',
  duration: 'under-1-month',
  industry: 'other',
  location: 'City, State',
  startDate: '2026-10-25',
  consent: true,
}

const request = (payload: object) => new Request('https://portable-food-bank.com/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: 'https://portable-food-bank.com' },
  body: JSON.stringify(payload),
})

describe('contact webhook endpoint', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    delete process.env.GLIDE_WEBHOOK_URL
    delete process.env.GLIDE_WEBHOOK_TOKEN
  })

  it('rejects incomplete or unconsented submissions', async () => {
    const response = await POST(request({ ...validPayload, consent: false }))
    expect(response.status).toBe(400)
  })

  it('forwards the approved payload to Glide with a canonical site URL', async () => {
    process.env.GLIDE_WEBHOOK_URL = 'https://go.glideapps.com/example'
    process.env.GLIDE_WEBHOOK_TOKEN = 'test-token'
    const outbound = vi.fn().mockResolvedValue(new Response(null, { status: 200 }))
    vi.stubGlobal('fetch', outbound)

    const response = await POST(request(validPayload))
    expect(response.status).toBe(200)
    expect(outbound).toHaveBeenCalledOnce()

    const [, options] = outbound.mock.calls[0]
    expect(options.headers.Authorization).toBe('Bearer test-token')
    expect(JSON.parse(options.body)).toEqual({ data: { ...validPayload, url: 'https://portable-food-bank.com/contact-us/' } })
  })
})
