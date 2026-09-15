'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePin } from '../PinContext';
import dynamic from 'next/dynamic';
import { SOCIAL_LINKS } from '@/src/data/social-links';

const StaggeredMenu = dynamic(() => import('@/src/components/ui/StaggeredMenu'), { ssr: false });

const menuItems = [
  { label: 'Blogs', ariaLabel: 'Read our blog', link: '/blog/' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services/' },
  { label: 'Projects', ariaLabel: 'View our projects', link: '/projects/' },
  { label: 'About Us', ariaLabel: 'Learn about us', link: '/about-us/' },
  { label: 'Contact', ariaLabel: 'Contact us', link: '/contact-us/' },
  { label: 'Calculator', ariaLabel: 'Estimate costs', link: '/calculator/' }
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

  /* Publish the nav pill's right content edge so the StaggeredMenu toggle — a
     fixed full-viewport overlay — can sit inside the pill instead of on the
     screen edge. Measured (not re-derived from the w-[95%]/lg:w-[75%] classes)
     because the pill centers within clientWidth while the overlay spans 100vw.
     The ResizeObserver also tracks the 700ms width transition, so the toggle
     travels with the pill rather than snapping at the end. */
  useEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const sync = () => {
      const rect = el.getBoundingClientRect();
      const padRight = parseFloat(getComputedStyle(el).paddingRight) || 0;
      document.documentElement.style.setProperty(
        '--nav-pill-right',
        `${Math.max(0, window.innerWidth - rect.right + padRight)}px`,
      );
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener('resize', sync);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', sync);
    };
  }, []);

  const PAGE_LINKS = [
  { href: '/blog/', label: 'BLOG', shortLabel: 'Blog' },
  { href: '/about-us/', label: 'ABOUT', shortLabel: 'About' },
  { href: '/services/', label: 'SERVICES', shortLabel: 'Services' },
  { href: '/contact-us/', label: 'CONTACT', shortLabel: 'Contact' },
  { href: '/projects/', label: 'PROJECTS', shortLabel: 'Projects' },
  { href: '/calculator/', label: 'CALCULATOR', shortLabel: 'Calculator' },
]; 

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav
  ref={navRef}
  className={`fixed z-50 flex justify-between lg:justify-around items-center
    px-4 md:px-6 py-3
    transition-[width,left,transform,background-color,box-shadow,border-radius] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
    top-0
    h-16

    left-1/2 -translate-x-1/2
    ${
      navScrolled
        ? 'w-[95%] lg:w-[75%] rounded-full border-primary bg-white/20 backdrop-blur-3xl shadow-2xl shadow-black/30 ring-1 ring-inset ring-white/20 md:h-18'
        : 'w-full bg-transparent md:h-20'
    }

    ${isPinned ? '-translate-y-full' : 'translate-y-3'}
  `}
  id="main-nav"
  aria-label="Main navigation"
>
        <Link
          href="/"
          className={`flex items-center pl-2  gap-2 overflow-hidden transition-colors duration-500 ${navScrolled ? 'text-on-background md:pl-0' : 'text-white md:pl-10'}`}
        >
          {/* LOGO img */}
          <img
            src="/aceLogo.webp"
            alt="The Ace Services logo"
            width={80}
            height={30}
            className='h-10 md:h-14 w-auto'
          />
{/* LOGO text */}
          <span className={`font-mono text-xl md:text-2xl font-thin tracking-tight whitespace-nowrap ${navScrolled ? "text-black" : "text-white"}`}>
            THE
            <span className='text-primary text-2xl md:text-3xl font-bold'>ACE</span>
            SERVICES
          </span>
        </Link>

        {/* Desktop nav — always dark text */}
        <div className={`hidden desktop-nav:flex items-center  text-xl `}>
          {/* Page links */}
          <div className={`flex items-center ${navScrolled ? 'gap-3' : 'gap-2'}`}>
            {PAGE_LINKS.map(({ href, label }) => {
              const isCalculator = href === '/calculator/';
              return (
                <Link
                  key={href}
                  href={href}
                  className={
                    isCalculator
                      ? `font-mono ${navScrolled ? 'text-xs 2xl:text-sm' : 'text-sm'} font-bold uppercase tracking-wider px-5 py-2 ${navScrolled ? 'lg:rounded-full' : ''} border-2 transition-all duration-500 ${
                          isActive(href)
                            ? 'border-primary bg-primary text-white'
                            :  'border-primary bg-primary text-white hover:bg-transparent hover:text-primary'
                        }`
                      : `font-mono ${navScrolled ? 'text-xs 2xl:text-sm' : 'text-sm'} font-bold border-transparent px-1 tracking-widest pb-0.5 ${navScrolled ? "text-black" : "text-white"} transition-colors duration-500 hover:border-b-primary hover:border-b-2 ${
                          isActive(href)
                              ? 'border-b-primary'
                              : ''
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
        className={`desktop-nav:hidden ${navScrolled ? 'sm-in-pill' : ''}`}
        items={menuItems as any}
        socialItems={SOCIAL_LINKS as any}
        displaySocials
        displayItemNumbering={true}
        logoUrl="/aceLogo.webp"
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
