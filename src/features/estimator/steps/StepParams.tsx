'use client';

import { EstimationInputs } from '../../../types';

type Inputs = EstimationInputs;

export default function StepParams({ inputs, setInputs }: { inputs: Inputs; setInputs: (updater: (prev: Inputs) => Inputs) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-mono text-xs text-primary tracking-widest uppercase font-bold">Step 3 of 4</h4>
        <p className="font-space text-lg text-on-background mt-1">Refine the parameters</p>
        <p className="font-mono text-[10px] text-on-surface-variant mt-1">Fine-tune complexity, delivery speed, and regional cost factors for a more precise estimate.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold">[COMPLEXITY_COEF] Site & Materials Index</label>
          <div className="flex border border-blueprint-line p-1 bg-background bracket-corners">
            {(['simple', 'medium', 'high'] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setInputs((prev) => ({ ...prev, complexity: level }))}
                className={`flex-1 py-1.5 font-mono text-[10px] uppercase font-bold transition-all duration-200 ${
                  inputs.complexity === level ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold">[SCHEDULE_VELOCITY] Output Turnaround</label>
          <div className="flex border border-blueprint-line p-1 bg-background bracket-corners">
            <button
              type="button"
              onClick={() => setInputs((prev) => ({ ...prev, turnaroundSpeed: 'standard' }))}
              className={`flex-1 py-1.5 font-mono text-[10px] uppercase font-bold transition-all duration-200 ${
                inputs.turnaroundSpeed === 'standard' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Standard (48h)
            </button>
            <button
              type="button"
              onClick={() => setInputs((prev) => ({ ...prev, turnaroundSpeed: 'expedited' }))}
              className={`flex-1 py-1.5 font-mono text-[10px] uppercase font-bold transition-all duration-200 ${
                inputs.turnaroundSpeed === 'expedited' ? 'bg-primary text-white shadow-sm' : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              Rush (24h)
            </button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold">[TAX_LOCATION] Regional Cost Multiplier (Zip Code)</label>
        <div className="relative">
          <input
            type="text"
            maxLength={5}
            value={inputs.zipCode}
            onChange={(e) => {
              const cleaned = e.target.value.replace(/\D/g, '');
              setInputs((prev) => ({ ...prev, zipCode: cleaned }));
            }}
            className="w-full bg-background border border-blueprint-line focus:border-primary focus:ring-0 px-4 py-3 font-mono text-sm tracking-widest outline-none transition-colors"
            placeholder="75001"
          />
          <span className="absolute right-3 top-3.5 font-mono text-[10px] text-primary opacity-60">
            {inputs.zipCode.startsWith('9') || inputs.zipCode.startsWith('1')
              ? 'METROPOLITAN MULTIPLIER (1.18x)'
              : inputs.zipCode.startsWith('3') || inputs.zipCode.startsWith('7')
              ? 'OPTIMIZED REGION (0.94x)'
              : 'STANDARD REGULATORY INDEX (1.00x)'}
          </span>
        </div>
      </div>
    </div>
  );
}
