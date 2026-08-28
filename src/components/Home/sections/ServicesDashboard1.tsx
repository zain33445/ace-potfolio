"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "motion/react";

/**
 * Asymmetric dashboard layout for the homepage's "Core Service Solutions"
 * section. Replaces the old scroll-driven SolutionAccordion.
 *
 * Desktop (lg+): 4-col / 2-row CSS grid —
 *   left CTA (full height) | Cost Estimating | Project Mgmt | 3D Renderings
 *                           |------ Designs (spans both middle cols) ------|
 *                                                            (full height)
 * Below lg: everything stacks in document order.
 *
 * Structural & Engineering has no card here by design — see conversation
 * history for the mockup this was wired from. Copy is hardcoded rather than
 * pulled from src/data/services.ts, matching the pattern already used in the
 * old SolutionAccordion defaults (WP content doesn't map to these slots yet).
 *
 * Photo cards (Cost Estimating, Project Management, Designs) use real photos
 * from /public named after the service. 3D Renderings uses an actual render
 * (public/3drendering.webp) instead of a placeholder illustration.
 *
 * Client component only because of the pointer parallax in useParallax() —
 * there is no data fetching here, so the cost is bundle size, not a waterfall.
 *
 * Card transition timing lives in globals.css (.services-grid .service-card),
 * NOT in a Tailwind `transition-*` utility: that rule is unlayered and would
 * override the utility anyway. See the comment there before adding a new
 * animated property to these cards.
 */

const panelBase =
  "group service-card relative flex flex-col justify-between overflow-hidden ";
const hoverBase = "hover:scale-[1.05] hover:shadow-2xl";

const ease = "ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Drifts the photo against the pointer for a shallow parallax. GSAP owns the
 * inner div's transform outright, so the CSS hover zoom sits on the wrapper
 * above it — sharing one element would make the two fight over `transform`.
 *
 * Rest scale is 1.02 and hover scale 1.05, which keeps at least 1% of
 * overscan on every edge at all times so a ±1.8% drift can never expose the
 * card background behind the photo.
 */
function useParallax() {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const bg = bgRef.current;
    if (!card || !bg) return;
    // The global prefers-reduced-motion block in globals.css only reaches CSS
    // transitions, so GSAP has to opt out on its own. Coarse pointers have no
    // hover state to parallax against.
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches
    )
      return;

    const xTo = gsap.quickTo(bg, "xPercent", { duration: 0.6, ease: "power3" });
    const yTo = gsap.quickTo(bg, "yPercent", { duration: 0.6, ease: "power3" });

    const move = (e: PointerEvent) => {
      const r = card.getBoundingClientRect();
      xTo(((e.clientX - r.left) / r.width - 0.5) * -3.6);
      yTo(((e.clientY - r.top) / r.height - 0.5) * -3.6);
    };
    const reset = () => {
      xTo(0);
      yTo(0);
    };

    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", reset);
    return () => {
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", reset);
      gsap.killTweensOf(bg);
    };
  }, []);

  return { cardRef, bgRef };
}

function PhotoBg({
  src,
  position = "center",
  bgRef,
}: {
  src: string;
  position?: string;
  bgRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      className={`absolute inset-0 scale-[1.02] transition-transform duration-550 ${ease} group-hover:scale-[1.06] group-focus-visible:scale-[1.06]`}
    >
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover"
        style={{
          backgroundImage: `url('${src}')`,
          backgroundPosition: position,
        }}
      />
    </div>
  );
}

// Solid backing behind text on photo cards — no full-image scrim, so the
// photo itself shows uncovered and unfiltered.
const plate = "self-start px-3 py-2.5";

// Dark gradient layered over the bottom of photo cards, for text legibility.
// Always on — the titles are white, so hiding this until hover leaves them
// unreadable against the bare photo. Hover climbs it up the card instead, so
// the eyebrow and description reveal onto backing that is already there.
const scrim =
  `absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none ` +
  `transition-[height] duration-550 ${ease} group-hover:h-full group-focus-visible:h-full`;

// Card copy reveals on hover via opacity + max-height. The scrim behind it is
// always on, so all three lines are legible at rest. Using opacity instead of
// `hidden`/`block` so the browser can actually interpolate the transition —
// display toggling is binary and cannot be animated.
const eyebrowIn =
  "mb-1 font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-primary " +
  "max-h-0 overflow-hidden opacity-0 " +
  "group-hover:max-h-5 group-hover:opacity-100 " +
  "transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]";

/**
 * Hover-triggered WordsPullUp — each word slides up and fades in with a
 * stagger, replacing the old CSS max-h/opacity description reveal.
 * Only mounts when hovered so it takes no layout space at rest.
 */
function HoverWordsPullUp({
  text,
  isHovered,
  className = "",
}: {
  text: string;
  isHovered: boolean;
  className?: string;
}) {
  const words = text.split(" ");

  const wordVariant = {
    hidden: { y: 14, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.04,
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <AnimatePresence>
      {isHovered && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className={`overflow-hidden ${className}`}
        >
          <div className="flex flex-wrap">
            {words.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={wordVariant}
                initial="hidden"
                animate="visible"
                className="pr-[0.3em]"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Card = {
  href: string;
  src: string;
  position: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Sizing, grid placement, and per-card border/background. */
  frame: string;
  titleSize: string;
};

const cards: Card[] = [
  {
    href: "/cost-estimating",
    src: "/cost.webp",
    position: "center 30%",
    eyebrow: "Estimating · Budgeting & Bidding",
    title: "Cost\nEstimation",
    description:
      "AACE Class 3 estimates, material takeoffs, and CSI cost breakdowns delivered in 24-48 hours.",
    frame:
      "h-64 justify-end border-blueprint-line bg-surface p-0 lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-2 lg:h-auto",
    titleSize: "text-5xl",
  },
  {
    href: "/mep-coordination",
    src: "/designs.webp",
    position: "center 35%",
    eyebrow: "MEP Coordination · BIM & Clash Detection",
    title: "Shop\nDrawings",
    description:
      "BIM-based MEP coordination, clash detection, and fabrication-ready shop drawings — helping teams resolve spatial conflicts before breaking ground.",
    frame:
      "h-64 justify-end border-blueprint-line bg-surface p-0 lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2 lg:h-auto",
    titleSize: "text-5xl",
  },
  {
    href: "/services/permit-sets",
    src: "/permit.webp",
    position: "center 25%",
    eyebrow: "Portfolio",
    title: "Permit Sets",
    description:
      "Renderings, shop drawings, and permit sets from delivered projects.",
    frame:
      "h-64 justify-end border-blueprint-line bg-surface p-0 lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3 lg:h-auto",
    titleSize: "text-6xl",
  },
  {
    href: "/architectural-services",
    src: "/3drendering.webp",
    position: "center 60%",
    eyebrow: "Architectural · Documentation & Visualization",
    title: "3D\nRenderings",
    description:
      "Photorealistic 3D renderings, shop drawings, and permit sets — built to support permitting, coordination, and stakeholder presentation.",
    frame:
      "h-72 justify-end border-[rgba(255,107,0,0.22)] bg-ink text-white lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-3 lg:h-auto",
    titleSize: "text-7xl",
  },
];

function ServiceCard({ card }: { card: Card }) {
  const { cardRef, bgRef } = useParallax();
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={cardRef}
      href={card.href}
      className={`${panelBase} ${hoverBase} ${card.frame}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <PhotoBg src={card.src} position={card.position} bgRef={bgRef} />
      <div className={scrim} />
      <div className={`${plate} relative z-10`}>
        <div className={eyebrowIn}>{card.eyebrow}</div>
        <h3
          className={`card-title font-nourd ${card.titleSize} font-extrabold tracking-tighter transition-transform duration-550 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-16`}
        >
          {card.title.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </h3>
      </div>
      <HoverWordsPullUp
        text={card.description}
        isHovered={hovered}
        className="absolute inset-x-0 bottom-0 z-10 px-3 pb-2.5 text-[12.5px] leading-[1.55] text-white/80"
      />
    </Link>
  );
}

export default function ServicesDashboard() {
  return (
    <div
      className="
        services-grid flex flex-col gap-2.5
        lg:grid lg:h-[550px] lg:grid-cols-[200px_340px_340px_1fr] lg:grid-rows-2 lg:gap-2.5
      "
    >
      {/* Left: full-height CTA. No hoverBase by design — it is the anchor of
          the grid, so it stays put while the photo cards lift. */}
      <Link
        href="/services"
        className={`${panelBase} ${hoverBase}  h-56 items-center justify-center border-dashed border-white/30 bg-primary hover:border-white lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3 lg:h-auto `}
      >
        <div className="flex flex-row items-center justify-center gap-4 -rotate-90">
          <span className="flex h-[30px] w-[30px] items-center justify-center -translate-y-19 translate-x-9 rounded-full border border-white/40 transition-[transform,border-color] duration-200 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:border-white group-focus-visible:translate-x-[3px] group-focus-visible:-translate-y-[3px] group-focus-visible:border-white">
            <ArrowUpRight className="h-[30px] w-[30px] stroke-white" />
          </span>
          <h3 className="font-nourd -translate-x-7 text-center text-9xl font-extrabold text-white uppercase tracking-tighter">
            Services
          </h3>
        </div>
      </Link>

      {cards.map((card) => (
        <ServiceCard key={card.href} card={card} />
      ))}
    </div>
  );
}
