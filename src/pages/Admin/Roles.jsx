import React, { useState } from "react";

import { 
  ShieldCheck, Plus, Search, Edit2, Trash2, Hash, 
  Shield, Info, Clock, LayoutGrid 
} from "lucide-react";

const Roles = () => {
  const [data, setData] = useState([
    { id: 1, role_id: 101, role_name: "Super Admin", description: "Full system access", created_at: "2026-01-01" },
    { id: 2, role_id: 102, role_name: "Admin", description: "Management access", created_at: "2026-01-10" },
    { id: 3, role_id: 103, role_name: "Manager", description: "Department level access", created_at: "2026-02-15" },
    { id: 4, role_id: 104, role_name: "Employee", description: "Standard user access", created_at: "2026-03-20" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState({ role_id: "", role_name: "", description: "" });

  const openAdd = () => {
    setEditingItem(null);
    setForm({ role_id: "", role_name: "", description: "" });
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({ ...item });
    setIsModalOpen(true);
  };

  const saveItem = () => {
    const now = new Date().toISOString().split('T')[0];
    if (editingItem) {
      setData(data.map(item => item.id === editingItem.id ? { ...form, id: item.id, created_at: item.created_at } : item));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
      setData([...data, { ...form, id: newId, created_at: now }]);
    }
    setIsModalOpen(false);
  };

  const deleteItem = (id) => {
    if (true) {
      setData(data.filter(item => item.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <main className="page-container text-slate-900">
        <div className="max-w-7xl mx-auto space-y-[1.5rem]">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem] bg-white p-[clamp(1rem,3vw,2.5rem)] rounded-[1.25rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-[0.875rem]">
              <div className="w-[3rem] h-[3rem] bg-blue-600 rounded-[1rem] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h1 className="text-[var(--text-page-title)] font-black tracking-tight text-slate-900 leading-tight">Roles Master</h1>
                <p className="text-slate-400 text-[0.875rem] font-medium">Manage top-level system access tiers.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[0.75rem]">
              <div className="relative">
                <Search className="absolute left-[0.875rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search Tiers..." 
                  className="pl-[2.5rem] pr-[1rem] py-[0.625rem] bg-slate-50 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-[0.75rem] text-[0.875rem] outline-none transition-all w-full sm:w-[14rem] font-bold"
                />
              </div>
              <button
                onClick={openAdd}
                className="group flex items-center justify-center gap-[0.5rem] bg-slate-900 hover:bg-slate-800 text-white px-[1.25rem] py-[0.625rem] rounded-[0.75rem] font-black transition-all shadow-lg hover:-translate-y-px active:translate-y-0 text-[0.875rem]"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> New Role
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-lg overflow-hidden text-slate-900">
            <div className="table-responsive">
              <table className="w-full text-left border-collapse min-w-[40rem]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-[1rem] py-[0.875rem] text-center w-[4rem]">
                      <div className="flex flex-col items-center gap-[0.25rem] text-slate-400">
                        <Hash size={14} />
                        <span className="text-[0.6rem] font-black uppercase tracking-widest">ID</span>
                      </div>
                    </th>
                    <th className="px-[1rem] py-[0.875rem] text-center">
                      <div className="flex flex-col items-center gap-[0.25rem] text-slate-400">
                        <Shield size={14} />
                        <span className="text-[0.6rem] font-black uppercase tracking-widest">Sys ID</span>
                      </div>
                    </th>
                    <th className="px-[1rem] py-[0.875rem]">
                      <div className="flex flex-col gap-[0.25rem] text-slate-400">
                        <LayoutGrid size={14} />
                        <span className="text-[0.6rem] font-black uppercase tracking-widest text-left">Role Name</span>
                      </div>
                    </th>
                    <th className="px-[1rem] py-[0.875rem] hide-sm">
                      <div className="flex flex-col gap-[0.25rem] text-slate-400">
                        <Info size={14} />
                        <span className="text-[0.6rem] font-black uppercase tracking-widest text-left">Description</span>
                      </div>
                    </th>
                    <th className="px-[1rem] py-[0.875rem] hide-md">
                      <div className="flex flex-col gap-[0.25rem] text-slate-400">
                        <Clock size={14} />
                        <span className="text-[0.6rem] font-black uppercase tracking-widest">Registered</span>
                      </div>
                    </th>
                    <th className="px-[1rem] py-[0.875rem] text-right">
                      <span className="text-[0.6rem] font-black uppercase tracking-widest text-slate-400">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-50/20 transition-all group">
                      <td className="px-[1rem] py-[1rem] text-center">
                        <span className="text-slate-300 font-black font-mono text-[0.8rem]">#{item.id}</span>
                      </td>
                      <td className="px-[1rem] py-[1rem] text-center">
                        <span className="px-[0.625rem] py-[0.25rem] bg-white border-2 border-slate-100 text-slate-900 rounded-[0.5rem] font-black text-[0.875rem] shadow-sm italic">
                          {item.role_id}
                        </span>
                      </td>
                      <td className="px-[1rem] py-[1rem]">
                        <div className="flex items-center gap-[0.75rem]">
                          <div className="w-[2.5rem] h-[2.5rem] shrink-0 rounded-[0.75rem] bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white group-hover:rotate-6 transition-all duration-300">
                            <ShieldCheck size={16} />
                          </div>
                          <span className="font-black text-slate-900 text-[0.9375rem] tracking-tight">{item.role_name}</span>
                        </div>
                      </td>
                      <td className="px-[1rem] py-[1rem] hide-sm">
                        <p className="text-slate-500 font-medium text-[0.875rem] line-clamp-1">{item.description}</p>
                      </td>
                      <td className="px-[1rem] py-[1rem] hide-md">
                         <span className="text-slate-400 font-bold text-[0.8125rem] italic">{item.created_at}</span>
                      </td>
                      <td className="px-[1rem] py-[1rem] text-right">
                        <div className="flex items-center justify-end gap-[0.5rem]">
                          <button onClick={() => openEdit(item)} className="w-[2.25rem] h-[2.25rem] flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-lg rounded-[0.75rem] transition-all border border-transparent hover:border-slate-100">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => deleteItem(item.id)} className="w-[2.25rem] h-[2.25rem] flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-lg rounded-[0.75rem] transition-all border border-transparent hover:border-slate-100">
                            <Trash2 size={16} />
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
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay text-slate-900 font-sans">
          <div className="modal-card animate-fade-in">
            <div className="bg-gradient-to-br from-slate-50 to-white px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(1.25rem,4vw,2rem)] border-b border-slate-50 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-[10rem] h-[10rem] bg-blue-50 rounded-full -translate-y-16 translate-x-16 blur-3xl opacity-50"></div>
               <button onClick={() => setIsModalOpen(false)} className="absolute right-[1rem] top-[1rem] w-[2.25rem] h-[2.25rem] flex items-center justify-center rounded-[0.75rem] bg-slate-50 hover:bg-white hover:shadow-lg transition-all text-slate-400 hover:text-slate-900">
                  <Plus className="rotate-45" size={20} />
               </button>
               <div className="w-[3rem] h-[3rem] bg-blue-600 rounded-[1rem] shadow-lg shadow-blue-200 flex items-center justify-center mb-[1rem]">
                  <ShieldCheck className="text-white" size={22} />
               </div>
               <h2 className="text-[var(--text-section-title)] font-black text-slate-900 leading-tight tracking-tight">
                 {editingItem ? "Update Tier" : "Create Tier"}
               </h2>
               <p className="text-slate-400 text-[0.875rem] font-bold mt-[0.5rem]">Configure system access parameters.</p>
            </div>
            
            <form className="p-[clamp(1.25rem,4vw,2rem)] space-y-[1.25rem]" onSubmit={(e) => { e.preventDefault(); saveItem(); }}>
              <div className="space-y-[0.5rem]">
                <label className="text-[0.7rem] font-black uppercase tracking-[0.15em] text-blue-600 flex items-center gap-[0.5rem]">
                  <Hash size={12} /> System Identifier
                </label>
                <input type="number" value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})} className="form-input font-bold text-[0.9375rem] rounded-[0.75rem]" placeholder="e.g. 101" required />
              </div>
              <div className="space-y-[0.5rem]">
                <label className="text-[0.7rem] font-black uppercase tracking-[0.15em] text-blue-600 flex items-center gap-[0.5rem]">
                  <LayoutGrid size={12} /> Role Name
                </label>
                <input type="text" value={form.role_name} onChange={e => setForm({...form, role_name: e.target.value})} className="form-input font-bold text-[0.9375rem] rounded-[0.75rem]" placeholder="e.g. System Architect" required />
              </div>
              <div className="space-y-[0.5rem]">
                <label className="text-[0.7rem] font-black uppercase tracking-[0.15em] text-blue-600 flex items-center gap-[0.5rem]">
                  <Info size={12} /> Tier Scope Description
                </label>
                <textarea 
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})} 
                  className="form-input resize-none h-[6rem] rounded-[0.75rem] font-medium text-[0.875rem]" 
                  placeholder="Describe the permissions for this tier..." 
                />
              </div>
              
              <div className="flex gap-[0.75rem] pt-[0.5rem]">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-[0.75rem] bg-slate-50 hover:bg-slate-100 text-slate-500 font-bold rounded-[0.75rem] transition-all text-[0.875rem]">Discard</button>
                <button type="submit" className="flex-1 py-[0.75rem] bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-[0.75rem] shadow-lg shadow-blue-500/30 transition-all hover:-translate-y-px active:translate-y-0 text-[0.875rem]">Commit Tier</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;


