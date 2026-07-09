import type { Metadata } from 'next';
import EstimatorWrapper from './EstimatorWrapper';

export const metadata: Metadata = {
  title: 'Cost Calculator',
  description:
    'Get an instant preliminary cost estimate for your construction project. Our interactive calculator provides AACE Class 3 budgetary allocations based on project type, square footage, complexity, and regional cost factors.',
  openGraph: {
    title: 'Cost Calculator | ACE SERVICES',
    description:
      'Interactive construction cost estimation engine. Configure project parameters and receive instant budgetary allocations with material, labor, equipment, and permit breakdowns.',
  },
};

export default function CalculatorPage() {
  return (
    <section className="min-h-screen px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] pt-24 pb-16">
      {/* Page Header */}
      <div className="max-w-5xl mx-auto mb-10">
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-primary tracking-[0.2em] uppercase font-bold mb-3">
          [SYS_MODULE] Estimation Engine
        </p>
        <h1 className="font-[family-name:var(--font-space)] text-3xl font-bold md:text-5xl tracking-tight">
          Cost <span className="text-primary">Calculator</span>
        </h1>
        <p className="mt-4 max-w-2xl text-on-surface-variant font-[family-name:var(--font-sans)] text-sm leading-relaxed">
          Configure your project parameters below to receive an instant preliminary cost estimate.
          All figures are AACE Class 3 accuracy — suitable for budget authorization and preliminary funding allocation.
        </p>
      </div>

      {/* Interactive Estimator */}
      <div className="max-w-5xl mx-auto">
        <EstimatorWrapper />
      </div>

      {/* Disclaimer */}
      <div className="max-w-5xl mx-auto mt-8 border-t border-blueprint-line pt-6">
        <p className="font-[family-name:var(--font-mono)] text-[10px] text-on-surface-variant leading-relaxed uppercase tracking-wider">
          * All estimates are preliminary budgetary allocations. Final project costs are determined
          through manual quantity surveying and may vary based on site conditions, material availability,
          and municipal regulatory requirements. Contact ACE SERVICES for a certified Class 3 estimate.
        </p>
      </div>
    </section>
  );
}
