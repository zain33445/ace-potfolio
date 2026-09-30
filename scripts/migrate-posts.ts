/**
 * WordPress → Sanity migration script (blog posts).
 *
 * Usage:
 *   npx tsx scripts/migrate-posts.ts                # dry run (no writes)
 *   npx tsx scripts/migrate-posts.ts --write         # actually write to Sanity
 *   npx tsx scripts/migrate-posts.ts --write --limit 5   # migrate only 5
 *
 * Reads from WordPress REST API, transforms, and writes to Sanity.
 * Does NOT modify WordPress or any frontend code.
 */

import { createClient } from '@sanity/client';
import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.local' });

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

const WP_API =
  process.env.WORDPRESS_API_URL ??
  'https://cms.theaceservices.com/wp-json/wp/v2';

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const args = process.argv.slice(2);
const WRITE = args.includes('--write');
const DRY_RUN = !WRITE;
const limitIdx = args.indexOf('--limit');
const LIMIT = limitIdx !== -1 ? Number(args[limitIdx + 1]) : Infinity;

/* ------------------------------------------------------------------ */
/*  Mirror of slug-aliases.ts (kept in sync manually)                  */
/* ------------------------------------------------------------------ */

const WP_TO_CANONICAL: Record<string, string> = {
  '%f0%9f%8f%97%ef%b8%8f-warehouse-development-in-usa-key-trends-strategies-and-future-opportunities':
    'warehouse-development-in-usa-key-trends-strategies-and-future-opportunities',
  '%f0%9f%8f%a8-hotel-development-services-in-usa-building-the-future-of-hospitality':
    'hotel-development-services-in-usa-building-the-future-of-hospitality',
  '%f0%9f%a7%ae-quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects':
    'quantity-surveyor-services-in-usa-ensuring-accuracy-and-efficiency-in-construction-projects',
};

function canonicalSlug(slug: string): string {
  return WP_TO_CANONICAL[slug] ?? slug;
}

/* ------------------------------------------------------------------ */
/*  Mirror of legacy-redirects slugs (to exclude from migration)       */
/* ------------------------------------------------------------------ */

// These slugs redirect elsewhere — don't migrate them.
const REDIRECTED_SLUGS = new Set([
  'end-to-end-warehouse-development-services-for-modern-businesses',
  'warehouse-development-services-how-warehouses-are-planned-designed-and-built',
  'why-your-business-needs-a-professional-warehouse-development-company',
  'warehouse-development-services-in-usa-building-efficient-scalable-and-modern-storage-solutions',
  // Add more from legacy-redirects.ts as needed
]);

/* ------------------------------------------------------------------ */
/*  WP fetch helpers                                                    */
/* ------------------------------------------------------------------ */

interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  status: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  categories: number[];
  _embedded?: {
    'wp:featuredmedia'?: Array<{ source_url: string; alt_text?: string }>;
    'wp:term'?: Array<Array<{ id: number; name: string; slug: string }>>;
  };
}

interface WPCategory {
  id: number;
  name: string;
  slug: string;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`WP responded ${res.status} for ${url}`);
  }
  return res.json() as Promise<T>;
}

async function fetchAllPosts(): Promise<WPPost[]> {
  const posts: WPPost[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${WP_API}/posts?per_page=${perPage}&page=${page}&_embed&categories=1,2&status=publish`;
    const batch = await fetchJson<WPPost[]>(url);
    if (!batch.length) break;
    posts.push(...batch);
    console.log(`  Fetched page ${page}: ${batch.length} posts (total: ${posts.length})`);
    if (batch.length < perPage) break;
    page++;
  }

  return posts;
}

async function fetchAllCategories(): Promise<WPCategory[]> {
  const categories: WPCategory[] = [];
  let page = 1;

  while (true) {
    const url = `${WP_API}/categories?per_page=100&page=${page}`;
    const batch = await fetchJson<WPCategory[]>(url);
    if (!batch.length) break;
    categories.push(...batch);
    if (batch.length < 100) break;
    page++;
  }

  return categories;
}

/* ------------------------------------------------------------------ */
/*  HTML stripping for excerpts                                        */
/* ------------------------------------------------------------------ */

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(s: string): string {
  const entities: Record<string, string> = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
    '&#039;': "'", '&#39;': "'", '&apos;': "'",
    '&nbsp;': ' ', '&#8217;': "'", '&#8216;': "'",
    '&#8220;': '"', '&#8221;': '"',
    '&#8211;': '–', '&#8212;': '—',
    '&#8230;': '…', '&hellip;': '…',
  };
  return s.replace(/&[#a-zA-Z0-9]+;/g, (m) => entities[m] ?? m);
}

/* ------------------------------------------------------------------ */
/*  Image download & upload to Sanity                                  */
/* ------------------------------------------------------------------ */

async function downloadImage(url: string): Promise<{ buffer: Buffer; filename: string }> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  const filename = url.split('/').pop()?.split('?')[0] ?? 'image.jpg';
  return { buffer, filename };
}

async function uploadToSanity(buffer: Buffer, filename: string): Promise<string> {
  const asset = await sanity.assets.upload('image', buffer, { filename });
  return asset._id; // returns e.g. "image-abc123-3000x2000-png"
}

/* ------------------------------------------------------------------ */
/*  Main migration                                                     */
/* ------------------------------------------------------------------ */

interface MigrationResult {
  total: number;
  migrated: number;
  skipped: number;
  failed: number;
  errors: string[];
}

async function migrate(): Promise<MigrationResult> {
  const result: MigrationResult = {
    total: 0, migrated: 0, skipped: 0, failed: 0, errors: [],
  };

  console.log('='.repeat(60));
  console.log('WordPress → Sanity Migration (Blog Posts)');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no writes)' : 'WRITE MODE'}`);
  console.log(`WP API: ${WP_API}`);
  console.log(`Sanity project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q'}, dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'}`);
  console.log('='.repeat(60));

  // 1. Fetch categories
  console.log('\n[1/5] Fetching WordPress categories...');
  const wpCategories = await fetchAllCategories();
  console.log(`  Found ${wpCategories.length} categories`);

  // 2. Fetch posts
  console.log('\n[2/5] Fetching WordPress posts (categories 1,2)...');
  const allPosts = await fetchAllPosts();
  console.log(`  Found ${allPosts.length} posts`);

  // Filter out redirected slugs
  const posts = allPosts.filter((p) => {
    const canonical = canonicalSlug(p.slug);
    if (REDIRECTED_SLUGS.has(canonical)) {
      console.log(`  Skipping redirected slug: ${canonical}`);
      result.skipped++;
      return false;
    }
    return true;
  });

  result.total = posts.length;
  const toMigrate = posts.slice(0, LIMIT);
  console.log(`  To migrate: ${toMigrate.length} (after filtering)`);

  if (toMigrate.length === 0) {
    console.log('\nNothing to migrate.');
    return result;
  }

  // 3. Create/lookup Sanity categories (only those used by posts)
  console.log('\n[3/5] Syncing categories...');
  const categoryMap = new Map<number, string>(); // WP cat ID → Sanity doc ID

  // Only categories referenced by the posts we're migrating
  const usedCategoryIds = new Set<number>();
  toMigrate.forEach((p) => p.categories?.forEach((id) => usedCategoryIds.add(id)));
  const catsToSync = wpCategories.filter((c) => usedCategoryIds.has(c.id));
  console.log(`  Categories used by posts: ${catsToSync.map((c) => `${c.id}=${c.name}`).join(', ')}`);

  if (!DRY_RUN) {
    for (const cat of catsToSync) {
      try {
        const existing = await sanity.fetch(
          `*[_type == "category" && wpCategoryId == $id][0]._id`,
          { id: cat.id },
        );

        if (existing) {
          categoryMap.set(cat.id, existing);
        } else {
          const doc = await sanity.create({
            _type: 'category',
            title: cat.name,
            slug: { current: cat.slug },
            wpCategoryId: cat.id,
          });
          categoryMap.set(cat.id, doc._id);
          console.log(`  + Category: ${cat.name} → ${doc._id}`);
        }
      } catch (err) {
        result.errors.push(`Category ${cat.name}: ${(err as Error).message}`);
      }
    }
  } else {
    // Dry run — just show what categories exist
    for (const cat of catsToSync) {
      console.log(`  Would ensure category: ${cat.name} (${cat.slug})`);
    }
  }

  // 4. Migrate posts
  console.log('\n[4/5] Migrating posts...');
  let downloadedImages = 0;
  let failedImages = 0;

  for (let i = 0; i < toMigrate.length; i++) {
    const post = toMigrate[i];
    const canonical = canonicalSlug(post.slug);
    const sanityId = `wp-post-${post.id}`;

    try {
      // Extract featured image
      let imageRef: { _type: 'reference'; _ref: string } | undefined;
      const media = post._embedded?.['wp:featuredmedia']?.[0];
      if (media?.source_url) {
        if (!DRY_RUN) {
          try {
            const { buffer, filename } = await downloadImage(media.source_url);
            const assetId = await uploadToSanity(buffer, filename);
            imageRef = { _type: 'reference', _ref: assetId };
            downloadedImages++;
          } catch (err) {
            failedImages++;
            result.errors.push(`Image ${media.source_url}: ${(err as Error).message}`);
            console.log(`    ⚠ Image failed: ${media.source_url}`);
          }
        }
      }

      // Determine category reference
      const wpCatId = post.categories?.[0];
      const categoryRef = wpCatId && categoryMap.has(wpCatId)
        ? { _type: 'reference' as const, _ref: categoryMap.get(wpCatId)! }
        : undefined;

      // Build excerpt (strip HTML from WP excerpt)
      const excerpt = stripHtml(post.excerpt?.rendered ?? '');

      // Build document
      const doc = {
        _type: 'post',
        _id: sanityId,
        title: decodeEntities(post.title.rendered),
        slug: { current: canonical },
        excerpt,
        bodyHtml: post.content.rendered, // raw HTML for frontend rendering
        publishedAt: post.date,
        wpPostId: post.id,
      } as Record<string, unknown> & { _id: string; _type: string };

      if (categoryRef) doc.category = categoryRef;
      if (imageRef) doc.featuredImage = imageRef;

      if (DRY_RUN) {
        console.log(`  [${i + 1}/${toMigrate.length}] ${canonical}`);
        if (media?.source_url) console.log(`      image: ${media.source_url}`);
        if (categoryRef) console.log(`      category: ${wpCatId}`);
      } else {
        await sanity.createOrReplace(doc);
        result.migrated++;
        console.log(`  [${i + 1}/${toMigrate.length}] ✓ ${canonical}`);
      }
    } catch (err) {
      result.failed++;
      const msg = `Post ${canonical}: ${(err as Error).message}`;
      result.errors.push(msg);
      console.log(`  [${i + 1}/${toMigrate.length}] ✗ ${msg}`);
    }
  }

  // 5. Verify
  console.log('\n[5/5] Verification...');
  if (!DRY_RUN) {
    const sanityCount = await sanity.fetch<number>(
      `count(*[_type == "post"])`,
    );
    const wpCount = toMigrate.length;
    console.log(`  WordPress posts: ${wpCount}`);
    console.log(`  Sanity posts:    ${sanityCount}`);
    console.log(`  Match: ${sanityCount >= wpCount ? '✓' : '✗ MISMATCH'}`);
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Run                                                                */
/* ------------------------------------------------------------------ */

migrate()
  .then((result) => {
    console.log('\n' + '='.repeat(60));
    console.log('Migration Summary');
    console.log('='.repeat(60));
    console.log(`  Mode:      ${DRY_RUN ? 'DRY RUN' : 'WRITE'}`);
    console.log(`  Total:     ${result.total}`);
    console.log(`  Migrated:  ${result.migrated}`);
    console.log(`  Skipped:   ${result.skipped}`);
    console.log(`  Failed:    ${result.failed}`);
    if (result.errors.length) {
      console.log(`\n  Errors (${result.errors.length}):`);
      result.errors.forEach((e) => console.log(`    - ${e}`));
    }
    console.log('='.repeat(60));

    process.exit(result.failed > 0 ? 1 : 0);
  })
  .catch((err) => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
