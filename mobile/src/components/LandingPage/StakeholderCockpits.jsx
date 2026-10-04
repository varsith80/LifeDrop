import React from 'react';
import { 
  Heart, 
  UserCheck, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Activity, 
  Clock, 
  FileCheck2, 
  Lock 
} from 'lucide-react';

export const StakeholderCockpits = ({ onSelectRoleLogin }) => {
  const cockpits = [
    {
      module: 'MODULE 01',
      title: 'Donor Portal',
      icon: Heart,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      description: 'Instant notification for urgent nearby needs, cooldown tracker, and live availability control.',
      bullets: [
        'Instant alerts for matched emergencies within radius',
        'Digital donor card & 90-day cooldown countdown',
        '1-tap availability toggle (Available, Rest, Busy)',
      ],
      btnText: 'Sign In / Donor Portal',
      btnBg: 'bg-[#0e3825] hover:bg-[#072416] text-white',
      demoRole: 'DONOR',
      demoLabel: 'Quick Demo: Arun Kumar (O+)',
    },
    {
      module: 'MODULE 02',
      title: 'Patient & Attendant',
      icon: UserCheck,
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      description: 'Create verified emergency blood requests, monitor live donor distance, and track hospital arrival.',
      bullets: [
        'Create emergency request in under 60 seconds',
        'Real-time Haversine distance & matching score',
        'Step-wise emergency radius escalation radar',
      ],
      btnText: 'Sign In / Patient Portal',
      btnBg: 'bg-[#0e3825] hover:bg-[#072416] text-white',
      demoRole: 'PATIENT',
      demoLabel: 'Quick Demo: Rajesh (Attendant)',
    },
    {
      module: 'MODULE 03',
      title: 'Hospital & Blood Bank',
      icon: Building2,
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      description: 'Maintain real-time component stock (RBC, Platelets, FFP) and verify emergency transfusions.',
      bullets: [
        'Live inventory tracking across all 8 ABO groups',
        'ABO/Rh clinical compatibility verification',
        'Fast emergency intake & donation completion logs',
      ],
      btnText: 'Sign In / Hospital Hub',
      btnBg: 'bg-[#0e3825] hover:bg-[#072416] text-white',
      demoRole: 'HOSPITAL',
      demoLabel: 'Quick Demo: Apollo Emergency Hub',
    },
    {
      module: 'MODULE 04',
      title: 'Admin & Governance',
      icon: ShieldCheck,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      description: 'End-to-end platform governance, hospital licensing approval, and emergency radar monitoring.',
      bullets: [
        'System-wide immutable audit trail logs',
        'Hospital & Blood Bank onboarding verification',
        'Real-time emergency escalation monitoring',
      ],
      btnText: 'Admin Governance Login',
      btnBg: 'bg-[#062416] hover:bg-black text-white border border-emerald-700/50',
      demoRole: 'ADMIN',
      demoLabel: 'Quick Demo: Dr. Sarah Mitchell (Admin)',
    },
  ];

  return (
    <section id="cockpits" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
            <span>MULTI-ROLE ECOSYSTEM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Dedicated Stakeholder Cockpits
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Tailored interfaces engineered specifically for donors, patients, hospitals, blood banks, and oversight teams.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cockpits.map((cockpit, idx) => {
            const IconComponent = cockpit.icon;
            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-xl transition-all group"
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl border flex items-center justify-center ${cockpit.iconBg} shadow-sm group-hover:scale-105 transition-transform`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                      {cockpit.module}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {cockpit.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-5">
                    {cockpit.description}
                  </p>

                  {/* Bullets */}
                  <ul className="space-y-2.5 mb-6 text-xs text-slate-600">
                    {cockpit.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span className="leading-tight">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Action & Demo Helper */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => onSelectRoleLogin(cockpit.demoRole)}
                    className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-98 shadow-sm ${cockpit.btnBg}`}
                  >
                    <span>{cockpit.btnText}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  
                  <button
                    onClick={() => onSelectRoleLogin(cockpit.demoRole, true)}
                    className="w-full text-center text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 hover:underline transition"
                  >
                    ⚡ {cockpit.demoLabel}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
