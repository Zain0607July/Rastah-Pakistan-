import React from 'react';
import { Search, Sparkles, Building2, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Province } from '../types';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedProvince: Province | 'All';
  setSelectedProvince: (p: Province | 'All') => void;
  onOpenAdvisor: () => void;
}

const PROVINCES: (Province | 'All')[] = [
  'All',
  'Punjab',
  'Sindh',
  'KPK',
  'Balochistan',
  'Gilgit-Baltistan',
  'AJK',
  'Islamabad'
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  selectedProvince,
  setSelectedProvince,
  onOpenAdvisor
}) => {
  return (
    <section className="bg-[#0B192C] text-white pt-10 pb-12 px-4 sm:px-6 lg:px-8 border-b border-[#C5A059]/20 relative overflow-hidden">
      <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
        {/* Editorial Eyebrow Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#C5A059]/40 bg-[#C5A059]/10 text-[#C5A059] text-[11px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>THE FINAL PROJECT of ACT AI BATCH 2 STUDENT &quot;ZAIN UL ABIDIN&quot;</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-5xl font-serif font-light tracking-tight text-white leading-tight">
          Choose Your Degree Based on <br className="hidden sm:inline" />
          <span className="italic font-normal text-[#C5A059]">
            Real Civil Career Pathways & Fee Budgets
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-white/80 text-sm sm:text-base leading-relaxed font-sans font-normal">
          Compare HEC-recognized Bachelor's & Master's program fees across Pakistan, evaluate official FPSC/PSC public sector eligibility, and receive AI-backed program placement.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto relative mt-6">
          <div className="relative flex items-center bg-white text-[#1A1A1A] border border-black/10 shadow-lg p-2 focus-within:border-[#1E3A8A] transition-all">
            <Search className="w-5 h-5 text-black/40 ml-3 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search e.g. 'BS Computer Science', 'NUST', 'KPK', 'MBA'..."
              className="w-full bg-transparent px-3 py-2 text-sm text-[#1A1A1A] placeholder-black/40 focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-black/50 hover:text-black px-2 uppercase font-bold"
              >
                Clear
              </button>
            )}
            <button
              onClick={onOpenAdvisor}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 bg-[#C5A059] hover:bg-white hover:text-[#0B192C] text-[#0B192C] font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <Sparkles className="w-4 h-4 fill-[#0B192C]" />
              <span className="hidden sm:inline">Ask AI Advisor</span>
              <span className="sm:hidden">AI</span>
            </button>
          </div>
        </div>

        {/* Quick Region / Province Filter Pills */}
        <div className="pt-2">
          <p className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059] mb-2 flex items-center justify-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Select Region / Province:</span>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {PROVINCES.map((prov) => {
              const isSelected = selectedProvince === prov;
              return (
                <button
                  key={prov}
                  onClick={() => setSelectedProvince(prov)}
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    isSelected
                      ? 'bg-[#C5A059] text-[#0B192C]'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {prov === 'All' ? 'ALL PAKISTAN' : prov}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Institutions</p>
            <p className="text-sm font-serif font-bold text-white">14+ HEC Recognized</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Fee Audit</p>
            <p className="text-sm font-serif font-bold text-white">Semester & Total</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">Public Service</p>
            <p className="text-sm font-serif font-bold text-white">FPSC & Provincial</p>
          </div>
          <div className="border border-white/10 bg-white/5 p-3">
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#C5A059]">AI Advisor</p>
            <p className="text-sm font-serif font-bold text-white">Marks & Budget Fit</p>
          </div>
        </div>
      </div>
    </section>
  );
};
