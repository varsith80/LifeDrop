import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      setIsOnline(navigator.onLine);
      setRetrying(false);
    }, 1200);
  };

  if (isOnline) return null;

  return (
    <div className="bg-slate-900 text-amber-300 px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-50 shadow-md">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-amber-400 animate-pulse" />
        <div>
          <span className="font-semibold block">Connection lost</span>
          <span className="text-[10px] text-slate-300">Retrying connection in background...</span>
        </div>
      </div>
      <button
        onClick={handleRetry}
        disabled={retrying}
        className="px-2.5 py-1 bg-amber-400 text-slate-900 rounded-md font-semibold text-[11px] flex items-center gap-1 hover:bg-amber-300 transition"
      >
        <RefreshCw className={`w-3 h-3 ${retrying ? 'animate-spin' : ''}`} />
        <span>Retry</span>
      </button>
    </div>
  );
};
