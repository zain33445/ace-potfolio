'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Calculator, DollarSign, Hammer, Truck, FileText, ChevronRight, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { useLerpedDisplay } from '../features/estimator/useLerpedDisplay';
import { useEstimator, steps } from '../features/estimator/useEstimator';
import StepProjectType from '../features/estimator/steps/StepProjectType';
import StepArea from '../features/estimator/steps/StepArea';
import StepParams from '../features/estimator/steps/StepParams';
import StepReview from '../features/estimator/steps/StepReview';

export default function InteractiveEstimator() {
  const {
    currentStep, inputs, setInputs, breakdown, activeTab, setActiveTab,
    transmitted, handleTransmit, stepIndex, next, prev,
  } = useEstimator();

  const displayTotal = useLerpedDisplay(breakdown.total);

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="w-full bg-surface border border-blueprint-line bracket-corners overflow-hidden">
      <div className="border-b border-blueprint-line px-6 py-4 bg-background/50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-primary" />
          <span className="font-space font-bold uppercase tracking-wider text-base">
            Interactive Cost Takeoff Engine [V2.5]
          </span>
        </div>
        <div className="flex bg-background border border-blueprint-line p-1 bracket-corners">
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-4 py-1.5 font-mono text-sm uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'calculator' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Configurator
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-1.5 font-mono text-sm uppercase tracking-wider transition-all duration-200 ${
              activeTab === 'analysis' ? 'bg-primary text-white font-bold' : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            Cost Schematics
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-blueprint-line">
        {/* LEFT COLUMN: Step wizard */}
        <div className="lg:col-span-7 p-6 flex flex-col">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2 flex-1">
                <div
                  className={`flex items-center justify-center w-7 h-7 border font-mono text-xs font-bold transition-all duration-300 ${
                    i === stepIndex
                      ? 'border-primary bg-primary text-white'
                      : i < stepIndex
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-blueprint-line text-on-surface-variant'
                  }`}
                  style={{ clipPath: 'polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%, 15% 50%)' }}
                >
                  {i < stepIndex ? <Check className="w-3 h-3" /> : i + 1}
                </div>
                <div className="hidden md:block">
                  <span className={`block font-mono text-xs uppercase tracking-widest ${
                    i <= stepIndex ? 'text-primary' : 'text-on-surface-variant'
                  }`}>{s.description}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-px mx-1 ${i < stepIndex ? 'bg-green-500' : 'bg-blueprint-line'}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div className="relative flex-1 min-h-[280px]">
            <AnimatePresence mode="wait" custom={stepIndex}>
              <motion.div
                key={currentStep}
                custom={stepIndex}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                {currentStep === 'projectType' && (
                  <StepProjectType inputs={inputs} setInputs={setInputs} />
                )}
                {currentStep === 'area' && (
                  <StepArea inputs={inputs} setInputs={setInputs} />
                )}
                {currentStep === 'params' && (
                  <StepParams inputs={inputs} setInputs={setInputs} />
                )}
                {currentStep === 'review' && (
                  <StepReview inputs={inputs} breakdown={breakdown} transmitted={transmitted} onTransmit={handleTransmit} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          {currentStep !== 'review' && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-blueprint-line">
              <div>
                {stepIndex > 0 && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-1.5 font-mono text-sm uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Previous
                  </button>
                )}
              </div>
              <button
                onClick={next}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-primary text-white font-mono text-base font-bold uppercase tracking-widest bracket-corners hover-brackets transition-all duration-200"
              >
                Continue <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Persistent cost panel */}
        <div className="lg:col-span-5 p-6 bg-background/30 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-sm text-on-surface-variant block uppercase">
                  ESTIMATED CONSTRUCTION COST INTERVAL
                </span>
                <motion.h3 className="font-space font-bold text-5xl md:text-6xl text-on-background tracking-tighter mt-1">
                  ${displayTotal}
                </motion.h3>
                <span className="font-mono text-sm text-primary block mt-1 tracking-wider uppercase">
                  Class 3 Accuracy range: ${breakdown.lowRange.toLocaleString()} — ${breakdown.highRange.toLocaleString()} (99.8%)
                </span>
              </div>
              <div className="p-2 border border-blueprint-line bg-surface bracket-corners font-mono text-center">
                <span className="block text-xs text-primary">BID ENGINE</span>
                <span className="block text-base font-bold">ACTIVE</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'calculator' ? (
                <motion.div
                  key="calculator"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {([{ key: 'materials', label: 'Bill of Materials', icon: DollarSign, value: breakdown.materials },
                    { key: 'labor', label: 'Crew Labor Fees', icon: Hammer, value: breakdown.labor },
                    { key: 'equipment', label: 'Logistics & Equipment', icon: Truck, value: breakdown.equipment },
                    { key: 'permits', label: 'Municipal Permit Allocation', icon: FileText, value: breakdown.permits },
                  ] as const).map((item) => (
                    <div key={item.key} className="bg-surface p-3 border border-blueprint-line bracket-corners">
                      <div className="flex justify-between font-mono text-xs uppercase tracking-wider mb-2">
                        <span className="flex items-center gap-1.5 font-bold">
                          <item.icon className="w-3.5 h-3.5 text-primary" /> {item.label}
                        </span>
                        <span>${item.value.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-background h-2 border border-blueprint-line">
                        <motion.div
                          className="bg-primary h-full"
                          initial={false}
                          animate={{ width: `${(item.value / breakdown.total) * 100}%` }}
                          transition={{ duration: 0.4, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="analysis"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="bg-surface border border-blueprint-line p-4 font-mono text-sm space-y-4"
                >
                  <div className="border-b border-dashed border-blueprint-line pb-2 flex justify-between uppercase text-xs font-bold">
                    <span>ITEMIZED PARAMETRIC SCHEDULE</span>
                    <span>UNITS DETAILED</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Structural Type:', value: inputs.projectType, format: 'uppercase' },
                      { label: 'Base SF Area:', value: `${inputs.areaSqFt.toLocaleString()} sq ft`, format: '' },
                      { label: 'Site Index:', value: `${inputs.complexity} (${inputs.complexity === 'simple' ? '0.85x' : inputs.complexity === 'high' ? '1.35x' : '1.00x'})`, format: 'uppercase' },
                      { label: 'Target Delivery:', value: inputs.turnaroundSpeed === 'standard' ? '48 Hours' : '24 Hours (Rush)', format: 'uppercase' },
                      { label: 'Regional Coef:', value: `Zip Code ${inputs.zipCode || '75001'}`, format: '' },
                    ].map((row) => (
                      <div key={row.label} className="flex justify-between text-on-surface-variant">
                        <span>{row.label}</span>
                        <span className={`text-on-background font-bold ${row.format}`}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-dashed border-blueprint-line pt-2 space-y-2">
                    <div className="flex items-center gap-2 text-green-700 bg-green-50 px-2 py-1 border border-green-200 uppercase text-xs font-bold">
                      <Check className="w-3.5 h-3.5 flex-shrink-0" /> Dual-validation review protocol ready
                    </div>
                    <p className="text-xs leading-normal text-on-surface-variant">
                      *The above figures are representative estimates. ACE Services verifies every final project takeoff using manual quantity surveying procedures to guarantee a 99.8% precision rating to municipal departments.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-6 pt-4 border-t border-blueprint-line">
            {currentStep === 'review' ? (
              <button
                onClick={handleTransmit}
                disabled={transmitted}
                className="w-full bg-primary text-white font-mono text-sm font-bold uppercase tracking-widest py-3.5 bracket-corners hover-brackets transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
              >
                {transmitted ? (
                  <><Sparkles className="w-4 h-4 text-yellow-300" /> Parameters Transmitted</>
                ) : (
                  <>Transmit Design Parameters <ChevronRight className="w-4 h-4" /></>
                )}
              </button>
            ) : (
              <p className="text-center font-mono text-xs text-on-surface-variant uppercase tracking-wider">
                Complete all steps to transmit design parameters
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


