# FlexFlow Agency Portfolio - Feature Log & Dependency Graph

## Visual Architecture & Dependency Graph

```mermaid
flowchart TD
    subgraph CoreEngine["Core Client Engine"]
        NAV["FEAT-002: Navigation & Header"]
        TRANSIT["FEAT-001: Kinetic Telemetry Transit (SPA Engine)"]
        LENIS["FEAT-003: Lenis Smooth Scroll"]
        SPELLS["FEAT-007: Design Spells Micro-interactions"]
    end

    subgraph Pages["Client Product Surfaces"]
        HOME["Homepage (index.html)"]
        WORK["Portfolio (work.html)"]
        SERVICES["Services (services.html)"]
        SERVICE_PAGES["Individual Service Deep Dives"]
        BLOG["Blog Hub & Articles"]
        CONTACT["Contact & Cal.com Booking"]
    end

    subgraph ShowcaseComponents["Showcase & Interactive Modules"]
        SHOWCASE["FEAT-004: Wispr Flow Case Showcase"]
        HERO_SCAN["FEAT-005: Interactive Hero Scanner"]
        CALC["FEAT-006: Budget & Sprint Calculators"]
        PORTFOLIO_GRID["FEAT-009: Work Portfolio Filter & Cards"]
    end

    TRANSIT --> NAV
    TRANSIT --> HOME
    TRANSIT --> WORK
    TRANSIT --> SERVICES
    TRANSIT --> SERVICE_PAGES
    TRANSIT --> BLOG
    TRANSIT --> CONTACT

    HOME --> SHOWCASE
    HOME --> HERO_SCAN
    HOME --> CALC
    WORK --> PORTFOLIO_GRID

    TRANSIT -.->|Rehydrates on DOM Swap with Clean Datasets| SPELLS
    TRANSIT -.->|Rehydrates on DOM Swap with Clean Datasets| SHOWCASE
    TRANSIT -.->|Smooth Scroll Sync on Hash Change| LENIS
```

## Feature Changelog & Status Tracking

| Feature ID | Feature Name | Status | Last Modified | Impact / Summary of Changes |
| :--- | :--- | :--- | :--- | :--- |
| **FEAT-001** | Kinetic Telemetry Page Transition | Resolved / Fixed | 2026-11-13 | Fixed `popstate` history resolution by adding `currentRenderedPath` state tracking and `cleanInitDatasets()` to rehydrate interactive spells on back/forward navigation. |
| **FEAT-004** | Wispr Flow Case Showcase | Updated | 2026-11-13 | Slide 0 (ABC Group) excised; Slide 1 (Voyage India) promoted to active Slide 0; Zara Salon shifted to Slide 1. |
| **FEAT-008** | Case Study Content (ABC Tile) | Removed | 2026-11-13 | ABC Tile completely removed from `index.html`, `work.html`, `performance-marketing.html`, `llms.txt`, `llms-full.txt`, and `vercel.json`. |
| **FEAT-009** | Work Portfolio Grid | Updated | 2026-11-13 | Removed `#abc-tile-ads` card; Voyage India promoted to lead performance case study. |
