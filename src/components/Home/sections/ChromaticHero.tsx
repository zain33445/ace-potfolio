"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, type Variants } from "motion/react";

/* ── Copy ────────────────────────────────────────────────────────── */
const headerH1 = "Construction Estimating & Takeoff Services";
const headerH2 = "Stop Losing Bids. Win More Work.";
const headerH3 =
  "Commercial and residential construction estimating services — material takeoffs, shop drawings, 3D architectural renderings, and stamped permit sets, with AACE Class 3 cost estimates in 24 to 48 hours. Bid more jobs, win more of them.";

/* ── Slide data ──────────────────────────────────────────────────── */
interface HeroSlide {
  id: string;
  src: string;
  alt: string;
  /** object-position for the background image */
  position: string;
  line1: string;
  line2: string;
  pitch: string;
  ctaLabel: string;
  ctaHref: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "cost-estimation",
    src: "/hero-renderings.webp",
    alt: "Glass office towers viewed from below",
    position: "center 60%",
    line1: "Stop Losing Bids.",
    line2: "Win More Work.",
    pitch: headerH3,
    ctaLabel: "Run the calculator",
    ctaHref: "/calculator",
  },
  {
    id: "3d-renderings",
    src: "/HTeao-3D-Renders.webp",
    alt: "HTeao 3D architectural render of a completed building project",
    position: "center 45%",
    line1: "See It Before",
    line2: "You Build It.",
    pitch:
      "Photorealistic renderings built to support permitting, coordination, and presentation — so stakeholders sign off on what they can actually see.",
    ctaLabel: "Get renderings",
    ctaHref: "/3d-rendering-services",
  },
  {
    id: "shop-drawings",
    src: "/hero-shop.webp",
    alt: "Dimensioned 3D architectural wireframe model for shop drawing coordination",
    position: "center 50%",
    line1: "No Clashes.",
    line2: "No Surprises.",
    pitch:
      "Fabrication-ready shop drawing coordination that resolves spatial conflicts before breaking ground.",
    ctaLabel: "Get drawings",
    ctaHref: "/shop-drawing-services",
  },
  {
    id: "permit-sets",
    src: "/hero-permits.webp",
    alt: "Completed white modern residence",
    position: "center 55%",
    line1: "Permit Sets,",
    line2: "Approved Faster.",
    pitch:
      "Renderings, shop drawings, and stamped permit sets from delivered projects — assembled to the reviewer's checklist, not ours.",
    ctaLabel: "Get permits",
    ctaHref: "/permit-set-services",
  },
];

const SLIDE_INTERVAL_MS = 5000;

/* Approx of RevSlider's Power4.easeInOut used across the reference layers */
const EASE = [0.77, 0, 0.175, 1] as const;

/* Per-slide caption stagger (kicker → headline → pitch → CTAs), like the
   reference's ascending data-start beats. */
const captionStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.05 } },
};

/* ── Headline-row entrances, one recipe per slide, each ported from the
   reference's data-transition + data-transform_in on that slide ── */
const ROW_BY_SLIDE: Variants[] = [
  // slide 0 — "zoomout": y:[100%] rising out from behind a clip mask
  {
    hidden: { y: "115%" },
    show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
    exit: { y: "-115%", transition: { duration: 0.45, ease: EASE } },
  },
  // slide 1 — "scaledownfromright": lines slide in from alternating sides
  // (x:[-100%] / x:[100%]) from behind the mask (custom = -1 left, 1 right)
  {
    hidden: (dir: number) => ({ x: dir < 0 ? "-115%" : "115%" }),
    show: { x: "0%", transition: { duration: 0.8, ease: EASE } },
    exit: (dir: number) => ({
      x: dir < 0 ? "115%" : "-115%",
      transition: { duration: 0.45, ease: EASE },
    }),
  },
  // slide 2 — "fadetotopfadefrombottom": rX:70deg flip-down + fade
  {
    hidden: { rotateX: 68, y: "-24%", opacity: 0 },
    show: { rotateX: 0, y: "0%", opacity: 1, transition: { duration: 0.9, ease: EASE } },
    exit: { opacity: 0, y: "-18%", transition: { duration: 0.4, ease: EASE } },
  },
  // slide 3 — scale-in (mirror variation, keeps 4 slides distinct)
  {
    hidden: { scale: 0.82, opacity: 0 },
    show: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: EASE } },
    exit: { scale: 1.06, opacity: 0, transition: { duration: 0.4, ease: EASE } },
  },
];

/* Pitch/body entrance per slide (matches the reference's 3rd-layer motion) */
const BODY_BY_SLIDE: Variants[] = [
  { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }, exit: { opacity: 0, y: -14, transition: { duration: 0.4, ease: EASE } } },
  { hidden: { opacity: 0, x: "45%" }, show: { opacity: 1, x: "0%", transition: { duration: 0.75, ease: EASE } }, exit: { opacity: 0, transition: { duration: 0.35 } } },
  { hidden: { opacity: 0, skewX: "14deg", x: -46 }, show: { opacity: 1, skewX: "0deg", x: 0, transition: { duration: 0.8, ease: EASE } }, exit: { opacity: 0, transition: { duration: 0.35 } } },
  { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } }, exit: { opacity: 0, y: -14, transition: { duration: 0.4, ease: EASE } } },
];

/* CTA row — a soft rise on every slide, fired last in the stagger */
const fadeRise: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
  exit: { opacity: 0, y: -14, transition: { duration: 0.4, ease: EASE } },
};

/* Resting (inactive) pose of each background image — the slide's "from" frame.
   When it becomes active it animates to neutral, giving each slide the
   reference's own image transition (zoomout / scaledownfromright / …). */
const IMAGE_FROM = [
  { scale: 1.18, x: "0%", y: "0%" }, // 0 zoomout
  { scale: 1.22, x: "7%", y: "0%" }, // 1 scaledownfromright
  { scale: 1.06, x: "0%", y: "7%" }, // 2 fade from bottom
  { scale: 1.22, x: "-7%", y: "0%" }, // 3 scaledownfromleft
];

/* ── Component ───────────────────────────────────────────────────── */
export default function ChromaticHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  /* Autoplay is always ON by default — only the pause button stops it */
  const [isPaused, setIsPaused] = useState(false);

  const slide = HERO_SLIDES[activeIndex];
  const rowVariants = ROW_BY_SLIDE[activeIndex % ROW_BY_SLIDE.length];
  const bodyVariants = BODY_BY_SLIDE[activeIndex % BODY_BY_SLIDE.length];

  const goTo = useCallback(
    (index: number) =>
      setActiveIndex((index + HERO_SLIDES.length) % HERO_SLIDES.length),
    [],
  );

  /* Deps include activeIndex so manual navigation restarts the timer */
  useEffect(() => {
    if (isPaused) return;
    const id = setInterval(
      () => setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length),
      SLIDE_INTERVAL_MS,
    );
    return () => clearInterval(id);
  }, [activeIndex, isPaused]);

  return (
    <div id="hero-top" className="flex flex-col relative items-stretch">
      {/* ── Desktop: full-bleed image slider with overlaid captions ──
          The global <Nav> (layout-shell) sits transparently over this
          dark hero, so no navbar is rendered here. */}
      <section
        aria-roledescription="carousel"
        aria-label="Featured services"
        className="hidden md:block relative h-[100svh] min-h-[640px] overflow-hidden isolate"
      >
        {/* Background image carousel — all slides mounted, opacity swaps */}
        <div className="absolute inset-0 z-0">
          {HERO_SLIDES.map((s, i) => (
            <motion.div
              key={s.src}
              initial={false}
              /* Active → neutral frame; inactive rests at its slide's "from"
                 pose, so becoming active plays that slide's own transition
                 (zoomout / scaledownfromright / fade-from-bottom / …) */
              animate={
                i === activeIndex
                  ? { opacity: 1, scale: 1, x: "0%", y: "0%" }
                  : { opacity: 0, ...IMAGE_FROM[i % IMAGE_FROM.length] }
              }
              transition={{ duration: i === activeIndex ? 1.5 : 0.8, ease: EASE }}
              className="absolute inset-0"
              aria-hidden={i !== activeIndex}
            >
              <Image
                src={s.src}
                alt={s.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: s.position }}
              />
            </motion.div>
          ))}
        </div>

        {/* Dark overlay — keeps white type legible on any photo */}
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          aria-hidden="true"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,.62) 0%, rgba(10,10,10,0) 26%)," +
              "linear-gradient(to top, rgba(10,10,10,.66) 0%, rgba(10,10,10,0) 42%)," +
              "rgba(15,15,15,.42)",
          }}
        />

        {/* Captions */}
        <div className="relative z-10 h-full max-w-[1240px] mx-auto px-6 pt-[100px] flex flex-col items-center justify-center text-center">
          {/* Page H1 — static kicker, never rotates (SEO anchor) */}
          <h1 className="m-0 font-mono text-[15px] font-bold tracking-[0.22em] uppercase text-primary">
            {headerH1}
          </h1>

          {/* mode="wait": the outgoing caption masks out, then the incoming
              one rises in — the sequential in/out beat of the reference */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={slide.id}
              variants={captionStagger}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              {/* Every headline is exactly two lines — identical card
                  height across slides (zero CLS on swap). Each line reveals
                  with this slide's own recipe (mask-rise / side-slide /
                  flip-down / scale-in), clipped by its overflow mask. */}
              <h2
                className="m-0 mt-[18px] font-montserrat font-extrabold text-[clamp(2.6rem,6.6vw,5.2rem)] leading-[1.06] tracking-[-0.02em] text-white [perspective:1000px]"
                style={{ textShadow: "0 2px 34px rgba(0,0,0,.4)" }}
              >
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.span variants={rowVariants} custom={-1} className="block">
                    {slide.line1}
                  </motion.span>
                </span>
                <span className="block overflow-hidden pb-[0.08em]">
                  <motion.span variants={rowVariants} custom={1} className="block">
                    {slide.line2}
                  </motion.span>
                </span>
              </h2>

              {/* Reserved height so shorter pitches can't shift the CTAs */}
              <motion.p
                variants={bodyVariants}
                className="mx-auto max-w-[60ch] mt-[22px] min-h-[4.8rem] text-[clamp(1.05rem,1.35vw,1.25rem)] leading-[1.55] text-white/[0.88] text-pretty"
                style={{ textShadow: "0 1px 18px rgba(0,0,0,.45)" }}
              >
                {slide.pitch}
              </motion.p>

              <motion.div
                variants={fadeRise}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
              >
                <Link
                  href={slide.ctaHref}
                  className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] px-8 py-[15px] border-2 border-primary bg-primary text-white transition-colors duration-200 hover:bg-[#cc5500] hover:border-[#cc5500]"
                >
                  {slide.ctaLabel}
                </Link>
                <Link
                  href="/projects"
                  className="font-mono text-[13px] font-bold uppercase tracking-[0.14em] px-8 py-[15px] border-2 border-white/80 text-white transition-colors duration-200 hover:bg-white hover:text-on-background hover:border-white"
                >
                  View our work
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls — dots + pause, bottom-center */}
        <div className="absolute bottom-10 left-0 right-0 z-[15] flex items-center justify-center gap-3.5">
          <div className="flex items-center gap-2" role="tablist">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={s.id}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Show ${s.line1} ${s.line2}`}
                onClick={() => goTo(i)}
                className={`h-[9px] transition-all duration-300 ${
                  i === activeIndex
                    ? "w-[30px] bg-primary"
                    : "w-[9px] bg-white/45 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setIsPaused((p) => !p)}
            aria-pressed={isPaused}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
            className="flex h-[30px] w-[30px] items-center justify-center border border-white/45 bg-black/25 text-white text-[11px] transition-colors hover:border-white hover:bg-black/50"
          >
            {isPaused ? "▶" : "❚❚"}
          </button>
        </div>

        {/* Signature CTA bar — bottom-right corner */}
        <Link
          href="/contact-us"
          aria-label="Request a quote"
          className="absolute right-0 bottom-0 z-20 flex items-center bg-primary text-white transition-colors duration-200 hover:bg-[#cc5500]"
          style={{ boxShadow: "0 -8px 30px rgba(0,0,0,.25)" }}
        >
          <span
            className="flex h-[74px] w-[74px] flex-none items-center justify-center"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.6}
              className="h-8 w-8"
            >
              <path d="M3 21h18M5 21V7l7-4 7 4v14" />
              <path d="M9 21v-5h6v5" />
              <path d="M9 9h1M14 9h1M9 12h1M14 12h1" />
            </svg>
          </span>
          <span className="w-px h-[42px] bg-white/35" />
          <span className="pr-[30px] pl-[22px]">
            <span className="block text-[13px] tracking-[0.03em] opacity-90">
              Don&rsquo;t Hesitate To Ask
            </span>
            <span className="block mt-0.5 font-montserrat font-bold text-[19px] tracking-[0.01em] uppercase">
              Request A Quote
            </span>
          </span>
        </Link>
      </section>

      {/* ── Mobile: video header ─────────────────────────────────── */}
      <div className="md:hidden">
        <div className="overflow-hidden h-[100svh] relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            poster="/mobile-poster.webp"
            className="object-cover w-full h-full absolute inset-0"
          >
            <source src="/mobile-video-header.mp4" type="video/mp4" />
          </video>

          <div
            className="
              z-10 px-10 h-full relative
              flex flex-col items-center justify-center gap-y-20
            "
          >
            <div
              className="
                z-10 relative font-sans
                pb-8 px-10
                w-[100%] max-w-[900px]
                flex flex-col items-start justify-start gap-y-20
                text-white
                bg-white/10 border border-white/20 backdrop-blur-md
                md:w-4/5 md:px-2 md:pt-10 md:pb-15
                rounded-3xl
              "
            >
              <p
                className="
                  p-1 w-fit
                  text-white mt-1
                  rounded-md bg-primary
                  text-md font-normal leading-[1.1] text-left
                  hero-enter-down
                "
              >
                {headerH1}
              </p>

              <h2
                className="
                  my-5
                  text-5xl font-extrabold leading-[1.1] tracking-tighter text-center
                  decoration-primary decoration-[6px] underline-offset-[10px]
                  hero-enter-up hero-enter-up-1
                "
              >
                {headerH2}
              </h2>

              <h3
                className="
                  mx-auto mt-1
                  text-justified text-xl text-white
                  hero-enter-up hero-enter-up-2
                "
              >
                {headerH3}
              </h3>

              <p
                className="
                  mt-8 px-6
                  text-center font-medium text-sm leading-relaxed text-white
                  md:mt-11 md:px-10 md:text-sm
                  hero-enter-up hero-enter-up-3
                "
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
                <br className="md:hidden" />
                <span className="hidden mx-2 md:inline">|</span>
                <span style={{ color: "#FF6B00", fontWeight: "bold" }}>
                  {" "}
                  ✓{" "}
                </span>
                Residential &amp; Commercial Projects
                <br className="md:hidden" />
                <span className="hidden mx-2 md:inline">|</span>
                <span style={{ color: "#FF6B00", fontWeight: "bold" }}>
                  {" "}
                  ✓{" "}
                </span>
                24-48 Hour Turnaround
              </p>

              <div
                className="
                  flex flex-col px-10 mt-10 text-white
                  items-center justify-start gap-x-10 gap-y-3 md:flex-row
                  hero-enter-up hero-enter-up-4
                "
              >
                <button
                  onClick={() =>
                    document
                      .getElementById("contact")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="
                    order-1 px-8 py-3
                    text-white font-bold text-xl
                    bg-primary rounded-lg
                    relative group md:order-2
                  "
                >
                  <img
                    src="/bid_icon.webp"
                    alt=""
                    className="
                      z-10 w-8 h-8
                      pointer-events-none opacity-0 transition-all
                      absolute top-1/2 left-1/2 brightness-0 invert
                      -translate-x-[calc(50%+100px)] -translate-y-1/2
                      group-hover:-translate-x-1/2 group-hover:opacity-100
                      duration-300
                    "
                  />
                  <span className="block overflow-hidden">
                    <span
                      className="
                        inline-block transition-all
                        group-hover:translate-y-full group-hover:opacity-0
                        duration-300
                      "
                    >
                      Bid Better
                    </span>
                  </span>
                </button>
                <button
                  className="
                    order-2 font-medium text-sm
                    underline underline-offset-10 decoration-primary decoration-2
                    md:order-1
                  "
                >
                  See Our Work
                </button>
              </div>
            </div>
          </div>
        </div>
        <div
          className="
            overflow-hidden py-3.5
            text-white bg-primary
            border-y border-on-background
            select-none relative shrink-0
          "
        >
          <div className="font-mono text-xl font-bold tracking-widest marquee-track uppercase">
            <span className="marquee-content">
              &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
              &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
              INTEGRATION &spades;
            </span>
            <span aria-hidden="true" className="marquee-content">
              &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
              &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
              INTEGRATION &spades;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
