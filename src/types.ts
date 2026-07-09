export interface ProjectScope {
  id: string;
  name: string;
  category: 'COMMERCIAL' | 'HOSPITALITY' | 'RETAIL' | 'MUNICIPAL';
  scope: string;
  turnaroundHours: number;
  totalAreaSqFt: number;
  estimatedCost: number;
  description: string;
}

export interface SolutionItem {
  id: string;
  title: string;
  category: string;
  description: string;
  details: string[];
}

export interface EstimationInputs {
  projectType: 'commercial' | 'residential' | 'mep' | 'permits' | 'industrial';
  areaSqFt: number;
  complexity: 'simple' | 'medium' | 'high';
  turnaroundSpeed: 'standard' | 'expedited';
  zipCode: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface CostBreakdown {
  materials: number;
  labor: number;
  equipment: number;
  permits: number;
  total: number;
  lowRange: number;
  highRange: number;
}
