'use client';

import { motion } from 'motion/react';
import { CheckCircle2, Sparkles, ChevronRight } from 'lucide-react';
import { EstimationInputs, CostBreakdown } from '../../../types';
import { projectTypes } from './projectTypes';

type Inputs = EstimationInputs;

export default function StepReview({ inputs, breakdown, transmitted, onTransmit }: {
  inputs: Inputs; breakdown: CostBreakdown; transmitted: boolean; onTransmit: () => void;
}) {
  const projectTypeLabel = projectTypes.find((t) => t.value === inputs.projectType)?.label ?? inputs.projectType;

  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-mono text-xs text-green-500 tracking-widest uppercase font-bold">Step 4 of 4</h4>
        <p className="font-space text-lg text-on-background mt-1 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" /> Estimate ready for review
        </p>
        <p className="font-mono text-[10px] text-on-surface-variant mt-1">Verify your selections below, then transmit the design parameters to receive a full detailed proposal.</p>
      </div>

      <div className="bg-background border border-blueprint-line p-4 space-y-3">
        {[
          { label: 'Project Type', value: projectTypeLabel },
          { label: 'Floor Area', value: `${inputs.areaSqFt.toLocaleString()} sq ft` },
          { label: 'Complexity', value: `${inputs.complexity}${inputs.complexity === 'simple' ? ' (0.85x)' : inputs.complexity === 'high' ? ' (1.35x)' : ' (1.00x)'}` },
          { label: 'Delivery', value: inputs.turnaroundSpeed === 'standard' ? '48 Hours' : '24 Hours (Rush)' },
          { label: 'Region', value: `Zip ${inputs.zipCode || '75001'}` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center font-mono text-xs">
            <span className="text-on-surface-variant">{row.label}</span>
            <span className="text-on-background font-bold uppercase">{row.value}</span>
          </div>
        ))}
        <div className="border-t border-blueprint-line pt-3 flex justify-between items-center">
          <span className="font-mono text-xs text-on-surface-variant">Estimated Total</span>
          <span className="font-space font-bold text-2xl text-primary">${breakdown.total.toLocaleString()}</span>
        </div>
      </div>

      <motion.button
        onClick={onTransmit}
        disabled={transmitted}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-primary text-white font-mono text-sm font-bold uppercase tracking-widest py-3.5 bracket-corners transition-all duration-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
      >
        {transmitted ? (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" /> Parameters Transmitted Successfully
          </motion.span>
        ) : (
          <>Transmit Design Parameters <ChevronRight className="w-4 h-4" /></>
        )}
      </motion.button>

      {transmitted && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-green-50 border border-green-300 p-3 text-center"
        >
          <p className="font-mono text-[10px] text-green-700 uppercase tracking-wider font-bold">
            Your estimate parameters have been submitted. A senior estimator will contact you within 24 hours.
          </p>
        </motion.div>
      )}
    </div>
  );
}
