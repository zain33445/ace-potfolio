# SEO Strategy — theaceservices.com

**Date:** 2026-08-31 · **Business type:** Local Service (nationwide-remote delivery)
**Prior work referenced:** `seo-audit-2026-08-24.md`, `seo-strategy-audit-2026-08-19.md`, `orphan-and-consolidation-plan-2026-08-24.md`, keyword gap 2026-08-27

---

## 1. Business snapshot

| | |
|---|---|
| **Service** | Construction cost estimating, quantity takeoff, quantity surveying |
| **HQ / NAP** | 16319 Hillside Garden LN, Houston TX 77084 · +1-281-899-0250 |
| **Delivery model** | Houston-based team, **nationwide-remote** (contractors in all 50 states) |
| **Stack** | Next.js 15 on Cloudflare (OpenNext) + headless WordPress content source |
| **Domain Rating** | 14 · 457 referring domains (post-disavow reprocessing) |
| **Current organic** | ~25 visits/mo, 4 keywords ranking, **all branded** |
| **SEO health score** | 67/100 (2026-08-24 audit) |

---

## 2. The one-line thesis

> **The market is soft (43 of 57 gap keywords are KD ≤ 15). What's missing is not authority — it's pages.** Build the trade + outsourcing service pages first, then a cost-guide blog for compounding traffic. Fix the technical + cannibalization debt in parallel.

---

## 3. Goals (12 months)

| Metric | Baseline (2026-08) | 3 mo | 6 mo | 12 mo |
|---|---|---|---|---|
| Non-branded organic visits/mo | 0 | 150 | 800 | 3,000 |
| Ranking keywords (top 100) | 4 | 40 | 150 | 400 |
| Commercial keywords top-10 | 0 | 3 | 15 | 40 |
| Domain Rating | 14 | 15 | 18 | 22 |
| Indexed commercial pages | ~15 | 30 | 55 | 80 |
| GBP calls/mo (Houston) | ? | +25% | +75% | +150% |
| Core Web Vitals field data | none | first data | all "Good" | all "Good" |

---

## 4. Positioning

**Not competing on:** "cheapest," "AI-powered," "50-state lightning" — those are commodity claims the market ignores.

**Competing on:**
1. **Real Houston presence** with **nationwide-remote delivery** (differentiator vs. offshore-only competitors like worldestimating.com).
2. **Trade specialisation depth** (dedicated pages per trade — the biggest gap identified).
3. **Fast turnaround + certified estimators** — proof, not adjectives (bios, credentials, sample takeoffs).

---

## 5. Strategic pillars

### Pillar A — Fix what's already there (weeks 1-4)
Everything committed but not shipped, plus the H0/H1 findings from the 2026-08-24 audit. Zero content required. See `IMPLEMENTATION-ROADMAP.md` Phase 1.

**Blocker uncovered 2026-08-31 live re-crawl:** the `/[slug]` route returns **HTTP 200 with a 659-word "Not Found" template for ANY invented ASCII slug** (verified for `/electrical-estimating`, `/lvp-flooring-cost`, `/random-string-xyz-9999` — all identical). The 2026-08-24 middleware fix only blocked non-ASCII. This must be fixed before ANY new trade page ships, or Google gets ghost 200s for every typo variant of every published URL. See Roadmap Task 1.1.

### Pillar B — Trade estimating cluster (weeks 3-10)
9 trade pages, each targeting a distinct KD≤12 keyword: electrical, HVAC, mechanical, millwork, sitework, insulation, fireproofing, masonry, roofing. Each page is a real service page with pricing bands, sample line items, sample takeoff PDF, FAQ, CTA. Not thin variants.

### Pillar C — Outsourcing + Quantity Surveyor cluster (weeks 4-8)
Two spine pages that map to how buyers actually search — `outsourced construction estimating` and `quantity surveyor services USA`. Both already show GSC impressions at positions 15-90 for existing pages; the job is to make the target pages actually rank.

### Pillar D — Cost-guide blog (weeks 6-24)
The volume engine. `lvp flooring cost` (6,700/mo), `concrete slab cost` (4,700/mo), `drywall cost` (2,300/mo), etc. Each guide is 1,500-2,500 words with a real cost calculator widget or table (the differentiator vs. thin AI-generated guides), links into the relevant trade page.

### Pillar E — Local Houston pack + AI visibility (ongoing)
GBP optimization, Houston-specific content, presence on curated "best of Houston estimators" lists (Whitespark 2026 ranks these #1 for AI visibility).

---

## 6. What is explicitly out of scope

- **Programmatic 50-state landing pages.** Local pack ranks require real presence; states you don't operate in violate 2025 SAB rules and dilute topical authority.
- **NYC pages** unless the [[ace2-seo-audit-2026-08-19]] open decision resolves to build real NYC presence.
- **New feature builds** — no SPA rewrites, no CMS migration, no design system swap. Ship on what exists.
- **Link buying / PBNs** — 293-domain disavow is fresh, don't reintroduce the same profile.

---

## 7. Budget + resource shape (assumed)

| Role | Weekly hours | Notes |
|---|---|---|
| SEO lead / editor | 8-12 | Prioritization, briefs, QA |
| Content writer (with construction domain) | 15-20 | 2 service pages OR 1 cost-guide per week |
| Frontend dev | 4-8 | New page templates, calculator widgets, technical fixes |
| Designer (part-time) | 2-4 | Diagrams, sample takeoffs, GBP photography |

Not required: separate link-building agency. Earn links via cost-calculator embeds + PR to trade publications.

---

## 8. KPIs and review cadence

- **Weekly:** GSC impressions/clicks for target keywords, new page indexation, GBP calls.
- **Monthly:** Ahrefs rank tracker for the 43 quick-win keywords, referring domains delta, top-10 count, backlink quality trend.
- **Quarterly:** Health score re-audit (`/seo-audit`), competitor gap refresh, disavow review.

Stop-loss triggers:
- If after 3 months a fully-published pillar has produced <10 non-branded visits/mo, brief was wrong or intent was mis-mapped — rewrite, don't add more pages.
- If DR drops or referring domain quality falls, pause outreach and re-audit the profile.

See `COMPETITOR-ANALYSIS.md`, `CONTENT-CALENDAR.md`, `IMPLEMENTATION-ROADMAP.md`, `SITE-STRUCTURE.md`.
