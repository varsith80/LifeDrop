import React, { useState, useEffect } from 'react';
import { AlertTriangle, Radio, RefreshCw, ChevronRight, Droplet, Clock } from 'lucide-react';
import { adminApi } from '../services/api';

export const EmergencyMonitor = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEmergencies = async () => {
    try {
      const res = await adminApi.get('/admin/emergency-requests');
      if (res.success) {
        setRequests(res.data);
      }
    } catch (err) {
      console.error('Error fetching emergency requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();
    const interval = setInterval(fetchEmergencies, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleEscalateNow = async (id) => {
    try {
      const res = await adminApi.post(`/emergency/${id}/escalate`);
      if (res.success) {
        fetchEmergencies();
      }
    } catch (err) {
      alert(`Escalation failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Active Emergency Requests Monitor</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of patient needs, proximity escalation radius, and fulfillment status.
          </p>
        </div>

        <button
          onClick={fetchEmergencies}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Patient / Hospital</th>
                <th className="py-3 px-4">Blood Group</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Escalation Tier</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Escalation Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    Scanning active emergencies...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No emergency requests in system.
                  </td>
                </tr>
              ) : (
                requests.map((r) => {
                  const isActive = ['ACTIVE', 'MATCHING', 'ACCEPTED', 'IN_PROGRESS'].includes(r.status);
                  return (
                    <tr key={r._id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4">
                        <span className="font-bold text-white block">{r.patientName}</span>
                        <span className="text-[11px] text-slate-500">{r.hospitalId?.hospitalName}</span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-lg text-xs font-black bg-rose-950 text-rose-400 border border-rose-800/60">
                          {r.bloodGroup}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.urgency === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-400 animate-pulse'
                              : 'bg-amber-950 text-amber-400'
                          }`}
                        >
                          {r.urgency}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-200">
                          <Radio className="w-3.5 h-3.5 text-rose-400" />
                          <span>Tier {r.escalationTier || 1} ({r.currentRadius || 5} km)</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-bold text-white">
                          {r.unitsFulfilled || 0} / {r.unitsRequired}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            r.status === 'FULFILLED'
                              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60'
                              : r.status === 'CANCELLED'
                              ? 'bg-slate-800 text-slate-400'
                              : 'bg-rose-950 text-rose-400 border border-rose-800/60'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {isActive && (
                          <button
                            onClick={() => handleEscalateNow(r._id)}
                            className="px-2.5 py-1 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800/60 rounded-lg text-[11px] font-bold"
                          >
                            + Expand Radius
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
