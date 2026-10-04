import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Building2, 
  MapPin, 
  Droplet, 
  ArrowRight, 
  CheckCircle2, 
  X,
  HeartHandshake
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BLOOD_GROUPS } from '../../constants';

export const RegisterModal = ({ isOpen, onClose, onGoToLogin, onSuccess }) => {
  const { register } = useAuth();
  const [role, setRole] = useState('DONOR');
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dateOfBirth, setDateOfBirth] = useState('1998-01-01');
  const [location, setLocation] = useState('Chennai Central');
  const [hospitalName, setHospitalName] = useState('');

  if (!isOpen) return null;

  const handleNext = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('Please fill in all mandatory fields.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        name,
        email,
        phone,
        password,
        role,
        bloodGroup,
        dateOfBirth,
        location,
        hospitalName: role === 'HOSPITAL' ? hospitalName || name : undefined,
        registrationNumber: ['HOSPITAL', 'BLOOD_BANK'].includes(role) ? `REG-${Date.now().toString().slice(-6)}` : undefined,
        latitude: 13.0827,
        longitude: 80.2707,
      };

      const res = await register(payload);
      if (res.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#062416] p-5 text-white flex items-center justify-between border-b border-emerald-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">Create LifeDrop Account</h3>
              <p className="text-[10px] text-emerald-300">Join the Lifesaving Emergency Network</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-950/80 hover:bg-emerald-900 text-emerald-200 flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4 text-xs">
              
              {/* Role selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Select Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'DONOR', label: '🩸 Blood Donor' },
                    { id: 'PATIENT', label: '👤 Patient / Attendant' },
                    { id: 'HOSPITAL', label: '🏥 Hospital Hub' },
                    { id: 'BLOOD_BANK', label: '🏢 Blood Bank' },
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`p-2.5 rounded-xl border text-left font-bold transition-all ${
                        role === r.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Legal Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arun Kumar"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="arun@example.com"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile Phone</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Donor specific: Blood Group */}
              {role === 'DONOR' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600 font-bold text-rose-700"
                  >
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Hospital specific */}
              {role === 'HOSPITAL' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hospital Facility Name</label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Apollo Health City"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-600"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#0e3825] hover:bg-[#072416] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow"
              >
                <span>Continue to Verification</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-emerald-900">OTP Code Verification</h4>
                <p className="text-slate-600 text-[11px]">
                  A 6-digit verification code has been dispatched to {phone || email}.
                </p>
                <div className="text-[10px] text-emerald-700 font-mono bg-emerald-100/70 p-1 rounded inline-block">
                  Demo Fast Code: 123456
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Enter 6-Digit OTP</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-mono tracking-widest font-bold focus:outline-none focus:border-emerald-600"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-2/3 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow"
                >
                  <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 pt-3 text-center border-t border-slate-100 text-xs text-slate-500">
            Already have an account?{' '}
            <button
              onClick={() => {
                onClose();
                onGoToLogin();
              }}
              className="text-emerald-800 font-bold hover:underline"
            >
              Sign In Here
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
