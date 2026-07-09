export default function ProjectsLoading() {
  return (
    <section className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="relative overflow-hidden border-b border-blueprint-line">
        <div className="relative mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-28">
          <div className="mb-6 h-3 w-48 rounded bg-surface-variant animate-pulse" />
          <div className="h-12 w-72 rounded bg-surface-variant animate-pulse" />
          <div className="mt-6 h-4 w-96 rounded bg-surface-variant animate-pulse" />
          <div className="mt-10 flex gap-8 border-t border-blueprint-line pt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-2 w-24 rounded bg-surface-variant animate-pulse" />
                <div className="mt-1 h-6 w-16 rounded bg-surface-variant animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar skeleton */}
      <div className="sticky top-0 z-30 border-b border-blueprint-line bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-[var(--spacing-margin-mobile)] py-4 md:px-[var(--spacing-margin-desktop)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-7 w-24 rounded-sm border border-surface-variant bg-surface-variant animate-pulse" />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-12 md:px-[var(--spacing-margin-desktop)] md:py-16">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col border border-blueprint-line bg-surface">
              <div className="aspect-[4/3] bg-surface-variant animate-pulse" />
              <div className="flex flex-col p-5 space-y-3">
                <div className="h-5 w-3/4 rounded bg-surface-variant animate-pulse" />
                <div className="h-px w-full bg-blueprint-line" />
                <div className="h-3 w-full rounded bg-surface-variant animate-pulse" />
                <div className="h-3 w-2/3 rounded bg-surface-variant animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
