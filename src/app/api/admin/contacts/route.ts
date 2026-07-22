import { NextRequest, NextResponse } from 'next/server';

const WP_BASE = (process.env.WORDPRESS_API_URL ?? 'https://theaceservices.com/wp-json/wp/v2')
  .replace(/\/+$/, '')
  .replace('/wp/v2', '');

const TOKEN = process.env.WP_CONTACTS_TOKEN || 'theaceservices@3332';

function checkAuth(request: NextRequest): boolean {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    if (!decoded.startsWith('admin:')) return false;
    const timestamp = parseInt(decoded.split(':')[1], 10);
    if (Date.now() - timestamp > 2 * 60 * 60 * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const res = await fetch(`${WP_BASE}/ace/v1/contacts?token=${TOKEN}&_=${Date.now()}`, {
      signal: AbortSignal.timeout(10000),
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch' }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
