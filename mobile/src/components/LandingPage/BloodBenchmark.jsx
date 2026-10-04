import React, { useState } from 'react';
import { 
  Activity, 
  Layers, 
  MapPin, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  Zap, 
  Sparkles,
  Info
} from 'lucide-react';

export const BloodBenchmark = () => {
  const [activeTab, setActiveTab] = useState('WHOLE_BLOOD');
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  const inventoryData = {
    WHOLE_BLOOD: {
      type: 'O- Negative (Universal RBC Donor)',
      status: 'CRITICAL SUPPLY LEVEL',
      statusColor: 'bg-rose-100 text-rose-800 border-rose-200',
      reserve: '18 Units',
      dispatchTime: '14 Mins Avg',
      hubs: ['Apollo Health City Emergency', 'Red Cross Central Bank', 'City Trauma Hub'],
      compatibilityText: 'Universal Red Blood Cell donor. Safe for transfusions into ANY ABO/Rh recipient in critical trauma scenarios.',
    },
    PLATELETS: {
      type: 'AB+ Universal Platelet Donor',
      status: 'OPTIMAL PREPAREDNESS',
      statusColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      reserve: '42 Units',
      dispatchTime: '22 Mins Avg',
      hubs: ['Apex Oncology Care', 'Regional General Hospital'],
      compatibilityText: 'Platelets stored strictly between 20°C–24°C with gentle continuous agitation; vital for dengue & oncology emergencies.',
    },
    PLASMA: {
      type: 'AB- Fresh Frozen Plasma (FFP)',
      status: 'HIGH CLINICAL DEMAND',
      statusColor: 'bg-amber-100 text-amber-800 border-amber-200',
      reserve: '28 Units',
      dispatchTime: '18 Mins Avg',
      hubs: ['LifeLine Medical Research', 'Red Cross Regional'],
      compatibilityText: 'Universal plasma donor type containing no anti-A or anti-B antibodies. Crucial for massive trauma burn management.',
    },
  };

  const current = inventoryData[activeTab] || inventoryData.WHOLE_BLOOD;

  return (
    <section id="benchmarks" className="py-20 bg-[#f9fbf9] border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              <span>LIVE AVAILABILITY BENCHMARK</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Regional Blood Availability & Reserve Index
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time regional blood banking reserves with clinical ABO/Rh compatibility rules.
            </p>
          </div>

          {/* Component Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start">
            <button
              onClick={() => setActiveTab('WHOLE_BLOOD')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'WHOLE_BLOOD'
                  ? 'bg-[#0e3825] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Whole Blood (RBC)
            </button>
            <button
              onClick={() => setActiveTab('PLATELETS')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'PLATELETS'
                  ? 'bg-[#0e3825] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Platelets
            </button>
            <button
              onClick={() => setActiveTab('PLASMA')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'PLASMA'
                  ? 'bg-[#0e3825] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Plasma (FFP)
            </button>
          </div>
        </div>

        {/* 2 Benchmark Cards (matching APMC screenshot) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Card: Stock Benchmark */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Regional Stock Benchmark
                </span>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${current.statusColor}`}>
                  {current.status}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {current.type}
              </h3>

              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-4xl font-extrabold text-emerald-900">
                  {current.reserve}
                </span>
                <span className="text-xs text-slate-500 font-semibold">
                  verified units in reserve
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1 mb-5">
                <p className="font-semibold text-slate-800">Clinical Transfusion Guideline:</p>
                <p>{current.compatibilityText}</p>
              </div>

              <div className="space-y-2 text-xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Connected Accredited Centers:
                </span>
                {current.hubs.map((hub, hIdx) => (
                  <div key={hIdx} className="flex items-center gap-2 text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{hub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Avg Emergency Dispatch:</span>
              <span className="text-emerald-700 font-black">{current.dispatchTime}</span>
            </div>
          </div>

          {/* Right Card: Smart Matching Formula Advantage */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>DIRECT-COORDINATE CLINICAL ADVANTAGE</span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-3">
                Smart Emergency Matching & Radius Escalation
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                Unlike broadcast spam or outdated phone directories, LifeDrop calculates a rigorous multi-factor scoring formula for every emergency request:
              </p>

              {/* Formula Card */}
              <div className="bg-[#041a10] text-emerald-200 rounded-2xl p-5 border border-emerald-900/60 shadow-inner mb-6 space-y-3 font-mono text-xs">
                <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Clinical Match Score Formula</span>
                </div>
                <div className="text-sm font-black text-white bg-emerald-950/80 p-3 rounded-lg border border-emerald-800/80 overflow-x-auto">
                  Score = Compat(30) + Dist(25) + Avail(20) + Urg(15) + Elig(10)
                </div>
                <div className="text-[11px] text-emerald-300/80 leading-relaxed">
                  Step-wise Radar: 0–5 km → 5–10 km → 10–20 km → 20–50 km → Blood Banks → Hospital Reserve
                </div>
              </div>

              {/* Interactive buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setShowMatrixModal(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#0e3825] hover:bg-[#072416] text-white font-bold text-xs flex items-center gap-2 transition active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>View Full ABO/Rh Compatibility Matrix</span>
                </button>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500">
              <Info className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Mandatory: AI cannot override medical transfusion rules. Predefined medical standards enforced.</span>
            </div>
          </div>

        </div>

      </div>

      {/* ABO Compatibility Modal */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-black text-slate-900">ABO/Rh Blood Compatibility Matrix</h4>
              <button 
                onClick={() => setShowMatrixModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Standard Red Blood Cell (RBC) donor-recipient rules enforced across LifeDrop:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold">
                    <th className="p-2 border">Recipient</th>
                    <th className="p-2 border">Compatible Donors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-700 font-medium">
                  <tr><td className="p-2 font-bold text-rose-600">O-</td><td className="p-2">O- (Only)</td></tr>
                  <tr><td className="p-2 font-bold text-rose-600">O+</td><td className="p-2">O-, O+</td></tr>
                  <tr><td className="p-2 font-bold text-blue-600">A-</td><td className="p-2">O-, A-</td></tr>
                  <tr><td className="p-2 font-bold text-blue-600">A+</td><td className="p-2">O-, O+, A-, A+</td></tr>
                  <tr><td className="p-2 font-bold text-emerald-600">B-</td><td className="p-2">O-, B-</td></tr>
                  <tr><td className="p-2 font-bold text-emerald-600">B+</td><td className="p-2">O-, O+, B-, B+</td></tr>
                  <tr><td className="p-2 font-bold text-purple-600">AB-</td><td className="p-2">O-, A-, B-, AB-</td></tr>
                  <tr><td className="p-2 font-bold text-purple-600">AB+</td><td className="p-2">All Blood Groups (Universal Recipient)</td></tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowMatrixModal(false)}
              className="w-full py-2.5 bg-[#0e3825] hover:bg-[#072416] text-white rounded-xl font-bold text-xs"
            >
              Close Compatibility Guide
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
