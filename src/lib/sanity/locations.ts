import { sanityClient } from './client';
import type { PortableTextBlock } from '@portabletext/react';
import { locationPath, LOCATION_SERVICE_SEGMENT } from '@/src/data/state-page-constants';

/**
 * locations.ts — read layer for /locations pages.
 *
 * Location pages are Sanity-only: there is no hardcoded copy of the state
 * pages, so a failure here returns empty rather than falling back. That is
 * deliberate — a CMS outage should leave the hub empty, not serve stale
 * invented locations. The pages are force-dynamic, so they re-read on every
 * request anyway.
 */

export interface LocationServiceRef {
  slug: string;
  title: string;
  description?: string;
}

export interface LocationCity {
  name: string;
  isHeadquarters?: boolean;
  intro?: PortableTextBlock[];
  bullets?: string[];
  closing?: string;
}

export interface StatePage {
  id: string;
  slug: string;
  serviceSlug: string;
  title: string;
  state: string;
  stateAbbreviation?: string;
  cardHeadline?: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  overview: PortableTextBlock[];
  whyOutsource: PortableTextBlock[];
  searchTerms: string[];
  servicesIntro?: string;
  services: LocationServiceRef[];
  primaryCity?: LocationCity;
  secondCity?: LocationCity;
  restOfState: Array<{ label: string; description?: string }>;
  whyChooseUsOverride?: string[];
  stateSpecific: Array<{ topic: string; detail: string }>;
  faqs: Array<{ question: string; answer: string }>;
  cta?: { heading?: string; body?: string };
  seoTitle?: string;
  seoDescription?: string;
}

/** Card shape for the /locations hub. */
export interface LocationSummary {
  id: string;
  slug: string;
  serviceSlug: string;
  title: string;
  state: string;
  stateAbbreviation?: string;
  cardHeadline: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  serviceCount: number;
  cityCount: number;
  excludeFromSitemap: boolean;
}

const THUMB = 'thumbnail.asset->url';
const THUMB_ALT = 'thumbnail.alt';

function mapSummary(raw: Record<string, any>): LocationSummary {
  return {
    id: raw._id,
    slug: raw.slug,
    serviceSlug: raw.serviceSlug,
    title: raw.title,
    state: raw.state,
    stateAbbreviation: raw.stateAbbreviation,
    cardHeadline: raw.cardHeadline || raw.title || '',
    thumbnailUrl: raw.thumbnailUrl ?? undefined,
    thumbnailAlt: raw.thumbnailAlt ?? undefined,
    serviceCount: raw.serviceCount ?? 0,
    cityCount: raw.cityCount ?? 0,
    excludeFromSitemap: raw.excludeFromSitemap === true,
  };
}

/** All state pages, for the /locations hub. Alphabetical by state name. */
export async function getAllStatePages(): Promise<LocationSummary[]> {
  try {
    const rows = await sanityClient.fetch<Record<string, any>[]>(
      `*[_type == "statePage"] | order(state asc) {
         _id,
         "slug": slug,
         "serviceSlug": serviceSlug,
         title,
         state,
         stateAbbreviation,
         cardHeadline,
         "thumbnailUrl": ${THUMB},
         "thumbnailAlt": ${THUMB_ALT},
         "serviceCount": count(services),
         "cityCount": count(primaryCity) + count(secondCity),
         "excludeFromSitemap": coalesce(excludeFromSitemap, false)
       }`,
    );
    return rows.map(mapSummary);
  } catch (e) {
    console.error('[locations] getAllStatePages failed:', e);
    return [];
  }
}

/**
 * One state page by its {state} slug. `serviceSlug` is part of the URL but is
 * not matched here: the URL carries it for readability and future-proofing,
 * while the state slug alone identifies the document.
 */
export async function getStatePage(stateSlug: string): Promise<StatePage | null> {
  try {
    const raw = await sanityClient.fetch<Record<string, any> | null>(
      `*[_type == "statePage" && slug == $stateSlug][0] {
         _id,
         "slug": slug,
         "serviceSlug": serviceSlug,
         title,
         state,
         stateAbbreviation,
         cardHeadline,
         "thumbnailUrl": ${THUMB},
         "thumbnailAlt": ${THUMB_ALT},
         overview,
         whyOutsource,
         searchTerms,
         servicesIntro,
         "services": services[]{
           description,
           "slug": service->slug,
           "title": service->title
         },
         primaryCity,
         secondCity,
         restOfState,
         whyChooseUsOverride,
         stateSpecific,
         faqs,
         cta,
         seoTitle,
         seoDescription
       }`,
      { stateSlug },
    );
    if (!raw) return null;

    return {
      id: raw._id,
      slug: raw.slug,
      serviceSlug: raw.serviceSlug,
      title: raw.title,
      state: raw.state,
      stateAbbreviation: raw.stateAbbreviation ?? undefined,
      cardHeadline: raw.cardHeadline ?? undefined,
      thumbnailUrl: raw.thumbnailUrl ?? undefined,
      thumbnailAlt: raw.thumbnailAlt ?? undefined,
      overview: raw.overview ?? [],
      whyOutsource: raw.whyOutsource ?? [],
      searchTerms: raw.searchTerms ?? [],
      servicesIntro: raw.servicesIntro ?? undefined,
      services: raw.services ?? [],
      primaryCity: raw.primaryCity ?? undefined,
      secondCity: raw.secondCity ?? undefined,
      restOfState: raw.restOfState ?? [],
      whyChooseUsOverride: raw.whyChooseUsOverride ?? undefined,
      stateSpecific: raw.stateSpecific ?? [],
      faqs: raw.faqs ?? [],
      cta: raw.cta ?? undefined,
      seoTitle: raw.seoTitle ?? undefined,
      seoDescription: raw.seoDescription ?? undefined,
    };
  } catch (e) {
    console.error('[locations] getStatePage failed:', e);
    return null;
  }
}

/** Slugs for generateStaticParams. */
export async function getStatePageSlugs(): Promise<string[]> {
  try {
    return await sanityClient.fetch<string[]>(
      `*[_type == "statePage" && defined(slug)].slug`,
    );
  } catch (e) {
    console.error('[locations] getStatePageSlugs failed:', e);
    return [];
  }
}

/**
 * Real paths for the location pages, optionally narrowed to one state slug.
 *
 * The webhook payload only carries the document slug, but the URL is
 * /locations/{serviceSlug}+{stateSlug}/ — so the service segment has to come
 * from the document. Guessing it produced revalidatePath('/locations/texas/'),
 * which matches no route and silently did nothing.
 */
export async function getStatePagePaths(stateSlug?: string): Promise<string[]> {
  try {
    const rows = await sanityClient.fetch<Array<{ slug: string; serviceSlug?: string }>>(
      stateSlug
        ? `*[_type == "statePage" && slug == $slug]{ "slug": slug, "serviceSlug": serviceSlug }`
        : `*[_type == "statePage"]{ "slug": slug, "serviceSlug": serviceSlug }`,
      stateSlug ? { slug: stateSlug } : {},
    );
    return rows.map((r) => locationPath(r.serviceSlug || LOCATION_SERVICE_SEGMENT, r.slug));
  } catch (e) {
    console.error('[locations] getStatePagePaths failed:', e);
    return [];
  }
}