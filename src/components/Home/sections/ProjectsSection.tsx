'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import Reveal from '../../../components/Reveal';
import { getAllProjects, getProjectCategories } from '@/src/data/projects';

const Masonry = dynamic(() => import('../../../components/ui/mosonry'), {
  ssr: false,
});

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toLocaleString()}`;
}

const CATEGORY_COLORS: Record<string, string> = {
  'GENERAL CONTRACTOR': 'bg-primary/15 text-primary border-primary/30',
  'SUB CONTRACTORS': 'bg-[#a3a3a3]/15 text-[#a3a3a3] border-[#a3a3a3]/30',
  '3D RENDERS': 'bg-[#8b5cf6]/15 text-[#a78bfa] border-[#8b5cf6]/30',
  'PERMIT SETS': 'bg-[#f59e0b]/15 text-[#fbbf24] border-[#f59e0b]/30',
  'SHOP DRAWINGS': 'bg-[#10b981]/15 text-[#34d399] border-[#10b981]/30',
};

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [estimatesSubFilter, setEstimatesSubFilter] = useState<'all' | 'gc' | 'sub'>('all');
  const allProjects = useMemo(() => getAllProjects(), []);
  const categories = useMemo(() => getProjectCategories(), []);

  // Below sm the grid is 3 narrow columns, so the tall desktop heights would
  // read as thin ribbons — use short tiles on phones, leave desktop untouched.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'ALL') {
      return [...allProjects].reverse().slice(0, 9);
    }
    if (activeCategory === 'Estimates') {
      const filtered = allProjects.filter((p) => {
        const cat = p.category.toLocaleLowerCase();
        if (estimatesSubFilter === 'gc') return cat === 'general contractor';
        if (estimatesSubFilter === 'sub') return cat === 'sub contractors';
        return cat === 'general contractor' || cat === 'sub contractors';
      });
      return [...filtered].reverse().slice(0, 9);
    }
    return [...allProjects.filter((p) => p.category === activeCategory)].reverse().slice(0, 9);
  }, [allProjects, activeCategory, estimatesSubFilter]);

  const masonryItems = useMemo(
    () =>
      filteredProjects.map((p) => ({
        id: p.id,
        img: p.imageUrl,
        url: `/projects/${p.slug}`,
        height: isMobile
          ? Math.floor(Math.random() * 91) + 190
          : Math.floor(Math.random() * 601) + 400,
      })),
    [filteredProjects, isMobile],
  );

  return (
    <section
      id="projects"
      className={`py-18 bg-background border-b border-blueprint-line relative `}
      aria-label="Our Projects"
    >
      <Reveal type="fadeUp">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        <div className="container mx-auto max-w-7xl md:px-16 px-6">
          <div className="flex flex-col gap-12 w-full max-w-7xl mb-12">
            {/* Header */}
            <div className="flex flex-col space-y-3">
              <span className="font-mono text-sm text-primary block font-bold">
                Portfolio
              </span>

              <h2 className="font-space text-4xl md:text-5xl font-extrabold text-on-background tracking-tight">
                Executed Takeoffs
              </h2>

              <p className="font-sans text-lg text-on-surface-variant max-w-4xl">
                Review certified schematics and bills of quantities delivered
                nationwide by our construction estimation and quantity surveying
                teams. Every listed project reflects the accuracy standard that
                makes The ACE Services a top construction and estimation company
                for general contractors across the U.S. Click any project below
                for the full cost breakdown.
              </p>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat;
                  const count =
                    cat === 'ALL'
                      ? allProjects.length
                      : cat === 'Estimates'
                      ? allProjects.filter((p) => p.category.toLocaleLowerCase() === 'general contractor' || p.category.toLocaleLowerCase() === 'sub contractors').length
                      : allProjects.filter((p) => p.category === cat).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        if (cat !== 'Estimates') setEstimatesSubFilter('all');
                      }}
                     className={`font-mono text-sm font-bold uppercase tracking-wider px-4 py-2 border-b-2 transition-all duration-500 ease-in-out ${
    isActive
      ? 'border-b-primary text-black'
      : 'border-b-transparent bg-transparent text-on-surface-variant  hover:text-primary'
  }`}
                    >
                      {cat}
                      <span className="ml-1.5 opacity-60">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Estimates Sub-Filter Select */}
              {activeCategory === 'Estimates' && (
                <select
                  value={estimatesSubFilter}
                  onChange={(e) => setEstimatesSubFilter(e.target.value as 'all' | 'gc' | 'sub')}
                  className="ml-auto font-mono text-sm font-bold uppercase tracking-wider px-3 py-2 border border-blueprint-line bg-transparent text-on-surface-variant rounded-none appearance-none cursor-pointer hover:border-primary focus:border-primary focus:outline-none transition-colors duration-300"
                >
                  <option value="all">All Estimates</option>
                  <option value="gc">GC Only</option>
                  <option value="sub">Sub Only</option>
                </select>
              )}
            </div>


          </div>
        </div>
      </Reveal>
                  {/* Masonry Grid */}
            <div className="my-10 max-w-7xl mx-auto min-h-[400px] px-4 md:px-0">
              <Masonry
                key={`${activeCategory}-${estimatesSubFilter}`}
                items={masonryItems}
                columns={{
                  "(min-width:1024px)": 3,
                  "(min-width:640px)": 3,
                  "(min-width:0px)": 3,
                }}
                stagger={0.2}
                 ease="sine.out"
                duration={2}
                animateFrom="bottom"
                blurToFocus
                scaleOnHover
                hoverScale={1.15}
                renderItem={(item) => {
                  const project = filteredProjects.find((p) => p.id === item.id);
                  if (!project) return null;

                  const colorClass =
                    CATEGORY_COLORS[project.category] ??
                    'bg-[#a3a3a3]/15 text-[#a3a3a3] border-[#a3a3a3]/30';

                  return (
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group relative block w-full h-full overflow-hidden rounded-[10px] bg-surface transition-all duration-300 hover:border-primary hover:shadow-[0_0_40px_rgba(255,107,0,0.1)]"

                    >
                      {/* Image */}
                      <div className="relative w-full h-full overflow-hidden">
                        <Image
                          src={project.imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover brightness-[1.25] contrast-[1.05] transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />

                        {/* Scanline overlay */}
                        <div
                          className="pointer-events-none absolute inset-0 opacity-20"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px)',
                          }}
                        />

                        {/* Dark gradient overlay — always visible */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Hover overlay with project details */}
                        <div className="absolute inset-0 z-20 flex flex-col justify-end p-5 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <h3 className="font-[family-name:var(--font-space)] text-xl font-bold text-white leading-snug mb-1">
                            {project.title}
                          </h3>
                          <p className="font-mono text-xs text-white/70 mb-3">
                            {project.location}
                          </p>

                          <div className="h-px w-full bg-white/20 mb-3" />

                          {/* Scope */}
                          <div className="mb-2">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                              SCOPE:
                            </span>
                            <p className="mt-0.5 font-sans text-xs text-white/80">
                              {project.scope.join(' + ')}
                            </p>
                          </div>

                          {/* Size */}
                          <div className="mb-3">
                            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                              SIZE:
                            </span>
                            <p className="mt-0.5 font-sans text-xs text-white/80">
                              {project.totalAreaSqFt.toLocaleString()} SF
                            </p>
                          </div>

                          {/* View button */}
                          <div className="inline-flex items-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-white w-fit">
                            <span>VIEW CASE STUDY</span>
                            <svg
                              className="h-3 w-3"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }}
              />
            </div>

            {/* View All Link */}
            <div className="flex justify-center ">
              <Link
                href="/projects"
                className="group/btn inline-flex items-center gap-2 border border-blueprint-line bg-transparent px-6 py-3 font-mono text-sm font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:border-primary hover:text-primary"
              >
                <span>VIEW ALL PROJECTS</span>
                <svg
                  className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
    </section>
  );
}
