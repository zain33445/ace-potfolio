"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePin } from "../PinContext";
import dynamic from "next/dynamic";
import { SOCIAL_LINKS } from "@/src/data/social-links";

const StaggeredMenu = dynamic(
  () => import("@/src/components/ui/StaggeredMenu"),
  { ssr: false },
);

const menuItems = [
  { label: "Blogs", ariaLabel: "Read our blog", link: "/blog/" },
  { label: "Services", ariaLabel: "View our services", link: "/services/" },
  { label: "Projects", ariaLabel: "View our projects", link: "/projects/" },
  { label: "About Us", ariaLabel: "Learn about us", link: "/about-us/" },
  { label: "Contact", ariaLabel: "Contact us", link: "/contact-us/" },
  { label: "Calculator", ariaLabel: "Estimate costs", link: "/calculator/" },
];

/* Desktop Services mega menu. Hardcoded (not derived from data/services.ts) so
   the client nav bundle doesn't pull in ~2k lines of service copy + icons.
   Slugs must exist in data/service-slugs.ts. */
const SERVICE_MENU = [
  {
    slug: "cost-estimating",
    label: "Cost Estimation",
    subs: [
      ["residential-estimating", "Residential Estimation"],
      ["commercial-construction", "Commercial Estimation"],
      ["industrial-estimating", "Industrial Estimation"],
      ["building-estimating", "Building Estimation"],
      ["electrical-estimating-services", "Electrical Estimation"],
      ["blueprint-estimation", "Blueprint Estimation"],
      ["quantity-surveyor-services", "Quantity Surveying"],
      ["bridges-construction", "Bridges & Infrastructure"],
      ["warehouses-development", "Warehouse Development"],
      ["educational-buildings", "Educational Buildings"],
      ["healthcare-buildings", "Healthcare Buildings"],
      ["hotels-development", "Hotel Development"],
    ],
  },
  {
    slug: "architectural-services",
    label: "Architectural Services",
    subs: [
      ["3d-rendering-services", "3D Rendering"],
      ["shop-drawing-services", "Shop Drawings"],
      ["permit-set-services", "Permit Sets"],
    ],
  },
  {
    slug: "structural-engineering",
    label: "Structural & MEP Engineering",
    subs: [
      ["rebar-detailing-services", "Rebar Detailing"],
      ["shop-drawing-services", "Shop Drawings"],
      ["permit-set-services", "PE-Stamped Permit Sets"],
    ],
  },
  {
    slug: "project-management",
    label: "Project Management",
    subs: [["industrial-construction", "Industrial Construction Support"]],
  },
] as const;

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";
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
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
      const heroEl = document.getElementById("hero-top");
      if (!heroEl) {
        raf = requestAnimationFrame(observe);
        return;
      }
      const navHeight = navRef.current?.offsetHeight ?? 64;
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => setOverHero(entry.isIntersecting));
        },
        { root: null, rootMargin: `-${navHeight}px 0px 0px 0px`, threshold: 0 },
      );
      observer.observe(heroEl);
    };

    observe();

    const onResize = () => observe();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
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
        "--nav-pill-right",
        `${Math.max(0, window.innerWidth - rect.right + padRight)}px`,
      );
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    window.addEventListener("resize", sync);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", sync);
    };
  }, []);

  const PAGE_LINKS = [
    { href: "/services/", label: "SERVICES", shortLabel: "Services" },
    { href: "/projects/", label: "PROJECTS", shortLabel: "Projects" },
    { href: "/about-us/", label: "ABOUT", shortLabel: "About" },
    { href: "/contact-us/", label: "CONTACT", shortLabel: "Contact" },
    { href: "/blog/", label: "BLOG", shortLabel: "Blog" },
    { href: "/calculator/", label: "CALCULATOR", shortLabel: "Calculator" },
  ];

  const isActive = (href: string) => pathname === href;

  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMain, setActiveMain] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => setMenuOpen(false), [pathname]);
  const current = SERVICE_MENU[activeMain];

  return (
    <>
      <header
        className={`fixed z-50 flex justify-between md:justify-end gap-3 md:gap-10 items-center
    px-4 md:px-20 py-3 border-p
    bg-primary w-full
    transition-[width,left,transform,background-color,box-shadow,border-radius] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
    top-0
    text-white text-sm md:text-base whitespace-nowrap
    h-8`}
      >
        <a href="mailto:info@theaceservices.com">
          <b className="hidden md:inline">Email: </b>
          <u>info@theaceservices.com</u>
        </a>
        <div className="flex justify-center gap-3 my-10">
          {SOCIAL_LINKS.map((s) => (
            <a
              key={s.label}
              href={s.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-white transition-colors border-b-2 border-transparent hover:border-b-primary"
              aria-label={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
        <a href="tel:+13464580237" className="font-space">
          <b className="hidden md:inline">Phone: </b>
          <u>+1-346-458-0237</u>
        </a>
      </header>
      <nav
        ref={navRef}
        className={`fixed z-50 flex justify-between lg:justify-around items-center
    px-4 md:px-6 py-3
    transition-[width,left,transform,background-color,box-shadow,border-radius] duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]
    top-8
    h-16

    left-1/2 -translate-x-1/2
    ${
      navScrolled
        ? `w-full backdrop-blur-2xl border-b border-black/5 md:h-18 ${menuOpen ? "bg-white" : "bg-white/70 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.25)]"}`
        : `w-full md:h-20 ${menuOpen ? "bg-white" : "bg-transparent"}`
    }

  `}
        id="main-nav"
        aria-label="Main navigation"
      >
        <Link
          href="/"
          className={`flex items-center pl-2  gap-2 overflow-hidden transition-colors duration-500 ${navScrolled ? "text-on-background md:pl-0" : "text-white md:pl-10"}`}
        >
          {/* LOGO img */}
          <img
            src="/aceLogo.webp"
            alt="The Ace Services logo"
            width={80}
            height={30}
            className="h-10 md:h-14 w-auto"
          />
          {/* LOGO text */}
          <span
            className={`font-mono text-xl md:text-2xl font-thin tracking-tight whitespace-nowrap ${navScrolled ? "text-black" : "text-white"}`}
          >
            THE
            <span className="text-primary text-2xl md:text-3xl font-bold">
              ACE
            </span>
            SERVICES
          </span>
        </Link>

        {/* Desktop nav — always dark text */}
        <div className={`hidden desktop-nav:flex items-center  text-xl `}>
          {/* Page links */}
          <div
            className={`flex items-center ${navScrolled ? "gap-3" : "gap-2"}`}
          >
            {PAGE_LINKS.map(({ href, label }) => {
              const isCalculator = href === "/calculator/";
              const link = (
                <Link
                  key={href}
                  href={href}
                  className={
                    isCalculator
                      ? `font-mono ${navScrolled ? "text-xs 2xl:text-sm" : "text-sm"} font-bold uppercase tracking-wider px-5 py-2 ${navScrolled ? "lg:rounded-full" : ""} border-2 transition-all duration-500 ${
                          isActive(href)
                            ? "border-primary bg-primary text-white"
                            : "border-primary bg-primary text-white hover:bg-transparent hover:text-primary"
                        }`
                      : `relative font-mono ${navScrolled ? "text-xs 2xl:text-sm" : "text-sm"} font-bold border-transparent px-1 tracking-widest pb-0.5 ${navScrolled ? "text-black" : "text-white"} transition-colors duration-500 hover:border-b-primary hover:border-b-2 ${
                          isActive(href) ? "border-b-primary" : ""
                        }`
                  }
                >
                  {label}
                  {isActive(href) && !isCalculator && (
                    <span
                      className="absolute left-0 right-0 -bottom-0.5 h-px bg-primary"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
              if (href !== "/services/") return link;
              return (
                /* Deliberately not `relative`: the panel positions against the
                   fixed <nav> so it spans the full pill width. */
                <div
                  key={href}
                  /* flex: the inline <a> would otherwise sit on the text-xl line box and drop below its siblings */
                  className="flex items-center"
                  onMouseEnter={() => {
                    clearTimeout(closeTimer.current);
                    setMenuOpen(true);
                  }}
                  onMouseLeave={() => {
                    /* grace period to cross the gap between link and panel */
                    closeTimer.current = setTimeout(() => setMenuOpen(false), 150);
                  }}
                  onFocus={() => setMenuOpen(true)}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node))
                      setMenuOpen(false);
                  }}
                  onKeyDown={(e) => e.key === "Escape" && setMenuOpen(false)}
                >
                  {link}
                  <div
                    className={`absolute left-0 right-0 top-full transition-all duration-300 ${
                      menuOpen
                        ? "opacity-100 translate-y-0 visible"
                        : "opacity-0 -translate-y-2 invisible pointer-events-none"
                    }`}
                  >
                    <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,7fr)] text-black overflow-hidden w-full bg-white border-t border-black/5 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.35)]">
                      {/* Main services sidebar */}
                      <div className="border-r border-black/10 bg-black/[0.03] p-8">
                        <p className="mb-4 font-mono text-xs uppercase tracking-widest">
                          Our Services
                        </p>
                        <ul className="space-y-1">
                          {SERVICE_MENU.map((m, i) => (
                            <li key={m.slug}>
                              <Link
                                href={`/services/${m.slug}/`}
                                onMouseEnter={() => setActiveMain(i)}
                                onFocus={() => setActiveMain(i)}
                                className={`block border-l-2 py-1.5 pl-4 text-2xl font-semibold tracking-tight whitespace-normal transition-colors ${
                                  i === activeMain
                                    ? "border-primary text-primary"
                                    : "border-transparent"
                                }`}
                              >
                                {m.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href="/services/"
                          className="mt-6 inline-block pl-4 font-mono text-xs font-bold uppercase tracking-wider hover:text-primary"
                        >
                          All Services →
                        </Link>
                      </div>
                      {/* Sub services of the active main service */}
                      <div className="p-8">
                        <p className="mb-4 font-mono text-xs uppercase tracking-widest ">
                          {current.label}
                        </p>
                        <ul className="grid max-w-xl grid-cols-2 gap-x-8 gap-y-2.5">
                          {current.subs.map(([slug, subLabel]) => (
                            <li key={slug}>
                              <Link
                                href={`/services/${slug}/`}
                                className="text-sm font-semibold transition-colors hover:text-primary"
                              >
                                {subLabel}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <Link
                          href={`/services/${current.slug}/`}
                          className="mt-8 inline-flex items-center gap-2 border border-primary bg-primary px-5 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-transparent hover:text-primary"
                        >
                          Explore {current.label} →
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Page dim while the Services menu is open. Outside <nav>: its transform
          would otherwise trap this fixed layer inside the nav box. */}
      <div
        aria-hidden="true"
        onClick={() => setMenuOpen(false)}
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* StaggeredMenu — always mounted, self-contained open/close via its own toggle */}
      <StaggeredMenu
        position="right"
        isFixed
        className={`desktop-nav:hidden ${navScrolled ? "sm-in-pill" : ""}`}
        items={menuItems as any}
        socialItems={SOCIAL_LINKS as any}
        displaySocials
        displayItemNumbering={true}
        logoUrl="/aceLogo.webp"
        // menuButtonColor={navScrolled ? '#0A0A0A' : '#ffffff'}
        menuButtonColor={overHero ? "#ffffff" : "#FF6B00"}
        openMenuButtonColor={"#FF6B00"}
        changeMenuColorOnOpen={true}
        colors={["#FF6B00", "#CC5500"]}
        accentColor="#FF6B00"
      />
    </>
  );
}
