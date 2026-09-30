import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import { getServiceIcon } from '@/src/data/services';
import { getServicesEnriched } from '@/src/data/services-cms';
import Image from 'next/image';

/* Per-discipline presentation for the index. Only these four render here —
   everything else is linked from the feature bullets and the SEO block. */
const DISCIPLINES: Record<string, { tab: string; badge: string; image: string; alt: string }> = {
  SVC_EST: { tab: 'Estimation', badge: 'AACE Class 3', image: '/cost.webp', alt: 'Construction cost estimate on blueprints' },
  SVC_ARC: { tab: 'Architectural', badge: 'Permit-ready CDs', image: '/designs.webp', alt: 'Architectural drafting drawings' },
  SVC_ENG: { tab: 'Engineering', badge: 'Code compliant', image: '/c3.webp', alt: 'Structural engineering model' },
  SVC_PMG: { tab: 'Controls', badge: 'CPM + Gantt', image: '/c4.webp', alt: 'Construction project management plan' },
};

const FEATURE_LINKS: Record<string, string> = {
  'Commercial Estimation': '/commercial-construction/',
  'Residential Estimation': '/residential-estimating/',
  'Industrial Estimation': '/industrial-estimating/',
  'Electrical Estimation': '/electrical-estimating-services/',
  'Material Takeoffs & Quantity Surveying': '/quantity-surveyor-services/',
  'Residential Permit Sets': '/permit-set-services/',
  'MEP Shop Drawings': '/shop-drawing-services/',
};

/* Every non-discipline service, grouped. A slug missing from services.ts is
   skipped, so removing a service never breaks this page. Any service the
   groups below don't cover still gets a card via the dynamic "All services"
   leftover group in ServicesPage — the homepage must never silently drop a
   published service. */
const MORE_GROUPS: {
  title: string;
  slugs: string[];
  extra?: { href: string; title: string; summary: string; meta: string };
}[] = [
  {
    title: 'Estimating specialties',
    slugs: ['residential-estimating', 'building-estimating', 'industrial-estimating', 'electrical-estimating-services', 'blueprint-estimation', 'quantity-surveyor-services', 'construction-estimation', 'commercial-estimation', 'outsourcing-estimation', 'freelance-estimation'],
  },
  {
    title: 'Sectors we serve',
    slugs: ['commercial-construction', 'industrial-construction', 'bridges-construction', 'warehouses-development', 'educational-buildings', 'healthcare-buildings', 'hotels-development', 'residential-construction', 'residential-buildings', 'office-development', 'shopping-centre', 'community-parks', 'assembly-buildings'],
  },
  {
    title: 'Drafting & documentation',
    slugs: ['3d-rendering-services', 'shop-drawing-services', 'permit-set-services', 'rebar-detailing-services'],
  },
];

/* ── Page metadata ────────────────────────────────────────────── */

/* Hourly ISR: if the build ever prerenders while Sanity is unreachable
   (the hardcoded fallback silently drops CMS-only services), the next
   revalidation re-renders with the full catalogue. */
export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: 'Our Services | Construction and Estimation Company' },
  description:
    'Explore cost estimating, architectural, structural engineering and project management services for contractors nationwide. Get a free consultation today.',
  alternates: {
    canonical: 'https://theaceservices.com/services/',
  },
  openGraph: {
    title: 'Our Services | Construction and Estimation Company',
    description:
      'Explore cost estimating, architectural, structural engineering and project management services for contractors nationwide. Get a free consultation today.',
    url: 'https://theaceservices.com/services/',
  },
};

/* ── Page component ───────────────────────────────────────────── */

export default async function ServicesPage() {
  const allServices = await getServicesEnriched();
  const services = allServices.filter((s) => s.id in DISCIPLINES);
  const bySlug = new Map(allServices.map((s) => [s.slug, s]));

  /* Safety net: any service the discipline sections and curated groups above
     don't name explicitly still gets a card, so a newly published CMS service
     can never be missing from this page. */
  const curatedSlugs = new Set([
    ...services.map((s) => s.slug),
    ...MORE_GROUPS.flatMap((g) => g.slugs),
  ]);
  const leftoverSlugs = allServices
    .filter((s) => !curatedSlugs.has(s.slug))
    .map((s) => s.slug);
  const groups = leftoverSlugs.length
    ? [...MORE_GROUPS, { title: 'All services', slugs: leftoverSlugs }]
    : MORE_GROUPS;

  const serviceCount = allServices.length;
  return (
    <section className="-mt-20 min-h-screen bg-surface pt-35">
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
          <h1 className="font-[family-name:var(--font-space)] text-5xl font-bold leading-tighter tracking-tighter text-on-background md:text-7xl lg:text-7xl">
            Pre-Construction Services{' '}
            <span className="text-primary italic">Company</span>
          </h1>

          <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-xl">
            The ACE Services is a nationwide construction estimating company
            delivering cost estimating, architectural documentation,
            engineering design, and project management. Our pre-construction
            team turns around AACE Class 3 estimates and material takeoffs in
            24-48 hours for contractors across 35 US states.
          </p>

          {/* Stats strip */}
          <div className="mt-10 justify-center flex flex-wrap gap-20 border-t border-blueprint-line pt-8">
            <StatBlock label="SERVICES" value={String(serviceCount)} />
            <StatBlock label="DISCIPLINES" value="04" />
            <StatBlock label="EST. TURNAROUND" value="24–48 hrs" />
            <StatBlock label="SECTORS" value="3+" />
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          DISCIPLINE TABS
          ════════════════════════════════════════════════════════ */}
      <nav
        aria-label="Service disciplines"
        className="sticky top-32 hidden md:inline-block left-[25%] rounded-full z-30 border-b border-blueprint-line bg-surface/95 backdrop-blur"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-[var(--spacing-margin-mobile)] py-3 md:justify-center md:px-[var(--spacing-margin-desktop)]">
          {services.map((service, index) => {
            const Icon = getServiceIcon(service.id);
            return (
              <a
                key={service.id}
                href={`#${service.slug}`}
                className="flex shrink-0 items-center gap-2 rounded-sm px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant transition-colors hover:bg-primary/10 hover:text-primary"
              >
                <span className="text-primary/60">{String(index + 1).padStart(2, '0')}</span>
                <Icon className="h-3.5 w-3.5" />
                {DISCIPLINES[service.id].tab}
              </a>
            );
          })}
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════
          SERVICE SECTIONS (alternating text / image)
          ════════════════════════════════════════════════════════ */}
      {services.map((service, index) => {
        const Icon = getServiceIcon(service.id);
        const d = DISCIPLINES[service.id];
        const flip = index % 2 === 1;
        const image = (
          <figure>
            <div className="relative aspect-[4/3] overflow-hidden rounded-md shadow-lg">
              <Image src={d.image} alt={d.alt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-3 font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
              {d.tab} · Typical {service.turnaround}
            </figcaption>
          </figure>
        );
        return (
          <article
            key={service.id}
            id={service.slug}
            className={`group/card relative scroll-mt-48 border-b border-blueprint-line ${!flip ? 'bg-surface' : 'bg-[#F4F1EC]'}`}
          >
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-[var(--spacing-margin-mobile)] py-16 md:grid-cols-2 md:gap-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
              {/* Text */}
              <div className={flip ? 'md:order-2' : ''}>
                <div className="flex items-center gap-3 text-primary/40">
                  <span className="font-[family-name:var(--font-space)] text-5xl font-bold">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <Icon className="h-6 w-6" />
                </div>

                <h2 className="mt-4 font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-on-background md:text-4xl">
                  <Link href={`/${service.slug}/`} className="transition-colors after:absolute after:inset-0 after:z-[5] after:content-[''] group-hover/card:text-primary">
                    {service.title}
                  </Link>
                </h2>

                {/* Mobile: image sits between title and body */}
                <div className="mt-6 md:hidden">{image}</div>

                <p className="mt-4 font-sans text-base leading-relaxed text-on-surface-variant md:text-lg">
                  {service.summary}
                </p>

                <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <span className="bg-primary/10 px-3 py-1 text-primary">{service.turnaround}</span>
                  <span className="bg-surface-variant px-3 py-1 text-on-surface">{d.badge}</span>
                </div>

                <div className="mt-8 font-mono text-xs font-bold uppercase tracking-[0.15em] text-primary">
                  Services include
                </div>
                <ul className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {service.features.map((feature) => {
                    const href = FEATURE_LINKS[feature];
                    return (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                        {href ? (
                          <Link href={href} className="relative z-10 font-sans text-sm text-on-surface hover:text-primary hover:underline">
                            {feature}
                          </Link>
                        ) : (
                          <span className="font-sans text-sm text-on-surface">{feature}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
                {service.footnote && (
                  <p className="mt-3 font-mono text-xs text-on-surface-variant">{service.footnote}</p>
                )}

                <Link
                  href={`/${service.slug}/`}
                  className="mt-8 inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-primary"
                >
                  {service.ctaLabel}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-1" />
                </Link>
              </div>

              {/* Image */}
              <div className={`hidden md:block ${flip ? 'md:order-1' : ''}`}>{image}</div>
            </div>
          </article>
        );
      })}

      {/* ════════════════════════════════════════════════════════
          MORE SERVICES
          ════════════════════════════════════════════════════════ */}
      <div className="border-b border-blueprint-line bg-background">
        <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">More services</div>
          <h2 className="mt-3 font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl">
            Specialties, sectors &amp; documentation
          </h2>

          {groups.map((group) => {
            const cards = group.slugs.flatMap((slug) => {
              const s = bySlug.get(slug);
              return s ? [{ href: `/${s.slug}/`, title: s.title, summary: s.summary, meta: s.turnaround, Icon: getServiceIcon(s.id) }] : [];
            });
            if (group.extra) cards.push({ ...group.extra, Icon: getServiceIcon('SOLUTION') });
            return (
              <section key={group.title} className="mt-12">
                <h3 className="font-mono text-sm font-bold uppercase tracking-[0.15em] text-on-surface-variant">
                  {group.title}
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {cards.map(({ href, title, summary, meta, Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      className="group flex flex-col border border-blueprint-line bg-surface p-5 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)]"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-blueprint-line bg-background transition-colors group-hover:border-primary">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <h4 className="font-[family-name:var(--font-space)] text-lg font-bold leading-snug text-on-background transition-colors group-hover:text-primary">
                          {title}
                        </h4>
                      </div>
                      <p className="mt-3 line-clamp-2 font-sans text-sm leading-relaxed text-on-surface-variant">{summary}</p>
                      <div className="mt-auto flex items-center justify-between pt-4 font-mono text-xs font-bold uppercase tracking-wider">
                        <span className="text-on-surface-variant">{meta}</span>
                        <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════
          SEO CONTENT BLOCK
          ════════════════════════════════════════════════════════ */}
      <div className="border-t border-blueprint-line bg-surface">
        <div className="mx-auto max-w-4xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20 text-justify md:text-left">
<h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background text-left md:text-4xl mb-6 [word-spacing:0.25em]">
  Integrated Services for General Contractors & Developers Nationwide
</h2>

          <div className="space-y-6 font-sans text-base md:text-lg leading-relaxed text-on-surface-variant">
            <p>
              As a full-service <strong>construction estimating company</strong>, successful construction projects are won before ground is ever broken. At The ACE Services, our integrated suite of <strong>pre-construction services</strong> ensures that every phase of your build is meticulously planned, accurately budgeted, and structurally sound. We serve a diverse clientele across the USA, including general contractors, subcontractors, architects, and real estate developers.
            </p>
            <p>
              By combining precision <Link href="/cost-estimating/" className="text-primary hover:underline font-semibold">construction cost estimating</Link> with detailed <Link href="/architectural-services/" className="text-primary hover:underline font-semibold">Architectural Documentation</Link>, we eliminate the communication silos that often cause delays and budget overruns. When your estimators, drafters, and project managers work from the same reliable data pool, your bids become sharper and your margins more secure. Compare us to any other construction estimating firm and you'll find the same team handling your estimate, drawings, and schedule from day one.
            </p>
            <p>
              Whether you require PE-sealed <Link href="/structural-engineering/" className="text-primary hover:underline font-semibold">Structural Engineering</Link> designs for complex commercial builds or comprehensive <Link href="/project-management/" className="text-primary hover:underline font-semibold">Construction Project Management</Link> to orchestrate procurement and CPM scheduling, our nationwide team delivers the blueprints and schedules you need to bid competitively and build confidently. Trusted construction cost estimating services since 2019 — browse{' '}
              <Link href="/projects/" className="text-primary hover:underline font-semibold">our construction estimating portfolio</Link>{' '}
              to see the depth of work behind that track record.
            </p>
            <p>
              Our sector experience runs across <Link href="/commercial-construction/" className="text-primary hover:underline font-semibold">commercial construction</Link>, <Link href="/industrial-construction/" className="text-primary hover:underline font-semibold">industrial construction</Link>, <Link href="/bridges-construction/" className="text-primary hover:underline font-semibold">bridge construction</Link>, <Link href="/warehouses-development/" className="text-primary hover:underline font-semibold">warehouse development</Link>, and <Link href="/educational-buildings/" className="text-primary hover:underline font-semibold">educational buildings</Link>, so whatever the build type, our estimators have priced it before.
            </p>
            <p>
              On the estimating side, our specialists cover <Link href="/building-estimating/" className="text-primary hover:underline font-semibold">building estimating</Link>, <Link href="/industrial-estimating/" className="text-primary hover:underline font-semibold">industrial estimating</Link>, <Link href="/residential-estimating/" className="text-primary hover:underline font-semibold">residential estimating</Link>, <Link href="/blueprint-estimation/" className="text-primary hover:underline font-semibold">blueprint estimation</Link>, and <Link href="/quantity-surveyor-services/" className="text-primary hover:underline font-semibold">quantity surveyor services</Link>.
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
            Get Started
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
            href="/contact-us/"
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
