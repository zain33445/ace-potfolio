import Hero from '@/src/components/Hero';
import { HeroParallax } from '@/src/components/ui/hero-parallax';

const headerH1 = 'Top Pre-Construction & Estimation Firm';
const headerH2 = 'Stop Losing Bids';
const headerH3 =
  'Accurate AACE Class 3 estimates and material takeoffs, delivered in 24 to 48 hours. Win more work with precise, professional-grade pre-construction numbers.';

/**
 * Both desktop and mobile layouts are rendered into the DOM.
 * CSS media queries (hidden md:block / block md:hidden) toggle visibility
 * without swapping React nodes — zero hydration mismatch, zero CLS.
 *
 * The desktop Hero h2 is always present in the server HTML for LCP.
 */
export default function HeroSection() {
  return (
    <div id="hero-top" className="relative flex flex-col items-stretch">
      {/* Desktop hero — fullscreen h-svh with scroll zoom + parallax */}
      <div className="hidden md:block">
        <Hero />
      </div>

      {/* Mobile hero — video header + parallax cards */}
      <div className="md:hidden">
        <HeroParallax
          products={[]}
          headerH1={headerH1}
          headerH2={headerH2}
          headerH3={headerH3}
        />
        <div className="bg-primary text-white py-3.5 border-y border-on-background overflow-hidden relative select-none shrink-0">
          <div className="marquee-track font-mono text-sm font-bold tracking-widest uppercase">
            <span className="marquee-content">
              &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
              &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
              INTEGRATION &spades;
            </span>
            <span className="marquee-content" aria-hidden="true">
              &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
              &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
              INTEGRATION &spades;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
