import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminHeader } from './components/AdminHeader';
import { DashboardOverview } from './pages/DashboardOverview';
import { UserManagement } from './pages/UserManagement';
import { HospitalVerification } from './pages/HospitalVerification';
import { BloodBankVerification } from './pages/BloodBankVerification';
import { EmergencyMonitor } from './pages/EmergencyMonitor';
import { AuditLogs } from './pages/AuditLogs';
import { SystemSettings } from './pages/SystemSettings';
import { adminApi } from './services/api';
import { Lock, Mail, ShieldAlert, HeartHandshake } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hemolink_admin_token'));
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Login form state
  const [email, setEmail] = useState('admin@hemolink.org');
  const [password, setPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get('token');
      if (urlToken) {
        localStorage.setItem('hemolink_admin_token', urlToken);
        setToken(urlToken);
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const savedToken = urlToken || localStorage.getItem('hemolink_admin_token');
      if (savedToken) {
        adminApi.setToken(savedToken);
        try {
          const res = await adminApi.get('/auth/me');
          if (res.success && res.data.user.role === 'ADMIN') {
            setUser(res.data.user);
          } else {
            adminApi.setToken(null);
            setToken(null);
          }
        } catch (err) {
          adminApi.setToken(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setLoginError('');

    try {
      const res = await adminApi.post('/auth/login', { email, password });
      if (res.success) {
        if (res.data.user.role !== 'ADMIN') {
          throw new Error('Access denied. Administrator privileges required.');
        }
        setUser(res.data.user);
        setToken(res.data.accessToken);
        adminApi.setToken(res.data.accessToken);
      }
    } catch (err) {
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    adminApi.setToken(null);
    setUser(null);
    setToken(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-rose-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  // Dedicated Secure Admin Login View
  if (!user || !token) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center mx-auto mb-3 text-rose-500">
              <HeartHandshake className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">LifeDrop Administrative Governance Portal</h1>
            <p className="text-xs text-slate-400 mt-1">
              Secure access for authorized clinical oversight and platform management.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@hemolink.org"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-900/40 transition active:scale-98"
            >
              {submitting ? 'Authenticating...' : 'Sign In as Administrator'}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <span className="text-[11px] text-slate-500">
              Demo Credentials: <code className="text-rose-400">admin@hemolink.org</code> / <code className="text-rose-400">Admin@123</code>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Navigation Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={(tab) => setActiveTab(tab)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader user={user} onLogout={handleLogout} />

        <main className="flex-1 p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {activeTab === 'overview' && <DashboardOverview />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'hospitals' && <HospitalVerification />}
          {activeTab === 'bloodbanks' && <BloodBankVerification />}
          {activeTab === 'emergencies' && <EmergencyMonitor />}
          {activeTab === 'audit' && <AuditLogs />}
          {activeTab === 'settings' && <SystemSettings />}
        </main>
      </div>
    </div>
  );
}
