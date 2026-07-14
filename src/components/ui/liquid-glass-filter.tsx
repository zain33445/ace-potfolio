/**
 * Liquid Glass SVG Filter
 *
 * Defines an SVG <filter> using <feTurbulence> + <feDisplacementMap> to
 * create a water-like refraction effect on any element that references it.
 *
 * Usage (in CSS):
 *   backdrop-filter: url(#liquid-refraction) blur(8px);
 *
 * This component renders zero visible output — it only registers the filter
 * definition in the DOM for CSS to reference. Safe for server-side rendering
 * (no 'use client' needed).
 */

export default function LiquidGlassFilter() {
  return (
    <svg
      width="0"
      height="0"
      className="absolute -z-50 pointer-events-none"
      aria-hidden="true"
      focusable="false"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        <filter
          id="liquid-refraction"
          x="-30%"
          y="-30%"
          width="160%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          {/* 1. Generate organic water-noise pattern.
               baseFrequency X/Y controls wave scale — smaller = larger waves.
               numOctaves 2-3 for natural feel without heavy cost. */}
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.03"
            numOctaves="3"
            result="noise"
          />

          {/* 2. Warp the backdrop using the noise R/G channels as
               displacement vectors. scale controls the warp intensity. */}
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="28"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>

        {/* ── Lighter variant for smaller cards where less warp is needed ── */}
        <filter
          id="liquid-refraction-subtle"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02 0.04"
            numOctaves="2"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="15"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
