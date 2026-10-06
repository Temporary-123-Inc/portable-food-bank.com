import raw from './data/site-39.json'

export type Article = { title: string; date: string; source_url: string }
export type City = {
  state: string
  representative_city: string
  city_slug: string
  availability_note: string
  prices_before_city_discount: Record<string, number>
  prices_after_city_discount: Record<string, number>
  page_layout_data: {
    slug: string
    title: string
    h1: string
    description: string
    breadcrumb_labels: string[]
    availability_label: string
    starting_price: number
    starting_price_basis: string
    delivery_time_range: { display: string }
    estimated_delivery_display: string
    delivery_distance: { display: string; basis: string }
    service_hours: string
    inventory_family: string
    related_incident_articles: Article[]
    nearby_service_areas: string[]
    rental_information: Record<string, string>
  }
}

export type StatePage = {
  state: string
  page_title: string
  h1: string
  description: string
  starting_price: number
  city_count: number
}

export const site = raw
export const cities = raw.service_area_data as City[]
export const statePages = raw.location_data.state_pages as StatePage[]
export const slugify = (value: string) => value.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
export const stateBySlug = (slug: string) => statePages.find((item) => slugify(item.state) === slug)
export const cityBySlug = (slug: string) => cities.find((item) => item.page_layout_data.slug === slug)
export const citiesForState = (state: string) => cities.filter((item) => item.state === state)
export const cityPath = (city: City) => `/${slugify(city.state)}/${city.page_layout_data.slug}/`
export const statePath = (state: string) => `/service-areas/${slugify(state)}/`

export const services = [
  { slug: 'mobile-kitchen-trailers', name: 'Mobile kitchen trailers', family: 'Kitchen family', image: '/images/mobile-kitchen.webp', description: 'A commercial cooking workspace for restaurant continuity, led by a stove, oven, essential cooking utensils, preparation space, and an approved equipment package.' },
  { slug: 'dishwashing-trailers', name: 'Dishwashing trailers', family: 'Kitchen family', image: '/images/dishwashing.webp', description: 'Commercial dishwashing capacity with connections and drainage reviewed during site preparation.' },
  { slug: 'refrigeration-trailers', name: 'Refrigeration trailers', family: 'Kitchen family', image: '/images/refrigeration.webp', description: 'Separate temporary cold storage with site-wide pricing that is not reduced by city ETA discounts.' },
  { slug: 'shower-trailers', name: 'Shower trailers', family: 'Supporting facility', image: '/images/shower.webp', description: 'A supporting hygiene facility available by request, with configuration and site requirements confirmed in the quote.' },
  { slug: 'restroom-trailers', name: 'Restroom trailers', family: 'Supporting facility', image: '/images/restroom.webp', description: 'Temporary bathroom facilities available by request for sites that need support beyond the kitchen family.' },
  { slug: 'shower-restroom-combinations', name: 'Shower & restroom combinations', family: 'Supporting facility', image: '/images/shower-restroom.webp', description: 'Combined bathroom and shower facilities reviewed against the project site, access, utilities, and availability.' },
  { slug: 'sleeper-trailers', name: 'Sleeper & bunkbed trailers', family: 'Supporting facility', image: '/images/sleeper.png', description: 'Temporary sleeping facilities shown as a supporting category; final fit and availability are quote-based.' },
  { slug: 'laundry-trailers', name: 'Laundry trailers', family: 'Supporting facility', image: '/images/laundry.webp', description: 'Mobile laundry facilities that can support longer projects, subject to site review and availability.' },
  { slug: 'handwashing-trailers', name: 'Handwashing trailers', family: 'Supporting facility', image: '/images/handwashing.webp', description: 'Handwashing capacity that can be added when the approved site plan calls for a separate sanitation station.' }
] as const

export const kitchenPrices = raw.service_profile.pricing.size_surcharges
export const refrigeratorPrices = raw.service_profile.pricing.temporary_refrigerator_trailer.size_prices

export const coreRoutes = ['/', '/services/', '/service-areas/', '/rental-calculator/', '/about-us/', '/contact-us/', '/blog/', '/privacy/']
export const serviceRoutes = services.map((service) => `/services/${service.slug}/`)
export const stateRoutes = statePages.map((state) => statePath(state.state))
export const cityRoutes = cities.map(cityPath)
export const legacyRoutes = [
  '/Locations.html', '/mobile-kitchen-trailer/', '/equipment-rental/mobile-kitchen-trailers/', '/portable-dishwashing-trailer-rental/',
  '/equipment-rental/refrigeration/', '/equipment-rental/shower-trailer/', '/equipment-rental/restroom-trailers/',
  '/services/shower-restroom-combination-trailers/', '/equipment-rental/mobile-sleep-trailers/',
  '/equipment-rental/laundry-trailers/', '/equipment-rental/handwashing-stations/'
]
export const routes = [...coreRoutes, ...serviceRoutes, ...stateRoutes, ...cityRoutes, ...legacyRoutes]
