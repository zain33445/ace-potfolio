'use client';

import Link from 'next/link';

export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-[var(--spacing-margin-mobile)] py-32 text-center md:px-[var(--spacing-margin-desktop)]">
        {/* System label */}
        <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SYS::ERROR_500]
        </div>

        <h1 className="font-[family-name:var(--font-space)] text-5xl font-bold text-on-background md:text-7xl">
          Something Went Wrong
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-on-surface-variant">
          We couldn&apos;t load this blog post. This might be a temporary issue
          with our content server. Please try again.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
          >
            TRY_AGAIN
          </button>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 border border-blueprint-line bg-transparent px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            BACK_TO_INSIGHTS
          </Link>
        </div>
      </div>
    </section>
  );
}
