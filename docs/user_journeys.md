# FlexFlow Agency Portfolio - User Journeys

## Key User Journeys

```mermaid
flowchart TD
    START(["Prospect Lands on Site"]) --> DISCOVER{"Discovery Route"}

    %% Journey 1: Homepage Evaluation
    DISCOVER -->|Scans Value Prop| HOME_HERO["Hero Value Prop & Interactive Audit Scanner"]
    HOME_HERO --> SHOWCASE["Wispr Flow Case Showcase (Voyage India & Zara Spa)"]
    SHOWCASE --> PROOF["Inspect Proof Metrics & Cost Per Lead"]
    PROOF --> BOOK_CALL["Book Sprint via Cal.com Embed"]

    %% Journey 2: Case Studies & Work Exploration
    DISCOVER -->|Browses Work| WORK_NAV["Navigate to /work via SPA Link"]
    WORK_NAV --> WORK_GRID["Filter Projects (SaaS, DTC Performance, Brand)"]
    WORK_GRID --> LIGHTBOX["Open Proof Modal / Lightbox"]
    LIGHTBOX --> CTA_STRATEGY["Click 'Inquire Paid Strategy' -> /contact"]

    %% Journey 3: Browser Navigation & History Traversal
    CTA_STRATEGY --> CONTACT_PAGE["Review Booking Slots on /contact"]
    CONTACT_PAGE -->|Clicks Browser Back Button| POPSTATE_TRIGGER["Browser popstate event triggers"]
    POPSTATE_TRIGGER -->|DOM Swapped & Spells Rehydrated| WORK_RETURN["Returns to /work cleanly with functional interactions"]

    %% Journey 4: AI Search Discovery (ChatGPT Search / Perplexity / Google AIO)
    START_AI(["Buyer Prompts ChatGPT / Perplexity"]) --> AI_CRAWL["OAI-SearchBot / PerplexityBot / Bing IndexNow"]
    AI_CRAWL --> AI_PAGES["Lands on /about, /work/*, or /blog/geo-* Answer Passage"]
    AI_PAGES --> BOOK_CALL

    %% Conversion Endpoints
    BOOK_CALL --> CONFIRMATION(["Confirmed Client Intro Call"])
```

## Detailed User Flow Steps

### Journey 1: Portfolio Review & History Traversal (Verified Functional)
1. Prospect visits `https://theflexflow.in/` or local dev server.
2. Prospect clicks "Work" in the top navigation bar.
3. Telemetry laser animation fires, `<main>` DOM swaps cleanly from `/` to `/work`, and `currentRenderedPath` updates to `'/work'`.
4. Prospect inspects direct-response performance case studies (Voyage India Travel, ABC Sleek Kitchen, Zara Salon).
5. Prospect clicks the browser **Back** button:
   - *Result*: The `popstate` listener fires `navigateTo(window.location.href, true)`.
   - *Resolution*: Because `targetPath` (`'/'`) differs from `currentRenderedPath` (`'/work'`), the engine recognizes a cross-page history navigation, fetches the homepage HTML, strips stale dataset flags via `cleanInitDatasets()`, swaps `<main>`, updates navigation active classes, resets scroll position, and rehydrates interactive design spells.
