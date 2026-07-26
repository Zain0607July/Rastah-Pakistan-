import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, X } from 'lucide-react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [showRestored, setShowRestored] = useState<boolean>(false);
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    function handleOnline() {
      setIsOffline(false);
      setShowRestored(true);
      setDismissed(false);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 4000);
      return () => clearTimeout(timer);
    }

    function handleOffline() {
      setIsOffline(true);
      setShowRestored(false);
      setDismissed(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showRestored) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-[#1E3A8A] text-white border border-[#C5A059]/40 p-3.5 shadow-xl flex items-center justify-between gap-3 animate-fade-in font-sans text-xs">
        <div className="flex items-center gap-2.5">
          <Wifi className="w-4 h-4 text-[#C5A059] shrink-0" />
          <span>Connection restored. Synchronized with Rastah catalog.</span>
        </div>
        <button
          onClick={() => setShowRestored(false)}
          className="text-white/60 hover:text-white transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (isOffline && !dismissed) {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md bg-[#0B192C] text-white border-l-4 border-[#C5A059] border-y border-r border-black/20 p-4 shadow-2xl flex items-start justify-between gap-3 font-sans text-xs animate-slide-up">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-[#1E3A8A] flex items-center justify-center shrink-0 border border-[#C5A059]/30">
            <WifiOff className="w-4 h-4 text-[#C5A059]" />
          </div>
          <div>
            <p className="font-serif font-bold text-sm text-white flex items-center gap-2">
              Offline Mode Active
              <span className="text-[9px] uppercase tracking-widest bg-[#C5A059] text-[#0B192C] font-sans font-bold px-1.5 py-0.5">
                Cached
              </span>
            </p>
            <p className="text-white/80 leading-relaxed mt-0.5">
              You are disconnected from the network. Browsing catalog and saved bookmarks using cached dataset.
            </p>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 text-white/60 hover:text-white transition-colors shrink-0"
          title="Dismiss offline alert"
          aria-label="Dismiss offline alert"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return null;
}
