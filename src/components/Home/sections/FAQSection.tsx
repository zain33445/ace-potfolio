import Reveal from '../../../components/Reveal';
import FAQAccordion from '../../../components/FAQAccordion';

export default function FAQSection() {
  return (
    <div id="faq" className="py-24 px-6 md:px-16 border-b border-blueprint-line bg-surface relative">
      <Reveal type="fadeUp">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="font-mono text-sm text-primary font-bold block">[FAQ_INDEX]</span>
            <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter">
              Frequently Asked Questions
            </h2>
            <p className="font-sans text-lg text-on-surface-variant">
              Common questions about our estimating process, turnaround times, and how the top construction and estimation company in the industry supports your next project.
            </p>
          </div>
          <FAQAccordion />
        </div>
      </Reveal>
    </div>
  );
}
