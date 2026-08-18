import { NextResponse } from 'next/server';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'theaceservices@3332';

export async function POST(request: Request) {
  const { password } = await request.json() as { password?: string };

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = Buffer.from(`admin:${Date.now()}`).toString('base64');
  const res = NextResponse.json({ success: true });
  const isSecure = process.env.NODE_ENV === 'production';
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: isSecure,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 2,
  });
  return res;
}
