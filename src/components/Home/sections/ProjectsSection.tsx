import Link from 'next/link';
import Image from 'next/image';
import Reveal from '../../../components/Reveal';
import { getAllProjects } from '../../../data/projects';

export default function ProjectsSection() {
  const projects = getAllProjects().slice(0, 4); // Show first 4 on homepage

  return (
    <div
      id="projects"
      className="py-18 bg-background border-b border-blueprint-line relative"
    >
      <Reveal type="fadeUp">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="container mx-auto max-w-7xl md:px-16 px-6">
          <div className="flex flex-col gap-12">
            {/* Header */}
            <div className="flex flex-col space-y-3">
              <span className="font-mono text-xs text-primary block font-bold">
                [PORTFOLIO]
              </span>

              <h2 className="font-space text-3xl md:text-4xl font-extrabold text-on-background tracking-tight">
                Executed Takeoffs
              </h2>

              <p className="font-sans text-sm text-on-surface-variant max-w-md">
                Review certified schematics and bills of quantities delivered
                across the nation. Click any project for the full cost breakdown.
              </p>
            </div>

            {/* Project Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group flex flex-col border border-blueprint-line bg-surface transition-all duration-300 hover:border-primary hover:shadow-[0_0_30px_rgba(255,107,0,0.08)] bracket-corners hover-brackets overflow-hidden"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      className="object-cover brightness-[1.1] transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div
                      className="pointer-events-none absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute left-3 top-3 border border-white/20 bg-black/50 px-2 py-1 font-mono text-[9px] font-bold tracking-wider text-white/80 backdrop-blur-sm">
                      {project.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col p-4">
                    <h3 className="font-space text-sm font-bold leading-snug text-on-background transition-colors group-hover:text-primary line-clamp-2">
                      {project.title}
                    </h3>
                    <p className="mt-1 font-mono text-[9px] text-on-surface-variant">
                      {project.location}
                    </p>
                    <div className="my-2 h-px w-full bg-blueprint-line transition-colors group-hover:bg-primary" />
                    <div className="flex items-center justify-between font-mono text-[9px] text-on-surface-variant">
                      <span>{project.totalAreaSqFt.toLocaleString()} SF</span>
                      <span className="text-primary font-bold">
                        ${(project.estimatedCost / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* View All Link */}
            <div className="flex justify-center mt-4">
              <Link
                href="/projects"
                className="group/btn inline-flex items-center gap-2 border border-blueprint-line bg-transparent px-6 py-3 font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary"
              >
                <span>VIEW ALL PROJECTS</span>
                <svg
                  className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
