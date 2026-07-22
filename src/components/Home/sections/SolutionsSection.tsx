'use client';

import React, { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent } from 'motion/react';
import SolutionAccordion from '../../../components/SolutionAccordion';
import { usePin } from '../../../PinContext';

const SERVICES_COUNT = 4;

function useMediaQuery(query: string): boolean {
  return React.useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export default function SolutionsSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [activeIndex, setActiveIndex] = useState(-1);
  const { setPinned } = usePin();
  const pinnedLocked = useRef(false);

  /* ── Continuous scroll progress ── */
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ['start start', 'end end'],
  });

  const [progress, setProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setProgress(v);
    if (!isMobile) {
      if (v > 0.05 && v < 0.95) {
        pinnedLocked.current = true;
        setPinned(true);
      } else if (v >= 0.95) {
        pinnedLocked.current = false;
        setPinned(false);
      }
    }
  });

  /* ── Map scroll progress → active service index (desktop only) ── */
  const index = Math.max(
    0,
    Math.min(SERVICES_COUNT - 1, Math.floor(progress * SERVICES_COUNT)),
  );

  /* Update active index only when it changes — desktop only */
  if (!isMobile && index !== activeIndex) {
    setActiveIndex(index);
  }

  /* ── Click-to-jump (desktop) / toggle (mobile) ── */
  const handleCardClick = (cardIndex: number) => {
    if (isMobile) {
      /* Mobile: toggle — clicking same card deactivates, otherwise activates */
      setActiveIndex(prev => prev === cardIndex ? -1 : cardIndex);
      return;
    }

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
      className={`relative bg-background border-b border-blueprint-line ${isMobile ? 'overflow-hidden' : ''}`}
      style={isMobile ? {} : { height: `${(SERVICES_COUNT + 1) * 150}vh` }}
    >
      {/* Sticky content — pins at top while parent scrolls through (desktop only) */}
      <div className={isMobile ? '' : 'sticky top-0 h-screen overflow-hidden'}>
        <div className="w-full h-full max-w-8xl mx-auto px-6 md:px-16 py-12 flex flex-col">
          {/* Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-sm text-primary font-bold block">[CAPABILITY_INDEX]</span>
            <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter">
              Core Service Solutions
            </h2>
            <p className="font-sans text-lg text-on-surface-variant">
              As a top construction and estimation company, The ACE Services operates across four specialized divisions engineered to deliver highly reliable pricing models, architectural reviews, and full-lifecycle project support — all built to fit tight bid schedule pipelines.
            </p>
          </div>

          {/* Accordion (controlled) */}
          <div className="min-h-0 max-w-8xl mx-auto w-full">
            <SolutionAccordion
              activeIndex={activeIndex}
              onCardClick={handleCardClick}
              mobile={isMobile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
