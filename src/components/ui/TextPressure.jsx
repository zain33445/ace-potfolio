import { useEffect, useRef, useState, useMemo, useCallback } from 'react';

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

const TextPressure = ({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = '#FFFFFF',
  strokeColor = '#FF0000',
  className = '',

  minFontSize = 24,
  proximity = 0
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  // True while the pointer is hovering this container — the focus follows the
  // mouse only then; otherwise it defaults back to the middle of the text.
  const mouseInsideRef = useRef(false);

  // Cache for span bounding rects — recomputed only on resize, not every frame
  const spanRectsRef = useRef([]);
  const titleRectRef = useRef(null);

  // Whether the component is visible in the viewport
  const isVisibleRef = useRef(false);

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split('');

  // --- Mouse / touch tracking ---
  useEffect(() => {
    const handleMouseMove = e => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };
    const handleTouchMove = e => {
      const t = e.touches[0];
      cursorRef.current.x = t.clientX;
      cursorRef.current.y = t.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Batch geometry reads to avoid forced reflow
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = rect.left + rect.width / 2;
      mouseRef.current.y = rect.top + rect.height / 2;
      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // --- Track whether the pointer is inside the container ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleEnter = () => {
      mouseInsideRef.current = true;
    };
    const handleLeave = () => {
      mouseInsideRef.current = false;
    };

    el.addEventListener('mouseenter', handleEnter);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mouseenter', handleEnter);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  // --- Cache all span rects (called only on resize, not every frame) ---
  const cacheSpanRects = useCallback(() => {
    if (!titleRef.current) return;
    titleRectRef.current = titleRef.current.getBoundingClientRect();
    spanRectsRef.current = spansRef.current.map(span =>
      span ? span.getBoundingClientRect() : null
    );
  }, []);

  // --- Font / layout sizing ---
  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

    let newFontSize = containerW / (chars.length / 2);
    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;
      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;
        setScaleY(yRatio);
        setLineHeight(yRatio);
      }

      // Recache rects after layout settles
      cacheSpanRects();
    });
  }, [chars.length, minFontSize, scale, cacheSpanRects]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);
    debouncedSetSize();
    window.addEventListener('resize', debouncedSetSize);
    return () => window.removeEventListener('resize', debouncedSetSize);
  }, [setSize]);

  // Also recache on scroll (viewport positions shift)
  useEffect(() => {
    const handleScroll = debounce(cacheSpanRects, 200);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [cacheSpanRects]);

  // --- IntersectionObserver: pause rAF when not visible ---
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        // Recache rects when becoming visible (positions may have shifted)
        if (entry.isIntersecting) {
          cacheSpanRects();
        }
      },
      { threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [cacheSpanRects]);

  // --- Animation loop: use CACHED rects, pause when off-screen ---
  useEffect(() => {
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // Skip expensive work if not visible
      if (!isVisibleRef.current) return;

      const titleRect = titleRectRef.current;
      if (!titleRect) return;

      // Focus target: follow the mouse while hovering the container,
      // otherwise ease back to the middle of the text (default focus).
      // When `proximity` is set, the influence blends in as the cursor
      // approaches the container, so the text "catches" the pressure even
      // before the pointer lands on it.
      const cursor = cursorRef.current;
      const centerX = titleRect.x + titleRect.width / 2;
      const centerY = titleRect.y + titleRect.height / 2;

      // Distance from the cursor to the container's bounding box (0 inside).
      const outsideX = Math.max(
        titleRect.left - cursor.x,
        0,
        cursor.x - titleRect.right
      );
      const outsideY = Math.max(
        titleRect.top - cursor.y,
        0,
        cursor.y - titleRect.bottom
      );
      const outsideDist = Math.hypot(outsideX, outsideY);

      // blend: 0 = default center focus, 1 = full cursor focus
      let blend = mouseInsideRef.current ? 1 : 0;
      if (proximity > 0 && blend < 1) {
        blend = Math.max(blend, Math.min(1, 1 - outsideDist / proximity));
      }

      const targetX = centerX + (cursor.x - centerX) * blend;
      const targetY = centerY + (cursor.y - centerY) * blend;

      mouseRef.current.x += (targetX - mouseRef.current.x) / 15;
      mouseRef.current.y += (targetY - mouseRef.current.y) / 15;

      const maxDist = titleRect.width / 2;

      spansRef.current.forEach((span, i) => {
        if (!span) return;

        // Use cached rect — no getBoundingClientRect() here
        const rect = spanRectsRef.current[i];
        if (!rect) return;

        const charCenter = {
          x: rect.x + rect.width / 2,
          y: rect.y + rect.height / 2
        };

        const d = dist(mouseRef.current, charCenter);

        const wdth = width ? Math.floor(getAttr(d, maxDist, 5, 200)) : 100;
        const wght = weight ? Math.floor(getAttr(d, maxDist, 100, 900)) : 400;
        const italVal = italic ? getAttr(d, maxDist, 0, 1).toFixed(2) : 0;
        const alphaVal = alpha ? getAttr(d, maxDist, 0, 1).toFixed(2) : 1;

        const newFontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}, 'ital' ${italVal}`;

        if (span.style.fontVariationSettings !== newFontVariationSettings) {
          span.style.fontVariationSettings = newFontVariationSettings;
        }
        if (alpha && span.style.opacity !== alphaVal) {
          span.style.opacity = alphaVal;
        }
      });
    };

    animate();
    return () => cancelAnimationFrame(rafId);
  }, [width, weight, italic, alpha, proximity]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
        .tp-flex {
          display: flex;
          justify-content: space-between;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
    );
  }, [textColor, strokeColor]);

  const dynamicClassName = [className, flex ? 'tp-flex' : '', stroke ? 'stroke' : ''].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        background: 'transparent'
      }}
    >
      {/* Load the variable font — React 19 deduplicates this automatically */}
      {fontUrl && <link rel="stylesheet" href={fontUrl} />}
      {styleElement}
      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize: fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%'
        }}
      >
        {chars.map((char, i) => (
          <span
            key={i}
            ref={el => {
              spansRef.current[i] = el;
            }}
            data-char={char}
            style={{
              display: 'inline-block',
              color: stroke ? undefined : textColor
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;
