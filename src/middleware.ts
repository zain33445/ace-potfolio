import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware — request-level interception before any route handler.
 *
 * Currently returns HTTP 410 Gone for a legacy spam URL that attracted
 * pharmaceutical PBN backlinks. 410 signals "permanently deleted" to
 * search engines — Google deindexes faster than for a 404, and no link
 * equity flows.
 */

const GONE_URLS = new Set<string>([
  '/harnessing-advanced-techniques-in-pharmaceutical-2',
  '/harnessing-advanced-techniques-in-pharmaceutical-2/',
]);

export function middleware(request: NextRequest) {
  if (GONE_URLS.has(request.nextUrl.pathname)) {
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
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/harnessing-advanced-techniques-in-pharmaceutical-2',
    '/harnessing-advanced-techniques-in-pharmaceutical-2/',
  ],
};
