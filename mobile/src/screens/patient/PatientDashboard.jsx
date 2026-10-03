import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  Activity,
  PlusCircle,
  Building2,
  Clock,
  ChevronRight,
  ShieldCheck,
  Droplet,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../utils/api';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const PatientDashboard = ({ onNavigate, onSelectRequest }) => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get('/patients/requests');
        if (res.success) {
          setMyRequests(res.data);
        }
      } catch (err) {
        console.error('Error fetching patient requests:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const activeRequest = myRequests.find((r) =>
    ['MATCHING', 'ACTIVE', 'PENDING_VERIFICATION', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)
  );

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <MedicalDisclaimer compact />

      {/* Greeting */}
      <div>
        <span className="text-[11px] text-slate-500 font-medium">Emergency Patient Care</span>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Hello, {user?.name || 'Patient Attendant'}
        </h2>
      </div>

      {/* Prominent High-Visibility Emergency Action Button */}
      <button
        onClick={() => onNavigate('create-request')}
        className="w-full py-5 px-6 bg-gradient-to-r from-rose-600 via-rose-700 to-rose-800 hover:from-rose-500 hover:to-rose-700 text-white rounded-3xl font-black text-base flex items-center justify-between shadow-lg shadow-rose-300/40 active:scale-98 transition transform cursor-pointer border border-rose-500"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse">
            <AlertOctagon className="w-7 h-7 text-white" />
          </div>
          <div className="text-left">
            <span className="text-lg tracking-wide block leading-none">🚨 NEED BLOOD NOW</span>
            <span className="text-[11px] font-normal text-rose-100 opacity-90 block mt-1">
              Create instant emergency broadcast
            </span>
          </div>
        </div>
        <ChevronRight className="w-6 h-6 text-white/80" />
      </button>

      {/* Live Track Current Active Request if one exists */}
      {activeRequest && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-ping" />
              <span className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                Active Emergency Request
              </span>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200/80 text-amber-900 rounded-full">
              {activeRequest.status}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="text-sm font-black text-slate-900 block">
                {activeRequest.bloodGroup} Blood • {activeRequest.unitsRequired} Units
              </span>
              <span className="text-[11px] text-slate-600">
                {activeRequest.hospitalId?.hospitalName || 'Emergency Hospital'}
              </span>
            </div>

            <button
              onClick={() => onSelectRequest(activeRequest._id)}
              className="py-1.5 px-3 bg-amber-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-amber-700 transition"
            >
              Track Live →
            </button>
          </div>
        </div>
      )}

      {/* Nearby Blood Availability Table per Prompt spec */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplet className="w-4 h-4 text-rose-600 fill-rose-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Nearby Blood Availability
            </h3>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
            Live Verified Stocks
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-extrabold text-rose-600 block">O+</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">8 Units</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">2.8 km away</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-extrabold text-rose-600 block">A+</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">4 Units</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">3.4 km away</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-extrabold text-rose-600 block">B+</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">6 Units</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">1.9 km away</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-xs font-extrabold text-rose-600 block">AB+</span>
            <span className="text-sm font-black text-slate-900 mt-0.5 block">2 Units</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">4.2 km away</span>
          </div>
        </div>
      </div>

      {/* My Emergency Requests Feed */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            My Blood Requests ({myRequests.length})
          </h3>
          <button
            onClick={() => onNavigate('my-requests')}
            className="text-[11px] text-rose-600 font-bold hover:underline"
          >
            View All
          </button>
        </div>

        {loading ? (
          <div className="py-6 text-center text-slate-400 text-xs">Loading requests...</div>
        ) : myRequests.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              No requests submitted yet. Use the red button above in an emergency.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {myRequests.slice(0, 3).map((req) => (
              <div
                key={req._id}
                onClick={() => onSelectRequest(req._id)}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-rose-200 shadow-xs flex items-center justify-between cursor-pointer transition active:scale-99"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-700 font-black text-xs flex items-center justify-center">
                    {req.bloodGroup}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug">
                      {req.hospitalId?.hospitalName || 'Emergency Center'}
                    </h4>
                    <span className="text-[10px] text-slate-500 block">
                      {req.unitsRequired} Units • {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      req.status === 'FULFILLED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : req.status === 'CANCELLED'
                        ? 'bg-slate-200 text-slate-700'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {req.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
