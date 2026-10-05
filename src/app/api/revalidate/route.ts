import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { isValidSignature } from '@sanity/webhook';
import { getStatePagePaths } from '@/src/lib/sanity/locations';

/**
 * Sanity webhook handler — triggers on-demand ISR when content changes.
 *
 * Configure in Sanity Studio → Manage → API → Webhooks:
 *   URL:         https://theaceservices.com/api/revalidate/
 *   Trigger on:  create, update, delete
 *   Filter:      _type in ['post', 'category', 'service']
 *   Projection:  {_type, "slug": coalesce(slug.current, slug, '')}
 *   Secret:      <REVALIDATE_SECRET>
 *
 * Sanity never transmits the secret — it HMAC-signs the raw body and sends
 * `sanity-webhook-signature: t=…,v1=…`. We verify that signature against
 * REVALIDATE_SECRET. The `x-revalidate-secret` header is kept as a manual
 * escape hatch for curl testing.
 */

export async function POST(request: NextRequest) {
  const secret = process.env.REVALIDATE_SECRET;
  const rawBody = await request.text();

  let authorized = false;
  const signature = request.headers.get('sanity-webhook-signature');
  if (signature && secret) {
    authorized = await isValidSignature(rawBody, signature, secret);
  }
  if (!authorized) {
    const headerSecret = request.headers.get('x-revalidate-secret');
    authorized = !!secret && headerSecret === secret;
  }
  if (!authorized) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let body: { _type?: string; slug?: string };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { _type, slug } = body;

  try {
    // Revalidate by content type
    switch (_type) {
      case 'post':
        // Blog listing + the individual post
        revalidatePath('/blog/');
        if (slug) revalidatePath(`/${slug}/`);
        break;

      case 'category':
        revalidatePath('/blog/');
        break;

      case 'service':
        revalidatePath('/services/');
        if (slug) revalidatePath(`/${slug}/`);
        break;

      case 'statePage': {
        revalidatePath('/locations/');
        // The URL is /locations/{serviceSlug}+{stateSlug}/ and the payload only
        // carries the document slug, so the service segment has to be resolved
        // from the document rather than assumed.
        const paths = await getStatePagePaths(slug ? String(slug) : undefined);
        for (const p of paths) revalidatePath(p);
        break;
      }

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
