'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePin } from '../PinContext';
import dynamic from 'next/dynamic';

const StaggeredMenu = dynamic(() => import('@/src/components/ui/StaggeredMenu'), { ssr: false });

const menuItems = [
  { label: 'Blogs', ariaLabel: 'Read our blog', link: '/blog' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Projects', ariaLabel: 'View our projects', link: '/projects' },
  { label: 'About Us', ariaLabel: 'Learn about us', link: '/about-us' },
  { label: 'Contact', ariaLabel: 'Contact us', link: '/contact-us' },
  { label: 'Calculator', ariaLabel: 'Estimate costs', link: '/calculator' }
];

const socialItems = [
  // { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'Facebook', link: 'https://www.facebook.com/theaceservicesllc/' },
  { label: 'Instagram', link: 'https://www.instagram.com/aceservicesllc/' },
  { label: 'LinkedIn', link: 'https://www.linkedin.com/company/aceservicesllc/' }
];


export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const { isPinned } = usePin();

  /* navScrolled: always true off homepage (solid bg), toggles by scroll on homepage */
  const [navScrolled, setNavScrolled] = useState(!isHome);

  /* overHero: true while the fixed nav still overlaps the hero section (white text).
     False on any other page or once the hero has scrolled past the nav (primary text). */
  const [overHero, setOverHero] = useState(isHome);

  /* Track scroll state — transparent at top, glass bg on any scroll.
     Off-homepage, the nav always has a solid white bg so links must stay dark.
     Re-syncs on isHome change (client-side nav between pages does not remount). */
  useEffect(() => {
    function onScroll() {
      setNavScrolled(!isHome || window.scrollY > 10);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  /* Detect whether the nav is over the hero section via IntersectionObserver.
     The hero is dynamically imported, so retry until #hero-top mounts.
     rootMargin shrinks the viewport by the nav height: the nav is "over the hero"
     as long as any part of the hero still extends below the nav's bottom edge. */
  useEffect(() => {
    if (!isHome) {
      setOverHero(false);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let raf = 0;

    const observe = () => {
      observer?.disconnect();
      const heroEl = document.getElementById('hero-top');
      if (!heroEl) {
        raf = requestAnimationFrame(observe);
        return;
      }
      const navHeight = navRef.current?.offsetHeight ?? 64;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => setOverHero(entry.isIntersecting));
        },
        { root: null, rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 }
      );
      observer.observe(heroEl);
    };

    observe();

    const onResize = () => observe();
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, [isHome]);

  const PAGE_LINKS = [
  { href: '/blog', label: 'BLOG', shortLabel: 'Blog' },
  { href: '/about-us', label: 'ABOUT', shortLabel: 'About' },
  { href: '/services', label: 'SERVICES', shortLabel: 'Services' },
  { href: '/contact-us', label: 'CONTACT', shortLabel: 'Contact' },
  { href: '/projects', label: 'PROJECTS', shortLabel: 'Projects' },
  { href: '/testimonials', label: 'TESTIMONIALS', shortLabel: 'Testimonials' },
  { href: '/calculator', label: 'CALCULATOR', shortLabel: 'Calculator' },
]; 

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed z-50 flex justify-between items-center px-4 md:px-6 py-3 transition-all duration-500 top-0 left-0 w-full rounded-none h-16 md:h-22  ${
          !isHome
            ? 'bg-white border-b border-primary shadow-sm'
            : navScrolled
              ? 'bg-white/20 backdrop-blur-3xl border shadow-2xl shadow-black/5 ring-1 ring-inset border-transparent border-b-primary ring-transparent'
              : 'bg-transparent'
        } ${
          isPinned ? '-translate-y-full' : 'translate-y-0 '
        }`}
        id="main-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={`flex items-center pl-2 md:pl-10 gap-2 overflow-hidden transition-colors duration-500 ${navScrolled ? 'text-on-background' : 'text-white'}`}
        >
          {/* LOGO img */}
          <img
            src="/aceLogo.png"
            alt="The Ace Services logo"
            width={80}
            height={30}
            className='h-10 md:h-16 w-auto'
          />
{/* LOGO text */}
          <span className={`font-mono text-xl md:text-3xl font-thin tracking-tight whitespace-nowrap ${overHero ? 'text-white' : 'text-primary'}`}>
            THE 
            <span className='font-black'>ACE</span>
            SERVICES
          </span>
        </Link>

        {/* Desktop nav — always dark text */}
        <div className="hidden desktop-nav:flex items-center gap-6 text-2xl">
          {/* Page links */}
          <div className="flex items-center gap-5 pr-10">
            {PAGE_LINKS.map(({ href, label }) => {
              const isCalculator = href === '/calculator';
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    isCalculator
                      ? `font-mono text-lg font-bold uppercase tracking-wider px-5 py-2 border-2 transition-all duration-500 bracket-corners ${
                          isActive(href)
                            ? 'border-primary bg-primary text-white'
                            : navScrolled || isPinned
                              ? 'border-primary bg-primary text-white hover:bg-transparent hover:text-primary'
                              : 'border-white bg-transparent text-white hover:bg-primary hover:border-primary'
                        }`
                      : `font-mono text-base font-bold tracking-widest pb-0.5 transition-colors duration-500 ${
                          isActive(href)
                            ? overHero
                              ? 'text-white'
                              : 'text-primary'
                            : overHero
                              ? 'text-white hover:text-primary'
                              : 'text-primary hover:text-[#E55A00]'
                        }`
                  }
                >
                  {label}
                  {isActive(href) && !isCalculator && (
                    <span className="block w-full h-px bg-primary mt-0.5" aria-hidden="true" />
                  )}
                </Link>
              );
            })}

          </div>

        </div>
      </nav>

      {/* StaggeredMenu — always mounted, self-contained open/close via its own toggle */}
      <StaggeredMenu
        position="right"
        isFixed
        className="desktop-nav:hidden"
        items={menuItems as any}
        socialItems={socialItems as any}
        displaySocials
        displayItemNumbering={true}
        logoUrl="/aceLogo.png"
        // menuButtonColor={navScrolled ? '#0A0A0A' : '#ffffff'}
        menuButtonColor={overHero ? '#ffffff' : '#FF6B00'}
        openMenuButtonColor={'#FF6B00'}
        changeMenuColorOnOpen={true}
        colors={['#FF6B00', '#CC5500']}
        accentColor="#FF6B00"
      />
    </>
  );
}
