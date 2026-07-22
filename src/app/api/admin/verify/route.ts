import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decoded = Buffer.from(token, 'base64').toString('ascii');
    if (!decoded.startsWith('admin:')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const timestamp = parseInt(decoded.split(':')[1], 10);
    if (Date.now() - timestamp > 2 * 60 * 60 * 1000) {
      return NextResponse.json({ error: 'Expired' }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
