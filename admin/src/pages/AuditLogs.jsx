import React, { useState, useEffect } from 'react';
import { FileText, Shield, Clock, RefreshCw } from 'lucide-react';
import { adminApi } from '../services/api';

export const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await adminApi.get('/admin/audit-logs');
      if (res.success) {
        setLogs(res.data);
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">Security & Operational Audit Trail</h2>
          <p className="text-xs text-slate-400 mt-1">
            Immutable log of all user registrations, request creations, hospital verifications, and transfusion records.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium font-mono text-[11px]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    Loading security audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-sans">
                    No audit records found.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4">
                      <span className="font-bold text-white font-sans">{log.action}</span>
                    </td>
                    <td className="py-3 px-4 text-rose-400">
                      {log.entityType} ({log.entityId ? log.entityId.slice(-6) : '-'})
                    </td>
                    <td className="py-3 px-4 text-slate-300 font-sans">
                      {log.userId?.name || 'System / Guest'}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-xs">
                      {JSON.stringify(log.metadata || {})}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
