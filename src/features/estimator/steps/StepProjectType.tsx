'use client';

import { EstimationInputs } from '../../../types';
import { projectTypes } from './projectTypes';

type Inputs = EstimationInputs;

export default function StepProjectType({ inputs, setInputs }: { inputs: Inputs; setInputs: (updater: (prev: Inputs) => Inputs) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-mono text-xs text-primary tracking-widest uppercase font-bold">Step 1 of 4</h4>
        <p className="font-space text-lg text-on-background mt-1">What type of project are you estimating?</p>
        <p className="font-mono text-[10px] text-on-surface-variant mt-1">Choose the category that best describes your scope of work. This sets the baseline rates for materials, labor, and equipment.</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {projectTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setInputs((prev) => ({ ...prev, projectType: type.value as Inputs['projectType'] }))}
            className={`px-3 py-3 border text-left font-sans text-sm font-semibold uppercase tracking-wider transition-all duration-200 bracket-corners ${
              inputs.projectType === type.value
                ? 'border-primary bg-primary/10 text-primary font-bold shadow-sm'
                : 'border-blueprint-line text-on-surface-variant hover:border-primary hover:text-primary bg-surface'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
}
