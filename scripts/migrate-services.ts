/**
 * services.ts → Sanity migration script.
 *
 * Usage:
 *   npx tsx scripts/migrate-services.ts              # dry run
 *   npx tsx scripts/migrate-services.ts --write      # write to Sanity
 *
 * Reads the hardcoded services array and writes each to Sanity as a
 * `service` document. Idempotent — re-running is safe.
 */

import { createClient } from '@sanity/client';
import { config as dotenvConfig } from 'dotenv';
import { services } from '../src/data/services';

dotenvConfig({ path: '.env.local' });

const WRITE = process.argv.includes('--write');
const DRY_RUN = !WRITE;

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'q2s1xe6q',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrate() {
  console.log('='.repeat(60));
  console.log('Services → Sanity Migration');
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'}`);
  console.log(`Services found: ${services.length}`);
  console.log('='.repeat(60));

  let migrated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < services.length; i++) {
    const svc = services[i];
    const docId = `service-${svc.slug}`;

    try {
      const doc = {
        _type: 'service',
        _id: docId,
        slug: svc.slug,
        title: svc.title,
        tagline: svc.tagline,
        category: svc.category,
        description: svc.description,
        summary: svc.summary,
        details: svc.details,
        features: svc.features,
        icon: svc.icon,
        startingPrice: svc.startingPrice,
        turnaround: svc.turnaround,
        stats: svc.stats,
        process: svc.process,
        ctaLabel: svc.ctaLabel,
      } as Record<string, unknown> & { _id: string; _type: string };

      // Optional fields
      if (svc.ctaHeading) doc.ctaHeading = svc.ctaHeading;
      if (svc.ctaDescription) doc.ctaDescription = svc.ctaDescription;
      if (svc.seoTitle) doc.seoTitle = svc.seoTitle;
      if (svc.seoDescription) doc.seoDescription = svc.seoDescription;
      if (svc.footnote) doc.footnote = svc.footnote;
      if (svc.parent) doc.parent = svc.parent;
      if (svc.wpContent) doc.wpContent = svc.wpContent;

      // SEO content (nested object)
      if (svc.seoContent) {
        doc.seoContent = {
          heading: svc.seoContent.heading,
          body: svc.seoContent.body,
          benefits: svc.seoContent.benefits,
          faqs: svc.seoContent.faqs,
          ...(svc.seoContent.highlightSection
            ? { highlightSection: svc.seoContent.highlightSection }
            : {}),
        };
      }

      if (DRY_RUN) {
        console.log(`  [${i + 1}/${services.length}] ${svc.slug}`);
      } else {
        await sanity.createOrReplace(doc);
        migrated++;
        console.log(`  [${i + 1}/${services.length}] ✓ ${svc.slug}`);
      }
    } catch (err) {
      failed++;
      const msg = `${svc.slug}: ${(err as Error).message}`;
      errors.push(msg);
      console.log(`  [${i + 1}/${services.length}] ✗ ${msg}`);
    }
  }

  // Verify
  if (!DRY_RUN) {
    const count = await sanity.fetch<number>(`count(*[_type == "service"])`);
    console.log(`\nSanity service count: ${count} (expected ${services.length})`);
  }

  console.log('\n' + '='.repeat(60));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'WRITE'}`);
  console.log(`Total: ${services.length}`);
  console.log(`Migrated: ${migrated}`);
  console.log(`Failed: ${failed}`);
  if (errors.length) {
    console.log('\nErrors:');
    errors.forEach((e) => console.log(`  - ${e}`));
  }
  console.log('='.repeat(60));

  process.exit(failed > 0 ? 1 : 0);
}

migrate().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});
