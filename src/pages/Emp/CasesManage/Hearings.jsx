import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, Search, Filter, Eye, Edit2, Trash2,
  ChevronRight, Globe, ChevronsUpDown, MoreHorizontal,
  X, ChevronDown, Calendar, Clock, Loader2, AlertCircle, RefreshCw
} from "lucide-react";
import api from "../../../api/api";

// â”€â”€â”€ badge helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const STATUS_COLORS = {
  'Scheduled':   'bg-blue-50 text-blue-600 border-blue-200',
  'In Progress': 'bg-yellow-50 text-yellow-700 border-yellow-200',
  'Completed':   'bg-green-50 text-green-600 border-green-200',
  'Cancelled':   'bg-red-50 text-red-500 border-red-200',
  'Postponed':   'bg-slate-100 text-slate-500 border-slate-200',
};

const EMPTY_FORM = {
  title: '', case_id: '', court: '', judge: '',
  hearing_date: '', hearing_time: '', duration_minutes: '', status: 'Scheduled', notes: ''
};

export default function Hearings() {
  const [hearings, setHearings]         = useState([]);
  const [cases, setCases]               = useState([]);      // for case dropdown
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchTerm, setSearchTerm]     = useState('');
  const [perPage, setPerPage]           = useState(10);
  const [currentPage, setCurrentPage]   = useState(1);
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editItem, setEditItem]         = useState(null);
  const [form, setForm]                 = useState(EMPTY_FORM);
  const [saving, setSaving]             = useState(false);

  // â”€â”€ fetch hearings â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchHearings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (searchTerm) params.search = searchTerm;
      const res = await api.get('/hearings', { params });
      if (res.data.success) {
        setHearings(res.data.hearings || []);
      } else {
        setError('Failed to load hearings.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to connect to server.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // â”€â”€ fetch cases for dropdown â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchCases = async () => {
    try {
      const res = await api.get('/cases');
      if (res.data.success) setCases(res.data.cases || []);
    } catch (err) {
      console.error('Failed to load cases in dropdown:', err);
    }
  };

  useEffect(() => { fetchHearings(); }, [fetchHearings]);
  useEffect(() => { fetchCases(); }, []);

  // â”€â”€ pagination â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const totalPages = Math.max(1, Math.ceil(hearings.length / perPage));
  const paginated  = hearings.slice((currentPage - 1) * perPage, currentPage * perPage);

  // â”€â”€ modal helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    setIsModalOpen(true);
  };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      title:            item.title || '',
      case_id:          item.case_db_id || '',
      court:            item.court || '',
      judge:            item.judge || '',
      hearing_date:     item.hearing_date || '',
      hearing_time:     item.hearing_time ? item.hearing_time.substring(0, 5) : '',
      duration_minutes: item.duration_minutes ?? '',
      status:           item.status || 'Scheduled',
      notes:            item.notes || '',
    });
    setIsModalOpen(true);
  };

  // â”€â”€ save â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        duration_minutes: form.duration_minutes ? Number(form.duration_minutes) : null,
      };
      if (editItem) {
        await api.put(`/hearings/${editItem.id}`, payload);
      } else {
        await api.post('/hearings', payload);
      }
      setIsModalOpen(false);
      fetchHearings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save hearing.');
    } finally {
      setSaving(false);
    }
  };

  // â”€â”€ delete â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this hearing?')) return;
    try {
      await api.delete(`/hearings/${id}`);
      fetchHearings();
    } catch {
      alert('Failed to delete hearing.');
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans relative">

      {/* BREADCRUMB HEADER */}
      <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
        <div className="flex items-center gap-1 md:gap-2 text-[0.6875rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span>Dashboard</span>
          <ChevronRight size={12} className="shrink-0" />
          <span>Case Management</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-900 font-bold">Hearings</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 transition-all">
            <Globe size={14} className="text-blue-500" /> English
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4 h-2.5" />
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[100rem] mx-auto overflow-x-hidden">

        {/* PAGE TITLE + SCHEDULE BUTTON */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Hearings</h2>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Schedule Hearing
          </button>
        </div>

        {/* SEARCH & FILTERS */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 flex-1 min-w-[18.75rem]">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search by title, hearing ID, judge..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/10"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                onKeyDown={(e) => e.key === 'Enter' && fetchHearings()}
              />
            </div>
            <button
              onClick={fetchHearings}
              className="bg-[#10b981] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0da975] transition-all"
            >
              <Search size={15} /> Search
            </button>
            <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600">
              <Filter size={15} /> Filters
            </button>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium w-full sm:w-auto justify-between sm:justify-start mt-2 sm:mt-0">
            <div className="flex items-center gap-2">
              <span>Per Page:</span>
              <div className="relative">
                <select
                  className="border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none text-slate-600 cursor-pointer appearance-none pr-7 text-sm"
                  value={perPage}
                  onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <button onClick={fetchHearings} className="p-2 hover:bg-slate-50 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 transition-all" title="Refresh">
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 size={22} className="animate-spin text-[#10b981]" />
              <span className="text-sm font-medium">Loading hearings...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
              <AlertCircle size={28} />
              <p className="text-sm font-semibold">{error}</p>
              <button onClick={fetchHearings} className="text-xs text-[#10b981] font-bold hover:underline flex items-center gap-1">
                <RefreshCw size={12} /> Retry
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                  <tr className="text-[0.6875rem] uppercase tracking-wider font-bold text-slate-400">
                    <th className="px-6 py-4 w-10">#</th>
                    <th className="px-4 py-4 whitespace-nowrap">Hearing ID <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
                    <th className="px-4 py-4 whitespace-nowrap">Title <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
                    <th className="px-4 py-4">Case</th>
                    <th className="px-4 py-4">Court</th>
                    <th className="px-4 py-4">Judge</th>
                    <th className="px-4 py-4 whitespace-nowrap">Date &amp; Time <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
                    <th className="px-4 py-4">Status</th>
                    <th className="px-4 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {paginated.length === 0 ? (
                    <tr><td colSpan={9} className="px-6 py-16 text-center text-slate-400 text-sm">No hearings found. Click <strong>Schedule Hearing</strong> to add one.</td></tr>
                  ) : paginated.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-6 py-4 font-bold text-[#10b981] text-sm">{(currentPage - 1) * perPage + idx + 1}</td>
                      <td className="px-4 py-4 font-semibold text-slate-700 text-sm whitespace-nowrap">{item.hearing_id}</td>
                      <td className="px-4 py-4 font-bold text-slate-900 text-sm">{item.title}</td>
                      <td className="px-4 py-4 text-sm max-w-[10rem]">
                        {item.case_ref && (
                          <span className="text-slate-400 text-xs font-medium">{item.case_ref} - </span>
                        )}
                        <span className="text-[#10b981] font-semibold">{item.case_title || '-'}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-600 text-sm">{item.court || '-'}</td>
                      <td className="px-4 py-4 text-[#10b981] font-semibold text-sm whitespace-nowrap">{item.judge || '-'}</td>
                      <td className="px-4 py-4">
                        {item.hearing_date ? (
                          <div className="flex flex-col gap-0.5">
                            <div className="flex items-center gap-1 text-slate-700 text-xs font-semibold">
                              <Calendar size={11} className="text-slate-400 shrink-0" />
                              {item.hearing_date}
                            </div>
                            <div className="flex items-center gap-1 text-slate-500 text-xs">
                              <Clock size={11} className="text-slate-400 shrink-0" />
                              {item.hearing_time ? item.hearing_time.substring(0, 5) : '-'}
                              {item.duration_minutes && ` (${item.duration_minutes}min)`}
                            </div>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold border whitespace-nowrap ${STATUS_COLORS[item.status] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <Eye size={17} className="text-blue-400 cursor-pointer hover:scale-110 transition-transform" title="View" />
                          <Edit2 size={16} className="text-orange-400 cursor-pointer hover:scale-110 transition-transform" title="Edit" onClick={() => openEdit(item)} />
                          <Trash2 size={16} className="text-red-400 cursor-pointer hover:scale-110 transition-transform" title="Delete" onClick={() => handleDelete(item.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* PAGINATION */}
          {!loading && !error && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <span className="text-sm text-slate-500">
                Showing {hearings.length === 0 ? 0 : (currentPage - 1) * perPage + 1} to{' '}
                {Math.min(currentPage * perPage, hearings.length)} of {hearings.length} hearings
              </span>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="px-4 py-1.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 7).map(page => (
                  <button key={page} onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 text-sm font-bold rounded-lg transition-all ${page === currentPage ? 'bg-[#10b981] text-white shadow-sm' : 'text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                    {page}
                  </button>
                ))}
                <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="px-4 py-1.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">Next</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SCHEDULE / EDIT HEARING MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{editItem ? 'Edit Hearing' : 'Schedule Hearing'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900 p-1 hover:bg-slate-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <Field label="Hearing Title" required>
                <input type="text" className={INPUT} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="e.g. Final Arguments" />
              </Field>
              <Field label="Case Reference" required>
                <SelectWrap value={String(form.case_id)} onChange={v => setForm({ ...form, case_id: v })}>
                  <option value="">Select a case</option>
                  {cases.map(c => (
                    <option key={c.id} value={String(c.id)}>{c.case_id} - {c.title}</option>
                  ))}
                </SelectWrap>
              </Field>
              <Field label="Court">
                <input type="text" className={INPUT} value={form.court} onChange={e => setForm({ ...form, court: e.target.value })} placeholder="e.g. Commercial Court Plaza #1" />
              </Field>
              <Field label="Judge">
                <input type="text" className={INPUT} value={form.judge} onChange={e => setForm({ ...form, judge: e.target.value })} placeholder="e.g. Hon. Robert Johnson" />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Date">
                  <input type="date" className={INPUT} value={form.hearing_date} onChange={e => setForm({ ...form, hearing_date: e.target.value })} />
                </Field>
                <Field label="Time">
                  <input type="time" className={INPUT} value={form.hearing_time} onChange={e => setForm({ ...form, hearing_time: e.target.value })} />
                </Field>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Duration (minutes)">
                  <input type="number" className={INPUT} value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} placeholder="e.g. 60" min={1} />
                </Field>
                <Field label="Status">
                  <SelectWrap value={form.status} onChange={v => setForm({ ...form, status: v })}>
                    <option>Scheduled</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                    <option>Postponed</option>
                  </SelectWrap>
                </Field>
              </div>
              <Field label="Notes">
                <textarea rows={3} className={`${INPUT} resize-none`} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Optional hearing notes..." />
              </Field>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="px-8 py-2.5 bg-[#10b981] hover:bg-[#0da975] text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70">
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {editItem ? 'Update Hearing' : 'Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// â”€â”€â”€ helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const INPUT = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg outline-none focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm";

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold text-slate-700">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      {children}
    </div>
  );
}

function SelectWrap({ value, onChange, children }) {
  return (
    <div className="relative">
      <select className={`${INPUT} appearance-none cursor-pointer pr-8`} value={value} onChange={e => onChange(e.target.value)}>
        {children}
      </select>
      <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
    </div>
  );
}
