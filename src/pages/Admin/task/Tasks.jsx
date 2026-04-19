import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Trash2, Eye, Lock, 
  ChevronRight, Filter, MoreHorizontal, Globe,
  Calendar, X, ChevronsUpDown, Folder, ArrowLeft
} from "lucide-react";
import api from "../../../api/api";

const DetailRow = ({ label, value }) => (
  <div className="flex flex-col gap-[0.25rem]">
    <span className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
    <span className="text-[1rem] font-medium text-slate-900">{value || ""}</span>
  </div>
);

const Tasks = () => {
  const [view, setView] = useState("list");
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dropdown data
  const [clients, setClients] = useState([]);
  const [cases, setCases] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [folders, setFolders] = useState([]);

  // Form state
  const initialFormState = {
    id: null,
    title: "",
    description: "",
    priority: "Medium",
    status: "Not Started",
    client_id: "",
    case_id: "",
    assigned_to: "",
    due_date: "",
    task_type: "Administrative",
    required_time: "0", 
    total_stages: 1,
    task_cost: 0,
    folder_access: []
  };
  const [form, setForm] = useState(initialFormState);
  const [folderSearchTerm, setFolderSearchTerm] = useState("");
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    
    // 1. Tasks
    try {
      const res = await api.get('/tasks');
      if (res.data.success) setData(res.data.tasks);
    } catch (err) {}

    // 2. Customers (Clients)
    try {
      const res = await api.get('/customers');
      if (res.data.success) setClients(res.data.customers);
    } catch (err) {}

    // 3. Cases
    try {
      const res = await api.get('/cases');
      if (res.data.success) setCases(res.data.cases);
    } catch (err) {}

    // 4. Employees (Users)
    try {
      const res = await api.get('/users');
      if (res.data.success) setEmployees(res.data.users || res.data.data || []);
    } catch (err) {}

    // 5. Folders
    try {
      const res = await api.get('/media-library/folders');
      if (res.data.success) setFolders(res.data.folders);
    } catch (err) {}

    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Save Task
  const handleSaveTask = async () => {

    if (!form.title || !form.title.trim()) {
      return;
    }
    if (!form.priority) {
      return;
    }
    if (!form.status) {
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...form,
        folder_access: form.folder_access.join(',') 
      };

      if (form.id) {
        await api.put(`/tasks/${form.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (task) => {
    setFolderSearchTerm("");
    setIsFolderDropdownOpen(false);
    setForm({
      id: task.id,
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "Medium",
      status: task.status || "Not Started",
      client_id: task.client_id || "",
      case_id: task.case_id || "",
      assigned_to: task.assigned_to || "",
      due_date: task.due_date ? task.due_date.split('T')[0] : "",
      task_type: task.task_type || "Administrative",
      required_time: task.required_time || "0",
      total_stages: task.total_stages || 1,
      task_cost: task.task_cost || 0,
      folder_access: task.folder_access ? String(task.folder_access).split(',').map(id => id.trim()) : []
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${id}`);
        fetchData();
      } catch (error) {
      }
    }
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
      
      {/* --- TOP NAVBAR --- */}
      <header className="page-topbar">
        <div className="breadcrumb">
           <MoreHorizontal size={14} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
           <ChevronRight size={11} className="shrink-0" />
           <span>Dashboard</span>
           <ChevronRight size={11} className="shrink-0" />
           <span className="hide-sm">Task &amp; Workflow</span>
           <ChevronRight size={11} className="hide-sm shrink-0" />
           <span className={view === 'list' ? "text-slate-900 font-bold" : ""}>Tasks</span>
           {view === 'details' && (
             <>
               <ChevronRight size={11} className="shrink-0" />
               <span className="text-slate-900 font-bold truncate max-w-[10rem]">{selectedTask?.title}</span>
             </>
           )}
        </div>
        <div className="flex items-center gap-[0.75rem] shrink-0">
           <button className="flex items-center gap-[0.375rem] px-[0.625rem] py-[0.375rem] border border-slate-200 rounded-[0.5rem] text-[0.75rem] font-semibold bg-white hover:bg-slate-50 transition-all">
             <Globe size={13} className="text-blue-500" />
             <span className="hide-xs">English</span>
             <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-[1rem] h-[0.625rem]" />
           </button>
           <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 text-[0.7rem] font-semibold">C</div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="p-[var(--page-px)] max-w-[100rem] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-[0.75rem] mb-[1.5rem]">
          <h2 className="text-[var(--text-page-title)] font-bold text-slate-900">Tasks</h2>
          <button 
            onClick={() => { 
              setForm(initialFormState); 
              setFolderSearchTerm("");
              setIsFolderDropdownOpen(false);
              setIsModalOpen(true); 
            }}
            className="self-start sm:self-auto flex items-center gap-[0.5rem] bg-[#10b981] hover:bg-[#059669] text-white px-[1rem] py-[0.5rem] rounded-[0.5rem] text-[0.875rem] font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>

        {view === 'list' ? (
          <>
        {/* Filters and Search Bar */}
        <div className="bg-white p-[0.875rem] rounded-[0.75rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-[0.75rem] mb-[1.25rem]">
          <div className="flex items-center gap-[0.5rem] flex-1 min-w-0">
            <div className="relative flex-1">
              <Search className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
            <button className="shrink-0 bg-[#10b981] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0da975]">
              <Search size={14} />
              <span className="hidden sm:inline">Search</span>
            </button>
            <button className="shrink-0 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 bg-white text-slate-600 hover:bg-slate-50">
              <Filter size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <span>Per Page:</span>
            <select className="border border-slate-200 rounded-md px-2 py-1 bg-white outline-none">
              <option>10</option>
              <option>25</option>
            </select>
          </div>
        </div>

        {/* Task Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-[0.6875rem] uppercase tracking-wider font-bold text-slate-400">
                    <tr>
                      <th className="px-4 py-4 text-center w-12">#</th>
                      <th className="px-4 py-4">Title <ChevronsUpDown size={12} className="inline ml-1 opacity-50" /></th>
                      <th className="px-4 py-4">Client</th>
                      <th className="px-4 py-4">Priority</th>
                      <th className="px-4 py-4 text-center">Status</th>
                      <th className="px-4 py-4">Assigned To</th>
                      <th className="px-4 py-4">Due Date <ChevronsUpDown size={12} className="inline ml-1 opacity-50" /></th>
                      <th className="px-4 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[0.84375rem] divide-y divide-slate-100">
                    {loading ? (
                       <tr>
                         <td colSpan="8" className="px-4 py-12 text-center text-slate-400">
                           <div className="flex flex-col items-center gap-2">
                             <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                             <span>Loading tasks...</span>
                           </div>
                         </td>
                       </tr>
                    ) : (
                      data.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-4 text-center font-bold text-slate-900">{idx + 1}</td>
                          <td className="px-4 py-4 font-semibold text-slate-800">{item.title}</td>
                          <td className="px-4 py-4 text-slate-600">{item.client_name || ""}</td>
                          <td className="px-4 py-4">
                            <span className={getPriorityStyle(item.priority)}>{item.priority}</span>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={getStatusStyle(item.status)}>{item.status}</span>
                          </td>
                          <td className="px-4 py-4 text-slate-700 font-medium">{item.assigned_to_name || "Unassigned"}</td>
                          <td className="px-4 py-4 text-slate-400">{item.due_date ? new Date(item.due_date).toLocaleDateString() : ""}</td>
                          <td className="px-4 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <Eye onClick={() => openDetails(item)} size={16} className="text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
                              <Edit2 onClick={() => handleEdit(item)} size={15} className="text-orange-400 cursor-pointer hover:scale-110 transition-transform" />
                              <Trash2 onClick={() => handleDelete(item.id)} size={17} className="text-rose-500 cursor-pointer hover:scale-110 transition-transform" />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                    {!loading && data.length === 0 && (
                      <tr>
                        <td colSpan="8" className="px-4 py-12 text-center text-slate-400">No tasks found. Create a new task to get started!</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* --- TASK DETAILS VIEW --- */
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-[1.5rem] font-bold text-slate-900">{selectedTask?.title}</h2>
              <button onClick={() => setView("list")} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white hover:bg-slate-50 transition-colors">
                <ArrowLeft size={16} /> Back to List
              </button>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-[1.5rem] md:p-[2.5rem]">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 pb-6 border-b border-slate-100">
                <div>
                  <h3 className="text-[1.25rem] font-bold text-slate-900">TSK00{selectedTask?.id}</h3>
                  <p className="text-[0.875rem] text-slate-400 mt-1">Task Information & Details</p>
                </div>
                <div className="flex gap-3">
                  <span className={getPriorityStyle(selectedTask?.priority)}>{selectedTask?.priority}</span>
                  <span className={getStatusStyle(selectedTask?.status)}>{selectedTask?.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-[2rem] gap-x-[3rem]">
                <DetailRow label="Title" value={selectedTask?.title} />
                <DetailRow label="Task Type" value={selectedTask?.task_type} />
                <DetailRow label="Client" value={selectedTask?.client_name} />
                <DetailRow label="Case ID" value={selectedTask?.case_code} />
                <DetailRow label="Assigned To" value={selectedTask?.assigned_to_name} />
                <DetailRow label="Due Date" value={selectedTask?.due_date ? new Date(selectedTask.due_date).toLocaleDateString() : ""} />
                <DetailRow label="Total Stages" value={selectedTask?.total_stages} />
                <DetailRow label="Est. Time" value={`${selectedTask?.required_time || 0} hrs`} />
                <div className="sm:col-span-2 lg:col-span-3 pt-4 border-t border-slate-50"><DetailRow label="Description" value={selectedTask?.description} /></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- ADD/EDIT MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="bg-white rounded-[0.75rem] w-full max-w-[32rem] shadow-2xl flex flex-col max-h-[92dvh] overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-xl sticky top-0 z-10">
              <h3 className="text-lg font-bold text-slate-900">{form.id ? "Edit Task" : "Add New Task"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-100 rounded-md">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 flex-1">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Title <span className="text-red-500">*</span></label>
                <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition-all text-sm" />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none focus:border-emerald-500 transition-all text-sm min-h-[80px]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Priority <span className="text-red-500">*</span></label>
                  <select value={form.priority} onChange={e => setForm({...form, priority: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white text-sm">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Status <span className="text-red-500">*</span></label>
                  <select value={form.status} onChange={e => setForm({...form, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white text-sm">
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Client, Case & Assignment</h4>
                 <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-slate-700">Client</label>
                      <select value={form.client_id} onChange={e => setForm({...form, client_id: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white">
                        <option value="">Select a Client...</option>
                        {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Case</label>
                        <select value={form.case_id} onChange={e => setForm({...form, case_id: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white">
                          <option value="">Select Case...</option>
                          {cases.map(c => (
                            <option key={c.id} value={c.id}>{c.case_id} - {c.title}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-sm font-semibold text-slate-700">Assigned To</label>
                        <select value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white">
                          <option value="">Unassigned</option>
                          {employees.map(e => (
                            <option key={e.id} value={e.id}>{e.username}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                 </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Folder Access</h4>
                <div className="space-y-3 relative">
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Select folders the employee can access for this task</p>
                  
                  {/* Dropdown Toggle */}
                  <div 
                    onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg bg-white flex justify-between items-center cursor-pointer hover:border-emerald-500 transition-colors"
                  >
                    <span className="text-sm text-slate-700 truncate">
                      {form.folder_access.length > 0 
                        ? `${form.folder_access.length} Folder${form.folder_access.length > 1 ? 's' : ''} Selected` 
                        : "Select Folders..."}
                    </span>
                    <ChevronsUpDown size={16} className="text-slate-400" />
                  </div>

                  {/* Dropdown Content */}
                  {isFolderDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden shadow-black/5" style={{ minHeight: '200px' }}>
                      {/* Search Bar */}
                      <div className="p-2 border-b border-slate-100 bg-slate-50/50">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input 
                            type="text" 
                            placeholder="Search folders..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                            value={folderSearchTerm}
                            onChange={(e) => setFolderSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>

                      {/* Folder List */}
                      <div className="max-h-48 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
                        {folders.filter(f => f.name.toLowerCase().includes(folderSearchTerm.toLowerCase())).map(f => (
                          <label key={f.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-100 group">
                            <input 
                              type="checkbox" 
                              checked={form.folder_access.includes(String(f.id))}
                              onChange={(e) => {
                                const id = String(f.id);
                                const current = [...form.folder_access];
                                if (e.target.checked) {
                                  if (!current.includes(id)) setForm({...form, folder_access: [...current, id]});
                                } else {
                                  setForm({...form, folder_access: current.filter(x => x !== id)});
                                }
                              }}
                              className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500/20 border-slate-300 transition-shadow cursor-pointer"
                            />
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Folder size={16} style={{ color: f.color }} className="shrink-0" />
                              <span className="text-sm font-medium text-slate-700 truncate group-hover:text-slate-900">{f.name}</span>
                            </div>
                          </label>
                        ))}
                        {folders.filter(f => f.name.toLowerCase().includes(folderSearchTerm.toLowerCase())).length === 0 && (
                          <p className="text-center py-6 text-xs text-slate-400 italic">No folders found.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Selected Tags Display */}
                  {form.folder_access.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2 pt-2 border-t border-slate-100/50">
                      {form.folder_access.map(id => {
                        const folder = folders.find(f => String(f.id) === id);
                        if (!folder) return null;
                        return (
                          <div key={id} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-md text-xs font-semibold border border-emerald-100 shadow-sm">
                            <Folder size={12} style={{ color: folder.color }} />
                            <span>{folder.name}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                setForm({...form, folder_access: form.folder_access.filter(x => x !== id)});
                              }}
                              className="ml-1 p-0.5 hover:bg-emerald-200/50 rounded transition-colors text-emerald-600 hover:text-emerald-800"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Due Date</label>
                  <input type="date" value={form.due_date} onChange={e => setForm({...form, due_date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Task Type</label>
                  <select value={form.task_type} onChange={e => setForm({...form, task_type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white text-sm">
                    <option value="Administrative">Administrative</option>
                    <option value="Research">Research</option>
                    <option value="Filing">Filing</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50/50 rounded-b-xl">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2 border border-slate-200 bg-white rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-50" disabled={isSaving}>Cancel</button>
              <button 
                type="button" 
                onClick={handleSaveTask} 
                disabled={isSaving}
                className="px-6 py-2 bg-[#10b981] hover:bg-[#0da975] text-white rounded-lg font-bold text-sm shadow-md transition-all flex items-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  form.id ? "Update Task" : "Save Task"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
