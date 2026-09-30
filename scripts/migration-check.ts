/**
 * Full migration health check.
 * Usage: npx tsx scripts/migration-check.ts
 */

import { config } from 'dotenv';
config({ path: '.env.local' });

import { createClient } from '@sanity/client';
import { services } from '../src/data/services';

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const WP_API = 'https://cms.theaceservices.com/wp-json/wp/v2';

interface Check {
  name: string;
  pass: boolean;
  detail: string;
}

const checks: Check[] = [];

function check(name: string, pass: boolean, detail: string) {
  checks.push({ name, pass, detail });
}

async function main() {
  console.log('='.repeat(60));
  console.log('Migration Health Check');
  console.log('='.repeat(60));

  // ── 1. Sanity content counts ──
  const sanityPosts = await sanity.fetch<number>('count(*[_type == "post"])');
  const sanityCats = await sanity.fetch<number>('count(*[_type == "category"])');
  const sanityServices = await sanity.fetch<number>('count(*[_type == "service"])');
  const sanityAssets = await sanity.fetch<number>('count(*[_type == "sanity.imageAsset"])');

  // ── 2. WP counts ──
  let wpPosts = 0;
  try {
    const res = await fetch(`${WP_API}/posts?per_page=1&categories=1,2&status=publish`, {
      headers: { Accept: 'application/json' },
    });
    wpPosts = Number(res.headers.get('X-WP-Total') ?? '0');
  } catch { /* WP may be unreachable */ }

  check('Blog posts migrated', sanityPosts === 81, `Sanity: ${sanityPosts}, Expected: 81`);
  check('WP posts (reference)', wpPosts > 0, `WP has ${wpPosts} posts`);
  check('Categories migrated', sanityCats >= 2, `Sanity: ${sanityCats}, Expected: >= 2`);
  check('Services migrated', sanityServices === 31, `Sanity: ${sanityServices}, Expected: 31 (21 hardcopy + 10 WP-only)`);
  check('Images uploaded', sanityAssets >= 70, `Sanity assets: ${sanityAssets}`);

  // ── 2b. The 10 WP-only service pages (were soft-404ing on prod) ──
  const WP_ONLY = [
    'residential-construction', 'residential-buildings', 'office-development',
    'shopping-centre', 'community-parks', 'assembly-buildings',
    'construction-estimation', 'commercial-estimation',
    'outsourcing-estimation', 'freelance-estimation',
  ];
  const allSvcSlugs: string[] = await sanity.fetch('*[_type == "service"].slug');
  const missingWpOnly = WP_ONLY.filter((s) => !allSvcSlugs.includes(s));
  check('10 WP-only services exported', missingWpOnly.length === 0,
    missingWpOnly.length ? `Missing: ${missingWpOnly.join(', ')}` : 'All 10 present');

  const withContent = await sanity.fetch<number>(
    `count(*[_type == "service" && slug in $slugs && defined(wpContent) && length(wpContent) > 100])`,
    { slugs: WP_ONLY },
  );
  check('WP-only services have wpContent', withContent === 10, `${withContent}/10`);

  // ── 3. Service integrity ──
  const sanitySvcSlugs = await sanity.fetch<string[]>('*[_type == "service"].slug');
  const hardcodedSlugs = services.map((s) => s.slug);
  const missingSlugs = hardcodedSlugs.filter((s) => !sanitySvcSlugs.includes(s));
  check('All service slugs match', missingSlugs.length === 0,
    missingSlugs.length ? `Missing: ${missingSlugs.join(', ')}` : 'All 21 present');

  // ── 4. Discipline IDs (services store slug as a plain string) ──
  const DISCIPLINES = ['SVC_EST', 'SVC_ARC', 'SVC_ENG', 'SVC_PMG'];
  const sanitySlugs: string[] = await sanity.fetch('*[_type == "service"].slug');
  const disciplineSlugs = services
    .filter((s) => DISCIPLINES.includes(s.id))
    .map((s) => ({ id: s.id, slug: s.slug }));
  const matched = disciplineSlugs.filter((d) => sanitySlugs.includes(d.slug));
  check('4 discipline IDs resolvable', matched.length === 4,
    matched.length === 4
      ? `Matched: ${matched.map((m) => m.id).join(', ')}`
      : `Matched ${matched.length}/4 — missing: ${disciplineSlugs.filter((d) => !sanitySlugs.includes(d.slug)).map((d) => d.slug).join(', ')}`);

  // ── 5. Post content integrity ──
  const postsWithHtml = await sanity.fetch<number>('count(*[_type == "post" && defined(bodyHtml)])');
  const postsWithImages = await sanity.fetch<number>('count(*[_type == "post" && defined(featuredImage)])');
  const postsWithSlug = await sanity.fetch<number>('count(*[_type == "post" && defined(slug.current)])');
  const postsWithDate = await sanity.fetch<number>('count(*[_type == "post" && defined(publishedAt)])');
  check('Posts have HTML content', postsWithHtml === sanityPosts, `${postsWithHtml}/${sanityPosts}`);
  check('Posts have slugs', postsWithSlug === sanityPosts, `${postsWithSlug}/${sanityPosts}`);
  check('Posts have dates', postsWithDate === sanityPosts, `${postsWithDate}/${sanityPosts}`);
  check('Posts have images', postsWithImages >= 70, `${postsWithImages} posts with images`);

  // ── 6. Service content integrity ──
  const svcsWithProcess = await sanity.fetch<number>('count(*[_type == "service" && count(process) > 0])');
  const svcsWithSeo = await sanity.fetch<number>('count(*[_type == "service" && defined(seoContent)])');
  check('Services have process steps', svcsWithProcess >= 15, `${svcsWithProcess}/21`);
  check('Services have SEO content', svcsWithSeo >= 15, `${svcsWithSeo}/21`);

  // ── 7. Webhook ──
  try {
    const hooks = await fetch(
      `https://q2s1xe6q.api.sanity.io/v2024-01-01/hooks/projects/q2s1xe6q`,
      { headers: { Authorization: `Bearer ${process.env.SANITY_API_TOKEN}` } },
    ).then((r) => r.json());
    const hasHook = Array.isArray(hooks) && hooks.length > 0;
    check('Webhook exists', hasHook, hasHook ? `ID: ${hooks[0].id}` : 'No webhooks');
  } catch {
    check('Webhook exists', false, 'API unreachable');
  }

  // ── 8. Env vars ──
  check('NEXT_PUBLIC_SANITY_PROJECT_ID', !!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'missing');
  check('NEXT_PUBLIC_SANITY_DATASET', !!process.env.NEXT_PUBLIC_SANITY_DATASET, process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'missing');
  check('SANITY_API_TOKEN', !!process.env.SANITY_API_TOKEN, process.env.SANITY_API_TOKEN ? 'set' : 'missing');
  check('REVALIDATE_SECRET', !!process.env.REVALIDATE_SECRET, process.env.REVALIDATE_SECRET ? 'set' : 'missing');

  // ── 9. CSP headers ──
  try {
    const { readFileSync } = await import('fs');
    const cfg = readFileSync('next.config.js', 'utf8');
    const hasSanityImg = cfg.includes('cdn.sanity.io');
    const hasSanityConnect = cfg.includes('apicdn.sanity.io');
    check('CSP allows cdn.sanity.io images', hasSanityImg, hasSanityImg ? 'yes' : 'no');
    check('CSP allows Sanity API', hasSanityConnect, hasSanityConnect ? 'yes' : 'no');
  } catch {
    check('CSP config readable', false, 'Could not read next.config.js');
  }

  // ── 10. Images remote patterns ──
  try {
    const { readFileSync } = await import('fs');
    const cfg = readFileSync('next.config.js', 'utf8');
    const hasSanityPattern = cfg.includes("hostname: 'cdn.sanity.io'");
    check('Next.js image CDN allowed', hasSanityPattern, hasSanityPattern ? 'yes' : 'no');
  } catch {
    check('Next.js image config', false, 'Could not read');
  }

  // ── 11. End-to-end via actual frontend service layer ──
  try {
    const { getAllServicesSanity, getServiceSanity } = await import('../src/lib/sanity/services');
    const all = await getAllServicesSanity();
    check('E2E: getAllServicesSanity', all.length === 31, `${all.length}/31`);

    const est = await getServiceSanity('cost-estimating');
    check('E2E: getServiceSanity(SVC_EST)', est?.id === 'SVC_EST',
      est ? `id=${est.id}, title=${est.title}` : 'undefined');

    const arc = await getServiceSanity('architectural-services');
    check('E2E: getServiceSanity(SVC_ARC)', arc?.id === 'SVC_ARC',
      arc ? `id=${arc.id}` : 'undefined');

    const discIds = ['SVC_EST', 'SVC_ARC', 'SVC_ENG', 'SVC_PMG'];
    const discOk = await Promise.all(
      ['cost-estimating', 'architectural-services', 'structural-engineering', 'project-management']
        .map((s) => getServiceSanity(s)),
    );
    check('E2E: all 4 disciplines resolve', discOk.every((s) => s && discIds.includes(s.id)),
      discOk.map((s) => s?.id ?? 'undefined').join(', '));

    // CMS-only service resolves with synthesized ID + WP HTML body
    const wpSvc = await getServiceSanity('residential-construction');
    check('E2E: CMS-only service resolves', !!wpSvc && !!wpSvc.wpContent && wpSvc.id.startsWith('SVC_'),
      wpSvc ? `id=${wpSvc.id}, wpContent=${wpSvc.wpContent?.length}c` : 'undefined');
  } catch (e) {
    check('E2E service layer', false, (e as Error).message);
  }

  // ── 12. End-to-end via actual blog content layer ──
  try {
    const { getPosts, getPostBySlug } = await import('../src/lib/sanity/content');
    const all = await getPosts({ per_page: 200 });
    check('E2E: getPosts total', all.pagination.total === 81, `${all.pagination.total}/81`);

    const post = await getPostBySlug(all.data[0]?.slug ?? '');
    check('E2E: getPostBySlug', !!post && !!post.content,
      post ? `title=${post.title}, content=${post.content.length} chars` : 'null');

    const missing = await getPostBySlug('nonexistent-slug-xyz');
    check('E2E: missing slug returns null', missing === null, String(missing));
  } catch (e) {
    check('E2E blog layer', false, (e as Error).message);
  }

  // ── Print results ──
  console.log('');
  let passCount = 0;
  let failCount = 0;
  for (const c of checks) {
    const icon = c.pass ? '✅' : '❌';
    console.log(`${icon} ${c.name}: ${c.detail}`);
    if (c.pass) passCount++;
    else failCount++;
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Results: ${passCount} passed, ${failCount} failed, ${checks.length} total`);
  console.log('='.repeat(60));

  process.exit(failCount > 0 ? 1 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
