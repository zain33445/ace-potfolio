'use client';

import { useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';

/* ═══════════════════════════════════════════════════════════════════
   Fullscreen Blueprint Hero — scroll-driven zoom, cursor parallax,
   and initial load scale (1.5 → 1)
   ═══════════════════════════════════════════════════════════════════ */

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);

  /* Track scroll progress within this section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* Map scroll progress to a subtle zoom (1 → 1.15) */
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  /* ── Cursor parallax (translate only — scale is CSS @keyframes) ── */
  useLayoutEffect(() => {
    const el = parallaxRef.current;
    if (!el) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    const setX = gsap.quickTo(el, 'x', { ease: 'power3.out', duration: 0.6 });
    const setY = gsap.quickTo(el, 'y', { ease: 'power3.out', duration: 0.6 });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / rect.width;
      const deltaY = (e.clientY - centerY) / rect.height;
      setX(deltaX * 30);
      setY(deltaY * 30);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <>
      {/* ─── Fullscreen hero ─── */}
      <section
        ref={sectionRef}
        className="relative h-svh w-full overflow-hidden bg-[#1a1a1a]"
      >
        {/* CSS-animated scale layer — 1.5 → 1 on first paint, no JS needed */}
        <div
          className="absolute inset-0 will-change-transform"
          style={{ animation: 'hero-scale-in 1.8s cubic-bezier(0.33, 1, 0.68, 1) forwards' }}
        >
        {/* Parallax layer — GSAP tracks cursor (translate only) */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 will-change-transform"
        >
          {/* Scroll-driven background image — scales up as you scroll down */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ scale: imageScale }}
          >
            <Image
              src="/Blueprint2.webp"
              alt="Blueprint engineering plans — ACE Services"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </motion.div>
        </div>
        </div>

        {/* Gradient overlay — darkens edges for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

        {/* ─── Content stack ─── */}
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-20 pt-20 md:pt-24">
          <div className="max-w-3xl">
            {/* Eyebrow tagline */}
            <h1 className="font-mono text-md bg-black display-inline px-2 py-1 w-fit tracking-[0.25em] uppercase text-primary/80 mb-4">
              Top Pre-Construction &amp; Estimation Firm
            </h1>

            {/* Magazine-cover headline — two lines max */}
            <h2 className="font-space text-white text-[clamp(2.75rem,11vw,7rem)] font-black leading-[0.9] tracking-tighter">
              Stop Losing
              <br />
              Bids
            </h2>

            {/* Supporting copy */}
            <p className="font-sans text-white/80 text-[clamp(0.95rem,1.5vw,1.2rem)] max-w-xl mt-6 leading-relaxed">
              Accurate AACE Class&nbsp;3 estimates and material takeoffs,
              delivered in 24 to 48 hours. Win more work with precise,
              professional-grade pre-construction numbers.
            </p>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row items-start gap-x-10 gap-y-4 mt-10">
              <button
                onClick={() =>
                  document
                    .getElementById('projects')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group inline-flex items-center gap-2 border border-white/30 bg-transparent px-8 py-4 font-mono text-base font-bold uppercase tracking-wider text-white/90 transition-all hover:border-white hover:text-white bracket-corners"
              >
                See Our Work
              </button>
              <Link
                href="/calculator"
                className="group inline-flex items-center gap-2 border-2 border-primary bg-primary px-10 py-4 font-mono text-base font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary bracket-corners"
              >
                <span>Bid Better</span>
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marquee ticker ─── */}
      <div className="bg-primary text-white py-3.5 border-y border-on-background overflow-hidden relative select-none shrink-0">
        <div className="marquee-track font-mono text-sm font-bold tracking-widest uppercase">
          <span className="marquee-content">
            &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
            &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
            INTEGRATION &spades;
          </span>
          <span className="marquee-content" aria-hidden="true">
            &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
            &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
            INTEGRATION &spades;
          </span>
        </div>
      </div>
    </>
  );
}
