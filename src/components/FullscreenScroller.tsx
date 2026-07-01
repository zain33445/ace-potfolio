import {
  type ReactNode,
  createContext,
  useContext,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useFullscreenScroller } from '../hooks/useFullscreenScroller';

/* ------------------------------------------------------------------ */
/*  Context                                                            */
/* ------------------------------------------------------------------ */

interface ScrollerContextValue {
  registerSection: (id: string, el: HTMLElement) => number;
  unregisterSection: (id: string) => void;
}

const ScrollerContext = createContext<ScrollerContextValue | null>(null);

export function useScrollerContext() {
  const ctx = useContext(ScrollerContext);
  if (!ctx) throw new Error('useScrollerContext must be used inside <FullscreenScroller>');
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Public handle                                                      */
/* ------------------------------------------------------------------ */

export interface FullscreenScrollerHandle {
  scrollToSection: (id: string) => void;
  currentIndex: number;
  totalSections: number;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

const FullscreenScroller = forwardRef<FullscreenScrollerHandle, { children: ReactNode; onIndexChange?: (index: number) => void }>(
  function FullscreenScroller({ children, onIndexChange }, ref) {
    const { registerSection, unregisterSection, scrollToSection, currentIndex, totalSections } =
      useFullscreenScroller(onIndexChange);

    useImperativeHandle(
      ref,
      () => ({
        scrollToSection,
        currentIndex,
        totalSections,
      }),
      [scrollToSection, currentIndex, totalSections],
    );

    return (
      <ScrollerContext.Provider value={{ registerSection, unregisterSection }}>
        {children}
      </ScrollerContext.Provider>
    );
  },
);

export default FullscreenScroller;
