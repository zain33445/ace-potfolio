# The 5-step content workflow, applied to this site

Run 2026-09-03 against the live blog (63 posts) and real Ahrefs SERP data.

Step 4 is done in code. Steps 1, 2 and 5 are findings. Step 3 is paste-ready
copy, because the WordPress client in this repo is read-only.

---

## The number that reframes everything

Before the steps, the baseline. From Ahrefs, 2026-09-03:

| Metric | Value |
|---|---|
| Domain Rating | 14 |
| Organic keywords ranking | **4** |
| Organic traffic | 24/month |
| Of those 4 keywords, brand searches | **3** ("ace services", "aceservices", "ace services inc") |
| Non-brand keywords with volume | **0** |
| Blog posts ranking for anything | **0 of 63** |

63 published posts are producing no search traffic at all. That is the context
for every decision below.

It is not evidence the posts are bad. The two best ones are two days old and
have not had time to rank. But it does mean the bottleneck is almost certainly
**not** "write more/better posts" — 63 attempts have already been made.

---

## Step 1 — Search intent

Checked the live SERP for the two target keywords.

### "how to read construction blueprints" — 1,100/mo, KD 0

| Position | Result | DR |
|---|---|---|
| 1 | **AI Overview** (11 sitelinks) | — |
| 2 | **Video block** — 3 YouTube results | — |
| 3 | Reddit thread | 95 |
| 4 | Home Depot | 90 |
| 5 | BigRentz | 74 |
| 6 | People Also Ask | — |
| 7 | Hover | 69 |
| 8 | Construct-Ed | 28 |
| 9 | Reddit | 95 |
| 10 | MEP Academy | 33 |

**Content type: correct.** Google classifies the winners as
`/Article/How_to` and `/Article/Tutorial_or_Guide`. The post is a step-by-step
how-to guide. That matches.

**But the SERP is hostile.** An AI Overview takes the top slot, a video block
takes the second, and Reddit takes two more. Most of this traffic never
reaches a website.

**The opening is winnable.** Construct-Ed ranks #8 at DR 28, MEP Academy #10
at DR 33 with a single referring domain. That is a realistic target from DR 14
— positions 8-10, not position 1.

### "construction change order" — 500/mo, KD 6, traffic potential 1,300

| Position | Result | DR |
|---|---|---|
| 1 | **AI Overview** (cites Procore, ConstructConnect, Rhumbix) | — |
| 2 | People Also Ask | — |
| 3 | Procore | 83 |
| 4 | Associated General Contractors | 81 |
| 5 | eForms — *a downloadable change order form* | 74 |
| 6 | Rhumbix | 48 |
| 8 | Autodesk | 90 |
| 9 | Levelset | 71 |
| 10 | Young Architect | 43 |

**Harder than KD 6 implies.** The weakest page-1 result is DR 43. This site is
DR 14. Ahrefs' difficulty score understates this one.

**A content-type signal worth noticing:** eForms ranks #5 with a free
downloadable change order form. Part of this query wants a *document*, not an
article.

---

## Step 2 — Research and gaps

Both posts are missing the questions Google is visibly asking on the page.
These are lifted from the live People Also Ask blocks, so they are not guesses.

### Blueprints post — not covered

- "How to read 1/4 inch to a foot construction blueprint?" — a scale-reading
  worked example. The post mentions scale but never demonstrates reading one.
- "Are construction blueprints hard to read?"
- "How do you read and interpret construction drawings?"

### Change orders post — not covered

- "What is the difference between an RFI and a change order?"
- "Who pays for change orders in construction?"
- "What are some examples of change orders in construction?"
- "How to do a change order on a construction project?" — the process, step by
  step.

### The 70/30 split

The workflow's guidance is 70% proven topics, 30% unique angle. Applied here:

- **Proven (70%)** — the PAA questions above. Every competitor covers them.
- **Unique (30%)** — your 39 estimates with cost and suggested bid. Nobody on
  either SERP has first-party cost data. That is the whole 30%, and it is
  worth more than the tools will tell you, because it cannot be copied.

---

## Step 3 — Write and optimize

Paste-ready. Add to the change orders post, before "Frequently Asked
Questions". Each heading answers a live PAA question.

```html
<h2>Who pays for a change order?</h2>
<p>It depends on what caused it. An owner-directed scope change is paid by the
owner. A change caused by an error or omission in the drawings is usually a
matter for the design team's professional liability. A change caused by the
contractor's own mistake — a missed quantity, a misread detail — is absorbed
by the contractor. This is why the cause of a change order matters as much as
its cost: the cause determines who pays.</p>

<h2>RFI or change order — what is the difference?</h2>
<p>An RFI is a question. A change order is an amendment to the contract. An
RFI asks the design team to clarify something ambiguous in the documents; most
RFIs are answered and close with no cost impact. A change order follows when
the answer changes the scope, the cost or the schedule. In practice the RFI is
the early warning and the change order is the bill.</p>

<h2>What does a change order actually look like?</h2>
<p>Common examples on a commercial project:</p>
<ul>
  <li>A finish schedule specifies a tile that has been discontinued, and the
      replacement costs more per square foot.</li>
  <li>A duct run and a structural beam occupy the same space, discovered
      during installation.</li>
  <li>Excavation reveals rock or groundwater the geotechnical report did not
      show.</li>
  <li>The owner moves a wall after framing has started.</li>
  <li>A quantity was under-counted in the takeoff, so the material order falls
      short mid-build.</li>
</ul>
<p>Only one of those five is genuinely unforeseeable. The other four are
document and takeoff problems, which is the point of this article.</p>

<h2>The change order process, step by step</h2>
<ol>
  <li>The change is identified — in the field, in an RFI response, or by an
      owner request.</li>
  <li>The contractor prices it: labour, material, equipment, and the schedule
      impact.</li>
  <li>The proposal goes to the owner and the design team for review.</li>
  <li>Once agreed, it is issued as a written amendment and signed by both
      parties.</li>
  <li>The contract sum and, where relevant, the contract time are adjusted.</li>
</ol>
<p>Work performed before step 4 is at risk. A verbal approval is not a change
order.</p>
```

Also add to that post the real margin section from
`seo/blog-post-fixes-2026-09-03.md` — the 16%-39.5% range, 26% median,
$43,878 median gap, computed from your own 39 estimates. That is the 30%.

For the blueprints post, the highest-value addition is a worked scale example
answering "how to read 1/4 inch to a foot", plus the symbols table already
written up in the earlier handoff file.

### On "content scores"

The workflow suggests writing to a content score. Treat that number with
caution. No third-party tool has access to Google's ranking data, so a score
is one vendor's model, not a measurement. Two specific risks here:

- Every one of these 63 posts is 752-1,377 words and reads as though it was
  written to a length target. Padding to raise a score would make that worse.
- A score rewards covering the same entities as competitors — which is the 70%.
  It cannot see the 30% that actually differentiates you, because no competitor
  has it.

Use it to spot missing topics. Do not write to the number.

---

## Step 4 — Internal links (DONE, in code)

| | Before | After |
|---|---|---|
| Distinct link targets across the blog | 3 | **57** |
| Internal links created | 3 | **189** |
| Posts with a related strip | 0 | **63** |
| In-article links that 301-redirected | all | **0** |

The strip used to show the three newest posts — the same three links on every
page. Pairings are now computed from post bodies with TF-IDF cosine similarity
(`scripts/build-related-posts.mjs`, output in `src/data/related-posts.ts`).
Plain word overlap is useless here because every post is about construction
estimating; IDF weighting is what makes "warehouse" count and "project" not.

Verified across all 63 posts: 0 mismatches, 0 missing strips.

Regenerate after publishing a post:

```bash
node scripts/build-related-posts.mjs
```

**Still worth doing by hand:** 6 posts receive no inbound link from any other
post, and the four blueprint-estimation posts should all point at
`/blueprint-estimation/` from their opening paragraph. Those are body-content
edits in WordPress.

---

## Step 5 — Pre-publish review

Findings across all 63 live posts.

**Fixed in code:**

- Titles over 60 characters: 63 → 0 (now 33-58)
- Descriptions cut mid-sentence: 58 → 0
- In-article links that redirect: all → 0
- Author byline: 0 posts → 63
- Publisher logo in structured data: added

**Still open, needs WordPress or a decision:**

1. **Unsourced claims.** Three sentences across the two audited posts cite
   studies that do not exist ("A 2026 industry review found…"). Replacement
   copy is in `seo/blog-post-fixes-2026-09-03.md`. This is the plagiarism/
   accuracy check in step 5, and it matters more than formatting.

2. **No images inside any article.** Every post renders exactly two images:
   the site logo and the hero. For the blueprints post this is close to
   disqualifying — the SERP shows a video block, and you have no visual at all.

3. **Word count.** All 63 posts are 752-1,377 words. Every one is below what
   page-1 competitors run on these queries.

4. **Cannibalisation.** Two posts have identical titles. Three cover quantity
   surveying, four cover blueprint estimation, ten are state-by-state variants.
   Content is genuinely distinct (32-38% vocabulary overlap, normal for one
   topic) so this is not duplicate content — but several of your own pages are
   competing for the same search.

5. **No named author.** Byline is the organisation. Google's "Who" test wants a
   person. Needs a real estimator willing to be named.

---

## What I would actually do next

The workflow optimises content. The data says content is not the constraint —
63 posts, zero rankings, DR 14, and every page-1 competitor sitting at DR 28-95.

In priority order:

1. **Links, not posts.** DR 14 against a page-1 floor of DR 28 on the easiest
   target keyword. Nothing in the content workflow moves this.
2. **Pick the winnable target and finish it properly.** "construction change
   order" has 1,300 traffic potential and a buyer audience. Add the four PAA
   sections above and the real margin data.
3. **Stop publishing state-variant pages.** Ten of them, none ranking.
4. **Then** re-run this workflow on new posts.

Monitor in Search Console over 3-6 months as the workflow says — but measure
whether *anything* starts ranking at all, not where individual posts sit.
