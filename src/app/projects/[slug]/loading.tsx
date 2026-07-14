export default function ProjectDetailLoading() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero skeleton */}
      <section className="border-b border-blueprint-line">
        <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="mb-8 h-3 w-48 rounded bg-surface-variant animate-pulse" />
          <div className="mb-4 h-3 w-32 rounded bg-surface-variant animate-pulse" />
          <div className="h-12 w-3/4 rounded bg-surface-variant animate-pulse" />
          <div className="mt-6 h-4 w-2/3 rounded bg-surface-variant animate-pulse" />
          <div className="mt-10 flex gap-8 border-t border-blueprint-line pt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-2 w-24 rounded bg-surface-variant animate-pulse" />
                <div className="mt-1 h-8 w-20 rounded bg-surface-variant animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content skeleton */}
      <div className="mx-auto max-w-7xl px-[var(--spacing-margin-mobile)] py-16 md:px-[var(--spacing-margin-desktop)] md:py-20">
        <div className="grid gap-12 lg:grid-cols-[300px_1fr]">
          {/* Sidebar */}
          <aside>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex gap-3 border border-blueprint-line bg-surface p-3">
                  <div className="h-16 w-16 flex-shrink-0 bg-surface-variant animate-pulse" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-3 w-full rounded bg-surface-variant animate-pulse" />
                    <div className="h-2 w-1/2 rounded bg-surface-variant animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </aside>

          {/* Main */}
          <div className="space-y-16">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i}>
                <div className="mb-6 h-3 w-40 rounded bg-surface-variant animate-pulse" />
                <div className="h-64 w-full rounded border border-blueprint-line bg-surface-variant animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
