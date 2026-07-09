'use client';

import { useState, useEffect } from 'react';
import { useMotionValue, useSpring, useTransform, useMotionValueEvent } from 'motion/react';

export function useLerpedDisplay(value: number) {
  const motionVal = useMotionValue(value);
  const spring = useSpring(motionVal, { stiffness: 80, damping: 30 });
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString());
  const [formatted, setFormatted] = useState('0');
  useMotionValueEvent(display, 'change', setFormatted);
  useEffect(() => { motionVal.set(value); }, [value, motionVal]);
  return formatted;
}
