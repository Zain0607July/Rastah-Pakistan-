import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookMarked,
  ArrowRightLeft,
  Info,
  Table,
  Search,
  Menu,
  X,
  Compass
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  compareCount: number;
  onOpenAdvisor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  savedCount,
  compareCount,
  onOpenAdvisor
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explorer', label: 'Explorer', icon: Compass },
    { id: 'fee-matrix', label: 'Fee Matrix', icon: Table },
    { id: 'compare', label: 'Compare', icon: ArrowRightLeft, badge: compareCount },
    { id: 'bookmarks', label: 'Saved', icon: BookMarked, badge: savedCount },
    { id: 'about', label: 'About', icon: Info }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FDFCFB]/95 backdrop-blur-md border-b border-black/10 text-[#1A1A1A] transition-all shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => setActiveTab('explorer')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-9 h-9 bg-[#1E3A8A] flex items-center justify-center text-white font-serif italic text-xl shadow-xs group-hover:bg-[#0B192C] transition-colors">
              R
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-serif font-bold text-2xl tracking-tight text-[#1E3A8A]">
                  Rastah<span className="text-[#C5A059]">Pakistan</span>
                </span>
              </div>
              <p className="text-[10px] text-black/50 font-semibold uppercase tracking-widest">
                Admissions & Fee Intelligence
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 py-1 text-xs font-semibold uppercase tracking-widest transition-colors relative ${
                    isActive
                      ? 'text-[#1E3A8A] border-b-2 border-[#1E3A8A]'
                      : 'text-black/60 hover:text-black'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-[#C5A059] text-white font-bold rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Advisor Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdvisor}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#1E3A8A] hover:bg-[#0B192C] text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] fill-[#C5A059]" />
              <span>AI Advisor</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-black/70 hover:text-black focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F9F8F6] border-b border-black/10 px-4 pt-3 pb-5 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center justify-between w-full px-4 py-3 text-xs font-semibold uppercase tracking-widest border-b border-black/5 ${
                  isActive
                    ? 'text-[#1E3A8A] font-bold border-l-2 border-l-[#1E3A8A] bg-white pl-3'
                    : 'text-black/70 hover:bg-white/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-[10px] bg-[#C5A059] text-white font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
