'use client';

import { useState, useEffect } from 'react';
import { EstimationInputs, CostBreakdown } from '../../types';
import { calculateCost } from '../../services/costCalculator';

type StepId = 'projectType' | 'area' | 'params' | 'review';

const steps: { id: StepId; label: string; description: string }[] = [
  { id: 'projectType', label: 'Structure Type', description: 'Select project category' },
  { id: 'area', label: 'Floor Area', description: 'Define covered square footage' },
  { id: 'params', label: 'Parameters', description: 'Complexity & regional factors' },
  { id: 'review', label: 'Review', description: 'Confirm estimate parameters' },
];

type Inputs = EstimationInputs;

export function useEstimator() {
  const [currentStep, setCurrentStep] = useState<StepId>('projectType');
  const [inputs, setInputs] = useState<Inputs>({
    projectType: 'commercial', areaSqFt: 15000, complexity: 'medium', turnaroundSpeed: 'standard', zipCode: '75001',
  });
  const [breakdown, setBreakdown] = useState<CostBreakdown>({
    materials: 0, labor: 0, equipment: 0, permits: 0, total: 0, lowRange: 0, highRange: 0,
  });
  const [activeTab, setActiveTab] = useState<'calculator' | 'analysis'>('calculator');
  const [transmitted, setTransmitted] = useState(false);

  const stepIndex = steps.findIndex((s) => s.id === currentStep);

  useEffect(() => {
    setBreakdown(calculateCost(inputs));
  }, [inputs]);

  const next = () => {
    if (stepIndex < steps.length - 1) setCurrentStep(steps[stepIndex + 1].id);
  };
  const prev = () => {
    if (stepIndex > 0) setCurrentStep(steps[stepIndex - 1].id);
  };
  const handleTransmit = () => {
    setTransmitted(true);
    setTimeout(() => setTransmitted(false), 3000);
  };

  return {
    currentStep,
    inputs,
    setInputs,
    breakdown,
    activeTab,
    setActiveTab,
    transmitted,
    handleTransmit,
    stepIndex,
    next,
    prev,
  };
}

export type { StepId };
export { steps };
