import React, { useState, useRef, useEffect } from "react";
import {
  Plus, Search, Trash2, X, ChevronRight,
  MoreHorizontal, FileText, Download, Film,
  Image as ImageIcon, UploadCloud, FolderOpen,
  Folder, ChevronLeft, ChevronRight as ChevronRightIcon,
  Eye, Edit2, File, Music, Archive, Share2, Copy
} from "lucide-react";
import api from '../../api/api';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import "@cyntler/react-doc-viewer/dist/index.css";

const ITEMS_PER_PAGE = 10;

// â”€â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const typeIcon = (type) => {
  switch (type) {
    case "Image":   return <ImageIcon  size={16} className="text-blue-500" />;
    case "Video":   return <Film       size={16} className="text-purple-500" />;
    case "PDF":     return <FileText   size={16} className="text-rose-500" />;
    case "Audio":   return <Music      size={16} className="text-amber-500" />;
    case "Archive": return <Archive    size={16} className="text-slate-500" />;
    case "Word":    return <FileText   size={16} className="text-indigo-500" />;
    default:        return <File       size={16} className="text-slate-400" />;
  }
};

const typeBadge = {
  Image:   "bg-blue-50 text-blue-600 border-blue-200",
  Video:   "bg-purple-50 text-purple-600 border-purple-200",
  PDF:     "bg-rose-50 text-rose-600 border-rose-200",
  Audio:   "bg-amber-50 text-amber-600 border-amber-200",
  Archive: "bg-slate-100 text-slate-600 border-slate-200",
  Word:    "bg-indigo-50 text-indigo-600 border-indigo-200",
};

// â”€â”€â”€ Pagination Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Pagination = ({ total, page, onPage }) => {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) return null;

  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
      <span className="text-xs text-slate-400 font-medium">
        Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 rounded-lg text-xs font-bold border transition-all ${
              p === page
                ? "bg-[#10b981] text-white border-[#10b981] shadow-sm shadow-emerald-200"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronRightIcon size={15} />
        </button>
      </div>
    </div>
  );
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const EmpMediaLibrary = () => {
  const [folders, setFolders]         = useState([]);
  const [docs, setDocs]               = useState([]);
  const [openFolder, setOpenFolder]   = useState(null); // folder object
  const [folderPage, setFolderPage]   = useState(1);
  const [docPage, setDocPage]         = useState(1);
  const [folderPagination, setFolderPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [docPagination, setDocPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1, hasNextPage: false, hasPrevPage: false });
  const [search, setSearch]           = useState("");

  const [loading, setLoading]         = useState(false);

  // Preview modal (admin-only "show now")
  const [previewDoc, setPreviewDoc] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  // Share modal (expiring link + optional download permission)
  const [shareDoc, setShareDoc] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareExpiresValue, setShareExpiresValue] = useState(7);
  const [shareExpiresUnit, setShareExpiresUnit] = useState("day"); // hour/day/week
  const [shareAllowDownload, setShareAllowDownload] = useState(true);
  const [shareCreating, setShareCreating] = useState(false);
  const [shareLinks, setShareLinks] = useState(null);
  const [shareError, setShareError] = useState("");
  const [copiedLinkKey, setCopiedLinkKey] = useState("");

  // Modals
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showAddDoc, setShowAddDoc]       = useState(false);

  // Add Folder form
  const [newFolderName, setNewFolderName]   = useState("");
  const [newFolderClient, setNewFolderClient] = useState("");
  const [newFolderColor, setNewFolderColor]   = useState("#6366f1");
  const fileInputRef = useRef(null);

  // Add Doc form
  const [newDocName, setNewDocName]     = useState("");
  const [newDocType, setNewDocType]     = useState("PDF");
  const [newDocFile, setNewDocFile]     = useState(null);

  // â”€â”€ Fetch Folders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchFolders = async (targetPage = folderPage) => {
    setLoading(true);
    try {
      const response = await api.get('/media-library/emp-folders', { params: { page: targetPage, limit: 10 } });
      if (response.data.success) {
        setFolders(response.data.folders || []);
        setFolderPagination(response.data.pagination || { page: targetPage, limit: 10, total: (response.data.folders || []).length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
      }
    } catch (error) {
      console.error("Error fetching folders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!openFolder) {
      fetchFolders(folderPage);
    }
  }, [folderPage, openFolder]);

  // â”€â”€ Fetch Documents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchDocuments = async (folderId, targetPage = docPage) => {
    setLoading(true);
    try {
      const response = await api.get(`/media-library/folders/${folderId}/documents`, { params: { page: targetPage, limit: 10 } });
      if (response.data.success) {
        setDocs(response.data.documents || []);
        setDocPagination(response.data.pagination || { page: targetPage, limit: 10, total: (response.data.documents || []).length, totalPages: 1, hasNextPage: false, hasPrevPage: false });
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  // â”€â”€ Handlers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleOpenFolder = (folder) => {
    setOpenFolder(folder);
    setDocPage(1);
    setSearch("");
    fetchDocuments(folder.id, 1);
  };

  const handleBack = () => {
    setOpenFolder(null);
    setSearch("");
    setFolderPage(1);
    setDocs([]);
  };

  const handleAddFolder = async (e) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    
    const clientCode = newFolderClient.trim() || newFolderName.trim().slice(0, 3).toUpperCase();
    
    try {
      const response = await api.post('/media-library/folders', {
        name: newFolderName.trim(),
        clientCode: clientCode,
        color: newFolderColor
      });
      
      if (response.data.success) {
        fetchFolders();
        setNewFolderName("");
        setNewFolderClient("");
        setNewFolderColor("#6366f1");
        setShowAddFolder(false);
      }
    } catch (error) {
      console.error("Error adding folder:", error);
      alert(error.response?.data?.message || "Failed to add folder");
    }
  };

  const handleAddDoc = async (e) => {
    e.preventDefault();
    if (!newDocName.trim() || !openFolder || !newDocFile) {
        alert("Please provide name, type, and select a file.");
        return;
    }

    const formData = new FormData();
    formData.append("name", newDocName.trim());
    formData.append("type", newDocType);
    formData.append("file", newDocFile);

    try {
      const response = await api.post(`/media-library/folders/${openFolder.id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (response.data.success) {
        fetchDocuments(openFolder.id, docPage);
        setNewDocName("");
        setNewDocType("PDF");
        setNewDocFile(null);
        setShowAddDoc(false);
      }
    } catch (error) {
      console.error("Error adding document:", error);
      alert(error.response?.data?.message || "Failed to upload document");
    }
  };

  const handleDeleteFolder = async (id, e) => {
    e.stopPropagation();
    
    try {
      const response = await api.delete(`/media-library/folders/${id}`);
      if (response.data.success) {
        fetchFolders();
      }
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

  const handleDeleteDoc = async (docId) => {
    try {
      const response = await api.delete(`/media-library/documents/${docId}`);
      if (response.data.success) {
        fetchDocuments(openFolder.id);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handlePreviewDoc = (doc) => {
    setPreviewDoc(doc);
    setShowPreview(true);
  };

  const closePreview = () => {
    setShowPreview(false);
    setPreviewDoc(null);
  };

  const openShareModal = (doc) => {
    setShareDoc(doc);
    setShowShareModal(true);
    setShareCreating(false);
    setShareLinks(null);
    setShareError("");
    setShareExpiresValue(7);
    setShareExpiresUnit("day");
    setShareAllowDownload(true);
    setCopiedLinkKey("");
  };

  const closeShareModal = () => {
    setShowShareModal(false);
    setShareDoc(null);
    setShareCreating(false);
    setShareLinks(null);
    setShareError("");
    setCopiedLinkKey("");
  };

  const copyToClipboard = async (text, keyForUI) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopiedLinkKey(keyForUI);
      setTimeout(() => setCopiedLinkKey(""), 1500);
    } catch (e) {
      alert("Could not copy link. Please copy manually.");
    }
  };

  const handleCreateShareLink = async () => {
    if (!shareDoc) return;
    setShareCreating(true);
    setShareError("");

    try {
      const response = await api.post('/media-library/share', {
        documentId: shareDoc.id,
        expiresValue: shareExpiresValue,
        expiresUnit: shareExpiresUnit,
        allowDownload: shareAllowDownload
      });

      if (response.data?.success) {
        setShareLinks({
          expiresAt: response.data.expiresAt,
          viewLink: response.data.viewLink,
          downloadLink: response.data.downloadLink,
          allowDownload: response.data.allowDownload
        });
      } else {
        setShareError(response.data?.message || "Failed to create share link");
      }
    } catch (error) {
      setShareError(error.response?.data?.message || "Failed to create share link");
    } finally {
      setShareCreating(false);
    }
  };

  const getRemainingMinutesText = (expiresAtIso) => {
    if (!expiresAtIso) return "";
    const expiresAtMs = new Date(expiresAtIso).getTime();
    const t = expiresAtMs - Date.now();
    const minutes = Math.ceil(t / 60000);
    if (!Number.isFinite(minutes)) return "";
    if (minutes <= 0) return "Expired";
    return `Expires in ${minutes} minute(s)`;
  };

  useEffect(() => {
    if (openFolder) {
      fetchDocuments(openFolder.id, docPage);
    }
  }, [docPage, openFolder]);

  // â”€â”€ Folder filtered + paginated â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const filteredFolders = folders.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalFolders = search ? filteredFolders.length : (folderPagination.total || 0);
  const pagedFolders = filteredFolders;

  // â”€â”€ Doc filtered + paginated â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const folderDocs = docs || [];
  const filteredDocs = folderDocs.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );
  const totalDocs = search ? filteredDocs.length : (docPagination.total || 0);
  const pagedDocs = filteredDocs;

  const getDocPublicUrl = (docPath) => {
    if (!docPath) return "";
    const baseUrl = api.defaults.baseURL.replace('/api', '');
    const normalized = String(docPath).replace(/\\/g, "/").replace(/^\/+/, "");

    // If already stored as relative "uploads/..."
    if (normalized.startsWith("uploads/")) {
      return `${baseUrl}/${normalized}`;
    }

    // If stored as absolute path like "C:/.../backend/uploads/1/file.pdf"
    const idx = normalized.indexOf("uploads/");
    if (idx !== -1) {
      return `${baseUrl}/${normalized.slice(idx)}`;
    }

    // Fallback: try direct join
    return `${baseUrl}/${normalized}`;
  };

  const localDocUrl = getDocPublicUrl(previewDoc?.path);

  // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="flex-1 min-h-screen bg-[#f8fafc] text-slate-700 font-sans">
      {/* â”€â”€ TOP NAVBAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm shadow-slate-100">
        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          {openFolder ? (
            <>
              <button onClick={handleBack} className="hover:text-emerald-600 transition-colors cursor-pointer">
                Media Library
              </button>
              <ChevronRight size={12} />
              <span className="text-slate-900 font-bold">{openFolder.name}</span>
            </>
          ) : (
            <span className="text-slate-900 font-bold">Media Library</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">A</div>
        </div>
      </header>

      <div className="p-8 max-w-[1400px] mx-auto">
        {/* â”€â”€ PAGE HEADER â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {openFolder && (
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors mr-1"
              >
                <ChevronLeft size={18} />
                Back
              </button>
            )}
            <div>
              <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                {openFolder ? openFolder.name : "Media Library"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">
                {openFolder
                  ? `${totalDocs} document${totalDocs !== 1 ? "s" : ""} in this folder`
                  : `${totalFolders} client folder${totalFolders !== 1 ? "s" : ""}`}
              </p>
            </div>
          </div>

          {openFolder ? (
            <button
              onClick={() => setShowAddDoc(true)}
              className="flex items-center gap-2 bg-[#10b981] hover:bg-[#0da975] text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-emerald-100 transition-all active:scale-95"
            >
              <Plus size={18} /> Add Document
            </button>
          ) : null}
        </div>

        {/* â”€â”€ SEARCH BAR â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); openFolder ? setDocPage(1) : setFolderPage(1); }}
              placeholder={openFolder ? "Search documents" : "Search folders"}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
            />
          </div>
          <button className="bg-[#10b981] text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-[#0da975] transition-colors">
            Search
          </button>
        </div>

        {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {loading && <div className="text-center py-10 text-slate-500">Loading...</div>}

        {!loading && !openFolder ? (
          /* â”€â”€ FOLDER GRID VIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
          <div>
            {pagedFolders.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 py-20 flex flex-col items-center gap-3 text-slate-400">
                <FolderOpen size={48} className="opacity-30" />
                <p className="font-semibold text-sm">No folders found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {pagedFolders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => handleOpenFolder(folder)}
                    className="bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-200 group relative"
                  >
                    {/* Delete btn removed for employee */}

                    {/* Folder icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                      style={{ backgroundColor: folder.color + "18" }}
                    >
                      <Folder size={30} style={{ color: folder.color }} />
                    </div>

                    {/* Info */}
                    <p className="text-[13px] font-bold text-slate-800 text-center leading-tight truncate">
                      {folder.name}
                    </p>
                    <p className="text-[11px] text-slate-400 text-center mt-1 font-medium">
                      {folder.docCount} document{folder.docCount !== 1 ? "s" : ""}
                    </p>

                    {/* Footer */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-center gap-1 text-[10px] text-slate-400 font-medium">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[9px]"
                        style={{ backgroundColor: folder.color }}
                      >
                        {folder.client ? folder.client.slice(0, 1) : "?"}
                      </span>
                      {folder.client}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Folder Pagination */}
            {!search && (
              <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <Pagination total={totalFolders} page={folderPage} onPage={setFolderPage} />
              </div>
            )}
          </div>
        ) : !loading && openFolder ? (
          /* â”€â”€ DOCUMENT TABLE VIEW â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Folder identity banner */}
            <div
              className="px-6 py-4 border-b border-slate-100 flex items-center gap-3"
              style={{ background: openFolder.color + "08" }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: openFolder.color + "20" }}
              >
                <FolderOpen size={22} style={{ color: openFolder.color }} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{openFolder.name}</p>
                <p className="text-xs text-slate-400 font-medium">Client Code: {openFolder.client} Â· Created {openFolder.createdAt}</p>
              </div>
              <span className="ml-auto text-xs font-bold px-3 py-1 rounded-full border"
                style={{ color: openFolder.color, borderColor: openFolder.color + "40", background: openFolder.color + "12" }}>
                {totalDocs} docs
              </span>
            </div>

            {pagedDocs.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-slate-400">
                <FileText size={44} className="opacity-25" />
                <p className="font-semibold text-sm">No documents yet</p>
                <button
                  onClick={() => setShowAddDoc(true)}
                  className="mt-1 flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:underline"
                >
                  <Plus size={15} /> Add your first document
                </button>
              </div>
            ) : (
              <>
                <table className="w-full text-left">
                  <thead className="bg-slate-50/60 border-b border-slate-100">
                    <tr className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      <th className="px-6 py-3 w-10 text-center">#</th>
                      <th className="px-6 py-3">Document Name</th>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Size</th>
                      <th className="px-6 py-3">Uploaded</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-[13px]">
                    {pagedDocs.map((doc, idx) => (
                      <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-3.5 text-center text-slate-400 text-xs font-bold">
                          {((docPagination.page || 1) - 1) * (docPagination.limit || ITEMS_PER_PAGE) + idx + 1}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              {typeIcon(doc.type)}
                            </div>
                            <span className="font-semibold text-slate-800 truncate max-w-[240px]">{doc.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-bold ${typeBadge[doc.type] || "bg-slate-50 text-slate-500 border-slate-200"}`}>
                            {typeIcon(doc.type)} {doc.type}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-slate-500 font-medium">{doc.size}</td>
                        <td className="px-6 py-3.5 text-slate-400">{doc.uploadedAt}</td>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => handlePreviewDoc(doc)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-300 hover:text-blue-500 transition-all"
                              aria-label="Preview document"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openShareModal(doc)}
                              className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 transition-all"
                              aria-label="Share document with expiry"
                            >
                              <Share2 size={15} />
                            </button>
                            <a href={getDocPublicUrl(doc.path)} download className="p-1.5 rounded-lg hover:bg-emerald-50 text-slate-300 hover:text-emerald-500 transition-all">
                              <Download size={15} />
                            </a>
                            <button
                              onClick={() => handleDeleteDoc(doc.id)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!search && <Pagination total={totalDocs} page={docPage} onPage={setDocPage} />}
              </>
            )}
          </div>
        ) : null}
      </div>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* ADD FOLDER MODAL */}
      {showAddFolder && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Folder size={20} className="text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Create New Folder</h3>
              </div>
              <button onClick={() => setShowAddFolder(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddFolder} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Folder Name (Client Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Client Code</label>
                <input
                  type="text"
                  value={newFolderClient}
                  onChange={(e) => setNewFolderClient(e.target.value.toUpperCase().slice(0, 5))}
                  placeholder="e.g. ACM  (auto-filled if blank)"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Folder Color</label>
                <div className="flex items-center gap-3">
                  {["#6366f1","#10b981","#f59e0b","#ef4444","#8b5cf6","#0ea5e9","#14b8a6","#f97316","#ec4899"].map((c) => (
                    <button
                      key={c} type="button"
                      onClick={() => setNewFolderColor(c)}
                      className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                      style={{
                        backgroundColor: c,
                        borderColor: newFolderColor === c ? c : "transparent",
                        boxShadow: newFolderColor === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddFolder(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#0da975] shadow-md shadow-emerald-100 active:scale-95 transition-all">
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* ADD DOCUMENT MODAL */}
      {showAddDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <UploadCloud size={20} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add Document</h3>
                  <p className="text-xs text-slate-400 font-medium">to {openFolder?.name}</p>
                </div>
              </div>
              <button onClick={() => setShowAddDoc(false)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddDoc} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. Annual_Report_2025"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Document Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {["PDF","Word","Image","Video","Audio","Archive"].map((t) => (
                    <button
                      key={t} type="button"
                      onClick={() => setNewDocType(t)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold transition-all ${
                        newDocType === t
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {typeIcon(t)} {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upload dropzone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">File</label>
                <div
                  onClick={() => fileInputRef.current.click()}
                  className="border-2 border-dashed border-slate-200 rounded-2xl p-7 flex flex-col items-center gap-2 bg-slate-50/50 hover:bg-emerald-50/30 hover:border-emerald-300 transition-all cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <UploadCloud size={22} />
                  </div>
                  {newDocFile ? (
                    <p className="text-sm font-bold text-emerald-700">{newDocFile.name}</p>
                  ) : (
                    <>
                      <p className="text-sm font-bold text-slate-700">Click to upload</p>
                      <p className="text-xs text-slate-400">PNG, JPG, PDF, DOCX, MP4 or ZIP (Max 50 MB)</p>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => setNewDocFile(e.target.files[0] || null)}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddDoc(false)}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#0da975] shadow-md shadow-emerald-100 active:scale-95 transition-all">
                  Add Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* PREVIEW MODAL (admin-only "show now") */}
      {showPreview && previewDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Eye size={18} className="text-blue-600" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-bold text-slate-900 truncate">Media Information</h3>
                  <p className="text-xs text-slate-400 font-medium truncate">
                    {previewDoc.name}
                  </p>
                </div>
              </div>
              <button onClick={closePreview} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div>
                {previewDoc.type === "Image" ? (
                  <img
                    src={localDocUrl}
                    alt={previewDoc.name}
                    className="w-full h-auto max-h-[40vh] object-contain rounded-xl border border-slate-200 bg-slate-50"
                  />
                ) : previewDoc.type === "PDF" ? (
                  <iframe
                    title="PDF Preview"
                    src={localDocUrl}
                    className="w-full h-[40vh] rounded-xl border border-slate-200 bg-white"
                  />
                ) : previewDoc.type === "Word" ? (
                  <div className="w-full h-[40vh] rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
                    <DocViewer 
                      documents={[{ uri: localDocUrl, fileType: "docx" }]} 
                      pluginRenderers={DocViewerRenderers}
                      config={{ header: { disableHeader: true } }}
                      style={{ height: '100%', width: '100%' }}
                    />
                  </div>
                ) : previewDoc.type === "Video" ? (
                  <video
                    controls
                    src={localDocUrl}
                    className="w-full max-h-[40vh] rounded-xl border border-slate-200 bg-black"
                  />
                ) : previewDoc.type === "Audio" ? (
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <audio controls src={localDocUrl} className="w-full" />
                    <div className="text-xs text-slate-500 font-medium mt-2">
                      Audio preview
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-bold text-slate-800">Preview not available for this type</div>
                    <div className="text-xs text-slate-500 font-medium mt-1">
                      You can still view/open or download the document.
                    </div>
                    <a
                      href={localDocUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex mt-3 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Open document
                    </a>
                  </div>
                )}
              </div>

              <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">File Name</div>
                    <div className="text-sm font-bold text-slate-800 truncate">{previewDoc.name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">File Type</div>
                    <div className="text-sm font-bold text-slate-800">{previewDoc.type}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">File Size</div>
                    <div className="text-sm font-bold text-slate-800">{previewDoc.size}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Uploaded</div>
                    <div className="text-sm font-bold text-slate-800">{previewDoc.uploadedAt}</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">URL</div>
                  <div className="flex items-stretch gap-2">
                    <input
                      readOnly
                      value={localDocUrl}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2 flex-col sm:flex-row">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(localDocUrl, "previewUrl")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Copy size={16} />
                    {copiedLinkKey === "previewUrl" ? "Copied" : "Copy Link"}
                  </button>
                  <a
                    href={localDocUrl}
                    download
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      {/* SHARE MODAL (expiring link + optional download permission) */}
      {showShareModal && shareDoc && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-slate-900 truncate">Share Document</h3>
                <p className="text-xs text-slate-400 font-medium truncate">{shareDoc.name}</p>
              </div>
              <button onClick={closeShareModal} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Expiry (hour/day/week) <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-3 items-center">
                  <input
                    type="number"
                    min={1}
                    value={shareExpiresValue}
                    onChange={(e) => setShareExpiresValue(Number(e.target.value))}
                    className="w-24 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                  />
                  <select
                    value={shareExpiresUnit}
                    onChange={(e) => setShareExpiresUnit(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all bg-white"
                  >
                    <option value="hour">Hour(s)</option>
                    <option value="day">Day(s)</option>
                    <option value="week">Week(s)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  Download access
                </label>
                <select
                  value={shareAllowDownload ? "yes" : "no"}
                  onChange={(e) => setShareAllowDownload(e.target.value === "yes")}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 transition-all"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              {shareError && (
                <div className="text-sm text-rose-600 font-semibold">
                  {shareError}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeShareModal}
                  className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                  disabled={shareCreating}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateShareLink}
                  className="flex-1 py-2.5 bg-[#10b981] text-white rounded-xl text-sm font-bold hover:bg-[#0da975] shadow-md shadow-emerald-100 active:scale-95 transition-all disabled:opacity-60"
                  disabled={shareCreating}
                >
                  {shareCreating ? "Creating..." : "Create Share Link"}
                </button>
              </div>

              {shareLinks && (
                <div className="space-y-3 pt-2">
                  <div className="text-xs text-slate-500 font-medium">
                    Expires at: <span className="font-bold text-slate-700">{shareLinks.expiresAt}</span>
                    {getRemainingMinutesText(shareLinks.expiresAt) ? (
                      <span className="ml-2 font-bold text-slate-700">({getRemainingMinutesText(shareLinks.expiresAt)})</span>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                      View link
                    </label>
                    <div className="flex gap-2 items-stretch">
                      <input
                        readOnly
                        value={shareLinks.viewLink}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50"
                      />
                      <button
                        type="button"
                        onClick={() => copyToClipboard(shareLinks.viewLink, "view")}
                        className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
                      >
                        {copiedLinkKey === "view" ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>

                  {shareLinks.allowDownload && shareLinks.downloadLink ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                        Download link
                      </label>
                      <div className="flex gap-2 items-stretch">
                        <input
                          readOnly
                          value={shareLinks.downloadLink}
                          className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs text-slate-700 bg-slate-50"
                        />
                        <button
                          type="button"
                          onClick={() => copyToClipboard(shareLinks.downloadLink, "download")}
                          className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
                        >
                          {copiedLinkKey === "download" ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpMediaLibrary;


