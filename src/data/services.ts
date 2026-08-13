import {
  Calculator,
  PenTool,
  HardHat,
  ClipboardList,
  Layers,
  type LucideIcon,
} from 'lucide-react';

/* ── Types ─────────────────────────────────────────────────────── */

export interface ServiceProcess {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SeoContent {
  heading: string;
  body: string[]; 
  benefits: { title: string; description: string }[];
  faqs: FaqItem[];
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
  ctaLabel: string;
  footnote?: string;
  seoContent?: SeoContent;
  /** Full sanitized HTML from WordPress — only present for CMS-only services */
  wpContent?: string;
}

/* ── Icon map ──────────────────────────────────────────────────── */

export function getServiceIcon(id: string): LucideIcon {
  switch (id) {
    case 'SVC_EST':
      return Calculator;
    case 'SVC_ARC':
      return PenTool;
    case 'SVC_ENG':
      return HardHat;
    case 'SVC_PMG':
      return ClipboardList;
    default:
      return Layers;
  }
}

/* ── Data ───────────────────────────────────────────────────────── */

export const services: Service[] = [
  {
    id: 'SVC_EST',
    slug: 'cost-estimating',
    title: 'Cost Estimating',
    icon: 'SVC_EST',
    tagline: 'Budgeting & Bidding',
    category: 'ESTIMATING',
    description:
      'Detailed construction estimates, quantity takeoffs, and cost analysis to support budgeting, bidding, and project decisions.',
    summary:
      'Detailed construction estimates, quantity takeoffs, and cost analysis to support budgeting, bidding, and project decisions.',
    details: [
      'Estimate packages prepared across residential, commercial, and industrial sectors.',
      'Quantity takeoffs and material lists built directly from your blueprints.',
      'Cost analysis structured for budgeting, bidding, and project decisions.',
      'Editable Excel spreadsheets and professional PDF reports included.',
    ],
    features: [
      'Construction Cost Estimation',
      'Material Takeoffs & Quantity Surveying',
      'Commercial Estimating',
      'Residential Estimating',
      'Industrial Estimating',
      'Electrical Estimating',
    ],
    startingPrice: 'Custom',
    turnaround: '1–2 business days',
    stats: [
      { label: 'SECTORS', value: '3+' },
      { label: 'TURNAROUND', value: '24-48h' },
      { label: 'SCOPE', value: 'Full-Service' },
      { label: 'FORMAT', value: 'XLS + PDF' },
    ],
    process: [
      {
        title: 'Blueprint Review',
        description:
          'We review your blueprints, drawings, and project scope to confirm what is being estimated and flag any missing information.',
      },
      {
        title: 'Quantity Takeoff',
        description:
          'Materials and labor quantities are measured and itemized directly from your drawings.',
      },
      {
        title: 'Cost Analysis & Rate Calibration',
        description:
          'Quantities are priced against current market rates and organized for budgeting or bidding.',
      },
      {
        title: 'Delivery',
        description:
          'Final estimates delivered in editable Excel spreadsheets and professional PDF reports.',
      },
    ],
    ctaLabel: 'EXPLORE ESTIMATING',
    seoContent: {
      heading: 'Precision Construction Cost Estimating Services Nationwide',
      body: [
        'In today\'s volatile material market, guesswork leads to lost bids and shrinking margins. At The ACE Services, our professional construction cost estimating services provide general contractors, subcontractors, developers, and architects across the USA with highly accurate, data-driven material takeoffs and labor pricing.',
        'Whether you are bidding on a complex commercial build, managing a residential development, or planning an industrial facility, our expert estimators leverage industry-leading software and up-to-date pricing databases to ensure your bids are both competitive and profitable.',
        'A precise estimate is only as good as the plans it is based on. If your current blueprints lack detail, our Architectural Services team can refine your shop drawings before we begin the quantity survey. Once your budget is locked, our Project Management experts can develop schedules to ensure your procurement aligns perfectly with the cash flow projections.'
      ],
      benefits: [
        {
          title: 'Win More Bids',
          description: 'Accurate, detailed takeoffs mean you can bid with confidence, knowing your margins are protected.'
        },
        {
          title: 'Save Valuable Time',
          description: 'Free up your internal team to focus on project execution while we handle the time-consuming quantity surveying.'
        },
        {
          title: 'Nationwide Accuracy',
          description: 'We adjust labor and material rates based on your specific geographic location within the USA.'
        }
      ],
      faqs: [
        {
          question: 'What is the turnaround time for a construction estimate?',
          answer: 'Our standard turnaround time is 24 to 48 hours (1-2 business days), depending on the size and complexity of the project. Expedited services are also available for urgent bids.'
        },
        {
          question: 'Do you provide editable Excel spreadsheets?',
          answer: 'Yes, all of our cost estimates include fully editable Excel spreadsheets alongside professional PDF summary reports, allowing you to easily adjust margins and rates.'
        },
        {
          question: 'Who can benefit from your estimating services?',
          answer: 'We serve a wide range of professionals nationwide, including General Contractors, Subcontractors (electrical, plumbing, framing, etc.), Architects, and Real Estate Developers.'
        }
      ]
    }
  },
  {
    id: 'SVC_ARC',
    slug: 'architectural-services',
    title: 'Architectural Services',
    icon: 'SVC_ARC',
    tagline: 'Documentation & Visualization',
    category: 'ARCHITECTURAL',
    description:
      'Construction documentation and visualization designed to support permitting, coordination, and project presentation.',
    summary:
      'Construction documentation and visualization designed to support permitting, coordination, and project presentation.',
    details: [
      'Architectural shop drawings prepared for construction and coordination.',
      'Permit and submission drawing sets organized for municipal review.',
      'Submittal packages assembled for approval workflows.',
      '3D rendering for stakeholder presentation.',
    ],
    features: [
      'Architectural Shop Drawings',
      'Permit Sets',
      'Submission Drawing Sets',
      'Submittals',
      '3D Rendering',
    ],
    startingPrice: '$50',
    turnaround: '7–10 business days',
    stats: [
      { label: 'TURNAROUND', value: '7-10 Days' },
      { label: 'DOCUMENTS', value: 'Shop + Permit' },
      { label: 'RENDERING', value: '3D' },
      { label: 'DELIVERY', value: 'DWG + PDF' },
    ],
    process: [
      {
        title: 'Documentation Review',
        description:
          'Existing drawings and project requirements are reviewed to define the documentation scope.',
      },
      {
        title: 'Shop Drawing & Set Preparation',
        description:
          'Architectural shop drawings, permit sets, and submission sets are drafted for your project.',
      },
      {
        title: 'Coordination & Compliance Check',
        description:
          'Drawings are coordinated across disciplines and checked against applicable requirements.',
      },
      {
        title: 'Presentation & Delivery',
        description:
          'Final sets and renderings delivered in DWG and PDF formats for submission and presentation.',
      },
    ],
    ctaLabel: 'EXPLORE ARCHITECTURAL',
    seoContent: {
      heading: 'Comprehensive Architectural Drafting & Shop Drawings',
      body: [
        'Clear, coordinated, and code-compliant documentation is the backbone of any successful construction project. The ACE Services provides top-tier architectural services, specializing in shop drawings, permit sets, and 3D visualization for contractors, developers, and architectural firms nationwide.',
        'Our drafting team bridges the gap between conceptual design and physical construction. By producing meticulous architectural shop drawings, we help mitigate on-site errors and streamline the approval process with municipalities and stakeholders.',
        'Proper documentation seamlessly integrates with our other disciplines. Detailed shop drawings allow our Structural & Engineering team to accurately assess load paths, while providing our Cost Estimating division with the exact specifications needed to generate pinpoint-accurate material takeoffs.'
      ],
      benefits: [
        {
          title: 'Accelerated Approvals',
          description: 'Our permit and submission sets are tailored to meet municipal standards, reducing back-and-forth revisions.'
        },
        {
          title: 'Enhanced Coordination',
          description: 'Identify and resolve clashes early through precise drafting, preventing costly rework in the field.'
        },
        {
          title: 'Stunning Visualizations',
          description: 'High-quality 3D renderings help secure client buy-in and investment by bringing blueprints to life.'
        }
      ],
      faqs: [
        {
          question: 'What file formats do you deliver for architectural drawings?',
          answer: 'We deliver all final documents in both standard PDF format for easy viewing and DWG (AutoCAD) format for seamless integration into your existing workflows.'
        },
        {
          question: 'Do you create architectural shop drawings from scratch?',
          answer: 'We typically work from conceptual designs, sketches, or base architectural plans to develop fully detailed shop drawings ready for fabrication and installation.'
        },
        {
          question: 'How long does a typical permit set take?',
          answer: 'Standard turnaround for architectural documentation is 7 to 10 business days, though timelines may vary based on project scale and complexity.'
        }
      ]
    }
  },
  {
    id: 'SVC_ENG',
    slug: 'structural-engineering',
    title: 'Structural & Engineering',
    icon: 'SVC_ENG',
    tagline: 'Design & Analysis',
    category: 'STRUCTURAL & ENGINEERING',
    description:
      'Technical design, analysis, and engineering documentation for safe and code-conscious construction.',
    summary:
      'Technical design, analysis, and engineering documentation for safe and code-conscious construction.',
    details: [
      'Structural design and analysis for safe, code-conscious construction.',
      'MEP shop drawings coordinated with architectural sets.',
      'Engineering documentation prepared for review and permitting.',
      'PE review and sealing available where required.',
    ],
    features: [
      'Structural Design',
      'Structural Analysis',
      'MEP Shop Drawings',
      'Engineering Documentation',
      'PE Review & Sealing*',
    ],
    startingPrice: '$50',
    turnaround: '7–10 business days',
    stats: [
      { label: 'DISCIPLINES', value: 'Structural + MEP' },
      { label: 'ANALYSIS', value: 'Load Path' },
      { label: 'REVIEW', value: 'PE Sealing' },
      { label: 'DOCUMENTS', value: 'DWG + PDF' },
    ],
    process: [
      {
        title: 'Scope & Requirements Review',
        description:
          'Project scope, loads, and applicable requirements are reviewed to define engineering deliverables.',
      },
      {
        title: 'Structural & MEP Engineering',
        description:
          'Structural design, analysis, and MEP shop drawings are developed for the project.',
      },
      {
        title: 'Documentation & PE Review',
        description:
          'Engineering documentation is compiled and reviewed by licensed professionals where applicable.',
      },
      {
        title: 'Delivery & Coordination',
        description:
          'Final documents delivered in DWG and PDF formats, coordinated with other disciplines.',
      },
    ],
    ctaLabel: 'EXPLORE ENGINEERING',
    footnote: '*Subject to applicable licensing and jurisdictional requirements.',
    seoContent: {
      heading: 'Expert Structural Design and MEP Engineering Services',
      body: [
        'Safety, stability, and code compliance are non-negotiable in construction. The ACE Services delivers robust structural engineering and MEP (Mechanical, Electrical, Plumbing) design solutions for commercial, residential, and industrial projects across the USA.',
        'Our engineering team provides comprehensive structural analysis, load path calculations, and coordinated MEP shop drawings. We ensure that every beam, column, and conduit is designed for optimal performance and safety, meeting rigorous local and national building codes.',
        'We work hand-in-hand with our Architectural Services division to ensure that aesthetic visions are structurally viable. By resolving engineering challenges during the pre-construction phase, we provide a solid foundation for our Project Management team to schedule activities without fear of design-related delays.'
      ],
      benefits: [
        {
          title: 'Code-Conscious Design',
          description: 'Our designs strictly adhere to IBC and local building codes, ensuring smooth permitting and safe construction.'
        },
        {
          title: 'PE Sealing Available',
          description: 'We offer Professional Engineer (PE) review and sealing services where required by jurisdiction.'
        },
        {
          title: 'Clash-Free MEP Integration',
          description: 'Coordinated MEP shop drawings prevent spatial conflicts between mechanical systems and structural elements.'
        }
      ],
      faqs: [
        {
          question: 'Do you offer PE stamping/sealing?',
          answer: 'Yes, we provide PE review and sealing services for engineering documents, subject to applicable licensing and jurisdictional requirements in your specific state.'
        },
        {
          question: 'Can you coordinate MEP designs with existing architectural plans?',
          answer: 'Absolutely. We specialize in coordinating MEP shop drawings directly with your existing architectural sets to ensure seamless integration and prevent clashes.'
        }
      ]
    }
  },
  {
    id: 'SVC_PMG',
    slug: 'project-management',
    title: 'Construction Project Management & Scheduling',
    icon: 'SVC_PMG',
    tagline: 'Planning & Controls',
    category: 'PROJECT MANAGEMENT',
    description:
      'Construction scheduling, procurement coordination, and project controls designed to keep activities, milestones, and resources aligned.',
    summary:
      'Construction scheduling, procurement coordination, and project controls designed to keep activities, milestones, and resources aligned.',
    details: [
      'Construction Scheduling — CPM and Gantt schedules aligned with project milestones, dependencies, and construction sequencing.',
      'Project Planning — Scope definition, activity sequencing, milestone planning, and schedule development.',
      'Procurement Coordination — Procurement activities integrated with the construction schedule to support timely delivery.',
      'Project Controls — Progress tracking, milestone monitoring, and schedule reporting throughout the project.',
    ],
    features: [
      'Project Management',
      'Project Scheduling',
      'Procurement Services',
      'CPM Scheduling',
      'Gantt Scheduling',
    ],
    startingPrice: 'Custom',
    turnaround: '3–5 Business Days',
    stats: [
      { label: 'METHOD', value: 'CPM + Gantt' },
      { label: 'DELIVERY', value: '3–5 Business Days' },
      { label: 'PLANNING', value: 'Milestone-Based' },
      { label: 'REPORTING', value: 'Progress Tracking' },
    ],
    process: [
      {
        title: 'Define Scope & Milestones',
        description:
          'Establish project activities, dependencies, deliverables, and key milestones.',
      },
      {
        title: 'Build the Schedule',
        description:
          'Develop CPM and Gantt schedules around construction sequencing and project requirements.',
      },
      {
        title: 'Integrate Procurement',
        description:
          'Coordinate procurement activities with the schedule to identify critical materials and potential delays.',
      },
      {
        title: 'Track & Report',
        description:
          'Monitor progress against planned milestones and provide clear schedule reporting.',
      },
    ],
    ctaLabel: 'EXPLORE PROJECT MANAGEMENT',
    seoContent: {
      heading: 'Construction Project Management & CPM Scheduling',
      body: [
        'Time is money in construction, and project delays can decimate profitability. The ACE Services provides elite construction project management, CPM scheduling, and project controls for general contractors and developers nationwide.',
        'We specialize in developing highly detailed Critical Path Method (CPM) and Gantt schedules that align with project milestones, resource availability, and construction sequencing. By integrating procurement activities directly into the schedule, we help you foresee and mitigate supply chain bottlenecks before they impact the critical path.',
        'Effective project management ties all our services together. Our schedules rely on the accurate budgets generated by our Cost Estimating team and the precise timelines required to execute the designs finalized by our Architectural and Structural Engineering divisions.'
      ],
      benefits: [
        {
          title: 'Mitigate Delays',
          description: 'Identify the critical path and potential bottlenecks early to keep your project moving forward on time.'
        },
        {
          title: 'Optimize Procurement',
          description: 'Coordinate material deliveries with installation schedules to prevent site congestion and material shortages.'
        },
        {
          title: 'Clear Stakeholder Communication',
          description: 'Professional Gantt charts and progress reports keep owners, investors, and subcontractors aligned.'
        }
      ],
      faqs: [
        {
          question: 'What scheduling methods do you use?',
          answer: 'We primarily utilize the Critical Path Method (CPM) and Gantt charts to visually map dependencies, milestones, and project durations.'
        },
        {
          question: 'How long does it take to build a construction schedule?',
          answer: 'A comprehensive preliminary schedule typically takes 3 to 5 business days to develop, depending on the availability of project scope and documentation.'
        },
        {
          question: 'Do you track progress after the initial schedule is built?',
          answer: 'Yes, we offer ongoing project controls and progress tracking to update schedules as conditions change in the field, ensuring you always have an accurate completion forecast.'
        }
      ]
    }
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
