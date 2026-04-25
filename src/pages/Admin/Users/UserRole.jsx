import { useEffect, useState } from 'react';
import api from '../../../api/api';
import { 
  Plus, Search, Eye, Edit2, Trash2, 
  ChevronRight, Globe, MoreHorizontal, ChevronsUpDown, X, ShieldCheck, Save
} from 'lucide-react';
import PaginationControls from '../../../components/PaginationControls';

export default function UserRole() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);        // Add/Edit Modal
  const [showViewModal, setShowViewModal] = useState(false); // Simple View Modal (if needed)
  const [selectedRole, setSelectedRole] = useState(null);

  const [editRole, setEditRole] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });

  // Permissions Management Modal
  const [showPerms, setShowPerms] = useState(false);
  const [permRole, setPermRole] = useState(null);
  const [permCatalog, setPermCatalog] = useState([]);
  const [permSelected, setPermSelected] = useState(new Set());
  const [permLoading, setPermLoading] = useState(false);
  const [permSaving, setPermSaving] = useState(false);
  const [permSearch, setPermSearch] = useState('');

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const res = await api.get('/roles', { params: { page, limit: 10 } });
      setRoles(res.data.roles || []);
      setPagination(res.data.pagination || { page: 1, limit: 10, total: (res.data.roles || []).length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, [page]);

  // Open Advanced Permissions Modal
  const openPermissions = async (role) => {
    setShowPerms(true);
    setPermRole(role);
    setPermSearch('');
    setPermLoading(true);

    try {
      const [catalogRes, roleRes] = await Promise.all([
        api.get('/roles/permissions/catalog'),
        api.get(`/roles/${role.id}/permissions`)
      ]);
      setPermCatalog(catalogRes.data.modules || []);
      setPermSelected(new Set(roleRes.data.permissions || []));
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to load permissions');
      setShowPerms(false);
      setPermRole(null);
    } finally {
      setPermLoading(false);
    }
  };

  const closePermissions = () => {
    setShowPerms(false);
    setPermRole(null);
    setPermCatalog([]);
    setPermSelected(new Set());
    setPermSearch('');
    setPermLoading(false);
    setPermSaving(false);
  };

  const togglePerm = (key) => {
    setPermSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const selectAll = () => {
    const all = new Set();
    permCatalog.forEach(m => (m.permissions || []).forEach(p => all.add(p)));
    setPermSelected(all);
  };

  const clearAll = () => setPermSelected(new Set());

  const selectModule = (moduleName) => {
    const mod = permCatalog.find(m => m.module === moduleName);
    if (!mod) return;
    setPermSelected(prev => {
      const next = new Set(prev);
      (mod.permissions || []).forEach(p => next.add(p));
      return next;
    });
  };

  const clearModule = (moduleName) => {
    const mod = permCatalog.find(m => m.module === moduleName);
    if (!mod) return;
    setPermSelected(prev => {
      const next = new Set(prev);
      (mod.permissions || []).forEach(p => next.delete(p));
      return next;
    });
  };

  const savePermissions = async () => {
    if (!permRole) return;
    setPermSaving(true);
    try {
      await api.put(`/roles/${permRole.id}/permissions`, {
        permissions: Array.from(permSelected)
      });
      alert("Permissions saved successfully!");
      closePermissions();
      fetchRoles(); // Refresh roles list if needed
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to save permissions');
    } finally {
      setPermSaving(false);
    }
  };

  const openCreate = () => {
    setEditRole(null);
    setForm({ name: '', description: '' });
    setError('');
    setShowModal(true);
  };

  const openEdit = (r) => {
    setEditRole(r);
    setForm({ name: r.name, description: r.description || '' });
    setError('');
    setShowModal(true);
  };

  // Simple View Role (optional - you can remove if not needed)
  const openView = (role) => {
    setSelectedRole(role);
    setShowViewModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (editRole) {
        await api.put(`/roles/${editRole.id}`, form);
      } else {
        await api.post('/roles', form);
      }
      setShowModal(false);
      fetchRoles();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete role "${name}"?`)) return;
    try {
      await api.delete(`/roles/${id}`);
      fetchRoles();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete role');
    }
  };

  const filteredRoles = roles.filter(role => 
    role.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium overflow-hidden">
           <MoreHorizontal size={14} className="bg-slate-50 p-0.5 rounded cursor-pointer shrink-0" />
           <ChevronRight size={10} className="shrink-0" />
           <span className="hidden sm:inline">Dashboard</span>
           <ChevronRight size={10} className="hidden sm:inline" />
           <span className="hidden sm:inline">Staff Management</span>
           <ChevronRight size={10} className="sm:hidden" />
           <span className="text-slate-900 font-bold truncate">Roles</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
           <button className="flex items-center gap-2 px-2 md:px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 transition-all">
             <Globe size={14} className="text-blue-500" /> 
             <span className="hidden xs:inline">English</span> 
             <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4 h-2.5" />
           </button>
           <div className="flex items-center gap-2 text-xs font-semibold">
             <span className="text-slate-500 hidden md:inline">Company</span>
             <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold">C</div>
           </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Roles</h2>
          <button 
            onClick={openCreate}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add New Role
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:flex-1">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search roles..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>
            <button 
              onClick={fetchRoles}
              className="w-full sm:w-auto bg-[#10b981] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#0da975]"
            >
              <Search size={16} /> Search
            </button>
          </div>
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span>Per Page:</span>
              <select className="border border-slate-200 rounded px-2 py-1 bg-white outline-none text-slate-600">
                <option>10</option>
                <option>25</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead className="bg-slate-50/50 border-b border-slate-200">
                <tr className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                  <th className="px-6 py-4 text-center w-12">#</th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-slate-600">
                    Name <ChevronsUpDown size={12} className="inline ml-1 opacity-50" />
                  </th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4 whitespace-nowrap cursor-pointer hover:text-slate-600">
                    Created <ChevronsUpDown size={12} className="inline ml-1 opacity-50" />
                  </th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[13.5px] divide-y divide-slate-100">
                {loading ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400 animate-pulse">Loading roles...</td></tr>
                ) : filteredRoles.length === 0 ? (
                  <tr><td colSpan="5" className="p-10 text-center text-slate-400">No roles found.</td></tr>
                ) : filteredRoles.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-center font-bold text-slate-900">{((pagination.page || 1) - 1) * (pagination.limit || 10) + i + 1}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{r.name}</td>
                    <td className="px-6 py-4 text-slate-500 italic max-w-xs truncate">{r.description || '"”'}</td>
                    <td className="px-6 py-4 text-slate-400 font-medium">
                      {r.created_at ? new Date(r.created_at).toISOString().split('T')[0] : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-5">
                        {/* Eye = Open Permissions */}
                        <button
                          onClick={() => openPermissions(r)}
                          className="text-blue-500 hover:text-blue-600 transition-colors"
                          title="Manage Permissions"
                        >
                          <Eye size={18} />
                        </button>

                        {/* Edit Role */}
                        <button
                          onClick={() => openEdit(r)}
                          className="text-orange-400 hover:text-orange-500 transition-colors"
                          title="Edit Role"
                        >
                          <Edit2 size={17} />
                        </button>

                        {/* Delete Role */}
                        <button 
                          onClick={() => handleDelete(r.id, r.name)}
                          className="text-rose-500 hover:text-rose-600 transition-colors"
                          title="Delete Role"
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
          {!search.trim() && (
            <PaginationControls
              page={pagination.page}
              limit={pagination.limit}
              total={pagination.total}
              totalPages={pagination.totalPages}
              hasPrevPage={pagination.hasPrevPage}
              hasNextPage={pagination.hasNextPage}
              onPageChange={setPage}
              label="roles"
            />
          )}
        </div>
      </div>

      {/* Add / Edit Role Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={() => setShowModal(false)}>
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-slate-200 animate-in fade-in zoom-in duration-200" 
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">{editRole ? 'Edit Role' : 'Create New Role'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {error && <div className="p-3 bg-rose-50 text-rose-500 rounded-lg text-xs font-semibold border border-rose-100">{error}</div>}
              
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role Name *</label>
                <input 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  required 
                  placeholder="e.g. Developer" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Description</label>
                <textarea 
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm h-24 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 transition-all resize-none" 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  placeholder="Short description..." 
                />
              </div>
              
              <div className="flex flex-col xs:flex-row gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2.5 border border-slate-200 rounded-lg font-bold text-slate-500 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-[#10b981] text-white rounded-lg font-bold shadow-lg shadow-emerald-100 hover:bg-[#0da975] disabled:opacity-50 transition-all">
                  {saving ? 'Saving...' : editRole ? 'Update Role' : 'Create Role'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Permissions Management Modal */}
      {showPerms && permRole && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" onClick={closePermissions}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl border border-slate-200 overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <ShieldCheck size={20} className="text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Manage Permissions</div>
                  <div className="text-lg font-black text-slate-900 truncate">{permRole.name}</div>
                </div>
              </div>
              <button onClick={closePermissions} className="p-2 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={selectAll} className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold" disabled={permLoading}>
                    Select All
                  </button>
                  <button onClick={clearAll} className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold" disabled={permLoading}>
                    Clear All
                  </button>
                  <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-600">
                    {permSelected.size} selected
                  </div>
                </div>

                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    value={permSearch}
                    onChange={(e) => setPermSearch(e.target.value)}
                    placeholder="Search modules or permissions..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

              {permLoading ? (
                <div className="p-10 text-center text-slate-400">Loading permissions...</div>
              ) : (
                <div className="space-y-4 max-h-[65vh] overflow-auto pr-2">
                  {permCatalog
                    .filter(m => {
                      const q = permSearch.trim().toLowerCase();
                      if (!q) return true;
                      return String(m.module).toLowerCase().includes(q) ||
                             (m.permissions || []).some(p => String(p).toLowerCase().includes(q));
                    })
                    .map((m) => {
                      const perms = m.permissions || [];
                      const selectedCount = perms.filter(p => permSelected.has(p)).length;
                      return (
                        <div key={m.module} className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                          <div className="px-5 py-4 bg-slate-50/60 border-b border-slate-100 flex items-center justify-between">
                            <div className="font-black text-slate-900">{m.module}</div>
                            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                              <span>{selectedCount} of {perms.length} selected</span>
                              <button onClick={() => selectModule(m.module)} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50">Select All</button>
                              <button onClick={() => clearModule(m.module)} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50">Clear</button>
                            </div>
                          </div>
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {perms.map((p) => (
                              <label key={p} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={permSelected.has(p)}
                                  onChange={() => togglePerm(p)}
                                  className="w-4 h-4 accent-emerald-600"
                                />
                                <span className="text-sm font-bold text-slate-700">{p}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={closePermissions} className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm font-bold text-slate-700">
                Cancel
              </button>
              <button 
                onClick={savePermissions}
                disabled={permSaving || permLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-black shadow-lg shadow-emerald-100 disabled:opacity-50 inline-flex items-center gap-2"
              >
                <Save size={16} />
                {permSaving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
