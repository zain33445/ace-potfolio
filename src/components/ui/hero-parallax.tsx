"use client";
import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  MotionValue,
} from "motion/react";

export interface HeroParallaxProduct {
  title: string;
  subtitle?: string;
  link: string;
  thumbnail: string;
}

export const HeroParallax = ({
  products,
  headerTitle,
  headerDescription,
}: {
  products: HeroParallaxProduct[];
  headerTitle?: string;
  headerDescription?: string;
}) => {
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

  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 800]),
    springConfig
  );
  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -800]),
    springConfig
  );
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [12, 0]),
    springConfig
  );
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [0.3, 1]),
    springConfig
  );
  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [15, 0]),
    springConfig
  );
  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.25], [-500, 400]),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="h-[175vh] py-24 md:py-40 overflow-hidden antialiased relative flex flex-col self-auto [perspective:1000px] [transform-style:preserve-3d] will-change-transform"
    >
      <Header title={headerTitle} description={headerDescription} />
      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
      >
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20 mb-20">
          {firstRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row  mb-20 space-x-20 ">
          {secondRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateXReverse}
              key={product.title}
            />
          ))}
        </motion.div>
        <motion.div className="flex flex-row-reverse space-x-reverse space-x-20">
          {thirdRow.map((product) => (
            <ProductCard
              product={product}
              translate={translateX}
              key={product.title}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = ({
  title,
  description,
}: {
  title?: string;
  description?: string;
}) => {
  return (
    <div className="max-w-7xl relative mx-auto py-16 md:py-32 px-4 w-full left-0 top-0 z-10">
      <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-on-background font-space leading-tight">
        {title ?? "Construction Pre-Estimation"}
      </h1>
      <p className="max-w-2xl text-sm md:text-lg mt-6 text-on-surface-variant leading-relaxed">
        {description ??
          "Precision-engineered estimates across 35 states. We turn blueprints into actionable data so you win more bids."}
      </p>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────
   ProductCard — wrapped in will-change + native lazy loading
   ────────────────────────────────────────────────────────────────── */
export const ProductCard = ({
  product,
  translate,
}: {
  product: HeroParallaxProduct;
  translate: MotionValue<number>;
}) => {
  return (
    <motion.div
      style={{
        x: translate,
      }}
      whileHover={{
        y: -20,
      }}
      key={product.title}
      className="group/product h-80 w-[26rem] relative shrink-0 will-change-transform"
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
          className="object-cover object-left-top absolute h-full w-full inset-0"
          alt={product.title}
        />
      </a>
      <div className="absolute inset-0 h-full w-full opacity-0 group-hover/product:opacity-80 bg-black pointer-events-none" />
      <div className="absolute bottom-4 left-4 opacity-0 group-hover/product:opacity-100 transition-opacity duration-300">
        <h2 className="text-white font-bold text-sm font-space">{product.title}</h2>
        {product.subtitle && (
          <p className="text-white/70 text-xs font-mono mt-1">{product.subtitle}</p>
        )}
      </div>
    </motion.div>
  );
};
