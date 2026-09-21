# The FlexFlow - Blog Publishing Guide & Architecture Manual

This guide explains how the blog system is structured, how to create and publish new blog posts, and how to format rich article elements (callouts, tables, sticky table of contents, and SEO schema).

---

## 1. Directory & URL Architecture

The blog is built for fast, clean URLs that match both the local development server and Vercel hosting:

```
agency-portfolio/
├── blog.html                           # The Blog Archive / Listing Page (URL: /blog)
├── blog/
│   ├── template.html                   # Reusable starter template for new articles
│   └── founder-led-vs-traditional-agency.html  # Live starter article (URL: /blog/founder-led-vs-traditional-agency)
├── assets/
│   └── css/
│       └── styles.css                  # Contains all .blog-* and .article-* styling
├── sitemap.xml                         # Contains all indexed URLs
└── BLOG_GUIDE.md                       # This guide
```

- **Blog Archive URL**: `https://theflexflow.in/blog`
- **Article URL Structure**: `https://theflexflow.in/blog/[post-slug]` (e.g. `https://theflexflow.in/blog/why-geo-matters`)

---

## 2. Step-by-Step: How to Create a New Blog Post

### Step 1: Duplicate the Template
1. Copy `blog/template.html`.
2. Rename the new file using lowercase letters and hyphens:
   ```
   blog/your-post-slug.html
   ```
   *Example: `blog/generative-engine-optimization-guide.html`*

---

### Step 2: Update Metadata in `<head>`
Open your new file and update the following fields:

#### 1. Page Title & Meta Description (Lines 10–13)
```html
<title>Your Post Title Here - The FlexFlow Journal</title>
<meta name="description" content="A compelling 1-2 sentence summary (140-160 characters) explaining what the reader will learn.">
```

#### 2. Open Graph & Canonical Tags (Lines 18–33)
Replace `your-post-slug` with your actual slug:
```html
<meta property="og:title" content="Your Post Title Here · The FlexFlow">
<meta property="og:description" content="Your compelling 1-2 sentence summary.">
<meta property="og:url" content="https://theflexflow.in/blog/your-post-slug">
<link rel="canonical" href="https://theflexflow.in/blog/your-post-slug">
<meta property="article:published_time" content="2026-09-19T10:00:00+05:30">
<meta property="article:section" content="Web Architecture">
```

#### 3. Schema.org JSON-LD (Lines 42–85)
Update the structured data for Google and AI search engines:
```json
{
  "@type": "BlogPosting",
  "@id": "https://theflexflow.in/blog/your-post-slug#article",
  "headline": "Your Post Title Here",
  "description": "Your compelling summary.",
  "url": "https://theflexflow.in/blog/your-post-slug",
  "datePublished": "2026-09-19T10:00:00+05:30",
  "dateModified": "2026-09-19T10:00:00+05:30",
  "articleSection": "Web Architecture"
}
```

---

### Step 3: Write and Format the Content

#### 1. Breadcrumbs & Header
Update the breadcrumb link text and the H1 title:
```html
<span aria-current="page">Your Post Title</span>

<div class="blog-badge">Web Architecture</div>
<h1 class="article-title">Your Post Title Here</h1>
<p class="article-lead">
  A punchy, informative lead paragraph that frames the core problem and thesis.
</p>
```

#### 2. Table of Contents (TOC)
In the `<aside class="article-toc-sidebar">`, update the links to match your section IDs:
```html
<ul class="article-toc-list">
  <li><a class="article-toc-link is-active" href="#the-problem">1. The Problem</a></li>
  <li><a class="article-toc-link" href="#the-solution">2. The Solution</a></li>
  <li><a class="article-toc-link" href="#key-takeaways">3. Key Takeaways</a></li>
</ul>
```
Then assign matching `id` attributes to your `<h2>` headings in the article:
```html
<h2 id="the-problem">1. The Problem</h2>
<p>Content goes here...</p>

<h2 id="the-solution">2. The Solution</h2>
<p>Content goes here...</p>
```
*(The template includes an automatic IntersectionObserver script that highlights the active TOC item as the user scrolls!)*

---

## 3. Formatting Cheat-Sheet: Rich Article Components

### A. Callout Boxes
Use callouts to highlight insights, tips, or common pitfalls:

#### 1. Insight (Signal Red)
```html
<div class="article-callout callout-insight">
  <div class="callout-title">
    <i class="fa-solid fa-lightbulb" aria-hidden="true"></i> Architectural Insight
  </div>
  <p>Explain the counter-intuitive reality or core principle here.</p>
</div>
```

#### 2. Tip / Recommendation (Green)
```html
<div class="article-callout callout-tip">
  <div class="callout-title">
    <i class="fa-solid fa-check-circle" aria-hidden="true"></i> Practical Recommendation
  </div>
  <p>Actionable advice the reader can implement immediately.</p>
</div>
```

#### 3. Warning (Amber)
```html
<div class="article-callout callout-warning">
  <div class="callout-title">
    <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i> Common Pitfall
  </div>
  <p>A mistake to avoid when implementing this strategy.</p>
</div>
```

---

### B. Comparison Table
```html
<div class="article-table-wrapper">
  <table class="article-table">
    <thead>
      <tr>
        <th>Dimension</th>
        <th>Conventional Model</th>
        <th>The FlexFlow Founder Model</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Point of Contact</strong></td>
        <td>Junior Account Coordinator</td>
        <td>Founder &amp; Principal Engineer</td>
      </tr>
      <tr>
        <td><strong>Sprint Cycle</strong></td>
        <td>6 to 12 weeks</td>
        <td>2 to 4 weeks</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

### C. Blockquote
```html
<blockquote>
  <p>“When engineering and marketing share the same brain, feedback loops contract from weeks to minutes.”</p>
</blockquote>
```

---

### D. Code Snippet
```html
<pre><code>// Example schema or configuration snippet
const entitySchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "The FlexFlow"
};</code></pre>
```

---

## 4. Step 4: Add the Post to the Blog Archive (`blog.html`)

Open `blog.html` and add a new card inside `<div class="blog-grid" id="articlesGrid">`:

```html
<article class="blog-card" data-category="web">
  <div class="blog-badge">Web Architecture</div>
  <div class="blog-card-meta">
    <span>Sep 19, 2026</span>
    <span>·</span>
    <span>7 min read</span>
  </div>
  <h3 class="blog-card-title">
    Your Post Title Here
  </h3>
  <p class="blog-card-excerpt">
    A short 2-sentence summary of the article that entices the reader to click.
  </p>
  <div class="blog-card-footer">
    <span style="font-size: 12.5px; color: var(--ink-400);">By Hamza</span>
    <a href="/blog/your-post-slug" class="blog-read-more" aria-label="Read Your Post Title">
      Read <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
    </a>
  </div>
</article>
```

### Supported Categories for `data-category`:
- `agency` (Agency Architecture)
- `geo` (GEO & AI Visibility)
- `web` (Web Architecture)
- `seo` (Technical SEO)
- `ads` (Performance Ads)

Setting the `data-category` attribute ensures the filter buttons at the top of `/blog` work automatically.

---

## 5. Step 5: Add to `sitemap.xml`

Open `sitemap.xml` and add an entry:

```xml
<url>
  <loc>https://theflexflow.in/blog/your-post-slug</loc>
  <lastmod>2026-09-19</lastmod>
  <changefreq>monthly</changefreq>
  <priority>0.8</priority>
</url>
```

---

## 6. Step 6: Test Locally & Deploy

### Test Locally:
Run the local dev server:
```bash
npm run dev
```
Open your browser and verify:
- Blog Index: `http://localhost:3000/blog`
- Your Post: `http://localhost:3000/blog/your-post-slug`
- Verify that the Table of Contents scrolls smoothly and highlights sections.

### Deploy to Production:
When you are ready to publish:
```bash
git add .
git commit -m "feat(blog): publish your-post-slug article"
git push origin main
```
Vercel will automatically build and deploy your new article in under 30 seconds.
