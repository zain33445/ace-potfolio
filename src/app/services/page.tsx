import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { services, getServiceIcon } from '@/src/data/services';

/* ── Page metadata ────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Services',
  description:
    'ACE SERVICES delivers AACE Class 3 cost estimates, material takeoffs, permit sets, and project scheduling for general contractors nationwide.',
  alternates: {
    canonical: 'https://www.theaceservices.com/services',
  },
  openGraph: {
    title: 'Services | ACE SERVICES — Pre-Construction Estimation',
    description:
      'Professional pre-construction estimation services: cost estimating, quantity surveying, permit sets, and project scheduling.',
    url: 'https://www.theaceservices.com/services',
  },
};

/* ── Page component ───────────────────────────────────────────── */

export default function ServicesPage() {
  return (
    <section className="min-h-screen bg-background">
      {/* ════════════════════════════════════════════════════════
          HERO HEADER
          ════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden border-b border-blueprint-line">
        {/* Blueprint grid pattern */}
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
          <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            [SYS::SERVICE_CATALOG]
          </div>

          <h1 className="font-[family-name:var(--font-space)] text-5xl font-bold leading-tight text-on-background md:text-7xl lg:text-7xl">
            Pre-Construction{' '}
            <span className="text-primary">Services</span>
          </h1>

          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
            Precision estimation, quantity surveying, permit documentation,
            and project scheduling — all delivered to AACE Class 3 standards
            with dual-stage quality verification.
          </p>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            <StatBlock label="SERVICES" value={`${services.length}`} />
            <StatBlock label="STANDARD" value="AACE CLS 3" />
            <StatBlock label="TURNAROUND" value="24h–10 Days" />
            <StatBlock label="COVERAGE" value="35 US States" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SERVICES GRID
          ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = getServiceIcon(service.id);
            return (
              <Link
                key={service.id}
                href={`/services/${service.slug}`}
                className="group relative flex flex-col border border-blueprint-line bg-surface p-6 transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(255,107,0,0.06)] bracket-corners hover-brackets"
              >
                {/* Top row: ID + Icon */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs text-primary font-bold tracking-widest">
                    [{service.id}]
                  </span>
                  <div className="flex items-center justify-center w-9 h-9 border border-blueprint-line bg-background bracket-corners group-hover:border-primary transition-colors">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                </div>

                {/* Tagline */}
                <span className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">
                  {service.tagline}
                </span>

                {/* Title */}
                <h2 className="font-[family-name:var(--font-space)] font-bold text-xl text-on-background group-hover:text-primary transition-colors leading-tight">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="mt-3 font-sans text-base text-on-surface-variant leading-relaxed flex-grow">
                  {service.summary}
                </p>

                {/* Key features */}
                <ul className="mt-5 space-y-2">
                  {service.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                      <span className="font-sans text-sm text-on-surface leading-snug">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Divider */}
                <div className="mt-5 border-t border-blueprint-line" />

                {/* Bottom row: Price + CTA */}
                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-[family-name:var(--font-space)] text-2xl font-extrabold text-on-background">
                        {service.startingPrice}
                      </span>
                      <span className="font-sans text-xs text-on-surface-variant">
                        / project
                      </span>
                    </div>
                    <span className="font-mono text-xs text-on-surface-variant tracking-wider">
                      {service.turnaround}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-primary transition-all group-hover:gap-2.5">
                    <span>VIEW SERVICE</span>
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CTA SECTION
          ════════════════════════════════════════════════════════ */}
      <div className="border-t border-blueprint-line">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-[var(--spacing-margin-mobile)] py-16 text-center md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            [SYS::INITIATE_ENGAGEMENT]
          </div>
          <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-5xl">
            Not Sure Which Service Fits?
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-on-surface-variant">
            We&apos;ll review your blueprints and recommend the right
            pre-construction package. Free preliminary consultation for all
            new clients.
          </p>
          <Link
            href="/#contact"
            className="group mt-4 inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
          >
            <span>CONTACT US</span>
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
      <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </div>
      <div className="mt-1 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background">
        {value}
      </div>
    </div>
  );
}
