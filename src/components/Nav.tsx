'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { usePin } from '../PinContext';
import StaggeredMenu from '@/src/components/ui/StaggeredMenu';

const menuItems = [
  { label: 'Contact', ariaLabel: 'Contact us', link: '/#contact' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/#solutions' },
  { label: 'Projects', ariaLabel: 'View our projects', link: '/projects' },
  { label: 'Blog', ariaLabel: 'Read our blog', link: '/blog' },
  { label: 'Calculator', ariaLabel: 'Estimate costs', link: '/calculator' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];


export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === '/';
  const { isPinned } = usePin();

  /* navScrolled: always true off homepage (solid bg), toggles by scroll on homepage */
  const [navScrolled, setNavScrolled] = useState(!isHome);

  /* Track scroll state — transparent at top, glass bg on any scroll */
  useEffect(() => {
    if (!isHome) return;
    function onScroll() {
      setNavScrolled(window.scrollY > 10);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  const handleNav = (id: string) => {
    if (isHome) {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Store target section, then client-navigate to homepage
      sessionStorage.setItem('scrollToSection', id);
      router.push('/');
    }
  };

  const PAGE_LINKS = [
  { href: '/about', label: 'ABOUT', shortLabel: 'About' },
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
        className={`fixed z-50 flex justify-between items-center px-4 md:px-6 py-3 transition-all duration-500 top-0 left-0 w-full rounded-none h-16 md:h-24 ${
          navScrolled ? 'bg-white/20 backdrop-blur-3xl border shadow-2xl shadow-black/5 ring-1 ring-inset border-transparent ring-transparent' : 'bg-transparent'
        } ${
          isPinned ? '-translate-y-full' : 'translate-y-0'
        }`}
        id="main-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={`font-mono text-xl md:text-3xl tracking-wide font-medium cursor-pointer select-none flex items-center pl-2 md:pl-10 gap-2 overflow-hidden transition-colors duration-500 md:text-on-background ${navScrolled ? 'text-on-background' : 'text-white'}`}
        >
          <img
            src="/aceLogo.png"
            alt=""
            className='h-10 md:h-18 w-auto'
          />

          ACE SERVICES
        </Link>

        {/* Desktop nav — always dark text */}
        <div className="hidden md:flex items-center gap-6 text-2xl">
          {/* Homepage section anchor links — always visible */}
          <div className="flex items-center gap-6">
            <button type="button" onClick={() => handleNav('solutions')} className="link-underline font-mono text-sm font-bold tracking-widest pb-0.5 transition-colors duration-500 text-on-surface-variant">
              SOLUTIONS
            </button>
            <button type="button" onClick={() => handleNav('contact')} className="link-underline font-mono text-sm font-bold tracking-widest pb-0.5 transition-colors duration-500 text-on-surface-variant">
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
                className={`font-mono text-sm font-bold tracking-widest pb-0.5 transition-colors duration-500 ${
                  isActive(href) ? 'text-primary' : 'text-on-surface-variant hover:text-primary'
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
      </nav>

      {/* StaggeredMenu — always mounted, self-contained open/close via its own toggle */}
      <StaggeredMenu
        position="right"
        isFixed
        className=""
        items={menuItems as any}
        socialItems={socialItems as any}
        displaySocials
        displayItemNumbering={true}
        logoUrl="/aceLogo.png"
        menuButtonColor={navScrolled ? '#0A0A0A' : '#ffffff'}
        openMenuButtonColor="#0A0A0A"
        changeMenuColorOnOpen={true}
        colors={['#FF6B00', '#CC5500']}
        accentColor="#FF6B00"
        onMenuOpen={() => console.log('Menu opened')}
        onMenuClose={() => console.log('Menu closed')}
      />
    </>
  );
}
