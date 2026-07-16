'use client';

import Link from 'next/link';

export default function ProjectDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6">
      <div className="max-w-md text-center">
        <div className="mb-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
          [SYS::ERROR_LOADING_PROJECT]
        </div>
        <h1 className="font-[family-name:var(--font-space)] text-4xl font-bold text-on-background md:text-5xl">
          Failed to Load Project
        </h1>
        <p className="mt-4 font-sans text-base leading-relaxed text-on-surface-variant">
          {error.message || 'An unexpected error occurred while loading this project detail.'}
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="border border-primary bg-primary px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
          >
            TRY AGAIN
          </button>
          <Link
            href="/projects"
            className="border border-blueprint-line bg-transparent px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary"
          >
            BACK TO PROJECTS
          </Link>
        </div>
      </div>
    </main>
  );
}
