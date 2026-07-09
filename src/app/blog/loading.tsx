export default function BlogLoading() {
  return (
    <section className="min-h-screen bg-background px-[var(--spacing-margin-mobile)] py-24 md:px-[var(--spacing-margin-desktop)] md:py-32">
      {/* Header skeleton */}
      <div className="mx-auto mb-16 max-w-2xl text-center md:mb-20">
        <div className="mb-4 h-3 w-32 mx-auto rounded bg-surface-variant animate-pulse" />
        <div className="h-10 w-64 mx-auto rounded bg-surface-variant animate-pulse mt-4" />
        <div className="h-4 w-96 mx-auto rounded bg-surface-variant animate-pulse mt-5" />
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col rounded-lg border border-surface-variant bg-surface overflow-hidden"
          >
            <div className="aspect-[16/10] bg-surface-variant animate-pulse" />
            <div className="flex flex-1 flex-col p-6 space-y-3">
              <div className="h-5 w-3/4 rounded bg-surface-variant animate-pulse" />
              <div className="h-3 w-full rounded bg-surface-variant animate-pulse" />
              <div className="h-3 w-2/3 rounded bg-surface-variant animate-pulse" />
              <div className="h-3 w-20 rounded bg-surface-variant animate-pulse mt-4" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
