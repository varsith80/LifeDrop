import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Droplet,
  MapPin,
  ShieldCheck,
  Bell,
  Lock,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const ProfileScreen = () => {
  const { user, profile, logout } = useAuth();
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <div>
        <h2 className="text-lg font-bold text-slate-900 leading-tight">Account & Preferences</h2>
        <p className="text-[11px] text-slate-500">Manage your credentials, privacy, and notifications.</p>
      </div>

      <MedicalDisclaimer compact />

      {/* User Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center gap-3.5">
        <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-xl">
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="text-sm font-extrabold text-slate-900 leading-tight">{user?.name}</h3>
            {user?.isVerified && (
              <ShieldCheck className="w-4 h-4 text-emerald-600" title="Verified Account" />
            )}
          </div>
          <span className="text-[11px] text-slate-500 font-medium">{user?.email}</span>
          <span className="text-[10px] text-slate-400 block mt-0.5">{user?.phone}</span>
        </div>
      </div>

      {/* Specific Details */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
          Profile Details
        </h4>

        {profile?.bloodGroup && (
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <Droplet className="w-3.5 h-3.5 text-rose-500" />
              <span>Blood Group</span>
            </span>
            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
              {profile.bloodGroup}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
          <span className="text-slate-500 flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Assigned Role</span>
          </span>
          <span className="font-semibold text-slate-800">{user?.role}</span>
        </div>

        {profile?.location && (
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
            <span className="text-slate-500 flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Registered Location</span>
            </span>
            <span className="font-medium text-slate-800 truncate max-w-[160px]">
              {profile.location}
            </span>
          </div>
        )}
      </div>

      {/* Settings & Privacy */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs space-y-3 text-xs">
        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
          Settings & Privacy
        </h4>

        <div className="flex items-center justify-between py-1 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-slate-500" />
            <span>Emergency Broadcast Notifications</span>
          </div>
          <button
            onClick={() => setNotifEnabled(!notifEnabled)}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
              notifEnabled ? 'bg-rose-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                notifEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        <div className="flex items-center justify-between py-1 text-slate-600">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Donor Coordinate Privacy Guard</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>
      </div>

      {/* Logout button */}
      <button
        onClick={logout}
        className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition"
      >
        <LogOut className="w-4 h-4" />
        <span>Log Out of HemoLink</span>
      </button>
    </div>
  );
};
