import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import { services, getServiceBySlug, getFeaturedServices, getServiceIcon, type Service } from '@/src/data/services';

/* ── Static paths for build ────────────────────────────────────── */

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

/* ── Dynamic metadata ─────────────────────────────────────────── */

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} | ACE SERVICES`,
    description: service.summary,
    alternates: {
      canonical: `https://www.theaceservices.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | ACE SERVICES — Pre-Construction Estimation`,
      description: service.summary,
      url: `https://www.theaceservices.com/services/${service.slug}`,
    },
  };
}

/* ── Page component ────────────────────────────────────────────── */

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);
  if (!service) notFound();

  const featured = getFeaturedServices(slug);
  const Icon = getServiceIcon(service.id);

  return (
    <main className="min-h-screen bg-background">
      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b border-blueprint-line">
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

        <div className="relative mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <Link href="/services" className="hover:text-primary transition-colors">
              SERVICES
            </Link>
            <span>/</span>
            <span className="text-primary">{service.slug}</span>
          </div>

          {/* System label */}
          <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            [{service.id}]
          </div>

          <div className="flex items-start gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 border border-blueprint-line bg-surface bracket-corners flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">
                {service.tagline}
              </span>
              <h1 className="font-[family-name:var(--font-space)] text-5xl font-bold leading-tight text-on-background md:text-7xl">
                {service.title}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
            {service.description}
          </p>

          {/* Quick stats row */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            {service.stats.map((stat) => (
              <QuickStat key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT — SIDEBAR + DETAIL
          ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          {/* ── Sidebar: Featured Services ── */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                [RELATED_SERVICES]
              </div>
              <div className="space-y-4">
                {featured.map((s) => {
                  const SvgIcon = getServiceIcon(s.id);
                  return (
                    <Link
                      key={s.id}
                      href={`/services/${s.slug}`}
                      className="group flex gap-3 border border-blueprint-line bg-surface p-3 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)]"
                    >
                      <div className="flex items-center justify-center w-12 h-12 border border-blueprint-line bg-background bracket-corners flex-shrink-0 group-hover:border-primary transition-colors">
                        <SvgIcon className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex min-w-0 flex-col justify-center">
                        <h4 className="truncate font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary">
                          {s.title}
                        </h4>
                        <p className="font-mono text-xs text-on-surface-variant">
                          {s.startingPrice}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <Link
                href="/services"
                className="mt-6 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
                </svg>
                <span>VIEW ALL SERVICES</span>
              </Link>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="order-1 lg:order-2 space-y-16">
            {/* Service Overview */}
            <ServiceOverviewSection service={service} />

            {/* Pricing & Features */}
            <PricingFeaturesSection service={service} />

            {/* Process */}
            <ProcessSection service={service} />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CTA BANNER
          ════════════════════════════════════════════════════════ */}
      <CtaSection service={service} />
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SECTION COMPONENTS                                            */
/* ═══════════════════════════════════════════════════════════════ */

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

function ServiceOverviewSection({
  service,
}: {
  service: Service;
}) {
  return (
    <section>
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [SERVICE_OVERVIEW]
      </div>

      <div className="space-y-8">
        {/* Description */}
        <p className="font-sans text-lg leading-relaxed text-on-surface-variant">
          {service.description}
        </p>

        {/* Detail items */}
        <div className="grid gap-4 md:grid-cols-2">
          {service.details.map((detail, i) => (
            <div
              key={i}
              className="flex items-start gap-3 border border-blueprint-line bg-surface p-4"
            >
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span className="font-sans text-base text-on-surface leading-relaxed">
                {detail}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingFeaturesSection({
  service,
}: {
  service: Service;
}) {
  return (
    <section>
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [PRICING_AND_FEATURES]
      </div>

      <div className="border border-blueprint-line bg-surface p-6 md:p-8">
        {/* Price row */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-6 border-b border-blueprint-line">
          <div>
            <span className="font-mono text-xs text-on-surface-variant tracking-wider">
              STARTING AT
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-[family-name:var(--font-space)] text-4xl font-extrabold text-on-background">
                {service.startingPrice}
              </span>
              <span className="font-sans text-sm text-on-surface-variant">
                per project
              </span>
            </div>
            <span className="font-mono text-xs text-on-surface-variant tracking-wider">
              {service.turnaround} standard turnaround
            </span>
          </div>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 border border-primary bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
          >
            <span>REQUEST QUOTE</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Features grid */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {service.features.map((feature, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <span className="font-sans text-sm text-on-surface leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessSection({
  service,
}: {
  service: Service;
}) {
  return (
    <section className="border-t border-blueprint-line pt-16">
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [OUR_PROCESS]
      </div>

      <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-5xl mb-12">
        How It Works
      </h2>

      <div className="grid gap-8 md:grid-cols-4">
        {service.process.map((step, i) => (
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
    </section>
  );
}

function CtaSection({
  service,
}: {
  service: Service;
}) {
  return (
    <section className="border-t border-blueprint-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-[var(--spacing-margin-mobile)] py-20 text-center md:px-[var(--spacing-margin-desktop)] md:py-28">
        <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SYS::INITIATE_ESTIMATE_REQUEST]
        </div>
        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-6xl max-w-3xl">
          Need {service.title}?
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
