'use client';

import dynamic from 'next/dynamic';

const InteractiveEstimator = dynamic(() => import('@/src/components/InteractiveEstimator'), {
  ssr: false,
  loading: () => (
    <div className="w-full bg-surface border border-blueprint-line p-8">
      <div className="h-6 w-48 rounded bg-surface-variant animate-pulse mb-4" />
      <div className="h-4 w-64 rounded bg-surface-variant animate-pulse" />
    </div>
  ),
});

export default function EstimatorWrapper() {
  return <InteractiveEstimator />;
}
