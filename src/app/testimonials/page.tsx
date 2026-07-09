import type { Metadata } from 'next';
import Link from 'next/link';
import PaginationGrid from '../../components/PaginationGrid';

export const metadata: Metadata = {
  title: 'Client Testimonials',
  description:
    'See what our clients say about ACE SERVICES. Trusted by general contractors, developers, and project owners for precise pre-construction estimation.',
};

/* ── Hardcoded testimonial data ──────────────────────────────── */

interface Testimonial {
  quote: string;
  author: string;
  company: string;
  role: string;
  initials: string;
  accentColor: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      'ACE SERVICES provided incredibly accurate estimates that saved us over 15% on our commercial project. Their attention to detail is unmatched in the industry.',
    author: 'Sarah Mitchell',
    company: 'BuildRight Construction',
    role: 'Project Director',
    initials: 'SM',
    accentColor: '#FF6B00',
  },
  {
    quote:
      'We shifted from three weeks of manual takeoffs to two-day turnarounds. The precision of their quantity surveying gave our bidding team a serious competitive edge.',
    author: 'David Chen',
    company: 'Apex Development Group',
    role: 'VP of Operations',
    initials: 'DC',
    accentColor: '#E55A00',
  },
  {
    quote:
      'Their cost schedules were presentation-ready from day one. Our stakeholders approved the budget on the first review — that never happens.',
    author: 'Rachel Torres',
    company: 'Meridian General Contractors',
    role: 'Chief Estimator',
    initials: 'RT',
    accentColor: '#FF8533',
  },
  {
    quote:
      'After working with five estimation firms, ACE SERVICES is the only one that delivered consistently AACE-compliant reports. They understand the rigor required for institutional projects.',
    author: 'Marcus Webb',
    company: 'Tidewater Public Works',
    role: 'Program Manager',
    initials: 'MW',
    accentColor: '#D45A00',
  },
  {
    quote:
      'The permit set they prepared was approved on the first submission. Their understanding of local building codes and material standards saved us weeks of rework.',
    author: 'Elena Vasquez',
    company: 'Skyline Architects',
    role: 'Principal Architect',
    initials: 'EV',
    accentColor: '#FF6B00',
  },
  {
    quote:
      'Fast, precise, and communicative. ACE SERVICES turned a complex multifamily project into a manageable cost schedule within 72 hours. Absolutely worth every dollar.',
    author: 'James Okafor',
    company: 'Pinnacle Real Estate',
    role: 'Managing Director',
    initials: 'JO',
    accentColor: '#FF7A1A',
  },
];

/* ── Avatar component ────────────────────────────────────────── */

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-space)] text-sm font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/* ── Single testimonial card ─────────────────────────────────── */

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="bracket-corners hover-brackets relative flex flex-col rounded-lg border border-surface-variant bg-surface p-8 transition-all duration-300 hover:border-primary">
      {/* Decorative quotation mark */}
      <span
        className="pointer-events-none absolute -top-3 left-6 font-[family-name:var(--font-space)] text-6xl leading-none text-primary/20 select-none"
        aria-hidden="true"
      >
        &ldquo;
      </span>

      {/* Quote text */}
      <blockquote className="relative z-10 mb-6 flex-1">
        <p className="text-base leading-relaxed text-on-surface-variant md:text-lg">
          &ldquo;{testimonial.quote}&rdquo;
        </p>
      </blockquote>

      {/* Author row */}
      <div className="flex items-center gap-4 border-t border-surface-variant pt-5">
        <Avatar initials={testimonial.initials} color={testimonial.accentColor} />
        <div className="min-w-0">
          <p className="font-[family-name:var(--font-space)] text-sm font-bold text-on-surface">
            {testimonial.author}
          </p>
          <p className="text-xs text-on-surface-variant">
            {testimonial.role}
          </p>
          <p className="text-xs font-medium text-primary">
            {testimonial.company}
          </p>
        </div>
      </div>
    </article>
  );
}

/* ── Page component ──────────────────────────────────────────── */

export default function TestimonialsPage() {
  return (
    <section className="min-h-screen bg-background px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)] md:py-32">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
        {/* Decorative system label */}
        <p className="mb-4 font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-primary">
          // Client Voices
        </p>

        <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-5xl">
          Trusted by Industry{' '}
          <span className="text-primary">Leaders</span>
        </h1>

        <p className="mt-5 text-base leading-relaxed text-on-surface-variant md:text-lg">
          General contractors, developers, and project owners rely on ACE SERVICES
          for precise pre-construction estimation that drives smarter decisions.
        </p>
      </div>

      {/* Testimonial grid */}
      <div className="mx-auto max-w-6xl">
        <PaginationGrid
          itemsPerPage={9}
          gridCols="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.author} testimonial={testimonial} />
          ))}
        </PaginationGrid>
      </div>

      {/* Bottom CTA */}
      <div className="mx-auto mt-20 max-w-2xl text-center md:mt-24">
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-on-surface-variant">
          // Ready to experience the difference?
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
          Join the companies that{' '}
          <span className="text-primary">trust ACE</span>
        </h2>
        <p className="mt-4 text-on-surface-variant">
          Get your first project estimate with zero commitment.
        </p>
        <Link
          href="/calculator"
          className="bracket-corners hover-brackets mt-8 inline-block rounded bg-primary px-8 py-3 font-[family-name:var(--font-space)] text-sm font-bold text-white transition-colors hover:bg-[#E55A00]"
        >
          Get a Free Estimate
        </Link>
      </div>
    </section>
  );
}
