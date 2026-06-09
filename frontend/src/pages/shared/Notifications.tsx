import React, { useState, useEffect, useCallback } from 'react';
import { Bell, ShieldAlert, AlertTriangle, Info } from 'lucide-react';
import api from '../../api';

interface NotificationData {
  _id: string;
  subject: string;
  description: string;
  status: string;
  priority?: 'low' | 'moderate' | 'critical';
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
  flatId?: {
    flatNo: string;
  };
  complainantId: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
}

function Notifications() {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints/notifications');
      setNotifications(res.data.data || []);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Bell className="w-7 h-7 text-[#3b82f6]" />
          Notifications
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Notices and updates from the Society Administrator.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">All Notices</h3>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-slate-500">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="p-16 text-center">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800">You're all caught up!</h3>
            <p className="text-sm text-slate-500 mt-1">No notices from the admin at this time.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {notifications.map((notification) => (
              <div key={notification._id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {notification.priority === 'critical' ? (
                      <ShieldAlert className="w-6 h-6 text-red-500" />
                    ) : notification.priority === 'moderate' ? (
                      <AlertTriangle className="w-6 h-6 text-amber-500" />
                    ) : (
                      <Info className="w-6 h-6 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 truncate">{notification.subject}</h4>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          notification.priority === 'critical' ? 'bg-red-100 text-red-700' :
                          notification.priority === 'moderate' ? 'bg-amber-100 text-amber-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {notification.priority || 'moderate'}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 flex-shrink-0 whitespace-nowrap">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 whitespace-pre-wrap">{notification.description}</p>

                    {notification.flatId && (
                      <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        Regarding Flat: {notification.flatId.flatNo}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;