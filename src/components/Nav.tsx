'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { usePin } from '../PinContext';

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navHeight, setNavHeight] = useState(80);
  const [navScrolled, setNavScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const { isPinned } = usePin();

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
    function measureNavBottom() {
      if (navRef.current) {
        setNavHeight(navRef.current.getBoundingClientRect().bottom);
      }
    }
    measureNavBottom();
    window.addEventListener('resize', measureNavBottom);
    return () => window.removeEventListener('resize', measureNavBottom);
  }, []);

  const handleNav = (id: string) => {
    setMobileMenuOpen(false);
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Store target section, then client-navigate to homepage
      sessionStorage.setItem('scrollToSection', id);
      router.push('/');
    }
  };

  const PAGE_LINKS = [
  { href: '/blog', label: 'BLOG', shortLabel: 'Blog' },
  { href: '/pricing', label: 'PRICING', shortLabel: 'Pricing' },
  { href: '/projects', label: 'PROJECTS', shortLabel: 'Projects' },
  { href: '/testimonials', label: 'TESTIMONIALS', shortLabel: 'Testimonials' },
  { href: '/calculator', label: 'CALCULATOR', shortLabel: 'Calculator' },
]; 

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed z-50 flex justify-between items-center px-4 md:px-6 py-3 transition-all duration-500 bg-white/20 backdrop-blur-3xl border shadow-2xl shadow-black/5 ring-1 ring-inset top-0 left-0 w-full rounded-none border-transparent ring-transparent h-24 ${
          isPinned ? '-translate-y-full' : 'translate-y-0'
        }`}
        id="main-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-mono text-3xl tracking-wide min-w-[400px] font-medium text-on-background cursor-pointer select-none flex items-center pl-10 gap-2"
        >
          <img
            src="/aceLogo.png"
            alt=""
            className='h-18 w-auto'
          />

          ACE SERVICES
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6 text-2xl">
          {/* Homepage section anchor links — always visible */}
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => handleNav('solutions')} className="link-underline text-on-surface-variant font-mono text-xs font-bold tracking-wide pb-0.5">
              SOLUTIONS
            </button>
            <button type="button" onClick={() => handleNav('about')} className="link-underline text-on-surface-variant font-mono text-xs font-bold tracking-wide pb-0.5">
              ABOUT US
            </button>
            <button type="button" onClick={() => handleNav('contact')} className="link-underline text-on-surface-variant font-mono text-xs font-bold tracking-wide pb-0.5">
              CONTACT US
            </button>
          </div>

          {/* Divider between section links and page links */}
          <div className="w-px h-4 bg-blueprint-line/60" aria-hidden="true" />

          {/* Page links */}
          <div className="flex items-center gap-5 pr-10">
            {PAGE_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`font-mono text-xs font-bold tracking-wide pb-0.5 transition-colors duration-150 ${
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
          {/* Section links (mobile) — always visible */}
          <div className="space-y-0">
            <p className="font-mono text-[10px] text-on-surface-variant/60 tracking-widest uppercase mb-1">
              Sections
            </p>
            <button onClick={() => handleNav('solutions')} className="text-left py-2 font-mono text-sm tracking-wider hover:text-primary border-b border-blueprint-line/30 w-full">
              [SOL_X] PORTFOLIO SERVICES
            </button>
            <button onClick={() => handleNav('about')} className="text-left py-2 font-mono text-sm tracking-wider hover:text-primary border-b border-blueprint-line/30 w-full">
              [CORP_W] BIO DETAILS
            </button>
            <button onClick={() => handleNav('contact')} className="text-left py-2 font-mono text-sm tracking-wider hover:text-primary border-b border-blueprint-line/30 w-full">
              [CONTACT] GET IN TOUCH
            </button>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-blueprint-line/40 my-3" aria-hidden="true" />

          {/* Page links (mobile) */}
          <div className="space-y-0">
            <p className="font-mono text-[10px] text-on-surface-variant/60 tracking-widest uppercase mb-1">
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
                  <span className="ml-2 text-[10px] tracking-widest">(ACTIVE)</span>
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
              className="bg-primary/20 text-primary border border-primary font-mono text-sm font-bold py-3 text-center uppercase tracking-widest block bracket-corners"
            >
              HOME
            </Link>
            <Link
              href="/calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-primary text-white font-mono text-sm font-bold py-3 text-center uppercase tracking-widest block bracket-corners"
            >
              CALCULATOR
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
