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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          /* Apply delay via setTimeout, then trigger the CSS transition */
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
      style={{
        willChange: isVisible ? 'auto' : 'opacity, transform',
        ...animationStyles[type],
        ...(isVisible ? visibleStyles[type] : {}),
      }}
    >
      {children}
    </div>
  );
}
