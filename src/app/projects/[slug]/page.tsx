import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjectBySlug, getFeaturedProjects, getAllProjects } from '@/src/data/projects';
import type { ProjectDetail } from '@/src/types';
import CostBreakdownChart from './CostBreakdownChart';

/* ── Dynamic metadata ─────────────────────────────────────────── */

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return { title: 'Project Not Found' };
  }

  return {
    title: `${project.title} | ACE SERVICES`,
    description: project.description,
    openGraph: {
      title: `${project.title} | ACE SERVICES`,
      description: project.description,
      images: project.imageUrl ? [{ url: project.imageUrl }] : [],
    },
  };
}

/* ── Static paths for build ────────────────────────────────────── */

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

/* ── Helpers ───────────────────────────────────────────────────── */

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

function formatCurrencyPrecise(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/* ── Page Component ────────────────────────────────────────────── */

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const featuredProjects = getFeaturedProjects(slug);

  return (
    <main className="min-h-screen bg-background">
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════ */}
      <HeroSection project={project} />

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT — SIDEBAR + DETAIL
          ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          {/* ── Sidebar: Featured Projects ── */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                [FEATURED_PROJECTS]
              </div>
              <div className="space-y-4">
                {featuredProjects.map((fp) => (
                  <FeaturedProjectCard key={fp.id} project={fp} />
                ))}
              </div>
              <Link
                href="/projects"
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

            {/* Cost Breakdown */}
            <CostBreakdownSection project={project} />

            {/* CSI Divisions */}
            <CsiDivisionsSection project={project} />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          OUR PROCESS
          ════════════════════════════════════════════════════════ */}
      <ProcessSection />

      {/* ════════════════════════════════════════════════════════
          SAMPLE ESTIMATE REPORT
          ════════════════════════════════════════════════════════ */}
      <SampleReportSection project={project} />

      {/* ════════════════════════════════════════════════════════
          CTA BANNER
          ════════════════════════════════════════════════════════ */}
      <CtaSection />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SECTION COMPONENTS                                            */
/* ═══════════════════════════════════════════════════════════════ */

function HeroSection({ project }: { project: ProjectDetail }) {
  return (
    <section className="relative overflow-hidden border-b border-blueprint-line">
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
          <Link href="/projects" className="hover:text-primary transition-colors">
            PORTFOLIO
          </Link>
          <span>/</span>
          <span className="text-primary">{project.slug}</span>
        </div>

        {/* Tagline */}
        <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SYS::PROJECT_DETAIL]
        </div>

        <h1 className="font-[family-name:var(--font-space)] text-5xl font-bold leading-tight text-on-background md:text-7xl lg:text-7xl max-w-4xl">
          Accurate Estimates Behind{' '}
          <span className="text-primary">Successful Construction Bids</span>
        </h1>

        <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
          {project.description}
        </p>

        {/* Quick stats row */}
        <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
          <QuickStat label="BUILDING AREA" value={`${project.totalAreaSqFt.toLocaleString()} SF`} />
          <QuickStat label="EST. COST" value={formatCurrency(project.estimatedCost)} />
          <QuickStat label="SUGGESTED BID" value={formatCurrency(project.suggestedBid)} />
          <QuickStat label="COST PER SF" value={`$${project.costPerSf.toFixed(2)}`} />
        </div>
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
      href={`/projects/${project.slug}`}
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
        <h4 className="truncate font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary">
          {project.title}
        </h4>
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
        [PROJECT_SUMMARY]
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
              {project.title}
            </h2>
            <p className="mt-2 font-mono text-sm text-on-surface-variant">
              {project.location} &mdash; {project.category}
            </p>
          </div>

          <div className="h-px w-full bg-blueprint-line" />

          {/* Estimation Scope */}
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
              ESTIMATION SCOPE
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

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 bg-surface-variant/50 p-4 border border-blueprint-line">
            <MetricBox label="Building Area" value={`${project.totalAreaSqFt.toLocaleString()} SF`} />
            <MetricBox label="Est. Cost" value={formatCurrency(project.estimatedCost)} />
            <MetricBox label="Suggested Bid" value={formatCurrency(project.suggestedBid)} />
            <MetricBox label="Cost / SF" value={`$${project.costPerSf.toFixed(2)}`} />
          </div>
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
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [MAJOR_COST_DISTRIBUTION]
      </div>

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
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [CSI_MASTERFORMAT_DIVISIONS]
      </div>

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
          [OUR_PROCESS]
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
    title: 'Structural Data Ingestion',
    description:
      'Transmit your blueprints, architectural layouts, and site measurements through our secure server channel.',
  },
  {
    title: 'Algorithmic Quantity Takeoff',
    description:
      'Our surveyors perform exhaustive computational dissection using localized material standards databases.',
  },
  {
    title: 'Dual-Stage Verification Review',
    description:
      'All estimates undergo parallel reviews by principal civil engineers to filter variances before compilation.',
  },
  {
    title: 'Delivery Protocol Transmission',
    description:
      'Final cost-schedules delivered with interactive spreadsheets and stamped PDF dossiers.',
  },
];

/* ── Sample Report ───────────────────────────────────────────── */

function SampleReportSection({ project }: { project: ProjectDetail }) {
  return (
    <section className="border-b border-blueprint-line">
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-24">
        <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SAMPLE_ESTIMATE_REPORT]
        </div>

        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-5xl mb-4">
          View the Full Estimate PDF
        </h2>

        <p className="max-w-2xl font-sans text-base leading-relaxed text-on-surface-variant mb-8">
          Download the complete cost estimation report for {project.title}, including
          division-by-division cost breakdowns, material quantities, and bid recommendations.
        </p>

        <div className="border border-blueprint-line bg-surface overflow-hidden">
          {/* PDF Preview — shows the PDF in an embed */}
          <div className="aspect-[16/10] w-full bg-background relative overflow-hidden">
            <iframe
              src={`${project.pdfUrl}#view=FitH`}
              className="h-full w-full"
              title={`${project.title} - Estimate Report`}
              sandbox="allow-scripts allow-same-origin"
            />
            {/* Fallback overlay if iframe fails */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-background/20 to-transparent" />
          </div>

          <div className="flex items-center justify-between border-t border-blueprint-line p-4 md:p-6">
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-primary">
                REPORT
              </span>
              <p className="font-[family-name:var(--font-space)] text-base font-bold text-on-background mt-0.5">
                {project.title} — Complete Estimate
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

function CtaSection() {
  return (
    <section className="border-b border-blueprint-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-[var(--spacing-margin-mobile)] py-20 text-center md:px-[var(--spacing-margin-desktop)] md:py-28">
        <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SYS::INITIATE_ESTIMATE_REQUEST]
        </div>
        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-6xl max-w-3xl">
          Need an Estimate for Your Next Project?
        </h2>
        <p className="max-w-lg text-base leading-relaxed text-on-surface-variant">
          Submit your blueprints and receive a precision cost schedule within
          3–5 business days. Expedited turnaround available.
        </p>
        <Link
          href="/#contact"
          className="group mt-4 inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
        >
          <span>REQUEST ESTIMATE</span>
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
