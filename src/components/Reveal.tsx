'use client';

import { Suspense, lazy } from 'react';
import type { ReactNode } from 'react';

const RevealInner = lazy(() => import('./RevealInner'));

type AnimationType = 'fadeUp' | 'scaleIn' | 'fadeIn';

interface RevealProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
  once?: boolean;
}

/* No-op fallback while GSAP chunk loads — children render immediately */
function NoOpReveal({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export default function Reveal(props: RevealProps) {
  return (
    <Suspense fallback={<NoOpReveal className={props.className}>{props.children}</NoOpReveal>}>
      <RevealInner {...props} />
    </Suspense>
  );
}
