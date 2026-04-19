import React, { useState, useEffect, useMemo } from "react";
import { 
  Plus, Search, Edit2, Trash2, Lock, 
  ChevronRight, Filter, MoreHorizontal, Globe,
  ChevronsUpDown, X
} from "lucide-react";
import api from "../../../api/api";

const TaskTypes = () => {
  // --- STATES ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    color: '#3B82F6',
    duration: '',
    status: 'Active'
  });

  // --- FETCH DATA ---
  const fetchTaskTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/task-types');
      if (response.data.success) {
        setData(response.data.taskTypes || []);
      } else {
        setError("Failed to load task types.");
      }
    } catch (err) {
      console.error("Error fetching task types:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskTypes();
  }, []);

  // --- FILTERED DATA ---
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data, searchTerm]);

  // --- HANDLERS ---
  const handleOpenModal = (item = null) => {
    if (item) {
      setEditId(item.id);
      setForm({
        name: item.name,
        description: item.description || '',
        color: item.color || '#3B82F6',
        duration: item.duration || '',
        status: item.status || 'Active'
      });
    } else {
      setEditId(null);
      setForm({
        name: '',
        description: '',
        color: '#3B82F6',
        duration: '',
        status: 'Active'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const response = await api.put(`/task-types/${editId}`, form);
        if (response.data.success) {
          fetchTaskTypes();
          setIsModalOpen(false);
        }
      } else {
        const response = await api.post('/task-types', form);
        if (response.data.success) {
          fetchTaskTypes();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Error saving task type:", err);
      alert(err.response?.data?.message || "Failed to save task type.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task type?")) return;
    try {
      const response = await api.delete(`/task-types/${id}`);
      if (response.data.success) {
        fetchTaskTypes();
      }
    } catch (err) {
      console.error("Error deleting task type:", err);
      alert(err.response?.data?.message || "Failed to delete task type.");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans text-[1rem]">
      
      {/* --- TOP NAVBAR --- */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-10">
        <div className="hidden md:flex items-center gap-[0.5rem] text-[0.75rem] text-slate-400 font-medium overflow-hidden">
          <MoreHorizontal size={16} className="bg-slate-100 p-[0.125rem] rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span className="truncate">Dashboard</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-900 font-bold truncate">Task Types</span>
        </div>
        
        <div className="flex items-center gap-[1rem] ml-auto">
          <button className="flex items-center gap-[0.5rem] px-[0.75rem] py-[0.375rem] border border-slate-200 rounded-lg text-[0.75rem] font-semibold bg-white">
            <Globe size={14} className="text-blue-500" /> EN 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-[1rem]" />
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.75rem]">C</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto">
        {/* Title + Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[1rem] mb-[1.5rem]">
          <h2 className="text-[1.5rem] font-bold text-slate-900">Task Types</h2>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add Task Type
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-1 min-w-[18.75rem]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search task types..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-[#10b981] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0da975]">
              <Search size={16} /> Search
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500">Loading task types...</div>
          ) : error ? (
            <div className="p-12 text-center text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-[0.6875rem] uppercase tracking-wider font-bold text-slate-400">
                  <tr>
                    <th className="px-6 py-4 text-center w-12">#</th>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Color</th>
                    <th className="px-6 py-4">Default Duration</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[0.84375rem] divide-y divide-slate-100">
                  {filteredData.length > 0 ? (
                    filteredData.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-center font-bold text-slate-900">{idx + 1}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">{item.name}</td>
                        <td className="px-6 py-4 text-slate-500 max-w-xs truncate">
                          {item.description || ""}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-5 h-5 rounded shadow-sm border border-slate-200" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-slate-500 uppercase font-medium text-sm">{item.color}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium">
                          {item.duration ? `${item.duration} mins` : ""}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`px-3 py-1 rounded-md text-[0.75rem] font-medium border uppercase ${
                            item.status === 'Active' 
                              ? 'bg-green-50 text-green-600 border-green-100' 
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">{item.created_at || ""}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-4">
                            <Edit2 
                              size={17} 
                              className="text-orange-400 cursor-pointer hover:scale-110 transition-transform" 
                              onClick={() => handleOpenModal(item)}
                            />
                            <Lock size={18} className="text-amber-500 cursor-pointer hover:scale-110 transition-transform" />
                            <Trash2 
                              size={18} 
                              className="text-rose-500 cursor-pointer hover:scale-110 transition-transform" 
                              onClick={() => handleDelete(item.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-12 text-center text-slate-400">
                        {searchTerm ? "No matching task types found." : "No task types found."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <h3 className="text-xl font-bold text-slate-900">
                {editId ? 'Edit Task Type' : 'Add New Task Type'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-md"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea 
                  rows={3}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm resize-y min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Color <span className="text-red-500">*</span></label>
                  <div className="flex gap-2">
                    <input 
                      type="color" 
                      className="w-12 h-10 border border-slate-200 rounded-lg cursor-pointer p-1"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                    />
                    <input 
                      type="text" 
                      className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg outline-none text-sm font-mono uppercase"
                      value={form.color}
                      onChange={(e) => setForm({ ...form, color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Default Duration (minutes)</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                    value={form.duration}
                    onChange={(e) => setForm({ ...form, duration: e.target.value })}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select 
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg bg-white outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-2.5 bg-[#10b981] hover:bg-[#0da975] text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                  {editId ? 'Update Task Type' : 'Save Task Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskTypes;
