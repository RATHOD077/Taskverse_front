import React, { useState, useEffect } from "react";
import {
  Plus, Search, Edit2, Trash2, Eye, Lock, Unlock, Key, EyeOff, X,
  ChevronRight, MoreHorizontal, Globe, ChevronsUpDown, Filter, ArrowLeft
} from "lucide-react";
import api from "../../../api/api";
import PaginationControls from "../../../components/PaginationControls";

const Customers = () => {
  const [view, setView] = useState("list"); // "list" or "details"
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [resetTarget, setResetTarget] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });

  const [showPass, setShowPass] = useState(false);
  const [resetForm, setResetForm] = useState({ newPassword: "", confirmPassword: "" });

  const initialFormState = {
    name: "", contact: "", email: "", address: "",
    city: "", state: "", pincode: "", aadhar_card_number: "",
    pan_card_number: "", referred_by: "", dob: "", added_by: "1",
  };

  const [form, setForm] = useState(initialFormState);

  // Headers are handled in the api instance (Authorization)

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customers', { params: { page, limit: 10 } });
      if (res.data.success) {
        setData(res.data.customers || []);
        setPagination(res.data.pagination || { page: 1, limit: 10, total: (res.data.customers || []).length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
      }
    } catch (err) {
      console.error("Failed to fetch customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page]);

  // Working Search Filter
  const filtered = data.filter((c) => {
    const searchTerm = search.toLowerCase().trim();
    if (!searchTerm) return true;

    return (
      c.name?.toLowerCase().includes(searchTerm) ||
      c.email?.toLowerCase().includes(searchTerm) ||
      c.contact?.toString().includes(searchTerm) ||
      c.city?.toLowerCase().includes(searchTerm) ||
      c.state?.toLowerCase().includes(searchTerm) ||
      `CL000${c.id}`.toLowerCase().includes(searchTerm)
    );
  });

  const openAdd = () => {
    setEditingItem(null);
    setForm(initialFormState);
    setIsModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      name: item.name || "",
      contact: item.contact || "",
      email: item.email || "",
      address: item.address || "",
      city: item.city || "",
      state: item.state || "",
      pincode: item.pincode || "",
      aadhar_card_number: item.aadhar_card_number || "",
      pan_card_number: item.pan_card_number || "",
      referred_by: item.referred_by || "",
      dob: item.dob ? new Date(item.dob).toISOString().split('T')[0] : "",
      added_by: item.added_by || "1",
    });
    setIsModalOpen(true);
  };

  const openDetails = (item) => {
    setSelectedCustomer(item);
    setView("details");
  };

  const saveItem = async () => {
    try {
      if (editingItem) {
        const res = await api.put(`/customers/${editingItem.id}`, form);
        if (res.data.success) fetchCustomers();
      } else {
        const res = await api.post('/customers', form);
        if (res.data.success) fetchCustomers();
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save customer");
    }
  };

  const softDelete = async (id) => {
    if (true) {
      try {
        const res = await api.delete(`/customers/${id}`);
        if (res.data.success) fetchCustomers();
      } catch (err) {
        console.error("Error deleting customer:", err);
      }
    }
  };

  const toggleStatus = (item) => {
    setData(prevData => 
      prevData.map(c => 
        c.id === item.id 
          ? { ...c, status: c.status === "Active" ? "Inactive" : "Active" } 
          : c
      )
    );
  };

  const openResetPassword = (item) => {
    setResetTarget(item);
    setResetForm({ newPassword: "", confirmPassword: "" });
    setShowPass(false);
    setIsResetModalOpen(true);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (resetForm.newPassword !== resetForm.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert(`Password reset successfully for ${resetTarget?.name}`);
    setIsResetModalOpen(false);
    setResetForm({ newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      
      {/* HEADER - Responsive */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-400 font-medium uppercase tracking-wider overflow-hidden">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span>Dashboard</span>
          <ChevronRight size={12} className="shrink-0" />
          <span>Client Management</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className={view === 'list' ? "text-slate-900 font-bold" : ""}>Clients</span>
          {view === 'details' && selectedCustomer && (
            <>
              <ChevronRight size={12} className="shrink-0" />
              <span className="text-slate-900 font-bold truncate max-w-[180px]">{selectedCustomer.name}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs md:text-sm font-semibold bg-white">
            <Globe size={14} className="text-blue-500" /> English 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4" />
          </button>
          <div className="flex items-center gap-2 text-xs md:text-sm font-semibold">
            <span className="text-slate-500 hidden sm:inline">Company</span>
            <div className="w-7 h-7 md:w-8 md:h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold">C</div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        
        {view === "list" ? (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <h2 className="text-2xl md:text-[1.75rem] font-bold text-slate-900">Clients</h2>
              <button 
                onClick={openAdd}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-5 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95"
              >
                <Plus size={18} /> Add Client
              </button>
            </div>

            {/* SEARCH BAR - Responsive */}
            <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name, email, phone, city or client ID..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-5 py-3 bg-white border border-slate-200 rounded-2xl text-base outline-none focus:border-emerald-500" 
                  />
                </div>
                
                <button className="bg-[#10b981] text-white px-6 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 whitespace-nowrap">
                  <Search size={18} /> Search
                </button>
              </div>

              <button className="px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold flex items-center gap-2 bg-white text-slate-600 whitespace-nowrap">
                <Filter size={18} /> Filters
              </button>

              <div className="hidden md:flex items-center gap-2 text-sm text-slate-400 font-medium whitespace-nowrap">
                <span>Per Page:</span>
                <select className="border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none text-slate-600">
                  <option>10</option>
                  <option>25</option>
                </select>
              </div>
            </div>

            {/* TABLE - Responsive */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1100px]">
                  <thead className="bg-slate-50/70 border-b border-slate-200">
                    <tr className="text-xs md:text-sm font-bold text-slate-400">
                      <th className="px-6 py-5 w-12">#</th>
                      <th className="px-6 py-5">Client ID</th>
                      <th className="px-6 py-5">Name</th>
                      <th className="px-6 py-5">Email</th>
                      <th className="px-6 py-5">Phone</th>
                      <th className="px-6 py-5">Status</th>
                      <th className="px-6 py-5">Created At</th>
                      <th className="px-6 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-100">
                    {loading ? (
                      <tr><td colSpan={8} className="p-20 text-center font-medium text-slate-400">Loading Clients...</td></tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-20 text-center font-medium text-slate-400">
                          No customers found matching "{search}"
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item, idx) => (
                        <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-6 py-5 text-slate-500 font-medium">{((pagination.page || 1) - 1) * (pagination.limit || 10) + idx + 1}</td>
                          <td className="px-6 py-5 font-bold text-slate-900">CL000{item.id}</td>
                          <td className="px-6 py-5 font-semibold text-slate-900">{item.name}</td>
                          <td className="px-6 py-5 text-slate-600">{item.email || ""}</td>
                          <td className="px-6 py-5 text-slate-600">{item.contact || ""}</td>
                          <td className="px-6 py-5">
                            <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-4 py-1.5 rounded-2xl text-xs font-bold uppercase">
                              {item.status || "Active"}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-slate-500">
                            {new Date(item.created_at).toISOString().split('T')[0]}
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-end gap-5">
                              <Eye 
                                size={19} 
                                className="text-blue-500 cursor-pointer hover:text-blue-600 transition-colors" 
                                onClick={() => openDetails(item)} 
                              />
                              <Edit2 
                                onClick={() => openEdit(item)} 
                                size={19} 
                                className="text-orange-400 cursor-pointer hover:text-orange-500 transition-colors" 
                              />

                              <button 
                                onClick={() => toggleStatus(item)}
                                className={`cursor-pointer transition-colors ${item.status === "Active" ? "text-emerald-600" : "text-amber-600"}`}
                              >
                                {item.status === "Active" ? <Unlock size={19} /> : <Lock size={19} />}
                              </button>

                              <button 
                                onClick={() => openResetPassword(item)}
                                className="cursor-pointer"
                              >
                                <Key size={19} className="text-violet-400" />
                              </button>

                              <Trash2 
                                onClick={() => softDelete(item.id)} 
                                size={19} 
                                className="text-rose-500 cursor-pointer hover:text-rose-600 transition-colors" 
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
            {!search.trim() && (
              <PaginationControls
                page={pagination.page}
                limit={pagination.limit}
                total={pagination.total}
                totalPages={pagination.totalPages}
                hasPrevPage={pagination.hasPrevPage}
                hasNextPage={pagination.hasNextPage}
                onPageChange={setPage}
                label="customers"
              />
            )}
          </>
        ) : (
          /* ==================== DETAILS PAGE - Responsive ==================== */
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl md:text-[1.75rem] font-bold text-slate-900">Client: {selectedCustomer?.name}</h2>
                <p className="text-slate-500 mt-1">CL000{selectedCustomer?.id}</p>
              </div>
              <button 
                onClick={() => setView("list")}
                className="flex items-center gap-2 px-6 py-3 border border-slate-200 rounded-2xl text-sm font-semibold bg-white hover:bg-slate-50 transition-all w-full sm:w-auto justify-center"
              >
                <ArrowLeft size={18} /> Back to Clients
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Basic Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-5">Basic Information</h3>
                  <div className="space-y-6 text-base">
                    <div>
                      <span className="text-slate-500 text-sm block">Client ID</span> 
                      <span className="font-semibold">CL000{selectedCustomer?.id}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block">Name</span> 
                      <span className="font-semibold">{selectedCustomer?.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block">Email</span> 
                      <span className="text-blue-600">{selectedCustomer?.email || ""}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block">Phone</span> 
                      <span>{selectedCustomer?.contact || ""}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block">Date of Birth</span> 
                      <span>{selectedCustomer?.dob ? new Date(selectedCustomer.dob).toLocaleDateString('en-IN') : ""}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block">Status</span> 
                      <span className="bg-emerald-100 text-emerald-700 px-5 py-2 rounded-2xl text-sm font-medium inline-block">
                        {selectedCustomer?.status || "Active"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-5">Contact Information</h3>
                  <div className="space-y-6 text-base">
                    <div>
                      <span className="text-slate-500 text-sm block">Address</span> 
                      <span className="leading-relaxed">{selectedCustomer?.address || ""}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <span className="text-slate-500 text-sm block">City</span> 
                        <span>{selectedCustomer?.city || ""}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 text-sm block">State</span> 
                        <span>{selectedCustomer?.state || ""}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block">Pincode</span> 
                      <span>{selectedCustomer?.pincode || ""}</span>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="font-semibold text-lg mb-5">Additional Information</h3>
                  <div className="space-y-6 text-base">
                    <div>
                      <span className="text-slate-500 text-sm block">Aadhar Number</span> 
                      <span className="font-mono tracking-wider">{selectedCustomer?.aadhar_card_number || ""}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-sm block">PAN Number</span> 
                      <span className="font-mono tracking-wider">{selectedCustomer?.pan_card_number || ""}</span>
                    </div>
                    {selectedCustomer?.referred_by && (
                      <div>
                        <span className="text-slate-500 text-sm block">Referred By</span> 
                        <span>{selectedCustomer.referred_by}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-slate-500 text-sm block">Created At</span> 
                      <span>{new Date(selectedCustomer?.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="mt-12 pt-10 border-t border-slate-100">
                <div className="flex border-b border-slate-200 mb-6 overflow-x-auto">
                  <button className="px-8 py-4 border-b-2 border-emerald-600 font-semibold text-emerald-700 whitespace-nowrap">Documents (3)</button>
                  <button className="px-8 py-4 text-slate-500 whitespace-nowrap">Billing Info (1)</button>
                </div>

                <div className="space-y-4">
                  {[
                    { name: "ID_Copy.jpg", date: "2025-08-21", desc: "Copy of government issued ID" },
                    { name: "Insurance_Policy.png", date: "2025-08-21", desc: "Insurance policy documentation" },
                    { name: "Correspondence.png", date: "2025-08-21", desc: "Client correspondence and communications" }
                  ].map((doc, i) => (
                    <div key={i} className="flex flex-col sm:flex-row gap-4 bg-white border border-slate-200 rounded-2xl p-6">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl">📄</div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">{doc.name}</p>
                        <p className="text-sm text-slate-500">Uploaded: {doc.date}</p>
                        <p className="text-sm text-slate-600 mt-3">{doc.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ADD/EDIT MODAL - UNCHANGED */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[1rem] w-full max-w-[50rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-[1.5rem] border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-[1.25rem] font-bold text-slate-900">{editingItem ? "Edit Client" : "Add New Client"}</h3>
              <Plus onClick={() => setIsModalOpen(false)} size={24} className="rotate-45 text-slate-400 cursor-pointer hover:text-slate-900 transition-colors" />
            </div>

            <form className="p-[1.5rem] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-[1rem]" onSubmit={(e) => { e.preventDefault(); saveItem(); }}>
              <div className="col-span-1 sm:col-span-2">
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" required />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">Contact Number *</label>
                <input type="tel" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" required />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">Email Address</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" />
              </div>
              <div className="col-span-1 sm:col-span-2">
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">Address</label>
                <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">City</label>
                <input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">State</label>
                <input type="text" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">Pincode</label>
                <input type="text" value={form.pincode} onChange={e => setForm({ ...form, pincode: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" maxLength={6} />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">Date of Birth</label>
                <input type="date" value={form.dob} onChange={e => setForm({ ...form, dob: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">Aadhar Number</label>
                <input type="text" value={form.aadhar_card_number} onChange={e => setForm({ ...form, aadhar_card_number: e.target.value })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" />
              </div>
              <div>
                <label className="text-[0.8rem] font-bold text-slate-700 mb-[0.4rem] block">PAN Number</label>
                <input type="text" value={form.pan_card_number} onChange={e => setForm({ ...form, pan_card_number: e.target.value.toUpperCase() })} className="w-full h-[2.8rem] px-[1rem] rounded-[0.5rem] bg-white border border-slate-200 outline-none focus:border-emerald-500 transition-all text-[0.875rem] text-slate-700" />
              </div>

              <div className="col-span-1 sm:col-span-2 flex items-center justify-end gap-[1rem] pt-[1rem] border-t border-slate-50">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-[1.5rem] py-[0.6rem] border border-slate-200 rounded-[0.5rem] text-[0.85rem] font-bold text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-[2rem] py-[0.6rem] bg-[#10b981] text-white rounded-[0.5rem] text-[0.85rem] font-bold shadow-lg shadow-emerald-100 active:scale-95 transition-all">
                  {editingItem ? "Save Changes" : "Save Client"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* RESET PASSWORD MODAL - UNCHANGED */}
      {isResetModalOpen && resetTarget && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.25rem] w-full max-w-[28rem] shadow-2xl overflow-hidden">
            <div className="p-6 flex items-start justify-between">
              <div>
                <h3 className="text-[1.2rem] font-bold text-slate-900">Reset Client Password</h3>
                <div className="mt-2 text-[0.8rem] space-y-0.5">
                  <p className="text-slate-400 uppercase font-bold tracking-wider text-[0.65rem]">Target Account</p>
                  <p className="text-slate-600 font-semibold">{resetTarget.name}</p>
                  <p className="text-slate-400 italic">{resetTarget.email}</p>
                </div>
              </div>
              <button onClick={() => setIsResetModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                <X size={20} />
              </button>
            </div>
           
            <form onSubmit={handleResetPassword} className="p-6 pt-0 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[0.75rem] font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-[0.9rem]"
                    value={resetForm.newPassword}
                    onChange={e => setResetForm({...resetForm, newPassword: e.target.value})}
                    required
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[0.75rem] font-bold text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all text-[0.9rem]"
                  value={resetForm.confirmPassword}
                  onChange={e => setResetForm({...resetForm, confirmPassword: e.target.value})}
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsResetModalOpen(false)} className="flex-1 py-2.5 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#10b981] text-white rounded-xl font-bold hover:bg-[#0da975] shadow-lg shadow-emerald-100 transition-all">Reset Password</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;


