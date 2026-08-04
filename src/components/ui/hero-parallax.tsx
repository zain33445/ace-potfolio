"use client";
import React, { useMemo, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  MotionValue,
} from "motion/react";
import { TextGenerateEffect } from "./text-generate-effect";

export interface HeroParallaxProduct {
  title: string;
  subtitle?: string;
  link: string;
  thumbnail: string;
}

/* ── Shared spring config (stable reference, no per-render allocation) ── */
const springConfig = { stiffness: 150, damping: 20, bounce: 0 };

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
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);
  const reversedFirstRow = useMemo(() => [...firstRow].reverse(), [products]);
  const reversedThirdRow = useMemo(() => [...thirdRow].reverse(), [products]);
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: typeof window !== "undefined" ? ref : undefined,
    offset: ["start start", "end start"],
  });

  // 1. Adjusted translations to work better with the / slant
  // Derive reverse from forward — saves one spring physics loop
  const translateXDesktop = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig,
  );
  const translateXReverseDesktop = useTransform(translateXDesktop, (v) => -v);

  // 2. The key changes: Negative rotateZ creates the "/" slant
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [30, 0]),
    springConfig,
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [-30, 0]), // Negative values for "/"
    springConfig,
  );

  // Opacity — no spring needed; scroll progress is already smooth enough for alpha
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.5, 1]);
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [50, 1000]),
    springConfig,
  );

  // Grayscale: fully desaturated at top → full color by scrollYProgress ~0.3
  // Clamp so values stay within [0,1] — never produce grayscale(-N%)
  const imageGrayscale = useTransform(scrollYProgress, [0, 0.3], [1, 0], {
    clamp: true,
  });

  const headingOpacity = useSpring(
    useTransform(scrollYProgress, [0.12, 0.35], [0, 1]),
    springConfig,
  );
  const headingY = useSpring(
    useTransform(scrollYProgress, [0.12, 0.35], [30, 0]),
    springConfig,
  );

  // Shared counter-rotation — avoids 30 individual useTransform hooks in ProductCard
  const counterRotate = useTransform(rotateZ, (val) => -val);

  return (
    <div
      className="
        antialiased relative
      "
    >
      {/* ── Mobile: video header (CSS-toggled, no React conditional) ── */}
      <div
        className="
          md:hidden
        "
      >
        <section
          className="
            grid overflow-hidden
            h-screen
            bg-black
            place-items-center relative
          "
        >
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src="/mobile-video-header.mp4"
            className="
              object-cover z-0
              w-full h-full
              absolute inset-0
            "
          />
          <div
            className="
              z-[1]
              bg-black/40
              absolute inset-0
            "
          />
          <div
            className="
              z-10
              relative
            "
          >
            <Header h1={headerH1} h2={headerH2} h3={headerH3} mobile />
          </div>
        </section>
      </div>

      {/* ── Desktop: 240vh parallax section (CSS-toggled, no React conditional) ── */}
      <div
        className="
          hidden
          md:block
        "
      >
        <section
          ref={ref}
          className="
            h-[240vh]
            relative
          "
        >
          <div
            className="
              flex z-20
              h-screen
              px-20
              pointer-events-none
              sticky top-40 items-start justify-start
            "
          >
            <Header h1={headerH1} h2={headerH2} h3={headerH3} />
          </div>

          <motion.div
            style={{ opacity: headingOpacity, y: headingY }}
            className="
              z-10 flex flex-col
              px-20
              text-center
              pointer-events-none
              sticky top-[30vh] items-center justify-center
            "
          >
            <h2
              className="
                font-sans text-[clamp(2rem,4vw,3.5rem)] font-extrabold text-center text-[#111827] leading-tight
              "
            >
              Our Estimation Projects
            </h2>
            <p
              className="
                mt-4
                font-sans text-[clamp(0.9rem,1.5vw,1.1rem)] text-center text-[#374151]
              "
            >
              Click IMG to Open Project
            </p>
          </motion.div>

          <div
            className="
              z-0 overflow-hidden
              bg-[#F5F5F5]
              absolute inset-[0px] [perspective:500px] [transform-style:preserve-3d]
            "
          >
            <motion.div
              style={{
                rotateX,
                rotateZ, // This now applies the "/" slant
                translateY,
                opacity,
              }}
              className="
                pt-[15vh]
                will-change-transform
              "
            >
              {/* Row 1 — first visible row: load with high priority (LCP driver) */}
              <div
                className="
                  flex flex-row
                  space-x-8 mb-8
                  marquee-desktop-content
                "
              >
                {reversedFirstRow.map((product) => (
                  <ProductCard
                    product={product}
                    translate={translateXDesktop}
                    scrollGrayscale={imageGrayscale}
                    fetchPriority="high"
                    loading="eager"
                    key={product.title}
                  />
                ))}
                {reversedFirstRow.map((product) => (
                  <ProductCard
                    product={product}
                    translate={translateXDesktop}
                    scrollGrayscale={imageGrayscale}
                    fetchPriority="high"
                    loading="eager"
                    key={`${product.title}-dup`}
                  />
                ))}
              </div>

              {/* Row 2 — midway, use low priority to avoid competing with LCP */}
              <div
                className="
                  flex flex-row
                  space-x-8 mb-8
                  marquee-desktop-content marquee-desktop-content--reverse
                "
              >
                {secondRow.map((product) => (
                  <ProductCard
                    product={product}
                    translate={translateXReverseDesktop}
                    scrollGrayscale={imageGrayscale}
                    fetchPriority="low"
                    key={product.title}
                  />
                ))}
                {secondRow.map((product) => (
                  <ProductCard
                    product={product}
                    translate={translateXReverseDesktop}
                    scrollGrayscale={imageGrayscale}
                    fetchPriority="low"
                    key={`${product.title}-dup`}
                  />
                ))}
              </div>

              {/* Row 3 — deepest scroll row, low priority */}
              <div
                className="
                  flex flex-row
                  space-x-8 mb-8
                  marquee-desktop-content
                "
              >
                {reversedThirdRow.map((product) => (
                  <ProductCard
                    product={product}
                    translate={translateXDesktop}
                    scrollGrayscale={imageGrayscale}
                    fetchPriority="low"
                    key={product.title}
                  />
                ))}
                {reversedThirdRow.map((product) => (
                  <ProductCard
                    product={product}
                    translate={translateXDesktop}
                    scrollGrayscale={imageGrayscale}
                    fetchPriority="low"
                    key={`${product.title}-dup`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
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
  return (
    <div
      className={`
        z-10
        relative
        font-sans
        pb-8 px-10
        w-[100%] max-w-[900px]
        display-flex flex-col items-center justify-center gap-y-2  m-auto
        text-white
        md:w-4/5 md:px-2 md:pt-10 md:pb-15
      `}
    >
      <h1
        className={`
          p-1
          w-fit
          text-white
          rounded-md
          bg-primary
          text-md font-normal leading-[1.1] text-left
          ${mobile ? "text-white mt-1" : "text-[#FF6B00] mt-5"}
          decoration-primary decoration-[6px] underline-offset-[10px]
        `}
      >
        {h1 ?? "Construction Pre-Estimation"}
      </h1>

          <h2
            className={`
              my-5
              text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[1.1] tracking-tighter text-left
              decoration-primary decoration-[6px] underline-offset-[10px]
            `}
          >
            <TextGenerateEffect words={h2 || 'heading'} duration={5} />
          </h2>

        <div
          className={`
            mx-auto mt-1
            text-justified text-[clamp(1rem,1.5vw,1.25rem)] leading-relaxed text-left
            text-white
          `}
        >
          <TextGenerateEffect words={h3 || 'description'} duration={5} />
        </div>

      <p
        className={`
          mt-8 px-6
          text-center font-medium text-xs leading-relaxed text-white
          md:mt-11 md:px-10 md:text-sm
        `}
      >
        <span
          style={{
            background: "#1d1d1d6b",
            padding: "5px",
            color: "white",
            fontWeight: "bold",
            borderRadius: ".5rem",
            textAlign: "center",
          }}
        >
          ✓ Trusted by 200+ Contractors
        </span>
        <br
          className="
            md:hidden
          "
        />
        <span
          className="
            hidden
            mx-2
            md:inline
          "
        >
          |
        </span>
        <span style={{ color: "#FF6B00", fontWeight: "bold" }}> ✓ </span>
        Residential & Commercial Projects
        <br
          className="
            md:hidden
          "
        />
        <span
          className="
            hidden
            mx-2
            md:inline
          "
        >
          |
        </span>
        <span style={{ color: "#FF6B00", fontWeight: "bold" }}> ✓ </span>24-48
        Hour Turnaround
      </p>

      <div
        className="
          flex flex-col
          px-10 mt-10
          text-white
          items-center justify-start gap-x-10 gap-y-3
          md:flex-row
        "
      >
        {/* Bid Better — first on mobile (top), second on desktop (right) */}
        <button
          onClick={() =>
            document
              .getElementById("contact")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="
            order-1
            px-8 py-3
            text-white font-bold text-xl
            bg-primary
            rounded-lg
            relative group
            md:order-2
          "
        >
          <img
            src="/bid_icon.png"
            alt=""
            className="
              z-10
              w-8 h-8
              pointer-events-none opacity-0 transition-all
              absolute top-1/2 left-1/2 brightness-0 invert -translate-x-[calc(50%+100px)] -translate-y-1/2 group-hover:-translate-x-1/2 group-hover:opacity-100 duration-300
            "
          />
          <span
            className="
              block overflow-hidden
            "
          >
            <span
              className="
                inline-block
                transition-all
                group-hover:translate-y-full group-hover:opacity-0 duration-300
              "
            >
              Bid Better
            </span>
          </span>
        </button>
        {/* See Our Work — second on mobile (bottom), first on desktop (left) */}
        <button
          className={`
            order-2
            font-medium text-sm
            underline underline-offset-10 decoration-primary decoration-2
            md:order-1
          `}
        >
          See Our Work
        </button>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────
   ProductCard — lightweight card with image priority hints
   ────────────────────────────────────────────────────────────────── */
export const ProductCard = ({
  product,
  translate,
  counterRotate,
  fetchPriority,
  loading = "lazy",
  isMobile = false,
  scrollGrayscale,
}: {
  product: HeroParallaxProduct;
  translate?: MotionValue<number>;
  counterRotate?: MotionValue<number>;
  /** Browser image fetch priority hint. Omit for default. */
  fetchPriority?: "high" | "low";
  /** Image loading strategy — use "eager" for above-the-fold cards. */
  loading?: "lazy" | "eager";
  /** Mobile layout — static grid card, grayscale, always-visible overlay. */
  isMobile?: boolean;
  /** Scroll-driven grayscale factor: 1 = fully desaturated, 0 = full color */
  scrollGrayscale?: MotionValue<number>;
}) => {
  /* ── Derive the CSS filter string from the scroll-based grayscale ── */
  const grayscaleFilter = useTransform(
    scrollGrayscale ?? useMotionValue(0),
    (latest) => {
      const pct = Math.round(latest * 100);
      // No filter at full color — avoids browser filter pipeline artifacts
      if (pct <= 0) return "none";
      return `grayscale(${pct}%)`;
    },
  );
  /* ── Mobile: static grid card ── */
  if (isMobile) {
    return (
      <a
        href={product.link}
        className="
          block overflow-hidden
          rounded-none
          relative aspect-[4/3]
        "
      >
        <img
          src={product.thumbnail}
          height="600"
          width="600"
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          alt={product.title}
          className="
            object-cover object-left-top
            h-full w-full
            absolute inset-0 grayscale
          "
        />
        <div
          className="
            bg-gradient-to-t from-black/60 via-black/10 to-transparent
            absolute inset-0
          "
        />
        <div
          className="
            z-10
            absolute bottom-2 left-2 right-2
          "
        >
          <h2
            className="
              text-white font-bold text-[10px] font-space leading-tight
            "
          >
            {product.title}
          </h2>
          {product.subtitle && (
            <p
              className="
                mt-0.5
                text-white/70 text-[10px] font-mono
              "
            >
              {product.subtitle}
            </p>
          )}
        </div>
      </a>
    );
  }

  /* ── Desktop: parallax card with hover interactions ── */
  return (
    <motion.div
      style={{
        x: translate,
        rotateZ: counterRotate,
      }}
      whileHover={{
        y: -30,
        zIndex: 50,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
      key={product.title}
      className="
        z-10
        h-80 w-[26rem]
        group/product relative shrink-0 will-change-transform
      "
    >
      <a
        href={product.link}
        className="
          block
          group-hover/product:shadow-2xl
        "
      >
        <motion.img
          src={product.thumbnail}
          height="600"
          width="600"
          loading={loading}
          decoding="async"
          fetchPriority={fetchPriority}
          style={{ filter: grayscaleFilter }}
          whileHover={{
            filter: "none",
            transition: { duration: 0.3 },
          }}
          alt={product.title}
          className="
            object-cover object-left-top
            h-full w-full
            rounded-none
            absolute inset-0
          "
        />
      </a>
      <div
        className="
          h-full w-full
          bg-black
          opacity-0 pointer-events-none transition-opacity
          absolute inset-0 group-hover/product:opacity-80 duration-300
        "
      />
      <div
        className="
          opacity-0 transition-opacity
          absolute bottom-4 left-4 group-hover/product:opacity-100 duration-300
        "
      >
        <h2
          className="
            text-white font-bold text-sm font-space
          "
        >
          {product.title}
        </h2>
        {product.subtitle && (
          <p
            className="
              mt-1
              text-white/70 text-xs font-mono
            "
          >
            {product.subtitle}
          </p>
        )}
      </div>
    </motion.div>
  );
};
