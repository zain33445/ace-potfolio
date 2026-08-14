import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { getServiceIcon } from '@/src/data/services';
import { getServicesEnriched } from '@/src/data/services-cms';
import { CardBody, CardContainer, CardItem } from "@/src/components/ui/3d-card";

/* ── Page metadata ────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Cost estimating, architectural services, structural & engineering, and project management for contractors nationwide.',
  alternates: {
    canonical: 'https://theaceservices.com/services',
  },
  openGraph: {
    title: 'Services | The ACE Services — Pre-Construction',
    description:
      'Professional pre-construction services: cost estimating, architectural services, structural & engineering, and project management.',
    url: 'https://theaceservices.com/services',
  },
};

/* ── Page component ───────────────────────────────────────────── */

export default async function ServicesPage() {
  const services = await getServicesEnriched();
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

        <div className="relative mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-10 md:px-[var(--spacing-margin-desktop)] md:py-20">
          {/* System label */}
          <h1 className="font-[family-name:var(--font-space)] text-5xl font-bold leading-tight text-on-background md:text-7xl lg:text-7xl">
            Pre-Construction{' '}
            <span className="text-primary">Services</span>
          </h1>

          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
            Cost estimating, architectural documentation, engineering design,
            and project management — delivered with fast, reliable turnarounds
            from our pre-construction team.
          </p>

          {/* Stats strip */}
          <div className="mt-10 flex flex-wrap gap-20 border-t border-blueprint-line pt-8">
            <StatBlock label="SERVICES" value={`0${services.length}`} />
            <StatBlock label="DISCIPLINES" value="04" />
            <StatBlock label="TURNAROUND" value="24–48 hrs" />
            <StatBlock label="SECTORS" value="3+" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SERVICES GRID
          ════════════════════════════════════════════════════════ */}
      <div className="mx-auto max-w-8xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => {
            const Icon = getServiceIcon(service.id);
            return (
              <CardContainer key={service.id} className="w-full h-full">
                <CardBody className="w-full h-full">
                  <Link
                    href={`/${service.slug}`}
                    className="group relative flex flex-col border border-blueprint-line bg-surface p-6 transition-all duration-700 ease-out hover:border-primary hover:shadow-[0_0_30px_rgba(255,107,0,0.06)] bracket-corners hover-brackets h-full"
                  >
                    {/* Top row: Number + Icon */}
                    <CardItem translateZ="30" className="flex items-center justify-between mb-4 w-full">
                      <span className="font-mono text-sm text-primary font-bold tracking-widest">
                        [{String(index + 1).padStart(2, '0')}]
                      </span>
                      <div className="flex items-center justify-center w-9 h-9 border border-blueprint-line bg-background bracket-corners group-hover:border-primary transition-colors">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </CardItem>

                    {/* Title */}
                    <CardItem translateZ="50" as="h2" className="font-[family-name:var(--font-space)] font-bold text-2xl text-on-background group-hover:text-primary transition-colors leading-tight">
                      {service.title}
                    </CardItem>

                    {/* Description */}
                    <CardItem translateZ="40" as="p" className="mt-3 font-sans text-lg text-on-surface-variant leading-relaxed">
                      {service.summary}
                    </CardItem>

                    {/* Full services list */}
                    <CardItem translateZ="30" className="mt-5 flex-grow w-full">
                      <div className="font-mono text-sm font-bold uppercase tracking-[0.1em] text-primary mb-3">
                        SERVICES INCLUDE
                      </div>
                      <ul className="space-y-2">
                        {service.features.map((feature, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                            <span className="font-sans text-base text-on-surface leading-snug">
                              {feature}
                            </span>
                          </li>
                        ))}
                      </ul>
                      {service.footnote && (
                        <p className="mt-3 font-mono text-xs text-on-surface-variant leading-relaxed">
                          {service.footnote}
                        </p>
                      )}
                    </CardItem>

                    {/* Divider */}
                    <CardItem translateZ="20" as="div" className="mt-5 border-t border-blueprint-line w-full">
                      <span aria-hidden="true" />
                    </CardItem>

                    {/* Bottom row: CTA */}
                    <CardItem translateZ="40" className="mt-5 flex items-center justify-end w-full">
                      <div className="flex items-center gap-1.5 font-mono text-sm font-bold uppercase tracking-wider text-primary transition-all group-hover:gap-2.5">
                        <span>{service.ctaLabel}</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </CardItem>
                  </Link>
                </CardBody>
              </CardContainer>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SEO CONTENT BLOCK
          ════════════════════════════════════════════════════════ */}
      <div className="border-t border-blueprint-line bg-surface">
        <div className="mx-auto max-w-4xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20 text-justify md:text-left">
          <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            [PRE-CONSTRUCTION_EXCELLENCE]
          </div>
          <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl mb-6">
            Integrated Services for General Contractors & Developers Nationwide
          </h2>
          <div className="space-y-6 font-sans text-base md:text-lg leading-relaxed text-on-surface-variant">
            <p>
              Successful construction projects are won before ground is ever broken. At The ACE Services, our integrated suite of <strong>pre-construction services</strong> ensures that every phase of your build is meticulously planned, accurately budgeted, and structurally sound. We serve a diverse clientele across the USA, including general contractors, subcontractors, architects, and real estate developers.
            </p>
            <p>
              By combining precision <Link href="/cost-estimating" className="text-primary hover:underline font-semibold">Cost Estimating</Link> with detailed <Link href="/architectural-services" className="text-primary hover:underline font-semibold">Architectural Documentation</Link>, we eliminate the communication silos that often cause delays and budget overruns. When your estimators, drafters, and project managers work from the same reliable data pool, your bids become sharper and your margins more secure.
            </p>
            <p>
              Whether you require PE-sealed <Link href="/structural-engineering" className="text-primary hover:underline font-semibold">Structural Engineering</Link> designs for complex commercial builds or comprehensive <Link href="/project-management" className="text-primary hover:underline font-semibold">Construction Project Management</Link> to orchestrate procurement and CPM scheduling, our nationwide team delivers the blueprints and schedules you need to bid competitively and build confidently.
            </p>
          </div>
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
            href="/contact-us"
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
            <div className="mt-1 font-[family-name:var(--font-space)] text-3xl font-bold text-on-background">
        {value}
      </div>
      <div className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-on-surface-variant">
        {label}
      </div>

    </div>
  );
}
