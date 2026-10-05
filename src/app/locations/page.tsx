import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllStatePages } from '@/src/lib/sanity/locations';
import { locationPath } from '@/src/data/state-page-constants';
import { LocationCard } from '@/src/components/LocationCard';
import PaginationGrid from '../../components/PaginationGrid';

/* ── SEO metadata ─────────────────────────────────────────────── */

export const metadata: Metadata = {
  title: 'Construction and Estimation Services by State | The ACE Services',
  description:
    'State-by-state construction and estimation coverage from The ACE Services: cost estimating, quantity surveying, shop drawings, permit sets and CPM scheduling, with local permit and pricing knowledge in every market we serve.',
  alternates: { canonical: 'https://theaceservices.com/locations/' },
  openGraph: {
    title: 'Construction and Estimation Services by State | The ACE Services',
    description:
      'State-by-state construction and estimation coverage: cost estimating, quantity surveying, shop drawings, permit sets and CPM scheduling with local knowledge in every market.',
    url: 'https://theaceservices.com/locations/',
  },
};

/* ISR on the same window as /blog, so a newly published state page appears on
   the hub within 5 minutes at worst — and immediately when the Sanity webhook
   fires, because revalidatePath now genuinely invalidates (see the D1 tag cache
   in open-next.config.ts). */
export const revalidate = 300;

/* ── Page component ───────────────────────────────────────────── */

export default async function LocationsPage() {
  const pages = await getAllStatePages();

  return (
    <section className="min-h-screen bg-background px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)] md:py-32">
      {/* Header — same shape as /blog */}
      <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
        <p className="mb-4 font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-primary">
          // Service Areas
        </p>

        <h1 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-6xl">
          Construction &amp; Estimation{' '}
          <span className="text-primary">by State</span>
        </h1>

        <p className="mt-5 text-lg leading-relaxed text-on-surface-variant md:text-xl">
          Every state page covers our full pre-construction scope in that
          market &mdash; cost estimating, quantity surveying, MEP and structural
          shop drawings, 3D rendering, permit sets and CPM scheduling &mdash;
          written around that state&rsquo;s own permitting rules, labour rates
          and growth corridors.
        </p>
      </div>

      {/* Grid */}
      {pages.length > 0 ? (
        <div className="mx-auto max-w-6xl">
          <PaginationGrid
            itemsPerPage={9}
            gridCols="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          >
            {pages.map((page) => (
              <LocationCard
                key={page.id}
                href={locationPath(page.serviceSlug, page.slug)}
                title={page.title}
                state={page.state}
                headline={page.cardHeadline}
                image={page.thumbnailUrl ?? null}
                imageAlt={page.thumbnailAlt ?? ''}
                serviceCount={page.serviceCount}
              />
            ))}
          </PaginationGrid>
        </div>
      ) : (
        <div className="mx-auto max-w-2xl rounded-lg border border-surface-variant bg-gray-50 p-12 text-center">
          <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-primary/50">
            // Status: Pending
          </p>
          <h2 className="mt-4 font-[family-name:var(--font-space)] text-2xl font-bold text-on-background">
            No Locations Published Yet
          </h2>
          <p className="mt-3 text-base text-on-surface-variant">
            State pages are being published now. In the meantime, our service
            coverage and estimating process are the same in every market.
          </p>
        </div>
      )}

      {/* Bottom CTA — same shape as /blog */}
      <div className="mx-auto mt-20 max-w-2xl text-center md:mt-24">
        <p className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-on-surface-variant">
          // Need an estimate?
        </p>
        <h2 className="mt-4 font-[family-name:var(--font-space)] text-3xl font-bold text-on-background md:text-4xl">
          Start your project with{" "}
          <span className="text-primary">ACE</span>
        </h2>
        <p className="mt-4 text-base text-on-surface-variant">
          Get a precise, AACE-compliant cost estimate for your next construction
          project &mdash; in your state, on your drawing set, in 24&ndash;48 hours.
        </p>
        <Link
          href="/calculator/"
          className="bracket-corners hover-brackets mt-8 inline-block rounded bg-primary px-8 py-3 font-[family-name:var(--font-space)] text-base font-bold text-white transition-colors hover:bg-[#E55A00]"
        >
          Get a Free Estimate
        </Link>
      </div>
    </section>
  );
}