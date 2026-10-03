import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { MEDICAL_SAFETY_DISCLAIMER } from '../constants';

export const MedicalDisclaimer = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="bg-amber-50 border-y border-amber-200/80 px-3 py-1.5 flex items-center gap-2 text-[10px] text-amber-900 leading-tight">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="font-medium">Medical Notice:</span> {MEDICAL_SAFETY_DISCLAIMER}
      </div>
    );
  }

  return (
    <div className="mx-4 my-2 p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 shadow-sm">
      <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
      <div>
        <span className="font-semibold text-amber-950 block mb-0.5">Important Medical Safety Rule</span>
        <p className="text-[11px] leading-relaxed text-amber-900/90">{MEDICAL_SAFETY_DISCLAIMER}</p>
      </div>
    </div>
  );
};
