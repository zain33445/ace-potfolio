import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectBySlug } from '@/src/data/projects';
import Image from 'next/image';
import CostBreakdownChart from '../projects/[slug]/CostBreakdownChart';
import AduCostCalculator from './AduCostCalculator';

/**
 * ADU cost guide — the one page on this site built keyword-first.
 *
 * Target cluster (~4,150/mo, KD 0-5): "adu construction cost" (900),
 * "adu cost" (900), "500 sq ft adu cost" (600), "adu building cost" (350),
 * "adu cost calculator" (250), "adu cost san diego" (200), "1200 sq ft adu
 * cost" (200). Feasibility is proven rather than assumed: adupals.com ranks
 * #8 at DR 7 and freedomrenovationsd.com #6 at DR 18 for "adu cost san
 * diego". This domain is DR 14.
 *
 * Every figure comes from ONE real estimate — the College Ave ADU in San
 * Diego — read live from extracted-projects.json so the page follows the
 * source data if the extraction is ever corrected. Nothing here is invented,
 * and the only derived numbers (the size table) are labelled as derived.
 * That first-hand division-level breakdown is the thing no other page on
 * that SERP has.
 */

const PROJECT_SLUG = 'college-ave-adu-san-diego';
const BRACKET_SLUG = 'heinzsman-residence';

/* Read off the source PDF, which prints "Date: 15-Jan-25" on 10 of its 11
   pages. NOT the WordPress upload month (2025/03) — that is a bulk-upload
   batch of 33 files and says nothing about when this estimate was prepared. */
const ESTIMATE_DATE = '15 January 2025';
const ESTIMATE_DATE_ISO = '2025-01-15';
const PAGE_REVIEWED_ISO = '2026-09-03';

/* The page-1 General Summary itemises the gap between trade cost and bid.
   Dollar amounts are published, percentages are not: the sheet labels
   insurance 2% / tax 5% while the printed dollars work out to 1.50% / 4.50%,
   and the last-page summary itself prints 4.5%. The dollars reconcile to the
   bid, so those are what we show. */
const MARKUPS = [
  { label: 'Overhead and profit', amount: 52275, perSf: 43.71 },
  { label: 'Insurance', amount: 3921, perSf: 3.28 },
  { label: 'Contingency', amount: 0, perSf: 0 },
  { label: 'Tax', amount: 11762, perSf: 9.83 },
];

/* Verified absent from all 11 pages of the source PDF by text search. The
   only permit line is 20 manhours at $50 — the labour to pull permits, not
   the fees a jurisdiction charges. */
const NOT_INCLUDED = [
  ['Permit and impact fees', 'The estimate carries $1,000 for permits, priced as 20 hours of labour at $50/hr. That is the cost of pulling them, not what the city charges.'],
  ['Design and engineering', 'No architectural, structural or MEP design fees appear anywhere in the estimate. It prices construction from drawings that already exist.'],
  ['Utility connections', 'No sewer, water, gas or electrical service connection or upgrade. One line relocates the existing electric meter; that is all.'],
  ['School and development impact fees', 'Not present. These are jurisdiction-specific and can be substantial for a new dwelling unit.'],
  ['Survey and soils reports', 'No boundary survey, geotechnical work or testing.'],
  ['Solar', 'No photovoltaic system is priced. Check what your jurisdiction requires for a new dwelling.'],
];

function money(n: number): string {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/* Pinned, not interpolated. A title that silently changes when the
   extraction is corrected is an SEO event; a title that silently disagrees
   with the body is worse. Pinning it and asserting against the data below
   means the build breaks instead of the page lying. */
const TITLE_COST_PER_SF = 218.54;

const OG_IMAGE = getProjectBySlug(PROJECT_SLUG)?.imageUrl;

export const metadata: Metadata = {
  title: `ADU Construction Cost: $${TITLE_COST_PER_SF.toFixed(2)} per SF`,
  description:
    'What an ADU actually costs to build, from a real 1,196 sq ft San Diego estimate dated January 2025: $261,375 total, $218.54 per square foot, across all 16 CSI divisions.',
  alternates: {
    canonical: 'https://theaceservices.com/adu-construction-cost/',
  },
  openGraph: {
    type: 'article',
    title: `ADU Construction Cost: $${TITLE_COST_PER_SF.toFixed(2)} per SF | The ACE Services`,
    description:
      'A real 1,196 sq ft San Diego ADU estimate, broken out across all 16 CSI divisions. Total cost, cost per square foot, what it excludes, and the source PDF.',
    url: 'https://theaceservices.com/adu-construction-cost/',
    publishedTime: ESTIMATE_DATE_ISO,
    modifiedTime: PAGE_REVIEWED_ISO,
    ...(OG_IMAGE ? { images: [{ url: OG_IMAGE, alt: 'The College Ave ADU, San Diego' }] } : {}),
  },
};

/* Sizes people actually search for: "500 sq ft adu cost", "1200 sq ft adu
   cost", etc. Scaled from the measured $/SF and labelled as scaled — the
   note below the table says plainly why small ADUs run higher per foot. */
const SIZES = [500, 800, 1000, 1200, 1500];

export default function AduConstructionCostPage() {
  const project = getProjectBySlug(PROJECT_SLUG);

  // The page has no meaning without the source estimate. Fail loudly at
  // build time rather than shipping a page of blanks or zeroes.
  if (!project || !project.hasEstimate || project.costDivisions.length === 0) {
    throw new Error(
      `adu-construction-cost: source project "${PROJECT_SLUG}" is missing or carries no estimate.`,
    );
  }

  const { totalAreaSqFt, estimatedCost, suggestedBid, costPerSf, bidPerSf, costDivisions, pdfUrl } =
    project;

  // The title tag carries this number. If the extraction moves, fail the
  // build rather than let the tag and the page disagree silently.
  if (costPerSf !== TITLE_COST_PER_SF) {
    throw new Error(
      `adu-construction-cost: costPerSf is ${costPerSf} but the title is pinned to ${TITLE_COST_PER_SF}. Update TITLE_COST_PER_SF and re-check the copy.`,
    );
  }

  const bracket = getProjectBySlug(BRACKET_SLUG);

  const divisionsTotal = costDivisions.reduce((sum, d) => sum + d.cost, 0);
  const maxCost = Math.max(...costDivisions.map((d) => d.cost));
  const sorted = [...costDivisions].sort((a, b) => b.cost - a.cost);
  const markup = suggestedBid - estimatedCost;
  const markupPct = (markup / estimatedCost) * 100;

  return (
    <main className="bg-background">
      {/* ── Answer first. The number is the headline, not a service pitch. ── */}
      <section className="relative overflow-hidden border-b border-blueprint-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-blueprint-line) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-blueprint-line) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="mb-8 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <Link href="/" className="transition-colors hover:text-primary">
              HOME
            </Link>
            <span>/</span>
            <span className="text-primary">ADU CONSTRUCTION COST</span>
          </div>

          <h1 className="max-w-4xl font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-on-background md:text-6xl">
            ADU Construction Cost: ${costPerSf.toFixed(2)} per Square Foot
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
            A {totalAreaSqFt.toLocaleString()} sq ft accessory dwelling unit in San Diego came to{' '}
            <strong className="text-on-background">{money(estimatedCost)}</strong> to build, or{' '}
            <strong className="text-on-background">${costPerSf.toFixed(2)} per square foot</strong>.
            That is one real estimate, not an industry average, and it is{' '}
            <strong className="text-on-background">hard construction cost only</strong> — permits,
            design, utility connections and impact fees sit outside it. What it excludes is listed
            in full below. Every division is priced from the drawings, and the source PDF is linked
            at the bottom of the page.
          </p>

          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
            Estimate dated {ESTIMATE_DATE} · San Diego, CA
          </p>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            <Stat label="BUILDING AREA" value={`${totalAreaSqFt.toLocaleString()} SF`} />
            <Stat label="COST TO BUILD" value={money(estimatedCost)} />
            <Stat label="COST PER SF" value={`$${costPerSf.toFixed(2)}`} />
            <Stat label="CSI DIVISIONS" value={String(costDivisions.length)} />
          </div>

          {project.imageUrl && (
            <figure className="mt-12">
              <div className="relative aspect-[16/9] w-full overflow-hidden border border-blueprint-line">
                <Image
                  src={project.imageUrl}
                  alt={`The College Ave accessory dwelling unit in San Diego, the ${totalAreaSqFt.toLocaleString()} sq ft project this cost breakdown is taken from`}
                  fill
                  sizes="(max-width: 1280px) 100vw, 1280px"
                  className="object-cover"
                  priority
                />
              </div>
              <figcaption className="mt-3 font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                4768 College Ave, San Diego CA 92115 — {totalAreaSqFt.toLocaleString()} SF
              </figcaption>
            </figure>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="space-y-16 lg:col-span-8">
            {/* ── Division breakdown — the thing nobody else publishes ── */}
            <section>
              <SectionLabel>WHERE THE MONEY GOES</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                All {costDivisions.length} divisions, priced
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                Finishes are the single largest line at {money(sorted[0].cost)}, which is{' '}
                {((sorted[0].cost / divisionsTotal) * 100).toFixed(0)}% of the build. Most ADU cost
                pages stop at a range. This is the actual estimate.
              </p>

              <div className="mt-8">
                <CostBreakdownChart divisions={costDivisions} maxCost={maxCost} />
              </div>

              <div className="mt-8 overflow-x-auto border border-blueprint-line">
                <table className="w-full border-collapse font-sans text-sm">
                  <thead>
                    <tr className="border-b border-blueprint-line bg-surface">
                      <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        CSI
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Division
                      </th>
                      <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Cost
                      </th>
                      <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        $/SF
                      </th>
                      <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        % of build
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((d) => (
                      <tr key={d.csiCode} className="border-b border-blueprint-line/40">
                        <td className="px-4 py-2.5 font-mono text-xs font-bold text-primary">
                          {d.csiCode}
                        </td>
                        <td className="px-4 py-2.5 text-on-background">{d.name}</td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-background">
                          {money(d.cost)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-surface-variant">
                          ${(d.cost / totalAreaSqFt).toFixed(2)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-surface-variant">
                          {((d.cost / divisionsTotal) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-surface font-bold">
                      <td className="px-4 py-3" />
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-background">
                        Total
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-on-background">
                        {money(divisionsTotal)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-on-background">
                        ${costPerSf.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-on-background">
                        100%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* -- What the number excludes. Reader-harm fix: accurate is not
                   the same as complete, and a homeowner budgeting off the
                   headline figure would be badly wrong. -- */}
            <section>
              <SectionLabel>SCOPE</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                What this number does not include
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                {money(estimatedCost)} is hard construction cost &mdash; the {costDivisions.length}{' '}
                divisions above and nothing else. Each item below was checked against the full text
                of the source estimate and is genuinely absent from it. Budget for these separately.
              </p>

              <dl className="mt-6 divide-y divide-blueprint-line border-y border-blueprint-line">
                {NOT_INCLUDED.map(([term, detail]) => (
                  <div key={term} className="grid gap-1 py-4 md:grid-cols-3 md:gap-6">
                    <dt className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                      {term}
                    </dt>
                    <dd className="font-sans text-sm leading-relaxed text-on-surface-variant md:col-span-2">
                      {detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant">
                None of these are small. If you are working out whether an ADU pencils, treat{' '}
                {money(estimatedCost)} as the construction line in a larger budget, not the budget.
              </p>
            </section>

            {/* ── Cost by size — the long-tail queries, honestly labelled ── */}
            <section>
              <SectionLabel>COST BY SIZE</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                What other ADU sizes work out to
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                Scaled from the measured ${costPerSf.toFixed(2)} per square foot. Only the{' '}
                {totalAreaSqFt.toLocaleString()} sq ft row is a real estimate &mdash; the rest are
                that rate applied to other sizes. All of them are hard construction cost, excluding
                everything listed above.
              </p>

              <div className="mt-6 overflow-x-auto border border-blueprint-line">
                <table className="w-full border-collapse font-sans text-sm">
                  <thead>
                    <tr className="border-b border-blueprint-line bg-surface">
                      <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Size
                      </th>
                      <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Cost to build
                      </th>
                      <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Typical bid
                      </th>
                      <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                        Basis
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...SIZES, totalAreaSqFt]
                      .sort((a, b) => a - b)
                      .map((sf) => {
                        const measured = sf === totalAreaSqFt;
                        return (
                          <tr
                            key={sf}
                            className={`border-b border-blueprint-line/40 ${measured ? 'bg-primary/5' : ''}`}
                          >
                            <td className="px-4 py-2.5 font-mono tabular-nums text-on-background">
                              {sf.toLocaleString()} sq ft
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-background">
                              {measured ? money(estimatedCost) : money(sf * costPerSf)}
                            </td>
                            <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-surface-variant">
                              {measured ? money(suggestedBid) : money(sf * bidPerSf)}
                            </td>
                            <td className="px-4 py-2.5 font-mono text-xs uppercase tracking-wider">
                              {measured ? (
                                <span className="font-bold text-primary">Real estimate</span>
                              ) : (
                                <span className="text-on-surface-variant">Scaled</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant">
                Treat the small end as optimistic. A kitchen, a bathroom, a service panel and a
                meter cost roughly the same whether the unit is 500 sq ft or 1,200, so those fixed
                items are spread over fewer feet and the real rate per square foot climbs as the
                unit shrinks. A 500 sq ft ADU will usually come in above ${costPerSf.toFixed(2)} per
                foot, not at it.
              </p>
            </section>

            {/* -- Cost vs bid, itemised from the estimate's own summary -- */}
            <section>
              <SectionLabel>COST VERSUS BID</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                Why the quote is higher than the cost
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                {money(estimatedCost)} is what the work costs. The suggested bid was{' '}
                <strong className="text-on-background">{money(suggestedBid)}</strong> &mdash; $
                {bidPerSf.toFixed(2)} per square foot. The estimate itemises the difference rather
                than rolling it into a single margin:
              </p>

              <div className="mt-6 overflow-x-auto border border-blueprint-line">
                <table className="w-full border-collapse font-sans text-sm">
                  <tbody>
                    <tr className="border-b border-blueprint-line bg-surface">
                      <td className="px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-on-background">
                        Total trade cost
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-on-background">
                        {money(estimatedCost)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-on-surface-variant">
                        ${costPerSf.toFixed(2)}/SF
                      </td>
                    </tr>
                    {MARKUPS.map((m) => (
                      <tr key={m.label} className="border-b border-blueprint-line/40">
                        <td className="px-4 py-2.5 text-on-background">{m.label}</td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-background">
                          {m.amount === 0 ? '—' : money(m.amount)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-surface-variant">
                          {m.perSf === 0 ? '—' : `$${m.perSf.toFixed(2)}/SF`}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-surface font-bold">
                      <td className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-on-background">
                        Suggested bid
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-on-background">
                        {money(suggestedBid)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums text-on-background">
                        ${bidPerSf.toFixed(2)}/SF
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant">
                Overhead and profit is the large one, at 20% of trade cost. Contingency was carried
                at zero here, which is a choice rather than a default &mdash; on a job with more
                unknowns you would expect it funded. If you are a homeowner collecting quotes, the
                number a builder hands you is the bid. If you are the contractor, the cost is the
                figure you have to defend.
              </p>
            </section>

            {/* -- Two real estimates at identical area. The strongest available
                   answer to "does one data point generalise?" -- */}
            {bracket?.hasEstimate && bracket.buildingGsf === totalAreaSqFt && (
              <section>
                <SectionLabel>HOW FAR THE NUMBER MOVES</SectionLabel>
                <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                  Same square footage, {(bracket.costPerSf / costPerSf).toFixed(1)}&times; the cost
                </h2>
                <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                  We estimated another {totalAreaSqFt.toLocaleString()} sq ft residential project,
                  the Heinzsman Residence, at {money(bracket.estimatedCost)} &mdash; $
                  {bracket.costPerSf.toFixed(2)} per square foot against this ADU&rsquo;s $
                  {costPerSf.toFixed(2)}. Identical area,{' '}
                  {(bracket.costPerSf / costPerSf).toFixed(1)}&times; apart. Square footage alone
                  does not set the number; specification does.
                </p>

                <div className="mt-6 overflow-x-auto border border-blueprint-line">
                  <table className="w-full border-collapse font-sans text-sm">
                    <thead>
                      <tr className="border-b border-blueprint-line bg-surface">
                        <th className="px-4 py-3 text-left font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                          Project
                        </th>
                        <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                          Area
                        </th>
                        <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                          Cost
                        </th>
                        <th className="px-4 py-3 text-right font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                          $/SF
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-blueprint-line/40 bg-primary/5">
                        <td className="px-4 py-2.5 text-on-background">
                          College Ave ADU (this page)
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-surface-variant">
                          {totalAreaSqFt.toLocaleString()} SF
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-background">
                          {money(estimatedCost)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-background">
                          ${costPerSf.toFixed(2)}
                        </td>
                      </tr>
                      <tr className="border-b border-blueprint-line/40">
                        <td className="px-4 py-2.5 text-on-background">
                          <Link
                            href={`/projects/${BRACKET_SLUG}/`}
                            className="text-primary hover:underline"
                          >
                            Heinzsman Residence
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-surface-variant">
                          {bracket.buildingGsf.toLocaleString()} SF
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-background">
                          {money(bracket.estimatedCost)}
                        </td>
                        <td className="px-4 py-2.5 text-right font-mono tabular-nums text-on-background">
                          ${bracket.costPerSf.toFixed(2)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant">
                  Both estimates cross-check: the per-square-foot figure printed on each PDF matches
                  the figure derived from that PDF&rsquo;s own total and area. The matching square
                  footage is coincidence &mdash; the two projects share no scope, rates or divisions.
                </p>
              </section>
            )}

            {/* -- Calculator. Serves "adu cost calculator" with our own rate. -- */}
            <section>
              <SectionLabel>ESTIMATE YOUR OWN</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                ADU cost calculator
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                Applies this project&rsquo;s measured rates to a size of your choosing. It is
                arithmetic on one data point, not a quote.
              </p>
              <div className="mt-6 max-w-xl">
                <AduCostCalculator costPerSf={costPerSf} bidPerSf={bidPerSf} />
              </div>
            </section>

            {/* -- Regional variance, flagged as general rather than measured -- */}
            <section>
              <SectionLabel>OTHER MARKETS</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                How far this travels
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                This is a San Diego estimate, and San Diego is an expensive labour market with
                California&rsquo;s energy and seismic requirements priced in. The following is
                general guidance rather than anything measured here: labour rates, code
                requirements, site access and finish level are what move the rate most between
                markets. A tight infill lot a pump truck cannot reach costs more than the drawings
                suggest, anywhere in the country.
              </p>
            </section>

            {/* ── Source ── */}
            <section>
              <SectionLabel>SOURCE</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                Check the estimate yourself
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                Every figure on this page comes from one estimate for a{' '}
                {totalAreaSqFt.toLocaleString()} sq ft ADU at 4768 College Ave, San Diego, prepared
                by The ACE Services and dated {ESTIMATE_DATE}. Quantities were taken off the permit
                drawings and unit-priced by CSI division. The divisions add to{' '}
                {money(divisionsTotal)}, which is the stated total exactly, and the printed bid per
                square foot matches the figure derived from the total and the area.
              </p>
              <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant">
                Construction pricing moves. This estimate is a{' '}
                {ESTIMATE_DATE.split(' ').slice(1).join(' ')} basis for one San Diego project &mdash;
                check it against current local pricing before you rely on it.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                {pdfUrl && (
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
                  >
                    Open the source estimate (PDF)
                  </a>
                )}
                <Link
                  href={`/projects/${PROJECT_SLUG}/`}
                  className="inline-flex items-center gap-2 border border-blueprint-line px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-on-background transition-all hover:border-primary hover:text-primary"
                >
                  See the full project
                </Link>
              </div>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              {/* Homeowner path first: this page ranks for homeowner intent,
                  and "send us your drawings" is unusable without drawings. */}
              <div className="border border-blueprint-line p-6">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                  If you are a homeowner
                </div>
                <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant">
                  You probably came here to sanity-check a quote. Three things this page is good
                  for: compare a builder&rsquo;s bid against ${bidPerSf.toFixed(2)}/SF rather than a
                  national range; ask any builder to break their number out by division the way the
                  table above does, and treat vagueness as a red flag; and confirm in writing
                  whether permits, design, utility connections and impact fees are inside or outside
                  their price, because they are outside this one.
                </p>
              </div>

              <div className="mt-6 border border-blueprint-line bg-surface p-6">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  If you are building it
                </div>
                <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant">
                  Send us the drawings and you get quantities counted off the plans, unit pricing by
                  CSI division and a total you can bid. Most jobs come back in 24 to 48 hours.
                </p>
                <Link
                  href="/contact-us/"
                  className="mt-5 inline-flex w-full items-center justify-center border border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
                >
                  Request an estimate
                </Link>
              </div>

              <div className="mt-6 border border-blueprint-line p-6">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                  Related
                </div>
                <ul className="mt-4 space-y-3 font-sans text-sm">
                  <li>
                    <Link href="/cost-estimating/" className="text-primary hover:underline">
                      Construction cost estimating
                    </Link>
                  </li>
                  <li>
                    <Link href="/quantity-surveyor-services/" className="text-primary hover:underline">
                      Quantity takeoffs
                    </Link>
                  </li>
                  <li>
                    <Link href="/projects/" className="text-primary hover:underline">
                      Sample estimates
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'Article',
                headline: `ADU Construction Cost: $${costPerSf.toFixed(2)} per Square Foot`,
                description: `A real ${totalAreaSqFt.toLocaleString()} sq ft San Diego ADU estimate: ${money(estimatedCost)} total, $${costPerSf.toFixed(2)} per square foot, across ${costDivisions.length} CSI divisions.`,
                mainEntityOfPage: 'https://theaceservices.com/adu-construction-cost/',
                datePublished: ESTIMATE_DATE_ISO,
                dateModified: PAGE_REVIEWED_ISO,
                ...(project.imageUrl ? { image: project.imageUrl } : {}),
                author: { '@id': 'https://theaceservices.com/#organization' },
                publisher: { '@id': 'https://theaceservices.com/#organization' },
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  {
                    '@type': 'ListItem',
                    position: 1,
                    name: 'Home',
                    item: 'https://theaceservices.com',
                  },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'ADU Construction Cost',
                    item: 'https://theaceservices.com/adu-construction-cost/',
                  },
                ],
              },
            ],
          }),
        }}
      />
    </main>
  );
}

/* ── Bits ──────────────────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </div>
      <div className="mt-1 font-[family-name:var(--font-space)] text-3xl font-bold tabular-nums text-on-background">
        {value}
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
      {children}
    </div>
  );
}

function Card({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className="border border-blueprint-line p-5">
      <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </div>
      <div className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold tabular-nums text-on-background">
        {value}
      </div>
      <div className="mt-1 font-sans text-xs text-on-surface-variant">{note}</div>
    </div>
  );
}
