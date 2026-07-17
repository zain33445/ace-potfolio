"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  MotionValue,
} from "motion/react";
import { TypewriterEffectSmooth } from "@/components/ui/typewriter-effect";
import { TextGenerateEffect } from "./text-generate-effect";

export interface HeroParallaxProduct {
  title: string;
  subtitle?: string;
  link: string;
  thumbnail: string;
}

/* ── SSR-safe media query via useSyncExternalStore (React 18+) ── */
function useMediaQuery(query: string): boolean {
  return React.useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false, // SSR snapshot — render desktop layout on server
  );
}

export const HeroParallax = ({
  products,
  headerH1,
  headerH2,
  headerH3,
}: {
  products: HeroParallaxProduct[];
  headerH1?: string;
  headerH2?: string;
  headerH3?: string;
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { scrollYProgress } = useScroll({
    target: mounted ? ref : undefined,
    offset: ["start start", "end start"],
  });

  const springConfig = { stiffness: 150, damping: 20, bounce: 0 };

  // 1. Adjusted translations to work better with the / slant
  const translateXDesktop = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );
  const translateXReverseDesktop = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );

  // 2. The key changes: Negative rotateZ creates the "/" slant
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [30, 0]), 
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [-30, 0]), // Negative values for "/"
    springConfig
  );
  
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.5, 1]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [50, 1000]),
    springConfig
  );

  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', () => {
    setIsScrolling(true);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 800);
  });

  if (isMobile) {
    // ... (Mobile code remains the same)
    return (
        <div className="antialiased relative">
          <section className="h-screen grid place-items-center px-4 relative overflow-hidden bg-black">
            <video autoPlay loop muted playsInline preload="metadata" className="absolute inset-0 w-full h-full object-cover z-0" src="/mobile-video-header.mp4" />
            <div className="absolute inset-0 bg-black/40 z-[1]" />
            <div className="relative z-10">
              <Header h1={headerH1} h2={headerH2} h3={headerH3} mobile />
            </div>
          </section>
        </div>
      );
  }

  return (
    <section
      ref={ref}
      className="relative h-[240vh] " // Slightly taller for better scroll feel
    >
      <div className="sticky top-40 h-screen flex items-start justify-start z-20 px-20 pointer-events-none">
        <Header h1={headerH1} h2={headerH2} h3={headerH3} />
      </div>
      
      <div className="absolute inset-[0px] z-0 overflow-hidden bg-[#F5F5F5] [perspective:500px] [transform-style:preserve-3d]">
        <motion.div
          style={{
            rotateX,
            rotateZ, // This now applies the "/" slant
            translateY,
            opacity,
          }}
          className="pt-[15vh]"
        >
          {/* Row 1 — visually reversed via array order, flex-row for correct marquee looping */}
          <div className="flex flex-row space-x-8 mb-8 marquee-desktop-content ">
            {[...firstRow].reverse().map((product) => (
              <ProductCard
                product={product}
                translate={translateXDesktop}
                key={product.title}
                // rotateZ={rotateZ}
              />
            ))}
            {[...firstRow].reverse().map((product) => (
              <ProductCard
                product={product}
                translate={translateXDesktop}
                key={`${product.title}-dup`}
                // rotateZ={rotateZ}
              />
            ))}
          </div>

          {/* Row 2 */}
          <div className="flex flex-row space-x-8 mb-8 marquee-desktop-content marquee-desktop-content--reverse">
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverseDesktop}
                key={product.title}
                // rotateZ={rotateZ}
              />
            ))}
            {secondRow.map((product) => (
              <ProductCard
                product={product}
                translate={translateXReverseDesktop}
                key={`${product.title}-dup`}
                // rotateZ={rotateZ}
              />
            ))}
          </div>

          {/* Row 3 — visually reversed via array order, flex-row for correct marquee looping */}
          <div className="flex flex-row space-x-8 mb-8 marquee-desktop-content " >
            {[...thirdRow].reverse().map((product) => (
              <ProductCard
                product={product}
                translate={translateXDesktop}
                key={product.title}
                // rotateZ={rotateZ}
              />
            ))}
            {[...thirdRow].reverse().map((product) => (
              <ProductCard
                product={product}
                translate={translateXDesktop}
                key={`${product.title}-dup`}
                // rotateZ={rotateZ}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export const Header = ({
  h1,
  h2,
  h3,
  mobile = false,
}: {
  h1?: string;
  h2?: string;
  h3?: string;
  mobile?: boolean;
}) => {
  const subhead = [h2, h3].filter(Boolean).join(' ');
  return (
    <div 
    // className={`w-[92%] md:w-4/5 max-w-[900px] px-2 md:px-2 pt-6 md:pt-10 pb-8 md:pb-15 relative z-10 ${mobile ? '' : 'bg-[rgba(255,255,255,0.45)] border border-2 border-blueprint-line shadow-[0_20px_80px_-12px_rgba(0,0,0,0.08)] bracket-corners-lg liquid-glass'}`}>
    className={`w-[92%] md:w-4/5 max-w-[900px] md:px-2 md:pt-10 pb-8 md:pb-15 relative z-10 ${mobile ? '' : 'bg-[rgba(255,255,255,0.45)] border border-2 border-blueprint-line shadow-[0_20px_80px_-12px_rgba(0,0,0,0.08)] bracket-corners-lg liquid-glass'}`}>
      <h1 
        className={`font-sans text-base md:text-lg px-10 font-extrabold uppercase leading-[1.1] tracking-wider text-left mb-10 decoration-primary decoration-[6px] underline-offset-[10px] ${mobile ? 'text-white' : 'text-[#FF6B00]'}`}>
          <TextGenerateEffect words={ 'Top Construction Estimating Services in the US'} duration={5}/>
      </h1>
      <h1 
      className={`font-sans text-[clamp(2.5rem,5vw,4rem)] px-10  font-extrabold leading-[1.1] tracking-tighter text-left mt-5 decoration-primary decoration-[6px] underline-offset-[10px] ${mobile ? 'text-white' : 'text-[#111827]'}`}>
        {h1 ?? "Construction Pre-Estimation"}
      </h1>
      {subhead && (
        <div className={`font-sans text-[clamp(1.1rem,2vw,1.35rem)] px-10 leading-relaxed mx-auto text-left ${mobile ? 'text-white/90' : 'text-[#4B5563]'}`}>
          <br />
          <span style={{ fontWeight: 'bold', color: mobile ? 'white' : '#111827' }}><TextGenerateEffect words={h2 ?? ''} sub={h3 ?? ''} subColor={mobile ? 'white' : '#111827'} /></span>
        </div>
      )}

      
            <p className={`text-left font-medium mt-8 md:mt-11 px-10 text-xs md:text-sm leading-relaxed ${mobile ? 'text-white' : 'text-[#000]'}`}>
        <span style={{background: '#1d1d1d6b', padding: '5px', color: 'white', fontWeight: 'bold', borderRadius: '.5rem'}}>✓ Trusted by 200+ Contractors</span>
        <br className="md:hidden" />
        <span className="hidden md:inline mx-2">|</span>
        <span style={{color: '#FF6B00', fontWeight: 'bold'}}> ✓ </span>Residential & Commercial Projects
        <br className="md:hidden" />
        <span className="hidden md:inline mx-2">|</span>
        <span style={{color: '#FF6B00', fontWeight: 'bold'}}> ✓ </span>24-48 Hour Turnaround
      </p>

      <div className="flex flex-col md:flex-row items-center px-10 justify-start gap-x-10 gap-y-3 mt-10">
        {/* Bid Better — first on mobile (top), second on desktop (right) */}
        <button
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
          className="relative bg-primary text-white font-bold px-8 py-3 rounded-lg text-xl group order-1 md:order-2">
          <img
            src="/bid_icon.png"
            alt=""
            className="absolute top-1/2 left-1/2 w-8 h-8 brightness-0 invert z-10 pointer-events-none
                       -translate-x-[calc(50%+100px)] -translate-y-1/2 opacity-0
                       group-hover:-translate-x-1/2 group-hover:opacity-100
                       transition-all duration-300"
          />
          <span className="block overflow-hidden">
            <span className="inline-block group-hover:translate-y-full group-hover:opacity-0 transition-all duration-300">
              Bid Better
            </span>
          </span>
        </button>
        {/* See Our Work — second on mobile (bottom), first on desktop (left) */}
        <button className={`font-medium text-sm underline underline-offset-10 decoration-primary decoration-2 order-2 md:order-1 ${mobile ? 'text-white' : 'text-[#111827]'}`}>
          See Our Work
        </button>
      </div>
    </div>
  );
}


/* ──────────────────────────────────────────────────────────────────
   ProductCard — lightweight card with image priority hints
   ────────────────────────────────────────────────────────────────── */
export const ProductCard = ({
  product,
  translate,
  rotateZ,
  fetchPriority,
  isMobile = false,
}: {
  product: HeroParallaxProduct;
  translate?: MotionValue<number>;
  rotateZ?: MotionValue<number>;
  /** Browser image fetch priority hint. Omit for default. */
  fetchPriority?: "high" | "low";
  /** Mobile layout — static grid card, grayscale, always-visible overlay. */
  isMobile?: boolean;
}) => {
  const counterRotate = useTransform(rotateZ || new MotionValue(0), (val) => -val);

  /* ── Mobile: static grid card ── */
  if (isMobile) {
    return (
      <a
        href={product.link}
        className="block relative rounded-none overflow-hidden aspect-[4/3]"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          loading="lazy"
          decoding="async"
          fetchPriority={fetchPriority}
          className="object-cover object-left-top absolute h-full w-full inset-0 grayscale"
          alt={product.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 z-10">
          <h2 className="text-white font-bold text-[10px] font-space leading-tight">
            {product.title}
          </h2>
          {product.subtitle && (
            <p className="text-white/70 text-[10px] font-mono mt-0.5">
              {product.subtitle}
            </p>
          )}
        </div>
      </a>
    );
  }

  /* ── Desktop: parallax card with hover interactions (unchanged) ── */
  return (
    <motion.div
      style={{
        x: translate,
         rotateZ: counterRotate

      }}
      whileHover={{
        y: -30,
        zIndex: 50,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
      key={product.title}
      className="group/product h-80 w-[26rem] relative shrink-0 z-10"
    >
      <a
        href={product.link}
        className="block group-hover/product:shadow-2xl"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          loading="lazy"
          decoding="async"
          fetchPriority={fetchPriority}
          className="object-cover object-left-top absolute h-full w-full inset-0 rounded-none  group-hover/product:grayscale-0 transition-all duration-300"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none transition-opacity duration-300" />
      <div className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
        <h2 className="text-white font-bold text-sm font-space">{product.title}</h2>
        {product.subtitle && (
          <p className="text-white/70 text-xs font-mono mt-1">{product.subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};
