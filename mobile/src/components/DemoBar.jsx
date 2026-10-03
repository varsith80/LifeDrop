import React, { useState } from 'react';
import { Play, CheckCircle2, User, Building2, Droplet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';

export const DemoBar = ({ onFlowComplete }) => {
  const { user, quickDemoLogin } = useAuth();
  const [runningFlow, setRunningFlow] = useState(false);
  const [flowLog, setFlowLog] = useState('');

  const handleRoleSwitch = async (roleName) => {
    try {
      await quickDemoLogin(roleName);
    } catch (err) {
      alert(`Could not log in as ${roleName}: ${err.message}`);
    }
  };

  const runFullWorkflow = async () => {
    setRunningFlow(true);
    setFlowLog('1. Authenticating as Patient...');

    try {
      // 1. Login as Patient
      const pRes = await api.post('/auth/login', {
        email: 'patient1@hemolink.org',
        password: 'Password@123',
      });
      api.setToken(pRes.data.accessToken);

      // 2. Fetch Hospitals
      setFlowLog('2. Finding nearest hospital...');
      const hospRes = await api.get('/hospitals');
      const hospital = hospRes.data[0];

      // 3. Create Emergency Request for O+ Blood
      setFlowLog('3. Creating O+ Emergency Request (2 Units)...');
      const reqRes = await api.post('/patients/requests', {
        patientName: 'Demo Patient (ICU Trauma)',
        bloodGroup: 'O+',
        componentType: 'WHOLE_BLOOD',
        unitsRequired: 2,
        hospitalId: hospital._id,
        urgency: 'CRITICAL',
        requiredDate: new Date().toISOString().split('T')[0],
        requiredTime: 'ASAP',
        location: `${hospital.hospitalName}, Critical Ward`,
        latitude: hospital.latitude,
        longitude: hospital.longitude,
      });

      const requestId = reqRes.data.request._id;
      setFlowLog(`4. Request created (${requestId}). Switching to Hospital for verification...`);

      // 4. Login as Hospital to Verify Request
      const hRes = await api.post('/auth/login', {
        email: 'hospital1@hemolink.org',
        password: 'Password@123',
      });
      api.setToken(hRes.data.accessToken);

      await api.post(`/hospitals/requests/${requestId}/verify`, { approved: true });
      setFlowLog('5. Hospital verified request! Matching nearby O+ donors...');

      // 5. Login as Donor 1 (O+) to Accept Request
      const dRes = await api.post('/auth/login', {
        email: 'donor1@hemolink.org',
        password: 'Password@123',
      });
      api.setToken(dRes.data.accessToken);
      const donorUserId = dRes.data.user._id;

      setFlowLog('6. Donor Arun Kumar (O+) accepting emergency request...');
      await api.post(`/donors/requests/${requestId}/accept`, {
        notes: 'En route, ETA 15 minutes!',
      });

      // 6. Switch back to Hospital to Confirm Donation
      setFlowLog('7. Donor arrived at Hospital. Hospital confirming donation...');
      api.setToken(hRes.data.accessToken);
      await api.post(`/hospitals/requests/${requestId}/confirm-donation`, {
        donorId: donorUserId,
        unitsDonated: 2,
        componentType: 'WHOLE_BLOOD',
        notes: 'Both units successfully collected and cross-matched.',
      });

      setFlowLog('✅ Full Workflow Complete: Emergency Request FULFILLED!');
      setTimeout(() => {
        setRunningFlow(false);
        setFlowLog('');
        if (onFlowComplete) onFlowComplete(requestId);
      }, 2500);
    } catch (err) {
      console.error('[Demo Workflow Error]', err);
      setFlowLog(`Workflow Error: ${err.message}`);
      setTimeout(() => setRunningFlow(false), 3500);
    }
  };

  return (
    <div className="bg-slate-800 text-white px-3 py-2 text-xs border-b border-slate-700 select-none">
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Demo Quick Switch:</span>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => handleRoleSwitch('DONOR')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              user?.role === 'DONOR' ? 'bg-rose-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🩸 Donor (O+)
          </button>

          <button
            onClick={() => handleRoleSwitch('DONOR_UNIVERSAL')}
            className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition"
            title="Priya Sharma - O- Universal Donor"
          >
            🅾️ Univ (O-)
          </button>

          <button
            onClick={() => handleRoleSwitch('PATIENT')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              user?.role === 'PATIENT' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            👤 Patient
          </button>

          <button
            onClick={() => handleRoleSwitch('HOSPITAL')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              user?.role === 'HOSPITAL' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🏥 Hospital
          </button>

          <button
            onClick={() => handleRoleSwitch('BLOOD_BANK')}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition ${
              user?.role === 'BLOOD_BANK' ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            🏢 Blood Bank
          </button>
        </div>
      </div>

      {/* One-click end-to-end automation runner */}
      <div className="mt-1.5 pt-1.5 border-t border-slate-700/60 flex items-center justify-between">
        <button
          onClick={runFullWorkflow}
          disabled={runningFlow}
          className="w-full flex items-center justify-center gap-1.5 py-1 px-3 bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 disabled:opacity-50 text-white rounded font-semibold text-[11px] shadow-sm transition"
        >
          <Play className={`w-3.5 h-3.5 ${runningFlow ? 'animate-spin' : ''}`} />
          <span>{runningFlow ? 'Simulating End-to-End Emergency...' : '⚡ Run Complete End-to-End Emergency Flow'}</span>
        </button>
      </div>

      {flowLog && (
        <div className="mt-1 text-[10px] text-amber-300 bg-slate-900/80 p-1.5 rounded font-mono truncate">
          {flowLog}
        </div>
      )}
    </div>
  );
};
