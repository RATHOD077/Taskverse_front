// src/pages/Admin/Users/User.jsx
import { useEffect, useState } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Filter, 
  MoreHorizontal, ChevronRight, X, Eye, EyeOff 
} from "lucide-react";
import api from '../../../api/api';

const STATUS_OPTIONS = ['active', 'inactive', 'pending'];
const FIXED_ROLES = [
  { id: 1, name: 'Employee' },
  { id: 2, name: 'Customer' },
  { id: 3, name: 'Receptionist' },
];

const BLANK_FORM = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  contact: '',
  dob: '',
  role_id: '',
  status: 'active'
};

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState(BLANK_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/users');
      setUsers(res.data.users || []);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const openCreate = () => {
    setEditUser(null);
    setForm(BLANK_FORM);
    setError('');
    setShowModal(true);
  };

  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      username: u.username || '',
      email: u.email || '',
      password: '',
      confirmPassword: '',
      contact: u.contact || '',
      dob: u.dob ? u.dob.split('T')[0] : '',
      role_id: u.role_id || '',
      status: u.status || 'active'
    });
    setError('');
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editUser) { await api.put(`/users/${editUser.id}`, form); }
      else { await api.post('/users', form); }
      setShowModal(false);
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save user');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filtered = users.filter(u =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      
      {/* --- BREADCRUMB --- */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[2rem] sticky top-0 z-10">
        <div className="flex items-center gap-2 text-[0.6875rem] text-slate-400 font-medium">
           <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
           <ChevronRight size={12} className="shrink-0" />
           <span>Dashboard</span>
           <ChevronRight size={12} className="shrink-0" />
           <span className="text-slate-900 font-bold">Members</span>
        </div>
      </header>

      <div className="p-[2rem] max-w-[100rem] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Members</h2>
          <button 
            onClick={openCreate}
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add User
          </button>
        </div>

        {/* --- SEARCH & FILTERS --- */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-1 min-w-[18.75rem]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                value={search}
                onChange={e => setSearch(e.target.value)}
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

        {/* --- TABLE --- */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[50rem]">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr className="text-[0.6875rem] uppercase tracking-wider font-bold text-slate-400">
                  <th className="px-6 py-4 w-12 text-center">#</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[0.84375rem] divide-y divide-slate-100">
                {filtered.map((u, idx) => (
                  <tr key={u.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs uppercase">
                          {u.username?.[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{u.username}</div>
                          <div className="text-[0.75rem] text-slate-400 font-medium">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-[0.7rem] font-bold border border-blue-100 uppercase tracking-wide">
                        {u.role_name || 'Member'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-md text-[0.7rem] font-bold border uppercase ${
                        u.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-4">
                        <Edit2 size={17} className="text-orange-400 cursor-pointer hover:scale-110 transition-transform" onClick={() => openEdit(u)} />
                        <Trash2 size={18} className="text-rose-500 cursor-pointer hover:scale-110 transition-transform" onClick={() => handleDelete(u.id, u.username)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editUser ? 'Edit Member' : 'Add New Member'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-900 transition-colors p-1 hover:bg-slate-50 rounded-lg">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Username <span className="text-red-500">*</span></label>
                  <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500/10" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Email <span className="text-red-500">*</span></label>
                  <input type="email" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500/10" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Contact</label>
                  <input type="text" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500/10" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Date of Birth</label>
                  <input type="date" className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500/10" value={form.dob} onChange={e => setForm({...form, dob: e.target.value})} />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Password {!editUser && <span className="text-red-500">*</span>}</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm focus:ring-2 focus:ring-emerald-500/10" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required={!editUser} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Role</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm cursor-pointer" value={form.role_id} onChange={e => setForm({...form, role_id: e.target.value})} required>
                    <option value="">Select Role</option>
                    {FIXED_ROLES.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-slate-700">Status</label>
                  <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg outline-none text-sm cursor-pointer" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-50">
                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-8 py-2 bg-[#10b981] hover:bg-[#0da975] text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95">
                  {saving ? 'Processing...' : (editUser ? 'Update' : 'Save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
