import Link from 'next/link';

export default function BlogPostNotFound() {
  return (
    <section className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-[var(--spacing-margin-mobile)] py-32 text-center md:px-[var(--spacing-margin-desktop)]">
        {/* System label */}
        <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SYS::ERROR_404]
        </div>

        <h1 className="font-[family-name:var(--font-space)] text-5xl font-bold text-on-background md:text-7xl">
          Post Not Found
        </h1>

        <p className="mt-6 max-w-md text-base leading-relaxed text-on-surface-variant">
          The blog post you&apos;re looking for doesn&apos;t exist or may have
          been removed. It might still be in our migration pipeline from the
          WordPress CMS.
        </p>

        <Link
          href="/blog"
          className="group mt-10 inline-flex items-center gap-2 border border-primary bg-primary px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
        >
          <svg
            className="h-3 w-3 transition-transform group-hover:-translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          BACK_TO_INSIGHTS
        </Link>
      </div>
    </section>
  );
}
