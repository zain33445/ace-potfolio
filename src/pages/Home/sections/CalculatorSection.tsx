import Section from '../../../components/Section';
import Reveal from '../../../components/Reveal';
import InteractiveEstimator from '../../../components/InteractiveEstimator';

export default function CalculatorSection() {
  return (
    <Section sectionId="calculator-sec" className="py-24 px-6 md:px-16 border-b border-blueprint-line bg-background relative overflow-y-auto">
      <Reveal type="fadeUp">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="font-mono text-xs text-primary font-bold block">[TAKEOFF_ENGINE_DEMO]</span>
          <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
            Instant Bid Cost Configurator
          </h2>
          <p className="font-sans text-sm text-on-surface-variant">
            Adjust parametric multipliers to generate class-3 budgetary allocations ready for estimation draft submission.
          </p>
        </div>
        <div className="max-w-5xl mx-auto">
          <InteractiveEstimator />
        </div>
      </Reveal>
    </Section>
  );
}
