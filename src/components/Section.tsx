import {
  forwardRef,
  type ReactNode,
  type HTMLAttributes,
  useCallback,
  useLayoutEffect,
  useRef,
} from 'react';
import { useScrollerContext } from './FullscreenScroller';

interface SectionProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  sectionId: string;
  overflow?: string;
}

const Section = forwardRef<HTMLDivElement, SectionProps>(
  ({ children, sectionId, className, overflow, ...rest }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const { registerSection, unregisterSection } = useScrollerContext();

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node;
        if (forwardedRef) {
          if (typeof forwardedRef === 'function') forwardedRef(node);
          else (forwardedRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }
      },
      [forwardedRef],
    );

    useLayoutEffect(() => {
      const el = internalRef.current;
      if (!el) return;
      registerSection(sectionId, el);
      return () => unregisterSection(sectionId);
    }, [sectionId, registerSection, unregisterSection]);

    return (
      <div
        ref={setRef}
        id={sectionId}
        className={className}
        style={{ position: 'fixed', inset: 0, willChange: 'transform', overflow: overflow ?? undefined }}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

export default Section;
