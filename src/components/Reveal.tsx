import { useEffect, useRef, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

    // Set initial hidden state immediately
    gsap.set(el, fromMap[type]);

    let played = false;

    const play = () => {
      if (played && once) return;
      played = true;
      gsap.to(el, { ...toMap[type], delay });
    };

    // Find the nearest fixed-position Section ancestor (FullscreenScroller section)
    const fixedAncestor = el.closest<HTMLElement>('[style*="position: fixed"]');

    if (fixedAncestor) {
      // Inside a FullscreenScroller: use IntersectionObserver on the fixed section
      // The section slides in via GSAP translateY, so we watch it with threshold 0
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              play();
              if (once) observer.disconnect();
            }
          }
        },
        { threshold: 0.05 }
      );
      observer.observe(fixedAncestor);
      return () => observer.disconnect();
    } else {
      // Standard scroll context: use ScrollTrigger as before
      let killed = false;
      let anim: gsap.core.Tween | null = null;

      const raf = requestAnimationFrame(() => {
        if (killed) return;
        const isPastTrigger = el.getBoundingClientRect().top < window.innerHeight * 0.85;
        if (isPastTrigger) {
          play();
          return;
        }
        anim = gsap.fromTo(el, fromMap[type], {
          ...toMap[type],
          delay,
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            once,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => {
        killed = true;
        cancelAnimationFrame(raf);
        if (anim) anim.kill();
        ScrollTrigger.refresh();
      };
    }
  }, [type, delay, once]);

  return <div ref={ref} className={className}>{children}</div>;
}
