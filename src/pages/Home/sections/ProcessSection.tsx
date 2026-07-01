import Section from '../../../components/Section';
import ProcessFlow from '../../../components/ProcessFlow';

export default function ProcessSection() {
  return (
    <Section sectionId="process" className="py-24 px-6 md:px-16 bg-background border-b border-blueprint-line relative overflow-y-auto">
      <div className="container mx-auto max-w-7xl">
        <ProcessFlow />
      </div>
    </Section>
  );
}
