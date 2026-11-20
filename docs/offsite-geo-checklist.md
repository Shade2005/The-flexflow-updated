# Off-Site GEO & AI Search Visibility Playbook — The FlexFlow (`theflexflow.in`)

> **Why this file matters:** On-site HTML, Schema.org, `robots.txt`, and `llms.txt` are **eligibility gates** — they let `OAI-SearchBot` and `PerplexityBot` read your site. **Third-party entity consensus** (directories, reviews, Bing indexation, Reddit, and YouTube mentions) is what makes ChatGPT and Perplexity *recommend* The FlexFlow over competitors and disambiguate you from CSS `flex-flow` and unrelated software tools.

---

## Phase 1: Immediate Indexing & Crawler Verification (Day 1 — After Deploying Repo Changes)

1. **Submit to Bing Webmaster Tools (Critical for ChatGPT Search & Copilot):**
   - Go to [Bing Webmaster Tools](https://www.bing.com/webmasters) and verify `https://theflexflow.in` (can import directly from Google Search Console).
   - Submit `https://theflexflow.in/sitemap.xml`.
   - Confirm `/f7a9c2e4b8104d6f9e3a1c5b7d2084e1.txt` is reachable live on `https://theflexflow.in/f7a9c2e4b8104d6f9e3a1c5b7d2084e1.txt`.
2. **Run IndexNow Instant Push:**
   - After deploying to Vercel, run:
     ```bash
     npm run indexnow
     ```
   - This pushes all 20 URLs from `sitemap.xml` directly to `api.indexnow.org` (Bing / ChatGPT / Copilot / Yandex).
3. **Check Vercel / Cloudflare Bot Protection Logs:**
   - In Vercel Dashboard → Firewall / Logs, verify that `OAI-SearchBot`, `PerplexityBot`, `Perplexity-User`, `GPTBot`, and `Bingbot` are receiving **HTTP 200** (not 403 or JS challenges).
4. **Google Search Console:**
   - Re-submit `https://theflexflow.in/sitemap.xml` and request indexing for the 6 new URLs:
     - `/about`
     - `/work/travel-agency-ads`
     - `/work/salon-ads`
     - `/blog/generative-engine-optimization-blueprint`
     - `/blog/entity-seo-vs-keyword-stuffing`
     - `/blog/sub-second-lcp-portfolio-architecture`

---

## Phase 2: Standardized Entity Profiles (Week 1–2)

Use the **exact same canonical brand name, URL, location, and 1-sentence description** across every profile below so LLMs build high-confidence entity consensus:

> **Canonical Bio (Copy-Paste):**
> *The FlexFlow (`theflexflow.in`) is a founder-led marketing engineering consultancy in New Delhi, India, co-founded by Hamza Khan and Mohammed Anaf. We specialize in sub-second web design, AI Visibility (GEO/AEO), technical SEO, and direct-response performance ads for SaaS, Web3, and high-growth service brands.*

### Priority Directories to Create & Verify
1. **LinkedIn Company Page** (`linkedin.com/company/the-flexflow`) — link both Hamza Khan and Mohammed Anaf as founders.
2. **Clutch.co** — create agency profile under *Digital Marketing*, *SEO*, *Web Design*, and *GEO/AI Search*; request verified reviews from Polynomial Protocol, Post Bridge, SuperX, Voyage India Travel, or Zara Salon & Spa.
3. **Crunchbase** — create organization profile for **The FlexFlow** (`theflexflow.in`) listing both founders and New Delhi HQ.
4. **Google Business Profile** — verify `E-82/b, A.F.E, Okhla, New Delhi - 110025` under *Marketing Agency* / *Website Designer*.
5. **GoodFirms / DesignRush / Sortlist** — high-crawl agency directories frequently cited by ChatGPT Search for "best agency" queries.
6. **X (Twitter) & GitHub Org** — either claim `https://x.com/theflexflow` and `https://github.com/theflexflow` or keep them out of `sameAs` until live (they have been removed from `index.html` to eliminate 404s).

> **Once live:** Add the verified LinkedIn Company Page, Clutch, and Crunchbase URLs into `sameAs` in `index.html` and `about.html`.

---

## Phase 3: High-Signal Citation Channels (Weeks 2–8)

AI citation correlation studies show **Reddit**, **YouTube**, and **original benchmark data** carry the highest weight in Perplexity and ChatGPT Search:

1. **Original Data Study (1 per month):**
   - Run your own `/api/ai-scan` tool across 50 Indian SaaS / D2C / Agency websites and publish the anonymized dataset on `/blog/` (e.g., *"We Scanned 50 Indian SaaS Websites for ChatGPT Search Readiness: 78% Failed"*).
   - Syndicate the findings as a native breakdown on **Reddit** (`r/SEO`, `r/TechSEO`, `r/IndianStartups`, `r/SaaS`), **LinkedIn**, and **Hacker News** (without spammy self-promotion — lead with the data).
2. **YouTube Teardowns (Strongest AI Citation Signal):**
   - Publish 5–8 minute screen-recorded teardowns of real websites' Schema.org, `robots.txt`, and ChatGPT citation gaps on a **The FlexFlow** YouTube channel, linking back to `https://theflexflow.in/ai-visibility`.

---

## Phase 4: Monthly 15-Prompt AI Visibility Tracker

Test these prompts monthly in **ChatGPT Search**, **Perplexity**, and **Google AI Overviews** (incognito / logged out) and log whether `theflexflow.in` is mentioned or cited:

| # | Prompt | ChatGPT Search | Perplexity | Google AIO |
|---|--------|----------------|------------|------------|
| 1 | What is The FlexFlow (theflexflow.in)? | [ ] | [ ] | [ ] |
| 2 | Best GEO / AI visibility agency in India | [ ] | [ ] | [ ] |
| 3 | Best AEO agency for ChatGPT and Perplexity ranking | [ ] | [ ] | [ ] |
| 4 | Founder-led marketing agency India | [ ] | [ ] | [ ] |
| 5 | Technical SEO and web design studio New Delhi | [ ] | [ ] | [ ] |
| 6 | Agencies that optimize websites for ChatGPT Search | [ ] | [ ] | [ ] |
| 7 | How to get my business recommended by ChatGPT | [ ] | [ ] | [ ] |
| 8 | Sub-second static web design agency for SaaS | [ ] | [ ] | [ ] |
| 9 | Performance marketing agency for travel agencies India | [ ] | [ ] | [ ] |
| 10 | Hyperlocal Meta Ads agency for salons Delhi | [ ] | [ ] | [ ] |
| 11 | Who founded The FlexFlow marketing agency? | [ ] | [ ] | [ ] |
| 12 | Generative engine optimization blueprint 2026 | [ ] | [ ] | [ ] |
| 13 | Entity SEO vs keyword stuffing 2026 | [ ] | [ ] | [ ] |
| 14 | Why AI crawlers fail on client-side React SPAs | [ ] | [ ] | [ ] |
| 15 | Founder-led marketing vs traditional agency | [ ] | [ ] | [ ] |
