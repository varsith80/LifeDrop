import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  Radio,
  Clock,
  MapPin,
  Building2,
  Phone,
  UserCheck,
  AlertTriangle,
  ArrowLeft,
  XCircle,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const TrackRequestScreen = ({ requestId, onBack }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const { joinRequestRoom } = useSocket();

  const fetchTracking = async () => {
    try {
      const res = await api.get(`/patients/requests/${requestId}/tracking`);
      if (res.success) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching request tracking:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    joinRequestRoom(requestId);
    const interval = setInterval(fetchTracking, 4000);
    return () => clearInterval(interval);
  }, [requestId]);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this emergency request?')) return;
    setCancelling(true);
    try {
      const res = await api.post(`/patients/requests/${requestId}/cancel`);
      if (res.success) {
        fetchTracking();
      }
    } catch (err) {
      alert(`Could not cancel request: ${err.message}`);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin text-rose-600 mr-2" />
        <span className="text-xs">Connecting to live emergency tracker...</span>
      </div>
    );
  }

  if (!data?.request) {
    return (
      <div className="flex-1 p-6 text-center">
        <p className="text-xs text-slate-500">Request not found.</p>
        <button onClick={onBack} className="mt-3 text-xs text-rose-600 font-bold">
          ← Back
        </button>
      </div>
    );
  }

  const req = data.request;
  const timeline = data.timeline || [];
  const escalationTier = req.escalationTier || 1;
  const currentRadius = req.currentRadius || 5;

  const tiers = [
    { tier: 1, label: '0–5 km Initial Proximity' },
    { tier: 2, label: '5–10 km Local Ring' },
    { tier: 3, label: '10–20 km Metro Ring' },
    { tier: 4, label: '20–50 km Regional Ring' },
    { tier: 5, label: 'Registered Blood Banks' },
    { tier: 6, label: 'Partner Hospitals' },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">Emergency Blood Tracker</h2>
          <p className="text-[11px] text-slate-500 font-mono">ID: {req._id.slice(-8)}</p>
        </div>
      </div>

      <MedicalDisclaimer compact />

      {/* Emergency Header Card */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-rose-600 text-white flex flex-col items-center justify-center font-black">
              <span className="text-sm leading-none">{req.bloodGroup}</span>
              <span className="text-[10px] font-medium opacity-90">Blood</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">
                {req.patientName || 'Emergency Patient'}
              </span>
              <span className="text-[11px] text-slate-600 block mt-0.5">
                {req.hospitalId?.hospitalName}
              </span>
              <span className="text-[10px] text-slate-400 block">
                Required: {req.unitsRequired} Units • Fulfilled: {req.unitsFulfilled || 0} Units
              </span>
            </div>
          </div>

          <span
            className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
              req.status === 'FULFILLED'
                ? 'bg-emerald-100 text-emerald-800'
                : req.status === 'CANCELLED'
                ? 'bg-slate-200 text-slate-700'
                : 'bg-rose-100 text-rose-800 animate-pulse'
            }`}
          >
            {req.status}
          </span>
        </div>

        {/* Accepted Donor info if present */}
        {req.acceptedDonorId && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-emerald-950 block">Donor En Route!</span>
                <span className="text-[11px] text-emerald-800 font-medium">
                  {req.acceptedDonorId.name} ({req.acceptedDonorId.phone})
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Innovation 2: Automatic Radius Escalation Radar */}
      <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400 animate-spin" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Emergency Escalation Radar
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-600/80 rounded-full text-white">
            Current: {currentRadius} km
          </span>
        </div>

        <div className="space-y-1.5 pt-1">
          {tiers.map((t) => {
            const isCurrent = t.tier === escalationTier;
            const isPassed = t.tier < escalationTier;

            return (
              <div
                key={t.tier}
                className={`p-2 rounded-xl flex items-center justify-between text-xs transition-all ${
                  isCurrent
                    ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-400/40'
                    : isPassed
                    ? 'bg-slate-800/80 text-slate-300'
                    : 'bg-slate-800/30 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isCurrent ? 'bg-white animate-ping' : isPassed ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span>
                    Tier {t.tier}: {t.label}
                  </span>
                </div>
                <span className="text-[10px] font-mono">
                  {isCurrent ? 'Scanning...' : isPassed ? 'Escalated' : 'Queued'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Complete Step Timeline per Specification */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Live Coordination Timeline
        </h3>

        <div className="space-y-3 pl-1">
          {timeline.map((step, idx) => {
            const isCompleted = step.completed;

            return (
              <div key={idx} className="flex items-start gap-3 relative">
                {/* Connecting line */}
                {idx < timeline.length - 1 && (
                  <div
                    className={`absolute left-2.5 top-6 w-0.5 h-6 -ml-px ${
                      isCompleted ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                )}

                <div className="shrink-0 z-10">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 bg-white" />
                  ) : (
                    <Circle className="w-5 h-5 text-slate-300 bg-white" />
                  )}
                </div>

                <div className="pt-0.5">
                  <span
                    className={`text-xs block ${
                      isCompleted ? 'font-bold text-slate-900' : 'font-medium text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                  {step.timestamp && (
                    <span className="text-[10px] text-slate-400">
                      {new Date(step.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cancel action if still active */}
      {!['FULFILLED', 'CANCELLED', 'EXPIRED'].includes(req.status) && (
        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full py-3 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
        >
          <XCircle className="w-4 h-4" />
          <span>{cancelling ? 'Cancelling...' : 'Cancel Emergency Request'}</span>
        </button>
      )}
    </div>
  );
};
