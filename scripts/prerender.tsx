import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { App } from '../src/App'
import { cityBySlug, routes, services, stateBySlug } from '../src/data'

const dist = join(process.cwd(), 'dist')
const template = await readFile(join(dist, 'index.html'), 'utf8')
const origin = 'https://portable-food-bank.com'
const updated = '2026-10-07'
const escape = (value: string) => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;')

function metadata(path: string) {
  if (path === '/') return { title: 'Mobile Kitchen Trailer Rentals | Portable Food Bank', description: 'Nationwide mobile kitchen trailer rentals for restaurant continuity during phased renovations, with dishwashing, refrigeration, and supporting facility options.' }
  if (path === '/service-areas/' || path === '/Locations.html') return { title: 'Nationwide Mobile Kitchen Trailer Rental Service Areas | Portable Food Bank', description: 'Browse 50 state guides and 246 city pages for mobile kitchen trailer pricing, planned delivery ranges, service hours, and availability.' }
  if (path === '/services/') return { title: 'Temporary Facility Rental Inventory | Portable Food Bank', description: 'Explore nine temporary facility categories led by mobile kitchens, dishwashing trailers, and refrigeration trailers.' }
  if (path === '/rental-calculator/') return { title: 'Mobile Kitchen Trailer Starting Price Estimator | Portable Food Bank', description: 'Build a location-specific mobile kitchen trailer starting estimate using published city pricing and planning ETA data.' }
  if (path === '/contact-us/') return { title: 'Request Mobile Kitchen Trailer Availability | Portable Food Bank', description: 'Prepare the project details needed for a location-specific mobile kitchen trailer rental plan and quote.' }
  const bits = path.split('/').filter(Boolean)
  const city = cityBySlug(bits.at(-1) || '')
  if (city) return { title: `${city.page_layout_data.title} | Portable Food Bank`, description: city.page_layout_data.description }
  if (path.startsWith('/service-areas/')) { const state = stateBySlug(bits.at(-1) || ''); if (state) return { title: `${state.page_title} | Portable Food Bank`, description: state.description } }
  const service = services.find((item) => item.slug === bits.at(-1))
  if (service) return { title: `${service.name} | Portable Food Bank`, description: service.description }
  return { title: 'Portable Food Bank | Mobile Kitchen Trailer Rentals', description: 'Plan temporary mobile kitchen capacity around phased renovations, repairs, and food-service changes.' }
}

for (const path of routes) {
  Object.defineProperty(globalThis, 'window', { value: { location: { pathname: path }, addEventListener() {}, removeEventListener() {}, scrollTo() {} }, configurable: true })
  Object.defineProperty(globalThis, 'history', { value: { pushState() {} }, configurable: true })
  const app = renderToString(<App/>).replace(/<link rel="preload" as="image"[^>]*\/>/g, '')
  const meta = metadata(path)
  const canonicalPath = path === '/Locations.html' ? '/service-areas/' : path
  const canonical = `${origin}${canonicalPath}`
  const organizationId = `${origin}/#organization`
  const websiteId = `${origin}/#website`
  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': organizationId,
        name: 'Portable Food Bank',
        url: `${origin}/`,
        logo: `${origin}/portable-food-bank-logo.png`,
        telephone: '+1-888-385-5513',
        areaServed: { '@type': 'Country', name: 'United States' },
      },
      {
        '@type': 'WebSite',
        '@id': websiteId,
        name: 'Portable Food Bank',
        url: `${origin}/`,
        publisher: { '@id': organizationId },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonical}#webpage`,
        name: meta.title,
        description: meta.description,
        url: canonical,
        isPartOf: { '@id': websiteId },
        about: { '@id': organizationId },
      },
    ],
  })
  const html = template
    .replace('<!--app-html-->', app)
    .replace(/<title>.*?<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escape(meta.description)}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escape(meta.title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escape(meta.description)}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonical}" />`)
    .replace(/<meta name="robots" content=".*?" \/>\s*/g, '')
    .replace(/<meta name="googlebot" content=".*?" \/>\s*/g, '')
    .replace('</head>', `<meta name="robots" content="index, follow" /><meta name="googlebot" content="index, follow" /><script type="application/ld+json">${schema}</script></head>`)
  const output = path === '/' ? join(dist, 'index.html') : path.endsWith('.html') ? join(dist, path.slice(1)) : join(dist, path.slice(1), 'index.html')
  await mkdir(dirname(output), { recursive: true })
  await writeFile(output, html)
}

const sitemapPaths = routes.filter((path) => !path.endsWith('.html') && !path.includes('/equipment-rental/') && path !== '/mobile-kitchen-trailer/' && path !== '/portable-dishwashing-trailer-rental/' && path !== '/services/shower-restroom-combination-trailers/')
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapPaths.map((path) => `  <url><loc>${origin}${path}</loc><lastmod>${updated}</lastmod></url>`).join('\n')}\n</urlset>\n`
await writeFile(join(dist, 'sitemap.xml'), sitemap)
await writeFile(join(process.cwd(), 'public', 'sitemap.xml'), sitemap)

const notFoundTemplate = template.replace('<!--app-html-->', renderToString(<App/>)).replace(/<title>.*?<\/title>/, '<title>Page not found | Portable Food Bank</title>')
  .replace(/<meta name="robots" content=".*?" \/>\s*/g, '')
  .replace(/<meta name="googlebot" content=".*?" \/>\s*/g, '')
  .replace(/<link rel="canonical" href=".*?" \/>/, '')
  .replace('</head>', '<meta name="robots" content="noindex, nofollow" /><meta name="googlebot" content="noindex, nofollow" /></head>')
await writeFile(join(dist, '404.html'), notFoundTemplate)
