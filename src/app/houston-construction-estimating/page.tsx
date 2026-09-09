import type { Metadata } from 'next';
import Link from 'next/link';
import extracted from '@/src/data/extracted-projects.json';
import { BUSINESS_ID, ORGANIZATION_ID, GBP_URL, SITE_URL } from '@/src/lib/schema';

/**
 * Houston local hub — the single local page for the metro.
 *
 * Spec: seo/SITE-STRUCTURE.md "Local SEO (Houston-specific)". Deliberately
 * ONE page: no /katy-, /sugar-land-, /the-woodlands- siblings, because we
 * have no per-city projects or reviews to gate them on.
 *
 * Every regulatory claim below is sourced and dated in a comment next to it.
 * The office is real (16319 Hillside Garden LN) and the estimating work is
 * delivered remotely nationwide, so the page never claims a Houston job it
 * cannot show — the portfolio numbers are the whole published sample set,
 * labelled as such.
 */

const PAGE_PATH = '/houston-construction-estimating/';
const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;
const REVIEWED_ISO = '2026-09-09';

const PHONE = '+1-346-458-0237';
const PHONE_HREF = 'tel:+13464580237';

/* Real, published sample estimates — the same JSON the /projects pages read.
   Counted at build time so the page cannot drift from the portfolio. */
const PROJECTS = (extracted as { projects: Array<{ hasEstimate: boolean; totalAreaSqFt: number; estimatedCost: number }> })
  .projects;
const ESTIMATES = PROJECTS.filter((p) => p.hasEstimate);
const SAMPLE_COUNT = ESTIMATES.length;
const SAMPLE_SF = ESTIMATES.reduce((s, p) => s + (p.totalAreaSqFt || 0), 0);
const SAMPLE_VALUE = ESTIMATES.reduce((s, p) => s + (p.estimatedCost || 0), 0);

/* Four things that change a number in this metro and nowhere else. Sources
   checked 9 September 2026. */
const LOCAL_FACTORS = [
  {
    label: 'Floodplain elevation',
    heading: 'Chapter 19 puts the finished floor 2 ft above the 500-year flood elevation',
    /* City of Houston Code of Ordinances ch. 19: "Minimum flood protection
       elevation means the 0.2 percent flood elevation, plus 2 feet."
       Adopted April 2018, effective 1 Sept 2018; covers new construction and
       existing homes expanded by 33% or more. */
    body: 'Inside a Houston special flood hazard area the minimum flood protection elevation is the 0.2 percent (500-year) flood elevation plus two feet, and it applies to new construction and to any existing structure expanded by a third or more. On a takeoff that is fill and compaction, a taller stem wall or a pier-and-beam frame instead of a slab, longer service runs, and a floodplain development permit on top of the building permit. It is one of the largest swings between a Houston number and the same drawings priced anywhere else.',
  },
  {
    label: 'Windstorm',
    heading: 'East of Highway 146 is a different envelope spec',
    /* TDI: "Except for Harris County, the entire county ... Within Harris
       County, the structure must be located East of Highway 146 and within
       the city limits of the cities shown on the map." And: from 1 April
       2026 WPI-1 applications must certify to the 2024 IRC or 2024 IBC. */
    body: 'Only the part of Harris County east of Highway 146, inside the city limits shown on the TDI map, sits in the designated catastrophe area. On that side of the line a job needs a WPI-1 certificate for TWIA windstorm coverage, and since 1 April 2026 that certification runs against the 2024 IRC or 2024 IBC — impact-rated glazing or shutters, rated assemblies, third-party inspection. West of it, none of that is required. Two otherwise identical buildings price differently, and the deciding factor is which side of a highway they are on.',
  },
  {
    label: 'Code edition',
    heading: 'The city runs the 2021 I-Codes; the jurisdiction next door may not',
    /* Houston City Council adopted the 2021 I-Codes 25 Oct 2023, effective
       January 2024 (IBC, IRC, IEBC, IFC, ISPSC, IECC, plus 2021 UMC/UPC and
       the 2023 NEC). */
    body: 'The City of Houston has been on the 2021 International Building, Residential, Existing Building, Fire, Swimming Pool and Energy Conservation Codes since January 2024, with the 2021 UMC and UPC and the 2023 NEC alongside them. The metro is a patchwork of municipalities and unincorporated county, so a set of drawings can cross into a jurisdiction on a different edition. We price to the code the permitting authority is actually enforcing, not to whichever edition the drawings were drafted under.',
  },
  {
    label: 'No zoning',
    heading: 'Site cost lives in Chapters 42, 26 and 33',
    /* City of Houston Planning: "The City of Houston does not have zoning,
       but development is governed by ordinance codes that address how
       property can be subdivided" — ch. 42 platting/development, ch. 26
       off-street parking, ch. 33 tree and shrub. */
    body: 'Houston has no zoning ordinance. What governs a site instead is Chapter 42 for platting and development, Chapter 26 for off-street parking and Chapter 33 for trees and landscape. There is no use table to read the site cost off, so parking counts, setbacks, buffering, paving and the tree and shrub requirement all have to be taken off the site plan directly. Estimators who work from a zoning-code habit routinely miss the landscape and paving quantities here.',
  },
];

/* Named because the office is here and the team works the metro — not
   because there is a landing page behind each one. There isn't, by design. */
const AREAS = [
  'Houston',
  'Katy',
  'Cypress',
  'Sugar Land',
  'The Woodlands',
  'Pearland',
  'Spring',
  'Missouri City',
  'Conroe',
  'Baytown',
  'League City',
  'Unincorporated Harris County',
];

const DELIVERABLES = [
  ['Cost estimates', 'AACE Class 3 estimates by CSI MasterFormat division, in editable Excel and a PDF you can hand to a client.'],
  ['Quantity takeoffs', 'Material, labour and equipment quantities measured off the drawings, with the measurement basis shown so anyone can check a line.'],
  ['Bid packages', 'Trade-by-trade scope splits for subcontractor pricing, plus the summary sheet that rolls them up.'],
  ['Permit sets', 'Drawing packages assembled for municipal submission, including PE-stamped sheets where the submission requires one.'],
  ['Shop drawings', 'Fabrication-ready MEP, structural, millwork and architectural drawings, coordinated before anything is cut.'],
  ['3D renderings', 'Exterior and interior renderings for permitting, stakeholder sign-off and marketing.'],
];

const FAQS = [
  {
    q: 'Do you work on projects outside Houston?',
    a: 'Yes. The office is in Houston at 16319 Hillside Garden LN and the work is delivered remotely to contractors across all 50 states. The Houston-specific part of this page is the local code knowledge, not a service boundary.',
  },
  {
    q: 'How long does a Houston estimate take?',
    a: 'Most jobs come back in 24 to 48 hours from the time we have a complete drawing set. Large or phased packages take longer, and we tell you the turnaround before starting rather than after.',
  },
  {
    q: 'What do you need to start?',
    a: 'The drawing set — architectural, structural and MEP if they exist — plus the specification, any addenda, and the bid date. If you know the jurisdiction and whether the site is in a special flood hazard area, say so; it changes the foundation and permitting lines.',
  },
  {
    q: 'Does the estimate include permit fees?',
    a: 'Only if you ask for them. A standard estimate is hard construction cost by division. Permit and impact fees, design fees, utility connection charges and survey work sit outside it unless the scope says otherwise, and we label what is excluded on the summary sheet.',
  },
  {
    q: 'Do you handle the windstorm requirements for coastal Harris County?',
    a: 'We price the envelope to whatever the job needs. If the site is east of Highway 146 inside the designated catastrophe area, the estimate carries impact-rated openings and the rated assemblies a WPI-1 certification requires. If it is not, we do not pad the number with protection nobody is going to ask for.',
  },
  {
    q: 'Can you produce a permit set for the City of Houston?',
    a: 'Yes, including PE-stamped sheets where the submission calls for one. Tell us which authority you are submitting to — the City Permitting Center and Harris County Engineering are separate submissions with different requirements.',
  },
];

export const metadata: Metadata = {
  title: 'Construction Estimating Services in Houston, TX',
  description:
    'Houston construction estimating and takeoffs from a Houston office: AACE Class 3 estimates by CSI division, typically in 24 to 48 hours. Priced to the 2021 Houston construction code, Chapter 19 floodplain elevation and Harris County windstorm requirements.',
  alternates: { canonical: PAGE_URL },
  openGraph: {
    type: 'website',
    title: 'Construction Estimating Services in Houston, TX | The ACE Services',
    description:
      'Cost estimates, takeoffs, permit sets and shop drawings from a Houston office, priced to the code the local authority is actually enforcing.',
    url: PAGE_URL,
  },
};

export default function HoustonConstructionEstimatingPage() {
  // The stat bar is the page's credibility. Blank or zero numbers here are
  // worse than no stat bar, so fail the build instead.
  if (SAMPLE_COUNT === 0 || SAMPLE_SF === 0) {
    throw new Error('houston-construction-estimating: extracted-projects.json carries no estimates.');
  }

  return (
    <main className="bg-background">
      {/* ── Hero ── */}
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
            <span className="text-primary">HOUSTON CONSTRUCTION ESTIMATING</span>
          </div>

          <h1 className="max-w-4xl font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-on-background md:text-6xl">
            Construction Estimating in Houston, Texas
          </h1>

          <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
            We are an estimating office in west Houston. Send a drawing set and you get quantities
            taken off the plans, unit pricing by CSI division and a total you can bid &mdash; usually
            in{' '}
            <strong className="text-on-background">24 to 48 hours</strong>. The local part is not a
            marketing line: a Houston job carries floodplain elevation, a windstorm envelope that
            depends on which side of Highway 146 it sits, the 2021 city construction code and a site
            cost that has no zoning table behind it. All four are priced below.
          </p>

          <p className="mt-4 font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
            16319 Hillside Garden LN, Houston TX 77084 &middot; {PHONE}
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="/contact-us/"
              className="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
            >
              Request an estimate
            </Link>
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2 border border-blueprint-line px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-on-background transition-all hover:border-primary hover:text-primary"
            >
              Call {PHONE}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            <Stat label="SAMPLE ESTIMATES PUBLISHED" value={String(SAMPLE_COUNT)} />
            <Stat label="AREA PRICED" value={`${SAMPLE_SF.toLocaleString()} SF`} />
            <Stat
              label="CONSTRUCTION VALUE"
              value={`$${(SAMPLE_VALUE / 1_000_000).toFixed(1)}M`}
            />
            <Stat label="TYPICAL TURNAROUND" value="24-48 HRS" />
          </div>
          <p className="mt-3 font-sans text-xs text-on-surface-variant">
            Every one of those estimates is published in full, with the source PDF, on our{' '}
            <Link href="/projects/" className="text-primary hover:underline">
              sample estimates
            </Link>{' '}
            pages. They are drawn from work across the United States, not from Houston alone.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="space-y-16 lg:col-span-8">
            {/* ── The actual local content ── */}
            <section>
              <SectionLabel>WHAT HOUSTON ADDS TO A NUMBER</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                Four things that move a Houston estimate
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                None of these show up in a national cost database. Each one is a real line item on a
                Houston takeoff, and getting any of them wrong is a five-figure miss on a mid-size
                job.
              </p>

              <div className="mt-8 space-y-8">
                {LOCAL_FACTORS.map((f) => (
                  <div key={f.label} className="border-l-2 border-primary pl-5">
                    <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-primary">
                      {f.label}
                    </div>
                    <h3 className="mt-2 font-[family-name:var(--font-space)] text-lg font-bold text-on-background">
                      {f.heading}
                    </h3>
                    <p className="mt-3 font-sans leading-relaxed text-on-surface-variant">
                      {f.body}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 max-w-2xl font-sans text-sm leading-relaxed text-on-surface-variant">
                Code and floodplain rules change. The requirements above were checked against the
                City of Houston Code of Ordinances, the city&rsquo;s 2021 construction code adoption
                and the Texas Department of Insurance windstorm program in September 2026 &mdash;
                confirm anything you are budgeting against with the authority having jurisdiction.
              </p>
            </section>

            {/* ── Deliverables ── */}
            <section>
              <SectionLabel>WHAT YOU GET</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                Deliverables
              </h2>
              <dl className="mt-6 divide-y divide-blueprint-line border-y border-blueprint-line">
                {DELIVERABLES.map(([term, detail]) => (
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
                Full detail on each of these is on the{' '}
                <Link href="/services/" className="text-primary hover:underline">
                  services
                </Link>{' '}
                pages, and the{' '}
                <Link href="/quantity-surveyor-services/" className="text-primary hover:underline">
                  quantity takeoff service
                </Link>{' '}
                page covers the measurement side on its own.
              </p>
            </section>

            {/* ── How it works ── */}
            <section>
              <SectionLabel>HOW IT WORKS</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                From drawings to a number you can bid
              </h2>
              <ol className="mt-6 space-y-5">
                {[
                  ['01', 'Send the set', 'Drawings, specification, addenda and the bid date. We come back with anything missing before we start, not halfway through.'],
                  ['02', 'We take it off', 'Quantities measured off the plans by CSI division, priced against current local supplier and labour rates for the jurisdiction the job is in.'],
                  ['03', 'Senior review', 'A second estimator checks the takeoff against the drawings and the pricing against the market before it leaves.'],
                  ['04', 'You get the file', 'Editable Excel with the formulas intact, plus a PDF summary. Ask a question about any line and you get the measurement it came from.'],
                ].map(([num, title, body]) => (
                  <li key={num} className="flex gap-5">
                    <span className="font-mono text-sm font-bold text-primary">{num}</span>
                    <div>
                      <div className="font-[family-name:var(--font-space)] font-bold text-on-background">
                        {title}
                      </div>
                      <p className="mt-1 font-sans text-sm leading-relaxed text-on-surface-variant">
                        {body}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ── Areas ── */}
            <section>
              <SectionLabel>WHERE WE WORK</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                The metro, and everywhere else
              </h2>
              <p className="mt-4 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                The office is in Houston 77084 and we estimate across the metro and the surrounding
                counties:
              </p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {AREAS.map((a) => (
                  <li
                    key={a}
                    className="border border-blueprint-line px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-on-surface-variant"
                  >
                    {a}
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-2xl font-sans leading-relaxed text-on-surface-variant">
                Estimating is drawing work, so the delivery is remote and the client list is
                nationwide &mdash; contractors in all 50 states, run out of the Houston office. There
                is one page for this metro rather than a page per suburb, because a separate page for
                Katy or Sugar Land would say the same thing with the town name swapped.
              </p>
            </section>

            {/* ── FAQ ── */}
            <section>
              <SectionLabel>QUESTIONS</SectionLabel>
              <h2 className="mt-2 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
                Frequently asked
              </h2>
              <dl className="mt-6 divide-y divide-blueprint-line border-y border-blueprint-line">
                {FAQS.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="font-[family-name:var(--font-space)] font-bold text-on-background">
                      {f.q}
                    </dt>
                    <dd className="mt-2 font-sans text-sm leading-relaxed text-on-surface-variant">
                      {f.a}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>

          {/* ── Sidebar ── */}
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <div className="border border-blueprint-line bg-surface p-6">
                <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  The Houston office
                </div>
                <address className="mt-4 space-y-2 font-sans text-sm not-italic leading-relaxed text-on-surface-variant">
                  <div className="font-bold text-on-background">The ACE Services</div>
                  <div>
                    16319 Hillside Garden LN
                    <br />
                    Houston, TX 77084
                  </div>
                  <div>
                    <a href={PHONE_HREF} className="text-primary hover:underline">
                      {PHONE}
                    </a>
                  </div>
                  <div>
                    <a href="mailto:info@theaceservices.com" className="text-primary hover:underline">
                      info@theaceservices.com
                    </a>
                  </div>
                  <div className="font-mono text-xs uppercase tracking-wider">
                    Mon&ndash;Fri, 9:00&ndash;18:00 CT
                  </div>
                </address>
                <a
                  href={GBP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center border border-blueprint-line px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-on-background transition-all hover:border-primary hover:text-primary"
                >
                  Find us on Google Maps
                </a>
                <Link
                  href="/contact-us/"
                  className="mt-3 inline-flex w-full items-center justify-center border border-primary bg-primary px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
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
                    <Link href="/projects/" className="text-primary hover:underline">
                      Sample estimates with source PDFs
                    </Link>
                  </li>
                  <li>
                    <Link href="/quantity-surveyor-services/" className="text-primary hover:underline">
                      Quantity takeoff services
                    </Link>
                  </li>
                  <li>
                    <Link href="/blueprint-estimation/" className="text-primary hover:underline">
                      Blueprint estimation
                    </Link>
                  </li>
                  <li>
                    <Link href="/adu-construction-cost/" className="text-primary hover:underline">
                      What an ADU costs to build
                    </Link>
                  </li>
                  <li>
                    <Link href="/calculator/" className="text-primary hover:underline">
                      Cost calculator
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* ── Structured data. Organization / WebSite / ProfessionalService are
             already in the site-wide graph from the root layout, so this only
             adds the page-level nodes and references the business by @id. ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@graph': [
              {
                '@type': 'WebPage',
                '@id': PAGE_URL,
                url: PAGE_URL,
                name: 'Construction Estimating Services in Houston, TX',
                description: metadata.description,
                dateModified: REVIEWED_ISO,
                about: { '@id': BUSINESS_ID },
                isPartOf: { '@id': `${SITE_URL}/#website` },
              },
              {
                '@type': 'Service',
                '@id': `${PAGE_URL}#service`,
                name: 'Construction Estimating Services in Houston',
                serviceType: 'Construction Estimating',
                provider: { '@id': ORGANIZATION_ID },
                areaServed: [
                  {
                    '@type': 'City',
                    name: 'Houston',
                    containedInPlace: { '@type': 'State', name: 'Texas' },
                  },
                  {
                    '@type': 'GeoCircle',
                    geoMidpoint: {
                      '@type': 'GeoCoordinates',
                      latitude: 29.8730417,
                      longitude: -95.6557672,
                    },
                    geoRadius: 80000,
                  },
                ],
              },
              {
                '@type': 'FAQPage',
                '@id': `${PAGE_URL}#faq`,
                mainEntity: FAQS.map((f) => ({
                  '@type': 'Question',
                  name: f.q,
                  acceptedAnswer: { '@type': 'Answer', text: f.a },
                })),
              },
              {
                '@type': 'BreadcrumbList',
                itemListElement: [
                  { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
                  {
                    '@type': 'ListItem',
                    position: 2,
                    name: 'Houston Construction Estimating',
                    item: PAGE_URL,
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
