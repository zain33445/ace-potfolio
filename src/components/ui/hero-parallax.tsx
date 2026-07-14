"use client";
import React, { useRef, useState } from "react";
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* ── lighter springs = less per-frame physics overhead ── */
  const springConfig = { stiffness: 150, damping: 20, bounce: 0 };

  const translateXDesktop = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 800]),
    springConfig
  );
  const translateXReverseDesktop = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -800]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [12, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [0.75, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [15, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [-500, 80]),
    springConfig
  );

  /* ── Pause marquee while scrolling ── */
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useMotionValueEvent(scrollYProgress, 'change', () => {
    setIsScrolling(true);
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => setIsScrolling(false), 800);
  });

  /* ── Mobile: header text on top, image marquee below ── */
  if (isMobile) {
    const half = Math.ceil(products.length / 2);
    const rowA = products.slice(0, half);
    const rowB = products.slice(half);

    const marqueeCard = (product: HeroParallaxProduct) => (
      <a
        href={product.link}
        className="block relative rounded-none overflow-hidden h-36 w-44 shrink-0"
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          loading="lazy"
          decoding="async"
          className="object-cover object-left-top absolute h-full w-full inset-0 grayscale"
          alt={product.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 z-10">
          <h2 className="text-white font-bold text-[10px] font-space leading-tight">
            {product.title}
          </h2>
          {product.subtitle && (
            <p className="text-white/70 text-[8px] font-mono mt-0.5">
              {product.subtitle}
            </p>
          )}
        </div>
      </a>
    );

    return (
      <div className="antialiased relative">
        {/* Hero card — exactly viewport height, centered */}
        <section className="h-screen grid place-items-center px-04">
          <Header h1={headerH1} h2={headerH2} h3={headerH3} />
        </section>
        {/* Marquee rows — below viewport, visible on scroll */}
        <div className="flex flex-col gap-3 pb-10 px-4">
          {/* Row 1 — scrolls left */}
          <div className="image-marquee-track">
            <div className="image-marquee-content pr-3">
              {rowA.map((p, i) => (
                <span key={`a-${i}`}>{marqueeCard(p)}</span>
              ))}
            </div>
            <div className="image-marquee-content pr-3" aria-hidden="true">
              {rowA.map((p, i) => (
                <span key={`ad-${i}`}>{marqueeCard(p)}</span>
              ))}
            </div>
          </div>
          {/* Row 2 — scrolls right */}
          <div className="image-marquee-track">
            <div className="image-marquee-content image-marquee-content--reverse pr-3">
              {rowB.map((p, i) => (
                <span key={`b-${i}`}>{marqueeCard(p)}</span>
              ))}
            </div>
            <div className="image-marquee-content image-marquee-content--reverse pr-3" aria-hidden="true">
              {rowB.map((p, i) => (
                <span key={`bd-${i}`}>{marqueeCard(p)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Desktop: rows fill the container, header is sticky and centered ── */
  return (
    <section
      ref={ref}
      className="relative h-[212.5vh]"
    >
      {/* Header: sticky at top, centered in the viewport */}
      <div className="sticky top-0 h-screen flex items-center justify-center z-20 px-4">
        <Header h1={headerH1} h2={headerH2} h3={headerH3} />
      </div>
      {/* Rows: absolutely positioned, fill entire section behind header */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-[#F5F5F5] [perspective:1000px] [transform-style:preserve-3d]">
        <motion.div
          style={{
            rotateX,
            rotateZ,
            translateY,
            opacity,
          }}
          className="pt-[80vh]"
        >
          {/* Row 1 — marquee left */}
          <div className="overflow-hidden mb-20 pl-10">
            <div className={`flex flex-row space-x-20 marquee-desktop-content ${isScrolling ? 'marquee-paused' : ''}`}>
              {firstRow.map((product) => (
                <ProductCard
                  product={product}
                  translate={translateXDesktop}
                  key={product.title}
                  fetchPriority="high"
                />
              ))}
              {firstRow.map((product) => (
                <ProductCard
                  product={product}
                  translate={translateXDesktop}
                  key={`d1-${product.title}`}
                  fetchPriority="high"
                />
              ))}
            </div>
          </div>

          {/* Row 2 — marquee right */}
          <div className="overflow-hidden mb-20 pl-10">
            <div className={`flex flex-row space-x-20 marquee-desktop-content marquee-desktop-content--reverse ${isScrolling ? 'marquee-paused' : ''}`}>
              {secondRow.map((product) => (
                <ProductCard
                  product={product}
                  translate={translateXReverseDesktop}
                  key={product.title}
                  fetchPriority="low"
                />
              ))}
              {secondRow.map((product) => (
                <ProductCard
                  product={product}
                  translate={translateXReverseDesktop}
                  key={`d2-${product.title}`}
                  fetchPriority="low"
                />
              ))}
            </div>
          </div>

          {/* Row 3 — marquee left */}
          <div className="overflow-hidden mb-20 pl-10">
            <div className={`flex flex-row space-x-20 marquee-desktop-content ${isScrolling ? 'marquee-paused' : ''}`}>
              {thirdRow.map((product) => (
                <ProductCard
                  product={product}
                  translate={translateXDesktop}
                  key={product.title}
                  fetchPriority="low"
                />
              ))}
              {thirdRow.map((product) => (
                <ProductCard
                  product={product}
                  translate={translateXDesktop}
                  key={`d3-${product.title}`}
                  fetchPriority="low"
                />
              ))}
            </div>
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
}: {
  h1?: string;
  h2?: string;
  h3?: string;
}) => {
  const subhead = [h2, h3].filter(Boolean).join(' ');
  return (
    <div className="w-4/5 max-w-[900px] min-[2000px]:max-w-[1200px] mx-auto px-10 pt-10 pb-15 bg-[rgba(255, 255, 255, 0.45)] border border-2 border-blueprint-line relative z-10 shadow-[0_20px_80px_-12px_rgba(0,0,0,0.08)] bracket-corners-lg liquid-glass">
      <h1 
        className="font-sans text-[1.25rem] font-extrabold  uppercase leading-[1.1] tracking-wider text-[#FF6B00] text-center mb-10  decoration-primary decoration-[6px] underline-offset-[10px]">
          <TextGenerateEffect words={ 'Top Construction Estimating Services in the US'} duration={5}/>
      </h1>
      <h1 
      className="font-sans text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tighter text-[#111827] text-center my-5  decoration-primary decoration-[6px] underline-offset-[10px]">
        {h1 ?? "Construction Pre-Estimation"}
      </h1>
      {subhead && (
        <div className="font-sans text-[clamp(1.1rem,2vw,1.35rem)] leading-relaxed text-[#4B5563] mx-auto px-5 text-center ">
          <br />
          <span style={{ fontWeight: 'bold', fontSize: '1.40rem', color: '#111827' }}><TextGenerateEffect words={h2 ?? ''} sub={h3 ?? ''} /></span>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-center gap-x-10 gap-y-3 mt-10">
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
        <button className="text-[#111827] font-medium text-sm underline underline-offset-10 decoration-primary decoration-2 order-2 md:order-1">
          See Our Work
        </button>
      </div>
      
            <p className="text-center text-[#000] font-medium mt-11">
        <span style={{background: '#1d1d1d6b', padding: '5px', color: 'white', fontWeight: 'bold', borderRadius: '.5rem'}}>✓ Trusted by 200+ Contractors</span> | 
        <span style={{color: '#FF6B00', fontWeight: 'bold', fontSize: '1.2rem'}}> ✓ </span>Residential & Commercial Projects | 
        <span style={{color: '#FF6B00', fontWeight: 'bold', fontSize: '1.2rem'}}> ✓ </span>24-48 Hour Turnaround
      </p>
    </div>
  );
}


/* ──────────────────────────────────────────────────────────────────
   ProductCard — lightweight card with image priority hints
   ────────────────────────────────────────────────────────────────── */
export const ProductCard = ({
  product,
  translate,
  fetchPriority,
  isMobile = false,
}: {
  product: HeroParallaxProduct;
  translate?: MotionValue<number>;
  /** Browser image fetch priority hint. Omit for default. */
  fetchPriority?: "high" | "low";
  /** Mobile layout — static grid card, grayscale, always-visible overlay. */
  isMobile?: boolean;
}) => {
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
            <p className="text-white/70 text-[8px] font-mono mt-0.5">
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
