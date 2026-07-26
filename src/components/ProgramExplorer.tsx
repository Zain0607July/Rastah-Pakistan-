import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  SlidersHorizontal,
  LayoutGrid,
  List,
  RotateCcw,
  Sparkles,
  Building2,
  ArrowUpDown
} from 'lucide-react';
import {
  EnrichedProgram,
  DegreeLevel,
  Province,
  Sector,
  Category,
  FilterState
} from '../types';
import { ProgramCard } from './ProgramCard';
import { FeeMatrix } from './FeeMatrix';
import { DataVerificationDisclaimerBanner } from './DataVerificationDisclaimerBanner';

interface ProgramExplorerProps {
  programs: EnrichedProgram[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProvince: Province | 'All';
  setSelectedProvince: (p: Province | 'All') => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  comparedIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectProgram: (program: EnrichedProgram) => void;
  onOpenAdvisor: () => void;
}

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'Computer Science & IT',
  'Engineering & Tech',
  'Business & Finance',
  'Medical & Health',
  'Social Sciences',
  'Natural Sciences'
];

export const ProgramExplorer: React.FC<ProgramExplorerProps> = ({
  programs,
  searchQuery,
  setSearchQuery,
  selectedProvince,
  setSelectedProvince,
  bookmarkedIds,
  onToggleBookmark,
  comparedIds,
  onToggleCompare,
  onSelectProgram,
  onOpenAdvisor
}) => {
  const [degreeLevel, setDegreeLevel] = useState<DegreeLevel | 'All'>('All');
  const [sector, setSector] = useState<Sector | 'All'>('All');
  const [category, setCategory] = useState<Category | 'All'>('All');
  const [maxFeeSemester, setMaxFeeSemester] = useState<number>(1000000);
  const [sortBy, setSortBy] = useState<'fee-low' | 'fee-high' | 'name' | 'marks-low' | 'duration'>('fee-low');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showFiltersMobile, setShowFiltersMobile] = useState<boolean>(false);

  // Autosuggestion options
  const suggestions = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    const set = new Set<string>();
    programs.forEach((p) => {
      if (p.name.toLowerCase().includes(q)) set.add(p.name);
      if (p.university.name.toLowerCase().includes(q)) set.add(p.university.name);
      if (p.university.shortName.toLowerCase().includes(q)) set.add(p.university.shortName);
    });
    return Array.from(set).slice(0, 5);
  }, [searchQuery, programs]);

  // Filter & Sort Logic
  const filteredPrograms = useMemo(() => {
    return programs
      .filter((p) => {
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.name.toLowerCase().includes(q);
          const matchUni = p.university.name.toLowerCase().includes(q) || p.university.shortName.toLowerCase().includes(q);
          const matchCity = p.university.city.toLowerCase().includes(q);
          const matchJobs = p.commonPublicJobs.some((j) => j.toLowerCase().includes(q));
          if (!matchName && !matchUni && !matchCity && !matchJobs) return false;
        }

        // Degree Level
        if (degreeLevel !== 'All' && p.degreeLevel !== degreeLevel) return false;

        // Province
        if (selectedProvince !== 'All' && p.university.province !== selectedProvince) return false;

        // Sector
        if (sector !== 'All' && p.university.sector !== sector) return false;

        // Category
        if (category !== 'All' && p.category !== category) return false;

        // Max fee
        if (p.feePerSemester > maxFeeSemester) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'fee-low') return a.feePerSemester - b.feePerSemester;
        if (sortBy === 'fee-high') return b.feePerSemester - a.feePerSemester;
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'marks-low') return a.minPercentageRequired - b.minPercentageRequired;
        if (sortBy === 'duration') return a.durationYears - b.durationYears;
        return 0;
      });
  }, [programs, searchQuery, degreeLevel, selectedProvince, sector, category, maxFeeSemester, sortBy]);

  const resetFilters = () => {
    setSearchQuery('');
    setDegreeLevel('All');
    setSelectedProvince('All');
    setSector('All');
    setCategory('All');
    setMaxFeeSemester(1000000);
    setSortBy('fee-low');
  };

  return (
    <div className="space-y-6">
      {/* Control Bar & Filter Summary */}
      <div className="bg-[#F9F8F6] border border-black/10 p-5 space-y-4 font-sans">
        {/* Degree Level Tabs & Layout Toggle */}
        <div className="flex items-center justify-between flex-wrap gap-3 pb-3 border-b border-black/10">
          <div className="flex items-center gap-2">
            {(['All', 'Bachelor', 'Master'] as (DegreeLevel | 'All')[]).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDegreeLevel(lvl)}
                className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                  degreeLevel === lvl
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-black/5 text-black/70 hover:text-black'
                }`}
              >
                {lvl === 'All' ? 'ALL DEGREES' : `${lvl.toUpperCase()}'S`}
              </button>
            ))}
          </div>

          {/* View Toggle & Filter Mobile Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="md:hidden flex items-center gap-1.5 px-3 py-1.5 border border-black/20 text-xs font-bold uppercase tracking-wider text-black bg-white"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-1 bg-black/5 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#1E3A8A] font-bold shadow-xs'
                    : 'text-black/50 hover:text-black'
                }`}
                title="Grid Cards View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 transition-colors ${
                  viewMode === 'table'
                    ? 'bg-white text-[#1E3A8A] font-bold shadow-xs'
                    : 'text-black/50 hover:text-black'
                }`}
                title="Fee Comparison Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className={`space-y-4 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* Sector */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-black/40">Sector</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value as Sector | 'All')}
                className="bg-transparent border-b border-black/20 py-1.5 text-xs font-semibold text-black outline-none focus:border-[#1E3A8A]"
              >
                <option value="All">Public & Private</option>
                <option value="Public">Public Sector</option>
                <option value="Private">Private Sector</option>
              </select>
            </div>

            {/* Category */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-black/40">Discipline / Field</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category | 'All')}
                className="bg-transparent border-b border-black/20 py-1.5 text-xs font-semibold text-black outline-none focus:border-[#1E3A8A]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase font-bold text-black/40">Sort Order</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent border-b border-black/20 py-1.5 text-xs font-semibold text-black outline-none focus:border-[#1E3A8A] cursor-pointer"
              >
                <option value="fee-low">Fee (Low to High)</option>
                <option value="fee-high">Fee (High to Low)</option>
                <option value="marks-low">Min Marks Required</option>
                <option value="name">Program Name (A-Z)</option>
                <option value="duration">Program Duration</option>
              </select>
            </div>

            {/* Max Semester Fee Filter */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[10px] uppercase font-bold text-black/40">
                <span>Max Semester Fee</span>
                <span className="text-[#1E3A8A] font-bold">
                  {maxFeeSemester >= 1000000 ? 'Any Budget' : `PKR ${maxFeeSemester.toLocaleString()}`}
                </span>
              </div>
              <input
                type="range"
                min="30000"
                max="1000000"
                step="20000"
                value={maxFeeSemester}
                onChange={(e) => setMaxFeeSemester(Number(e.target.value))}
                className="w-full accent-[#1E3A8A] cursor-pointer h-1.5 bg-black/10 mt-2"
              />
            </div>
          </div>

          {/* Category Quick Chips */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] uppercase font-bold text-[#C5A059] mr-1">Discipline:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase transition-colors ${
                  category === cat
                    ? 'bg-[#1E3A8A] text-white'
                    : 'bg-black/5 text-black/60 hover:text-black'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Status & Sort Control Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs text-black/70 pt-3 border-t border-black/10">
          <div className="font-serif">
            Showing <strong className="text-[#1E3A8A] font-bold">{filteredPrograms.length}</strong> matching programs
            {selectedProvince !== 'All' && <span> in {selectedProvince}</span>}
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-black/15 px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#1E3A8A]" />
              <span className="text-[10px] uppercase font-bold text-black/50">Sort By:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-bold text-[#1A1A1A] outline-none cursor-pointer"
              >
                <option value="fee-low">Fee (Low to High)</option>
                <option value="fee-high">Fee (High to Low)</option>
                <option value="marks-low">Min Marks Required</option>
                <option value="name">Program Name (A-Z)</option>
                <option value="duration">Program Duration</option>
              </select>
            </div>

            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-black/60 hover:text-black text-[10px] font-bold uppercase tracking-wider"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>
      </div>

      {/* Suggestion Chips dropdown if search active */}
      {suggestions.length > 0 && (
        <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 p-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-[#C5A059] uppercase tracking-wider text-[10px]">Suggestions:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => setSearchQuery(s)}
              className="bg-white hover:bg-[#C5A059]/20 text-black px-2.5 py-1 border border-black/10 font-semibold text-xs"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Verified Source Disclaimer Banner */}
      <DataVerificationDisclaimerBanner />

      {/* Main Content Area */}
      {filteredPrograms.length === 0 ? (
        <div className="bg-white border border-black/10 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-12 h-12 bg-[#F9F8F6] text-black/40 flex items-center justify-center mx-auto border border-black/10">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#1A1A1A]">No Programs Found</h3>
          <p className="text-black/60 text-xs leading-relaxed">
            We couldn't find any programs matching your current search or fee filters. Try adjusting your fee budget or clearing filters.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-black/80"
            >
              Clear Filters
            </button>
            <button
              onClick={onOpenAdvisor}
              className="px-4 py-2 bg-[#1E3A8A] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#0B192C] inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white" />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              isBookmarked={bookmarkedIds.includes(program.id)}
              onToggleBookmark={onToggleBookmark}
              isCompared={comparedIds.includes(program.id)}
              onToggleCompare={onToggleCompare}
              onSelectProgram={onSelectProgram}
            />
          ))}
        </div>
      ) : (
        <FeeMatrix
          programs={filteredPrograms}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={onToggleBookmark}
          comparedIds={comparedIds}
          onToggleCompare={onToggleCompare}
          onSelectProgram={onSelectProgram}
        />
      )}
    </div>
  );
};
