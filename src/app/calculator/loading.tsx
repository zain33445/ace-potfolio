export default function CalculatorLoading() {
  return (
    <section className="min-h-screen px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] pt-24 pb-16">
      {/* Header skeleton */}
      <div className="max-w-5xl mx-auto mb-10">
        <div className="h-3 w-48 rounded bg-surface-variant animate-pulse mb-3" />
        <div className="h-10 w-64 rounded bg-surface-variant animate-pulse" />
        <div className="mt-4 h-4 w-96 rounded bg-surface-variant animate-pulse" />
      </div>

      {/* Estimator skeleton */}
      <div className="max-w-5xl mx-auto">
        <div className="w-full bg-surface border border-blueprint-line overflow-hidden">
          <div className="border-b border-blueprint-line px-6 py-4 bg-background/50">
            <div className="h-5 w-64 rounded bg-surface-variant animate-pulse" />
          </div>
          <div className="p-6 space-y-6">
            <div className="h-8 w-48 rounded bg-surface-variant animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-24 rounded border border-surface-variant bg-surface-variant animate-pulse" />
              ))}
            </div>
            <div className="h-10 w-32 rounded bg-primary/20 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
}
