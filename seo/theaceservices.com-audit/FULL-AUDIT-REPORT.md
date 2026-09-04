# Homepage SEO Audit — theaceservices.com

**Scope:** Homepage (`/`) only, per request
**Date:** 2026-08-27
**Business type:** Local Service / B2B professional services — construction cost estimating, takeoffs, shop drawings, 3D rendering, permit sets (Houston, TX; nationwide-remote)
**Stack:** Next.js 15 on Cloudflare (OpenNext)
**Audited against:** live dev render (`localhost:3000`) + source code

## SEO Health Score: 74 / 100

| Category | Weight | Score | Notes |
|---|---|---|---|
| Technical SEO | 22% | 85 | Robots, sitemap, canonical, security headers all correct. Homepage `no-store` caching is the one real issue. |
| Content Quality | 23% | 50 | **325 visible words** — too thin to rank for KD 47 commercial terms. Testimonials disabled. |
| On-Page SEO | 20% | 82 | 1×H1, strong title/meta. Title 72 chars (truncation risk); one H3-before-H1 hierarchy jump. |
| Schema | 10% | 85 | Excellent @graph, but stale — missing Shop Drawings & 3D Rendering services. |
| Performance (CWV) | 10% | ~70 | Not measurable on dev build; `no-store` + field data needed to confirm. |
| AI Search Readiness | 10% | 70 | FAQPage schema is great; thin body text limits passage citability. |
| Images | 5% | 95 | 12 images, 0 missing alt, WebP in use. |

**One-line verdict:** The homepage is technically among the best-built you'll see for this niche — the ceiling is **thin on-page content** and a few config/schema items, not infrastructure.

---

## What's already excellent (don't touch)

- **robots.txt** — clean: `Allow: /`, disallows `/admin`, `/admin-login`, `/api/`, sitemap declared.
- **sitemap.xml** — valid, homepage `priority 1`, sensible changefreq/priority across routes.
- **Canonical** — self-referencing `https://theaceservices.com/` ✓
- **Security headers** — full CSP, HSTS (preload), X-Content-Type-Options, X-Frame-Options: DENY, Referrer-Policy, Permissions-Policy. Enterprise-grade.
- **Structured data** — `@graph` with Organization + WebSite + ProfessionalService (full NAP, phone, hours, geo) + Service (OfferCatalog) + FAQPage, properly `@id`-linked. Rare to see this done right.
- **One H1**, `lang=en`, viewport, OG + Twitter card tags all present.
- **Images** — all 12 carry alt text; WebP format.
- **LCP hint** — `<link rel=preload as=image>` on the logo.

---

## Findings

### 🔴 HIGH — Thin homepage content (325 words)
The homepage renders ~325 indexable words. Competitors ranking for the target terms (`construction estimating services`, KD 47) carry substantially more on-page prose. Google will not rank a 325-word page for competitive commercial intent, and thin text also starves AI engines of citable passages.
**Fix:** Add 600–900 words of substantive, crawlable copy — expand the service sections with real descriptions (estimating, takeoffs, shop drawings, 3D rendering, permit sets), a "how it works" narrative, differentiators, and trades/industries served. This is the single highest-leverage change on the page.

### 🔴 HIGH — Homepage is not cacheable (`Cache-Control: no-store, must-revalidate`)
The homepage responds `no-store` (dynamically rendered per request), while static assets like robots.txt correctly use `max-age + stale-while-revalidate`. `no-store` defeats CDN/browser caching → slower TTFB, weaker LCP, and less efficient crawling for a page whose content changes rarely.
**Fix:** Render the homepage statically or with ISR (`export const revalidate = 3600`) so Cloudflare can cache it. Confirm the header flips to a cacheable policy.

### 🟠 MEDIUM — Schema is stale vs. current positioning
`serviceSchema` / `OfferCatalog` lists AACE Estimates, Material Takeoffs, Permit Sets, Project Scheduling — but **Shop Drawings and 3D Architectural Rendering** (now core services, and now in the visible copy/title) are absent. `organizationSchema.description` also still calls the company only an "estimation company."
**Fix:** Add Shop Drawings and 3D Rendering as `Offer`/`Service` items in the OfferCatalog; broaden the Organization description to the full service scope. (`src/lib/schema.ts`)

### 🟠 MEDIUM — Testimonials section disabled on homepage
`home-page.tsx` has `{/* <TestimonialsSection /> */}` commented out. Social proof is a primary E-E-A-T and conversion signal and is missing above the fold of trust content.
**Fix:** Re-enable with genuine client testimonials. If real reviews exist, consider `aggregateRating` on the ProfessionalService schema (only with authentic data — never fabricate).

### 🟡 LOW — Title length 72 chars
`Construction Estimating, Shop Drawings & 3D Rendering | The ACE Services` may truncate the brand in SERPs (~600px / ~60 char display limit). Acceptable, but tighter would show fully. Optional: `Construction Estimating, Shop Drawings & Rendering | ACE Services`.

### 🟡 LOW — Heading hierarchy jump (H3 before H1)
An H3 ("Socials") appears in DOM order before the page H1, breaking strict heading nesting. Minor a11y/semantic nit.
**Fix:** Demote to a non-heading element or move after the H1.

### 🟡 LOW — Organization schema missing `logo` / `sameAs`
`sameAs` (LinkedIn) sits only on the ProfessionalService node; `organizationSchema` has no `logo`. Adding both strengthens the knowledge-graph entity.

### ℹ️ INFO — Performance not measurable on dev
CWV read on the unoptimized dev build is not representative. Pull CrUX/GSC field data on production, and re-check LCP after the caching fix.

---

## Category detail

**Technical:** Crawlability and indexability are clean (indexable, canonical correct, no accidental noindex). The only defect is the `no-store` homepage cache policy. Security posture is excellent.

**On-Page:** Title and meta description are keyword-led and accurate (recently updated to include shop drawings + 3D rendering). Single H1 anchors the flagship term. Internal linking is healthy (25 internal links to /services, /projects, /calculator, and service pages).

**Content / E-E-A-T:** Trust stats present (2,893+ projects, 35 states, 89% bid win rate) and NAP is consistent with schema. Held back by low word count and disabled testimonials.

**Schema:** Best-in-class structure; only issue is that it hasn't kept pace with the expanded service lineup.

**AI Readiness:** FAQPage + clean semantic markup make the page citable; more extractable body prose would increase the surface AI engines can quote.

**Images:** No issues found on the homepage.
