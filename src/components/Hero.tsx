import { type CSSProperties } from 'react';
import { motion, type Easing } from 'motion/react';
import { Activity, ChevronRight } from 'lucide-react';
import Hero3D from './Hero3D';
import { splitTextIntoChars } from '../utils/animations';

const easeSoft: Easing = [0.22, 1, 0.36, 1];

interface HeroProps {
  onAnchorClick?: (id: string) => void;
  preloaderDone?: boolean;
}

export default function Hero({ onAnchorClick = () => {}, preloaderDone = false }: HeroProps) {
  const headline = 'Stop Losing Bids to Slow Turnarounds and Inaccurate Estimates.';
  const heroChars = splitTextIntoChars(headline);

  return (
    <section
      id="hero-top"
      className="relative flex flex-col items-stretch pt-24 overflow-hidden border-b border-blueprint-line h-full"
    >
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 w-full items-center px-6 md:px-16 z-10">
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.6, delay: 0.15, ease: easeSoft }}
            className="font-mono text-[10px] text-primary font-bold flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
            [SYS_INIT: PRECISION_ESTIMATE]
          </motion.div>

          <h1 className="font-space text-4xl md:text-6xl font-extrabold tracking-tighter leading-tight text-on-background overflow-hidden">
            {heroChars.map((char, i) => (
              <motion.span
                key={i}
                className="char-split"
                initial={{ opacity: 0, y: 40, rotateX: -90 }}
                animate={preloaderDone ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 40, rotateX: -90 }}
                transition={{
                  delay: 0.6 + i * 0.015,
                  duration: 0.45,
                  ease: easeSoft,
                }}
              >
                {char === '\u00A0' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 1.8, ease: easeSoft }}
            className="font-sans text-base md:text-lg text-on-surface-variant max-w-xl leading-relaxed"
          >
            The ACE Services delivers precision-engineered construction estimation and pre-construction support across 35 states. Using industry-leading tools like PlanSwift and Bluebeam, we provide the data-driven accuracy you need to win more work and protect your margins.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={preloaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.55, delay: 2.6, ease: easeSoft }}
            className="flex flex-col sm:flex-row gap-4 pt-4 items-start"
          >
            <button
              onClick={() => onAnchorClick('contact')}
              className="btn-stagger bg-primary text-white font-mono text-xs font-bold px-8 py-4 bracket-corners hover-brackets tracking-wider flex items-center justify-center gap-2 w-full sm:w-auto shadow-sm group"
            >
              <span className="stagger-word" style={{ '--delay': '0s', '--group-move': '4px' } as CSSProperties}>Get</span>
              <span className="stagger-word" style={{ '--delay': '0.04s', '--group-move': '4px' } as CSSProperties}>Your</span>
              <span className="stagger-word" style={{ '--delay': '0.08s', '--group-move': '4px' } as CSSProperties}>Custom</span>
              <span className="stagger-word" style={{ '--delay': '0.12s', '--group-move': '4px' } as CSSProperties}>Quote</span>
              <span className="arrow-hover inline-flex ml-1">
                <span className="arrow-track">
                  <ChevronRight className="w-4 h-4 text-white arrow-icon-first" />
                  <ChevronRight className="w-4 h-4 text-white arrow-icon-second" />
                </span>
              </span>
            </button>
            <button
              onClick={() => onAnchorClick('projects')}
              className="font-mono text-[11px] text-on-surface-variant hover:text-primary transition-colors tracking-wider uppercase underline underline-offset-4 decoration-dotted decoration-blueprint-line py-2"
            >
              VIEW SCHEMATICS
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={preloaderDone ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
          transition={{ duration: 1, delay: 0.1, ease: easeSoft }}
          className="lg:col-span-5 h-[350px] sm:h-[450px] relative border border-blueprint-line lg:border-none rounded-none overflow-hidden max-w-lg mx-auto w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]"
        >
          <Hero3D />
          <div className="absolute top-4 left-4 font-mono text-[10px] text-primary font-bold opacity-60">
            SYS: ROTATING_COLUMNS_ISOMETRIC
          </div>
          <div className="absolute bottom-4 right-4 bg-background/80 border border-blueprint-line p-2 font-mono text-[9px] text-on-surface-variant flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-primary animate-pulse" />
            Interactive Drag & Scroll Active
          </div>
        </motion.div>
      </div>

      <div className="bg-primary text-white py-3.5 border-y border-on-background overflow-hidden relative select-none shrink-0">
        <div className="ticker-wrap font-mono text-xs font-bold tracking-widest uppercase">
          <div className="ticker">
            &spades; 2,893+ PROJECTS COMPLETED &spades; 35 STATES SUPPORTED &spades; 89% BID WIN RATE &spades; PLANSWIFT & BLUEBEAM INTEGRATION &spades; 2,893+ PROJECTS COMPLETED &spades; 35 STATES SUPPORTED &spades; 89% BID WIN RATE &spades; PLANSWIFT & BLUEBEAM INTEGRATION &spades;
          </div>
        </div>
      </div>
    </section>
  );
}
