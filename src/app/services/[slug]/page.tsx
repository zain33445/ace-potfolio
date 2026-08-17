import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Check, ArrowRight, ChevronDown } from 'lucide-react';
import { services, getServiceIcon, type Service } from '@/src/data/services';
import { getServiceEnriched, getFeaturedServicesEnriched } from '@/src/data/services-cms';

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
  const service = await getServiceEnriched(slug);
  if (!service) return { title: 'Service Not Found' };

  return {
    title: `${service.title} | The ACE Services`,
    description: service.summary,
    alternates: {
      canonical: `https://theaceservices.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.title} | The ACE Services — Pre-Construction Estimation`,
      description: service.summary,
      url: `https://theaceservices.com/services/${service.slug}`,
    },
  };
}

/* ── Page component ────────────────────────────────────────────── */

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceEnriched(slug);
  if (!service) notFound();

  const featured = await getFeaturedServicesEnriched(slug);
  const Icon = getServiceIcon(service.id);

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
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://theaceservices.com/services' },
              { '@type': 'ListItem', position: 3, name: service.title, item: `https://theaceservices.com/services/${service.slug}` },
            ],
          }),
        }}
      />

      {/* FAQPage structured data */}
      {service.seoContent?.faqs && service.seoContent.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: service.seoContent.faqs.map(faq => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: faq.answer
                }
              }))
            }),
          }}
        />
      )}

      {/* ════════════════════════════════════════════════════════
          HERO SECTION
          ════════════════════════════════════════════════════════ */}
      <section className="relative overflow-clip max-w-8xl border-b border-blueprint-line">
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

        <div className="relative mx-auto max-w-8xl px-5 px-[var(--spacing-margin-mobile)] pt-16 md:px-[var(--spacing-margin-desktop)] md:pt-16">
          {/* Breadcrumb */}
          <div className="mb-8 flex items-center gap-2 font-mono text-SM font-bold uppercase tracking-wider text-on-surface-variant">
            <Link href="/services" className="hover:text-primary transition-colors">
              SERVICES
            </Link>
            <span>/</span>
            <span className="text-primary">{service.slug}</span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-12 h-12 border border-blueprint-line bg-surface bracket-corners flex-shrink-0">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-mono text-sm text-on-surface-variant tracking-widest block mb-1">
                {service.tagline}
              </span>
              <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-on-background md:text-7xl">
                {service.title}
              </h1>
            </div>
          </div>

          <p className="mt-6 max-w-5xl bg-black font-sans text-lg leading-relaxed text-on-surface-variant md:text-left md:text-xl text-justify">
            deskjkfdsjjdsjf{service.description}
          </p>

          {/* Quick stats row */}
          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8 items-center justify-center">
            {service.stats.map((stat) => (
              <QuickStat key={stat.label} label={stat.label} value={stat.value} />
            ))}
          </div>
        </div>

      {/* ════════════════════════════════════════════════════════
          MAIN CONTENT — SIDEBAR + DETAIL
          ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-8xl px-5 px-[10px] text-justify py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          {/* ── Sidebar: Featured Services ── */}
          <aside className="order-2 lg:order-1">
            <div className="sticky top-24">
              <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Related Services
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
                          Custom pricing based on project scope
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

            {/* SEO Content Section */}
            {service.seoContent && (
              <SeoContentSection service={service} />
            )}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          CTA BANNER
          ════════════════════════════════════════════════════════ */}
      <CtaSection service={service} />
      </section>

    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SECTION COMPONENTS                                            */
/* ═══════════════════════════════════════════════════════════════ */

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center md:text-left">
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
        {service.slug === 'project-management' ? 'WHAT WE DELIVER' : 'OVERVIEW'}
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
        Pricing & Features
      </div>

      <div className="border border-blueprint-line bg-surface p-6 md:p-8">
        {/* Price row */}
        <div className="mb-6 border-b border-blueprint-line pb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-2xl font-extrabold uppercase tracking-[0.05em] text-primary mb-2">
              {service.startingPrice.toLowerCase() === 'custom' 
                ? 'CUSTOM PRICING' 
                : `STARTING AT ${service.startingPrice}`}
            </div>
            <div className="text-sm text-on-surface-variant mb-2">
              Based on project scope, complexity, and deliverables.
            </div>
            <div className="font-mono text-xs text-on-surface-variant tracking-wider">
              {service.turnaround} standard turnaround
            </div>
          </div>
          <Link
            href="/contact-us"
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
        {service.footnote && (
          <p className="mt-4 font-mono text-xs text-on-surface-variant leading-relaxed">
            {service.footnote}
          </p>
        )}
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
        Our Process
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
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 px-[var(--spacing-margin-mobile)] py-20 text-center md:px-[var(--spacing-margin-desktop)] md:py-28">
        <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          Request an Estimate
        </div>
        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-6xl max-w-3xl">
          Need {service.title}?
        </h2>
        <p className="max-w-lg text-base leading-relaxed text-on-surface-variant md:text-center">
          {service.slug === 'project-management' ? (
            'Send us your project plans, scope, or existing schedule for a preliminary review. We\'ll recommend the appropriate planning and project-control service.'
          ) : (
            'Submit your blueprints and receive a precision cost schedule within 3–5 business days. Expedited turnaround available.'
          )}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/contact-us"
            className="group inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
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
          {service.slug !== 'project-management' && (
            <Link
              href="/calculator"
              className="group inline-flex items-center gap-3 border border-blueprint-line bg-surface px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary"
            >
              <span>TRY CALCULATOR</span>
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
          )}
        </div>
      </div>
    </section>
  );
}

function SeoContentSection({
  service,
}: {
  service: Service;
}) {
  const { seoContent } = service;
  if (!seoContent) return null;

  return (
    <section className="border-t border-blueprint-line pt-16">
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Deep Dive
      </div>

      <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl mb-8">
        {seoContent.heading}
      </h2>

      <div className="space-y-6 mb-12">
        {seoContent.body.map((paragraph, idx) => (
          <p key={idx} className="font-sans text-base md:text-lg leading-relaxed text-on-surface-variant">
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Key Benefits
      </div>
      
      <div className="grid gap-6 md:grid-cols-3 mb-16">
        {seoContent.benefits.map((benefit, idx) => (
          <div key={idx} className="border border-blueprint-line bg-surface p-6 hover:border-primary transition-colors">
            <h3 className="font-[family-name:var(--font-space)] text-xl font-bold text-on-background mb-3">
              {benefit.title}
            </h3>
            <p className="font-sans text-sm leading-relaxed text-on-surface-variant">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>

      {seoContent.faqs && seoContent.faqs.length > 0 && (
        <>
          <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            FAQ
          </div>
          <div className="space-y-4">
            {seoContent.faqs.map((faq, idx) => (
              <details key={idx} className="group border border-blueprint-line bg-surface [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between p-6 font-[family-name:var(--font-space)] text-lg font-bold text-on-background transition-colors hover:text-primary">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 text-primary transition-transform group-open:rotate-180" />
                </summary>
                <div className="border-t border-blueprint-line px-6 pb-6 pt-4">
                  <p className="font-sans text-base leading-relaxed text-on-surface-variant">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
