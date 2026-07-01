import Section from '../../../components/Section';
import Reveal from '../../../components/Reveal';
import ProjectPortfolio from '../../../components/ProjectPortfolio';

export default function ProjectsSection() {
  return (
    <Section sectionId="projects" className="py-24 bg-background border-b border-blueprint-line relative overflow-y-auto">
      <Reveal type="fadeUp">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />
        <div className="px-6 md:px-16 mb-12 space-y-3">
          <span className="font-mono text-xs text-primary block font-bold">[PORTFOLIO_DATA_VAULT]</span>
          <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tight">Executed Takeoffs Database</h2>
          <p className="font-sans text-sm text-on-surface-variant max-w-xl">Review certified schematics and bills of quantities delivered across the nation. Click any item card to audit operational parameters.</p>
        </div>
        <div className="px-6 md:px-16 container mx-auto max-w-7xl">
          <ProjectPortfolio />
        </div>
      </Reveal>
    </Section>
  );
}
