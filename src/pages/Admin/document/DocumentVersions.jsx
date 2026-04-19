import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  History, Plus, ArrowLeft, Download, Trash2, 
  Search, FileText, ChevronRight, MoreHorizontal, 
  Globe, UploadCloud, X, Filter 
} from "lucide-react";
import api from "../../../api/api";
import MediaLibraryModal from "../../../components/MediaLibraryModal";

const DocumentVersions = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const docId = searchParams.get("docId");

  if (!docId) {
    return (
      <div className="flex-1 min-h-screen bg-[#fcfcfc] flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">No Document Selected</h2>
          <p className="text-slate-500 mb-6 text-sm">Please navigate to this page from the Documents list by clicking the Version History icon.</p>
          <button 
            onClick={() => navigate('/admin/documents')}
            className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition"
          >
            Go to Documents
          </button>
        </div>
      </div>
    );
  }

  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const [form, setForm] = useState({
    version_label: "",
    notes: "",
    file_path: ""
  });
  const [fileName, setFileName] = useState("");

  const fetchVersions = useCallback(async () => {
    if (!docId) return;
    setLoading(true);
    try {
      const res = await api.get(`/document-versions/${docId}`);
      setVersions(res.data.versions || []);
    } catch {
      console.error("Failed to fetch versions");
    } finally {
      setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    fetchVersions();
  }, [fetchVersions]);

  const handleMediaSelect = (doc) => {
    setForm({ ...form, file_path: doc.path });
    setFileName(doc.name);
    setIsMediaModalOpen(false);
  };

  const handleCreateVersion = async (e) => {
    e.preventDefault();
    if (!form.file_path || !form.version_label) {
      alert("Version Label and File are required!");
      return;
    }

    try {
      await api.post("/document-versions", {
        ...form,
        customer_doc_id: docId
      });
      setIsModalOpen(false);
      setForm({ version_label: "", notes: "", file_path: "" });
      setFileName("");
      fetchVersions();
    } catch {
      alert("Failed to add version");
    }
  };

  const handleDeleteVersion = async (id) => {
    if (!window.confirm("Are you sure you want to delete this version?")) return;
    try {
      await api.delete(`/document-versions/${id}`);
      fetchVersions();
    } catch {
      alert("Failed to delete version");
    }
  };

  const filteredVersions = versions.filter(v => 
    v.version_label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (v.notes && v.notes.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      
      {/* Header - Consistent with standard pages */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-1 rounded" />
          <ChevronRight size={14} />
          <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate('/admin/documents')}>Documents</span>
          <ChevronRight size={14} />
          <span className="text-slate-900 font-bold">Version History</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-1.5 border border-slate-200 rounded-lg text-sm font-medium bg-white">
            <Globe size={14} className="text-blue-500" /> English
          </button>
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold">C</div>
        </div>
      </header>

      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        
        {/* Page Title & Back */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => navigate(-1)}
               className="p-2 text-slate-400 hover:text-slate-900 transition-colors"
             >
               <ArrowLeft size={24} />
             </button>
             <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
               <History className="text-emerald-500" size={24} /> Version History
             </h2>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <Plus size={18} /> New Version
          </button>
        </div>

        {/* Search & Filter - Standard Styling */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search version history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
          </div>
          <button className="px-6 py-3 border border-slate-200 rounded-xl text-sm font-semibold flex items-center gap-2 hover:bg-slate-50">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Main Content - Standard Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center p-20 text-slate-400">Loading version data...</div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-xs uppercase tracking-widest font-semibold text-slate-500">
                  <th className="px-6 py-4 text-center w-12">#</th>
                  <th className="px-6 py-4">Version Label</th>
                  <th className="px-6 py-4">File Name</th>
                  <th className="px-6 py-4">Uploaded Date</th>
                  <th className="px-6 py-4">Uploaded By</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredVersions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">No versions found for this document.</td>
                  </tr>
                ) : (
                  filteredVersions.map((ver, idx) => (
                    <tr key={ver.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-center font-medium text-slate-400">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900 bg-blue-50 text-blue-600 px-3 py-1 rounded-lg border border-blue-100 text-xs">
                          {ver.version_label}
                        </span>
                        {ver.notes && <p className="text-xs text-slate-400 mt-1">{ver.notes}</p>}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        <div className="flex items-center gap-2">
                           <FileText size={16} className="text-slate-400" />
                           {ver.file_path.split('/').pop()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-medium">
                        {new Date(ver.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                         {ver.uploader_name || 'System'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-4">
                          <a 
                            href={`${api.defaults.baseURL.replace('/api', '')}/${ver.file_path}`} 
                            download 
                            className="text-emerald-500 hover:text-emerald-600"
                            title="Download Version"
                          >
                            <Download size={18} />
                          </a>
                          <Trash2 
                            size={18} 
                            className="text-rose-500 cursor-pointer hover:text-rose-600" 
                            onClick={() => handleDeleteVersion(ver.id)} 
                            title="Delete Record"
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal - Consistent with Documents.jsx UI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-900">Add New Version</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X size={22} />
              </button>
            </div>

            <form onSubmit={handleCreateVersion} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Version Label *</label>
                <input 
                  type="text" 
                  value={form.version_label} 
                  onChange={(e) => setForm({...form, version_label: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  placeholder="e.g. v2.0 - Final"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">Notes (Optional)</label>
                <textarea 
                  value={form.notes} 
                  onChange={(e) => setForm({...form, notes: e.target.value})}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-h-[100px]"
                  placeholder="What changed in this version?"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-600">File *</label>
                <div 
                  onClick={() => setIsMediaModalOpen(true)}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/20 rounded-2xl p-8 cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-all mb-3">
                    <UploadCloud size={24} />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-slate-700">{fileName || "Select from Media Library"}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Browse archives or upload new version</p>
                  </div>
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
                  className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl"
                >
                  Save Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaLibraryModal isOpen={isMediaModalOpen} onClose={() => setIsMediaModalOpen(false)} onSelect={handleMediaSelect} />
    </div>
  );
};

export default DocumentVersions;


