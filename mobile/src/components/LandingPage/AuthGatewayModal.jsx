import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Lock, 
  LogIn, 
  ShieldAlert, 
  ShieldCheck, 
  HeartHandshake, 
  User, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  X,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { API_BASE_URL } from '../../constants';

export const AuthGatewayModal = ({ 
  isOpen, 
  onClose, 
  initialTab = 'USER', // 'USER' | 'ADMIN'
  prefillRole = null, 
  onOpenRegister, 
  onLaunchDashboard,
  onLaunchAdminPortal
}) => {
  const { login: userLogin, user } = useAuth();
  
  const [activeTab, setActiveTab] = useState(initialTab); // 'USER' | 'ADMIN'

  // User form states
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState('');
  const [userSuccess, setUserSuccess] = useState(false);

  // Admin form states
  const [adminEmail, setAdminEmail] = useState('admin@hemolink.org');
  const [adminPassword, setAdminPassword] = useState('Admin@123');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminSuccess, setAdminSuccess] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem('hemolink_admin_token') || null);

  // Reset or prefill when modal opens or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setUserError('');
      setAdminError('');
      setUserSuccess(false);
      setAdminSuccess(false);

      if (prefillRole) {
        fillUserDemoCreds(prefillRole);
      }
    }
  }, [isOpen, initialTab, prefillRole]);

  if (!isOpen) return null;

  // Handle User Login
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail || !userPassword) {
      setUserError('Please provide your email and password.');
      return;
    }

    setUserLoading(true);
    setUserError('');

    try {
      const res = await userLogin(userEmail, userPassword);
      if (res.success) {
        setUserSuccess(true);
      }
    } catch (err) {
      setUserError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setUserLoading(false);
    }
  };

  // Handle Admin Login (Strict ADMIN Role Check)
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      setAdminError('Please provide the administrator credentials.');
      return;
    }

    setAdminLoading(true);
    setAdminError('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Admin login failed with status ${response.status}`);
      }

      if (data.data?.user?.role !== 'ADMIN') {
        throw new Error('Access denied. Administrator privileges required.');
      }

      const token = data.data.accessToken;
      localStorage.setItem('hemolink_admin_token', token);
      setAdminToken(token);
      setAdminSuccess(true);
    } catch (err) {
      setAdminError(err.message || 'Administrator authentication failed.');
    } finally {
      setAdminLoading(false);
    }
  };

  // Quick User Demo Creds
  const fillUserDemoCreds = (role) => {
    switch (role) {
      case 'DONOR':
        setUserEmail('donor1@hemolink.org');
        setUserPassword('Password@123');
        break;
      case 'DONOR_UNIVERSAL':
        setUserEmail('donor2@hemolink.org');
        setUserPassword('Password@123');
        break;
      case 'PATIENT':
        setUserEmail('patient1@hemolink.org');
        setUserPassword('Password@123');
        break;
      case 'HOSPITAL':
        setUserEmail('hospital1@hemolink.org');
        setUserPassword('Password@123');
        break;
      case 'BLOOD_BANK':
        setUserEmail('bloodbank1@hemolink.org');
        setUserPassword('Password@123');
        break;
      case 'ADMIN':
        setActiveTab('ADMIN');
        setAdminEmail('admin@hemolink.org');
        setAdminPassword('Admin@123');
        return;
      default:
        setUserEmail('donor1@hemolink.org');
        setUserPassword('Password@123');
    }
    setUserError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Top Header with Close Button */}
        <div className="bg-[#062416] p-5 text-white flex items-center justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight text-white">LifeDrop Gateway</h3>
              <p className="text-[10px] text-emerald-300">Secure Access for Life-Saving Stakeholders</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher: USER vs ADMIN */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex gap-2">
          <button
            onClick={() => setActiveTab('USER')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'USER'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>User / Stakeholder Login</span>
          </button>

          <button
            onClick={() => setActiveTab('ADMIN')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'ADMIN'
                ? 'bg-[#062416] text-white shadow-md'
                : 'bg-white text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Governance</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[80vh]">
          
          {/* ================= TAB 1: USER LOGIN ================= */}
          {activeTab === 'USER' && (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider block">
                  Stakeholder Sign In
                </span>
                <h4 className="text-xl font-black text-slate-900">
                  Welcome Back to LifeDrop
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sign in as Donor, Patient Attendant, Hospital, or Blood Bank.
                </p>
              </div>

              {userSuccess ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h5 className="text-sm font-bold text-emerald-900">Successfully Signed In!</h5>
                  <p className="text-xs text-emerald-700">
                    You are signed in as <span className="font-bold">{user?.name || user?.email}</span> ({user?.role}).
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      if (onLaunchDashboard) onLaunchDashboard();
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                  >
                    <span>Launch Stakeholder Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  {userError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                      <span>{userError}</span>
                    </div>
                  )}

                  <form onSubmit={handleUserSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="donor1@hemolink.org"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          value={userPassword}
                          onChange={(e) => setUserPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={userLoading}
                      className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-200 active:scale-98 transition mt-3"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>{userLoading ? 'Verifying...' : 'Sign In as User'}</span>
                    </button>
                  </form>

                  {/* One-Tap Demo Credentials */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      One-Tap Demo Accounts:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                      <button
                        type="button"
                        onClick={() => fillUserDemoCreds('DONOR')}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-left truncate font-medium border border-rose-100"
                      >
                        🩸 Donor (O+)
                      </button>
                      <button
                        type="button"
                        onClick={() => fillUserDemoCreds('DONOR_UNIVERSAL')}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-left truncate font-medium border border-rose-100"
                      >
                        🩸 Universal (O-)
                      </button>
                      <button
                        type="button"
                        onClick={() => fillUserDemoCreds('PATIENT')}
                        className="p-2 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-left truncate font-medium border border-blue-100"
                      >
                        👤 Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => fillUserDemoCreds('HOSPITAL')}
                        className="p-2 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-left truncate font-medium border border-purple-100"
                      >
                        🏥 Hospital
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 text-center border-t border-slate-100 text-xs text-slate-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenRegister();
                      }}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Create Account
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================= TAB 2: ADMIN LOGIN ================= */}
          {activeTab === 'ADMIN' && (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                  Governance Oversight
                </span>
                <h4 className="text-xl font-black text-slate-900">
                  Administrative Portal Login
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Restricted to authorized clinical directors and compliance managers.
                </p>
              </div>

              {adminSuccess ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h5 className="text-sm font-bold text-emerald-900">Administrator Verified!</h5>
                  <p className="text-xs text-emerald-700">
                    Logged in as <span className="font-bold">Dr. Sarah Mitchell</span> (Chief Governance).
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      if (onLaunchAdminPortal) {
                        onLaunchAdminPortal(adminToken);
                      } else {
                        window.open(`http://localhost:5174?token=${adminToken}`, '_blank');
                      }
                    }}
                    className="w-full py-2.5 px-4 bg-[#062416] hover:bg-black text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow"
                  >
                    <span>Launch Admin Governance Portal (Port 5174)</span>
                    <ExternalLink className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              ) : (
                <>
                  {adminError && (
                    <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{adminError}</span>
                    </div>
                  )}

                  <form onSubmit={handleAdminSubmit} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Admin Email
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="email"
                          required
                          value={adminEmail}
                          onChange={(e) => setAdminEmail(e.target.value)}
                          placeholder="admin@hemolink.org"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Admin Master Password
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="password"
                          required
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={adminLoading}
                      className="w-full py-3 px-4 bg-[#062416] hover:bg-black disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md active:scale-98 transition mt-3 border border-emerald-700/50"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>{adminLoading ? 'Authenticating Admin...' : 'Sign In as Administrator'}</span>
                    </button>
                  </form>

                  {/* One-Tap Admin Credential Pre-fill */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Default Administrator Demo:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminEmail('admin@hemolink.org');
                        setAdminPassword('Admin@123');
                        setAdminError('');
                      }}
                      className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-lg text-left font-medium border border-emerald-200 text-xs flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>Dr. Sarah Mitchell (Chief Oversight)</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-200/60 px-1.5 py-0.5 rounded">
                        Admin@123
                      </span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
