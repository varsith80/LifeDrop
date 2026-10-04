import React from 'react';
import { ShieldCheck, Truck, Droplets, ThermometerSnowflake, FileCheck } from 'lucide-react';

export const ClinicalInfrastructure = () => {
  return (
    <section id="infrastructure" className="py-20 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold uppercase tracking-wider mb-3">
            <span>CLINICAL GRADE INFRASTRUCTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Built on Genuine Clinical Infrastructure
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            From automated collection assays and ABO/Rh validation to temperature-monitored cold chains and accredited hospital check-ins.
          </p>
        </div>

        {/* 2 Infrastructure Cards (matching screenshot) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg hover:shadow-xl transition-all group">
            <div className="h-64 overflow-hidden relative bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80" 
                alt="Medical laboratory testing and blood compatibility assay" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute top-4 left-4 bg-[#062416]/90 backdrop-blur-md text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600/40 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero Automation Risk</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                ABO/Rh Medical Compatibility & Lab Assays
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Biomedical safety protocols are hardcoded into an immutable compatibility matrix. Automated algorithms are strictly barred from making unverified clinical decisions, ensuring verified hospital oversight at every transfusion stage.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <FileCheck className="w-4 h-4" />
                <span>Mandatory Clinical Hospital Sign-off Required</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg hover:shadow-xl transition-all group">
            <div className="h-64 overflow-hidden relative bg-slate-900">
              <img 
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80" 
                alt="Temperature-monitored refrigerated medical transport logistics" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute top-4 left-4 bg-[#062416]/90 backdrop-blur-md text-emerald-300 text-xs font-bold px-3 py-1 rounded-full border border-emerald-600/40 flex items-center gap-1.5">
                <ThermometerSnowflake className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cold Chain 2°C–6°C / 20°C–24°C</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Temperature-Monitored Cold-Chain Transit
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Preserving biological integrity across whole blood units and agitation-sensitive platelets. Our regional coordination network maps shortest emergency transit routes directly to accredited trauma centers and intensive care units.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <Truck className="w-4 h-4" />
                <span>Live Route Tracking & Transit Verification</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
