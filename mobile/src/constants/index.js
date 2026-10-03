export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const MEDICAL_SAFETY_DISCLAIMER =
  'Blood compatibility and transfusion decisions must be confirmed by an authorized medical professional or blood bank.';

export const BLOOD_GROUPS = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

export const COMPONENT_TYPES = [
  { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
  { value: 'PACKED_RED_BLOOD_CELLS', label: 'Packed Red Blood Cells (PRBC)' },
  { value: 'PLATELETS', label: 'Platelets' },
  { value: 'FRESH_FROZEN_PLASMA', label: 'Fresh Frozen Plasma (FFP)' },
];

export const URGENCIES = [
  { value: 'CRITICAL', label: '🚨 Critical (Needed within 1 hour)', color: 'bg-rose-600 text-white' },
  { value: 'IMMEDIATE', label: '⚠️ Immediate (Needed in 2–4 hours)', color: 'bg-amber-600 text-white' },
  { value: 'HIGH', label: '⚡ High (Needed today)', color: 'bg-orange-500 text-white' },
  { value: 'MEDIUM', label: '🕒 Medium (Within 24–48 hours)', color: 'bg-blue-600 text-white' },
];

export const AVAILABILITY_STATUSES = [
  { value: 'AVAILABLE', label: 'Available Now', color: 'bg-emerald-500 text-white' },
  { value: 'AVAILABLE_LATER', label: 'Available Later Today', color: 'bg-amber-500 text-white' },
  { value: 'UNAVAILABLE', label: 'Unavailable', color: 'bg-slate-400 text-white' },
];
