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

const FALLBACK_BASE = 'https://cms.theaceservices.com/wp-json/wp/v2';

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

/** Strip query parameters from a URL for safe logging (prevents credential leakage). */
function sanitizeUrlForLog(url: string): string {
  try {
    const u = new URL(url);
    u.search = '';
    return u.origin + u.pathname;
  } catch {
    return url.replace(/\?.*$/, '');
  }
}

/**
 * Fetch a WP URL, retrying transient failures (network errors and 5xx) with
 * backoff before giving up. The CMS is shared WordPress hosting that sporadically
 * throws 500s under the burst of concurrent requests a full prerender fires; a
 * single un-retried 500 would abort the entire build. 4xx (incl. 404) is NOT
 * retried — it's a definitive answer, and wpGetListSafe relies on 404 surfacing.
 * ponytail: fixed 3 attempts / linear backoff; fine for a build-time burst.
 */
async function fetchWithRetry(url: string, logSafeUrl: string): Promise<Response> {
  const delays = [500, 1200, 2500, 5000, 8000];
  let lastErr: WordPressError | null = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { Accept: 'application/json' },
        next: { revalidate: 3600 },
      });
      if (res.ok || res.status < 500) return res; // success or non-retryable (4xx)
      lastErr = new WordPressError(
        `WordPress responded ${res.status} ${res.statusText} for ${logSafeUrl}`,
        res.status,
        logSafeUrl,
      );
    } catch (cause) {
      lastErr = new WordPressError(
        `Network error fetching ${logSafeUrl}: ${(cause as Error).message}`,
        0,
        logSafeUrl,
      );
    }
    if (attempt < delays.length) {
      await new Promise((r) => setTimeout(r, delays[attempt]));
    }
  }
  throw lastErr!;
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
  const logSafeUrl = sanitizeUrlForLog(url);

  const res = await fetchWithRetry(url, logSafeUrl);

  if (!res.ok) {
    throw new WordPressError(
      `WordPress responded ${res.status} ${res.statusText} for ${logSafeUrl}`,
      res.status,
      logSafeUrl,
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
  const logSafeUrl = sanitizeUrlForLog(url);

  const res = await fetchWithRetry(url, logSafeUrl);

  if (!res.ok) {
    throw new WordPressError(
      `WordPress responded ${res.status} ${res.statusText} for ${logSafeUrl}`,
      res.status,
      logSafeUrl,
    );
  }

  const data = (await res.json()) as T[];
  const pagination = extractPagination(res);

  return { data, pagination };
}

/**
 * Safely fetch a list, returning an empty array only when WordPress
 * confirms there's genuinely nothing there (404). Network failures and
 * server errors (status 0 / 5xx) are rethrown — they are NOT "not found"
 * and must not be cached as such by an ISR route that calls notFound()
 * on an empty result. Swallowing them here previously caused transient
 * WordPress outages to get permanently cached as 404 pages.
 */
export async function wpGetListSafe<T>(
  path: string,
  query?: WPListQuery,
): Promise<WPListResponse<T>> {
  try {
    return await wpGetList<T>(path, query);
  } catch (err) {
    if (err instanceof WordPressError && err.status === 404) {
      return { data: [], pagination: { total: 0, totalPages: 0 } };
    }
    throw err;
  }
}
