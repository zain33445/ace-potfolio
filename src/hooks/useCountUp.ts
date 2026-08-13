'use client';

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

interface UseCountUpOptions {
  /** Target value to count up to */
  end: number;
  /** Duration in seconds (default: 2) */
  duration?: number;
  /** Start from this value (default: 0) */
  start?: number;
  /** Easing: 'easeOut' | 'easeInOut' | 'linear' (default: 'easeOut') */
  easing?: 'easeOut' | 'easeInOut' | 'linear';
  /** Prefix string (e.g. '$') */
  prefix?: string;
  /** Suffix string (e.g. '+', 'M') */
  suffix?: string;
  /** Number of decimal places (default: 0) */
  decimals?: number;
  /** Whether to start animating immediately (default: false — use scroll trigger) */
  startOnMount?: boolean;
}

/* Pure easing functions at module scope so `easingFn` can be memoized
   with a stable identity (in-component functions would change every render). */
function easeOut(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function linear(t: number) {
  return t;
}

export function useCountUp({
  end,
  duration = 2,
  start = 0,
  easing = 'easeOut',
  prefix = '',
  suffix = '',
  decimals = 0,
  startOnMount = false,
}: UseCountUpOptions) {
  const [displayValue, setDisplayValue] = useState(start);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  /* Memoized so `animate`/`startAnimation` keep a stable identity between
     renders. Without this, every render produces new callbacks, which re-runs
     effects that depend on them and can cancel the in-flight rAF. */
  const easingFn = useMemo(() => {
    if (easing === 'easeInOut') return easeInOut;
    if (easing === 'linear') return linear;
    return easeOut;
  }, [easing]);

  const animate = useCallback(() => {
    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easedProgress = easingFn(progress);

      const currentValue = start + (end - start) * easedProgress;
      setDisplayValue(currentValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
        setIsAnimating(false);
        rafRef.current = null;
      }
    };

    setIsAnimating(true);
    rafRef.current = requestAnimationFrame(step);
  }, [end, start, duration, easingFn]);

  const startAnimation = useCallback(() => {
    /* Guard on the synchronous rafRef instead of state: the `isAnimating`
       flag can be stale inside this closure and would block restarts after
       a cancelled/completed animation (e.g. StrictMode remounts). */
    if (rafRef.current !== null) return;
    setDisplayValue(start);
    animate();
  }, [start, animate]);

  /* Auto-start once when requested. `startAnimation` is intentionally left
     out of the deps: its identity changes across renders, and including it
     would re-run this effect (and its cleanup) every frame, cancelling the
     rAF and freezing the counter at its starting value. */
  useEffect(() => {
    if (startOnMount) {
      startAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startOnMount]);

  /* Cancel an in-flight animation ONLY on unmount. Empty deps keep the
     cleanup from firing on every render. */
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsAnimating(false);
    };
  }, []);

  const formatted = (() => {
    const num = Number(displayValue.toFixed(decimals));
    if (decimals > 0) {
      return `${prefix}${num.toFixed(decimals)}${suffix}`;
    }
    // Add commas for integer
    return `${prefix}${Math.floor(num).toLocaleString()}${suffix}`;
  })();

  return { displayValue, formatted, isAnimating, startAnimation };
}
