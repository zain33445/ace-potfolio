'use client';

import { useState } from 'react';

/**
 * Serves the "adu cost calculator" query (~250/mo) with the page's own
 * measured rates rather than a generic national average. Deliberately two
 * inputs: anything more implies a precision one estimate cannot support.
 */
export default function AduCostCalculator({
  costPerSf,
  bidPerSf,
}: {
  costPerSf: number;
  bidPerSf: number;
}) {
  const [sf, setSf] = useState(800);

  const clamped = Number.isFinite(sf) ? Math.min(Math.max(sf, 100), 1500) : 0;
  const money = (n: number) => `$${Math.round(n).toLocaleString('en-US')}`;

  return (
    <div className="border border-blueprint-line bg-surface p-6">
      <label
        htmlFor="adu-sf"
        className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant"
      >
        Unit size (sq ft)
      </label>

      <div className="mt-3 flex items-center gap-4">
        <input
          id="adu-sf"
          type="range"
          min={100}
          max={1500}
          step={25}
          value={clamped}
          onChange={(e) => setSf(Number(e.target.value))}
          className="h-1 flex-1 cursor-pointer appearance-none rounded bg-blueprint-line accent-primary"
        />
        <input
          type="number"
          min={100}
          max={1500}
          value={sf}
          onChange={(e) => setSf(Number(e.target.value))}
          aria-label="Unit size in square feet"
          className="w-24 border border-blueprint-line bg-background px-3 py-2 text-right font-mono tabular-nums text-on-background"
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-blueprint-line pt-5">
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
            Construction cost
          </div>
          <div className="mt-1 font-[family-name:var(--font-space)] text-2xl font-bold tabular-nums text-on-background">
            {money(clamped * costPerSf)}
          </div>
        </div>
        <div>
          <div className="font-mono text-xs font-bold uppercase tracking-[0.15em] text-on-surface-variant">
            Typical bid
          </div>
          <div className="mt-1 font-[family-name:var(--font-space)] text-2xl font-bold tabular-nums text-on-background">
            {money(clamped * bidPerSf)}
          </div>
        </div>
      </div>

      <p className="mt-4 font-sans text-xs leading-relaxed text-on-surface-variant">
        Hard construction cost only, at this project&rsquo;s measured $
        {costPerSf.toFixed(2)}/SF. It excludes everything in the list above, and small
        units run higher per foot than this rate suggests. Treat it as a starting
        bracket, not a budget.
      </p>
    </div>
  );
}
