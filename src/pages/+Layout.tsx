import '../index.css'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import FullscreenScroller, { type FullscreenScrollerHandle } from '../components/FullscreenScroller'
import Nav from '../components/Nav'
import Preloader from '../components/Preloader'
import { PreloaderProvider } from '../PreloaderContext'

export default function Layout({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<FullscreenScrollerHandle | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [preloaderDone, setPreloaderDone] = useState(false)

  const navScrolled = currentIndex > 0

  const scrollToAnchor = (id: string) => {
    scrollerRef.current?.scrollToSection(id)
  }

  return (
    <PreloaderProvider value={{ preloaderDone }}>
      <div className="min-h-screen relative antialiased selection:bg-primary selection:text-white">
        {!preloaderDone && <Preloader onComplete={() => setPreloaderDone(true)} />}
        <FullscreenScroller ref={scrollerRef} onIndexChange={setCurrentIndex}>
          <Nav navScrolled={navScrolled} onAnchorClick={scrollToAnchor} />
          {children}
        </FullscreenScroller>
      </div>
    </PreloaderProvider>
  )
}
