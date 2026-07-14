'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useMotionValueEvent,
} from 'motion/react';
import { buildCurvedPath, computePathPositions } from '../../../utils/animations';
import { usePin } from '../../../PinContext';

const cards = [
  {
    label: '[WIN_OPTIMIZATION]',
    title: 'An 89% Bid Win Rate',
    desc: "Our estimates aren't just accurate; they are strategically designed to win you the job in a competitive market.",
  },
  {
    label: '[EXPERT_REVIEW]',
    title: 'Senior Consultant Oversight',
    desc: 'Every project undergoes a mandatory two-stage quality assurance process managed by our most experienced estimators.',
  },
  {
    label: '[NATIONAL_GRID]',
    title: 'Proven National Reach',
    desc: 'We have successfully delivered 2,893 estimates across 35 U.S. states, handling everything from bridges to healthcare facilities.',
  },
  {
    label: '[STANDARD_ISO]',
    title: 'ISO-Standard Precision',
    desc: 'We follow international ISO standards of construction, ensuring your pre-construction data meets the highest global benchmarks.',
  },
];

const ROTATIONS = [-2, 1.5, -1.5, 2];
const CARD_DURATION = 1.35;
const END_MARGIN = 3.0;

const POSITIONS = [
  { left: '12%', top: '18%' },
  { left: '38%', top: '42%' },
  { left: '58%', top: '72%' },
  { left: '84%', top: '48%' },
];

export default function WhyChooseUsSection() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const { setPinned } = usePin();

  /* ── Continuous scroll progress ── */
  const { scrollYProgress } = useScroll({
    target: pinWrapperRef,
    offset: ['start end', 'end start'],
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v);
    /* SVG path follows raw progress (stays connected to cards) */
    const path = pathRef.current;
    if (path) {
      const len = path.getTotalLength();
      if (len) {
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len * (1 - v));
      }
    }
    /* Hide nav while this sticky section is actively scrolling */
    setPinned(v > 0.05 && v < 0.95);
  });

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setCardRef = useCallback(
    (i: number) => (el: HTMLDivElement | null) => {
      cardRefs.current[i] = el;
    },
    [],
  );

  const buildAndDrawPath = useCallback(() => {
    const container = containerRef.current;
    const svg = container?.querySelector('svg');
    const path = pathRef.current;
    if (!container || !svg || !path) return;

    const cr = container.getBoundingClientRect();
    if (cr.width === 0 || cr.height === 0) return;

    svg.setAttribute('viewBox', `0 0 ${cr.width} ${cr.height}`);

    const pts = computePathPositions(container, cardRefs.current);
    if (!pts) return;

    path.setAttribute('d', buildCurvedPath(pts));
    const v = scrollYProgress.get();
    const len = path.getTotalLength();
    if (len) {
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len * (1 - v));
    }
  }, [scrollYProgress]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => buildAndDrawPath());
    window.addEventListener('resize', buildAndDrawPath);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', buildAndDrawPath);
    };
  }, [buildAndDrawPath]);

  /* ── Continuous per-card animation values ── */
  const totalProgress = (cards.length - 1) * CARD_DURATION + 1 + END_MARGIN;
  const displayProgress = progress * totalProgress;

  const renderCard = (card: (typeof cards)[number], i: number) => {
    const raw = displayProgress - i * CARD_DURATION;
    /* Asymmetric reveal: first 15% waiting, next 85% revealing */
    const entryT = Math.max(
      0,
      Math.min(1, (raw - 0.15) / 0.85),
    );

    /* Smooth easing: cubic Hermite (smoothstep) */
    const eased = entryT * entryT * (3 - 2 * entryT);

    const opacity = Math.max(
      0,
      Math.min(
        1,
        eased *
          (1 -
            0.3 *
              Math.max(0, Math.min(1, (raw - 0.5) / 1.5))),
      ),
    );
    const y = 40 * (1 - eased);
    const scale = 0.94 + eased * 0.06;
    const rotate = ROTATIONS[i] * (1.8 - eased * 0.8);

    return (
      <motion.div
        key={card.label}
        ref={setCardRef(i)}
        initial={false}
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 24,
          mass: 1,
        }}
        animate={{ opacity, y, scale, rotate }}
        className="p-5 border border-blueprint-line bg-surface hover:border-primary transition-colors duration-300 bracket-corners w-full max-w-[280px]"
      >
        <span className="font-mono text-[10px] text-[#FF6B00] font-bold tracking-widest block mb-2">
          {card.label}
        </span>
        <h3 className="font-space font-extrabold text-lg text-on-background mb-2 uppercase leading-tight">
          {card.title}
        </h3>
        <p className="font-sans text-sm text-on-surface-variant leading-relaxed font-semibold">
          {card.desc}
        </p>
      </motion.div>
    );
  };

  return (
    <div
      id="why-choose-us"
      ref={pinWrapperRef}
      className="relative bg-background border-b border-blueprint-line"
      style={{ height: `${(cards.length + 4) * 100}vh` }}
    >
      {/* Sticky content — pins at top while parent scrolls through */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={containerRef} className="relative w-full h-full max-w-7xl mx-auto px-6 md:px-16">
          {/* Heading — absolute overlay at top, does NOT shift cards wrapper */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl text-center space-y-3 pointer-events-none">
            <span className="font-mono text-xs text-primary font-bold block pointer-events-auto">
              [DIFFERENTIATOR_MATRIX]
            </span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter pointer-events-auto">
              Why Choose The ACE Services?
            </h2>
            <div className="flex justify-center pt-1 pointer-events-auto">
              <div className="w-16 h-0.5 bg-primary rounded-full" />
            </div>
            <p className="font-sans text-base text-on-surface-variant font-medium pointer-events-auto">
              We leverage elite mathematical modeling and multi-layered audit procedures to deliver unmatched pre-construction confidence.
            </p>
          </div>

          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            preserveAspectRatio="xMidYMid meet"
          >
            <path
              ref={pathRef}
              fill="none"
              stroke="#FF6B00"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {isDesktop ? (
            <div className="relative z-10 w-full h-full">
              {cards.map((card, i) => (
                <div
                  key={card.label}
                  className="absolute"
                  style={{
                    left: POSITIONS[i].left,
                    top: POSITIONS[i].top,
                    width: '280px',
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {renderCard(card, i)}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative z-10 grid grid-cols-1 gap-6 px-4 max-w-md mx-auto pt-24">
              {cards.map((card, i) => (
                <div key={card.label}>{renderCard(card, i)}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
