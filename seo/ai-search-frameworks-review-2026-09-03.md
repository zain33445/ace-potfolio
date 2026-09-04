# AI-Search Frameworks — Expert Review & ACE2 Translation

**Date:** 2026-09-03 · **Source material:** four creator videos (Neil Patel "Keywords Are Dead"; Google Preferred Sources walkthrough; "modern discovery / query fan-out"; Surfer 5-step content workflow)
**Purpose:** separate durable mechanism from vendor narrative, then map what survives onto theaceservices.com.

---

## 0. Verdict up front

Of the four frameworks, **one is a genuine strategic edge for this business, one is a real but irrelevant Google feature, and two are useful heuristics dressed as revolutions.**

| Framework | Claim strength | Relevance to ACE2 | Action |
|---|---|---|---|
| **Action-driven / transactional keywords** | Strong — mechanistically sound | **Very high** | Build the moat here |
| **Micro-moments (2015)** | Medium — good taxonomy, bad epistemics | Medium (planning tool) | Use as an outline lens, not a strategy |
| **Query fan-out / brand mentions** | Medium — correlational, confounded | High (off-site work) | Reframe as retrieval-corpus seeding |
| **Google Preferred Sources** | Strong — real shipped feature | **Near zero** | Skip; see section 4 |

---

## 1. "Keywords are dead" — what is actually true

**The claim:** Google/AI now match intent, not strings, so stop doing keyword research.

**What is true.** Since Hummingbird (2013) then RankBrain (2015), BERT (2019) and MUM, retrieval has been embedding-based, not lexical. Exact-match anchor text and exact-match H1s stopped being the lever a decade ago. AI Overviews compress informational SERPs and depress CTR on "know" queries — that part is measurable and real.

**What is false.** Keywords are the *measurement layer*, not the targeting layer. You cannot run the goal table in `SEO-STRATEGY.md` (400 ranking keywords, 40 commercial top-10) without keywords — GSC, Ahrefs and rank tracking are all keyword-indexed. "Intent" is not a queryable unit; a keyword is intent with a volume number attached.

**The honest reformulation:**
> Keywords remain the unit of *measurement and demand sizing*. Intent is the unit of *page design*. One page can serve a cluster of keywords sharing one moment; it cannot serve two moments.

That reformulation is what actually changes work: it kills thin one-keyword-per-page pages (the cannibalization debt already flagged in `orphan-and-consolidation-plan-2026-08-24.md`) and forces one-page-per-moment consolidation.

**Micro-moments, correctly labeled.** Google's 2015 "I want to know / go / do / buy" is a *media-buying* framework from Think with Google, not an algorithmic construct. Nothing in ranking reads a moment label. Its value is as an outline discipline — it is a coarser, better-remembered version of the standard informational / navigational / commercial-investigation / transactional taxonomy. Treat it as such. Do not attribute algorithmic force to it.

### ACE2 moment map

| Moment | Query shape | Page type | Current state |
|---|---|---|---|
| **Know** | "how much does it cost to build a warehouse", "what is a quantity takeoff" | Cost guides, blog | Partly built; AI Overviews will eat most of this traffic — treat as top-of-funnel and citation bait, **not** a conversion channel |
| **Go** | "construction estimator near me", "estimating company Houston" | GBP + Houston/city pages | Weak. NAP fixed; local pages thin |
| **Do** | "how to read a bid tab", "how to do a concrete takeoff", "how to bid a job" | Tutorials + downloadable templates | **Missing entirely.** Highest-leverage "do" plays are the ones with a download attached |
| **Buy** | "construction estimating services", "outsourced estimating", "hire a quantity surveyor" | Service + trade pages | The core commercial gap the strategy doc already names |

The map's real use: it makes visible that **"do" is the empty quadrant**, and that "do" queries are exactly where an estimating firm has native artifacts to give away (templates, checklists, sample takeoffs).

---

## 2. Action-driven keywords — the one framework worth building on

**The claim:** queries that require *doing* something (calculator, checker, generator, service booking) still send clicks, because an LLM answer cannot substitute for the tool.

**Why this is mechanistically right, not just observed.** An AI Overview substitutes for a page when the page's entire value is retrievable text. It cannot substitute when the value is:

1. **Computation over user-supplied inputs** (calculator, estimator),
2. **A proprietary artifact** (a template file, a sample takeoff PDF, a rate table),
3. **A human deliverable** (an actual takeoff of *your* plan set).

All three are ACE2's native business. This is the single most defensible position in the whole dump — and the site already stumbled into the pattern with `/adu-construction-cost` (an SF-input calculator using the page's own measured rates rather than a national average). That page is the template; it is not yet a strategy.

### Harvest procedure (Ahrefs Matching Terms, Include filter)

Run seeds — `construction cost`, `estimating`, `takeoff`, `quantity survey`, `bid`, `[trade] cost` — through Matching Terms with an **Include (any of)** filter on:

```
calculator, estimator, cost per square foot, per sq ft,
template, checklist, spreadsheet, excel, form, sample,
generator, tool, worksheet, breakdown
```

Then a second pass with **Intent = Transactional**. Score each hit on: (a) can we answer it with real internal rate data, (b) does it end in a lead form.

### Candidate build list (highest confidence first)

1. **Trade cost calculators** — concrete, framing, drywall, electrical, plumbing, roofing, MEP. One per trade, each reusing the `AduCostCalculator` shape with that trade's own rates. These double as the trade-page depth the strategy doc calls the biggest gap.
2. **Downloadable templates, ungated** — bid sheet, takeoff worksheet, construction cost breakdown (Excel/Sheets). Templates earn links passively and satisfy "do" moments. Leave them ungated: the link equity is worth more than the email.
3. **Cost-per-square-foot pages by building type and region** — warehouse, hotel, restaurant, multifamily, tenant improvement. Interactive, seeded with real project data from `extracted-projects.json`.
4. **"Should I outsource estimating?" comparator** — in-house estimator salary vs. per-project outsourcing. Pure "buy" moment, and no LLM can run it against the user's numbers.

Each of these is a page an AI Overview must link to rather than replace.

---

## 3. Query fan-out and brand mentions — right conclusion, wrong reasoning

**The claim:** AI decomposes a complex query into many sub-queries, stitches an answer from many pages, and being *mentioned* correlates with AI visibility better than DR or backlinks do.

**The mechanism is real.** Fan-out (sub-query decomposition in AI Overviews and in ChatGPT search's multi-retrieval) is documented product behavior. Retrieval selects passages, not domains — which is why a DR-14 site can be cited alongside a DR-80 one if the passage answers the sub-query better. That is the genuinely good news for ACE2 at DR 14.

**The evidence is weaker than presented.** "Mentions correlate more than backlinks" comes from vendor correlation studies with an obvious confound: brands that get mentioned a lot are large, and largeness drives both mentions and citations. Those coefficients should not be read as causal weights. The "~75% of AI citations come from external sources" figure is directionally supported by several independent citation-source analyses, but the precise number varies widely by model, query type and study — cite it as *"most"*, never as *75%*.

**What survives, restated causally:** LLM answers are assembled from a retrieval corpus. Your own site is one document in it. Third-party pages that list, compare or review you are *additional* documents, and they carry the comparative framing ("best X for Y") that commercial queries actually trigger. Getting into those pages widens your surface in the corpus. That is a supply-side argument, not a correlation argument, and it holds regardless of the studies.

### ACE2 off-site priorities (ordered by realistic yield)

1. **Directory and marketplace profiles that already rank for our commercial terms** — Clutch, Houzz Pro, BuildZoom, Thomasnet, Blue Book (construction-specific). These are the pages that surface in "best construction estimating companies" retrievals.
2. **Roundup and listicle placement** — pitch inclusion in "best construction estimating services / outsourced estimating companies" posts. Unlinked mentions still count for retrieval; do not refuse a nofollow.
3. **Reddit and industry forums** — r/Construction, r/ConstructionManagers, r/Estimators, ContractorTalk. Reddit is disproportionately retrieved by ChatGPT and AI Overviews. Participate as an estimator answering estimating questions; a promotional drop backfires and gets removed.
4. **Reviews with specific outcomes** — "they turned a 40,000 sf warehouse takeoff in 48 hours and we won the bid" is retrievable and attribute-rich; "great service" is not. Review requests should ask for project type, turnaround and outcome.

**Reconnaissance step first:** before pitching anything, determine which domains actually get cited for our commercial queries. Run the ~20 buy-moment queries through ChatGPT / Perplexity / AI Overviews and record the cited domains. Build the outreach list from that observed set, not from a generic directory list. The Ahrefs Brand Radar tools connected to this project cover the cited-domains half of this directly.

---

## 4. Google Preferred Sources — real feature, wrong business

**What it is.** A shipped Google feature (US and India, English) letting a signed-in user mark sites they want to see more of. Google publishes an embeddable button/link that opens the picker without leaving the page. Domain- and subdomain-level only; subdirectories ineligible.

**Why it does not apply here.** Preferred Sources boosts results in **Top Stories and news-oriented surfaces**. It is a news-publisher feature. theaceservices.com is a B2B service business with no news cadence, no Top Stories eligibility and no repeat-visit reader relationship. The button would be a CTA that almost no visitor is both signed in and motivated enough to use, on a site whose visitors evaluate a vendor once.

**The transferable lesson, which is not about Google at all:** the genuinely good advice in that video is *CTA placement discipline* — one high-value ask, placed after content that earned it, and no CTA stacking, because decision fatigue lowers conversion on all of them. That applies directly to the calculator and cost-guide pages: **one** ask per page ("get a real estimate for your plan set"), placed immediately after the calculator output, where intent peaks.

**Decision: do not implement.** Revisit only if a genuine insights/news publication cadence ever exists.

---

## 5. The Surfer 5-step workflow — keep three of five

**Keep:**

- **Match SERP format before writing.** If the top 10 are listicles and you write an essay, you lose. Cheapest, highest-yield pre-writing check; not optional.
- **BLUF — lead with the answer.** Both extraction (AI Overviews, ChatGPT) and human scanning reward a direct answer in the first 40–60 words under a question header. Single highest-leverage formatting change available.
- **Question-shaped H2s plus a real FAQ.** Headers that mirror how the query is phrased give retrievers clean passage boundaries. FAQ content should come from observed questions (GSC queries, questions the estimating team fields on sales calls), not from a tool's autocomplete scrape.

**Discard or demote:**

- **"SEO Score" / "AI Search Score" / entity-count optimization.** Proxy metrics sold by the tool that computes them. Optimizing an entity count is a 2018 TF-IDF idea with a new label, and it produces the flat, term-listing prose that both readers and AI-detection heuristics dislike. Cover the topic properly and the entities appear.
- **The "70/30 rule" as stated.** Directionally fine (cover table stakes, then differentiate) but the numbers are invented. The real rule: cover what the SERP proves is required, then add the thing only a firm that actually does takeoffs can add. For ACE2 that 30% is not "unique angles" — it is **first-party data**: real rates, real turnaround times, real project outcomes from `extracted-projects.json`. That is the E-E-A-T moat, and no competitor or LLM can synthesize it.

**The 30/60/90 review cadence is right and under-emphasized.** Content that has not moved by day 90 gets rewritten or consolidated, not left to rot as an orphan.

---

## 6. What this changes about the current strategy

The existing `SEO-STRATEGY.md` thesis — *"the market is soft; what is missing is pages"* — survives intact. These frameworks refine **which** pages, in this order:

1. **Re-rank the content calendar by moment, and demote pure "know" cost-guide posts.** AI Overviews will absorb most of that traffic. Cost guides are still worth writing, but as citation bait and internal-link fuel, not as a traffic line item — the 12-month goal table should not be resting on them.
2. **Promote "do" and action-driven pages to first priority.** Trade calculators and downloadable templates serve an empty quadrant, are AI-resistant, are link-attractive, and double as the trade-page depth already identified as the biggest gap. One build, three wins.
3. **Add an off-site workstream** that does not currently exist in the strategy doc: cited-domain reconnaissance, then directory profiles, roundup pitches and outcome-specific review solicitation. At DR 14 this is likely higher-yield per hour than on-site work.
4. **Rewrite every existing commercial page's opening to BLUF.** Cheapest change on this list, applies site-wide, helps extraction and conversion at once.
5. **Skip Preferred Sources.** Take the CTA-discipline lesson, leave the feature.

---

## 7. Claims to treat with caution

- *"75% of AI citations are external"* — directionally right, precise figure unreliable.
- *"Mentions correlate more than backlinks"* — confounded by brand size; the supply-side argument is the defensible one.
- *"Google rank does not predict AI citation"* — true but overstated; the correlation is weak, not absent, and it is stronger for commercial queries than informational ones.
- Any tool-provided composite score (SEO Score, AI Search Score, Content Score) — a proxy owned by the vendor selling the fix.
