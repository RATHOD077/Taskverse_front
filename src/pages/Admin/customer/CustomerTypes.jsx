import React, { useState } from "react";
import { 
  Plus, Search, Edit2, Trash2, Lock, Unlock, Eye,
  ChevronRight, Filter, MoreHorizontal, Globe,
  ChevronsUpDown, X
} from "lucide-react";

const CustomerTypes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [clientTypes, setClientTypes] = useState([
    { id: 1, name: "Individual", description: "Individual clients and personal customers", status: "Active", createdAt: "2025-08-21" },
    { id: 2, name: "Small Business", description: "Small business clients and startups", status: "Active", createdAt: "2025-08-21" },
    { id: 3, name: "Corporate", description: "Large corporate clients and enterprises", status: "Active", createdAt: "2025-08-21" },
    { id: 4, name: "Government", description: "Government agencies and public sector", status: "Active", createdAt: "2025-08-21" },
    { id: 5, name: "Non-Profit", description: "Non-profit organizations and charities", status: "Active", createdAt: "2025-08-21" },
  ]);

  const [formData, setFormData] = useState({
    id: null,
    name: "",
    description: "",
    status: "Active"
  });

  const [viewingType, setViewingType] = useState(null);

  const filteredTypes = clientTypes.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({ id: null, name: "", description: "", status: "Active" });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      description: item.description,
      status: item.status
    });
    setIsModalOpen(true);
  };

  const openViewModal = (item) => {
    setViewingType(item);
    setIsViewModalOpen(true);
  };

  const toggleStatus = (id) => {
    setClientTypes(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    );
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client type?")) {
      setClientTypes(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    if (formData.id) {
      setClientTypes(prev =>
        prev.map(item =>
          item.id === formData.id
            ? { ...item, name: formData.name, description: formData.description, status: formData.status }
            : item
        )
      );
    } else {
      const newId = Math.max(0, ...clientTypes.map(t => t.id)) + 1;
      setClientTypes(prev => [
        ...prev,
        {
          id: newId,
          name: formData.name,
          description: formData.description,
          status: formData.status,
          createdAt: "2025-08-21"
        }
      ]);
    }

    setIsModalOpen(false);
    setFormData({ id: null, name: "", description: "", status: "Active" });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      
      {/* HEADER */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span>Dashboard</span>
          <ChevronRight size={12} className="shrink-0" />
          <span>Client Management</span>
          <ChevronRight size={12} className="shrink-0" />
          <span>Client Setup</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-900 font-bold">Client Types</span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold bg-white hover:bg-slate-50 transition-all">
            <Globe size={14} className="text-blue-500" /> English 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4" />
          </button>
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
            <span className="text-slate-500 hidden sm:inline">Company</span>
            <div className="w-7 h-7 md:w-8 md:h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold">C</div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1200px] mx-auto">
        
        {/* Title + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <h2 className="text-2xl md:text-[1.75rem] font-bold text-slate-900">Client Types</h2>
          <button 
            onClick={openAddModal}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-5 py-3 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add Client Type
          </button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-base focus:outline-none focus:border-emerald-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <button className="bg-[#10b981] text-white px-6 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-[#0da975] whitespace-nowrap">
              <Search size={18} /> Search
            </button>
            <button className="px-6 py-3.5 border border-slate-200 rounded-2xl text-sm font-bold flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600 whitespace-nowrap">
              <Filter size={18} /> Filters
            </button>
          </div>
        </div>

        {/* TABLE - Responsive with horizontal scroll on mobile */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr className="text-xs md:text-sm uppercase tracking-wider font-bold text-slate-400">
                  <th className="px-6 py-5 text-center w-12">#</th>
                  <th className="px-6 py-5 whitespace-nowrap">Name</th>
                  <th className="px-6 py-5">Description</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 whitespace-nowrap">Created At</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm md:text-base divide-y divide-slate-100">
                {filteredTypes.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-5 text-center font-bold text-slate-900">{idx + 1}</td>
                    <td className="px-6 py-5 font-bold text-slate-900">{item.name}</td>
                    <td className="px-6 py-5 text-slate-500 line-clamp-2">{item.description}</td>
                    <td className="px-6 py-5">
                      <span className={`px-4 py-1.5 rounded-2xl text-sm font-medium border uppercase ${
                        item.status === "Active" 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-slate-400 font-medium">{item.createdAt}</td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-6">
                        <Eye 
                          size={19} 
                          className="text-blue-400 cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => openViewModal(item)}
                        />
                        <Edit2 
                          size={18} 
                          className="text-orange-400 cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => openEditModal(item)}
                        />
                        <button 
                          onClick={() => toggleStatus(item.id)}
                          className="cursor-pointer transition-transform hover:scale-110"
                          title={item.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          {item.status === "Active" ? 
                            <Unlock size={19} className="text-emerald-500" /> : 
                            <Lock size={19} className="text-amber-500" />
                          }
                        </button>
                        <Trash2 
                          size={19} 
                          className="text-rose-500 cursor-pointer hover:scale-110 transition-transform" 
                          onClick={() => handleDelete(item.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="p-4 md:p-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-400 font-medium">
            <span>Showing 1 to {filteredTypes.length} of {clientTypes.length} client types</span>
            <div className="flex gap-2">
              <button className="px-5 py-2 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors">Previous</button>
              <button className="px-5 py-2 bg-[#10b981] text-white rounded-2xl font-bold shadow-sm">1</button>
              <button className="px-5 py-2 border border-slate-200 rounded-2xl bg-white hover:bg-slate-50 disabled:opacity-50 transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {isViewModalOpen && viewingType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">View Client Type</h3>
              <button onClick={() => setIsViewModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Client Type Name</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-900 font-medium">
                  {viewingType.name}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Description</label>
                <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 text-slate-700 min-h-[90px]">
                  {viewingType.description}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-600 block mb-1">Status</label>
                <div className={`inline-block px-6 py-2.5 rounded-2xl font-medium text-sm ${
                  viewingType.status === "Active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}>
                  {viewingType.status}
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex justify-end">
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="px-8 py-3 border border-slate-300 rounded-2xl font-semibold hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD/EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[32rem] shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">
                {formData.id ? "Edit Client Type" : "Add New Client Type"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Client Type Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  required
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 text-base" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Description</label>
                <textarea 
                  rows={4} 
                  className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-emerald-500 resize-y text-base"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Status</label>
                <select 
                  className="w-full px-5 py-3.5 border border-slate-200 rounded-2xl outline-none bg-white text-base font-medium"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value})}
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)} 
                  className="flex-1 py-3.5 border border-slate-200 rounded-2xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3.5 bg-[#10b981] hover:bg-[#0da975] text-white rounded-2xl font-semibold shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTypes;
