"use client";

import React from "react";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "@/src/components/ui/3d-card";

/* ── Helpers ──────────────────────────────────────────────────── */

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "\u2026";
}

/* ── Types ────────────────────────────────────────────────────── */

interface BlogCard3DProps {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  image: string | null;
  url: string;
}

/* ── 3D Blog Card ─────────────────────────────────────────────── */
/* Structure mirrors the Aceternity demo:                          */
/*   text (title, excerpt) → image thumbnail → action link         */
/* Each CardItem lifts on hover via translateZ for depth stacking. */

export function BlogCard3D({
  slug,
  title,
  excerpt,
  date,
  image,
  url,
}: BlogCard3DProps) {
  return (
    <CardContainer className="w-full">
      <CardBody className="w-full">
        <article className="bracket-corners hover-brackets group flex flex-col border border-surface-variant bg-surface transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/15 h-full">
          {/* ── Content ─────────────────────────────────────────── */}
          <div className="flex flex-1 flex-col p-6">
            {/* Title — lifts moderately */}
            <CardItem
              translateZ="50"
              as="h2"
              className="font-[family-name:var(--font-space)] text-lg font-bold leading-snug text-on-surface transition-colors group-hover:text-primary md:text-xl"
            >
              <Link href={`/blog/${slug}`} className="after:absolute after:inset-0">
                {title}
              </Link>
            </CardItem>

            {/* Excerpt — lifts toward the title on hover */}
            <CardItem
              as="p"
              translateZ="40"
              liftZ={20}
              className="mt-3 flex-1 text-xs leading-relaxed text-on-surface-variant"
            >
              {truncate(excerpt, 150)}
            </CardItem>

            {/* Image thumbnail — smaller, rounded, lifts highest */}
            <CardItem translateZ="100" scaleOnHover className="mt-5 w-full">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-background">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-shadow duration-500 group-hover:shadow-xl"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-widest text-on-surface-variant/50">
                      // No Image
                    </span>
                  </div>
                )}

                {/* Date badge */}
                <div className="absolute bottom-0 left-0 bg-primary/90 px-3 py-1.5 backdrop-blur-sm">
                  <time
                    dateTime={date}
                    className="font-[family-name:var(--font-mono)] text-xs font-medium text-white"
                  >
                    {formatDate(date)}
                  </time>
                </div>
              </div>
            </CardItem>

            {/* Read more — under image, single line */}
            <CardItem translateZ={20} className="mt-4 text-right">
              <Link
                href={`/blog/${slug}`}
                className="link-underline inline-flex items-center gap-2 font-[family-name:var(--font-space)] text-sm font-semibold text-primary transition-colors hover:text-[#E55A00]"
              >
                {/* Read More  &rarr; */}
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </CardItem>
          </div>
        </article>
      </CardBody>
    </CardContainer>
  );
}
