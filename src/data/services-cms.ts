/**
 * CMS-backed enrichment layer for services.
 *
 * Primary source: Sanity `service` documents (migrated from services.ts).
 * Fallback: hardcoded `services.ts` array — used when Sanity is unreachable
 * so a CMS blip can't take down service pages.
 *
 * WordPress is no longer consulted for services (kept for blog migration
 * fallback only).
 */

import {
  services,
  getServiceBySlug,
  getFeaturedServices,
} from '@/src/data/services';
import { getAllServicesSanity, getServiceSanity } from '@/src/lib/sanity/services';
import { LEGACY_301 } from '@/src/data/legacy-redirects';
import { NOINDEX_URLS } from '@/src/middleware';

type Service = (typeof services)[number];

export async function getServicesEnriched(): Promise<Service[]> {
  try {
    return await getAllServicesSanity();
  } catch (e) {
    console.error('[services-cms] getServicesEnriched failed:', e);
    return services;
  }
}

export async function getServiceEnriched(
  slug: string,
): Promise<Service | null> {
  const baseService = getServiceBySlug(slug);

  try {
    const fromSanity = await getServiceSanity(slug);

    // Known service — return Sanity version or hardcoded fallback
    if (baseService) {
      return fromSanity ?? baseService;
    }

    // Unknown slug but exists in Sanity (CMS-only service)
    if (fromSanity) {
      return fromSanity;
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
  try {
    const all = await getAllServicesSanity();
    const featured = all
      .filter((s) => s.slug !== excludeSlug && !s.parent)
      .slice(0, 6);
    return featured.length > 0 ? featured : getFeaturedServices(excludeSlug);
  } catch {
    return getFeaturedServices(excludeSlug);
  }
}

// Slugs of our hardcoded primary services — exclude them from sub-service lists
const PRIMARY_SERVICE_SLUGS = new Set(services.map((s) => s.slug));

// A redirect source is no longer a real page — it 301s elsewhere — so linking
// it from getSubServices would create an internal link into a 301. LEGACY_301
// keys are stored as "/bare-slug" (leading slash, no trailing slash); strip
// the leading slash to match a page's bare `slug` field.
const REDIRECT_SOURCE_SLUGS = new Set(
  Object.keys(LEGACY_301).map((path) => path.replace(/^\//, '')),
);

// Reused from middleware's NOINDEX_URLS (e.g. /email-marketing-expert — an
// internal hiring post WordPress exposes as a public page): if it's not fit
// to index, it's not fit to link to as a "related service" either.
const NOINDEX_SLUGS = new Set(
  Array.from(NOINDEX_URLS, (path) => path.replace(/^\/|\/$/g, '')),
);

// Conservative filter for obvious non-service pages the fuzzy keyword
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
 * Get sub-services for a parent service.
 *
 * First: hardcoded children (via `parent` field) — always shown.
 * Then: fuzzy-match sibling services from Sanity that share slug words.
 */
export async function getSubServices(
  parentService: Service,
): Promise<Service[]> {
  // Hardcoded sub-services declared as children of this parent (via `parent`).
  const children = services.filter((s) => s.parent === parentService.slug);

  try {
    const all = await getAllServicesSanity();

    const parentSlugWords = parentService.slug
      .split('-')
      .filter((w) => w.length > 0);

    const cap = 5;

    const scored = all
      .filter(
        (s) =>
          !PRIMARY_SERVICE_SLUGS.has(s.slug) ||
          services.some((hs) => hs.parent === parentService.slug && hs.slug === s.slug),
      )
      .filter(
        (s) =>
          !REDIRECT_SOURCE_SLUGS.has(s.slug) &&
          !NOINDEX_SLUGS.has(s.slug) &&
          !JOB_POSTING_SLUG_RE.test(s.slug) &&
          !NON_SERVICE_PAGE_SLUG_RE.test(s.slug) &&
          s.slug !== parentService.slug &&
          !children.some((c) => c.slug === s.slug),
      )
      .map((svc) => {
        const svcSlugWords = svc.slug.split('-');
        let score = 0;
        for (const word of parentSlugWords) {
          if (svcSlugWords.some((w) => w === word)) score += 1;
        }
        return { svc, score };
      })
      .filter((p) => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, cap);

    const matched = scored.map(({ svc }) => svc);
    return [...children, ...matched];
  } catch {
    return children;
  }
}
