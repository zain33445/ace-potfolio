'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

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

  const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
  const easeInOut = (t: number) =>
    t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const linear = (t: number) => t;

  const easingFn =
    easing === 'easeOut' ? easeOut : easing === 'easeInOut' ? easeInOut : linear;

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
    if (isAnimating) return;
    setDisplayValue(start);
    animate();
  }, [isAnimating, start, animate]);

  useEffect(() => {
    if (startOnMount) {
      startAnimation();
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [startOnMount, startAnimation]);

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
