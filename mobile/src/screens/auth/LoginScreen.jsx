import React, { useState } from 'react';
import { Mail, Lock, LogIn, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginScreen = ({ onGoToRegister, onForgotPassword, onSuccess }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickCreds = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword(demoRole === 'ADMIN' ? 'Admin@123' : 'Password@123');
    setError('');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-800">
      <div>
        <div className="pt-2 mb-6">
          <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">Welcome Back</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Sign in to HemoLink</h2>
          <p className="text-xs text-slate-500 mt-1">Access real-time emergency matching & availability.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={onForgotPassword}
                className="text-[11px] text-rose-600 hover:text-rose-700 font-medium"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-200 active:scale-98 transition mt-2"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
          </button>
        </form>

        {/* Quick Demo Pre-fill helper */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            One-Tap Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => fillQuickCreds('donor1@hemolink.org', 'DONOR')}
              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-lg text-left truncate font-medium border border-rose-100"
            >
              🩸 Donor (O+)
            </button>
            <button
              type="button"
              onClick={() => fillQuickCreds('patient1@hemolink.org', 'PATIENT')}
              className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-lg text-left truncate font-medium border border-blue-100"
            >
              👤 Patient
            </button>
            <button
              type="button"
              onClick={() => fillQuickCreds('hospital1@hemolink.org', 'HOSPITAL')}
              className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 rounded-lg text-left truncate font-medium border border-purple-100"
            >
              🏥 Hospital
            </button>
            <button
              type="button"
              onClick={() => fillQuickCreds('bloodbank1@hemolink.org', 'BLOOD_BANK')}
              className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-left truncate font-medium border border-emerald-100"
            >
              🏢 Blood Bank
            </button>
          </div>
        </div>
      </div>

      <div className="pt-4 text-center">
        <p className="text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={onGoToRegister}
            className="text-rose-600 font-bold hover:underline"
          >
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};
