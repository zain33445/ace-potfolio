import Hero from '@/src/components/Hero';
import RenderOnViewport from '@/src/components/RenderOnViewport';
import LiquidGlassFilter from '@/src/components/ui/liquid-glass-filter';
import type { HeroParallaxProduct } from '@/src/components/ui/hero-parallax';

export default function HeroSection({
  products,
}: {
  /** Optional CMS product cards to show in the hero parallax. */
  products?: HeroParallaxProduct[];
}) {
  return (
    <div
      id="hero-top"
      className="relative flex flex-col items-stretch overflow-hidden border-b border-blueprint-line"
    >
      {/* Hidden SVG filter definition — registered in the DOM for CSS
          backdrop-filter: url(#liquid-refraction) to reference. */}
      <LiquidGlassFilter />

      <RenderOnViewport>
        <Hero products={products} />
      </RenderOnViewport>
    </div>
  );
}
