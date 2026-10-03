import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Share2,
  Activity,
  ArrowLeft,
  Flame,
} from 'lucide-react';
import { api } from '../../utils/api';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const EmergencyRequestsScreen = ({ onBack, onNavigateTracking }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null); // { type: 'ACCEPT' | 'REJECT', request }
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await api.get('/donors/emergency-requests');
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('[EmergencyRequestsScreen] Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async () => {
    if (!activeModal?.request) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/donors/requests/${activeModal.request.request._id}/accept`, {
        notes: notes || 'En route to hospital immediately.',
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Thank you! You have accepted this emergency. The hospital has been notified of your arrival.',
          requestId: activeModal.request.request._id,
        });
        setActiveModal(null);
        fetchRequests();
      }
    } catch (err) {
      alert(`Accept failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (relay = true) => {
    if (!activeModal?.request) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/donors/requests/${activeModal.request.request._id}/reject`, {
        relay,
      });

      if (res.success) {
        setFeedback({
          type: 'info',
          message: relay
            ? 'Request passed. Relay engine is contacting the next nearest eligible donor.'
            : 'Request declined.',
        });
        setActiveModal(null);
        fetchRequests();
      }
    } catch (err) {
      alert(`Response failed: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">Emergency Blood Requests</h2>
          <p className="text-[11px] text-slate-500">Matching urgent transfusions in your vicinity.</p>
        </div>
      </div>

      <MedicalDisclaimer compact />

      {feedback && (
        <div
          className={`p-3 rounded-2xl border text-xs flex flex-col gap-2 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{feedback.message}</span>
          </div>
          {feedback.requestId && (
            <button
              onClick={() => onNavigateTracking(feedback.requestId)}
              className="self-start text-[11px] font-bold text-emerald-700 underline"
            >
              Track Request Live →
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400">
          <Activity className="w-6 h-6 animate-spin text-rose-600 mx-auto mb-2" />
          <span className="text-xs">Finding matching emergencies nearby...</span>
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center my-6">
          <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-800">No Active Emergency Requests</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            You are in a peaceful zone! We will instantly notify you via push & in-app alerts when a compatible emergency arrives.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {requests.map((item) => {
            const req = item.request;
            const dist = item.distance;
            const isAccepted = item.matchStatus === 'ACCEPTED';

            return (
              <div
                key={req._id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3 hover:border-rose-200 transition"
              >
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex flex-col items-center justify-center font-black shadow-xs">
                      <span className="text-xs leading-none">{req.bloodGroup}</span>
                      <span className="text-[9px] font-semibold opacity-90">Blood</span>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">
                        {req.hospitalId?.hospitalName || 'Emergency Hospital'}
                      </h3>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{req.hospitalId?.city || 'Local Metro'} • {dist} km away</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                      req.urgency === 'CRITICAL'
                        ? 'bg-rose-100 text-rose-700 animate-pulse'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>{req.urgency}</span>
                  </span>
                </div>

                {/* Details Bar */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Required</span>
                    <span className="font-bold text-rose-600">{req.unitsRequired} Units</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Needed By</span>
                    <span className="font-semibold text-slate-700">{req.requiredTime || 'Immediate'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Status</span>
                    <span className="font-semibold text-slate-800">{req.status}</span>
                  </div>
                </div>

                {req.additionalInformation && (
                  <p className="text-[11px] text-slate-600 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/60">
                    "{req.additionalInformation}"
                  </p>
                )}

                {/* Action buttons */}
                {isAccepted ? (
                  <div className="p-2 bg-emerald-50 text-emerald-800 rounded-xl text-center font-bold text-xs flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>You Have Accepted This Request</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => setActiveModal({ type: 'ACCEPT', request: item })}
                      className="py-2.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-98 transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Accept & Save</span>
                    </button>

                    <button
                      onClick={() => setActiveModal({ type: 'REJECT', request: item })}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium active:scale-98 transition flex items-center justify-center gap-1"
                    >
                      <Share2 className="w-3.5 h-3.5 text-slate-500" />
                      <span>Decline / Relay</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {activeModal.type === 'ACCEPT' ? (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Confirm Acceptance</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    You are committing to donate {activeModal.request.request.bloodGroup} blood at{' '}
                    <strong>{activeModal.request.request.hospitalId?.hospitalName}</strong>.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Estimated Arrival / Note for Hospital
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Arriving in 20 minutes via taxi..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setActiveModal(null)}
                    disabled={submitting}
                    className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={submitting}
                    className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    {submitting ? 'Confirming...' : 'Yes, I Am Coming!'}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Decline or Relay</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Unable to donate right now? You can automatically pass this request to the next nearest eligible donor.
                  </p>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleReject(true)}
                    disabled={submitting}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Relay to Next Eligible Donor</span>
                  </button>

                  <button
                    onClick={() => handleReject(false)}
                    disabled={submitting}
                    className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-medium"
                  >
                    Just Decline
                  </button>

                  <button
                    onClick={() => setActiveModal(null)}
                    className="w-full text-center text-xs text-slate-400 hover:text-slate-600 py-1"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
