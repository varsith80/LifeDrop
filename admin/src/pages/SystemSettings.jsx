import React, { useState } from 'react';
import { Settings, Save, ShieldAlert, CheckCircle, Database } from 'lucide-react';

export const SystemSettings = () => {
  const [escalationInterval, setEscalationInterval] = useState('5');
  const [defaultRadius, setDefaultRadius] = useState('15');
  const [maxRadius, setMaxRadius] = useState('50');
  const [duplicateWindow, setDuplicateWindow] = useState('12');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight">System Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">
          Adjust emergency matching parameters, escalation intervals, and fraud prevention windows.
        </p>
      </div>

      {saved && (
        <div className="p-3 bg-emerald-950 border border-emerald-800/80 rounded-2xl text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>System configuration saved successfully.</span>
        </div>
      )}

      {/* Mandatory Medical Safety Disclaimer Notice */}
      <div className="p-4 bg-amber-950/60 border border-amber-800/60 rounded-2xl text-xs text-amber-300 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-amber-200 block mb-0.5">Clinical Protocol Reminder</span>
          Automated scoring factors may only adjust search priority and routing. Medical blood compatibility
          and transfusion decisions must remain strictly governed by clinical blood banking standards.
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Emergency Escalation Interval (Minutes)
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={escalationInterval}
            onChange={(e) => setEscalationInterval(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-bold"
          />
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Interval between automatic radius expansions (0-5km → 5-10km → 10-20km → etc.)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Initial Search Radius (km)
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={defaultRadius}
              onChange={(e) => setDefaultRadius(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Maximum Escalation Radius (km)
            </label>
            <input
              type="number"
              min={20}
              max={200}
              value={maxRadius}
              onChange={(e) => setMaxRadius(e.target.value)}
              className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-bold"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            Duplicate Request Detection Window (Hours)
          </label>
          <input
            type="number"
            min={1}
            max={48}
            value={duplicateWindow}
            onChange={(e) => setDuplicateWindow(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-bold"
          />
          <span className="text-[10px] text-slate-500 mt-0.5 block">
            Time window to warn against duplicate requests by same requester at same hospital.
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-rose-900/40 transition mt-4"
        >
          <Save className="w-4 h-4" />
          <span>Save System Configuration</span>
        </button>
      </form>
    </div>
  );
};
