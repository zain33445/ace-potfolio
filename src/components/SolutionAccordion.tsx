import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronRight, Layers, FileSpreadsheet, Compass, ShieldCheck } from 'lucide-react';
import { SolutionItem } from '../types';

const SOLUTION_IDS = ['sol_01', 'sol_02', 'sol_03', 'sol_04'];

export default function SolutionAccordion() {
  const [activeId, setActiveId] = useState<string>('sol_01');
  const activeRef = useRef(0);

  useEffect(() => {
    const section = document.getElementById('solutions');
    if (!section) return;

    const onWheel = (e: WheelEvent) => {
      if (!section.contains(e.target as Node)) return;

      const dir = e.deltaY > 0 ? 1 : -1;
      const next = activeRef.current + dir;
      if (next >= 0 && next < SOLUTION_IDS.length) {
        activeRef.current = next;
        setActiveId(SOLUTION_IDS[next]);
        e.stopPropagation();
        e.preventDefault();
      }
    };

    document.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () =>
      document.removeEventListener('wheel', onWheel, {
        capture: true,
      } as EventListenerOptions);
  }, []);

  const solutions: SolutionItem[] = [
    {
      id: 'sol_01',
      title: 'Construction Estimation',
      category: 'RESIDENTIAL, COMMERCIAL, INDUSTRIAL',
      description: 'We provide comprehensive cost analysis across all sectors, from single-family homes to complex industrial plants and public infrastructure.',
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
      description: 'Detailed material takeoffs and procurement scheduling designed to streamline your supply chain and prevent on-site delays.',
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
      description: 'High-precision permit facilitation, architectural drafting, and stunning 3D renders that bring your vision to life before the first shovel hits the ground.',
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
      description: 'Seamless procurement and precise scheduling to ensure your project execution is as flawless as the initial bid.',
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

  const activeItem = solutions.find(s => s.id === activeId);

  return (
    <div className="max-w-6xl mx-auto" id="solutions">
      <div className="font-mono text-xs text-primary mb-8 border-b border-blueprint-line pb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
        [CORE_CAPABILITIES_PORTAL_ACTIVE]
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left: Card List */}
        <div className="w-full md:w-1/2 space-y-3">
          {solutions.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setActiveId(item.id)}
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
                      <span className="block font-mono text-[9px] text-primary tracking-widest mb-0.5 font-bold">
                        {item.category}
                      </span>
                      <h3 className={`font-space font-bold text-base transition-colors duration-200 ${
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
            );
          })}
        </div>

        {/* Right: Detail Panel */}
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
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 border border-blueprint-line bg-background bracket-corners">
                    {getIcon(activeItem.id)}
                  </div>
                  <div>
                    <span className="block font-mono text-[10px] text-primary tracking-widest mb-0.5 font-bold">
                      {activeItem.category}
                    </span>
                    <h3 className="font-space font-bold text-xl text-on-background">
                      {activeItem.title}
                    </h3>
                  </div>
                </div>

                <p className="font-sans text-on-surface-variant text-base mb-6 font-medium leading-relaxed">
                  {activeItem.description}
                </p>

                <div className="bg-background p-5 border border-blueprint-line bracket-corners">
                  <h4 className="font-space font-semibold text-sm text-on-background uppercase tracking-wider mb-4">
                    TECHNICAL SCOPE & VERIFICATIONS
                  </h4>
                  <ul className="space-y-3 font-sans text-sm text-on-surface-variant">
                    {activeItem.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
