import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug } from '@/src/services/wordpress/content';

/* ── Dynamic metadata ─────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.title,
    description: post.excerpt.slice(0, 160),
    openGraph: {
      title: `${post.title} | ACE SERVICES`,
      description: post.excerpt.slice(0, 160),
      ...(post.image ? { images: [{ url: post.image }] } : {}),
    },
  };
}

/* ── Helpers ──────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** Render article HTML safely — content is pre-sanitized by sanitizeHtml(). */

/* ── Page ─────────────────────────────────────────────────────── */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <section className="w-full bg-background text-on-background">

      {/* ── Hero header ──────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-blueprint-line">
        {/* Blueprint grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(var(--color-blueprint-line) 1px, transparent 1px),
              linear-gradient(90deg, var(--color-blueprint-line) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative mx-auto w-full px-[var(--spacing-margin-mobile)] py-20 md:px-[var(--spacing-margin-desktop)] md:py-28">

          {/* Back link */}
          <Link
            href="/blog"
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
          >
            <svg
              className="h-3 w-3 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            BACK_TO_INDEX
          </Link>

          {/* System label */}
          <div className="mb-4 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            [SYS::BLOG_POST]
          </div>

          {/* Title */}
          <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold leading-tight text-on-background md:text-5xl lg:text-6xl">
            {post.title}
          </h1>

          {/* Meta row */}
          <div className="mt-6 flex flex-wrap items-center gap-4 font-mono text-xs text-on-surface-variant">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.modified !== post.date && (
              <span className="text-on-surface-variant/60">
                (updated {formatDate(post.modified)})
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Featured image ───────────────────────────────── */}
      {post.image && (
        <div className="mx-auto max-w-4xl px-[var(--spacing-margin-mobile)] pt-10 md:px-[var(--spacing-margin-desktop)]">
          <div className="relative aspect-[21/9] overflow-hidden border border-blueprint-line">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* ── Content ──────────────────────────────────────── */}
      <div className="mx-auto max-w-2/3 px-[var(--spacing-margin-mobile)] py-12 md:px-[var(--spacing-margin-desktop)] md:py-16">

        {post.content ? (
          <article
            className="article-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        ) : (
          <p className="text-on-surface-variant italic">
            No content available for this post.
          </p>
        )}

        {/* Divider */}
        <div className="my-12 border-t border-blueprint-line" />

        {/* Bottom nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
          >
            <svg
              className="h-3 w-3 transition-transform group-hover:-translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            ALL_INSIGHTS
          </Link>

          <Link
            href="/"
            className="group inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
          >
            HOME
            <svg
              className="h-3 w-3 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      {/* ── Bottom CTA ─────────────────────────────────────── */}
      <div className="border-t border-blueprint-line">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-[var(--spacing-margin-mobile)] py-16 text-center md:px-[var(--spacing-margin-desktop)] md:py-24">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
            [SYS::INITIATE_PROJECT_QUERY]
          </div>
          <h2 className="font-[family-name:var(--font-space)] text-2xl font-bold text-on-background md:text-4xl">
            Need a Precision Estimate?
          </h2>
          <p className="max-w-lg text-sm leading-relaxed text-on-surface-variant">
            Get a precise, AACE-compliant cost estimate for your next construction
            project. Turnaround in as little as 3–5 business days.
          </p>
          <Link
            href="/calculator"
            className="group mt-4 inline-flex items-center gap-3 border border-primary bg-primary px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
          >
            <span>GET_ESTIMATE</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
