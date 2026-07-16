'use client';

import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import SolutionAccordion from '../../../components/SolutionAccordion';
import { usePin } from '../../../PinContext';

const SERVICES_COUNT = 4;

export default function SolutionsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { setPinned } = usePin();

  /* ── Continuous scroll progress ── */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v);
    setPinned(v > 0.05 && v < 0.95);
  });

  /* ── Map scroll progress → active service index ── */
  /* progress 0→1 mapped to 0→4. Each card = 25% of scroll:
   *   0.00–0.25 → card 0
   *   0.25–0.50 → card 1
   *   0.50–0.75 → card 2
   *   0.75–1.00 → card 3
   * One scroll-wheel click ≈ one card advance. */
  const index = Math.max(
    0,
    Math.min(SERVICES_COUNT - 1, Math.floor(progress * SERVICES_COUNT)),
  );

  /* Update active index only when it changes */
  if (index !== activeIndex) {
    setActiveIndex(index);
  }

  /* ── Click-to-jump ── */
  const handleCardClick = (cardIndex: number) => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY;
    const wrapperHeight = wrapper.offsetHeight;
    const targetScroll = wrapperTop + (cardIndex / (SERVICES_COUNT - 1)) * (wrapperHeight - window.innerHeight);

    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  return (
    <div
      id="solutions"
      ref={wrapperRef}
      className="relative bg-background border-b border-blueprint-line"
      style={{ height: `${(SERVICES_COUNT + 1) * 100}vh` }}
    >
      {/* Sticky content — pins at top while parent scrolls through */}
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="w-full h-full max-w-7xl mx-auto px-6 md:px-16 py-24 flex flex-col">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-sm text-primary font-bold block">[CAPABILITY_INDEX]</span>
            <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter">
              Core Service Solutions
            </h2>
            <p className="font-sans text-lg text-on-surface-variant">
              Explore our specialized divisions engineered to provide highly reliable pricing models and architectural reviews.
            </p>
          </div>

          {/* Accordion (controlled) */}
          <div className="flex-1 min-h-0">
            <SolutionAccordion
              activeIndex={activeIndex}
              onCardClick={handleCardClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
