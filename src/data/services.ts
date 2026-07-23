import { Layers, FileSpreadsheet, Compass, ShieldCheck, type LucideIcon } from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────── */

export interface ServiceProcess {
  title: string;
  description: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  summary: string;
  details: string[];
  features: string[];
  icon: string;
  startingPrice: string;
  turnaround: string;
  stats: { label: string; value: string }[];
  process: ServiceProcess[];
}

/* ── Icon map ──────────────────────────────────────────────────── */

export function getServiceIcon(id: string): LucideIcon {
  switch (id) {
    case 'SVC_CES':
      return Layers;
    case 'SVC_MTO':
      return FileSpreadsheet;
    case 'SVC_PRM':
      return Compass;
    case 'SVC_SCH':
      return ShieldCheck;
    default:
      return Layers;
  }
}

/* ── Data ───────────────────────────────────────────────────────── */

export const services: Service[] = [
  {
    id: 'SVC_CES',
    slug: 'cost-estimation',
    title: 'Construction Cost Estimation',
    tagline: 'AACE Class 3 Standard',
    category: 'RESIDENTIAL, COMMERCIAL, INDUSTRIAL',
    description:
      'Our core construction estimation services provide comprehensive cost analysis across every sector, from single-family homes to complex industrial plants and public infrastructure. We combine expert evaluation of architecture, framing layouts, concrete volumes, and site-prep overheads with a high-speed 24–48 hour turnaround, so you never miss a bid deadline. All estimates meet AACE International Class 3 standards with ±10% to ±20% accuracy range — suitable for project funding authorization and contractor bid strategy.',
    summary:
      'Budgetary control level estimates meeting AACE Class 3 standards. Designed for project funding authorization and contractor bid strategy.',
    details: [
      'Expert evaluation of architecture, framing layouts, concrete volumes, and site-prep overheads.',
      'High-speed 24-48h turnaround engineered to fit tight bid schedule pipelines.',
      'Bid optimization strategy backed by an 89% bid win rate for partnering contractors.',
      'Dual-stage QA peer review by principal civil engineers.',
    ],
    features: [
      'AACE Class 3 certified accuracy (±10% to ±20%)',
      'Localized cost multiplier databases',
      'Bid optimization & strategy consulting',
      'Dual-stage QA peer review process',
      'Excel & PDF delivery formats',
      '24–48 hour expedited turnaround available',
    ],
    startingPrice: '$2,500',
    turnaround: '3–5 business days',
    stats: [
      { label: 'ACCURACY_RANGE', value: '±10-20%' },
      { label: 'TURNAROUND', value: '24-48h' },
      { label: 'BID_WIN_RATE', value: '89%' },
      { label: 'STANDARD', value: 'AACE CLS 3' },
    ],
    process: [
      {
        title: 'Structural Data Ingestion',
        description:
          'Transmit your blueprints, architectural layouts, site measurements, and scope narratives through our bank-grade secure server channel.',
      },
      {
        title: 'Algorithmic Quantity Takeoff',
        description:
          'Our quantity surveyors perform exhaustive computational dissection utilizing localized material standards databases and professional digitization platforms.',
      },
      {
        title: 'Dual-Stage Verification Review',
        description:
          'All programmatic estimates undergo parallel reviews by principal civil engineers to filter variances or localized market rate fluctuations before compilation.',
      },
      {
        title: 'Delivery Protocol Transmission',
        description:
          'Instant delivery of final cost-schedules including interactive Microsoft Excel spreadsheets and stamped PDF dossiers designed for presentation.',
      },
    ],
  },
  {
    id: 'SVC_MTO',
    slug: 'material-takeoffs',
    title: 'Material Takeoffs & Quantity Surveying',
    tagline: 'Bill of Quantities',
    category: 'DIVISION-WIDE MATERIAL VOLUMES',
    description:
      'Our quantity surveying division delivers precise bills of quantities (BOQ) and material takeoff services built directly from your blueprints. Every quantity takeoff is verified for measurement accuracy, division-wise material volumes, and procurement-ready data — eliminating on-site waste and costly overordering before construction even begins. We deliver CSI MasterFormat division pricing schedules matched to regional rates with scrap multiplier calculations for steel rebars, timber plates, and conduit structures.',
    summary:
      'Precise bills of quantities and material takeoff services with CSI MasterFormat division pricing schedules.',
    details: [
      'CSI MasterFormat division pricing schedules matching regional rates.',
      'Accurate scrap multiplier calculation for steel rebars, timber plates, and conduit structures.',
      'Eliminate material waste and mid-project budget spikes with precise procurement data.',
      'Full Excel & PDF delivery with itemized quantity breakdowns.',
    ],
    features: [
      'Full CSI MasterFormat division breakdown',
      'Regional material rate calibration',
      'Scrap & waste multiplier calculations',
      'Excel & PDF delivery formats',
      '3–5 business day standard turnaround',
      '24h expedited option available',
    ],
    startingPrice: '$1,200',
    turnaround: '3–5 business days',
    stats: [
      { label: 'DIVISIONS', value: 'CSI Full' },
      { label: 'TURNAROUND', value: '3-5 Days' },
      { label: 'FORMATS', value: 'XLS + PDF' },
      { label: 'ACCURACY', value: '±5%' },
    ],
    process: [
      {
        title: 'Blueprint Digitization',
        description:
          'Your blueprints are digitized and scale-verified using algorithmic platforms. Both digital-native files and scanned hard copies are processed with alignment audits.',
      },
      {
        title: 'Division-Wide Quantity Survey',
        description:
          'Our surveyors perform exhaustive computational dissection across all CSI MasterFormat divisions, calculating material volumes, labor units, and equipment requirements.',
      },
      {
        title: 'Rate Calibration & Scrap Calculation',
        description:
          'Material rates are calibrated against regional supplier databases. Scrap multipliers are applied to steel, timber, and conduit based on industry-standard waste factors.',
      },
      {
        title: 'Delivery & Procurement Handoff',
        description:
          'Final BOQ delivered with itemized quantity breakdowns in both Excel and PDF formats, ready for procurement ordering and subcontractor bidding.',
      },
    ],
  },
  {
    id: 'SVC_PRM',
    slug: 'permit-sets',
    title: 'Permit Set Preparation & 3D Renderings',
    tagline: 'Municipal Submission Package',
    category: 'MUNICIPAL SUBMISSION & RENDERS',
    description:
      'Beyond estimating, we prepare fully compliant permit sets and photorealistic 3D renderings for municipal submission. Our pre-construction documentation team ensures your architectural drawings meet local code requirements while giving stakeholders a clear visual of the finished project. Every set includes double-verified structural and architectural layouts matching local municipal codes, streamlining approvals and reducing costly revision cycles.',
    summary:
      'Fully compliant permit sets and photorealistic 3D renderings for municipal submission and stakeholder presentation.',
    details: [
      'Double-verified structural and architectural layouts matching local municipal codes.',
      'Isometric interactive rendering matrices for visual stakeholder presentation and pre-sale marketing.',
      'Fast-track your approval process with meticulous shop drawings and visual sets.',
      'Revision support included to address plan review comments.',
    ],
    features: [
      'Municipal code compliance check',
      'Architectural & structural sheet sets',
      '3D photorealistic rendering add-on',
      'Revision support included',
      '7–10 business day turnaround',
      'Digital & print-ready delivery',
    ],
    startingPrice: '$3,800',
    turnaround: '7–10 business days',
    stats: [
      { label: 'TURNAROUND', value: '7-10 Days' },
      { label: 'COVERAGE', value: 'US Municipal' },
      { label: 'RENDERINGS', value: '3D + ISO' },
      { label: 'COMPLIANCE', value: 'Code-Verified' },
    ],
    process: [
      {
        title: 'Document Collection & Review',
        description:
          'We collect your architectural drawings, site surveys, and scope documents. Our team reviews against target municipal code requirements to identify gaps.',
      },
      {
        title: 'Permit Set Drafting',
        description:
          'High-precision architectural and structural sheets are drafted, formatted for municipal plan review standards and local zoning ordinances.',
      },
      {
        title: 'Code Compliance Verification',
        description:
          'Every sheet undergoes a double-verification process against local building codes, zoning bylaws, and accessibility requirements.',
      },
      {
        title: 'Final Package & Submission Support',
        description:
          'Completed permit sets are delivered in digital and print-ready formats. Optional 3D renderings are included for stakeholder presentation.',
      },
    ],
  },
  {
    id: 'SVC_SCH',
    slug: 'project-scheduling',
    title: 'Project Management & Scheduling',
    tagline: 'Lifecycle Control',
    category: 'LIFECYCLE CONTROL',
    description:
      'Our project management and scheduling division extends your pre-construction advantage into full lifecycle control. From procurement timelines to labor sequencing, we keep your project on budget and on schedule using ISO 9001-standard project controls. Dynamic Gantt workflows, critical path mapping, and logistics coordination buffer periods ensure every phase is sequenced for maximum efficiency. Continuous budget burn-rate analytics prevent unforeseen change-order financial leakages.',
    summary:
      'Full lifecycle project control with dynamic Gantt workflows, critical path mapping, and budget burn-rate analytics.',
    details: [
      'Dynamic Gantt workflows, critical path mapping, and logistics coordination buffer periods.',
      'Continuous budget burn-rate analytics preventing unforeseen change-order financial leakages.',
      'Protect your timeline and reputation by implementing ideas with maximum efficiency.',
      'ISO 9001-standard project controls for consistent quality management.',
    ],
    features: [
      'Critical path method (CPM) scheduling',
      'Dynamic Gantt chart delivery',
      'Burn-rate monitoring & analytics',
      'Resource allocation planning',
      'Milestone tracking & reporting',
      '3–5 business day initial schedule',
    ],
    startingPrice: '$1,800',
    turnaround: '3–5 business days',
    stats: [
      { label: 'METHOD', value: 'CPM + Gantt' },
      { label: 'TURNAROUND', value: '3-5 Days' },
      { label: 'STANDARD', value: 'ISO 9001' },
      { label: 'REPORTING', value: 'Real-Time' },
    ],
    process: [
      {
        title: 'Scope Definition & Milestone Mapping',
        description:
          'We define the full project scope, identify key milestones, and map dependencies between procurement, labor, and construction phases.',
      },
      {
        title: 'Critical Path & Gantt Development',
        description:
          'Critical path method analysis is performed to identify the longest sequence of dependent activities. Dynamic Gantt charts are built for stakeholder review.',
      },
      {
        title: 'Resource & Budget Integration',
        description:
          'Resource allocation plans and budget burn-rate analytics are integrated into the schedule, providing real-time visibility into cost vs. progress.',
      },
      {
        title: 'Ongoing Monitoring & Adjustments',
        description:
          'The schedule is continuously monitored against actual progress. Adjustments and re-forecasting are provided to keep the project on track.',
      },
    ],
  },
];

/* ── Lookup helpers ─────────────────────────────────────────────── */

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getAllServices(): Service[] {
  return services;
}

export function getFeaturedServices(currentSlug?: string): Service[] {
  return services.filter((s) => s.slug !== currentSlug).slice(0, 2);
}
