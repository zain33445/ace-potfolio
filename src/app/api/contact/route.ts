import { NextResponse } from 'next/server';

const WP_BASE = (process.env.WORDPRESS_API_URL ?? 'https://theaceservices.com/wp-json/wp/v2')
  .replace(/\/+$/, '')
  .replace('/wp/v2', '');

export async function POST(request: Request) {
  let name: string;
  let email: string;
  let projectType = '';
  let scale = '';
  let file: File | null = null;

  try {
    const fd = await request.formData();
    name = (fd.get('name') as string) ?? '';
    email = (fd.get('email') as string) ?? '';
    projectType = (fd.get('projectType') as string) ?? '';
    scale = (fd.get('scale') as string) ?? '';
    file = fd.get('file') as File | null;
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email required' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    const wpFd = new FormData();
    wpFd.append('name', name);
    wpFd.append('email', email);
    wpFd.append('projectType', projectType);
    wpFd.append('scale', scale);
    if (file) wpFd.append('file', file);

    const res = await fetch(`${WP_BASE}/ace/v1/contact`, {
      method: 'POST',
      body: wpFd,
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[api/contact] WordPress error:', res.status, err);
      return NextResponse.json({ error: 'Failed to save' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id, message: data.message ?? 'We will contact you within 24 hours.' });
  } catch (err) {
    console.error('[api/contact] Network error:', (err as Error).message);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 502 });
  }
}
