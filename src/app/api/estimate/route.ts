import { NextResponse } from "next/server";
import { saveEstimate } from "@/src/lib/estimates-kv";

export async function POST(request: Request) {
  let email = "";
  let projectType = "";
  let areaSqFt = 0;
  let complexity = "";
  let turnaroundSpeed = "";
  let zipCode = "";
  let total = 0;
  let file: File | null = null;

  try {
    const fd = await request.formData();
    email = ((fd.get("email") as string) ?? "").trim();
    projectType = (fd.get("projectType") as string) ?? "";
    areaSqFt = parseInt((fd.get("areaSqFt") as string) ?? "0", 10);
    complexity = (fd.get("complexity") as string) ?? "";
    turnaroundSpeed = (fd.get("turnaroundSpeed") as string) ?? "";
    zipCode = (fd.get("zipCode") as string) ?? "";
    total = parseFloat((fd.get("total") as string) ?? "0");
    file = fd.get("file") as File | null;
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  if (!projectType || !areaSqFt) {
    return NextResponse.json(
      { error: "Project type and area required" },
      { status: 400 }
    );
  }

  if (!email) {
    return NextResponse.json(
      { error: "Email address is required" },
      { status: 400 }
    );
  }

  let fileName: string | null = null;
  let fileData: string | null = null;
  let fileType: string | null = null;

  if (file && file.size > 0) {
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (max 10MB)" },
        { status: 400 }
      );
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    fileName = file.name;
    fileData = buffer.toString("base64");
    fileType = file.type;
  }

  const id = Date.now();
  await saveEstimate({
    id,
    date: new Date().toISOString(),
    email,
    projectType,
    areaSqFt,
    complexity,
    turnaroundSpeed,
    zipCode,
    total,
    fileName,
    fileType,
    fileData,
  });

  // Fire-and-forget: forward to WordPress
  try {
    const WP_BASE = (
      process.env.WORDPRESS_API_URL ??
      "https://cms.theaceservices.com/wp-json/wp/v2"
    )
      .replace(/\/+$/, "")
      .replace("/wp/v2", "");
    const wpFd = new FormData();
    wpFd.append("email", email);
    wpFd.append("projectType", projectType);
    wpFd.append("areaSqFt", String(areaSqFt));
    wpFd.append("complexity", complexity);
    wpFd.append("turnaroundSpeed", turnaroundSpeed);
    wpFd.append("zipCode", zipCode);
    wpFd.append("total", String(total));
    if (file) wpFd.append("file", file);
    fetch(`${WP_BASE}/ace/v1/estimate`, { method: "POST", body: wpFd }).catch(
      () => {}
    );
  } catch {
    // Non-critical — KV storage succeeds regardless
  }

  return NextResponse.json({
    success: true,
    id,
    message:
      "Your estimate has been submitted. A senior estimator will review your details and contact you within 24 hours.",
  });
}

export async function GET() {
  const { listEstimates } = await import("@/src/lib/estimates-kv");
  const records = await listEstimates();
  return NextResponse.json(records);
}
