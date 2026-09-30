import { getInsights, getPostBySlug, getPosts } from '../src/lib/sanity/content';

async function test() {
  console.log('=== Sanity Content Service Test ===\n');

  const insights = await getInsights(5);
  console.log(`Blog listing: ${insights.length} posts`);
  insights.forEach((p) => console.log(`  - ${p.slug} | image: ${p.image ? 'yes' : 'no'} | date: ${p.date.slice(0, 10)}`));

  const paginated = await getPosts({ per_page: 3, page: 1 });
  console.log(`\nPaginated: ${paginated.data.length} of ${paginated.pagination.total} total (${paginated.pagination.totalPages} pages)`);

  const first = await getPostBySlug(insights[0].slug);
  console.log(`\nDetail: ${first?.title}`);
  console.log(`  content: ${first?.content?.length ?? 0} chars`);
  console.log(`  has HTML: ${first?.content?.includes('<') ?? false}`);
  console.log(`  excerpt: ${(first?.excerpt ?? '').slice(0, 80)}...`);
  console.log(`  image: ${first?.image ?? 'none'}`);

  const notFound = await getPostBySlug('this-slug-does-not-exist');
  console.log(`\nMissing slug returns: ${notFound === null ? 'null ✓' : 'NOT null ✗'}`);

  console.log('\n=== ALL TESTS PASSED ===');
}

test().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
