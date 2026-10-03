import React from 'react';
import {
  Home,
  AlertCircle,
  History,
  User,
  PlusCircle,
  Activity,
  Package,
  Building2,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const BottomNav = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  if (!user) return null;

  const role = user.role;

  let tabs = [];
  if (role === 'DONOR') {
    tabs = [
      { id: 'dashboard', label: 'Home', icon: Home },
      { id: 'emergency-requests', label: 'Emergency', icon: AlertCircle, badge: true },
      { id: 'history', label: 'History', icon: History },
      { id: 'profile', label: 'Profile', icon: User },
    ];
  } else if (role === 'PATIENT') {
    tabs = [
      { id: 'dashboard', label: 'Home', icon: Home },
      { id: 'create-request', label: 'Need Blood', icon: PlusCircle, highlight: true },
      { id: 'my-requests', label: 'Tracking', icon: Activity },
      { id: 'profile', label: 'Profile', icon: User },
    ];
  } else if (role === 'HOSPITAL') {
    tabs = [
      { id: 'dashboard', label: 'Requests', icon: AlertCircle },
      { id: 'verify-requests', label: 'Verifications', icon: CheckCircle },
      { id: 'profile', label: 'Hospital', icon: Building2 },
    ];
  } else if (role === 'BLOOD_BANK') {
    tabs = [
      { id: 'dashboard', label: 'Overview', icon: Home },
      { id: 'inventory', label: 'Inventory', icon: Package },
      { id: 'profile', label: 'Blood Bank', icon: Building2 },
    ];
  } else {
    tabs = [
      { id: 'dashboard', label: 'Overview', icon: Home },
      { id: 'profile', label: 'Profile', icon: User },
    ];
  }

  return (
    <nav aria-label="Bottom Navigation" className="bg-white border-t border-slate-200/80 px-2 py-1.5 flex items-center justify-around sticky bottom-0 z-20 shadow-md">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.highlight) {
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center -mt-5"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 ${
                  isActive
                    ? 'bg-rose-700 text-white ring-4 ring-rose-100 shadow-rose-300'
                    : 'bg-rose-600 text-white shadow-rose-200 hover:bg-rose-700'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-rose-600 mt-1">{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all relative ${
              isActive ? 'text-rose-600 font-semibold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
              {tab.badge && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </div>
            <span className="text-[11px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
