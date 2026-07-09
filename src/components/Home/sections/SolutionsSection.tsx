import Reveal from '../../../components/Reveal';
import SolutionAccordion from '../../../components/SolutionAccordion';

export default function SolutionsSection() {
  return (
    <div id="solutions" className="py-24 px-6 md:px-16 border-b border-blueprint-line bg-surface relative">
      <Reveal type="fadeUp">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-xs text-primary font-bold block">[CAPABILITY_INDEX]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
              Core Service Solutions
            </h2>
            <p className="font-sans text-sm text-on-surface-variant">
              Explore our specialized divisions engineered to provide highly reliable pricing models and architectural reviews.
            </p>
          </div>
          <SolutionAccordion />
        </div>
      </Reveal>
    </div>
  );
}
