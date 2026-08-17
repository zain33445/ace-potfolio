"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  ChevronRight,
  Layers,
  FileSpreadsheet,
  Compass,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { SolutionItem } from "../types";

const SOLUTION_IDS = ["sol_01", "sol_02", "sol_03", "sol_04"];

// Default hardcoded solutions — used as fallback if WP fetch fails/returns empty
const defaultSolutions: SolutionItem[] = [
  {
    id: "sol_01",
    title: "Construction Estimation",
    category: "RESIDENTIAL, COMMERCIAL, INDUSTRIAL",
    description: `Our core construction estimation services provide comprehensive cost analysis across every sector,
     from single-family homes to complex industrial plants and public infrastructure. 
     As a leading construction cost estimating company,
      we combine expert evaluation of architecture, 
      framing layouts, concrete volumes, and 
      site-prep overheads with a high-speed 24–48 hour turnaround, 
      so you never miss a bid deadline. 
      Contractors who partner with our estimating team see an 89% bid win rate, 
      backed by professional-grade accuracy on every quote.`,
    details: [
      "Contractor Benefit: Secure high-stakes contracts with an 89% success rate backed by professional-grade accuracy",
      "Expert evaluation of architecture, framing layouts, concrete volumes, and site-prep overheads.",
      "High-speed 24-48h turnaround engineered to fit tight bid schedule pipelines.",
    ],
  },
  {
    id: "sol_02",
    title: "Quantity Surveyor Services & Material Lists",
    category: "BILL OF QUANTITIES",
    description:
      "Our quantity surveying company division delivers precise bills of quantities (BOQ) and material takeoff services built directly from your blueprints. Every quantity takeoff is verified for measurement accuracy, division-wise material volumes, and procurement-ready data, eliminating on-site waste and costly overordering before construction even begins.",
    details: [
      "Contractor Benefit: Eliminate material waste and mid-project budget spikes with precise procurement data",
      "CSI MasterFormat division pricing schedules matching regional rates.",
      "Accurate scrap multiplier calculation for steel rebars, timber plates, and conduit structures.",
    ],
  },
  {
    id: "sol_03",
    title: "Permit Sets & 3D Renderings",
    category: "MUNICIPAL SUBMISSION & RENDERS",
    description:
      "Beyond estimating, The ACE Services prepares fully compliant permit sets and photorealistic 3D renderings for municipal submission. Our pre-construction documentation team ensures your architectural drawings meet local code requirements while giving stakeholders a clear visual of the finished project, streamlining approvals and reducing costly revision cycles.Beyond estimating, The ACE Services prepares fully compliant permit sets and photorealistic 3D renderings for municipal submission. Our pre-construction documentation team ensures your architectural drawings meet local code requirements while giving stakeholders a clear visual of the finished project, streamlining approvals and reducing costly revision cycles.",
    details: [
      "Contractor Benefit: Fast-track your approval process and win stakeholder buy-in with meticulous shop drawings and visual sets",
      "Double-verified structural and architectural layouts matching local municipal codes.",
      "Isometric interactive rendering matrices for visual stakeholder presentation and pre-sale marketing.",
    ],
  },
  {
    id: "sol_04",
    title: "Project Management & Scheduling",
    category: "LIFECYCLE CONTROL",
    description:
      "Our project management and scheduling division extends your pre-construction advantage into full lifecycle control. From procurement timelines to labor sequencing, our team keeps your project on budget and on schedule using ISO 9001-standard project controls, making The ACE Services a true end-to-end construction cost consultant, not just an estimating vendor.",
    details: [
      "Contractor Benefit: Protect your timeline and your reputation by implementing ideas with maximum efficiency",
      "Dynamic gantt workflows, critical path mapping, and logistics coordination buffer periods.",
      "Continuous budget burn-rate analytics preventing unforeseen change-order financial leakages.",
    ],
  },
];

// Solutions shown in the accordion. These are the single source of truth.
//
// NOTE ON WORDPRESS EDITING:
// The WP content layer (src/services/wordpress/content.ts) exposes
// getServicePages() and getSolutions(), but NEITHER currently matches this
// accordion's 4 solution categories:
//   - getServicePages() -> ServicePage { summary, contentHtml } for slugs
//     like "commercial-construction" (project TYPES, not solution categories).
//   - getSolutions()    -> Solution { ... } for slugs prefixed "solution-".
// The 4 hardcoded items below don't map 1:1 to either, and ServicePage's
// shape (summary/contentHtml) differs from SolutionItem (description/details[]).
// To let a non-coder edit these, we first need a deliberate mapping + WP
// pages created with the right slugs/fields. Until that is designed, the
// hardcoded defaults render so the app builds and runs.
const solutions = defaultSolutions;

const SOLUTION_SLUGS: Record<string, string> = {
  sol_01: "/cost-estimating",
  sol_02: "/cost-estimating",
  sol_03: "/architectural-services",
  sol_04: "/project-management",
};

const getIcon = (id: string) => {
  switch (id) {
    case "sol_01":
      return <Layers className="w-5 h-5 text-primary" />;
    case "sol_02":
      return <FileSpreadsheet className="w-5 h-5 text-primary" />;
    case "sol_03":
      return <Compass className="w-5 h-5 text-primary" />;
    default:
      return <ShieldCheck className="w-5 h-5 text-primary" />;
  }
}

interface SolutionAccordionProps {
  activeIndex: number;
  onCardClick: (index: number) => void;
  mobile?: boolean;
}

export default function SolutionAccordion({
  activeIndex,
  onCardClick,
  mobile = false,
}: SolutionAccordionProps) {
  const detailRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* ── Responsive: detect mobile viewport to hide detail cards ── */
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobileViewport(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobileViewport(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const isMobile = mobile || isMobileViewport;

  /* ── IntersectionObserver: highlight name card when detail card enters viewport ── */
  useEffect(() => {
    if (isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = detailRefs.current.indexOf(
              entry.target as HTMLDivElement,
            );
            if (idx !== -1) {
              onCardClick(idx);
            }
          }
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
    );

    detailRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isMobile, onCardClick]);

  /* ── Click name card → scroll to detail card ── */
  const handleNameClick = (idx: number) => {
    onCardClick(idx);
    detailRefs.current[idx]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  /* ── Mobile: title cards only → navigate to service page ── */
  if (isMobile) {
    return (
      <div className="max-w-[100%] mx-auto">
        <div className="font-mono text-sm text-primary mb-8 border-b border-blueprint-line pb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          Core Capabilities
        </div>

        <div className="space-y-3">
          {solutions.map((item) => {
            const serviceHref = SOLUTION_SLUGS[item.id] ?? "/services";
            return (
              <Link
                key={item.id}
                href={serviceHref}
                className="block border border-blueprint-line bg-surface overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer bracket-corners group"
              >
                <div className="flex justify-between items-center py-5 px-5 relative select-none">
                  <div className="absolute left-0 top-0 h-full w-1.5 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-9 h-9 border border-blueprint-line bg-background bracket-corners group-hover:border-primary transition-colors">
                      {getIcon(item.id)}
                    </div>
                    <div>
                      <span className="block font-mono text-xs text-primary tracking-widest mb-0.5 font-bold">
                        {item.category}
                      </span>
                      <h3 className="font-space font-bold text-xl text-on-background group-hover:text-primary transition-colors duration-200">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <div className="text-on-surface-variant group-hover:text-primary transition-colors">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  /* ── Desktop: sticky name cards + stacked detail cards ── */
  return (
    <div className="max-w-[85%] mx-auto">
      <div className="font-mono text-sm text-primary mb-8 border-b border-blueprint-line pb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
        Core Capabilities
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Sticky Name Cards */}
        <div className="w-full md:w-1/2">
          <div className="md:sticky md:top-0 md:h-screen md:flex md:flex-col md:justify-center space-y-3">
            {solutions.map((item, i) => {
              const isActive = activeIndex === i;
              return (
                <div
                  key={item.id}
                  onClick={() => handleNameClick(i)}
                  className={`border border-blueprint-line bg-surface overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer bracket-corners group ${
                    isActive
                      ? "ring-1 ring-primary border-primary shadow-sm"
                      : ""
                  }`}
                >
                  <div className="flex justify-between items-center py-5 px-5 relative select-none">
                    <div
                      className={`absolute left-0 top-0 h-full w-1.5 bg-primary transition-transform duration-300 ${
                        isActive
                          ? "scale-y-100"
                          : "scale-y-0 group-hover:scale-y-100"
                      }`}
                    />

                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 border border-blueprint-line bg-background bracket-corners group-hover:border-primary transition-colors">
                        {getIcon(item.id)}
                      </div>
                      <div>
                        <span className="block font-mono text-xs text-primary tracking-widest mb-0.5 font-bold">
                          {item.category}
                        </span>
                        <h3
                          className={`font-space font-bold text-xl transition-colors duration-200 ${
                            isActive
                              ? "text-primary"
                              : "text-on-background group-hover:text-primary"
                          }`}
                        >
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <motion.div
                      animate={{ rotate: isActive ? 90 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-on-surface-variant group-hover:text-primary"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Detail Cards — each min-h-screen so only one is visible at a time */}
        <div className="w-full md:w-1/2">
          {solutions.map((item, i) => (
            <div
              key={item.id}
              ref={(el) => {
                detailRefs.current[i] = el;
              }}
              className="min-h-screen flex items-center py-20"
            >
              <motion.div
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full border border-blueprint-line bg-surface p-6 bracket-corners"
              >
                <DetailPanelContent item={item} />
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Shared detail panel content ── */
function DetailPanelContent({ item }: { item: SolutionItem }) {
  const serviceHref = SOLUTION_SLUGS[item.id] ?? "/services";
  return (
    <>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 border border-blueprint-line bg-background bracket-corners">
          {getIcon(item.id)}
        </div>
        <div>
          <span className="block font-mono text-xs text-primary tracking-widest mb-0.5 font-bold">
            {item.category}
          </span>
          <h3 className="font-space font-bold text-2xl text-on-background">
            {item.title}
          </h3>
        </div>
      </div>

      <p className="font-sans text-on-surface-variant text-lg mb-6 font-medium leading-relaxed">
        {item.description}
      </p>

      <div className="bg-background p-5 border border-blueprint-line bracket-corners">
        <h4 className="font-space font-semibold text-lg text-on-background uppercase tracking-wider mb-4">
          TECHNICAL SCOPE & VERIFICATIONS
        </h4>
        <ul className="space-y-3 font-sans text-lg text-on-surface-variant">
          {item.details.map((detail, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={serviceHref}
        className="group mt-6 inline-flex items-center gap-2 border border-blueprint-line bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary w-full justify-center bracket-corners"
      >
        <span>VIEW FULL SERVICE</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </>
  );
}
