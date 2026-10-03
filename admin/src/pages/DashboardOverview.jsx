import React, { useState, useEffect } from 'react';
import {
  Users,
  Activity,
  Building2,
  Package,
  AlertTriangle,
  Award,
  Clock,
  TrendingUp,
  Droplet,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { adminApi } from '../services/api';

export const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminApi.get('/admin/dashboard');
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      console.error('Error fetching admin dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-rose-500" />
        <span className="text-sm">Loading platform analytics...</span>
      </div>
    );
  }

  const m = stats?.metrics || {};
  const c = stats?.charts || {};

  const metricCards = [
    { label: 'Total Donors', value: m.totalDonors, sub: `${m.activeDonors} active & ready`, icon: Users, color: 'text-rose-500 bg-rose-500/10' },
    { label: 'Active Emergencies', value: m.activeEmergencies, sub: `${m.emergencyRequests} total requests`, icon: AlertTriangle, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Registered Hospitals', value: m.hospitals, sub: 'Trauma & ICU centers', icon: Building2, color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Licensed Blood Banks', value: m.bloodBanks, sub: 'Live inventory enabled', icon: Package, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Transfusions Completed', value: m.successfulDonations, sub: 'Verified donations', icon: Award, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Fulfillment Rate', value: `${m.fulfillmentRate}%`, sub: 'Request completion rate', icon: TrendingUp, color: 'text-cyan-500 bg-cyan-500/10' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight">System Analytics & Coordination</h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time status of emergency requests, proximity matching, and blood bank stock levels.
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Metrics</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{card.label}</span>
                <div className={`p-2 rounded-xl ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <span className="text-2xl font-black text-white block leading-tight">{card.value}</span>
              <span className="text-[11px] text-slate-500 block mt-1">{card.sub}</span>
            </div>
          );
        })}
      </div>

      {/* Analytics Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Blood Group Emergency Demand Breakdown */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Droplet className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Emergency Requests by Blood Group</span>
            </h3>
            <span className="text-xs text-slate-400">Total: {m.emergencyRequests}</span>
          </div>

          <div className="space-y-3 pt-2">
            {c.requestsByBloodGroup?.map((item) => {
              const percentage = m.emergencyRequests > 0 ? Math.round((item.count / m.emergencyRequests) * 100) : 0;
              return (
                <div key={item._id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-white">{item._id}</span>
                    <span className="text-slate-400">{item.count} Requests ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Real-time Blood Bank Stock Distribution */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-emerald-500" />
              <span>Blood Inventory Across Registered Centers</span>
            </h3>
            <span className="text-xs text-emerald-400 font-semibold">Live Stock</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            {c.bloodAvailability?.map((item) => (
              <div key={item._id} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-center">
                <span className="text-xs font-black text-rose-400 block">{item._id}</span>
                <span className="text-xl font-bold text-white block mt-1">{item.availableUnits}</span>
                <span className="text-[10px] text-slate-500 block">Available Units</span>
                {item.reservedUnits > 0 && (
                  <span className="text-[10px] text-amber-400 font-semibold block mt-0.5">
                    ({item.reservedUnits} Reserved)
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
