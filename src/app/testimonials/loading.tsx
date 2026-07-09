export default function TestimonialsLoading() {
  return (
    <section className="min-h-screen bg-background px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)] md:py-32">
      {/* Header skeleton */}
      <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
        <div className="mb-4 h-3 w-28 mx-auto rounded bg-surface-variant animate-pulse" />
        <div className="h-10 w-72 mx-auto rounded bg-surface-variant animate-pulse mt-4" />
        <div className="h-4 w-80 mx-auto rounded bg-surface-variant animate-pulse mt-5" />
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg border border-surface-variant bg-surface p-8"
          >
            <div className="space-y-2 mb-6 flex-1">
              <div className="h-4 w-full rounded bg-surface-variant animate-pulse" />
              <div className="h-4 w-5/6 rounded bg-surface-variant animate-pulse" />
              <div className="h-4 w-4/6 rounded bg-surface-variant animate-pulse" />
            </div>
            <div className="flex items-center gap-4 border-t border-surface-variant pt-5">
              <div className="h-12 w-12 rounded-full bg-surface-variant animate-pulse" />
              <div className="space-y-2">
                <div className="h-3 w-28 rounded bg-surface-variant animate-pulse" />
                <div className="h-2 w-20 rounded bg-surface-variant animate-pulse" />
                <div className="h-2 w-32 rounded bg-surface-variant animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
