import React from 'react';
import {
  ShieldCheck,
  Building2,
  ExternalLink,
  BookOpen,
  Calendar,
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 my-4">
      {/* Header */}
      <div className="bg-[#0B192C] text-white p-6 sm:p-10 space-y-4 border border-[#C5A059]/30">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C5A059] text-[#0B192C] text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Data Transparency & Verification Standards</span>
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-white">
          About Rastah Pakistan
        </h1>
        <p className="text-white/80 text-sm sm:text-base leading-relaxed font-sans">
          Rastah Pakistan was built to solve a critical challenge facing students and parents across Pakistan: discovering which universities offer specific programs, comparing fee structures side-by-side, and understanding real civil service (FPSC/PSC) job pathways — all in one accessible, mobile-first location.
        </p>
      </div>

      {/* Grid: Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-black/10 p-6 space-y-2">
          <div className="w-9 h-9 bg-[#1E3A8A] text-white flex items-center justify-center font-serif font-bold">
            <Calendar className="w-4 h-4 text-[#C5A059]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Annual Fee Audits</h3>
          <p className="text-xs text-black/70 leading-relaxed font-sans">
            University fee structures change annually. Every fee quote on Rastah displays a transparent <strong className="text-black">Fee Last Updated</strong> timestamp (e.g. Jan 2026) so you never rely on stale figures.
          </p>
        </div>

        <div className="bg-white border border-black/10 p-6 space-y-2">
          <div className="w-9 h-9 bg-[#1E3A8A] text-white flex items-center justify-center font-serif font-bold">
            <FileCheck className="w-4 h-4 text-[#C5A059]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">Qualitative Job Context</h3>
          <p className="text-xs text-black/70 leading-relaxed font-sans">
            Instead of presenting unverified yearly hiring statistics, we provide honest, qualitative summaries of public posts (FPSC/PPSC/SPSC/KPPSC) that graduates in each field have historically qualified for.
          </p>
        </div>

        <div className="bg-white border border-black/10 p-6 space-y-2">
          <div className="w-9 h-9 bg-[#1E3A8A] text-white flex items-center justify-center font-serif font-bold">
            <BookOpen className="w-4 h-4 text-[#C5A059]" />
          </div>
          <h3 className="font-serif font-bold text-lg text-[#1A1A1A]">AI Admissions Advising</h3>
          <p className="text-xs text-black/70 leading-relaxed font-sans">
            Our AI Advisor evaluates student marks and fee budgets against the official catalog without inventing fictitious universities or hidden costs, explicitly flagging eligibility cut-off risks.
          </p>
        </div>
      </div>

      {/* Official Directory & Reference Links */}
      <div className="bg-white border border-black/10 p-6 space-y-4">
        <h3 className="font-serif font-bold text-xl text-[#1A1A1A] border-b border-black/10 pb-2">
          Official Government & Testing Portals
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
          <a
            href="https://hec.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-[#F9F8F6] border border-black/10 flex items-center justify-between hover:border-[#1E3A8A] transition-colors"
          >
            <div>
              <p className="font-bold text-[#1A1A1A]">Higher Education Commission (HEC)</p>
              <p className="text-black/50 text-[11px]">Official Recognized Universities List</p>
            </div>
            <ExternalLink className="w-4 h-4 text-black/40" />
          </a>

          <a
            href="https://fpsc.gov.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-[#F9F8F6] border border-black/10 flex items-center justify-between hover:border-[#1E3A8A] transition-colors"
          >
            <div>
              <p className="font-bold text-[#1A1A1A]">Federal Public Service Commission (FPSC)</p>
              <p className="text-black/50 text-[11px]">Federal Civil Posts & CSS Exams</p>
            </div>
            <ExternalLink className="w-4 h-4 text-black/40" />
          </a>

          <a
            href="https://ppsc.gop.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-[#F9F8F6] border border-black/10 flex items-center justify-between hover:border-[#1E3A8A] transition-colors"
          >
            <div>
              <p className="font-bold text-[#1A1A1A]">Punjab Public Service Commission (PPSC)</p>
              <p className="text-black/50 text-[11px]">Punjab Departmental Jobs</p>
            </div>
            <ExternalLink className="w-4 h-4 text-black/40" />
          </a>

          <a
            href="https://nts.org.pk"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 bg-[#F9F8F6] border border-black/10 flex items-center justify-between hover:border-[#1E3A8A] transition-colors"
          >
            <div>
              <p className="font-bold text-[#1A1A1A]">National Testing Service (NTS)</p>
              <p className="text-black/50 text-[11px]">NAT & GAT Testing Schedules</p>
            </div>
            <ExternalLink className="w-4 h-4 text-black/40" />
          </a>
        </div>
      </div>

      {/* Full Legal Disclaimer */}
      <div className="bg-[#F9F8F6] border-l-2 border-[#C5A059] border-y border-r border-black/10 p-6 text-xs text-[#1A1A1A] space-y-2">
        <p className="font-serif font-bold text-[#1E3A8A] flex items-center gap-1.5 text-sm">
          <AlertTriangle className="w-4 h-4 text-[#C5A059]" />
          Important Student & Parent Disclaimer
        </p>
        <p className="leading-relaxed font-sans text-black/70">
          The fee estimates, minimum eligibility percentages, and admission test requirements published on Rastah Pakistan are compiled for preliminary guidance and comparative research. Fee structures, hostel charges, security deposits, and merit cut-offs are subject to annual revision by individual university syndicates and governing bodies. Always confirm exact admission fees on each university's official prospectus before depositing dues.
        </p>
      </div>
    </div>
  );
};
