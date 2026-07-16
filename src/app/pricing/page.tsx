import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Layers,
  Calculator,
  FileCheck,
  CalendarClock,
  Search,
  ArrowRight,
  Check,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing',
  description:
    'Transparent pricing for ACE SERVICES pre-construction estimation. Budgetary allocations for material takeoffs, AACE Class 3 cost estimates, permit sets, project scheduling, and feasibility studies.',
  alternates: {
    canonical: 'https://ace2-six.vercel.app/pricing',
  },
  openGraph: {
    title: 'Pricing — ACE SERVICES',
    description:
      'Transparent pricing for pre-construction estimation services. Material takeoffs, cost estimates, permit sets, scheduling, and feasibility studies.',
    url: 'https://ace2-six.vercel.app/pricing',
  },
};

/* ── Service data ───────────────────────────────────────────── */

const services = [
  {
    id: 'SVC_MTO',
    icon: Layers,
    name: 'Material Takeoff',
    tagline: 'Quantity Surveyor Services',
    description:
      'Exhaustive computational dissection of blueprints into division-wise material volume counts. CSI MasterFormat pricing schedules matched to regional rates with scrap multiplier calculations.',
    features: [
      'Full CSI MasterFormat division breakdown',
      'Regional material rate calibration',
      'Scrap & waste multiplier calculations',
      'Excel & PDF delivery formats',
    ],
    startingPrice: '$1,200',
    priceUnit: 'per project',
    turnaround: '3–5 business days',
    cta: 'Get Quote',
  },
  {
    id: 'SVC_CES',
    icon: Calculator,
    name: 'Cost Estimation',
    tagline: 'AACE Class 3 Standard',
    description:
      'Budgetary control level estimates meeting AACE International Class 3 standards with ±10% to ±20% accuracy. Designed for project funding authorization and contractor bid strategy.',
    features: [
      'AACE Class 3 certified accuracy',
      'Localized cost multiplier databases',
      'Bid optimization strategy',
      'Dual-stage QA peer review',
    ],
    startingPrice: '$2,500',
    priceUnit: 'per project',
    turnaround: '5–7 business days',
    cta: 'Get Quote',
    featured: true,
  },
  {
    id: 'SVC_PRM',
    icon: FileCheck,
    name: 'Permit Set Preparation',
    tagline: 'Municipal Submission Package',
    description:
      'High-precision architectural and structural drawings formatted for municipal plan review. Double-verified against local zoning codes and building ordinances.',
    features: [
      'Municipal code compliance check',
      'Architectural & structural sheets',
      '3D rendering add-on available',
      'Revision support included',
    ],
    startingPrice: '$3,800',
    priceUnit: 'per project',
    turnaround: '7–10 business days',
    cta: 'Get Quote',
  },
  {
    id: 'SVC_SCH',
    icon: CalendarClock,
    name: 'Project Scheduling',
    tagline: 'Lifecycle Control',
    description:
      'Dynamic Gantt workflows, critical path mapping, and logistics coordination. Continuous budget burn-rate analytics to prevent unforeseen change-order financial leakages.',
    features: [
      'Critical path method (CPM) scheduling',
      'Dynamic Gantt chart delivery',
      'Burn-rate monitoring setup',
      'Resource allocation planning',
    ],
    startingPrice: '$1,800',
    priceUnit: 'per project',
    turnaround: '3–5 business days',
    cta: 'Get Quote',
  },
  {
    id: 'SVC_FS',
    icon: Search,
    name: 'Feasibility Studies',
    tagline: 'Pre-Construction Analysis',
    description:
      'Comprehensive pre-construction analysis evaluating site conditions, regulatory landscape, cost viability, and market positioning to de-risk your investment before breaking ground.',
    features: [
      'Site & regulatory assessment',
      'Cost-benefit analysis',
      'Market positioning report',
      'Risk mitigation strategy',
    ],
    startingPrice: '$4,500',
    priceUnit: 'per project',
    turnaround: '10–14 business days',
    cta: 'Get Quote',
  },
];

/* ── Page component ─────────────────────────────────────────── */

export default function PricingPage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-background pt-32 pb-20 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)] overflow-hidden">
        {/* Blueprint grid background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,107,0,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,0,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <span className="font-mono text-sm text-primary font-bold tracking-widest block mb-4">
            [PRICING_MODULE_v2]
          </span>
          <h1 className="font-[family-name:var(--font-space)] text-5xl md:text-7xl font-extrabold text-on-background tracking-tighter leading-tight">
            Pre-Construction{' '}
            <span className="text-primary">Service Tiers</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto font-sans text-lg text-on-surface-variant leading-relaxed">
            Budgetary allocations for professional estimation, quantity surveying,
            and pre-construction advisory. All pricing is project-dependent — the
            figures below represent starting points for typical scope categories.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-6 font-mono text-xs text-on-surface-variant tracking-wider">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              AACE CERTIFIED
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              DUAL-STAGE QA
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              35 STATES SERVED
            </span>
          </div>
        </div>
      </section>

      {/* ── Pricing Cards ─────────────────────────────────────── */}
      <section className="bg-background pb-24 px-[var(--spacing-margin-mobile)] md:px-[var(--spacing-margin-desktop)]">
        <div className="max-w-7xl mx-auto">
          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className={[
                    'group relative flex flex-col p-6 transition-all duration-300',
                    'border border-surface-variant bg-surface hover:border-primary/50',
                    'hover:shadow-[0_0_30px_rgba(255,107,0,0.06)]',
                    service.featured
                      ? 'border-primary/40 ring-1 ring-primary/20'
                      : '',
                  ].join(' ')}
                >
                  {/* Bracket corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary/40 group-hover:border-primary group-hover:w-3 group-hover:h-3 transition-all duration-300" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary/40 group-hover:border-primary group-hover:w-3 group-hover:h-3 transition-all duration-300" />

                  {/* Featured badge */}
                  {service.featured && (
                    <div className="absolute -top-px right-6 bg-primary px-3 py-1">
                      <span className="font-mono text-xs font-bold text-white tracking-widest">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  {/* System ID + Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-xs text-primary font-bold tracking-widest">
                      [{service.id}]
                    </span>
                    <div className="flex items-center justify-center w-9 h-9 border border-surface-variant bg-background bracket-corners group-hover:border-primary transition-colors">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                  </div>

                  {/* Title */}
                  <span className="font-mono text-xs text-on-surface-variant tracking-widest block mb-1">
                    {service.tagline}
                  </span>
                  <h2 className="font-[family-name:var(--font-space)] font-bold text-xl text-on-background group-hover:text-primary transition-colors leading-tight">
                    {service.name}
                  </h2>

                  {/* Description */}
                  <p className="mt-3 font-sans text-base text-on-surface-variant leading-relaxed flex-grow">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="mt-5 space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="font-sans text-sm text-on-surface leading-snug">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Divider */}
                  <div className="mt-5 border-t border-surface-variant" />

                  {/* Price + CTA */}
                  <div className="mt-5 flex items-end justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-[family-name:var(--font-space)] text-3xl font-extrabold text-on-background">
                          {service.startingPrice}
                        </span>
                        <span className="font-sans text-xs text-on-surface-variant">
                          {service.priceUnit}
                        </span>
                      </div>
                      <span className="font-mono text-xs text-on-surface-variant tracking-wider">
                        {service.turnaround}
                      </span>
                    </div>
                    <button
                      type="button"
                      className={[
                        'flex items-center gap-1.5 font-mono text-sm font-bold px-4 py-2.5 transition-all duration-200 uppercase tracking-wider',
                        service.featured
                          ? 'bg-primary text-white hover:bg-primary/90 shadow-[0_0_15px_rgba(255,107,0,0.3)]'
                          : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-white',
                      ].join(' ')}
                    >
                      {service.cta}
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Bottom Note ─────────────────────────────────── */}
          <div className="mt-12 border border-surface-variant bg-gray-50 p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex-1">
                <span className="font-mono text-xs text-primary font-bold tracking-widest block mb-2">
                  [QUOTE_PROTOCOL]
                </span>
                <h3 className="font-[family-name:var(--font-space)] font-bold text-lg text-on-background mb-1">
                  Need a custom scope?
                </h3>
                <p className="font-sans text-base text-on-surface-variant leading-relaxed max-w-lg">
                  Every project is unique. The prices above are starting points for
                  standard scope categories. Contact us for a detailed quote tailored
                  to your project&apos;s square footage, complexity, and documentation
                  quality.
                </p>
              </div>
              <Link
                href="/#contact"
                className="flex items-center gap-2 bg-primary text-white font-mono text-sm font-bold px-6 py-3 uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(255,107,0,0.2)] flex-shrink-0 bracket-corners hover-brackets"
              >
                Request Custom Quote
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* ── FAQ Teaser ──────────────────────────────────── */}
          <div className="mt-12 text-center">
            <p className="font-sans text-base text-on-surface-variant">
              Have questions? See our{' '}
              <Link
                href="/#faq"
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
              >
                FAQ section
              </Link>{' '}
              or use the{' '}
              <Link
                href="/calculator"
                className="text-primary hover:text-primary/80 transition-colors underline underline-offset-2"
              >
                cost calculator
              </Link>{' '}
              for an instant preliminary estimate.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
