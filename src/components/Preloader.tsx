'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const logo = logoRef.current;
    const strip = stripRef.current;
    const taglineEl = taglineRef.current;
    const tagWords = taglineEl
      ? ([...taglineEl.querySelectorAll<HTMLElement>('[data-word]')])
      : undefined;

    if (!overlay) return;

    const tl = gsap.timeline();

    // 1. Logo draws in (fade + scale)
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.6, rotation: -10 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
    );

    // 2. Counter reels from 0 to 100 (starts immediately with logo)
    if (strip) {
      const totalDigits = strip.children.length;
      tl.to(
        strip,
        { y: -(totalDigits - 1) * 16, duration: 2, ease: 'steps(' + (totalDigits - 1) + ')' },
        0
      );
    }

    // 3. Tagline words stagger in
    if (tagWords?.length) {
      tl.fromTo(
        tagWords,
        { opacity: 0, y: 12, filter: 'blur(4px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.6, stagger: 0.1, ease: 'power2.out',
        },
        '-=0.2'
      );
    }

    // 4. Hold
    tl.to({}, { duration: 0.8 });

    // 5. Exit: slide entire overlay up (absolute children move with it)
    tl.to(
      overlay,
      { y: '-100%', duration: 0.9, ease: 'power3.inOut', onComplete },
      '+=0.1'
    );

    return () => {
      tl.kill();
      gsap.set(overlay, { clearProps: 'all' });
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-surface-variant"
    >
      {/* Logo */}
      <div
        ref={logoRef}
        className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 will-change-transform"
      >
        <img src="/aceLogo.png" alt="ACE Logo" className="w-full h-full object-contain" />
      </div>

      {/* Slot counter */}
      <div className="flex items-center gap-0.5 mt-8 ">
        <div className="slot-reel">
          <div ref={stripRef} className="slot-strip">
            {Array.from({ length: 101 }).map((_, i) => (
              <span key={i} className="slot-digit font-mono text-primary/80">
                {String(i).padStart(3, '0')}
              </span>
            ))}
          </div>
        </div>
        <span className="font-mono text-base text-primary/80 ml-1">%</span>
      </div>

      {/* Tagline */}
      <div
        ref={taglineRef}
        className="flex items-center gap-3 mt-6 font-mono text-sm font-bold uppercase tracking-[0.15em] text-on-surface-variant"
      >
        <span data-word>Precision</span>
        <span className="text-primary/30">&bull;</span>
        <span data-word>Estimation</span>
        <span className="text-primary/30">&bull;</span>
        <span data-word>Engineered</span>
      </div>
    </div>
  );
}
