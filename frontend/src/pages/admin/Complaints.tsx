import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquareWarning, Send, Inbox, Shield } from 'lucide-react';
import api from '../../api';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import NoticeForm from '../../components/complaints/NoticeForm';
import ComplaintCard from '../../components/complaints/ComplaintCard';
import type { ComplaintData } from '../../components/complaints/ComplaintCard';
import ComplaintFilters from '../../components/complaints/ComplaintFilters';

const ADMIN_TARGETS = [
  { label: 'To Landlord', value: 'landlord', category: 'landlord-notice', requiresFlatNo: true },
  { label: 'To Tenant', value: 'tenant', category: 'tenant-notice', requiresFlatNo: true },
];

function AdminComplaints() {
  const [activeTab, setActiveTab] = useState<'received' | 'send-complaint' | 'send-notice'>('received');
  const [sentComplaints, setSentComplaints] = useState<ComplaintData[]>([]);
  const [receivedComplaints, setReceivedComplaints] = useState<ComplaintData[]>([]);
  const [sentFilter, setSentFilter] = useState('all');
  const [receivedFilter, setReceivedFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const [sentRes, receivedRes] = await Promise.all([
        api.get('/complaints/sent'),
        api.get('/complaints/received'),
      ]);
      setSentComplaints(sentRes.data.data || []);
      setReceivedComplaints(receivedRes.data.data || []);
    } catch (err) {
      console.error('Error fetching complaints:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchComplaints(); }, [fetchComplaints]);

  const filterComplaints = (list: ComplaintData[], f: string) =>
    f === 'all' ? list : list.filter((c) => c.status === f);

  const filteredSent = filterComplaints(sentComplaints, sentFilter);
  const filteredReceived = filterComplaints(receivedComplaints, receivedFilter);

  const rc = {
    total: receivedComplaints.length,
    open: receivedComplaints.filter((c) => c.status === 'open').length,
    in_progress: receivedComplaints.filter((c) => c.status === 'in_progress').length,
    resolved: receivedComplaints.filter((c) => c.status === 'resolved').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
          <Shield className="w-7 h-7 text-[#3b82f6]" />
          Complaints Center
        </h2>
        <p className="text-sm text-slate-500 mt-1">Review and resolve all society complaints. Send notices to landlords and tenants.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Incoming', val: rc.total, color: 'text-slate-800' },
          { label: 'Open', val: rc.open, color: 'text-amber-600' },
          { label: 'In Progress', val: rc.in_progress, color: 'text-blue-600' },
          { label: 'Resolved', val: rc.resolved, color: 'text-emerald-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-medium text-slate-500">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.val}</p>
          </div>
        ))}
      </div>

      {/* Tab Toggle */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        <button onClick={() => setActiveTab('received')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'received' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Inbox className="w-4 h-4" /> Incoming Complaints
          {rc.open > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{rc.open}</span>}
        </button>
        <button onClick={() => setActiveTab('send-complaint')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'send-complaint' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <MessageSquareWarning className="w-4 h-4" /> Send Complaint
        </button>
        <button onClick={() => setActiveTab('send-notice')} className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${activeTab === 'send-notice' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
          <Send className="w-4 h-4" /> Send Notice
        </button>
      </div>

      {/* Received Tab */}
      {activeTab === 'received' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <MessageSquareWarning className="w-5 h-5 text-slate-400" />
              All Society Complaints
            </h3>
            <ComplaintFilters activeFilter={receivedFilter} onFilterChange={setReceivedFilter} />
          </div>
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading complaints...</div>
          ) : filteredReceived.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Inbox className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No complaints to review. Everything is running smoothly!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReceived.map((c) => (
                <ComplaintCard key={c._id} complaint={c} variant="received" onStatusUpdate={fetchComplaints} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Send Complaint Tab */}
      {activeTab === 'send-complaint' && (
        <div className="space-y-6">
          <ComplaintForm targets={ADMIN_TARGETS} onSuccess={fetchComplaints} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Complaints Sent</h3>
              <ComplaintFilters activeFilter={sentFilter} onFilterChange={setSentFilter} />
            </div>
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Loading...</div>
            ) : filteredSent.filter(c => !c.isNotice).length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <MessageSquareWarning className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No complaints sent yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSent.filter(c => !c.isNotice).map((c) => (
                  <ComplaintCard key={c._id} complaint={c} variant="sent" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Send Notice Tab */}
      {activeTab === 'send-notice' && (
        <div className="space-y-6">
          <NoticeForm onSuccess={fetchComplaints} />
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Notices Sent</h3>
              <ComplaintFilters activeFilter={sentFilter} onFilterChange={setSentFilter} />
            </div>
            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Loading...</div>
            ) : filteredSent.filter(c => c.isNotice).length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
                <Send className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No notices sent yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSent.filter(c => c.isNotice).map((c) => (
                  <ComplaintCard key={c._id} complaint={c} variant="sent" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminComplaints;
