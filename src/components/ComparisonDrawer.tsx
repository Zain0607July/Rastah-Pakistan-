import React from 'react';
import {
  X,
  ArrowRightLeft,
  Building2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { EnrichedProgram } from '../types';

interface ComparisonDrawerProps {
  comparedPrograms: EnrichedProgram[];
  onRemoveCompare: (id: string) => void;
  onClearAll: () => void;
  onSelectProgram: (program: EnrichedProgram) => void;
}

export const ComparisonDrawer: React.FC<ComparisonDrawerProps> = ({
  comparedPrograms,
  onRemoveCompare,
  onClearAll,
  onSelectProgram
}) => {
  if (comparedPrograms.length === 0) return null;

  return (
    <div className="bg-white border border-black/10 shadow-lg overflow-hidden my-6">
      {/* Header Bar */}
      <div className="bg-[#0B192C] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#C5A059]/30">
        <div className="flex items-center gap-2.5">
          <ArrowRightLeft className="w-5 h-5 text-[#C5A059]" />
          <div>
            <h3 className="font-serif font-bold text-lg text-white">Side-by-Side Program Comparison</h3>
            <p className="text-xs text-white/70 font-sans">
              Comparing {comparedPrograms.length} of max 3 selected programs
            </p>
          </div>
        </div>

        <button
          onClick={onClearAll}
          className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white bg-white/10 px-3 py-1.5 border border-white/20 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Comparison</span>
        </button>
      </div>

      {/* Comparison Matrix Grid */}
      <div className="overflow-x-auto p-4 sm:p-6">
        <div className="min-w-[650px] grid grid-cols-1 divide-y divide-slate-200">
          {/* Program Titles */}
          <div className="grid grid-cols-4 gap-4 pb-4 items-center">
            <div className="font-bold text-xs uppercase tracking-wider text-slate-400">
              Program Details
            </div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="relative bg-slate-50 border border-slate-200 rounded-xl p-3">
                <button
                  onClick={() => onRemoveCompare(prog.id)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-red-600 p-1 rounded-md"
                  title="Remove from comparison"
                >
                  <X className="w-4 h-4" />
                </button>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 mb-1 inline-block">
                  {prog.university.shortName}
                </span>
                <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">
                  {prog.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {prog.university.city}, {prog.university.province}
                </p>
              </div>
            ))}
          </div>

          {/* Semester Fee */}
          <div className="grid grid-cols-4 gap-4 py-3 items-center text-xs">
            <div className="font-bold text-slate-600">Fee / Semester</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="font-mono font-extrabold text-sm text-slate-900">
                PKR {prog.feePerSemester.toLocaleString()}
              </div>
            ))}
          </div>

          {/* Total Fee */}
          <div className="grid grid-cols-4 gap-4 py-3 items-center text-xs">
            <div className="font-bold text-slate-600">Total Program Fee</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="font-mono font-bold text-slate-700">
                PKR {prog.totalFee.toLocaleString()}
              </div>
            ))}
          </div>

          {/* Last Updated */}
          <div className="grid grid-cols-4 gap-4 py-3 items-center text-xs">
            <div className="font-bold text-slate-600">Fee Last Updated</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="font-medium text-slate-700">
                <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {prog.feeLastUpdated}
                </span>
              </div>
            ))}
          </div>

          {/* Sector */}
          <div className="grid grid-cols-4 gap-4 py-3 items-center text-xs">
            <div className="font-bold text-slate-600">Sector</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="font-semibold text-slate-800">
                {prog.university.sector}
              </div>
            ))}
          </div>

          {/* Duration */}
          <div className="grid grid-cols-4 gap-4 py-3 items-center text-xs">
            <div className="font-bold text-slate-600">Duration</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="font-medium text-slate-800">
                {prog.durationYears} Years ({prog.durationYears * 2} Semesters)
              </div>
            ))}
          </div>

          {/* Min Marks Eligibility */}
          <div className="grid grid-cols-4 gap-4 py-3 items-center text-xs">
            <div className="font-bold text-slate-600">Min Marks Threshold</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="font-bold text-blue-800">
                {prog.minPercentageRequired}% marks
              </div>
            ))}
          </div>

          {/* Admission Test */}
          <div className="grid grid-cols-4 gap-4 py-3 items-center text-xs">
            <div className="font-bold text-slate-600">Admission Test</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="font-semibold text-slate-800">
                {prog.admissionTestRequired}
              </div>
            ))}
          </div>

          {/* Public Sector Outlook */}
          <div className="grid grid-cols-4 gap-4 py-3 items-start text-xs">
            <div className="font-bold text-slate-600 pt-1">Civil Service Posts</div>
            {comparedPrograms.map((prog) => (
              <div key={prog.id} className="text-slate-600 space-y-1">
                {prog.commonPublicJobs.map((j, idx) => (
                  <p key={idx} className="flex items-center gap-1 font-medium text-[11px]">
                    <CheckCircle2 className="w-3 h-3 text-blue-600 shrink-0" />
                    <span>{j}</span>
                  </p>
                ))}
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-4 gap-4 pt-4 items-center">
            <div />
            {comparedPrograms.map((prog) => (
              <div key={prog.id}>
                <button
                  onClick={() => onSelectProgram(prog)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
                >
                  Full Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
