import {
  Calculator,
  PenTool,
  HardHat,
  ClipboardList,
  Layers,
  type LucideIcon,
} from 'lucide-react';
import { SERVICE_SLUGS } from '@/src/data/service-slugs';

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
  /** Overrides `title` for the <title> tag only; the H1 still uses `title`. */
  seoTitle?: string;
  /** Overrides the generated meta description only; the on-page `summary` is untouched. */
  seoDescription?: string;
  footnote?: string;
  seoContent?: SeoContent;
  /** Full sanitized HTML from WordPress — only present for CMS-only services */
  wpContent?: string;
  /**
   * Slug of the parent main service. Set on sub-services (e.g. 3D rendering under
   * architectural-services). Sub-services are hidden from the /services index and
   * surfaced only as internal links on their parent's page.
   */
  parent?: string;
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
    seoTitle: 'Construction Cost Estimating Services',
    seoDescription:
      'AACE Class 3 construction cost estimates, material takeoffs and CSI cost breakdowns delivered in 24-48 hours. Request your free estimate quote today.',
    title: 'Construction Cost Estimating Services',
    icon: 'SVC_EST',
    tagline: 'Budgeting & Bidding',
    category: 'ESTIMATING',
    description:
      'Construction cost estimating services for general contractors — AACE Class 3 estimates, material takeoffs, and CSI cost breakdowns delivered in 24-48 hours.',
    summary:
      'Construction cost estimating services for general contractors — AACE Class 3 estimates, material takeoffs, and CSI cost breakdowns delivered in 24-48 hours.',
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
    turnaround: '24-48 hours',
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
        'AACE Class 3 Construction Cost Estimating for Every Project Type. Our construction cost estimating services cover the full pre-construction workflow: quantity takeoffs from architectural blueprints, material and labor pricing against current localized rates, CSI MasterFormat-organized cost breakdowns, and delivery in editable Excel plus stamped PDF. Whether you\'re preparing a competitive bid on a commercial build or budgeting a residential development, our cost estimating team delivers precision you can defend to owners, lenders, and permitting authorities.',
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
    seoTitle: 'Architectural Drafting & Permit Services',
    seoDescription:
      'Shop drawings, permit sets, submittals and 3D rendering for contractors and developers nationwide. Request a free quote to speed up your next approval.',
    title: 'Architectural Drafting & Permit Services',
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
    seoTitle: 'Structural Engineering & MEP Design Services',
    seoDescription:
      'PE-sealed structural engineering and MEP design for commercial, residential and industrial construction. Get your free structural engineering quote today.',
    title: 'Structural Engineering & MEP Design',
    icon: 'SVC_ENG',
    tagline: 'Design & Analysis',
    category: 'STRUCTURAL & ENGINEERING',
    description:
      'PE-sealed structural engineering and MEP design for commercial, residential, and industrial construction. Code-compliant documentation by The ACE Services.',
    summary:
      'PE-sealed structural engineering and MEP design for commercial, residential, and industrial construction. Code-compliant documentation by The ACE Services.',
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
    seoTitle: 'Construction Project Management Services',
    seoDescription:
      'CPM and Gantt scheduling, procurement coordination and project controls for contractors nationwide. Request a free scheduling consultation now.',
    title: 'Construction Project Management Services',
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
  {
    id: 'SVC_3DR',
    slug: '3d-rendering-services',
    seoTitle: '3D Architectural Rendering Services | The ACE Services',
    seoDescription:
      'Photorealistic 3D exterior and interior renderings for permitting, coordination and marketing presentations. Get a free rendering quote in 3-5 days.',
    parent: 'architectural-services',
    title: '3D Architectural Rendering Services',
    icon: 'SVC_ARC',
    tagline: 'Visualization & Presentation',
    category: 'ARCHITECTURAL',
    description:
      '3D architectural rendering services — photorealistic exterior and interior renderings for permitting, coordination, marketing, and stakeholder sign-off.',
    summary:
      '3D architectural rendering services — photorealistic exterior and interior renderings for permitting, coordination, marketing, and stakeholder sign-off.',
    details: [
      '3D exterior renderings that show a building in its real site context before construction begins.',
      '3D interior renderings for space planning, material selection, and client presentations.',
      'Floor plan and site-plan renderings that make layouts readable to non-technical stakeholders.',
      'Delivered as high-resolution stills ready for permitting packets, marketing, and investor decks.',
    ],
    features: [
      '3D Exterior Rendering',
      '3D Interior Rendering',
      'Architectural Visualization',
      '3D Floor Plan Rendering',
      'Photorealistic Renders',
      'Marketing & Presentation Renders',
    ],
    startingPrice: 'Custom',
    turnaround: '3–5 Business Days',
    stats: [
      { label: 'OUTPUT', value: 'Photoreal' },
      { label: 'TURNAROUND', value: '3–5 Days' },
      { label: 'VIEWS', value: 'Exterior + Interior' },
      { label: 'FORMAT', value: 'High-Res Stills' },
    ],
    process: [
      {
        title: 'Brief & Reference Review',
        description:
          'We review your plans, elevations, material selections, and reference imagery to lock the look before rendering.',
      },
      {
        title: '3D Modeling',
        description:
          'Your design is built as an accurate 3D model — massing, openings, finishes, and site context.',
      },
      {
        title: 'Lighting, Materials & Render',
        description:
          'We apply real materials, natural lighting, and landscaping, then render photorealistic exterior and interior views.',
      },
      {
        title: 'Review & Delivery',
        description:
          'You review a draft, we apply revisions, and final high-resolution renderings are delivered for permitting, marketing, or approvals.',
      },
    ],
    ctaLabel: 'EXPLORE 3D RENDERING',
    seoContent: {
      heading: 'Photorealistic 3D Architectural Rendering Services',
      body: [
        'Our 3D architectural rendering services turn drawings into images stakeholders can actually understand. From 3D exterior renderings that place a building in its real site context to detailed interior visualizations, we help owners, review boards, and buyers sign off on what they can see — long before ground is broken.',
        'Photorealistic renderings do more than look good. They accelerate permitting and design review, resolve questions about materials and massing early, and give developers and marketing teams the assets they need to pre-sell and fund a project. Every render is built from an accurate 3D model, so what you present is what gets built.',
        'Renderings work best as part of a coordinated pre-construction package. Pair them with our Architectural drafting and permit sets to move from concept to approval, or with our Cost Estimating team so the design you visualize is priced accurately from day one.',
      ],
      benefits: [
        {
          title: 'Win Approvals Faster',
          description: 'Give review boards and clients a clear, photorealistic picture so decisions happen sooner and with fewer revisions.',
        },
        {
          title: 'Sell & Fund Projects',
          description: 'Marketing-grade exterior and interior renders help developers pre-sell units and secure investor buy-in.',
        },
        {
          title: 'Catch Issues Early',
          description: 'Seeing the design in 3D surfaces material and spatial problems while they are still cheap to fix.',
        },
      ],
      faqs: [
        {
          question: 'What do I need to provide for a 3D rendering?',
          answer: 'Floor plans, elevations, and any material or finish selections are ideal. We can also work from sketches or a set of reference images if drawings are still in progress.',
        },
        {
          question: 'Do you provide both exterior and interior renderings?',
          answer: 'Yes. We produce 3D exterior renderings, interior visualizations, and floor-plan renders — for permitting, coordination, or marketing use.',
        },
        {
          question: 'How long does a rendering take?',
          answer: 'Most renderings are delivered in 3 to 5 business days depending on complexity and the number of views, with a draft review before final delivery.',
        },
      ],
    },
  },
  {
    id: 'SVC_SHD',
    slug: 'shop-drawing-services',
    seoTitle: 'Shop Drawing Services | MEP, Structural & Rebar',
    seoDescription:
      'Fabrication-ready MEP, structural, rebar and millwork shop drawings with cross-trade clash coordination. Request your free shop drawing quote today.',
    parent: 'architectural-services',
    title: 'Shop Drawing Services',
    icon: 'SVC_ENG',
    tagline: 'Fabrication & Detailing',
    category: 'DRAFTING',
    description:
      'Shop drawing services — fabrication-ready MEP, structural, rebar, and millwork shop drawings coordinated to eliminate clashes before fabrication and installation.',
    summary:
      'Shop drawing services — fabrication-ready MEP, structural, rebar, and millwork shop drawings coordinated to eliminate clashes before fabrication and installation.',
    details: [
      'MEP, structural, rebar, and millwork shop drawings prepared to fabrication standards.',
      'Design intent translated into dimensioned, buildable details for the shop and the field.',
      'Cross-trade coordination that resolves spatial conflicts before anything is fabricated.',
      'Delivered in DWG and PDF, ready for fabricator and reviewer sign-off.',
    ],
    features: [
      'MEP Shop Drawings',
      'Structural Shop Drawings',
      'Rebar Shop Drawings',
      'Millwork Shop Drawings',
      'Fabrication Detailing',
      'Clash Coordination',
    ],
    startingPrice: 'Custom',
    turnaround: '3–7 Business Days',
    stats: [
      { label: 'TRADES', value: 'MEP + Struct' },
      { label: 'TURNAROUND', value: '3–7 Days' },
      { label: 'STANDARD', value: 'Fabrication-Ready' },
      { label: 'FORMAT', value: 'DWG + PDF' },
    ],
    process: [
      {
        title: 'Documentation Review',
        description:
          'We review contract drawings, specs, and design intent to confirm scope and flag missing information.',
      },
      {
        title: 'Shop Drawing Preparation',
        description:
          'Fabrication-ready shop drawings are detailed for each trade — MEP, structural, rebar, or millwork.',
      },
      {
        title: 'Coordination & Clash Check',
        description:
          'Trades are coordinated against one another to resolve spatial conflicts before fabrication or installation.',
      },
      {
        title: 'Delivery & Revisions',
        description:
          'Drawings are delivered in DWG and PDF, with fast revision cycles to clear fabricator and reviewer comments.',
      },
    ],
    ctaLabel: 'EXPLORE SHOP DRAWINGS',
    seoContent: {
      heading: 'Fabrication-Ready Shop Drawing Services',
      body: [
        'Our shop drawing services turn design intent into buildable, fabrication-ready documentation. We prepare MEP, structural, rebar, and millwork shop drawings that give fabricators and field crews the exact dimensions, connections, and details they need — with no ambiguity and no guesswork.',
        'Most costly rework starts as a clash on paper. We coordinate shop drawings across trades before anything is fabricated, catching spatial conflicts between ductwork, piping, structure, and finishes while they are still a line on a drawing rather than a change order in the field.',
        'Shop drawings connect design and construction. They build directly on the architectural and structural sets our drafting teams produce, and they feed the accurate quantities our Cost Estimating team relies on — so your documentation, pricing, and fabrication all speak the same language.',
      ],
      benefits: [
        {
          title: 'No Clashes, No Rework',
          description: 'Cross-trade coordination resolves conflicts on the drawing board instead of in the field, protecting your schedule and budget.',
        },
        {
          title: 'Fabrication-Ready Detail',
          description: 'Dimensioned, buildable drawings let fabricators and installers work without back-and-forth or interpretation.',
        },
        {
          title: 'Faster Approvals',
          description: 'Clean, standards-compliant submittals clear reviewer and fabricator comments in fewer cycles.',
        },
      ],
      faqs: [
        {
          question: 'What types of shop drawings do you produce?',
          answer: 'We prepare MEP (mechanical, electrical, plumbing), structural, rebar, and millwork shop drawings, along with fabrication and installation details.',
        },
        {
          question: 'Do you coordinate shop drawings across trades?',
          answer: 'Yes. Cross-trade clash coordination is a core part of our service — we resolve spatial conflicts between disciplines before anything reaches the shop or the field.',
        },
        {
          question: 'What formats do you deliver in?',
          answer: 'Shop drawings are delivered in editable DWG and review-ready PDF, prepared to fabrication standards for sign-off.',
        },
      ],
    },
  },
  {
    id: 'SVC_PMT',
    slug: 'permit-set-services',
    seoTitle: 'Permit Set & Drawing Services | The ACE Services',
    seoDescription:
      "Code-compliant, stamped permit sets built to your reviewer's checklist for faster municipal approval. Get a free permit set quote in 3-7 business days.",
    parent: 'architectural-services',
    title: 'Permit Set & Drawing Services',
    icon: 'SVC_ARC',
    tagline: 'Approvals & Compliance',
    category: 'DOCUMENTATION',
    description:
      'Permit set services — complete, code-compliant permit drawings and stamped document packages assembled to the reviewer\'s checklist for faster municipal approval.',
    summary:
      'Permit set services — complete, code-compliant permit drawings and stamped document packages assembled to the reviewer\'s checklist for faster municipal approval.',
    details: [
      'Complete permit sets and permit drawings prepared for municipal plan-review submission.',
      'Architectural, structural, and MEP sheets assembled into one coordinated, code-compliant package.',
      'Documents built to the jurisdiction\'s checklist to minimize review comments and resubmittals.',
      'Delivered print-ready in PDF, with revision support through the approval process.',
    ],
    features: [
      'Permit Drawings',
      'Permit Set Preparation',
      'Building Permit Drawings',
      'Code Compliance Review',
      'Plan Review Support',
      'Resubmittal & Markups',
    ],
    startingPrice: 'Custom',
    turnaround: '3–7 Business Days',
    stats: [
      { label: 'SCOPE', value: 'Full Set' },
      { label: 'TURNAROUND', value: '3–7 Days' },
      { label: 'BUILT FOR', value: 'Plan Review' },
      { label: 'FORMAT', value: 'Print-Ready PDF' },
    ],
    process: [
      {
        title: 'Requirements Review',
        description:
          'We confirm the jurisdiction\'s submission checklist, applicable codes, and the scope your permit set must cover.',
      },
      {
        title: 'Set Preparation',
        description:
          'Architectural, structural, and MEP sheets are drafted and assembled into one coordinated, code-compliant package.',
      },
      {
        title: 'Compliance Check',
        description:
          'The set is reviewed against local code and the reviewer\'s checklist to head off comments before submission.',
      },
      {
        title: 'Submission & Revisions',
        description:
          'We deliver print-ready permit drawings and turn around any reviewer markups quickly to keep approval on schedule.',
      },
    ],
    ctaLabel: 'EXPLORE PERMIT SETS',
    seoContent: {
      heading: 'Complete, Code-Compliant Permit Set Services',
      body: [
        'Our permit set services assemble complete, code-compliant permit drawings into a single package built for plan review. We coordinate architectural, structural, and MEP sheets to the jurisdiction\'s checklist — not ours — so your submission clears review with fewer comments and fewer costly resubmittals.',
        'A rejected permit set can stall a project for weeks. By preparing building permit drawings that anticipate what reviewers look for and flag code issues before submission, we help general contractors and developers move from design to approval faster and keep the schedule intact.',
        'Permit sets are the approval layer of your documentation. They build directly on our architectural drafting and shop drawing work and align with the budgets our Cost Estimating team prepares — so what you submit, price, and build all stay in sync.',
      ],
      benefits: [
        {
          title: 'Approved Faster',
          description: 'Sets assembled to the reviewer\'s checklist clear plan review with fewer comments and resubmittals.',
        },
        {
          title: 'Code-Compliant',
          description: 'Drawings are checked against applicable local codes before submission to prevent avoidable rejections.',
        },
        {
          title: 'One Coordinated Package',
          description: 'Architectural, structural, and MEP sheets arrive as a single, consistent, print-ready permit set.',
        },
      ],
      faqs: [
        {
          question: 'What is a permit set?',
          answer: 'A permit set is the coordinated package of drawings and documents a jurisdiction requires for plan review and building-permit approval, covering architectural, structural, and MEP scope as applicable.',
        },
        {
          question: 'Do you prepare drawings to our local code requirements?',
          answer: 'Yes. We build each permit set to the specific jurisdiction\'s submission checklist and applicable codes, and we review for compliance before submission to reduce review comments.',
        },
        {
          question: 'Can you help with reviewer comments and resubmittals?',
          answer: 'Absolutely. We turn around markups and revisions quickly to address plan-review comments and keep your approval moving without losing schedule.',
        },
      ],
    },
  },
  {
    id: 'SVC_ELEC',
    slug: 'electrical-estimating-services',
    seoTitle: 'Electrical Estimating Services',
    seoDescription:
      'CSI Division 26 electrical takeoffs and cost estimates delivered in 24-48 hours. Request your free electrical estimate quote today.',
    title: 'Electrical Estimating Services',
    icon: 'SVC_EST',
    tagline: 'Division 26 Estimating',
    category: 'ESTIMATING',
    description:
      'Electrical estimating services — CSI Division 26 quantity takeoffs and cost estimates covering service and distribution, branch circuits, devices, lighting, and low-voltage rough-in, delivered in 24-48 hours.',
    summary:
      'Electrical estimating services — CSI Division 26 quantity takeoffs and cost estimates covering service and distribution, branch circuits, devices, lighting, and low-voltage rough-in, delivered in 24-48 hours.',
    details: [
      'Service and distribution takeoffs covering utility service entrance, main switchgear, panelboards, transformers, and distribution feeders.',
      'Branch circuit and conductor counts — homeruns, circuiting, and conduit and wire sized and typed to the drawings.',
      'Wiring devices, lighting fixtures, and controls counted by type, including receptacles, switches, GFCI/AFCI, lamps, drivers, and occupancy and dimming controls.',
      'Motor and equipment connections, grounding and bonding, temporary power, and testing/commissioning allowances priced alongside low-voltage scope where it is in contract.',
    ],
    features: [
      'Service & Distribution Equipment',
      'Branch Circuits & Conductor',
      'Wiring Devices',
      'Lighting & Lighting Controls',
      'Motor & Equipment Connections',
      'Low-Voltage Rough-In (Fire Alarm, Data, Security)',
      'Grounding & Bonding',
      'Site & Exterior Electrical',
    ],
    startingPrice: 'Custom',
    turnaround: '24-48 hours',
    stats: [
      { label: 'PROJECTS', value: '16' },
      { label: 'TURNAROUND', value: '24-48h' },
      { label: 'DIVISION', value: 'CSI 26' },
      { label: 'FORMAT', value: 'XLS + PDF' },
    ],
    process: [
      {
        title: 'Drawing & Panel Schedule Review',
        description:
          'We review your E-sheets, panel schedules, fixture schedule, and specifications to confirm scope and flag any missing information.',
      },
      {
        title: 'Device & Fixture Takeoff',
        description:
          'Receptacles, switches, lighting fixtures, and other devices are counted directly off the drawings by type and location.',
      },
      {
        title: 'Homerun & Feeder Tracing',
        description:
          'Homeruns and feeders are traced from each device and panel back to source, and conduit and wire are sized and typed accordingly.',
      },
      {
        title: 'Gear & Conductor Pricing',
        description:
          'Switchgear, panelboards, transformers, devices, fixtures, and conductor are priced at current market rates and delivered in editable Excel plus PDF.',
      },
    ],
    ctaLabel: 'EXPLORE ELECTRICAL ESTIMATING',
    seoContent: {
      heading: 'Electrical Estimating Services for Division 26 Scope',
      body: [
        'Our electrical estimating services cover the full CSI Division 26 scope: service and distribution equipment, branch circuits and conductor, wiring devices, lighting and lighting controls, motor and equipment connections, low-voltage rough-in where it is in contract, grounding and bonding, site and exterior electrical, temporary power, and testing and commissioning allowances. Every quantity is counted directly off your E-sheets, panel schedules, and fixture schedule and priced at current market rates, then delivered in an editable Excel spreadsheet alongside a PDF report.',
        "We've built a CSI Division 26 electrical breakdown into 16 of our completed cost estimates, totaling $926,744 in electrical scope. Across those projects, electrical work ran a median of 9.3% of total project cost, with a range from 0.5% to 24.0% — proof that a flat percentage rule of thumb is not a reliable way to price electrical scope. On Comstock San Diego, a 3,326 sf project, electrical came to $146,085, or 16.0% of the total. On Pinnacle Montessori School, 17,366 sf, electrical was $135,181, just 4.4% of the total. On Lucky Hair Salloon, a dense 1,004 sf fit-out, electrical reached $64,026 — 24.0% of the total. And on Wildlife Pickleball Park, a site-work project rather than a building, electrical was just $4,775, or 0.5% of total cost.",
        "A small fit-out with dense devices and lighting runs far higher as a percentage of total cost than a large, simple structure — which is exactly why a counted takeoff protects your bid where a percentage rule of thumb loses it. These figures are quantity takeoffs and cost estimates rather than electrical design or code review, which we handle separately as an engineering service.",
        'If your electrical scope is part of a larger bid, our Construction Cost Estimating service can fold this Division 26 breakdown into a full CSI cost estimate across every trade, and our free Calculator gives you a fast ballpark before you request a formal takeoff.',
      ],
      benefits: [
        {
          title: 'Bid With Real Numbers',
          description: 'A counted Division 26 takeoff beats a percentage rule of thumb, protecting your margin on dense fit-outs where electrical runs high.',
        },
        {
          title: 'Fast Turnaround',
          description: '24-48 hour delivery keeps your electrical scope off the critical path on tight bid deadlines.',
        },
        {
          title: 'Priced at Market Rates',
          description: 'Gear, devices, fixtures, and conductor are priced against current market rates, not stale unit costs.',
        },
      ],
      faqs: [
        {
          question: 'How long does an electrical estimate take?',
          answer: 'Our standard turnaround is 24 to 48 hours (1-2 business days), depending on project size and the number of panels and circuits involved. Expedited service is available for urgent bids.',
        },
        {
          question: 'Do you check NEC code compliance or provide electrical design?',
          answer: "Not as part of the estimate. An electrical estimate is a quantity takeoff and cost estimate rather than a design or code-review deliverable. Electrical design, MEP documentation and PE review and sealing are handled separately by our engineering service, subject to applicable licensing and jurisdictional requirements in your state.",
        },
        {
          question: 'What file formats do you deliver?',
          answer: 'Every electrical estimate is delivered as an editable Excel spreadsheet broken out by CSI Division 26 line item, plus a summary PDF report.',
        },
        {
          question: 'Do you price gear and fixtures at current market rates?',
          answer: 'Yes. Switchgear, panelboards, transformers, devices, and fixtures are priced against current market rates rather than a static database, so your bid reflects what the equipment actually costs today.',
        },
        {
          question: 'What drawings do you need to start an electrical estimate?',
          answer: 'At minimum we need your E-sheets, panel schedules, and a fixture schedule. Specifications and addenda help us confirm device types, ratings, and any low-voltage scope that is in contract.',
        },
      ],
    },
  },
  {
    id: 'SVC_REBAR',
    slug: 'rebar-detailing-services',
    seoTitle: 'Rebar Detailing Services',
    seoDescription:
      "Fabrication-ready rebar placing drawings and bar bending schedules built from your engineer's design. Request your free rebar detailing quote today.",
    parent: 'shop-drawing-services',
    title: 'Rebar Detailing Services',
    icon: 'SVC_ENG',
    tagline: 'Reinforcement Detailing',
    category: 'DRAFTING',
    description:
      "Rebar detailing services — placing drawings, bar bending schedules, and bar lists built from your engineer's design for fabrication and field placement.",
    summary:
      "Rebar detailing services — placing drawings, bar bending schedules, and bar lists built from your engineer's design for fabrication and field placement.",
    details: [
      'Placing drawings — plan, section, and elevation views showing bar placement for columns, beams, slabs, walls, footings, and pile caps.',
      'Bar bending schedules with bar marks, sizes, shapes, lengths, and quantities, plus bar lists and cut lengths ready for fabrication.',
      "Lap splice and development length detailing per the engineer's design, with bar supports, chairs, spacers, and accessories called out.",
      'Congestion and clash review at joints and intersections, with openings, embeds, and penetration reinforcement detailed before pour.',
    ],
    features: [
      'Placing Drawings',
      'Bar Bending Schedules',
      'Bar Lists & Cut Lengths',
      'Lap Splice & Development Length Detailing',
      'Column, Beam, Slab & Footing Reinforcement',
      'Post-Tensioning Coordination',
      'Congestion & Clash Review',
      'Revision & Resubmittal Handling',
    ],
    startingPrice: 'Custom',
    turnaround: '3–7 Business Days',
    stats: [
      { label: 'SCOPE', value: 'Rebar Only' },
      { label: 'TURNAROUND', value: '3–7 Days' },
      { label: 'STANDARD', value: 'Fabrication-Ready' },
      { label: 'FORMAT', value: 'DWG + PDF' },
    ],
    process: [
      {
        title: 'Documentation Review',
        description:
          'We review structural drawings, schedules, and specifications to confirm reinforcement scope and flag missing information.',
      },
      {
        title: 'Placing Drawing Preparation',
        description:
          'Plan, section, and elevation views are detailed for each element — columns, beams, slabs, walls, footings, and pile caps.',
      },
      {
        title: 'Bar Bending Schedule & Bar List',
        description:
          'Bar marks, sizes, shapes, lengths, and quantities are scheduled, with cut lengths listed for fabrication.',
      },
      {
        title: 'Coordination & Delivery',
        description:
          'Congestion and clashes are reviewed at joints and intersections before drawings are delivered in DWG and PDF, with fast revision cycles.',
      },
    ],
    ctaLabel: 'EXPLORE REBAR DETAILING',
    seoContent: {
      heading: 'Rebar Detailing Services for Fabrication-Ready Reinforcement',
      body: [
        "Our rebar detailing services turn a structural engineer's design into fabrication-ready placing drawings and bar bending schedules. We detail plan, section, and elevation views for columns, beams, slabs, walls, footings, and pile caps, schedule every bar by mark, size, shape, length, and quantity, and list cut lengths so fabricators and placing crews know exactly what to bend and where it goes.",
        "Lap splices and development lengths are detailed per the engineer's design, along with bar supports, chairs, spacers, and accessories, post-tensioning coordination where applicable, and openings, embeds, and penetration reinforcement. We review congestion and clashes at joints and intersections before anything is fabricated, and we turn around revisions and resubmittals quickly against reviewer comments.",
        "Rebar detailing works from the structural engineer's design — the detailing itself is not structural engineering, and placing drawings are prepared to standard industry detailing conventions. Where a jurisdiction or project requires sealed engineering documents, PE review and sealing is available, subject to applicable licensing and jurisdictional requirements in your state.",
        'Rebar is one of the trades we detail under our broader Shop Drawing Services, alongside MEP, structural, and millwork shop drawings. If your reinforcement scope is part of a larger submittal package, our Shop Drawing Services team can coordinate rebar alongside the other trades under one set.',
      ],
      benefits: [
        {
          title: 'Fabrication-Ready Bar Detail',
          description: 'Placing drawings and bar bending schedules give fabricators and placing crews exact bar marks, shapes, and cut lengths, with no guesswork on-site.',
        },
        {
          title: 'Clash-Checked Before Pour',
          description: 'Congestion and clashes at joints and intersections are resolved on the drawing before concrete is placed, protecting the schedule.',
        },
        {
          title: "Built From Your Engineer's Design",
          description: "Detailing follows the structural engineer's design and standard industry detailing conventions — not a substitute for engineering.",
        },
      ],
      faqs: [
        {
          question: 'How long does rebar detailing take?',
          answer: 'Our standard turnaround is 3–7 business days, depending on the size and complexity of the structure.',
        },
        {
          question: 'What do you need to start a rebar detailing project?',
          answer: "At minimum we need the structural drawings and specifications. Existing bar schedules or a bar list, where available, help us confirm bar marks and match your engineer's design faster.",
        },
        {
          question: 'Does rebar detailing include structural engineering or design?',
          answer: "Detailing itself is not structural engineering — it translates the engineer's design into placing drawings and bar bending schedules for fabrication, and the design responsibility stays with the engineer of record. Where your jurisdiction or project requires sealed engineering documents, we do provide PE review and sealing, subject to applicable licensing and jurisdictional requirements in your state.",
        },
        {
          question: 'What file formats do you deliver?',
          answer: 'Rebar detailing drawings are delivered in editable DWG and review-ready PDF, prepared to standard industry detailing conventions for fabricator and reviewer sign-off.',
        },
        {
          question: 'How do you handle revisions and resubmittals?',
          answer: 'We turn around revisions quickly against reviewer and fabricator comments, updating placing drawings and bar bending schedules through each resubmittal cycle until the set is approved.',
        },
      ],
    },
  },
];

/* ── Drift guard ───────────────────────────────────────────────── */
// data/service-slugs.ts is the source of truth SERVICE_SLUGS feeds to the
// middleware (see lib/valid-slugs.ts). If a slug is added here without
// updating that list, the page renders fine but the middleware 404s it —
// fail the build instead of shipping that drift.
{
  const definedSlugs = services.map((s) => s.slug);
  const missing = definedSlugs.filter(
    (slug) => !(SERVICE_SLUGS as readonly string[]).includes(slug),
  );
  if (missing.length > 0) {
    throw new Error(
      `services.ts: slug(s) ${missing.join(', ')} missing from SERVICE_SLUGS (src/data/service-slugs.ts) — the middleware will 404 them.`,
    );
  }
  if (definedSlugs.length !== SERVICE_SLUGS.length) {
    throw new Error(
      `services.ts: services array has ${definedSlugs.length} entries but SERVICE_SLUGS has ${SERVICE_SLUGS.length} — the two lists have drifted out of sync.`,
    );
  }
}

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
