# Homepage Action Plan — theaceservices.com

Ordered by impact ÷ effort. Homepage scope only.

## Phase 1 — This week (highest leverage)

1. **Expand homepage copy to 800+ words** `[HIGH]`
   Add real prose to the service sections: estimating, takeoffs, shop drawings, 3D rendering, permit sets — plus "how it works", trades/industries served, and differentiators. Target the estimating cluster naturally. *Files: SolutionsSection / WhyChooseUsSection / a new content block in `home-page.tsx`.*

2. **Make the homepage cacheable** `[HIGH]`
   Switch from `no-store` to static/ISR (`export const revalidate = 3600`). Verify the response header becomes a `max-age`/`s-maxage` policy so Cloudflare caches it. *File: `src/app/page.tsx`.*

3. **Update schema for the full service lineup** `[MEDIUM]`
   Add Shop Drawings and 3D Architectural Rendering as OfferCatalog items; broaden `organizationSchema.description` beyond "estimation company"; add `logo` + `sameAs` to Organization. *File: `src/lib/schema.ts`.*

## Phase 2 — Weeks 2–3

4. **Re-enable Testimonials on the homepage** `[MEDIUM]`
   Uncomment `TestimonialsSection` with genuine client quotes. If authentic reviews exist, add `aggregateRating` to ProfessionalService (never fabricate).

5. **Tighten title + fix heading order** `[LOW]`
   Optional shorter title to avoid brand truncation; demote the pre-H1 "Socials" H3 to a non-heading element.

## Phase 3 — Month 2 (beyond the homepage)

6. **Build dedicated service pages** for shop drawings, 3D rendering, permit sets — each targeting its own keyword cluster. The homepage links to them; it cannot rank for them. (See keyword-gap analysis.)

7. **Cost-guide blog cluster** (concrete slab cost, drywall cost, foundation cost) — the top-of-funnel traffic engine competitors use.

## Phase 4 — Ongoing

8. Pull CrUX/GSC field data on production; re-measure LCP after the caching fix. Track the estimating-cluster keywords in Rank Tracker.
