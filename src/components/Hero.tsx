'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue } from 'motion/react';

/* ═══════════════════════════════════════════════════════════════════
   Fullscreen Blueprint Hero — scroll-driven zoom, cursor parallax,
   and initial load scale (1.5 → 1)

   Uses Framer Motion exclusively — no GSAP dependency.
   ═══════════════════════════════════════════════════════════════════ */

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Track scroll progress within this section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* Map scroll progress to a subtle zoom (1 → 1.15) */
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  /* ── Cursor parallax via motion values (no GSAP) ── */
  const cursorX = useRef(0);
  const cursorY = useRef(0);
  const rafId = useRef<number>(0);
  const parallaxX = useRef(0);
  const parallaxY = useRef(0);
  const ticking = useRef(false);

  const setParallaxX = useMotionValue(0);
  const setParallaxY = useMotionValue(0);

  /* Smooth interpolation loop — runs independently of React render */
  const tick = () => {
    const lerp = 0.12;
    parallaxX.current += (cursorX.current - parallaxX.current) * lerp;
    parallaxY.current += (cursorY.current - parallaxY.current) * lerp;
    setParallaxX.set(parallaxX.current);
    setParallaxY.set(parallaxY.current);

    if (Math.abs(cursorX.current - parallaxX.current) > 0.01 ||
        Math.abs(cursorY.current - parallaxY.current) > 0.01) {
      rafId.current = requestAnimationFrame(tick);
    } else {
      ticking.current = false;
    }
  };

  /* Start / stop the animation loop based on pointer events */
  const handlePointerMove = (e: React.PointerEvent) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dx = ((e.clientX - vw / 2) / vw) * 30;
    const dy = ((e.clientY - vh / 2) / vh) * 30;

    cursorX.current = dx;
    cursorY.current = dy;

    if (!ticking.current) {
      ticking.current = true;
      rafId.current = requestAnimationFrame(tick);
    }
  };

  const handlePointerLeave = () => {
    cursorX.current = 0;
    cursorY.current = 0;
    if (!ticking.current) {
      ticking.current = true;
      rafId.current = requestAnimationFrame(tick);
    }
  };

  return (
    <>
      {/* ─── Fullscreen hero ─── */}
      <section
        ref={sectionRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        className="relative h-svh w-full overflow-hidden bg-[#1a1a1a]"
        aria-label="Hero"
      >
        {/* Scale-in layer — 1.5 → 1 on first paint */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1], delay: 0 }}
        >
          {/* Parallax layer — Framer Motion tracks cursor via motion values */}
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ x: setParallaxX, y: setParallaxY }}
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
                sizes="102vw"
              />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Gradient overlay — darkens edges for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/50" />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.25)_100%)]" />

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
