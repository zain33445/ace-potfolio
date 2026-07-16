import type { Metadata } from 'next';
import Link from 'next/link';
import { getInsights } from '@/src/services/wordpress';
import { BlogCard3D } from '@/src/components/BlogCard3D';
import PaginationGrid from '../../components/PaginationGrid';

/* ── SEO metadata ─────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Insights & Blog',
  description:
    'Expert insights on construction estimation, quantity surveying, cost analysis, and pre-construction best practices from ACE SERVICES.',
  openGraph: {
    title: 'Insights & Blog | ACE SERVICES',
    description:
      'Expert insights on construction estimation, quantity surveying, cost analysis, and pre-construction best practices.',
  },
};

/* ── Page component ───────────────────────────────────────────── */

export default async function BlogPage() {
  const insights = await getInsights(100).catch((err) => {
    console.error('[blog] getInsights failed:', err);
    return [];
  });

  return (
    <section className="min-h-screen bg-background px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)] md:py-32">
      {/* Header */}
      <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
        {/* Decorative system label */}
        <p className="mb-4 font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-primary">
          // Knowledge Base
        </p>

        <h1 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-6xl">
          Insights &{' '}
          <span className="text-primary">Blog</span>
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
          Expert insights on construction estimation, quantity surveying, cost
          analysis, and pre-construction best practices from ACE SERVICES.
        </p>
      </div>

      {/* Posts grid */}
      {insights.length > 0 ? (
        <div className="mx-auto max-w-6xl">
          <PaginationGrid
            itemsPerPage={9}
            gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          >
            {insights.map((insight) => (
              <BlogCard3D
                key={insight.id}
                slug={insight.slug}
                title={insight.title}
                excerpt={insight.excerpt}
                date={insight.date}
                image={insight.image}
                url={insight.url}
              />
            ))}
          </PaginationGrid>
        </div>
      ) : (
        /* Empty state */
        <div className="mx-auto max-w-2xl rounded-lg border border-surface-variant bg-gray-50 p-12 text-center">
          <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-primary/50">
            // Status: Pending
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background">
            No Posts Found
          </h2>
          <p className="mt-3 text-base text-on-surface-variant">
            Blog content is being migrated from our WordPress CMS. Check back
            soon for expert insights on construction estimation.
          </p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="mx-auto mt-20 max-w-2xl text-center md:mt-24">
        <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-on-surface-variant">
          // Need an estimate?
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl">
          Start your project with{' '}
          <span className="text-primary">ACE</span>
        </h2>
        <p className="mt-4 text-on-surface-variant">
          Get a precise, AACE-compliant cost estimate for your next construction
          project.
        </p>
        <Link
          href="/calculator"
          className="bracket-corners hover-brackets mt-8 inline-block rounded bg-primary px-8 py-3 font-[family-name:var(--font-space)] text-base font-bold text-white transition-colors hover:bg-[#E55A00]"
        >
          Get a Free Estimate
        </Link>
      </div>
    </section>
  );
}
