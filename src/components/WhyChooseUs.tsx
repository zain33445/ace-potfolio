import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

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

const POSITIONS = [
  { left: '12%', top: '18%' },
  { left: '38%', top: '42%' },
  { left: '58%', top: '72%' },
  { left: '84%', top: '48%' },
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

export default function WhyChooseUs() {
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
    const section = document.getElementById('why-choose-us');
    if (!section) return;

    const onWheel = (e: WheelEvent) => {
      if (!section.contains(e.target as Node)) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = revealedRef.current + dir;
      if (next >= 0 && next < cards.length) {
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
    applyDashOffset(path, revealedRef.current / (cards.length - 1));
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
    applyDashOffset(path, revealedIndex / (cards.length - 1));
  }, [revealedIndex]);

  const renderCard = (card: (typeof cards)[number], i: number) => {
    const visible = i <= revealedIndex;
    return (
      <motion.div
        key={card.label}
        ref={setCardRef(i)}
        initial={false}
        animate={
          visible
            ? { opacity: 1, y: 0, scale: 1, rotate: ROTATIONS[i] }
            : { opacity: 0, y: 40, scale: 0.9, rotate: ROTATIONS[i] }
        }
        transition={{ duration: 0.65, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="p-5 border border-blueprint-line bg-surface hover:border-primary transition-colors duration-300 bracket-corners w-[280px]"
      >
        <span className="font-mono text-[9px] text-[#FF6B00] font-bold tracking-widest block mb-2">
          {card.label}
        </span>
        <h3 className="font-space font-extrabold text-base text-on-background mb-2 uppercase leading-tight">
          {card.title}
        </h3>
        <p className="font-sans text-[11px] text-on-surface-variant leading-relaxed font-semibold">
          {card.desc}
        </p>
      </motion.div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[650px]"
    >
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
        <div className="relative z-10 grid grid-cols-1 gap-6 pt-12">
          {cards.map((card, i) => (
            <div key={card.label}>{renderCard(card, i)}</div>
          ))}
        </div>
      )}
    </div>
  );
}
