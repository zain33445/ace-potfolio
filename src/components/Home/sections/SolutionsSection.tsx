import Reveal from "../../Reveal";
import ServicesDashboard from "./ServicesDashboard";

export default function SolutionsSection() {
  return (
    <section
      id="solutions"
      className="relative bg-background border-b border-blueprint-line"
      aria-label="Core Service Solutions"
    >
      <div className="w-full max-w-8xl mx-auto px-6 md:px-16 py-24 flex flex-col">
        {/* Heading */}
        <Reveal type="fadeUp" className="text-left space-y-2 mb-6 m-auto w-7xl">
          <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tighter">
            Core Service
          </h2>
          <p className="font-sans text-lg text-on-surface-variant max-w-2xl">
            As a top construction and estimation company, The ACE Services
            operates across four specialized divisions engineered to deliver
            highly reliable pricing models, architectural reviews, and
            full-lifecycle project support, all built to fit tight bid schedule
            pipelines.
          </p>
        </Reveal>
        <Reveal type="fadeUp" delay={0.15}>
          <ServicesDashboard />
        </Reveal>
      </div>
    </section>
  );
}
