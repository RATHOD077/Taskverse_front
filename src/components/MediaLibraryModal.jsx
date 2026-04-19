import React, { useState, useRef, useEffect } from "react";
import {
  Plus, Search, X, ChevronRight,
  FileText, UploadCloud, FolderOpen,
  Folder, ChevronLeft, ChevronRight as ChevronRightIcon,
  Image as ImageIcon, Film, Music, Archive, File as FileIcon
} from "lucide-react";
import api from "../api/api";

const ITEMS_PER_PAGE = 8;

const typeIcon = (type) => {
  switch (type) {
    case "Image":   return <ImageIcon  size={16} className="text-blue-500" />;
    case "Video":   return <Film       size={16} className="text-purple-500" />;
    case "PDF":     return <FileText   size={16} className="text-rose-500" />;
    case "Audio":   return <Music      size={16} className="text-amber-500" />;
    case "Archive": return <Archive    size={16} className="text-slate-500" />;
    default:        return <FileIcon   size={16} className="text-slate-400" />;
  }
};

const Pagination = ({ total, page, onPage }) => {
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  if (totalPages <= 1) return null;
  const pages = [];
  for (let i = 1; i <= totalPages; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 mt-auto bg-white">
      <span className="text-[10px] text-slate-400 font-medium">
        Showing {(page - 1) * ITEMS_PER_PAGE + 1} - {Math.min(page * ITEMS_PER_PAGE, total)} of {total}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="p-1 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-6 h-6 rounded-lg text-[10px] font-bold border transition-all ${
              p === page
                ? "bg-[#10b981] text-white border-[#10b981]"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {p}
          </button>
        ))}
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="p-1 rounded-lg border border-slate-200 bg-white disabled:opacity-30 hover:bg-slate-50 transition-colors"
        >
          <ChevronRightIcon size={14} />
        </button>
      </div>
    </div>
  );
};

const MediaLibraryModal = ({ isOpen, onClose, onSelect }) => {
  const [folders, setFolders] = useState([]);
  const [docs, setDocs] = useState([]);
  const [openFolder, setOpenFolder] = useState(null);
  const [folderPage, setFolderPage] = useState(1);
  const [docPage, setDocPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  
  const [newDocName, setNewDocName] = useState("");
  const [newDocType, setNewDocType] = useState("PDF");
  const [newDocFile, setNewDocFile] = useState(null);
  const fileInputRef = useRef(null);

  const fetchFolders = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/media-library/folders');
      if (response.data.success) {
        setFolders(response.data.folders);
      }
    } catch (err) {
      console.error("Error fetching folders:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDocuments = async (folderId) => {
    setIsLoading(true);
    try {
      const response = await api.get(`/media-library/folders/${folderId}/documents`);
      if (response.data.success) {
        setDocs(response.data.documents);
      }
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchFolders();
      setOpenFolder(null);
      setSearch("");
      setFolderPage(1);
      setShowUpload(false);
    }
  }, [isOpen]);

  const handleOpenFolder = (folder) => {
    setOpenFolder(folder);
    setDocPage(1);
    setSearch("");
    fetchDocuments(folder.id);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!newDocName || !newDocFile || !openFolder) return;
    const formData = new FormData();
    formData.append("name", newDocName);
    formData.append("type", newDocType);
    formData.append("file", newDocFile);
    try {
      const response = await api.post(`/media-library/folders/${openFolder.id}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (response.data.success) {
        fetchDocuments(openFolder.id);
        setNewDocName("");
        setNewDocFile(null);
        setShowUpload(false);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    }
  };

  const filteredFolders = folders.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const pagedFolders = filteredFolders.slice((folderPage - 1) * ITEMS_PER_PAGE, folderPage * ITEMS_PER_PAGE);

  const filteredDocs = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()));
  const pagedDocs = filteredDocs.slice((docPage - 1) * ITEMS_PER_PAGE, docPage * ITEMS_PER_PAGE);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4 overflow-hidden">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[85vh] shadow-2xl flex flex-col border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                <FolderOpen size={20} className="text-emerald-600" />
             </div>
             <div>
               <h3 className="text-base font-bold text-slate-900">Media Library Selector</h3>
               <p className="text-[10px] text-slate-400 font-medium tracking-tight">Browse or upload documents to your cases</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-3 border-b border-slate-50 flex items-center gap-3 bg-white shrink-0">
           {openFolder ? (
             <button onClick={() => setOpenFolder(null)} className="flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-emerald-600 transition-colors">
               <ChevronLeft size={16} /> Back
             </button>
           ) : <div className="text-[11px] font-bold text-slate-400 px-2 uppercase tracking-widest">Library</div>}
           <div className="relative flex-1">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
             <input 
               type="text" 
               placeholder={openFolder ? `Search in ${openFolder.name}...` : "Search folders..."} 
               value={search}
               onChange={(e) => {
                 setSearch(e.target.value);
                 openFolder ? setDocPage(1) : setFolderPage(1);
               }}
               className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[11px] focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-300 outline-none transition-all"
             />
           </div>
           {openFolder && (
             <button 
              onClick={() => setShowUpload(!showUpload)} 
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[11px] font-bold transition-all ${showUpload ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' : 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-100'}`}
             >
               {showUpload ? <X size={14} /> : <Plus size={14} />} {showUpload ? "Cancel" : "Upload"}
             </button>
           )}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#fcfcfc] flex flex-col min-h-0">
          
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400 py-20">
               <div className="w-10 h-10 border-4 border-emerald-500/10 border-t-emerald-500 rounded-full animate-spin"></div>
               <p className="text-xs font-bold font-mono uppercase tracking-widest animate-pulse">Scanning...</p>
            </div>
          ) : showUpload && openFolder ? (
            <div className="max-w-md mx-auto w-full bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/20 translate-y-0 opacity-100 transition-all duration-500">
               <h4 className="text-sm font-bold text-slate-800 mb-6 flex items-center justify-between border-b border-slate-50 pb-4">
                 <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                     <UploadCloud size={16} className="text-emerald-500" />
                   </div>
                   Upload Document
                 </div>
                 <span className="text-[10px] text-slate-400 font-medium">to {openFolder.name}</span>
               </h4>
               <form onSubmit={handleUpload} className="space-y-5">
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Display Name</label>
                   <input 
                     type="text" 
                     placeholder="e.g. Agreement_v1.pdf"
                     className="w-full px-4 py-3 border border-slate-200 rounded-xl text-xs outline-none focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-400 bg-slate-50/30 transition-all"
                     value={newDocName}
                     onChange={e => setNewDocName(e.target.value)}
                     required
                   />
                 </div>
                 <div className="space-y-1.5">
                   <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block px-1">Select File</label>
                   <div 
                    onClick={() => fileInputRef.current.click()} 
                    className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all ${newDocFile ? 'bg-emerald-50/30 border-emerald-300' : 'bg-slate-50/50 border-slate-200 hover:bg-emerald-50/20 hover:border-emerald-200'}`}
                   >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${newDocFile ? 'bg-emerald-500 text-white' : 'bg-white text-slate-300 shadow-sm'}`}>
                         <FileText size={24} />
                      </div>
                      <div className="text-center">
                        <p className="text-[11px] font-bold text-slate-700 truncate max-w-[250px]">{newDocFile ? newDocFile.name : "Click to select local file"}</p>
                        <p className="text-[9px] text-slate-400 mt-1 font-medium italic">Supports PDF, JPG, PNG up to 20MB</p>
                      </div>
                      <input ref={fileInputRef} type="file" className="hidden" onChange={e => {
                        const file = e.target.files[0];
                        if(file) {
                          setNewDocFile(file);
                          if(!newDocName) setNewDocName(file.name);
                        }
                      }} />
                   </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                   {["PDF","Image","Archive"].map(t => (
                     <button key={t} type="button" onClick={() => setNewDocType(t)} className={`py-2 rounded-xl text-[10px] font-bold border transition-all ${newDocType === t ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-slate-500 border-slate-100 hover:bg-slate-50'}`}>
                        {t}
                     </button>
                   ))}
                 </div>
                 <button type="submit" className="w-full bg-[#10b981] hover:bg-[#0da975] text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-100 active:scale-[0.98] transition-all mt-2">
                   Process & Upload
                 </button>
               </form>
            </div>
          ) : !openFolder ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
              {pagedFolders.map(folder => (
                <div key={folder.id} onClick={() => handleOpenFolder(folder)} className="bg-white p-5 rounded-3xl border border-slate-200 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/5 transition-all cursor-pointer group flex flex-col relative overflow-hidden">
                   <div 
                    className="absolute -right-2 -top-2 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity"
                    style={{ color: folder.color }}
                   >
                     <FolderOpen size={80} />
                   </div>
                   <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm" style={{ backgroundColor: folder.color + '15' }}>
                      <Folder size={24} style={{ color: folder.color }} />
                   </div>
                   <div className="mt-auto">
                     <p className="text-xs font-bold text-slate-800 truncate mb-1 uppercase tracking-tight">{folder.name}</p>
                     <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-bold">{folder.docCount || 0} ITEMS</span>
                        <ChevronRightIcon size={14} className="text-slate-200 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                     </div>
                   </div>
                </div>
              ))}
              {filteredFolders.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center gap-3 text-slate-400">
                   <Folder size={40} className="opacity-20" />
                   <p className="text-xs font-medium italic">No folders match your search.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
              {pagedDocs.map(doc => (
                <div key={doc.id} onClick={() => onSelect(doc)} className="bg-white p-3.5 rounded-2xl border border-slate-100 hover:border-emerald-400 hover:shadow-lg hover:shadow-emerald-500/5 transition-all cursor-pointer group flex items-center gap-4">
                   <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
                      {typeIcon(doc.type)}
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-bold text-slate-800 truncate">{doc.name}</p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-400 font-medium">{doc.size}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-200"></span>
                        <span className="text-[10px] text-slate-400 font-medium">{doc.uploadedAt}</span>
                      </div>
                   </div>
                   <div className="opacity-0 group-hover:opacity-100 transition-all font-bold text-[10px] bg-emerald-500 text-white px-3 py-1.5 rounded-lg shadow-sm">
                     SELECT
                   </div>
                </div>
              ))}
              {filteredDocs.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center gap-3 text-slate-400">
                   <FileText size={40} className="opacity-20" />
                   <p className="text-xs font-medium italic">No documents found in this folder.</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination at footer of content area */}
          {!isLoading && !showUpload && (
            <div className="mt-auto pt-4">
              {openFolder ? (
                <Pagination total={filteredDocs.length} page={docPage} onPage={setDocPage} />
              ) : (
                <Pagination total={filteredFolders.length} page={folderPage} onPage={setFolderPage} />
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default MediaLibraryModal;
