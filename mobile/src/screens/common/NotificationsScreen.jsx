import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ArrowLeft, AlertCircle, Heart, ShieldCheck } from 'lucide-react';
import { api } from '../../utils/api';

export const NotificationsScreen = ({ onBack, onNavigateRequest }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success) {
        setNotifications(res.data.notifications || []);
      }
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/mark-all-read');
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = async (notif) => {
    if (!notif.isRead) {
      api.patch(`/notifications/${notif._id}/read`).catch(() => {});
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
      );
    }

    if (notif.requestId && onNavigateRequest) {
      const reqId = notif.requestId._id || notif.requestId;
      onNavigateRequest(reqId);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'EMERGENCY_REQUEST':
      case 'ESCALATION_ALERT':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'DONOR_ACCEPTED':
      case 'DONATION_COMPLETED':
        return <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />;
      default:
        return <ShieldCheck className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-4 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">Notifications</h2>
            <p className="text-[11px] text-slate-500">Emergency alerts and status updates.</p>
          </div>
        </div>

        <button
          onClick={handleMarkAllRead}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark Read</span>
        </button>
      </div>

      {loading ? (
        <div className="py-12 text-center text-slate-400 text-xs">Loading alerts...</div>
      ) : notifications.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center my-6">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-xs font-bold text-slate-800">No Notifications</h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            You will receive instant alerts for emergencies matching your profile.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => handleNotificationClick(n)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition active:scale-99 ${
                n.isRead
                  ? 'bg-white border-slate-200 opacity-80'
                  : 'bg-rose-50/40 border-rose-200 ring-1 ring-rose-200/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(n.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{n.title}</h4>
                    {!n.isRead && (
                      <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                  <span className="text-[9px] text-slate-400 mt-1.5 block">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •{' '}
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
