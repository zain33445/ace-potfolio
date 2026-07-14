'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight } from 'lucide-react';
import { ProjectScope } from '../types';
import {
  DraggableCardContainer,
  DraggableCardBody,
} from './ui/draggable-card';

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
      description: 'Parametric quantity estimate spanning three high-throughput mechanical vehicle corridors. Successfully verified for zoning and foundation slab loading factors.',
    },
    {
      id: 'P-089',
      name: "Sauce'd House Industrial Kitchen",
      category: 'HOSPITALITY',
      scope: 'MEP Takeoff & Commercial HVAC',
      turnaroundHours: 36,
      totalAreaSqFt: 12000,
      estimatedCost: 1850000,
      description: 'Rigorous calculation of mechanical, plumbing ventilation, and fire safety systems. Integrated gas connection offsets mapped to state administrative criteria.',
    },
    {
      id: 'P-112',
      name: 'HTeaO Beverages Franchise Design',
      category: 'RETAIL',
      scope: 'Structural Concrete Eval & Stamping',
      turnaroundHours: 24,
      totalAreaSqFt: 8500,
      estimatedCost: 950000,
      description: 'Rapid turnaround design check for light foundation framework and water intake systems. Prepared complete permit drawing sheets ready for municipal review.',
    },
    {
      id: 'P-156',
      name: 'Lake Arlington Civic Center Branch',
      category: 'MUNICIPAL',
      scope: 'Comprehensive CSI Division Takeoff',
      turnaroundHours: 72,
      totalAreaSqFt: 45000,
      estimatedCost: 12500000,
      description: 'State audited development. Structured all 50 structural engineering divisions under CSI MasterFormat, passing local architectural inspection with zero revisions.',
    },
    {
      id: 'P-171',
      name: 'Crestfield Commercial Warehousing',
      category: 'COMMERCIAL',
      scope: 'Steel Structural & Roofing Survey',
      turnaroundHours: 48,
      totalAreaSqFt: 85000,
      estimatedCost: 18200000,
      description: 'Detailed quantity assessment of architectural trusses, deck metal panels, and massive pile foundations, optimized for seismic activity calculations.',
    },
    {
      id: 'P-202',
      name: 'The Vista Luxury Boutique Hotel',
      category: 'HOSPITALITY',
      scope: 'Permit Drawing Check & Stamping',
      turnaroundHours: 48,
      totalAreaSqFt: 35000,
      estimatedCost: 9800000,
      description: 'Structural framing review for fire-rated partitions and sound attenuation layers. Certified and delivered fully stamped blueprints in full municipal alignment.',
    },
  ];

  const cardPositions = [
    'absolute top-0 left-[15%] rotate-[-5deg]',
    'absolute top-5 left-[0%] rotate-[7deg]',
    'absolute top-0 right-[10%] rotate-[-8deg]',
    'absolute top-5 right-[25%] rotate-[10deg]',
    'absolute top-0 right-[45%] rotate-[3deg]',
    'absolute top-0 right-[65%] rotate-[-4deg]',
  ];

  const filteredProjects = projects.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.scope.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="" id="projects">
      {/* Draggable Card Stack */}
      <DraggableCardContainer className="relative min-h-[520px]">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border border-blueprint-line bg-surface bracket-corners font-mono text-xs text-on-surface-variant">
            [ZERO_RECORDS_MATCH_SEARCH_CRITERIA]
          </div>
        ) : (
          filteredProjects.map((p, idx) => {
            const isExpanded = activeProjectId === p.id;
            return (
              <DraggableCardBody
                key={p.id}
                className={cardPositions[idx % cardPositions.length]}
              >
                <div
                  onClick={() => setActiveProjectId(isExpanded ? null : p.id)}
                  className="w-72 border border-blueprint-line bg-surface p-6 bracket-corners flex flex-col justify-between hover:border-primary transition-all duration-300 cursor-pointer group"
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

                    <h3 className="font-space text-base font-bold text-on-background group-hover:text-primary transition-colors my-2">
                      {p.name}
                    </h3>

                    <div className="h-px w-full bg-blueprint-line my-3 group-hover:bg-primary transition-colors" />

                    <div className="grid grid-cols-2 gap-3 font-mono text-[10px] text-on-surface-variant mb-3">
                      <div>
                        <span className="block text-primary uppercase font-bold text-[10px]">SCOPE OF WORK</span>
                        <span className="text-on-background font-sans font-medium">{p.scope}</span>
                      </div>
                      <div>
                        <span className="block text-primary uppercase font-bold text-[10px]">TURNAROUND</span>
                        <span className="text-on-background font-sans font-medium">{p.turnaroundHours} Hours</span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-background p-4 border border-dashed border-blueprint-line bracket-corners my-3 font-sans text-xs text-on-surface-variant space-y-2.5"
                      >
                        <p className="leading-relaxed font-medium">{p.description}</p>
                        <div className="flex border-t border-dashed border-blueprint-line pt-2 justify-between font-mono text-[10px] text-on-surface-variant">
                          <span>Area: {p.totalAreaSqFt.toLocaleString()} SF</span>
                          <span>Est. Volume: ${(p.estimatedCost / 1000000).toFixed(1)}M</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-3 pt-2 border-t border-blueprint-line/40 flex justify-between items-center font-mono text-[10px] text-on-surface-variant group-hover:text-primary transition-colors">
                    <span>{isExpanded ? 'COLLAPSE PARAMETERS' : 'EXPAND PROJECT SCHEMATIC'}</span>
                    <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </DraggableCardBody>
            );
          })
        )}
      </DraggableCardContainer>
    </div>
  );
}
