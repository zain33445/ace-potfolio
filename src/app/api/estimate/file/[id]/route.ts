import { NextResponse } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'estimates.json');

interface EstimateRecord {
  id: number;
  fileName: string | null;
  fileData: string | null;
  fileType: string | null;
}

function getEstimates(): EstimateRecord[] {
  if (!existsSync(DATA_FILE)) return [];
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
  }

  const records = getEstimates();
  const record = records.find((r) => r.id === numId);

  if (!record || !record.fileData || !record.fileName) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const buffer = Buffer.from(record.fileData, 'base64');
  const mimeType = record.fileType || 'application/octet-stream';

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${record.fileName}"`,
      'Content-Length': String(buffer.length),
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
