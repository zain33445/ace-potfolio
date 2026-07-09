'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { splitTextIntoChars } from '../utils/animations';

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';

interface TextRevealProps {
  /** Text to animate */
  text: string;
  /** HTML tag to render (default: 'h2') */
  as?: HeadingTag;
  /** Additional class names */
  className?: string;
  /** Stagger delay per character in seconds (default: 0.02) */
  staggerDelay?: number;
  /** Duration per character in seconds (default: 0.5) */
  charDuration?: number;
  /** IntersectionObserver threshold (default: 0.3) */
  threshold?: number;
  /** Whether to animate on mount without scroll (default: false) */
  startOnMount?: boolean;
}

export default function TextReveal({
  text,
  as: Tag = 'h2',
  className = '',
  staggerDelay = 0.02,
  charDuration = 0.5,
  threshold = 0.3,
  startOnMount = false,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(startOnMount);
  const chars = splitTextIntoChars(text);

  useEffect(() => {
    if (startOnMount) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, startOnMount]);

  return (
    <div ref={ref} className={className}>
      <Tag className="sr-only">{text}</Tag>
      <Tag aria-hidden="true" className="contents">
        {chars.map((char, i) => (
          <motion.span
            key={`${i}-${char}`}
            initial={{ opacity: 0, y: 24, rotateX: -90 }}
            animate={
              isVisible
                ? { opacity: 1, y: 0, rotateX: 0 }
                : { opacity: 0, y: 24, rotateX: -90 }
            }
            transition={{
              duration: charDuration,
              delay: i * staggerDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block whitespace-pre"
          >
            {char}
          </motion.span>
        ))}
      </Tag>
    </div>
  );
}
