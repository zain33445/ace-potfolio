'use client';

import { useEffect, useRef, useState } from 'react';
import { usePin } from '../../../PinContext';

/* ── Card content (unchanged) ── */
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

/* ── Pillar geometry (viewBox 1200×900) ── */
const PILLARS = [
  { x: 150, h: 360 },
  { x: 380, h: 160 },
  { x: 820, h: 160 },
  { x: 1050, h: 360 },
];

/* ── Symmetrical valley card positions ── */
const CARD_POSITIONS = [
  { left: '12.50%', top: '84.2%' },
  { left: '31.66%', top: '59.4%' },
  { left: '68.33%', top: '59.4%' },
  { left: '87.50%', top: '84.2%' },
];

const SVG_NS = 'http://www.w3.org/2000/svg';

function el(tag: string, attrs: Record<string, string> = {}) {
  const e = document.createElementNS(SVG_NS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  return e;
}

function elHTML(tag: string, attrs: Record<string, string> = {}, html: string) {
  const e = el(tag, attrs);
  e.innerHTML = html;
  return e;
}

export default function WhyChooseUsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const { setPinned } = usePin();

  /* ── Responsive ── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  /* ── Scroll tracking ── */
  useEffect(() => {
    const w = wrapperRef.current;
    if (!w) return;
    const onScroll = () => {
      const rect = w.getBoundingClientRect();
      const scrollable = w.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const p = Math.max(0, Math.min(1, -rect.top / scrollable));
      setActiveStep(Math.min(PILLARS.length, Math.max(0, Math.floor(p * (PILLARS.length + 1)))));
      setPinned(p > 0.05 && p < 0.95);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [setPinned]);

  /* ── Generate full SVG on mount ── */
  useEffect(() => {
    if (!isDesktop) return;
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = '';

    const defs = el('defs');
    svg.appendChild(defs);

    // Grid pattern
    const pat = el('pattern', { id: 'grid', width: '30', height: '30', patternUnits: 'userSpaceOnUse' });
    pat.appendChild(el('path', { d: 'M 30 0 L 0 0 0 30', fill: 'none', stroke: 'rgba(30,41,59,0.04)', 'stroke-width': '0.5' }));
    defs.appendChild(pat);
    svg.appendChild(el('rect', { width: '1200', height: '900', fill: 'url(#grid)' }));

    // ── Hero focal point ──
    svg.appendChild(el('polygon', { points: '550,130 650,130 650,330 550,330', fill: 'rgba(180,83,9,0.08)' }));
    svg.appendChild(el('line', { x1: '550', y1: '130', x2: '650', y2: '130', stroke: '#b45309', 'stroke-width': '2', opacity: '0.5' }));

    // ══════════════════════════════════════════════════════════════
    // 1. SUSPENSION BRIDGE SUPERSTRUCTURE
    // ══════════════════════════════════════════════════════════════
    const superG = el('g', { id: 'bridge-superstructure' });

    const dx = 40;
    const dy = -25;
    const bridgeStartX = 50;
    const bridgeEndX = 1150;
    const deckCenterY = 350;
    const deckEdgeY = 400;
    const tower1X = 380;
    const tower2X = 820;
    const towerTopY = 120;

    // Deck front edge (cambered curve)
    superG.appendChild(elHTML('path', {
      d: `M ${bridgeStartX} ${deckEdgeY} Q 600 ${deckCenterY} ${bridgeEndX} ${deckEdgeY}`,
      stroke: '#0f172a', 'stroke-width': '6', fill: 'none',
    }, ''));

    // Deck back edge (3D depth)
    superG.appendChild(elHTML('path', {
      d: `M ${bridgeStartX + dx} ${deckEdgeY + dy} Q ${600 + dx} ${deckCenterY + dy} ${bridgeEndX + dx} ${deckEdgeY + dy}`,
      stroke: '#64748b', 'stroke-width': '2', fill: 'none', opacity: '0.5',
    }, ''));

    // Deck surface (filled between front/back)
    superG.appendChild(elHTML('path', {
      d: `M ${bridgeStartX} ${deckEdgeY - 3} Q 600 ${deckCenterY - 3} ${bridgeEndX} ${deckEdgeY - 3} L ${bridgeEndX + dx} ${deckEdgeY + dy} Q ${600 + dx} ${deckCenterY + dy} ${bridgeStartX + dx} ${deckEdgeY + dy} Z`,
      fill: '#334155', opacity: '0.8',
    }, ''));

    // ── Towers ──
    const genTower = (cx: number) => {
      const tW = 36;
      const t = el('g');
      const baseOff = cx === 380 || cx === 820 ? 370 : 400;

      // Back tower legs
      let backHtml = '';
      backHtml += `<line x1="${cx - tW / 2 + dx}" y1="${towerTopY + dy}" x2="${cx - tW / 2 + dx}" y2="${baseOff + dy}" />`;
      backHtml += `<line x1="${cx + tW / 2 + dx}" y1="${towerTopY + dy}" x2="${cx + tW / 2 + dx}" y2="${baseOff + dy}" />`;
      for (let y = towerTopY; y < baseOff - 60; y += 60) {
        backHtml += `<line x1="${cx - tW / 2 + dx}" y1="${y + dy}" x2="${cx + tW / 2 + dx}" y2="${y + 60 + dy}" />`;
        backHtml += `<line x1="${cx + tW / 2 + dx}" y1="${y + dy}" x2="${cx - tW / 2 + dx}" y2="${y + 60 + dy}" />`;
      }
      t.appendChild(elHTML('g', { stroke: '#64748b', 'stroke-width': '1.5', opacity: '0.4' }, backHtml));

      // Front tower legs
      let frontHtml = '';
      frontHtml += `<line x1="${cx - tW / 2}" y1="${towerTopY}" x2="${cx - tW / 2}" y2="${baseOff}" />`;
      frontHtml += `<line x1="${cx + tW / 2}" y1="${towerTopY}" x2="${cx + tW / 2}" y2="${baseOff}" />`;
      for (let y = towerTopY; y < baseOff - 60; y += 60) {
        frontHtml += `<line x1="${cx - tW / 2}" y1="${y}" x2="${cx + tW / 2}" y2="${y + 60}" />`;
        frontHtml += `<line x1="${cx + tW / 2}" y1="${y}" x2="${cx - tW / 2}" y2="${y + 60}" />`;
        frontHtml += `<line x1="${cx - tW / 2}" y1="${y}" x2="${cx + tW / 2}" y2="${y}" stroke-width="1.5" />`;
      }
      // Depth connections at top
      frontHtml += `<line x1="${cx - tW / 2}" y1="${towerTopY}" x2="${cx - tW / 2 + dx}" y2="${towerTopY + dy}" stroke-width="1" stroke="#94a3b8" />`;
      frontHtml += `<line x1="${cx + tW / 2}" y1="${towerTopY}" x2="${cx + tW / 2 + dx}" y2="${towerTopY + dy}" stroke-width="1" stroke="#94a3b8" />`;
      t.appendChild(elHTML('g', { stroke: '#0f172a', 'stroke-width': '2.5' }, frontHtml));

      return t;
    };

    superG.appendChild(genTower(tower1X));
    superG.appendChild(genTower(tower2X));

    // ── Cable system (back then front) ──
    const drawCables = (isBack: boolean) => {
      const ox = isBack ? dx : 0;
      const oy = isBack ? dy : 0;
      const g = el('g');

      // Main catenary cable
      let dPath = `M ${bridgeStartX + ox} ${deckEdgeY + oy} Q ${215 + ox} ${390 + oy} ${tower1X + ox} ${towerTopY + oy} `;
      dPath += `Q ${600 + ox} ${580 + oy} ${tower2X + ox} ${towerTopY + oy} `;
      dPath += `Q ${985 + ox} ${390 + oy} ${bridgeEndX + ox} ${deckEdgeY + oy}`;
      g.appendChild(elHTML('path', {
        d: dPath, fill: 'none',
        stroke: isBack ? '#64748b' : '#0f172a',
        'stroke-width': isBack ? '2' : '3',
        opacity: isBack ? '0.4' : '1',
      }, ''));

      // Suspender ropes
      let susHtml = '';
      for (let x = bridgeStartX + 20; x < bridgeEndX; x += 15) {
        if ((x > tower1X - 25 && x < tower1X + 25) || (x > tower2X - 25 && x < tower2X + 25)) continue;
        const tDeck = (x - bridgeStartX) / (bridgeEndX - bridgeStartX);
        const yDeck = (1 - tDeck) ** 2 * deckEdgeY + 2 * (1 - tDeck) * tDeck * 290 + tDeck ** 2 * deckEdgeY;
        let yCable: number;
        if (x <= tower1X) {
          const t = (x - bridgeStartX) / (tower1X - bridgeStartX);
          yCable = (1 - t) ** 2 * deckEdgeY + 2 * (1 - t) * t * 390 + t ** 2 * towerTopY;
        } else if (x <= tower2X) {
          const t = (x - tower1X) / (tower2X - tower1X);
          yCable = (1 - t) ** 2 * towerTopY + 2 * (1 - t) * t * 580 + t ** 2 * towerTopY;
        } else {
          const t = (x - tower2X) / (bridgeEndX - tower2X);
          yCable = (1 - t) ** 2 * towerTopY + 2 * (1 - t) * t * 390 + t ** 2 * deckEdgeY;
        }
        if (yCable < yDeck) {
          susHtml += `<line x1="${x + ox}" y1="${yCable + oy}" x2="${x + ox}" y2="${yDeck + oy}" />`;
        }
      }
      g.appendChild(elHTML('g', {
        stroke: isBack ? '#94a3b8' : '#475569',
        'stroke-width': isBack ? '0.5' : '1',
        opacity: isBack ? '0.3' : '0.7',
      }, susHtml));

      return g;
    };

    superG.appendChild(drawCables(true));
    superG.appendChild(drawCables(false));
    svg.appendChild(superG);

    // ══════════════════════════════════════════════════════════════
    // 2. CAD CALLOUT ANNOTATIONS
    // ══════════════════════════════════════════════════════════════
    const calloutsG = el('g', { id: 'bridge-callouts' });
    const drawCallout = (sx: number, sy: number, ex: number, ey: number, title: string) => {
      calloutsG.appendChild(elHTML('line', {
        x1: String(sx), y1: String(sy), x2: String(ex), y2: String(ey),
        stroke: '#b45309', 'stroke-width': '1.5', 'stroke-dasharray': '2,3',
      }, ''));
      calloutsG.appendChild(elHTML('circle', { cx: String(sx), cy: String(sy), r: '3', fill: '#b45309' }, ''));
      calloutsG.appendChild(elHTML('text', {
        x: String(ex + (ex > sx ? 6 : -6)), y: String(ey + 3),
        class: 'cad-text', 'text-anchor': ex > sx ? 'start' : 'end',
      }, title));
    };
    drawCallout(600, 310, 500, 240, 'MAIN SUSPENSION CABLE');
    drawCallout(700, 335, 760, 290, 'SUSPENDER ROPES');
    drawCallout(380, 250, 280, 200, 'TOWER LATTICE');
    drawCallout(860, 380, 960, 330, 'CAMBERED DECK');
    drawCallout(1120, 395, 1180, 340, 'ANCHORAGE PIER');
    svg.appendChild(calloutsG);

    // ══════════════════════════════════════════════════════════════
    // 3. STRAUSS PILLARS (3.5D stepped tapered lattice)
    // ══════════════════════════════════════════════════════════════
    const pillarsG = el('g', { id: 'pillars-container' });

    const genStrauss = (idx: number, cx: number, cy: number, h: number) => {
      const pdx = 16;
      const pdy = -10;

      const y0 = cy;
      const y1 = cy + h * 0.22;
      const y2 = cy + h * 0.55;
      const y3 = cy + h;
      const yFoot = cy + h - 12;

      const wTop = 8;
      const wMid = 13;
      const wBot = 18;
      const wFoot = 23;

      const group = el('g', { class: 'pillar-group', id: `pillar-${idx}` });

      // Helper: side face polygon
      const sideFace = (pts: string) => {
        group.appendChild(el('polygon', { class: 'pillar-side-face', points: pts }));
      };

      // Right-facing vertical panels (deep shadow)
      sideFace(`${cx + wTop},${y0} ${cx + wTop + pdx},${y0 + pdy} ${cx + wTop + pdx},${y1 + pdy} ${cx + wTop},${y1}`);
      sideFace(`${cx + wMid},${y1} ${cx + wMid + pdx},${y1 + pdy} ${cx + wMid + pdx},${y2 + pdy} ${cx + wMid},${y2}`);
      sideFace(`${cx + wBot},${y2} ${cx + wBot + pdx},${y2 + pdy} ${cx + wBot + pdx},${yFoot + pdy} ${cx + wBot},${yFoot}`);
      sideFace(`${cx + wBot},${yFoot} ${cx + wBot + pdx},${yFoot + pdy} ${cx + wFoot + pdx},${y3 + pdy} ${cx + wFoot},${y3}`);

      // Horizontal steps (right side)
      sideFace(`${cx + wTop},${y1} ${cx + wTop + pdx},${y1 + pdy} ${cx + wMid + pdx},${y1 + pdy} ${cx + wMid},${y1}`);
      sideFace(`${cx + wMid},${y2} ${cx + wMid + pdx},${y2 + pdy} ${cx + wBot + pdx},${y2 + pdy} ${cx + wBot},${y2}`);

      // Horizontal steps (left side — visible due to isometric shift)
      sideFace(`${cx - wMid},${y1} ${cx - wMid + pdx},${y1 + pdy} ${cx - wTop + pdx},${y1 + pdy} ${cx - wTop},${y1}`);
      sideFace(`${cx - wBot},${y2} ${cx - wBot + pdx},${y2 + pdy} ${cx - wMid + pdx},${y2 + pdy} ${cx - wMid},${y2}`);
      sideFace(`${cx - wFoot},${y3} ${cx - wFoot + pdx},${y3 + pdy} ${cx - wBot + pdx},${yFoot + pdy} ${cx - wBot},${yFoot}`);

      // Front face (closed stepped polygon — filled)
      const frontPath = [
        `M ${cx - wTop} ${y0}`,
        `L ${cx - wTop} ${y1}`, `H ${cx - wMid}`,
        `L ${cx - wMid} ${y2}`, `H ${cx - wBot}`,
        `L ${cx - wBot} ${yFoot}`, `L ${cx - wFoot} ${y3}`,
        `H ${cx + wFoot}`,
        `L ${cx + wBot} ${yFoot}`, `L ${cx + wBot} ${y2}`, `H ${cx + wMid}`,
        `L ${cx + wMid} ${y1}`, `H ${cx + wTop}`,
        `L ${cx + wTop} ${y0}`, 'Z',
      ].join(' ');
      group.appendChild(el('path', { class: 'pillar-front-face', d: frontPath }));

      // Portal backgrounds (hollowed arches showing bg)
      const portalBg = (d: string) => { group.appendChild(el('path', { class: 'pillar-portal-bg', d })); };
      portalBg(`M ${cx - 3} ${y1} L ${cx - 3} ${y0 + 20} A 3 3 0 0 1 ${cx + 3} ${y0 + 20} L ${cx + 3} ${y1}`);
      portalBg(`M ${cx - 5} ${y2} L ${cx - 5} ${y1 + 25} A 5 5 0 0 1 ${cx + 5} ${y1 + 25} L ${cx + 5} ${y2}`);

      // Bottom truss background
      const yTrussTop = y2 + 15;
      const yTrussBot = yFoot - 5;
      const trussH = yTrussBot - yTrussTop;
      const bays = trussH > 100 ? 2 : 1;
      group.appendChild(el('rect', {
        class: 'pillar-portal-bg',
        x: String(cx - 7), y: String(yTrussTop), width: '14', height: String(trussH),
      }));

      // ── Outlines (strokes on top of fills) ──
      // Front outline
      group.appendChild(elHTML('path', { class: 'pillar-leg', d: frontPath, fill: 'none' }, ''));

      // Back outline
      const backPath = [
        `M ${cx - wTop + pdx} ${y0 + pdy}`,
        `L ${cx - wTop + pdx} ${y1 + pdy}`, `H ${cx - wMid + pdx}`,
        `L ${cx - wMid + pdx} ${y2 + pdy}`, `H ${cx - wBot + pdx}`,
        `L ${cx - wBot + pdx} ${yFoot + pdy}`, `L ${cx - wFoot + pdx} ${y3 + pdy}`,
        `H ${cx + wFoot + pdx}`,
        `L ${cx + wBot + pdx} ${yFoot + pdy}`, `L ${cx + wBot + pdx} ${y2 + pdy}`, `H ${cx + wMid + pdx}`,
        `L ${cx + wMid + pdx} ${y1 + pdy}`, `H ${cx + wTop + pdx}`,
        `L ${cx + wTop + pdx} ${y0 + pdy}`, 'Z',
      ].join(' ');
      group.appendChild(elHTML('path', { class: 'pillar-leg-back', d: backPath, fill: 'none' }, ''));

      // Depth connection lines
      const connect = (x1: number, yVal: number) => {
        group.appendChild(elHTML('line', {
          class: 'pillar-brace',
          x1: String(x1), y1: String(yVal),
          x2: String(x1 + pdx), y2: String(yVal + pdy),
        }, ''));
      };
      connect(cx - wTop, y0); connect(cx + wTop, y0);
      connect(cx - wTop, y1); connect(cx + wTop, y1);
      connect(cx - wMid, y1); connect(cx + wMid, y1);
      connect(cx - wMid, y2); connect(cx + wMid, y2);
      connect(cx - wBot, y2); connect(cx + wBot, y2);
      connect(cx - wBot, yFoot); connect(cx + wBot, yFoot);
      connect(cx - wFoot, y3); connect(cx + wFoot, y3);

      // Shaft inner column panels
      const drawLine = (x1: number, y1c: number, x2: number, y2c: number) => {
        group.appendChild(elHTML('line', {
          class: 'pillar-brace',
          x1: String(x1), y1: String(y1c), x2: String(x2), y2: String(y2c),
        }, ''));
      };
      drawLine(cx - wTop + 2.5, y0, cx - wTop + 2.5, y1);
      drawLine(cx + wTop - 2.5, y0, cx + wTop - 2.5, y1);
      drawLine(cx - wMid + 3.5, y1, cx - wMid + 3.5, y2);
      drawLine(cx + wMid - 3.5, y1, cx + wMid - 3.5, y2);
      drawLine(cx - wBot + 4.5, y2, cx - wBot + 4.5, yFoot);
      drawLine(cx + wBot - 4.5, y2, cx + wBot - 4.5, yFoot);

      // Horizontal tie beams
      drawLine(cx - wTop, y1, cx + wTop, y1);
      drawLine(cx - wMid, y2, cx + wMid, y2);
      drawLine(cx - wBot, yFoot, cx + wBot, yFoot);

      // Arched portal strokes
      const drawStroke = (d: string) => {
        group.appendChild(elHTML('path', { class: 'pillar-brace', d, fill: 'none' }, ''));
      };
      drawStroke(`M ${cx - 3} ${y1} L ${cx - 3} ${y0 + 20} A 3 3 0 0 1 ${cx + 3} ${y0 + 20} L ${cx + 3} ${y1}`);
      drawStroke(`M ${cx - 5} ${y2} L ${cx - 5} ${y1 + 25} A 5 5 0 0 1 ${cx + 5} ${y1 + 25} L ${cx + 5} ${y2}`);

      // Bottom truss lines
      const xLeft = cx - 7;
      const xRight = cx + 7;
      drawLine(xLeft, yTrussTop, xLeft, yTrussBot);
      drawLine(xRight, yTrussTop, xRight, yTrussBot);
      for (let b = 0; b < bays; b++) {
        const ty1 = yTrussTop + (trussH / bays) * b;
        const ty2 = yTrussTop + (trussH / bays) * (b + 1);
        drawLine(xLeft, ty1, xRight, ty2);
        drawLine(xRight, ty1, xLeft, ty2);
        drawLine(xLeft, ty1, xRight, ty1);
      }
      drawLine(xLeft, yTrussBot, xRight, yTrussBot);

      // Shadow ellipse
      group.appendChild(el('ellipse', {
        class: 'pillar-shadow',
        cx: String(cx + pdx / 2), cy: String(y3 + pdy / 2),
        rx: '40', ry: '12', fill: 'none',
        stroke: 'rgba(180,83,9,0.15)', 'stroke-width': '1',
      }));

      // Scanner polygon
      group.appendChild(el('polygon', {
        id: `scan-${idx}`,
        class: 'scanner',
        points: `${cx - wTop - 4},${y0} ${cx + wTop + 4},${y0} ${cx + wTop + pdx + 4},${y0 + pdy} ${cx - wTop + pdx - 4},${y0 + pdy}`,
      }));

      return group;
    };

    PILLARS.forEach((p, idx) => {
      const cy = (p.x === 150 || p.x === 1050) ? 398 : 375;
      pillarsG.appendChild(genStrauss(idx, p.x, cy, p.h));
    });
    svg.appendChild(pillarsG);
  }, [isDesktop]);

  /* ── Drive active step ── */
  useEffect(() => {
    if (!isDesktop) return;
    PILLARS.forEach((_, idx) => {
      const group = document.getElementById(`pillar-${idx}`);
      const card = document.getElementById(`card-${idx}`);
      const scan = document.getElementById(`scan-${idx}`) as SVGPolygonElement | null;
      if (!group) return;

      if (activeStep > idx) {
        group.classList.add('active');
        card?.classList.add('active');
        if (scan) scan.style.animation = 'none';
      } else if (activeStep === idx + 1) {
        group.classList.add('active');
        card?.classList.add('active');
        if (scan) {
          scan.style.animation = 'none';
          void scan.getBoundingClientRect(); // reflow trigger
          scan.style.animation = 'scanSweep 1.2s ease-in-out forwards';
        }
      } else {
        group.classList.remove('active');
        card?.classList.remove('active');
        if (scan) scan.style.animation = 'none';
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
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Heading */}
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
              <div
                className="relative w-[95%] max-w-[1400px]"
                style={{ aspectRatio: '1200 / 900' }}
              >
                <svg
                  ref={svgRef}
                  viewBox="0 0 1200 900"
                  className="w-full h-full pointer-events-none"
                  preserveAspectRatio="xMidYMid meet"
                />

                {cards.map((card, i) => {
                  const isActive = activeStep > i || activeStep === i + 1;
                  return (
                    <div
                      key={card.label}
                      className={`absolute pointer-events-auto bridge-card${isActive ? ' active' : ''}`}
                      style={{
                        left: CARD_POSITIONS[i].left,
                        top: CARD_POSITIONS[i].top,
                        width: '20vw',
                        maxWidth: '250px',
                        transform: 'translateX(-50%)',
                      }}
                    >
                      <div className="p-5 border border-blueprint-line bg-surface/95 backdrop-blur-md hover:border-primary transition-colors duration-300 bracket-corners border-t-[3px] border-t-primary rounded-md shadow-[0_20px_40px_rgba(0,0,0,0.04),0_1px_3px_rgba(0,0,0,0.02)]">
                        <span className="font-mono text-xs text-[#FF6B00] font-bold tracking-widest block mb-2">
                          {card.label}
                        </span>
                        <h3 className="font-space font-extrabold text-base text-on-background mb-2 uppercase leading-snug">
                          {card.title}
                        </h3>
                        <p className="font-sans text-[13px] text-on-surface-variant leading-relaxed font-semibold">
                          {card.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
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
