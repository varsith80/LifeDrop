import React from 'react';
import { HeartHandshake, ShieldAlert, Heart, ExternalLink } from 'lucide-react';
import { MEDICAL_SAFETY_DISCLAIMER } from '../../constants';

export const Footer = ({ onOpenLogin }) => {
  return (
    <footer id="safeguards" className="bg-[#03140b] text-emerald-100/80 border-t border-emerald-950 text-xs">
      
      {/* Mandatory Clinical Safeguard Notice */}
      <div className="bg-[#062416] border-b border-emerald-900/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-[11px] sm:text-xs text-emerald-200/90 font-medium">
            <span className="font-bold text-amber-400 uppercase tracking-wide mr-1.5">
              Clinical Transfusion Safeguard:
            </span>
            {MEDICAL_SAFETY_DISCLAIMER}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">LifeDrop</span>
            </div>
            <p className="text-emerald-200/70 text-xs leading-relaxed max-w-sm">
              Connecting donors, patients, and certified healthcare providers for life-critical blood coordination. Direct, verified, and strictly compliant with medical transfusion science.
            </p>
            <div className="text-[11px] text-emerald-400 font-mono">
              LifeDrop Core v1.0 • Clinical Engine Active
            </div>
          </div>

          {/* Stakeholder Cockpits */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Stakeholder Portals
            </h4>
            <ul className="space-y-2 text-emerald-200/70">
              <li>
                <button onClick={() => onOpenLogin('DONOR')} className="hover:text-emerald-300 transition">
                  Donor Cockpit (O+, O-, A, B)
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin('PATIENT')} className="hover:text-emerald-300 transition">
                  Patient & Attendant Gateway
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin('HOSPITAL')} className="hover:text-emerald-300 transition">
                  Hospital Emergency Hub
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin('BLOOD_BANK')} className="hover:text-emerald-300 transition">
                  Blood Bank Live Inventory
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin('ADMIN')} className="hover:text-amber-400 font-semibold transition">
                  Admin Governance Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Protocols */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Clinical Protocols
            </h4>
            <ul className="space-y-2 text-emerald-200/70">
              <li><a href="#benchmarks" className="hover:text-emerald-300 transition">ABO/Rh Safe Matrix</a></li>
              <li><a href="#benchmarks" className="hover:text-emerald-300 transition">Emergency Escalation Radar</a></li>
              <li><a href="#infrastructure" className="hover:text-emerald-300 transition">Cold-Chain Temperature Specs</a></li>
              <li><span className="text-emerald-400">90-Day Donating Cooldown</span></li>
              <li><span className="text-emerald-400">Anonymized Donor Relay</span></li>
            </ul>
          </div>

          {/* Verification & Access */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              Quick Portals
            </h4>
            <ul className="space-y-2 text-emerald-200/70">
              <li>
                <button onClick={() => onOpenLogin('USER')} className="hover:text-white transition flex items-center gap-1">
                  <span>User Login (Port 5173)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLogin('ADMIN')} className="hover:text-white transition flex items-center gap-1">
                  <span>Admin Portal (Port 5174)</span>
                </button>
              </li>
              <li>
                <a href="http://localhost:5000/api/health" target="_blank" rel="noreferrer" className="hover:text-white transition flex items-center gap-1">
                  <span>REST API Health</span>
                  <ExternalLink className="w-3 h-3 text-emerald-500" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-emerald-400/60">
          <p>© 2026 LifeDrop Foundation. Every drop counts. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-emerald-300 cursor-pointer">Privacy Charter</span>
            <span>•</span>
            <span className="hover:text-emerald-300 cursor-pointer">Medical Ethics</span>
            <span>•</span>
            <span className="hover:text-emerald-300 cursor-pointer">Security Safeguards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
