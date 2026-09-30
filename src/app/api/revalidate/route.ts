import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Sanity webhook handler — triggers on-demand ISR when content changes.
 *
 * Configure in Sanity Studio → Manage → API → Webhooks:
 *   URL:         https://theaceservices.com/api/revalidate/
 *   Trigger on:  create, update, delete
 *   Filter:      _type in ['post', 'category', 'servicePage']
 *   Projection:  {_type, "slug": coalesce(slug.current, '')}
 *   Secret:      <REVALIDATE_SECRET>
 */

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 });
  }

  let body: { _type?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { _type, slug } = body;

  try {
    // Revalidate by content type
    switch (_type) {
      case 'post':
        // Blog listing + the individual post + sitemap
        revalidatePath('/blog/');
        if (slug) revalidatePath(`/${slug}/`);
        revalidatePath('/sitemap.xml');
        break;

      case 'category':
        revalidatePath('/blog/');
        break;

      case 'servicePage':
        revalidatePath('/services/');
        if (slug) revalidatePath(`/${slug}/`);
        break;

      default:
        // Unknown type — revalidate everything as a safety net
        revalidatePath('/', 'layout');
    }

    return NextResponse.json({
      revalidated: true,
      type: _type,
      slug,
      timestamp: Date.now(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Revalidation failed', details: String(err) },
      { status: 500 },
    );
  }
}
