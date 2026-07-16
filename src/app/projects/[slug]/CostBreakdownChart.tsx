'use client';

import { motion } from 'motion/react';
import type { CostDivision } from '@/src/types';

interface Props {
  divisions: CostDivision[];
  maxCost: number;
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default function CostBreakdownChart({ divisions, maxCost }: Props) {
  // Sort divisions by cost descending
  const sorted = [...divisions].sort((a, b) => b.cost - a.cost);

  return (
    <div className="space-y-3">
      {sorted.map((div, i) => {
        const pct = (div.cost / maxCost) * 100;

        return (
          <div key={div.csiCode} className="group">
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-primary">
                  {div.csiCode}
                </span>
                <span className="font-sans text-base font-medium text-on-background">
                  {div.name}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-on-background">
                {formatCurrency(div.cost)}
              </span>
            </div>

            {/* Progress bar */}
            <div className="relative h-6 w-full overflow-hidden border border-blueprint-line bg-background">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary/80"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
              />
              {/* Percentage label inside bar */}
              <div className="absolute inset-y-0 left-0 flex items-center px-2">
                <span className="font-mono text-xs font-bold text-white mix-blend-difference">
                  {pct.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
