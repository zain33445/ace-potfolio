'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

export default function CalculatorStripBanner() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Capture lead — in production this would POST to a CRM or email endpoint
    console.log('[LEAD] Estimate request from:', email);
    setSubmitted(true);
  };

  return (
    <div className="group block border-y border-blueprint-line relative overflow-hidden">
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
            <h3 className="font-space text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Get an Instant Bid Estimate
            </h3>

            <p className="font-sans text-base text-white/80 leading-relaxed max-w-xl">
              Use our parametric cost configurator to generate AACE Class&nbsp;3
              budgetary allocations in seconds. Enter your email below and we&rsquo;ll
              send your estimate straight to your inbox.
            </p>

            <Link
              href="/calculator"
              className="inline-flex items-center gap-2 font-mono text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              <span>OPEN FULL CALCULATOR</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Right: lead capture form */}
          <div className="flex-shrink-0 w-full lg:w-auto lg:min-w-[350px] self-center lg:self-start">
            {submitted ? (
              <div className="flex items-center gap-3 bg-white/15 backdrop-blur-sm px-6 py-4 bracket-corners">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-space font-bold text-white text-lg">
                    You&rsquo;re on the list
                  </p>
                  <p className="font-sans text-sm text-white/70">
                    We&rsquo;ll send your estimate to <strong className="text-white">{email}</strong>
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3"
              >
                <input
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 min-w-0 px-4 py-3 font-sans text-sm bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:outline-none focus:border-white/60 transition-colors bracket-corners"
                  aria-label="Email address for estimate"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 border-2 border-white bg-white px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-primary transition-all hover:bg-transparent hover:text-white flex-shrink-0 bracket-corners"
                >
                  <span>Send My Estimate</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Corner brackets */}
      <div className="absolute top-2 left-3 w-2 h-2 border-t-2 border-l-2 border-white/20 transition-colors duration-300 z-20" />
      <div className="absolute bottom-2 right-3 w-2 h-2 border-b-2 border-r-2 border-white/20 transition-colors duration-300 z-20" />
    </div>
  );
}
