import React, { useEffect, useState, useMemo } from "react";
import api from "../../../api/api";
import { 
  Plus, Search, Edit2, Trash2, X, 
  ChevronRight, Filter, MoreHorizontal, Globe,
  ChevronsUpDown, Activity
} from "lucide-react";

const TaskStages = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({ 
    stage_name: "", 
    status: "Active" 
  });

  const fetchStages = async () => {
    setLoading(true);
    try {
      const res = await api.get("/task-stages");
      if (res.data?.success) {
        setData(res.data.stages || []);
      }
    } catch (err) {
      console.error("Failed to load task stages", err);
      alert(err.response?.data?.message || "Failed to load task stages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStages();
  }, []);

  // --- HANDLERS ---
  const openAdd = () => {
    setEditingItem(null);
    setForm({ stage_name: "", status: "Active" });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ 
      stage_name: item.stage_name, 
      status: item.status 
    });
    setIsModalOpen(true);
  };

  const saveItem = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/task-stages/${editingItem.id}`, {
          stage_name: form.stage_name,
          status: form.status,
        });
      } else {
        await api.post("/task-stages", {
          stage_name: form.stage_name,
          status: form.status,
        });
      }
      setIsModalOpen(false);
      fetchStages();
    } catch (err) {
      console.error("Failed to save stage", err);
      alert(err.response?.data?.message || "Failed to save stage");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stage?")) return;
    try {
      await api.delete(`/task-stages/${id}`);
      fetchStages();
    } catch (err) {
      console.error("Failed to delete stage", err);
      alert(err.response?.data?.message || "Failed to delete stage");
    }
  };

  // --- FILTERED DATA ---
  const filteredData = useMemo(() => {
    return data.filter(item =>
      item.stage_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans text-[1rem]">
      
      {/* --- TOP NAVBAR --- */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-10">
        <div className="hidden sm:flex items-center gap-[0.5rem] text-[0.7rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-[0.125rem] rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Task Workflow Stages</span>
        </div>
        <div className="flex items-center gap-[1rem] ml-auto sm:ml-0">
          <button className="flex items-center gap-[0.5rem] px-[0.75rem] py-[0.375rem] border border-slate-200 rounded-lg text-[0.75rem] font-semibold bg-white">
            <Globe size={14} className="text-blue-500" /> EN 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-[1rem]" />
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.75rem]">C</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto">
        {/* Title and Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem] mb-[1.5rem]">
          <h2 className="text-[1.5rem] font-bold text-slate-900">Task Workflow Stages</h2>
          <button 
            onClick={openAdd}
            className="flex items-center justify-center gap-[0.5rem] bg-[#10b981] hover:bg-[#0da975] text-white px-[1rem] py-[0.5rem] rounded-lg text-[0.875rem] font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Stage
          </button>
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="bg-white p-[1rem] rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-[1rem] mb-[1.5rem]">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-[0.5rem] flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search stages..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-[2.5rem] pr-[1rem] py-[0.5rem] bg-slate-50 border border-slate-200 rounded-lg text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/10" 
              />
            </div>
            <div className="flex gap-[0.5rem]">
              <button className="flex-1 md:flex-none bg-[#10b981] text-white px-[1.5rem] py-[0.5rem] rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-[0.5rem]">
                <Search size={16} /> Search
              </button>
              <button className="flex-1 md:flex-none px-[1rem] py-[0.5rem] border border-slate-200 rounded-lg text-[0.875rem] font-bold flex items-center justify-center gap-[0.5rem] bg-white text-slate-600">
                <Filter size={16} /> Filters
              </button>
            </div>
          </div>
        </div>

        {/* --- DATA TABLE --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-200">
              <tr className="text-[0.6875rem] uppercase tracking-wider font-bold text-slate-400">
                <th className="px-6 py-4 text-center w-12">#</th>
                <th className="px-6 py-4">Stage Name <ChevronsUpDown size={12} className="inline ml-1 opacity-50" /></th>
                <th className="px-6 py-4">Added By</th>
                <th className="px-6 py-4">Created At</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[0.8125rem] divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    Loading stages...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    {searchTerm ? "No matching stages found." : "No stages found."}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{idx + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 flex items-center gap-2">
                      <Activity size={16} className="text-slate-400" /> 
                      {item.stage_name}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded text-[0.6875rem] uppercase tracking-tight">
                        {item.added_by || ""}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {item.created_at || ""}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md text-[0.6875rem] font-bold border uppercase ${
                        item.status === "Active" 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-rose-50 text-rose-600 border-rose-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <Edit2 
                          onClick={() => openEdit(item)}
                          size={17} 
                          className="text-orange-400 cursor-pointer hover:scale-110 transition-transform" 
                        />
                        <Trash2 
                          onClick={() => handleDelete(item.id)}
                          size={17} 
                          className="text-rose-500 cursor-pointer hover:scale-110 transition-transform" 
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-[1rem]">
          <div className="bg-white rounded-2xl w-full max-w-[32rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-[1.5rem] border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[1.25rem] font-bold text-slate-900">
                {editingItem ? "Edit Stage" : "Add New Stage"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-900"
              >
                <X size={20} />
              </button>
            </div>

            <form className="p-[1.5rem] space-y-[1.25rem]" onSubmit={saveItem}>
              <div className="space-y-[0.375rem]">
                <label className="text-[0.875rem] font-semibold text-slate-700">Stage Name *</label>
                <input 
                  type="text" 
                  value={form.stage_name}
                  onChange={e => setForm({...form, stage_name: e.target.value})}
                  className="w-full px-[1rem] py-[0.6rem] border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20 text-[0.875rem]" 
                  required
                />
              </div>

              <div className="space-y-[0.375rem]">
                <label className="text-[0.875rem] font-semibold text-slate-700">Status</label>
                <select 
                  value={form.status}
                  onChange={e => setForm({...form, status: e.target.value})}
                  className="w-full px-[1rem] py-[0.6rem] border border-slate-200 rounded-lg bg-white text-[0.875rem]"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-[0.75rem] pt-[1rem]">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-[1.5rem] py-[0.6rem] border border-slate-200 rounded-xl text-[0.875rem] font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-[2rem] py-[0.6rem] bg-[#10b981] text-white rounded-xl text-[0.875rem] font-bold shadow-lg shadow-emerald-100 hover:bg-[#0da975]"
                >
                  {editingItem ? "Update Stage" : "Save Stage"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStages;
