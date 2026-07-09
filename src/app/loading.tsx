export default function HomeLoading() {
  return (
    <div className="min-h-screen">
      {/* Minimal skeleton — the homepage is heavily animated, so we just show a subtle loader */}
      <div className="fixed inset-0 flex items-center justify-center bg-background z-10">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary/30 rounded flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="font-space text-lg font-extrabold text-primary">A</span>
          </div>
          <div className="h-2 w-24 rounded-full bg-surface-variant animate-pulse mx-auto" />
        </div>
      </div>
    </div>
  );
}
