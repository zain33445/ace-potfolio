import { NextResponse } from "next/server";
import { getEstimateFile } from "@/src/lib/estimates-kv";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (isNaN(numId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const file = await getEstimateFile(numId);
  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  const buffer = Buffer.from(file.fileData, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": file.fileType,
      "Content-Disposition": `inline; filename="${file.fileName}"`,
      "Content-Length": String(buffer.length),
      "Cache-Control": "private, max-age=3600",
    },
  });
}
