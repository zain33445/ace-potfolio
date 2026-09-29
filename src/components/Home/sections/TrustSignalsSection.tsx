import { X, XCircle, CheckCircle2, ShieldCheck } from 'lucide-react';
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

        {/* ─── Comparison: In-House vs ACE ─── */}
        <div className="container mx-auto max-w-5xl px-6 md:px-16">
          <div className="text-center space-y-3 mb-10">
            <span className="font-mono text-sm text-primary font-bold block">
              Cost Comparison
            </span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tight">
              In-House Estimating vs. The ACE Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            {/* In-House */}
            <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200/80 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                  <X className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-slate-100 rounded-full text-slate-500">
                  The old way
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">
                In-House Estimating
              </h3>
              <ul className="space-y-3.5">
                {[
                  '3 to 5 day turnaround on takeoffs',
                  'Full-time estimator salary: $75k to $120k/yr',
                  'Limited to 1 to 2 bids per week',
                  'Software license fees ($3k to $8k/yr)',
                  'No built-in QA / peer review',
                  'Bid capacity shrinks during PTO or sick leave',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] text-slate-500">
                    <XCircle className="w-5 h-5 flex-shrink-0 text-slate-300" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* The ACE Services */}
            <div className="bg-[#FF6B00] text-white rounded-3xl p-8 md:p-10 shadow-xl shadow-[#FF6B00]/20 flex flex-col relative overflow-hidden group">
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/25 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
              <div className="relative flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-md">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-3 py-1 bg-white text-[#FF6B00] rounded-full">
                  Recommended
                </span>
              </div>
              <h3 className="relative text-2xl font-bold mb-6">
                The ACE Services
              </h3>
              <ul className="relative space-y-3.5">
                {[
                  '24 to 48 hour turnaround guaranteed',
                  'Flat per-project fee, no salary overhead',
                  'Unlimited bid volume capacity',
                  'We use PlanSwift & Bluebeam, no license cost to you',
                  'Mandatory two-stage QA per project',
                  'Scales instantly with your bid pipeline',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[15px] font-medium text-white">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
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
