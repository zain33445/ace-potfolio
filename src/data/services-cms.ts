/**
 * CMS-backed enrichment layer for services.
 *
 * The four services live in services.ts. Their editable marketing copy
 * (title + summary) lives in WordPress pages keyed by slug (the site's
 * headless CMS — a stock WP install with no custom post types). These helpers
 * let pages render the CMS copy when present, falling back to the static
 * defaults otherwise — without touching the canonical data.
 */

import {
  services,
  getServiceBySlug,
  getFeaturedServices,
} from '@/src/data/services';
import { getServicePage, getServicePages, getAllServicePages } from '@/src/cms/queries';
import { LEGACY_301 } from '@/src/data/legacy-redirects';
import { NOINDEX_URLS } from '@/src/middleware';

type Service = (typeof services)[number];

async function enrich(service: Service): Promise<Service> {
  try {
    const page = await getServicePage(service.slug);
    if (!page) return service;
    const next: Service = { ...service };
    if (page.title?.trim()) next.title = page.title.trim();
    if (page.summary?.trim()) next.summary = page.summary.trim();
    return next;
  } catch {
    return service;
  }
}

export async function getServicesEnriched(): Promise<Service[]> {
  try {
    const slugs = services.map((s) => s.slug);
    const pages = await getServicePages(slugs);

    if (pages.length === 0) return services;

    const cmsServices: Service[] = [];
    for (const baseService of services) {
      const page = pages.find(p => p.slug === baseService.slug);
      
      const next = { ...baseService };
      if (page?.title?.trim()) next.title = page.title.trim();
      if (page?.seoTitle?.trim()) next.seoTitle = page.seoTitle.trim();
      if (page?.seoDescription?.trim()) next.seoDescription = page.seoDescription.trim();
      if (page?.summary?.trim()) next.summary = page.summary.trim();
      
      cmsServices.push(next);
    }
    return cmsServices;
  } catch {
    return services;
  }
}

export async function getServiceEnriched(
  slug: string,
): Promise<Service | null> {
  let baseService = getServiceBySlug(slug);
  
  try {
    const page = await getServicePage(slug);
    
    // If it's a known service
    if (baseService) {
      const next = { ...baseService };
      if (page?.title?.trim()) next.title = page.title.trim();
      if (page?.seoTitle?.trim()) next.seoTitle = page.seoTitle.trim();
      if (page?.seoDescription?.trim()) next.seoDescription = page.seoDescription.trim();
      if (page?.summary?.trim()) next.summary = page.summary.trim();
      return next;
    }

    // If it's NOT a known service, but exists in WP, generate a dynamic service
    if (page) {
      const next: Service = {
        id: `SVC_${slug.substring(0, 5).toUpperCase()}`,
        slug: slug,
        title: page.title?.trim() || slug.replace(/-/g, ' '),
        ...(page.seoTitle?.trim() ? { seoTitle: page.seoTitle.trim() } : {}),
        ...(page.seoDescription?.trim() ? { seoDescription: page.seoDescription.trim() } : {}),
        tagline: 'Professional Service',
        category: 'SERVICE',
        description: page.summary?.trim() || '',
        summary: page.summary?.trim() || '',
        details: [],
        features: ['Comprehensive Consultation', 'Expert Execution', 'Dedicated Support'],
        icon: 'Layers',
        startingPrice: 'Custom',
        turnaround: 'TBD',
        stats: [],
        process: [],
        ctaLabel: 'EXPLORE',
        wpContent: page.rawContent || '',
      };
      return next;
    }

    return null;
  } catch (err) {
    // A known static service has good hardcoded fallback content — safe to
    // degrade to it on a CMS error. An unknown slug has no fallback, so a
    // CMS error here must NOT be swallowed into "not a service" — that's
    // indistinguishable from a real not-found and would let the [slug]
    // route wrongly cache a 404 for a page that may genuinely exist.
    if (baseService) return baseService;
    throw err;
  }
}

export async function getFeaturedServicesEnriched(
  excludeSlug: string,
): Promise<Service[]> {
  const featured = getFeaturedServices(excludeSlug);
  try {
    const slugs = featured.map((s) => s.slug);
    const pages = await getServicePages(slugs);

    if (pages.length === 0) return featured;

    const cmsServices: Service[] = [];
    for (const baseService of featured) {
      const page = pages.find(p => p.slug === baseService.slug);
      
      const next = { ...baseService };
      if (page?.title?.trim()) next.title = page.title.trim();
      if (page?.seoTitle?.trim()) next.seoTitle = page.seoTitle.trim();
      if (page?.seoDescription?.trim()) next.seoDescription = page.seoDescription.trim();
      if (page?.summary?.trim()) next.summary = page.summary.trim();
      
      cmsServices.push(next);
    }
    return cmsServices;
  } catch {
    return featured;
  }
}

/** Extract simple keywords from a string */
function extractKeywords(text: string): Set<string> {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/);
  const stopWords = new Set(['the', 'and', 'or', 'a', 'an', 'in', 'on', 'with', 'for', 'to', 'of', 'is', 'services', 'service']);
  return new Set(words.filter(w => w.length > 2 && !stopWords.has(w)));
}

// Slugs of our hardcoded primary services — exclude them from sub-service lists
const PRIMARY_SERVICE_SLUGS = new Set(services.map(s => s.slug));

// A redirect source is no longer a real page — it 301s elsewhere — so linking
// it from getSubServices would create an internal link into a 301. LEGACY_301
// keys are stored as "/bare-slug" (leading slash, no trailing slash); strip
// the leading slash to match a WP page's bare `slug` field.
const REDIRECT_SOURCE_SLUGS = new Set(
  Object.keys(LEGACY_301).map((path) => path.replace(/^\//, '')),
);

// Reused from middleware's NOINDEX_URLS (e.g. /email-marketing-expert — an
// internal hiring post WordPress exposes as a public page): if it's not fit
// to index, it's not fit to link to as a "related service" either.
const NOINDEX_SLUGS = new Set(
  Array.from(NOINDEX_URLS, (path) => path.replace(/^\/|\/$/g, '')),
);

// Conservative filter for obvious non-service WP pages the fuzzy keyword
// matcher would otherwise surface (e.g. job postings like
// /business-development-communication-specialist/). Matches "specialist",
// "expert", "executive", or "manager" as a hyphen-delimited word, or a
// "-jobs" segment — deliberately narrow so a borderline real service is
// never excluded.
const JOB_POSTING_SLUG_RE = /(?:^|-)specialist(?:-|$)|(?:^|-)expert(?:-|$)|(?:^|-)executive(?:-|$)|(?:^|-)manager(?:-|$)|(?:^|-)jobs(?:-|$)/;

// Non-service pages that the fuzzy keyword matcher could surface as
// sub-services (blog archives, CTA pages, etc.). These must never appear
// in the Sub Services sidebar.
const NON_SERVICE_PAGE_SLUG_RE = /(?:^|-)blog(?:-|$)|get-a-quote(?:-|$)/;

/**
 * Fetch WP pages and match them against the parent service slug words.
 *
 * Breaks the parent slug into individual words (e.g. "shop-drawing-services"
 * → ["shop", "drawing", "services"]) and scores candidate pages by how many
 * slug words they contain. Only the top 5 matches are returned.
 */
export async function getSubServices(parentService: Service): Promise<Service[]> {
  // Hardcoded sub-services declared as children of this parent (via `parent`).
  // Always shown first, even when the CMS returns nothing.
  const children = services.filter((s) => s.parent === parentService.slug);
  try {
    const pages = await getAllServicePages();
    if (pages.length === 0) return children;

    // Break parent slug into words (e.g. "shop-drawing-services" → ["shop", "drawing", "services"])
    const parentSlugWords = parentService.slug.split('-').filter(w => w.length > 0);

    const cap = 5;

    const scoredServices = pages
      // Exclude the parent service itself and the other primary services,
      // any page that's now a redirect source (would link into a 301), any
      // page already noindex'd, obvious job-posting slugs, and non-service pages.
      .filter(p =>
        !PRIMARY_SERVICE_SLUGS.has(p.slug) &&
        !REDIRECT_SOURCE_SLUGS.has(p.slug) &&
        !NOINDEX_SLUGS.has(p.slug) &&
        !JOB_POSTING_SLUG_RE.test(p.slug) &&
        !NON_SERVICE_PAGE_SLUG_RE.test(p.slug) &&
        p.slug !== parentService.slug
      )
      .map(page => {
        const pageSlugWords = page.slug.split('-');
        // Count how many parent slug words appear in the page slug
        let score = 0;
        for (const word of parentSlugWords) {
          if (pageSlugWords.some(pw => pw === word)) score += 1;
        }
        return { page, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, cap);

    const wpSubs = scoredServices.map(({ page }) => {
      const baseService = getServiceBySlug(page.slug);
      return baseService
        ? {
            ...baseService,
            title: page.title?.trim() || baseService.title,
            summary: page.summary?.trim() || baseService.summary,
          }
        : {
            id: `SVC_${page.slug.substring(0, 5).toUpperCase()}`,
            slug: page.slug,
            title: page.title?.trim() || page.slug.replace(/-/g, ' '),
            tagline: 'Sub-Service',
            category: 'SERVICE',
            description: page.summary?.trim() || '',
            summary: page.summary?.trim() || '',
            details: [],
            features: ['Comprehensive Consultation', 'Expert Execution', 'Dedicated Support'],
            icon: 'Layers',
            startingPrice: 'Custom',
            turnaround: 'TBD',
            stats: [],
            process: [],
            ctaLabel: 'EXPLORE',
          };
    });
    // Children first, then any CMS-derived sub-services (deduped by slug).
    const seen = new Set(children.map((c) => c.slug));
    return [...children, ...wpSubs.filter((s) => !seen.has(s.slug))];
  } catch {
    return children;
  }
}
