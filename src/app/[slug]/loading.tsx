export default function BlogPostLoading() {
  return (
    <section className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden border-b border-blueprint-line">
        <div className="relative mx-auto max-w-3xl px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-28">
          <div className="mb-8 h-3 w-32 rounded bg-surface-variant animate-pulse" />
          <div className="mb-4 h-3 w-24 rounded bg-surface-variant animate-pulse" />
          <div className="h-10 w-full rounded bg-surface-variant animate-pulse md:h-14" />
          <div className="mt-4 h-10 w-3/4 rounded bg-surface-variant animate-pulse md:h-14" />
          <div className="mt-6 h-3 w-48 rounded bg-surface-variant animate-pulse" />
        </div>
      </div>

      {/* Image skeleton */}
      <div className="mx-auto max-w-4xl px-[var(--spacing-margin-mobile)] pt-10 md:px-[var(--spacing-margin-desktop)]">
        <div className="aspect-[21/9] bg-surface-variant animate-pulse border border-blueprint-line" />
      </div>

      {/* Content skeleton */}
      <div className="mx-auto max-w-3xl px-[var(--spacing-margin-mobile)] py-12 md:px-[var(--spacing-margin-desktop)] md:py-16">
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-surface-variant animate-pulse" />
          <div className="h-4 w-full rounded bg-surface-variant animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-surface-variant animate-pulse" />
          <div className="h-4 w-full rounded bg-surface-variant animate-pulse" />
          <div className="h-4 w-4/5 rounded bg-surface-variant animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-surface-variant animate-pulse" />
        </div>
      </div>
    </section>
  );
}
