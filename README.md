# Portable Food Bank

Kitchen-first temporary facility rental website built from `site-39.json`.

## Commands

- `pnpm dev` — local development
- `pnpm test` — data integrity tests
- `pnpm typecheck` — TypeScript validation
- `pnpm lint` — ESLint
- `pnpm build` — production build plus static prerendering and sitemap generation

The build prerenders 50 state guides, 246 city guides, nine service pages, core pages, and selected legacy URLs. Location facts, pricing, ETA ranges, breadcrumbs, articles, and service-hour copy come from the authoritative JSON in `src/data/site-39.json`.
