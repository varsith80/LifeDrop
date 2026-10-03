import React from 'react';
import { HeartHandshake, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';

export const Header = ({ onOpenNotifications, unreadCount = 0 }) => {
  const { user, logout } = useAuth();
  const { connected } = useSocket();

  const getRoleBadge = (role) => {
    switch (role) {
      case 'DONOR':
        return { label: 'Donor', bg: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'PATIENT':
        return { label: 'Patient/Attendant', bg: 'bg-blue-100 text-blue-800 border-blue-200' };
      case 'HOSPITAL':
        return { label: 'Hospital Staff', bg: 'bg-purple-100 text-purple-800 border-purple-200' };
      case 'BLOOD_BANK':
        return { label: 'Blood Bank', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'ADMIN':
        return { label: 'Admin', bg: 'bg-amber-100 text-amber-800 border-amber-200' };
      default:
        return { label: 'Guest', bg: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  const badge = getRoleBadge(user?.role);

  return (
    <div className="bg-white border-b border-slate-200/80 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-rose-600 flex items-center justify-center text-white shadow-sm shadow-rose-200">
          <HeartHandshake className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold tracking-tight text-slate-900 leading-none">HemoLink</h1>
            <span
              className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-amber-400'}`}
              title={connected ? 'Live Socket Connected' : 'Connecting to live socket...'}
            />
          </div>
          <span className="text-[10px] text-slate-500 font-medium">Emergency Blood Coordination</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {user ? (
          <>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badge.bg}`}
            >
              {badge.label}
            </span>

            <button
              onClick={onOpenNotifications}
              className="relative p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={logout}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-full hover:bg-slate-100 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <span className="text-xs text-slate-500 font-medium">Welcome</span>
        )}
      </div>
    </div>
  );
};
