'use client';

import { useEffect, useRef, useState } from 'react';
import { usePin } from '../../../PinContext';

/* ── Card content (unchanged from original) ── */
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

/* ── Bridge / pillar geometry (matches reference SVG viewBox 1200×700) ── */
const PILLARS = [
  { x: 180, h: 320 }, // Left, long
  { x: 460, h: 160 }, // Center-left, short
  { x: 740, h: 160 }, // Center-right, short
  { x: 1020, h: 320 }, // Right, long
];

/* Card positions as percentages of the canvas wrapper (maps to SVG pillar x-coords) */
const CARD_POSITIONS = [
  { left: '15%', top: '77.5%' },
  { left: '38.33%', top: '54.5%' },
  { left: '61.66%', top: '54.5%' },
  { left: '85%', top: '77.5%' },
];

const SVG_NS = 'http://www.w3.org/2000/svg';

function svgEl(tag: string, attrs: Record<string, string> = {}) {
  const el = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

export default function WhyChooseUsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const { setPinned } = usePin();

  /* ── Responsive breakpoint ── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const scrollable = wrapper.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
      const step = Math.floor(progress * (PILLARS.length + 1));
      setActiveStep(Math.min(PILLARS.length, Math.max(0, step)));
      setPinned(progress > 0.05 && progress < 0.95);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [setPinned]);

  /* ── Generate SVG bridge on mount (desktop only) ── */
  useEffect(() => {
    if (!isDesktop) return;
    const svg = svgRef.current;
    if (!svg) return;

    // Clear
    svg.innerHTML = '';

    // Defs
    const defs = svgEl('defs');
    svg.appendChild(defs);

    // Grid pattern
    const pattern = svgEl('pattern', {
      id: 'bridge-grid',
      width: '30',
      height: '30',
      patternUnits: 'userSpaceOnUse',
    });
    pattern.appendChild(
      svgEl('path', {
        d: 'M 30 0 L 0 0 0 30',
        fill: 'none',
        stroke: 'rgba(30,41,59,0.03)',
        'stroke-width': '0.5',
      }),
    );
    defs.appendChild(pattern);
    svg.appendChild(svgEl('rect', { width: '1200', height: '700', fill: 'url(#bridge-grid)' }));

    // ── Solid deck plate (filled rect for visual weight) ──
    svg.appendChild(
      svgEl('rect', {
        x: '0',
        y: '178',
        width: '1200',
        height: '22',
        fill: '#1e293b',
        opacity: '0.06',
      }),
    );

    // ── Horizontal deck beams (full width, thicker) ──
    const beams = svgEl('g', { stroke: '#1e293b', 'stroke-width': '2.5' });
    [
      { y: 178, o: '0.3' },
      { y: 183, o: '0.5' },
      { y: 188, o: '0.7' },
      { y: 193, o: '0.85' },
      { y: 198, o: '1' },
    ].forEach(({ y, o }) => {
      beams.appendChild(
        svgEl('line', { x1: '0', y1: String(y), x2: '1200', y2: String(y), opacity: o }),
      );
    });

    // Transverse deck trusses (span full width)
    const trusses = svgEl('g', { stroke: '#64748b', 'stroke-width': '0.8', opacity: '0.5' });
    for (let i = 0; i <= 24; i++) {
      const x1 = i * 50;
      trusses.appendChild(svgEl('line', { x1: String(x1), y1: '178', x2: String(x1), y2: '198' }));
      if (i < 24) {
        trusses.appendChild(
          svgEl('line', {
            x1: String(x1),
            y1: '178',
            x2: String((i + 1) * 50),
            y2: '198',
            'stroke-dasharray': '1,3',
          }),
        );
      }
    }
    beams.appendChild(trusses);
    svg.appendChild(beams);

    // ── Pillars ──
    const container = svgEl('g', { id: 'pillars-container' });

    PILLARS.forEach((pillar, idx) => {
      const { x: cx, h: height } = pillar;
      const cy = 195;
      const dx = 22;
      const dy = 12;

      // 3.5D corner coords
      const blT = { x: cx - dx, y: cy - dy };
      const brT = { x: cx + dx, y: cy - dy };
      const flT = { x: cx - dx, y: cy + dy };
      const frT = { x: cx + dx, y: cy + dy };
      const blB = { x: blT.x, y: blT.y + height };
      const brB = { x: brT.x, y: brT.y + height };
      const flB = { x: flT.x, y: flT.y + height };
      const frB = { x: frT.x, y: frT.y + height };

      // Clip-path for reveal sweep
      const clip = svgEl('clipPath', { id: `clip-${idx}` });
      clip.appendChild(
        svgEl('rect', {
          id: `rect-${idx}`,
          x: String(cx - 40),
          y: String(cy - 20),
          width: '80',
          height: '0',
        }),
      );
      defs.appendChild(clip);

      // Scanning laser ellipse
      svg.appendChild(
        svgEl('ellipse', {
          id: `scan-${idx}`,
          cx: String(cx),
          cy: String(cy),
          rx: '35',
          ry: '18',
          fill: 'none',
          stroke: '#FF6B00',
          'stroke-width': '1.5',
          opacity: '0',
        }),
      );

      // Pillar group
      const group = svgEl('g', { class: 'pillar-group', id: `pillar-${idx}` });
      const clipped = svgEl('g', { 'clip-path': `url(#clip-${idx})` });
      const inner = svgEl('g');

      // Vertical legs
      [
        [blT, blB],
        [brT, brB],
        [flT, flB],
        [frT, frB],
      ].forEach(([t, b]) => {
        inner.appendChild(
          svgEl('line', {
            class: 'pillar-leg',
            x1: String(t.x),
            y1: String(t.y),
            x2: String(b.x),
            y2: String(b.y),
          }),
        );
      });

      // Horizontal bracing bays
      const bays = height > 200 ? 5 : 3;
      for (let b = 1; b <= bays; b++) {
        const yOff = height * (b / bays);
        inner.appendChild(
          svgEl('polygon', {
            class: 'pillar-bracing',
            points: `${blT.x},${blT.y + yOff} ${brT.x},${brT.y + yOff} ${frT.x},${frT.y + yOff} ${flT.x},${flT.y + yOff}`,
            fill: 'none',
          }),
        );
      }

      // Diagonal webbing trusses
      for (let b = 0; b < bays; b++) {
        const y1 = cy + (height / bays) * b;
        const y2 = cy + (height / bays) * (b + 1);
        (
          [
            [flT.x, y1 + dy, frT.x, y2 + dy],
            [frT.x, y1 + dy, flT.x, y2 + dy],
            [frT.x, y1 + dy, brT.x, y2 - dy],
            [brT.x, y1 - dy, frT.x, y2 + dy],
          ] as const
        ).forEach(([ax1, ay1, ax2, ay2]) => {
          inner.appendChild(
            svgEl('line', {
              class: 'pillar-bracing-diag',
              x1: String(ax1),
              y1: String(ay1),
              x2: String(ax2),
              y2: String(ay2),
            }),
          );
        });
      }

      // Structural nodes (joints)
      ([
        [blT, 2.5],
        [brT, 2.5],
        [flT, 3],
        [frT, 3],
        [flB, 3.5],
        [frB, 3.5],
      ] as const).forEach(([pt, r]) => {
        inner.appendChild(
          svgEl('circle', {
            class: 'pillar-node',
            cx: String(pt.x),
            cy: String(pt.y),
            r: String(r),
          }),
        );
      });

      clipped.appendChild(inner);
      group.appendChild(clipped);
      container.appendChild(group);
    });

    svg.appendChild(container);
  }, [isDesktop]);

  /* ── Drive CSS classes from active step ── */
  useEffect(() => {
    if (!isDesktop) return;

    PILLARS.forEach((pillar, idx) => {
      const group = document.getElementById(`pillar-${idx}`);
      const rect = document.getElementById(`rect-${idx}`);
      const scan = document.getElementById(`scan-${idx}`) as SVGEllipseElement | null;
      if (!group || !rect) return;

      const animTime = pillar.h / 150;

      if (activeStep > idx) {
        // Fully built
        group.classList.add('active');
        rect.setAttribute('height', String(pillar.h + 20));
        if (scan) {
          scan.setAttribute('opacity', '0');
          scan.style.animation = 'none';
        }
      } else if (activeStep === idx + 1) {
        // Building (scanner active)
        group.classList.add('active');
        rect.setAttribute('height', String(pillar.h + 20));
        if (scan) {
          scan.setAttribute('opacity', '0.75');
          scan.style.animation = `scanSweep ${animTime}s infinite ease-in-out`;
          scan.style.transformOrigin = `${pillar.x}px 195px`;
        }
      } else {
        // Hidden
        group.classList.remove('active');
        rect.setAttribute('height', '0');
        if (scan) {
          scan.setAttribute('opacity', '0');
          scan.style.animation = 'none';
        }
      }
    });
  }, [activeStep, isDesktop]);

  return (
    <div
      id="why-choose-us"
      ref={wrapperRef}
      className="relative bg-background border-b border-blueprint-line"
      style={{ height: `${(PILLARS.length + 1) * 100}vh` }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* ── Heading overlay ── */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20 w-full max-w-2xl text-center space-y-3 pointer-events-none">
            <span className="font-mono text-sm text-primary font-bold block">
              [DIFFERENTIATOR_MATRIX]
            </span>
            <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter">
              Why Choose The ACE Services?
            </h2>
            <div className="flex justify-center pt-1">
              <div className="w-16 h-0.5 bg-primary rounded-full" />
            </div>
            <p className="font-sans text-lg text-on-surface-variant font-medium">
              We leverage elite mathematical modeling and multi-layered audit procedures to
              deliver unmatched pre-construction confidence.
            </p>
          </div>

          {isDesktop ? (
            <>
              {/* ── Canvas wrapper (same aspect-ratio as SVG viewBox) ── */}
              <div
                className="relative w-[95%] max-w-[1400px]"
                style={{ aspectRatio: '1200 / 700' }}
              >
                <svg
                  ref={svgRef}
                  viewBox="0 0 1200 700"
                  className="w-full h-full pointer-events-none"
                  preserveAspectRatio="xMidYMid meet"
                />

                {/* ── HTML cards positioned over the SVG ── */}
                {cards.map((card, i) => {
                  const isActive = activeStep > i || activeStep === i + 1;
                  return (
                    <div
                      key={card.label}
                      className={`absolute pointer-events-auto bridge-card${isActive ? ' active' : ''}`}
                      style={{
                        left: CARD_POSITIONS[i].left,
                        top: CARD_POSITIONS[i].top,
                        width: '24vw',
                        maxWidth: '260px',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className="p-5 border border-blueprint-line bg-surface/80 backdrop-blur-xl hover:border-primary transition-colors duration-300 bracket-corners border-t-4 border-t-primary">
                        <span className="font-mono text-xs text-[#FF6B00] font-bold tracking-widest block mb-2">
                          {card.label}
                        </span>
                        <h3 className="font-space font-extrabold text-xl text-on-background mb-2 uppercase leading-tight">
                          {card.title}
                        </h3>
                        <p className="font-sans text-sm text-on-surface-variant leading-relaxed font-semibold">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ── Mobile: simple vertical card stack ── */
            <div className="relative z-10 grid grid-cols-1 gap-6 px-4 max-w-md mx-auto pt-24">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className="p-5 border border-blueprint-line bg-surface hover:border-primary transition-colors duration-300 bracket-corners"
                >
                  <span className="font-mono text-xs text-[#FF6B00] font-bold tracking-widest block mb-2">
                    {card.label}
                  </span>
                  <h3 className="font-space font-extrabold text-xl text-on-background mb-2 uppercase leading-tight">
                    {card.title}
                  </h3>
                  <p className="font-sans text-base text-on-surface-variant leading-relaxed font-semibold">
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
