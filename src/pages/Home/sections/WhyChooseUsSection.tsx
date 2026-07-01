import Section from '../../../components/Section';
import Reveal from '../../../components/Reveal';
import WhyChooseUs from '../../../components/WhyChooseUs';

export default function WhyChooseUsSection() {
  return (
    <Section sectionId="why-choose-us" className="py-24 px-6 md:px-16 border-b border-blueprint-line bg-background relative">
      <Reveal type="fadeUp">
        <div className="absolute inset-x-0 top-0 h-px bg-blueprint-line/40" />
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-6 space-y-3">
            <span className="font-mono text-xs text-primary font-bold block">[DIFFERENTIATOR_MATRIX]</span>
            <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tighter">
              Why Choose The ACE Services?
            </h2>
            <div className="flex justify-center pt-1">
              <div className="w-16 h-0.5 bg-primary rounded-full" />
            </div>
            <p className="font-sans text-sm text-on-surface-variant font-medium">
              We leverage elite mathematical modeling and multi-layered audit procedures to deliver unmatched pre-construction confidence.
            </p>
          </div>
          <WhyChooseUs />
        </div>
      </Reveal>
    </Section>
  );
}
