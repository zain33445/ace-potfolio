export function splitTextIntoChars(text: string): string[] {
  return text.split('').map((char) => (char === ' ' ? '\u00A0' : char));
}

export function splitTextIntoWords(text: string): string[] {
  return text.split(' ');
}

export const easeSoft = [0.22, 1, 0.36, 1] as const;

export const staggerConfig = {
  word: {
    each: 0.04,
    ease: easeSoft,
  },
  char: {
    each: 0.02,
    ease: easeSoft,
  },
};

export const revealVariants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.9,
      ease: easeSoft,
    },
  }),
};

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeSoft },
  },
};

export const scaleInVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: easeSoft },
  },
};

/* ── Shared SVG path utilities ──────────────── */

export function buildCurvedPath(points: { x: number; y: number }[]): string {
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

export function computePathPositions(
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

export function applyDashOffset(path: SVGPathElement, ratio: number) {
  const len = path.getTotalLength();
  if (!len) return;
  path.style.strokeDasharray = String(len);
  path.style.strokeDashoffset = String(len * Math.max(0, Math.min(1, 1 - ratio)));
}
