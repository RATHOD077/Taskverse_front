import React, { useState, useEffect } from "react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { 
  Plus, Edit, Trash2, Search, X, CheckCircle, 
  ChevronRight, MoreHorizontal, Globe, Clock, Save,
  Bold, Italic, Underline, Link as LinkIcon, List, ListOrdered
} from "lucide-react";
import api from "../../../api/api";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    subject: "",
    body: ""
  });
  const [view, setView] = useState("list");
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ bulletList: true, orderedList: true }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-blue-500 underline' } }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'min-h-[200px] p-4 focus:outline-none bg-white text-sm leading-relaxed border border-slate-200 rounded-b-lg',
      },
    },
  });

  const fetchTemplates = async () => {
    try {
      const response = await api.get('/email-templates');
      if (response.data.success) setTemplates(response.data.templates);
    } catch (error) {
      console.error("Failed to fetch templates:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (editor && showModal) {
      editor.commands.setContent(formData.body);
    }
  }, [editor, showModal, formData.body]);

  const handleOpenModal = (template = null) => {
    if (template) {
      setFormData(template);
      setIsEditing(true);
    } else {
      setFormData({ id: null, name: "", subject: "", body: "" });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({ id: null, name: "", subject: "", body: "" });
    if (editor) editor.commands.setContent('');
  };

  const handleSave = async () => {
    const bodyContent = editor.getHTML();
    if (!formData.name || !formData.subject || !bodyContent || bodyContent === '<p></p>') {
      return alert("Please fill all fields");
    }

    const payload = {
      name: formData.name,
      subject: formData.subject,
      body: bodyContent
    };

    try {
      let response;
      if (isEditing) {
        response = await api.put(`/email-templates/${formData.id}`, payload);
      } else {
        response = await api.post('/email-templates', payload);
      }
      
      if (response.data.success) {
        alert(`Template ${isEditing ? 'updated' : 'created'} successfully!`);
        fetchTemplates();
        handleCloseModal();
      } else {
        alert("Error: " + response.data.message);
      }
    } catch (error) {
      alert("Failed to save template");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?")) return;

    try {
      const response = await api.delete(`/email-templates/${id}`);
      if (response.data.success) {
        fetchTemplates();
      }
    } catch (error) {
      alert("Failed to delete template");
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-50">
        <div className="flex items-center gap-[0.5rem] text-[0.75rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Email Templates</span>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[80rem] mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[1.5rem] font-bold text-slate-900">Email Templates</h2>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[#10b981] hover:bg-[#059669] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-sm shadow-emerald-100"
          >
            <Plus size={16} /> Create Template
          </button>
        </div>

        {view === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
            {loading ? (
              <p>Loading templates...</p>
            ) : templates.length === 0 ? (
              <p className="col-span-full text-center text-slate-400 py-10">No templates found. Create one!</p>
            ) : (
              templates.map(template => (
                <div 
                  key={template.id} 
                  onClick={() => { setSelectedTemplate(template); setView('details'); }}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-[#10b981] transition-all group flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-900 text-lg line-clamp-1" title={template.name}>{template.name}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleOpenModal(template); }} 
                          className="text-blue-500 hover:bg-blue-50 p-1.5 rounded transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(template.id); }} 
                          className="text-red-500 hover:bg-red-50 p-1.5 rounded transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-slate-600 mb-1">Subject: <span className="font-normal">{template.subject}</span></p>
                    <div 
                      className="text-xs text-slate-400 line-clamp-3 mb-4 prose-sm prose-slate max-h-[4.5rem] overflow-hidden"
                      dangerouslySetInnerHTML={{ __html: template.body }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[0.7rem] font-medium text-slate-400 pt-3 border-t border-slate-100 uppercase tracking-tighter">
                    <span>Updated: {new Date(template.updated_at).toLocaleDateString()}</span>
                    <span className="text-[#10b981] font-bold group-hover:underline flex items-center gap-1">View Details <ChevronRight size={10} /></span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* --- TEMPLATE DETAILS VIEW --- */
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
               <div className="flex items-center gap-3">
                 <button onClick={() => setView('list')} className="p-2 hover:bg-white border border-slate-200 rounded-lg transition-all shadow-sm">
                   <ChevronRight size={20} className="rotate-180 text-slate-600 shadow-sm" />
                 </button>
                 <h2 className="text-[1.5rem] font-bold text-slate-900">{selectedTemplate?.name}</h2>
               </div>
               <div className="flex gap-3">
                 <button 
                   onClick={() => handleOpenModal(selectedTemplate)}
                   className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold bg-white hover:bg-slate-50 transition-colors"
                 >
                   <Edit size={16} /> Edit Template
                 </button>
                 <button onClick={() => setView('list')} className="flex items-center gap-2 px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-bold transition-all shadow-lg active:scale-95">
                   Back to List
                 </button>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Metadata */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Template Info</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="text-[0.7rem] font-bold text-slate-400 uppercase">Subject Line</span>
                      <p className="text-sm font-semibold text-slate-800 break-words mt-1">{selectedTemplate?.subject}</p>
                    </div>
                    <div>
                      <span className="text-[0.7rem] font-bold text-slate-400 uppercase">Last Modified</span>
                      <p className="text-sm font-medium text-slate-600 mt-1">{new Date(selectedTemplate?.updated_at).toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-[0.7rem] font-bold text-slate-400 uppercase">Available Placeholders</span>
                      <div className="flex flex-wrap gap-2 mt-2">
                         <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{"{{name}}"}</span>
                         <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{"{{email}}"}</span>
                         <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[10px] font-bold border border-blue-100">{"{{contact}}"}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => { handleDelete(selectedTemplate.id); setView('list'); }}
                    className="w-full mt-8 flex items-center justify-center gap-2 py-3 border border-red-100 text-red-500 rounded-lg text-xs font-bold hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} /> Delete Template
                  </button>
                </div>
              </div>

              {/* Right Column: Body Preview */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
                   <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Message Body Preview</h3>
                      <Globe size={16} className="text-slate-400" />
                   </div>
                   <div className="p-8 md:p-12">
                      <div 
                        className="prose prose-slate max-w-none text-slate-700 leading-relaxed font-serif"
                        dangerouslySetInnerHTML={{ __html: selectedTemplate?.body }}
                      />
                   </div>
                   <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 italic">
                      Disclaimer: This is a preview. Dynamic keywords will be replaced with actual recipient data when sending.
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-slate-900">{isEditing ? "Edit Template" : "Create Template"}</h2>
                <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg border border-blue-100">
                  <span className="font-bold">Tip:</span> You can use keywords like <code>{`{{name}}`}</code> or <code>{`{{email}}`}</code> to auto-fill recipient details when sending.
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Template Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. Welcome Message" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:border-[#10b981] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Subject Line <span className="text-red-500">*</span></label>
                  <input 
                    type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="e.g. Welcome {{name}} to our platform!" className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:border-[#10b981] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Message Body <span className="text-red-500">*</span></label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 p-2 flex gap-1 flex-wrap">
                      <button onClick={() => editor?.chain().focus().toggleBold().run()} className={`p-2 hover:bg-slate-200 rounded ${editor?.isActive('bold') ? 'bg-slate-200' : ''}`}><Bold size={14} /></button>
                      <button onClick={() => editor?.chain().focus().toggleItalic().run()} className={`p-2 hover:bg-slate-200 rounded ${editor?.isActive('italic') ? 'bg-slate-200' : ''}`}><Italic size={14} /></button>
                      <button onClick={() => editor?.chain().focus().toggleUnderline().run()} className={`p-2 hover:bg-slate-200 rounded ${editor?.isActive('underline') ? 'bg-slate-200' : ''}`}><Underline size={14} /></button>
                      <button onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`p-2 hover:bg-slate-200 rounded ${editor?.isActive('bulletList') ? 'bg-slate-200' : ''}`}><List size={14} /></button>
                      <button onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`p-2 hover:bg-slate-200 rounded ${editor?.isActive('orderedList') ? 'bg-slate-200' : ''}`}><ListOrdered size={14} /></button>
                    </div>
                    <EditorContent editor={editor} />
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-xl">
                <button onClick={handleCloseModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                <button onClick={handleSave} className="bg-[#10b981] hover:bg-[#059669] text-white px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                  <Save size={16} /> Save Template
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EmailTemplates;


