import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, X, Eye, 
  ChevronRight, Filter, MoreHorizontal, Globe,
  ChevronsUpDown, FileText, User, Shield
} from "lucide-react";

const DocumentPermissions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);

  const [permissions, setPermissions] = useState([
    { 
      id: 1, 
      user: "John Doe", 
      userEmail: "john.doe@company.com",
      document: "Strategic_Plan_2026.pdf", 
      level: "Owner", 
      status: "Active", 
      createdAt: "2025-08-21 09:15",
      updatedAt: "2025-08-21 09:15",
      expiresAt: "Permanent"
    },
    { 
      id: 2, 
      user: "Sarah Smith", 
      userEmail: "sarah.smith@company.com",
      document: "Q1_Financial_Report.xlsx", 
      level: "Editor", 
      status: "Active", 
      createdAt: "2025-08-21 10:30",
      updatedAt: "2025-08-21 10:30",
      expiresAt: "Permanent"
    }
  ]);

  const [form, setForm] = useState({
    user: "",
    document: "",
    level: "Viewer",
    status: "Active"
  });

  const getLevelStyle = (level) => {
    switch (level) {
      case 'Owner': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'Editor': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100'; 
    }
  };

  const openAdd = () => {
    setEditingPermission(null);
    setForm({ user: "", document: "", level: "Viewer", status: "Active" });
    setIsModalOpen(true);
  };

  const openEdit = (perm) => {
    setEditingPermission(perm);
    setForm({
      user: perm.user,
      document: perm.document,
      level: perm.level,
      status: perm.status
    });
    setIsModalOpen(true);
  };

  const openView = (perm) => {
    setSelectedPermission(perm);
    setIsViewModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingPermission) {
      setPermissions(permissions.map(item =>
        item.id === editingPermission.id ? { ...item, ...form } : item
      ));
    } else {
      const newPerm = {
        id: Date.now(),
        ...form,
        userEmail: `${form.user.toLowerCase().replace(/\s+/g, '.')}@company.com`,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        expiresAt: "Permanent"
      };
      setPermissions([...permissions, newPerm]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, user) => {
    if (true) {
      setPermissions(permissions.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans pb-[2rem]">
      {/* Header */}
      <header className="h-[3.5rem] md:h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-[40]">
        <div className="flex items-center gap-[0.5rem] text-[0.65rem] md:text-[0.6875rem] text-slate-400 font-medium overflow-hidden">
          <MoreHorizontal size={16} className="bg-slate-100 p-[0.125rem] rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span className="truncate">Document Management</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-900 font-bold truncate">Permissions</span>
        </div>
        <div className="flex items-center gap-[1rem]">
          <button className="flex items-center gap-[0.5rem] px-[0.75rem] py-[0.375rem] border border-slate-200 rounded-[0.5rem] text-[0.75rem] font-semibold bg-white hover:bg-slate-50 transition-all">
            <Globe size={14} className="text-blue-500" /> 
            <span className="hidden sm:inline">English</span> 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-[1rem]" />
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.65rem]">C</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto space-y-[1.5rem]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem]">
          <h2 className="text-[1.25rem] md:text-[1.5rem] font-bold text-slate-900">Permissions Control</h2>
          <button 
            onClick={openAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-[0.5rem] bg-[#10b981] hover:bg-[#0da975] text-white px-[1.25rem] py-[0.625rem] rounded-[0.625rem] text-[0.875rem] font-bold shadow-lg shadow-emerald-500/10 transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Permission
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-[0.75rem] rounded-[0.75rem] border border-slate-200 shadow-sm flex flex-col md:flex-row gap-[1rem]">
            <div className="relative flex-1">
              <Search className="absolute left-[0.875rem] top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by user or document..." 
                className="w-full pl-[2.75rem] pr-[1rem] py-[0.625rem] bg-slate-50 border border-slate-200 rounded-[0.5rem] text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" 
              />
            </div>
            <button className="px-[1.5rem] py-[0.625rem] border border-slate-200 rounded-[0.5rem] text-[0.875rem] font-bold flex items-center justify-center gap-[0.5rem] bg-white hover:bg-slate-50 text-slate-600">
                <Filter size={18} /> Filters
            </button>
        </div>

        {/* Table/Data Container */}
        <div className="bg-white rounded-[1rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr className="text-[0.7rem] uppercase tracking-wider font-bold text-slate-400">
                  <th className="px-[1.5rem] py-[1.25rem] text-center w-[4rem]">#</th>
                  <th className="px-[1.5rem] py-[1.25rem]">User</th>
                  <th className="px-[1.5rem] py-[1.25rem]">Document</th>
                  <th className="px-[1.5rem] py-[1.25rem]">Access Level</th>
                  <th className="px-[1.5rem] py-[1.25rem] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[0.875rem] divide-y divide-slate-100">
                {permissions.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-[1.5rem] py-[1rem] text-center font-medium text-slate-400">{idx + 1}</td>
                    <td className="px-[1.5rem] py-[1rem]">
                      <div className="flex items-center gap-[0.75rem]">
                        <div className="w-[2.25rem] h-[2.25rem] bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold border border-emerald-100">
                          {item.user.charAt(0)}
                        </div>
                        <div>
                            <div className="font-bold text-slate-900">{item.user}</div>
                            <div className="text-[0.75rem] text-slate-400">{item.userEmail}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-[1.5rem] py-[1rem] text-slate-600">
                      <div className="flex items-center gap-2">
                        <FileText size={16} className="text-slate-300" />
                        <span className="font-medium">{item.document}</span>
                      </div>
                    </td>
                    <td className="px-[1.5rem] py-[1rem]">
                      <span className={`px-[0.75rem] py-[0.25rem] rounded-[0.5rem] text-[0.75rem] font-bold border ${getLevelStyle(item.level)}`}>
                        {item.level}
                      </span>
                    </td>
                    <td className="px-[1.5rem] py-[1rem]">
                      <div className="flex items-center justify-end gap-[1rem]">
                        <button onClick={() => openView(item)} className="p-[0.5rem] text-blue-500 hover:bg-blue-50 rounded-[0.5rem] transition-all"><Eye size={18} /></button>
                        <button onClick={() => openEdit(item)} className="p-[0.5rem] text-orange-500 hover:bg-orange-50 rounded-[0.5rem] transition-all"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(item.id, item.user)} className="p-[0.5rem] text-rose-500 hover:bg-rose-50 rounded-[0.5rem] transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List View */}
          <div className="md:hidden divide-y divide-slate-100">
            {permissions.map((item, idx) => (
              <div key={item.id} className="p-[1rem] space-y-[0.75rem]">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-[2.5rem] h-[2.5rem] bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center font-bold border border-emerald-100">{item.user.charAt(0)}</div>
                        <div className="font-bold text-slate-900">{item.user}</div>
                    </div>
                    <span className={`px-[0.625rem] py-[0.125rem] rounded-[0.375rem] text-[0.65rem] font-bold border ${getLevelStyle(item.level)}`}>{item.level}</span>
                </div>
                <div className="text-[0.8125rem] flex items-center gap-2 text-slate-500 bg-slate-50 p-2 rounded">
                    <FileText size={14} /> {item.document}
                </div>
                <div className="flex justify-between items-center pt-2">
                    <span className="text-[0.75rem] text-slate-400 italic">Added: {item.createdAt.split(' ')[0]}</span>
                    <div className="flex gap-4">
                        <button onClick={() => openView(item)} className="text-blue-500"><Eye size={20} /></button>
                        <button onClick={() => openEdit(item)} className="text-orange-500"><Edit2 size={20} /></button>
                        <button onClick={() => handleDelete(item.id, item.user)} className="text-rose-500"><Trash2 size={20} /></button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ADD / EDIT MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-[1rem]">
          <div className="bg-white rounded-[1.25rem] w-full max-w-[32rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-[1.5rem] py-[1.25rem] border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                    <Shield size={20} />
                </div>
                <h3 className="font-bold text-[1.125rem] text-slate-900">
                    {editingPermission ? "Update Access" : "Grant Access"}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-[1.5rem] space-y-[1.25rem]">
              <div className="space-y-[0.5rem]">
                <label className="text-[0.8125rem] font-bold text-slate-700 ml-1">Select User</label>
                <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                        value={form.user} 
                        onChange={e => setForm({...form, user: e.target.value})} 
                        className="w-full pl-10 pr-4 py-[0.75rem] border border-slate-200 rounded-[0.75rem] bg-white text-[0.875rem] focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer" 
                        required
                    >
                        <option value="">Choose a team member...</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Sarah Smith">Sarah Smith</option>
                        <option value="Mike Johnson">Mike Johnson</option>
                        <option value="Emily Davis">Emily Davis</option>
                    </select>
                    <ChevronsUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-[0.5rem]">
                <label className="text-[0.8125rem] font-bold text-slate-700 ml-1">Target Document</label>
                <div className="relative">
                    <FileText size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select 
                        value={form.document} 
                        onChange={e => setForm({...form, document: e.target.value})} 
                        className="w-full pl-10 pr-4 py-[0.75rem] border border-slate-200 rounded-[0.75rem] bg-white text-[0.875rem] focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all appearance-none cursor-pointer" 
                        required
                    >
                        <option value="">Choose document...</option>
                        <option value="Strategic_Plan_2026.pdf">Strategic_Plan_2026.pdf</option>
                        <option value="Q1_Financial_Report.xlsx">Q1_Financial_Report.xlsx</option>
                        <option value="Employee_Handbook.docx">Employee_Handbook.docx</option>
                    </select>
                    <ChevronsUpDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem]">
                <div className="space-y-[0.5rem]">
                    <label className="text-[0.8125rem] font-bold text-slate-700 ml-1">Permission Type</label>
                    <select 
                        value={form.level} 
                        onChange={e => setForm({...form, level: e.target.value})} 
                        className="w-full px-4 py-[0.75rem] border border-slate-200 rounded-[0.75rem] bg-white text-[0.875rem] focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                    >
                        <option value="Viewer">Viewer (Read-only)</option>
                        <option value="Editor">Editor (Write)</option>
                        <option value="Owner">Owner (Full Control)</option>
                    </select>
                </div>
                <div className="space-y-[0.5rem]">
                    <label className="text-[0.8125rem] font-bold text-slate-700 ml-1">Status</label>
                    <select 
                        value={form.status} 
                        onChange={e => setForm({...form, status: e.target.value})} 
                        className="w-full px-4 py-[0.75rem] border border-slate-200 rounded-[0.75rem] bg-white text-[0.875rem] focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500 outline-none transition-all cursor-pointer"
                    >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                    </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-[0.75rem] pt-[1rem]">
                <button 
                    type="button" 
                    onClick={() => setIsModalOpen(false)} 
                    className="flex-1 py-[0.75rem] border border-slate-200 rounded-[0.75rem] font-bold text-slate-600 hover:bg-slate-50 transition-all text-[0.875rem]"
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="flex-1 py-[0.75rem] bg-emerald-600 text-white rounded-[0.75rem] font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all text-[0.875rem]"
                >
                  {editingPermission ? "Save Changes" : "Confirm Grant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- VIEW MODAL --- */}
      {isViewModalOpen && selectedPermission && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[2px] z-[110] flex items-center justify-center p-[1rem]">
          <div className="bg-white rounded-[1.25rem] w-full max-w-[28rem] shadow-2xl overflow-hidden">
            <div className="p-[1.5rem] flex items-center justify-between border-b border-slate-100">
              <h3 className="text-[1.125rem] font-bold text-slate-900">Access Details</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X size={22} />
              </button>
            </div>

            <div className="p-[1.5rem] space-y-[1.25rem]">
              <div className="flex flex-col items-center pb-4 border-b border-slate-50">
                <div className="w-[4rem] h-[4rem] bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-[1.5rem] font-bold border-2 border-emerald-100 mb-2">
                    {selectedPermission.user.charAt(0)}
                </div>
                <h4 className="font-bold text-[1.125rem]">{selectedPermission.user}</h4>
                <p className="text-[0.8125rem] text-slate-400">{selectedPermission.userEmail}</p>
              </div>

              <div className="space-y-[1rem]">
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-[0.75rem] uppercase tracking-wider font-bold text-slate-400">Target File</span>
                    <span className="text-[0.875rem] font-bold text-slate-700 truncate max-w-[150px]">{selectedPermission.document}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-[0.75rem] uppercase tracking-wider font-bold text-slate-400">Access Level</span>
                    <span className={`px-2 py-1 rounded text-[0.75rem] font-bold border ${getLevelStyle(selectedPermission.level)}`}>{selectedPermission.level}</span>
                </div>
                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                    <span className="text-[0.75rem] uppercase tracking-wider font-bold text-slate-400">Duration</span>
                    <span className="text-[0.875rem] font-bold text-slate-700">{selectedPermission.expiresAt}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="w-full py-[0.75rem] bg-slate-900 text-white rounded-[0.75rem] font-bold hover:bg-slate-800 transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentPermissions;
