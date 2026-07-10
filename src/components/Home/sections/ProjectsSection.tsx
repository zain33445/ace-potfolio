import Reveal from '../../../components/Reveal';
import ProjectPortfolio from '../../../components/ProjectPortfolio';

export default function ProjectsSection() {
  return (
<div
  id="projects"
  className="pt-18 bg-background border-b border-blueprint-line relative"
>
  <Reveal type="fadeUp">
    <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

    <div className="container mx-auto max-w-7xl md:px-16">
      <div className="grid lg:grid-cols-[380px_1fr] gap-16 items-center">
        {/* Left Side */}
        <div className="flex flex-col justify-center h-full space-y-3">
          <span className="font-mono text-xs text-primary block font-bold">
            [PORTFOLIO]
          </span>

          <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tight">
            Executed Takeoffs
          </h2>

          <p className="font-sans text-sm text-on-surface-variant max-w-md">
            Review certified schematics and bills of quantities delivered
            across the nation. Click any item card to audit operational
            parameters.
          </p>
        </div>

        {/* Right Side */}
        <div className="flex justify-center items-center">
          <ProjectPortfolio />
        </div>
      </div>
    </div>
  </Reveal>
</div>
  );
}
