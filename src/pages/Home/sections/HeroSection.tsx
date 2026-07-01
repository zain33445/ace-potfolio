import Section from '../../../components/Section';
import Hero from '../../../components/Hero';

interface HeroSectionProps {
  onAnchorClick?: (id: string) => void;
  preloaderDone?: boolean;
}

export default function HeroSection({ onAnchorClick, preloaderDone }: HeroSectionProps) {
  return (
    <Section sectionId="hero-top" className="relative flex flex-col items-stretch pt-24 overflow-hidden border-b border-blueprint-line">
      <Hero onAnchorClick={onAnchorClick} preloaderDone={preloaderDone} />
    </Section>
  );
}
