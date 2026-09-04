# Remaining SEO Tasks — Implementation Guide

**Created:** 2026-08-19
**Scope:** The 8 audit items still open after the 2026-08-19 fix pass
**Codebase:** `D:\ace2` — Next.js 15 App Router on Cloudflare Workers (OpenNext), headless WordPress at `cms.theaceservices.com`

Every file path, line number, and data figure below was verified directly against the repo and live site on 2026-08-19. Where the Google Doc audit was **wrong or incomplete**, that's flagged inline — do not trust the original doc on those points.

---

## Before you start: three facts that change the plan

These were discovered while verifying the audit and they invalidate parts of the original recommendations.

### Fact 1 — There is no city/state data. At all.

All **58 of 58** projects have `location: "USA"`. Only **2 of 58** titles contain a US state code (`amicable-ct`, `detroit-mi-2nd-ave`).

This means the audit's repeated advice to "add city/state to project H1s" **cannot be executed from existing data**. Any task depending on location must first solve data sourcing (see [Task 1, Step 2](#step-2-decide-your-location-strategy-blocking-decision)).

### Fact 2 — Asset reuse is 3× worse than the audit reported.

The audit named one reused PDF. There are **three**, plus **six** reused images:

| Reused PDF | Projects sharing it |
|---|---|
| `Concrete-Sample-305-Regency-Parkway-Mansfield-TX.pdf` | `regency-parkway-mansfield`, `detroit-mi-2nd-ave`, `aquazzurra-drywall` |
| `Plumbing-Sample-First-Chinies-Baptist-Church-Plumbing-Rev00.pdf` | `first-chinies-baptist-church`, `capital-grill-3500-west-olive` |
| `Tiles-Countertops-Estimate-Pauma-Travel-Center...pdf` | `pauma-travel-center`, `pauma-travel-center-2` |

| Reused image | Count | Projects |
|---|---|---|
| `WhatsApp-Image-2024-10-21-at-9.44.07-PM-1.jpeg` | 3 | `polytechnic-institute`, `sundial-dr`, `pause-southlake` |
| `WhatsApp-Image-2025-03-22-at-01.11.12_b152bc7c-1.jpg` | 2 | `pauma-travel-center`, `estimate-1014` |
| `Pinnacle.jpg` | 2 | `pinnacle-montessori-school`, `planet-fitness` |
| `South-Lofy-2.jpg` | 2 | `e-avenue-j-grand-prairie`, `fortox-retail` |
| `Amicable.jpg` | 2 | `amicable-ct`, `lucky-hair-salloon` |
| `Laterals.jpg` | 2 | `special-laterals-replacement`, `ladder-shop-drawing` |

> **Correction to my earlier report:** I previously told you "no WhatsApp-screenshot image found." That was wrong — I only searched `public/`. The WhatsApp files are CMS-hosted and referenced in `extracted-projects.json`. The audit's O-8 claim was correct.

### Fact 3 — The jargon is not where the audit said it was.

The audit attributed `"Algorithmic Quantity Takeoff… exhaustive computational dissection"` to service page copy. It's actually a **hardcoded array on the project template**: [`src/app/projects/[slug]/page.tsx:430-451`](../src/app/projects/[slug]/page.tsx#L430). It renders identically on all 58 project pages. Fixing it there fixes 58 pages at once — much cheaper than the audit implied.

---

## Task 1 — Dynamic project H1s (C-1 / O-4)

**Problem:** [`src/app/projects/[slug]/page.tsx:189-192`](../src/app/projects/[slug]/page.tsx#L189) hardcodes one H1 for all 58 project pages:

```
Accurate Estimates Behind Successful Construction Bids
```

Google sees 58 pages claiming the identical primary topic. None can rank for its own project.

### Step 1 — Confirm the current state

```bash
grep -n "Accurate Estimates Behind" "src/app/projects/[slug]/page.tsx"
```

Expect exactly one hit at line 190. If you get zero hits, someone already changed it — stop and re-read the file before continuing.

### Step 2 — Decide your location strategy (BLOCKING DECISION)

Because of [Fact 1](#fact-1--there-is-no-citystate-data-at-all), you must pick one before writing code:

| Option | What it gives you | Cost | Recommendation |
|---|---|---|---|
| **A. Skip location entirely** | H1 = title + trade/scope. Unique, honest, ships today. | Zero | **Start here.** Unblocks the fix immediately. |
| **B. Backfill real locations** | H1 = title + city/state. Strongest local SEO. | Manual: open 58 PDFs, record the project address in the CMS | Do this second, as a data project |
| **C. Derive from titles** | Covers 2 of 58 | Near zero | Not worth it alone |

Option A is not a compromise on correctness — it's the only option that doesn't require inventing data. Ship A now, upgrade to B later without touching the template again (the template reads `project.location`; fixing the data upgrades the H1 automatically).

### Step 3 — Add a location-aware H1 builder

Add above the page component in [`src/app/projects/[slug]/page.tsx`](../src/app/projects/[slug]/page.tsx):

```tsx
/**
 * Per-project H1. Falls back cleanly when data is thin:
 * "USA" is the placeholder location on every extracted project, so it is
 * treated as absent — appending it would add noise, not a local signal.
 * Once real city/state values are backfilled into the CMS, this starts
 * emitting them with no template change.
 */
function buildProjectH1(project: ProjectDetail): string {
  const hasRealLocation =
    project.location &&
    project.location.trim().toUpperCase() !== 'USA' &&
    project.location.trim() !== '';

  const trade = project.scope?.[0];

  const parts = [
    `${project.title} Cost Estimate`,
    trade ? `— ${trade}` : '',
    hasRealLocation ? `in ${project.location}` : '',
  ];

  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}
```

### Step 4 — Use it in the H1

Replace lines 189–192:

```tsx
<h1 className="font-[family-name:var(--font-space)] text-5xl font-bold leading-tight text-on-background md:text-7xl lg:text-7xl max-w-4xl">
  {buildProjectH1(project)}
</h1>
```

> The old markup wrapped half the text in `<span className="text-primary">` for the orange accent. If you want to keep that look, split on the em-dash instead of dropping the span — but **do not** re-introduce two separate text nodes that read as two different headings.

### Edge cases and how to handle them

| Edge case | Real example | Handling |
|---|---|---|
| **Location is the literal string "USA"** | All 58 projects today | Guard above treats it as absent. **Do not** emit "in USA" — it's noise Google won't reward. |
| **Junk / non-descriptive title** | `estimate-1014` → "Estimate 1014" | Produces "Estimate 1014 Cost Estimate" — meaningless. Either rename in CMS or leave noindexed (it already is, zero-stat). |
| **Title already contains the location** | `detroit-mi-2nd-ave` → "Detroit MI, 2nd Ave" | With Option A this is fine. With Option B you'd get "Detroit MI, 2nd Ave … in Detroit, MI" — dedupe before enabling B. |
| **Empty `scope[]` array** | None today (58/58 populated) | `trade ? … : ''` already handles it. Don't assume it stays populated — CMS edits can empty it. |
| **Very long titles** | Longest current title ~40 chars | H1 has no length limit for SEO, but check mobile rendering at 375px. `max-w-4xl` already constrains it. |
| **Duplicate H1 after dedup** | `fellas-car-wash` vs `fella-carwash` | These may be the same project twice (audit flagged, unconfirmed). Resolve via [Task 5](#task-5--asset-reuse-and-duplicate-projects-o-5). |

### Step 5 — Verify

```bash
npm run lint
```

Then, with `npm run dev` running, confirm three different projects emit three different H1s and exactly one `<h1>` each:

```bash
curl -s http://localhost:3000/projects/mechanical-shop | grep -o "<h1[^>]*>.\{0,90\}"
```

Repeat for `sauce-d-house` and `paris-baquette`. All three must differ.

---

## Task 2 — Heading hierarchy (C-2)

**Problem:** the project template's heading order is **H1 → H4 → H2 → H2 → H3 → H2 → H2**. The H4 appears before any H2 exists.

Verified positions in [`src/app/projects/[slug]/page.tsx`](../src/app/projects/[slug]/page.tsx):

| Line | Tag | Content | Issue |
|---|---|---|---|
| 189 | `h1` | Project title | OK after Task 1 |
| **239** | **`h4`** | Sidebar "Featured project" card title | **Breaks sequence — H1→H4** |
| 282 | `h2` | Project title (repeat) | Duplicates H1 topic |
| 401 | `h2` | "From Blueprint to Bid-Ready Estimate" | OK |
| 416 | `h3` | Process step titles | OK (nested under 401) |
| 463 | `h2` | "View the Full Estimate PDF" | OK |
| 527 | `h2` | CTA heading | OK |

### Step 1 — Fix the sidebar H4 (line 239)

The `FeaturedProjectCard` is a **navigation link**, not document structure. It should not be a heading at all.

```tsx
// Line 239 — was <h4 className="truncate …">
<span className="block truncate font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary">
  {project.title}
</span>
```

Keep every class; add `block` because `<span>` is inline by default and `truncate` needs a block box to work.

> **Why not just change `h4` → `h3`?** Because a sidebar of related links isn't a section of this document. Demoting it to a `span` is both more correct semantically and removes the sequence break — one change, two problems solved.

### Step 2 — Resolve the duplicated topic at line 282

Line 282's H2 renders `{project.title}` — the same subject as the new H1. Change it to describe the *section*, not repeat the page topic:

```tsx
<h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl">
  Project Overview
</h2>
```

The title still appears in the H1 and in the `<p>` beneath, so nothing is lost visually. If you'd rather keep the title visible here, make it a `<p>` with the same styling.

### Step 3 — Leave the eyebrow labels alone

There are 8 styled `<div>` eyebrows (lines 103, 185, 255, 343, 370, 397, 459, 524) with text like "Project Detail", "Our Process". The audit suggests converting them to headings. **Don't.** They're 12px decorative labels; promoting them creates a second competing heading immediately above each real H2. Leaving them as `<div>` is correct.

### Edge cases

| Edge case | Handling |
|---|---|
| **CSS depends on the `h4` selector** | Check for `h4` in the stylesheets before changing: `grep -rn "h4" src/app/globals.css`. Styling here is utility classes, so this is very unlikely. |
| **Conditional sections change heading order** | `SampleReportSection` (463) always renders; process (401) always renders. Order is stable. If you add conditional sections later, re-verify the sequence. |
| **Zero-stat projects render fewer sections** | They're already `noindex`, so heading order there matters less — but the fix applies to them anyway since it's template-level. |

### Step 4 — Verify

```bash
curl -s http://localhost:3000/projects/mechanical-shop | grep -o "<h[1-6]" | sort | uniq -c
```

Expect: one `<h1`, several `<h2`, several `<h3`, and **zero `<h4`**. Confirm no H3 appears before the first H2 by checking document order:

```bash
curl -s http://localhost:3000/projects/mechanical-shop | grep -o "<h[1-6]" | head -8
```

---

## Task 3 — De-jargon the process copy (C-3)

**Problem:** [`src/app/projects/[slug]/page.tsx:430-451`](../src/app/projects/[slug]/page.tsx#L430) — a hardcoded `processSteps` array rendering on all 58 project pages.

Current copy:

| Step | Current (jargon) | Suggested replacement |
|---|---|---|
| 1 | "Structural Data Ingestion" / "Transmit your blueprints … through our secure server channel." | **"Send Us Your Plans"** / "Upload your blueprints, drawings, and site measurements through our secure portal. We accept PDF, DWG, DXF, and scanned documents." |
| 2 | "Algorithmic Quantity Takeoff" / "Our surveyors perform exhaustive computational dissection using localized material standards databases." | **"We Measure Every Quantity"** / "Our estimators measure materials and labor from your drawings using current regional pricing data." |
| 3 | "Dual-Stage Verification Review" / "…parallel reviews by principal civil engineers to filter variances before compilation." | **"Two Engineers Check the Numbers"** / "A second senior estimator reviews every line before it reaches you, so errors are caught before you bid." |
| 4 | "Delivery Protocol Transmission" / "Final cost-schedules delivered with interactive spreadsheets and stamped PDF dossiers." | **"You Get Bid-Ready Files"** / "You receive an editable Excel cost breakdown and a formatted PDF report, ready to submit with your bid." |

Why this matters beyond readability scores: these four steps are the clearest plain-language description of *what the company actually does* anywhere on the site. That makes them prime material for AI-answer citation — but only if they're written in the language buyers actually use.

### Step-by-step

1. Open [`src/app/projects/[slug]/page.tsx`](../src/app/projects/[slug]/page.tsx), find `const processSteps = [` at line 430.
2. Replace the four `title` / `description` pairs with the plain-language versions.
3. Keep the array shape identical — four objects, `title` + `description` keys. The renderer at line 406 maps over it and expects exactly those keys.
4. Do **not** change the number of steps without also checking the grid: line 405 is `md:grid-cols-4`. Five steps would wrap awkwardly; three would leave a gap.

### Also fix these (same jargon problem, different files)

| File | Line | Current text |
|---|---|---|
| [`src/components/Footer.tsx`](../src/components/Footer.tsx#L74) | 74 | "Parametric estimating precision … Eliminating manual error thresholds." — renders on **every page** |
| [`src/components/Home/sections/CalculatorSection.tsx`](../src/components/Home/sections/CalculatorSection.tsx#L19) | 19 | "Adjust parametric multipliers to generate class-3 budgetary allocations…" |
| [`src/components/AboutPageClient.tsx`](../src/components/AboutPageClient.tsx#L196) | 196 | "Active volumetric viewport tracking" |
| [`src/components/Home/sections/AboutSection.tsx`](../src/components/Home/sections/AboutSection.tsx#L71) | 71 | "Active volumetric viewport tracking" |

The Footer one is highest-value — it's sitewide.

### Edge cases

| Edge case | Handling |
|---|---|
| **Text length affects layout** | `TextRepel` in the Footer animates per-character. Much longer text = more DOM nodes and a slower effect. Keep the replacement roughly the same length. |
| **"Volumetric viewport tracking" labels a 3D widget** | It's a caption on a live 3D model, not marketing copy. "Interactive 3D model" is accurate and clearer. |
| **Don't over-correct into vagueness** | Keep the specifics — "AACE Class 3", "CSI MasterFormat", "PDF, DWG, DXF" are industry terms buyers search for. Cut invented jargon ("computational dissection"), keep real standards. |

### Verify

```bash
grep -rn "computational dissection\|parametric multipliers\|volumetric viewport" src/
```

Must return zero results.

---

## Task 4 — Content depth and keyword architecture (O-10 / O-11)

**Correction to the audit first:** it claims service pages have 550–700 words. The live rendered page is **3,405 words** (measured on `/cost-estimating`, full text extraction). The audit measured only the `seoContent` block in `services.ts` (~480–640 words) and missed CMS-injected `wpContent`.

**So the "thin content" finding is largely wrong.** Do not rewrite service pages for length. The real gap is architectural: **4 service pages exist where the old site had ~12**, and the highest-opportunity keywords have no dedicated page.

### Priority order (from the 2026-08-19 strategy audit's live Ahrefs data)

| Page to build | Target keyword | Volume | KD | Why first |
|---|---|---|---|---|
| `/outsourcing-construction-estimating` | outsourcing construction estimating | 300 | **1** | Lowest difficulty on the entire board |
| `/material-takeoff-services` | material takeoff + material takeoff services | 500 combined | 5 / 14 | Three-keyword cluster, no page exists |
| `/construction-estimating` | construction estimating services | 1,300 | 60 | Highest volume; hardest — do it third |

### Step-by-step for each new page

1. **Check the slug isn't already live.** The `[slug]` route resolves against WordPress, so a slug may already return content:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" https://theaceservices.com/outsourcing-construction-estimating
   ```
   A `200` means WordPress already serves something there — edit that CMS page instead of creating a route, or you'll create a conflict.

2. **Decide CMS page vs. hardcoded route.** Two mechanisms exist:
   - **WordPress page** (recommended for content pages) — create it in the CMS; `[slug]/page.tsx` picks it up automatically, no deploy needed.
   - **Hardcoded service** — add to `services.ts`; gets the full service template with FAQs, stats, schema.

   For these three, use **hardcoded services** — they need the FAQ schema and stats blocks that the service template provides.

3. **Add to [`src/data/services.ts`](../src/data/services.ts).** Copy the shape of the existing `cost-estimating` entry. Required fields (from the `Service` type): `id`, `slug`, `title`, `tagline`, `category`, `description`, `summary`, `details[]`, `features[]`, `icon`, `startingPrice`, `turnaround`, `stats[]`, `process[]`, `ctaLabel`, and `seoContent` (`heading`, `body[]`, `benefits[]`, `faqs[]`).

4. **`seoContent.faqs` is not optional in practice** — it's what generates FAQPage schema at [`src/app/[slug]/page.tsx:147-165`](../src/app/[slug]/page.tsx#L147). Omitting it silently drops your rich-result eligibility. Write at least 3 real FAQs.

5. **Add internal links.** A new page with no inbound internal links is an orphan. At minimum, link from `/services` hub and from the most related existing service page.

6. **Confirm it's in the sitemap.** [`src/app/sitemap.ts`](../src/app/sitemap.ts) maps over `services`, so hardcoded services are included automatically. CMS pages are **not** — they only appear via the blog-posts query. If you go the CMS route, add them explicitly.

### Edge cases

| Edge case | Handling |
|---|---|
| **Slug collides with an existing WP page** | `getServiceEnriched()` runs *before* the blog lookup in [`resolveSlug`](../src/app/[slug]/page.tsx), so a hardcoded service **wins** over a same-slug WP page. The WP page becomes unreachable — check first (step 1). |
| **Keyword cannibalization** | `/cost-estimating` already targets "construction cost estimating services". A new `/construction-estimating` competes with both it and the homepage. Assign one primary keyword per page and make the H1/title reflect only that one. |
| **New page has no `wpContent`** | The template branches at [`[slug]/page.tsx:334`](../src/app/[slug]/page.tsx#L334): with `wpContent` it renders CMS HTML, without it renders `description` + `details[]` bullets. Both work — just make sure `details[]` is populated or the page looks empty. |
| **`generateStaticParams` doesn't include it until rebuild** | Hardcoded services are in `services.map()` so they prerender on next build. Before that they render on-demand — correct, just slower on first hit. |
| **Building all three at once** | Don't. Ship `/outsourcing-construction-estimating` alone, wait ~3 weeks for indexation signal, then decide. Three thin pages beat none, but one good page beats three thin ones. |

---

## Task 5 — Asset reuse and duplicate projects (O-5)

**This is a data problem, not a code problem.** No code change can create the missing PDFs. See [Fact 2](#fact-2--asset-reuse-is-3-worse-than-the-audit-reported) for the full reuse map.

### Why it matters beyond SEO

Three unrelated projects link to a PDF titled `…Regency-Parkway-Mansfield-TX.pdf`. A prospect who downloads the "Detroit MI" estimate receives a document for a Texas project. That's a **credibility failure with a real client in the loop**, independent of any ranking effect.

### Step 1 — Triage each reuse case

For each of the 3 PDFs and 6 images, determine which is true:

- **(a) Genuinely the same project entered twice** → merge; 301 the loser. *(Confirmed for Pauma — already redirected.)*
- **(b) Different projects, wrong file attached** → attach the correct file, or remove the PDF block for that project.
- **(c) Different projects, correct file genuinely missing** → remove the sample-report section for that project rather than showing someone else's document.

### Step 2 — Handle "no correct PDF exists" (the common case)

Make the sample-report section conditional instead of always rendering. In [`src/app/projects/[slug]/page.tsx`](../src/app/projects/[slug]/page.tsx), the `SampleReportSection` (line 455) renders unconditionally. Gate it:

```tsx
{project.pdfUrl && !SHARED_PDFS.has(project.pdfUrl) && (
  <SampleReportSection project={project} />
)}
```

with, near the top of the file:

```tsx
/**
 * PDFs known to be attached to more than one project. Until each project
 * has its own document, showing a shared one is worse than showing none —
 * a prospect downloading the "Detroit MI" estimate would receive a
 * Mansfield TX document. Remove entries here as real PDFs are attached.
 */
const SHARED_PDFS = new Set([
  'https://cms.theaceservices.com/wp-content/uploads/2024/10/Concrete-Sample-305-Regency-Parkway-Mansfield-TX.pdf',
  'https://cms.theaceservices.com/wp-content/uploads/2024/10/Plumbing-Sample-First-Chinies-Baptist-Church-Plumbing-Rev00.pdf',
]);
```

> Verify the exact URLs first — the constant must match `pdfUrl` byte-for-byte:
> ```bash
> node -e "const p=require('./src/data/extracted-projects.json').projects;const m={};p.forEach(x=>(m[x.pdfUrl]=m[x.pdfUrl]||[]).push(x.slug));Object.entries(m).filter(([,v])=>v.length>1).forEach(([k,v])=>console.log(k,'\n  ',v.join(', ')))"
> ```

**Keep the PDF on its rightful owner.** `regency-parkway-mansfield` legitimately owns the Mansfield PDF — a slug-aware allowlist is better than blanket suppression if you want to preserve that.

### Step 3 — Replace WhatsApp screenshot images

`WhatsApp-Image-*.jpeg` used across 5 projects. These are phone screenshots used as featured images — low quality, non-descriptive filename, and a trust signal problem on a page selling engineering precision. Replace with real project photos or a branded placeholder. This is a CMS media task.

### Step 4 — Resolve the suspected duplicate pair

`fellas-car-wash` and `fella-carwash` both exist and both have zero stats. Open both PDFs and confirm whether they're the same deliverable. If yes, 301 one to the other in [`next.config.js`](../next.config.js) following the existing Pauma redirect pattern.

### Edge cases

| Edge case | Handling |
|---|---|
| **`dedupeSlugs` masks true duplicates** | [`src/data/projects.ts:15-28`](../src/data/projects.ts#L15) renames the second same-slug entry to `-2`. Raw JSON has both as `pauma-travel-center`; the dedup makes them look like distinct projects. Always audit the **raw JSON**, not `getAllProjects()` output. |
| **Removing PDFs empties thin pages further** | 20 zero-stat projects are already `noindex` + sitemap-excluded. Removing their PDF block leaves very little — consider whether those pages should exist at all. |
| **Fixing data in CMS doesn't update the site** | `extracted-projects.json` is a **build-time snapshot** generated by `npm run extract`. CMS edits require re-running extraction **and** a rebuild+deploy. |
| **Re-running `npm run extract` may reshuffle slugs** | If a title changes, its slug changes, and the old URL 404s. Diff before/after and add redirects for any changed slug. |

---

## Task 6 — Resolve the "2,893 projects" claim (O-3)

**Status: needs a business decision. Do not guess.**

`2,893+` appears in at least 7 places while `/projects` displays 58:

| File | Line |
|---|---|
| [`src/app/about-us/page.tsx`](../src/app/about-us/page.tsx#L7) | 7, 14 (meta description) |
| [`src/app/projects/page.tsx`](../src/app/projects/page.tsx#L105) | 105 |
| [`src/components/AboutPageClient.tsx`](../src/components/AboutPageClient.tsx#L150) | 150, 281 |
| [`src/components/Hero.tsx`](../src/components/Hero.tsx#L370) | 370, 378 |
| [`src/components/Home/sections/HeroSection.tsx`](../src/components/Home/sections/HeroSection.tsx#L103) | 103, 113 |
| [`src/components/Home/sections/StatsSection.tsx`](../src/components/Home/sections/StatsSection.tsx#L36) | 36 |
| [`src/components/Home/sections/AboutSection.tsx`](../src/components/Home/sections/AboutSection.tsx#L23) | 23 |
| [`src/components/Home/sections/TestimonialsSection.tsx`](../src/components/Home/sections/TestimonialsSection.tsx#L52) | 52 |
| [`src/components/Home/sections/WhyChooseUsSection.tsx`](../src/components/Home/sections/WhyChooseUsSection.tsx#L22) | 22 |

### Decide which is true

- **If 2,893 is a real lifetime total** and 58 is a curated portfolio sample: keep the number, but **label it** so the gap is self-explanatory. Change `/projects` page copy to e.g. *"58 featured projects from 2,893+ delivered since 2019."* One sentence closes the credibility gap.
- **If 2,893 is inflated/aspirational:** it must come down. An unverifiable public claim is an E-E-A-T liability, and if it appears next to `Organization` schema it risks being read as a structured factual claim.

### If you change the number

```bash
grep -rn "2,893\|2893" src/
```

Change **every** occurrence — including `StatsSection.tsx:36` and `AboutPageClient.tsx:281`, which hold it as a raw integer (`end: 2893`) rather than a formatted string, so a search for `"2,893"` alone will miss them.

Same applies to the **89% bid win rate** and **35 states** claims — same verification standard, same files.

---

## Task 7 — CEO bio and team page (O-9)

**Problem:** [`src/components/AboutPageClient.tsx:231`](../src/components/AboutPageClient.tsx#L231) — *"brings over half a decade of…"*

Two issues: it's vague, and "half a decade" (5 years) is a *weak* claim written to sound impressive. If the real figure is higher, stating it plainly is strictly better. If it's genuinely ~5 years, say "5 years" — specific beats florid.

### Steps

1. Get the real number from the business. Replace with e.g. *"brings 8 years of construction estimating experience across commercial and industrial projects."*
2. Add credentials if any exist — AACE membership, PE license, degree. These are the actual E-E-A-T signals; tenure alone is weak.
3. **Consider a team page.** Currently only the CEO appears. A `/team` page with 3–5 real people (name, role, credentials, photo) is one of the strongest available E-E-A-T improvements for a services business.
4. **Add `Person` schema** once real bios exist, linked to the `Organization` entity via `worksFor`.

### Edge cases

| Edge case | Handling |
|---|---|
| **Company genuinely is one person + contractors** | Then don't fake a team. A single well-documented founder with real credentials outperforms an invented roster — and inventing one is a serious trust risk if a client checks. |
| **Team members don't want to be listed** | Roles without names ("Senior Estimator, 12 years, AACE-certified") still add signal. Never publish someone's name or photo without consent. |
| **Stock photos for team headshots** | Don't. Reverse image search is trivial and being caught destroys exactly the trust the page is meant to build. Text-only bios are fine. |

---

## Task 8 — Turnaround claim consistency (O-2)

**Nuance the audit missed:** per-service turnarounds differing is **correct** — cost estimating (1–2 days) genuinely is faster than architectural drawings (7–10 days). That is not a bug. Only two things are actually wrong:

### Problem A — Sitewide "24-48 hours" overreaches

These claim 24–48h as a **general** promise, not scoped to cost estimating:

| File | Line |
|---|---|
| [`src/app/layout.tsx`](../src/app/layout.tsx#L67) | 67 — sitewide meta description |
| [`src/app/home-page.tsx`](../src/app/home-page.tsx#L33) | 33 |
| [`src/app/services/page.tsx`](../src/app/services/page.tsx#L59) | 59, and the `TURNAROUND 24–48 hrs` stat at line 66 |

**Fix:** scope the claim — *"cost estimates in 24-48 hours"* rather than a bare *"bids in 24-48 hours"*. On `/services` (which covers all four services), the `TURNAROUND` stat block is actively misleading; either relabel to `EST. TURNAROUND` or remove it.

### Problem B — FAQ contradicts the service page

[`src/components/FAQAccordion.tsx:11`](../src/components/FAQAccordion.tsx#L11) answers *"How long does a construction estimate take?"* with **"3 to 5 business days"**, while [`services.ts:97`](../src/data/services.ts#L97) says cost estimating is **1–2 business days** and `152` says **24 to 48 hours**.

Same question, two different answers, both on the homepage. **This is the one genuine contradiction** — and it sits in FAQ content that now feeds `FAQPage` schema, so it's the version most likely to be quoted by an AI assistant or rich result.

**Fix:** make `FAQAccordion.tsx:11` match the service page — 24–48 hours standard for cost estimates, noting that larger/more complex scopes take longer.

### Steps

1. Confirm the true standard turnaround with the business — this drives everything else.
2. Update `FAQAccordion.tsx:11` first (highest impact: homepage + schema).
3. Scope the three sitewide claims to cost estimating.
4. Re-verify nothing else contradicts:
   ```bash
   grep -rn "24-48\|24 to 48\|3 to 5 business\|7-10 Days\|1–2 business" src/
   ```

### Edge cases

| Edge case | Handling |
|---|---|
| **Schema now carries the FAQ answer** | Since the FAQPage JSON-LD ships the answer verbatim, an inaccurate turnaround here is a structured factual claim to Google — fix before it gets cached in rich results. |
| **The calculator has its own timing** | [`StepReview.tsx:49`](../src/features/estimator/steps/StepReview.tsx#L49) shows "48 Hours" standard / "24 Hours (Rush)". Consistent with 24–48h — leave it, but re-check if you change the headline claim. |
| **Marketing wants the aggressive number** | Fine, *if* it's deliverable. Missing a stated turnaround produces refund requests and bad reviews — a worse outcome than a slower honest number. |

---

## Suggested execution order

Cheapest-and-safest first; each block is independently shippable.

| Order | Task | Effort | Needs business input? |
|---|---|---|---|
| 1 | **Task 3** — de-jargon copy | ~30 min | No |
| 2 | **Task 2** — heading hierarchy | ~15 min | No |
| 3 | **Task 1** — dynamic H1s (Option A) | ~30 min | No |
| 4 | **Task 8** — turnaround consistency | ~20 min | **Yes** — confirm real turnaround |
| 5 | **Task 5 (code half)** — suppress shared PDFs | ~20 min | No |
| 6 | **Task 6** — stats claims | ~15 min | **Yes** — confirm real figures |
| 7 | **Task 7** — CEO bio | ~15 min | **Yes** — confirm tenure/credentials |
| 8 | **Task 5 (data half)** — source real PDFs/images | Days | **Yes** |
| 9 | **Task 4** — new keyword pages | Days | Partly |

Tasks 1–3 and 5-code are pure template work touching one or two files each — batch them into a single deploy.

---

## Deploy procedure (important — this bit has a trap)

`npm run deploy` does **not** build. It uploads whatever is already in `.open-next/`. Deploying without building ships stale code — this happened on 2026-08-19 and cost an hour of debugging.

**Always run both, in order:**

```bash
npm run lint
```

```bash
npm run pages:build
```

```bash
npx wrangler deploy
```

### Verify the build actually contains your change before deploying

`worker.js` is a ~2KB entry stub — grepping it proves nothing. The real bundle is `handler.mjs`:

```bash
grep -ac "some-unique-string-from-your-change" .open-next/server-functions/default/handler.mjs
```

Comments are stripped by minification, so grep for a **function or literal name**, not a comment.

### Post-deploy verification

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://theaceservices.com/projects/mechanical-shop
```

If a page regresses, check live Worker logs — they show real server errors that the browser hides:

```bash
npx wrangler tail --format pretty
```

### Cache note

`x-nextjs-cache: HIT` means you're seeing a cached response, not your new code. ISR revalidates hourly. To force-clear, empty the `incremental-cache/` prefix in the **R2 bucket** `ace-services-opennext-cache` via the Cloudflare dashboard — Cloudflare's standard "Purge Everything" does **not** touch it (these responses carry no `cf-cache-status` header at all).

---

## Known-good baseline (2026-08-19, post-fix)

So you can tell a regression from a pre-existing issue:

- All 4 service pages, homepage, `/blog`, `/projects`, `/testimonials`, `/calculator`, `/contact-us`, `/about-us` → **200**
- Legacy WP slugs (`/construction-estimation`, `/structural-services`, `/building-estimating`, etc.) → **200 with real content** (fixed via the `WORDPRESS_API_URL` secret correction)
- `/services/:slug` → **308** → `/:slug`
- `/projects/pauma-travel-center-2` → **308** → `/projects/pauma-travel-center`
- 20 zero-stat project pages → **200 + `noindex, follow`**, excluded from sitemap
- Homepage → exactly **1** `<h1>`, FAQPage schema present
- `npm run lint` → clean

### Root-cause fix worth not regressing

[`src/services/wordpress/client.ts`](../src/services/wordpress/client.ts) `wpGetListSafe` and [`content.ts`](../src/services/wordpress/content.ts) `getPostBySlug` now **throw** on real fetch failures instead of returning `null`. This is deliberate: returning `null` made a CMS outage indistinguishable from "page doesn't exist", so the ISR cache permanently stored false 404s for real pages.

**Do not "simplify" these back into swallowing errors.** If you see 500s after a CMS change, the correct fix is to repair the CMS/config — the 500 is the system correctly reporting a real failure rather than hiding it as a 404.
