import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: 'noindex',
};

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-5">
      <div className="text-center">
        <span className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-primary">
          [404]
        </span>
        <h1 className="mt-4 font-[family-name:var(--font-space)] text-5xl font-bold text-on-background md:text-7xl">
          Page Not Found
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-lg text-on-surface-variant">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-none bg-primary px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider text-white transition-opacity hover:opacity-90"
        >
          Return Home
        </Link>
      </div>
    </main>
  );
}
