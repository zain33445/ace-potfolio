import { useCallback, useEffect, useRef, useState } from 'react';
import { Timer, Map, Award, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Section from '../../../components/Section';
import Reveal from '../../../components/Reveal';

const stats = [
  {
    id: 'stat_01',
    num: '89%',
    label: 'Verified Bid Success Rate',
    sysId: '[WIN_RATE]',
    desc: 'Estimates strategically designed to win key contracts in highly competitive markets.',
    icon: Award,
  },
  {
    id: 'stat_02',
    num: '2,893+',
    label: 'Projects Estimated & Certified',
    sysId: '[TAKEOFF_VOLUME]',
    desc: 'Delivered pre-construction volume schedules across residential, commercial, & industrial sectors.',
    icon: Timer,
  },
  {
    id: 'stat_03',
    num: '35 States',
    label: 'Proven U.S. National Reach',
    sysId: '[COVERAGE_GRID]',
    desc: 'Active regulatory construction guidelines aligned to individual state zoning rules.',
    icon: Map,
  },
  {
    id: 'stat_04',
    num: 'ISO-Standard',
    label: 'Double-Verified Precision',
    sysId: '[QUALITY_CONTROL]',
    desc: 'Rigorous two-stage QA peer checked and finalized by veteran Senior Consultants.',
    icon: ShieldCheck,
  },
];

const ROTATIONS = [-1.5, 2, -1, 1.5];

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

function applyDashOffset(path: SVGPathElement, ratio: number) {
  const len = path.getTotalLength();
  if (!len) return;
  path.style.strokeDasharray = String(len);
  path.style.strokeDashoffset = String(len * Math.max(0, Math.min(1, 1 - ratio)));
}

export default function StatsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const [revealedIndex, setRevealedIndex] = useState(0);
  const revealedRef = useRef(0);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const section = document.getElementById('stats');
    if (!section) return;

    const onWheel = (e: WheelEvent) => {
      if (!section.contains(e.target as Node)) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = revealedRef.current + dir;
      if (next >= 0 && next < stats.length) {
        revealedRef.current = next;
        setRevealedIndex(next);
        e.stopPropagation();
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () =>
      document.removeEventListener('wheel', onWheel, {
        capture: true,
      } as EventListenerOptions);
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
    applyDashOffset(path, revealedRef.current / (stats.length - 1));
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => buildAndDrawPath());
    window.addEventListener('resize', buildAndDrawPath);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', buildAndDrawPath);
    };
  }, [buildAndDrawPath]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    applyDashOffset(path, revealedIndex / (stats.length - 1));
  }, [revealedIndex]);

  const renderCard = (stat: (typeof stats)[number], i: number) => {
    const StatIcon = stat.icon;
    const visible = i <= revealedIndex;
    return (
      <motion.div
        key={stat.id}
        ref={setCardRef(i)}
        initial={false}
        animate={
          visible
            ? { opacity: 1, y: 0, scale: 1, rotate: ROTATIONS[i] }
            : { opacity: 0, y: 40, scale: 0.9, rotate: ROTATIONS[i] }
        }
        transition={{ duration: 0.65, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="p-6 border border-blueprint-line bg-background bracket-corners group hover:border-primary hover:shadow-sm transition-all duration-300 w-[280px]"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-mono text-[9px] text-[#FF6B00] tracking-wider block font-bold">
            {stat.sysId}
          </span>
          <StatIcon className="w-4 h-4 text-on-surface-variant group-hover:text-primary transition-colors" />
        </div>
        <h3 className="font-space text-4xl font-extrabold text-on-background text-stone-950 mb-1">
          {stat.num}
        </h3>
        <h4 className="font-space font-bold text-sm text-on-background group-hover:text-primary transition-colors">
          {stat.label}
        </h4>
        <p className="font-sans text-xs text-on-surface-variant mt-2 leading-relaxed font-semibold">
          {stat.desc}
        </p>
        {visible && (
          <div className="absolute top-4 right-4 text-primary">
            <span className="font-mono text-[9px] font-bold">LIVE</span>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <Section sectionId="stats" className="py-20 px-6 md:px-16 bg-surface border-b border-blueprint-line relative">
      <Reveal type="fadeUp">
        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none opacity-50" />
        <div ref={containerRef} className="relative w-full h-[650px]">
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
            <div className="relative z-10 grid grid-cols-1 gap-6 pt-12">
              {stats.map((stat, i) => (
                <div key={stat.id}>{renderCard(stat, i)}</div>
              ))}
            </div>
          )}
        </div>
      </Reveal>
    </Section>
  );
}
