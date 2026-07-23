'use client';

import { useEffect, useRef, useState } from 'react';
import type { TocItem } from '@/src/lib/extractHeadings';

interface TableOfContentsProps {
  items: TocItem[];
}

/**
 * Sticky table-of-contents sidebar for blog posts.
 *
 * - Tracks active heading via IntersectionObserver
 * - Highlights the currently visible section
 * - Clicking an item smooth-scrolls to the heading
 * - Collapses into a mobile drawer on small screens
 */
export default function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track visible headings via IntersectionObserver
  useEffect(() => {
    // Collect all heading elements by their IDs
    const headingElements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingElements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Find the first entry that is intersecting
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the topmost visible heading
          const top = visible.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev,
          );
          setActiveId(top.target.id);
        }
      },
      {
        rootMargin: '-80px 0px -60% 0px',
        threshold: 0,
      },
    );

    headingElements.forEach((el) => observerRef.current!.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [items]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
  };

  // Group h3 items under their preceding h2
  const groupedItems: TocItem[][] = [];
  let currentGroup: TocItem[] = [];

  items.forEach((item) => {
    if (item.level === 2) {
      if (currentGroup.length > 0) {
        groupedItems.push(currentGroup);
      }
      currentGroup = [item];
    } else {
      currentGroup.push(item);
    }
  });
  if (currentGroup.length > 0) {
    groupedItems.push(currentGroup);
  }

  return (
    <nav
      className="toc-sidebar"
      aria-label="Table of contents"
    >
      {/* System label */}
      <div className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-primary">
        [SYS::TABLE_OF_CONTENTS]
      </div>

      {/* Desktop: sticky sidebar */}
      <div className="hidden lg:block">
        <ul className="space-y-1">
          {groupedItems.map((group) => {
            const first = group[0];
            return (
              <li key={first.id}>
                <a
                  href={`#${first.id}`}
                  onClick={(e) => handleClick(e, first.id)}
                  className={`toc-link toc-link-h2 block border-l-2 py-1.5 pl-3 pr-2 text-base font-semibold transition-all ${
                    activeId === first.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:border-blueprint-line hover:text-on-background'
                  }`}
                >
                  {first.text}
                </a>
                {group.length > 1 && (
                  <ul className="ml-3 border-l border-blueprint-line">
                    {group.slice(1).map((sub) => (
                      <li key={sub.id}>
                        <a
                          href={`#${sub.id}`}
                          onClick={(e) => handleClick(e, sub.id)}
className={`toc-link toc-link-h3 block border-l-2 py-1 pl-3 pr-2 text-sm transition-all ${
                          activeId === sub.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-on-surface-variant/70 hover:border-blueprint-line hover:text-on-background'
                        }`}
                        >
                          {sub.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile: collapsible drawer */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex w-full items-center justify-between border border-blueprint-line bg-surface px-4 py-3 font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant transition-colors hover:text-primary"
          aria-expanded={mobileOpen}
        >
          <span>ON_THIS_PAGE</span>
          <svg
            className={`h-3 w-3 transition-transform ${mobileOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {mobileOpen && (
          <div className="border-x border-b border-blueprint-line bg-surface p-4">
            <ul className="space-y-1">
              {groupedItems.map((group) => {
                const first = group[0];
                return (
                  <li key={first.id}>
                    <a
                      href={`#${first.id}`}
                      onClick={(e) => handleClick(e, first.id)}
                      className={`toc-link toc-link-h2 block border-l-2 py-1.5 pl-3 pr-2 text-sm font-medium transition-all ${
                        activeId === first.id
                          ? 'border-primary text-primary'
                          : 'border-transparent text-on-surface-variant hover:border-blueprint-line hover:text-on-background'
                      }`}
                    >
                      {first.text}
                    </a>
                    {group.length > 1 && (
                      <ul className="ml-3 border-l border-blueprint-line">
                        {group.slice(1).map((sub) => (
                          <li key={sub.id}>
                            <a
                              href={`#${sub.id}`}
                              onClick={(e) => handleClick(e, sub.id)}
                              className={`toc-link toc-link-h3 block border-l-2 py-1 pl-3 pr-2 text-xs transition-all ${
                                activeId === sub.id
                                  ? 'border-primary text-primary'
                                  : 'border-transparent text-on-surface-variant/70 hover:border-blueprint-line hover:text-on-background'
                              }`}
                            >
                              {sub.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
