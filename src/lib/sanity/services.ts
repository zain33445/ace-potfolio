/**
 * Sanity-backed service layer.
 *
 * Primary source: Sanity `service` documents.
 * Fallback: hardcoded `services.ts` array (never removed — used when
 * Sanity is unreachable so a CMS blip can't take down service pages).
 */

import { sanityClient } from './client';
import { services as hardcodedServices, type Service } from '@/src/data/services';

/* ------------------------------------------------------------------ */
/*  GROQ projection — mirrors the Service interface                    */
/* ------------------------------------------------------------------ */

const SERVICE_PROJECTION = `
  slug,
  title,
  tagline,
  category,
  description,
  summary,
  details,
  features,
  icon,
  startingPrice,
  turnaround,
  stats,
  process,
  ctaLabel,
  ctaHeading,
  ctaDescription,
  seoTitle,
  seoDescription,
  footnote,
  seoContent,
  parent,
  wpContent
`;

interface RawService {
  slug: string;
  title: string;
  tagline?: string;
  category?: string;
  description?: string;
  summary?: string;
  details?: string[];
  features?: string[];
  icon?: string;
  startingPrice?: string;
  turnaround?: string;
  stats?: { label: string; value: string }[];
  process?: { title: string; description: string }[];
  ctaLabel?: string;
  ctaHeading?: string;
  ctaDescription?: string;
  seoTitle?: string;
  seoDescription?: string;
  footnote?: string;
  seoContent?: Service['seoContent'];
  parent?: string;
  wpContent?: string;
}

/**
 * Convert a raw Sanity document to the Service interface.
 * The `id` field is looked up from the hardcoded array (the IDs are
 * semantically meaningful — `SVC_EST` drives icon selection and the
 * services homepage discipline filter). Falls back to a synthesized ID
 * for CMS-only services not in the hardcoded array.
 */
function toService(raw: RawService): Service {
  const hardcodedId = hardcodedServices.find((s) => s.slug === raw.slug)?.id;
  const id = hardcodedId ?? `SVC_${raw.slug.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5).toUpperCase()}`;
  return {
    id,
    slug: raw.slug,
    title: raw.title,
    tagline: raw.tagline ?? 'Professional Service',
    category: raw.category ?? 'SERVICE',
    description: raw.description ?? '',
    summary: raw.summary ?? '',
    details: raw.details ?? [],
    features: raw.features ?? [],
    icon: raw.icon ?? 'Layers',
    startingPrice: raw.startingPrice ?? 'Custom',
    turnaround: raw.turnaround ?? 'TBD',
    stats: raw.stats ?? [],
    process: raw.process ?? [],
    ctaLabel: raw.ctaLabel ?? 'EXPLORE',
    ...(raw.ctaHeading && { ctaHeading: raw.ctaHeading }),
    ...(raw.ctaDescription && { ctaDescription: raw.ctaDescription }),
    ...(raw.seoTitle && { seoTitle: raw.seoTitle }),
    ...(raw.seoDescription && { seoDescription: raw.seoDescription }),
    ...(raw.footnote && { footnote: raw.footnote }),
    ...(raw.seoContent && { seoContent: raw.seoContent }),
    ...(raw.parent && { parent: raw.parent }),
    ...(raw.wpContent && { wpContent: raw.wpContent }),
  };
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

/**
 * Fetch all services from Sanity.
 * Returns null on failure (caller falls back to hardcoded).
 */
async function fetchAllFromSanity(): Promise<Service[] | null> {
  try {
    const raws = await sanityClient.fetch<RawService[]>(
      `*[_type == "service"] | order(_createdAt asc) { ${SERVICE_PROJECTION} }`,
    );
    // Sanity doesn't preserve array order — sort by hardcoded order, with
    // CMS-only services (not in the hardcoded array → indexOf -1) after.
    const order = hardcodedServices.map((s) => s.slug);
    const rank = (slug: string) => {
      const i = order.indexOf(slug);
      return i === -1 ? order.length : i;
    };
    return raws
      .map(toService)
      .sort((a, b) => rank(a.slug) - rank(b.slug));
  } catch (e) {
    console.error('[services] fetchAllFromSanity failed:', e);
    return null;
  }
}

/**
 * Fetch a single service by slug from Sanity.
 * Returns null on failure or not-found (caller falls back to hardcoded).
 */
async function fetchOneFromSanity(slug: string): Promise<Service | null> {
  try {
    const raw = await sanityClient.fetch<RawService | null>(
      `*[_type == "service" && slug == $slug][0] { ${SERVICE_PROJECTION} }`,
      { slug },
    );
    return raw ? toService(raw) : null;
  } catch (e) {
    console.error('[services] fetchOneFromSanity failed:', e);
    return null;
  }
}

/**
 * Get all services — Sanity primary, hardcoded fallback.
 */
export async function getAllServicesSanity(): Promise<Service[]> {
  const fromSanity = await fetchAllFromSanity();
  return fromSanity ?? hardcodedServices;
}

/**
 * Get a single service by slug — Sanity primary, hardcoded fallback.
 * Returns undefined when neither source has the slug.
 */
export async function getServiceSanity(slug: string): Promise<Service | undefined> {
  const fromSanity = await fetchOneFromSanity(slug);
  if (fromSanity) return fromSanity;

  // Sanity didn't have it — check hardcoded
  return hardcodedServices.find((s) => s.slug === slug);
}

/**
 * Synchronous fallback — the hardcoded array.
 * Used by code that can't await (e.g. generateStaticParams).
 */
export function getHardcodedServices(): Service[] {
  return hardcodedServices;
}
