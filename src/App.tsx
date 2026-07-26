import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProgramExplorer } from './components/ProgramExplorer';
import { FeeMatrix } from './components/FeeMatrix';
import { ProgramDetailModal } from './components/ProgramDetailModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { ComparisonDrawer } from './components/ComparisonDrawer';
import { BookmarksView } from './components/BookmarksView';
import { AboutView } from './components/AboutView';
import { CareerDisclaimerBanner } from './components/CareerDisclaimerBanner';
import { OfflineBanner } from './components/OfflineBanner';
import { EnrichedProgram, Province } from './types';
import { getEnrichedPrograms } from './data/universityData';

export default function App() {
  const [programs, setPrograms] = useState<EnrichedProgram[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Tabs & Navigation
  const [activeTab, setActiveTab] = useState<string>('explorer');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProvince, setSelectedProvince] = useState<Province | 'All'>('All');

  // Bookmarks (localStorage)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rastah_bookmarks') || localStorage.getItem('unipath_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare list (max 3)
  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Modals
  const [selectedProgramForModal, setSelectedProgramForModal] = useState<EnrichedProgram | null>(null);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState<boolean>(false);

  // Load programs from API or fallback
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/programs');
        if (res.ok) {
          const data = await res.json();
          setPrograms(data);
        } else {
          setPrograms(getEnrichedPrograms());
        }
      } catch (e) {
        console.warn('Using client fallback dataset:', e);
        setPrograms(getEnrichedPrograms());
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rastah_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error('Failed to save bookmarks to localStorage', e);
    }
  }, [bookmarkedIds]);

  // Bookmark toggle handler
  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Compare toggle handler (limit to 3)
  const handleToggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      }
      if (prev.length >= 3) {
        alert('You can compare up to 3 programs side-by-side.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleRemoveCompare = (id: string) => {
    setComparedIds((prev) => prev.filter((i) => i !== id));
  };

  const handleClearCompare = () => {
    setComparedIds([]);
  };

  // Filtered lists for bookmarks & compared
  const bookmarkedPrograms = useMemo(() => {
    return programs.filter((p) => bookmarkedIds.includes(p.id));
  }, [programs, bookmarkedIds]);

  const comparedPrograms = useMemo(() => {
    return programs.filter((p) => comparedIds.includes(p.id));
  }, [programs, comparedIds]);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans flex flex-col antialiased">
      {/* Sticky Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={bookmarkedIds.length}
        compareCount={comparedIds.length}
        onOpenAdvisor={() => setIsAdvisorOpen(true)}
      />

      {/* Main Body */}
      <main className="flex-1">
        {/* Explorer Hero Header */}
        {activeTab === 'explorer' && (
          <HeroSection
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            onOpenAdvisor={() => setIsAdvisorOpen(true)}
          />
        )}

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Global Disclaimer Banner for Career Context */}
          <CareerDisclaimerBanner />

          {/* Loading Skeleton State */}
          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-black/60 font-semibold text-sm">
                Loading Rastah Pakistan Admissions Catalog...
              </p>
            </div>
          ) : (
            <>
              {/* Tab 1: Explorer */}
              {activeTab === 'explorer' && (
                <ProgramExplorer
                  programs={programs}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  selectedProvince={selectedProvince}
                  setSelectedProvince={setSelectedProvince}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                  comparedIds={comparedIds}
                  onToggleCompare={handleToggleCompare}
                  onSelectProgram={setSelectedProgramForModal}
                  onOpenAdvisor={() => setIsAdvisorOpen(true)}
                />
              )}

              {/* Tab 2: Fee Matrix */}
              {activeTab === 'fee-matrix' && (
                <FeeMatrix
                  programs={programs}
                  bookmarkedIds={bookmarkedIds}
                  onToggleBookmark={handleToggleBookmark}
                  comparedIds={comparedIds}
                  onToggleCompare={handleToggleCompare}
                  onSelectProgram={setSelectedProgramForModal}
                />
              )}

              {/* Tab 3: Compare */}
              {activeTab === 'compare' && (
                <ComparisonDrawer
                  comparedPrograms={comparedPrograms}
                  onRemoveCompare={handleRemoveCompare}
                  onClearAll={handleClearCompare}
                  onSelectProgram={setSelectedProgramForModal}
                />
              )}

              {/* Tab 4: Saved Items */}
              {activeTab === 'bookmarks' && (
                <BookmarksView
                  bookmarkedPrograms={bookmarkedPrograms}
                  onRemoveBookmark={handleToggleBookmark}
                  onSelectProgram={setSelectedProgramForModal}
                />
              )}

              {/* Tab 5: Data & About */}
              {activeTab === 'about' && <AboutView />}
            </>
          )}
        </div>
      </main>

      {/* Program Detail Drawer/Modal */}
      <ProgramDetailModal
        program={selectedProgramForModal}
        onClose={() => setSelectedProgramForModal(null)}
        isBookmarked={
          selectedProgramForModal
            ? bookmarkedIds.includes(selectedProgramForModal.id)
            : false
        }
        onToggleBookmark={handleToggleBookmark}
        isCompared={
          selectedProgramForModal
            ? comparedIds.includes(selectedProgramForModal.id)
            : false
        }
        onToggleCompare={handleToggleCompare}
      />

      {/* AI Program Advisor Modal */}
      <AIAdvisorModal
        isOpen={isAdvisorOpen}
        onClose={() => setIsAdvisorOpen(false)}
        programs={programs}
        onSelectProgram={(prog) => {
          setIsAdvisorOpen(false);
          setSelectedProgramForModal(prog);
        }}
        onToggleBookmark={handleToggleBookmark}
        bookmarkedIds={bookmarkedIds}
      />

      {/* Offline Status Toast Indicator */}
      <OfflineBanner />

      {/* Footer */}
      <footer className="bg-[#0B192C] border-t border-[#C5A059]/30 text-white/80 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-serif font-bold text-white text-base">
              Rastah<span className="text-[#C5A059]">Pakistan</span> — Admissions & Fee Intelligence
            </p>
            <p className="text-white/60 text-xs mt-0.5 font-sans">
              Empowering students across Punjab, Sindh, KPK, Balochistan, Gilgit-Baltistan, AJK & Islamabad.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-wider">
            <button onClick={() => setActiveTab('explorer')} className="hover:text-[#C5A059] transition-colors">
              Explorer
            </button>
            <button onClick={() => setActiveTab('fee-matrix')} className="hover:text-[#C5A059] transition-colors">
              Fee Matrix
            </button>
            <button onClick={() => setIsAdvisorOpen(true)} className="hover:text-[#C5A059] transition-colors">
              AI Advisor
            </button>
            <button onClick={() => setActiveTab('about')} className="hover:text-[#C5A059] transition-colors">
              Data & About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
