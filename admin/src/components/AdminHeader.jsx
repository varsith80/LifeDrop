import React from 'react';
import { ShieldCheck, LogOut, Radio } from 'lucide-react';

export const AdminHeader = ({ user, onLogout }) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between select-none">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-950/60 border border-emerald-800/60 rounded-full text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-Time Health-Tech Engine Active</span>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs">
        <div className="text-right">
          <span className="font-bold text-white block leading-tight">{user?.name || 'Chief Administrator'}</span>
          <span className="text-[10px] text-slate-400">admin@hemolink.org</span>
        </div>

        <button
          onClick={onLogout}
          className="p-2 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 rounded-xl transition"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
