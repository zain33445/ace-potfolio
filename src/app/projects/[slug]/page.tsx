import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getFeaturedProjects, getAllProjects } from '@/src/data/projects';
import type { ProjectDetail } from '@/src/types';
import CostBreakdownChart from './CostBreakdownChart';

/* Project slugs that have a long-form cost guide built from their estimate. */
const GUIDE_FOR: Record<string, string> = {
  'college-ave-adu-san-diego': '/adu-construction-cost/',
};

/* ── Dynamic metadata ─────────────────────────────────────────── */

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Google truncates meta descriptions around 155-160 characters. Cut on a
 * word boundary (never mid-word) and only append the ellipsis when we
 * actually trimmed something, mirroring the equivalent helper in
 * src/app/[slug]/page.tsx.
 */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  // Renders, permit sets and shop drawings carry no estimate — keep them
  // reachable for visitors but out of the index until they carry real data.
  const hasData = project.hasEstimate;
  const description = truncate(project.description, 155);

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `https://theaceservices.com/projects/${slug}/`,
    },
    openGraph: {
      title: `${project.title} | The ACE Services`,
      description,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
      url: `https://theaceservices.com/projects/${slug}/`,
    },
    ...(hasData ? {} : { robots: { index: false, follow: true } }),
  };
}

/* ── Static paths for build ────────────────────────────────────── */

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

/**
 * Every valid slug comes from getAllProjects() — static repo data, fully
 * known at build time. With dynamicParams left at its default (true), a
 * slug that isn't in that set still falls through to an on-demand render of
 * this page, which calls notFound() below — but this route segment has a
 * loading.tsx, so Next.js treats the render as streamable and commits a 200
 * status before notFound()'s digest resolves (this is documented Next.js
 * behavior, not an OpenNext/Cloudflare bug: https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#status-codes).
 * The result is a soft 404 that Google keeps indexed and keeps recrawling.
 * Setting dynamicParams=false makes Next.js reject any unknown slug at the
 * router level instead — a real framework-level 404 dispatched before the
 * page component (and its Suspense boundary) ever runs, so no streaming
 * commitment happens and the correct status is sent.
 */
export const dynamicParams = false;

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

/* ── Helpers ───────────────────────────────────────────────────── */

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatCurrencyPrecise(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

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

  // Renders, permit sets and shop drawings are not estimates — calling them
  // "Cost Estimate" is wrong, and they have no trade to append.
  const parts = project.hasEstimate
    ? [
        `${project.title} Cost Estimate`,
        trade ? `— ${trade}` : '',
        hasRealLocation ? `in ${project.location}` : '',
      ]
    : [project.title, hasRealLocation ? `in ${project.location}` : ''];

  return parts.filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
}

/** Human-readable deliverable name for projects that carry no estimate. */
function deliverableLabel(category: string): string {
  return (
    {
      '3D RENDERS': '3D Rendering',
      'PERMIT SETS': 'Permit Set',
      'SHOP DRAWINGS': 'Shop Drawings',
    }[category] ?? 'Project Document'
  );
}

/**
 * Closing CTA, matched to what the project actually is. A permit-set page
 * asking for blueprints "to receive a precision cost schedule" sells the
 * wrong service to a visitor who came for permit drawings.
 *
 * Only the estimate variant claims a turnaround, because 24-48 hours is the
 * documented SLA for estimates and not for the other deliverables. Add real
 * turnarounds here once they are known.
 */
interface Cta {
  eyebrow: string;
  heading: string;
  body: string;
  button: string;
}

const CTA_BY_CATEGORY: Record<string, Cta> = {
  '3D RENDERS': {
    eyebrow: 'Request a Rendering',
    heading: 'Need 3D Renderings for Your Next Project?',
    body: 'Send us your drawings and receive photorealistic renderings you can put in front of clients, lenders and planning boards.',
    button: 'REQUEST RENDERING',
  },
  'PERMIT SETS': {
    eyebrow: 'Request a Permit Set',
    heading: 'Need a Permit Set for Your Next Project?',
    body: 'Send us your design and receive a coordinated, submission-ready permit set prepared against your local authority requirements.',
    button: 'REQUEST PERMIT SET',
  },
  'SHOP DRAWINGS': {
    eyebrow: 'Request Shop Drawings',
    heading: 'Need Shop Drawings for Your Next Project?',
    body: 'Send us your design intent and receive fabrication-ready shop drawings detailed for the trades doing the work.',
    button: 'REQUEST SHOP DRAWINGS',
  },
};

const ESTIMATE_CTA: Cta = {
  eyebrow: 'Request an Estimate',
  heading: 'Need an Estimate for Your Next Project?',
  body: 'Submit your blueprints and receive a precision cost schedule within 24-48 hours. Rush turnaround available.',
  button: 'REQUEST ESTIMATE',
};

function ctaFor(project: ProjectDetail): Cta {
  if (project.hasEstimate) return ESTIMATE_CTA;
  return CTA_BY_CATEGORY[project.category] ?? ESTIMATE_CTA;
}

/* ── Page Component ────────────────────────────────────────────── */

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const featuredProjects = getFeaturedProjects(slug).slice(0, 4);

  return (
    <main className="min-h-screen bg-background">
      {/* BreadcrumbList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://theaceservices.com' },
              { '@type': 'ListItem', position: 2, name: 'Projects', item: 'https://theaceservices.com/projects/' },
              { '@type': 'ListItem', position: 3, name: project.title, item: `https://theaceservices.com/projects/${slug}/` },
            ],
          }),
        }}
      />

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════ */}
      <HeroSection project={project} />

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT — SIDEBAR + DETAIL
          ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-8xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          {/* ── Sidebar: Featured Projects ── */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Featured Projects
              </div>
              <div className="space-y-4">
                {featuredProjects.map((fp) => (
                  <FeaturedProjectCard key={fp.id} project={fp} />
                ))}
              </div>
              <Link
                href="/projects/"
                className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
                </svg>
                <span>VIEW ALL PROJECTS</span>
              </Link>
            </div>
          </aside>

          {/* ── Main Detail ── */}
          <div className="order-1 lg:order-2 space-y-16">
            {/* Project Summary */}
            <ProjectSummarySection project={project} />

            {/* Cost sections exist only for projects that carry an estimate.
                Renders, permit sets and shop drawings have no divisions, so
                these rendered $0 / "TOTAL DIVISIONS $0" placeholders. */}
            {project.hasEstimate && (
              <>
                <CostBreakdownSection project={project} />
                <CsiDivisionsSection project={project} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          OUR PROCESS — estimate workflow, so estimate pages only.
          "From Blueprint to Bid-Ready Estimate" describes work that never
          happens on a render, permit set or shop drawing.
          ════════════════════════════════════════════════════════ */}
      {project.hasEstimate && <ProcessSection />}

      {/* ════════════════════════════════════════════════════════
          SAMPLE ESTIMATE REPORT
          ════════════════════════════════════════════════════════ */}
      {project.pdfUrl && !SHARED_PDFS.has(project.pdfUrl) && (
        <SampleReportSection project={project} />
      )}

      {/* ════════════════════════════════════════════════════════
          CTA BANNER
          ════════════════════════════════════════════════════════ */}
      <CtaSection project={project} />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SECTION COMPONENTS                                            */
/* ═══════════════════════════════════════════════════════════════ */

function HeroSection({ project }: { project: ProjectDetail }) {
  return (
    <section className="relative overflow-hidden border-b border-blueprint-line pt-16 md:pt-0">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-blueprint-line) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-blueprint-line) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
          <Link href="/projects/" className="hover:text-primary transition-colors">
            PORTFOLIO
          </Link>
          <span>/</span>
          <span className="text-primary">{project.slug}</span>
        </div>

        {/* Tagline */}
        <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Project Detail
        </div>

        <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-on-background md:text-7xl lg:text-5xl max-w-4xl">
          {buildProjectH1(project)}
        </h1>

        <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
          {project.description}
        </p>

        {/* Contextual link to the cost guide built from this estimate.
            A lookup, not a special case: add a slug when a guide exists. */}
        {GUIDE_FOR[project.slug] && (
          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-on-surface-variant">
            This estimate is broken out division by division, with what it excludes, in our{' '}
            <Link href={GUIDE_FOR[project.slug]} className="font-semibold text-primary hover:underline">
              ADU construction cost guide
            </Link>.
          </p>
        )}

        {/* Quick stats row — only where an estimate exists. */}
        {project.hasEstimate && (
          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            <QuickStat
              label={project.areaBasisKind === 'site' ? 'SITE AREA' : 'BUILDING AREA'}
              value={`${project.areaBasis.toLocaleString()} SF`}
            />
            <QuickStat label="EST. COST" value={formatCurrency(project.estimatedCost)} />
            <QuickStat label="SUGGESTED BID" value={formatCurrency(project.suggestedBid)} />
            <QuickStat label="COST PER SF" value={`$${project.costPerSf.toFixed(2)}`} />
          </div>
        )}
      </div>
    </section>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </div>
      <div className="mt-1 font-[family-name:var(--font-space)] text-3xl font-bold text-on-background">
        {value}
      </div>
    </div>
  );
}

function FeaturedProjectCard({ project }: { project: ProjectDetail }) {
  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group flex gap-3 border border-blueprint-line bg-surface p-3 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)]"
    >
      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden">
        <Image
          src={project.imageUrl}
          alt={project.title}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <div className="flex min-w-0 flex-col justify-center">
        <span className="block truncate font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary">
          {project.title}
        </span>
        <p className="font-mono text-xs text-on-surface-variant">
          {formatCurrency(project.estimatedCost)}
        </p>
      </div>
    </Link>
  );
}

/* ── Project Summary ─────────────────────────────────────────── */

function ProjectSummarySection({ project }: { project: ProjectDetail }) {
  return (
    <section>
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Project Summary
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Hero Image */}
        <div className="relative aspect-[4/3] overflow-hidden border border-blueprint-line">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
            }}
          />
        </div>

        {/* Summary Info */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl">
              Project Overview
            </h2>
            <p className="mt-2 font-mono text-sm text-on-surface-variant">
              {project.location} &mdash; {project.category}
            </p>
          </div>

          <div className="h-px w-full bg-blueprint-line" />

          {/* Scope — "estimation" only where an estimate exists. */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              {project.hasEstimate ? 'ESTIMATION SCOPE' : 'DELIVERABLES'}
            </span>
            <div className="mt-2 space-y-1.5">
              {project.scope.map((item) => (
                <div key={item} className="flex items-center gap-2 font-sans text-base text-on-background">
                  <svg className="h-3.5 w-3.5 flex-shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics — only where an estimate exists. */}
          {project.hasEstimate && (
            <div className="grid grid-cols-2 gap-4 bg-surface-variant/50 p-4 border border-blueprint-line">
              <MetricBox
                label={project.areaBasisKind === 'site' ? 'Site Area' : 'Building Area'}
                value={`${project.areaBasis.toLocaleString()} SF`}
              />
              <MetricBox label="Est. Cost" value={formatCurrency(project.estimatedCost)} />
              <MetricBox label="Suggested Bid" value={formatCurrency(project.suggestedBid)} />
              <MetricBox label="Cost / SF" value={`$${project.costPerSf.toFixed(2)}`} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function MetricBox({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </div>
      <div className="mt-0.5 font-[family-name:var(--font-space)] text-xl font-bold text-on-background">
        {value}
      </div>
    </div>
  );
}

/* ── Cost Breakdown ──────────────────────────────────────────── */

function CostBreakdownSection({ project }: { project: ProjectDetail }) {
  const maxCost = Math.max(...project.costDivisions.map((d) => d.cost));
  const totalDisplayed = project.costDivisions.reduce((sum, d) => sum + d.cost, 0);

  return (
    <section>
      <h2 className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Major Cost Distribution
      </h2>

      <div className="border border-blueprint-line bg-surface p-6 md:p-8">
        {/* Cost bar chart — client animated */}
        <CostBreakdownChart divisions={project.costDivisions} maxCost={maxCost} />

        {/* Total */}
        <div className="mt-6 flex items-center justify-between border-t border-blueprint-line pt-4">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
            TOTAL DIVISIONS
          </span>
          <span className="font-[family-name:var(--font-space)] text-2xl font-bold text-on-background">
            {formatCurrency(totalDisplayed)}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ── CSI Divisions list ──────────────────────────────────────── */

function CsiDivisionsSection({ project }: { project: ProjectDetail }) {
  return (
    <section>
      <h2 className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        CSI MasterFormat Divisions
      </h2>

      <div className="border border-blueprint-line bg-surface p-6 md:p-8">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
          {project.csiDivisions.map((div) => (
            <div
              key={div}
              className="flex items-center gap-3 border border-blueprint-line/50 bg-background/50 px-3 py-2 font-mono text-sm text-on-surface-variant transition-colors hover:border-primary/30 hover:text-primary"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>{div}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Our Process ─────────────────────────────────────────────── */

function ProcessSection() {
  return (
    <section className="border-y border-blueprint-line">
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-24">
        <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Our Process
        </div>

        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-5xl mb-12">
          From Blueprint to Bid-Ready Estimate
        </h2>

        <div className="grid gap-8 md:grid-cols-4">
          {processSteps.map((step, i) => (
            <div key={step.title} className="relative">
              {/* Step number */}
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center border border-primary bg-primary/10 font-mono text-base font-bold text-primary">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="h-px flex-1 bg-blueprint-line hidden md:block" />
              </div>

              <h3 className="font-[family-name:var(--font-space)] text-xl font-bold text-on-background mb-2">
                {step.title}
              </h3>
              <p className="font-sans text-base leading-relaxed text-on-surface-variant">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const processSteps = [
  {
    title: 'Send Us Your Plans',
    description:
      'Upload your blueprints, drawings, and site measurements through our secure portal. We accept PDF, DWG, DXF, and scanned documents.',
  },
  {
    title: 'We Measure Every Quantity',
    description:
      'Our estimators measure materials and labor from your drawings using current regional pricing data.',
  },
  {
    title: 'Two Engineers Check the Numbers',
    description:
      'A second senior estimator reviews every line before it reaches you, so errors are caught before you bid.',
  },
  {
    title: 'You Get Bid-Ready Files',
    description:
      'You receive an editable Excel cost breakdown and a formatted PDF report, ready to submit with your bid.',
  },
];

/* ── Sample Report ───────────────────────────────────────────── */

function SampleReportSection({ project }: { project: ProjectDetail }) {
  return (
    <section className="border-b border-blueprint-line">
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-24">
        <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {project.hasEstimate ? 'Sample Estimate Report' : `Sample ${deliverableLabel(project.category)}`}
        </div>

        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-5xl mb-4">
          {project.hasEstimate ? 'View the Full Estimate PDF' : 'View the Full PDF'}
        </h2>

        <p className="max-w-2xl font-sans text-base leading-relaxed text-on-surface-variant mb-8">
          {project.hasEstimate ? (
            <>
              Download the complete cost estimation report for {project.title}, including
              division-by-division cost breakdowns, material quantities, and bid recommendations.
            </>
          ) : (
            <>
              Download the full {deliverableLabel(project.category).toLowerCase()} produced for{' '}
              {project.title}.
            </>
          )}
        </p>

          <div className="border border-blueprint-line bg-surface overflow-hidden">
          {/* PDF Preview — Google Docs Viewer for reliable cross-origin PDF rendering */}
          <div className="aspect-[16/10] w-full bg-background relative overflow-hidden">
            <iframe
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(project.pdfUrl)}&embedded=true`}
              className="h-full w-full"
              title={`${project.title} - ${project.hasEstimate ? 'Estimate Report' : deliverableLabel(project.category)}`}
              loading="lazy"
            />
            {/* Fallback overlay */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
          </div>

          <div className="flex items-center justify-between border-t border-blueprint-line p-4 md:p-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                REPORT
              </span>
              <p className="font-[family-name:var(--font-space)] text-base font-bold text-on-background mt-0.5">
                {project.title} — {project.hasEstimate ? 'Complete Estimate' : deliverableLabel(project.category)}
              </p>
            </div>
            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
            >
              <span>DOWNLOAD PDF</span>
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-y-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ───────────────────────────────────────────────────────── */

function CtaSection({ project }: { project: ProjectDetail }) {
  const cta = ctaFor(project);

  return (
    <section className="border-b border-blueprint-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-[var(--spacing-margin-mobile)] py-20 text-center md:px-[var(--spacing-margin-desktop)] md:py-28">
        <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          {cta.eyebrow}
        </div>
        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-6xl max-w-3xl">
          {cta.heading}
        </h2>
        <p className="max-w-lg text-base leading-relaxed text-on-surface-variant">
          {cta.body}
        </p>
        <Link
          href="/contact-us/"
          className="group mt-4 inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
        >
          <span>{cta.button}</span>
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
}
