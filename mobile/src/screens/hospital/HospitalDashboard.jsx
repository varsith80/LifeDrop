import React, { useState, useEffect } from 'react';
import {
  Building2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Droplet,
  Clock,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { api } from '../../utils/api';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const HospitalDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState(null); // { request }
  const [unitsDonated, setUnitsDonated] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchHospitalData = async () => {
    try {
      const [profRes, reqRes] = await Promise.all([
        api.get('/hospitals/my/profile'),
        api.get('/hospitals/my/requests'),
      ]);
      if (profRes.success) setProfile(profRes.data);
      if (reqRes.success) setRequests(reqRes.data);
    } catch (err) {
      console.error('Error fetching hospital dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const handleVerifyRequest = async (requestId, approved) => {
    try {
      const res = await api.post(`/hospitals/requests/${requestId}/verify`, { approved });
      if (res.success) {
        fetchHospitalData();
      }
    } catch (err) {
      alert(`Verification failed: ${err.message}`);
    }
  };

  const handleConfirmDonation = async () => {
    if (!confirmModal) return;
    setSubmitting(true);
    try {
      const res = await api.post(`/hospitals/requests/${confirmModal._id}/confirm-donation`, {
        donorId: confirmModal.acceptedDonorId._id || confirmModal.acceptedDonorId,
        unitsDonated: parseInt(unitsDonated, 10),
        notes: notes || 'Donation verified and collected at facility.',
      });

      if (res.success) {
        setConfirmModal(null);
        fetchHospitalData();
      }
    } catch (err) {
      alert(`Failed to confirm donation: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const pendingVerification = requests.filter((r) => r.verificationStatus === 'PENDING');
  const activeEmergencies = requests.filter((r) =>
    ['ACTIVE', 'MATCHING', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status)
  );

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <MedicalDisclaimer compact />

      {/* Hospital Identity Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              {profile?.hospitalName || 'Emergency Hospital Center'}
            </h2>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              License: {profile?.registrationNumber || 'HOSP-VERIFIED'}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Verified Center</span>
        </span>
      </div>

      {/* Innovation 5: Pending Patient Requests Requiring Verification */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            <span>Pending Medical Verification ({pendingVerification.length})</span>
          </h3>
          <button onClick={fetchHospitalData} className="text-slate-400 hover:text-slate-600">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {pendingVerification.length === 0 ? (
          <div className="p-4 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            No patient requests awaiting hospital verification.
          </div>
        ) : (
          <div className="space-y-2">
            {pendingVerification.map((req) => (
              <div
                key={req._id}
                className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-xs space-y-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">
                      Patient: {req.patientName}
                    </span>
                    <span className="text-[11px] text-rose-600 font-extrabold">
                      {req.bloodGroup} Blood • {req.unitsRequired} Units Required
                    </span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Urgency: {req.urgency} • Needed: {req.requiredTime}
                    </span>
                  </div>

                  <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-full uppercase">
                    Needs Approval
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleVerifyRequest(req._id, true)}
                    className="py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Approve & Match</span>
                  </button>

                  <button
                    onClick={() => handleVerifyRequest(req._id, false)}
                    className="py-1.5 bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 rounded-xl text-xs font-medium flex items-center justify-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Active Emergencies & Donor Arrival Verification */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Active Transfusion Requests ({activeEmergencies.length})
        </h3>

        {activeEmergencies.map((req) => (
          <div
            key={req._id}
            className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  {req.patientName} ({req.bloodGroup})
                </span>
                <span className="text-[10px] text-slate-500">
                  Fulfilled: {req.unitsFulfilled || 0} / {req.unitsRequired} Units
                </span>
              </div>

              <span
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  req.status === 'ACCEPTED' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                }`}
              >
                {req.status}
              </span>
            </div>

            {/* Check-in and confirm donation action */}
            {req.acceptedDonorId ? (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-purple-950">
                      Donor Accepted: {req.acceptedDonorId.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setConfirmModal(req);
                    setUnitsDonated(req.unitsRequired - (req.unitsFulfilled || 0));
                  }}
                  className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold text-xs shadow-xs transition"
                >
                  Confirm Donor Arrival & Donation
                </button>
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
                Proximity matching in progress (Scanning within {req.currentRadius || 5} km radius)...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Confirm Donation Modal */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Hospital Transfusion Confirmation</h3>
              <p className="text-xs text-slate-500 mt-1">
                Confirm donor arrival and successfully collected units for {confirmModal.bloodGroup} blood.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Units Successfully Collected
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={unitsDonated}
                  onChange={(e) => setUnitsDonated(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Medical Batch Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cross-matching complete. Stored in ICU transfusion unit."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                disabled={submitting}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDonation}
                disabled={submitting}
                className="py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold shadow-md shadow-purple-200"
              >
                {submitting ? 'Recording...' : 'Confirm Donation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
