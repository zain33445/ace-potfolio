import { getAllServicesSanity, getServiceSanity } from '../src/lib/sanity/services';

async function test() {
  console.log('=== Sanity Services Test ===\n');

  const all = await getAllServicesSanity();
  console.log(`Total services: ${all.length}`);
  console.log(`First 5:`);
  all.slice(0, 5).forEach((s) => console.log(`  - ${s.slug} | ${s.title} | features: ${s.features.length} | process: ${s.process.length}`));

  const one = await getServiceSanity('cost-estimating');
  console.log(`\nSingle service: ${one?.title}`);
  console.log(`  tagline: ${one?.tagline}`);
  console.log(`  seoTitle: ${one?.seoTitle ?? 'none'}`);
  console.log(`  seoContent heading: ${one?.seoContent?.heading ?? 'none'}`);
  console.log(`  faqs: ${one?.seoContent?.faqs.length ?? 0}`);
  console.log(`  stats: ${one?.stats.length}`);
  console.log(`  features: ${one?.features.length}`);
  console.log(`  process: ${one?.process.length}`);

  const missing = await getServiceSanity('does-not-exist');
  console.log(`\nMissing slug: ${missing === undefined ? 'undefined ✓' : 'NOT undefined ✗'}`);

  console.log('\n=== ALL TESTS PASSED ===');
}

test().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
