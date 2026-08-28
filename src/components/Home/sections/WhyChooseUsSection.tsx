"use client";

import React from "react";
import { motion, type Variants } from "motion/react";
import {
  TrendingUp,
  ShieldCheck,
  Calculator,
  MapPin,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";

// Framer Motion Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
};

export default function WhyChooseUsSection() {
  return (
    <section className="relative w-full bg-[#F8F9FA] py-24 px-6 md:px-12 lg:px-20 overflow-hidden text-slate-900">
      {/* Background Architectural Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          {/* <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-3"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]" />
            <span className="text-xs font-bold tracking-widest text-[#FF6B00] uppercase">
              Key Differences
            </span>
          </motion.div> */}

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-950 mb-4"
          >
            Why Choose The ACE Services?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 text-lg leading-relaxed"
          >
            What makes us the top construction estimation partner? Elite
            mathematical modeling, multi-layered audit procedures, and a proven
            national track record built for competitive bids.
          </motion.p>
        </div>

        {/* Bento Grid Layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6"
        >
          {/* Card 1: Main Highlight (89% Win Rate) - Spans 7 cols on large screens */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-7 bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B00]/5 rounded-full filter blur-3xl group-hover:bg-[#FF6B00]/10 transition-colors" />

            <div>
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-600">
                  Industry Leading
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-6xl md:text-7xl font-black tracking-tight text-slate-950">
                  89%
                </span>
                <span className="text-xl font-bold text-[#FF6B00]">
                  Bid Win Rate
                </span>
              </div>

              <p className="text-slate-600 text-base md:text-lg max-w-lg mt-4 leading-relaxed">
                Our estimates aren’t just accurate—they’re strategically
                engineered to help general contractors and subcontractors win
                competitive bids in tight markets. This bid-win performance is
                the reason so many builders choose us as their pre-construction
                estimation partner.
              </p>
            </div>

            {/* Micro visual indicator */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 font-medium">
              <span>Optimized for Tight Markets</span>
              {/* <div className="flex items-center gap-1 text-[#FF6B00] group-hover:translate-x-1 transition-transform">
                <span>See Case Studies</span>
                <ArrowUpRight className="w-4 h-4" />
              </div> */}
            </div>
          </motion.div>

          {/* Card 2: Multi-Layered Audit - Spans 5 cols */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-5 bg-[#FF6B00] text-white rounded-3xl p-8 md:p-10 shadow-xl flex flex-col justify-between relative overflow-hidden group"
          >
            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/25 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center mb-8 backdrop-blur-md">
                <ShieldCheck className="w-6 h-6" />
              </div>

              <span className="font-mono text-sm text-white/90 font-bold tracking-widest block mb-2">
                Expert Review
              </span>
              <h3 className="text-2xl font-bold mb-3 text-white">
                Senior Consultant Oversight
              </h3>
              <p className="text-white/85 text-base leading-relaxed mb-6">
                Every project moves through a mandatory two-stage quality
                assurance process, reviewed by our most experienced estimators.
                This layered QA approach is what separates a professional
                estimating company from a generic takeoff service.
              </p>

              <div className="space-y-3">
                {[
                  "Stage 1 · Estimate & Takeoff Preparation",
                  "Stage 2 · Senior Consultant Quality Audit",
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-white/10 border border-white/25 rounded-xl px-4 py-2.5 text-sm font-medium text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Elite Mathematical Modeling - Spans 6 cols */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6">
              <Calculator className="w-6 h-6 text-[#FF6B00]" />
            </div>

            <span className="font-mono text-sm text-[#FF6B00] font-bold tracking-widest block mb-2">
              ISO Standard
            </span>
            <h3 className="text-2xl font-bold text-slate-950 mb-2">
              ISO-Standard Precision
            </h3>
            <p className="text-slate-600 text-base leading-relaxed mb-6">
              We follow international ISO 9001 construction standards, ensuring
              every pre-construction estimate, material takeoff, and quantity
              survey meets the highest global benchmark for accuracy and
              consistency.
            </p>

            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="text-center border-r border-slate-200 pr-4">
                <span className="block text-xl font-bold text-slate-900">
                  ISO
                </span>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider">
                  9001 Standard
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Highest Global Benchmark
                </span>
                <span className="text-xs text-slate-500">
                  Accuracy &amp; consistency in every deliverable
                </span>
              </div>
            </div>
          </motion.div>

          {/* Card 4: National Track Record - Spans 6 cols */}
          <motion.div
            variants={cardVariants}
            className="lg:col-span-6 bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-[#FF6B00]" />
              </div>

              <span className="font-mono text-sm text-[#FF6B00] font-bold tracking-widest block mb-2">
                National Reach
              </span>
              <h3 className="text-2xl font-bold text-slate-950 mb-2">
                Proven National Reach
              </h3>
              <p className="text-slate-600 text-base leading-relaxed mb-6">
                With 2,893 estimates delivered across 35 U.S. states, spanning
                bridges, healthcare facilities, retail builds, and industrial
                plants — a national estimating footprint that general
                contractors, civil engineers, and trade specialists rely on
                coast to coast.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#FF6B00]/5 rounded-2xl p-4 border border-[#FF6B00]/10">
                <span className="text-2xl font-black text-slate-950 block">
                  35 States
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Served Coast to Coast
                </span>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                <span className="text-2xl font-black text-slate-950 block">
                  2,893+
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Estimates Delivered
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
