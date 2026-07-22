'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Layers, FileSpreadsheet, Compass, ShieldCheck } from 'lucide-react';
import { SolutionItem } from '../types';

const SOLUTION_IDS = ['sol_01', 'sol_02', 'sol_03', 'sol_04'];

const solutions: SolutionItem[] = [
  {
    id: 'sol_01',
    title: 'Construction Estimation',
    category: 'RESIDENTIAL, COMMERCIAL, INDUSTRIAL',
    description: 'Our core construction estimation services provide comprehensive cost analysis across every sector, from single-family homes to complex industrial plants and public infrastructure. As a leading construction cost estimating company, we combine expert evaluation of architecture, framing layouts, concrete volumes, and site-prep overheads with a high-speed 24–48 hour turnaround, so you never miss a bid deadline. Contractors who partner with our estimating team see an 89% bid win rate, backed by professional-grade accuracy on every quote.',
    details: [
      'Contractor Benefit: Secure high-stakes contracts with an 89% success rate backed by professional-grade accuracy',
      'Expert evaluation of architecture, framing layouts, concrete volumes, and site-prep overheads.',
      'High-speed 24-48h turnaround engineered to fit tight bid schedule pipelines.'
    ]
  },
  {
    id: 'sol_02',
    title: 'Quantity Surveyor Services & Material Lists',
    category: 'BILL OF QUANTITIES',
    description: 'Our quantity surveying company division delivers precise bills of quantities (BOQ) and material takeoff services built directly from your blueprints. Every quantity takeoff is verified for measurement accuracy, division-wise material volumes, and procurement-ready data, eliminating on-site waste and costly overordering before construction even begins.',
    details: [
      'Contractor Benefit: Eliminate material waste and mid-project budget spikes with precise procurement data',
      'CSI MasterFormat division pricing schedules matching regional rates.',
      'Accurate scrap multiplier calculation for steel rebars, timber plates, and conduit structures.'
    ]
  },
  {
    id: 'sol_03',
    title: 'Permit Sets & 3D Renderings',
    category: 'MUNICIPAL SUBMISSION & RENDERS',
    description: 'Beyond estimating, The ACE Services prepares fully compliant permit sets and photorealistic 3D renderings for municipal submission. Our pre-construction documentation team ensures your architectural drawings meet local code requirements while giving stakeholders a clear visual of the finished project, streamlining approvals and reducing costly revision cycles.',
    details: [
      'Contractor Benefit: Fast-track your approval process and win stakeholder buy-in with meticulous shop drawings and visual sets',
      'Double-verified structural and architectural layouts matching local municipal codes.',
      'Isometric interactive rendering matrices for visual stakeholder presentation and pre-sale marketing.'
    ]
  },
  {
    id: 'sol_04',
    title: 'Project Management & Scheduling',
    category: 'LIFECYCLE CONTROL',
    description: 'Our project management and scheduling division extends your pre-construction advantage into full lifecycle control. From procurement timelines to labor sequencing, our team keeps your project on budget and on schedule using ISO 9001-standard project controls, making The ACE Services a true end-to-end construction cost consultant, not just an estimating vendor.',
    details: [
      'Contractor Benefit: Protect your timeline and your reputation by implementing ideas with maximum efficiency',
      'Dynamic gantt workflows, critical path mapping, and logistics coordination buffer periods.',
      'Continuous budget burn-rate analytics preventing unforeseen change-order financial leakages.'
    ]
  }
];

const getIcon = (id: string) => {
  switch (id) {
    case 'sol_01': return <Layers className="w-5 h-5 text-primary" />;
    case 'sol_02': return <FileSpreadsheet className="w-5 h-5 text-primary" />;
    case 'sol_03': return <Compass className="w-5 h-5 text-primary" />;
    default: return <ShieldCheck className="w-5 h-5 text-primary" />;
  }
};

interface SolutionAccordionProps {
  activeIndex: number;
  onCardClick: (index: number) => void;
  mobile?: boolean;
}

export default function SolutionAccordion({ activeIndex, onCardClick, mobile = false }: SolutionAccordionProps) {
  const activeId = activeIndex >= 0 ? SOLUTION_IDS[activeIndex] : null;
  const activeItem = activeId ? solutions.find(s => s.id === activeId) : null;

  return (
    <div className="max-w-[85%] mx-auto">
      <div className="font-mono text-sm text-primary mb-8 border-b border-blueprint-line pb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
        [CORE_CAPABILITIES_PORTAL_ACTIVE]
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Card List */}
        <div className="w-1/2 md:w-1/2 space-y-3">
          {solutions.map((item, i) => {
            const isActive = activeId === item.id;
            return (
              <div key={item.id}>
                <div
                  onClick={() => onCardClick(i)}
                  className={`border border-blueprint-line bg-surface overflow-hidden hover:border-primary transition-all duration-300 cursor-pointer bracket-corners group ${
                    isActive ? 'ring-1 ring-primary border-primary shadow-sm' : ''
                  }`}
                >
                  <div className="flex justify-between items-center py-5 px-5 relative select-none">
                    <div 
                      className={`absolute left-0 top-0 h-full w-1.5 bg-primary transition-transform duration-300 ${
                        isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'
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
                        <h3 className={`font-space font-bold text-xl transition-colors duration-200 ${
                          isActive ? 'text-primary' : 'text-on-background group-hover:text-primary'
                        }`}>
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

                {/* Mobile: inline detail panel right after active card */}
                {mobile && isActive && activeItem && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeItem.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <DetailPanel item={activeItem} />
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop: Right Detail Panel */}
        {!mobile && (
          <div className="w-full md:w-1/2">
            <AnimatePresence mode="wait">
              {activeItem && (
                <motion.div
                  key={activeItem.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="border border-blueprint-line bg-surface p-6 bracket-corners h-full"
                >
                  <DetailPanelContent item={activeItem} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Shared detail panel content ── */
function DetailPanelContent({ item }: { item: SolutionItem }) {
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
    </>
  );
}

/* ── Mobile inline detail panel ── */
function DetailPanel({ item }: { item: SolutionItem }) {
  return (
    <div className="border border-blueprint-line bg-surface p-6 bracket-corners mt-3">
      <DetailPanelContent item={item} />
    </div>
  );
}
