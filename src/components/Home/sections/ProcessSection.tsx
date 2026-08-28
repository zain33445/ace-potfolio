"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  type Variants,
} from "motion/react";

import OptionWheel, {
  type OptionWheelHandle,
} from "../../../components/OptionWheel";
import { steps } from "../../../constants/processSteps";

// Module-level so the array identity is stable across renders and the wheel
// doesn't re-run its layout effect on every parent render.
const STEP_TITLES = steps.map((s) => s.title);

// Card swap animation: the glass shell settles in first, then its content
// rises in with the staggered beats from the reference design.
const cardShell: Variants = {
  hidden: { opacity: 0.55, scale: 0.988 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.52, ease: [0.22, 0.7, 0.2, 1] },
  },
};

const rise: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.48, ease: [0.22, 0.7, 0.2, 1] },
  }),
};

const CHECK_DELAYS = [0.2, 0.255, 0.31];

export default function ProcessSection() {
  const trackRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<OptionWheelHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const suppressScrubRef = useRef(false);
  const suppressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotion = useReducedMotion();

  // The pinned scrollytelling track only makes sense on viewports tall enough
  // to hold the whole layout; below md the section renders in normal flow and
  // the wheel is driven by taps instead of page scroll.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Toggle body-level scroll-snap only while the track is on screen, so a
  // fast flick rests on a phase instead of overshooting the section. The
  // snapping itself is defined in globals.css (.snap-process, desktop only).
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      ([entry]) => root.classList.toggle("snap-process", entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(track);
    return () => {
      io.disconnect();
      root.classList.remove("snap-process");
    };
  }, []);

  useEffect(() => {
    try {
      setSoundOn(window.localStorage.getItem("process-sound") === "on");
    } catch {
      // Storage unavailable (private mode etc.) — default to silent.
    }
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      const next = !on;
      try {
        window.localStorage.setItem("process-sound", next ? "on" : "off");
      } catch {
        // Ignore persistence failures.
      }
      return next;
    });
  }, []);

  // The section is a tall scroll track with a pinned (sticky) viewport:
  // page scroll through it scrubs the wheel across all steps, no matter
  // where the cursor sits.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const applyProgress = useCallback(
    (progress: number) => {
      if (!isDesktop || suppressScrubRef.current) return;
      const pos = Math.max(0, Math.min(1, progress)) * (steps.length - 1);
      wheelRef.current?.setPosition(pos);
      setActiveIndex((cur) => {
        const next = Math.round(pos);
        return cur === next ? cur : next;
      });
    },
    [isDesktop],
  );

  useMotionValueEvent(scrollYProgress, "change", applyProgress);

  // Sync once on mount (and when crossing the md breakpoint) so reloads,
  // deep links, or anchor jumps mid-track land on the right step.
  useEffect(() => {
    if (isDesktop) applyProgress(scrollYProgress.get());
  }, [applyProgress, scrollYProgress, isDesktop]);

  useEffect(
    () => () => {
      if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current);
    },
    [],
  );

  // Manual selection (click / drag-end / arrow keys) aligns the page scroll
  // with the chosen step, so the scrub loop and the wheel agree instead of
  // fighting. Scrub updates are suppressed for a beat while the smooth scroll
  // travels through intermediate steps.
  const handleManualChange = useCallback(
    (index: number) => {
      if (wheelRef.current?.isDragging()) return;
      setActiveIndex(index);
      wheelRef.current?.setPosition(index);
      const track = trackRef.current;
      if (!isDesktop || !track) return;
      const top = track.getBoundingClientRect().top + window.scrollY;
      const distance = track.offsetHeight - window.innerHeight;
      if (distance <= 0) return;
      suppressScrubRef.current = true;
      window.scrollTo({
        top: top + (index / (steps.length - 1)) * distance,
        behavior: reduceMotion ? "auto" : "smooth",
      });
      if (suppressTimerRef.current) clearTimeout(suppressTimerRef.current);
      suppressTimerRef.current = setTimeout(
        () => {
          suppressScrubRef.current = false;
        },
        reduceMotion ? 100 : 800,
      );
    },
    [isDesktop, reduceMotion],
  );

  // Numbered wheel rows: orange phase numeral that warms up with proximity,
  // then the step title supplied by the wheel itself.
  const renderWheelItem = useCallback((index: number) => {
    const s = steps[index];
    return (
      <span className="flex items-center">
        <span
          className="mr-4 font-space font-bold"
          style={{
            color:
              "color-mix(in srgb, var(--color-primary) calc(var(--ow-p, 0) * 100%), #8f8f92)",
          }}
        >
          {s.num}
        </span>
        {s.title}
      </span>
    );
  }, []);

  const step = steps[activeIndex];

  return (
    <section
      ref={trackRef}
      id="process"
      className="relative bg-background border-b  border-blueprint-line md:h-[400vh] z-50 transition-transform duration-700"
      aria-label="Our Process"
    >
      {/* Snap points, one per phase, at each phase's scroll position along the
          400vh track (last phase rests at 300vh = 75%). See .snap-process. */}
      {[0, 25, 50, 75].map((top) => (
        <div
          key={top}
          aria-hidden="true"
          className="pointer-events-none absolute left-0 hidden h-px w-px md:block"
          style={{ top: `${top}%`, scrollSnapAlign: "start" }}
        />
      ))}
      <div className="relative overflow-hidden px-6 md:sticky md:top-0 md:h-screen md:px-16 md:py-0">
        {/* ── Per-step background image (crossfades on selection change) ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          {steps.map((s, i) => (
            <Image
              key={s.id}
              src={s.image}
              alt=""
              fill
              sizes="100vw"
              style={s.position ? { objectPosition: s.position } : undefined}
              className={`object-cover transition-opacity ${
                reduceMotion ? "" : "duration-700 ease-out"
              } ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>

        {/* ── Legibility scrims ──
            Kept intentionally minimal: faint feathered light washes on both
            axes just strong enough to protect the dark type, wheel and glass
            card over any photo while letting the imagery read clearly.
            Below md a single flat wash does the same job. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(300deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.18) 15%, rgba(0,0,0,0.10) 30%, rgba(0,0,0,0.24) 70%)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 42%, rgba(0,0,0,0.18) 88%, rgba(0,0,0,0.10) 100%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background/10 md:hidden"
        />
        <div className="absolute  top-20 flex items-center justify-center">
          <h2 className="font-space z-11 text-[clamp(40px,4.6vw,66px)] font-bold leading-none tracking-[-0.035em] text-white">
            Our Process.
          </h2>
        </div>
        <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col gap-12 pt-1 md:h-full md:min-h-0 md:grid md:grid-cols-[minmax(0,1fr)_minmax(0,580px)] md:items-center md:gap-x-16 md:pt-0 xl:gap-x-24">
          {/* ── Left: eyebrow, headline, numbered wheel, hint ── */}
          <div className="md:max-w-[600px]">
            <div className="relative mt-5 h-[230px] sm:h-[250px] md:mt-6">
              {/* Selection marker tick beside the focused option */}
              <span
                aria-hidden="true"
                className="absolute left-0 top-30 h-[40px] w-[10px] rounded-sm bg-primary lg:block"
              />
              <OptionWheel
                fade={1}
                blur={1}
                tilt={10}
                curve={2}
                inset={20}
                side="left"
                spacing={2.2}
                ref={wheelRef}
                fontSize={2.5}
                soundVolume={1}
                smoothing={420}
                minOpacity={0.25}
                defaultSelected={0}
                items={STEP_TITLES}
                captureWheel={false}
                textColor="#fff"
                activeColor="#fff"
                soundUrl="/select.wav"
                activeFontWeight={800}
                ariaLabel="Process steps"
                renderItem={renderWheelItem}
                onChange={handleManualChange}
              />
            </div>

            <div className="mt-6 flex items-baseline gap-5">
              <p className="font-space text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40">
                Scroll or drag to change phase
              </p>
              <button
                type="button"
                onClick={toggleSound}
                aria-pressed={soundOn}
                className="cursor-pointer font-space text-[11px] font-semibold uppercase tracking-[0.16em] text-black/40 underline decoration-dotted underline-offset-4 transition-colors hover:text-orange-deep"
              >
                sound {soundOn ? "on" : "off"}
              </button>
            </div>
          </div>

          {/* ── Right: glass phase card ── */}
          <div className="relative flex items-center justify-center pb-4 md:min-h-0 md:pb-0">
            {/* Announce step changes to screen readers */}
            <div aria-live="polite" className="sr-only">
              <h3>
                Step {step.num} of {steps.length}: {step.title}
              </h3>
            </div>
            <AnimatePresence mode="wait" initial={false}>
              <motion.article
                key={step.id}
                variants={cardShell}
                initial={reduceMotion ? false : "hidden"}
                animate="show"
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, scale: 0.99, transition: { duration: 0.2 } }
                }
                className="w-full max-w-[580px] rounded-[22px] border border-black/[0.08] bg-black/10 p-7 text-white shadow-[0_34px_90px_rgba(10,10,10,0.16)] backdrop-blur-xl z-100 sm:p-10 md:min-h-[498px]"
              >
                <motion.p
                  variants={rise}
                  custom={0}
                  className="font-space text-[15px] font-bold uppercase tracking-[0.045em] text-orange-deep"
                >
                  Phase {step.num}
                </motion.p>

                <motion.h3
                  variants={rise}
                  custom={0.06}
                  className="mt-2 font-space text-[clamp(28px,2.6vw,35px)] font-bold leading-[1.1] tracking-[-0.025em] text-white"
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  variants={rise}
                  custom={0.11}
                  className="mt-6 max-w-[490px] text-base leading-[1.65] text-white"
                >
                  {step.desc}
                </motion.p>

                <motion.p
                  variants={rise}
                  custom={0.16}
                  className="mt-7 text-[12.5px] font-bold uppercase tracking-[0.075em] text-white"
                >
                  Verifications
                </motion.p>
                <div className="mt-4 flex flex-col gap-3">
                  {step.benchmarks.map((benchmark, j) => (
                    <motion.div
                      key={j}
                      variants={rise}
                      custom={CHECK_DELAYS[j % CHECK_DELAYS.length]}
                      className="flex items-center gap-3.5"
                    >
                      <span className="inline-flex h-[21px] w-[21px] flex-none items-center justify-center rounded-md border border-primary/40 bg-primary/[0.16]">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M2 6.4L4.6 9L10 3"
                            stroke="#FF6B00"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-[15px] text-white/80">
                        {benchmark}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  variants={rise}
                  custom={0.22}
                  className="mt-8 h-px bg-black/[0.09]"
                />
                <motion.p
                  variants={rise}
                  custom={0.3}
                  className="mt-6 text-[11.5px] font-bold uppercase tracking-[0.14em] text-white/70"
                >
                  Milestone deliverables
                </motion.p>
                <motion.div
                  variants={rise}
                  custom={0.34}
                  className="mt-3.5 inline-flex max-w-full items-center gap-3 rounded-l-[2px] rounded-r-[10px] border-l-[3px] border-primary bg-black/[0.04] px-[22px] py-3.5 text-[15px] font-semibold text-white/50"
                >
                  <svg
                    width="15"
                    height="17"
                    viewBox="0 0 15 17"
                    fill="none"
                    aria-hidden="true"
                    className="flex-none"
                  >
                    <path
                      d="M9 1H3a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h9a2 2 0 0 0 2-2V6L9 1z"
                      stroke="rgba(10,10,10,.7)"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 1v5h5"
                      stroke="rgba(10,10,10,.7)"
                      strokeWidth="1.4"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>{step.output}</span>
                </motion.div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
