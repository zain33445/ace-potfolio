'use client';

import React, { useState } from 'react';
import SolutionAccordion from '../../../components/SolutionAccordion';

export default function SolutionsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      id="solutions"
      className="relative bg-background border-b border-blueprint-line"
    >
      <div className="w-full max-w-8xl mx-auto px-6 md:px-16 py-12 flex flex-col">
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-1">
          <span className="font-mono text-sm text-primary font-bold block">[CAPABILITY_INDEX]</span>
          <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter">
            Core Service Solutions
          </h2>
          <p className="font-sans text-lg text-on-surface-variant">
            As a top construction and estimation company, The ACE Services operates across four specialized divisions engineered to deliver highly reliable pricing models, architectural reviews, and full-lifecycle project support — all built to fit tight bid schedule pipelines.
          </p>
        </div>

        {/* Accordion */}
        <SolutionAccordion
          activeIndex={activeIndex}
          onCardClick={setActiveIndex}
        />
      </div>
    </div>
  );
}
