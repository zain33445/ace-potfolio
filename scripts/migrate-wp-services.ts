/**
 * WP-only service pages → Sanity migration.
 *
 * These are published WordPress service pages that are NOT in the hardcoded
 * services.ts (the "hardcopy"). Since the app stopped consulting WP for
 * services, they were soft-404ing on prod. This exports them to Sanity as
 * `service` documents with their full WP HTML in `wpContent`.
 *
 * Usage:
 *   npx tsx scripts/migrate-wp-services.ts              # dry run
 *   npx tsx scripts/migrate-wp-services.ts --write      # write to Sanity
 *
 * Idempotent — re-running is safe (`_id: service-{slug}`).
 */

import { createClient } from '@sanity/client';
import { config as dotenvConfig } from 'dotenv';
import { sanitizeHtml } from '../src/services/wordpress/html';

dotenvConfig({ path: '.env.local' });

const WRITE = process.argv.includes('--write');

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const WP = 'https://cms.theaceservices.com/wp-json/wp/v2';

/* The 10 approved pages (public-buildings excluded — empty WP content).
   Mirrors the sector/estimating conventions of the hardcoded services. */
const TARGETS: {
  slug: string;
  category: string;
  tagline: string;
  cta: string;
}[] = [
  { slug: 'residential-construction', category: 'RESIDENTIAL', tagline: 'Cost Estimating & Documentation', cta: 'EXPLORE RESIDENTIAL CONSTRUCTION' },
  { slug: 'residential-buildings', category: 'RESIDENTIAL', tagline: 'Cost Estimating & Documentation', cta: 'EXPLORE RESIDENTIAL BUILDINGS' },
  { slug: 'office-development', category: 'COMMERCIAL', tagline: 'Cost Estimating & Documentation', cta: 'EXPLORE OFFICE DEVELOPMENT' },
  { slug: 'shopping-centre', category: 'COMMERCIAL', tagline: 'Cost Estimating & Documentation', cta: 'EXPLORE SHOPPING CENTRE' },
  { slug: 'community-parks', category: 'CIVIC', tagline: 'Cost Estimating & Documentation', cta: 'EXPLORE COMMUNITY PARKS' },
  { slug: 'assembly-buildings', category: 'ASSEMBLY', tagline: 'Cost Estimating & Documentation', cta: 'EXPLORE ASSEMBLY BUILDINGS' },
  { slug: 'construction-estimation', category: 'ESTIMATING', tagline: 'Budgeting & Bidding', cta: 'EXPLORE CONSTRUCTION ESTIMATION' },
  { slug: 'commercial-estimation', category: 'ESTIMATING', tagline: 'Budgeting & Bidding', cta: 'EXPLORE COMMERCIAL ESTIMATION' },
  { slug: 'outsourcing-estimation', category: 'ESTIMATING', tagline: 'Budgeting & Bidding', cta: 'EXPLORE OUTSOURCING ESTIMATION' },
  { slug: 'freelance-estimation', category: 'ESTIMATING', tagline: 'Budgeting & Bidding', cta: 'EXPLORE FREELANCE ESTIMATION' },
];

interface WPPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content?: { rendered: string };
  excerpt?: { rendered: string };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;|&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** First ~220 chars of readable text, cut at a word boundary. */
function deriveSummary(text: string): string {
  // Elementor pages open with menu junk: "<slug> home / services / <slug>
  // Search Search <real content>". Real copy starts after "Search Search".
  const junkEnd = text.indexOf('Search Search');
  const clean = junkEnd !== -1 ? text.slice(junkEnd + 'Search Search'.length).trim() : text;
  const source = clean.length > 40 ? clean : text;
  if (source.length <= 220) return source;
  return source.slice(0, 220).replace(/\s+\S*$/, '') + '…';
}

/** WP sometimes stores titles in lowercase ("commercial estimation"). */
function titleCase(title: string): string {
  if (title !== title.toLowerCase()) return title;
  return title.replace(/\b[a-z]/g, (c) => c.toUpperCase());
}

async function fetchWpPage(slug: string): Promise<WPPage | null> {
  const res = await fetch(
    `${WP}/pages?slug=${encodeURIComponent(slug)}&_fields=id,slug,title,content,excerpt`,
  );
  if (!res.ok) return null;
  const pages = (await res.json()) as WPPage[];
  return pages[0] ?? null;
}

async function migrate() {
  console.log('='.repeat(60));
  console.log('WP-only services → Sanity Migration');
  console.log(`Mode: ${WRITE ? 'WRITE' : 'DRY RUN'}`);
  console.log(`Targets: ${TARGETS.length}`);
  console.log('='.repeat(60));

  let migrated = 0;
  let failed = 0;

  for (let i = 0; i < TARGETS.length; i++) {
    const t = TARGETS[i];
    try {
      const page = await fetchWpPage(t.slug);
      if (!page) throw new Error('WP page not found');

      const rawHtml = page.content?.rendered ?? '';
      if (!rawHtml) throw new Error('WP page has empty content');
      const html = sanitizeHtml(rawHtml);
      const text = stripHtml(page.content!.rendered);
      const excerpt = stripHtml(page.excerpt?.rendered ?? '');
      // WP auto-excerpts start at the content top, which on the Elementor
      // pages is menu junk ("… home / services / …") — only trust an
      // excerpt that reads like real copy.
      const excerptOk = excerpt.length > 40 && !/home\s*\/\s*services/i.test(excerpt);
      const summary = excerptOk ? excerpt : deriveSummary(text);

      const doc: Record<string, unknown> & { _id: string; _type: string } = {
        _type: 'service',
        _id: `service-${t.slug}`,
        slug: t.slug,
        title: titleCase(stripHtml(page.title.rendered)),
        tagline: t.tagline,
        category: t.category,
        summary,
        turnaround: '24-48 hours',
        startingPrice: 'Custom',
        icon: 'SVC_EST',
        ctaLabel: t.cta,
        wpContent: html,
      };

      if (WRITE) {
        await sanity.createOrReplace(doc);
        migrated++;
        console.log(`  [${i + 1}/${TARGETS.length}] ✓ ${t.slug} (${html.length} chars HTML, summary ${summary.length})`);
      } else {
        console.log(`  [${i + 1}/${TARGETS.length}] ${t.slug} — title="${doc.title}" summary="${String(summary).substring(0, 60)}…" html=${html.length}c`);
      }
    } catch (err) {
      failed++;
      console.log(`  [${i + 1}/${TARGETS.length}] ✗ ${t.slug}: ${(err as Error).message}`);
    }
  }

  if (WRITE) {
    const count = await sanity.fetch<number>('count(*[_type == "service"])');
    console.log(`\nSanity service count: ${count} (expected ${21 + TARGETS.length})`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Migrated: ${migrated}  Failed: ${failed}`);
  console.log('='.repeat(60));
  process.exit(failed > 0 ? 1 : 0);
}

migrate().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
