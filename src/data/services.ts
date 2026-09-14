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
  highlightSection?: { heading: string; body: string[] };
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
      'Detailed construction cost estimating services, quantity takeoffs, and cost analysis to support accurate budgeting, competitive bidding, and confident project decisions, delivered nationwide by The ACE Services.',
    summary:
      'Detailed construction cost estimating services, quantity takeoffs, and cost analysis to support accurate budgeting, competitive bidding, and confident project decisions, delivered nationwide by The ACE Services.',
    details: [
      'Construction cost estimate packages prepared across residential, commercial, and industrial construction sectors nationwide.',
      'Detailed quantity takeoffs and material lists built directly from your blueprints and construction drawings.',
      'Cost analysis structured to support budgeting, competitive bidding, and informed project decisions.',
      'Editable Excel spreadsheets and professional PDF cost estimate reports included with every delivery.',
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
          'We review your blueprints, drawings, and project scope to confirm what needs to be estimated and flag any missing information before work begins.',
      },
      {
        title: 'Quantity Takeoff',
        description:
          'Our estimators measure and itemize all material and labor quantities directly from your construction drawings using digital takeoff software.',
      },
      {
        title: 'Cost Analysis & Rate Calibration',
        description:
          'Quantities are priced against current regional market rates and organized into a clear format for budgeting or competitive bidding.',
      },
      {
        title: 'Delivery',
        description:
          'Your final construction cost estimate is delivered as an editable Excel spreadsheet and a professional PDF report, ready for bidding.',
      },
    ],
    ctaLabel: 'EXPLORE ESTIMATING',
    seoContent: {
      heading: 'Precision Construction Cost Estimating Services Nationwide',
      body: [
        'In today\'s volatile material market, guesswork in construction cost estimating leads to lost bids and shrinking margins. At The ACE Services, our professional construction cost estimating services provide general contractors, subcontractors, developers, and architects across the USA with highly accurate, data-driven material takeoffs, labor pricing, and AACE Class 3 cost estimates organized to the CSI MasterFormat.',
        'Whether you are bidding on a complex commercial build, managing a residential development, or planning an industrial facility, our expert cost estimators leverage industry-leading estimating software and up-to-date regional pricing databases to ensure your bids are both competitive and profitable. Every estimate reflects real material costs, labor rates, and market conditions specific to your project location.',
        'A precise estimate is only as good as the plans it is based on. If your current blueprints lack detail, our Architectural Services team can refine your shop drawings before we begin the quantity survey. Once your budget is locked, our Project Management experts can develop CPM schedules to align procurement with cash flow projections. Backed by ISO 9001-aligned processes, our estimating team has supported contractors across 35 U.S. states since 2019.'
      ],
      benefits: [
        {
          title: 'Win More Bids',
          description: 'Accurate, itemized construction cost estimates mean you can bid with confidence, knowing your margins are protected from day one.'
        },
        {
          title: 'Save Valuable Time',
          description: 'Free up your internal team to focus on project execution while our estimators handle the time-consuming quantity surveying and takeoff work.'
        },
        {
          title: 'Nationwide Accuracy',
          description: 'We adjust labor and material rates based on your specific geographic location, ensuring every estimate reflects real regional construction costs.'
        }
      ],
      faqs: [
        {
          question: 'What is the turnaround time for a construction cost estimate?',
          answer: 'Our standard turnaround time for construction cost estimating services is 24 to 48 hours, depending on project size and complexity. Expedited turnaround is available for urgent bid deadlines.'
        },
        {
          question: 'Do you provide editable Excel spreadsheets with your estimates?',
          answer: 'Yes. Every cost estimate includes a fully editable Excel spreadsheet alongside a professional PDF summary report, so you can adjust margins and rates as needed.'
        },
        {
          question: 'Who can benefit from your construction cost estimating services?',
          answer: 'Our estimating services support general contractors, subcontractors (electrical, plumbing, framing, and more), architects, and real estate developers across residential, commercial, and industrial sectors nationwide.'
        }
      ],
      highlightSection: {
        heading: 'Our Estimating Standards: AACE Class 3 & CSI MasterFormat',
        body: [
          'Every cost estimate produced by The ACE Services follows AACE International Class 3 estimating standards, meaning quantities and costs are developed from a defined project scope with an accuracy range suitable for budget approval and competitive bidding. Cost data is organized using the CSI MasterFormat, the standard classification system used across the U.S. construction industry, so your estimate integrates cleanly with your existing bid documents, specifications, and project management software.',
          'This standards-based approach is why general contractors, architects, and developers nationwide trust our construction cost estimating services for budgets they can defend to lenders, investors, and project owners.'
        ]
      }
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
      'Construction documentation and visualization services designed to support permitting, cross-discipline coordination, and project presentation, architectural shop drawings, permit sets, and 3D renderings delivered nationwide.',
    summary:
      'Construction documentation and visualization services designed to support permitting, cross-discipline coordination, and project presentation, architectural shop drawings, permit sets, and 3D renderings delivered nationwide.',
    details: [
      'Architectural shop drawings prepared for construction, fabrication, and cross-trade coordination.',
      'Permit sets and submission drawing sets organized to meet municipal review requirements.',
      'Submittal packages assembled and formatted for architect and owner approval workflows.',
      'Photorealistic 3D rendering for stakeholder presentation, marketing, and investor buy-in.',
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
          'We review your existing drawings, sketches, and project requirements to define the full architectural documentation scope.',
      },
      {
        title: 'Shop Drawing & Set Preparation',
        description:
          'Our drafting team prepares architectural shop drawings, permit sets, and submission drawing sets tailored to your project.',
      },
      {
        title: 'Coordination & Compliance Check',
        description:
          'Drawings are cross-coordinated with structural and MEP disciplines and checked against local building code requirements.',
      },
      {
        title: 'Presentation & Delivery',
        description:
          'Final drawing sets and 3D renderings are delivered in DWG and PDF formats, ready for submission and client presentation.',
      },
    ],
    ctaLabel: 'EXPLORE ARCHITECTURAL',
    seoContent: {
      heading: 'Comprehensive Architectural Drafting & Shop Drawing Services',
      body: [
        'Clear, coordinated, and code-compliant architectural documentation is the backbone of any successful construction project. The ACE Services provides top-tier architectural drafting services, specializing in architectural shop drawings, permit sets, submittals, and 3D rendering for contractors, developers, and architectural firms nationwide.',
        'Our drafting team bridges the gap between conceptual design and physical construction. By producing meticulous architectural shop drawings using industry-standard CAD software, we help mitigate on-site errors and streamline the municipal approval process across jurisdictions nationwide.',
        'Proper architectural documentation integrates seamlessly with our other disciplines. Detailed shop drawings allow our Structural Engineering team to accurately assess load paths, while giving our Cost Estimating division the exact specifications needed to generate pinpoint-accurate material takeoffs and construction cost estimates.'
      ],
      benefits: [
        {
          title: 'Accelerated Approvals',
          description: 'Our permit and submission drawing sets are tailored to meet municipal standards, reducing plan-review revisions and approval delays.'
        },
        {
          title: 'Enhanced Coordination',
          description: 'Identify and resolve design clashes early through precise architectural drafting, preventing costly rework in the field.'
        },
        {
          title: 'Stunning Visualizations',
          description: 'High-quality 3D architectural renderings help secure client buy-in and investment by bringing blueprints to life before construction begins.'
        }
      ],
      faqs: [
        {
          question: 'What file formats do you deliver for architectural drawings?',
          answer: 'We deliver all final architectural documents in PDF format for easy review and DWG (AutoCAD) format for seamless integration into your existing drafting and design workflows.'
        },
        {
          question: 'Do you create architectural shop drawings from scratch?',
          answer: 'We typically work from conceptual designs, sketches, or base architectural plans to develop fully detailed shop drawings ready for permitting, fabrication, and installation.'
        },
        {
          question: 'How long does a typical architectural permit set take to complete?',
          answer: 'Standard turnaround for architectural documentation, including permit sets, is 7 to 10 business days, though timelines may vary based on project scale and jurisdictional complexity.'
        }
      ],
      highlightSection: {
        heading: 'Software & Tools We Use for Architectural Drafting',
        body: [
          'Our drafting team produces every architectural shop drawing, permit set, and 3D rendering using industry-standard tools including AutoCAD, Revit, and Bluebeam Revu, the same platforms used by architects, general contractors, and plan reviewers nationwide. This means your DWG and PDF deliverables open cleanly in your existing workflow and integrate directly with your structural and MEP consultants, with no file-conversion guesswork before submission.',
          'Because our drawings are built to CAD industry standards from the start, revisions, redlines, and coordination with your in-house team move faster at every stage of the permitting and construction process.'
        ]
      }
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
      'PE-sealed structural engineering and MEP design services for commercial, residential, and industrial construction, code-compliant documentation delivered nationwide by The ACE Services.',
    summary:
      'PE-sealed structural engineering and MEP design services for commercial, residential, and industrial construction, code-compliant documentation delivered nationwide by The ACE Services.',
    details: [
      'Structural design and analysis for safe, code-compliant construction across residential, commercial, and industrial projects.',
      'MEP shop drawings coordinated directly with architectural drawing sets to prevent clashes.',
      'Engineering documentation prepared for plan review, permitting, and construction.',
      'PE review and sealing available where required by state and local jurisdiction.',
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
          'We review project scope, structural loads, and applicable building codes to define the engineering deliverables needed.',
      },
      {
        title: 'Structural & MEP Engineering',
        description:
          'Our engineers develop structural design, load path analysis, and coordinated MEP shop drawings for your project.',
      },
      {
        title: 'Documentation & PE Review',
        description:
          'Engineering documentation is compiled and reviewed by licensed professional engineers where required by jurisdiction.',
      },
      {
        title: 'Delivery & Coordination',
        description:
          'Final structural and MEP documents are delivered in DWG and PDF formats, fully coordinated with architectural drawings.',
      },
    ],
    ctaLabel: 'EXPLORE ENGINEERING',
    footnote: '*Subject to applicable licensing and jurisdictional requirements.',
    seoContent: {
      heading: 'Expert Structural Engineering and MEP Design Services',
      body: [
        'Safety, structural stability, and code compliance are non-negotiable in construction. The ACE Services delivers robust structural engineering and MEP (mechanical, electrical, plumbing) design services for commercial, residential, and industrial construction projects across the USA.',
        'Our structural engineering team provides comprehensive structural analysis, load path calculations, and coordinated MEP shop drawings. We ensure every beam, column, and conduit is designed for optimal performance and safety, meeting rigorous local and national building codes, including the International Building Code (IBC).',
        'We work hand-in-hand with our Architectural Services division to ensure aesthetic design visions remain structurally viable. By resolving engineering challenges during pre-construction, we provide a solid, code-compliant foundation for our Project Management team to schedule construction activities without fear of design-related delays.'
      ],
      benefits: [
        {
          title: 'Code-Conscious Design',
          description: 'Our structural and MEP designs strictly adhere to IBC and local building codes, ensuring smooth plan review and safe construction.'
        },
        {
          title: 'PE Sealing Available',
          description: 'We offer Professional Engineer (PE) review and sealing services for structural documents where required by jurisdiction.'
        },
        {
          title: 'Clash-Free MEP Integration',
          description: 'Coordinated MEP shop drawings prevent spatial conflicts between mechanical systems, electrical routing, and structural elements.'
        }
      ],
      faqs: [
        {
          question: 'Do you offer PE stamping and sealing for structural drawings?',
          answer: 'Yes. We provide Professional Engineer (PE) review and sealing services for structural and MEP engineering documents, subject to applicable licensing and jurisdictional requirements in your state.'
        },
        {
          question: 'Can you coordinate MEP designs with existing architectural plans?',
          answer: 'Absolutely. We specialize in coordinating MEP shop drawings directly with your existing architectural drawing sets to ensure seamless integration and prevent clashes in the field.'
        },
        {
          question: 'What is the turnaround time for structural engineering and MEP design?',
          answer: 'Standard turnaround for structural engineering and MEP design services is 7 to 10 business days, depending on project scope, structural complexity, and whether PE sealing is required.'
        }
      ],
      highlightSection: {
        heading: 'Codes & Standards We Design To',
        body: [
          'Every structural and MEP design produced by The ACE Services is developed in accordance with the International Building Code (IBC), ASCE 7 load standards, and applicable state and local amendments, so your engineering documentation is built for a smooth plan-review process from the first submission. Our engineers factor in region-specific requirements such as seismic design categories, wind load zones, and soil-bearing conditions, ensuring structural designs hold up to both code officials and real-world site conditions.',
          'This code-first approach is why general contractors and developers across commercial, residential, and industrial sectors trust The ACE Services for structural engineering and MEP design they can permit with confidence.'
        ]
      }
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
      'Construction scheduling, procurement coordination, and project controls designed to keep activities, milestones, and resources aligned, delivered nationwide by The ACE Services.',
    summary:
      'Construction scheduling, procurement coordination, and project controls designed to keep activities, milestones, and resources aligned, delivered nationwide by The ACE Services.',
    details: [
      'Construction scheduling using CPM and Gantt schedules aligned with project milestones, task dependencies, and construction sequencing.',
      'Project planning covering scope definition, activity sequencing, milestone planning, and full schedule development from pre-construction through closeout.',
      'Procurement coordination integrated directly into the construction schedule to support timely material and equipment delivery.',
      'Project controls provide ongoing progress tracking, milestone monitoring, and schedule reporting throughout construction.',
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
          'We establish project activities, task dependencies, deliverables, and key construction milestones.',
      },
      {
        title: 'Build the Schedule',
        description:
          'Our team develops CPM and Gantt schedules structured around construction sequencing and project requirements.',
      },
      {
        title: 'Integrate Procurement',
        description:
          'Procurement activities are coordinated with the schedule to identify critical materials and flag potential delays early.',
      },
      {
        title: 'Track & Report',
        description:
          'We monitor progress against planned milestones and provide clear, easy-to-read schedule reporting throughout construction.',
      },
    ],
    ctaLabel: 'EXPLORE PROJECT MANAGEMENT',
    seoContent: {
      heading: 'Construction Project Management & CPM Scheduling Services',
      body: [
        'Time is money in construction, and project delays can quickly erode profitability. The ACE Services provides expert construction project management, CPM scheduling, and project controls for general contractors and developers nationwide.',
        'We specialize in developing highly detailed Critical Path Method (CPM) and Gantt schedules that align with project milestones, resource availability, and construction sequencing. By integrating procurement activities directly into the schedule, we help you identify and mitigate supply chain bottlenecks before they impact your critical path.',
        'Effective project management ties all our services together. Our schedules rely on the accurate budgets generated by our Cost Estimating team and the precise construction timelines required to execute the designs finalized by our Architectural and Structural Engineering divisions.'
      ],
      benefits: [
        {
          title: 'Mitigate Delays',
          description: 'Identify the critical path and potential scheduling bottlenecks early to keep your construction project moving forward on time.'
        },
        {
          title: 'Optimize Procurement',
          description: 'Coordinate material and equipment deliveries with installation schedules to prevent site congestion and material shortages.'
        },
        {
          title: 'Clear Stakeholder Communication',
          description: 'Professional Gantt charts and progress reports keep owners, investors, and subcontractors aligned throughout construction.'
        }
      ],
      faqs: [
        {
          question: 'What scheduling methods do you use for construction project management?',
          answer: 'We primarily use the Critical Path Method (CPM) and Gantt charts to visually map task dependencies, project milestones, and construction durations.'
        },
        {
          question: 'How long does it take to build a construction schedule?',
          answer: 'A comprehensive preliminary construction schedule typically takes 3 to 5 business days to develop, depending on the availability of project scope and documentation.'
        },
        {
          question: 'Do you track construction progress after the initial schedule is built?',
          answer: 'Yes. We offer ongoing project controls and progress tracking to update schedules as field conditions change, so you always have an accurate completion forecast.'
        }
      ],
      highlightSection: {
        heading: 'Deliverables & Reporting Formats',
        body: [
          'Every construction schedule we build is delivered in industry-standard formats such as Microsoft Project and Primavera P6-compatible files, alongside clear PDF Gantt charts and milestone reports formatted for owners, lenders, and project stakeholders who may not use scheduling software directly. Progress updates include percent-complete tracking by activity, critical path highlighting, and variance reporting so you can see exactly where a project stands against the original baseline schedule at any point during construction.',
          'This format flexibility means your project management deliverables integrate directly into your existing reporting workflow, whether you\'re updating an internal team, a general contractor, or a project owner.'
        ]
      }
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
        'Our 3D architectural rendering services turn drawings into images stakeholders can actually understand. From 3D exterior renderings that place a building in its real site context to detailed interior visualizations, we help owners, review boards, and buyers sign off on a design long before ground is broken.',
        'Photorealistic renderings do more than look good, they accelerate permitting and design review, resolve questions about materials and massing early, and give developers and marketing teams the visual assets they need to pre-sell units and secure project funding. Every 3D rendering is built from an accurate architectural model, so what you present is what actually gets built.',
        '3D renderings work best as part of a coordinated pre-construction package. Pair them with our Architectural Services drafting and permit sets to move from concept to approval, or with our Cost Estimating team so the design you visualize is priced accurately from day one.',
      ],
      benefits: [
        {
          title: 'Win Approvals Faster',
          description: 'Give review boards and clients a clear, photorealistic picture so permitting and design decisions happen sooner, with fewer revision cycles.',
        },
        {
          title: 'Sell & Fund Projects',
          description: 'Marketing-grade exterior and interior renderings help developers pre-sell units and secure investor buy-in before construction starts.',
        },
        {
          title: 'Catch Issues Early',
          description: 'Seeing a design in 3D surfaces material and spatial problems while they\'re still inexpensive to fix on the model, not the job site.',
        },
      ],
      faqs: [
        {
          question: 'What do I need to provide for a 3D architectural rendering?',
          answer: 'Floor plans, elevations, and any material or finish selections are ideal for an accurate rendering. We can also work from hand sketches or a set of reference images if your drawings are still in progress.',
        },
        {
          question: 'Do you provide both exterior and interior renderings?',
          answer: 'Yes. We produce 3D exterior renderings, interior visualizations, and floor-plan renderings for permitting, cross-discipline coordination, or marketing use \u2014 often as part of the same project.',
        },
        {
          question: 'How long does a 3D rendering take to complete?',
          answer: 'Most 3D architectural renderings are delivered in 3 to 5 business days, depending on complexity and the number of views, with a draft review included before final delivery.',
        },
      ],
      highlightSection: {
        heading: 'What Affects 3D Rendering Turnaround & Pricing',
        body: [
          'Every 3D architectural rendering quote is shaped by a few core variables: the number of views (a single exterior still costs less than a full exterior-plus-interior package), the complexity of the design, the level of photorealism required, and how many revision rounds are included.',
          'Rush turnaround for permitting deadlines or investor presentations is available, typically for a premium over our standard 3-5 business day delivery. Because every rendering is priced around your specific scope rather than a flat rate, sharing your floor plans, elevations, and reference imagery upfront gets you the most accurate quote in the shortest time.',
        ],
      },
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
        'Our shop drawing services turn design intent into buildable, fabrication-ready documentation. We prepare MEP, structural, rebar, and millwork shop drawings that give fabricators and field crews the exact dimensions, connections, and details they need, with no ambiguity and no guesswork.',
        'Most costly rework starts as a clash on paper. We coordinate shop drawings across trades before anything is fabricated, catching spatial conflicts between ductwork, piping, structure, and finishes while they\'re still a line on a drawing, not a change order in the field.',
        'Shop drawings connect design and construction. They build directly on the architectural and structural sets our drafting teams produce, and they feed the accurate quantities our Cost Estimating team relies on, so your documentation, pricing, and fabrication all speak the same language.',
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
          answer: 'We prepare MEP (mechanical, electrical, plumbing), structural, rebar, and millwork shop drawings, along with fabrication and installation details for each trade.',
        },
        {
          question: 'Do you coordinate shop drawings across trades?',
          answer: 'Yes. Cross-trade clash coordination is a core part of our shop drawing service \u2014 we resolve spatial conflicts between disciplines before anything reaches the shop or the field.',
        },
        {
          question: 'What formats do you deliver shop drawings in?',
          answer: 'Shop drawings are delivered in editable DWG and review-ready PDF formats, prepared to fabrication standards for fabricator and reviewer sign-off.',
        },
      ],
      highlightSection: {
        heading: 'Standards & Trades We Detail To',
        body: [
          'Every shop drawing we produce is developed to the standards your fabricator and reviewer already expect. Structural steel shop drawings follow AISC detailing conventions, rebar shop drawings follow ACI and CRSI placement standards, and MEP shop drawings follow SMACNA guidelines for ductwork alongside standard trade practice for piping and electrical routing.',
          'Detailing to these recognized industry standards from the start means fewer reviewer comments, faster fabricator sign-off, and shop drawings that hold up whether they\'re reviewed by your general contractor, your structural engineer, or the fabrication shop itself.',
        ],
      },
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
        'Our permit set services assemble complete, code-compliant permit drawings into a single package built for plan review. We coordinate architectural, structural, and MEP sheets to the jurisdiction\'s checklist, not a generic template, so your submission clears review with fewer comments and fewer costly resubmittals.',
        'A rejected permit set can stall a project for weeks. By preparing building permit drawings that anticipate what reviewers look for and flag code issues before submission, we help general contractors and developers move from design to approval faster while keeping the schedule intact.',
        'Permit sets are the approval layer of your documentation. They build directly on our architectural drafting and shop drawing work, and they align with the budgets our Cost Estimating team prepares, so what you submit, price, and build all stay in sync.',
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
          answer: 'A permit set is the coordinated package of drawings and documents a jurisdiction requires for plan review and building-permit approval, covering architectural, structural, and MEP scope as applicable to your project.',
        },
        {
          question: 'Do you prepare drawings to our local code requirements?',
          answer: 'Yes. We build each permit set to the specific jurisdiction\'s submission checklist and applicable codes, and review it for compliance before submission to reduce review comments.',
        },
        {
          question: 'Can you help with reviewer comments and resubmittals?',
          answer: 'Absolutely. We turn around markups and revisions quickly to address plan-review comments and keep your approval moving without losing schedule.',
        },
      ],
      highlightSection: {
        heading: 'What\'s Included in a Complete Permit Set',
        body: [
          'Exactly what belongs in a permit set depends on your jurisdiction and project scope, but a complete package typically includes:',
          'A cover sheet and site plan showing property lines, setbacks, and building placement',
          'Architectural sheets: floor plans, elevations, sections, and door/window schedules, built by our Architectural Services team',
          'Structural sheets: foundation, framing, and load-bearing details, sealed by a PE where required, see Structural Engineering & MEP Design',
          'MEP sheets: mechanical, electrical, and plumbing layouts sized to code',
          'Code compliance documentation, including energy code and accessibility notes where applicable',
          'Any jurisdiction-specific forms or checklists required for submission',
        ],
      },
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
        "We've built a CSI Division 26 electrical breakdown into 16 of our completed cost estimates, totaling $926,744 in electrical scope. Across those projects, electrical work ran a median of 9.3% of total project cost, with a range from 0.5% to 24.0% — proof that a flat percentage rule of thumb is not a reliable way to price electrical scope. On Comstock San Diego, a 3,326 sf project, electrical came to $146,085, or 16.0% of the total. On Pinnacle Montessori School, 17,366 sf, electrical was $135,181, just 4.4% of the total. On Lucky Hair Saloon, a dense 1,004 sf fit-out, electrical reached $64,026, 24.0% of the total. And on Wildlife Pickleball Park, a site-work project rather than a building, electrical was just $4,775, or 0.5% of total cost.",
        "A small fit-out with dense devices and lighting runs far higher as a percentage of total cost than a large, simple structure, which is exactly why a counted takeoff protects your bid where a percentage rule of thumb loses it. These figures are quantity takeoffs and cost estimates rather than electrical design or code review, which we handle separately as an engineering service.",
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
        {
          question: 'What are common electrical estimating mistakes that cost contractors money?',
          answer: "Even experienced contractors lose margin on electrical scope through a handful of recurring mistakes. Pricing electrical as a flat percentage of total project cost is the most common, as our own data shows, electrical scope ranged from 0.5% to 24.0% of total cost across similar-sized projects, so a rule-of-thumb percentage can just as easily overprice a simple structure as underprice a dense fit-out. Missing low-voltage scope (fire alarm, data, security) because it wasn't clearly called out in the contract is another frequent gap, along with pricing devices and gear against outdated unit costs instead of current market rates. A counted, Division 26-specific takeoff avoids all three by pricing exactly what's on your drawings, not an average.",
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
  {
    id: 'SVC_BP',
    slug: 'blueprint-estimation',
    seoTitle: 'Blueprint Estimation Services | Accurate Takeoffs',
    seoDescription:
      'Accurate blueprint estimation and quantity takeoffs for residential, commercial, and industrial construction. Bid-ready cost estimates delivered in 24-48 hours.',
    title: 'Blueprint Estimation Services',
    icon: 'SVC_EST',
    tagline: 'Budgeting & Bidding',
    category: 'ESTIMATING',
    description:
      'Blueprint estimation services that turn architectural and engineering drawings into precise, bid-ready construction cost estimates with quantity takeoffs and cost breakdowns built directly from your plans.',
    summary:
      'Blueprint estimation services that turn architectural and engineering drawings into precise, bid-ready construction cost estimates with quantity takeoffs and cost breakdowns built directly from your plans.',
    details: [
      'Blueprint estimating is a careful process of analysis, quantification, and cost calculation that determines whether your project is priced to win the bid and still protect your margin.',
      'Our estimators combine construction experience, digital takeoff software, and current regional pricing data to deliver blueprint estimates you can submit with confidence.',
      'Accurate project budgeting built directly from your architectural and structural drawings.',
      'Reduced risk of unexpected costs and change orders once construction begins.',
    ],
    features: [
      'Blueprint Estimation',
      'Quantity Takeoffs',
      'Material & Labor Planning',
      'Bid Package Preparation',
      'Cost Breakdown',
      'Review & Adjustments',
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
        title: 'Review Blueprints',
        description:
          'Our estimators examine every architectural and structural sheet to understand the full scope and complexity of the work before a single quantity is measured.',
      },
      {
        title: 'Quantification',
        description:
          'We measure and list every material and component required for the project directly from your drawings, using digital takeoff tools for precise quantities.',
      },
      {
        title: 'Takeoffs',
        description:
          'Quantity takeoffs are the backbone of blueprint estimating \u2014 the exact material and labor quantities calculated directly from your construction drawings.',
      },
      {
        title: 'Cost Estimation',
        description:
          'With takeoffs complete, we calculate the total cost of materials, labor, and other project expenses to produce your blueprint-based construction cost estimate.',
      },
      {
        title: 'Bid Preparation',
        description:
          'We compile all material, labor, and equipment costs into a single estimate, include the project timeline and key milestones, and format the bid to meet your client\'s or general contractor\'s specific requirements.',
      },
      {
        title: 'Review and Adjustments',
        description:
          'We provide continuous review and adjustments so your blueprint estimate stays accurate throughout preconstruction, accounting for design changes, scope adjustments, and material price fluctuations.',
      },
      {
        title: 'Submission',
        description:
          'We deliver a complete, professional blueprint estimate package ready for your clients, stakeholders, or general contractor.',
      },
    ],
    ctaLabel: 'EXPLORE BLUEPRINT ESTIMATION',
    seoContent: {
      heading: 'Blueprint Estimation Services',
      body: [
        'At The ACE Services, blueprint estimation turns architectural and engineering drawings into a precise, bid-ready construction cost estimate. Whether you\'re building a residential, commercial, or industrial property, accurate blueprint estimating services keep your project on budget from the very first bid, with quantity takeoffs and cost breakdowns built directly from your plans.',
        'Blueprint estimating is more than reading plans line by line \u2014 it\'s a careful process of analysis, quantification, and cost calculation that determines whether your project is priced to win the bid and still protect your margin. Our estimators combine construction experience, digital takeoff software, and current regional pricing data to deliver blueprint estimates you can submit with confidence.',
      ],
      benefits: [
        {
          title: 'Accurate Project Budgeting',
          description: 'Accurate project budgeting built directly from your architectural and structural drawings.',
        },
        {
          title: 'Reduced Risk of Unexpected Costs',
          description: 'Reduced risk of unexpected costs and change orders once construction begins.',
        },
        {
          title: 'Efficient Material & Labor Planning',
          description: 'Efficient material and labor planning based on precise quantity takeoffs.',
        },
        {
          title: 'Competitive Bid Packages',
          description: 'Bid packages formatted and detailed enough to compete on price without sacrificing margin.',
        },
      ],
      faqs: [
        {
          question: 'What\'s the difference between blueprint estimation and a general cost estimate?',
          answer: 'Blueprint estimation specifically starts from your architectural and structural drawings to produce quantity takeoffs and pricing, while a general cost estimate can sometimes be based on square footage or project type alone; blueprint-based estimates are more precise because every quantity is measured directly from your plans.',
        },
        {
          question: 'What file formats do you accept for blueprint estimation?',
          answer: 'We accept PDF, DWG, and most common CAD file formats, and can also work from scanned or hand-drawn plans if digital files aren\'t available.',
        },
        {
          question: 'How long does blueprint estimation take?',
          answer: 'Standard turnaround for blueprint estimation is 24 to 48 hours from receipt of complete plans, with expedited turnaround available for urgent bid deadlines.',
        },
      ],
    },
  },
  {
    id: 'SVC_QS',
    slug: 'quantity-surveyor-services',
    seoTitle: 'Quantity Surveyor Services | The ACE Services',
    seoDescription:
      'Professional quantity surveying and material takeoffs for general contractors and developers nationwide. Get a free quantity surveyor quote today.',
    title: 'Quantity Surveyor Services',
    icon: 'SVC_EST',
    tagline: 'Cost Control & Contract Management',
    category: 'ESTIMATING',
    description:
      'Quantity surveyor services, pre-construction cost planning, tender analysis, contract administration, and final account settlement to keep your construction budget under control from first estimate to project closeout.',
    summary:
      'Quantity surveyor services, pre-construction cost planning, tender analysis, contract administration, and final account settlement to keep your construction budget under control from first estimate to project closeout.',
    details: [
      'Pre-construction cost planning and budget development based on your project scope and drawings.',
      'Tender and bid analysis that compares contractor pricing on a true apples-to-apples basis, not just the lowest number.',
      'Contract preparation, negotiation, and ongoing change and variation management throughout construction.',
      'Progress payment certification and final account settlement delivered as clear, audit-ready reports.',
    ],
    features: [
      'Pre-Construction Cost Planning',
      'Tender & Bid Analysis',
      'Contract Drafting & Negotiation',
      'Change & Variation Management',
      'Progress Payment Certification',
      'Final Account Settlement',
    ],
    startingPrice: 'Custom',
    turnaround: '24-48 hours',
    stats: [
      { label: 'SCOPE', value: 'Full-Lifecycle' },
      { label: 'TURNAROUND', value: '24-48h' },
      { label: 'COVERAGE', value: 'Cost + Contract' },
      { label: 'FORMAT', value: 'XLS + PDF' },
    ],
    process: [
      {
        title: 'Consultation & Scope Review',
        description:
          'We review your project scope, drawings, and timeline to define the quantity surveying deliverables you need.',
      },
      {
        title: 'Cost Planning & Budget Report',
        description:
          'We prepare an itemized cost plan and budget report your team can use for financing, bidding, or approvals.',
      },
      {
        title: 'Contract & Tender Support',
        description:
          'We analyze bids, support contract negotiation, and track variations as the project moves into construction.',
      },
      {
        title: 'Certification & Final Account',
        description:
          'We certify progress payments throughout construction and finalize accounts and cost reporting at closeout.',
      },
    ],
    ctaLabel: 'EXPLORE QUANTITY SURVEYOR',
    seoContent: {
      heading: 'Full-Lifecycle Quantity Surveyor Services for U.S. Contractors and Developers',
      body: [
        'Cost overruns rarely come from one bad decision, they build up from unclear budgets, unchecked variations, and contractor invoices no one is independently verifying. Our quantity surveyor services give general contractors, developers, and investors a dedicated cost-control function across the entire project lifecycle, from the first budget estimate through final account settlement.',
        "A quantity surveyor's job goes beyond estimating. We analyze competing bids so you're comparing true value, not just the lowest number; draft and negotiate contracts that reduce dispute risk; track every scope change and its cost impact as it happens; and certify progress payments so you know exactly what's owed and why at every draw.",
        "Quantity surveying works best paired with the documentation it's built on. Our Cost Estimating team can prepare the initial takeoff your cost plan is based on, and our Project Management team can align your payment schedule with the CPM schedule driving construction sequencing.",
      ],
      benefits: [
        {
          title: 'Independent Cost Control',
          description: "A dedicated quantity surveyor verifies contractor invoices and certifies payments, so you're never paying for work that wasn't actually done.",
        },
        {
          title: 'Fewer Disputes',
          description: 'Clear contracts and documented variation tracking reduce the ambiguity that leads to costly change-order disputes.',
        },
        {
          title: 'Full Financial Visibility',
          description: 'From the first budget to the final account, you get an audit-ready record of exactly where every dollar went.',
        },
      ],
      faqs: [
        {
          question: 'What does a quantity surveyor actually do?',
          answer: 'A quantity surveyor manages the financial and contractual side of a construction project, estimating and controlling costs, analyzing bids, drafting and negotiating contracts, tracking scope changes, and certifying payments from initial planning through final account settlement.',
        },
        {
          question: 'When should I bring in a quantity surveyor?',
          answer: 'Ideally at the pre-construction stage, so your cost plan and contracts are solid before bidding begins, but quantity surveyor services also add value mid-project for cost control, variation tracking, and payment certification on projects already underway.',
        },
        {
          question: 'Is quantity surveying the same as cost estimating?',
          answer: "Not quite. Cost estimating produces the initial pricing for your project, while quantity surveying covers that estimate plus the ongoing financial and contractual management through the full project lifecycle. If you only need a one-time bid number, our Cost Estimating service is the right fit; if you need cost control through the life of the project, quantity surveyor services are built for that.",
        },
      ],
      highlightSection: {
        heading: 'Quantity Surveyor vs. Cost Estimator: What\u2019s the Difference?',
        body: [
          'People often use "quantity surveyor" and "cost estimator" interchangeably, but they cover different parts of a project. A cost estimator focuses on producing an accurate price for a defined scope of work, typically at the bidding stage. A quantity surveyor covers that same estimating function, then continues through the project as the ongoing financial manager, analyzing tenders, negotiating contracts, tracking variations, certifying payments, and closing out final accounts.',
          'In short: every quantity surveyor does cost estimating, but not every cost estimate comes with a quantity surveyor\u2019s ongoing contract and cost management. If you only need a one-time bid number, our Cost Estimating service is the right fit; if you need cost control through the life of the project, quantity surveyor services are built for that.',
        ],
      },
    },
  },
  {
    id: 'SVC_BLD',
    slug: 'building-estimating',
    seoTitle: 'Building Cost Estimating Services | The ACE Services',
    seoDescription:
      'Detailed building cost estimates and material takeoffs for every project type, delivered fast. Get your free building estimate quote in 24-48 hours.',
    title: 'Building Estimating',
    icon: 'SVC_EST',
    tagline: 'Cost Estimating',
    category: 'ESTIMATING',
    description:
      'Building estimating services, detailed cost estimates and quantity takeoffs for residential, commercial, and institutional building projects, built directly from your drawings and checked against local code requirements.',
    summary:
      'Building estimating services, detailed cost estimates and quantity takeoffs for residential, commercial, and institutional building projects, built directly from your drawings and checked against local code requirements.',
    details: [
      'Cost estimates and material takeoffs covering residential, commercial, and institutional building projects.',
      'Quantities measured directly from architectural and structural drawings using digital takeoff software.',
      'Estimates checked against local building codes and regulations to avoid budget surprises tied to compliance.',
      'Editable Excel spreadsheets and professional PDF reports delivered for every building estimate.',
    ],
    features: [
      'Residential Building Estimates',
      'Commercial Building Estimates',
      'Institutional Building Estimates',
      'Material Takeoffs',
      'Code-Compliant Cost Planning',
      'Bid-Ready Estimate Packages',
    ],
    startingPrice: 'Custom',
    turnaround: '24-48 hours',
    stats: [
      { label: 'SCOPE', value: 'Residential + Commercial' },
      { label: 'TURNAROUND', value: '24-48h' },
      { label: 'COMPLIANCE', value: 'Code-Aware' },
      { label: 'FORMAT', value: 'XLS + PDF' },
    ],
    process: [
      {
        title: 'Blueprint & Scope Review',
        description:
          'We review your architectural and structural drawings to confirm project scope, building type, and any local code considerations.',
      },
      {
        title: 'Quantity Takeoff',
        description:
          'Every material and labor quantity is measured directly from your drawings using digital takeoff software.',
      },
      {
        title: 'Cost Analysis',
        description:
          'Quantities are priced against current regional material and labor rates and organized for budgeting or bidding.',
      },
      {
        title: 'Delivery',
        description:
          'Your building estimate is delivered as an editable Excel spreadsheet and a professional PDF report, ready to submit.',
      },
    ],
    ctaLabel: 'EXPLORE BUILDING ESTIMATING',
    seoContent: {
      heading: 'Building Estimating Services for Every Project Type',
      body: [
        "Whether you're building a single-family home, a retail plaza, or an institutional facility, an accurate building estimate is what separates a winning bid from a losing one. Our building estimating services cover residential, commercial, and institutional construction, with quantities and costs built directly from your drawings rather than rough square-footage guesswork.",
        "Different building types carry different cost drivers, a residential build is priced differently than a multi-tenant commercial structure or a code-heavy institutional facility like a school or clinic. Our estimators account for the specific materials, methods, and local code requirements each building type demands, so your estimate reflects the real project in front of you, not a generic average.",
        "Building estimates work best as part of a coordinated pre-construction package. If your plans need refinement first, our Architectural Services team can tighten up drawings before the takeoff begins, and our Project Management team can turn your locked budget into a construction schedule ready for execution.",
      ],
      benefits: [
        {
          title: 'Accurate Across Building Types',
          description: 'Whether residential, commercial, or institutional, your estimate reflects the specific materials and code requirements of that building type.',
        },
        {
          title: 'Code-Aware Budgeting',
          description: 'Estimates account for local building code and regulatory requirements, reducing the risk of compliance-driven cost surprises.',
        },
        {
          title: 'Bid-Ready Documentation',
          description: 'Every estimate is delivered in a professional, itemized format ready to submit to a client or general contractor.',
        },
      ],
      faqs: [
        {
          question: 'What types of building projects do you estimate?',
          answer: 'We estimate residential, commercial, and institutional building projects, including single-family and multi-family residential, retail and office commercial space, and institutional facilities like schools and healthcare buildings.',
        },
        {
          question: 'Do building estimates account for local building codes?',
          answer: "Yes. We check estimates against applicable local building codes and regulations so your budget reflects compliance requirements specific to your project's jurisdiction, not just national averages.",
        },
        {
          question: 'How is building estimating different from residential or commercial estimating?',
          answer: 'Building estimating is the umbrella service covering all building types; our residential and commercial estimating services apply the same core process with pricing and code considerations tailored specifically to those project types.',
        },
      ],
      highlightSection: {
        heading: "What\u2019s Included in a Building Estimate",
        body: [
          'A complete building estimate from The ACE Services includes:',
          '\u2022 A full material takeoff broken out by CSI MasterFormat division',
          '\u2022 Labor cost estimates by trade and project phase',
          '\u2022 Equipment and general conditions costs where applicable',
          '\u2022 Regional material and labor pricing specific to your project location',
          '\u2022 An editable Excel spreadsheet plus a professional PDF summary report',
        ],
      },
    },
  },
  {
    id: 'SVC_IND',
    slug: 'industrial-estimating',
    seoTitle: 'Industrial Estimating Services | The ACE Services',
    seoDescription:
      'Precise industrial construction cost estimates for plants, warehouses and manufacturing facilities. Request a free industrial estimate quote today.',
    title: 'Industrial Estimating',
    icon: 'SVC_EST',
    tagline: 'Cost Estimating',
    category: 'ESTIMATING',
    description:
      'Industrial estimating services, quantity takeoffs and cost estimates for complex industrial construction, covering chemical, oil and gas, manufacturing, and processing facilities for EPC contractors, owners, and investors nationwide.',
    summary:
      'Industrial estimating services, quantity takeoffs and cost estimates for complex industrial construction, covering chemical, oil and gas, manufacturing, and processing facilities for EPC contractors, owners, and investors nationwide.',
    details: [
      'Industrial cost estimates covering chemical and petrochemical, oil and gas, mining and metals, and manufacturing facilities.',
      'Specialized equipment and process-system pricing that goes beyond standard commercial cost estimating.',
      'Estimates audited and analyzed by professional construction estimators for EPC contractors, owners, and investors.',
      'Editable Excel spreadsheets and professional PDF reports delivered for every industrial estimate.',
    ],
    features: [
      'Chemical & Petrochemical Estimating',
      'Oil & Gas Estimating',
      'Mining & Metals Estimating',
      'Manufacturing & Processing Facility Estimating',
      'Power & Energy Facility Estimating',
      'Warehouse & Logistics Estimating',
    ],
    startingPrice: 'Custom',
    turnaround: '24-48 hours',
    stats: [
      { label: 'SECTORS', value: '12+' },
      { label: 'TURNAROUND', value: '24-48h' },
      { label: 'SCOPE', value: 'EPC-Ready' },
      { label: 'FORMAT', value: 'XLS + PDF' },
    ],
    process: [
      {
        title: 'Scope & Systems Review',
        description:
          'We review your project scope, process systems, and specialized equipment requirements to define the full estimating scope.',
      },
      {
        title: 'Quantity Takeoff',
        description:
          'Materials, equipment, and process-system components are measured and itemized directly from your drawings and specifications.',
      },
      {
        title: 'Specialized Cost Analysis',
        description:
          'Quantities are priced using industrial-specific rates for specialized equipment, materials, and skilled labor.',
      },
      {
        title: 'Delivery & Audit Review',
        description:
          'Your estimate is audited by a second estimator before delivery as an editable Excel spreadsheet and PDF report.',
      },
    ],
    ctaLabel: 'EXPLORE INDUSTRIAL ESTIMATING',
    seoContent: {
      heading: 'Industrial Estimating Services for Complex, Capital-Intensive Projects',
      body: [
        'Industrial construction projects, factories, processing plants, refineries, and manufacturing facilities, are among the most capital-intensive and technically complex builds in the industry. Our industrial estimating services support EPC contractors, owners, engineering firms, and financial investors with cost estimates built for that complexity, not adapted from a standard commercial template.',
        'Industrial estimating differs from commercial estimating in scope and stakes. Where commercial projects focus on architectural finishes and occupant comfort, industrial projects prioritize process functionality, specialized equipment, and strict regulatory and safety compliance.',
        'Given the scale of industrial investment, an estimating error carries outsized consequences, which is why every industrial estimate is reviewed by a second estimator before delivery. Once your industrial budget is set, our Project Management team can build the CPM schedule needed to sequence complex, multi-trade industrial construction.',
      ],
      benefits: [
        {
          title: 'Built for Industrial Complexity',
          description: "Estimates account for specialized equipment, process systems, and safety requirements that standard commercial estimating doesn't cover.",
        },
        {
          title: 'Audited Accuracy',
          description: 'Every industrial estimate is reviewed by a second estimator before delivery, reducing the risk of costly errors on high-stakes projects.',
        },
        {
          title: 'Sector-Specific Expertise',
          description: 'From petrochemical to pharmaceutical to power generation, estimates reflect the specific cost drivers of your industrial sector.',
        },
      ],
      faqs: [
        {
          question: 'What industrial sectors do you provide estimating for?',
          answer: 'We estimate across chemical and petrochemical, oil and gas, mining and metals, marine, pharmaceutical, food processing, biofuels, hydrocarbon processing, polymers and fertilizers, paper and pulp, and refrigeration and packaging facilities, among other industrial sectors.',
        },
        {
          question: 'How is industrial estimating different from commercial estimating?',
          answer: 'Industrial estimating involves specialized equipment, process systems, and stricter regulatory and safety compliance than commercial estimating, which focuses more on architectural finishes and occupant comfort. Industrial projects also typically carry larger budgets and more complex, capital-intensive systems.',
        },
        {
          question: 'Who uses your industrial estimating services?',
          answer: 'Our industrial estimating services support EPC contractors, facility owners, engineering firms, financial investors, and joint venture partners planning or bidding on industrial construction projects.',
        },
      ],
      highlightSection: {
        heading: 'Industries We Estimate For',
        body: [
          '\u2022 Chemical & Petrochemical: process units, tank farms, and specialized piping systems',
          '\u2022 Mining & Metals: processing facilities, conveyance systems, and heavy-duty infrastructure',
          '\u2022 Oil & Gas: refineries, processing units, and pipeline-adjacent facilities',
          '\u2022 Marine & Drill Platforms: offshore and marine-rated structures and equipment',
          '\u2022 Pharmaceutical Plants: cleanroom construction and regulatory-compliant systems',
          '\u2022 Food Ingredients & Biofuels: processing lines and specialized production equipment',
          '\u2022 Hydrocarbon Processing & Refining: large-scale process systems and safety-critical infrastructure',
          '\u2022 Polymers & Fertilizers: chemical processing and specialized material handling',
          '\u2022 Paper & Pulp: heavy industrial processing facilities',
          '\u2022 Refrigeration & Packing: cold-chain and packaging-line infrastructure',
        ],
      },
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
