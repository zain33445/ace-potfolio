'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'motion/react';
import { ErrorBoundary } from '../../ui/ErrorBoundary';

/* ── Card content (unchanged) ── */
const cards = [
  {
    label: 'Bid Win Rate',
    title: 'An 89% Bid Win Rate',
    desc: "Our estimates aren't just accurate, they're strategically engineered to help general contractors and subcontractors win competitive bids in tight markets. This bid-win performance is the reason so many builders choose us as their pre-construction estimation partner.",
  },
  {
    label: 'Expert Review',
    title: 'Senior Consultant Oversight',
    desc: 'Every project moves through a mandatory two-stage quality assurance process, reviewed by our most experienced estimators. This layered QA approach is what separates a professional estimating company from a generic takeoff service.',
  },
  {
    label: 'National Reach',
    title: 'Proven National Reach',
    desc: 'With 2,893 estimates delivered across 35 U.S. states, spanning bridges, healthcare facilities, retail builds, and industrial plants, The ACE Services has the national estimating footprint that general contractors, civil engineers, and trade specialists rely on coast to coast.',
  },
  {
    label: 'ISO Standard',
    title: 'ISO-Standard Precision',
    desc: 'We follow international ISO 9001 construction standards, ensuring every pre-construction estimate, material takeoff, and quantity survey meets the highest global benchmark for accuracy and consistency.',
  },
];

/* ── Pillar geometry (viewBox 1200×1420) ── */
const PILLARS = [
  { x: 200, h: 250 },
  { x: 410, h: 500 },
  { x: 650, h: 750 },
  { x: 880, h: 1000 },
];

/* ── Card positions (1200/1420 viewBox) ── */
const CARD_POSITIONS = [
  { left: '16.33%', top: '37%' },
  { left: '35.67%', top: '55%' },
  { left: '55.67%', top: '73%' },
  { left: '73.83%', top: '91%' },
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
   const stepRef = useRef(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [activeStep, setActiveStep] = useState(0);

  /* ── Responsive ── */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const h = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', h);
    return () => mq.removeEventListener('change', h);
  }, []);

  /* ── Scroll-driven 5-step reveal ── */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start end', 'end start'],
  });
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (!isDesktop) return;
    // Explicit thresholds — step 5 fires at 0.65 so it's
    // reliably reached even when the scroll range is limited.
    const step =
      latest >= 0.65 ? 5 :
      latest >= 0.45 ? 4 :
      latest >= 0.25 ? 3 :
      latest >= 0.10 ? 2 :
      latest >= 0.02 ? 1 : 0;
    const clamped = Math.min(5, Math.max(0, step));
    stepRef.current = clamped;
    setActiveStep(clamped);
  });

  /* ── Apply step to SVG elements (synchronous, no re-render needed) ── */
  const applyStepRef = useRef<(step: number) => void>(() => {});
  applyStepRef.current = (step: number) => {
    const bridge = document.getElementById('bridge-superstructure');
    if (bridge) {
      bridge.style.opacity = step >= 1 ? '1' : '0';
      bridge.style.transform = step >= 1 ? 'translateY(0)' : 'translateY(20px)';
    }
    const callouts = document.getElementById('bridge-callouts');
    if (callouts) {
      callouts.style.opacity = step >= 1 ? '1' : '0';
      callouts.style.transform = step >= 1 ? 'translateY(0)' : 'translateY(20px)';
    }
    PILLARS.forEach((_, idx) => {
      const g = document.getElementById(`pillar-${idx}`);
      if (!g) return;
      const pStep = idx + 2;
      const isActive = step >= pStep;
      // Toggle the CSS `.active` class — this is what drives the child
      // reveals (.pillar-leg/.pillar-brace dash draw, face fills, shadow).
      // Inline opacity/transform only animates the group itself.
      g.classList.toggle('active', isActive);
      g.style.opacity = isActive ? '1' : '0';
      g.style.transform = isActive ? 'translateY(0)' : 'translateY(30px)';
    });
  };

  useEffect(() => {
    applyStepRef.current(activeStep);
  }, [activeStep]);

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
    svg.appendChild(el('rect', { width: '1200', height: '1420', fill: 'url(#grid)' }));

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

      return group;
    };

    PILLARS.forEach((p, idx) => {
      const cy = (idx === 0 || idx === 3) ? 398 : 375;
      const group = genStrauss(idx, p.x, cy, p.h);
      group.style.opacity = '0';
      group.style.transform = 'translateY(30px)';
      group.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      pillarsG.appendChild(group);
    });
    svg.appendChild(pillarsG);

    /* ── Step-driven reveal handled by applyStepRef in a separate effect ── */
    applyStepRef.current(0);
  }, [isDesktop]);

  const cardAnimate = (idx: number) => {
    // Cards 0-3 reveal at steps 1-4 (bridge first, then cards follow)
    const revealAt = Math.min(idx + 2, 5);
    return activeStep >= revealAt ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 1 };
  };

  return (
    <ErrorBoundary>
      <section
        id="why-choose-us"
        ref={wrapperRef}
        className="relative min-h-[190vh] bg-background border-b border-blueprint-line"
        aria-label="Why Choose Us"
      >
           {isDesktop ? (
             <div className="relative flex flex-row items-start pt-10 pb-12 w-full px-8">
                {/* ── Text content (left column) ── */}
                <div className="w-[30%] shrink-0 space-y-5 mt-50">
                  <span className="font-mono text-sm text-primary font-bold block">
                    Differentiator Matrix
                  </span>
                  <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
                    Why Choose The ACE Services?
                  </h2>
                  <div className="pt-0.5">
                    <div className="w-12 h-0.5 bg-primary rounded-full" />
                  </div>
                  <p className="font-sans text-sm md:text-lg text-on-surface-variant text-center font-medium max-w-md leading-relaxed">
                    What makes The ACE Services the top construction and estimation company in the industry? Elite mathematical modeling, multi-layered audit procedures, and a national track record that speaks for itself.
                  </p>
                </div>

                {/* ── Bridge illustration (right column, 30% bigger) ── */}
                <div className="w-[70%] overflow-visible">
                  <div
                    className="relative w-full origin-top-left"
                    style={{
                      aspectRatio: '1200 / 1420',
                      transform: 'scale(1)',
                      transformOrigin: 'top left',
                    }}
                  >
                    <svg
                      ref={svgRef}
                      viewBox="0 0 1200 1420"
                      className="w-full h-full pointer-events-none"
                      preserveAspectRatio="xMidYMid meet"
                      role="img"
                      aria-label="Suspension bridge illustration representing four foundational strengths of The ACE Services: bid win rate, expert oversight, national reach, and ISO-standard precision"
                    />

                    {cards.map((card, i) => (
                      <motion.div
                        key={card.label}
                        className="absolute pointer-events-auto"
                        style={{
                          left: CARD_POSITIONS[i].left,
                          top: CARD_POSITIONS[i].top,
                          width: '40%',
                          marginLeft: '-17.5%',
                        }}
                        animate={cardAnimate(i)}
                        transition={{ duration: 0.5, delay: 0.08 }}
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
                      </motion.div>
                    ))}
                  </div>
                </div>

          </div>
        ) : (
          <div className="relative z-10 flex flex-col px-6 pt-24 pb-16 max-w-md mx-auto">
            <div className="text-left space-y-3 mb-10">
              <span className="font-mono text-sm text-primary font-bold block">
                Differentiator Matrix
              </span>
              <h2 className="font-space text-3xl md:text-5xl font-extrabold text-on-background tracking-tighter">
                Why Choose The ACE Services?
              </h2>
              <div className="pt-1">
                <div className="w-16 h-0.5 bg-primary rounded-full" />
              </div>
              <p className="font-sans text-base md:text-lg text-on-surface-variant font-medium">
                What makes The ACE Services the top construction and estimation company in the industry? Elite mathematical modeling, multi-layered audit procedures, and a national track record that speaks for itself.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {cards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
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
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </section>
    </ErrorBoundary>
  );
}
