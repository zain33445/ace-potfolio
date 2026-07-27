import Reveal from '../../../components/Reveal';

const CLIENTS = [
  'Saunders General Builders',
  'Apex Electrical Contractors',
  'Turner Construction Co.',
  'Clark Builders Group',
  'DPR Construction',
  'Whiting-Turner',
  'Gilbane Building Co.',
  'PCL Construction',
];

export default function TrustSignalsSection() {
  return (
    <div className="py-18 bg-background border-b border-blueprint-line relative overflow-hidden">
      <Reveal type="fadeUp">
        {/* ─── Client Logo Strip ─── */}
        <div className="border-b border-blueprint-line pb-14 mb-14">
          <div className="container mx-auto max-w-7xl px-6 md:px-16">
            <p className="font-mono text-xs text-primary font-bold tracking-widest text-center mb-8">
              TRUSTED BY GENERAL CONTRACTORS &amp; SUBCONTRACTORS NATIONWIDE
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {CLIENTS.map((name) => (
                <div
                  key={name}
                  className="flex items-center justify-center h-14 px-4 border border-blueprint-line bg-surface/50 bracket-corners"
                >
                  <span className="font-space font-bold text-sm text-on-surface-variant/60 uppercase tracking-wider text-center leading-tight">
                    {name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Comparison: In-House vs ACE ─── */}
        <div className="container mx-auto max-w-5xl px-6 md:px-16">
          <div className="text-center space-y-3 mb-10">
            <span className="font-mono text-sm text-primary font-bold block">
              [COST_COMPARISON]
            </span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tight">
              In-House Estimating vs. The ACE Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* In-House */}
            <div className="border border-blueprint-line bg-surface p-6 bracket-corners opacity-70">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 border border-blueprint-line flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-on-surface-variant">✕</span>
                </div>
                <h3 className="font-space font-bold text-lg text-on-background">
                  In-House Estimating
                </h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  '3–5 day turnaround on takeoffs',
                  'Full-time estimator salary: $75k–$120k/yr',
                  'Limited to 1–2 bids per week',
                  'Software license fees ($3k–$8k/yr)',
                  'No built-in QA / peer review',
                  'Bid capacity shrinks during PTO or sick leave',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 font-sans text-sm text-on-surface-variant">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ACE Services */}
            <div className="border-2 border-primary bg-surface p-6 bracket-corners relative">
              <div className="absolute -top-3 left-4 bg-primary px-3 py-0.5">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Recommended
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="w-8 h-8 border-2 border-primary flex items-center justify-center bg-primary/10">
                  <span className="font-mono text-sm font-bold text-primary">✓</span>
                </div>
                <h3 className="font-space font-bold text-lg text-primary">
                  The ACE Services
                </h3>
              </div>
              <ul className="space-y-2.5">
                {[
                  '24–48 hour turnaround guaranteed',
                  'Flat per-project fee — no salary overhead',
                  'Unlimited bid volume capacity',
                  'We use PlanSwift & Bluebeam — no license cost to you',
                  'Mandatory two-stage QA per project',
                  'Scales instantly with your bid pipeline',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 font-sans text-sm text-on-background font-medium">
                    <span className="text-primary flex-shrink-0 mt-0.5">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
