import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { CometCard } from '../../components/ui/comet-card';
import { Lens } from '../../components/ui/lens';
import PaginationGrid from '../../components/PaginationGrid';
import type { ProjectDetail, CostDivision } from '../../types';
import { getAllProjects } from '../../data/projects';

/* ── Page metadata ────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore the ACE SERVICES portfolio — precise construction estimation delivered across residential, commercial, and industrial projects nationwide.',
  openGraph: {
    title: 'Projects | ACE SERVICES',
    description:
      'A portfolio of construction estimation work spanning residential, commercial, and industrial sectors.',
  },
};

/* ── Category config ──────────────────────────────────────────── */

const CATEGORY_COLORS: Record<string, string> = {
  RESIDENTIAL: 'bg-primary/15 text-primary border-primary/30',
  COMMERCIAL: 'bg-[#a3a3a3]/15 text-[#a3a3a3] border-[#a3a3a3]/30',
  HOSPITALITY: 'bg-[#8b5cf6]/15 text-[#a78bfa] border-[#8b5cf6]/30',
  RETAIL: 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
  MUNICIPAL: 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30',
};

const CATEGORY_FILTERS = [
  { label: 'ALL_PROJECTS', value: 'all' },
  { label: 'RESIDENTIAL', value: 'RESIDENTIAL' },
  { label: 'COMMERCIAL', value: 'COMMERCIAL' },
  { label: 'HOSPITALITY', value: 'HOSPITALITY' },
  { label: 'RETAIL', value: 'RETAIL' },
  { label: 'MUNICIPAL', value: 'MUNICIPAL' },
] as const;

/* ── Helpers ──────────────────────────────────────────────────── */

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

/* ── Page component ───────────────────────────────────────────── */

export default async function ProjectsPage() {
  const projects = getAllProjects();

  return (
    <section className="min-h-screen bg-background">
      {/* ── Hero header ──────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-blueprint-line">
        {/* Decorative grid pattern */}
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

        <div className="relative mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-28">
          {/* System label */}
          <div className="mb-6 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            [SYS::PORTFOLIO_INDEX]
          </div>

          <h1 className="font-[family-name:var(--font-space)] text-4xl font-bold leading-tight text-on-background md:text-6xl lg:text-7xl">
            Our{' '}
            <span className="text-primary">Projects</span>
          </h1>

          <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-on-surface-variant md:text-lg">
            A portfolio of precision construction estimation work delivered across
            multiple sectors. Every project receives AACE Class 3 cost accuracy.
          </p>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            <StatBlock label="PROJECTS_COMPLETED" value={`${projects.length}`} />
            <StatBlock label="CATEGORIES" value="5" />
            <StatBlock label="AVG_COST_ACCURACY" value="±15%" />
          </div>
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-blueprint-line bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-[var(--spacing-margin-mobile)] py-4 md:px-[var(--spacing-margin-desktop)]">
          {CATEGORY_FILTERS.map((f, i) => (
            <span
              key={f.value}
              className={`whitespace-nowrap rounded-sm border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                i === 0
                  ? 'border-primary bg-primary text-white'
                  : 'border-blueprint-line bg-transparent text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              [{f.label}_{String(i).padStart(2, '0')}]
            </span>
          ))}
          <div className="ml-auto hidden items-center gap-2 md:flex">
            <span className="font-mono text-[10px] text-on-surface-variant">
              RECORDS:
            </span>
            <span className="font-mono text-[10px] font-bold text-primary">
              {String(projects.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* ── Project grid ─────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-12 md:px-[var(--spacing-margin-desktop)] md:py-16">
        <PaginationGrid
          itemsPerPage={9}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {projects.map((project, idx) => (
            <ProjectCard key={project.id} project={project} index={idx} priority={idx < 3} />
          ))}
        </PaginationGrid>
      </div>

      {/* ── Bottom CTA ───────────────────────────────────── */}
      <div className="border-t border-blueprint-line">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-[var(--spacing-margin-mobile)] py-16 text-center md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            [SYS::INITIATE_PROJECT_QUERY]
          </div>
          <h2 className="font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-4xl">
            Ready to Start Your Project?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-on-surface-variant">
            Submit your blueprints and receive a precision cost schedule within
            3–5 business days. Expedited turnaround available.
          </p>
          <Link
            href="/#contact"
            className="group mt-4 inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
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
      </div>
    </section>
  );
}

/* ── Sub-components ───────────────────────────────────────────── */

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </div>
      <div className="mt-1 font-[family-name:var(--font-space)] text-xl font-bold text-on-background">
        {value}
      </div>
    </div>
  );
}

/* ── Project Card ─────────────────────────────────────────────── */

function ProjectCard({
  project,
  index,
  priority = false,
}: {
  project: ProjectDetail;
  index: number;
  priority?: boolean;
}) {
  const colorClass =
    CATEGORY_COLORS[project.category] ?? 'bg-[#a3a3a3]/15 text-[#a3a3a3] border-[#a3a3a3]/30';

  return (
    <CometCard>
      <article className="group relative flex flex-col border border-blueprint-line bg-surface transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(255,107,0,0.08)] bracket-corners hover-brackets h-full">
        {/* Image area — preserves Lens + scanline overlay animations */}
        <Link href={`/projects/${project.slug}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Lens zoomFactor={2.5} lensSize={170}>
              <Image
                src={project.imageUrl}
                alt={project.title}
                fill
                priority={priority}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover brightness-[1.15] transition-transform duration-500 group-hover:scale-105"
              />

              {/* Scanline overlay — preserved animation */}
              <div
                className="pointer-events-none absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                }}
              />

              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* Cost badge — top left */}
              <div className="absolute left-3 top-3 border border-white/20 bg-black/50 px-2 py-1 font-mono text-[9px] font-bold tracking-wider text-white/80 backdrop-blur-sm">
                {formatCurrency(project.estimatedCost)}
              </div>

              {/* Category badge — top right */}
              <div
                className={`absolute right-3 top-3 border px-2 py-1 font-mono text-[9px] font-bold tracking-wider backdrop-blur-sm ${colorClass}`}
              >
                {project.category}
              </div>
            </Lens>
          </div>
        </Link>

        {/* Content area */}
        <div className="flex flex-1 flex-col px-5 py-6">
          {/* Title + Location */}
          <Link href={`/projects/${project.slug}`}>
            <h3 className="font-[family-name:var(--font-space)] text-lg font-bold leading-snug text-on-background transition-colors group-hover:text-primary">
              {project.title}
            </h3>
          </Link>
          <p className="mt-1 font-mono text-[10px] text-on-surface-variant">
            {project.location}
          </p>

          <div className="my-3 h-px w-full bg-blueprint-line transition-colors group-hover:bg-primary" />

          {/* Scope */}
          <div className="mb-2">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary">
              SCOPE:
            </span>
            <p className="mt-0.5 font-sans text-xs text-on-surface-variant">
              {project.scope.join(' + ')}
            </p>
          </div>

          {/* Size */}
          <div className="mb-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-wider text-primary">
              SIZE:
            </span>
            <p className="mt-0.5 font-sans text-xs text-on-surface-variant">
              {project.totalAreaSqFt.toLocaleString()} SF
            </p>
          </div>

          {/* Services checklist */}
          <div className="mb-4 space-y-1">
            {project.scope.map((item: string) => (
              <div key={item} className="flex items-center gap-2 font-sans text-[11px] text-on-surface-variant">
                <svg className="h-3 w-3 flex-shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{item}</span>
              </div>
            ))}
            {project.costDivisions.slice(0, 3).map((d: CostDivision) => (
              <div key={d.csiCode} className="flex items-center gap-2 font-sans text-[11px] text-on-surface-variant">
                <svg className="h-3 w-3 flex-shrink-0 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{d.name}</span>
              </div>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* View Case Study + PDF buttons */}
          <div className="flex items-center gap-2 border-t border-blueprint-line/40 pt-4">
            <Link
              href={`/projects/${project.slug}`}
              className="group/btn inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
            >
              <span>VIEW CASE STUDY</span>
              <svg
                className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 border border-blueprint-line bg-transparent px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary"
              title="View sample estimate PDF"
            >
              <svg
                className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span>PDF</span>
            </a>
          </div>
        </div>
      </article>
    </CometCard>
  );
}
