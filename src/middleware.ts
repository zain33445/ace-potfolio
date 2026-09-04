import { NextResponse, type NextRequest } from 'next/server';
import { CANONICAL_TO_WP } from './services/wordpress/slug-aliases';
import { getValidSlugs } from './lib/valid-slugs';

// Clean canonical slugs that the app serves aliased malformed-slug posts under.
// An emoji/percent-encoded URL is only redirected here when its stripped form
// is one of these (i.e. the target is known to resolve) — anything else stays a
// hard 404 so we never 301 into a soft-404.
const KNOWN_CANONICAL_SLUGS = new Set(Object.keys(CANONICAL_TO_WP));

/** Strip everything but [a-z0-9-] to recover a clean slug from a junk one. */
function toAsciiSlug(decoded: string): string {
  return decoded
    .replace(/[^a-z0-9-]/gi, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Middleware — request-level interception before any route handler.
 *
 * Three responsibilities:
 *
 * 1. HTTP 410 Gone for legacy spam/boilerplate URLs. 410 signals
 *    "permanently deleted" to search engines — Google deindexes faster than
 *    for a 404, and no link equity flows.
 *
 * 2. Reject malformed top-level slugs before they ever reach `/[slug]`.
 *
 *    `/[slug]/page.tsx` resolves against both services and WordPress blog
 *    posts, and its own SLUG_RE deliberately permits `\p{So}` (the Unicode
 *    "Symbol, other" category — emoji) because some categories of CMS
 *    content legitimately use it. But `/[slug]` also has a `loading.tsx`,
 *    which Next.js wraps around the route in a Suspense boundary — and once
 *    that boundary starts streaming, the HTTP status commits as 200 before
 *    `notFound()`'s digest can take effect (documented Next.js behavior,
 *    confirmed by testing: removing loading.tsx does not yield a clean 404,
 *    it breaks the route). So any slug that reaches `/[slug]` and fails to
 *    resolve — malformed or merely nonexistent — is served as a soft 404
 *    (real content, `noindex` meta tag, status 200).
 *
 *    Real slugs on this site (verified against all 47 WordPress pages and
 *    every sitemap entry) are plain ASCII lowercase-alphanumeric-hyphen.
 *    The only slugs that have ever failed that pattern are three
 *    percent-encoded emoji slugs WordPress produced from posts with emoji
 *    in the title — a known symptom of this WP install's spam/junk-content
 *    problem (see src/services/wordpress/content.ts). Those three posts are
 *    real and published, so the app serves them under clean canonical slugs
 *    (see slug-aliases.ts) and we 301 the junk URL there. Any OTHER slug that
 *    fails the pattern has no known-good target, so it gets a true edge 404 —
 *    resolving the whole bug class before Next.js routing runs, without
 *    touching the loading.tsx/Suspense architecture that made an in-route fix
 *    unsafe (and never 301-ing into a soft-404).
 *
 *    Well-formed-but-nonexistent slugs (e.g. /some-deleted-post, or any
 *    invented `/electrical-estimating` typo before that page exists) are
 *    closed by the second check in the same block: lib/valid-slugs.ts holds
 *    a static + WP-derived slug set (10-min TTL, fail-open on CMS outage);
 *    a well-formed slug not in that set gets an edge 404 before the Suspense
 *    boundary can commit 200.
 *
 * 3. `X-Robots-Tag: noindex` for pages that must stay reachable (a real
 *    audience still needs the URL) but must not be indexed — e.g. an
 *    internal job posting WordPress happens to expose as a public page.
 *    This only adds a response header; the page renders normally.
 */

const GONE_URLS = new Set<string>([
  '/harnessing-advanced-techniques-in-pharmaceutical-2',
  '/harnessing-advanced-techniques-in-pharmaceutical-2/',
  // WordPress default boilerplate page, never real content.
  '/sample-page',
  '/sample-page/',
]);

// Legacy URLs → 301 permanent redirect to the canonical consolidated target.
// Sources: the 15 cannibalizing blog posts identified in
// seo/orphan-and-consolidation-plan-2026-08-24.md (Ahrefs confirmed zero
// referring domains on any source, so no equity at risk), plus the slug
// collision reserving /outsource-construction-estimation for the canonical
// /outsourced-construction-estimating.
const LEGACY_301: Record<string, string> = {
  // Cluster A — Warehouse development → /warehouses-development
  '/end-to-end-warehouse-development-services-for-modern-businesses': '/warehouses-development/',
  '/warehouse-development-services-how-warehouses-are-planned-designed-and-built': '/warehouses-development/',
  '/why-your-business-needs-a-professional-warehouse-development-company': '/warehouses-development/',
  '/warehouse-development-services-in-usa-building-efficient-scalable-and-modern-storage-solutions': '/warehouses-development/',
  '/warehouse-development-services-in-usa-building-efficient-spaces-for-modern-businesses': '/warehouses-development/',
  '/warehouse-development-services-in-usa': '/warehouses-development/',
  // Cluster B — Blueprint estimation → /blueprint-estimation
  '/blueprint-estimation-cut-costs-before-you-break-ground': '/blueprint-estimation/',
  '/blueprint-estimation-services-explained-a-step-by-step-construction-guide': '/blueprint-estimation/',
  '/reliable-estimating-services-for-u-s-contractors-from-blueprint-to-completion': '/blueprint-estimation/',
  '/blueprint-estimation-services-usa-the-foundation-of-accurate-construction-planning': '/blueprint-estimation/',
  '/blueprint-estimation-services-in-usa-the-foundation-of-cost-effective-construction': '/blueprint-estimation/',
  '/best-blueprint-estimation-services-in-usa': '/blueprint-estimation/',
  // Cluster C — Quantity surveyor → /quantity-surveyor-services
  '/what-is-a-quantity-surveyor-service-a-complete-construction-guide': '/quantity-surveyor-services/',
  '/quantity-surveyor-services-ensuring-accuracy-and-efficiency-in-construction-projects': '/quantity-surveyor-services/',
  '/quantity-surveyor-services-in-usa-ensuring-precision-and-profitability-in-construction-projects': '/quantity-surveyor-services/',
  // Slug collision — reserve the loser for the canonical outsourced page.
  '/outsource-construction-estimation': '/outsourced-construction-estimating/',
  // Duplicate lead-capture page — /contact-us/ is the canonical form.
  '/quick-quote': '/contact-us/',
};

// Reachable, but must never rank or be indexed.
const NOINDEX_URLS = new Set<string>([
  // Internal hiring post that WordPress exposes as a public, indexable page.
  '/email-marketing-expert',
  '/email-marketing-expert/',
]);

// Top-level routes that are NOT handled by the /[slug] catch-all — anything
// not in this set and not already handled above falls through to /[slug].
const KNOWN_TOP_LEVEL_ROUTES = new Set<string>([
  '', // '/'
  'services',
  'calculator',
  'adu-construction-cost',
  'projects',
  'about-us',
  'contact-us',
  'blog',
  'privacy-policy',
  'terms-and-conditions',
  'admin',
  'admin-login',
  'robots.txt',
  'sitemap.xml',
  'llms.txt',
  'favicon.ico',
]);

// Real slugs on this site are plain ASCII lowercase-alphanumeric-hyphen.
// Anything else reaching /[slug] is malformed CMS output, not real content.
const VALID_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function notFoundResponse(): NextResponse {
  return new NextResponse(
    '<!doctype html><title>404 Not Found</title><h1>404 Not Found</h1><p>The page you are looking for does not exist.</p>',
    {
      status: 404,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    },
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /* Force one scheme. Plain HTTP serves a full 200 copy of the site with no
     edge redirect, so every URL exists twice and each http:// page emits an
     https:// canonical — crawlers therefore see the whole http:// set as
     non-indexable duplicates pointing somewhere else. The HSTS header is
     already sent, but browsers ignore HSTS delivered over HTTP, so it cannot
     close this on its own.

     Scoped to the production hostname AND an explicit 'http' value. Both
     guards matter: `next dev` also sends x-forwarded-proto: http, so a
     header-only check redirects localhost to https://localhost and breaks
     local development and any preview deployment. A missing header or any
     other host falls through, so this cannot loop.

     Cloudflare's "Always Use HTTPS" (SSL/TLS → Edge Certificates) does the
     same thing one hop earlier and also covers static assets — enable it too;
     this is the in-app backstop. */
  if (
    request.headers.get('x-forwarded-proto') === 'http' &&
    request.nextUrl.hostname === 'theaceservices.com'
  ) {
    const url = request.nextUrl.clone();
    url.protocol = 'https:';
    url.port = '';
    return NextResponse.redirect(url, 301);
  }

  const legacyTarget = LEGACY_301[pathname] ?? LEGACY_301[pathname.replace(/\/$/, '')];
  if (legacyTarget) {
    const url = request.nextUrl.clone();
    url.pathname = legacyTarget;
    return NextResponse.redirect(url, 301);
  }

  if (GONE_URLS.has(pathname)) {
    return new NextResponse(
      '<!doctype html><title>410 Gone</title><h1>410 Gone</h1><p>This page has been permanently removed.</p>',
      {
        status: 410,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'X-Robots-Tag': 'noindex, nofollow',
          'Cache-Control': 'public, max-age=3600, s-maxage=86400',
        },
      },
    );
  }

  // Only single-segment top-level paths route through /[slug] — anything
  // with a nested segment (/projects/x, /services/x, /api/x, /_next/x, a
  // static asset path) is out of scope here and already handled elsewhere.
  // A segment containing a "." is a static file served from /public
  // (images, fonts, etc.) — those are never routed through /[slug] and
  // must not be slug-validated.
  const segment = pathname.replace(/^\/|\/$/g, '');
  const isSingleSegment = segment.length > 0 && !segment.includes('/') && !segment.includes('.');

  if (isSingleSegment && !KNOWN_TOP_LEVEL_ROUTES.has(segment)) {
    const decoded = decodeURIComponent(segment);
    if (!VALID_SLUG_RE.test(decoded)) {
      // WordPress baked an emoji from the post title into the slug
      // (e.g. "🏗️-warehouse-development-…"). The post is real but only
      // reachable under a clean canonical slug the app now serves it at
      // (see slug-aliases.ts). If stripping the junk yields one of those
      // known-good slugs, 301 there so the indexed URL keeps its equity.
      const clean = toAsciiSlug(decoded);
      if (KNOWN_CANONICAL_SLUGS.has(clean)) {
        const url = request.nextUrl.clone();
        url.pathname = `/${clean}/`;
        return NextResponse.redirect(url, 301);
      }
      return notFoundResponse();
    }

    // Well-formed ASCII slug but not a known top-level route: check whether
    // any real service or WP post uses it. `/[slug]` will otherwise render
    // its 659-word soft-404 template at HTTP 200 because loading.tsx +
    // Suspense commits status before notFound() can flip it (see block
    // comment above). Fail-open on `null` so a CMS outage never 404s a
    // real page — a transient soft-404 is the acceptable degradation.
    const validSlugs = await getValidSlugs();
    if (validSlugs && !validSlugs.has(decoded)) {
      return notFoundResponse();
    }
  }

  if (NOINDEX_URLS.has(pathname)) {
    const response = NextResponse.next();
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/harnessing-advanced-techniques-in-pharmaceutical-2',
    '/harnessing-advanced-techniques-in-pharmaceutical-2/',
    '/sample-page',
    '/sample-page/',
    '/email-marketing-expert',
    '/email-marketing-expert/',
    /*
     * Run on everything except Next.js internals, API routes, and files
     * with an extension (images, fonts, etc.) — mirrors the standard
     * Next.js middleware matcher recommendation.
     */
    '/((?!_next/static|_next/image|api/).*)',
  ],
};
