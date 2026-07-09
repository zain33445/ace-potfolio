'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Timer, Map, Award, ShieldCheck } from 'lucide-react';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValueEvent,
} from 'motion/react';
import { useCountUp } from '../../../hooks/useCountUp';

interface StatConfig {
  id: string;
  end: number | null;
  suffix: string;
  label: string;
  sysId: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const stats: StatConfig[] = [
  {
    id: 'stat_01',
    end: 89,
    suffix: '%',
    label: 'Verified Bid Success Rate',
    sysId: '[WIN_RATE]',
    desc: 'Estimates strategically designed to win key contracts in highly competitive markets.',
    icon: Award,
  },
  {
    id: 'stat_02',
    end: 2893,
    suffix: '+',
    label: 'Projects Estimated & Certified',
    sysId: '[TAKEOFF_VOLUME]',
    desc: 'Delivered pre-construction volume schedules across residential, commercial, & industrial sectors.',
    icon: Timer,
  },
  {
    id: 'stat_03',
    end: 35,
    suffix: ' States',
    label: 'Proven U.S. National Reach',
    sysId: '[COVERAGE_GRID]',
    desc: 'Active regulatory construction guidelines aligned to individual state zoning rules.',
    icon: Map,
  },
  {
    id: 'stat_04',
    end: null,
    suffix: '',
    label: 'Double-Verified Precision',
    sysId: '[QUALITY_CONTROL]',
    desc: 'Rigorous two-stage QA peer checked and finalized by veteran Senior Consultants.',
    icon: ShieldCheck,
  },
];

const ROTATIONS = [-1.5, 2, -1, 1.5];
const CARD_DURATION = 1.35;
/** Extra breathing room so the 4th card fully settles with ~1s runway */
const END_MARGIN = 3.0;

const POSITIONS = [
  { left: '8%', top: '18%' },
  { left: '36%', top: '40%' },
  { left: '60%', top: '68%' },
  { left: '88%', top: '44%' },
];

function buildCurvedPath(points: { x: number; y: number }[]): string {
  if (points.length < 2) return '';
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = (prev.x + curr.x) / 2;
    d += ` C ${midX} ${prev.y}, ${midX} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

function computePathPositions(
  container: HTMLElement,
  cardEls: (HTMLDivElement | null)[],
): { x: number; y: number }[] | null {
  if (cardEls.some((c) => !c)) return null;
  const cr = container.getBoundingClientRect();
  return cardEls.map((c) => {
    const r = c!.getBoundingClientRect();
    return {
      x: r.left + r.width / 2 - cr.left,
      y: r.top + r.height / 2 - cr.top,
    };
  });
}

/** Renders an animated count-up number, or static text for non-numeric stats */
function StatCounter({
  stat,
  shouldCount,
}: {
  stat: StatConfig;
  shouldCount: boolean;
}) {
  const { formatted, startAnimation } = useCountUp({
    end: stat.end ?? 0,
    duration: 2,
    start: 0,
    easing: 'easeOut',
    suffix: stat.suffix,
    decimals: 0,
    startOnMount: false,
  });

  useEffect(() => {
    if (shouldCount && stat.end !== null) {
      const timeout = setTimeout(startAnimation, 150);
      return () => clearTimeout(timeout);
    }
  }, [shouldCount, stat.end, startAnimation]);

  if (stat.end === null) {
    return (
      <h3 className="font-space text-4xl font-extrabold text-on-background text-stone-950 mb-1">
        ISO-Standard
      </h3>
    );
  }

  return (
    <h3 className="font-space text-4xl font-extrabold text-on-background text-stone-950 mb-1 font-mono tabular-nums tracking-tight">
      {shouldCount ? formatted : `0${stat.suffix}`}
    </h3>
  );
}

export default function StatsSection() {
  const pinWrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [sectionVisible, setSectionVisible] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  /* ── Continuous scroll progress, spring-smoothed ── */
  const { scrollYProgress } = useScroll({
    target: pinWrapperRef,
    offset: ['start end', 'end start'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 35,
    mass: 0.5,
  });

  /* ── Raw scrollYProgress drives cards and SVG path (no spring lag).
       Spring is retained in case it's needed elsewhere. ── */
  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v);
    /* SVG path uses raw value so it stays connected to cards (no spring lag) */
    const path = pathRef.current;
    if (path) {
      const len = path.getTotalLength();
      if (len) {
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = String(len * (1 - v));
      }
    }
  });

  /* ── IntersectionObserver to trigger count-up ── */
  useEffect(() => {
    const el = pinWrapperRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSectionVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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

  /* ── SVG path geometry (rebuilt on resize) ── */
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
    const len = path.getTotalLength();
    if (len) {
      const v = smoothProgress.get();
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len * (1 - v));
    }
  }, [smoothProgress]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => buildAndDrawPath());
    window.addEventListener('resize', buildAndDrawPath);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', buildAndDrawPath);
    };
  }, [buildAndDrawPath]);

  /* ── Continuous per-card animation values ── */
  const totalProgress =
    (stats.length - 1) * CARD_DURATION + 1 + END_MARGIN;
  const displayProgress = progress * totalProgress;

  const renderCard = (stat: (typeof stats)[number], i: number) => {
    const StatIcon = stat.icon;
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

    /* 10. Counter starts after card settles */
    const shouldCount =
      sectionVisible && raw >= 0;

    return (
      <motion.div
        key={stat.id}
        ref={setCardRef(i)}
        initial={false}
        /* 4. Spring physics for card entry */
        transition={{
          type: 'spring',
          stiffness: 90,
          damping: 24,
          mass: 1,
        }}
        animate={{ opacity, y, scale, rotate }}
        className="p-6 border border-blueprint-line bg-background bracket-corners group hover:border-primary hover:shadow-sm transition-all duration-300 w-full max-w-[280px] relative"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-[9px] text-[#FF6B00] tracking-wider block font-bold">
            {stat.sysId}
          </span>
          <StatIcon className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
        </div>
        <StatCounter stat={stat} shouldCount={shouldCount} />
        <h4 className="font-space font-bold text-sm text-on-background group-hover:text-primary transition-colors">
          {stat.label}
        </h4>
        <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed font-semibold">
          {stat.desc}
        </p>
        {raw >= 0 && (
          <div className="absolute top-4 right-4 text-primary">
            <span className="font-mono text-[9px] font-bold">LIVE</span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div
      id="stats"
      ref={pinWrapperRef}
      className="relative bg-surface border-b border-blueprint-line"
      style={{ height: `${(stats.length + 4) * 100}vh` }}
    >
      {/* Sticky content — pins at top while parent scrolls through */}
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full h-full max-w-7xl mx-auto px-6 md:px-16 py-8">
          <div ref={containerRef} className="relative w-full h-full">
            <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-50" />

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
                {stats.map((stat, i) => (
                  <div
                    key={stat.id}
                    className="absolute"
                    style={{
                      left: POSITIONS[i].left,
                      top: POSITIONS[i].top,
                      width: '280px',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {renderCard(stat, i)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative z-10 grid grid-cols-1 gap-6 py-12 px-4 max-w-md mx-auto">
                {stats.map((stat, i) => (
                  <div key={stat.id}>{renderCard(stat, i)}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
