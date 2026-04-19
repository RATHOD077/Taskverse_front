import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Eye, Edit3, Trash2, X, ChevronRight,
  MoreHorizontal, RefreshCw, CheckCircle, XCircle, AlertCircle
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import api from "../../../api/api";

// â”€â”€â”€ Toast hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
};

const EMPTY_FORM = {
  name: "", contact: "", email: "", address: "",
  city: "", state: "", pincode: "",
  aadhar_card_number: "", pan_card_number: "",
  referred_by: "", dob: "",
};

// â”€â”€â”€ Client Form (defined OUTSIDE component to avoid re-mount on each render) â”€
const ClientForm = ({ formData, onChange, onSubmit, onCancel, mode, saving }) => (
  <form onSubmit={onSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">
          Client Name <span className="text-rose-500">*</span>
        </label>
        <input name="name" value={formData.name} onChange={onChange} required
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]"
          placeholder="Full Name" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">
          Phone <span className="text-rose-500">*</span>
        </label>
        <input name="contact" value={formData.contact} onChange={onChange} required
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]"
          placeholder="+91 98765 43210" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">Email</label>
        <input name="email" type="email" value={formData.email} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]"
          placeholder="email@example.com" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">Date of Birth</label>
        <input name="dob" type="date" value={formData.dob} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]" />
      </div>

      <div className="md:col-span-2 space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">Address</label>
        <textarea name="address" value={formData.address} onChange={onChange} rows={2}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem] resize-none"
          placeholder="Street, Locality..." />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">City</label>
        <input name="city" value={formData.city} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">State</label>
        <input name="state" value={formData.state} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">Pincode</label>
        <input name="pincode" value={formData.pincode} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">Referred By</label>
        <input name="referred_by" value={formData.referred_by} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem]"
          placeholder="Referral source" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">Aadhar Number</label>
        <input name="aadhar_card_number" value={formData.aadhar_card_number} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem] font-mono"
          placeholder="XXXX XXXX XXXX" />
      </div>

      <div className="space-y-1.5">
        <label className="text-[0.8125rem] font-bold text-slate-700">PAN Number</label>
        <input name="pan_card_number" value={formData.pan_card_number} onChange={onChange}
          className="w-full px-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] text-[0.875rem] font-mono uppercase"
          placeholder="ABCDE1234F" />
      </div>

    </div>

    <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
      <button type="button" onClick={onCancel}
        className="px-6 py-2.5 border border-slate-200 rounded-xl text-[0.875rem] font-bold text-slate-600 hover:bg-slate-50 transition-all">
        Cancel
      </button>
      <button type="submit" disabled={saving}
        className="px-8 py-2.5 bg-[#10b981] hover:bg-[#0da975] text-white rounded-xl text-[0.875rem] font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95 disabled:opacity-60 flex items-center gap-2">
        {saving && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {saving ? 'Saving...' : (mode === 'add' ? 'Save Client' : 'Update Client')}
      </button>
    </div>
  </form>
);

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [modalMode, setModalMode]   = useState(null); // 'add' | 'edit' | null
  const [selectedClient, setSelected] = useState(null);
  const [formData, setFormData]     = useState(EMPTY_FORM);
  const [saving, setSaving]         = useState(false);

  const { toast, show: showToast } = useToast();

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get('/customers', getAuthHeaders());
      if (res.data.success) setClients(res.data.customers || []);
    } catch {
      showToast("Failed to load clients", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  // â”€â”€ Modal helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openAdd = () => {
    setFormData(EMPTY_FORM);
    setSelected(null);
    setModalMode('add');
  };

  const openEdit = (client) => {
    setFormData({
      name:               client.name              || "",
      contact:            client.contact           || "",
      email:              client.email             || "",
      address:            client.address           || "",
      city:               client.city              || "",
      state:              client.state             || "",
      pincode:            client.pincode           || "",
      aadhar_card_number: client.aadhar_card_number || "",
      pan_card_number:    client.pan_card_number    || "",
      referred_by:        client.referred_by       || "",
      dob:                client.dob ? client.dob.split('T')[0] : "",
    });
    setSelected(client);
    setModalMode('edit');
  };

  const closeModal = () => { setModalMode(null); setSelected(null); };

  const handleChange = (e) =>
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // â”€â”€ CRUD â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res  = await api.post('/customers', { ...formData, added_by: user.id || null }, getAuthHeaders());
      if (res.data.success) {
        showToast("Client added successfully");
        closeModal();
        fetchClients();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to add client", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.put(`/customers/${selectedClient.id}`, formData, getAuthHeaders());
      if (res.data.success) {
        showToast("Client updated successfully");
        closeModal();
        fetchClients();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update client", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (client) => {
    if (!window.confirm(`Delete client "${client.name}"? This cannot be undone.`)) return;
    try {
      const res = await api.delete(`/customers/${client.id}`, getAuthHeaders());
      if (res.data.success) {
        showToast("Client deleted");
        fetchClients();
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete client", "error");
    }
  };

  const filteredClients = clients.filter(c =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.contact?.includes(searchTerm) ||
    c.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-[0.875rem] font-bold
          ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-[#10b981] text-white'}`}>
          {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-10">
        <div className="hidden sm:flex items-center gap-[0.5rem] text-[0.7rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Clients</span>
        </div>
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <button onClick={fetchClients}
            className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all text-slate-500">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.75rem]">E</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto">

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[1rem] mb-[1.5rem]">
          <div>
            <h1 className="text-[1.5rem] font-bold text-slate-900">Clients</h1>
            <p className="text-[0.875rem] text-slate-400 font-medium mt-0.5">
              {clients.length} total clients in the system
            </p>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-[1.25rem] py-[0.625rem] rounded-lg text-[0.875rem] font-bold shadow-sm transition-all active:scale-95">
            <Plus size={18} /> Add New Client
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-5">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, phone or ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-[#10b981] transition-all"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h2 className="font-bold text-slate-900">Client Registry</h2>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[0.75rem] font-black">
              {filteredClients.length} records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 border-b border-slate-100 text-[0.6875rem] uppercase tracking-wider font-extrabold text-slate-400">
                <tr>
                  <th className="px-6 py-4 text-center w-12">#</th>
                  <th className="px-6 py-4">Client ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Added On</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[0.8125rem] divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-2 border-[#10b981] border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 font-medium text-[0.8125rem]">Loading clients...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-slate-300">
                        <AlertCircle size={40} strokeWidth={1.5} />
                        <p className="text-[0.8125rem] font-bold text-slate-400">
                          {searchTerm ? "No clients match your search" : "No clients found. Add your first client!"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredClients.map((client, idx) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-300">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-[0.75rem] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100">
                        {client.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-black text-[0.875rem] shrink-0">
                          {client.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{client.name}</p>
                          <p className="text-[0.6875rem] text-slate-400 font-medium">{client.email || '"”'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{client.contact}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {[client.city, client.state].filter(Boolean).join(', ') || '"”'}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-[0.75rem]">
                      {client.created_at
                        ? new Date(client.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })
                        : '"”'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/emp/clients/${client.id}`)}
                          className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-100"
                          title="View full profile">
                          <Eye size={16} />
                        </button>
                        <button onClick={() => openEdit(client)}
                          className="p-2 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all border border-transparent hover:border-amber-100"
                          title="Edit client">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(client)}
                          className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100"
                          title="Delete client">
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

      {/* â•â• ADD / EDIT MODAL â•â• */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col border border-slate-100">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-[1.125rem] font-bold text-slate-900">
                {modalMode === 'add' ? 'Add New Client' : `Edit: ${selectedClient?.name}`}
              </h3>
              <button onClick={closeModal} className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all">
                <X size={20} />
              </button>
            </div>
            <ClientForm
              formData={formData}
              onChange={handleChange}
              onSubmit={modalMode === 'add' ? handleAdd : handleUpdate}
              onCancel={closeModal}
              mode={modalMode}
              saving={saving}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
