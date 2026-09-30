import { createClient } from '@sanity/client';
import { config } from 'dotenv';
config({ path: '.env.local' });

const c = createClient({
  projectId: 'q2s1xe6q',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function main() {
  const count = await c.fetch<number>('count(*[_type == "post"])');
  const catCount = await c.fetch<number>('count(*[_type == "category"])');
  const cats = await c.fetch('*[_type == "category"]{title, "slug": slug.current, wpCategoryId}');
  const sample = await c.fetch(
    `*[_type == "post"] | order(publishedAt desc)[0...5]{
      title,
      "slug": slug.current,
      publishedAt,
      "category": category->title,
      "hasImage": defined(featuredImage)
    }`
  );

  console.log('='.repeat(50));
  console.log('Sanity Content Summary');
  console.log('='.repeat(50));
  console.log(`Posts:     ${count}`);
  console.log(`Categories: ${catCount}`);
  console.log('\nCategories:');
  cats.forEach((cat: any) => console.log(`  - ${cat.title} (slug: ${cat.slug}, wpId: ${cat.wpCategoryId})`));
  console.log('\nLatest 5 posts:');
  sample.forEach((p: any, i: number) => {
    console.log(`  ${i + 1}. ${p.title}`);
    console.log(`     slug: ${p.slug}`);
    console.log(`     date: ${p.publishedAt?.slice(0, 10)}`);
    console.log(`     category: ${p.category ?? 'none'}`);
    console.log(`     image: ${p.hasImage ? 'yes' : 'no'}`);
    console.log(`     html: ${p.htmlLength} chars`);
  });
  console.log('='.repeat(50));
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
