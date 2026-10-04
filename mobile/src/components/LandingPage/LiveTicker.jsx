import React, { useState, useEffect } from 'react';
import { Activity, ArrowUpRight, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

export const LiveTicker = () => {
  const tickerItems = [
    { type: 'O- Universal (RBC)', units: '2 Units', status: 'CRITICAL LOW', color: 'text-rose-400', hub: 'Apollo Emergency' },
    { type: 'A+ Whole Blood', units: '48 Units', status: 'OPTIMAL', color: 'text-emerald-400', hub: 'Red Cross Hub' },
    { type: 'B+ Platelets', units: '15 Units', status: 'DISPATCH READY', color: 'text-emerald-400', hub: 'City Trauma' },
    { type: 'AB- Fresh Plasma', units: '4 Units', status: 'HIGH DEMAND', color: 'text-amber-400', hub: 'Apex Blood Bank' },
    { type: 'O+ Whole Blood', units: '62 Units', status: 'HEALTHY RESERVE', color: 'text-emerald-400', hub: 'Fortis Regional' },
    { type: 'Recent Match: St. Jude Hospital', units: '4 Units O+', status: 'FULFILLED (14m ago)', color: 'text-teal-300', hub: 'Verified Donor' },
    { type: 'Emergency Escalation Radar', units: 'Tier-2 Active', status: '5-10 KM SYNCED', color: 'text-sky-300', hub: 'Automated Job' },
  ];

  return (
    <div className="bg-[#041a10] border-b border-emerald-900/40 text-xs py-2 overflow-hidden shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        
        {/* Pulsing Label */}
        <div className="flex items-center gap-1.5 shrink-0 bg-emerald-950 px-2.5 py-1 rounded-md border border-emerald-700/50">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[10px] font-black tracking-widest uppercase text-emerald-300">
            LIVE BLOOD NETWORK
          </span>
        </div>

        {/* Scrolling Items */}
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar scroll-smooth whitespace-nowrap text-emerald-100/90 font-medium text-[11px]">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 hover:bg-emerald-900/40 px-2 py-0.5 rounded cursor-pointer transition-colors">
              <span className="font-semibold text-white">{item.type}</span>
              <span className="font-mono text-emerald-200 bg-emerald-900/60 px-1.5 py-0.2 rounded text-[10px]">
                {item.units}
              </span>
              <span className={`text-[10px] font-black uppercase ${item.color}`}>
                {item.status}
              </span>
              <span className="text-emerald-500/70 text-[10px]">({item.hub})</span>
              {idx < tickerItems.length - 1 && (
                <span className="text-emerald-800 ml-2">|</span>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
