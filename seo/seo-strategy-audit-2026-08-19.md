# The ACE Services — Comprehensive SEO Strategy Audit

**Date:** 2026-08-19
**Site:** theaceservices.com (Next.js 15 on Cloudflare/OpenNext, headless WordPress blog backend)
**Method:** Live Ahrefs API data (Site Explorer, Rank Tracker, Site Audit, GSC integration, SERP Overview), direct inspection of the live site (DOM, JSON-LD, network), and the codebase. Every figure below is sourced — no invented volumes, rankings, or backlink counts. Where something couldn't be verified, it's labeled **[ASSUMPTION]**.

This builds on — and in a few places corrects — the existing work in [`seo/content-enrichment-strategy-2026-08-18.md`](content-enrichment-strategy-2026-08-18.md) and [`.planning/phases/07-redesign-process/SEO-AUDIT.md`](../.planning/phases/07-redesign-process/SEO-AUDIT.md), written one day prior.

---

## 1. Executive Summary

**Where the site is:** Domain Rating 14, ~20 estimated organic visits/month, and only **4 keywords ranking at all — all four are the brand name itself** (`ace services`, `aceservices`, `ace services inc`, plus one zero-volume fluke). Every one of the 13 commercially-tracked keywords (`construction estimating services`, `material takeoff`, `outsourcing construction estimating`, etc.) currently has **no ranking position** — not "low rank," literally absent from Google's index for those terms, despite several having very low keyword difficulty (KD 1–5). Google Search Console shows a second, broader set of ~30+ queries (warehouse/hotel/education development services, quantity surveying, freelance estimating) generating thousands of impressions — but at positions 15–90, converting to essentially zero clicks.

**Why it's in that position:** This is not primarily a content-volume problem — the site already has well-structured service pages with dedicated SEO copy, FAQs, and benefit blocks, plus JSON-LD Organization/ProfessionalService/Service schema. The blockers are more fundamental:

1. **Authority is thin and dirty.** DR 14 with 465 referring domains, but the highest-authority referring domains are dominated by spam/PBN link-seller sites (`buybacklinks.agency`, `rank-top.click`, `seorankflow.shop`, etc.) — consistent with the disavow work already done, but the live data pulled today still shows this pattern, meaning the disavow file's effect can't yet be confirmed as processed by Google.
2. **A real, live conversion bug is undermining every other effort.** The site-wide footer (rendered on every page) shows a placeholder phone number, `+1 (800) 555-QS77`, and "Dallas Head Office" — neither is real. The actual business is at 16319 Hillside Garden LN, Houston, TX 77084, phone `+1-281-899-0250` (confirmed correct in JSON-LD and on `/contact-us`). The footer number isn't even a clickable `tel:` link. This is a NAP-consistency and trust problem on every single page, not just a cosmetic one. See [§7](#7-on-page-seo-findings).
3. **A real on-page bug**: the homepage renders **3 H1 tags** (two near-duplicate hero headings plus a footer H1), diluting the exact signal Google needs to associate the page with its target keyword.
4. **The competitive set is winnable but was misidentified.** Ahrefs' automated "organic competitors" tool returns noise (Ace Hardware, Aldi, EPA.gov, Facebook — brand-name collisions, not real competitors) because the site has too little ranking data for the algorithm to work. Real, SERP-verified competitors are a fragmented field of DR 10–60 niche estimating firms (`worldestimating.com`, `totaltakeoffs.com`, `estimators.us`, `constructestimates.com`) who win primarily through **state/city location landing pages** and aggressive turnaround/price positioning in titles — a tactic ACE has only half-started.

**Highest-value opportunities, in order:**
1. Fix the footer NAP bug and the triple-H1 bug — near-zero effort, removes active harm.
2. Confirm the disavow file was actually submitted in Google Search Console — the backlink cleanup work already done may not be live yet.
3. Build state/city landing pages for the core estimating service, mirroring the pattern that demonstrably works for every real competitor in this SERP.
4. Claim `outsourcing construction estimating` (KD 1, 300 vol/mo, currently zero competition from ACE) and `material takeoff` (KD 5, 300 vol/mo) — the lowest-hanging fruit on the entire board, confirmed by live KD data.
5. Resolve the disconnect between the "35 states served / nationwide" positioning and the two NYC-targeted keywords with no NYC presence, address, or GBP — pick one geographic strategy.

**What this document does not do:** implement changes, fabricate metrics Ahrefs/GSC don't support, or repeat the already-solid keyword-to-page mapping in `content-enrichment-strategy-2026-08-18.md` — that mapping is still valid and is referenced, not rewritten, below.

---

## 2. Business and Search Landscape

### Business model (verified via `src/data/services.ts`, live site, JSON-LD)
The ACE Services is a **B2B outsourced pre-construction services provider** — general contractors, subcontractors, developers, and architects outsource cost estimating and related pre-construction work to ACE instead of hiring in-house. Four service lines:

| Service | Slug | Turnaround | Starting price |
|---|---|---|---|
| Cost Estimating (AACE Class 3, takeoffs) | `/cost-estimating` | 1–2 days | Custom |
| Architectural Services (shop drawings, permit sets, 3D) | `/architectural-services` | 7–10 days | $50 |
| Structural & Engineering (structural + MEP, PE sealing) | `/structural-engineering` | 7–10 days | $50 |
| Project Management & Scheduling (CPM/Gantt) | `/project-management` | 3–5 days | Custom |

**Value proposition (as marketed):** 24–48hr turnaround, flat per-project fee vs. a $75–120k/yr in-house estimator salary, PlanSwift/Bluebeam-based delivery, "two-stage QA," 2,893+ projects delivered, 35 states served, 89% bid win rate.

**Verified NAP:** 16319 Hillside Garden LN, Houston, TX 77084 · +1-281-899-0250 · info@theaceservices.com (from `/contact-us` and JSON-LD `ProfessionalService`). **[ASSUMPTION]** the street address format reads as residential/small-office rather than a commercial suite — worth confirming this is the address you want indexed and attached to a Google Business Profile.

**Primary conversions:** contact form / "quick estimate" request, the `/calculator` instant-estimate tool, phone call. Phone call is **currently non-functional as a conversion path from any page except `/contact-us`** — see §9.

### US search landscape (Ahrefs Keywords Explorer / Rank Tracker, live)
The 13 keywords already tracked in `management-project 10249049` split cleanly by real difficulty, not assumed tiers:

| Keyword | Volume/mo | KD | Commercial? | Current position |
|---|---|---|---|---|
| construction estimating services | 1,300 | 60 | Yes | Not ranking |
| construction estimating | 1,100 | 19 | Yes | Not ranking |
| construction estimating services nyc | 450 | 43 | Yes | Not ranking |
| construction estimating company nyc | 150 | 44 | Yes | Not ranking |
| construction estimating company | 200 | 50 | Yes | Not ranking |
| construction cost estimating | 300 | 17 | Yes | Not ranking |
| construction cost estimating services | 200 | 17 | Yes | Not ranking |
| construction material takeoff services | 200 | 49 | Yes | Not ranking |
| material takeoff services | 200 | 14 | Yes | Not ranking |
| material takeoff | 300 | 5 | Yes | Not ranking |
| quantity takeoff | 500 | 3 | No (informational) | Not ranking |
| outsourcing construction estimating | 300 | 1 | Yes | Not ranking |
| what is a construction material takeoff | 0 | 5 | No (informational) | Not ranking |

**Realistic difficulty read, lowest to highest:** `outsourcing construction estimating` (KD1) → `quantity takeoff` / `what is a construction material takeoff` (KD3/5, informational) → `material takeoff` (KD5) → `material takeoff services` (KD14) → `construction cost estimating` / `...services` (KD17) → `construction estimating` (KD19) → `construction material takeoff services` (KD49) → `construction estimating company` (KD50) → `construction estimating company nyc` (KD44) → `construction estimating services nyc` (KD43) → `construction estimating services` (KD60, hardest).

**Second, larger demand signal the rank tracker doesn't cover (GSC, live, last 90 days):** the site already gets meaningful impressions — but near-zero clicks — for a distinct cluster the 13-keyword list doesn't include: `warehouse development company` (170 impr., pos. 22), `hotel development it services` (157 impr., pos. 34), `data warehouse development services` (146 impr., pos. 88), `freelance estimating services` (127 impr., pos. 34), `quantity surveyor consultants` (113 impr., pos. 42), `quantity surveyor services` (112 impr., pos. 23), `distribution center site development` (111 impr., pos. 74), `blueprint estimating services` (101 impr., pos. 30), `education building construction` (91 impr., pos. 77), `quantity surveying services` (88 impr., pos. 17), `estimation services` (82 impr., pos. 14). These map to pages that already exist (`/warehouses-development/`, `/freelance-estimation/`, `/quantity-surveyor-services/`, `/hotels-development/`, `/educational-buildings/`) but were never brought into the tracked keyword set or the enrichment strategy. **This is a second content vertical the site is already attempting, half-optimized, and completely unmeasured.**

**Search intent read:** the core cluster is transactional/commercial ("hire someone to do X"), not informational — buyers are GCs mid-bid, time-pressured, comparing price and turnaround. `quantity takeoff` and `what is a construction material takeoff` are the only informational terms and should feed top-of-funnel blog content, not service pages (this matches the existing enrichment doc's Tier assignment).

---

## 3. Technical SEO Findings

Ahrefs Site Audit (project `10249049`, latest crawl 2026-08-18, 198 URLs, health score 97/100 — **this score measures crawl hygiene, not visibility, and should not be read as "the SEO is fine"**):

**Confirmed live issues (crawled counts > 0 in the current snapshot):**
- **47 pages** — title tag too long (Warning)
- **38 pages** — meta description too long (Warning)
- **21 pages** — meta description too short (Warning)
- **4 pages** — multiple H1 tags (Notice) — the homepage is one of them, confirmed live (see §7)
- **15 pages** — canonical tag points from an HTTP to an HTTPS URL (Notice — low severity, but worth normalizing)
- **2 pages** — orphan indexable pages, no incoming internal links (Error) — these pages exist and are indexable but nothing on the site links to them, wasting whatever equity they'd otherwise receive
- **Flagged: "Pages have high AI content levels"** (Notice) — Ahrefs' crawler is flagging AI-generated-content signals somewhere on the site. Combined with the odd blog post titling pattern found in GSC (see below), this needs a manual editorial review — not because AI-assisted content is inherently penalized, but because Google's spam policies target *unhelpful, scaled* content specifically, and thin/formulaic posts are a real risk to the domain's trust as it tries to build authority from near-zero.

**Content-quality flag worth a manual look:** GSC's top-impression URLs include posts like `.../%F0%9F%8F%A8-hotel-development-services-in-usa-building-the-future-of-hospitality/` (an emoji character in the URL slug) and `.../everything-you-need-to-know-about-blueprint-estimation-services-in-usa-process-benefits-and-cost-insights/` — a repeated "Everything You Need to Know About X Services in USA" title template. This pattern (emoji slugs, templated titles, state/service permutation) is consistent with automated content generation. Per the CMS memory on this project, genuine posts live in WordPress category `1` while spam is scattered across other categories — **worth confirming these specific posts are in category 1 and are genuinely reviewed content, not spam-adjacent auto-generation that slipped past the allowlist.** [ASSUMPTION — flagging for verification, not asserting these are spam.]

**Sitemap/robots:** `src/app/sitemap.ts` exists (Next.js route-handler sitemap — correct modern pattern). No static `robots.txt` in `public/`, which is expected if it's also generated via a Next.js route handler — **verify `src/app/robots.ts` exists and is deployed**; if neither exists, Googlebot has no explicit crawl directives, which the Site Audit's "Robots.txt is not accessible" check (currently 0 instances) suggests is not the case, but confirm directly at theaceservices.com/robots.txt.

**Stack:** Next.js 15 on Cloudflare Workers via OpenNext (confirmed via `wrangler.jsonc`, `.open-next/`, `package.json` — this supersedes the stale project memory referencing Vike). This is a strong technical foundation for Core Web Vitals; no CWV data was pulled in this pass (would require PageSpeed Insights / CrUX, not available via Ahrefs) — **flagged as a required follow-up, not fabricated.**

**Data access gap:** Core Web Vitals/CrUX field data, full crawl page-level detail beyond the issue summary, and confirmation of the disavow file's submission status in GSC all require access this session didn't have (Search Console UI/API scopes beyond the connected read integration, PageSpeed Insights). Listed in §21.

---

## 4. Keyword and Search-Intent Strategy

The keyword-to-page assignment matrix in `content-enrichment-strategy-2026-08-18.md` is sound and shouldn't be redone — it correctly applies one-page-one-keyword and prioritizes placement. Two corrections/additions based on today's data:

1. **`outsourcing construction estimating` (KD1, 300 vol) has no assigned page in the existing matrix and is the single easiest keyword on the entire board.** It needs a dedicated page — not enrichment of an existing one, since intent ("should I outsource my estimating") differs from "hire an estimating company." The existing enrichment doc correctly identifies this as out of scope for enrichment-only fixes; it should be **Priority 1** in the next content sprint, not deferred.
2. **The GSC-observed second cluster** (warehouse/hotel/education development services, quantity surveyor services, freelance estimating) needs to be added to the Rank Tracker project and treated as its own mini-strategy — right now it's invisible to the team's own measurement tooling despite already generating real (if unconverted) search demand.

**Reconcile the NYC keywords with reality.** Two tracked keywords (`construction estimating services nyc`, `construction estimating company nyc`, 600 combined monthly volume) target New York City local intent, but the verified business address is Houston, TX with no NYC office, phone, or Google Business Profile evidence found. Local-intent queries are the hardest to rank without a real local signal (GBP, local citations, local backlinks) — spending content effort here without a genuine NYC presence is likely to underperform relative to the nationwide-remote positioning the rest of the site uses. **Decision needed from the business:** either establish a real (even virtual/registered-agent) NYC presence to support these keywords, or drop them in favor of a "nationwide remote outsourcing" angle, which is what the actual value proposition (24–48hr turnaround, flat fee, works from PDF/DWG uploads) already supports far better than a local-office story.

---

## 5. Competitor Analysis

**Ahrefs' automatic competitor detection is unusable here** — with only 4 ranking keywords, its "organic competitors" algorithm returns brand-collision noise: Ace Hardware (DR83), Aldi.us (DR78), EPA.gov (DR93), Facebook, Google, Indeed, LinkedIn, Mapquest. None of these compete for construction estimating traffic; they share the word "ace" or generic terms. **Do not use this list for planning.**

**Real competitors, identified by pulling live SERPs for three keywords across the difficulty range** (`construction estimating services`, `outsourcing construction estimating`, `material takeoff services`):

| Domain | DR | Pattern |
|---|---|---|
| worldestimating.com | 60 | Dominant; state/city landing-page network (Kansas, Georgia, Texas) |
| estimators.us | 61 | "USA Estimators"; state/city pages (Wichita, California) |
| constructionestimator.us | 43 | Turnaround/price-forward titles |
| constructestimates.com | 34 | "24–48 Hr Turnaround" — identical USP to ACE |
| iambuilders.com | 40 | Content/blog authority, ranks via articles not service pages |
| urcadservices.com | 32 | — |
| rockettakeoffs.com | 31 | — |
| buildanestimate.com | 29 | — |
| asestimation.com | 28 | — |
| wilsontakeoffs.com | 24 | — |
| **totaltakeoffs.com** | **10** | Ranks #1–2 repeatedly *despite* DR 10 |
| **advanceestimating.com** | **10** | Ranks top-10 despite DR 10; price-forward title ("@$12/hr") |

**The single most important competitive insight:** `totaltakeoffs.com` and `advanceestimating.com` rank at or near position 1 with DR 10 — lower authority than ACE's own DR 14. In this niche, precise on-page/title relevance is currently beating domain authority. That means ACE's near-zero visibility is **not** primarily an authority ceiling — it's that ACE isn't yet doing what these DR-10 sites are doing on-page (exact-match titles, location-specific landing pages, price/turnaround stated directly in the title tag).

**The structural pattern to copy (not the content, the architecture):** almost every real competitor ranks via **state or city-level landing pages** (`.../construction-estimating-services-kansas/`, `.../texas-construction-estimating-services/`, `.../california/material-takeoff/`). ACE has zero pages of this type for its core estimating service — the closest analog is the unrelated `/warehouses-development/` sector page. This is the single highest-leverage content architecture gap. See §11.

**AI-search / SERP-feature competitors:** a Reddit thread (`r/estimators`) ranks position 1–3 for `outsourcing construction estimating` and is DR 95 — Reddit content is heavily cited by AI Overviews and ChatGPT/Perplexity for exactly this kind of "should I outsource X" query. YouTube also appears on page 1. Neither is a business ACE competes with directly, but both are answer-engine citation competitors worth accounting for in §8.

---

## 6. Content and Topical Authority Strategy

**What exists and is strong:** each of the 4 service pages already has a `seoContent` block (heading, 3-paragraph body with internal cross-links to other services, 3 benefits, 3 FAQs) authored directly in `src/data/services.ts`. This is genuine topical depth, not thin content — the gap is that it isn't ranking, which per §5 is a title/authority problem, not a depth problem.

**What's missing:**
1. **Location pages** for the core estimating service (the #1 gap — see §5, §11).
2. **A dedicated page for `outsourcing construction estimating`** — informational/comparison angle ("in-house vs. outsourced estimating"), which the homepage's existing "In-House Estimating vs. The ACE Services" comparison table could be lifted into as a standalone, deeply-linkable asset.
3. **A verification pass on the GSC-visible second content cluster** (warehouse, hotel, education, freelance-estimation, quantity-surveyor pages) — confirm these are genuinely reviewed/owned content (not spam-adjacent auto-generation, per §3), then apply the same enrichment discipline (one keyword, one page, strong H1/title match) that was already correctly applied to the core 4 service pages.
4. **Blog** — currently a topical hub with no commercial keyword targeting (per the existing enrichment doc, already correctly scoped as informational). Its actual content quality needs the manual review flagged in §3 before investing further link equity into it.

**Consolidation candidates:** `/services/cost-estimating` is confirmed as a duplicate route of `/cost-estimating` (noted in the existing enrichment doc as a canonicalization fix, not yet verified as shipped — check `src/app/services/cost-estimating` still exists and either redirects or canonicalizes).

---

## 7. On-Page SEO Findings

Verified live on the homepage via DOM inspection (not assumption):

- **3 H1 tags render on the homepage:** "Construction Estimating Services — Top Firm in the US", "Construction Estimating Services — Top Pre-Construction Firm in US" (near-duplicate, different text — likely two hero variants both left in the DOM), and "THE ACE SERVICES" (footer). Google uses H1 as a strong on-page relevance signal; three competing, slightly different H1s dilute rather than reinforce it. **Fix: exactly one H1 per page, matching the primary target keyword.**
- **Meta title/description are good:** `The ACE Services — Top Construction and Estimation Company` / description correctly leads with "AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling for general contractors nationwide" — keyword-aligned, appropriate length.
- **JSON-LD is solid and correct:** `Organization`, `WebSite`, `ProfessionalService` (with the *correct* Houston address/phone), and `Service` with an `OfferCatalog` listing all 4 services. This is genuinely good structured data — better than most competitors in this SERP likely have.
- **FAQPage schema is missing** despite 6 visible, well-written FAQ entries on the homepage ("How long does a construction estimate take?", "What is a Class 3 construction estimate?", etc.) — this is a pure markup gap, zero content work needed, and a realistic rich-result/AI-Overview-citation opportunity given §5's finding that these SERPs already show PAA/AI boxes for adjacent questions.
- **HowTo schema missing** for the 4-step process section — already flagged in the existing `.planning/phases/07-redesign-process/SEO-AUDIT.md`, still open.
- No `tel:` link anywhere on the homepage (confirmed via DOM query) — see §9, this is a CRO issue with an SEO/trust dimension (NAP consistency).

---

## 8. Entity, Semantic and AI Search Strategy

**Documented vs. hypothesis, per the master prompt's epistemic rule:** how any specific AI engine weighs signals is not publicly documented by the vendors. The following are informed hypotheses based on observable, common patterns (structured Q&A content, citation-worthy sources like Reddit appearing in these exact SERPs) — not confirmed ranking factors.

- **Entity foundation is genuinely good**: consistent NAP in JSON-LD, `ProfessionalService` + `Service`/`OfferCatalog` schema, consistent branding. This is more than most small B2B services sites have.
- **Gap: no FAQPage/HowTo schema** despite having the source content already written (§7) — the cheapest possible AI-citation improvement available, since AI Overview and answer-engine systems are known to favor pages with clear, structured Q&A markup and direct-answer phrasing.
- **Opportunity: the comparison content already on the homepage** ("In-House Estimating vs. The ACE Services") is exactly the format AI answer engines favor for comparison-intent queries like "outsourcing construction estimating" — but it's currently only on the homepage, not a standalone indexable/citable page (see §6, item 2).
- **Risk: the "high AI content levels" flag from §3.** If blog content reads as templated/low-effort to Google's classifiers, it plausibly reads the same way to LLM-based crawlers evaluating source quality for citation — another reason the manual content review in §3 matters for AI-search visibility, not just classic SEO.
- **First-hand experience signals are thin:** claims like "2,893+ projects," "89% bid win rate," "ISO 9001" appear as marketing copy with no visible backing (case studies, verifiable certificate, named client logos) — for both classic E-E-A-T and AI-citation trust, converting even 3–5 of the portfolio projects into detailed case studies with real specifics would materially strengthen credibility signals.

---

## 9. CRO and Organic Lead Strategy

This is the section with the clearest, highest-confidence findings, because they're verified bugs, not judgment calls.

**Critical — sitewide, live, verified:**
- **`src/components/Footer.tsx:33–34`** hardcodes `"+1 (800) 555-QS77"` and `"Dallas Head Office"` — a placeholder phone number (the `555` prefix is the standard North American fake-number convention) and a city that doesn't match the business's real, verified Houston, TX address. This renders on **every page of the site**, is not a clickable `tel:` link, and directly contradicts the correct information on `/contact-us` and in the JSON-LD schema. Any visitor who doesn't click through to the contact page sees a non-functional phone number and the wrong city. This is actively suppressing calls and, if a bot ever associates the footer text with the business (e.g., via a directory scrape), would create a NAP inconsistency that actively hurts local trust signals. **This should be the single first fix made, independent of any SEO roadmap timing — it's a live conversion leak today, at current traffic.**
- **No `tel:` link exists anywhere except `/contact-us`.** On mobile — the device GCs are most likely browsing from on a job site — there is no tap-to-call anywhere on the homepage, service pages, or footer.

**Working well:**
- Multi-step "Quick Estimate" mini-form (Type → Scale → Plans → Send) on the homepage and a full `/calculator` tool — good low-friction lead capture, appropriate for a "get a number fast" B2B service.
- Real portfolio entries with project name, sector, square footage, and dollar value (`Mechanical Shop`, `Sauce'd House`, etc.) — concrete, believable proof rather than generic stock content.
- The "In-House Estimating vs. ACE" comparison table is a strong, specific conversion argument (cites real salary ranges, software costs) — better than typical vague "why choose us" copy.

**Needs verification, not yet confirmed:**
- `/testimonials` page content wasn't reviewed in this pass — confirm reviews are attributed to real, checkable people/companies rather than generic placeholder testimonials, given the Footer bug shows the codebase does carry some placeholder content into production.
- The stat claims (2,893+ projects, 89% win rate, ISO 9001 certification) have no visible substantiation on the pages reviewed — a certificate badge/link for ISO 9001 and even a handful of named-client case studies would meaningfully increase both conversion trust and E-E-A-T signal.

---

## 10. Authority and Off-Page Strategy

**Current state (Ahrefs, live):** 494 live backlinks from 465 referring domains. Sampling the top 20 referring domains by DR: the large majority are flagged `is_spam: true` by Ahrefs and are recognizable link-selling/PBN operations (`buybacklinks.agency`, `rank-top.click`, `seorankflow.shop`, `ranklinkerpro.shop`, `linkrankpro.shop`, `rankboostly.shop`, `itxoft.com`, `factmags.com`, `rankyour.website`). This is consistent with — and the reason for — the disavow file already produced (`seo/disavow-theaceservices-com-2026-08-18.txt`, 293 domains) and the backlinks report (`seo/theaceservices-com-suspicious-backlinks-2026-08-18.xlsx`, 420 links).

**Update 2026-08-19, later same day:** confirmed directly in Google Search Console's Disavow Links tool — `disavow-theaceservices-com-2026-08-18.txt` is uploaded and accepted: **293 domains and 0 URLs disavowed**, upload timestamp **August 19, 2026, 4:17:57 PM GMT+5**. The domain count matches the file in this repo exactly, so this item is closed — it was submitted, not just written.

Two things to carry forward from this confirmation:
1. **The upload timestamp is today, not 2026-08-18** (that date in the filename is only when the file was generated) — so Google's reprocessing clock starts now. Google gives no "processed" status beyond the upload confirmation, and reprocessing of disavowed domains typically takes **weeks**, not days.
2. The live spam pattern still visible among top-DR referring domains at the time of the original audit pull (earlier on 2026-08-19) reflects the pre-upload state — re-pull Site Explorer's referring-domains list in ~4-6 weeks to see whether Google has actually stopped counting those domains' authority, rather than reading today's numbers as a failure of the disavow effort.

**Legitimate referring domains worth building on:** `apsense.com` (DR73), `bebee.com` (DR67, professional network), `siit.co` (DR66), `dutable.com` (DR62) — thin, but real and not spam-flagged.

**Sustainable link-building opportunities, appropriate to a B2B construction-services niche (no PBNs, no paid schemes, per the master prompt's prohibitions):**
- **Industry directories/associations**: AACE International (the estimating standard ACE already markets against — "AACE Class 3"), CSI (whose MasterFormat ACE already references), general contractor associations (AGC chapters), and construction-industry directories (BuildZoom, Procore's partner directory if applicable) — high relevance, low spam risk.
- **Digital PR angle**: the "in-house vs. outsourced estimating cost" comparison data (salary ranges, software costs) is genuinely citable data journalism material for construction-trade publications (Construction Dive, ENR, For Construction Pros) — a data-driven pitch is more fundable than a generic guest post.
- **Reciprocal/complementary partnerships**: architects, GC associations, and construction software vendors (PlanSwift, Bluebeam — both named on-site already) are natural partners; a case-study or integration mention on a vendor's customer page is a realistic, legitimate link.
- **Unlinked mentions**: not checked in this pass — a brand-mention search (Ahrefs Content Explorer or Google Alerts) for "The ACE Services" / "theaceservices.com" text-only mentions would surface easy link-reclamation targets. Flagged as a required follow-up.

---

## 11. Recommended Website Architecture

Additive to the existing sitemap, based on the competitive pattern in §5:

```
/                                  (homepage — fix H1s, footer NAP)
/services/                         (hub)
  /cost-estimating/                (existing — primary target: construction cost estimating services)
  /architectural-services/         (existing)
  /structural-engineering/         (existing)
  /project-management/             (existing)
/construction-estimating/          [NEW] primary target: construction estimating services (KD60 — the hub page)
  /construction-estimating/{state}/  [NEW] — programmatic, one per top-priority state, mirrors worldestimating.com / estimators.us pattern
/outsourcing-construction-estimating/  [NEW] primary target: outsourcing construction estimating (KD1) + informational "in-house vs outsourced" content lifted from the homepage comparison table
/material-takeoff-services/        [NEW] primary target: material takeoff services + material takeoff
/warehouses-development/           (existing — bring into keyword tracking, verify content quality)
/hotels-development/               (existing — same)
/educational-buildings/            (existing — same)
/freelance-estimation/             (existing — same)
/quantity-surveyor-services/       (existing — same)
/blog/                             (existing — informational hub, needs quality audit per §3)
```

**Do not build the NYC pages** until the geographic-strategy decision in §4 is resolved — building them now risks reinforcing a local-intent story the business can't currently back with a real local presence.

---

## 12. Priority Keyword Map

(Supersedes nothing in the existing enrichment doc's page-assignment table — adds the two gaps it left open.)

| Keyword | Vol | KD | Target page | Status |
|---|---|---|---|---|
| construction estimating | 1,100 | 19 | `/` (homepage) | Existing assignment, valid |
| construction estimating services | 1,300 | 60 | `/construction-estimating/` [NEW hub] | Currently no dedicated page — homepage is overloaded trying to cover both terms |
| construction cost estimating services | 200 | 17 | `/cost-estimating` | Existing assignment, valid |
| construction cost estimating | 300 | 17 | `/calculator` | Existing assignment, valid |
| construction estimating company | 200 | 50 | `/services` | Existing assignment, valid |
| material takeoff | 300 | 5 | `/material-takeoff-services/` [NEW] | Currently unassigned |
| material takeoff services | 200 | 14 | `/material-takeoff-services/` [NEW] | Currently unassigned |
| construction material takeoff services | 200 | 49 | `/material-takeoff-services/` [NEW] | Currently unassigned |
| outsourcing construction estimating | 300 | 1 | `/outsourcing-construction-estimating/` [NEW] | Currently unassigned — easiest keyword on the board |
| quantity takeoff | 500 | 3 | Blog (informational) | Existing assignment, valid |
| what is a construction material takeoff | 0 | 5 | Blog (informational) | Existing assignment, valid |
| construction estimating services/company nyc | 450 / 150 | 43 / 44 | **On hold** pending §4 decision | — |

---

## 13. Recommended New Pages

1. `/construction-estimating/` — hub page for the highest-volume, highest-difficulty term; homepage currently tries to serve this and the brand query simultaneously, which is part of why the H1 duplication in §7 happened.
2. `/construction-estimating/{state}/` × top 5–10 states by contractor density (TX, CA, FL, NY excluding the on-hold NYC-specific pages, GA, NC) — the single highest-leverage architectural change, directly mirroring what every real competitor in §5 already does successfully.
3. `/outsourcing-construction-estimating/` — comparison/informational page, KD1, reuses existing homepage copy.
4. `/material-takeoff-services/` — currently zero dedicated page for a 3-keyword cluster worth 700 combined monthly volume at very low difficulty (5–49).
5. A **case studies** section (2–3 detailed, named-client project write-ups pulled from the existing portfolio) — addresses the E-E-A-T/trust gap in §9 and §8 simultaneously.

---

## 14. Recommended Content Clusters

- **Estimating hub** — `/construction-estimating/` (pillar) → state pages, `/cost-estimating`, `/material-takeoff-services/`, relevant blog posts, all cross-linked.
- **Outsourcing decision cluster** — `/outsourcing-construction-estimating/` (pillar) → "in-house vs outsourced cost" content, case studies, FAQ content targeting the AI-Overview/PAA questions already observed in live SERPs ("Can ChatGPT do construction estimates?", "What are the four types of estimating?").
- **Sector/development cluster** (already exists, needs consolidation) — `/warehouses-development/`, `/hotels-development/`, `/educational-buildings/` grouped under a sector hub, each enriched using the same placement discipline (URL → title → H1 → first 100 words) already correctly applied to the core 4 services.

---

## 15. Internal Linking Strategy

Builds on the link table already specified in `content-enrichment-strategy-2026-08-18.md` §"Internal linking plan" (still valid, not reproduced here). Additions:
- Every new state page links back to `/construction-estimating/` (hub) and to `/cost-estimating` (service detail) using consistent, varied anchor text.
- Fix the **2 orphan indexable pages** identified in the Site Audit (§3) — pull the specific URLs from the Ahrefs Site Audit "Orphan page" issue detail view (not retrieved in this pass — categorical count only) and add at least one internal link to each.
- The homepage's existing "In-House Estimating vs. ACE" table should link out to the new `/outsourcing-construction-estimating/` page once built, rather than staying homepage-only content.

---

## 16. Schema and Structured Data Recommendations

1. **Add `FAQPage` schema** to the homepage (6 FAQs already written, zero content work) and to each service page (each already has a `seoContent.faqs` array in `src/data/services.ts` — this is a markup-only change).
2. **Add `HowTo` schema** for the 4-step process section (open item from the existing `.planning/phases/07-redesign-process/SEO-AUDIT.md`).
3. **Add `LocalBusiness`/`GeoCoordinates`** if a Google Business Profile is created for the Houston address (ties into §4/§10 local strategy) — the current `ProfessionalService` type is a reasonable base but doesn't carry geo-coordinates.
4. Once state landing pages exist (§11), each should carry its own `Service` + `areaServed` (State) entry, distinct from the national `Service` entity already in place.
5. Resolve the "Structured data has schema.org validation error" and "...Google rich results validation error" Site Audit checks — both currently show 0 crawled instances in the latest snapshot, meaning likely clean, but re-verify after the FAQPage/HowTo additions above.

---

## 17. SEO Opportunity Matrix

| # | Problem | Action | SEO impact | Effort | Dependencies | Category |
|---|---|---|---|---|---|---|
| 1 | Fake phone/city in sitewide footer | Fix `Footer.tsx:33–34` with real NAP | Trust/local-signal, indirect | Trivial | None | **Critical** |
| 2 | 3 H1 tags on homepage | Collapse to one H1 matching target keyword | Direct ranking signal | Trivial | None | **Critical** |
| 3 | ~~Disavow status unconfirmed~~ | ~~Verify disavow file is processed in GSC~~ | Removes authority drag | Trivial (verification only) | GSC access | **Done 2026-08-19** — confirmed uploaded and accepted (293 domains); reprocessing takes weeks, re-check referring domains in ~4-6 weeks |
| 4 | Zero visibility on 13 tracked commercial terms | Ship remaining `content-enrichment-strategy` checklist items (mostly unchecked) | Direct | Low (~2–3 hrs, already scoped) | None | **Quick win** |
| 5 | Missing FAQPage/HowTo schema | Add JSON-LD using existing FAQ content | AI/rich-result visibility | Low | None | **Quick win** |
| 6 | No `outsourcing construction estimating` page (KD1) | Build dedicated page | Direct, easiest keyword available | Low–Med | None | **Quick win** |
| 7 | No `material-takeoff-services` page | Build dedicated page | Direct, 700 vol/mo at low KD | Low–Med | None | **Quick win** |
| 8 | 47 pages title-too-long / 38 meta-desc-too-long | Bulk title/meta pass across site | Indirect (CTR, some ranking) | Medium | None | **High impact** |
| 9 | No state/city landing pages for core service | Build `/construction-estimating/{state}/` set | Direct, matches proven competitor pattern | Medium–High | Keyword #6 hub page first | **Strategic** |
| 10 | Backlink profile still spam-dominated at top DR | Continue/verify disavow, pursue legitimate niche links (§10) | Authority | Medium, ongoing | Disavow confirmation (#3) | **Strategic** |
| 11 | GSC second content cluster unmeasured | Add ~15 keywords to Rank Tracker project | Measurement only | Trivial | None | **Quick win** |
| 12 | NYC keywords with no NYC presence | Business decision: build real local signal or drop | Prevents wasted effort | Decision, not build | None | **Critical (decision)** |
| 13 | Possible AI-generated/thin blog content | Manual editorial review of flagged posts | Risk mitigation | Medium | None | **High impact** |
| 14 | Unsubstantiated trust stats (89%, ISO 9001, etc.) | Add verifiable proof (case studies, cert link) | Trust/E-E-A-T | Medium | Case study content | **High impact** |
| 15 | 2 orphan indexable pages | Identify and internally link them | Indirect | Trivial (once identified) | Site Audit page-level pull | **Quick win** |
| 16 | No Core Web Vitals data | Pull PageSpeed Insights/CrUX | Diagnostic only | Trivial | Tool access | **Experimental/diagnostic** |

---

## 18. 90-Day SEO Roadmap

**Weeks 1–2 (Critical fixes, near-zero effort):**
- Fix `Footer.tsx` NAP (#1). *Owner: dev. Success: correct phone/city live sitewide, `tel:` link added.*
- Fix homepage triple-H1 (#2). *Owner: dev. Success: exactly 1 `<h1>` on homepage, verified via DOM inspection.*
- ~~Confirm disavow file processed in GSC (#3).~~ **Done 2026-08-19** — GSC disavow tool confirms 293 domains uploaded and accepted at 4:17:57 PM GMT+5. *Next checkpoint: re-pull Ahrefs referring domains in ~4-6 weeks to see whether the disavowed spam domains have actually stopped counting toward the site's link profile.*
- Ship the remaining unchecked items in `content-enrichment-strategy-2026-08-18.md` (#4). *Owner: dev/content. Success: all 8 checklist items complete, one deploy.*
- Add ~15 GSC second-cluster keywords to the Ahrefs Rank Tracker project (#11). *Owner: whoever owns the Ahrefs project. Success: keywords visible in weekly rank tracker reports.*

**Weeks 3–6 (Quick wins):**
- Add FAQPage + HowTo JSON-LD (#5).
- Build `/outsourcing-construction-estimating/` (#6) and `/material-takeoff-services/` (#7).
- Bulk title/meta-description pass across the 85+ flagged pages (#8).
- Manual content-quality review of the flagged blog posts (#13) — decide keep/rewrite/remove per post.
- Resolve the NYC keyword decision (#12) with the business owner.

**Weeks 7–12 (Strategic build):**
- Build `/construction-estimating/` hub page.
- Build first batch of state landing pages (3–5 states) using the hub + `content-enrichment-strategy` placement discipline.
- Produce 2–3 detailed case studies from the existing portfolio (#14).
- Begin outreach for legitimate niche links (AACE/CSI/AGC directories, PlanSwift/Bluebeam partner pages) (#10).

**Measurement checkpoint at day 90:** re-pull Rank Tracker positions for all 13 (now ~28) tracked keywords; expect the KD 1–19 terms (`outsourcing construction estimating`, `quantity takeoff`, `material takeoff`, `construction cost estimating`, `construction estimating`) to show first movement into page 3–5 territory. If they show zero movement despite the fixes above, the authority problem (§10) is worse than current data suggests and needs escalated link-building investment.

---

## 19. 6–12 Month Growth Roadmap

- **Months 4–6:** Expand state landing pages to 10–15 states; complete the sector/development page cluster consolidation (§14); formalize a Google Business Profile if the NYC decision (§12) resolves toward "drop NYC, go nationwide-remote" — a GBP for Houston strengthens the *national* trust story too, not just local Houston search.
- **Months 6–9:** Digital PR push using the in-house-vs-outsourced cost data (§10) targeted at construction trade press; evaluate whether `construction estimating services` (KD60, the hardest tracked term) is realistically reachable yet given DR growth, or whether effort is better spent deepening the state-page network.
- **Months 9–12:** Reassess AI-search visibility — check whether FAQPage/HowTo markup and the outsourcing-comparison content are being surfaced in AI Overviews or cited by ChatGPT/Perplexity for the target queries (manual spot-checks, since no API reliably reports this); expand into case-study-driven content at scale if the initial 2–3 (§18) show engagement.

---

## 20. Measurement and KPI Framework

Primary source: the existing Ahrefs project (`10249049`) Rank Tracker + connected GSC integration — already in place, no new tooling required.

| KPI | Source | Cadence | Current baseline (2026-08-19) |
|---|---|---|---|
| Ranking position, tracked keywords | Rank Tracker | Weekly | 0/13 ranking |
| Organic clicks/impressions by query | GSC integration | Weekly | ~20 est. visits/mo (Ahrefs); GSC shows impressions but near-0 clicks on non-brand terms |
| Domain Rating | Site Explorer | Monthly | 14 |
| Referring domains (spam vs. clean split) | Site Explorer | Monthly | 465 total; top-DR sample majority spam-flagged |
| Site Audit health score + issue counts | Site Audit | Per crawl | 97/100 headline; 47/38/21/4/2 issue counts detailed in §3 |
| Organic conversions (form submits, calculator completions, calls) | **Not currently instrumented for organic-source attribution** — requires GA4/analytics event review, not available this session | — | **[DATA GAP — see §21]** |

**The most important missing measurement:** there's no confirmed lead-source attribution tying organic traffic to actual form submissions/calls, so "organic revenue potential" (a required success metric) cannot currently be calculated, only modeled from search volume. Setting up conversion-goal tracking (GA4 events on the quick-estimate form, calculator completion, and — once fixed — the `tel:` click) should be an early priority so the 90-day checkpoint can measure leads, not just rankings.

---

## 21. Required Tools and Data Access

Confirmed available and used in this audit: Ahrefs API (Site Explorer, Rank Tracker, Site Audit, SERP Overview, connected GSC integration), live site DOM/JSON-LD inspection, repository access.

**Not available this session — required for full execution:**
- Full Google Search Console UI/API access (to confirm disavow processing status, review full Coverage report, check manual actions)
- Google Analytics / GA4 (or whatever analytics is installed — Vercel Analytics is referenced in git history) for conversion-source attribution
- PageSpeed Insights / CrUX for Core Web Vitals field data
- Google Business Profile access (to confirm whether one exists, and if so what NAP it currently shows — critical given the footer NAP bug found in §9)
- Ahrefs Site Audit page-level detail (this pass pulled issue-category counts; per-URL detail for the 2 orphan pages and the "high AI content" flag needs a follow-up pull with more budget)

---

## Second-pass quality check

- Understood what the company sells: yes — outsourced pre-construction services (estimating, architectural, structural/MEP, PM), verified against `services.ts` and live site, not assumed from the name.
- US search landscape researched: yes, via live Ahrefs Keywords Explorer/Rank Tracker data, not estimated.
- Correct competitors identified: yes — explicitly rejected Ahrefs' automated list as noise and re-derived from live SERP data instead; this was the single most important correction made mid-investigation (a graph principle explicitly called for in the task).
- Evidence separated from assumption: yes, flagged inline with **[ASSUMPTION]** markers where verification wasn't possible this session.
- Technical, content, authority, entity/AI, and CRO all investigated with live data, not generic advice.
- Recommendations connected to business outcomes: yes — every Critical/Quick-win item ties back to the zero-visibility finding in §1.
- Dependencies and priority identified: §17 matrix, §18–19 roadmaps.
- No fabricated metrics: every number in this document traces to a specific tool call made during this session; data gaps are listed in §21, not filled in.
