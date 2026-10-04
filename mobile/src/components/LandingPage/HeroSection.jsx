import React from 'react';
import { 
  ShieldCheck, 
  ArrowRight, 
  HeartHandshake, 
  MapPin, 
  CheckCircle2, 
  Sparkles, 
  Droplet, 
  Clock, 
  Activity,
  Lock
} from 'lucide-react';

export const HeroSection = ({ onOpenUserLogin, onOpenAdminLogin, onOpenRegister }) => {
  return (
    <section id="hero" className="relative bg-[#f7fbf8] border-b border-emerald-900/10 pt-12 pb-16 overflow-hidden">
      
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-rose-100/40 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-bold tracking-tight">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>Direct Lifesaving Network for Healthcare</span>
            </div>

            {/* Giant Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.12]">
              Rapid Blood for Patients,{' '}
              <span className="text-emerald-800 underline decoration-rose-500 decoration-wavy decoration-2">
                Verified Donors
              </span>{' '}
              for Emergencies.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
              Eliminating delays, shortages, and lack of real-time supply transparency. LifeDrop connects patients and hospitals directly with verified voluntary donors, blood banks, and cold-chain transport networks.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenUserLogin}
                className="px-6 py-3.5 rounded-xl bg-[#0e3825] hover:bg-[#082416] text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/20 active:scale-98 transition-all"
              >
                <span>Access Stakeholder Portal</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                onClick={onOpenAdminLogin}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm border border-slate-300 shadow-sm flex items-center gap-2 active:scale-98 transition-all"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                <span>Admin Governance Login</span>
              </button>
            </div>

            {/* 4 Trust Checkmarks */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200/80 text-xs font-semibold text-slate-700">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% ABO Safe Matrix</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Escalation Radar</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified Facilities</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Markup</span>
              </div>
            </div>

          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Visual Card */}
            <div className="relative w-full max-w-md bg-white rounded-3xl p-4 shadow-2xl border border-slate-200/90 overflow-hidden group">
              
              {/* Photo Area */}
              <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80" 
                  alt="Blood donation and laboratory testing" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                {/* Floating Top Badge */}
                <div className="absolute top-4 left-4 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-200 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Verified O- Donor Available Now</span>
                </div>

                {/* Bottom Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-lg text-slate-800">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <MapPin className="w-3.5 h-3.5 text-rose-600" />
                        <span>Apollo Health City Emergency</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Matched 3 Units Whole Blood • Cold-Chain Active
                      </p>
                    </div>
                    <span className="text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                      3.2 km away
                    </span>
                  </div>
                </div>

              </div>

              {/* Status footer inside card */}
              <div className="mt-3 flex items-center justify-between px-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <Droplet className="w-3.5 h-3.5 text-rose-600" />
                  <span>Donation Cooldown: 90 Days Tracked</span>
                </div>
                <span className="text-emerald-700 font-bold">100% Medical Safety</span>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
