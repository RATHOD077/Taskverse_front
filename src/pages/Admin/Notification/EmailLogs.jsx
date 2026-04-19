import React, { useState, useEffect } from "react";
import { 
  Search, Eye, Mail, Info, ChevronRight, 
  MoreHorizontal, Globe, ArrowLeft, RotateCcw,
  Calendar, ExternalLink, Clock
} from "lucide-react";
import api from "../../../api/api";

const EmailLogs = () => {
  const [view, setView] = useState("list");
  const [selectedLog, setSelectedLog] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch logs from backend
  const fetchLogs = async () => {
    try {
      const response = await api.get('/email-logs');
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch email logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const getStatusStyle = (status) => {
    const base = "px-3 py-1 rounded-full text-[0.7rem] font-bold flex items-center gap-1.5 ";
    switch (status) {
      case "Scheduled": return base + "bg-blue-50 text-blue-500 border border-blue-100";
      case "Failed": return base + "bg-red-50 text-red-500 border border-red-100";
      case "Success": return base + "bg-emerald-50 text-emerald-500 border border-emerald-100";
      default: return base + "bg-slate-50 text-slate-500";
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-50">
        <div className="flex items-center gap-[0.5rem] text-[0.75rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span className="text-[#10b981] cursor-pointer font-bold">Dashboard</span>
          <ChevronRight size={12} />
          <span className={view === 'list' ? "text-slate-900 font-bold" : ""}>Email Dispatch Logs</span>
          {view === 'details' && (
            <>
              <ChevronRight size={12} />
              <span className="text-slate-900 font-bold">Email Details</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-[1rem]">
          <button className="hidden md:flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white">
            <Globe size={14} className="text-blue-500" /> English <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4 h-2.5" />
          </button>
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold">X</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto">
        
        {view === "list" ? (
          <div>
            <h2 className="text-[1.5rem] font-bold text-slate-900 mb-6">Email Dispatch Logs</h2>

            {/* Filters - You can enhance later */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 mb-6">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Filter By Receiver's Email" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#10b981]" />
              </div>
              <button 
                onClick={fetchLogs}
                className="bg-[#10b981] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm shadow-emerald-100"
              >
                <RotateCcw size={16} /> Refresh
              </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-900">Communication Logs</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100 text-[0.75rem] uppercase font-bold text-[#10b981]">
                    <tr>
                      <th className="px-6 py-4">SL No.</th>
                      <th className="px-6 py-4">Sender</th>
                      <th className="px-6 py-4">To</th>
                      <th className="px-6 py-4">Sent Date</th>
                      <th className="px-6 py-4">Scheduled Time</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-center">Options</th>
                    </tr>
                  </thead>
                  <tbody className="text-[0.85rem] divide-y divide-slate-50">
                    {logs.map((log, idx) => (
                      <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-slate-400 font-medium">{idx + 1}</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">
                          {log.sender} <Info size={14} className="inline ml-1 text-slate-300" />
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-500">{log.to}</div>
                          <div className="text-[0.75rem] text-slate-400">{log.subject}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-medium">{log.date}</td>
                        <td className="px-6 py-4">
                          {log.scheduledAt ? (
                            <div className="flex items-center gap-1.5 text-blue-600 font-medium text-[0.8125rem]">
                              <Clock size={13} />
                              {log.scheduledAt}
                            </div>
                          ) : (
                            <span className="text-slate-300 text-[0.8125rem]">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={getStatusStyle(log.status)}>
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              log.status === 'Success' ? 'bg-emerald-500' 
                              : log.status === 'Scheduled' ? 'bg-blue-500' 
                              : 'bg-red-500'
                            }`}></div>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-3">
                            <button 
                              onClick={() => { setSelectedLog(log); setView("details"); }}
                              className="p-2 text-slate-400 hover:text-[#10b981] hover:bg-emerald-50 rounded-full transition-all"
                            >
                              <Eye size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Details View - Same as before but improved */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-[1.5rem] font-bold text-slate-900">Email Details</h2>
              <button 
                onClick={() => setView("list")}
                className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white hover:bg-slate-50"
              >
                <ArrowLeft size={16} /> Back to Logs
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-[#10b981] to-[#059669] p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{selectedLog?.subject}</h3>
                    <p className="text-emerald-50 text-sm">To: {selectedLog?.to}</p>
                  </div>
                  <div className="p-6">
                    <div className="text-slate-600 leading-relaxed">
                      {selectedLog?.content}
                    </div>
                    {selectedLog?.status === "Failed" && selectedLog?.error && (
                      <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
                        Error: {selectedLog.error}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h4 className="font-bold text-slate-900 mb-6 uppercase text-[0.75rem] tracking-wider">Delivery Details</h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status</span>
                      <span className={getStatusStyle(selectedLog?.status)}>{selectedLog?.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Gateway</span>
                      <span className="font-medium">{selectedLog?.gateway}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Type</span>
                      <span className="font-medium">{selectedLog?.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sent At</span>
                      <span className="font-medium">{selectedLog?.timestamp}</span>
                    </div>
                    {selectedLog?.scheduledAt && (
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-slate-400 shrink-0">Scheduled For</span>
                        <span className="font-medium text-blue-600 flex items-center gap-1 text-right">
                          <Clock size={13} />
                          {selectedLog.scheduledAt}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailLogs;

