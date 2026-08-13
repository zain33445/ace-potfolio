import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Check, ArrowRight, ChevronDown } from 'lucide-react';

// Blog Imports
import { getPostBySlug, getPosts } from '@/src/services/wordpress/content';
import { extractHeadings } from '@/src/lib/extractHeadings';
import TableOfContents from '@/src/components/TableOfContents';
import type { WPPost } from '@/src/services/wordpress/types';

// Service Imports
import { services, getServiceIcon, type Service } from '@/src/data/services';
import { getServiceEnriched, getSubServices } from '@/src/data/services-cms';

/* ── Slug validation ──────────────────────────────────────────── */

const SLUG_RE = /^[\p{L}\p{N}\p{M}\p{So}]+(?:-[\p{L}\p{N}\p{M}\p{So}]+)*$/u;

function validateSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) notFound();
}

function toUrlSlug(slug: string): string {
  return encodeURIComponent(slug);
}

export async function generateStaticParams() {
  try {
    const result = await getPosts({ per_page: 100 });
    const postPaths = result.data.map((post) => ({ slug: post.slug }));
    const servicePaths = services.map((s) => ({ slug: s.slug }));
    return [...servicePaths, ...postPaths];
  } catch {
    return services.map((s) => ({ slug: s.slug }));
  }
}

/* ── Dynamic metadata ─────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  validateSlug(slug);

  // Check if it's a service first
  const service = await getServiceEnriched(slug);
  if (service) {
    return {
      title: `${service.title} | The ACE Services`,
      description: service.summary.slice(0, 160),
      alternates: {
        canonical: `https://www.theaceservices.com/${toUrlSlug(slug)}`,
      },
      openGraph: {
        title: `${service.title} | The ACE Services — Pre-Construction Estimation`,
        description: service.summary.slice(0, 160),
        url: `https://www.theaceservices.com/${toUrlSlug(slug)}`,
      },
    };
  }

  // Otherwise, try blog post
  const post = await getPostBySlug(slug);
  if (post) {
    return {
      title: post.title,
      description: post.excerpt.slice(0, 160),
      alternates: {
        canonical: `https://www.theaceservices.com/${toUrlSlug(slug)}`,
      },
      openGraph: {
        title: `${post.title} | The ACE Services`,
        description: post.excerpt.slice(0, 160),
        ...(post.image ? { images: [{ url: post.image }] } : {}),
        url: `https://www.theaceservices.com/${toUrlSlug(slug)}`,
      },
    };
  }

  return { title: 'Not Found' };
}

/* ── Helpers ──────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ── Main Page Router ─────────────────────────────────────────── */

export default async function SlugRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  validateSlug(slug);

  // Route to Service if it exists
  const service = await getServiceEnriched(slug);
  if (service) {
    return <ServiceView service={service} slug={slug} />;
  }

  // Route to Blog Post if it exists
  const post = await getPostBySlug(slug);
  if (post) {
    return <BlogPostView post={post as unknown as WPPost & { content: string }} slug={slug} />;
  }

  notFound();
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SERVICE VIEW COMPONENTS                                       */
/* ═══════════════════════════════════════════════════════════════ */

async function ServiceView({ service, slug }: { service: Service; slug: string }) {
  const Icon = getServiceIcon(service.id);

  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.theaceservices.com' },
              { '@type': 'ListItem', position: 2, name: 'Services', item: 'https://www.theaceservices.com/services' },
              { '@type': 'ListItem', position: 3, name: service.title, item: `https://www.theaceservices.com/${toUrlSlug(slug)}` },
            ],
          }),
        }}
      />

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

      <section className="relative overflow-hidden max-w-8xl border-b border-blueprint-line">
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

        <div className="relative  max-w-7xl px-5 px-[var(--spacing-margin-mobile)] pt-16 md:px-[var(--spacing-margin-desktop)] md:pt-16">
          <div className="mb-8 flex items-center gap-2 font-mono text-SM font-bold uppercase tracking-wider text-on-surface-variant">
            <Link href="/services" className="hover:text-primary transition-colors">
              SERVICES
            </Link>
            <span>/</span>
            <span className="text-primary">{slug}</span>
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

          <p className="mt-6 max-w-8xl font-sans text-lg leading-relaxed text-on-surface-variant md:text-left md:text-xl text-justify">
            {service.description || service.summary}
          </p>

          {service.stats && service.stats.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8 items-center justify-center">
              {service.stats.map((stat) => (
                <QuickStat key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          )}
        </div>

      <div className="mx-auto max-w-8xl px-5 px-[10px] text-justify py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          {/* ── Sidebar: Sub-Services ── */}
          <aside className="order-2 lg:order-2">
            <Suspense fallback={<SidebarSkeleton />}>
              <SubServicesSidebar service={service} />
            </Suspense>
          </aside>

          {/* ── Main Content ── */}
          <div className="order-1 lg:order-2 space-y-16">
            <ServiceOverviewSection service={service} />
            <PricingFeaturesSection service={service} />
            {service.process && service.process.length > 0 && (
              <ProcessSection service={service} />
            )}
            {service.seoContent && (
              <SeoContentSection service={service} />
            )}
          </div>
        </div>
      </div>

      <CtaSection service={service} />
      </section>
    </main>
  );
}

async function SubServicesSidebar({ service }: { service: Service }) {
  const subServices = await getSubServices(service);

  return (
    <div className="sticky top-24">
      {subServices.length > 0 && (
        <>
          <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            [SUB_SERVICES]
          </div>
          <div className="space-y-4 mb-8">
            {subServices.map((s) => {
              const SvgIcon = getServiceIcon(s.id);
              return (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  className="group flex gap-3 border border-blueprint-line bg-surface p-3 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)]"
                >
                  <div className="flex items-center justify-center w-12 h-12 border border-blueprint-line bg-background bracket-corners flex-shrink-0 group-hover:border-primary transition-colors">
                    <SvgIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <h4 className="truncate font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary">
                      {s.title}
                    </h4>
                    <p className="font-mono text-xs text-on-surface-variant truncate">
                      Related Service
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
      <Link
        href="/services"
        className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
      >
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5m7-7l-7 7 7 7" />
        </svg>
        <span>VIEW ALL SERVICES</span>
      </Link>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="sticky top-24 animate-pulse">
      <div className="mb-4 h-4 w-32 bg-surface-variant rounded"></div>
      <div className="space-y-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 border border-blueprint-line bg-surface p-3">
            <div className="w-12 h-12 bg-surface-variant"></div>
            <div className="flex flex-col justify-center gap-2 flex-1">
              <div className="h-4 bg-surface-variant w-3/4 rounded"></div>
              <div className="h-3 bg-surface-variant w-1/2 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

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

function ServiceOverviewSection({ service }: { service: Service }) {
  return (
    <section>
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        {service.slug === 'project-management' ? 'WHAT WE DELIVER' : 'OVERVIEW'}
      </div>
      <div className="space-y-8">
        {/* If we have full WP content, render it richly */}
        {service.wpContent ? (
          <article
            className="article-content"
            dangerouslySetInnerHTML={{ __html: service.wpContent }}
          />
        ) : (
          <>
            <p className="font-sans text-lg leading-relaxed text-on-surface-variant">
              {service.description || service.summary}
            </p>
            {service.details && service.details.length > 0 && (
              <div className="grid gap-4 md:grid-cols-2">
                {service.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 border border-blueprint-line bg-surface p-4">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span className="font-sans text-base text-on-surface leading-relaxed">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function PricingFeaturesSection({ service }: { service: Service }) {
  return (
    <section>
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [PRICING_AND_FEATURES]
      </div>
      <div className="border border-blueprint-line bg-surface p-6 md:p-8">
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

function ProcessSection({ service }: { service: Service }) {
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

function CtaSection({ service }: { service: Service }) {
  return (
    <section className="border-t border-blueprint-line">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-5 px-[var(--spacing-margin-mobile)] py-20 text-center md:px-[var(--spacing-margin-desktop)] md:py-28">
        <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SYS::INITIATE_ESTIMATE_REQUEST]
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
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          {service.slug !== 'project-management' && (
            <Link
              href="/calculator"
              className="group inline-flex items-center gap-3 border border-blueprint-line bg-surface px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary"
            >
              <span>TRY CALCULATOR</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function SeoContentSection({ service }: { service: Service }) {
  const { seoContent } = service;
  if (!seoContent) return null;

  return (
    <section className="border-t border-blueprint-line pt-16">
      <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [DEEP_DIVE]
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
        [KEY_BENEFITS]
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
            [FREQUENTLY_ASKED_QUESTIONS]
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

/* ═══════════════════════════════════════════════════════════════ */
/*  BLOG POST VIEW COMPONENT                                      */
/* ═══════════════════════════════════════════════════════════════ */

function BlogPostView({ post, slug }: { post: WPPost & { content: string }; slug: string }) {
  const tocResult = post.content ? extractHeadings(post.content) : null;
  const tocItems = tocResult?.items ?? [];
  const contentHtml = tocResult?.html ?? post.content;
  const hasToc = tocItems.length > 0;

  return (
    <section className="w-full bg-background text-on-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.theaceservices.com' },
              { '@type': 'ListItem', position: 2, name: 'Insights & Blog', item: 'https://www.theaceservices.com/blog' },
              { '@type': 'ListItem', position: 3, name: post.title, item: `https://www.theaceservices.com/${toUrlSlug(slug)}` },
            ],
          }),
        }}
      />
      <div className="relative overflow-hidden border-b border-blueprint-line">
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
        <div className="relative mx-auto w-full px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className={post.image ? 'lg:flex lg:items-center lg:gap-12' : ''}>
            {post.image && (
              <div className="mb-10 lg:mb-0 lg:w-[35%] lg:shrink-0">
                <div className="relative aspect-[16/10] overflow-hidden border border-blueprint-line">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 560px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            <div className={post.image ? 'lg:flex-1' : ''}>
              <Link
                href="/blog"
                className="group mb-8 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                <svg className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                BACK_TO_INDEX
              </Link>
              <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                [SYS::BLOG_POST]
              </div>
              <h1 className="font-[family-name:var(--font-space)] text-4xl font-bold leading-tight text-on-background md:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-sm text-on-surface-variant">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                {post.modified !== post.date && (
                  <span className="text-on-surface-variant/60">
                    (updated {formatDate(post.modified)})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="px-[var(--spacing-margin-mobile)] py-12 md:px-[var(--spacing-margin-desktop)] md:py-16">
        <div className={hasToc ? 'lg:flex lg:gap-12' : ''}>
          <div className={hasToc ? 'lg:flex-1 lg:min-w-0' : ''}>
            {post.content ? (
              <article
                className="article-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
            ) : (
              <p className="text-on-surface-variant italic">
                No content available for this post.
              </p>
            )}
            <div className="my-12 border-t border-blueprint-line" />
            <div className="flex items-center justify-between">
              <Link
                href="/blog"
                className="group inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                <svg className="h-3 w-3 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                ALL_INSIGHTS
              </Link>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                HOME
                <svg className="h-3 w-3 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
          {hasToc && (
            <aside className="mt-10 lg:mt-0 lg:w-[320px] lg:shrink-0">
              <div className="lg:sticky lg:top-28 lg:max-h-[calc(100vh-9rem)] lg:overflow-y-auto toc-sidebar-scroll">
                <TableOfContents items={tocItems} />
              </div>
            </aside>
          )}
        </div>
      </div>
      <div className="border-t border-blueprint-line">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-[var(--spacing-margin-mobile)] py-16 text-center md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
            [SYS::INITIATE_PROJECT_QUERY]
          </div>
          <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-5xl">
            Need a Precision Estimate?
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-on-surface-variant">
            Get a precise, AACE-compliant cost estimate for your next construction
            project. Turnaround in as little as 3–5 business days.
          </p>
          <Link
            href="/calculator"
            className="group mt-4 inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
          >
            <span>GET_ESTIMATE</span>
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
