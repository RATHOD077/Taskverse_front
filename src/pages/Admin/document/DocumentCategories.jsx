import React, { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Trash2, Lock, Unlock, 
  ChevronRight, Filter, MoreHorizontal, Globe,
  ChevronsUpDown, X
} from "lucide-react";
import api from '../../../api/api';

const DocumentCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
    status: "Active"
  });

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await api.get('/document-categories');
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      // Fallback demo data
      setCategories([
        { id: "DCAT000001", name: "Contracts", description: "Legal contracts and agreements", color: "#3b82f6", status: "Active" },
        { id: "DCAT000002", name: "Legal Briefs", description: "Court briefs and legal arguments", color: "#10b981", status: "Active" },
        { id: "DCAT000003", name: "Evidence", description: "Case evidence and supporting documents", color: "#f59e0b", status: "Active" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Open Add Modal
  const openAdd = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "", color: "#3b82f6", status: "Active" });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEdit = (category) => {
    setEditingCategory(category);
    setForm({
      name: category.name,
      description: category.description || "",
      color: category.color,
      status: category.status
    });
    setIsModalOpen(true);
  };

  // Toggle Status
  const toggleStatus = async (id) => {
    try {
      const category = categories.find(c => c.id === id);
      const newStatus = category.status === "Active" ? "Inactive" : "Active";

      await api.put(`/document-categories/${id}`, { status: newStatus });

      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, status: newStatus } : cat
      ));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // Delete Category
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete category "${name}"?`)) return;

    try {
      await api.delete(`/document-categories/${id}`);
      setCategories(categories.filter(cat => cat.id !== id));
    } catch (err) {
      alert("Failed to delete category");
    }
  };

  // Save (Add or Edit)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert("Category name is required!");
      return;
    }

    try {
      if (editingCategory) {
        await api.put(`/document-categories/${editingCategory.id}`, form);
        setCategories(categories.map(cat => 
          cat.id === editingCategory.id ? { ...cat, ...form } : cat
        ));
      } else {
        const res = await api.post('/document-categories', form);
        setCategories([...categories, res.data.category]);
      }

      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save category");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading categories...</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans relative pb-[2rem]">
      
      {/* Header */}
      <header className="h-[3.5rem] md:h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-40">
        <div className="flex items-center gap-[0.5rem] text-[0.65rem] md:text-[0.6875rem] text-slate-400 font-medium overflow-hidden">
          <MoreHorizontal size={16} className="bg-slate-100 p-[0.125rem] rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span className="hidden xs:inline truncate">Dashboard</span>
          <ChevronRight size={12} className="hidden xs:inline shrink-0" />
          <span className="truncate">Document Setup</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-900 font-bold">Categories</span>
        </div>
        <div className="flex items-center gap-[0.75rem] md:gap-[1rem]">
          <button className="flex items-center gap-[0.5rem] px-[0.5rem] md:px-[0.75rem] py-[0.375rem] border border-slate-200 rounded-[0.5rem] text-[0.7rem] md:text-[0.75rem] font-semibold bg-white hover:bg-slate-50 transition-all">
            <Globe size={14} className="text-blue-500" /> 
            <span className="hidden sm:inline">English</span> 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-[1rem]" />
          </button>
          <div className="flex items-center gap-[0.5rem] text-[0.75rem] font-semibold">
            <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700">C</div>
          </div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto space-y-[1.5rem]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem]">
          <h2 className="text-[1.25rem] md:text-[1.5rem] font-bold text-slate-900">Document Categories</h2>
          <button 
            onClick={openAdd}
            className="w-full sm:w-auto flex items-center justify-center gap-[0.5rem] bg-[#10b981] hover:bg-[#0da975] text-white px-[1rem] py-[0.625rem] rounded-[0.5rem] text-[0.875rem] font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white p-[0.75rem] md:p-[1rem] rounded-[0.75rem] border border-slate-200 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-[1rem]">
          <div className="flex flex-col md:flex-row items-stretch gap-[0.75rem] flex-1">
            <div className="relative flex-1 max-w-full md:max-w-[28rem]">
              <Search className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search categories..." 
                className="w-full pl-[2.5rem] pr-[1rem] py-[0.5rem] bg-slate-50 border border-slate-200 rounded-[0.5rem] text-[0.875rem] focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all"
              />
            </div>
            <button className="flex-1 md:flex-none bg-[#10b981] text-white px-[1.5rem] py-[0.5rem] rounded-[0.5rem] text-[0.875rem] font-bold flex items-center justify-center gap-[0.5rem] hover:bg-[#0da975]">
              <Search size={16} /> Search
            </button>
            <button className="flex-1 md:flex-none px-[1rem] py-[0.5rem] border border-slate-200 rounded-[0.5rem] text-[0.875rem] font-bold flex items-center justify-center gap-[0.5rem] bg-white hover:bg-slate-50 text-slate-600">
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[0.75rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr className="text-[0.6875rem] uppercase tracking-wider font-bold text-slate-400">
                  <th className="px-[1.5rem] py-[1rem] text-center w-[3rem]">#</th>
                  <th className="px-[1.5rem] py-[1rem]">Category ID</th>
                  <th className="px-[1.5rem] py-[1rem]">Name</th>
                  <th className="px-[1.5rem] py-[1rem]">Description</th>
                  <th className="px-[1.5rem] py-[1rem]">Color</th>
                  <th className="px-[1.5rem] py-[1rem]">Status</th>
                  <th className="px-[1.5rem] py-[1rem] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[0.84375rem] divide-y divide-slate-100">
                {categories.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-[1.5rem] py-[1rem] text-center font-bold text-slate-900">{idx + 1}</td>
                    <td className="px-[1.5rem] py-[1rem] font-medium text-slate-600 uppercase">{item.id}</td>
                    <td className="px-[1.5rem] py-[1rem] font-bold text-slate-900">{item.name}</td>
                    <td className="px-[1.5rem] py-[1rem] text-slate-500 max-w-[18rem] truncate">{item.description}</td>
                    <td className="px-[1.5rem] py-[1rem]">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg shadow-sm" style={{ backgroundColor: item.color }}></div>
                        <span className="font-mono text-xs text-slate-500">{item.color}</span>
                      </div>
                    </td>
                    <td className="px-[1.5rem] py-[1rem]">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        item.status === "Active" 
                          ? "bg-green-50 text-green-600 border-green-100" 
                          : "bg-red-50 text-red-600 border-red-100"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-[1.5rem] py-[1rem]">
                      <div className="flex items-center justify-center gap-5">
                        <button 
                          onClick={() => openEdit(item)}
                          className="text-orange-500 hover:text-orange-600 transition-colors"
                          title="Edit Category"
                        >
                          <Edit2 size={19} />
                        </button>

                        <button 
                          onClick={() => toggleStatus(item.id)}
                          className={`transition-colors ${item.status === "Active" ? "text-emerald-600" : "text-amber-600"}`}
                          title={item.status === "Active" ? "Deactivate" : "Activate"}
                        >
                          {item.status === "Active" ? <Unlock size={19} /> : <Lock size={19} />}
                        </button>

                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="text-rose-500 hover:text-rose-600 transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={19} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-slate-100">
            {categories.map((item, idx) => (
              <div key={item.id} className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-400">#{idx+1} - {item.id}</p>
                    <h4 className="font-bold text-slate-900">{item.name}</h4>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    item.status === "Active" ? "bg-green-50 text-green-600 border-green-100" : "bg-red-50 text-red-600 border-red-100"
                  }`}>
                    {item.status}
                  </span>
                </div>

                <p className="text-sm text-slate-500 line-clamp-2">{item.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-mono text-slate-500">{item.color}</span>
                  </div>

                  <div className="flex gap-6">
                    <button onClick={() => openEdit(item)} className="text-orange-500"><Edit2 size={20} /></button>
                    <button 
                      onClick={() => toggleStatus(item.id)} 
                      className={item.status === "Active" ? "text-emerald-600" : "text-amber-600"}
                    >
                      {item.status === "Active" ? <Unlock size={20} /> : <Lock size={20} />}
                    </button>
                    <button onClick={() => handleDelete(item.id, item.name)} className="text-rose-500"><Trash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-xl text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                  placeholder="e.g. Evidence"
                  required 
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                <textarea 
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  placeholder="Brief description..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Color</label>
                  <input 
                    type="color" 
                    value={form.color}
                    onChange={(e) => setForm({...form, color: e.target.value})}
                    className="w-full h-12 p-1 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select 
                    value={form.status}
                    onChange={(e) => setForm({...form, status: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-all"
                >
                  {editingCategory ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentCategories;
