import React, { useState, useEffect } from "react";
import { 
  Search, Eye, Info, RotateCcw, 
  Calendar, ChevronRight, FileText,
  Phone, Clock, ArrowLeft
} from "lucide-react";
import api from "../../../api/api";

const SmsLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/sms-logs');
      if (response.data.success) {
        setLogs(response.data.logs);
      }
    } catch (error) {
      console.error("Failed to fetch SMS logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (selectedLog) {
    return (
      <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans p-4 md:p-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <button 
              onClick={() => setSelectedLog(null)}
              className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all text-slate-600"
            >
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-2xl font-bold text-slate-900">Sms Details</h1>
          </div>
          <div className="flex items-center gap-2 text-xs font-medium ml-11">
            <span className="text-[#10b981] cursor-pointer font-bold" onClick={() => setSelectedLog(null)}>Sms Dispatch Logs</span>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-slate-400">Details</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 max-w-3xl">
          <h3 className="font-bold text-slate-900 text-lg mb-6 border-b border-slate-100 pb-4">Message Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider block mb-1">Sender</label>
                <div className="font-medium text-slate-700">{selectedLog.sender}</div>
              </div>
              
              <div>
                <label className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider block mb-1">To</label>
                <div className="font-bold text-[#10b981] flex items-center gap-2">
                  <Phone size={14} /> {selectedLog.to}
                </div>
              </div>
              
              <div>
                <label className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider block mb-1">Status</label>
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.75rem] font-bold ${
                  selectedLog.status === 'Success' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' :
                  selectedLog.status === 'Scheduled' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                  'bg-red-50 text-red-500 border border-red-100'
                }`}>
                  {selectedLog.status}
                </span>
              </div>
            </div>

            <div className="space-y-4">
               <div>
                <label className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider block mb-1">Date & Time</label>
                <div className="font-medium text-slate-700">{selectedLog.timestamp}</div>
              </div>

              {selectedLog.scheduledAt && (
                <div>
                  <label className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider block mb-1">Scheduled For</label>
                  <div className="font-medium text-blue-600 flex items-center gap-1">
                    <Clock size={14} /> {selectedLog.scheduledAt}
                  </div>
                </div>
              )}

              <div>
                <label className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider block mb-1">Gateway / Route</label>
                <div className="font-medium text-slate-700">{selectedLog.gateway}</div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-100 pt-6">
            <label className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5"><FileText size={14} /> Message Content</label>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg text-slate-700 whitespace-pre-wrap text-sm leading-relaxed">
              {selectedLog.body}
            </div>
          </div>
          
          {selectedLog.error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-lg text-red-600 text-sm">
              <span className="font-bold block mb-1">Error Details:</span>
              {selectedLog.error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans p-4 md:p-8">
      
      {/* --- HEADER & BREADCRUMBS --- */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sms Dispatch Logs</h1>
        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="text-[#10b981] cursor-pointer font-bold">Dashboard</span>
          <ChevronRight size={12} className="text-slate-400" />
          <span className="text-slate-400">Sms Dispatch Logs</span>
        </div>
      </div>

      {/* --- FILTER SECTION --- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap gap-4 mb-6">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Filter By Receiver's Number" 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#10b981] transition-all" 
          />
        </div>
        
        <select className="px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none min-w-[200px] cursor-pointer focus:border-[#10b981]">
          <option>Select A Delivery Status</option>
          <option>Success</option>
          <option>Failed</option>
          <option>Pending</option>
        </select>

        <div className="relative flex-1 min-w-[200px]">
          <input 
            type="text" 
            placeholder="Filter By Date" 
            className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#10b981]" 
          />
          <div className="absolute right-0 top-0 h-full w-10 bg-emerald-50 border-l border-slate-200 rounded-r-lg flex items-center justify-center text-[#10b981]">
            <Calendar size={16} />
          </div>
        </div>

        <button className="bg-white border border-slate-200 px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-slate-50 transition-all">
          <Search size={16} /> Search
        </button>
        
        <button onClick={fetchLogs} className="bg-[#10b981] text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-[#0da975] transition-all">
          <RotateCcw size={16} /> Refresh
        </button>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-lg">Communication Logs</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 text-[0.75rem] uppercase font-bold text-[#10b981] tracking-wider">
              <tr>
                <th className="px-6 py-4">SL No.</th>
                <th className="px-6 py-4">Sender</th>
                <th className="px-6 py-4">To</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Options</th>
              </tr>
            </thead>
            
            <tbody className="text-[0.85rem] divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="6" className="px-6 py-6 text-center text-slate-400">Loading SMS logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan="6" className="px-6 py-6 text-center text-slate-400">No SMS logs found.</td></tr>
              ) : logs.map((log, index) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-slate-400 font-medium">{index + 1}</td>
                  
                  <td className="px-6 py-4 font-bold text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {log.sender} 
                      <Info size={14} className="text-slate-300 group-hover:text-slate-400 cursor-help" title={log.gateway} />
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-bold text-slate-600">
                        <span className="bg-slate-100 p-1 rounded text-slate-400"><Phone size={12} /></span>
                        {log.to}
                      </div>
                      <div className="text-[0.75rem] text-slate-400 line-clamp-1 max-w-[200px]" title={log.body}>{log.body}</div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="space-y-1 text-[0.8rem]">
                      <div className="flex gap-2">
                        <span className="text-slate-400 font-medium min-w-[70px]">Date:</span>
                        <span className="text-slate-600 font-bold">{log.timestamp}</span>
                      </div>
                      {log.scheduledAt && (
                        <div className="flex gap-2 text-blue-600 font-medium">
                          <span className="min-w-[70px] flex items-center gap-1"><Clock size={12}/> For:</span>
                          <span>{log.scheduledAt}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[0.7rem] font-bold ${
                        log.status === 'Success' ? 'bg-emerald-50 text-emerald-500 border border-emerald-100' :
                        log.status === 'Scheduled' ? 'bg-blue-50 text-blue-500 border border-blue-100' :
                        'bg-red-50 text-red-500 border border-red-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'Success' ? 'bg-emerald-500' :
                          log.status === 'Scheduled' ? 'bg-blue-500 animate-pulse' :
                          'bg-red-500'
                        }`}></div>
                        {log.status}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => setSelectedLog(log)}
                      className="p-2 text-slate-400 hover:text-[#10b981] hover:bg-emerald-50 rounded-full transition-all"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SmsLogs;

