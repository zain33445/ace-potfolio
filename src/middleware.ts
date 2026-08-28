import { NextResponse, type NextRequest } from 'next/server';

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
 *    problem (see src/services/wordpress/content.ts). Rejecting anything
 *    that doesn't match at the edge, before Next.js routing runs, gives a
 *    true HTTP 404 for this entire bug class — including any similar junk
 *    slug WordPress produces in the future — without touching the
 *    loading.tsx/Suspense architecture that made an in-route fix unsafe.
 *
 *    This does NOT make well-formed-but-nonexistent slugs (e.g.
 *    /some-deleted-post) 404 — that residual case is still bounded by the
 *    same Suspense limitation and would need a real existence check to
 *    close, which is a separate, larger change.
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
  'projects',
  'about-us',
  'contact-us',
  'blog',
  'privacy-policy',
  'terms-and-conditions',
  'testimonials',
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

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
