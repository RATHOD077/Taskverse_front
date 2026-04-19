import React, { useState } from "react";
import {
  Plus, Search, Edit2, Trash2, Hash,
  User, FileText, Link, CheckCircle, Shield, Archive
} from "lucide-react";

const CustomerDocument = () => {
  const [data, setData] = useState([
    { id: 1, cust_id: 101, doc_id: 301, doc_path: "/docs/aadhar_101.pdf", validation: "Verified",   doc_type: "confidential", physical_file_id: 501 },
    { id: 2, cust_id: 101, doc_id: 302, doc_path: "/docs/pan_101.pdf",    validation: "Pending",    doc_type: "general",      physical_file_id: null },
    { id: 3, cust_id: 102, doc_id: 303, doc_path: "/docs/aadhar_102.pdf", validation: "Rejected",   doc_type: "confidential", physical_file_id: 502 },
  ]);

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const emptyForm = { cust_id: "", doc_id: "", doc_path: "", validation: "Pending", doc_type: "general", physical_file_id: "" };
  const [form, setForm] = useState(emptyForm);

  const filtered = data.filter(d =>
    String(d.cust_id).includes(search) ||
    String(d.doc_id).includes(search) ||
    d.doc_path.toLowerCase().includes(search.toLowerCase()) ||
    d.doc_type.toLowerCase().includes(search.toLowerCase()) ||
    d.validation.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => { setEditingItem(null); setForm(emptyForm); setIsModalOpen(true); };
  const openEdit = (item) => { setEditingItem(item); setForm({ ...item }); setIsModalOpen(true); };

  const saveItem = () => {
    if (editingItem) {
      setData(data.map(d => d.id === editingItem.id ? { ...form, id: d.id } : d));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
      setData([...data, { ...form, id: newId }]);
    }
    setIsModalOpen(false);
  };

  const deleteItem = (id) => { if (true) setData(data.filter(d => d.id !== id)); };

  const validationStyle = (v) => ({
    "Verified": "bg-emerald-100 text-emerald-700",
    "Pending":  "bg-amber-100 text-amber-700",
    "Rejected": "bg-rose-100 text-rose-700",
  }[v] || "bg-slate-100 text-slate-500");

  const docTypeStyle = (t) =>
    t === "confidential"
      ? "bg-violet-100 text-violet-700"
      : "bg-sky-100 text-sky-700";

  const inputCls = "w-full h-12 px-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-sky-500 focus:bg-white transition-all outline-none font-semibold text-slate-900 text-[0.95rem]";
  const labelCls = "text-[0.65rem] font-black uppercase tracking-[0.18em] text-sky-600 px-1";

  const cols = [
    [<Hash size={14} />, "ID"],
    [<User size={14} />, "Cust ID"],
    [<FileText size={14} />, "Doc ID"],
    [<Link size={14} />, "Doc Path"],
    [<CheckCircle size={14} />, "Validation"],
    [<Shield size={14} />, "Doc Type"],
    [<Archive size={14} />, "Physical File ID"],
    [null, "Control"],
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <main className="flex-1 p-10 overflow-x-hidden text-slate-900">
        <div className="max-w-[1300px] mx-auto space-y-10">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-sky-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-sky-500/30">
                <FileText size={32} />
              </div>
              <div>
                <h1 className="text-[2.2rem] font-black tracking-tight text-slate-900 leading-none">Customer Documents</h1>
                <p className="text-slate-400 text-[0.95rem] mt-1 font-medium">Manage documents linked to customer records.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-sky-600 transition-colors" size={18} />
                <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="pl-12 pr-5 py-3.5 bg-slate-50 border-2 border-transparent focus:border-sky-600 focus:bg-white rounded-2xl text-[0.9rem] outline-none transition-all w-[240px] font-semibold" />
              </div>
              <button onClick={openAdd} className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-black transition-all shadow-xl hover:-translate-y-0.5">
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> Add Document
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            {[
              { label: "Total Docs",          value: data.length,                                        bg: "bg-sky-50",     text: "text-sky-700" },
              { label: "Verified",            value: data.filter(d => d.validation === "Verified").length, bg: "bg-emerald-50", text: "text-emerald-700" },
              { label: "Pending / Rejected",  value: data.filter(d => d.validation !== "Verified").length, bg: "bg-rose-50",    text: "text-rose-700" },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-3xl p-6 border border-slate-100`}>
                <p className="text-slate-400 text-[0.72rem] font-black uppercase tracking-widest mb-2">{s.label}</p>
                <p className={`text-[2.4rem] font-black ${s.text}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50/60 border-b border-slate-100">
                    {cols.map(([icon, label], i) => (
                      <th key={i} className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col gap-0.5 text-slate-400">
                          {icon}
                          <span className="text-[0.58rem] font-black uppercase tracking-widest">{label}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-16 text-slate-300 font-bold text-lg">No document records found.</td></tr>
                  )}
                  {filtered.map(item => (
                    <tr key={item.id} className="hover:bg-sky-50/20 transition-all group">
                      <td className="px-6 py-4"><span className="text-slate-300 font-black font-mono text-[0.8rem]">#{item.id}</span></td>
                      <td className="px-6 py-4"><span className="font-mono font-bold text-slate-700 text-[0.88rem]">{item.cust_id}</span></td>
                      <td className="px-6 py-4"><span className="font-mono font-bold text-slate-700 text-[0.88rem]">{item.doc_id}</span></td>
                      <td className="px-6 py-4 max-w-[200px]">
                        <span className="text-slate-500 text-[0.78rem] font-mono truncate block" title={item.doc_path}>{item.doc_path}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-[0.7rem] font-black uppercase ${validationStyle(item.validation)}`}>
                          {item.validation}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-[0.7rem] font-black uppercase tracking-wide ${docTypeStyle(item.doc_type)}`}>
                          {item.doc_type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-slate-500 text-[0.82rem]">{item.physical_file_id ?? ""}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(item)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-white hover:text-sky-600 hover:shadow-lg rounded-xl transition-all">
                            <Edit2 size={15} />
                          </button>
                          <button onClick={() => deleteItem(item.id)} className="w-9 h-9 flex items-center justify-center bg-slate-50 text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-lg rounded-xl transition-all">
                            <Trash2 size={15} />
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
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[6px] flex items-center justify-center z-[100] p-6">
          <div className="bg-white rounded-[3rem] w-full max-w-[44rem] shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-br from-slate-50 to-white px-10 py-8 border-b border-slate-100 relative flex-shrink-0">
              <button onClick={() => setIsModalOpen(false)} className="absolute right-8 top-8 w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-100 hover:bg-slate-200 transition-all text-slate-500">
                <Plus className="rotate-45" size={22} />
              </button>
              <div className="w-14 h-14 bg-sky-600 rounded-3xl shadow-xl shadow-sky-200 flex items-center justify-center mb-4">
                <FileText className="text-white" size={28} />
              </div>
              <h2 className="text-[1.8rem] font-black text-slate-900 leading-none tracking-tight">
                {editingItem ? "Edit Document" : "Add Document"}
              </h2>
            </div>
            <form className="p-10 overflow-y-auto space-y-5" onSubmit={e => { e.preventDefault(); saveItem(); }}>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1">
                  <label className={labelCls}>Customer ID</label>
                  <input type="number" value={form.cust_id} onChange={e => setForm({ ...form, cust_id: e.target.value })} className={inputCls} placeholder="e.g. 101" required />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Document ID</label>
                  <input type="number" value={form.doc_id} onChange={e => setForm({ ...form, doc_id: e.target.value })} className={inputCls} placeholder="e.g. 301" required />
                </div>
                <div className="col-span-2 space-y-1">
                  <label className={labelCls}>Document Path</label>
                  <input type="text" value={form.doc_path} onChange={e => setForm({ ...form, doc_path: e.target.value })} className={inputCls} placeholder="/docs/filename.pdf" />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Validation</label>
                  <select value={form.validation} onChange={e => setForm({ ...form, validation: e.target.value })} className={inputCls}>
                    <option>Pending</option>
                    <option>Verified</option>
                    <option>Rejected</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Doc Type</label>
                  <select value={form.doc_type} onChange={e => setForm({ ...form, doc_type: e.target.value })} className={inputCls}>
                    <option value="general">General</option>
                    <option value="confidential">Confidential</option>
                  </select>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className={labelCls}>Physical File ID (optional)</label>
                  <input type="number" value={form.physical_file_id} onChange={e => setForm({ ...form, physical_file_id: e.target.value })} className={inputCls} placeholder="Leave blank if none" />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 h-14 bg-slate-100 hover:bg-slate-200 text-slate-500 font-black rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="flex-[2] h-14 bg-sky-600 hover:bg-sky-700 text-white font-black rounded-2xl shadow-xl shadow-sky-400/30 transition-all hover:-translate-y-0.5">
                  {editingItem ? "Save Changes" : "Add Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDocument;
