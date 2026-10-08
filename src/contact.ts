export type ContactPayload = {
  url: string
  name: string
  email: string
  phone: string
  message: string
  service: string
  duration: string
  industry: string
  location: string
  startDate: string
  consent: boolean
  website?: string
}

export async function submitContact(payload: ContactPayload) {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null) as { error?: string } | null
  if (!response.ok) throw new Error(result?.error || 'We could not send your request. Please call 888-385-5513.')
}

export const pagePath = () => typeof window === 'undefined' ? '/contact-us/' : window.location.pathname

export const serviceKey = (value: string) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
