import React from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Package,
  AlertTriangle,
  FileText,
  Settings,
  HeartHandshake,
} from 'lucide-react';

export const Sidebar = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'users', label: 'User Directory', icon: Users },
    { id: 'hospitals', label: 'Hospital Verifications', icon: Building2 },
    { id: 'bloodbanks', label: 'Blood Bank Verifications', icon: Package },
    { id: 'emergencies', label: 'Emergency Monitoring', icon: AlertTriangle },
    { id: 'audit', label: 'Audit Trail Logs', icon: FileText },
    { id: 'settings', label: 'System Configuration', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 select-none">
      <div>
        <div className="flex items-center gap-2.5 px-3 py-3 mb-6 bg-slate-900 rounded-2xl border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-rose-600 flex items-center justify-center text-white shadow-md">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white leading-tight">HemoLink Admin</h1>
            <span className="text-[10px] text-slate-400 font-medium">Clinical Oversight Portal</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-rose-600 text-white shadow-sm shadow-rose-900/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3 bg-slate-900/60 rounded-2xl border border-slate-800 text-[11px] text-slate-400">
        <span className="font-bold text-slate-300 block mb-0.5">Medical Safety Rule</span>
        Transfusion matching is strictly non-clinical & requires hospital approval.
      </div>
    </aside>
  );
};
