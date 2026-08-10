"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
} from "motion/react";

/* ═══════════════════════════════════════════════════════════════════
   Fullscreen Blueprint Hero — automatic image carousel with
   crossfade, scroll-driven zoom, cursor parallax,
   and initial load scale (1.5 → 1)

   Uses Framer Motion exclusively — no GSAP dependency.
   ═══════════════════════════════════════════════════════════════════ */

/* ── Automatic carousel slides (desktop hero background) ── */
const heroSlides = [
  { src: "/c1.jpeg", alt: "The ACE Services pre-construction engineering project" },
  { src: "/c2.jpeg", alt: "The ACE Services construction blueprint project" },
  { src: "/c3.jpeg", alt: "The ACE Services cost estimation project" },
  { src: "/c4.jpeg", alt: "The ACE Services material takeoff project" },
  // { src: "/c5.jpeg", alt: "The ACE Services pre-construction project" },
];

const SLIDE_INTERVAL_MS = 5000;

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  /* ── Automatic carousel state ── */
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, SLIDE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  /* Track scroll progress within this section */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
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

    if (
      Math.abs(cursorX.current - parallaxX.current) > 0.01 ||
      Math.abs(cursorY.current - parallaxY.current) > 0.01
    ) {
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
      {/* Inline the keyframes so the scale-in runs at the very first paint.
          globals.css loads AFTER this component paints, which would otherwise
          delay the animation start by the CSS file download time. */}
      <style>{`
        @keyframes hero-scale-in {
          from { transform: scale(1.5); }
          to   { transform: scale(1);    }
        }
      `}</style>

      {/* ─── Fullscreen hero ─── */}
      <section
        ref={sectionRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        aria-label="Hero"
        className="
          overflow-hidden
          h-svh w-full
          bg-[#1a1a1a]
          relative
        "
      >
        {/* Scale-in layer — 1.5 → 1 on first paint.
            CSS @keyframes (hero-scale-in) instead of Framer Motion
            initial/animate so the zoom starts on first paint — before
            React hydrates — eliminating the stuck-at-1.5 pause. */}
        <div
          style={{
            animation:
              "hero-scale-in 1.8s cubic-bezier(0.33, 1, 0.68, 1) forwards",
            // Force compositor promotion so the transform animation runs on
            // the GPU thread — immune to main-thread stalls (hydration etc.)
            // and independent of when layout.css's .will-change-transform loads.
            willChange: "transform",
          }}
          className="
            absolute inset-0 will-change-transform
          "
        >
          {/* Parallax layer — Framer Motion tracks cursor via motion values */}
          <motion.div
            style={{ x: setParallaxX, y: setParallaxY }}
            className="
              absolute inset-0 will-change-transform
            "
          >
            {/* Scroll-driven background images — scales up as you scroll down */}
            <motion.div
              style={{ scale: imageScale }}
              className="
                absolute inset-0 will-change-transform
              "
            >
              {/* Automatic crossfade carousel — all slides stacked, opacity swaps */}
              {heroSlides.map((slide, index) => (
                <motion.div
                  key={slide.src}
                  initial={false}
                  animate={{ opacity: index === activeIndex ? 1 : 0 }}
                  transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
                  className="
                    absolute inset-0 will-change-opacity
                  "
                  aria-hidden={index !== activeIndex}
                >
                  <Image
                    src={slide.src}
                    alt={slide.alt}
                    fill
                    priority={index === 0}
                    loading={index === 0 ? undefined : "lazy"}
                    sizes="102vw"
                    className="
                      object-cover
                    "
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Gradient overlay — darkens the image for text legibility */}
        <div
          className="
            bg-gradient-to-b from-black/50 via-black/20 to-black/60
            absolute inset-0 pointer-events-none
          "
        />

        {/* Subtle vignette */}
        <div
          className="
            bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(0,0,0,0.5)_100%)]
            absolute inset-0 pointer-events-none
          "
        />

        {/* ─── Carousel indicators ─── */}
        <div
          role="tablist"
          aria-label="Hero slideshow"
          className="
            z-20
            absolute bottom-6 left-1/2 -translate-x-1/2
            flex items-center gap-3
            px-4 py-2
            rounded-full
            bg-black/30 backdrop-blur-sm
          "
        >
          {heroSlides.map((slide, index) => (
            <button
              key={slide.src}
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`
                h-2.5 rounded-full transition-all duration-500
                ${
                  index === activeIndex
                    ? "w-8 bg-white"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }
              `}
            />
          ))}
        </div>

        {/* ─── Content stack ─── */}
        <div
          className="
            z-10 flex flex-col
            h-full
            px-6 pt-20
            relative justify-center
            md:px-20 md:pt-24
          "
        >
          <div
            className="
              max-w-5xl
            "
          >
            {/* Eyebrow tagline */}
            <h1
              className="
                w-fit
                px-6 py-2 mb-4
                font-mono text-lg font-extrabold tracking-[0.1em] text-white
                bg-primary
                display-inline uppercase
                rounded-lg
              "
            >
              Top Construction and Cost Estimation Firm in US
            </h1>

            {/* Magazine-cover headline — two lines max */}
            <h2
              className="
                font-space text-white text-[clamp(2.75rem,11vw,7rem)] font-black leading-[0.9] tracking-tighter
              "
            >
              Stop Losing Bids
            </h2>

            {/* Supporting copy */}
            <p
              className="
                max-w-xl
                mt-6
                font-sans text-white/80 text-[clamp(0.95rem,1.5vw,1.5rem)] leading-relaxed
              "
            >
              Accurate AACE Class&nbsp;3 estimates and material takeoffs,
              delivered in 24 to 48 hours. Win more work with precise, 
              estimation numbers.
            </p>

            {/* CTAs */}
            <div
              className="
                flex flex-col
                mt-10
                items-start gap-x-10 gap-y-4
                md:flex-row
              "
            >
              <button
                onClick={() =>
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="
                  inline-flex
                  px-8 py-4
                  font-mono text-xl font-bold tracking-wider text-white/90
                  bg-transparent
                  border border-white/30
                  transition-all
                  group items-center gap-2 uppercase hover:border-white hover:text-white bracket-corners
                "
              >
                See Our Work
              </button>
              <Link
                href="/calculator"
                className="
                  inline-flex
                  px-10 py-4
                  font-mono text-xl font-bold tracking-wider text-white
                  bg-primary
                  border-2 border-primary
                  transition-all
                  group items-center gap-2 uppercase hover:bg-transparent hover:text-primary bracket-corners
                "
              >
                <span>Bid Better</span>
                <span
                  className="
                    inline-block
                    transition-transform
                    group-hover:translate-x-1
                  "
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Marquee ticker ─── */}
      <div
        className="
          overflow-hidden
          py-3.5
          text-white
          bg-primary
          border-y border-on-background
          select-none
          relative shrink-0
        "
      >
        <div
          className="
            font-mono text-sm font-bold tracking-widest
            marquee-track uppercase
          "
        >
          <span
            className="
              marquee-content
            "
          >
            &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
            &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
            INTEGRATION &spades;
          </span>
          <span
            aria-hidden="true"
            className="
              marquee-content
            "
          >
            &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
            &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
            INTEGRATION &spades;
          </span>
        </div>
      </div>
    </>
  );
}
