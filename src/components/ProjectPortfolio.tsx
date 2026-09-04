'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronRight, Filter } from 'lucide-react';
import { ProjectDetail } from '@/src/types';
import { getAllProjects, getProjectFilterOptions } from '@/src/data/projects';
import {
  DraggableCardContainer,
  DraggableCardBody,
} from './ui/draggable-card';

export default function ProjectPortfolio() {
  const projects = getAllProjects();
  const filterOptions = getProjectFilterOptions();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedScopeGroup, setSelectedScopeGroup] = useState<string>('ALL');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedCsiDivision, setSelectedCsiDivision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);

  const scopeGroups = ['ALL', 'Estimation', 'Permit Sets', 'Shop Drawings', '3D Renderings', 'Civil Plans'];

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

      const matchesScopeGroup = selectedScopeGroup === 'ALL' || (() => {
        switch (selectedScopeGroup) {
          case 'Estimation':
            return p.hasEstimate && (p.category === 'GENERAL CONTRACTOR' || p.category === 'SUB CONTRACTORS');
          case 'Permit Sets':
            return p.category === 'PERMIT SETS';
          case 'Shop Drawings':
            return p.category === 'SHOP DRAWINGS';
          case '3D Renderings':
            return p.category === '3D RENDERS';
          case 'Civil Plans':
            return false;
          default:
            return true;
        }
      })();

      const matchesLocation = selectedLocation === 'ALL' || p.location === selectedLocation;
      const matchesState = selectedState === 'ALL' || p.state === selectedState;

      const matchesCsiDivision = selectedCsiDivision === 'ALL' || p.csiDivisions?.includes(selectedCsiDivision);

      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesScopeGroup && matchesLocation && matchesState && matchesCsiDivision && matchesSearch;
    });
  }, [projects, selectedCategory, selectedScopeGroup, selectedLocation, selectedState, selectedCsiDivision, searchQuery]);

  const cardPositions = [
    'absolute top-0 left-[15%] rotate-[-5deg]',
    'absolute top-5 left-[0%] rotate-[7deg]',
    'absolute top-0 right-[10%] rotate-[-8deg]',
    'absolute top-5 right-[25%] rotate-[10deg]',
    'absolute top-0 right-[45%] rotate-[3deg]',
    'absolute top-0 right-[65%] rotate-[-4deg]',
  ];

  const activeFilterCount = [
    selectedCategory !== 'ALL',
    selectedScopeGroup !== 'ALL',
    selectedLocation !== 'ALL',
    selectedState !== 'ALL',
    selectedCsiDivision !== 'ALL',
  ].filter(Boolean).length;

  return (
    <div className="" id="projects">
      {/* Filter Bar */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Filter className="w-4 h-4 text-primary" />
          <span className="font-mono text-xs text-primary uppercase font-bold tracking-widest">Filters</span>
          {activeFilterCount > 0 && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedScopeGroup('ALL');
                setSelectedLocation('ALL');
                setSelectedState('ALL');
                setSelectedCsiDivision('ALL');
              }}
              className="font-mono text-xs text-on-surface-variant hover:text-primary transition-colors underline"
            >
              Clear all ({activeFilterCount})
            </button>
          )}
        </div>

        {/* Category + Scope Group */}
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background border border-blueprint-line px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-on-surface-variant bracket-corners focus:border-primary outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="GENERAL CONTRACTOR">General Contractor</option>
            <option value="SUB CONTRACTORS">Sub Contractors</option>
            <option value="3D RENDERS">3D Renders</option>
            <option value="PERMIT SETS">Permit Sets</option>
            <option value="SHOP DRAWINGS">Shop Drawings</option>
          </select>

          <select
            value={selectedScopeGroup}
            onChange={(e) => setSelectedScopeGroup(e.target.value)}
            className="bg-background border border-blueprint-line px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-on-surface-variant bracket-corners focus:border-primary outline-none"
          >
            <option value="ALL">All Scope Groups</option>
            <option value="Estimation">Estimation</option>
            <option value="Permit Sets">Permit Sets</option>
            <option value="Shop Drawings">Shop Drawings</option>
            <option value="3D Renderings">3D Renderings</option>
            <option value="Civil Plans">Civil Plans</option>
          </select>
        </div>

        {/* Dynamic Filters */}
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-primary uppercase tracking-widest">Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="bg-background border border-blueprint-line px-3 py-1.5 font-mono text-xs text-on-surface-variant bracket-corners focus:border-primary outline-none min-w-[120px]"
            >
              <option value="ALL">All Locations</option>
              {filterOptions.locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-primary uppercase tracking-widest">State</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-background border border-blueprint-line px-3 py-1.5 font-mono text-xs text-on-surface-variant bracket-corners focus:border-primary outline-none min-w-[120px]"
            >
              <option value="ALL">All States</option>
              {filterOptions.states.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] text-primary uppercase tracking-widest">CSI Division</label>
            <select
              value={selectedCsiDivision}
              onChange={(e) => setSelectedCsiDivision(e.target.value)}
              className="bg-background border border-blueprint-line px-3 py-1.5 font-mono text-xs text-on-surface-variant bracket-corners focus:border-primary outline-none min-w-[200px]"
            >
              <option value="ALL">All CSI Divisions</option>
              {filterOptions.csiDivisions.map((div) => (
                <option key={div} value={div}>{div}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-background border border-blueprint-line pl-9 pr-4 py-2 font-mono text-xs text-on-surface-variant bracket-corners focus:border-primary outline-none"
          />
        </div>
      </div>

      {/* Results count */}
      <div className="font-mono text-xs text-on-surface-variant mb-4">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>

      {/* Draggable Card Stack */}
      <DraggableCardContainer className="relative min-h-[520px]">
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 border border-blueprint-line bg-surface bracket-corners font-mono text-sm text-on-surface-variant">
            No Results Found
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
                    <div className="font-mono text-sm text-on-surface-variant mb-4 flex justify-between items-center">
                      <span className="bg-background px-2.5 py-1 border border-blueprint-line font-medium text-on-background">
                        ID: {p.id}
                      </span>
                      <span className="text-primary font-bold text-xs tracking-widest uppercase">
                        {p.category}
                      </span>
                    </div>

                    <h3 className="font-space text-lg font-bold text-on-background group-hover:text-primary transition-colors my-2">
                      {p.title}
                    </h3>

                    <div className="h-px w-full bg-blueprint-line my-3 group-hover:bg-primary transition-colors" />

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs text-on-surface-variant mb-3">
                      <div>
                        <span className="block text-primary uppercase font-bold text-xs">SCOPE</span>
                        <span className="text-on-background font-sans font-medium">{p.scope.join(', ')}</span>
                      </div>
                      <div>
                        <span className="block text-primary uppercase font-bold text-xs">TURNAROUND</span>
                        <span className="text-on-background font-sans font-medium">{p.totalAreaSqFt.toLocaleString()} SF</span>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-background p-4 border border-dashed border-blueprint-line bracket-corners my-3 font-sans text-sm text-on-surface-variant space-y-2.5"
                      >
                        <p className="leading-relaxed font-medium">{p.description}</p>
                        <div className="flex border-t border-dashed border-blueprint-line pt-2 justify-between font-mono text-xs text-on-surface-variant">
                          <span>Area: {p.totalAreaSqFt.toLocaleString()} SF</span>
                          <span>Est. Volume: ${(p.estimatedCost / 1000000).toFixed(1)}M</span>
                        </div>
                        {p.csiDivisions && p.csiDivisions.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.csiDivisions.map((div) => (
                              <span key={div} className="px-1.5 py-0.5 bg-background border border-blueprint-line text-[10px] font-mono text-on-surface-variant">
                                {div}
                              </span>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-3 pt-2 border-t border-blueprint-line/40 flex justify-between items-center font-mono text-xs text-on-surface-variant group-hover:text-primary transition-colors">
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
