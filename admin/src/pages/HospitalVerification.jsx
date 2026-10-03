import React, { useState, useEffect } from 'react';
import { Building2, CheckCircle, XCircle, ShieldCheck, MapPin, RefreshCw } from 'lucide-react';
import { adminApi } from '../services/api';

export const HospitalVerification = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await adminApi.get('/admin/hospitals/pending');
      if (res.success) {
        setHospitals(res.data);
      }
    } catch (err) {
      console.error('Error fetching pending hospitals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleVerify = async (id, status) => {
    try {
      const res = await adminApi.patch(`/admin/hospitals/${id}/verify`, { status });
      if (res.success) {
        setHospitals((prev) => prev.filter((h) => h._id !== id));
      }
    } catch (err) {
      alert(`Verification action failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Hospital License Approvals</h2>
          <p className="text-xs text-slate-400 mt-1">
            Verify authorized medical centers and hospital emergency wards for transfusion coordination.
          </p>
        </div>

        <button
          onClick={fetchPending}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-500 text-xs">Loading pending verifications...</div>
      ) : hospitals.length === 0 ? (
        <div className="p-12 bg-slate-900 border border-slate-800 rounded-2xl text-center text-slate-400">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">All Hospital Registrations Verified</h3>
          <p className="text-xs text-slate-500 mt-1">No hospital accounts currently pending review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hospitals.map((h) => (
            <div key={h._id} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/60 text-purple-400 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{h.hospitalName}</h4>
                    <span className="text-[11px] text-slate-400 font-mono">Lic: {h.registrationNumber}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-400 border border-amber-800/60 uppercase">
                  Pending
                </span>
              </div>

              <div className="text-xs text-slate-400 space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800/60">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{h.address}, {h.city} ({h.pincode})</span>
                </div>
                <div>Contact: {h.phone} • {h.email}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleVerify(h._id, 'VERIFIED')}
                  className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verify Hospital</span>
                </button>
                <button
                  onClick={() => handleVerify(h._id, 'REJECTED')}
                  className="py-2 bg-slate-800 hover:bg-rose-950 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
