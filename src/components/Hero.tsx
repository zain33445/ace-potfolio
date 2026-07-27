'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

/* ═══════════════════════════════════════════════════════════════════
   Fullscreen Blueprint Hero — scroll-driven zoom
   Uses /Blueprint2.jpeg as a full-viewport background that gently
   scales up as the user scrolls past the hero.
   ═══════════════════════════════════════════════════════════════════ */

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* Track scroll progress within this section — 0 when hero is at the
     top of the viewport, 1 when hero has fully scrolled past. */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  /* Map scroll progress to a subtle zoom (1 → 1.15) */
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <>
      {/* ─── Fullscreen hero ─── */}
      <section
        ref={sectionRef}
        className="relative h-svh w-full overflow-hidden bg-[#1a1a1a]"
      >
        {/* Scroll-driven background image — scales up as you scroll down */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={{ scale: imageScale }}
        >
          <Image
            src="/Blueprint2.jpeg"
            alt="Blueprint engineering plans — ACE Services"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Gradient overlay — darkens edges for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />

        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

        {/* ─── Content stack ─── */}
        <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-20 pt-20 md:pt-32">
          <div className="max-w-3xl">
            {/* Eyebrow label */}
            <p className="font-sans text-primary text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4">
              Top Pre-Construction &amp; Estimation Services in the US
            </p>

            {/* Magazine-cover headline — two lines max */}
            <h1 className="font-space text-white text-[clamp(2.75rem,11vw,7rem)] font-black leading-[0.9] tracking-tighter">
              Stop Losing
              <br />
              Bids
            </h1>

            {/* Supporting copy */}
            <p className="font-sans text-white/80 text-[clamp(0.95rem,1.5vw,1.2rem)] max-w-xl mt-6 leading-relaxed">
              Accurate AACE Class&nbsp;3 estimates and material takeoffs &mdash;
              delivered in 24&ndash;48 hours. Win more work with precise,
              professional-grade pre-construction numbers.
            </p>

            {/* Trust badges */}
            <p className="font-sans text-sm mt-8 text-white/70 leading-relaxed">
              <span className="inline-block bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-md font-semibold text-white">
                ✓ Trusted by 200+ Contractors
              </span>
              <span className="hidden md:inline mx-3 text-white/40">|</span>
              <br className="md:hidden" />
              <span className="text-primary font-bold">✓</span>{' '}
              Residential &amp; Commercial
              <span className="hidden md:inline mx-3 text-white/40">|</span>
              <br className="md:hidden" />
              <span className="text-primary font-bold">✓</span> 24–48 Hour
              Turnaround
            </p>

            {/* CTAs */}
            <div className="flex flex-col md:flex-row items-start gap-x-10 gap-y-4 mt-10">
              <button
                onClick={() =>
                  document
                    .getElementById('contact')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group inline-flex items-center gap-2 border-2 border-primary bg-primary px-10 py-4 font-mono text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary bracket-corners"
              >
                <span>Bid Better</span>
                <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </button>
              <button
                onClick={() =>
                  document
                    .getElementById('projects')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group inline-flex items-center gap-2 border border-white/30 bg-transparent px-8 py-4 font-mono text-sm font-bold uppercase tracking-wider text-white/90 transition-all hover:border-white hover:text-white bracket-corners"
              >
                See Our Work
              </button>
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
