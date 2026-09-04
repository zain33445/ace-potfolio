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
  email: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  linkHref?: string;
  linkLabel?: string;
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

/** A single CSI division cost line item. */
export interface CostDivision {
  csiCode: string;
  name: string;
  cost: number;
}

/** Full project detail with cost estimation breakdown. */
export interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  category: string;
  location: string;
  state?: string;
  imageUrl: string;
  pdfUrl: string;
  scope: string[];
  /** False for 3D renders, permit sets and shop drawings: no estimate exists. */
  hasEstimate: boolean;
  /** Building gross square feet, as printed in the estimate header. */
  buildingGsf: number;
  /** Site gross square feet; 0 when the estimate does not price site work. */
  siteGsf: number;
  /** The area all per-SF figures divide by. Site work prices against siteGsf. */
  areaBasis: number;
  areaBasisKind: 'building' | 'site' | 'none';
  /** Alias of buildingGsf, kept for existing consumers. */
  totalAreaSqFt: number;
  estimatedCost: number;
  suggestedBid: number;
  /** estimatedCost / areaBasis — construction cost, excludes overhead+profit. */
  costPerSf: number;
  /** suggestedBid / areaBasis — what the client is quoted. ~1.16-1.40x costPerSf. */
  bidPerSf: number;
  /**
   * The per-SF figure printed in the PDF. Unreliable — several documents
   * compute it against a basis matching neither buildingGsf nor siteGsf — so
   * it is kept for cross-checking only and must not be displayed.
   */
  bidPerSfPrinted: number;
  costDivisions: CostDivision[];
  csiDivisions: string[];
  description: string;
  /** Evidence string when a figure was hand-verified against the source PDF. */
  _verified?: string;
  /** Invariant failures. Non-empty means do not publish this record's numbers. */
  _suspect?: string[];
}
