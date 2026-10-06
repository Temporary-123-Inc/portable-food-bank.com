import { describe, expect, it } from 'vitest'
import { cities, citiesForState, cityPath, routes, services, site, statePages } from '../src/data'

describe('authoritative site data', () => {
  it('includes all states, cities, and nine services', () => {
    expect(statePages).toHaveLength(50)
    expect(cities).toHaveLength(246)
    expect(services).toHaveLength(9)
  })
  it('links every state to every matching city slug', () => {
    for (const state of statePages) {
      const matching = citiesForState(state.state)
      expect(matching).toHaveLength(state.city_count)
      for (const city of matching) expect(routes).toContain(cityPath(city))
    }
  })
  it('keeps exact breadcrumb labels and city-specific facts', () => {
    for (const city of cities) {
      expect(city.page_layout_data.breadcrumb_labels).toEqual(['Home', 'Service Area Pages', city.state, city.representative_city])
      expect(city.page_layout_data.h1).toContain(city.representative_city)
      expect(city.page_layout_data.description.toLowerCase()).toContain(city.page_layout_data.delivery_time_range.display.toLowerCase())
      expect(city.page_layout_data.starting_price).toBe(city.prices_after_city_discount['20_ft'])
    }
  })
  it('never applies city discounts to refrigerator pricing', () => {
    expect(site.service_profile.pricing.temporary_refrigerator_trailer.size_prices).toEqual({ '20_ft': 2452, '25_ft': 2952, '30_ft': 3452, '35_ft': 3952, '40_ft': 4452 })
  })
  it('contains no bracketed placeholders', () => {
    const text = JSON.stringify(site)
    expect(text).not.toMatch(/\[(?:CONFIRM|DELIVERY|MINIMUM|SERVICE|EMERGENCY)[^\]]*\]/i)
  })
  it('assigns no incident source URL to two cities', () => {
    const urls = cities.flatMap((city) => city.page_layout_data.related_incident_articles.map((article) => article.source_url))
    expect(new Set(urls).size).toBe(urls.length)
  })
})
