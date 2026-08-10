'use client';

import { useState, useEffect, useCallback } from 'react';
import { EstimationInputs, CostBreakdown } from '../../types';
import { calculateCost } from '../../services/costCalculator';

type StepId = 'projectType' | 'area' | 'params' | 'review';

const steps: { id: StepId; label: string; description: string }[] = [
  { id: 'projectType', label: 'Structure Type', description: 'Select category' },
  { id: 'area', label: 'Floor Area', description: 'provide area' },
  { id: 'params', label: 'Parameters', description: 'Parameters' },
  { id: 'review', label: 'Review', description: 'Review and Confirm' },
];

type Inputs = EstimationInputs;

export function useEstimator() {
  const [currentStep, setCurrentStep] = useState<StepId>('projectType');
  const [inputs, setInputs] = useState<Inputs>({
    projectType: 'commercial', areaSqFt: 15000, complexity: 'medium', turnaroundSpeed: 'standard', zipCode: '75001', email: '',
  });
  const [breakdown, setBreakdown] = useState<CostBreakdown>({
    materials: 0, labor: 0, equipment: 0, permits: 0, total: 0, lowRange: 0, highRange: 0,
  });
  const [activeTab, setActiveTab] = useState<'calculator' | 'analysis'>('calculator');
  const [transmitted, setTransmitted] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

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
  const handleTransmit = useCallback(async () => {
    setSubmitStatus('sending');

    const formData = new FormData();
    formData.append('email', inputs.email);
    formData.append('projectType', inputs.projectType);
    formData.append('areaSqFt', String(inputs.areaSqFt));
    formData.append('complexity', inputs.complexity);
    formData.append('turnaroundSpeed', inputs.turnaroundSpeed);
    formData.append('zipCode', inputs.zipCode);
    formData.append('total', String(breakdown.total));
    if (uploadedFile) {
      formData.append('file', uploadedFile);
    }

    try {
      const res = await fetch('/api/estimate', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Submission failed');
      setTransmitted(true);
      setSubmitStatus('success');
      setTimeout(() => {
        setTransmitted(false);
        setSubmitStatus('idle');
      }, 5000);
    } catch {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 4000);
    }
  }, [inputs, breakdown.total, uploadedFile]);

  return {
    currentStep,
    inputs,
    setInputs,
    breakdown,
    activeTab,
    setActiveTab,
    transmitted,
    handleTransmit,
    uploadedFile,
    setUploadedFile,
    submitStatus,
    stepIndex,
    next,
    prev,
  };
}

export type { StepId };
export { steps };
