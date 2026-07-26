import React from 'react';
import {
  Building2,
  Bookmark,
  BookmarkCheck,
  ArrowRightLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { EnrichedProgram } from '../types';

interface FeeMatrixProps {
  programs: EnrichedProgram[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  comparedIds: string[];
  onToggleCompare: (id: string) => void;
  onSelectProgram: (program: EnrichedProgram) => void;
}

export const FeeMatrix: React.FC<FeeMatrixProps> = ({
  programs,
  bookmarkedIds,
  onToggleBookmark,
  comparedIds,
  onToggleCompare,
  onSelectProgram
}) => {
  // Find min fee program in list
  const minFee = Math.min(...programs.map((p) => p.feePerSemester));

  return (
    <div className="bg-white border border-black/10 shadow-xs overflow-hidden">
      <div className="p-5 bg-[#0B192C] text-white flex items-center justify-between border-b border-[#C5A059]/30">
        <div>
          <h3 className="font-serif font-bold text-lg text-white">Fee Breakdown & Comparison Matrix</h3>
          <p className="text-xs text-white/70">
            Per-semester and total cost across all matching programs. Fee updates explicitly dated.
          </p>
        </div>
        <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 bg-[#C5A059] text-[#0B192C]">
          {programs.length} Programs
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="bg-[#F9F8F6] text-black/70 font-bold uppercase tracking-wider text-[10px] border-b border-black/10">
              <th className="py-3 px-4">University & Program</th>
              <th className="py-3 px-3">Location & Sector</th>
              <th className="py-3 px-3">Fee / Semester</th>
              <th className="py-3 px-3">Total Est. Fee</th>
              <th className="py-3 px-3">Last Updated</th>
              <th className="py-3 px-3">Min Marks</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/10 text-black/80">
            {programs.map((program) => {
              const isMinFee = program.feePerSemester === minFee;
              const isBookmarked = bookmarkedIds.includes(program.id);
              const isCompared = comparedIds.includes(program.id);

              return (
                <tr
                  key={program.id}
                  className={`hover:bg-[#F9F8F6] transition-colors ${
                    isMinFee ? 'bg-[#1E3A8A]/5' : ''
                  }`}
                >
                  {/* University & Program Name */}
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#1A1A1A]">{program.name}</span>
                      {isMinFee && (
                        <span className="bg-[#1E3A8A] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 flex items-center gap-0.5">
                          <TrendingUp className="w-3 h-3 text-[#C5A059]" /> Lowest Fee
                        </span>
                      )}
                    </div>
                    <p className="text-black/50 text-[11px] flex items-center gap-1 mt-0.5 font-sans">
                      <Building2 className="w-3 h-3 text-black/40" /> {program.university.name} ({program.university.shortName})
                    </p>
                  </td>

                  {/* Location & Sector */}
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-black/80">{program.university.city}, {program.university.province}</p>
                    <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-[#C5A059]">
                      {program.university.sector} Sector
                    </span>
                  </td>

                  {/* Semester Fee */}
                  <td className="py-3.5 px-3 font-mono font-bold text-[#1E3A8A] text-sm">
                    PKR {program.feePerSemester.toLocaleString()}
                  </td>

                  {/* Total Fee */}
                  <td className="py-3.5 px-3 font-mono font-semibold text-black/70">
                    PKR {program.totalFee.toLocaleString()}
                  </td>

                  {/* Last Updated */}
                  <td className="py-3.5 px-3 text-black/60 font-medium">
                    <span className="bg-black/5 px-2 py-0.5 text-[10px] border border-black/10 font-mono">
                      {program.feeLastUpdated}
                    </span>
                  </td>

                  {/* Min Marks */}
                  <td className="py-3.5 px-3 font-semibold text-black/80">
                    {program.minPercentageRequired}% marks
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onToggleBookmark(program.id)}
                        className={`p-1.5 border transition-colors ${
                          isBookmarked
                            ? 'bg-[#1E3A8A] text-white border-[#1E3A8A]'
                            : 'bg-transparent text-black/40 border-black/10 hover:text-black'
                        }`}
                        title="Save Program"
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="w-4 h-4 fill-white" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        onClick={() => onToggleCompare(program.id)}
                        className={`p-1.5 border transition-colors ${
                          isCompared
                            ? 'bg-[#C5A059] text-white border-[#C5A059]'
                            : 'bg-transparent text-black/40 border-black/10 hover:text-black'
                        }`}
                        title="Compare Program"
                      >
                        <ArrowRightLeft className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onSelectProgram(program)}
                        className="px-2.5 py-1.5 bg-[#1E3A8A] text-white font-bold text-[10px] uppercase tracking-wider hover:bg-[#0B192C] inline-flex items-center gap-1 ml-1"
                      >
                        <span>Details</span>
                        <ChevronRight className="w-3 h-3 text-[#C5A059]" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
