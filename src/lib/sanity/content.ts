/**
 * Sanity-backed blog content service.
 *
 * Mirrors the exact API of src/services/wordpress/content.ts so the
 * frontend can swap imports without changing call sites or types.
 */

import { sanityClient } from './client';
import { sanitizeHtml } from '@/src/services/wordpress/html';

/* ------------------------------------------------------------------ */
/*  Types — identical to WordPress service                             */
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

export interface BlogPost extends Insight {
  content: string;
  modified: string;
}

export interface PaginatedInsights {
  data: Insight[];
  pagination: { total: number; totalPages: number };
}

/* ------------------------------------------------------------------ */
/*  GROQ projections                                                   */
/* ------------------------------------------------------------------ */

const INSIGHT_PROJECTION = `
  _id,
  "wpId": wpPostId,
  title,
  "slug": slug.current,
  excerpt,
  publishedAt,
  "imageUrl": coalesce(featuredImage.asset->url, featuredImage->url)
`;

/* ------------------------------------------------------------------ */
/*  Adapters                                                           */
/* ------------------------------------------------------------------ */

interface RawInsight {
  _id: string;
  wpId?: number;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  imageUrl?: string;
}

interface RawPost extends RawInsight {
  bodyHtml?: string;
  _updatedAt: string;
}

function toInsight(raw: RawInsight): Insight {
  const wpId = raw.wpId ?? (parseInt(raw._id.replace('wp-post-', ''), 10) || 0);
  return {
    id: wpId,
    slug: raw.slug,
    title: raw.title,
    excerpt: raw.excerpt ?? '',
    date: raw.publishedAt ?? '',
    url: `https://theaceservices.com/${raw.slug}/`,
    image: raw.imageUrl ?? null,
  };
}

function toBlogPost(raw: RawPost): BlogPost {
  return {
    ...toInsight(raw),
    content: raw.bodyHtml ? sanitizeHtml(raw.bodyHtml) : '',
    modified: raw._updatedAt,
  };
}

/* ------------------------------------------------------------------ */
/*  Public API — same signatures as WordPress service                  */
/* ------------------------------------------------------------------ */

export async function getPosts(
  options: {
    per_page?: number;
    page?: number;
    categoryIds?: number[];
    orderBy?: 'date' | 'title' | 'modified';
    order?: 'asc' | 'desc';
    search?: string;
  } = {},
): Promise<PaginatedInsights> {
  const { per_page = 10, page = 1, order = 'desc', search } = options;
  const start = (page - 1) * per_page;

  const filter = search
    ? `title match $search`
    : 'defined(publishedAt)';

  const [data, total] = await Promise.all([
    sanityClient.fetch<RawInsight[]>(
      `*[_type == "post" && ${filter}] | order(publishedAt ${order})[${start}...${start + per_page}] { ${INSIGHT_PROJECTION} }`,
      search ? { search: `*${search}*` } : {},
    ),
    sanityClient.fetch<number>(
      `count(*[_type == "post" && ${filter}])`,
      search ? { search: `*${search}*` } : {},
    ),
  ]);

  return {
    data: data.map(toInsight),
    pagination: {
      total,
      totalPages: Math.ceil(total / per_page),
    },
  };
}

export async function getInsights(limit = 6): Promise<Insight[]> {
  const result = await getPosts({ per_page: limit });
  return result.data;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const raw = await sanityClient.fetch<RawPost | null>(
    `*[_type == "post" && slug.current == $slug][0] {
      ${INSIGHT_PROJECTION},
      bodyHtml,
      _updatedAt
    }`,
    { slug },
  );

  if (!raw) return null;
  return toBlogPost(raw);
}

export async function getAllPostSlugs(): Promise<string[]> {
  return sanityClient.fetch<string[]>(
    `*[_type == "post"]{"slug": slug.current}.slug`,
  );
}

export async function getTotalPostCount(): Promise<number> {
  return sanityClient.fetch<number>(`count(*[_type == "post"])`);
}
