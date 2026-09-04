# Content SEO To-Do — theaceservices.com

**Created:** 2026-09-04
**Companion to:** `seo/seo-todo-2026-09-01.md` — that list stays as-is. It owns URLs, redirects, crawl fixes, schema and the cost-guide/sample-estimate programme. **This list owns content only:** what gets written, who signs it, what gets deleted.
**Sources:** `seo/content-eeat-audit-2026-09-03.md`, `seo/competitor-audit-worldestimating-2026-09-03.md`, `seo/content-workflow-2026-09-03.md`.

---

## Working constraints — read once

1. **The WordPress client in this repo is read-only.** Anything living in WP (blog bodies, the six CMS service pages, excerpts) is a manual paste job. Anything built as a Next.js route is a normal code change.
2. **Build new pages as repo routes, not WP pages.** `/adu-construction-cost/` is the model: `src/app/adu-construction-cost/page.tsx`, full control over headings, schema and internal links, no CMS round-trip. Every new page below follows that pattern.
3. **`npm run pages:build` before `npm run deploy`** — deploy does not build.
4. **Measure in November.** New content needs longer than eight weeks.

**Baseline to beat (Ahrefs, 2026-09-03):** 4 organic keywords · 24 visits/mo · 0 of 63 blog posts ranking for anything · 1 trade page.

---

# Phase 0 — Trust blockers

**Nothing else on this list should ship before these two are closed.** Both are honesty items, and both get worse the more pages you publish on top of them.

> **Gate status 2026-09-04:** item 1 closed, item 2 half closed. The unearned "verified/certified" wording is gone, but the four numbers still carry no stated basis.
>
> **The gate was overridden by the owner and Phase 1 shipped anyway** (worker `33316cd0`). Item 2's remaining half — a stated basis for each of the four figures, needing three facts only the owner has — is still open. It should be closed before Phase 2 adds twelve more pages carrying the same unsupported numbers.

### ☑ 1. Verify the six testimonials

> **DONE 2026-09-04 — none of the six were real, so the page is gone.** Owner confirmed no quote traced to a client record. Deleted `src/app/testimonials/page.tsx` and `loading.tsx`; added a `301 /testimonials → /projects/` in `next.config.js`; removed the URL from `src/app/sitemap.ts`, `src/components/Nav.tsx`, `src/components/Footer.tsx`, the `KNOWN_TOP_LEVEL_ROUTES` set in `src/middleware.ts`, and the static-page cache-header rule in `next.config.js`. Grep confirms zero occurrences of the six names or their companies anywhere in `src/`. `npm run build` passes with no `/testimonials` route.
>
> **Deviation from the spec below:** the "Selected projects" replacement page was deliberately *not* built. `/projects/` already is that page — built from `extracted-projects.json`, which is exactly what the spec asked for — so a second one would cannibalize it. The 301 sends the URL there instead.
>
> No `Review` or `aggregateRating` markup ever shipped, so nothing fabricated reached Google as structured data.

**Where:** `src/app/testimonials/page.tsx:20-90` · **Effort:** 1 hour · **Owner: you, not code**

The block is labelled "Hardcoded testimonial data". Six named people at named firms making specific claims (Sarah Mitchell / BuildRight Construction, David Chen / Apex Development Group, Rachel Torres / Meridian General Contractors, Marcus Webb / Tidewater Public Works, Elena Vasquez / Skyline Architects, James Okafor). Nothing ties any of them to a client record.

Pick one per testimonial:

- **Real** → note the project and date in a comment, keep it, and only then consider `Review` markup.
- **Not real** → delete it.

If fewer than three survive, replace the page with a "Selected projects" page built from `extracted-projects.json` and drop `/testimonials/` from the sitemap and nav.

**Done when:** every quote on the live page traces to a real client, or the page is gone.
**Do not** add `aggregateRating` until this is closed. Fabricated review markup is both a manual-action risk and an FTC problem (16 CFR 465).

### ◑ 2. Substantiate or soften the four headline stats

> **HALF DONE 2026-09-04 — verification language removed, basis lines still owed.**
>
> All four numbers **stay**: the owner confirmed each is backed by a record. What was removed is the claim that someone *outside* the company checked them, which the owner confirmed nobody did — `a verified 89% bid win rate` → `an 89% bid win rate` (`AboutSection.tsx:23`), `Verified Bid Success Rate` → `Bid Success Rate` and `Projects Estimated & Certified` → `Projects Estimated` (`StatsSection.tsx:29,38`). `Double-Verified Precision` (`StatsSection.tsx:56`) was left alone — it describes the in-house two-stage QA rather than claiming outside validation.
>
> **Still open — deferred by the owner 2026-09-04.** The done-condition is not met: the numbers still sit bare. Three facts are needed before the basis lines can be written, and only the owner has them:
> 1. `2,893+` — over what period?
> 2. `89%` — out of how many bids, over what period? (the spec singles this one out as needing a sample size)
> 3. `200+ contractors` — current count, or as of a date?
>
> **Scope correction:** the "Where" line below understates this considerably. The four numbers appear **25 times across 8 files**, not on the hero and `/about-us/` alone — `ChromaticHero.tsx`, `StatsSection.tsx`, `WhyChooseUsSection.tsx`, `TestimonialsSection.tsx`, `AboutSection.tsx`, `AboutPageClient.tsx`, `hero-parallax.tsx`, `src/app/projects/page.tsx` and the `about-us` metadata. Whoever writes the basis lines must cover all of them.

**Where:** homepage hero, `/about-us/`, `/testimonials/` meta description · **Effort:** 1 hour

| Claim | Appears | Action |
|---|---|---|
| "2,893+ projects delivered" | Homepage hero | Check against your records. Verifiable → keep. |
| "35 states served" | Homepage hero | Same. |
| "89% bid win rate" | Homepage hero | Needs a sample size and period, or drop it. |
| "Trusted by 200+ contractors" | Homepage, testimonials meta | Same. |

These are genuinely good differentiators **if** they hold up. Add a one-line basis where you can ("across 2,893 estimates delivered 2019–2026").

**Done when:** each surviving number has a stated basis, or is removed.

---

# Phase 1 — Put a human name on the content

### ☑ 3. Build the author page and swap every byline

> **DONE 2026-09-04 — shipped as a *reviewer* attribution, not an author swap.** Commit `26e226a`, worker version `33316cd0`.
>
> **The spec's premise did not hold.** It says "swap every byline" to a named person, but the owner confirmed the CEO does **not** write the posts — he reviews them. Bylining him as author would have replaced an honest Organization byline with a false personal one, which is the same failure Phase 0 had just finished removing. So `Article.author` stays the Organization, and the review is recorded instead: a visible "Reviewed by Engr. Abdul Manan Zafar" line, plus a `WebPage` node carrying `reviewedBy` → the Person `@id` and `lastReviewed`. `reviewedBy` is only valid on `WebPage` in schema.org, not on `Article`, hence the separate node.
>
> Shipped: `PERSON_ID` + `personSchema` in `src/lib/schema.ts`; `/authors/abdul-manan-zafar/` emitting `ProfilePage` + `Person`; the byline change in `src/app/[slug]/page.tsx`; the sitemap entry; and "over half a decade" → "six years" on `/about-us/`.
>
> **Every claim was verified against his LinkedIn profile before being written** (`https://pk.linkedin.com/in/abdul-manan-3390121b1`): BSc Civil Engineering, UET Lahore 2020; NEBOSH IGC; DHA Multan with the NLC from Aug 2020; Kohistan Builders; two B+G+4 buildings at CITI Housing. **Deliberately excluded as unverified:** a Master's in Construction Project Management that appears only in his profile's free text and not its education section; any PEC or other engineering-body registration; and AACE / CSI MasterFormat expertise, which nothing in his documented background supports — the draft `knowsAbout` in `seo/competitor-pages/comparison-schema.json` claimed both and should not be copied verbatim.
>
> **Verified live:** `/authors/abdul-manan-zafar/` 200 in zero hops; posts emit `reviewedBy` → `#author-amz` with the LinkedIn `sameAs`; author URL in the sitemap; `/about-us/` reads "six years".
>
> **Two open items for the owner, neither blocking:** his LinkedIn headline says "President @ACE Services" while his own summary and this site say CEO — `sameAs` now makes that visible. And his summary still claims "over a year of hands-on experience", written ~2022 and now four years stale, with ACE Services absent from his Experience section entirely.
>
> **Routing note for future pages:** `/authors/<name>/` is two segments, and the `KNOWN_TOP_LEVEL_ROUTES` check in `src/middleware.ts` only applies to single-segment paths — so nested routes need no middleware entry. Single-segment routes still do.

**Effort:** 1 day · **Highest-leverage E-E-A-T fix on the site**

Every post currently reads "By The ACE Services" with `Article.author` set to the Organization. Meanwhile a named civil engineer runs the company and appears only on `/about-us/`.

**Steps:**

1. Create `src/app/authors/abdul-manan-zafar/page.tsx` — bio, credentials, LinkedIn, photo, list of posts authored. ~400 words.
2. Add the `Person` node to `src/lib/schema.ts` (already drafted in `seo/competitor-pages/comparison-schema.json` — copy the `#author-amz` block, replace `REPLACE_WITH_REAL_LINKEDIN_URL`).
3. Point `Article.author` at that `@id` instead of the Organization, in the post template.
4. Change the visible byline to link the author page.
5. Fix the credential line on `/about-us/` — "over half a decade of experience" reads as hedging. State the number, or lead with project volume instead.

**Apply to the technical posts first** (MEP coordination, blueprint reading, change orders, ADU cost). If someone other than the CEO wrote a post, byline them and give them a page too.

**Done when:** `curl` on any post shows a `Person` author with a working `sameAs`, and `/authors/abdul-manan-zafar/` returns 200.

---

# Phase 2 — Take the cheap keywords

This is the traffic move. World Estimating gets 3,755 visits/mo largely from trade pages ranking at **KD 0–14**. You have one trade page. These SERPs are winnable without links.

### ☐ 4. Build the trade page template

**Effort:** half a day · **Do this once, then step 5 is mechanical**

Base it on `/cost-estimating/` — it already has the right shape (FAQPage schema, "How It Works", XLS+PDF deliverable framing, FRE 48).

Template sections, ~1,000–1,200 words:

1. H1: `{Trade} Estimating Services`
2. Answer-first opener: what the deliverable is, what format, what turnaround
3. What we count (scope items specific to that trade)
4. How it works — 4 steps
5. What you receive — Excel + PDF, CSI division breakdown
6. Trades/systems covered
7. FAQ ×5 with `FAQPage` schema
8. CTA + internal links to `/cost-estimating/`, `/calculator/`, related project pages

**Each page must have trade-specific content in sections 3 and 6.** Do not ship 12 pages that differ only in a find-and-replace — that is the exact pattern this site is already carrying 36 posts of (step 9).

### ☐ 5. Ship 12 trade estimating pages

**Effort:** ~3 days after the template · **Target: `/{trade}-estimating-services/`**

Ordered by value. KD from Ahrefs 2026-09-03; CPC shows what a click is worth.

| ☐ | Page | Keyword | Vol | KD | CPC |
|---|---|---|--:|--:|--:|
| ☐ | `/electrical-estimating-services/` | electrical estimating services | 300 | 0 | **$12.11** |
| ☐ | `/hvac-estimating-services/` | hvac estimating services | 300 | 3 | **$10.05** |
| ☐ | `/plumbing-estimating-services/` | plumbing estimator | 250 | 0 | **$9.63** |
| ☐ | `/mechanical-estimating-services/` | mechanical estimating services | 200 | 12 | $6.45 |
| ☐ | `/sitework-estimating-services/` | sitework estimating services | 200 | — | — |
| ☐ | `/drywall-estimating-services/` | drywall takeoff services | 150 | — | — |
| ☐ | `/masonry-estimating-services/` | masonry estimating services | 150 | — | — |
| ☐ | `/concrete-estimating-services/` | concrete estimating services | — | — | — |
| ☐ | `/roofing-estimating-services/` | roofing estimating services | 90 | — | — |
| ☐ | `/steel-estimating-services/` | structural steel estimating services | 90 | — | — |
| ☐ | `/flooring-estimating-services/` | flooring takeoff services | 90 | — | — |
| ☐ | `/millwork-estimating-services/` | millwork estimating services | 200 | 2 | $0.22 |

Link every one from `/services/` and from `/cost-estimating/`, and add them to `src/app/sitemap.ts`.

**Do NOT build the state × trade matrix.** World Estimating has 121 state-prefixed pages and it is the fragile half of their site — same scaled-content pattern as step 9. Take the trade dimension only.

### ☐ 6. Ship four commercial-intent pages

**Effort:** 2 days

| ☐ | Page | Keyword | Vol | KD | Note |
|---|---|---|--:|--:|---|
| ☐ | `/commercial-estimating-services/` | commercial estimating services | **2,200** | **8** | Biggest prize on the list |
| ☐ | `/residential-estimating-services/` | residential estimating services | 250 | 7 | + `residential construction estimator` (200, KD 0) |
| ☐ | `/material-takeoff-services/` | material takeoff services | 200 | 14 | CPC **$12.81** |
| ☐ | `/outsourcing-construction-estimating/` | outsourcing construction estimating | 300 | **1** | Already in your Rank Tracker at position null |

`outsourcing construction estimating` at KD 1 with no page is the clearest miss on the site.

### ☐ 7. Ship the rebar page

**Effort:** half a day · **Single best gap in the competitor audit**

`/rebar-detailing-services/` — `rebar detailing services`, 250/mo, **KD 1**, $4.29 CPC. World Estimating only ranks **#11**. You already sell rebar shop drawings, so this is a real service page, not a keyword grab.

Cross-link with `/shop-drawing-services/`.

---

# Phase 3 — Own the uncontested lane

### ☐ 8. Retarget the three services the category leader doesn't have

**Effort:** 1 day · **Where:** WordPress (these are CMS pages) or `CMS_COPY_OVERRIDES` in `src/cms/queries.ts`

Across World Estimating's entire 273-page sitemap there is **no page** for shop drawings, 3D rendering, or permit sets. You have all three live. Nobody is competing.

| ☐ | Page | Current words | Action |
|---|---|--:|---|
| ☐ | `/shop-drawing-services/` | 1,043 | Add MEP / structural / rebar / millwork sub-sections; link the new rebar page |
| ☐ | `/3d-rendering-services/` | 1,083 | Add use-case sections: client presentations, permit submittals, marketing |
| ☐ | `/permit-set-services/` | 1,054 | Add the jurisdiction/approval angle; link the MEP coordination post |

All three already carry FAQPage schema and read at FRE 55–56 — the best readability on the site outside the ADU page. They need depth and internal links, not a rewrite.

---

# Phase 4 — Delete the liability

### ☐ 9. Consolidate the ~36 scaled posts

**Effort:** 1 week · **Plan already scoped in `seo/orphan-and-consolidation-plan-2026-08-24.md`**

Roughly 36 of ~70 posts are rewordings of each other — the "USA / nationwide / every state / all 50 states / expanding horizons / bridging the gap" cluster. `expanding-horizons` runs 20 H2 sections covering every vertical with depth in none. The Texas post's "case study" is an anonymous Houston client with "over 8% in potential savings". **0 of 63 posts rank for anything.**

**Steps:**

1. List all 36 (`grep -Eic 'usa|u-s-|nationwide|across-|every-state|all-50|expanding|bridging|state-to-state'` against the sitemap gives the set).
2. Pick 4–6 survivors — the strongest state or vertical angles.
3. Rewrite each survivor with real data from the 40 project pages.
4. 301 the rest into the survivors via `src/middleware.ts` (Cluster pattern already established).
5. Add the retired slugs to `BLOG_SLUG_DENYLIST` **and** filter the blog index against it — step 9b of the other todo notes the index and sitemap already drifted apart once.

**Done when:** sitemap post count drops by ~30 and `/blog/` carries zero links that 301.

---

# Phase 5 — Quality passes

Cheap, and they compound across everything above.

### ☐ 10. Add real external citations

**Effort:** 2 days · Nine of eleven pages sampled cite nothing but a Google Maps link.

Add 1–3 authoritative outbound links per post and per service page: **RSMeans**, **AACE International**, **CSI MasterFormat**, **ENR cost indices**, **BLS material price data**, IBC/IRC code sections. You already lean on these implicitly — cite them.

This also fixes a live contradiction: the site claims "AACE Class 3" and "AACE-compliant" repeatedly with no AACE reference anywhere.

### ☐ 11. Break up the long sentences

**Effort:** 3 hours · Target: `/services/` and `/about-us/` first

| Page | Avg sentence | FRE |
|---|--:|--:|
| `/services/` | **38.0 words** | 42.4 |
| `/about-us/` | **37.7 words** | 40.3 |
| `/adu-construction-cost/` | 29.8 | **76.5** |

Target is 15–20 words. Not a ranking factor — it is a conversion and AI-extractability problem: long compound sentences do not lift cleanly as quotable passages. Copy the ADU page's cadence.

### ☐ 12. Replace AI hero images on the top 10 posts

**Effort:** 1 day · 66 of 70 unique blog heroes are `Gemini_Generated_Image_*.png` — the filename discloses it publicly.

You have 40 completed projects. Screenshots of real estimate output, marked-up drawings, CSI division tables and site photos are the strongest Experience signal you own and it is currently unused. Start with the posts that get the most internal links.

---

# Phase 6 — Build the moat

### ☐ 13. Keep publishing original cost data

**Cross-reference:** items 4–6 of `seo/seo-todo-2026-09-01.md` — ADU (shipped), pickleball, car wash, restaurant, and the sample-estimates library. Owned by that list; noted here because it is the same programme.

`/adu-construction-cost/` is the best page on this site — proprietary number in the H1, 16 CSI divisions, FRE 76.5. World Estimating has no calculator, no cost benchmarks, and a portfolio that is 35 logos on one page. This is the one lane where DR 14 does not matter, because original data earns links you did not buy and gets cited by AI answers.

### ☐ 14. Publish a pricing-transparency page

**Effort:** 1 day

World Estimating publishes rates (~$200 single-trade takeoff, $1,500/mo retainer) and you publish nothing, so you lose the "what does this cost" searcher by default.

You do not have to publish a flat rate. Publish **"What construction estimates cost and what drives the number"** — scope, square footage, documentation quality, discipline count — with `/calculator/` embedded. Captures the intent without anchoring you to $200.

---

## Order of operations

| Week | Steps |
|---|---|
| 1 | 1, 2, 3 — trust blockers and authorship |
| 1–2 | 4, 7 — template plus the rebar quick win |
| 2–3 | 5 — 12 trade pages |
| 3–4 | 6, 8 — commercial pages and the uncontested lane |
| 4–5 | 9 — consolidation |
| Ongoing | 10, 11, 12, 13, 14 |

## What to watch

The current baseline is 4 keywords, 24 visits, zero non-brand clicks. The first signal that Phase 2 is working is **non-brand impressions in GSC on the new trade URLs** — expect movement 4–8 weeks after they ship, and judge rankings in November.

Do not judge this by referring-domain count; it drifts on its own.
