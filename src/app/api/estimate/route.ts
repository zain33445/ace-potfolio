import { NextResponse } from 'next/server';
import { mkdirSync, writeFileSync, existsSync, readFileSync } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'estimates.json');

function getEstimates(): EstimateRecord[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveEstimates(records: EstimateRecord[]) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(records, null, 2), 'utf-8');
}

interface EstimateRecord {
  id: number;
  date: string;
  email: string;
  projectType: string;
  areaSqFt: number;
  complexity: string;
  turnaroundSpeed: string;
  zipCode: string;
  total: number;
  fileName: string | null;
  fileData: string | null; // base64-encoded file content
  fileType: string | null;
}

export async function POST(request: Request) {
  let email = '';
  let projectType = '';
  let areaSqFt = 0;
  let complexity = '';
  let turnaroundSpeed = '';
  let zipCode = '';
  let total = 0;
  let file: File | null = null;

  try {
    const fd = await request.formData();
    email = ((fd.get('email') as string) ?? '').trim();
    projectType = (fd.get('projectType') as string) ?? '';
    areaSqFt = parseInt((fd.get('areaSqFt') as string) ?? '0', 10);
    complexity = (fd.get('complexity') as string) ?? '';
    turnaroundSpeed = (fd.get('turnaroundSpeed') as string) ?? '';
    zipCode = (fd.get('zipCode') as string) ?? '';
    total = parseFloat((fd.get('total') as string) ?? '0');
    file = fd.get('file') as File | null;
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 });
  }

  if (!projectType || !areaSqFt) {
    return NextResponse.json({ error: 'Project type and area required' }, { status: 400 });
  }

  if (!email) {
    return NextResponse.json({ error: 'Email address is required' }, { status: 400 });
  }

  // Encode file if present (max 10MB)
  let fileName: string | null = null;
  let fileData: string | null = null;
  let fileType: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    fileName = file.name;
    fileData = buffer.toString('base64');
    fileType = file.type;
  }

  // Build record
  const records = getEstimates();
  const record: EstimateRecord = {
    id: Date.now(),
    date: new Date().toISOString(),
    email,
    projectType,
    areaSqFt,
    complexity,
    turnaroundSpeed,
    zipCode,
    total,
    fileName,
    fileData,
    fileType,
  };
  records.push(record);
  saveEstimates(records);

  // Attempt to forward to WordPress (fire-and-forget)
  try {
    const WP_BASE = (process.env.WORDPRESS_API_URL ?? 'https://theaceservices.com/wp-json/wp/v2')
      .replace(/\/+$/, '')
      .replace('/wp/v2', '');
    const wpFd = new FormData();
    wpFd.append('email', email);
    wpFd.append('projectType', projectType);
    wpFd.append('areaSqFt', String(areaSqFt));
    wpFd.append('complexity', complexity);
    wpFd.append('turnaroundSpeed', turnaroundSpeed);
    wpFd.append('zipCode', zipCode);
    wpFd.append('total', String(total));
    if (file) wpFd.append('file', file);
    fetch(`${WP_BASE}/ace/v1/estimate`, { method: 'POST', body: wpFd }).catch(() => {});
  } catch {
    // Non-critical — local storage succeeds regardless
  }

  return NextResponse.json({
    success: true,
    id: record.id,
    message: 'Your estimate has been submitted. A senior estimator will review your details and contact you within 24 hours.',
  });
}

// GET returns all estimates (used by admin)
export async function GET() {
  const records = getEstimates();
  // Strip file data for listing (too heavy) — include only metadata
  const stripped = records.map(({ fileData, ...rest }) => ({
    ...rest,
    hasFile: !!fileData,
  }));
  return NextResponse.json(stripped);
}
