'use client';

import RevealInner from './RevealInner';
import type { ReactNode } from 'react';

type AnimationType = 'fadeUp' | 'scaleIn' | 'fadeIn';

interface RevealProps {
  children: ReactNode;
  type?: AnimationType;
  delay?: number;
  className?: string;
  once?: boolean;
}

export default function Reveal(props: RevealProps) {
  return <RevealInner {...props} />;
}
