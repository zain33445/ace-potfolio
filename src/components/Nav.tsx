'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronRight } from 'lucide-react';

const PAGE_LINKS = [
  { href: '/blog', label: 'BLOG', shortLabel: 'Blog' },
  { href: '/pricing', label: 'PRICING', shortLabel: 'Pricing' },
  { href: '/projects', label: 'PROJECTS', shortLabel: 'Projects' },
  { href: '/testimonials', label: 'TESTIMONIALS', shortLabel: 'Testimonials' },
];

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(60);
  const [navScrolled, setNavScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';

  /* Track scroll state via IntersectionObserver on the hero section.
     Replaces the old FullscreenScroller's currentIndex > 0 check, with
     the benefit of working on manual scroll too. */
  useEffect(() => {
    if (!isHome) return;
    const el = document.getElementById('hero-top');
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setNavScrolled(!entry.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [isHome]);

  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }
    const onResize = () => {
      if (navRef.current) setNavHeight(navRef.current.offsetHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handleNav = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate to home page, then scroll to the section
      router.push('/#' + id);
    }
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 py-4 transition-all duration-300 bg-surface border-b-2 ${
          navScrolled ? 'border-primary shadow-sm' : 'border-blueprint-line/40'
        }`}
        id="main-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-space text-2xl font-bold tracking-tighter text-on-background cursor-pointer select-none flex items-center gap-2"
        >
          <div className="w-5 h-5 bg-primary rounded-none p-0.5 flex items-center justify-center">
            <span className="font-mono text-[10px] text-white">A</span>
          </div>
          ACE SERVICES
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {/* Homepage section anchor links */}
          {isHome && (
            <div className="flex items-center gap-6">
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
            </div>
          )}

          {/* Divider between section links and page links */}
          {isHome && (
            <div className="w-px h-4 bg-blueprint-line/60" aria-hidden="true" />
          )}

          {/* Page links */}
          <div className="flex items-center gap-5">
            {PAGE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-mono text-[10px] font-bold tracking-wide pb-0.5 transition-colors duration-150 ${
                  isActive(href)
                    ? 'text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {label}
                {isActive(href) && (
                  <span className="block w-full h-px bg-primary mt-0.5" aria-hidden="true" />
                )}
              </Link>
            ))}
          </div>

          {/* Calculator CTA */}
          <Link
            href="/calculator"
            className={`font-mono text-[11px] font-bold px-5 py-2.5 bracket-corners hover-brackets transition-transform duration-100 uppercase tracking-wider shadow-sm flex items-center gap-1.5 ${
              isActive('/calculator')
                ? 'bg-primary/20 text-primary border-2 border-primary'
                : 'bg-primary text-white'
            }`}
          >
            <span>CALCULATOR</span>
            <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-on-background p-1.5 focus:outline-none"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          style={{ top: navHeight }}
          className="fixed left-0 right-0 bottom-0 bg-surface z-40 flex flex-col p-6 overflow-y-auto border-b border-blueprint-line md:hidden shadow-lg"
          role="menu"
        >
          {/* Homepage section links (mobile) */}
          {isHome && (
            <div className="space-y-0">
              <p className="font-mono text-[9px] text-on-surface-variant/60 tracking-widest uppercase mb-1">
                Sections
              </p>
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
            </div>
          )}

          {/* Divider */}
          {isHome && <div className="w-full h-px bg-blueprint-line/40 my-3" aria-hidden="true" />}

          {/* Page links (mobile) */}
          <div className="space-y-0">
            <p className="font-mono text-[9px] text-on-surface-variant/60 tracking-widest uppercase mb-1">
              Pages
            </p>
            {PAGE_LINKS.map(({ href, shortLabel }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block text-left py-2 font-mono text-sm tracking-wider border-b border-blueprint-line/30 transition-colors ${
                  isActive(href) ? 'text-primary' : 'hover:text-primary'
                }`}
              >
                {shortLabel}
                {isActive(href) && (
                  <span className="ml-2 text-[9px] tracking-widest">(ACTIVE)</span>
                )}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-blueprint-line/40 my-3" aria-hidden="true" />

          {/* Action buttons */}
          <div className="space-y-3 pt-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary/20 text-primary border border-primary font-mono text-xs font-bold py-3 text-center uppercase tracking-widest block bracket-corners"
            >
              HOME
            </Link>
            <Link
              href="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary text-white font-mono text-xs font-bold py-3 text-center uppercase tracking-widest block bracket-corners"
            >
              CALCULATOR
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
