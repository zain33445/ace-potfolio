/**
 * High-level, app-facing content API over the WordPress REST client.
 *
 * This is the seam between the messy CMS and the React app. It:
 *  - filters out the SEO-spam posts that pollute this install,
 *  - sanitizes WP's HTML/entities into plain display text,
 *  - maps raw WP resources onto small, stable view models.
 *
 * CMS reality: theaceservices.com is a stock WordPress/Elementor site —
 * no ACF, no custom post types, no custom REST fields. Blog Posts and
 * Pages are the only clean content sources. Structured data (projects,
 * testimonials, FAQ, stats) is modeled as Pages with specific slug
 * patterns, falling back to hardcoded defaults when the CMS content
 * is not yet present. When ACF + CPTs are added, the adapter functions
 * can be updated to point at the new endpoints.
 */

import { wpGet, wpGetList, wpGetListSafe } from './client';
import { cleanExcerpt, cleanTitle, decodeEntities, htmlToArticle, htmlToText, sanitizeHtml } from './html';
import type { WPMedia, WPPage, WPPageQuery, WPPost, WPPostQuery, WPListResponse } from './types';

/* ------------------------------------------------------------------ */
/*  App-facing view models                                            */
/* ------------------------------------------------------------------ */

export interface Insight {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  url: string;
  image: string | null;
}

/** Full blog post with rendered content for the individual post page. */
export interface BlogPost extends Insight {
  content: string;
  modified: string;
}

export interface ServicePage {
  id: number;
  slug: string;
  title: string;
  summary: string;
  url: string;
  image: string | null;
  /** Raw Elementor HTML — NOT drop-in renderable without Elementor CSS. */
  contentHtml: string;
}

/** Generic page view model for any WordPress page. */
export interface Page {
  id: number;
  slug: string;
  title: string;
  summary: string;
  url: string;
  image: string | null;
  /** Raw Elementor HTML — NOT drop-in renderable without Elementor CSS. */
  contentHtml: string;
  date: string;
  modified: string;
}

/** Project portfolio item, modeled as a WordPress Page. */
export interface Project {
  id: number;
  slug: string;
  title: string;
  category: string;
  scope: string;
  turnaroundHours: number;
  totalAreaSqFt: number;
  estimatedCost: number;
  description: string;
  image: string | null;
  url: string;
}

/** Client testimonial, modeled as a WordPress Page. */
export interface Testimonial {
  id: number;
  slug: string;
  quote: string;
  company: string;
  role: string;
  verified: boolean;
  image: string | null;
}

/** FAQ question and answer pair, modeled as a WordPress Page. */
export interface FAQItem {
  id: number;
  slug: string;
  question: string;
  answer: string;
  order: number;
}

/** Solution/service offering, modeled as a WordPress Page. */
export interface Solution {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  details: string[];
  image: string | null;
  order: number;
}

/** Stat/metric display item, modeled as a WordPress Page. */
export interface Stat {
  id: number;
  slug: string;
  num: string;
  label: string;
  sysId: string;
  description: string;
  order: number;
}

/** Sample/portfolio item parsed from the Elementor "samples" page. */
export interface SampleProject {
  id: number;
  title: string;
  category: string;
  imageUrl: string;
  pdfUrl: string;
}

/* ------------------------------------------------------------------ */
/*  CMS configuration — edit these as the site is cleaned up          */
/* ------------------------------------------------------------------ */

/**
 * Category IDs to PULL blog posts from — an allowlist, not a denylist.
 *
 * This install is heavily polluted with SEO/casino spam scattered across many
 * categories (13 "public", 54, 56, 2 "Blog", …), so excluding spam is endless
 * whack-a-mole. Every genuine construction article instead lives in the
 * default category `1`. Allowlisting is therefore the robust filter.
 *
 * After the WordPress content is cleaned up / properly categorized, add the
 * real category IDs here (e.g. a dedicated "Estimation" category).
 */
export const INSIGHT_CATEGORY_IDS = [1];

/**
 * Curated service/project Pages worth surfacing (by slug), in display order.
 * The rest of the site's pages are boilerplate (Sample Page, Terms, orphan
 * Elementor drafts) and are intentionally excluded.
 */
export const SERVICE_PAGE_SLUGS = [
  'commercial-construction',
  'residential-construction',
  'industrial-construction',
  'healthcare-buildings',
  'educational-buildings',
  'hotels-development',
  'office-development',
  'shopping-centre',
  'warehouses-development',
  'bridges-construction',
] as const;

/**
 * Slug prefixes/patterns used to identify domain-specific content in Pages.
 * When the CMS gets ACF + CPTs, these can be replaced with endpoint
 * overrides in the fetch functions.
 */
const PROJECT_SLUG_PREFIX = 'project-';
const TESTIMONIAL_SLUG_PREFIX = 'testimonial-';
const FAQ_SLUG_PREFIX = 'faq-';
const SOLUTION_SLUG_PREFIX = 'solution-';
const STAT_SLUG_PREFIX = 'stat-';

/* ------------------------------------------------------------------ */
/*  Internal helpers                                                  */
/* ------------------------------------------------------------------ */

function featuredImage(resource: WPPost | WPPage): string | null {
  const media = resource._embedded?.['wp:featuredmedia']?.[0] as WPMedia | undefined;
  return media?.source_url ?? null;
}

/**
 * Extract a plain-text field from WP page meta or content.
 * Pages modeled with Elementor store structured data in the rendered HTML.
 * This provides a best-effort extraction; when ACF is added, use
 * `meta.field_name` instead.
 */
function extractMetaField(
  page: WPPage,
  fieldName: string,
): string | undefined {
  // Try meta first (if ACF/custom fields are exposed via REST)
  if (page.meta && typeof page.meta[fieldName] === 'string') {
    return page.meta[fieldName] as string;
  }
  return undefined;
}

/**
 * Extract a numeric field from WP page meta, falling back to a default.
 */
function extractMetaNumber(
  page: WPPage,
  fieldName: string,
  fallback: number,
): number {
  const raw = extractMetaField(page, fieldName);
  if (raw === undefined) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/* ------------------------------------------------------------------ */
/*  Adapters                                                          */
/* ------------------------------------------------------------------ */

export function toInsight(post: WPPost): Insight {
  return {
    id: post.id,
    slug: post.slug,
    title: cleanTitle(post.title.rendered),
    excerpt: cleanExcerpt(post.excerpt.rendered),
    date: post.date,
    url: post.link,
    image: featuredImage(post),
  };
}

export function toServicePage(page: WPPage): ServicePage {
  return {
    id: page.id,
    slug: page.slug,
    title: cleanTitle(page.title.rendered),
    summary: cleanExcerpt(page.excerpt.rendered || htmlToText(page.content.rendered), 200),
    url: page.link,
    image: featuredImage(page),
    contentHtml: page.content.rendered,
  };
}

/** Generic adapter: WPPage → Page. */
export function toPage(page: WPPage): Page {
  return {
    id: page.id,
    slug: page.slug,
    title: cleanTitle(page.title.rendered),
    summary: cleanExcerpt(page.excerpt.rendered || htmlToText(page.content.rendered), 200),
    url: page.link,
    image: featuredImage(page),
    contentHtml: page.content.rendered,
    date: page.date,
    modified: page.modified,
  };
}

/**
 * Adapter: WPPage → Project.
 *
 * Expects project data to live in page meta fields (when ACF is added) or
 * in the Elementor-rendered HTML. Falls back to sensible defaults when the
 * content is not yet modeled in the CMS.
 */
export function toProject(page: WPPage): Project {
  return {
    id: page.id,
    slug: page.slug,
    title: cleanTitle(page.title.rendered),
    category: extractMetaField(page, 'project_category') ?? 'COMMERCIAL',
    scope: extractMetaField(page, 'project_scope') ?? cleanExcerpt(htmlToText(page.content.rendered), 80),
    turnaroundHours: extractMetaNumber(page, 'project_turnaround_hours', 48),
    totalAreaSqFt: extractMetaNumber(page, 'project_area_sqft', 0),
    estimatedCost: extractMetaNumber(page, 'project_estimated_cost', 0),
    description: extractMetaField(page, 'project_description') ?? cleanExcerpt(htmlToText(page.content.rendered), 300),
    image: featuredImage(page),
    url: page.link,
  };
}

/**
 * Adapter: WPPage → Testimonial.
 *
 * Expects testimonial data in page meta or Elementor HTML.
 */
export function toTestimonial(page: WPPage): Testimonial {
  return {
    id: page.id,
    slug: page.slug,
    quote: extractMetaField(page, 'testimonial_quote') ?? cleanExcerpt(htmlToText(page.content.rendered), 500),
    company: extractMetaField(page, 'testimonial_company') ?? cleanTitle(page.title.rendered),
    role: extractMetaField(page, 'testimonial_role') ?? '',
    verified: extractMetaField(page, 'testimonial_verified') === 'true',
    image: featuredImage(page),
  };
}

/**
 * Adapter: WPPage → FAQItem.
 *
 * Expects FAQ data in page meta or Elementor HTML.
 */
export function toFAQItem(page: WPPage): FAQItem {
  return {
    id: page.id,
    slug: page.slug,
    question: extractMetaField(page, 'faq_question') ?? cleanTitle(page.title.rendered),
    answer: extractMetaField(page, 'faq_answer') ?? cleanExcerpt(htmlToText(page.content.rendered), 1000),
    order: page.menu_order,
  };
}

/**
 * Adapter: WPPage → Solution.
 *
 * Expects solution data in page meta or Elementor HTML.
 */
export function toSolution(page: WPPage): Solution {
  const rawDetails = extractMetaField(page, 'solution_details');
  const details = rawDetails
    ? rawDetails.split('\n').filter(Boolean)
    : [cleanExcerpt(htmlToText(page.content.rendered), 200)];

  return {
    id: page.id,
    slug: page.slug,
    title: cleanTitle(page.title.rendered),
    category: extractMetaField(page, 'solution_category') ?? '',
    description: extractMetaField(page, 'solution_description') ?? cleanExcerpt(htmlToText(page.content.rendered), 300),
    details,
    image: featuredImage(page),
    order: page.menu_order,
  };
}

/**
 * Adapter: WPPage → Stat.
 *
 * Expects stat data in page meta or Elementor HTML.
 */
export function toStat(page: WPPage): Stat {
  return {
    id: page.id,
    slug: page.slug,
    num: extractMetaField(page, 'stat_num') ?? cleanTitle(page.title.rendered),
    label: extractMetaField(page, 'stat_label') ?? '',
    sysId: extractMetaField(page, 'stat_sysid') ?? '',
    description: extractMetaField(page, 'stat_description') ?? cleanExcerpt(htmlToText(page.content.rendered), 200),
    order: page.menu_order,
  };
}

/* ------------------------------------------------------------------ */
/*  Public API — Posts / Blog                                         */
/* ------------------------------------------------------------------ */

/**
 * Fetch blog posts with pagination support.
 *
 * @param options.per_page  Number of posts per page (default 10).
 * @param options.page      Page number (1-indexed, default 1).
 * @param options.categoryIds  Category IDs to filter by (defaults to INSIGHT_CATEGORY_IDS).
 * @param options.orderBy  Sort field (default 'date').
 * @param options.order    Sort direction (default 'desc').
 * @param options.search   Search query string.
 * @returns List of insights + pagination metadata.
 */
export async function getPosts(
  options: {
    per_page?: number;
    page?: number;
    categoryIds?: number[];
    orderBy?: WPPostQuery['orderby'];
    order?: WPPostQuery['order'];
    search?: string;
  } = {},
): Promise<WPListResponse<Insight>> {
  const {
    per_page = 10,
    page = 1,
    categoryIds = INSIGHT_CATEGORY_IDS,
    orderBy = 'date',
    order = 'desc',
    search,
  } = options;

  const result = await wpGetList<WPPost>('/posts', {
    per_page,
    page,
    categories: categoryIds,
    orderby: orderBy,
    order,
    search,
    _embed: true,
    _fields: [
      'id',
      'slug',
      'date',
      'link',
      'title',
      'excerpt',
      'categories',
      '_links.wp:featuredmedia',
      '_embedded',
    ],
  });

  return {
    data: result.data.map(toInsight),
    pagination: result.pagination,
  };
}

/**
 * Construction blog posts, spam-filtered and sanitized.
 * Convenience wrapper over `getPosts()` for the most common use case.
 */
export async function getInsights(limit = 6): Promise<Insight[]> {
  const result = await getPosts({ per_page: limit });
  return result.data;
}

/** Adapter: WPPost → BlogPost (includes full content). */
export function toBlogPost(post: WPPost): BlogPost {
  return {
    id: post.id,
    slug: post.slug,
    title: cleanTitle(post.title.rendered),
    excerpt: cleanExcerpt(post.excerpt.rendered),
    content: sanitizeHtml(post.content.rendered),
    date: post.date,
    modified: post.modified,
    url: post.link,
    image: featuredImage(post),
  };
}

/**
 * Fetch a single blog post by slug.
 *
 * Returns the full post including rendered content for the individual
 * post page. Returns `null` when the slug doesn't match any post.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const posts = await wpGet<WPPost[]>('/posts', {
      slug,
      _embed: true,
      per_page: 1,
      categories: INSIGHT_CATEGORY_IDS,
    });
    if (!posts.length) return null;
    return toBlogPost(posts[0]);
  } catch (err) {
    console.warn(`[getPostBySlug] Failed to fetch post "${slug}":`, (err as Error).message);
    return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Public API — Pages (generic)                                      */
/* ------------------------------------------------------------------ */

/**
 * Fetch WordPress pages with pagination support.
 *
 * @param options.per_page  Number of pages per page (default 20).
 * @param options.page      Page number (1-indexed, default 1).
 * @param options.slug      Filter by exact slug.
 * @param options.slugs     Filter by multiple slugs (slug__in).
 * @param options.orderBy   Sort field (default 'date').
 * @param options.order     Sort direction (default 'desc').
 * @param options.search    Search query string.
 * @returns List of pages + pagination metadata.
 */
export async function getPages(
  options: {
    per_page?: number;
    page?: number;
    slug?: string;
    slugs?: string[];
    orderBy?: WPPageQuery['orderby'];
    order?: WPPageQuery['order'];
    search?: string;
  } = {},
): Promise<WPListResponse<Page>> {
  const {
    per_page = 20,
    page = 1,
    slug,
    slugs,
    orderBy = 'date',
    order = 'desc',
    search,
  } = options;

  const result = await wpGetList<WPPage>('/pages', {
    per_page,
    page,
    slug,
    slug__in: slugs,
    orderby: orderBy,
    order,
    search,
    _embed: true,
  });

  return {
    data: result.data.map(toPage),
    pagination: result.pagination,
  };
}

/**
 * Fetch a single page by slug. Returns null if not found.
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  const pages = await wpGet<WPPage[]>('/pages', {
    slug,
    _embed: true,
    per_page: 1,
  });
  return pages[0] ? toPage(pages[0]) : null;
}

/* ------------------------------------------------------------------ */
/*  Public API — Service Pages (curated)                              */
/* ------------------------------------------------------------------ */

/** A single service/project Page by slug (or null if missing). */
export async function getServicePage(slug: string): Promise<ServicePage | null> {
  const pages = await wpGet<WPPage[]>('/pages', {
    slug,
    _embed: true,
    per_page: 1,
  });
  return pages[0] ? toServicePage(pages[0]) : null;
}

/** The curated set of service/project Pages, in `SERVICE_PAGE_SLUGS` order. */
export async function getServicePages(): Promise<ServicePage[]> {
  const results = await Promise.all(
    SERVICE_PAGE_SLUGS.map((slug) => getServicePage(slug).catch(() => null)),
  );
  return results.filter((p): p is ServicePage => p !== null);
}

/* ------------------------------------------------------------------ */
/*  Public API — Projects                                             */
/* ------------------------------------------------------------------ */

/**
 * Fetch project portfolio items from WordPress Pages.
 *
 * Projects are modeled as Pages with slug prefixes (e.g. "project-fellas-car-wash").
 * Falls back to an empty array when the CMS has no project pages yet.
 *
 * @param options.per_page  Number of projects per page (default 20).
 * @param options.page      Page number (1-indexed, default 1).
 * @param options.search    Search query string.
 */
export async function getProjects(
  options: {
    per_page?: number;
    page?: number;
    search?: string;
  } = {},
): Promise<WPListResponse<Project>> {
  const { per_page = 20, page = 1, search } = options;

  // Fetch all pages and filter by slug prefix. WP REST doesn't support
  // slug prefix matching natively, so we fetch broadly and filter in code.
  // When ACF + CPTs are added, this can switch to '/projects' endpoint.
  const result = await wpGetListSafe<WPPage>('/pages', {
    per_page: 100, // fetch a generous batch to filter from
    page,
    orderby: 'menu_order',
    order: 'asc',
    search,
    _embed: true,
  });

  const projects = result.data
    .filter((p) => p.slug.startsWith(PROJECT_SLUG_PREFIX))
    .map(toProject);

  return {
    data: projects,
    pagination: {
      ...result.pagination,
      total: projects.length,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Public API — Testimonials                                         */
/* ------------------------------------------------------------------ */

/**
 * Fetch testimonials from WordPress Pages.
 *
 * Testimonials are modeled as Pages with slug prefixes (e.g. "testimonial-saunders").
 * Falls back to an empty array when the CMS has no testimonial pages yet.
 *
 * @param options.per_page  Number of testimonials per page (default 20).
 * @param options.page      Page number (1-indexed, default 1).
 */
export async function getTestimonials(
  options: {
    per_page?: number;
    page?: number;
  } = {},
): Promise<WPListResponse<Testimonial>> {
  const { per_page = 20, page = 1 } = options;

  const result = await wpGetListSafe<WPPage>('/pages', {
    per_page: 100,
    page,
    orderby: 'menu_order',
    order: 'asc',
    _embed: true,
  });

  const testimonials = result.data
    .filter((p) => p.slug.startsWith(TESTIMONIAL_SLUG_PREFIX))
    .map(toTestimonial);

  return {
    data: testimonials,
    pagination: {
      ...result.pagination,
      total: testimonials.length,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Public API — FAQ                                                  */
/* ------------------------------------------------------------------ */

/**
 * Fetch FAQ items from WordPress Pages.
 *
 * FAQ items are modeled as Pages with slug prefixes (e.g. "faq-how-long").
 * Falls back to an empty array when the CMS has no FAQ pages yet.
 *
 * @param options.per_page  Number of FAQ items per page (default 50).
 * @param options.page      Page number (1-indexed, default 1).
 */
export async function getFAQItems(
  options: {
    per_page?: number;
    page?: number;
  } = {},
): Promise<FAQItem[]> {
  const { per_page = 50, page = 1 } = options;

  const result = await wpGetListSafe<WPPage>('/pages', {
    per_page,
    page,
    orderby: 'menu_order',
    order: 'asc',
    _embed: true,
  });

  return result.data
    .filter((p) => p.slug.startsWith(FAQ_SLUG_PREFIX))
    .map(toFAQItem)
    .sort((a, b) => a.order - b.order);
}

/* ------------------------------------------------------------------ */
/*  Public API — Solutions                                            */
/* ------------------------------------------------------------------ */

/**
 * Fetch solution/service offerings from WordPress Pages.
 *
 * Solutions are modeled as Pages with slug prefixes (e.g. "solution-estimation").
 * Falls back to an empty array when the CMS has no solution pages yet.
 *
 * @param options.per_page  Number of solutions per page (default 20).
 * @param options.page      Page number (1-indexed, default 1).
 */
export async function getSolutions(
  options: {
    per_page?: number;
    page?: number;
  } = {},
): Promise<Solution[]> {
  const { per_page = 20, page = 1 } = options;

  const result = await wpGetListSafe<WPPage>('/pages', {
    per_page,
    page,
    orderby: 'menu_order',
    order: 'asc',
    _embed: true,
  });

  return result.data
    .filter((p) => p.slug.startsWith(SOLUTION_SLUG_PREFIX))
    .map(toSolution)
    .sort((a, b) => a.order - b.order);
}

/* ------------------------------------------------------------------ */
/*  Public API — Stats                                                */
/* ------------------------------------------------------------------ */

/**
 * Fetch stats/metrics from WordPress Pages.
 *
 * Stats are modeled as Pages with slug prefixes (e.g. "stat-win-rate").
 * Falls back to an empty array when the CMS has no stat pages yet.
 *
 * @param options.per_page  Number of stats per page (default 20).
 * @param options.page      Page number (1-indexed, default 1).
 */
export async function getStats(
  options: {
    per_page?: number;
    page?: number;
  } = {},
): Promise<Stat[]> {
  const { per_page = 20, page = 1 } = options;

  const result = await wpGetListSafe<WPPage>('/pages', {
    per_page,
    page,
    orderby: 'menu_order',
    order: 'asc',
    _embed: true,
  });

  return result.data
    .filter((p) => p.slug.startsWith(STAT_SLUG_PREFIX))
    .map(toStat)
    .sort((a, b) => a.order - b.order);
}

/* ------------------------------------------------------------------ */
/*  Public API — Samples / Portfolio                                  */
/* ------------------------------------------------------------------ */

/** Tab index → category name mapping for the samples page. */
const SAMPLE_TAB_CATEGORIES: Record<number, string> = {
  1: 'GENERAL CONTRACTOR',
  2: 'SUB CONTRACTORS',
  3: '3D RENDERS',
  4: 'PERMIT SETS',
  5: 'SHOP DRAWINGS',
};

/**
 * Parse Elementor HTML from the "samples" page into structured project data.
 *
 * The samples page uses nested-tabs widgets with lakit-image-box widgets.
 * Each image box contains an image, a title, and a PDF link. We split the
 * HTML by tab content boundaries, then extract items from each tab.
 */
function parseSamplesHtml(html: string): SampleProject[] {
  const projects: SampleProject[] = [];
  let idCounter = 1;

  // Split HTML into tab content sections using data-tab-index boundaries.
  // Each tab content panel has: data-tab-index="N" ... class="...elementor-element-ELEMENTID..."
  const tabBoundaryRegex = /data-tab-index="(\d+)"[^>]*class="[^"]*elementor-element-([a-f0-9]+)/g;
  const tabBoundaries: { index: number; elementId: string; pos: number }[] = [];
  let match: RegExpExecArray | null;

  while ((match = tabBoundaryRegex.exec(html)) !== null) {
    tabBoundaries.push({
      index: parseInt(match[1]),
      elementId: match[2],
      pos: match.index,
    });
  }

  for (let i = 0; i < tabBoundaries.length; i++) {
    const tab = tabBoundaries[i];
    const nextPos = i < tabBoundaries.length - 1 ? tabBoundaries[i + 1].pos : html.length;
    const tabHtml = html.substring(tab.pos, nextPos);
    const category = SAMPLE_TAB_CATEGORIES[tab.index] ?? `TAB_${tab.index}`;

    // Extract image boxes: each has an img src, a title, and a PDF href.
    // Pattern: <img ... src="IMAGE_URL" ... /> inside lakit-imagebox__header
    // Then: <span class="lakit-imagebox__title_text">TITLE</span>
    // Then: <a href="PDF_URL" ...> inside the same image box wrapper

    // Split by image box widgets to process each one
    const imageBoxParts = tabHtml.split('lakit-imagebox text-center');

    for (let j = 1; j < imageBoxParts.length; j++) {
      const box = imageBoxParts[j];

      // Extract image URL from the first <img> tag
      const imgMatch = box.match(/src="(https?:\/\/[^"]+)"/);
      if (!imgMatch) continue;

      // Extract title from lakit-imagebox__title_text
      const titleMatch = box.match(/lakit-imagebox__title_text[^>]*>([^<]+)</);
      if (!titleMatch) continue;

      // Extract PDF URL from the first <a href="...pdf">
      const pdfMatch = box.match(/href="([^"]*\.pdf)"/i);
      if (!pdfMatch) continue;

      const imageUrl = imgMatch[1];
      const title = decodeEntities(titleMatch[1].trim());
      const pdfUrl = pdfMatch[1];

      projects.push({
        id: idCounter++,
        title,
        category,
        imageUrl,
        pdfUrl,
      });
    }
  }

  return projects;
}

/**
 * Fetch and parse the samples/portfolio page from WordPress.
 *
 * Returns structured project data extracted from the Elementor HTML.
 * Falls back to an empty array when the CMS page is unavailable.
 */
export async function getSamples(): Promise<SampleProject[]> {
  try {
    const pages = await wpGetList<WPPage>('/pages', {
      slug: 'samples',
      per_page: 1,
    });

    const page = pages.data[0];
    if (!page) return [];

    return parseSamplesHtml(page.content.rendered);
  } catch (err) {
    console.warn('[getSamples] Failed to fetch samples page:', (err as Error).message);
    return [];
  }
}
