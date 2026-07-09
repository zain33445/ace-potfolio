/**
 * Raw shapes returned by the WordPress REST API (`wp/v2`).
 *
 * These mirror what theaceservices.com actually serves — a stock WordPress
 * install (no ACF, no custom post types, no custom REST fields). Only the
 * standard `post` / `page` / `category` / `media` resources are available.
 *
 * CMS reality: structured data (project cost/area, testimonials, FAQ) has no
 * dedicated CPT yet. The adapter functions model these as Pages with specific
 * slug patterns and fall back gracefully when the content isn't present.
 */

/* ------------------------------------------------------------------ */
/*  Base WP REST shapes                                               */
/* ------------------------------------------------------------------ */

/** WordPress renders most text fields as `{ rendered: string }`. */
export interface WPRendered {
  rendered: string;
  protected?: boolean;
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  status: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  featured_media: number;
  categories: number[];
  tags: number[];
  /** Present only when the request is made with `_embed`. */
  _embedded?: WPEmbedded;
}

export interface WPPage {
  id: number;
  slug: string;
  date: string;
  modified: string;
  link: string;
  status: string;
  parent: number;
  menu_order: number;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  featured_media: number;
  /** Elementor pages may include ACF-like custom fields via meta. */
  meta?: Record<string, unknown>;
  _embedded?: WPEmbedded;
}

export interface WPCategory {
  id: number;
  count: number;
  name: string;
  slug: string;
}

export interface WPMediaSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: {
    width: number;
    height: number;
    sizes?: Record<string, WPMediaSize>;
  };
}

/** Populated by `?_embed`; arrays are indexed by relation. */
export interface WPEmbedded {
  'wp:featuredmedia'?: WPMedia[];
  'wp:term'?: WPCategory[][];
}

/* ------------------------------------------------------------------ */
/*  Pagination headers from WP REST API                               */
/* ------------------------------------------------------------------ */

export interface WPPaginationHeaders {
  total: number;
  totalPages: number;
}

export interface WPListResponse<T> {
  data: T[];
  pagination: WPPaginationHeaders;
}

/* ------------------------------------------------------------------ */
/*  Query params accepted by list endpoints                           */
/* ------------------------------------------------------------------ */

/** Query params accepted by list endpoints (subset we use). */
export interface WPListQuery {
  per_page?: number;
  page?: number;
  search?: string;
  slug?: string;
  slug__in?: string[];
  slug__not_in?: string[];
  categories?: number[];
  categories_exclude?: number[];
  orderby?: 'date' | 'title' | 'menu_order' | 'modified' | 'id';
  order?: 'asc' | 'desc';
  _embed?: boolean;
  _fields?: string[];
}

/** Extended query params for the posts endpoint. */
export interface WPPostQuery extends WPListQuery {
  /** Filter by one or more tag IDs. */
  tags?: number[];
  /** Filter by one or more tag IDs, excluding them. */
  tags_exclude?: number[];
  /** Filter by author IDs. */
  author?: number[];
  /** After a specific date (ISO 8601). */
  after?: string;
  /** Before a specific date (ISO 8601). */
  before?: string;
}

/** Extended query params for the pages endpoint. */
export interface WPPageQuery extends WPListQuery {
  /** Filter by parent page ID. */
  parent?: number[];
  /** Filter by parent page ID, excluding it. */
  parent_exclude?: number[];
}
