import React, { useState } from 'react';
import {
  BookMarked,
  Trash2,
  Share2,
  Building2,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Edit3,
  FileText
} from 'lucide-react';
import { EnrichedProgram } from '../types';

interface BookmarksViewProps {
  bookmarkedPrograms: EnrichedProgram[];
  onRemoveBookmark: (id: string) => void;
  onSelectProgram: (program: EnrichedProgram) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  bookmarkedPrograms,
  onRemoveBookmark,
  onSelectProgram
}) => {
  const [userNotes, setUserNotes] = useState<{ [id: string]: string }>({});
  const [appStatus, setAppStatus] = useState<{ [id: string]: string }>({});
  const [copiedSuccess, setCopiedSuccess] = useState(false);

  const handleNoteChange = (id: string, note: string) => {
    setUserNotes((prev) => ({ ...prev, [id]: note }));
  };

  const handleStatusChange = (id: string, status: string) => {
    setAppStatus((prev) => ({ ...prev, [id]: status }));
  };

  const handleExportSummary = () => {
    const textLines = bookmarkedPrograms.map((p) => {
      const note = userNotes[p.id] ? ` | Note: ${userNotes[p.id]}` : '';
      const st = appStatus[p.id] ? ` | Status: ${appStatus[p.id]}` : '';
      return `• ${p.name} - ${p.university.name} (${p.university.city}): PKR ${p.feePerSemester.toLocaleString()}/sem${st}${note}`;
    });

    const summaryText = `Rastah Pakistan - My Saved Programs Tracker:\n\n${textLines.join('\n')}\n\nGenerated via Rastah Pakistan`;

    navigator.clipboard.writeText(summaryText);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 3000);
  };

  if (bookmarkedPrograms.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <BookMarked className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-xl text-slate-900">No Saved Programs Yet</h3>
        <p className="text-slate-600 text-sm">
          Bookmark universities and degree programs while browsing to build your personalized application shortlist and track admission deadlines.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0B192C] text-white p-5 sm:p-6 flex items-center justify-between flex-wrap gap-4 border border-[#C5A059]/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-5 h-5 text-[#C5A059]" />
            <h2 className="font-serif font-bold text-2xl text-white">Saved Programs & Tracker</h2>
          </div>
          <p className="text-xs text-white/70 font-sans">
            Keep personal notes, mark application progress, and export your university shortlist.
          </p>
        </div>

        <button
          onClick={handleExportSummary}
          className="px-4 py-2 bg-[#C5A059] hover:bg-[#0B192C] text-[#0B192C] hover:text-white font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-colors border border-[#C5A059]"
        >
          <Share2 className="w-4 h-4" />
          <span>{copiedSuccess ? 'Shortlist Copied!' : 'Export Shortlist'}</span>
        </button>
      </div>

      {/* Saved List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {bookmarkedPrograms.map((prog) => {
          const currentNote = userNotes[prog.id] || '';
          const currentStatus = appStatus[prog.id] || 'Interested';

          return (
            <div
              key={prog.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {prog.university.shortName} • {prog.university.city}
                    </span>
                    <h3 className="font-serif font-bold text-lg text-slate-900 mt-1">
                      {prog.name}
                    </h3>
                  </div>

                  <button
                    onClick={() => onRemoveBookmark(prog.id)}
                    className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Remove from saved"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Fee & Test Info */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Semester Fee</p>
                    <p className="font-mono font-bold text-slate-900">
                      PKR {prog.feePerSemester.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold">Admission Test</p>
                    <p className="font-medium text-slate-800">{prog.admissionTestRequired}</p>
                  </div>
                </div>

                {/* Application Status Dropdown */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">
                    My Application Status:
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => handleStatusChange(prog.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Interested">Interested / Researching</option>
                    <option value="Test Registered">Test Registered (NET / MDCAT / ECAT)</option>
                    <option value="Applied">Admission Form Submitted</option>
                    <option value="Shortlisted">Merit List Shortlisted</option>
                    <option value="Admitted">Admitted / Fee Paid</option>
                  </select>
                </div>

                {/* Personal Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Personal Notes / Reminders:</span>
                  </label>
                  <textarea
                    rows={2}
                    value={currentNote}
                    onChange={(e) => handleNoteChange(prog.id, e.target.value)}
                    placeholder="e.g. Test date: March 15th, check hostel availability..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => onSelectProgram(prog)}
                  className="text-xs font-bold text-blue-800 hover:text-blue-950 inline-flex items-center gap-1"
                >
                  <span>View Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
