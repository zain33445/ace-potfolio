# Verification: Google Doc SEO Audit vs. Codebase (D:\ace2)

**Source doc:** https://docs.google.com/document/d/1A6zCSvuEoiyzhQ3pAWKxs4PCagV2E5aGO02fH7n3zWY
**Verified against:** live repo state, 2026-08-19 (commit `3d8b868`)
**Method:** direct file inspection, grep, no live-site crawl

Verdict key: **TRUE** = confirmed as described · **FALSE** = contradicted by code · **PARTIAL** = real but described inaccurately · **UNVERIFIABLE** = code alone can't confirm (needs live CMS/GSC data)

---

## P0 / Critical items

**P0-1 — "Hacked WordPress blog with gambling spam on `/blog`."** **FALSE.**
`/blog` is a Next.js page ([blog/page.tsx](src/app/blog/page.tsx):26-30), not a live WP install. It calls `getInsights()`, which hard-filters to `INSIGHT_CATEGORY_IDS = [1]` ([content.ts:141-149](src/services/wordpress/content.ts:141)) — the code comment explicitly states the CMS "is heavily polluted with SEO/casino spam" and that category-1 allowlisting is the defense. No spam renders on `/blog`. (The compromised CMS itself, `cms.theaceservices.com`, is a separate WordPress install outside this repo — not what the doc describes.)

**P0-2 — "Zero redirect layer, every legacy URL 404s."** **PARTIAL.**
[next.config.js:43-89](next.config.js:43) has 7 redirects (blog slug moves, `/about`, `/contact`, `/samples`, 3 duplicate blog posts) — not zero. None of the doc's named examples (`/construction-estimation/`, `/building-estimating/`, `/commercial-estimation/`) are in that list. Whether they actually 404 depends on live CMS content resolved dynamically by [`[slug]/page.tsx`](src/app/[slug]/page.tsx) — **unverifiable from code**, needs a live crawl.

**P0-3 — "24 broken 'Related Services' links, all six dead."** **FALSE.**
[services/[slug]/page.tsx:149-164](src/app/services/[slug]/page.tsx:149) renders a "Related Services" block, but it shows 2 links (`getFeaturedServices().slice(0,2)`, [services.ts:450-452](src/data/services.ts:450)), not 6, and they point to real `/services/{slug}` routes covering all 4 defined services. No dead links found.

**P0-4 — "`/testimonials` canonical points to homepage."** **TRUE.**
[testimonials/page.tsx:5-9](src/app/testimonials/page.tsx:5) sets no `alternates.canonical`. Root [layout.tsx:99-101](src/app/layout.tsx:99) defaults it to the homepage. Next.js metadata inheritance means the effective canonical is the homepage — confirmed bug. (Testimonials **does** have an H1, "Trusted by Industry Leaders" — the doc's separate O-4 claim of "no H1 at all" is false.)

## Technical (T-) items

**T-5 — "Duplicate DOM renders 2 H1 tags on homepage/about-us."** **FALSE.**
Desktop/mobile trees do both render ([HeroSection.tsx:9-46](src/components/Home/sections/HeroSection.tsx:9)), but only the desktop `Hero` uses an `<h1>` ([Hero.tsx:257](src/components/Hero.tsx:257)); mobile uses non-h1 markup. `about-us` also has exactly one `<h1>` ([AboutPageClient.tsx:139](src/components/AboutPageClient.tsx:139)). No duplicate H1 found on either page in current code.

**T-6 — "Calculator not crawlable, ~80 words server HTML."** **TRUE.**
[EstimatorWrapper.tsx:5-6](src/app/calculator/EstimatorWrapper.tsx:5) loads the estimator with `ssr: false`. Server HTML is limited to header/paragraph/disclaimer text (~90-110 words) — matches the doc's finding.

**T-7 — "No structured data at all."** **FALSE.**
[lib/schema.ts](lib/schema.ts) defines Organization, WebSite, ProfessionalService (LocalBusiness), and Service schema, injected sitewide via [layout.tsx:114-118](src/app/layout.tsx:114). BreadcrumbList and Article schema exist per-page. **Real gap:** no FAQPage schema despite FAQ content existing, and no Review/AggregateRating schema anywhere.

**T-8 — "cms.theaceservices.com indexation risk."** **UNVERIFIABLE.**
No noindex/X-Robots-Tag config for the CMS subdomain exists in this repo (only an image rewrite, [next.config.js:32-41](next.config.js:32)). The WP server's own settings aren't in this codebase.

**T-10 — "Blog trailing-slash canonical mismatch."** **FALSE.**
Canonical is `https://theaceservices.com/blog`, no trailing slash ([blog/page.tsx:14](src/app/blog/page.tsx:14)); no `trailingSlash` config set. No mismatch in code.

**T-11 — "Page speed: `w=3840&q=75` hero images, uncompressed video, Docs iframes."** **PARTIAL.**
No `w=3840` or high-quality params found; `next/image` calls use proper `sizes`. A CSP rule (`frame-src https://docs.google.com`, [next.config.js:111](next.config.js:111)) confirms Google Docs iframes are in use as claimed. An autoplay mobile hero video exists ([HeroSection.tsx:54-67](src/components/Home/sections/HeroSection.tsx:54)) but no evidence in-repo of it being unoptimized.

## On-page (O-) items

**O-1 — "'this is' placeholder text at end of 4 bullet points."** **TRUE — and broader than described.**
Confirmed at [`[slug]/page.tsx:350`](src/app/[slug]/page.tsx:350): `{detail} this is`. This isn't 4 hardcoded instances — it's a template bug in the shared `ServiceOverviewSection` component, appended after **every** `service.details` bullet, for every service page using the fallback (non-WP-content) render path. Fixing it means editing one line, not four pages.

**O-2 — "Contradictory turnaround claims."** **TRUE, but partially explainable.**
Global marketing copy says "24-48 hours" in multiple places ([layout.tsx:67](src/app/layout.tsx:67), [home-page.tsx:33](src/app/home-page.tsx:33), [services/page.tsx:59](src/app/services/page.tsx:59)). Per-service data legitimately varies: cost-estimating 1-2 days/24-48h, architectural 7-10 days, project-management 3-5 days ([services.ts](src/data/services.ts)). [FAQAccordion.tsx:11](src/components/FAQAccordion.tsx:11) separately claims a sitewide "3 to 5 business days" as typical — that one is a real sitewide inconsistency since it isn't service-scoped. Net: real bug, but the doc doesn't distinguish "different services have different turnarounds" (fine) from "the same global claim contradicts itself" (bug).

**O-3 — "Stat counters render '1+'/'1%'; ticker claims 2,893 vs. 58 actual projects."** **TRUE.**
[AboutPageClient.tsx:80](src/components/AboutPageClient.tsx:80) passes `start: 1` to the count-up hook; first paint / SSR literally shows `"1+"` before the scroll-triggered animation fires. Separately, "2,893+ projects" is claimed in 6+ places ([about-us/page.tsx:7](src/app/about-us/page.tsx:7), [StatsSection.tsx:36](src/components/Home/sections/StatsSection.tsx:36), etc.) while `extracted-projects.json` contains exactly **58** project entries — both confirmed.

**O-4 — "Duplicate/missing H1s."** **PARTIAL.**
All 58 project pages do share one identical hardcoded H1, "Accurate Estimates Behind Successful Construction Bids" ([projects/[slug]/page.tsx:183-186](src/app/projects/[slug]/page.tsx:183)) — true. Homepage's "two H1s" claim is false per T-5 above. Testimonials having "no H1" is false — it has one.

**O-5 — "Thin/templated project pages, $0 stats, duplicate Pauma entries, shared Mansfield PDF."** **TRUE.**
20 of 58 entries have `totalAreaSqFt: 0` / `estimatedCost: 0`. "Pauma Travel Center" is genuinely duplicated — the code itself acknowledges this: [projects.ts:15-28](src/data/projects.ts:15) dedupes two entries that collapsed to the same slug, confirming they're the same source project entered twice in the CMS. The Mansfield, TX concrete-sample PDF is reused across 3 unrelated entries (`regency-parkway-mansfield`, `detroit-mi-2nd-ave`, `aquazzurra-drywall`).

**O-6 — "Bad meta titles/descriptions, hardcoded obsolete meta-keywords."** **TRUE.**
[layout.tsx:68-78](src/app/layout.tsx:68) hardcodes a 9-term `keywords` array with no per-page override anywhere — applies sitewide via metadata inheritance. Description generation uses raw `.slice(0, 160)` with no word-boundary check ([`[slug]/page.tsx`](src/app/[slug]/page.tsx):55,61,72,78), so mid-word truncation is a real risk (contrast: `src/cms/queries.ts:58-63` does snap to word boundaries elsewhere in the codebase, so this is an inconsistency, not a universal pattern).

**O-7 — "Generic anchor text; no footer exists on the new build."** **FALSE (footer claim) / UNVERIFIABLE (exact anchor strings).**
Footer.tsx exists, ships full nav, standards, and **correct** NAP with a working `tel:` link ([Footer.tsx:32-36](src/components/Footer.tsx:32)) — this was already fixed in a prior commit (`bf53a17`). The doc's claim that no footer exists is flatly wrong for current code. The literal strings "VIEW FULL SERVICE" / "VIEW CASE STUDY" were not found anywhere in `src/` — not confirmed as described.

**O-8 — "Image alt text, keyword-stuffed alts, non-descriptive filenames, WhatsApp screenshot."** **FALSE / PARTIAL.**
Only one empty `alt=""` exists sitewide ([hero-parallax.tsx:512](src/components/ui/hero-parallax.tsx:512)), on a decorative icon inside an already-labeled button — not a violation. Filenames `c1–c4.jpeg` do exist and are non-descriptive, but each carries a descriptive `alt` in code ([Hero.tsx:23-26](src/components/Hero.tsx:23)). No WhatsApp-screenshot-named image found.

**O-9 — "CEO bio vague ('over half a decade'), no team page."** **TRUE.**
[AboutPageClient.tsx:231](src/components/AboutPageClient.tsx:231): "brings over half a decade of..." — confirmed verbatim. Only a CEO section exists; no other team member content in the file.

**O-10 — "Shallow content: 550-700 words on service pages vs. 80 on calculator."** **TRUE (roughly).**
Service page word counts run ~480-640 words per page (data-derived) — close to, slightly under, the doc's 550-700 estimate. Calculator confirmed at ~90-110 crawlable words (see T-6).

**O-11 — "Collapsed keyword architecture — 4 pages vs. old 12, listed slugs 404."** **PARTIAL.**
Exactly 4 hardcoded services confirmed in `services.ts`. Whether the ~15 named legacy slugs (`/quantity-surveyor-services`, `/blueprint-estimation`, etc.) are genuinely 404 is **unverifiable from code** — `[slug]/page.tsx` resolves any slug dynamically against live CMS pages, so this needs a live crawl, not a repo check.

## Infrastructure sanity checks

- **robots.txt / sitemap.xml — TRUE, and already correct.** [robots.ts](src/app/robots.ts) allows `/`, disallows only `/admin`, `/admin-login`, `/api/`. [sitemap.ts](src/app/sitemap.ts) includes all static routes, all 4 services, all 58 projects, and up to 100 blog posts. Nothing suggests these were ever missing — treat the doc's checklist item as closed, not open.
- **Duplicate route `/services/{slug}` vs. `/{slug}`** — confirmed to exist as two separate live routes serving the same 4 services ([services/[slug]/page.tsx](src/app/services/[slug]/page.tsx) and [`[slug]/page.tsx`](src/app/[slug]/page.tsx)) — real duplicate-content risk not called out explicitly by the doc's P0/T items but consistent with its general "collapsed architecture" concern.

---

## Net read

- **Confirmed, real, fixable now:** O-1 (`this is` template bug, 1-line fix), O-3 (CountUp starting at 1 + inflated 2,893 vs. 58 stat), O-5 (duplicate Pauma entries, reused Mansfield PDF, 20 zero-stat pages), O-4/C-1 (58 identical project H1s), O-6 (sitewide stale meta-keywords, mid-word description truncation), O-9 (vague CEO bio, no team page), P0-4/testimonials canonical bug, T-6 (calculator not crawlable), T-7 partial (missing FAQPage/Review schema only — not "no schema").
- **False — already fixed or never true in this codebase:** P0-1 (blog spam claim — architecturally wrong, category-allowlist already defends against it), P0-3 (Related Services links aren't dead), T-5 (no duplicate H1s on homepage/about-us), O-7 footer claim (footer exists with correct NAP, already fixed), testimonials "no H1" claim.
- **Needs a live crawl, not a code check:** P0-2 (legacy-slug 404 status), O-11 (which named legacy slugs are actually dead), T-8 (CMS subdomain indexability).

The doc appears to describe a materially different (likely earlier or hypothetical) state of the site than what's currently deployed in this repo — several of its most severe P0 claims (live hacked blog, no footer, no schema, duplicate-DOM H1s) are contradicted by current code, while several of its on-page and data-quality findings (stat counters, meta-keywords, duplicate project entries, template placeholder text) are accurate and actionable.

---

## Live crawl (theaceservices.com + cms.theaceservices.com, 2026-08-19)

All prior "unverifiable from code" items were checked directly against the live site.

- **Legacy slugs claimed 404 (P0-2, O-11).** **FALSE — none of them 404.** Every named legacy slug (`/construction-estimation/`, `/building-estimating/`, `/commercial-estimation/`, `/bridges-construction`, `/electrical-estimation`, `/residential-construction`, `/structural-services`, `/residential-estimating`, `/freelance-estimation`, `/outsourcing-estimation`, `/quantity-surveyor-services`, `/blueprint-estimation`, `/industrial-estimating`, `/commercial-construction`, `/quick-quote`, `/bid-estimation-form`, `/privacy-policy-2`, `/terms-and-conditions`) returns **HTTP 200**. But — see the soft-404 finding below, which changes what that 200 actually means.
- **CRITICAL, newly found — soft 404s sitewide.** Every one of those "live" legacy URLs, and in fact **any invalid slug at all**, serves `<title>Not Found | The ACE Services</title>` content with **HTTP 200**, not 404. Confirmed against the live site, confirmed again against a clean local `next dev`, and confirmed in the local production build's route manifest (`/[slug]` is prerendered SSG with `dynamicParams: true`, 1h revalidate). Root cause: [`[slug]/page.tsx:120`](src/app/[slug]/page.tsx:120) correctly calls `notFound()`, but because the route is an ISR-cached catch-all, the on-demand "not found" render gets cached and re-served with a 200 status on subsequent hits (`x-nextjs-cache: HIT` observed on repeat requests) — this is a known Next.js App Router limitation with `notFound()` inside `generateStaticParams`-based dynamic segments, not a Cloudflare/OpenNext-specific issue. **Not fixed in this pass** — the standard mitigation (`dynamicParams = false`) would correctly 404 unknown slugs immediately, but it also stops new blog posts/services from resolving without a redeploy, which conflicts with this route's stated ISR design (`sitemap.ts` comment: "New blog posts / projects appear here without a redeploy"). This is a real architectural trade-off, not a one-line fix — flagging for a decision rather than guessing.
- **Blog spam (P0-1).** **FALSE, confirmed live.** Fetched `/blog` and 40+ post titles directly — all are legitimate construction-estimating content, no gambling/spam/foreign-language terms found. Category-1 allowlist is working as designed in production.
- **cms.theaceservices.com indexability (T-8).** **Largely mitigated, not a live bug.** `cms.theaceservices.com/robots.txt` disallows `/` entirely except `/wp-json/` and `/wp-content/uploads/` — the WP backend is already blocked from general crawling. No `X-Robots-Tag` header is sent (robots.txt only), so an already-indexed or externally-linked CMS URL could theoretically still appear in search with no snippet; adding `X-Robots-Tag: noindex` server-side would be the fully airtight version, but this isn't an active leak the way the doc implied.
- **Homepage H1 count.** Confirmed **1** on the live site (not 3, not 2) — doc's T-5 claim is false live, not just in code.
- **Footer NAP.** Confirmed correct live (`+1-281-899-0250`, `Houston`) — no `555-QS77` or `Dallas` found anywhere in the live homepage HTML.
- **JSON-LD.** Confirmed live: `Organization`, `WebSite`, `ProfessionalService`, `Service`, `OfferCatalog`, `Offer`, `PostalAddress`, `OpeningHoursSpecification` all present on the homepage. No `FAQPage` was present live before this pass's fix (see below).
- **Testimonials canonical.** Confirmed live, pre-fix: `<link rel="canonical" href="https://theaceservices.com">` — genuinely pointed at the homepage. Fixed in this pass.

---

## Changes made this pass

All changes typecheck clean (`npm run lint` / `tsc --noEmit`) and were verified against a local build/dev server before and after.

1. **Testimonials canonical bug (P0-4)** — [testimonials/page.tsx](src/app/testimonials/page.tsx) now sets its own canonical instead of inheriting the homepage's.
2. **"this is" template bug (O-1)** — removed the stray literal text from [`[slug]/page.tsx:350`](src/app/[slug]/page.tsx:350); was appearing after every service detail bullet, sitewide.
3. **Stat counters showing "1+"/"1%" before animation (O-3)** — the real cause was a hardcoded `` `1${suffix}` `` fallback in [AboutPageClient.tsx:116](src/components/AboutPageClient.tsx:116) (not the `useCountUp` `start` value, which was a secondary inconsistency also fixed) — now falls back to `0`, matching the homepage's counter.
4. **Sitewide stale `meta-keywords` tag (O-6)** — removed the identical 9-term `keywords` array from [layout.tsx](src/app/layout.tsx) (applied to every page regardless of content; Google has ignored this tag since 2009, so it was pure dead weight, not a ranking factor).
5. **Meta description mid-word truncation (O-6)** — [`[slug]/page.tsx`](src/app/[slug]/page.tsx) now truncates at a word boundary (matching the pattern already used elsewhere in `src/cms/queries.ts`) instead of a raw character-count `.slice(0, 160)`.
6. **Missing homepage FAQPage schema (T-7 gap)** — added JSON-LD `FAQPage` markup to [FAQSection.tsx](src/components/Home/sections/FAQSection.tsx) using the 7 FAQ entries already written in `FAQAccordion.tsx` (now exported as `questions`). Service pages already had this; homepage didn't.
7. **Duplicate route `/services/{slug}` vs `/{slug}`** — added a 301 redirect in [next.config.js](next.config.js) consolidating `/services/:slug` into the canonical `/:slug`. Confirmed nothing else in the codebase links to `/services/{slug}` except the route's own self-referential links. The now-unreachable `src/app/services/[slug]/` route directory is dead code but wasn't deleted (blocked by this session's permission settings) — safe for manual cleanup: `rm -rf "src/app/services/[slug]"`.
8. **Duplicate "Pauma Travel Center" project entry (O-5)** — added a 301 redirect from `/projects/pauma-travel-center-2` to `/projects/pauma-travel-center` in `next.config.js`, consolidating the accidental double-entry the CMS extraction produced.
9. **20 zero-data project pages (O-5)** — [projects/[slug]/page.tsx](src/app/projects/[slug]/page.tsx) now sets `robots: { index: false, follow: true }` when a project has `totalAreaSqFt: 0` and `estimatedCost: 0`; [sitemap.ts](src/app/sitemap.ts) excludes the same pages. Pages stay reachable for visitors and internal links but drop out of the index until real data is added — matches the doc's own "Tier 2: noindex until real figures are added" recommendation.

## Deliberately not changed — needs your input, not a code guess

- **"2,893+ projects" vs. 58 shown on `/projects`.** Could be a real lifetime total vs. a portfolio sample, or could be inflated — I can't tell which from the repo. Changing a public numeric claim either direction without knowing the true figure risks creating a false claim in the *other* direction.
- **CEO bio "over half a decade."** Vague, but I don't know the real tenure to replace it with.
- **Reused Mansfield, TX PDF across 3 unrelated projects; PlanSwift/Bluebeam listed twice in the software list.** Needs real, distinct source files/content, not something to fabricate.
- **Global "24-48 hours" marketing claim vs. per-service turnarounds (7-10 days, 3-5 days).** Each service's own stated turnaround is internally consistent; only the *homepage-level* generic "24-48 hours" claim overreaches. Rewriting marketing copy is a judgment call, not a bug fix.
- **Review/AggregateRating schema for testimonials.** Skipped deliberately — the testimonials are explicitly commented in code as `Hardcoded testimonial data`, and the doc itself flags that their authenticity hasn't been confirmed. Adding structured Review markup for unverified testimonials risks a genuine Google spam/structured-data-abuse issue, not just a missed opportunity.
- **The soft-404 bug** (see above) — real trade-off between "fix the status code" and "keep zero-redeploy content updates," needs a decision, not a guess.
