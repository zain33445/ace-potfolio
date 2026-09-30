/**
 * Delete old webhook and recreate with full config.
 * Usage: npx tsx scripts/setup-webhook.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q';
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production';
const TOKEN = process.env.SANITY_API_TOKEN;

async function api(method: string, path: string, body?: unknown) {
  const url = `https://${PID}.api.sanity.io/v2024-01-01/hooks/projects/${PID}${path}`;
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const text = await res.text();
  let json: unknown;
  try { json = JSON.parse(text); } catch { json = text; }
  return { status: res.status, data: json };
}

async function main() {
  // 1. List existing
  console.log('--- Existing webhooks ---');
  const list = await api('GET', '');
  console.log(JSON.stringify(list.data, null, 2));

  // 2. Delete all existing
  const hooks = Array.isArray(list.data) ? list.data : [];
  for (const hook of hooks) {
    console.log(`\nDeleting: ${hook.id} (${hook.name})`);
    const del = await api('DELETE', `/${hook.id}`);
    console.log(`  Status: ${del.status}`);
  }

  // 3. Create the real webhook
  console.log('\n--- Creating production webhook ---');
  const real = await api('POST', '', {
    name: 'Next.js revalidation',
    url: 'https://theaceservices.com/api/revalidate/',
    dataset: DATASET,
  });
  console.log(`Status: ${real.status}`);
  console.log(JSON.stringify(real.data, null, 2));
  if (real.status === 201 || real.status === 200) {
    console.log(`\nWebhook ID: ${(real.data as any).id}`);
    console.log('Now configure triggers/secret in the dashboard.');
  }
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
