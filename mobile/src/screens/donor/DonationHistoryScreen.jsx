import React, { useState, useEffect } from 'react';
import { Award, Heart, Calendar, Building2, ShieldCheck, ArrowLeft, Droplet } from 'lucide-react';
import { api } from '../../utils/api';

export const DonationHistoryScreen = ({ onBack }) => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const res = await api.get('/donors/donations');
        if (res.success) {
          setDonations(res.data);
        }
      } catch (err) {
        console.error('Error fetching donations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDonations();
  }, []);

  const totalUnits = donations.reduce((sum, d) => sum + (d.units || 1), 0);
  const livesSaved = totalUnits * 3; // Medical standard: each unit can save up to 3 lives

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
          <h2 className="text-lg font-bold text-slate-900 leading-tight">Donation Journey</h2>
          <p className="text-[11px] text-slate-500">Your verified blood donations and life impact.</p>
        </div>
      </div>

      {/* Impact Stats Banner */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white rounded-3xl p-5 shadow-sm shadow-rose-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-300" />
            <span className="text-xs font-bold uppercase tracking-wider text-rose-100">
              Verified Donor Hero
            </span>
          </div>
          <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full">
            HemoLink Verified
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center divide-x divide-white/20">
          <div>
            <span className="text-3xl font-black">{totalUnits}</span>
            <span className="text-[11px] block text-rose-100 font-medium mt-0.5">Units Donated</span>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-300">~{livesSaved}</span>
            <span className="text-[11px] block text-rose-100 font-medium mt-0.5">Lives Impacted</span>
          </div>
        </div>
      </div>

      {/* Donations List */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Donation Records ({donations.length})
        </h3>

        {loading ? (
          <div className="py-8 text-center text-slate-400 text-xs">Loading donation history...</div>
        ) : donations.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center">
            <Heart className="w-10 h-10 text-rose-300 mx-auto mb-2" />
            <h4 className="text-xs font-bold text-slate-800">No Past Donations Recorded</h4>
            <p className="text-[11px] text-slate-500 mt-1">
              Your future completed emergency donations verified by hospitals will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {donations.map((d) => (
              <div
                key={d._id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs">
                    <Droplet className="w-5 h-5 fill-rose-600" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {d.hospitalId?.hospitalName || d.bloodBankId?.name || 'Medical Center'}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {new Date(d.donationDate).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-rose-600">{d.units} Unit ({d.componentType})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[9px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
