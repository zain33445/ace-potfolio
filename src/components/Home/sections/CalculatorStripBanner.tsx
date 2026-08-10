'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CalculatorStripBanner() {
  return (
    <section className="group block border-y border-blueprint-line relative overflow-hidden" aria-label="Get an Instant Estimate">
      {/* Orange background */}
      <div className="absolute inset-0 bg-primary" />

      {/* White box grid */}
      <div
        className="
          pointer-events-none
          absolute inset-0
          opacity-30
          [background-size:40px_40px]
          [background-image:linear-gradient(to_right,rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.8)_1px,transparent_1px)]
        "
      />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-14">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
          {/* Left: copy + link to full calculator */}
          <div className="flex-1 space-y-2">
            <h3 className="font-space text-2xl md:text-5xl font-extrabold text-white tracking-tight">
              Get an Instant Bid Estimate
            </h3>

            <p className="font-sans text-lg text-white/80 leading-relaxed max-w-xl">
              Use our parametric cost configurator to generate AACE Class&nbsp;3
              budgetary allocations in seconds — no forms, no waiting.
            </p>
          </div>

          {/* Right: calculator button */}
          <div className="m-auto">
            <Link
              href="/calculator"
              className="inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-6 py-3 font-mono text-lg font-bold uppercase tracking-wider text-primary transition-all hover:bg-transparent hover:text-white flex-shrink-0 bracket-corners"
            >
              <span>Click To Open Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-2 left-3 w-2 h-2 border-t-2 border-l-2 border-white/20 transition-colors duration-300 z-20" />
      <div className="absolute bottom-2 right-3 w-2 h-2 border-b-2 border-r-2 border-white/20 transition-colors duration-300 z-20" />
    </section>
  );
}
