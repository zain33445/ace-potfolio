'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CalculatorStripBanner() {
  return (
    <Link
      href="/calculator"
      className="group block border-y border-blueprint-line relative overflow-hidden"
    >
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

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 z-10" />

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-16 py-10 md:py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex-1 space-y-2">
          <span className="font-mono text-xs text-white/70 font-bold tracking-widest block">
            [BID_CALCULATOR_v3]
          </span>

          <h3 className="font-space text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Get an Instant Bid Estimate
          </h3>

          <p className="font-sans text-base text-white/80 leading-relaxed max-w-xl">
            Use our parametric cost configurator to generate AACE Class&nbsp;3
            budgetary allocations in seconds, no forms, no wait. As the top construction and estimation company for fast, accurate pre-construction numbers, The ACE Services puts professional-grade cost estimating directly in your hands.
          </p>
        </div>

        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="font-mono text-sm font-bold text-white tracking-widest group-hover:mr-1 transition-all duration-300">
            OPEN CALCULATOR
          </span>

          <div className="flex items-center justify-center w-10 h-10 border border-white/40 bg-white/10 group-hover:bg-white group-hover:border-white transition-all duration-300 bracket-corners">
            <ArrowRight className="w-5 h-5 text-white group-hover:text-primary transition-colors duration-300" />
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-2 left-3 w-2 h-2 border-t-2 border-l-2 border-white/20 group-hover:border-white/60 transition-colors duration-300 z-20" />

      <div className="absolute bottom-2 right-3 w-2 h-2 border-b-2 border-r-2 border-white/20 group-hover:border-white/60 transition-colors duration-300 z-20" />
    </Link>
  );
}