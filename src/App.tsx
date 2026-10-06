import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, ChevronDown, ChevronLeft, ChevronRight, Clock3, MapPin, Menu, PhoneCall, Ruler, ShieldCheck, X } from 'lucide-react'
import { cities, citiesForState, cityBySlug, cityPath, refrigeratorPrices, services, site, slugify, stateBySlug, statePages, statePath, type City } from './data'

const money = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
const currentPath = () => typeof window === 'undefined' ? '/' : window.location.pathname

function Link({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (!href.startsWith('/') || event.metaKey || event.ctrlKey) return
    event.preventDefault(); history.pushState({}, '', href); window.dispatchEvent(new Event('popstate')); window.scrollTo(0, 0)
  }
  return <a href={href} onClick={onClick} className={className}>{children}</a>
}

function Header() {
  const [open, setOpen] = useState(false)
  return <>
    <a className="skip" href="#main">Skip to content</a>
    <div className="utility"><div className="shell utility-inner"><span><ShieldCheck size={15}/> Nationwide planning</span><span><a href="tel:+18883855513" aria-label="Call Portable Food Bank at 888-385-5513"><PhoneCall size={15}/> 888-385-5513</a></span></div></div>
    <header className="header"><div className="shell nav-wrap">
      <Link href="/" className="brand" aria-label="Portable Food Bank home"><img src="/portable-food-bank-logo.png" alt="Portable Food Bank" width="203" height="172"/></Link>
      <nav aria-label="Main navigation" className={open ? 'nav open' : 'nav'}>
        <Link href="/services/">Inventory</Link><Link href="/service-areas/">Service areas</Link><Link href="/rental-calculator/">Estimator</Link><Link href="/about-us/">How it works</Link><Link href="/contact-us/" className="nav-cta">Request availability <ArrowRight size={17}/></Link>
      </nav>
      <button className="menu" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
    </div></header>
  </>
}

function Footer() {
  return <footer><div className="shell footer-grid"><div><Link href="/" className="brand footer-brand" aria-label="Portable Food Bank home"><img src="/portable-food-bank-logo.png" alt="Portable Food Bank" width="203" height="172"/></Link><p>Temporary mobile kitchen facilities planned around restaurant renovations, repairs, and changing operating needs.</p></div><div><h3>Explore</h3><Link href="/services/">All nine facilities</Link><Link href="/service-areas/">Service areas</Link><Link href="/rental-calculator/">Starting estimator</Link></div><div><h3>Plan</h3><Link href="/about-us/">Rental process</Link><Link href="/contact-us/">Request availability</Link><Link href="/privacy/">Privacy</Link></div><div><h3>Call us</h3><a className="footer-phone" href="tel:+18883855513">888-385-5513</a><p>Pricing, route timing, site fit, configuration, and final availability are confirmed through the company quote.</p></div></div><div className="shell copyright">© 2026 Portable Food Bank. All rights reserved.</div></footer>
}

function Layout({ children }: { children: React.ReactNode }) { return <><Header/><main id="main">{children}</main><Footer/></> }

function Breadcrumbs({ labels, hrefs }: { labels: string[]; hrefs: string[] }) {
  return <nav className="breadcrumbs shell" aria-label="Breadcrumb"><ol>{labels.map((label, index) => <li key={label}>{index < labels.length - 1 ? <Link href={hrefs[index]}>{label}</Link> : <span aria-current="page">{label}</span>}</li>)}</ol></nav>
}

function Carousel({ label = 'Kitchen family inventory' }: { label?: string }) {
  const images = services.slice(0, 3)
  const [active, setActive] = useState(0)
  return <div className="carousel" aria-label={label}><img src={images[active].image} alt={`${images[active].name} available in the temporary kitchen facility family`} width="900" height="620"/><div className="carousel-caption"><span>{String(active + 1).padStart(2, '0')} / 03</span><strong>{images[active].name}</strong><div><button aria-label="Previous inventory image" onClick={() => setActive((active + images.length - 1) % images.length)}><ChevronLeft/></button><button aria-label="Next inventory image" onClick={() => setActive((active + 1) % images.length)}><ChevronRight/></button></div></div></div>
}

function Hero({ h1, description, price, eta, availability, variation = 0 }: { h1: string; description: string; price: number; eta: string; availability: string; variation?: number }) {
  return <section className={`hero variation-${variation + 1}`}><div className="shell hero-grid"><div className="hero-copy"><span className="eyebrow">Mobile kitchen continuity planning</span><h1>{h1}</h1><p>{description}</p><div className="hero-actions"><Link className="button primary" href="/contact-us/">Request availability <ArrowRight/></Link><Link className="text-link" href="/rental-calculator/">Build a starting estimate</Link></div></div><div className="hero-side"><div className="status-row"><span className="status"><i/> {availability}</span></div><div className="metric-grid"><div><small>Starting at</small><strong>{money(price)}</strong><span>20 ft kitchen</span></div><div><small>Planning ETA</small><strong>{eta}</strong><span>route-dependent</span></div></div><Carousel/></div></div></section>
}

function ServicesGrid() {
  const [filter, setFilter] = useState('all')
  const visible = services.filter((service) => filter === 'all' || (filter === 'kitchen' ? service.family === 'Kitchen family' : service.family !== 'Kitchen family'))
  return <section className="section inventory" id="inventory"><div className="shell"><div className="section-head"><div><span className="eyebrow">Nine connected facility types</span><h2>Start with the kitchen. Keep the whole site in view.</h2></div><p>Mobile kitchens lead the plan. Dishwashing and refrigeration complete the kitchen family; bathroom, hygiene, sleeping, and laundry facilities stay available as supporting categories.</p></div><div className="filters" aria-label="Filter rental services"><button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All facilities <span>9</span></button><button className={filter === 'kitchen' ? 'active' : ''} onClick={() => setFilter('kitchen')}>Kitchen family <span>3</span></button><button className={filter === 'support' ? 'active' : ''} onClick={() => setFilter('support')}>Supporting <span>6</span></button></div><div className="service-grid">{visible.map((service, index) => <article className={`service-card ${index === 0 ? 'featured' : ''}`} key={service.slug}><Link href={`/services/${service.slug}/`}><div className="image-wrap"><img src={service.image} alt={service.name} loading={index > 2 ? 'lazy' : undefined} width="700" height="500"/></div><span className="card-kicker">{service.family}</span><h3>{service.name}</h3><p>{service.description}</p><span className="card-link">Explore this facility <ArrowRight/></span></Link></article>)}</div></div></section>
}

function Process() {
  return <section className="section process"><div className="shell process-grid"><div className="sticky-title"><span className="eyebrow">A phased renovation plan</span><h2>Keep service moving while the permanent kitchen changes.</h2><p>{site.company_profile.description}</p><Link className="button dark" href="/contact-us/">Plan kitchen capacity</Link></div><ol>{site.rental_process.map((step) => <li key={step.step}><span>{String(step.step).padStart(2, '0')}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></div></section>
}

function PriceTable({ city }: { city?: City }) {
  const kitchen = city?.prices_after_city_discount ?? Object.fromEntries(Object.entries(site.service_profile.pricing.size_surcharges).map(([size, surcharge]) => [size, site.service_profile.pricing.fixed_base_price + surcharge]))
  return <section className="section pricing"><div className="shell"><div className="section-head"><div><span className="eyebrow">Published starting estimates</span><h2>Size the kitchen, then add cold storage if needed.</h2></div><p>Kitchen prices below use {city ? `${city.representative_city}'s city-specific discount` : 'site-wide pricing before city-specific adjustments'}. Refrigerator pricing remains site-wide and does not receive a city ETA discount.</p></div><div className="price-table" role="table" aria-label="Kitchen and refrigerator starting prices"><div className="price-row head" role="row"><span>Length</span><span>Kitchen</span><span>Refrigerator</span></div>{Object.keys(kitchen).map((size) => <div className="price-row" role="row" key={size}><strong>{size.replace('_', ' ')}</strong><span>{money(kitchen[size])}</span><span>{money((refrigeratorPrices as Record<string, number>)[size])}</span></div>)}</div><p className="fine-print">{site.service_profile.pricing.delivery_fee}</p></div></section>
}

function CoveragePreview() {
  return <section className="section coverage"><div className="shell coverage-grid"><div><span className="eyebrow">Nationwide service area guides</span><h2>Find planning details for your location.</h2><p>Browse all 50 state guides and {cities.length} city pages. Each city keeps its own assigned price, ETA, service hours, incident reference, and nearby service areas.</p><Link className="button primary" href="/service-areas/">Browse all service areas</Link></div><div className="state-cloud">{statePages.slice(0, 18).map((state) => <Link href={statePath(state.state)} key={state.state}>{state.state}<span>{state.city_count} {state.city_count === 1 ? 'city' : 'cities'}</span></Link>)}</div></div></section>
}

function FAQ({ items = site.faqs }: { items?: { question: string; answer: string }[] }) {
  return <section className="section faq"><div className="shell faq-grid"><div><span className="eyebrow">Planning questions</span><h2>Make the first request more useful.</h2><p>Final fit depends on the project timeline, utility plan, placement, access, approvals, and current availability.</p></div><div>{items.map((item) => <details key={item.question}><summary>{item.question}<ChevronDown/></summary><p>{item.answer}</p></details>)}</div></div></section>
}

function FinalCTA() { return <section className="final-cta"><div className="shell"><span className="eyebrow">Plan the next operating phase</span><h2>One request. A clearer temporary kitchen plan.</h2><p>Share the project location, renovation milestones, dates, menu, utilities, and the kitchen functions that need to stay online.</p><Link className="button light" href="/contact-us/">Request availability <ArrowRight/></Link></div></section> }

function Home() {
  return <Layout><Hero h1="Mobile kitchens built around your renovation schedule." description={site.service_profile.service_description} price={site.service_profile.pricing.starting_price} eta="Location-based" availability="Available by request" variation={3}/><ServicesGrid/><Calculator compact/><Process/><PriceTable/><CoveragePreview/><FAQ/><FinalCTA/></Layout>
}

function Calculator({ compact = false }: { compact?: boolean }) {
  const [stateName, setStateName] = useState('')
  const stateCities = useMemo(() => stateName ? citiesForState(stateName) : [], [stateName])
  const [citySlug, setCitySlug] = useState('')
  const [size, setSize] = useState('20_ft')
  const selected = cityBySlug(citySlug)
  const kitchenPrice = selected ? selected.prices_after_city_discount[size] : site.service_profile.pricing.fixed_base_price + (site.service_profile.pricing.size_surcharges as Record<string, number>)[size]
  const content = <section className={compact ? 'section calculator compact' : 'section calculator'}><div className="shell calculator-grid"><div><span className="eyebrow">Starting estimate</span><h2>Build a location-aware kitchen estimate.</h2><p>Select a state, city, and trailer length to view the JSON-backed starting kitchen price. Final quotes include route, setup, site, and availability review.</p><div className="form-grid"><label>State<select value={stateName} onChange={(event) => { setStateName(event.target.value); setCitySlug('') }}><option value="">Choose a state</option>{statePages.map((state) => <option key={state.state}>{state.state}</option>)}</select></label><label>City<select disabled={!stateName} value={citySlug} onChange={(event) => setCitySlug(event.target.value)}><option value="">Choose a city</option>{stateCities.map((city) => <option key={city.city_slug} value={city.city_slug}>{city.representative_city}</option>)}</select></label><label>Kitchen length<select value={size} onChange={(event) => setSize(event.target.value)}>{Object.keys(site.service_profile.pricing.size_surcharges).map((key) => <option value={key} key={key}>{key.replace('_', ' ')}</option>)}</select></label></div></div><aside className="estimate"><small>Preliminary kitchen total</small><strong>{money(kitchenPrice)}</strong><dl><div><dt>Location</dt><dd>{selected ? `${selected.representative_city}, ${selected.state}` : 'Site-wide starting estimate'}</dd></div><div><dt>Planning ETA</dt><dd>{selected?.page_layout_data.delivery_time_range.display ?? 'Select a city'}</dd></div><div><dt>Availability</dt><dd>{selected?.page_layout_data.availability_label ?? 'Confirmed with quote'}</dd></div></dl><Link className="button primary" href="/contact-us/">Request an exact quote</Link></aside></div></section>
  return compact ? content : <Layout><PageIntro eyebrow="Rental estimator" title="Start with the published numbers." text="Use city-specific data for a preliminary kitchen estimate, then request a quote for final delivery, setup, configuration, and availability."/>{content}<PriceTable/><FinalCTA/></Layout>
}

function PageIntro({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <section className="page-intro"><div className="shell"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div></section> }

function ServiceAreas() {
  return <Layout><PageIntro eyebrow="50 state guides · 246 city guides" title="Service areas built for location-specific planning." text="Every state page links to all of its cities, and every city guide preserves its own pricing, ETA, availability, service hours, article, and nearby-area data."/><section className="section"><div className="shell all-states">{statePages.map((state) => <article key={state.state}><Link href={statePath(state.state)}><span>{String(state.city_count).padStart(2, '0')} cities</span><h2>{state.state}</h2><p>Temporary mobile kitchen trailer rental</p><b>Open state guide <ArrowRight/></b></Link></article>)}</div></section><FinalCTA/></Layout>
}

function StatePage({ stateSlug }: { stateSlug: string }) {
  const state = stateBySlug(stateSlug)
  if (!state) return <NotFound/>
  const stateCities = citiesForState(state.state)
  return <Layout><Breadcrumbs labels={['Home', 'Service Area Pages', state.state]} hrefs={['/', '/service-areas/', statePath(state.state)]}/><Hero h1={state.h1} description={state.description} price={state.starting_price} eta="City-specific" availability="Available by request" variation={statePages.findIndex((item) => item.state === state.state) % 4}/><section className="section"><div className="shell"><div className="section-head"><div><span className="eyebrow">Every published city in {state.state}</span><h2>Choose a local planning guide.</h2></div><p>{stateCities.length} city {stateCities.length === 1 ? 'page is' : 'pages are'} available with city-specific pricing and delivery planning ranges.</p></div><div className="city-grid">{stateCities.map((city) => <Link href={cityPath(city)} key={city.city_slug}><span><MapPin/> {city.representative_city}, {city.state}</span><strong>{money(city.page_layout_data.starting_price)} start</strong><small>{city.page_layout_data.delivery_time_range.display} planning ETA</small><ArrowRight/></Link>)}</div></div></section><PriceTable/><FAQ/><FinalCTA/></Layout>
}

function CityPage({ city }: { city: City }) {
  const p = city.page_layout_data
  const stateSlug = slugify(city.state)
  const index = cities.findIndex((item) => item.city_slug === city.city_slug)
  return <Layout><Breadcrumbs labels={p.breadcrumb_labels} hrefs={['/', '/service-areas/', `/service-areas/${stateSlug}/`, cityPath(city)]}/><Hero h1={p.h1} description={p.description} price={p.starting_price} eta={p.delivery_time_range.display} availability={p.availability_label} variation={index % 4}/><section className="section location-facts"><div className="shell facts"><div><Clock3/><small>Service hours</small><strong>{p.service_hours}</strong></div><div><Ruler/><small>Planning distance</small><strong>{p.delivery_distance.display}</strong></div><div><MapPin/><small>Inventory family</small><strong>{p.inventory_family}</strong></div></div></section><Process/><EquipmentPlan/><PriceTable city={city}/><RentalInfo city={city}/>{p.related_incident_articles.length > 0 && <Incident city={city}/>}<Nearby city={city}/><FAQ/><FinalCTA/></Layout>
}

function EquipmentPlan() {
  const e = site.service_profile.equipment
  return <section className="section equipment-plan"><div className="shell"><div className="section-head"><div><span className="eyebrow">Preparation · cooking · utilities</span><h2>The kitchen is a working system, not just a trailer.</h2></div><p>{site.inventory.family_definition}</p></div><div className="plan-grid"><article><h3>Cooking & preparation</h3><p>{e.cooking[0]}</p><p>{e.preparation[0]}</p></article><article><h3>Sanitation & dishwashing</h3><p>{e.sanitation[0]}</p><p>{site.service_profile.sanitation_plan.confirmation_note}</p></article><article><h3>Utilities & site access</h3><p>{e.utilities[0]}</p></article><article><h3>Refrigeration & storage</h3><p>{e.refrigeration[0]}</p><p>{e.storage[0]}</p></article></div></div></section>
}

function RentalInfo({ city }: { city: City }) {
  const info = city.page_layout_data.rental_information
  return <section className="section rental-info"><div className="shell two-col"><div><span className="eyebrow">Rental information</span><h2>What the quote confirms.</h2><p>{city.availability_note}</p></div><dl>{Object.entries(info).map(([key, value]) => <div key={key}><dt>{key.replaceAll('_', ' ')}</dt><dd>{value}</dd></div>)}</dl></div></section>
}

function Incident({ city }: { city: City }) {
  const article = city.page_layout_data.related_incident_articles[0]
  return <section className="section incident"><div className="shell incident-inner"><div><span className="eyebrow">Local continuity context</span><h2>Why temporary capacity belongs in a recovery plan.</h2><p>This city-specific source is provided as planning context only. It does not claim that the organization named in the article used this rental service.</p></div><article><time dateTime={article.date}>{new Date(`${article.date}T00:00:00`).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time><h3>{article.title}</h3><a href={article.source_url} target="_blank" rel="noreferrer">Read the assigned source <ArrowRight/></a></article></div></section>
}

function Nearby({ city }: { city: City }) {
  return <section className="section nearby"><div className="shell"><span className="eyebrow">Related service-area guides</span><h2>Continue planning nearby.</h2><div className="nearby-links">{city.page_layout_data.nearby_service_areas.map((label) => { const linked = cities.find((item) => `${item.representative_city}, ${item.state}` === label); return linked ? <Link href={cityPath(linked)} key={label}>{label}<ArrowRight/></Link> : null })}</div></div></section>
}

function ServicesPage() { return <Layout><PageIntro eyebrow="Shared facility inventory" title="Nine facilities. One kitchen-first plan." text="Begin with cooking continuity, add dishwashing and refrigeration, then review bathroom and other supporting facility needs for the same site."/><ServicesGrid/><EquipmentPlan/><PriceTable/><FinalCTA/></Layout> }

function ServicePage({ slug }: { slug: string }) {
  const service = services.find((item) => item.slug === slug)
  if (!service) return <NotFound/>
  const isKitchen = service.family === 'Kitchen family'
  return <Layout><Breadcrumbs labels={['Home', 'Inventory', service.name]} hrefs={['/', '/services/', `/services/${service.slug}/`]}/><section className="service-hero"><div className="shell service-hero-grid"><div><span className="eyebrow">{service.family}</span><h1>{service.name}</h1><p>{service.description}</p><Link className="button primary" href="/contact-us/">Request availability <ArrowRight/></Link></div><img src={service.image} alt={service.name} width="900" height="620"/></div></section>{isKitchen ? <><EquipmentPlan/><PriceTable/></> : <section className="section"><div className="shell narrow"><h2>Plan this facility around the whole site.</h2><p>Configuration, utilities, placement, access, rental term, and availability are reviewed with the company quote. This supporting category does not replace the JSON-defined kitchen, dishwasher, and refrigerator family.</p></div></section>}<ServicesGrid/><FinalCTA/></Layout>
}

function Contact() {
  const [sent, setSent] = useState(false)
  return <Layout><PageIntro eyebrow="Availability request" title="Bring the renovation timeline. We’ll shape the questions." text="Use this planning worksheet to gather the details needed for a location-specific quote, or call 888-385-5513. No request is transmitted from this static preview."/><section className="section"><div className="shell contact-grid"><form onSubmit={(event) => { event.preventDefault(); setSent(true) }}><label>Name<input required name="name" autoComplete="name"/></label><label>Email<input required type="email" name="email" autoComplete="email"/></label><label>Project location<input required name="location"/></label><label>Project dates<input name="dates" placeholder="Start and target return"/></label><label className="wide">What needs to stay operating?<textarea required name="details" rows={6}/></label><button className="button primary" type="submit">Prepare planning summary <ArrowRight/></button>{sent && <p className="success" role="status"><Check/> Your planning fields are complete. Contact delivery is not configured in this static build, so no information was sent.</p>}</form><aside><span className="eyebrow">Call for availability</span><a className="contact-phone" href="tel:+18883855513"><PhoneCall/> 888-385-5513</a><h2>Help the quote team see the whole phase.</h2><ul>{['Renovation milestone dates','Offline kitchen functions','Expected meal volume and menu','Placement and delivery access','Power, water, drainage, and fuel','Dishwashing, refrigeration, or bathroom needs'].map((item) => <li key={item}><Check/> {item}</li>)}</ul></aside></div></section></Layout>
}

function About() { return <Layout><PageIntro eyebrow="Restaurant continuity during phased renovation" title="Temporary capacity that follows the work plan." text={site.company_profile.description}/><Process/><EquipmentPlan/><FAQ/><FinalCTA/></Layout> }
function Privacy() { return <Layout><PageIntro eyebrow="Privacy" title="Privacy notice" text="This website does not transmit quote details in the static build. If online request handling is added, the live policy should be updated before collection begins."/><section className="section"><div className="shell narrow"><h2>Information handling</h2><p>The planning estimator operates in the browser. It does not create an account or send the entered selection to a server. External article links open their original publisher sites, whose own privacy terms apply.</p></div></section></Layout> }
function Blog() { const article = site.site_identity_articles[0]; return <Layout><PageIntro eyebrow="Planning context" title="Kitchen continuity notes." text="Use case guidance for operators coordinating temporary food-service capacity around phased renovations and unexpected interruptions."/><section className="section"><div className="shell article-feature"><time dateTime={article.date}>{article.date}</time><h2>{article.title}</h2><p>{article.rental_relevance}</p><a href={article.source_url} target="_blank" rel="noreferrer">Read the source article <ArrowRight/></a></div></section><FinalCTA/></Layout> }
function NotFound() { return <Layout><PageIntro eyebrow="404" title="This route is not in the published plan." text="Return to the service area directory or browse the current rental inventory."/><section className="section"><div className="shell"><Link className="button primary" href="/service-areas/">Browse service areas</Link></div></section></Layout> }

const aliases: Record<string, string> = {
  '/mobile-kitchen-trailer/': 'mobile-kitchen-trailers', '/equipment-rental/mobile-kitchen-trailers/': 'mobile-kitchen-trailers', '/portable-dishwashing-trailer-rental/': 'dishwashing-trailers', '/equipment-rental/refrigeration/': 'refrigeration-trailers', '/equipment-rental/shower-trailer/': 'shower-trailers', '/equipment-rental/restroom-trailers/': 'restroom-trailers', '/services/shower-restroom-combination-trailers/': 'shower-restroom-combinations', '/equipment-rental/mobile-sleep-trailers/': 'sleeper-trailers', '/equipment-rental/laundry-trailers/': 'laundry-trailers', '/equipment-rental/handwashing-stations/': 'handwashing-trailers'
}

export function App() {
  const [path, setPath] = useState(currentPath)
  useEffect(() => { const update = () => setPath(currentPath()); addEventListener('popstate', update); return () => removeEventListener('popstate', update) }, [])
  const normalized = path.endsWith('/') || path.endsWith('.html') ? path : `${path}/`
  if (normalized === '/') return <Home/>
  if (normalized === '/Locations.html' || normalized === '/service-areas/') return <ServiceAreas/>
  if (normalized === '/services/') return <ServicesPage/>
  if (normalized === '/rental-calculator/') return <Calculator/>
  if (normalized === '/contact-us/') return <Contact/>
  if (normalized === '/about-us/') return <About/>
  if (normalized === '/privacy/') return <Privacy/>
  if (normalized === '/blog/') return <Blog/>
  if (aliases[normalized]) return <ServicePage slug={aliases[normalized]}/>
  const serviceMatch = normalized.match(/^\/services\/([^/]+)\/$/)
  if (serviceMatch) return <ServicePage slug={serviceMatch[1]}/>
  const stateMatch = normalized.match(/^\/service-areas\/([^/]+)\/$/)
  if (stateMatch) return <StatePage stateSlug={stateMatch[1]}/>
  const cityMatch = normalized.match(/^\/[^/]+\/([^/]+)\/$/)
  if (cityMatch) { const city = cityBySlug(cityMatch[1]); if (city) return <CityPage city={city}/> }
  return <NotFound/>
}
