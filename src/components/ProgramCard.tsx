import React from 'react';
import {
  Building2,
  MapPin,
  Clock,
  CheckCircle2,
  Bookmark,
  BookmarkCheck,
  ArrowRightLeft,
  ChevronRight,
  Briefcase,
  AlertCircle
} from 'lucide-react';
import { EnrichedProgram } from '../types';

interface ProgramCardProps {
  program: EnrichedProgram;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onSelectProgram: (program: EnrichedProgram) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  isBookmarked,
  onToggleBookmark,
  isCompared,
  onToggleCompare,
  onSelectProgram
}) => {
  const isPublic = program.university.sector === 'Public';

  return (
    <div className="bg-white border border-black/10 hover:border-[#1E3A8A] transition-all duration-200 flex flex-col justify-between group relative p-6">
      <div className="space-y-4">
        {/* Top Eyebrow Tag */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#C5A059] mb-1 block">
              {program.university.sector} Sector • {program.university.city}, {program.university.province}
            </span>
            <h3 className="text-xl font-serif font-bold text-[#1A1A1A] group-hover:text-[#1E3A8A] transition-colors leading-snug">
              {program.university.shortName} - {program.name}
            </h3>
            <p className="text-xs text-black/60 mt-1 font-sans">
              {program.university.name}
            </p>
          </div>

          {/* Action Bookmark/Compare Icons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              onClick={() => onToggleBookmark(program.id)}
              className={`p-2 transition-colors ${
                isBookmarked
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-[#F9F8F6] text-black/40 hover:text-black border border-black/10'
              }`}
              title={isBookmarked ? 'Remove Bookmark' : 'Save Program'}
              aria-label="Bookmark program"
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 fill-white" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={() => onToggleCompare(program.id)}
              className={`p-2 transition-colors ${
                isCompared
                  ? 'bg-[#C5A059] text-white font-bold'
                  : 'bg-[#F9F8F6] text-black/40 hover:text-black border border-black/10'
              }`}
              title={isCompared ? 'Remove from Compare' : 'Add to Compare'}
              aria-label="Compare program"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Duration & Admission Test details */}
        <p className="text-xs text-black/70 font-sans border-b border-black/10 pb-3">
          {program.degreeLevel}'s Degree • {program.durationYears} Years ({program.durationYears * 2} Semesters) • <span className="font-semibold">{program.admissionTestRequired}</span>
        </p>

        {/* Fee Highlight Block */}
        <div className="bg-[#F9F8F6] border border-black/10 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase font-bold text-black/50 tracking-wider block">Semester Fee</span>
              <span className="text-xl font-serif font-bold text-[#1E3A8A]">PKR {program.feePerSemester.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-black/50 tracking-wider block">Est. Total Fee</span>
              <span className="text-sm font-bold text-black/80">PKR {program.totalFee.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-black/10 pt-2 text-[10px]">
            {program.feeUnverified ? (
              <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5">
                <AlertCircle className="w-3 h-3 text-amber-700 shrink-0" />
                <span>Verify Fee with Admissions Office</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>{program.feeLastUpdated}</span>
              </span>
            )}

            {program.feeNote && (
              <span className="text-[#1E3A8A] font-semibold truncate max-w-[180px]" title={program.feeNote}>
                ℹ️ {program.feeNote}
              </span>
            )}
          </div>
        </div>

        {/* Public Sector Career Context */}
        <div className="space-y-2 text-xs text-black/70">
          <div className="flex items-start gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1E3A8A] shrink-0 mt-0.5" />
            <p className="line-clamp-1">
              <span className="font-bold text-[#1A1A1A]">Min Criteria:</span> {program.minPercentageRequired}% marks ({program.eligibilityCriteria})
            </p>
          </div>
          <div className="flex items-start gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
            <p className="line-clamp-2">
              <span className="font-bold text-[#1A1A1A]">Public Civil Posts:</span> {program.commonPublicJobs.join(' • ')}
            </p>
          </div>
        </div>
      </div>

      {/* Editorial Footer Links */}
      <div className="pt-5 mt-4 border-t border-black/10 flex items-center justify-between gap-4">
        <button
          onClick={() => onSelectProgram(program)}
          className="text-[10px] font-bold uppercase tracking-wider border-b-2 border-[#1E3A8A] pb-0.5 text-[#1E3A8A] hover:text-[#0B192C] transition-colors"
        >
          View Details
        </button>

        <button
          onClick={() => onToggleCompare(program.id)}
          className={`text-[10px] font-bold uppercase tracking-wider border-b-2 pb-0.5 transition-colors ${
            isCompared
              ? 'border-[#C5A059] text-[#C5A059]'
              : 'border-black/20 text-black/50 hover:text-black hover:border-black'
          }`}
        >
          {isCompared ? 'In Compare' : '+ Compare'}
        </button>
      </div>
    </div>
  );
};
