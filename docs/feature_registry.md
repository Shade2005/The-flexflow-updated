# FlexFlow Agency Portfolio - Feature Registry

## 1. Core Architecture & Navigation
- **FEAT-001: Kinetic Telemetry Page Transition Engine (SPA Mode)**
  - *Location*: [`assets/js/main.js#L1850-L2300`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js)
  - *Description*: Intercepts internal link clicks, prefetches documents, animates the laser telemetry beam, swaps `<main>` and footer DOM, and manages History API state (`pushState` and `popstate`) with `currentRenderedPath` tracking and rehydration datasets sanitization.
  - *Status*: Active (Resolved: Popstate history resolution repaired & dataset rehydration flags sanitized)

- **FEAT-002: Navigation & Mobile Drawer**
  - *Location*: [`assets/js/main.js`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js), all HTML headers
  - *Description*: Sticky navigation header with animated active link tracking and accessible full-screen mobile menu overlay.
  - *Status*: Active

- **FEAT-003: Lenis Smooth Scroll Integration**
  - *Location*: [`assets/js/main.js`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js), CDN script
  - *Description*: Hardware-accelerated smooth scrolling across all pages with programmatic anchor offset handling.
  - *Status*: Active

## 2. Interactive Spells & Micro-interactions
- **FEAT-004: Wispr Flow Case Showcase**
  - *Location*: [`index.html#L1070-L1220`](file:///f:/Projects/FlexFlow/agency-portfolio/index.html), [`assets/js/main.js#L328-L410`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js)
  - *Description*: Sticky visual preview stage synced via scroll-spy with high-converting client case studies (Slide 0: Voyage India Travel, Slide 1: Zara Salon & Spa).
  - *Status*: Active (ABC Tile removed; Voyage India promoted to lead active slide)

- **FEAT-005: Interactive Hero Site Scanner**
  - *Location*: [`index.html`](file:///f:/Projects/FlexFlow/agency-portfolio/index.html), [`assets/js/main.js#L1450-L1650`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js), [`api/ai-scan.js`](file:///f:/Projects/FlexFlow/agency-portfolio/api/ai-scan.js)
  - *Description*: Real-time site analyzer calculating technical debt, speed metrics, and AI readiness with live progress gauges.
  - *Status*: Active

- **FEAT-006: Interactive Sprint & ROI Budget Calculators**
  - *Location*: [`services.html`](file:///f:/Projects/FlexFlow/agency-portfolio/services.html), [`index.html`](file:///f:/Projects/FlexFlow/agency-portfolio/index.html), [`assets/js/main.js#L790-L870`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js)
  - *Description*: Dynamic sliders estimating lead output, ad spend targets, and sprint pricing configurations.
  - *Status*: Active (Decoupled from ABC Tile assets to Voyage India metrics)

- **FEAT-007: Design Spells Micro-Interactions (Spotlights, Magnetics, Lightbox)**
  - *Location*: [`assets/js/main.js`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js)
  - *Description*: Cursor-following spotlight borders, magnetic buttons, animated stat counters, and image lightbox modal.
  - *Status*: Active

## 3. Case Studies & Portfolio Showcase
- **FEAT-008: Case Study Content**
  - *Location*: [`index.html`](file:///f:/Projects/FlexFlow/agency-portfolio/index.html), [`work.html`](file:///f:/Projects/FlexFlow/agency-portfolio/work.html)
  - *Description*: Synchronized visual cards and metrics for client case studies.
  - *Status*: Active (ABC Tile completely purged from site; Voyage India and Zara Salon active)

- **FEAT-009: Work Portfolio Index & Category Filtering**
  - *Location*: [`work.html#L700-L830`](file:///f:/Projects/FlexFlow/agency-portfolio/work.html), [`assets/js/main.js#L1030-L1110`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js)
  - *Description*: Categorized project cards across SaaS, DTC Performance, and Brand Identity with lightbox report inspect modal.
  - *Status*: Active (Lead performance card: Voyage India Travel Bookings)

## 4. Ingestion & Conversion Touchpoints
- **FEAT-010: Cal.com Meeting Scheduler Integration**
  - *Location*: [`contact.html`](file:///f:/Projects/FlexFlow/agency-portfolio/contact.html), [`index.html`](file:///f:/Projects/FlexFlow/agency-portfolio/index.html), [`assets/js/main.js`](file:///f:/Projects/FlexFlow/agency-portfolio/assets/js/main.js)
  - *Description*: Embedded interactive calendar booking widget with dark mode styling and fallback direct contact details.
  - *Status*: Active

- **FEAT-011: Blog Engine & Markdown-Compatible Editorial**
  - *Location*: [`blog.html`](file:///f:/Projects/FlexFlow/agency-portfolio/blog.html), `blog/*.html`
  - *Description*: Content hub with reading time calculations, table of contents, and 4 published passage-optimized thought leadership & GEO/SEO/Web Architecture articles (`blog/template.html` marked `noindex`).
  - *Status*: Active (Updated 2026-11-20 with 3 new GEO/Entity/LCP articles)

## 5. AI Search (GEO/AEO) & Entity Indexing Infrastructure
- **FEAT-012: GEO/AEO Crawler, IndexNow & Standalone Entity Architecture**
  - *Location*: [`robots.txt`](file:///f:/Projects/FlexFlow/agency-portfolio/robots.txt), [`sitemap.xml`](file:///f:/Projects/FlexFlow/agency-portfolio/sitemap.xml), [`llms.txt`](file:///f:/Projects/FlexFlow/agency-portfolio/llms.txt), [`llms-full.txt`](file:///f:/Projects/FlexFlow/agency-portfolio/llms-full.txt), [`about.html`](file:///f:/Projects/FlexFlow/agency-portfolio/about.html), [`work/travel-agency-ads.html`](file:///f:/Projects/FlexFlow/agency-portfolio/work/travel-agency-ads.html), [`work/salon-ads.html`](file:///f:/Projects/FlexFlow/agency-portfolio/work/salon-ads.html), [`scripts/submit-indexnow.js`](file:///f:/Projects/FlexFlow/agency-portfolio/scripts/submit-indexnow.js), [`docs/offsite-geo-checklist.md`](file:///f:/Projects/FlexFlow/agency-portfolio/docs/offsite-geo-checklist.md)
  - *Description*: Explicit `OAI-SearchBot`, `Perplexity-User`, and `Bingbot` permissions; IndexNow batch submission pipeline; disambiguated `/about` entity page; standalone indexable case study URLs; repaired Schema.org `@graph` parity; and off-site entity consensus playbook.
  - *Status*: Active (Implemented 2026-11-20)
