interface FooterProps {
  onAnchorClick?: (id: string) => void;
}

export default function Footer({ onAnchorClick }: FooterProps) {
  const handleClick = (id: string) => {
    if (onAnchorClick) {
      onAnchorClick(id);
    } else {
      window.location.hash = id;
    }
  };
  return (
    <footer className="bg-surface relative border-t border-blueprint-line bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-16">
          <div className="lg:col-span-5 space-y-6">
            <div className="font-space text-3xl font-extrabold tracking-tighter text-on-background">
              ACE SERVICES
            </div>
            <p className="font-sans text-sm text-on-surface-variant max-w-sm leading-relaxed font-semibold">
              Parametric estimating precision for general builders, civil engineers, and trade specialists nationwide. Eliminating manual error thresholds.
            </p>
            <div className="font-mono text-[9px] text-primary uppercase tracking-widest font-bold">
              [EST_SYS_CORE_V.2.5.0_ACTIVE]
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-primary tracking-wider font-bold">[NAVIGATION]</span>
              <button type="button" onClick={() => handleClick('solutions')} className="text-left font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors link-underline w-fit">SOLUTIONS</button>
              <button type="button" onClick={() => handleClick('projects')} className="text-left font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors link-underline w-fit">PROJECTS</button>
              <button type="button" onClick={() => handleClick('process')} className="text-left font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors link-underline w-fit">PROCESS</button>
              <button type="button" onClick={() => handleClick('about')} className="text-left font-sans text-xs font-semibold text-on-surface-variant hover:text-primary transition-colors link-underline w-fit">ABOUT</button>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-primary tracking-wider font-bold">[STANDARDS]</span>
              <span className="font-sans text-xs text-on-surface-variant font-semibold">CSI MASTERFORMAT</span>
              <span className="font-sans text-xs text-on-surface-variant font-semibold">AACE CLASS 3 INDEX</span>
              <span className="font-sans text-xs text-on-surface-variant font-semibold">ISO 9001 METRICS</span>
            </div>

            <div className="flex flex-col gap-4">
              <span className="font-mono text-[10px] text-primary tracking-wider font-bold">[COMMUNICATION]</span>
              <span className="font-sans text-xs text-on-surface-variant font-semibold">est-control@ace-services.io</span>
              <span className="font-sans text-xs text-on-surface-variant font-semibold">+1 (800) 555-QS77</span>
              <span className="font-sans text-xs text-on-surface-variant font-semibold">Dallas Head Office</span>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-blueprint-line flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-mono text-xs text-on-surface-variant font-bold">
            &copy;2026 ACE SERVICES. ALL CODES SECURED.
          </div>
          <div className="font-mono text-[9px] text-on-surface-variant opacity-60">
            LAT: 32.7767&deg; N | LONG: 96.7970&deg; W | BLUEPRINT RECT_X_COORD
          </div>
        </div>
      </div>
    </footer>
  );
}
