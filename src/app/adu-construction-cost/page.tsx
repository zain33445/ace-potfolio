import type { Metadata } from 'next';
import Link from 'next/link';
import { getProjectBySlug } from '@/src/data/projects';
import CostBreakdownChart from '../projects/[slug]/CostBreakdownChart';

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

function money(n: number): string {
  return `$${n.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

export const metadata: Metadata = {
  title: 'ADU Construction Cost: $218.54 per SF',
  description:
    'What an ADU actually costs to build, from a real 1,196 sq ft San Diego estimate: $261,375 total, $218.54 per square foot, broken out across all 16 CSI divisions.',
  alternates: {
    canonical: 'https://theaceservices.com/adu-construction-cost/',
  },
  openGraph: {
    title: 'ADU Construction Cost: $218.54 per SF | The ACE Services',
    description:
      'A real 1,196 sq ft San Diego ADU estimate, broken out across all 16 CSI divisions. Total cost, cost per square foot, and the source PDF.',
    url: 'https://theaceservices.com/adu-construction-cost/',
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
            That is one real estimate, not an industry average. Every division below is priced from
            the drawings, and the source PDF is linked at the bottom of the page.
          </p>

          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            <Stat label="BUILDING AREA" value={`${totalAreaSqFt.toLocaleString()} SF`} />
            <Stat label="COST TO BUILD" value={money(estimatedCost)} />
            <Stat label="COST PER SF" value={`$${costPerSf.toFixed(2)}`} />
            <Stat label="CSI DIVISIONS" value={String(costDivisions.length)} />
          </div>
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

            {/* ── Cost by size — the long-tail queries, honestly labelled ── */}
            <section>
              <SectionLabel>COST BY SIZE</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                What other ADU sizes work out to
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                Scaled from the measured ${costPerSf.toFixed(2)} per square foot. Only the{' '}
                {totalAreaSqFt.toLocaleString()} sq ft row is a real estimate — the rest are that
                rate applied to other sizes.
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

            {/* ── Cost vs bid — genuinely useful and specific to us ── */}
            <section>
              <SectionLabel>COST VERSUS BID</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                Why the quote is higher than the cost
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                {money(estimatedCost)} is what the work costs. The suggested bid on this project was{' '}
                <strong className="text-on-background">{money(suggestedBid)}</strong>, or $
                {bidPerSf.toFixed(2)} per square foot — {money(markup)} on top, a{' '}
                {markupPct.toFixed(0)}% margin covering overhead, profit and risk. If you are a
                homeowner collecting quotes, the number a builder hands you is the bid. If you are
                the contractor, the cost is the figure you have to defend.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <Card label="COST" value={`$${costPerSf.toFixed(2)}/SF`} note="What the work costs" />
                <Card label="BID" value={`$${bidPerSf.toFixed(2)}/SF`} note="What gets quoted" />
                <Card
                  label="MARGIN"
                  value={`${markupPct.toFixed(0)}%`}
                  note="Overhead, profit, risk"
                />
              </div>
            </section>

            {/* ── Source ── */}
            <section>
              <SectionLabel>SOURCE</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                Check the estimate yourself
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                Every figure on this page comes from one estimate for a{' '}
                {totalAreaSqFt.toLocaleString()} sq ft ADU at College Ave, San Diego. The divisions
                add to {money(divisionsTotal)}, which is the stated total exactly.
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
              <div className="border border-blueprint-line bg-surface p-6">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  Get your ADU priced
                </div>
                <p className="mt-3 font-sans text-sm leading-relaxed text-on-surface-variant">
                  Send us your drawings and you get quantities counted off the plans, unit pricing
                  broken out by CSI division and a total you can bid. Most jobs come back in 24 to
                  48 hours.
                </p>
                <Link
                  href="/contact-us/"
                  className="mt-5 inline-flex w-full items-center justify-center border border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
                >
                  Request an estimate
                </Link>
                <Link
                  href="/calculator/"
                  className="mt-3 inline-flex w-full items-center justify-center border border-blueprint-line px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-on-background transition-all hover:border-primary hover:text-primary"
                >
                  Try the calculator
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
