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
      if (page?.summary?.trim()) next.summary = page.summary.trim();
      return next;
    }

    // If it's NOT a known service, but exists in WP, generate a dynamic service
    if (page) {
      const next: Service = {
        id: `SVC_${slug.substring(0, 5).toUpperCase()}`,
        slug: slug,
        title: page.title?.trim() || slug.replace(/-/g, ' '),
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
  } catch {
    return baseService || null;
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

/**
 * Fetch WP pages and rank them based on keyword overlap with the parent service.
 */
export async function getSubServices(parentService: Service): Promise<Service[]> {
  try {
    const pages = await getAllServicePages();
    if (pages.length === 0) return [];

    // Build parent keyword set from title, slug, summary AND each feature string
    const parentKeywords = new Set([
      ...extractKeywords(parentService.title),
      ...extractKeywords(parentService.slug),
      ...extractKeywords(parentService.summary),
      ...parentService.features.flatMap(f => Array.from(extractKeywords(f)))
    ]);

    const cap = Math.max(parentService.features.length, 6);

    const scoredServices = pages
      // Exclude the parent service itself and the other 3 primary services
      .filter(p => !PRIMARY_SERVICE_SLUGS.has(p.slug))
      .map(page => {
        let score = 0;
        const titleKeywords = extractKeywords(page.title ?? '');
        const slugKeywords  = extractKeywords(page.slug);
        const bodyKeywords  = extractKeywords(page.summary ?? '');

        // Slug matches score double (strongest signal)
        for (const kw of slugKeywords)  if (parentKeywords.has(kw)) score += 2;
        // Title matches score 1.5x
        for (const kw of titleKeywords) if (parentKeywords.has(kw)) score += 1;
        // Body matches score normal
        for (const kw of bodyKeywords)  if (parentKeywords.has(kw)) score += 0.5;

        return { page, score };
      })
      .filter(p => p.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, cap);

    return scoredServices.map(({ page }) => {
      // Check if it exists in hardcoded
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
  } catch {
    return [];
  }
}
