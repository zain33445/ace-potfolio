export default function PricingLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="relative bg-background pt-32 pb-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="h-3 w-40 mx-auto rounded bg-surface-variant animate-pulse mb-4" />
          <div className="h-12 w-96 mx-auto rounded bg-surface-variant animate-pulse" />
          <div className="h-4 w-80 mx-auto rounded bg-surface-variant animate-pulse mt-6" />
        </div>
      </section>

      {/* Cards skeleton */}
      <section className="bg-background pb-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col p-6 border border-surface-variant bg-surface"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-3 w-16 rounded bg-surface-variant animate-pulse" />
                  <div className="h-9 w-9 rounded border border-surface-variant bg-surface-variant animate-pulse" />
                </div>
                <div className="h-3 w-24 rounded bg-surface-variant animate-pulse mb-1" />
                <div className="h-6 w-40 rounded bg-surface-variant animate-pulse" />
                <div className="mt-3 space-y-2">
                  <div className="h-3 w-full rounded bg-surface-variant animate-pulse" />
                  <div className="h-3 w-3/4 rounded bg-surface-variant animate-pulse" />
                </div>
                <div className="mt-5 space-y-2">
                  {Array.from({ length: 4 }).map((_, j) => (
                    <div key={j} className="h-3 w-full rounded bg-surface-variant animate-pulse" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
