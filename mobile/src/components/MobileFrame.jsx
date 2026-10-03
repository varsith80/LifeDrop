import React, { useState, useEffect } from 'react';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';
import { useSocket } from '../context/SocketContext';

export const MobileFrame = ({ children }) => {
  const [isFrameEnabled, setIsFrameEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState('');
  const { connected } = useSocket();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-0 sm:py-6 selection:bg-rose-500 selection:text-white">
      {/* Top Device / Viewport Toggle Toolbar */}
      <header className="hidden sm:flex items-center justify-between w-full max-w-4xl px-4 py-2 mb-4 bg-slate-800/80 backdrop-blur rounded-full border border-slate-700/60 shadow-lg text-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-slate-300">HemoLink Mobile Experience</span>
          <span className="text-slate-500">|</span>
          <span className={connected ? 'text-emerald-400 flex items-center gap-1' : 'text-amber-400 flex items-center gap-1'}>
            <span className={`h-1.5 w-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            {connected ? 'Live Sync Active' : 'Connecting to Server...'}
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-900/60 p-1 rounded-full border border-slate-700/50">
          <button
            onClick={() => setIsFrameEnabled(true)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              isFrameEnabled
                ? 'bg-rose-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Frame</span>
          </button>
          <button
            onClick={() => setIsFrameEnabled(false)}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all ${
              !isFrameEnabled
                ? 'bg-rose-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Full Responsive</span>
          </button>
        </div>
      </header>

      {/* Frame Container */}
      <div
        className={`w-full transition-all duration-300 ${
          isFrameEnabled
            ? 'max-w-[420px] h-[92vh] max-h-[880px] bg-white rounded-[44px] shadow-2xl border-[10px] border-slate-800 relative overflow-hidden flex flex-col text-slate-800 ring-1 ring-slate-700/30'
            : 'max-w-xl min-h-screen sm:min-h-[85vh] bg-white sm:rounded-2xl shadow-xl flex flex-col text-slate-800 overflow-hidden'
        }`}
      >
        {/* Simulated Mobile Status Bar */}
        {isFrameEnabled && (
          <div className="bg-slate-900 text-slate-200 px-6 pt-2 pb-1.5 flex items-center justify-between text-[11px] font-semibold select-none shrink-0 z-30">
            <span>{currentTime || '09:41'}</span>
            {/* Dynamic Island / Notch */}
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-900 ring-1 ring-slate-800" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <Battery className="w-3.5 h-3.5" />
            </div>
          </div>
        )}

        {/* Scrollable Screen Content */}
        <main id="main-content" className="flex-1 flex flex-col overflow-y-auto relative bg-slate-50 overscroll-contain">
          {children}
        </main>

        {/* Home gesture bar */}
        {isFrameEnabled && (
          <div className="h-4 bg-white flex items-center justify-center shrink-0 z-30">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
