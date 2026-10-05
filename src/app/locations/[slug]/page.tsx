import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllStatePages,
  getStatePage,
  type LocationCity,
} from '@/src/lib/sanity/locations';
import {
  locationPath,
  parseLocationSlug,
  proofPoints,
} from '@/src/data/state-page-constants';
import LocationProse from '@/src/components/LocationProse';

const BASE = 'https://theaceservices.com';

/* Hourly ISR, matching /[slug]. Newly published state pages render on demand
   because dynamicParams stays at its default (true); the Sanity webhook also
   calls revalidatePath for this route. */
export const revalidate = 3600;

/* ── Static params ────────────────────────────────────────────── */

export async function generateStaticParams() {
  const pages = await getAllStatePages();
  return pages.map((p) => ({ slug: `${p.serviceSlug}+${p.slug}` }));
}

/* ── Metadata ─────────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseLocationSlug(slug);
  if (!parsed) return { title: 'Location Not Found' };

  const page = await getStatePage(parsed.stateSlug);
  if (!page) return { title: 'Location Not Found' };

  const url = `${BASE}${locationPath(page.serviceSlug, page.slug)}`;
  const description =
    page.seoDescription ||
    `${page.state}-based construction and estimation services: cost estimating, quantity surveying, shop drawings, permit sets and CPM scheduling. AACE Class 3, 24–48h.`;

  return {
    // `absolute` because seoTitle already carries its own brand suffix. The
    // root layout applies a "%s | The ACE Services" template, which without
    // this would emit "... | ACE Services | The ACE Services".
    title: page.seoTitle
      ? { absolute: page.seoTitle }
      : `${page.title} | The ACE Services`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: page.seoTitle ? { absolute: page.seoTitle } : `${page.title} | The ACE Services`,
      description,
      url,
      type: 'article',
    },
  };
}

/* ── Small presentational pieces ──────────────────────────────── */

function Section({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto max-w-4xl ${className}`}>{children}</section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-6 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-3xl">
      {children}
    </h2>
  );
}

function CityBlock({
  city,
  heading,
}: {
  city: LocationCity;
  heading: string;
}) {
  return (
    <Section className="mt-12">
      <Heading>{heading}</Heading>
      <LocationProse value={city.intro} />
      {city.bullets && city.bullets.length > 0 && (
        <ul className="mt-5 space-y-3">
          {city.bullets.map((b) => (
            <li key={b} className="flex gap-3 text-base leading-relaxed text-on-surface-variant">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {city.closing && (
        <p className="mt-5 font-[family-name:var(--font-space)] text-base leading-relaxed text-on-surface-variant md:text-lg">
          {city.closing}
        </p>
      )}
    </Section>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseLocationSlug(slug);
  if (!parsed) notFound();

  const page = await getStatePage(parsed.stateSlug);
  if (!page) notFound();

  const points = proofPoints(page.state, page.whyChooseUsOverride);
  const selfUrl = `${BASE}${locationPath(page.serviceSlug, page.slug)}`;

  const faqJsonLd =
    page.faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: page.faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  return (
    <article className="min-h-screen bg-background px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)] md:py-32">
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      {/* Header */}
      <header className="mx-auto max-w-4xl">
        <p className="mb-4 font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-primary">
          // Service Area
        </p>
        <h1 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-5xl">
          {page.title}
        </h1>
      </header>

      {/* {overview} */}
      <Section className="mt-8">
        <LocationProse value={page.overview} />
      </Section>

      {/* {why_contractors_outsource} */}
      {page.whyOutsource.length > 0 && (
        <Section className="mt-12">
          <Heading>{`Why ${page.state} Contractors Are Outsourcing Estimating and Pre-Construction Work`}</Heading>
          <LocationProse value={page.whyOutsource} />
        </Section>
      )}

      {/* {services} */}
      {page.services.length > 0 && (
        <Section className="mt-12">
          <Heading>{`Construction and Estimation Services Available Across ${page.state}`}</Heading>
          {page.servicesIntro && (
            <p className="mb-6 font-[family-name:var(--font-space)] text-base leading-relaxed text-on-surface-variant md:text-lg">
              {page.servicesIntro}
            </p>
          )}
          <ul className="space-y-4">
            {page.services.map((s) => (
              <li
                key={s.slug}
                className="border-l-2 border-primary/40 pl-4 font-[family-name:var(--font-space)] text-base leading-relaxed text-on-surface-variant"
              >
                <Link
                  href={`/${s.slug}/`}
                  className="link-underline font-semibold text-on-surface hover:text-primary"
                >
                  {s.title}
                </Link>
                {s.description ? ` — ${s.description}` : ''}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* {home_city} */}
      {page.primaryCity && (
        <CityBlock
          city={page.primaryCity}
          heading={`Construction and Estimation Services in ${page.primaryCity.name}`}
        />
      )}

      {/* {second_city} */}
      {page.secondCity && (
        <CityBlock
          city={page.secondCity}
          heading={`Construction and Estimation Services in ${page.secondCity.name}`}
        />
      )}

      {/* {rest_of_state} */}
      {page.restOfState.length > 0 && (
        <Section className="mt-12">
          <Heading>
            {page.primaryCity && page.secondCity
              ? `${page.restOfState[0].label.replace(/,.*$/, '')}, and the Rest of ${page.state}`
              : `The Rest of ${page.state}`}
          </Heading>
          <ul className="space-y-3">
            {page.restOfState.map((r) => (
              <li key={r.label} className="flex gap-3 text-base leading-relaxed text-on-surface-variant">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>
                  <span className="font-semibold text-on-surface">{r.label}</span>
                  {r.description ? ` — ${r.description}` : ''}
                </span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* {why_choose_us} — from code, identical on every page */}
      <Section className="mt-12">
        <Heading>{`Why ${page.state} Contractors Choose The ACE Services`}</Heading>
        <ul className="space-y-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-base leading-relaxed text-on-surface-variant">
              <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </Section>

      {/* {state_specific} — the block that makes the page about this state */}
      {page.stateSpecific.length > 0 && (
        <Section className="mt-12">
          <Heading>{`${page.state}-Specific Considerations We Build Into Every Estimate`}</Heading>
          <p className="mb-6 font-[family-name:var(--font-space)] text-base leading-relaxed text-on-surface-variant md:text-lg">
            {page.state} presents a few pricing and planning variables that a
            generic, out-of-state estimating service will miss:
          </p>
          <ul className="space-y-3">
            {page.stateSpecific.map((s) => (
              <li key={s.topic} className="flex gap-3 text-base leading-relaxed text-on-surface-variant">
                <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span>{s.detail}</span>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {/* {faq} */}
      {page.faqs.length > 0 && (
        <Section className="mt-12">
          <Heading>Frequently Asked Questions</Heading>
          <div className="space-y-6">
            {page.faqs.map((f) => (
              <div key={f.question}>
                <h3 className="font-[family-name:var(--font-space)] text-lg font-bold text-on-background">
                  {f.question}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-space)] text-base leading-relaxed text-on-surface-variant">
                  {f.answer}
                </p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* {cta} */}
      <Section className="mt-16 text-center">
        <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl">
          {page.cta?.heading ?? `Ready to Bid Smarter on Your Next ${page.state} Project?`}
        </h2>
        {page.cta?.body && (
          <p className="mx-auto mt-4 max-w-2xl font-[family-name:var(--font-space)] text-base leading-relaxed text-on-surface-variant md:text-lg">
            {page.cta.body}
          </p>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            href="/calculator/"
            className="bracket-corners hover-brackets rounded bg-primary px-8 py-3 font-[family-name:var(--font-space)] text-base font-bold text-white transition-colors hover:bg-[#E55A00]"
          >
            Get a Free Estimate
          </Link>
          <Link
            href="/contact-us/"
            className="bracket-corners hover-brackets rounded border border-primary px-8 py-3 font-[family-name:var(--font-space)] text-base font-bold text-primary transition-colors hover:bg-primary hover:text-white"
          >
            Contact Us
          </Link>
        </div>
        <p className="mt-6 text-sm text-on-surface-variant/60">
          <Link href="/locations/" className="link-underline hover:text-primary">
            Browse all service areas
          </Link>
          {' · '}
          <Link href="/services/" className="link-underline hover:text-primary">
            All services
          </Link>
        </p>
      </Section>

      {/* self canonical, keeps the + form explicit in the markup */}
      <link rel="canonical" href={selfUrl} />
    </article>
  );
}