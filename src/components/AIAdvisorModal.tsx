import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Award,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  MapPin,
  GraduationCap,
  ArrowRight,
  RotateCcw,
  BookMarked
} from 'lucide-react';
import { AdvisorInput, AdvisorResponse, Province, DegreeLevel, EnrichedProgram } from '../types';

interface AIAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: EnrichedProgram[];
  onSelectProgram: (program: EnrichedProgram) => void;
  onToggleBookmark: (id: string) => void;
  bookmarkedIds: string[];
}

const PROVINCES: (Province | 'Any')[] = [
  'Any',
  'Punjab',
  'Sindh',
  'KPK',
  'Balochistan',
  'Gilgit-Baltistan',
  'AJK',
  'Islamabad'
];

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({
  isOpen,
  onClose,
  programs,
  onSelectProgram,
  onToggleBookmark,
  bookmarkedIds
}) => {
  const [formData, setFormData] = useState<AdvisorInput>({
    marksPercentage: 72,
    monthlyBudget: 25000,
    preferredProvince: 'Any',
    degreeLevel: 'Bachelor',
    interests: 'computer science, software development, technology'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [advisorResult, setAdvisorResult] = useState<AdvisorResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data: AdvisorResponse = await res.json();
      setAdvisorResult(data);
    } catch (err: any) {
      console.error('Advisor request failed:', err);
      setErrorMsg('Failed to connect to AI Advisor service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAdvisorResult(null);
    setErrorMsg(null);
  };

  // Helper to find program object from ID
  const getProgramById = (id: string) => {
    return programs.find((p) => p.id === id);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 relative my-auto">
        {/* Header */}
        <div className="bg-[#0B192C] text-white p-5 sm:p-6 border-b border-[#C5A059]/30 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#1E3A8A] border border-[#C5A059]/40 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5 text-[#C5A059] fill-[#C5A059]" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-xl text-white">
                Rastah AI Admissions Advisor
              </h2>
              <p className="text-xs text-white/70">
                Personalized program recommendations based on your marks & fee budget
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {!advisorResult ? (
            /* Input Form */
            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div className="bg-[#F9F8F6] border-l-2 border-[#C5A059] border-y border-r border-black/10 p-4 text-[#1A1A1A] text-xs">
                <p className="font-serif font-bold text-[#1E3A8A] text-sm mb-0.5">How the AI Advisor Works</p>
                <p className="text-black/70 leading-relaxed font-sans">
                  Enter your marks percentage, fee budget, and interests below. The AI evaluates the official HEC program catalog and returns the top 2–3 best-fit programs, flagging any eligibility cutoff risks explicitly.
                </p>
              </div>

              {/* Marks % Slider */}
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#1A1A1A]">
                    Your Marks Percentage (Matric/FSc or Bachelor's):
                  </label>
                  <span className="font-serif font-bold text-base text-[#1E3A8A] bg-[#F9F8F6] px-2.5 py-0.5 border border-black/10">
                    {formData.marksPercentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={formData.marksPercentage}
                  onChange={(e) => setFormData({ ...formData, marksPercentage: Number(e.target.value) })}
                  className="w-full accent-[#1E3A8A] h-1.5 bg-black/10 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] uppercase text-black/40 font-bold">
                  <span>40% Passing</span>
                  <span>60% First Div</span>
                  <span>80%+ Merit</span>
                </div>
              </div>

              {/* Monthly Fee Budget */}
              <div className="space-y-1.5 font-sans">
                <div className="flex justify-between items-center">
                  <label className="font-bold text-[#1A1A1A]">
                    Monthly Fee Budget (PKR):
                  </label>
                  <span className="font-serif font-bold text-sm text-[#1A1A1A] bg-[#F9F8F6] px-2.5 py-0.5 border border-black/10">
                    PKR {formData.monthlyBudget.toLocaleString()} / mo
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={formData.monthlyBudget}
                  onChange={(e) => setFormData({ ...formData, monthlyBudget: Number(e.target.value) })}
                  className="w-full accent-[#1E3A8A] h-1.5 bg-black/10 cursor-pointer"
                />
                <p className="text-[11px] text-black/60 font-medium">
                  Approx. semester fee budget: <strong className="text-[#1E3A8A]">PKR {(formData.monthlyBudget * 6).toLocaleString()}</strong> per semester
                </p>
              </div>

              {/* Grid: Province & Degree Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans">
                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Preferred Province / Region:
                  </label>
                  <select
                    value={formData.preferredProvince}
                    onChange={(e) => setFormData({ ...formData, preferredProvince: e.target.value as any })}
                    className="w-full bg-[#F9F8F6] border-b border-black/20 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#1E3A8A]"
                  >
                    {PROVINCES.map((p) => (
                      <option key={p} value={p}>
                        {p === 'Any' ? 'Any Region (All Pakistan)' : p}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#1A1A1A] mb-1">
                    Degree Level Sought:
                  </label>
                  <select
                    value={formData.degreeLevel}
                    onChange={(e) => setFormData({ ...formData, degreeLevel: e.target.value as any })}
                    className="w-full bg-[#F9F8F6] border-b border-black/20 py-2 text-xs font-semibold text-[#1A1A1A] focus:outline-none focus:border-[#1E3A8A]"
                  >
                    <option value="Bachelor">Bachelor's Degree (BS / MBBS / BBA / Pharm-D)</option>
                    <option value="Master">Master's Degree (MS / MBA)</option>
                    <option value="Any">Any Level</option>
                  </select>
                </div>
              </div>

              {/* Stated Interests / Specific Program Query */}
              <div className="space-y-2 font-sans">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-[#1A1A1A]">
                    Ask About a Specific Program, University, or Subject:
                  </label>
                  <span className="text-[10px] text-[#1E3A8A] font-bold">
                    Specific Search Supported
                  </span>
                </div>

                <input
                  type="text"
                  value={formData.interests}
                  onChange={(e) => {
                    const val = e.target.value;
                    let newDegreeLevel = formData.degreeLevel;
                    if (/\b(ms|master|masters|mphil|msph|mph|msc|mba)\b/i.test(val)) {
                      newDegreeLevel = 'Master';
                    } else if (/\b(bs|bachelor|bachelors|bsph|bsc|bba|mbbs|dpt|bds|pharm-d)\b/i.test(val)) {
                      newDegreeLevel = 'Bachelor';
                    }
                    setFormData({ ...formData, interests: val, degreeLevel: newDegreeLevel });
                  }}
                  placeholder="e.g. MS Public Health, NUST BS Computer Science, BS Radiology, DPT, Dow MBBS"
                  className="w-full bg-[#F9F8F6] border border-black/10 p-3 text-xs text-[#1A1A1A] placeholder-black/40 focus:outline-none focus:border-[#1E3A8A] font-medium"
                />
                <p className="text-[10px] text-black/50">
                  Tip: Type a specific program name or university (e.g., "BS Radiology", "NUST CS") to get exact eligibility, test, and fee analysis.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-6 bg-[#C5A059] hover:bg-[#0B192C] hover:text-white text-[#0B192C] font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing University Catalog...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Generate AI Pathway Recommendations</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Results View */
            <div className="space-y-5 font-sans">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {formData.interests ? `Targeted Analysis for "${formData.interests}"` : 'Recommended Best-Fit Programs'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Evaluated for {formData.marksPercentage}% marks & PKR {formData.monthlyBudget.toLocaleString()}/mo fee budget
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Query / Inputs</span>
                </button>
              </div>

              {/* Recommendations List */}
              <div className="space-y-4">
                {advisorResult.recommendations.map((rec, index) => {
                  const prog = getProgramById(rec.programId);
                  if (!prog) return null;

                  const isBookmarked = bookmarkedIds.includes(prog.id);
                  const meetsMarks = formData.marksPercentage >= prog.minPercentageRequired;

                  return (
                    <div
                      key={rec.programId}
                      className={`bg-white border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3 relative overflow-hidden ${
                        index === 0 && rec.matchScore >= 85
                          ? 'border-[#C5A059] ring-1 ring-[#C5A059]/30'
                          : 'border-slate-200'
                      }`}
                    >
                      {/* Top Rank Badge */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              index === 0 && rec.matchScore >= 85
                                ? 'bg-[#0B192C] text-[#C5A059] border border-[#C5A059]/40'
                                : 'bg-blue-600 text-white'
                            }`}>
                              {index === 0 ? '🎯 Top Primary Match' : `Option #${index + 1}`} ({rec.matchScore}% Match)
                            </span>
                            <span className="text-xs font-semibold text-slate-600">
                              {prog.university.shortName} • {prog.university.city}, {prog.university.province} ({prog.university.sector})
                            </span>
                          </div>
                          <h4 className="font-serif font-bold text-lg text-slate-900">
                            {prog.name}
                          </h4>
                        </div>

                        <button
                          onClick={() => onToggleBookmark(prog.id)}
                          className={`p-2 rounded-xl text-xs font-semibold transition-colors ${
                            isBookmarked
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                          title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Program'}
                        >
                          <BookMarked className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Structured Details Chips */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        {/* Degree Level Badge */}
                        <span className={`px-2.5 py-1 rounded-lg border font-bold ${
                          prog.degreeLevel === 'Master'
                            ? 'bg-purple-50 text-purple-900 border-purple-200'
                            : 'bg-indigo-50 text-indigo-900 border-indigo-200'
                        }`}>
                          🎓 {prog.degreeLevel}'s Degree ({prog.degreeLevel === 'Master' ? 'Postgraduate / MS' : 'Undergraduate / BS'})
                        </span>

                        {/* Eligibility Chip */}
                        {meetsMarks ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold inline-flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Marks Eligible ({formData.marksPercentage}% vs {prog.minPercentageRequired}% Min)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 font-bold inline-flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Cutoff Deficit ({formData.marksPercentage}% vs {prog.minPercentageRequired}% Required)</span>
                          </span>
                        )}

                        {/* Test Chip */}
                        <span className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-semibold inline-flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-blue-700" />
                          <span>Test: {prog.admissionTestRequired}</span>
                        </span>

                        {/* Duration & Fee */}
                        <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 font-semibold">
                          ⏱️ {prog.durationYears} Years • PKR {prog.feePerSemester.toLocaleString()}/sem
                        </span>
                      </div>

                      {/* AI Fit Reason */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-700 leading-relaxed space-y-1">
                        <p className="font-bold text-slate-900">Specific Program Rationale:</p>
                        <p className="whitespace-pre-line">{rec.fitReason}</p>
                      </div>

                      {/* Marks Warning (Explicit if below eligibility) */}
                      {rec.marksWarning && (
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-950 flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <strong className="font-bold text-amber-900">Eligibility Warning: </strong>
                            <span>{rec.marksWarning}</span>
                          </div>
                        </div>
                      )}

                      {/* Fee Fit Note */}
                      <div className="text-xs text-slate-600 flex flex-wrap items-center justify-between pt-1 gap-2">
                        <span>
                          Semester Fee: <strong className="text-slate-900 font-mono font-bold">PKR {prog.feePerSemester.toLocaleString()}</strong> (Total Est: PKR {prog.totalFee.toLocaleString()})
                        </span>
                        <span className="text-slate-600 font-medium text-[11px]">
                          {rec.feeFitNote}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] text-slate-500 font-medium">
                          Career Roles: {prog.commonPublicJobs.join(', ')}
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectProgram(prog);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-[#0B192C] text-white font-bold text-xs hover:bg-[#1E3A8A] inline-flex items-center gap-1 transition-colors shrink-0"
                        >
                          <span>Inspect Full Program</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* General Advice Banner */}
              {advisorResult.generalAdvice && (
                <div className="bg-[#0B192C] text-white border border-[#C5A059]/40 rounded-xl p-4 text-xs leading-relaxed space-y-1.5">
                  <p className="font-serif font-bold text-[#C5A059] flex items-center gap-1.5 text-sm">
                    <GraduationCap className="w-4 h-4" />
                    Targeted Admission Strategy & Next Steps
                  </p>
                  <div className="whitespace-pre-line text-white/90 font-sans">
                    {advisorResult.generalAdvice}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
