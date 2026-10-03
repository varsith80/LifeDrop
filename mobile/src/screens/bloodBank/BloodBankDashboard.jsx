import React, { useState, useEffect } from 'react';
import {
  Building2,
  Package,
  Plus,
  Minus,
  RefreshCw,
  ShieldCheck,
  Calendar,
  Clock,
  Droplet,
} from 'lucide-react';
import { api } from '../../utils/api';
import { BLOOD_GROUPS, COMPONENT_TYPES } from '../../constants';
import { MedicalDisclaimer } from '../../components/MedicalDisclaimer';

export const BloodBankDashboard = () => {
  const [bloodBank, setBloodBank] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterGroup, setFilterGroup] = useState('ALL');

  // Form state
  const [newGroup, setNewGroup] = useState('O+');
  const [newComp, setNewComp] = useState('WHOLE_BLOOD');
  const [newUnits, setNewUnits] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const fetchBloodBankData = async () => {
    try {
      const res = await api.get('/blood-banks/my/profile');
      if (res.success) {
        setBloodBank(res.data.bloodBank);
        setInventory(res.data.inventory);
      }
    } catch (err) {
      console.error('Error fetching blood bank data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodBankData();
  }, []);

  const handleAdjustUnits = async (item, delta) => {
    const newAvail = Math.max(0, item.availableUnits + delta);
    try {
      const res = await api.put(`/blood-banks/${bloodBank._id}/inventory/${item._id}`, {
        availableUnits: newAvail,
      });
      if (res.success) {
        setInventory((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, availableUnits: newAvail } : i))
        );
      }
    } catch (err) {
      alert(`Adjustment error: ${err.message}`);
    }
  };

  const handleAddBatch = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post(`/blood-banks/${bloodBank._id}/inventory`, {
        bloodGroup: newGroup,
        componentType: newComp,
        availableUnits: parseInt(newUnits, 10),
      });
      if (res.success) {
        setShowAddModal(false);
        fetchBloodBankData();
      }
    } catch (err) {
      alert(`Could not add inventory: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered =
    filterGroup === 'ALL' ? inventory : inventory.filter((i) => i.bloodGroup === filterGroup);

  const totalUnits = inventory.reduce((sum, i) => sum + (i.availableUnits || 0), 0);
  const totalReserved = inventory.reduce((sum, i) => sum + (i.reservedUnits || 0), 0);

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <MedicalDisclaimer compact />

      {/* Header */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-slate-900 leading-tight">
              {bloodBank?.name || 'Regional Blood Center'}
            </h2>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              License: {bloodBank?.registrationNumber || 'BB-LIC-001'}
            </span>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" />
          <span>Verified</span>
        </span>
      </div>

      {/* Stock Summary Metrics */}
      <div className="grid grid-cols-2 gap-3 text-white">
        <div className="bg-slate-900 p-4 rounded-3xl">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Available In Stock</span>
          <span className="text-3xl font-black text-white mt-1 block">{totalUnits}</span>
          <span className="text-[10px] text-emerald-400 mt-0.5 block">Ready for emergency draw</span>
        </div>

        <div className="bg-gradient-to-br from-rose-700 to-rose-900 p-4 rounded-3xl">
          <span className="text-[10px] uppercase font-bold text-rose-200 block">Reserved Units</span>
          <span className="text-3xl font-black text-amber-300 mt-1 block">{totalReserved}</span>
          <span className="text-[10px] text-rose-200 mt-0.5 block">Allocated to emergencies</span>
        </div>
      </div>

      {/* Innovation 3: Real-Time Blood Inventory with Filter */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Package className="w-4 h-4 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Live Stock Inventory ({filtered.length})
            </h3>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Stock</span>
          </button>
        </div>

        {/* Blood group pill filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setFilterGroup('ALL')}
            className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition ${
              filterGroup === 'ALL'
                ? 'bg-slate-900 text-white'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All
          </button>
          {BLOOD_GROUPS.map((g) => (
            <button
              key={g}
              onClick={() => setFilterGroup(g)}
              className={`px-2.5 py-1 rounded-full font-bold text-[11px] transition ${
                filterGroup === g
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Inventory Items List */}
        <div className="space-y-2">
          {filtered.map((item) => {
            const statusColor =
              item.verificationStatus === 'Recently Updated'
                ? 'bg-emerald-100 text-emerald-800'
                : item.verificationStatus === 'Available'
                ? 'bg-blue-100 text-blue-800'
                : item.verificationStatus === 'Needs Verification'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-rose-100 text-rose-800';

            return (
              <div
                key={item._id}
                className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex flex-col items-center justify-center font-black">
                    <span className="text-xs leading-none">{item.bloodGroup}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.componentType.replace(/_/g, ' ')}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full uppercase ${statusColor}`}
                      >
                        {item.verificationStatus}
                      </span>
                    </div>

                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Expiry: {new Date(item.expiryDate).toLocaleDateString()} • Reserved: {item.reservedUnits}
                    </span>
                  </div>
                </div>

                {/* Stock Quick Controls */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleAdjustUnits(item, -1)}
                    disabled={item.availableUnits <= 0}
                    className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 flex items-center justify-center text-slate-700"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-xs font-extrabold text-slate-900 w-8 text-center">
                    {item.availableUnits}
                  </span>

                  <button
                    onClick={() => handleAdjustUnits(item, 1)}
                    className="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Add Blood Stock Batch</h3>

            <form onSubmit={handleAddBatch} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                >
                  {BLOOD_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Component Type</label>
                <select
                  value={newComp}
                  onChange={(e) => setNewComp(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {COMPONENT_TYPES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Units to Add</label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newUnits}
                  onChange={(e) => setNewUnits(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  disabled={submitting}
                  className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  {submitting ? 'Adding...' : 'Save Stock'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
