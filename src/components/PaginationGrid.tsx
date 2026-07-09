'use client';

import { useState, useMemo, Children } from 'react';

/* ── Types ─────────────────────────────────────────────────────────── */

interface PaginationGridProps {
  children: React.ReactNode;
  itemsPerPage?: number;
  gridCols?: string;
}

/* ── Component ─────────────────────────────────────────────────────── */

export default function PaginationGrid({
  children,
  itemsPerPage = 9,
  gridCols = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
}: PaginationGridProps) {
  const [page, setPage] = useState(1);

  const allItems = useMemo(() => Children.toArray(children), [children]);
  const totalPages = Math.max(1, Math.ceil(allItems.length / itemsPerPage));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const visibleItems = allItems.slice(startIndex, startIndex + itemsPerPage);

  /* If there's only one page, render the grid with no pagination chrome */
  if (totalPages <= 1) {
    return (
      <div className={`grid ${gridCols} gap-6`}>
        {children}
      </div>
    );
  }

  return (
    <div>
      {/* Grid — only items for the current page */}
      <div className={`grid ${gridCols} gap-6`}>
        {visibleItems}
      </div>

      {/* Pagination controls */}
      <nav
        className="mt-12 flex flex-col items-center gap-4 md:flex-row md:justify-center"
        aria-label="Pagination"
      >
        {/* Previous */}
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={safePage <= 1}
          className="group inline-flex items-center gap-2 border border-blueprint-line bg-transparent px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            className="h-3 w-3 transition-transform group-hover:-translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>[PREV]</span>
        </button>

        {/* Page numbers */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === safePage;
            return (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`flex h-9 w-9 items-center justify-center border font-mono text-xs font-bold transition-all ${
                  isActive
                    ? 'border-primary bg-primary text-white'
                    : 'border-blueprint-line bg-transparent text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {String(pageNum).padStart(2, '0')}
              </button>
            );
          })}
        </div>

        {/* Next */}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={safePage >= totalPages}
          className="group inline-flex items-center gap-2 border border-blueprint-line bg-transparent px-5 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
        >
          <span>[NEXT]</span>
          <svg
            className="h-3 w-3 transition-transform group-hover:translate-x-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Record count */}
        <span className="hidden font-mono text-[10px] text-on-surface-variant md:ml-4 md:inline-block">
          [{String(startIndex + 1).padStart(2, '0')}–{String(Math.min(startIndex + itemsPerPage, allItems.length)).padStart(2, '0')} / {String(allItems.length).padStart(2, '0')}]
        </span>
      </nav>
    </div>
  );
}
