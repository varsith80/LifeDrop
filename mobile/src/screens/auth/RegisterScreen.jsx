import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Building2, MapPin, Droplet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BLOOD_GROUPS } from '../../constants';

export const RegisterScreen = ({ onGoToLogin, onSuccess }) => {
  const { register } = useAuth();
  const [role, setRole] = useState('DONOR');
  const [step, setStep] = useState(1); // 1: Info, 2: OTP Verification
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [dateOfBirth, setDateOfBirth] = useState('1998-01-01');
  const [location, setLocation] = useState('Anna Nagar, Chennai');
  const [hospitalName, setHospitalName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      setError('Please fill out all required fields.');
      return;
    }
    setError('');
    // Advance to OTP step (OTP simulated: 123456)
    setStep(2);
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit OTP code sent to your phone/email.');
      return;
    }

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
        registrationNumber: ['HOSPITAL', 'BLOOD_BANK'].includes(role) ? registrationNumber || `REG-${Date.now()}` : undefined,
        latitude: 13.0827,
        longitude: 80.2707,
      };

      const res = await register(payload);
      if (res.success && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-white text-slate-800">
      <div>
        <div className="pt-2 mb-4">
          <span className="text-[11px] font-bold text-rose-600 tracking-wider uppercase">Join HemoLink</span>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Create Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            {step === 1 ? 'Select your role and provide account details.' : 'Verify your phone number with OTP.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleInitialSubmit} className="space-y-3.5">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Role</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'DONOR', label: '🩸 Blood Donor' },
                  { id: 'PATIENT', label: '👤 Patient / Attendant' },
                  { id: 'HOSPITAL', label: '🏥 Hospital' },
                  { id: 'BLOOD_BANK', label: '🏢 Blood Bank' },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`py-2 px-2.5 rounded-xl border text-center font-medium transition ${
                      role === r.id
                        ? 'border-rose-600 bg-rose-50 text-rose-700 font-bold shadow-xs'
                        : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {role === 'HOSPITAL' ? 'Hospital Name' : role === 'BLOOD_BANK' ? 'Blood Bank Name' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@domain.com"
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98400..."
                    className="w-full pl-8 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Role specific inputs */}
            {role === 'DONOR' && (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-rose-600 focus:outline-none"
                  >
                    {BLOOD_GROUPS.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}

            {['HOSPITAL', 'BLOOD_BANK'].includes(role) && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Medical Registration / License #</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    placeholder="e.g. MED-LIC-2026-009"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City / Area Location</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Thousand Lights, Chennai"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-200 active:scale-98 transition mt-3"
            >
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Step 2: OTP Verification */
          <form onSubmit={handleVerifyAndRegister} className="space-y-4 py-4">
            <div className="text-center p-4 bg-rose-50/70 border border-rose-100 rounded-2xl">
              <CheckCircle2 className="w-10 h-10 text-rose-600 mx-auto mb-2" />
              <h3 className="text-sm font-bold text-slate-900">Enter Verification Code</h3>
              <p className="text-xs text-slate-600 mt-1">
                We simulated sending an SMS OTP to <span className="font-semibold text-slate-900">{phone}</span>.
              </p>
              <p className="text-[11px] text-rose-600 font-mono mt-2 bg-rose-100/60 py-1 rounded">
                Demo Code: <strong>741258</strong>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">6-Digit Code</label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="741258"
                className="w-full text-center tracking-widest text-lg font-bold py-3 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-200 active:scale-98 transition"
            >
              <span>{loading ? 'Creating Account...' : 'Verify OTP & Complete Registration'}</span>
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-medium py-1"
            >
              ← Back to Edit Details
            </button>
          </form>
        )}
      </div>

      <div className="pt-4 text-center">
        <p className="text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={onGoToLogin}
            className="text-rose-600 font-bold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};
