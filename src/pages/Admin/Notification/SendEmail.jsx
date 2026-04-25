import React, { useState, useEffect } from 'react';
import api from '../../../api/api'; 
import { 
  ChevronRight, MoreHorizontal, Globe,
  AlertCircle, Send, UserCheck, Mail, FileText
} from 'lucide-react';

const SendEmail = () => {
  const [subject, setSubject] = useState('');
  const [rawBody, setRawBody] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [fromName, setFromName] = useState('');
  const [replyTo, setReplyTo] = useState('');
  const [loading, setLoading] = useState(false);
  const [scheduleTime, setScheduleTime] = useState('');
  
  // Data States
  const [templates, setTemplates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerDocs, setCustomerDocs] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  
  // Resolved State (from Backend)
  const [resolvedSubject, setResolvedSubject] = useState('');
  const [resolvedBody, setResolvedBody] = useState('');

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
       try {
         const [tplRes, custRes] = await Promise.all([
           api.get('/notifications/templates'),
           api.get('/notifications/customers')
         ]);
         
         if(tplRes.data.success) setTemplates(tplRes.data.templates);
         if(custRes.data.success) setCustomers(custRes.data.customers);

         const savedUser = localStorage.getItem('user');
         if (savedUser && savedUser !== "undefined") {
           try {
             const user = JSON.parse(savedUser);
             setFromName(user.username || '');
             setReplyTo(user.email || '');
           } catch (err) {
             console.error("Error parsing user data:", err);
           }
         }
       } catch (err) {
         console.error("Failed to fetch data:", err);
       }
    };
    fetchData();
  }, []);

  // Effect to Resolve Keywords via Backend (Universal Endpoint)
  useEffect(() => {
    const resolve = async () => {
      if (!selectedCustomerId && !subject && !rawBody) {
        setResolvedSubject('');
        setResolvedBody('');
        return;
      }

      try {
        const response = await api.post('/notifications/resolve-keywords', {
          subject,
          body: rawBody,
          customer_id: selectedCustomerId || null,
          document_id: selectedDocId || null
        });
        
        if (response.data.success) {
          setResolvedSubject(response.data.resolvedSubject);
          setResolvedBody(response.data.resolvedBody);
        }
      } catch (err) {
        console.error("Resolution failed:", err);
      }
    };

    const timer = setTimeout(resolve, 500); 
    return () => clearTimeout(timer);
  }, [subject, rawBody, selectedCustomerId, selectedDocId]);

  // Handle template selection
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
    
    if (!templateId) {
      setSubject('');
      setRawBody('');
      return;
    }
    
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      setSubject(template.subject);
      setRawBody(template.body);
    }
  };

  // Handle customer selection
  const handleCustomerSelection = async (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    setSelectedDocId(''); // Reset doc
    setCustomerDocs([]);

    const customer = customers.find(c => String(c.id) === String(custId));
    if (customer) {
      setRecipientEmail(customer.email || '');
      
      // Fetch documents for this customer
      try {
        const res = await api.get(`/notifications/customer-documents?customer_id=${custId}`);
        if (res.data.success) {
          setCustomerDocs(res.data.documents);
        }
      } catch (err) {
        console.error("Failed to fetch customer documents:", err);
      }
    }
  };

  const isScheduled = scheduleTime && scheduleTime.trim() !== '';

  const handleSendEmail = async () => {
    if (!subject.trim()) return alert("Please select a template or enter subject");
    if (!recipientEmail.trim()) return alert("Please enter/select recipient email");

    if (isScheduled && new Date(scheduleTime) <= new Date()) {
      return alert("âš ï¸ Scheduled time must be in the future.");
    }

    setLoading(true);

    try {
      const requestBody = {
        to: recipientEmail.trim(),
        subject: resolvedSubject || subject.trim(),
        body: resolvedBody || rawBody,
        fromName: fromName || "TaskVerse",
        replyTo: replyTo.trim() || undefined,
        customer_id: selectedCustomerId || null,
        document_id: selectedDocId || null
      };

      if (isScheduled) {
        requestBody.scheduleAt = new Date(scheduleTime).toISOString();
      }

      const response = await api.post('/send-email', requestBody);

      if (response.data.success) {
        alert(response.data.scheduled ? "âœ… Email scheduled!" : "âœ… Email sent!");
        // Reset
        setSubject('');
        setRawBody('');
        setRecipientEmail('');
        setScheduleTime('');
        setSelectedCustomerId('');
        setSelectedTemplateId('');
        setResolvedSubject('');
        setResolvedBody('');
      } else {
        alert("âŒ " + (response.data.message || "Failed"));
      }
    } catch (err) {
      alert("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans text-[1rem]">
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-50">
        <div className="flex items-center gap-[0.5rem] text-[10px] uppercase font-black tracking-widest text-slate-400">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="text-slate-900">Send Email</span>
        </div>
        <div className="flex items-center gap-[1rem]">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center border border-emerald-200 text-emerald-700 font-bold">C</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[60rem] mx-auto">
        <div className="mb-8">
          <h2 className="text-[2rem] font-black text-slate-900 tracking-tight">Manual Notification</h2>
          <p className="text-slate-400 font-medium">Auto-fill templates directly from your customer database.</p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          
          {/* SELECTION CARD */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         <UserCheck size={14} className="text-[#10b981]" /> Target Customer
                      </label>
                      <select 
                        value={selectedCustomerId}
                        onChange={handleCustomerSelection}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#10b981] outline-none text-[0.9375rem] font-semibold bg-slate-50/30 transition-all"
                      >
                        <option value="">-- Choose Customer --</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                   </div>

                   {/* TARGET DOCUMENT DROPDOWN */}
                   <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         <AlertCircle size={14} className="text-amber-500" /> Target Document
                      </label>
                      <select 
                        value={selectedDocId} 
                        onChange={(e) => setSelectedDocId(e.target.value)}
                        disabled={!selectedCustomerId || customerDocs.length === 0}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-amber-500 outline-none text-[0.9375rem] font-semibold bg-slate-50/30 disabled:opacity-50 transition-all"
                      >
                        <option value="">{selectedCustomerId ? (customerDocs.length > 0 ? "-- Choose Document --" : "-- No Documents Found --") : "-- Select Customer First --"}</option>
                        {customerDocs.map(d => (
                          <option key={d.id} value={d.id}>{d.document_path ? d.document_path.split('/').pop() : `Doc #${d.id}`} ({d.doc_type || 'N/A'})</option>
                        ))}
                      </select>
                   </div>

                   <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         <FileText size={14} className="text-blue-500" /> Choose Template
                      </label>
                      <select 
                        value={selectedTemplateId} 
                        onChange={handleTemplateChange}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-[0.9375rem] font-semibold bg-slate-50/30 transition-all"
                      >
                        <option value="">-- Select Master Template --</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         <Mail size={14} className="text-slate-400" /> Recipient Email
                      </label>
                      <input 
                        type="email" 
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        placeholder="customer@email.com"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#10b981] outline-none text-[0.9375rem] font-semibold"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         <Send size={14} className="text-slate-400" /> Schedule (Optional)
                      </label>
                      <input 
                        type="datetime-local" 
                        value={scheduleTime}
                        onChange={(e) => setScheduleTime(e.target.value)}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#10b981] outline-none text-[0.9375rem] font-semibold"
                      />
                   </div>
                </div>
             </div>
          </div>

          {/* PREVIEW CARD */}
          <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-800">
             <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                   <Globe size={12} className="text-[#10b981] animate-spin-slow" /> Resolved Live Preview
                </span>
                <span className="text-[9px] font-bold text-slate-500 uppercase">Encrypted Connection</span>
             </div>
             
             <div className="bg-white m-4 rounded-xl overflow-hidden shadow-inner min-h-[400px]">
                {!selectedTemplateId ? (
                  <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                     <AlertCircle size={48} className="text-slate-200" />
                     <p className="text-slate-400 font-bold">Please select a customer and template to generate the preview.</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                     <div className="px-8 py-6 border-b border-slate-100 bg-slate-50/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-tighter">Subject</p>
                        <h3 className="text-xl font-bold text-slate-900">{resolvedSubject || subject}</h3>
                     </div>
                     <div className="flex-1 p-8 overflow-y-auto max-h-[500px]">
                        <div 
                          className="prose prose-slate max-w-none text-slate-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: resolvedBody || rawBody }} 
                        />
                     </div>
                  </div>
                )}
             </div>

             <div className="px-8 py-6 bg-slate-800/30 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse" />
                   <span className="text-[11px] font-bold text-slate-400">System Ready for Delivery</span>
                </div>
                <button 
                  onClick={handleSendEmail}
                  disabled={loading || !selectedTemplateId || !recipientEmail}
                  className="px-12 py-3.5 bg-[#10b981] hover:bg-[#0da976] disabled:bg-slate-700 text-white rounded-xl text-sm font-black transition-all active:scale-[0.98] shadow-lg shadow-emerald-900/20 flex items-center gap-3"
                >
                  {loading ? "Sending..." : <><Send size={18} /> {isScheduled ? "Schedule" : "Send Now"}</>}
                </button>
             </div>
          </div>

          <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-4">
             Note: Manual edits are disabled. To modify content, visit Notifications Templates.
          </p>

        </div>
      </div>
    </div>
  );
};

export default SendEmail;
