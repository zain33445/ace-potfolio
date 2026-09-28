import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Check, ArrowRight, ChevronDown } from "lucide-react";

// Blog Imports
import {
  getPostBySlug,
  getPosts,
  type BlogPost,
} from "@/src/services/wordpress/content";
import { leadDescription } from "@/src/services/wordpress/html";
import { extractHeadings } from "@/src/lib/extractHeadings";
import TableOfContents from "@/src/components/TableOfContents";
import ScrollRow from "@/src/components/ScrollRow";
import { getPostSeo } from "@/src/data/post-seo";
import { getRelatedSlugs } from "@/src/data/related-posts";

// Service Imports
import { services, getServiceIcon, type Service } from "@/src/data/services";
import { getServiceEnriched, getSubServices } from "@/src/data/services-cms";
import { PERSON_ID, personSchema } from "@/src/lib/schema";

/**
 * Serve prerendered/ISR pages for this route rather than rendering on-demand
 * against the slow shared-WP CMS on every hit. Without this the route had no
 * revalidate (unlike every other content route) so any page that missed the
 * build prerender paid the full CMS round-trip each request — the 2.5–6.6s
 * TTFB Site Audit flagged. One-hour ISR caches the render at the edge.
 */
export const revalidate = 3600;

/* ── Slug validation ──────────────────────────────────────────── */

const SLUG_RE = /^[\p{L}\p{N}\p{M}\p{So}]+(?:-[\p{L}\p{N}\p{M}\p{So}]+)*$/u;

/* Standalone landing pages that live outside the `services` array (own app
   dirs, not `[slug]` routes) — the Related Services rotation below can never
   reach them, so they're appended to every service page's Related Services
   module as curated cards instead. */
const FEATURED_SOLUTIONS = [
  {
    title: "Houston Construction Estimating",
    slug: "houston-construction-estimating",
  },
  { title: "ADU Construction Cost Guide", slug: "adu-construction-cost" },
];

function validateSlug(slug: string): void {
  if (!SLUG_RE.test(slug)) notFound();
}

function toUrlSlug(slug: string): string {
  return encodeURIComponent(slug);
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

/**
 * Resolve a slug against services and blog posts in parallel.
 *
 * `getServiceEnriched`/`getPostBySlug` only return `null` for a confirmed
 * "no match" — a real CMS/network failure now throws instead of being
 * swallowed to null (see wpGetListSafe / getPostBySlug). If either lookup
 * rejects here, we must NOT fall through to notFound(): that would let a
 * transient WordPress outage get permanently cached as a 404 page by this
 * route's ISR cache. Only report not-found when both lookups genuinely
 * completed with no match.
 */
async function resolveSlug(
  slug: string,
): Promise<{ service: Service } | { post: BlogPost } | null> {
  const [serviceResult, postResult] = await Promise.allSettled([
    getServiceEnriched(slug),
    getPostBySlug(slug),
  ]);

  if (serviceResult.status === "fulfilled" && serviceResult.value) {
    return { service: serviceResult.value };
  }
  if (postResult.status === "fulfilled" && postResult.value) {
    return { post: postResult.value };
  }
  if (serviceResult.status === "rejected") throw serviceResult.reason;
  if (postResult.status === "rejected") throw postResult.reason;

  return null;
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

  const resolved = await resolveSlug(slug);

  if (resolved && "service" in resolved) {
    const { service } = resolved;
    // seoTitle is the finished <title>: it already carries whatever brand
    // suffix it needs, so bypass the root layout's "%s | The ACE Services".
    const title = service.seoTitle
      ? { absolute: service.seoTitle }
      : service.title;
    const description =
      service.seoDescription ?? truncate(service.summary, 160);
    return {
      title,
      description,
      alternates: {
        canonical: `https://theaceservices.com/${toUrlSlug(slug)}/`,
      },
      openGraph: {
        title: service.seoTitle ?? `${service.title} | The ACE Services`,
        description,
        url: `https://theaceservices.com/${toUrlSlug(slug)}/`,
      },
    };
  }

  if (resolved && "post" in resolved) {
    const { post } = resolved;
    const seo = getPostSeo(slug);
    // A post title doubles as its H1, so it is usually too long for the SERP,
    // and the WP auto-excerpt arrives clipped mid-sentence — all 78 posts are
    // affected. Order of preference: a hand-written override, else the post's
    // own opening sentences (these posts are written answer-first, so that is
    // the best snippet available), else the excerpt as a last resort.
    const description =
      seo.description ??
      leadDescription(post.content) ??
      truncate(post.excerpt, 160);
    return {
      // `absolute` bypasses the root layout's "%s | The ACE Services": an
      // override is already a finished title, and the 19-char brand suffix
      // buys nothing on informational queries.
      title: seo.title ? { absolute: seo.title } : post.title,
      description,
      alternates: {
        canonical: `https://theaceservices.com/${toUrlSlug(slug)}/`,
      },
      openGraph: {
        title: seo.title ?? `${post.title} | The ACE Services`,
        description,
        ...(post.image ? { images: [{ url: post.image }] } : {}),
        url: `https://theaceservices.com/${toUrlSlug(slug)}/`,
      },
    };
  }

  return { title: "Not Found" };
}

/* ── Helpers ──────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
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

  const resolved = await resolveSlug(slug);

  if (resolved && "service" in resolved) {
    return <ServiceView service={resolved.service} slug={slug} />;
  }
  if (resolved && "post" in resolved) {
    return <BlogPostView post={resolved.post} slug={slug} />;
  }

  notFound();
}

/* ═══════════════════════════════════════════════════════════════ */
/*  SERVICE VIEW COMPONENTS                                       */
/* ═══════════════════════════════════════════════════════════════ */

/* Hero image per service; sub-services fall back to their parent, then cost.webp. */
const HERO_IMAGES: Record<string, string> = {
  "cost-estimating": "/cost.webp",
  "architectural-services": "/designs.webp",
  "structural-engineering": "/c3.webp",
  "project-management": "/c4.webp",
  "3d-rendering-services": "/hero-renderings.webp",
  "shop-drawing-services": "/hero-shop.webp",
  "permit-set-services": "/hero-permits.webp",
};

async function ServiceView({
  service,
  slug,
}: {
  service: Service;
  slug: string;
}) {
  return (
    <main className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://theaceservices.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Services",
                item: "https://theaceservices.com/services/",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: service.title,
                item: `https://theaceservices.com/${toUrlSlug(slug)}/`,
              },
            ],
          }),
        }}
      />

      {service.seoContent?.faqs && service.seoContent.faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: service.seoContent.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}

      <section className="relative overflow-clip max-w-8xl border-b border-blueprint-line">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-blueprint-line) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-blueprint-line) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

        {/* -mt cancels layout-shell main padding so the cream bg meets the contact strip; pt restores it. */}
        <div className="relative -mt-20 bg-[#F4F1EC] pt-20 md:-mt-16 md:pt-16">

          <div className="mx-auto grid max-w-[1440px] items-center gap-10 px-[var(--spacing-margin-mobile)] pt-30 pb-16 lg:pt-0 md:px-[var(--spacing-margin-desktop)] lg:grid-cols-2 lg:gap-16 lg:pb-20">
            <div>
              <div className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary lg:pt-30">
                <span className="font-[family-name:var(--font-space)]">
                  [
                  {String(
                    services.findIndex((s) => s.slug === service.slug) + 1,
                  ).padStart(2, "0")}
                  ]
                </span>{" "}
                {service.category}
              </div>
              <h1 className="mt-4 font-sans text-4xl font-extrabold leading-[1.05] text-on-background md:text-6xl">
                {service.title}
              </h1>
              <p className="mt-6 max-w-2xl font-sans text-base leading-relaxed text-on-surface-variant md:text-xl">
                {service.summary}
              </p>
              <div className="mt-6 flex flex-wrap gap-2 font-mono text-sm items-center font-bold uppercase tracking-wider">
                <span className="rounded-sm bg-primary/10 px-3 py-1.5 font-[family-name:var(--font-space)] text-primary">
                  {service.turnaround}
                </span>
                <span className="rounded-sm bg-black/5 px-3 py-1.5 text-on-surface">
                  {service.tagline}
                </span>
                <span className="rounded-sm bg-black/5 px-3 py-1.5 font-[family-name:var(--font-space)] text-on-surface">
                  {/^\$/.test(service.startingPrice) ? (
                    <>
                      From{" "}
                      <span className="font-extrabold text-2xl">
                        {service.startingPrice}
                      </span>
                    </>
                  ) : (
                    `${service.startingPrice} pricing`
                  )}
                </span>
              </div>
              {service.features.length > 0 && (
                <ul className="mt-6 grid gap-x-6 gap-y-2 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 font-sans text-base text-on-surface md:text-lg"
                    >
                      <Check className="mt-1 h-4 w-4 flex-shrink-0 text-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/contact-us/"
                  className="inline-flex items-center rounded-md gap-2 border border-primary bg-primary px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
                >
                  <span>REQUEST QUOTE</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                {service.slug === "cost-estimating" && (
                  <Link
                    href="/calculator/"
                    className="inline-flex items-center rounded-md gap-2 border border-primary bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-primary hover:text-white"
                  >
                    OPEN CALCULATOR
                  </Link>
                )}
              </div>
            </div>
            <div className="relative order-first aspect-[3/2] overflow-hidden rounded-lg shadow-lg lg:order-none">
              <Image
                src={
                  HERO_IMAGES[service.slug] ??
                  HERO_IMAGES[service.parent ?? ""] ??
                  "/cost.webp"
                }
                alt={service.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-8xl px-5 px-[10px] text-justify py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* ── Sidebar: Sub-Services ── */}
            <aside className="order-2 min-w-0 lg:col-span-3 lg:sticky lg:top-24 lg:self-start">
              <Suspense fallback={<SidebarSkeleton />}>
                <SubServicesSidebar service={service} />
              </Suspense>
            </aside>

            {/* ── Main Content ── */}
            <div className="order-1 lg:order-1 space-y-16 min-w-0 lg:col-span-9 px-[5%] md:px-[0%]">
              <ServiceOverviewSection service={service} />
              {/* <PricingFeaturesSection service={service} /> */}
              {service.process && service.process.length > 0 && (
                <ProcessSection service={service} />
              )}
              {service.seoContent && <SeoContentSection service={service} />}
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
  /* A sub-service links DOWN to its children via getSubServices, but nothing
     linked back UP to its hub — so /rebar-detailing-services/ and the three
     architectural sub-services were reachable from their parent and dead-ended
     there. One link here covers every service with a `parent`. */
  const parentService = service.parent
    ? services.find((s) => s.slug === service.parent)
    : undefined;

  /* The real, top-level catalogue the company sells — structural engineering
     (incl. PE review and sealing), permit sets, shop drawings, cost estimating.
     getSubServices deliberately excludes PRIMARY_SERVICE_SLUGS, so without this
     block a reader on a narrow page like electrical estimating never sees them,
     and the fuzzy matcher surfaces the WP page /structural-services/ instead of
     the canonical /structural-engineering/. Excludes the current page, the
     parent shown above, and anything already in Sub Services, so nothing
     repeats. */
  const subServiceSlugs = new Set(subServices.map((s) => s.slug));
  const eligibleRelated = services
    .filter((s) => s.slug !== service.slug)
    .filter((s) => s.slug !== parentService?.slug)
    .filter((s) => !subServiceSlugs.has(s.slug));
  // Rotate the window by this page's position so link equity is spread across
  // every service instead of always surfacing the first 8 in array order
  // (which left pages in the tail of the `services` array with zero inbound
  // "related" links). Do NOT switch back to a plain .slice(0, 8).
  const rotateBy = eligibleRelated.length
    ? Math.max(
        0,
        services.findIndex((s) => s.slug === service.slug),
      ) % eligibleRelated.length
    : 0;
  const relatedServices = [
    ...eligibleRelated.slice(rotateBy),
    ...eligibleRelated.slice(0, rotateBy),
  ].slice(0, 8);

  return (
    <div className="">
      {parentService && (
        <div className="mb-8">
          <div className="mb-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Part Of
          </div>
          <Link
            href={`/${parentService.slug}/`}
            className="group flex w-full items-start gap-2 border border-blueprint-line bg-surface p-3 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)]"
          >
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center border border-blueprint-line bg-background bracket-corners transition-colors group-hover:border-primary">
              {(() => {
                const ParentIcon = getServiceIcon(parentService.id);
                return <ParentIcon className="h-5 w-5 text-primary" />;
              })()}
            </div>
            <div className="flex min-w-0 flex-col justify-center">
              <h4 className="truncate font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary">
                {parentService.title}
              </h4>
              <p className="hidden font-mono text-[10px] text-on-surface-variant md:block">
                Parent Service
              </p>
            </div>
          </Link>
        </div>
      )}
      {/* {subServices.length > 0 && (
        <>
          <div className="mb-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Sub Services
          </div>
          <div className="mb-8 grid grid-cols-2 w-full gap-2 md:block md:space-y-2">
            {subServices.map((s) => {
              const SvgIcon = getServiceIcon(s.id);
              return (
                <Link
                  key={s.slug}
                  href={`/${s.slug}/`}
                  className="group w-full flex flex-col items-center text-center gap-2 border border-blueprint-line bg-surface p-3 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)] lg:flex-row lg:text-left lg:items-start"
                >
                  <div className="flex items-center justify-center w-10 h-10 border border-blueprint-line bg-background bracket-corners flex-shrink-0 group-hover:border-primary transition-colors">
                    <SvgIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <h4 className="font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary line-clamp-2 lg:truncate">
                      {s.title}
                    </h4>
                    <p className="font-mono text-[10px] text-on-surface-variant hidden md:block">
                      Sub Service
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )} */}
      {relatedServices.length > 0 && (
        <>
          <div className="mb-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Related Services
          </div>
          <ScrollRow className="mb-4 flex w-full snap-x snap-mandatory gap-2 overflow-x-auto pb-2 [scrollbar-width:none] *:min-w-0 *:shrink-0 *:basis-[calc((100%-1rem)/3)] *:break-words *:snap-start lg:h-[392px] lg:flex-col lg:snap-y lg:overflow-x-hidden lg:overflow-y-auto lg:pb-0 lg:*:basis-auto lg:*:h-[72px]">
            {relatedServices.map((s) => {
              const SvgIcon = getServiceIcon(s.id);
              return (
                <Link
                  key={s.slug}
                  href={`/${s.slug}/`}
                  className="group w-full flex flex-col items-center text-center gap-2 border border-blueprint-line bg-surface p-3 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)] lg:flex-row lg:text-left lg:items-start"
                >
                  <div className="flex items-center justify-center w-10 h-10 border border-blueprint-line bg-background bracket-corners flex-shrink-0 group-hover:border-primary transition-colors">
                    <SvgIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex min-w-0 flex-col justify-center">
                    <h4 className="font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary line-clamp-2 lg:truncate">
                      {s.title}
                    </h4>
                    <p className="font-mono text-[10px] text-on-surface-variant hidden md:block">
                      Related Service
                    </p>
                  </div>
                </Link>
              );
            })}
            {FEATURED_SOLUTIONS.filter((sol) => sol.slug !== service.slug).map(
              (sol) => {
                const SolutionIcon = getServiceIcon("SOLUTION");
                return (
                  <Link
                    key={sol.slug}
                    href={`/${sol.slug}/`}
                    className="group w-full flex flex-col items-center text-center gap-2 border border-blueprint-line bg-surface p-3 transition-all duration-300 hover:border-primary hover:shadow-[0_0_20px_rgba(255,107,0,0.06)] lg:flex-row lg:text-left lg:items-start"
                  >
                    <div className="flex items-center justify-center w-10 h-10 border border-blueprint-line bg-background bracket-corners flex-shrink-0 group-hover:border-primary transition-colors">
                      <SolutionIcon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex min-w-0 flex-col justify-center">
                      <h4 className="font-[family-name:var(--font-space)] text-base font-bold text-on-background transition-colors group-hover:text-primary line-clamp-2 lg:truncate">
                        {sol.title}
                      </h4>
                      <p className="font-mono text-[10px] text-on-surface-variant hidden md:block">
                        Solution
                      </p>
                    </div>
                  </Link>
                );
              },
            )}
          </ScrollRow>
        </>
      )}
      <Link
        href="/services/"
        className="inline-flex justify-center md:justify-start items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 12H5m7-7l-7 7 7 7"
          />
        </svg>
        <span className="font-[family-name:var(--font-space)] block text-center text-base font-bold text-on-background transition-colors group-hover:text-primary line-clamp-2 lg:truncate">
          VIEW ALL SERVICES
        </span>
      </Link>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-4 w-32 bg-surface-variant rounded"></div>
      <div className="space-y-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-3 border border-blueprint-line bg-surface p-3"
          >
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

function ServiceOverviewSection({ service }: { service: Service }) {
  return (
    <section>
      <div className="mb-6 font-mono text-base font-bold uppercase tracking-[0.1em] text-primary">
        Details
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
            {service.details && service.details.length > 0 && (
              <div className="">
                {service.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 pl-8">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <span className="font-sans text-lg text-on-surface-varient leading-relaxed">
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
      <div className="mb-6 font-mono text-base font-bold uppercase tracking-[0.1em] text-primary">
        PRICING AND FEATURES
      </div>
      <div className="border border-blueprint-line bg-surface p-16 md:p-8">
        <div className="mb-6 border-b border-blueprint-line pb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-mono text-3xl font-extrabold uppercase tracking-[0.05em] text-primary mb-2">
              CUSTOM PRICING
            </div>
            <div className="text-md text-on-surface-variant mb-2">
              Based on project scope, complexity, and deliverables.
            </div>
            <div className="font-mono text-md text-on-surface-variant tracking-wider">
              {service.turnaround} standard turnaround
            </div>
          </div>
          <Link
            href="/contact-us/"
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
              <span className="font-sans text-base text-on-surface leading-snug">
                {feature}
              </span>
            </div>
          ))}
        </div>
        {service.footnote && (
          <p className="mt-4 font-mono text-sm text-on-surface-variant leading-relaxed">
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
      <div className="mb-6 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Our Process
      </div>
      <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-5xl mb-12">
        How It Works
      </h2>
      <div className="grid gap-8 md:grid-cols-1">
        {service.process.map((step, i) => (
          <div key={step.title} className="relative">
            <div className="flex items-center gap-2 ">
              <div className="mb-4 flex items-center gap-3">
                <span className="font-mono text-xl font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}.
                </span>
              </div>
              <div>
                <h3 className="font-[family-name:var(--font-space)] text-xl font-bold text-left text-on-background mb-2">
                  {step.title}
                </h3>
                <p className="font-sans text-base leading-relaxed text-on-surface-variant">
                  {step.description}
                </p>
              </div>
            </div>
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
          Request an Estimate
        </div>
        <h2 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-6xl max-w-3xl">
          {service.ctaHeading ?? `Need ${service.title}?`}
        </h2>
        <p className="max-w-lg text-base leading-relaxed text-on-surface-variant md:text-center">
          {service.ctaDescription ??
            (service.slug === "project-management"
              ? "Send us your project plans, scope, or existing schedule for a preliminary review. We'll recommend the appropriate CPM scheduling and project-control services within 3-5 business days."
              : "Submit your blueprints and receive a precision construction cost estimate within 24-48 hours. Expedited turnaround is available.")}
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/contact-us/"
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
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
          {service.slug !== "project-management" && (
            <Link
              href="/calculator/"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
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
      <div className="mb-6 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Deep Dive
      </div>
      <h2 className="font-[family-name:var(--font-space)] text-3xl text-left font-bold text-on-background md:text-4xl mb-8">
        {seoContent.heading}
      </h2>
      <div className="space-y-6 mb-12">
        {seoContent.body.map((paragraph, idx) => (
          <p
            key={idx}
            className="font-sans text-base md:text-lg leading-relaxed text-on-surface-variant"
          >
            {paragraph}
          </p>
        ))}
      </div>
      {seoContent.highlightSection && (
        <div className="mb-12">
          <div className="mb-6 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {seoContent.highlightSection.heading}
          </div>
          <div className="space-y-6">
            {seoContent.highlightSection.body.map((paragraph, idx) => (
              <p
                key={idx}
                className="font-sans text-base md:text-lg leading-relaxed text-on-surface-variant"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      )}
      <div className="mb-6 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Key Benefits
      </div>
      <div className="grid gap-3 md:gap-6 md:grid-cols-3 mb-8">
        {seoContent.benefits.map((benefit, idx) => (
          <div
            key={idx}
            className="border border-blueprint-line bg-surface rounded-xl p-6 hover:border-primary transition-colors"
          >
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
          <div className="mb-6 font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
            FAQ
          </div>
          <div className="space-y-4">
            {seoContent.faqs.map((faq, idx) => (
              <details
                key={idx}
                className="group border-b border-b-blueprint-line bg-transparent [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer items-center gap-10 justify-between p-6 font-[family-name:var(--font-space)] text-lg font-bold text-left text-on-background transition-colors hover:text-primary">
                  {faq.question}
                  <ChevronDown className="h-7 w-7 text-primary transition-transform group-open:rotate-180" />
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

/**
 * Post-to-post links.
 *
 * Without these a blog post's only inbound link is /blog/, so every post is
 * a leaf: nothing flows between topically adjacent articles and the cluster
 * reads to a crawler as a flat list rather than a body of related work.
 *
 * A CMS outage must not take the post down with it — the article itself is
 * already rendered by the time this resolves, so failure degrades to no
 * related strip at all.
 */
async function RelatedPosts({ currentSlug }: { currentSlug: string }) {
  let posts;
  try {
    const result = await getPosts({ per_page: 100 });
    const bySlug = new Map(result.data.map((p) => [p.slug, p]));

    // Topical siblings first — see src/data/related-posts.ts. Falling back to
    // "newest" would put the same three links on all 63 posts, which is what
    // this replaced.
    const picked = getRelatedSlugs(currentSlug)
      .map((s) => bySlug.get(s))
      .filter((p) => p !== undefined);

    posts = picked.length
      ? picked
      : result.data.filter((p) => p.slug !== currentSlug).slice(0, 3);
  } catch {
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        Keep Reading
      </h2>
      <ul className="mt-6 grid gap-px border border-blueprint-line bg-blueprint-line sm:grid-cols-3">
        {posts.map((p) => (
          <li key={p.id} className="bg-background">
            <Link
              href={`/${toUrlSlug(p.slug)}/`}
              className="group flex h-full flex-col gap-2 p-5 transition-colors hover:bg-surface"
            >
              <span className="font-[family-name:var(--font-space)] text-base font-bold leading-snug text-on-background transition-colors group-hover:text-primary">
                {p.title}
              </span>
              <time
                dateTime={p.date}
                className="mt-auto font-mono text-xs text-on-surface-variant"
              >
                {formatDate(p.date)}
              </time>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BlogPostView({ post, slug }: { post: BlogPost; slug: string }) {
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
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://theaceservices.com",
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Insights & Blog",
                item: "https://theaceservices.com/blog/",
              },
              {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://theaceservices.com/${toUrlSlug(slug)}/`,
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            // Same clipped-excerpt problem as the meta description — do not
            // let a mid-sentence fragment into the structured data either.
            description:
              getPostSeo(slug).description ??
              leadDescription(post.content) ??
              post.excerpt,
            datePublished: post.date,
            dateModified: post.modified,
            image: post.image,
            author: {
              "@type": "Organization",
              name: "The ACE Services",
              url: "https://theaceservices.com",
            },
            publisher: {
              "@type": "Organization",
              name: "The ACE Services",
              url: "https://theaceservices.com",
              logo: {
                "@type": "ImageObject",
                url: "https://theaceservices.com/aceLogo.webp",
              },
            },
            mainEntityOfPage: `https://theaceservices.com/${toUrlSlug(slug)}/`,
          }),
        }}
      />
      {/* reviewedBy is only valid on WebPage in schema.org, not on Article —
          hence a separate node rather than a property on the Article above. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `https://theaceservices.com/${toUrlSlug(slug)}/#webpage`,
                url: `https://theaceservices.com/${toUrlSlug(slug)}/`,
                reviewedBy: { "@id": PERSON_ID },
                lastReviewed: post.modified,
              },
              personSchema,
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
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative mx-auto w-full px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div
            className={post.image ? "lg:flex lg:items-center lg:gap-12" : ""}
          >
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
            <div className={post.image ? "lg:flex-1" : ""}>
              <Link
                href="/blog/"
                className="group mb-8 inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                <svg
                  className="h-3 w-3 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Blog
              </Link>
              <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Blog Post
              </div>
              <h1 className="font-[family-name:var(--font-space)] text-4xl font-bold leading-tight text-on-background md:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-sm text-on-surface-variant">
                {/* These posts aren't written by a named individual, so
                    Article.author above stays the Organization. The CEO
                    reviews them for technical accuracy — that's what this
                    line and the WebPage.reviewedBy node record. */}
                <span>
                  Reviewed by{" "}
                  <Link
                    href="/authors/abdul-manan-zafar/"
                    className="font-bold text-on-background transition-colors hover:text-primary"
                  >
                    Engr. Abdul Manan Zafar
                  </Link>
                </span>
                <span className="text-on-surface-variant/40">·</span>
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
        <div className={hasToc ? "lg:flex lg:gap-12" : ""}>
          <div className={hasToc ? "lg:flex-1 lg:min-w-0" : ""}>
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
            <Suspense fallback={null}>
              <RelatedPosts currentSlug={slug} />
            </Suspense>
            <div className="flex items-center justify-between">
              <Link
                href="/blog/"
                className="group inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                <svg
                  className="h-3 w-3 transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                ALL_INSIGHTS
              </Link>
              <Link
                href="/"
                className="group inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
              >
                HOME
                <svg
                  className="h-3 w-3 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
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
            Project Inquiry
          </div>
          <h2 className="font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-5xl">
            Need a Precision Estimate?
          </h2>
          <p className="max-w-lg text-base leading-relaxed text-on-surface-variant">
            Get a precise, AACE-compliant cost estimate for your next
            construction project. Turnaround in as little as 24-48 hours.
          </p>
          <div className="mt-4 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/calculator/"
              className="group inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
            >
              <span>GET_ESTIMATE</span>
              <svg
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="/services/"
              className="font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
            >
              Get construction estimating services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
