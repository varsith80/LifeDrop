import React from 'react';
import { HeartHandshake, ArrowRight, ShieldCheck } from 'lucide-react';

export const SplashScreen = ({ onGetStarted }) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-rose-600 via-rose-700 to-rose-900 text-white select-none">
      <div className="pt-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/40 border border-rose-400/40 text-rose-100 text-xs font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-rose-200" />
          <span>Verified Health-Tech Platform</span>
        </div>
      </div>

      <div className="flex flex-col items-center text-center my-auto py-8">
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-2xl animate-pulse">
            <HeartHandshake className="w-14 h-14 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center text-rose-600 shadow-md font-black text-xs">
            +
          </div>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">HemoLink</h1>
        <p className="text-rose-100 text-base font-semibold max-w-xs leading-relaxed italic">
          “The right blood. The right donor. At the right time.”
        </p>

        <p className="text-rose-200/80 text-xs mt-4 max-w-xs leading-normal">
          Real-time emergency blood matching, proximity donor discovery, verified blood banks, and live transfusion coordination.
        </p>
      </div>

      <div className="pb-6">
        <button
          onClick={onGetStarted}
          className="w-full py-3.5 px-4 bg-white text-rose-700 hover:bg-rose-50 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-black/20 active:scale-98 transition"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
