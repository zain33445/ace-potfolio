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
      ? ([...taglineEl.children].filter(
          (c) => c.textContent?.trim() && c.textContent.trim() !== '\u2022',
        ) as HTMLElement[])
      : undefined;

    if (!overlay) return;

    const tl = gsap.timeline();

    // 1. Logo draws in (fade + scale)
    tl.fromTo(
      logo,
      { opacity: 0, scale: 0.6, rotation: -10 },
      { opacity: 1, scale: 1, rotation: 0, duration: 0.8, ease: 'back.out(1.7)' }
    );

    // 2. Counter reels from 0 to 100
    if (strip) {
      const totalDigits = strip.children.length;
      tl.to(
        strip,
        { y: -(totalDigits - 1) * 16, duration: 2, ease: 'steps(' + (totalDigits - 1) + ')' },
        '-=0.3'
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
        className="opacity-0 w-[clamp(120px,18vw,200px)] h-[clamp(120px,18vw,200px)] border-2 border-primary/30 bg-surface rounded flex items-center justify-center shadow-lg"
      >
        <span className="font-space text-5xl md:text-6xl font-extrabold text-primary tracking-tighter">
          ACE
        </span>
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
        <span className="font-mono text-xs text-primary/80 ml-1">%</span>
      </div>

      {/* Tagline */}
      <div
        ref={taglineRef}
        className="flex items-center gap-3 mt-6 font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant"
      >
        <span>Precision</span>
        <span className="text-primary/30">&bull;</span>
        <span>Estimation</span>
        <span className="text-primary/30">&bull;</span>
        <span>Engineered</span>
      </div>
    </div>
  );
}
