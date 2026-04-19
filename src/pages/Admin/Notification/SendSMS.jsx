import React, { useState, useEffect } from 'react';
import api from '../../../api/api'; 
import { 
  User, UserCheck, ChevronRight, MoreHorizontal, Globe,
  AlertCircle, Send, Layout, Smartphone, Calendar
} from 'lucide-react';

const SendSMS = () => {
  const [recipientNumber, setRecipientNumber] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data States
  const [templates, setTemplates] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerDocs, setCustomerDocs] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedDocId, setSelectedDocId] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  
  // Resolved State (from Backend)
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
       } catch (err) {
         console.error("Failed to fetch data:", err);
       }
    };
    fetchData();
  }, []);

  // Effect to Resolve Keywords via Backend (Universal Endpoint)
  useEffect(() => {
    const resolve = async () => {
      if (!selectedCustomerId && !messageBody) {
        setResolvedBody('');
        return;
      }

      try {
        const response = await api.post('/notifications/resolve-keywords', {
          body: messageBody,
          customer_id: selectedCustomerId || null,
          document_id: selectedDocId || null
        });
        
        if (response.data.success) {
          setResolvedBody(response.data.resolvedBody);
        }
      } catch (err) {
        console.error("Resolution failed:", err);
      }
    };

    const timer = setTimeout(resolve, 500); 
    return () => clearTimeout(timer);
  }, [messageBody, selectedCustomerId, selectedDocId]);

  // Handle template selection
  const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplateId(templateId);
    
    if (!templateId) {
      setMessageBody('');
      return;
    }
    
    const template = templates.find(t => t.id === parseInt(templateId));
    if (template) {
      // Use body for SMS
      setMessageBody(template.body.replace(/<[^>]+>/g, '')); // Strip HTML for SMS
    }
  };

  // Handle customer selection
  const handleCustomerSelection = async (e) => {
    const custId = e.target.value;
    setSelectedCustomerId(custId);
    setSelectedDocId('');
    setCustomerDocs([]);

    const customer = customers.find(c => String(c.id) === String(custId));
    if (customer) {
      setRecipientNumber(customer.contact || '');

      // Fetch docs
      try {
        const res = await api.get(`/notifications/customer-documents?customer_id=${custId}`);
        if(res.data.success) setCustomerDocs(res.data.documents);
      } catch (err) {
        console.error("Failed to fetch docs:", err);
      }
    }
  };

  const isScheduled = scheduleTime && scheduleTime.trim() !== '';

  const handleSendSMS = async () => {
    if (!messageBody.trim()) return alert("Please select a template or write a message");
    if (!recipientNumber.trim()) return alert("Please enter/select recipient number");

    if (isScheduled && new Date(scheduleTime) <= new Date()) {
      return alert("Scheduled time must be in the future");
    }

    setLoading(true);
    try {
      const payload = {
        to: recipientNumber.trim(),
        body: resolvedBody || messageBody.trim(), 
        customer_id: selectedCustomerId || null,
        document_id: selectedDocId || null
      };
      
      if (isScheduled) {
        payload.scheduleAt = new Date(scheduleTime).toISOString();
      }

      const response = await api.post('/send-sms', payload);
      
      if (response.data.success) {
        alert(response.data.scheduled ? "âœ… SMS scheduled!" : "âœ… SMS sent!");
        setRecipientNumber('');
        setMessageBody('');
        setScheduleTime('');
        setSelectedCustomerId('');
        setSelectedTemplateId('');
        setResolvedBody('');
      } else {
        alert("âŒ " + (response.data.message || "Failed"));
      }
    } catch (error) {
      console.error(error);
      alert("Error: " + (error.response?.data?.message || error.message));
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
          <span className="text-slate-900">Send SMS</span>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[60rem] mx-auto">
        <div className="mb-8">
          <h2 className="text-[2rem] font-black text-slate-900 tracking-tight">SMS Notification</h2>
          <p className="text-slate-400 font-medium">Reach your customers instantly with database-powered text messages.</p>
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
                         <Layout size={14} className="text-blue-500" /> SMS Template
                      </label>
                      <select 
                        value={selectedTemplateId} 
                        onChange={handleTemplateChange}
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-[0.9375rem] font-semibold bg-slate-50/30 transition-all"
                      >
                        <option value="">-- Select Template --</option>
                        {templates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                      </select>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         <Smartphone size={14} className="text-slate-400" /> Phone Number
                      </label>
                      <input 
                        type="text" 
                        value={recipientNumber}
                        onChange={(e) => setRecipientNumber(e.target.value)}
                        placeholder="+91 9876543210"
                        className="w-full p-4 border border-slate-200 rounded-xl focus:border-[#10b981] outline-none text-[0.9375rem] font-semibold"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                         <Calendar size={14} className="text-slate-400" /> Schedule (Optional)
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

          {/* PREVIEW CARD (SMS STYLE) */}
          <div className="flex justify-center py-4">
             <div className="w-full max-w-[400px] bg-slate-900 rounded-[2.5rem] p-4 shadow-2xl border-[6px] border-slate-800 relative">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-800 rounded-b-2xl z-10" />
                
                <div className="bg-white h-[600px] rounded-[1.8rem] overflow-hidden flex flex-col pt-8">
                   <div className="px-6 py-4 flex items-center gap-4 bg-slate-50/80 border-b border-slate-100">
                      <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold">
                        {recipientNumber ? recipientNumber.slice(-1) : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900">{recipientNumber || "Recipient"}</p>
                        <p className="text-[10px] text-[#10b981] font-bold">SMS - Online</p>
                      </div>
                   </div>

                   <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                      {!selectedTemplateId ? (
                         <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                            <AlertCircle size={40} className="text-slate-200" />
                            <p className="text-xs text-slate-400 font-bold">Select a customer and template to generate the SMS preview.</p>
                         </div>
                      ) : (
                         <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl rounded-tl-none shadow-sm animate-in slide-in-from-left-2 duration-300">
                            <p className="text-[0.875rem] text-slate-700 leading-relaxed font-semibold">
                               {resolvedBody || messageBody}
                            </p>
                            <div className="mt-2 flex justify-end">
                               <span className="text-[9px] text-emerald-600 font-bold tracking-tighter uppercase italic">Delivering from DB...</span>
                            </div>
                         </div>
                      )}
                   </div>

                   <div className="p-4 bg-white border-t border-slate-50 flex items-center gap-3">
                      <div className="flex-1 h-10 bg-slate-100 rounded-full px-4 flex items-center">
                         <span className="text-xs text-slate-400 font-medium">Text Message Resolved</span>
                      </div>
                      <button 
                        onClick={handleSendSMS}
                        disabled={loading || !selectedTemplateId || !recipientNumber}
                        className="w-10 h-10 bg-[#10b981] hover:bg-[#0da976] disabled:bg-slate-300 text-white rounded-full flex items-center justify-center transition-all active:scale-90 shadow-lg shadow-emerald-100"
                      >
                         {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send size={18} />}
                      </button>
                   </div>
                </div>
             </div>
          </div>

          <p className="text-center text-[11px] text-slate-400 font-bold uppercase tracking-widest mt-4">
             Note: SMS content is derived from master templates. Go to <span className="text-[#10b981] cursor-pointer hover:underline">Notification Templates</span> to edit.
          </p>

        </div>
      </div>
    </div>
  );
};

export default SendSMS;
