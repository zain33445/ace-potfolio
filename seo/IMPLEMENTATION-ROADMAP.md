# Implementation Roadmap — theaceservices.com

**Date:** 2026-08-31 · **Duration:** 12 months, 4 phases
**Precondition:** All items in `orphan-and-consolidation-plan-2026-08-24.md` and `remaining-seo-tasks-implementation-guide.md` fold into Phase 1 below.

---

## Phase 1 — Foundation (weeks 1-4)

**Goal:** stop the bleeding, ship what's already been designed but not deployed.

### Technical

| # | Task | Owner | Ref |
|---|---|---|---|
| 1.1 | **CRITICAL:** Fix `/[slug]` soft-404 for ASCII slugs — currently ANY invented ASCII path returns HTTP 200 with the 659-word not-found template (verified 2026-08-31 live: `/electrical-estimating`, `/lvp-flooring-cost`, `/random-string-xyz-9999` all 200/659w). Middleware currently only blocks non-ASCII. Options: (a) `dynamicParams = false` on `/[slug]` once the valid slug list is known at build time; (b) change middleware to check against an allowlist of known page slugs; (c) return `notFound()` in the route handler AND ensure the response actually sets status 404 (Next.js needs the route file's `not-found.tsx` to be present AND the fetch to happen before render). Verify with `curl -o /dev/null -w '%{http_code}' https://theaceservices.com/random-string-xyz-9999` == 404. **This is a Phase 1 blocker** — do not ship trade pages until this returns real 404s, or every new slug leaves permanent ghost 200 siblings for typo variants. | Frontend | `seo-audit-2026-08-24.md` §C1 (re-verified 2026-08-31 — NOT fixed for ASCII) |
| 1.2 | Execute cannibalization consolidation: 15 blog posts → 3 target pages via 301. **Verified 2026-08-31 — not yet executed:** all 15 source URLs still in sitemap; 3 targets (`/warehouses-development` 3,793w, `/blueprint-estimation` 4,821w, `/quantity-surveyor-services` 3,663w) exist at 200 with rich content but are absent from sitemap. | Backend + SEO | `orphan-and-consolidation-plan-2026-08-24.md` Part 1 |
| 1.3 | Add the 3 consolidation targets + `/houston-construction-estimating` (once built) to sitemap; link the 28 orphan pages from primary nav or footer | Frontend + SEO | Same doc Part 2 |
| 1.3a | Rewrite `/services` hub to link all 7 existing service pages (currently links only 4 — missing shop-drawing-services, permit-set-services, 3d-rendering-services) | Frontend | Live grep 2026-08-31 |
| 1.3b | Pick canonical between `/outsourced-construction-estimating` vs `/outsource-construction-estimation` (both soft-404 at 200 today) and reserve the other as a 301 source once real content ships | SEO | Slug collision |
| 1.4 | Fix 38 truncated meta descriptions (audit on-page section) | SEO | Audit doc |
| 1.5 | Confirm Cloudflare deploy pipeline runs `pages:build` before `deploy` — gate via CI check | Frontend | [[ace2-seo-audit-2026-08-19]] caveat |
| 1.6 | Set up PageSpeed Insights API key + weekly cron for CWV field data collection | SEO | Audit doc §Performance caveat |
| 1.7 | Register site with Bing Webmaster Tools + submit IndexNow | SEO | For Copilot citations |

### Content

| # | Task | Owner |
|---|---|---|
| 1.8 | Rewrite home hero + H1: "Nationwide-remote construction estimating from Houston" | Writer + SEO |
| 1.9 | Rewrite `/about-us` with team bios + certifications | Writer |
| 1.10 | Ship 2 rewritten pages: `commercial-estimating-services`, `construction-estimator` | Writer |

### Analytics

| # | Task |
|---|---|
| 1.11 | GA4 + GSC event tracking for phone clicks, quote form submissions, PDF downloads |
| 1.12 | Ahrefs Rank Tracker: expand from 13 → 60 keywords (add all 43 quick-wins + 17 aspirational) |
| 1.13 | Set up GBP insights weekly export |

**Phase 1 exit criteria:** all soft-404s return 404 · no >1 H1/page · zero orphan status on target-consolidated URLs · CWV field data collection producing weekly CSV · Bing crawling confirmed.

---

## Phase 2 — Expansion (weeks 5-12)

**Goal:** ship the trade estimating cluster + takeoff cluster (Pillars B + Bb) — where the near-term commercial wins are.

- Weeks 5-12: 11 trade pages + 4 takeoff pages per `CONTENT-CALENDAR.md`.
- Weeks 6-12: first 4 cost-guide blog posts.
- Week 6: launch Houston-specific hub page `/houston-construction-estimating` (Local pack + citation base).
- Week 8: GBP overhaul — categories audit, service list sync, 20 fresh photos, video-verify re-check if needed.
- Week 10: Sample takeoff PDF + gated download form live (used across all trade pages).
- Week 12: **Phase 2 mid-point audit** — re-run `/seo-audit`, compare to 2026-08-24 baseline. Expected: health score 75+, non-branded visits/mo 150+.

**Phase 2 exit criteria:** 15 new commercial pages indexed and receiving GSC impressions · ≥3 non-branded keywords in top-10 · 25+ Google reviews (from a Q3 review push).

---

## Phase 3 — Scale (weeks 13-24)

**Goal:** cost-guide volume engine + first link-earning play.

- Weeks 13-24: 8 more cost-guide blog posts per calendar.
- Weeks 14-18: comparison pages (`outsourced-vs-in-house-estimator`, `estimator-vs-quantity-surveyor`).
- Week 16: **Interactive cost calculator widget** — embeddable, attribution link back. Pitch to 20 construction blogs.
- Week 18: 3 case studies published.
- Week 20: Guest posts campaign — 5 pitches to trade publications (ENR, Construction Dive, ConcreteConstruction, Building Design+Construction, Contractor Magazine).
- Week 22: Disavow refresh pull #2 (12 weeks after 2026-08-19 upload).
- Week 24: **Phase 3 exit audit.** Expected: health score 82+, non-branded visits/mo 800+, DR 16-18.

**Phase 3 exit criteria:** 800+ non-branded monthly visits · 15+ commercial top-10 rankings · ≥10 new referring domains from construction blogs/publications · calculator widget embedded on ≥5 external sites.

---

## Phase 4 — Authority (months 7-12)

**Goal:** compounding organic + AI-search citations.

- Monthly: 1 cost-guide + 1 supporting article + 1 trade page refresh.
- Month 7: llms.txt + FAQ schema audit for AI-answer optimization.
- Month 8: Presence on 3+ curated "best construction estimators" lists (Clutch, GoodFirms, industry roundups).
- Month 9: First branded PR push — bylined article for a trade publication.
- Month 10: Video content — 3 short-form "how a takeoff works" videos on YouTube, embedded on service pages.
- Month 11: Quarterly re-audit + refresh 5 lowest-performing top-10 pages.
- Month 12: **Full annual audit + next-year strategy refresh.**

**Phase 4 exit criteria:** 3,000+ non-branded monthly visits · 40+ commercial top-10 rankings · DR 22+ · confirmed citations in ChatGPT/Perplexity for at least 3 commercial queries · GBP calls/mo up 150% vs baseline.

---

## Dependencies + risks

| Risk | Mitigation |
|---|---|
| WordPress spam pollution grows | Keep category-1 allowlist enforced (`INSIGHT_CATEGORY_IDS`); monitor `wp/v2/posts` monthly for spam-cat growth |
| Cloudflare deploy pipeline drift | CI check enforces build-before-deploy (Task 1.5) |
| Cost-guide accuracy stale | Quarterly refresh cycle in Phase 4; add "last updated" timestamps to every guide |
| Google helpful-content updates | Named authors + certifications + original data (calculators, tables) — the exact signals rewarded 2024-2026 |
| Link building slips into low-quality patterns | No paid directory purchases; earn via calculator embeds + PR only |
| NYC decision unresolved | Do not build NYC pages until owner confirms local presence; drop from tracker if answer is no |

---

## Kill / rebuild triggers

If at 3-month checkpoint any pillar has produced <10 non-branded visits/mo despite full publication:
1. Re-verify intent match by pulling top-10 SERPs for the target query.
2. Rewrite (not augment) the top-performing page in the cluster.
3. If second rewrite still underperforms at 6 months, deprioritize cluster and reallocate to a proven pillar.

Never respond to underperformance by publishing more pages of the same kind — that's how thin-content penalties happen.
