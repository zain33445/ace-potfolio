'use client';

import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Reveal from '../../../components/Reveal';
import type { Insight } from '../../../services/wordpress';

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: '2-digit' });
}

interface InsightsSectionProps {
  insights?: Insight[];
}

/**
 * Insights / blog feed — rendered entirely from the headless WordPress
 * backend (spam-filtered construction articles).
 * Renders nothing when the CMS returns no posts.
 */
export default function InsightsSection({ insights }: InsightsSectionProps) {

  if (!insights || insights.length === 0) return null;

  return (
    <div id="insights" className="py-24 px-6 md:px-16 border-b border-blueprint-line bg-surface relative">
      <Reveal type="fadeUp">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 space-y-3">
            <span className="font-mono text-sm text-primary font-bold block">Field Notes</span>
            <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
              Estimation Insights
            </h2>
            <p className="font-sans text-lg text-on-surface-variant max-w-xl">
              Live briefings pulled from our editorial desk — pre-construction strategy, takeoff
              accuracy, and cost-control fieldwork.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((post) => (
              <Link
                key={post.id}
                href={`/${post.slug}/`}
                className="group flex flex-col border border-blueprint-line bg-background bracket-corners overflow-hidden hover:border-primary transition-all duration-300"
              >
                {post.image && (
                  /* `relative` so next/image `fill` has a positioned parent.
                     next/image resizes and re-encodes the CMS's ~1MB source
                     PNGs at the edge rather than serving them raw. */
                  <div className="relative aspect-[16/9] overflow-hidden border-b border-blueprint-line">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 p-5">
                  <span className="font-mono text-xs text-on-surface-variant tracking-widest mb-3">
                    {formatDate(post.date)}
                  </span>
                  <h3 className="font-space font-bold text-xl text-on-background leading-snug mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="font-sans text-lg text-on-surface-variant leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-sm font-bold text-primary tracking-widest uppercase">
                    Read Briefing
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
