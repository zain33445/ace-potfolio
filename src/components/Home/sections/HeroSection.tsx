import Hero from "@/src/components/Hero";
import { Header } from "@/src/components/ui/hero-parallax";

const headerH1 = "Construction Estimating Services — Top Pre-Construction Firm in US";
const headerH2 = "Stop Losing Bids";
const headerH3 =
  "Accurate AACE Class 3 estimates and material takeoffs, delivered in 24 to 48 hours. Win more work with precise, professional cost estimation numbers.";

/**
 * Both desktop and mobile layouts are rendered into the DOM.
 * CSS media queries (hidden md:block / block md:hidden) toggle visibility
 * without swapping React nodes — zero hydration mismatch, zero CLS.
 *
 * The desktop Hero h2 is always present in the server HTML for LCP.
 */
export default function HeroSection() {
  return (
    <div
      id="hero-top"
      className="
        flex flex-col
        relative items-stretch
      "
    >
      {/* Desktop hero — fullscreen h-svh with scroll zoom + parallax */}
      <div
        className="
          hidden
          md:block
        "
      >
        <Hero />
      </div>

      {/* Mobile hero — video header + parallax cards */}
      <div
        className="
          md:hidden
        "
      >
        <div
          className="
            overflow-hidden
            h-[100svh]
            relative
          "
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            poster="/mobile-poster.jpg"
            className="
              object-cover
              w-full h-full
              absolute inset-0
            "
          >
            <source src="/mobile-video-header.mp4" type="video/mp4" />
          </video>

          <div
            className="
              z-10
              px-10
              h-full
              relative
              flex flex-col items-center justify-center gap-y-20
            "
          >
            <Header h1={headerH1} h2={headerH2} h3={headerH3} />
          </div>
        </div>
        <div
          className="
            overflow-hidden
            py-3.5
            text-white
            bg-primary
            border-y border-on-background
            select-none
            relative shrink-0
          "
        >
          <div
            className="
              font-mono text-xl font-bold tracking-widest
              marquee-track uppercase
            "
          >
            <span
              className="
                marquee-content
              "
            >
              &spades; 2,893+ PROJECTS DELIVERED &spades; 35 STATES SERVED
              &spades; 89% BID WIN RATE &spades; PLANSWIFT &amp; BLUEBEAM
              INTEGRATION &spades;
            </span>
            <span
              aria-hidden="true"
              className="
                marquee-content
              "
            >
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
