import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Building2,
  Calendar,
  Clock,
  MapPin,
  Droplet,
  ArrowLeft,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../utils/api';
import { BLOOD_GROUPS, COMPONENT_TYPES, URGENCIES } from '../../constants';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const CreateEmergencyRequestScreen = ({ onBack, onSuccess }) => {
  const [hospitals, setHospitals] = useState([]);
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [componentType, setComponentType] = useState('WHOLE_BLOOD');
  const [unitsRequired, setUnitsRequired] = useState(2);
  const [hospitalId, setHospitalId] = useState('');
  const [urgency, setUrgency] = useState('CRITICAL');
  const [requiredDate, setRequiredDate] = useState(new Date().toISOString().split('T')[0]);
  const [requiredTime, setRequiredTime] = useState('Immediate / ASAP');
  const [location, setLocation] = useState('');
  const [additionalInformation, setAdditionalInformation] = useState('');

  const [loadingHospitals, setLoadingHospitals] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const res = await api.get('/hospitals');
        if (res.success && res.data.length > 0) {
          setHospitals(res.data);
          setHospitalId(res.data[0]._id);
          setLocation(`${res.data[0].hospitalName}, ${res.data[0].address}`);
        }
      } catch (err) {
        console.error('Error fetching hospitals:', err);
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleHospitalChange = (e) => {
    const selectedId = e.target.value;
    setHospitalId(selectedId);
    const selected = hospitals.find((h) => h._id === selectedId);
    if (selected) {
      setLocation(`${selected.hospitalName}, ${selected.address}`);
    }
  };

  const handleSubmitClick = (e) => {
    e.preventDefault();
    setError('');
    setDuplicateWarning(null);

    if (!hospitalId) {
      setError('Please select a hospital facility.');
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    setSubmitting(true);
    setError('');

    const selectedHospital = hospitals.find((h) => h._id === hospitalId);

    try {
      const payload = {
        bloodGroup,
        componentType,
        unitsRequired: parseInt(unitsRequired, 10),
        hospitalId,
        urgency,
        requiredDate,
        requiredTime,
        location: location || (selectedHospital ? selectedHospital.address : 'Hospital Center'),
        latitude: selectedHospital?.latitude || 13.0827,
        longitude: selectedHospital?.longitude || 80.2707,
        additionalInformation,
      };

      const res = await api.post('/patients/requests', payload);

      if (res.success) {
        setShowConfirmModal(false);
        if (onSuccess) onSuccess(res.data.request._id);
      }
    } catch (err) {
      setShowConfirmModal(false);
      if (err.code === 'DUPLICATE_REQUEST') {
        setDuplicateWarning(err.message);
      } else {
        setError(err.message || 'Unable to create emergency request.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const selectedHospitalObj = hospitals.find((h) => h._id === hospitalId);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900 leading-tight">Create Emergency Blood Need</h2>
          <p className="text-[11px] text-slate-500">Initiate immediate matching across donors and blood banks.</p>
        </div>
      </div>

      <MedicalDisclaimer compact />

      {duplicateWarning && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-start gap-2 shadow-xs">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block">Duplicate Request Warning:</strong>
            <p className="mt-0.5">{duplicateWarning}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmitClick} className="space-y-3.5">
        {/* Blood Group and Units */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group Required</label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {BLOOD_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g} Blood
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Units Required</label>
            <input
              type="number"
              min={1}
              max={15}
              required
              value={unitsRequired}
              onChange={(e) => setUnitsRequired(e.target.value)}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>
        </div>

        {/* Component Type */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Component Type</label>
          <select
            value={componentType}
            onChange={(e) => setComponentType(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          >
            {COMPONENT_TYPES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Hospital Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Hospital / Medical Center</label>
          <div className="relative">
            <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <select
              value={hospitalId}
              onChange={handleHospitalChange}
              disabled={loadingHospitals}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              {hospitals.map((h) => (
                <option key={h._id} value={h._id}>
                  {h.hospitalName} ({h.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">Emergency Urgency</label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {URGENCIES.map((u) => (
              <button
                key={u.value}
                type="button"
                onClick={() => setUrgency(u.value)}
                className={`p-2 rounded-xl border text-left font-medium transition ${
                  urgency === u.value
                    ? 'border-rose-600 bg-rose-50 text-rose-800 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date and Time Required */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Required Date</label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="date"
                required
                value={requiredDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                className="w-full pl-9 pr-2 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Required Time</label>
            <div className="relative">
              <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={requiredTime}
                onChange={(e) => setRequiredTime(e.target.value)}
                placeholder="Immediate / 2 hrs"
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Specific Ward / Location Details */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Ward / Room Location Details</label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Apollo Hospital, ICU Ward 3, Bed 12"
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Additional Clinical Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Additional Clinical Instructions (Optional)
          </label>
          <textarea
            rows={2}
            value={additionalInformation}
            onChange={(e) => setAdditionalInformation(e.target.value)}
            placeholder="e.g. Cross-matching sample ready in lab. Contact attending nurse."
            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="w-full py-4 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-rose-200 active:scale-98 transition mt-4"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>CREATE EMERGENCY REQUEST</span>
        </button>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-2">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Confirm Emergency Broadcast</h3>
              <p className="text-xs text-slate-500 mt-1">
                Please review your request before broadcasting to nearby donors and hospitals.
              </p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Blood Group:</span>
                <span className="font-extrabold text-rose-600">{bloodGroup}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Units:</span>
                <span className="font-bold text-slate-800">{unitsRequired} Units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Hospital:</span>
                <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                  {selectedHospitalObj?.hospitalName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Urgency:</span>
                <span className="font-bold text-rose-600">{urgency}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                disabled={submitting}
                className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmSubmit}
                disabled={submitting}
                className="py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200"
              >
                {submitting ? 'Broadcasting...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
