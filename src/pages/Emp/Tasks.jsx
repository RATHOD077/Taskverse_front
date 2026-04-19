import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Eye, Globe,
  ChevronRight, Filter, MoreHorizontal,
  ArrowLeft, CheckCircle, Clock, CheckSquare, FileText
} from "lucide-react";
import api from "../../api/api";

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-[0.25rem]">
    <span className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-[1rem] font-medium text-slate-900">{value || ""}</span>
  </div>
);

const Tasks = () => {
  const [view, setView] = useState("list");
  const [selectedTask, setSelectedTask] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Status Update State
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({ id: null, status: "" });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks/emp');
      if (res.data.success) {
        setData(res.data.tasks);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async () => {
    try {
      const res = await api.put(`/tasks/${statusForm.id}/status`, { status: statusForm.status });
      if (res.data.success) {
        setIsStatusModalOpen(false);
        fetchData();
        if (selectedTask && selectedTask.id === statusForm.id) {
           setSelectedTask(prev => ({ ...prev, status: statusForm.status }));
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update status.");
    }
  };

  const openStatusModal = (task) => {
    setStatusForm({ id: task.id, status: task.status });
    setIsStatusModalOpen(true);
  };

  const openDetails = (task) => {
    setSelectedTask(task);
    setView("details");
  };

  // --- STYLING HELPERS ---
  const getStatusStyle = (status) => {
    const base = "px-[0.75rem] py-[0.25rem] rounded-md text-[0.75rem] font-medium border ";
    switch (status) {
      case "On Hold": return base + "bg-red-50 text-red-600 border-red-100";
      case "In Progress": return base + "bg-blue-50 text-blue-600 border-blue-100";
      case "Completed": return base + "bg-green-50 text-green-600 border-green-100";
      default: return base + "bg-slate-50 text-slate-500 border-slate-200";
    }
  };

  const getPriorityStyle = (priority) => {
    const base = "px-[0.75rem] py-[0.125rem] rounded-md text-[0.6875rem] font-bold border ";
    switch (priority) {
      case "Critical": return base + "bg-red-50 text-red-600 border-red-100";
      case "Medium": return base + "bg-amber-50 text-amber-600 border-amber-100";
      case "Low": return base + "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return base + "bg-orange-50 text-orange-600 border-orange-100";
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans text-[1rem]">
      
      {/* --- HEADER --- */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-50">
        <div className="flex items-center gap-[0.5rem] text-[0.75rem] text-slate-400 font-medium whitespace-nowrap overflow-x-auto">
           <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
           <ChevronRight size={12} className="shrink-0" />
           <span>Dashboard</span>
           <ChevronRight size={12} className="shrink-0" />
           <span className="hidden sm:inline">My Workflow</span>
           <ChevronRight size={12} className="hidden sm:inline shrink-0" />
           <span className={view === 'list' ? "text-slate-900 font-bold" : ""}>Assigned Tasks</span>
           {view === 'details' && (
             <>
               <ChevronRight size={12} className="shrink-0" />
               <span className="text-slate-900 font-bold truncate max-w-[10rem]">{selectedTask?.title}</span>
             </>
           )}
        </div>
        <div className="flex items-center gap-[1rem] shrink-0">
           <div className="flex items-center gap-2 text-xs font-semibold">
             <span className="text-slate-500 hidden sm:inline">Task Management</span>
             <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 text-emerald-700 uppercase font-bold">
               {selectedTask?.assigned_to_name?.[0] || "T"}
             </div>
           </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="p-4 md:p-8 max-w-[100rem] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Assigned Tasks</h2>
            <p className="text-sm text-slate-400 font-medium">Manage and track your daily workloads</p>
          </div>
        </div>

        {view === 'list' ? (
          <>
            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2 flex-1 min-w-[18.75rem]">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search your tasks..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-inner"
                  />
                </div>
                <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 bg-white text-slate-600 hover:bg-slate-50">
                  <Filter size={16} /> Filters
                </button>
              </div>
            </div>

            {/* Task Grid/Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-[0.6875rem] uppercase tracking-wider font-bold text-slate-400">
                    <tr>
                      <th className="px-6 py-4 text-center w-12">#</th>
                      <th className="px-4 py-4">Task Details</th>
                      <th className="px-4 py-4">Client / Case</th>
                      <th className="px-4 py-4">Priority</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-4 py-4">Due Date</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[0.84375rem] divide-y divide-slate-100">
                    {loading ? (
                       <tr>
                         <td colSpan="7" className="px-6 py-12 text-center text-slate-400">
                           <div className="flex flex-col items-center gap-2">
                             <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                             <p className="font-medium">Loading your tasks...</p>
                           </div>
                         </td>
                       </tr>
                    ) : (
                      data.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                          <td className="px-6 py-4 text-center font-bold text-slate-400 group-hover:text-emerald-500 transition-colors">{idx + 1}</td>
                          <td className="px-4 py-4">
                            <p className="font-bold text-slate-800">{item.title}</p>
                            <p className="text-[0.7rem] text-slate-400 font-medium bg-slate-100 inline-block px-1.5 rounded mt-1 capitalize">{item.task_type}</p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="font-semibold text-slate-600">{item.client_name || ""}</p>
                            {item.case_code && <p className="text-[0.65rem] text-blue-500 font-bold uppercase tracking-tight">{item.case_code}</p>}
                          </td>
                          <td className="px-4 py-4">
                            <span className={getPriorityStyle(item.priority)}>{item.priority}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={getStatusStyle(item.status)}>{item.status}</span>
                          </td>
                          <td className="px-4 py-4 text-slate-400 font-medium">
                            {item.due_date ? new Date(item.due_date).toLocaleDateString() : ""}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-4 text-slate-400">
                              <Eye 
                                onClick={() => openDetails(item)} 
                                size={18} 
                                className="cursor-pointer hover:text-emerald-500 hover:scale-110 transition-all duration-200" 
                              />
                              <Edit2 
                                onClick={() => openStatusModal(item)} 
                                size={16} 
                                className="cursor-pointer hover:text-blue-500 hover:scale-110 transition-all duration-200" 
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                    {!loading && data.length === 0 && (
                      <tr>
                        <td colSpan="7" className="px-6 py-16 text-center text-slate-400">
                          <div className="flex flex-col items-center gap-3">
                             <CheckCircle size={40} className="text-slate-100" />
                             <p className="text-lg font-bold text-slate-300 italic uppercase tracking-widest">Great job! All caught up.</p>
                             <p className="text-xs font-semibold">No assigned tasks found for you at the moment.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* --- TASK DETAILS VIEW --- */
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div onClick={() => setView("list")} className="p-2 bg-white border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors shadow-sm">
                  <ArrowLeft size={16} />
                </div>
                <h2 className="text-[1.5rem] font-black text-slate-900 tracking-tight">{selectedTask?.title}</h2>
              </div>
              <button 
                onClick={() => openStatusModal(selectedTask)}
                className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95"
              >
                <Edit2 size={16} /> Update Status
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Info */}
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <CheckSquare size={120} />
                  </div>
                  <div className="flex justify-between items-start border-b border-slate-100 pb-6 mb-8">
                    <div>
                      <span className="text-[0.65rem] font-black text-slate-400 uppercase tracking-[0.2em] block mb-2">Reference Code</span>
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">TSK-{String(selectedTask?.id).padStart(4, '0')}</h3>
                    </div>
                    <div className="flex gap-3">
                      <span className={getPriorityStyle(selectedTask?.priority)}>{selectedTask?.priority}</span>
                      <span className={getStatusStyle(selectedTask?.status)}>{selectedTask?.status}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                    <DetailRow label="Client Name" value={selectedTask?.client_name} />
                    <DetailRow label="Case Reference" value={selectedTask?.case_code} />
                    <DetailRow label="Case Title" value={selectedTask?.case_title} />
                    <DetailRow label="Task Category" value={selectedTask?.task_type} />
                    <DetailRow label="Due Date" value={selectedTask?.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : ""} />
                    <DetailRow label="Assigned Time" value={selectedTask?.created_at ? new Date(selectedTask.created_at).toLocaleDateString() : ""} />
                  </div>

                  <div className="mt-12 pt-8 border-t border-slate-50">
                    <DetailRow label="Task Description" value={selectedTask?.description || "No detailed description provided for this task."} />
                  </div>
                </div>

                <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-8 flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Clock size={28} className="text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-emerald-900">Estimated Duration</h4>
                    <p className="text-emerald-700 font-medium">This task is estimated to take <span className="text-emerald-900 font-black">{selectedTask?.required_time || 0} hours</span> to complete.</p>
                  </div>
                </div>
              </div>

              {/* Right Column - Secondary Info */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
                   <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-4">Workflow Progress</h4>
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <span className="text-sm font-bold text-slate-500 whitespace-nowrap overflow-hidden text-ellipsis mr-2">Total Stages</span>
                         <span className="px-3 py-1 bg-slate-100 rounded-lg text-sm font-black text-slate-700">{selectedTask?.total_stages || 1}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner">
                         <div 
                           className={`h-full transition-all duration-1000 ${selectedTask?.status === 'Completed' ? 'w-full bg-emerald-500' : selectedTask?.status === 'In Progress' ? 'w-1/2 bg-blue-500' : 'w-[5%] bg-slate-300'}`}
                         ></div>
                      </div>
                      <p className="text-[0.7rem] text-slate-400 font-semibold italic text-center">Progress visualization based on status</p>
                   </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150 duration-700"></div>
                  <h4 className="text-xs font-black text-white/50 uppercase tracking-[0.2em] mb-4">Confidentiality</h4>
                  <p className="text-sm font-medium leading-relaxed mb-6 opacity-80 italic">Access to these documents is restricted to authorized personnel only. Please maintain strict data privacy protocols.</p>
                  <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-white/10 uppercase tracking-widest">
                    <FileText size={14} /> Documentation Guidelines
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- STATUS UPDATE MODAL --- */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-slate-100">
            <div className="p-8 pb-4">
              <h3 className="text-[1.25rem] font-black text-slate-900 tracking-tight mb-2">Update Workflow Status</h3>
              <p className="text-sm text-slate-500 font-medium">Please select the current progress of this task to keep the administrator informed.</p>
            </div>

            <div className="p-8 pt-0 space-y-6">
              <div className="space-y-3">
                <label className="text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Select Progress Level</label>
                <div className="grid grid-cols-1 gap-2">
                  {["Not Started", "In Progress", "On Hold", "Completed"].map((s) => (
                    <div 
                      key={s}
                      onClick={() => setStatusForm({ ...statusForm, status: s })}
                      className={`
                        flex items-center justify-between px-5 py-4 rounded-2xl cursor-pointer border-2 transition-all
                        ${statusForm.status === s 
                          ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-md shadow-emerald-500/10" 
                          : "border-slate-50 bg-slate-50 text-slate-500 hover:border-slate-200 hover:bg-white"}
                      `}
                    >
                      <span className="text-sm font-bold uppercase tracking-tight">{s}</span>
                      {statusForm.status === s && <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white"><CheckCircle size={12} strokeWidth={4} /></div>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setIsStatusModalOpen(false)}
                  className="flex-1 py-3.5 px-6 border border-slate-200 rounded-2xl text-[0.75rem] font-black text-slate-600 hover:bg-slate-50 transition-colors uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStatus}
                  className="flex-1 py-3.5 px-6 bg-slate-900 text-white rounded-2xl text-[0.75rem] font-black hover:bg-black shadow-lg shadow-black/10 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Confirm Change
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
