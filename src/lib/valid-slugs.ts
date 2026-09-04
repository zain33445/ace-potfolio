/**
 * Runtime valid-slug set for the middleware's `/[slug]` soft-404 guard.
 *
 * Why this exists: `/[slug]/page.tsx` has a `loading.tsx` Suspense boundary
 * that commits HTTP 200 before `notFound()` can flip the status — so any
 * well-formed ASCII slug that doesn't resolve to a real service or WP post
 * silently soft-404s at 200 with a 659-word "Not Found" page. Google indexes
 * those. The middleware needs to know the set of valid slugs BEFORE the route
 * runs, so it can 404 the miss at the edge.
 *
 * The `/[slug]` route resolves against THREE sources: hardcoded services
 * (data/services.ts), WP posts (category 1, filtered), and WP pages (any
 * published page — the sub-services / marketing-CMS catch-all). Any of the
 * three counts as "valid" here; missing any source would 404 real pages.
 *
 * Design (Option A — module-scope cache with TTL):
 *  - Static service slugs are baked in (they change with a deploy anyway).
 *  - WP post + page slugs are fetched once per isolate, refreshed after
 *    TTL_MS. Publishing a new page in WordPress goes live within TTL_MS
 *    without a redeploy.
 *  - On WP outage or fetch failure: fail-OPEN (return `null`) so middleware
 *    lets the request through. Better a transient soft-404 than a whole-site
 *    404 during a CMS outage.
 *  - `CANONICAL_TO_WP` aliases (see slug-aliases.ts) also count as valid.
 */

import { CANONICAL_TO_WP } from '@/src/services/wordpress/slug-aliases';
import { SERVICE_SLUGS } from '@/src/data/service-slugs';

// Single source of truth for service slugs is data/service-slugs.ts (a
// plain string array, no imports — keeps this middleware bundle icon-free).
// data/services.ts asserts its `services` array stays in sync with it at
// import time, so the two can't silently drift.

// Fallback insurance: known-important WP pages we never want 404'd even
// if the WP fetch is failing and the cache is cold. Primary source is
// still the runtime /pages fetch below.
const EXTRA_KNOWN_SLUGS = [
  'warehouses-development',
  'blueprint-estimation',
  'quantity-surveyor-services',
] as const;

const STATIC_VALID = new Set<string>([
  ...SERVICE_SLUGS,
  ...EXTRA_KNOWN_SLUGS,
  ...Object.keys(CANONICAL_TO_WP),
]);

const FALLBACK_WP_BASE = 'https://cms.theaceservices.com/wp-json/wp/v2';
const TTL_MS = 10 * 60 * 1000; // 10 min
const FETCH_TIMEOUT_MS = 3000;

let cache: { slugs: Set<string>; expiresAt: number } | null = null;
let inFlight: Promise<Set<string> | null> | null = null;

function wpBase(): string {
  const raw =
    (typeof process !== 'undefined' && process.env?.WORDPRESS_API_URL) ||
    FALLBACK_WP_BASE;
  return raw.replace(/\/+$/, '');
}

async function fetchOne(path: string): Promise<string[] | null> {
  const url = `${wpBase()}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    const items = (await res.json()) as Array<{ slug?: string }>;
    return items.map((i) => i.slug ?? '').filter(Boolean);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchWpSlugs(): Promise<Set<string> | null> {
  // /[slug] resolves against both posts and pages (any published page —
  // sub-services + CMS-driven marketing pages). Both sources must be
  // represented or middleware will 404 real content.
  //
  // The category allowlist MUST match INSIGHT_CATEGORY_IDS in
  // services/wordpress/content.ts — 1 is WP's default "Uncategorized", 2 is
  // this install's real "Blog" category. Duplicated as a literal rather than
  // imported so middleware doesn't pull the whole content module into its
  // edge bundle. A mismatch here edge-404s pages the route would happily
  // serve; scripts/check-blog-category-coverage.mjs guards it.
  //
  // ponytail: per_page=100 with no pagination. 77 posts + 47 pages today;
  // add pagination if either source crosses 100.
  const [posts, pages] = await Promise.all([
    fetchOne('/posts?per_page=100&_fields=slug&categories=1,2'),
    fetchOne('/pages?per_page=100&_fields=slug'),
  ]);
  // If BOTH fetches failed, we have nothing → fail-open (null).
  // If at least one succeeded, use what we got (partial is still better
  // than fail-open, and the missing side falls through to the stale cache
  // higher up).
  if (posts === null && pages === null) return null;
  const merged = new Set<string>();
  for (const s of posts ?? []) merged.add(s);
  for (const s of pages ?? []) merged.add(s);
  return merged;
}

/**
 * Return the full valid-slug set (static + WP), or `null` if we can't build
 * one right now. Middleware treats `null` as fail-open: let the request
 * through rather than 404 real pages during a CMS blip.
 */
export async function getValidSlugs(): Promise<Set<string> | null> {
  const now = Date.now();
  if (cache && cache.expiresAt > now) return cache.slugs;

  if (!inFlight) {
    inFlight = (async () => {
      const wp = await fetchWpSlugs();
      if (!wp) {
        // Keep serving stale cache if we have it — better than nothing.
        return cache?.slugs ?? null;
      }
      const merged = new Set<string>(STATIC_VALID);
      for (const s of wp) merged.add(s);
      cache = { slugs: merged, expiresAt: Date.now() + TTL_MS };
      return merged;
    })().finally(() => {
      inFlight = null;
    });
  }
  return inFlight;
}

/** Test hook — reset cache. Not called in production code. */
export function __resetValidSlugsCache(): void {
  cache = null;
  inFlight = null;
}
