'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type AnimationType = 'fadeUp' | 'scaleIn' | 'fadeIn';

interface RevealProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
  once?: boolean;
}

const fromMap: Record<AnimationType, gsap.TweenVars> = {
  fadeUp: { opacity: 0, y: 64 },
  scaleIn: { opacity: 0, scale: 0.8 },
  fadeIn: { opacity: 0 },
};

const toMap: Record<AnimationType, gsap.TweenVars> = {
  fadeUp: { opacity: 1, y: 0, duration: 1.1, ease: 'power3.out' },
  scaleIn: { opacity: 1, scale: 1, duration: 1, ease: 'power3.out' },
  fadeIn: { opacity: 1, duration: 0.8, ease: 'power3.out' },
};

export default function Reveal({
  children,
  type = 'fadeUp',
  delay = 0,
  className = '',
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const anim = gsap.fromTo(el, fromMap[type], {
      ...toMap[type],
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once,
        invalidateOnRefresh: true,
      },
    });

    return () => {
      anim.kill();
      anim.scrollTrigger?.kill();
    };
  }, [type, delay, once]);

  return <div ref={ref} className={className}>{children}</div>;
}
