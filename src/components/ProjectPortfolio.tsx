import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Clock, CircleDot, ChevronRight, Layers } from 'lucide-react';
import { ProjectScope } from '../types';

export default function ProjectPortfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const projects: ProjectScope[] = [
    {
      id: 'P-042',
      name: 'Fellas Car Wash Multi-Site Takeoff',
      category: 'COMMERCIAL',
      scope: 'Full Takeoff & Framing Survey',
      turnaroundHours: 48,
      totalAreaSqFt: 18500,
      estimatedCost: 2450000,
      description: 'Parametric quantity estimate spanning three high-throughput mechanical vehicle corridors. Successfully verified for zoning and foundation slab loading factors.'
    },
    {
      id: 'P-089',
      name: 'Sauce\'d House Industrial Kitchen',
      category: 'HOSPITALITY',
      scope: 'MEP Takeoff & Commercial HVAC',
      turnaroundHours: 36,
      totalAreaSqFt: 12000,
      estimatedCost: 1850000,
      description: 'Rigorous calculation of mechanical, plumbing ventilation, and fire safety systems. Integrated gas connection offsets mapped to state administrative criteria.'
    },
    {
      id: 'P-112',
      name: 'HTeaO Beverages Franchise Design',
      category: 'RETAIL',
      scope: 'Structural Concrete Eval & Stamping',
      turnaroundHours: 24,
      totalAreaSqFt: 8500,
      estimatedCost: 950000,
      description: 'Rapid turnaround design check for light foundation framework and water intake systems. Prepared complete permit drawing sheets ready for municipal review.'
    },
    {
      id: 'P-156',
      name: 'Lake Arlington Civic Center Branch',
      category: 'MUNICIPAL',
      scope: 'Comprehensive CSI Division Takeoff',
      turnaroundHours: 72,
      totalAreaSqFt: 45000,
      estimatedCost: 12500000,
      description: 'State audited development. Structured all 50 structural engineering divisions under CSI MasterFormat, passing local architectural inspection with zero revisions.'
    },
    {
      id: 'P-171',
      name: 'Crestfield Commercial Warehousing',
      category: 'COMMERCIAL',
      scope: 'Steel Structural & Roofing Survey',
      turnaroundHours: 48,
      totalAreaSqFt: 85000,
      estimatedCost: 18200000,
      description: 'Detailed quantity assessment of architectural trusses, deck metal panels, and massive pile foundations, optimized for seismic activity calculations.'
    },
    {
      id: 'P-202',
      name: 'The Vista Luxury Boutique Hotel',
      category: 'HOSPITALITY',
      scope: 'Permit Drawing Check & Stamping',
      turnaroundHours: 48,
      totalAreaSqFt: 35000,
      estimatedCost: 9800000,
      description: 'Structural framing review for fire-rated partitions and sound attenuation layers. Certified and delivered fully stamped blueprints in full municipal alignment.'
    }
  ];

  const categories = ['ALL', 'COMMERCIAL', 'HOSPITALITY', 'RETAIL', 'MUNICIPAL'];

  const filteredProjects = projects.filter(p => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-8" id="projects">
      {/* Filters Hub */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-surface p-4 border border-blueprint-line bracket-corners">
        {/* Category pills */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-all duration-200 bracket-corners ${
                selectedCategory === cat
                  ? 'bg-primary text-white border border-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-primary border border-transparent hover:border-blueprint-line bg-background'
              }`}
            >
              [{cat === 'ALL' ? 'ALL_PROJECTS' : cat}_{String(i).padStart(2, '0')}]
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-blueprint-line focus:border-primary focus:ring-0 pl-10 pr-4 py-2 font-mono text-xs outline-none transition-colors"
            placeholder="SEARCH DATABASE ID, NAME..."
          />
          <Search className="w-4 h-4 text-on-surface-variant absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((p) => {
          const isExpanded = activeProjectId === p.id;
          return (
            <div
              key={p.id}
              className="border border-blueprint-line bg-surface p-6 bracket-corners flex flex-col justify-between hover:border-primary transition-all duration-300 group cursor-pointer"
              onClick={() => setActiveProjectId(isExpanded ? null : p.id)}
            >
              <div>
                <div className="font-mono text-xs text-on-surface-variant mb-4 flex justify-between items-center">
                  <span className="bg-background px-2.5 py-1 border border-blueprint-line font-medium text-on-background">
                    ID: {p.id}
                  </span>
                  <span className="text-primary font-bold text-[10px] tracking-widest uppercase">
                    {p.category}
                  </span>
                </div>

                <h3 className="font-space text-lg font-bold text-on-background group-hover:text-primary transition-colors my-2 h-12 flex items-center">
                  {p.name}
                </h3>
                
                <div className="h-px w-full bg-blueprint-line my-4 group-hover:bg-primary transition-colors" />

                <div className="grid grid-cols-2 gap-4 font-mono text-[10px] text-on-surface-variant mb-4">
                  <div>
                    <span className="block text-primary uppercase font-bold text-[9px]">SCOPE OF WORK</span>
                    <span className="text-on-background font-sans font-medium">{p.scope}</span>
                  </div>
                  <div>
                    <span className="block text-primary uppercase font-bold text-[9px]">TURNAROUND</span>
                    <span className="text-on-background font-sans font-medium">{p.turnaroundHours} Hours</span>
                  </div>
                </div>
              </div>

              {/* Collapsible expanded detail */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden bg-background p-4 border border-dashed border-blueprint-line bracket-corners my-3 font-sans text-xs text-on-surface-variant space-y-2.5"
                  >
                    <p className="leading-relaxed font-medium">{p.description}</p>
                    <div className="flex border-t border-dashed border-blueprint-line pt-2 justify-between font-mono text-[9px] text-on-surface-variant">
                      <span>Area: {p.totalAreaSqFt.toLocaleString()} SF</span>
                      <span>Est. Volume: ${(p.estimatedCost / 1000000).toFixed(1)}M</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-4 pt-2 border-t border-blueprint-line/40 flex justify-between items-center font-mono text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
                <span>{isExpanded ? 'COLLAPSE PARAMETERS' : 'EXPAND PROJECT SCHEMATIC'}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-16 border border-blueprint-line bg-surface bracket-corners font-mono text-xs text-on-surface-variant">
          [ZERO_RECORDS_MATCH_SEARCH_CRITERIA]
        </div>
      )}
    </div>
  );
}
