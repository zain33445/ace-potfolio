# Orphan Tier + Cannibalization Consolidation Plan

**Date:** 2026-08-24 · **Status:** AWAITING APPROVAL — nothing in this document has been executed
**Source:** findings H0 and H1 in `seo-audit-2026-08-24.md`

This plan covers the two findings that were deliberately NOT auto-executed, because both change which URLs exist on the public site.

---

## The core insight

These are not two problems. The 16 cannibalizing blog posts and the 28 orphaned pages are the *same* problem seen from two sides:

- The blog posts have **content** (1,200–1,900 words each) but no links, no rankings, and six-way self-competition.
- The orphan pages have **links, clean slugs and actual rankings** (positions 15–90 per GSC, one at #1) but are invisible to the sitemap and receive zero internal links.

Consolidating the former into the latter fixes both in one pass.

**Verified precondition:** Ahrefs `pages-by-backlinks` confirms none of the 16 blog posts has a single referring domain. There is no link equity at risk in redirecting any of them.

---

## Part 1 — Cannibalization consolidation (finding H1)

### Cluster A: Warehouse development → `/warehouses-development`

Target justification: 4 referring domains, URL Rating 4.5, ranks **#1** for `warehouse development program`, exact-match slug. It is the single best-performing non-homepage URL on the domain.

301 these 6 into it:
```
/end-to-end-warehouse-development-services-for-modern-businesses                                 (1,489w)
/warehouse-development-services-how-warehouses-are-planned-designed-and-built                    (1,599w)
/why-your-business-needs-a-professional-warehouse-development-company                            (1,444w)
/warehouse-development-services-in-usa-building-efficient-scalable-and-modern-storage-solutions  (1,419w)
/warehouse-development-services-in-usa-building-efficient-spaces-for-modern-businesses           (1,569w)
/warehouse-development-services-in-usa                                                           (1,419w)
```

### Cluster B: Blueprint estimation → `/blueprint-estimation`

Target justification: 1,052-word orphan, exact-match slug, no competing duplicate. No cluster member has backlinks, so slug quality decides.

301 these 6 into it:
```
/blueprint-estimation-cut-costs-before-you-break-ground                              (1,317w)
/blueprint-estimation-services-explained-a-step-by-step-construction-guide           (1,366w)
/reliable-estimating-services-for-u-s-contractors-from-blueprint-to-completion       (1,757w)
/blueprint-estimation-services-usa-the-foundation-of-accurate-construction-planning  (1,319w)
/blueprint-estimation-services-in-usa-the-foundation-of-cost-effective-construction  (1,498w)
/best-blueprint-estimation-services-in-usa                                           (1,939w)
```

### Cluster C: Quantity surveyor → `/quantity-surveyor-services`

Target justification: 1 referring domain, URL Rating 4.7, exact-match slug.

301 these 3 into it:
```
/what-is-a-quantity-surveyor-service-a-complete-construction-guide                                (1,248w)
/quantity-surveyor-services-ensuring-accuracy-and-efficiency-in-construction-projects             (1,207w)
/quantity-surveyor-services-in-usa-ensuring-precision-and-profitability-in-construction-projects  (1,516w)
```

**KEEP LIVE — do not redirect:**
`/quantity-surveyor-vs-cost-estimator-key-differences` (1,373w). This is comparison intent, not another "QS services" page. It should stay and link *to* the target.

### The part that is not a redirect

Each target is ~900–1,050 words; the posts being redirected into it run 1,200–1,900. **Redirecting alone destroys content.** Before each 301 goes live, the best material from the cluster must be merged into the target page in WordPress. Rough budget: three merged pages at ~2,000–2,500 words each.

Sequence per cluster, in order:
1. Merge the strongest sections from the cluster into the target page (WordPress editorial work)
2. Verify the target renders correctly on the public site
3. Add the 301s to `next.config.js`
4. Add the target to `sitemap.ts`
5. Link the target from the homepage and from `/services`

Doing step 3 before step 1 sends users and Googlebot to a page thinner than the one they came for.

### Also flagged

Agent-identified duplicate title pair, likely needing the same treatment:
`/outsource-construction-and-estimation-services-in-usa-key-advantages-for-builders-and-contractors` and `/best-outsource-construction-and-estimation-services-in-usa` render identical titles. Natural target: the `/outsourcing-estimation` orphan (2,113w, 2 refdomains) — which also targets `outsourcing construction estimating`, recorded at KD 1 in the 2026-08-19 audit. This is plausibly the single most winnable commercial term the site has.

---

## Part 2 — Orphan tier (finding H0)

### Tier A — 20 pages: wire in, do not change content

Add to `sitemap.ts` and give each an internal link. These already draw impressions at positions 15–90 with no help at all.

```
/outsourcing-estimation      2,113w      /residential-buildings      1,041w
/electrical-estimation       1,717w      /bridges-construction       1,038w
/community-parks             1,098w      /industrial-construction    1,016w
/educational-buildings       1,078w      /warehouses-development     1,011w
/hotels-development          1,074w      /office-development           996w
/building-estimating         1,073w      /quantity-surveyor-services   970w
/freelance-estimation        1,067w      /assembly-buildings           967w
/healthcare-buildings        1,063w      /residential-construction     960w
/blueprint-estimation        1,052w      /commercial-construction      955w
                                         /construction-estimation      904w
                                         /structural-services          882w
```

Implementation note: `SERVICE_PAGE_SLUGS` in `src/services/wordpress/content.ts` already curates 10 of these for display. Extending that list is the natural hook — it is the existing mechanism, not a new one.

### Tier B — 4 pages: too thin to ship as-is

| URL | Words | Action |
|---|---|---|
| `/shopping-centre` | 513 | Expand past ~800w, or `noindex` until expanded |
| `/industrial-estimating` | 466 | Expand, or `noindex` |
| `/commercial-estimation` | 437 | Expand, or `noindex` |
| `/residential-estimating` | 425 | Expand, or `noindex` |

Do NOT add these to the sitemap in their current state. Note `/industrial-estimating` and `/commercial-estimation` also overlap the existing `/cost-estimating` service page — check for a fourth cannibalization cluster before expanding either.

### Tier C — 4 pages: should not be indexable

| URL | Words | Action | Why |
|---|---|---|---|
| `/home` | 502 | **301 → `/`** | A second indexable, self-canonical homepage competing with the real one. Highest priority in this tier. |
| `/terms-conditions` | 575 | 301 → `/terms-and-conditions` | Duplicate; the hyphenated one is the sitemap version |
| `/sample-page` | 532 | 410 | WordPress default boilerplate |
| `/email-marketing-expert` | 401 | `noindex` | Internal job posting, publicly indexable |

**Status (2026-08-25): DONE.** All four shipped in the working tree, verified locally (`next dev`), not deployed:
- `/home` and `/terms-conditions` — 301s added to `next.config.js` `redirects()`, following the existing `/samples → /projects` pattern.
- `/sample-page` — added to the `GONE_URLS` 410 set in `src/middleware.ts` (same mechanism already used for the pharma-spam URL).
- `/email-marketing-expert` — added to a new `NOINDEX_URLS` set in `src/middleware.ts`; the page still renders normally, middleware just attaches `X-Robots-Tag: noindex, nofollow` to the response.

Full regression sweep passed: all known static routes, existing redirects, real blog/service pages, and the pharma-spam 410 all still behave correctly.

---

## Execution order

1. **Tier C first.** Four redirects, no editorial work, removes a duplicate homepage. Lowest risk, immediate.
2. **Tier A wiring.** Sitemap + internal links for 20 pages. No content changes, fully reversible.
3. **Cluster consolidation.** Merge content, then redirect, cluster by cluster. Start with warehouse — it has the clearest target and the proven #1 ranking.
4. **Tier B.** Only after 1–3, and only after checking the `/cost-estimating` overlap.

## How to know it worked

Do not re-run a full audit to check. Use GSC → Performance, 28-day window:

- **Tier A wiring succeeded** if average position for those URLs improves from the 15–90 band. If it does not move in 6 weeks, discoverability was not the constraint and those pages need content work instead.
- **Consolidation succeeded** if impressions for "warehouse development" concentrate onto `/warehouses-development` instead of splitting six ways. If impressions stay flat and split, cannibalization was not the binding constraint, and the next investment belongs in link acquisition — DR 14 against a competitor set that includes a DR 10 site ranking #1 suggests authority is winnable, but it is a different project.

## Risk register

- **Redirecting before merging loses content.** Guarded by the per-cluster sequence above.
- **The orphan pages are Elementor blobs.** The 59-`<h1>` bug fixed today in `sanitizeHtml` came from exactly this source. Check rendered heading structure on each Tier A page before promoting it.
- **`/warehouses-development` currently ranks #1.** Merging content into it carries real downside risk. Change it conservatively — add, do not rewrite.
- **Ahrefs reported HTTP 403 for `/warehouses-development`.** Verified today as stale: Googlebot, bingbot and AhrefsBot user agents all receive 200. No action needed, but worth re-checking if rankings drop.
