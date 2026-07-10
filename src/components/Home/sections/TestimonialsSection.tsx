import Reveal from '../../../components/Reveal';

export default function TestimonialsSection() {
  return (
    <div id="testimonials" className="py-24 px-6 md:px-16 border-b border-blueprint-line bg-surface relative">
      <Reveal type="fadeUp">
        <div className="absolute inset-0 bg-[radial-gradient(#f1f5f9_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs text-primary font-bold block">[VERIFIED_CLIENT_COMMUNICATION]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">Trusted by the Industry Elite</h2>
            <p className="font-sans text-sm text-on-surface-variant font-medium">Read how general contractors and trade subcontractors deploy our takeoff schemas to save costs and lock in healthy margins.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="border border-blueprint-line bg-background p-8 bracket-corners hover:border-primary transition-colors flex flex-col justify-between relative group">
              <div className="absolute top-4 right-4 font-mono text-[8px] text-[#FF6B00] font-bold border border-[#FF6B00]/40 px-1.5 py-0.5 whitespace-nowrap">GENERAL CONTRACTOR AUDIT</div>
              <div className="space-y-6">
                <div className="text-3xl font-serif text-primary">&ldquo;</div>
                <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed font-semibold italic">The ACE Services changed our bidding strategy. Their use of PlanSwift and Bluebeam gave us the confidence to go after $10M+ commercial projects knowing our margins were protected.</p>
              </div>
              <div className="border-t border-dashed border-blueprint-line/60 pt-6 mt-8 flex justify-between items-center">
                <div>
                  <h4 className="font-space font-bold text-sm text-on-background">Saunders General Builders</h4>
                  <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Senior Estimating Advisor</p>
                </div>
                <div className="font-mono text-[9px] text-[#00A859] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A859]" /> VERIFIED BID WIN
                </div>
              </div>
            </div>
            <div className="border border-blueprint-line bg-background p-8 bracket-corners hover:border-primary transition-colors flex flex-col justify-between relative group">
              <div className="absolute top-4 right-4 font-mono text-[8px] text-[#FF6B00] font-bold border border-[#FF6B00]/40 px-1.5 py-0.5 whitespace-nowrap">SPECIALTY ELECT_IND_TAKEOFF</div>
              <div className="space-y-6">
                <div className="text-3xl font-serif text-primary">&ldquo;</div>
                <p className="font-sans text-sm md:text-base text-on-surface-variant leading-relaxed font-semibold italic">We used to spend weekends on takeoffs. Now, we send our blueprints to ACE and get back a professional PDF and Excel estimate that&rsquo;s ready to submit. The two-stage QA process gives us total peace of mind.</p>
              </div>
              <div className="border-t border-dashed border-blueprint-line/60 pt-6 mt-8 flex justify-between items-center">
                <div>
                  <h4 className="font-space font-bold text-sm text-on-background">Apex Electrical Contractors</h4>
                  <p className="font-mono text-[9px] text-on-surface-variant uppercase tracking-wider font-bold">Director of Operations</p>
                </div>
                <div className="font-mono text-[9px] text-[#00A859] flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00A859]" /> VERIFIED BID WIN
                </div>
              </div>
            </div>
          </div>
          <div className="border border-blueprint-line bg-primary text-white p-6 bracket-corners flex flex-col md:flex-row items-center justify-around gap-4 text-center select-none relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="space-y-1 relative z-10">
              <div className="font-mono text-[9px] text-[#FFDFCC] tracking-widest font-bold">SECURED PORTFOLIO CERTIFICATE</div>
              <div className="font-space font-bold text-lg md:text-xl">2,893+ Projects Delivered</div>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/20 relative z-10" />
            <div className="space-y-1 relative z-10">
              <div className="font-mono text-[9px] text-[#FFDFCC] tracking-widest font-bold">OPERATIONAL COVERAGE AREA</div>
              <div className="font-space font-bold text-lg md:text-xl">35 States Served</div>
            </div>
            <div className="hidden md:block w-px h-10 bg-white/20 relative z-10" />
            <div className="space-y-1 relative z-10">
              <div className="font-mono text-[9px] text-[#FFDFCC] tracking-widest font-bold">BID ACQUISITION PERFORMANCE</div>
              <div className="font-space font-bold text-lg md:text-xl">89% Win Rate</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
