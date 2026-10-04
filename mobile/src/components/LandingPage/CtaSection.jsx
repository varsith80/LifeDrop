import React from 'react';
import { HeartHandshake, ArrowRight, ShieldCheck, UserPlus, LogIn } from 'lucide-react';

export const CtaSection = ({ onOpenRegister, onOpenLogin }) => {
  return (
    <section className="py-16 bg-[#f9fbf9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-[#072b1a] rounded-3xl p-8 sm:p-14 text-center text-white border border-emerald-800/80 shadow-2xl relative overflow-hidden">
          
          {/* Subtle Glows */}
          <div className="absolute top-0 right-1/4 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              Ready to Experience Transparent Emergency Blood Coordination?
            </h2>

            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
              Join over 1,000+ voluntary donors, verified hospitals, and emergency responders saving lives through instant ABO compatibility matching and zero commercial exploitation.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <button
                onClick={onOpenRegister}
                className="px-6 py-3.5 rounded-xl bg-emerald-300 hover:bg-emerald-200 text-[#062416] font-black text-sm shadow-lg shadow-emerald-950/40 active:scale-98 transition-all flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Create Free Account</span>
              </button>

              <button
                onClick={() => onOpenLogin('USER')}
                className="px-6 py-3.5 rounded-xl bg-[#041d11] hover:bg-[#02130b] text-white font-bold text-sm border border-emerald-600/50 shadow-md active:scale-98 transition-all flex items-center gap-2"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Open Stakeholder Login Gateway</span>
              </button>
            </div>

            <p className="text-[11px] text-emerald-300/70 pt-2 font-medium">
              ⚡ Free for all voluntary donors & emergency patients • Certified hospital verification
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
