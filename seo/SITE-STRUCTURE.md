# Site Structure — theaceservices.com

**Date:** 2026-08-31 · **Baseline:** 99 URLs in current sitemap (verified 2026-08-31 live crawl)
**Post-Phase 3 target:** ~80 focused URLs (down from 99 after consolidation, up after new pages)

Quality-gated per local-service template: **no state-level pages** (violates 2025 SAB rules); only real Houston area.

## Verified route conventions (re-check 2026-08-31)

- **Service pages live at ROOT**, not `/services/*`. Confirmed: existing pages are `/cost-estimating`, `/architectural-services`, `/structural-engineering`, `/project-management`, `/3d-rendering-services`, `/shop-drawing-services`, `/permit-set-services`.
- Any request to `/services/[slug]` returns **308 → `/[slug]`** (verified for `/services/electrical-estimating`, `/services/nonexistent-xyz`).
- The `/services` hub page itself exists at 200 but currently links to only 4 of the 7 existing service pages (missing shop-drawing, permit-set, 3d-rendering) — hub is stale.
- **All slugs I probed return HTTP 200 with a 659-word "Not Found" template** (electrical-estimating, hvac-estimating, houston-construction-estimating, lvp-flooring-cost, outsourced-construction-estimating, random-string-xyz-9999 all identical). See soft-404 blocker in `IMPLEMENTATION-ROADMAP.md` Phase 1. **This is the C1 bug still live for ASCII slugs** — the 08-24 middleware fix only blocked non-ASCII.

---

## Target URL hierarchy

```
/
├── /about-us
│   ├── /about-us/team                   [NEW — named estimators + certs]
│   └── /about-us/certifications         [NEW — AACE, ASPE, RICS badges]
├── /services                                          [hub — currently stale, links only 4 of 7 existing]
├── /cost-estimating                                   [existing]
├── /architectural-services                            [existing]
├── /structural-engineering                            [existing]
├── /project-management                                [existing]
├── /3d-rendering-services                             [existing]
├── /shop-drawing-services                             [existing]
├── /permit-set-services                               [existing]
├── /electrical-estimating                             [BUILD — slug currently soft-404s at 200]
├── /hvac-estimating                                   [BUILD]
├── /mechanical-estimating                             [BUILD]
├── /plumbing-estimating                               [BUILD]
├── /concrete-estimating                               [BUILD]
├── /millwork-estimating                               [BUILD]
├── /sitework-estimating                               [BUILD]
├── /roofing-estimating                                [BUILD]
├── /masonry-estimating                                [BUILD]
├── /insulation-estimating                             [BUILD]
├── /fireproofing-estimating                           [BUILD]
├── /drywall-estimating                                [BUILD]
├── /painting-estimating                               [BUILD]
├── /outsourced-construction-estimating                [BUILD — kw KD1; note /outsource-construction-estimation soft-404s too — pick ONE canonical, 301 the other]
├── /blueprint-takeoff-services                        [BUILD — kw 250/KD0]
├── /material-takeoff-services                         [BUILD]
├── /drywall-takeoff-services                          [BUILD]
├── /flooring-takeoff-services                         [BUILD]
├── /quantity-surveyor-services                        [EXISTS at 200, 3,663 words — add to sitemap + link from nav]
├── /warehouses-development                            [EXISTS at 200, 3,793 words, #1 rank — add to sitemap + link]
├── /blueprint-estimation                              [EXISTS at 200, 4,821 words — add to sitemap + link]
├── /houston-construction-estimating                   [BUILD — slug currently soft-404s at 200]
├── /projects
│   └── /projects/[case-study-slug]                    [3 NEW case studies month 7]
├── /industries                                        [existing]
│   └── /industries/[sector]                           [existing set]
├── /houston-construction-estimating                   [NEW — local hub page]
├── /resources                                         [NEW section]
│   ├── /resources/sample-takeoff                      [gated download]
│   ├── /resources/rfp-template                        [gated download]
│   └── /resources/cost-calculator                     [interactive widget]
├── /blog
│   ├── /blog/[topical-cluster-post]                   [~30 curated after consolidation]
│   └── /blog/[cost-guide-slug]                        [11 NEW per calendar]
├── /compare
│   ├── /compare/outsourced-vs-in-house-estimator      [NEW]
│   └── /compare/estimator-vs-quantity-surveyor        [NEW]
├── /contact-us
├── /faq                                               [NEW — schema-rich answers]
└── /reviews                                           [NEW — aggregated + LocalBusiness AggregateRating schema]
```

---

## Critical: soft-404 blocker on new-page work

Every new URL in the BUILD list above **already returns HTTP 200** with a 659-word "Not Found" template. Two consequences:

1. **Google may already have indexed these as thin duplicate content.** Priority 0 fix.
2. When real content ships, GSC needs a manual reindex request per URL (not just a sitemap ping) because the URL was already "known" as thin.

Do not publish trade pages until the `/[slug]` route returns a real 404 for unmatched params. Otherwise every publish leaves a permanent ghost 200 sibling behind for any typo variant.

## URLs to remove / redirect (from consolidation plan)

| Source (301 →) | Target |
|---|---|
| 6 warehouse-development blog posts | `/warehouses-development` |
| 6 blueprint-estimation blog posts | `/blueprint-estimation` |
| 3 quantity-surveyor blog posts | `/quantity-surveyor-services` |
| Any state-level page (audit if any exist) | `/services/outsourced-construction-estimating` |

See `orphan-and-consolidation-plan-2026-08-24.md` for exact source URLs.

---

## Internal linking rules

### Hub-and-spoke topology

- **Trade page (hub)** → links to: 3 related cost-guide posts, quantity-takeoff-services, commercial-estimating-services, `/resources/sample-takeoff`, `/contact-us`.
- **Cost-guide post (spoke)** → links to: 1 relevant trade page (contextual, in-body), `/resources/cost-calculator`.
- **Case study** → links to: relevant trade page + industry page.
- **Every page** → links to `/houston-construction-estimating` from footer (local signal) and `/services/outsourced-construction-estimating` from footer (nationwide signal).

### Anchor text discipline

- No exact-match anchor stuffing. Use natural language + branded + partial-match mix.
- Never anchor internal links to "click here" or "learn more" — always use descriptive text that includes the target's core phrase.

### Breadcrumbs

Enabled on all pages except home/contact/faq. Schema.org BreadcrumbList markup already present per audit.

---

## Schema plan by page type

| Page type | Schema |
|---|---|
| Homepage | `Organization` + `LocalBusiness` (with geo, hours, priceRange, areaServed) + `Service` (aggregate) |
| Service page (trade) | `Service` + `LocalBusiness` (parent) + `FAQPage` |
| Cost-guide blog | `Article` + `FAQPage` + optional `HowTo` for step-based guides |
| Case study | `CaseStudy` + `Organization` + optional `Product` for deliverable |
| Compare page | `Article` + `FAQPage` |
| Reviews page | `LocalBusiness` with `AggregateRating` |
| FAQ | `FAQPage` with 10+ Q&A |

Current schema coverage: 100% (best-in-class). Maintain via template — every new page inherits base schema block.

---

## Sitemap hygiene

Post-Phase 1, sitemap must:
- Exclude the 15 consolidated blog posts (they 301 to targets).
- Include the 3 consolidation targets and all 28 previously-orphan pages.
- Include new pages within 24h of publish (Next.js auto-generates from routes — verify build output).
- Submit IndexNow to Bing for every new URL.
- Never exceed ~80 canonical URLs — enforce a hard budget to prevent thin-page drift.

---

## Local SEO (Houston-specific)

- `/houston-construction-estimating` — single primary local page with:
  - Named neighborhoods served (Cypress, Katy, Sugar Land, The Woodlands, Pearland, etc.)
  - Local project references (anonymized if needed)
  - Houston-specific regulations content (Texas Windstorm code, Harris County permit context)
  - Embedded GBP map + reviews
  - LocalBusiness schema with full geo
- **No** individual pages for Katy, Sugar Land, etc. unless real projects + reviews exist for each. Post-2025 SAB rules + local-service template quality gates apply.

## Nationwide

- `/services/outsourced-construction-estimating` — the nationwide flagship. Explicitly says "Houston HQ, delivering to contractors in all 50 states." No state-page attempts.
