'use client';

import { useState, useEffect, useRef, type ReactNode } from 'react';

interface RenderOnViewportProps {
  /** The content to render — typically a dynamically imported 3D component */
  children: ReactNode;
  /** Extra classes on the wrapper div */
  className?: string;
  /** Root margin for IntersectionObserver (default "200px" = start loading 200px before visible) */
  rootMargin?: string;
  /** Placeholder shown while the element is off-screen */
  placeholder?: ReactNode;
  /** Once rendered, keep the child alive even if scrolled away (default true) */
  keepAlive?: boolean;
}

/**
 * Only renders `children` once the element enters the viewport
 * (plus a configurable margin). Use it to defer heavy Three.js / r3f /
 * animation work until the user is about to see it.
 */
export default function RenderOnViewport({
  children,
  className = '',
  rootMargin = '200px',
  placeholder,
  keepAlive = true,
}: RenderOnViewportProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || rendered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRendered(true);
          if (keepAlive) {
            observer.unobserve(el);
          }
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(el);
    return () => observer.disconnect();
    // Only run once on mount; after rendered, stop re-observing
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={className}>
      {rendered ? children : (placeholder ?? null)}
    </div>
  );
}
