import React, { useState, useEffect } from "react";
import {
  Search, Eye, Mail, AlertCircle, ChevronRight,
  MoreHorizontal, ArrowLeft, RotateCcw,
  Calendar, Clock, Cake, FileText, Send,
  CheckCircle, XCircle, Filter, Smartphone,
  Globe
} from "lucide-react";
import api from "../../../../api/api";

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const getIconByType = (type = '') => {
  if (type.includes('birthday')) return <Cake size={16} className="text-emerald-500" />;
  if (type.includes('document')) return <FileText size={16} className="text-rose-500" />;
  if (type.includes('task'))     return <Send size={16} className="text-blue-500" />;
  return <Mail size={16} className="text-slate-400" />;
};

const getTypeBadge = (type = '') => {
  const label = type.replace(/_/g, ' ');
  if (type.includes('birthday'))  return <span className="px-2.5 py-1 rounded-md text-[0.6875rem] font-bold border bg-emerald-50 text-emerald-700 border-emerald-100 uppercase">{label}</span>;
  if (type.includes('document'))  return <span className="px-2.5 py-1 rounded-md text-[0.6875rem] font-bold border bg-rose-50 text-rose-700 border-rose-100 uppercase">{label}</span>;
  if (type.includes('task'))      return <span className="px-2.5 py-1 rounded-md text-[0.6875rem] font-bold border bg-blue-50 text-blue-700 border-blue-100 uppercase">{label}</span>;
  return <span className="px-2.5 py-1 rounded-md text-[0.6875rem] font-bold border bg-slate-50 text-slate-700 border-slate-100 uppercase">{label}</span>;
};

const getChannelBadge = (channel = 'email') => {
  if (channel === 'sms')  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.6875rem] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100"><Smartphone size={10} /> SMS</span>;
  if (channel === 'both') return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.6875rem] font-bold bg-purple-50 text-purple-700 border border-purple-100"><Globe size={10} /> Both</span>;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[0.6875rem] font-bold bg-sky-50 text-sky-700 border border-sky-100"><Mail size={10} /> Email</span>;
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ReminderLogs = () => {
  const [view, setView]             = useState("list");
  const [selectedLog, setSelectedLog] = useState(null);
  const [logs, setLogs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [filter, setFilter]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notifications/logs');
      if (res.data.success) setLogs(res.data.logs);
    } catch {
      console.error("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, []);

  const filteredLogs = logs.filter(log => {
    const matchText =
      (log.recipient_email || '').toLowerCase().includes(filter.toLowerCase()) ||
      (log.recipient_name  || '').toLowerCase().includes(filter.toLowerCase()) ||
      (log.type            || '').toLowerCase().includes(filter.toLowerCase());
    const matchStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchText && matchStatus;
  });

  const sentCount   = logs.filter(l => l.status === 'sent').length;
  const failedCount = logs.filter(l => l.status === 'failed').length;

  if (loading && logs.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#FDFDFD]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10b981]" />
          <p className="text-[0.8125rem] font-bold text-slate-400 uppercase tracking-widest">Loading Logs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#FDFDFD] font-sans text-[#1A1C1E]">

      {/* â”€â”€ Sticky Header â”€â”€ */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-10">
        <div className="hidden sm:flex items-center gap-[0.5rem] text-[0.7rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span>Notifications</span>
          <ChevronRight size={12} />
          <span
            onClick={() => setView("list")}
            className={`${view === 'list' ? 'text-slate-900 font-bold' : 'hover:text-slate-600 cursor-pointer'}`}
          >
            Reminder History
          </span>
          {view === 'details' && (
            <>
              <ChevronRight size={12} />
              <span className="text-slate-900 font-bold">Log Detail</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <button
            onClick={fetchLogs}
            className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all text-[0.75rem] font-bold text-slate-500"
          >
            <RotateCcw size={14} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.75rem]">A</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto">

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• LIST VIEW â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {view === "list" && (
          <>
            {/* Page Title */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[1rem] mb-[2rem]">
              <div>
                <div className="flex items-center gap-[0.5rem] mb-[0.5rem] text-slate-400">
                  <RotateCcw size={16} />
                  <span className="text-[0.8125rem] font-semibold uppercase tracking-wider">Audit Trail</span>
                </div>
                <h1 className="text-[1.5rem] md:text-[1.875rem] font-bold text-[#1A1C1E]">
                  Reminder History
                </h1>
                <p className="text-[0.875rem] text-slate-400 font-medium mt-1">
                  Audit trail of all automated and manual communications sent from TaskVerse.
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-[1rem] mb-[1.5rem]">
              {[
                { label: 'Total Sent',  value: logs.length,   sub: 'all time',      iconBg: 'bg-slate-50',    icon: <Mail size={22} className="text-slate-600" /> },
                { label: 'Successful',  value: sentCount,     sub: 'delivered',     iconBg: 'bg-emerald-50',  icon: <CheckCircle size={22} className="text-emerald-600" /> },
                { label: 'Failed',      value: failedCount,   sub: 'need attention',iconBg: 'bg-rose-50',     icon: <XCircle size={22} className="text-rose-500" /> },
              ].map((c, i) => (
                <div key={i} className="bg-white p-[1.25rem] rounded-[1.25rem] border border-slate-100 shadow-sm flex justify-between items-start hover:shadow-md transition-all">
                  <div>
                    <p className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.375rem]">{c.label}</p>
                    <p className="text-[1.75rem] font-black text-slate-900">{c.value}</p>
                    <p className="text-[0.6875rem] text-slate-400 font-medium mt-1">{c.sub}</p>
                  </div>
                  <div className={`w-[3rem] h-[3rem] shrink-0 rounded-[0.875rem] ${c.iconBg} flex items-center justify-center`}>
                    {c.icon}
                  </div>
                </div>
              ))}
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-3 mb-[1.5rem]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name, email or type..."
                  value={filter}
                  onChange={e => setFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] transition-all"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                {['all', 'sent', 'failed'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-4 py-2 rounded-lg text-[0.75rem] font-bold border transition-all uppercase
                      ${statusFilter === s
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-bold text-slate-900">Activity Log</h2>
                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[0.75rem] font-black">
                  {filteredLogs.length} records
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/80 border-b border-slate-100 text-[0.6875rem] uppercase tracking-wider font-extrabold text-slate-400">
                    <tr>
                      <th className="px-6 py-4 text-center w-12">#</th>
                      <th className="px-6 py-4">Event Type</th>
                      <th className="px-6 py-4">Recipient</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Channel</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date & Time</th>
                      <th className="px-6 py-4 text-center">View</th>
                    </tr>
                  </thead>
                  <tbody className="text-[0.8125rem] divide-y divide-slate-50">
                    {filteredLogs.map((log, idx) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4 text-center font-bold text-slate-300">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-white transition-colors border border-slate-100">
                              {getIconByType(log.type)}
                            </div>
                            {getTypeBadge(log.type)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{log.recipient_name || '-'}</div>
                          <div className="text-[0.75rem] text-slate-400 font-medium font-mono">{log.recipient_email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium max-w-[200px] truncate italic">
                          {log.subject || '-'}
                        </td>
                        <td className="px-6 py-4">
                          {getChannelBadge(log.channel)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[0.6875rem] font-bold border uppercase
                            ${log.status === 'sent'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                            {log.status === 'sent' ? <CheckCircle size={10} /> : <XCircle size={10} />}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-medium whitespace-nowrap text-[0.75rem]">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={12} />
                            {new Date(log.sent_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock size={12} />
                            {new Date(log.sent_at).toLocaleTimeString('en-IN', { timeStyle: 'short' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => { setSelectedLog(log); setView("details"); }}
                            className="p-2 text-slate-300 hover:text-[#10b981] hover:bg-emerald-50 rounded-lg transition-all border border-transparent hover:border-emerald-100"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredLogs.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-20 text-center">
                          <div className="flex flex-col items-center gap-3 text-slate-300">
                            <AlertCircle size={40} strokeWidth={1.5} />
                            <p className="text-[0.8125rem] font-bold text-slate-400 uppercase tracking-widest">
                              No records found
                            </p>
                            <p className="text-[0.75rem] text-slate-300">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• DETAIL VIEW â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {view === "details" && selectedLog && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-[2rem]">
              <div>
                <div className="flex items-center gap-[0.5rem] mb-[0.5rem] text-slate-400">
                  <Eye size={16} />
                  <span className="text-[0.8125rem] font-semibold uppercase tracking-wider">Log Details</span>
                </div>
                <h1 className="text-[1.5rem] font-bold text-[#1A1C1E]">Delivery Report</h1>
              </div>
              <button
                onClick={() => setView("list")}
                className="flex items-center gap-2 px-[1rem] py-[0.625rem] border border-slate-200 rounded-[0.75rem] bg-white text-[0.875rem] font-bold hover:bg-slate-50 transition-all shadow-sm active:scale-95"
              >
                <ArrowLeft size={16} /> Back to Logs
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-[1.5rem]">

              {/* LEFT: Message Card */}
              <div className="lg:col-span-2 space-y-[1.25rem]">

                {/* Subject Header */}
                <div className="bg-slate-900 rounded-[1.25rem] p-6 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <Mail size={14} className="text-[#10b981]" />
                    <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-slate-500">Transmitted Message</span>
                  </div>
                  <h2 className="text-[1.25rem] font-bold leading-snug mb-2 italic">"{selectedLog.subject}"</h2>
                  <p className="text-slate-400 text-[0.8125rem] font-medium">
                    Delivered to: <span className="text-white font-bold font-mono">{selectedLog.recipient_email}</span>
                  </p>
                </div>

                {/* Body Placeholder */}
                <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50">
                    <AlertCircle size={14} className="text-slate-400" />
                    <span className="text-[0.75rem] font-black text-slate-400 uppercase tracking-widest">Message Payload</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-5 text-[0.8125rem] text-slate-500 font-medium leading-relaxed italic border border-slate-100">
                    Full message body is resolved dynamically from your database at delivery time and is not stored in short-logs for data privacy compliance.
                  </div>

                  {selectedLog.status === "failed" && (
                    <div className="mt-5 p-5 bg-rose-50 border border-rose-100 rounded-xl flex gap-3">
                      <AlertCircle size={20} className="text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-rose-800 text-[0.8125rem] mb-1">Dispatch Failure Reason</h4>
                        <p className="text-rose-600 text-[0.8125rem] font-medium">
                          {selectedLog.error_message || 'Unknown server-side error during dispatch.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Metadata Sidebar */}
              <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-6 self-start sticky top-24">
                <h3 className="font-bold text-slate-900 mb-5 pb-3 border-b border-slate-50">Audit Metadata</h3>

                <div className="space-y-5 text-[0.8125rem]">

                  <div>
                    <p className="text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</p>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[0.75rem] font-bold border
                      ${selectedLog.status === 'sent'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                        : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                      {selectedLog.status === 'sent' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                      {selectedLog.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Recipient</p>
                    <p className="font-bold text-slate-900">{selectedLog.recipient_name || '-'}</p>
                    <p className="text-slate-400 font-mono text-[0.75rem]">{selectedLog.recipient_email}</p>
                  </div>

                  <div>
                    <p className="text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Event Type</p>
                    {getTypeBadge(selectedLog.type)}
                  </div>

                  <div>
                    <p className="text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Channel</p>
                    {getChannelBadge(selectedLog.channel)}
                  </div>

                  <div>
                    <p className="text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Sent At</p>
                    <div className="flex items-center gap-2 text-slate-700 font-medium">
                      <Calendar size={13} className="text-slate-400" />
                      {new Date(selectedLog.sent_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-medium mt-1">
                      <Clock size={13} className="text-slate-400" />
                      {new Date(selectedLog.sent_at).toLocaleTimeString('en-IN', { timeStyle: 'medium' })}
                    </div>
                  </div>

                  <div>
                    <p className="text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest mb-1.5">Engine</p>
                    <p className="font-bold text-slate-600 text-[0.75rem]">ReminderService v2.0</p>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReminderLogs;
