/**
 * Low-level WordPress REST client.
 *
 * SSR/prerender-safe: uses the global `fetch` (Node 18+ and the browser), so
 * it runs identically inside Vike's build-time `+data` functions and, if ever
 * needed, on the client. No axios, no Express — those were dead scaffolding.
 *
 * Base URL comes from `WORDPRESS_API_URL` (see `.env`), pointing at the
 * `wp/v2` namespace, with a hard fallback so a missing env var never silently
 * breaks a build.
 */

import type { WPListQuery, WPListResponse, WPPaginationHeaders } from './types';

const FALLBACK_BASE = 'https://theaceservices.com/wp-json/wp/v2';

/** Resolve the `wp/v2` base URL, trimming any trailing slash. */
export function wpBaseUrl(): string {
  const raw =
    (typeof process !== 'undefined' && process.env?.WORDPRESS_API_URL) ||
    FALLBACK_BASE;
  return raw.replace(/\/+$/, '');
}

export class WordPressError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly url: string,
  ) {
    super(message);
    this.name = 'WordPressError';
  }
}

/** Serialize our typed query into a WP-compatible querystring. */
function buildQuery(query: WPListQuery = {}): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null) continue;
    if (key === '_embed') {
      if (value) params.set('_embed', '1');
    } else if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
    } else {
      params.set(key, String(value));
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Extract WP REST pagination headers from a Response.
 * WP sends `X-WP-Total` and `X-WP-TotalPages` on list endpoints.
 */
function extractPagination(res: Response): WPPaginationHeaders {
  const total = Number(res.headers.get('X-WP-Total') ?? '0');
  const totalPages = Number(res.headers.get('X-WP-TotalPages') ?? '0');
  return { total, totalPages };
}

/**
 * GET a `wp/v2` resource and parse JSON. `path` is relative to the base,
 * e.g. `'/posts'` or `'/pages/5095'`.
 *
 * Returns just the parsed body. Use `wpGetList` for list endpoints that
 * need pagination metadata.
 */
export async function wpGet<T>(path: string, query?: WPListQuery): Promise<T> {
  const url = `${wpBaseUrl()}${path}${buildQuery(query)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
  } catch (cause) {
    throw new WordPressError(
      `Network error fetching ${url}: ${(cause as Error).message}`,
      0,
      url,
    );
  }

  if (!res.ok) {
    throw new WordPressError(
      `WordPress responded ${res.status} ${res.statusText} for ${url}`,
      res.status,
      url,
    );
  }

  return (await res.json()) as T;
}

/**
 * GET a `wp/v2` list resource, returning both the parsed body and pagination
 * metadata from the response headers.
 *
 * Use this for paginated endpoints where you need to know total counts.
 */
export async function wpGetList<T>(
  path: string,
  query?: WPListQuery,
): Promise<WPListResponse<T>> {
  const url = `${wpBaseUrl()}${path}${buildQuery(query)}`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: 'application/json' },
    });
  } catch (cause) {
    throw new WordPressError(
      `Network error fetching ${url}: ${(cause as Error).message}`,
      0,
      url,
    );
  }

  if (!res.ok) {
    throw new WordPressError(
      `WordPress responded ${res.status} ${res.statusText} for ${url}`,
      res.status,
      url,
    );
  }

  const data = (await res.json()) as T[];
  const pagination = extractPagination(res);

  return { data, pagination };
}

/**
 * Safely fetch a list, returning an empty array on 404/network errors
 * instead of throwing. Useful for optional content (projects, testimonials)
 * that may not exist in the CMS yet.
 */
export async function wpGetListSafe<T>(
  path: string,
  query?: WPListQuery,
): Promise<WPListResponse<T>> {
  try {
    return await wpGetList<T>(path, query);
  } catch (err) {
    // WordPress returns 404 when a resource type doesn't exist or
    // the query returns zero results. Both are non-fatal for us.
    if (err instanceof WordPressError && (err.status === 404 || err.status === 0)) {
      return { data: [], pagination: { total: 0, totalPages: 0 } };
    }
    // For other errors, log and return empty rather than crashing the build.
    console.warn(`[wpGetListSafe] ${path} failed:`, (err as Error).message);
    return { data: [], pagination: { total: 0, totalPages: 0 } };
  }
}
