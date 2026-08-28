'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

type AnimationType = 'fadeUp' | 'scaleIn' | 'fadeIn';

interface RevealInnerProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
  once?: boolean;
}

/* CSS animation keyframes — GPU-composited, no JS animation library needed */
const animationStyles: Record<AnimationType, React.CSSProperties> = {
  fadeUp: {
    opacity: 0,
    transform: 'translateY(64px)',
    transition: 'opacity 1.1s cubic-bezier(0.16, 1, 0.3, 1), transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  scaleIn: {
    opacity: 0,
    transform: 'scale(0.8)',
    transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  fadeIn: {
    opacity: 0,
    transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
  },
};

const visibleStyles: Record<AnimationType, React.CSSProperties> = {
  fadeUp: { opacity: 1, transform: 'translateY(0)' },
  scaleIn: { opacity: 1, transform: 'scale(1)' },
  fadeIn: { opacity: 1 },
};

export default function RevealInner({
  children,
  type = 'fadeUp',
  delay = 0,
  className = '',
  once = true,
}: RevealInnerProps) {
  const ref = useRef<HTMLDivElement>(null);
  /* Default VISIBLE: the server renders real, painted text (no white space,
     LCP-safe) and content can never get stranded invisible if JS is slow or
     fails. On mount we only hide elements that are still BELOW the fold, so
     they can animate in on scroll — anything already on screen just stays. */
  const [isVisible, setIsVisible] = useState(true);
  /* Tracks whether we've committed to the animated path (client-only). */
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const belowFold = el.getBoundingClientRect().top > window.innerHeight * 0.85;
    if (reduceMotion || !belowFold) return; // already visible; leave it

    /* Hide, then reveal on scroll-in. */
    setAnimate(true);
    setIsVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay * 1000);
          if (once) observer.disconnect();
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, once]);

  return (
    <div
      ref={ref}
      className={className}
      style={
        animate
          ? {
              willChange: isVisible ? 'auto' : 'opacity, transform',
              ...animationStyles[type],
              ...(isVisible ? visibleStyles[type] : {}),
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
