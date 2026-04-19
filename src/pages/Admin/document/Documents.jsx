// src/pages/Documents.jsx
import React, { useState, useEffect } from "react";
import {
  FileText, Plus, Search, Edit2, Trash2,
  ChevronRight, Filter, Eye, Download, X,
  Globe, MoreHorizontal, ArrowLeft, UploadCloud, History
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from '../../../api/api';
import MediaLibraryModal from "../../../components/MediaLibraryModal";

const Documents = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [customers, setCustomers] = useState([]);   // For Customer dropdown
  const [loading, setLoading] = useState(true);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const [form, setForm] = useState({
    customer_id: "",
    document_id: "",
    document_path: "",
    validity: "",
    doc_type: "general",
    physical_file_id: ""
  });

  const [fileName, setFileName] = useState("");

  // Fetch Documents
  const fetchDocuments = async () => {
    try {
      const res = await api.get('/customer-documents');
      setDocuments(res.data.documents || []);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
      setDocuments([]); // Clear on error
    }
  };

  // Fetch Customers for dropdown
  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');   // or '/api/customer' if your route is different
      setCustomers(res.data.customers || []);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setCustomers([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDocuments(), fetchCustomers()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // Open Add Modal
  const openAddModal = () => {
    setEditingDoc(null);
    setForm({
      customer_id: "",
      document_id: "",
      document_path: "",
      validity: "",
      doc_type: "general",
      physical_file_id: ""
    });
    setFileName("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (doc) => {
    setEditingDoc(doc);
    setForm({
      customer_id: doc.customer_id || "",
      document_id: doc.document_id || "",
      document_path: doc.document_path || "",
      validity: doc.validity || "",
      doc_type: doc.doc_type || "general",
      physical_file_id: doc.physical_file_id || ""
    });
    setFileName(doc.document_path ? doc.document_path.split('/').pop() : "");
    setIsModalOpen(true);
  };

  const handleMediaSelect = (doc) => {
    setForm({
      ...form,
      document_path: doc.path,
      document_id: doc.id // Capture the media document ID
    });
    setFileName(doc.name);
    setIsMediaModalOpen(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.customer_id || !form.document_path) {
      alert("Customer and Document Path are required!");
      return;
    }

    try {
      if (editingDoc) {
        await api.put(`/customer-documents/${editingDoc.id}`, form);
      } else {
        await api.post('/customer-documents', form);
      }

      setIsModalOpen(false);
      fetchDocuments(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save document");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      await api.delete(`/customer-documents/${id}`);
      fetchDocuments();
    } catch {
      alert("Failed to delete document");
    }
  };

  const handleViewDetails = (doc) => {
    setSelectedDoc(doc);
    setView("detail");
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-slate-500">Loading documents...</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans relative">

      {/* Header */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-1 rounded" />
          <ChevronRight size={14} />
          <span>Document Management</span>
          <ChevronRight size={14} />
          <span className={view === 'list' ? "text-slate-900 font-bold" : "cursor-pointer hover:text-slate-600"}
            onClick={() => setView('list')}>
            Documents
          </span>
          {view === 'detail' && selectedDoc && (
            <>
              <ChevronRight size={14} />
              <span className="text-slate-900 font-bold truncate max-w-[200px]">{selectedDoc.document_path}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium bg-white">
            <Globe size={14} className="text-blue-500" /> English
          </button>
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold">C</div>
        </div>
      </header>

      <div className="p-6 max-w-[1200px] mx-auto">

        {view === "list" ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Customer Documents</h2>
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
              >
                <Plus size={18} /> Upload Document
              </button>
            </div>

            {/* Search & Filter */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by document path or customer..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
                />
              </div>
              <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-emerald-700">
                <Search size={18} /> Search
              </button>
              <button className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
                <Filter size={18} /> Filters
              </button>
            </div>

            {/* Documents Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-xs uppercase tracking-widest font-semibold text-slate-500">
                    <th className="px-6 py-4 text-center w-12">#</th>
                    <th className="px-6 py-4">Document</th>
                    <th className="px-6 py-4">Customer ID</th>
                    <th className="px-6 py-4">Validity</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {documents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12 text-center text-slate-400">No documents found</td>
                    </tr>
                  ) : (
                    documents.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-center font-medium text-slate-400">{idx + 1}</td>
                        <td className="px-6 py-4 font-medium text-slate-800 max-w-md truncate">
                          <div className="flex items-center gap-3">
                            <FileText size={18} className="text-slate-400 flex-shrink-0" />
                            {item.document_path}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-600">{item.customer_id}</td>
                        <td className="px-6 py-4 text-slate-500">{item.validity || '"”'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${item.doc_type === 'confidential'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                            }`}>
                            {item.doc_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-4">
                            <History
                              size={18}
                              className="text-blue-500 cursor-pointer hover:text-blue-600 transition-transform hover:scale-110"
                              onClick={() => navigate(`/admin/document-versions?docId=${item.id}`)}
                              title="Version History"
                            />
                            <Eye
                              size={18}
                              className="text-blue-500 cursor-pointer hover:text-blue-600"
                              onClick={() => handleViewDetails(item)}
                            />
                            <Download
                              size={18}
                              className="text-emerald-500 cursor-pointer hover:text-emerald-600"
                              onClick={() => alert(`Downloading: ${item.document_path}`)}
                            />
                            <Edit2
                              size={18}
                              className="text-amber-500 cursor-pointer hover:text-amber-600"
                              onClick={() => openEditModal(item)}
                            />
                            <Trash2
                              size={18}
                              className="text-rose-500 cursor-pointer hover:text-rose-600"
                              onClick={() => handleDelete(item.id)}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Detail View */
          <div className="space-y-6">
            <button
              onClick={() => setView("list")}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft size={18} /> Back to Documents
            </button>

            {selectedDoc && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <h2 className="text-2xl font-semibold mb-8 break-all">{selectedDoc.document_path}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
                  <div><span className="font-medium text-slate-500">Customer ID:</span> <span className="font-mono">{selectedDoc.customer_id}</span></div>
                  <div><span className="font-medium text-slate-500">Document ID:</span> {selectedDoc.document_id || '"”'}</div>
                  <div><span className="font-medium text-slate-500">Validity:</span> {selectedDoc.validity || '"”'}</div>
                  <div><span className="font-medium text-slate-500">Type:</span>
                    <span className={`ml-2 px-3 py-0.5 rounded-full text-xs ${selectedDoc.doc_type === 'confidential' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {selectedDoc.doc_type}
                    </span>
                  </div>
                  <div><span className="font-medium text-slate-500">Physical File ID:</span> {selectedDoc.physical_file_id || '"”'}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Compact Upload / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">
                {editingDoc ? "Edit Document" : "Upload New Document"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Customer Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Customer ID *</label>
                <select
                  value={form.customer_id}
                  onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                >
                  <option value="">Select Customer</option>
                  {customers.map((cust) => (
                    <option key={cust.id} value={cust.id}>
                      {cust.id} "” {cust.name || cust.username}
                    </option>
                  ))}
                </select>
              </div>

              {/* Document ID / Reference */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Document ID / Reference *</label>
                <input
                  type="text"
                  value={form.document_id}
                  onChange={(e) => setForm({ ...form, document_id: e.target.value })}
                  placeholder="e.g. DOC-12345"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  required
                />
                <p className="text-[10px] text-slate-400 mt-1 px-1 italic">This can be an internal ID or the Media Library ID.</p>
              </div>

              {/* Document Media Library Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">Document File *</label>
                <div
                  onClick={() => setIsMediaModalOpen(true)}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 rounded-2xl p-8 cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 group-hover:bg-emerald-50 transition-all mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">
                      {fileName || "Select from Media Library"}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1 font-medium">Browse files, folders, or upload new</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Validity Date</label>
                  <input
                    type="date"
                    value={form.validity}
                    onChange={(e) => setForm({ ...form, validity: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Document Type</label>
                  <select
                    value={form.doc_type}
                    onChange={(e) => setForm({ ...form, doc_type: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    <option value="general">General</option>
                    <option value="confidential">Confidential</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm transition-all"
                >
                  {editingDoc ? "Update Document" : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaSelect}
      />
    </div>
  );
};

export default Documents;
