import { useState } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

interface NavProps {
  navScrolled: boolean;
  onAnchorClick: (id: string) => void;
}

export default function Nav({ navScrolled, onAnchorClick }: NavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHome = typeof window !== 'undefined' && window.location.pathname === '/';

  const handleNav = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      onAnchorClick(id);
    } else {
      window.location.href = '/#' + id;
    }
  };

  const goTo = (path: string) => {
    setMobileMenuOpen(false);
    window.location.href = path;
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 py-4 transition-all duration-300 ${
          navScrolled
            ? 'bg-surface/95 backdrop-blur-md border-b-2 border-primary shadow-sm'
            : 'bg-transparent border-b border-blueprint-line/40'
        }`}
        id="main-nav"
      >
        <div
          onClick={() => handleNav('hero-top')}
          className="font-space text-2xl font-bold tracking-tighter text-on-background cursor-pointer select-none flex items-center gap-2"
        >
          <div className="w-5 h-5 bg-primary rounded-none p-0.5 flex items-center justify-center">
            <span className="font-mono text-[10px] text-white">A</span>
          </div>
          ACE SERVICES
        </div>

        <div className="hidden md:flex space-x-8 items-center">
          {isHome && (<>
            <button type="button" onClick={() => handleNav('solutions')} className="link-underline text-on-surface-variant font-mono text-[10px] font-bold tracking-wide pb-0.5">
              SOLUTIONS
            </button>
            <button type="button" onClick={() => handleNav('projects')} className="link-underline text-on-surface-variant font-mono text-[10px] font-bold tracking-wide pb-0.5">
              PROJECTS
            </button>
            <button type="button" onClick={() => handleNav('process')} className="link-underline text-on-surface-variant font-mono text-[10px] font-bold tracking-wide pb-0.5">
              METHODOLOGY
            </button>
            <button type="button" onClick={() => handleNav('about')} className="link-underline text-on-surface-variant font-mono text-[10px] font-bold tracking-wide pb-0.5">
              ABOUT
            </button>
          </>)}
          <button
            onClick={() => goTo('/calculator')}
            className={`font-mono text-[11px] font-bold px-5 py-2.5 bracket-corners hover-brackets transition-transform duration-100 uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${
              typeof window !== 'undefined' && window.location.pathname === '/calculator'
                ? 'bg-primary/20 text-primary border-2 border-primary'
                : 'bg-primary text-white'
            }`}
          >
            <span className="hidden md:inline">CALCULATOR</span>
            <span className="md:hidden">Calculator</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-on-background p-1.5 focus:outline-none"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] bg-surface z-40 flex flex-col p-6 space-y-4 border-b border-blueprint-line md:hidden shadow-lg">
          <button onClick={() => handleNav('solutions')} className="text-left py-2 font-mono text-sm tracking-wider hover:text-primary border-b border-blueprint-line/30">
            [SOL_X] PORTFOLIO SERVICES
          </button>
          <button onClick={() => handleNav('projects')} className="text-left py-2 font-mono text-sm tracking-wider hover:text-primary border-b border-blueprint-line/30">
            [PROJ_Y] EXECUTED WORK
          </button>
          <button onClick={() => handleNav('process')} className="text-left py-2 font-mono text-sm tracking-wider hover:text-primary border-b border-blueprint-line/30">
            [PROC_Z] FLOW & STEPS
          </button>
          <button onClick={() => handleNav('about')} className="text-left py-2 font-mono text-sm tracking-wider hover:text-primary border-b border-blueprint-line/30">
            [CORP_W] BIO DETAILS
          </button>
          <button
            onClick={() => goTo('/')}
            className="bg-primary/20 text-primary border border-primary font-mono text-xs font-bold py-3 text-center uppercase tracking-widest block bracket-corners"
          >
            HOME
          </button>
          <button
            onClick={() => goTo('/calculator')}
            className="bg-primary text-white font-mono text-xs font-bold py-3 text-center uppercase tracking-widest block bracket-corners"
          >
            CALCULATOR
          </button>
        </div>
      )}
    </>
  );
}
