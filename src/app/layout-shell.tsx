'use client';

import { useState, useLayoutEffect, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Nav from '../components/Nav';
import { PreloaderProvider } from '../PreloaderContext';
import { PinProvider } from '../PinContext';

/* Lazy-load the Preloader — it pulls in ~60KB of gsap and is only
   meaningful on the homepage. Offloading it from the shared layout
   chunk slashes the JS shipped to every other route. */
const Preloader = dynamic(
  () => import('../components/Preloader'),
  { ssr: false },
);

/* Lazy-load the CursorFollower — it also pulls in gsap. Keeping it
   out of the shared layout chunk saves ~50KB of JS on every page. */
const CursorFollower = dynamic(
  () => import('../components/CursorFollower'),
  { ssr: false },
);

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // Non-homepage routes skip the preloader entirely — start "done".
  const [preloaderDone, setPreloaderDone] = useState(!isHome);

  // Scroll to section after navigating from another page (via sessionStorage) or direct hash URL
  useLayoutEffect(() => {
    if (!isHome) return;

    // Determine target section: sessionStorage (client nav) > URL hash (direct link)
    const targetId =
      sessionStorage.getItem('scrollToSection') ||
      (window.location.hash ? window.location.hash.slice(1) : '');

    if (targetId) {
      sessionStorage.removeItem('scrollToSection');
      setPreloaderDone(true);

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
    <PreloaderProvider value={{ preloaderDone }}>
      <PinProvider>
        <div className="min-h-screen relative antialiased selection:bg-primary selection:text-white">
          <CursorFollower />
          {isHome && !preloaderDone && (
            <Preloader onComplete={() => setPreloaderDone(true)} />
          )}

          <header>
            <Nav />
          </header>
          <main>{children}</main>
        </div>
      </PinProvider>
    </PreloaderProvider>
  );
}
