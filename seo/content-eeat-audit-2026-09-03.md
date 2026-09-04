# Content Quality & E-E-A-T Audit — theaceservices.com

**Date:** 2026-09-03
**Scope:** Sitewide content quality, E-E-A-T, readability, AI citation readiness
**Method:** Live production fetch (`https://theaceservices.com`, raw server HTML) of 18 pages across every template — homepage, /services/, 4 service detail pages, /about-us/, /contact-us/, /testimonials/, /calculator/, /projects/, /blog/, /adu-construction-cost/, and 5 blog posts spanning the old and new content eras. Sitemap: 123 URLs (40 project pages, ~70 posts/pages).
**Caveat:** Scores below are this skill's heuristics, not Google-internal signals. Google publishes no numeric E-E-A-T weights (only that trust matters most). Search Console is the first-party source for anything traffic-related.

---

## Content Quality Score: 62 / 100

## AI Citation Readiness: 68 / 100

## E-E-A-T Breakdown — 54 / 100

| Factor | Score | Key signals |
|---|---|---|
| Experience | 13 / 20 | 40 named project pages; original ADU cost dataset ($218.54/SF across 16 CSI divisions). But 66 of 70 blog hero images are `Gemini_Generated_Image_*.png` — zero original photography, and the filenames disclose it publicly. Legacy "case studies" are anonymous and unverifiable. |
| Expertise | 14 / 25 | One named credentialed expert exists (Engr. Abdul Manan Zafar, civil engineer, CEO) on /about-us/ — but **no post is bylined to him**. Every `Article` node says `author: {"@type":"Organization"}`. No author bio page, no per-post credentials. Newer posts show genuine domain depth; 36 legacy posts show none. |
| Authoritativeness | 9 / 25 | DR 14, near-zero external citation. Of 11 pages sampled, only 2 posts cite outside sources at all (Autodesk, Investopedia, ScienceDirect, value.fm); the other 9 cite nothing but google.com (a maps link). "AACE-compliant" is claimed repeatedly with no membership or certification evidence anywhere on the site. Internal architecture is the bright spot: /blog/ hub carries 180 internal links, every post ends with a "Keep Reading" module. |
| Trustworthiness | 18 / 30 | HTTPS, full security headers, consistent NAP, privacy policy, T&C, excellent `ProfessionalService` schema with address/hours/geo, visible published + updated dates on every post. Dragged down hard by the testimonials issue below and by unsubstantiated headline stats. |

---

## Google's Who / How / Why test

| Question | Verdict |
|---|---|
| **Who** created it? | ❌ **Weakest link.** Visible byline on every post reads "By The ACE Services". A real, named, credentialed engineer runs the company and appears on /about-us/ — he is invisible everywhere content is actually published. |
| **How** was it created? | ⚠️ No process disclosure. 94% of blog imagery is AI-generated with the generator's name left in the filename, while the prose carries no counterweight — no methodology note, no data sourcing, no editorial review statement. |
| **Why** does it exist? | ⚠️ **Split.** The 2026 posts and the ADU page read as written to help someone. The ~36 "USA / nationwide / every state / all 50 states" posts read as written to attract clicks. |

---

## Findings

### 🔴 CRITICAL — Testimonials are hardcoded with no verifiable source

`src/app/testimonials/page.tsx:20` labels the block "Hardcoded testimonial data". Six quotes are attributed to named individuals at named firms — Sarah Mitchell / BuildRight Construction, David Chen / Apex Development Group, Rachel Torres / Meridian General Contractors, Marcus Webb / Tidewater Public Works, Elena Vasquez / Skyline Architects, James Okafor — with specific claims ("saved us over 15%", "two-day turnarounds"). Nothing in the repo or the CMS ties any of them to a real client record.

Trustworthiness is the heaviest-weighted E-E-A-T factor, and fabricated reviews are also FTC exposure in the US (16 CFR Part 465, in force since Oct 2024), independent of any SEO consequence.

**Fix — verify before anything else.** If these are real: add the source (project, date, permission on file) and consider `Review` markup. If they are placeholders: replace them with real client quotes, or delete the page and the homepage section. Do not add `aggregateRating` in either case until verified reviews exist. Same check applies to the unsourced headline stats used sitewide — "2,893+ projects", "89% bid win rate", "35 states", "200+ contractors" (testimonials meta description). Each needs a stated basis or should be softened.

### 🔴 HIGH — Zero human authorship anywhere in the content

Every `Article` schema node on the site sets `author` to the Organization. Every visible byline reads "By The ACE Services". This is the single cheapest, highest-leverage E-E-A-T fix available: the company already has a named civil engineer as CEO.

**Fix:** byline the technical posts to Abdul Manan Zafar (or whichever estimator actually wrote each), add `Person` schema with `jobTitle`, `knowsAbout`, and `sameAs` → LinkedIn, and create `/authors/abdul-manan-zafar/` as a real bio page linked from every post. Tighten the credential line while you are there — "over half a decade of experience" on /about-us/ reads as hedging around five years; either state the number plainly or lead with project volume instead.

### 🔴 HIGH — ~36 of ~70 posts are scaled, low-value content

Slugs like `expanding-horizons-construction-estimating-solutions-for-every-u-s-state`, `bridging-the-gap-nationwide-estimating-services-for-bridges-parks-and-public-infrastructure`, `nationwide-expertise-supporting-u-s-builders-in-residential-and-commercial-development`, and `how-the-ace-services-helps-builders-across-all-50-states-streamline-estimation-design` are near-duplicates of one another. Sampled prose confirms it:

> "The ACE Services isn't just an estimating company; it's a full-spectrum construction solutions provider… we specialize in: Construction Estimation (Residential, Commercial, Industrial), Design and Planning…"

`expanding-horizons` runs 20 numbered H2 sections covering residential, commercial, industrial, educational, healthcare, public, hospitality, office, retail, warehouse, infrastructure and parks — every vertical, no depth in any. The Texas post's "Case Study: Success in Texas" describes "a recent client in Houston" with "over 8% in potential savings" — no name, no project, nothing checkable. `bridging-the-gap` has 2 real H2s and 24 H3s: a broken hierarchy on top of thin substance.

This is the pattern Google's scaled-content-abuse policy names directly, and it drags the whole domain's quality assessment down — including the good pages.

**Fix (this is the orphan/consolidation plan in `seo/orphan-and-consolidation-plan-2026-08-24.md`, now with content evidence behind it):** consolidate the cluster into a handful of genuinely distinct pages, 301 the rest into them. Pick the strongest state/vertical angles, rewrite with real project data from the 40 project pages you already own, and delete the remainder. Fewer, better pages beat 36 rewordings of the same claim.

### 🟠 MEDIUM — Readability sits well below target on most templates

| Page | Words | FRE | Grade | Avg sentence |
|---|---|---|---|---|
| /adu-construction-cost/ | 1,877 | **76.5** | 10.0 | 29.8 |
| /shop-drawing-services/ | 1,043 | 56.2 | 12.8 | — |
| /permit-set-services/ | 1,054 | 55.8 | 13.0 | — |
| /3d-rendering-services/ | 1,083 | 55.4 | 12.8 | — |
| /cost-estimating/ | 1,132 | 48.0 | 13.8 | — |
| /how-to-read-construction-blueprints/ | 2,078 | 43.2 | 16.0 | — |
| Homepage | 2,592 | 39.3 | 13.7 | 24.0 |
| /mep-coordination-clash-detection/ | 1,908 | 35.5 | 16.8 | — |
| /about-us/ | 1,131 | 40.3 | 17.0 | 37.7 |
| /services/ | 949 | 42.4 | 16.8 | **38.0** |

Target is 60–70 FRE with 15–20 word sentences. Only the ADU page clears it. `/services/` and `/about-us/` average 38 words per sentence — roughly double the target — which is why they read as dense despite adequate length. Readability is not a Google ranking factor (Mueller has said so directly); treat this as a conversion and AI-extractability problem, not a ranking one. Long sentences are harder for AI systems to lift as clean quotable passages.

**Fix:** split the compound sentences on `/services/` and `/about-us/` first — highest ratio of damage to effort. The ADU page is the in-house model to copy.

### 🟠 MEDIUM — Almost no external citation

Nine of eleven sampled pages link to zero authoritative outside sources. For a business whose entire pitch is estimating accuracy, that means never citing RSMeans, AACE International, CSI MasterFormat, ENR cost indices, IBC/IRC code sections, or BLS material price data — all of which the content already implicitly leans on.

**Fix:** cite the standards you actually work to. It costs a sentence per post, and it is the fastest available authoritativeness signal for a DR 14 domain. This also raises AI citation odds — models weight sources that themselves cite primary material.

### 🟠 MEDIUM — Main content ships inside hidden Suspense payloads

Every page's `<main>` contains only a loading skeleton in the initial shell; the real content streams in later in the same response, nested in `<div hidden>` blocks that client-side script swaps in. Word counts in this report were taken from raw `curl` output, so **the text is present in the HTML** — Googlebot renders JS and will see it normally.

The risk is narrower: text extractors that respect the `hidden` attribute before running scripts (some AI crawlers, some social/preview scrapers) may see an empty page. Pages also carry 3–5 `BAILOUT_TO_CLIENT_SIDE_RENDERING` markers.

**Fix:** verify rather than assume — fetch a post with a non-JS extractor and confirm the body text survives. If it does not, move the article body out of the Suspense boundary so it renders in the initial shell. Not urgent for Google; potentially decisive for ChatGPT, Perplexity and Claude citations.

### 🟡 LOW — No original imagery

66 of 70 unique blog hero images are `Gemini_Generated_Image_*.png`. Google's guidance does not penalize AI imagery as such, but a company with 40 completed projects has real takeoffs, markups, drawing sheets and site photos available — the strongest Experience signal it owns, currently unused. Replacing even the top 10 posts' heroes with real screenshots of actual estimate output would do more for E-E-A-T than another 2,000 words.

### 🟡 LOW — Heading hierarchy break on legacy posts

`bridging-the-gap-…` renders 2 H2s and 24 H3s. Fix as part of the consolidation above rather than separately.

---

## What is working (do not touch)

- **The 2026 content is genuinely good.** `/mep-coordination-clash-detection/` and `/how-to-read-construction-blueprints/` use answer-first H2s ("What Is Clash Detection?", "Step 1: Start With the Title Block and Scale"), real specifics, and a clean FAQ block. This is the house style — apply it everywhere.
- **`/adu-construction-cost/` is the best page on the site.** Proprietary per-SF number in the title and H1, 16-division breakdown, size comparison table, FRE 76.5, `Article` + `BreadcrumbList` schema, `dateModified` current. Hard numbers with a clear provenance are exactly what AI Overviews and Perplexity cite.
- **Schema coverage.** `FAQPage` on the homepage and all four service detail pages; `Article` + `BreadcrumbList` on posts; a properly `@id`-linked `@graph` sitewide with full NAP, hours and geo.
- **Word counts now clear every coverage floor.** Homepage 2,592 (was 325 in the 2026-08-27 audit — that HIGH is resolved), service pages 1,043–1,132 against an 800 floor, posts 1,806–2,134 against 1,500.
- **Internal linking.** 24–44 internal links per page, 180 on the blog hub, 258 on /projects/, "Keep Reading" on every post. No orphan risk in the current structure.
- **Metadata discipline.** Every sampled title 37–62 chars, every description 144–170. Consistent, keyword-led, no truncation risk.
- **Images.** 1 missing alt across the whole sample (homepage), WebP throughout.

---

## Recommendations, ordered by impact ÷ effort

| # | Action | Effort | Factor |
|---|---|---|---|
| 1 | **Verify the six testimonials.** Real → add sourcing. Not real → remove today. Same for the "2,893+ / 89% / 200+" stats. | 1 hour | Trust |
| 2 | **Byline the technical posts to a named engineer.** `Person` schema + `/authors/…` bio page + LinkedIn `sameAs`. | 1 day | Expertise |
| 3 | **Consolidate the ~36 scaled posts** into a handful of real pages; 301 the rest. | 1 week | Trust + Authority |
| 4 | **Add real citations** — RSMeans, AACE, CSI MasterFormat, ENR, BLS — one to three per post. | 2 days | Authority |
| 5 | **Confirm non-JS extractors see the article body.** Fix the Suspense boundary only if they do not. | 2 hours | AI citation |
| 6 | **Break up sentences on /services/ and /about-us/** (38 → ~20 words). | 3 hours | Quality + AI |
| 7 | **Swap the top 10 posts' AI heroes** for real estimate output, markups, or project photos. | 1 day | Experience |

Items 1 and 2 are same-week work and move the heaviest-weighted factors. Item 3 is the one that changes the domain's overall quality assessment, and it is already scoped in `seo/orphan-and-consolidation-plan-2026-08-24.md`.
