import { EstimationInputs } from '../../types';

type Inputs = EstimationInputs;

export default function StepArea({ inputs, setInputs }: { inputs: Inputs; setInputs: (updater: (prev: Inputs) => Inputs) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-mono text-xs text-primary tracking-widest uppercase font-bold">Step 2 of 4</h4>
        <p className="font-space text-lg text-on-background mt-1">Define the total floor area</p>
        <p className="font-mono text-[10px] text-on-surface-variant mt-1">Slide to specify the approximate square footage for your project. Adjustments cascade into all line items.</p>
      </div>
      <div className="flex justify-between items-center">
        <label className="block font-mono text-[10px] text-primary tracking-widest uppercase font-bold">[GRID_AREA] Total Covered Floor Area</label>
        <span className="font-mono text-xs text-on-background bg-background px-2 py-0.5 border border-blueprint-line font-bold">
          {inputs.areaSqFt.toLocaleString()} sq ft
        </span>
      </div>
      <input
        type="range"
        min="1000"
        max="200000"
        step="500"
        value={inputs.areaSqFt}
        onChange={(e) => setInputs((prev) => ({ ...prev, areaSqFt: parseInt(e.target.value) }))}
        className="w-full accent-primary h-1.5 bg-background rounded-lg appearance-none cursor-pointer border border-blueprint-line"
      />
      <div className="flex justify-between font-mono text-[9px] text-on-surface-variant">
        <span>1,000 SF</span>
        <span>50,000 SF</span>
        <span>100,000 SF</span>
        <span>150,000 SF</span>
        <span>200,000 SF</span>
      </div>
    </div>
  );
}
