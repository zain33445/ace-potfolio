"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { CardBody, CardContainer, CardItem } from "@/src/components/ui/3d-card";

/* ── Types ────────────────────────────────────────────────────── */

interface LocationCardProps {
  href: string;
  title: string;
  state: string;
  headline: string;
  image: string | null;
  imageAlt: string;
  serviceCount: number;
}

/* ── Card ──────────────────────────────────────────────────────── */
/* Mirrors BlogCard3D so /locations feels like the same product as   */
/* /blog: same 3D card primitives, same bracket-corner treatment,    */
/* same "text lifts / image lifts higher" depth order.               */

/* ── Helpers ───────────────────────────────────────────────────── */

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "\u2026";
}

/* ── Component ─────────────────────────────────────────────────── */

export function LocationCard({
  href,
  title,
  state,
  headline,
  image,
  imageAlt,
  serviceCount,
}: LocationCardProps) {
  return (
    <CardContainer className="w-full">
      <CardBody className="w-full">
        <article className="bracket-corners hover-brackets group relative flex flex-col border border-surface-variant bg-surface transition-all duration-300 hover:border-primary hover:shadow-lg hover:shadow-primary/15 h-full">
          <div className="flex flex-1 flex-col p-6">
            {/* State + service count */}
            <CardItem translateZ="30" className="flex items-center gap-3">
              <span className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-primary">
                {state}
              </span>
              {serviceCount > 0 && (
                <span className="rounded-full border border-surface-variant px-2.5 py-0.5 font-[family-name:var(--font-mono)] text-xs text-on-surface-variant">
                  {serviceCount} services
                </span>
              )}
            </CardItem>

            {/* Title */}
            <CardItem
              translateZ="50"
              as="h2"
              className="mt-3 font-[family-name:var(--font-space)] text-xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary md:text-2xl"
            >
              <Link href={href} className="after:absolute after:inset-0">
                {title}
              </Link>
            </CardItem>

            {/* Headline */}
            <CardItem
              as="p"
              translateZ="40"
              liftZ={20}
              className="mt-3 flex-1 text-sm leading-relaxed text-on-surface-variant"
            >
              {truncate(headline, 150)}
            </CardItem>

            {/* Thumbnail */}
            <CardItem translateZ="100" scaleOnHover className="mt-5 w-full">
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-background">
                {image ? (
                  <Image
                    src={image}
                    alt={imageAlt || title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-shadow duration-500 group-hover:shadow-xl"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="font-[family-name:var(--font-mono)] text-sm uppercase tracking-widest text-on-surface-variant/50">
                      // No Image
                    </span>
                  </div>
                )}
              </div>
            </CardItem>

            {/* Arrow */}
            <CardItem translateZ={20} className="mt-4 text-right">
              <Link
                href={href}
                aria-label={`View construction and estimation services in ${state}`}
                className="link-underline inline-flex items-center gap-2 font-[family-name:var(--font-space)] text-base font-semibold text-primary transition-colors hover:text-[#E55A00]"
              >
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </CardItem>
          </div>
        </article>
      </CardBody>
    </CardContainer>
  );
}