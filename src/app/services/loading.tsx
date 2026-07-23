export default function ServicesLoading() {
  return (
    <section className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <div className="border-b border-blueprint-line">
        <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-28">
          <div className="mb-6 h-4 w-32 animate-pulse bg-surface-variant" />
          <div className="mb-4 h-16 w-3/4 animate-pulse bg-surface-variant md:h-20" />
          <div className="mt-6 h-6 w-1/2 animate-pulse bg-surface-variant" />
          <div className="mt-10 flex flex-wrap gap-8 border-t border-blueprint-line pt-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-20 animate-pulse bg-surface-variant" />
                <div className="h-7 w-24 animate-pulse bg-surface-variant" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="border border-blueprint-line bg-surface p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-20 animate-pulse bg-surface-variant" />
                <div className="h-9 w-9 animate-pulse bg-surface-variant" />
              </div>
              <div className="mb-2 h-3 w-32 animate-pulse bg-surface-variant" />
              <div className="h-6 w-3/4 animate-pulse bg-surface-variant" />
              <div className="mt-3 space-y-2">
                <div className="h-4 w-full animate-pulse bg-surface-variant" />
                <div className="h-4 w-5/6 animate-pulse bg-surface-variant" />
              </div>
              <div className="mt-5 space-y-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-start gap-2.5">
                    <div className="h-3.5 w-3.5 mt-0.5 animate-pulse rounded-sm bg-surface-variant" />
                    <div className="h-4 flex-1 animate-pulse bg-surface-variant" />
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-blueprint-line" />
              <div className="mt-5 flex items-end justify-between">
                <div className="space-y-1">
                  <div className="h-7 w-20 animate-pulse bg-surface-variant" />
                  <div className="h-3 w-24 animate-pulse bg-surface-variant" />
                </div>
                <div className="h-4 w-24 animate-pulse bg-surface-variant" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
