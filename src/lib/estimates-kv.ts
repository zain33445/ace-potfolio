import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface EstimateRecord {
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
  fileType: string | null;
  hasFile: boolean;
}

interface StoredEstimate extends Omit<EstimateRecord, "hasFile"> {
  fileData: string | null;
}

const INDEX_KEY = "estimates:index";

async function getKv() {
  const { env } = await getCloudflareContext();
  return (env as CloudflareEnv).ESTIMATES_KV;
}

async function getIndex(): Promise<number[]> {
  const kv = await getKv();
  const raw = await kv.get(INDEX_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function setIndex(ids: number[]) {
  const kv = await getKv();
  await kv.put(INDEX_KEY, JSON.stringify(ids));
}

export async function saveEstimate(record: StoredEstimate): Promise<void> {
  const kv = await getKv();
  const { fileData, ...meta } = record;
  await kv.put(`estimate:${record.id}`, JSON.stringify(meta));

  if (fileData) {
    await kv.put(`estimate:${record.id}:file`, fileData);
  }

  const index = await getIndex();
  index.push(record.id);
  await setIndex(index);
}

export async function listEstimates(): Promise<EstimateRecord[]> {
  const index = await getIndex();
  const kv = await getKv();

  const results: EstimateRecord[] = [];
  for (const id of index) {
    const raw = await kv.get(`estimate:${id}`);
    if (!raw) continue;
    const meta: Omit<StoredEstimate, "fileData"> & { fileData?: string | null } = JSON.parse(raw);
    results.push({
      ...meta,
      hasFile: !!(meta as StoredEstimate).fileData,
    });
  }

  return results.sort((a, b) => b.id - a.id);
}

export async function getEstimateFile(
  id: number
): Promise<{ fileData: string; fileName: string; fileType: string } | null> {
  const kv = await getKv();
  const raw = await kv.get(`estimate:${id}`);
  if (!raw) return null;

  const meta: StoredEstimate = JSON.parse(raw);
  if (!meta.fileData || !meta.fileName) return null;

  return {
    fileData: meta.fileData,
    fileName: meta.fileName,
    fileType: meta.fileType ?? "application/octet-stream",
  };
}
