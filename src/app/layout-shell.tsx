'use client';

import { useLayoutEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Nav from '../components/Nav';
import { PinProvider } from '../PinContext';
import Footer from '../components/Footer';

/* Lazy-load the CursorFollower — it also pulls in gsap. Keeping it
   out of the shared layout chunk saves ~50KB of JS on every page. */
const CursorFollower = dynamic(
  () => import('../components/CursorFollower'),
  { ssr: false },
);

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
        <CursorFollower />
        <header>
          <Nav />
        </header>
        <main>{children}</main>
        <Footer />
      </div>
    </PinProvider>
  );
}
