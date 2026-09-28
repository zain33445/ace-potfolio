'use client';

import { useRef, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/* Snap carousel with prev/next buttons. Scrolls along whichever axis the row's
   own classes lay it out on (horizontal row on mobile, vertical column at lg). */
export default function ScrollRow({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const vertical = getComputedStyle(el).flexDirection === 'column';
    el.scrollBy(
      vertical
        ? { top: dir * el.clientHeight, behavior: 'smooth' }
        : { left: dir * el.clientWidth, behavior: 'smooth' },
    );
  };

  const btn =
    'flex h-8 w-8 items-center justify-center border border-blueprint-line bg-surface text-primary transition-colors hover:border-primary';

  return (
    <div>
      <div ref={ref} className={className}>
        {children}
      </div>
      <div className="mb-8 flex justify-end gap-2">
        <button type="button" aria-label="Previous" onClick={() => scroll(-1)} className={btn}>
          <ChevronLeft className="h-4 w-4 lg:rotate-90" />
        </button>
        <button type="button" aria-label="Next" onClick={() => scroll(1)} className={btn}>
          <ChevronRight className="h-4 w-4 lg:rotate-90" />
        </button>
      </div>
    </div>
  );
}
