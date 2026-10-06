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
  { slug: 'sleeper-trailers', name: 'Sleeper & bunkbed trailers', family: 'Supporting facility', image: '/images/sleeper.webp', description: 'Temporary sleeping facilities shown as a supporting category; final fit and availability are quote-based.' },
  { slug: 'laundry-trailers', name: 'Laundry trailers', family: 'Supporting facility', image: '/images/laundry.webp', description: 'Mobile laundry facilities that can support longer projects, subject to site review and availability.' },
  { slug: 'handwashing-trailers', name: 'Handwashing trailers', family: 'Supporting facility', image: '/images/handwashing.webp', description: 'Handwashing capacity that can be added when the approved site plan calls for a separate sanitation station.' }
] as const

export const serviceH1: Record<string, string> = {
  'mobile-kitchen-trailers': 'Mobile Kitchen Trailer Rentals for Temporary Commercial Food Service',
  'dishwashing-trailers': 'Commercial Dishwashing Trailer Rentals for Temporary Kitchen Operations',
  'refrigeration-trailers': 'Refrigerated Trailer Rentals for Temporary Commercial Cold Storage',
  'shower-trailers': 'Portable Shower Trailer Rentals for Temporary Site Facilities',
  'restroom-trailers': 'Mobile Restroom Trailer Rentals for Temporary Site Facilities',
  'shower-restroom-combinations': 'Shower and Restroom Combination Trailer Rentals for Temporary Sites',
  'sleeper-trailers': 'Sleeper and Bunkbed Trailer Rentals for Temporary Workforce Housing',
  'laundry-trailers': 'Mobile Laundry Trailer Rentals for Temporary Workforce Facilities',
  'handwashing-trailers': 'Portable Handwashing Trailer Rentals for Temporary Sanitation Stations'
}

export const trailerOptions: Record<string, string[]> = {
  'mobile-kitchen-trailers': ['24ft Mobile Kitchen', '26ft Baby Bulk Kitchen', '28ft Mobile Kitchen', '38ft Mobile Kitchen', '40ft Mobile Kitchen', '40ft Mobile Combo Kitchen', '40ft Bulk Kitchen', '40ft Bulk Combo Kitchen'],
  'dishwashing-trailers': ['22–26ft Low Temp Dish Trailer (Tier 1–4)', '30ft Conveyor Dishwashing Trailer', '38ft Low Temp Dish Trailer (Tier 1–4)', '38ft High Temp Conveyor Dishwashing Trailer'],
  'refrigeration-trailers': ['12ft Refrigerated Trailer (Tier 1–4)', '20ft Refrigerated Trailer (Tier 1–4)', '20ft Refrigerated Container (Tier 1–4)', '40ft Refrigerated Container (Tier 1–4)'],
  'shower-trailers': ['20ft Shower Container (5 Stalls)', '20ft Shower Trailer (10 Stalls) with Handwashing Sink'],
  'restroom-trailers': ['Restroom Trailer'],
  'shower-restroom-combinations': ['13ft Luxury Shower–Restroom Combination Trailer (3 Stalls)', '22ft Luxury Shower–Restroom Combination Trailer (6 Stalls)', '30ft Luxury Shower–Restroom Combination Trailer (8 Stalls)', '30ft Luxury Shower–Restroom Combination Trailer (10 Stalls)', 'Luxury Combination Trailer (3 Stalls + 1 ADA)', 'Luxury Combination Trailer (8 Stalls + 1 ADA)'],
  'sleeper-trailers': ['Sleeper Trailer (2 Stalls)', '20ft Contractor Accommodation', '20ft VIP Accommodation'],
  'laundry-trailers': ['30ft Laundry Trailer (10 Washer/Dryer)', '24ft Laundry Trailer', '26–27ft Laundry Trailer (8 Washer/Dryer)', '20ft Laundry Container'],
  'handwashing-trailers': ['Handwashing Sink Trailer']
}

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
