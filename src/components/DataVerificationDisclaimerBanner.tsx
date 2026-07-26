import React from 'react';
import { AlertCircle, ExternalLink, FileSearch } from 'lucide-react';

export const DataVerificationDisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  return (
    <div className={`bg-[#0B192C] text-white border border-[#C5A059]/40 ${compact ? 'p-3 text-xs' : 'p-4 sm:p-5'} shadow-sm`}>
      <div className="flex items-start gap-3">
        <FileSearch className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-[#C5A059] shrink-0 mt-0.5`} />
        <div className="space-y-1">
          <p className="font-serif font-bold text-[#C5A059] flex items-center gap-2">
            <span>Verified Source & Fee Disclaimer (July 2026 Audit)</span>
          </p>
          <p className="text-white/80 leading-relaxed font-sans text-xs">
            Fee and eligibility data was manually researched from official and verified sources as of July 2026. Figures marked <strong className="text-amber-300 font-bold bg-amber-950/60 px-1 py-0.5 border border-amber-500/40">"verify"</strong> were not confirmed in public sources — please check the university's official admissions page before applying, as fees are revised each cycle.
          </p>
        </div>
      </div>
    </div>
  );
};
