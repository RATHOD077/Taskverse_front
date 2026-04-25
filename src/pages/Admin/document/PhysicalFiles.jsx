import React, { useState, useEffect } from "react";
import { 
  Box, Plus, Search, Edit2, Trash2, Hash, 
  MapPin, FileStack, ChevronRight,
  MoreHorizontal, Globe, Filter 
} from "lucide-react";
import api from "../../../api/api";

const PhysicalFiles = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ file_number: "", file_name: "", storage_rack_no: "" });

  const fetchPhysicalFiles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/physical-files');
      if (response.data.success) {
        setData(response.data.physicalFiles);
      } else {
        setError("Failed to load physical files.");
      }
    } catch (err) {
      console.error("Fetch physical files error:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhysicalFiles();
  }, []);

  // Live Search Filter
  const filteredData = data.filter(item =>
    (item.file_no || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.file_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.storage_rack_no || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAdd = () => {
    setEditingItem(null);
    setForm({ file_number: "", file_name: "", storage_rack_no: "" });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ 
      file_number: item.file_number || "", 
      file_name: item.file_name || "", 
      storage_rack_no: item.storage_rack_no || "" 
    });
    setIsModalOpen(true);
  };

  const saveItem = async (e) => {
    if (e) e.preventDefault();
    if (!form.file_name) {
      alert("File designation/name is required!");
      return;
    }

    try {
      if (editingItem) {
        const response = await api.put(`/physical-files/${editingItem.id}`, form);
        if (response.data.success) {
          fetchPhysicalFiles();
          setIsModalOpen(false);
        }
      } else {
        const response = await api.post('/physical-files', form);
        if (response.data.success) {
          fetchPhysicalFiles();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error("Save physical file error:", err);
      alert("Failed to save physical file record.");
    }
  };

  const deleteItem = async (id, file_number) => {
    if (true) {
      try {
        const response = await api.delete(`/physical-files/${id}`);
        if (response.data.success) {
          fetchPhysicalFiles();
        }
      } catch (err) {
        console.error("Delete physical file error:", err);
        alert("Failed to delete physical file.");
      }
    }
  };

 

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      
      {/* Top Navbar */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-1.5 text-[0.7rem] text-slate-400 font-medium uppercase tracking-wider">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span>Dashboard</span>
          <ChevronRight size={12} className="shrink-0" />
          <span>Archive</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-900 font-bold">Physical Assets</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold bg-white">
            <Globe size={14} className="text-blue-500" /> English 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4" />
          </button>
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
            <span className="text-slate-500 hidden sm:inline">Company</span>
            <div className="w-7 h-7 md:w-8 md:h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-sm">C</div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-[1.75rem] font-bold text-slate-900 flex items-center gap-3">
             
              Physical Archive
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-1">Manage high-security physical assets</p>
          </div>
          <button 
            onClick={openAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
          >
            <Plus size={18} /> Register Asset
          </button>
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search serial or label..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-[2.75rem] pr-[1rem] py-[0.625rem] bg-slate-50 border border-slate-200 rounded-[0.75rem] text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/10" 
            />
          </div>
          <button className="px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold flex items-center gap-2 bg-white text-slate-600 hover:bg-slate-50 transition-colors whitespace-nowrap">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Table / Card View */}
        <div className="bg-white rounded-[1rem] border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
             <div className="p-12 text-center text-slate-500 font-bold italic animate-pulse tracking-widest uppercase text-xs">Accessing vault documents...</div>
          ) : error ? (
             <div className="p-12 text-center text-rose-500 font-bold">{error}</div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-200">
                    <tr className="text-[0.7rem] uppercase tracking-widest font-black text-slate-400">
                      <th className="px-[1.5rem] py-[1.25rem] text-center w-[4rem]">Idx</th>
                      <th className="px-[1.5rem] py-[1.25rem]"><div className="flex items-center gap-2"><Hash size={14} /> Serial Ref</div></th>
                      <th className="px-[1.5rem] py-[1.25rem]"><div className="flex items-center gap-2"><FileStack size={14} /> Asset Designation</div></th>
                      <th className="px-[1.5rem] py-[1.25rem]"><div className="flex items-center gap-2"><MapPin size={14} /> Rack Location</div></th>
                      <th className="px-[1.5rem] py-[1.25rem]">Status</th>
                      <th className="px-[1.5rem] py-[1.25rem] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[0.875rem] divide-y divide-slate-100">
                    {filteredData.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-[1.5rem] py-[1.25rem] text-center font-bold text-slate-300">#{idx + 1}</td>
                        <td className="px-[1.5rem] py-[1.25rem] font-black text-slate-900">{item.file_number || '"”'}</td>
                        <td className="px-[1.5rem] py-[1.25rem] font-bold text-slate-600 uppercase italic tracking-tight">{item.file_name}</td>
                        <td className="px-[1.5rem] py-[1.25rem]">
                          <span className="bg-blue-50 text-blue-600 px-[0.75rem] py-[0.375rem] rounded-[0.5rem] font-bold text-[0.7rem] border border-blue-100 flex items-center gap-1 w-fit">
                            {item.storage_rack_no || 'TBD'}
                          </span>
                        </td>
                        <td className="px-[1.5rem] py-[1.25rem]">
                          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-[0.7rem] uppercase">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>Secured
                          </span>
                        </td>
                        <td className="px-[1.5rem] py-[1.25rem]">
                          <div className="flex items-center justify-end gap-[0.75rem]">
                            <button 
                              onClick={() => openEdit(item)} 
                              className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-all hover:scale-105"
                              title="Edit Asset"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => deleteItem(item.id, item.file_number)} 
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all hover:scale-105"
                              title="Decommission"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden divide-y divide-slate-100">
                {filteredData.map((item, idx) => (
                  <div key={item.id} className="p-[1.25rem] space-y-[1rem]">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[0.65rem] font-black text-slate-300 uppercase tracking-widest">#{idx + 1} Serial</p>
                        <h4 className="text-[1rem] font-black text-slate-900 leading-tight">{item.file_number || '"”'}</h4>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEdit(item)} 
                          className="p-3 bg-orange-50 text-orange-500 rounded-xl border border-orange-100 hover:bg-orange-100 transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id, item.file_number)} 
                          className="p-3 bg-rose-50 text-rose-500 rounded-xl border border-rose-100 hover:bg-rose-100 transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-[1rem] pt-[0.5rem]">
                      <div className="space-y-1">
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                          <FileStack size={12}/> Designation
                        </p>
                        <p className="text-[0.8rem] font-bold text-slate-600 truncate uppercase italic">{item.file_name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                          <MapPin size={12}/> Location
                        </p>
                        <p className="text-[0.8rem] font-bold text-blue-600">{item.storage_rack_no || 'TBD'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[0.65rem] uppercase pt-[0.5rem]">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      Security Status: Secured
                    </div>
                  </div>
                ))}
              </div>
              
              {filteredData.length === 0 && (
                <div className="p-20 text-center text-slate-400 font-medium">No physical files found. Record a new entry to get started.</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ==================== ADD / EDIT MODAL - UNCHANGED ==================== */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-[1rem]">
          <div className="bg-white rounded-[1.25rem] w-full max-w-[32rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-[1.5rem] border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-[1.125rem] font-black text-slate-900 uppercase italic leading-none">
                {editingItem ? "Update Asset Record" : "New Physical Asset Entry"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                âœ•
              </button>
            </div>

            <form className="p-[1.5rem] space-y-[1.25rem]" onSubmit={saveItem}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest px-1">Serial Number</label>
                  <input 
                    type="text" 
                    value={form.file_number} 
                    onChange={e => setForm({...form, file_number: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-bold" 
                    placeholder="e.g. PF-001"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest px-1">Rack Location</label>
                  <input 
                    type="text" 
                    value={form.storage_rack_no} 
                    onChange={e => setForm({...form, storage_rack_no: e.target.value})} 
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-bold" 
                    placeholder="e.g. RACK-A1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.7rem] font-black text-slate-400 uppercase tracking-widest px-1">Asset Designation / Name *</label>
                <input 
                  type="text" 
                  value={form.file_name} 
                  onChange={e => setForm({...form, file_name: e.target.value})} 
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all text-sm font-bold" 
                  placeholder="e.g. Finance Ledger 2023"
                  required 
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3.5 border border-slate-200 rounded-xl text-slate-500 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                  {editingItem ? "Update Entry" : "Secure Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicalFiles;
