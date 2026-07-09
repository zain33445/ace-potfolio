'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import Nav from '../components/Nav';
import CursorFollower from '../components/CursorFollower';
import { PreloaderProvider } from '../PreloaderContext';

/* Lazy-load the Preloader — it pulls in ~60KB of gsap and is only
   meaningful on the homepage. Offloading it from the shared layout
   chunk slashes the JS shipped to every other route. */
const Preloader = dynamic(
  () => import('../components/Preloader'),
  { ssr: false },
);

export default function LayoutShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  // Non-homepage routes skip the preloader entirely — start "done".
  const [preloaderDone, setPreloaderDone] = useState(!isHome);

  return (
    <PreloaderProvider value={{ preloaderDone }}>
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
    </PreloaderProvider>
  );
}
