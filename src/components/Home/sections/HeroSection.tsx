import Hero from '@/src/components/Hero';
import RenderOnViewport from '@/src/components/RenderOnViewport';

export default function HeroSection() {
  return (
    <div
      id="hero-top"
      className="relative flex flex-col items-stretch overflow-hidden border-b border-blueprint-line"
    >
      <RenderOnViewport>
        <Hero />
      </RenderOnViewport>
    </div>
  );
}
