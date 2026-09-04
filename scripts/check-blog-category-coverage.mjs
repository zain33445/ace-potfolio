/**
 * Guard: the WordPress category allowlist must cover the real "Blog" category.
 *
 * Two places filter posts by category, and they are NOT a shared import
 * (middleware keeps its edge bundle small by duplicating the literal):
 *   - services/wordpress/content.ts  → INSIGHT_CATEGORY_IDS  (routing, blog
 *     listing, sitemap, generateStaticParams)
 *   - lib/valid-slugs.ts             → `categories=` in the WP fetch URL
 *     (middleware's edge soft-404 guard)
 *
 * When those drifted apart from the CMS reality — allowlisting only category 1
 * ("Uncategorized") while the real posts live in category 2 ("Blog") — all 28
 * category-2 posts silently 404'd at the edge, fell out of the sitemap, and
 * disappeared from the blog listing. Nothing failed loudly; it only showed up
 * as a slow bleed in Search Console.
 *
 * This asserts (a) the two allowlists agree and (b) known-good post slugs from
 * the CMS actually fall inside them.
 *
 * Run: node scripts/check-blog-category-coverage.mjs
 */

import { readFile } from 'node:fs/promises';

const WP_BASE =
  process.env.WORDPRESS_API_URL?.replace(/\/+$/, '') ??
  'https://cms.theaceservices.com/wp-json/wp/v2';

// Posts verified as genuine, previously ranking, and living in category 2.
// If the allowlist regresses, these are the first things to 404.
const CANARY_SLUGS = [
  'top-construction-estimation-services-in-california-building-precision-and-trust-statewide',
  'residential-commercial-and-industrial-construction-estimation-in-michigan',
  'blueprint-estimation-experts-serving-builders-across-georgia',
  'everything-you-need-to-know-about-blueprint-estimation-services-in-usa-process-benefits-and-cost-insights',
];

const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
}

/** Category ids from `export const INSIGHT_CATEGORY_IDS = [1, 2];` */
async function contentAllowlist() {
  const src = await readFile('src/services/wordpress/content.ts', 'utf8');
  const m = src.match(/INSIGHT_CATEGORY_IDS\s*=\s*\[([^\]]*)\]/);
  if (!m) throw new Error('INSIGHT_CATEGORY_IDS not found in content.ts');
  return parseIds(m[1]);
}

/** Category ids from the `categories=1,2` query param in the WP fetch URL. */
async function middlewareAllowlist() {
  const src = await readFile('src/lib/valid-slugs.ts', 'utf8');
  const m = src.match(/\/posts\?[^'"`]*categories=([\d,\s]+)/);
  if (!m) throw new Error('categories= param not found in valid-slugs.ts');
  return parseIds(m[1]);
}

function parseIds(raw) {
  return raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isInteger(n))
    .sort((a, b) => a - b);
}

async function main() {
  const content = await contentAllowlist();
  const middleware = await middlewareAllowlist();

  check(
    content.join(',') === middleware.join(','),
    `allowlists drifted: content.ts has [${content}], valid-slugs.ts has [${middleware}]`,
  );

  const allowed = new Set(content);

  for (const slug of CANARY_SLUGS) {
    const res = await fetch(
      `${WP_BASE}/posts?slug=${encodeURIComponent(slug)}&_fields=slug,categories&status=publish`,
    );
    if (!res.ok) {
      check(false, `CMS returned ${res.status} for ${slug}`);
      continue;
    }
    const [post] = await res.json();
    if (!post) {
      // Unpublished/renamed upstream is a content decision, not a code bug —
      // say so loudly but don't claim the allowlist is broken.
      check(false, `${slug} is no longer published in the CMS (update CANARY_SLUGS?)`);
      continue;
    }
    check(
      post.categories.some((id) => allowed.has(id)),
      `${slug} is in categories [${post.categories}] — none allowlisted in [${[...allowed]}]; it will 404`,
    );
  }

  if (failures.length) {
    console.error('FAIL — blog category coverage:');
    for (const f of failures) console.error(`  - ${f}`);
    process.exit(1);
  }
  console.log(
    `OK — allowlist [${content}] covers all ${CANARY_SLUGS.length} canary posts.`,
  );
}

main().catch((err) => {
  console.error(`FAIL — ${err.message}`);
  process.exit(1);
});
