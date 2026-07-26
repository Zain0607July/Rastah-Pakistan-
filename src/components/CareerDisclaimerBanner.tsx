import React from 'react';
import { ShieldAlert, ExternalLink } from 'lucide-react';

export const CareerDisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 text-amber-950 text-sm leading-relaxed">
      <div className="flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-semibold text-amber-900">
            General Career Context — Not a Hiring Guarantee
          </p>
          <p className="text-amber-800 text-xs sm:text-sm">
            The public sector job roles mentioned for each program reflect general qualification criteria from FPSC, PPSC, SPSC, KPPSC, BPSC, and AJKPSC over recent years. Active job openings, age limits, and quota rules change frequently. Always verify current job advertisements directly on official commission portals.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-amber-700 font-medium">
            <a
              href="https://fpsc.gov.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-emerald-800"
            >
              FPSC Federal <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://ppsc.gop.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-emerald-800"
            >
              PPSC Punjab <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://spsc.gos.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-emerald-800"
            >
              SPSC Sindh <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://kppsc.gov.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-emerald-800"
            >
              KPPSC KPK <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://bpsc.gob.pk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-emerald-800"
            >
              BPSC Balochistan <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
