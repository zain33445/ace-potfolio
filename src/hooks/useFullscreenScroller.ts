import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface SectionRegistration {
  id: string;
  ref: HTMLElement;
  order: number;
}

const TRANSITION_DURATION = 0.9;
const DEBOUNCE_MS = 800;
const TOUCH_THRESHOLD = 50;

let _uid = 0;

export function useFullscreenScroller(onIndexChange?: (index: number) => void) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const sectionsRef = useRef<SectionRegistration[]>([]);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  /* ---- registration ------------------------------------------- */

  const registerSection = useCallback((id: string, el: HTMLElement) => {
    const order = ++_uid;
    sectionsRef.current.push({ id, ref: el, order });
    setTotalSections(sectionsRef.current.length);
    return order;
  }, []);

  const unregisterSection = useCallback((id: string) => {
    sectionsRef.current = sectionsRef.current.filter((s) => s.id !== id);
    setTotalSections(sectionsRef.current.length);
  }, []);

  /* ---- sorted helper ------------------------------------------ */

  function getSorted() {
    return [...sectionsRef.current].sort((a, b) => a.order - b.order);
  }

  /* ---- transition core ---------------------------------------- */

  const transitionTo = useCallback(
    (direction: 1 | -1): Promise<void> => {
      return new Promise((resolve) => {
        const sorted = getSorted();
        const nextIndex = currentIndex + direction;
        if (nextIndex < 0 || nextIndex >= sorted.length) {
          resolve();
          return;
        }

        const current = sorted[currentIndex];
        const next = sorted[nextIndex];

        gsap.set(next.ref, {
          y: direction > 0 ? '100%' : '-100%',
          zIndex: 1,
        });

        const tl = gsap.timeline({
          onComplete: () => {
            gsap.set(current.ref, { zIndex: 0, y: direction > 0 ? '-100%' : '100%' });
            gsap.set(next.ref, { zIndex: 2, y: '0%' });
            setCurrentIndex(nextIndex);
            onIndexChange?.(nextIndex);

            const nextNext = sorted[nextIndex + direction];
            if (nextNext) {
              gsap.set(nextNext.ref, {
                y: direction > 0 ? '100%' : '-100%',
                zIndex: 1,
              });
            }

            isTransitioningRef.current = false;
            resolve();
          },
        });

        tl.to(current.ref, {
          y: direction > 0 ? '-100%' : '100%',
          duration: TRANSITION_DURATION,
          ease: 'power2.inOut',
        }, 0);
        tl.to(next.ref, {
          y: '0%',
          duration: TRANSITION_DURATION,
          ease: 'power2.inOut',
        }, 0);
      });
    },
    [currentIndex, onIndexChange],
  );

  /* ---- public API --------------------------------------------- */

  const scrollToSection = useCallback(
    async (id: string) => {
      const sorted = getSorted();
      const targetIndex = sorted.findIndex((s) => s.id === id);
      if (targetIndex === -1) return;

      let idx = currentIndex;
      const direction: 1 | -1 = targetIndex > idx ? 1 : -1;

      while (idx !== targetIndex) {
        if (isTransitioningRef.current) return;
        isTransitioningRef.current = true;
        await transitionTo(direction);
        idx += direction;
      }
    },
    [currentIndex, transitionTo],
  );

  /* ---- wheel handler ------------------------------------------ */

  const lastWheelRef = useRef(0);

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (isTransitioningRef.current) return;

      const now = Date.now();
      if (now - lastWheelRef.current < DEBOUNCE_MS) return;
      lastWheelRef.current = now;

      const direction: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const sorted = getSorted();
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= sorted.length) return;

      isTransitioningRef.current = true;
      transitionTo(direction);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [currentIndex, transitionTo]);

  /* ---- touch handler ------------------------------------------ */

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      touchStartYRef.current = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      e.preventDefault();
    }

    function onTouchEnd(e: TouchEvent) {
      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return;
      if (isTransitioningRef.current) return;

      const direction: 1 | -1 = deltaY > 0 ? 1 : -1;
      const sorted = getSorted();
      const nextIndex = currentIndex + direction;
      if (nextIndex < 0 || nextIndex >= sorted.length) return;

      isTransitioningRef.current = true;
      transitionTo(direction);
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [currentIndex, transitionTo]);

  /* ---- init & cleanup ----------------------------------------- */

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const raf = requestAnimationFrame(() => {
      const sorted = getSorted();
      sorted.forEach((sec, i) => {
        if (i === 0) {
          gsap.set(sec.ref, { y: '0%', zIndex: 2 });
        } else if (i === 1) {
          gsap.set(sec.ref, { y: '100%', zIndex: 1 });
        } else {
          gsap.set(sec.ref, { y: '100%', zIndex: 0 });
        }
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      _uid = 0;
    };
  }, []);

  /* ---- re-run initial positioning when sections change -------- */

  const prevCountRef = useRef(0);
  useEffect(() => {
    const count = sectionsRef.current.length;
    if (count > 1 && prevCountRef.current !== count) {
      prevCountRef.current = count;
      const sorted = getSorted();
      sorted.forEach((sec, i) => {
        if (i === currentIndex) {
          gsap.set(sec.ref, { y: '0%', zIndex: 2 });
        } else if (i === currentIndex + 1) {
          gsap.set(sec.ref, { y: '100%', zIndex: 1 });
        } else {
          gsap.set(sec.ref, { y: '100%', zIndex: 0 });
        }
      });
    }
  });

  return {
    registerSection,
    unregisterSection,
    scrollToSection,
    currentIndex,
    totalSections,
  };
}
