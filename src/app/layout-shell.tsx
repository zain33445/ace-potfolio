'use client';

import { useLayoutEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { PinProvider } from '../PinContext';

// ponytail: Footer was dynamic with `ssr: false` — client-only.
// That meant its links never landed in SSR HTML, so Google's internal-link
// graph never saw the footer nav (search-console verifiable: pre-fix HTML
// had zero `href` for footer items). Enabled SSR here so the anchor tags
// (and the orphan-target links we just added) actually count.

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';

  // Disable browser scroll restoration so reload always starts at top
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  // Scroll to section after navigating from another page (via sessionStorage) or direct hash URL
  useLayoutEffect(() => {
    if (!isHome) return;

    // Determine target section: sessionStorage (client nav) > URL hash (direct link)
    const targetId =
      sessionStorage.getItem('scrollToSection') ||
      (window.location.hash ? window.location.hash.slice(1) : '');

    if (targetId) {
      sessionStorage.removeItem('scrollToSection');

      // Poll with requestAnimationFrame until the element exists, then scroll
      const tryScroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        } else {
          requestAnimationFrame(tryScroll);
        }
      };
      requestAnimationFrame(tryScroll);
    }
  }, [isHome]);

  return (
    <PinProvider>
      <div className="min-h-screen relative antialiased selection:bg-primary selection:text-white">
        <header>
          <Nav />
        </header>
        <main className={isHome ? '' : 'pt-20 md:pt-16'}>{children}</main>
        <Footer />
      </div>
    </PinProvider>
  );
}
