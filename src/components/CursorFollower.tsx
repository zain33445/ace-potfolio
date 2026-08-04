'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const RING_SIZE = 24;
const BORDER_WIDTH = 1.5;
const HOVER_SCALE = 1.5;
const ORANGE = '#FF6B00';
const ORANGE_HOVER = '#FF8833';

export default function CursorFollower() {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ring = ringRef.current;
    if (!ring) return;

    /* Skip the custom cursor on touch devices / mobile view — use the native cursor.
       Covers real phones/tablets (pointer/hover/touch) AND narrow responsive viewports. */
    const isMobileOrTouch = () =>
      'ontouchstart' in window ||
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(hover: none)').matches ||
      window.innerWidth < 768;

    let cleanup: (() => void) | null = null;

    const activate = () => {
      if (cleanup) return;

      /* ── Suppress native cursor ── */
      document.body.style.cursor = 'none';

      /* ── Position trackers with GSAP lag ── */
      const setX = gsap.quickTo(ring, 'x', {
        ease: 'power3.out',
        duration: 0.4,
      });
      const setY = gsap.quickTo(ring, 'y', {
        ease: 'power3.out',
        duration: 0.4,
      });

      /* ── Hidden until first mouse move ── */
      gsap.set(ring, { opacity: 0 });

      const handleMouseMove = (e: MouseEvent) => {
        setX(e.clientX);
        setY(e.clientY);

        // Fade in on first interaction
        if (ring.dataset.seen === undefined) {
          ring.dataset.seen = 'true';
          gsap.to(ring, { opacity: 1, duration: 0.3 });
        }
      };

      /* ── Hover detection via event delegation ── */
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const hoverTrigger = target.closest<HTMLElement>(
          'a, button, [data-cursor-hover]',
        );

        if (hoverTrigger) {
          gsap.to(ring, {
            scale: HOVER_SCALE,
            borderColor: ORANGE_HOVER,
            duration: 0.3,
            ease: 'power3.out',
          });
        } else {
          gsap.to(ring, {
            scale: 1,
            borderColor: ORANGE,
            duration: 0.3,
            ease: 'power3.out',
          });
        }
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      document.addEventListener('mouseover', handleMouseOver);

      cleanup = () => {
        document.body.style.cursor = 'auto';
        window.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseover', handleMouseOver);
        gsap.killTweensOf(ring);
        cleanup = null;
      };
    };

    const deactivate = () => {
      if (cleanup) cleanup();
      gsap.set(ring, { opacity: 0 });
      document.body.style.cursor = 'auto';
    };

    const update = () => {
      if (isMobileOrTouch()) {
        deactivate();
      } else {
        activate();
      }
    };

    update();

    /* Re-evaluate when the viewport crosses breakpoints or pointer changes */
    const mqPointer = window.matchMedia('(pointer: coarse)');
    const mqHover = window.matchMedia('(hover: none)');
    const mqMobile = window.matchMedia('(max-width: 767px)');
    mqPointer.addEventListener?.('change', update);
    mqHover.addEventListener?.('change', update);
    mqMobile.addEventListener?.('change', update);
    window.addEventListener('resize', update);

    return () => {
      mqPointer.removeEventListener?.('change', update);
      mqHover.removeEventListener?.('change', update);
      mqMobile.removeEventListener?.('change', update);
      window.removeEventListener('resize', update);
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={ringRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        width: RING_SIZE,
        height: RING_SIZE,
        borderRadius: '50%',
        border: `${BORDER_WIDTH}px solid ${ORANGE}`,
        marginLeft: -(RING_SIZE / 2),
        marginTop: -(RING_SIZE / 2),
        willChange: 'transform',
      }}
    />
  );
}
