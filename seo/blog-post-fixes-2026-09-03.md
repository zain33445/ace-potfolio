# Blog post fixes — WordPress side

Companion to the code changes of 2026-09-03. Everything here has to be pasted
into WordPress by hand: the WP client in this repo is read-only (no auth), so
nothing below could be applied automatically.

Two posts audited:

- `/how-to-read-construction-blueprints/`
- `/construction-change-order-causes-prevention/`

Code-side items (link normalisation, titles, meta descriptions, byline,
related posts, publisher logo) are already done and verified — see the commit.

---

## 1. Excerpts — paste into the WP "Excerpt" field

Both posts currently have excerpts that stop mid-sentence. WordPress clips
them, `cleanExcerpt()` strips the trailing `[…]` marker, and the dangling
clause reaches the meta description, `og:description` and the Article schema.

The code now prefers a hand-written override from `src/data/post-seo.ts`, so
the SERP is already fixed. **The excerpt is still wrong everywhere else it is
used** — blog index cards, related-post strips, any future feed. Fix it at
source:

**How to Read Construction Blueprints**

> Estimators read a blueprint in a fixed order: title block and scale, then
> plans, elevations and sections, then schedules and specs. The full sequence.

**Construction Change Orders**

> Change orders trace back to five recurring causes: loose takeoffs, design
> errors, MEP clashes, scope changes and site conditions. How to catch each
> one early.

Once these are in WP, the overrides in `src/data/post-seo.ts` become
redundant for the description (keep the `title` overrides — post titles still
double as H1s and are too long for the SERP).

---

## 2. Unsourced claims — cut or source, do not leave as-is

Three sentences across the two posts make authoritative statistical claims
with no name, no link and no date. This is the single most damaging thing on
either page, because it is the exact pattern that reads as machine-generated,
on a site whose entire differentiator is publishing real numbers from real
estimates.

### Blueprints post

Currently:

> A 2026 industry review of rebid causes found that a large share of costly
> change orders trace back to drawing misinterpretation rather than site
> conditions.

There is no such review cited anywhere. Replace with a claim you own:

> In our own estimating work the pattern is consistent: the expensive errors
> are desk errors — a missed revision, a misread scale, a schedule never
> opened — not surprises found in the ground.

### Change orders post

Currently:

> Industry data consistently shows that change orders are one of the top
> three causes of both cost overruns and schedule delays in commercial
> construction.

Replace with:

> Change orders are where a profitable bid quietly stops being profitable.
> They rarely arrive as one large event; they accumulate.

Currently:

> Contractors who invest in coordinated shop drawing review up front
> consistently report fewer field-discovered conflicts and fewer resulting
> change orders.

Replace with:

> A clash resolved on paper costs drafting time. The same clash found in the
> field costs demolition, rework, a schedule slip and usually a change order.

**If you want a real citation instead**, source it yourself and send me the
link — I will not name a study I have not read. Genuine candidates exist
(construction industry institutes and university research groups publish on
rework and change-order cost), but a real citation needs a real URL, author
and year on the page.

---

## 3. "The Real Cost of a Change Order" — put an actual number in it

This H2 promises a cost and delivers a generality. It is also the section you
are uniquely equipped to fill, because you have the data.

Computed from `src/data/extracted-projects.json`, across the **39 estimates
that carry both a cost and a suggested bid**:

| Metric | Value |
|---|---|
| Estimates in the sample | 39 |
| Margin between cost and suggested bid — lowest | 16.0% |
| Margin — median | 26.0% |
| Margin — highest | 39.5% |
| Median dollar gap between cost and bid | $43,878 |

Suggested replacement copy:

> ### The real cost of a change order
>
> A change order does not come out of the project. It comes out of the margin.
>
> Across the 39 estimates in our own portfolio that carry both a construction
> cost and a suggested bid, the gap between the two — everything covering
> overhead, profit and risk — runs from 16% to 39.5%, with a median of 26%.
> In dollars, the median project's entire margin is about $43,878.
>
> That is the number a change order eats into. On a median project, a single
> unpriced $20,000 change order consumes close to half of everything the job
> was ever going to earn. Two of them and the project is being built for free.
>
> This is why change orders are a pre-construction problem. Once the contract
> is signed, every one of them is subtracted from a fixed and fairly small
> number.

Check the $20,000 illustration against a job you recognise before publishing —
the 16–39.5% range and the $43,878 median are computed directly from your
files, but that example is arithmetic on the median, not a real change order.

Worth linking that section to `/adu-construction-cost/`, which shows the same
cost-versus-bid split worked through on a single real estimate.

---

## 4. Images — the blueprints post needs them badly

Both posts render exactly two images: the site logo and the hero. Nothing
inside the article body.

For a post about reading drawings this is close to disqualifying — that SERP
is diagrams, symbol charts and annotated title blocks, and you are describing
them in prose. It is also why the post has nothing anyone would link to.

Minimum set, in priority order:

1. **Annotated title block** — one real title block from a permit set with
   callouts for scale, revision number and date, sheet number, discipline
   letter. Goes in "Step 1".
   Alt: `Construction drawing title block with scale, revision date and sheet number marked`
2. **Symbol legend sheet** — the common line types and hatch patterns.
   Goes in "Step 3".
   Alt: `Common construction blueprint symbols: line types, hatch patterns and section markers`
3. **Drawing hierarchy diagram** — site plan → floor plan → elevation →
   section → detail → schedule. Goes in "Step 2".
   Alt: `Construction drawing set hierarchy from site plan through schedules`

Redact any client-identifying information before publishing. Use real sheets
from your own work rather than stock art — a real redacted title block is
first-hand evidence and stock art is not.

The hero images on both posts also use the full post title as alt text.
Replace with something descriptive of the image itself.

---

## 5. Symbols reference table (blueprints post, Step 3)

Ready to paste. This is the passage most likely to be pulled into an AI
answer or a featured snippet, because it is the only structured reference on
the page. Extend it with the conventions you actually use.

```html
<table>
  <caption>Common construction drawing conventions</caption>
  <thead>
    <tr><th>Convention</th><th>Typical meaning</th><th>Where it appears</th></tr>
  </thead>
  <tbody>
    <tr><td>Solid line</td><td>Visible or existing element</td><td>All disciplines</td></tr>
    <tr><td>Dashed line</td><td>Hidden, above, or to be removed</td><td>All disciplines</td></tr>
    <tr><td>Circle with number and sheet reference</td><td>Detail or section cut drawn elsewhere in the set</td><td>Plans, elevations</td></tr>
    <tr><td>Hatch pattern</td><td>Material — concrete, masonry, insulation, earth</td><td>Sections, details</td></tr>
    <tr><td>Sheet prefix A</td><td>Architectural</td><td>Title block</td></tr>
    <tr><td>Sheet prefix S</td><td>Structural</td><td>Title block</td></tr>
    <tr><td>Sheet prefix M / E / P</td><td>Mechanical / electrical / plumbing</td><td>Title block</td></tr>
  </tbody>
</table>
```

---

## 6. Still open — needs your decision

**A named author.** The code now renders an organisation byline linked to
`/about-us/`, and the Article schema author is `Organization`. That is the
honest floor, not the goal. Google's "Who" test wants a person with
credentials. The day a real estimator is willing to be named, swap in a
`Person` in both places — I will not invent one.

**Word count.** 1,389 and 1,246 words. Both under the 1,500 floor and thin
for these SERPs. The additions above (real margin data, symbols table, image
captions) close most of that gap honestly, rather than by padding.

**Intent, on the blueprints post.** "How to read construction blueprints" is
an apprentice and student query — trade schools, YouTube, software vendors.
Very little of that traffic buys outsourced estimating. Keep the post for
topical authority and links, but judge it on rankings and referring domains,
not leads. The change-orders post is the one aimed at buyers; prioritise it.
