import React, { useState, useEffect } from 'react';
import {
  Droplet,
  Heart,
  Calendar,
  AlertTriangle,
  ChevronRight,
  Clock,
  Sparkles,
  ShieldCheck,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const DonorDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const fetchDonorData = async () => {
    try {
      const [profileRes, reqRes] = await Promise.all([
        api.get('/donors/profile'),
        api.get('/donors/emergency-requests'),
      ]);

      if (profileRes.success) setProfile(profileRes.data);
      if (reqRes.success) setRequests(reqRes.data);
    } catch (err) {
      console.error('[DonorDashboard] Error loading donor data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonorData();
  }, []);

  const handleStatusToggle = async (newStatus) => {
    setUpdatingStatus(true);
    try {
      const res = await api.patch('/donors/availability', { status: newStatus });
      if (res.success) {
        setProfile((prev) => ({ ...prev, availabilityStatus: newStatus }));
      }
    } catch (err) {
      alert(`Could not update status: ${err.message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-slate-400">
        <Activity className="w-6 h-6 animate-spin text-rose-600 mr-2" />
        <span className="text-xs">Loading donor profile...</span>
      </div>
    );
  }

  const bloodGroup = profile?.bloodGroup || 'O+';
  const availability = profile?.availabilityStatus || 'AVAILABLE';
  const eligibility = profile?.eligibility;

  const urgentRequests = requests.slice(0, 3);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <MedicalDisclaimer compact />

      {/* Greeting & Quick Summary */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] text-slate-500 font-medium">Welcome back,</span>
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Hello, {user?.name || 'Donor'}
          </h2>
        </div>

        {/* Blood Group Badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 text-white rounded-2xl shadow-sm shadow-rose-200">
          <Droplet className="w-4 h-4 fill-white" />
          <span className="text-base font-black tracking-tight">{bloodGroup}</span>
        </div>
      </div>

      {/* Availability Status Card with 3 Toggleable states */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-700">Donation Availability</span>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
              availability === 'AVAILABLE'
                ? 'bg-emerald-100 text-emerald-800'
                : availability === 'AVAILABLE_LATER'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {availability === 'AVAILABLE' ? '🟢 Available' : availability === 'AVAILABLE_LATER' ? '🟡 Available Later' : '⚪ Unavailable'}
          </span>
        </div>

        {/* Status Toggle Buttons */}
        <div className="grid grid-cols-3 gap-1.5 text-[11px]">
          <button
            onClick={() => handleStatusToggle('AVAILABLE')}
            disabled={updatingStatus}
            className={`py-1.5 px-2 rounded-xl font-semibold transition ${
              availability === 'AVAILABLE'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Available
          </button>
          <button
            onClick={() => handleStatusToggle('AVAILABLE_LATER')}
            disabled={updatingStatus}
            className={`py-1.5 px-2 rounded-xl font-semibold transition ${
              availability === 'AVAILABLE_LATER'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Later Today
          </button>
          <button
            onClick={() => handleStatusToggle('UNAVAILABLE')}
            disabled={updatingStatus}
            className={`py-1.5 px-2 rounded-xl font-semibold transition ${
              availability === 'UNAVAILABLE'
                ? 'bg-slate-700 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Unavailable
          </button>
        </div>
      </div>

      {/* Next Eligibility Reminder Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1 text-[11px] text-rose-300 font-semibold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>Donation Eligibility</span>
            </div>
            <h3 className="text-sm font-bold text-white mt-1">
              {eligibility?.status === 'ELIGIBLE' ? 'You are Eligible to Donate!' : 'Donation Cooldown Active'}
            </h3>
            <p className="text-[11px] text-slate-300 mt-1 max-w-[240px]">
              {eligibility?.message || 'Ready for emergency blood needs.'}
            </p>
          </div>

          <div className="w-12 h-12 rounded-xl bg-white/10 flex flex-col items-center justify-center shrink-0">
            <span className="text-base font-black text-rose-400">
              {profile?.donationCount || 0}
            </span>
            <span className="text-[9px] uppercase font-bold text-slate-300">Donations</span>
          </div>
        </div>

        {eligibility?.daysRemaining > 0 && (
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Cooldown Remaining:</span>
            <span className="font-bold text-amber-300">{eligibility.daysRemaining} Days</span>
          </div>
        )}
      </div>

      {/* Nearby Urgent Blood Needs Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Nearby Emergency Requests ({requests.length})
            </h3>
          </div>
          <button
            onClick={() => onNavigate('emergency-requests')}
            className="text-[11px] text-rose-600 font-bold hover:underline flex items-center"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {urgentRequests.length === 0 ? (
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1.5" />
            <h4 className="text-xs font-bold text-slate-800">No Pending Emergency Needs</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No matching blood requests within your radius right now.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {urgentRequests.map(({ request, distance, isExactMatch, matchStatus }) => (
              <div
                key={request._id}
                onClick={() => onNavigate('emergency-requests')}
                className="bg-white p-3.5 rounded-2xl border border-rose-100 hover:border-rose-300 shadow-xs cursor-pointer transition active:scale-99"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 font-black text-xs flex items-center justify-center border border-rose-100">
                      {request.bloodGroup}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {request.hospitalId?.hospitalName || 'Emergency Hospital'}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>📍 {distance} km away</span>
                        <span>•</span>
                        <span className="text-rose-600 font-semibold">{request.unitsRequired} Units Required</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full uppercase">
                    {request.urgency}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => onNavigate('emergency-requests')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 shadow-xs text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Droplet className="w-5 h-5 fill-rose-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">Emergency Requests</span>
            <span className="text-[10px] text-slate-500">Respond & Save</span>
          </div>
        </button>

        <button
          onClick={() => onNavigate('history')}
          className="p-3 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-2.5 shadow-xs text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-900 block leading-tight">Donation History</span>
            <span className="text-[10px] text-slate-500">Badges & Records</span>
          </div>
        </button>
      </div>
    </div>
  );
};
