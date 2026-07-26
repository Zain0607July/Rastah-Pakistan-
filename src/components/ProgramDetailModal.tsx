import React from 'react';
import {
  X,
  Building2,
  MapPin,
  Globe,
  Calendar,
  CheckCircle2,
  Briefcase,
  Bookmark,
  BookmarkCheck,
  ArrowRightLeft,
  ExternalLink,
  Award,
  Sparkles,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { EnrichedProgram } from '../types';
import { CareerDisclaimerBanner } from './CareerDisclaimerBanner';
import { DataVerificationDisclaimerBanner } from './DataVerificationDisclaimerBanner';

interface ProgramDetailModalProps {
  program: EnrichedProgram | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  isCompared: boolean;
  onToggleCompare: (id: string) => void;
  onOpenAdvisorWithProgram?: (program: EnrichedProgram) => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  onClose,
  isBookmarked,
  onToggleBookmark,
  isCompared,
  onToggleCompare,
  onOpenAdvisorWithProgram
}) => {
  if (!program) return null;

  const uni = program.university;
  const isPublic = uni.sector === 'Public';
  const monthlyEst = Math.round(program.feePerSemester / 6);

  const needsVerification =
    /verify/i.test(program.feeLastUpdated || '') ||
    /verify/i.test(program.eligibilityCriteria || '') ||
    Boolean(program.feeUnverified);

  const currentFee = program.feePerSemester;
  const isPublicFee = uni.sector === 'Public';
  const feeHistoryData = [
    { year: '2023', fee: Math.round(currentFee * (isPublicFee ? 0.86 : 0.80)) },
    { year: '2024', fee: Math.round(currentFee * (isPublicFee ? 0.91 : 0.88)) },
    { year: '2025', fee: Math.round(currentFee * (isPublicFee ? 0.96 : 0.94)) },
    { year: '2026', fee: currentFee },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 relative my-auto">
        {/* Sticky Top Header */}
        <div className="sticky top-0 bg-[#0B192C] text-white p-5 sm:p-6 border-b border-[#C5A059]/30 z-10 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 bg-[#C5A059] text-[#0B192C]">
                {uni.sector} University
              </span>
              <span className="text-xs text-white/80 flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                {uni.city}, {uni.province}
              </span>
              {uni.hecRanking && (
                <span className="text-xs text-[#C5A059] bg-white/10 border border-[#C5A059]/30 px-2 py-0.5 font-medium flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {uni.hecRanking}
                </span>
              )}
            </div>

            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-snug">
              {program.name}
            </h2>
            <p className="text-white/80 text-xs sm:text-sm font-medium mt-1 flex items-center gap-1 font-sans">
              <Building2 className="w-4 h-4 text-[#C5A059]" />
              {uni.name} ({uni.shortName})
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-5 sm:p-6 space-y-6 text-sm font-sans">
          {/* Data Verification Banner */}
          <DataVerificationDisclaimerBanner compact />

          {/* Verification Status Section */}
          {needsVerification && (
            <div className="bg-amber-500/10 border-l-4 border-l-amber-500 border border-amber-500/30 p-4 rounded-r-lg space-y-1.5 text-amber-950">
              <div className="flex items-center gap-2 font-serif font-bold text-amber-900 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Verification Status</span>
              </div>
              <p className="text-xs italic leading-relaxed text-amber-900 font-medium">
                Fee or eligibility figures for this specific program were not fully confirmed in public online documentation. Please verify current admission cycle requirements and exact fee structures directly with {uni.name} ({uni.shortName}) admissions office before applying, as official details are updated periodically.
              </p>
              {program.feeNote && (
                <p className="text-xs font-semibold text-[#1E3A8A] pt-1">
                  Note: {program.feeNote}
                </p>
              )}
            </div>
          )}

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9F8F6] border border-black/10 p-4">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                Fee / Semester
              </p>
              <p className="text-lg font-serif font-bold text-[#1E3A8A]">
                PKR {program.feePerSemester.toLocaleString()}
              </p>
              <p className="text-[10px] text-black/50">~PKR {monthlyEst.toLocaleString()}/mo</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                Total Est. Fee
              </p>
              <p className="text-lg font-serif font-bold text-black/80">
                PKR {program.totalFee.toLocaleString()}
              </p>
              <p className="text-[10px] text-black/50 font-semibold">
                {program.feeUnverified ? '⚠️ Verify with Office' : `Updated: ${program.feeLastUpdated}`}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                Program Duration
              </p>
              <p className="text-base font-bold text-[#1A1A1A]">
                {program.durationYears} Years
              </p>
              <p className="text-[10px] text-black/50">{program.durationYears * 2} Semesters</p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-widest text-black/50 font-bold">
                Min Marks Required
              </p>
              <p className="text-base font-bold text-[#1E3A8A]">
                {program.minPercentageRequired}% Marks
              </p>
              <p className="text-[10px] text-black/50">Eligibility Cut-off</p>
            </div>
          </div>

          {/* Fee Trajectory & Sparkline Chart (Recharts) */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#1E3A8A]" />
                <h4 className="font-serif font-bold text-sm text-[#1A1A1A]">
                  Fee Trend & Stability Indicator
                </h4>
              </div>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                isPublicFee
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {isPublicFee ? '🛡️ High Stability (Govt Regulated)' : '📈 Periodic Adjustment (~8-10%/yr)'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              University fee structures are revised periodically due to institutional inflation. Below is the estimated 4-year semester fee trajectory:
            </p>

            <div className="h-32 w-full pt-1">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={feeHistoryData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="feeGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `PKR ${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(val: number) => [`PKR ${val.toLocaleString()}`, 'Semester Fee']}
                    contentStyle={{ backgroundColor: '#0B192C', color: '#fff', borderRadius: '8px', fontSize: '12px', borderColor: '#334155' }}
                    itemStyle={{ color: '#C5A059' }}
                    labelStyle={{ fontWeight: 'bold', color: '#94a3b8' }}
                  />
                  <Area type="monotone" dataKey="fee" stroke="#1E3A8A" strokeWidth={2.5} fillOpacity={1} fill="url(#feeGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 italic pt-1 border-t border-slate-200">
              <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Fees are subject to yearly institutional revisions. Always verify official notifications for your admission batch.</span>
            </div>
          </div>

          {/* Admission & Test Details */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] border-b border-black/10 pb-1">
              Admission & Eligibility Criteria
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white border border-black/10 p-4 space-y-1.5">
                <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest">
                  Academic Prerequisite
                </p>
                <p className="font-semibold text-[#1A1A1A]">{program.eligibilityCriteria}</p>
                <p className="text-xs text-black/60">
                  Must meet minimum {program.minPercentageRequired}% threshold in FSc/A-Levels or Bachelor's.
                </p>
              </div>

              <div className="bg-white border border-black/10 p-4 space-y-1.5">
                <p className="text-[10px] font-bold text-black/50 uppercase tracking-widest">
                  Entry Test Requirement
                </p>
                <p className="font-semibold text-[#1E3A8A]">{program.admissionTestRequired}</p>
                <p className="text-xs text-black/60">
                  Required entrance assessment score submitted during university admissions session.
                </p>
              </div>
            </div>
          </div>

          {/* Public Sector Career Outlook Section */}
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] border-b border-black/10 pb-1 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#1E3A8A]" />
              <span>Public Sector Career Outlook (Pakistan Context)</span>
            </h3>

            <p className="text-black/80 leading-relaxed text-xs">
              {program.careerOutlookSummary}
            </p>

            <div className="bg-[#F9F8F6] border border-black/10 p-4 space-y-2">
              <p className="text-[10px] font-bold text-[#C5A059] uppercase tracking-widest">
                Common Civil Service & Public Posts Eligible for Graduates:
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {program.commonPublicJobs.map((job, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-black/80 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                    <span>{job}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mandatory Disclaimer */}
            <CareerDisclaimerBanner />
          </div>

          {/* University Info Box */}
          <div className="bg-[#0B192C] text-white p-5 space-y-3 border-l-4 border-l-[#C5A059]">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h4 className="font-serif font-bold text-lg">{uni.name}</h4>
                <p className="text-xs text-white/70">
                  Established in {uni.establishedYear} • Campus: {uni.campusAddress}
                </p>
              </div>

              <a
                href={uni.website}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#C5A059] text-[#0B192C] font-bold text-xs uppercase tracking-wider hover:bg-white inline-flex items-center gap-1.5 transition-colors"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-5 bg-[#F9F8F6] border-t border-black/10 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleBookmark(program.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                isBookmarked
                  ? 'bg-[#1E3A8A] text-white'
                  : 'bg-white border border-black/20 text-black/70 hover:bg-black/5'
              }`}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-4 h-4 text-white fill-white" />
                  <span>Saved</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-4 h-4 text-black/50" />
                  <span>Save Program</span>
                </>
              )}
            </button>

            <button
              onClick={() => onToggleCompare(program.id)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-all ${
                isCompared
                  ? 'bg-[#C5A059] text-white'
                  : 'bg-white border border-black/20 text-black/70 hover:bg-black/5'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>{isCompared ? 'Comparing' : 'Compare Side-by-Side'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-black text-white font-bold uppercase text-xs tracking-wider hover:bg-black/80"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
