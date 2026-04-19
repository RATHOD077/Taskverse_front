import React, { useState, useEffect, useCallback } from "react";
import {
  Mail, Settings, Send, FileText, ChevronRight, MoreHorizontal,
  Save, Loader2, ArrowLeft, Eye, EyeOff, CheckCircle, XCircle,
  Users, Calendar, History, TestTube2, AlertTriangle, Shield ,Clock , User, Activity, Globe 
} from "lucide-react";
import api from "../../api/api";

// â”€â”€â”€ Pill Tab Button â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Tab = ({ active, onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[0.875rem] font-bold transition-all whitespace-nowrap shadow-sm
      ${active ? "bg-[#10b981] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
  >
    <Icon size={16} /> {label}
  </button>
);

const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };
  return { toast, show };
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NotificationTemplates = () => {
  const [activeTab, setActiveTab] = useState("templates");
  const { toast, show: showToast } = useToast();

  // â”€â”€ Templates state
  const [templates, setTemplates] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [templateForm, setTemplateForm] = useState({ name: "", type: "general", subject: "", body: "" });
  const [savingTemplate, setSavingTemplate] = useState(false);

  // â”€â”€ SMTP state
  const [smtpForm, setSmtpForm] = useState({
    smtp_host: "", smtp_port: "587", smtp_user: "",
    smtp_password: "", from_name: "TaskVerse", from_email: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [savingSmtp, setSavingSmtp] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);

  // â”€â”€ Team notification state (cascading)
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [userTasks, setUserTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState("");
  const [taskName, setTaskName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [sendingTask, setSendingTask] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // â”€â”€ Document notification state (cascading)
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerDocs, setCustomerDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [docExpiryDate, setDocExpiryDate] = useState("");
  const [docClientEmail, setDocClientEmail] = useState("");
  const [sendingDoc, setSendingDoc] = useState(false);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // â”€â”€ Logs state
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);

  // â”€â”€â”€ Fetch helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchTemplates = useCallback(async () => {
    try {
      const res = await api.get("/notifications/templates");
      setTemplates(res.data.templates || []);
    } catch { /* silent */ }
  }, []);

  const fetchSmtpSettings = useCallback(async () => {
    try {
      const res = await api.get("/notifications/smtp-settings");
      if (res.data.settings) {
        const s = res.data.settings;
        setSmtpForm({
          smtp_host: s.smtp_host || "",
          smtp_port: String(s.smtp_port || "587"),
          smtp_user: s.smtp_user || "",
          smtp_password: "",
          from_name: s.from_name || "TaskVerse",
          from_email: s.from_email || ""
        });
      }
    } catch { /* silent */ }
  }, []);

  const fetchSendData = useCallback(async () => {
    try {
      const [u, c] = await Promise.all([
        api.get("/notifications/users"),
        api.get("/notifications/customers")
      ]);
      setUsers(u.data.users || []);
      setCustomers(c.data.customers || []);
    } catch { /* silent */ }
  }, []);

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await api.get("/notifications/logs");
      setLogs(res.data.logs || []);
    } catch { /* silent */ }
    setLogsLoading(false);
  }, []);

  useEffect(() => {
    fetchTemplates();
    fetchSmtpSettings();
    fetchSendData();
  }, [fetchTemplates, fetchSmtpSettings, fetchSendData]);

  useEffect(() => {
    if (activeTab === "logs") fetchLogs();
  }, [activeTab, fetchLogs]);

  // â”€â”€â”€ When customer changes â†’ fetch their documents â”€â”€â”€â”€â”€
  useEffect(() => {
    setSelectedDoc("");
    setDocExpiryDate("");
    setDocClientEmail("");
    setCustomerDocs([]);
    if (!selectedCustomer) return;

    const load = async () => {
      setLoadingDocs(true);
      try {
        const res = await api.get(`/notifications/customer-documents?customer_id=${selectedCustomer}`);
        setCustomerDocs(res.data.documents || []);
      } catch { /* silent */ }
      setLoadingDocs(false);
    };
    load();
  }, [selectedCustomer]);

  // â”€â”€â”€ When document changes â†’ auto-fill expiry date â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!selectedDoc) { setDocExpiryDate(""); setDocClientEmail(""); return; }
    const doc = customerDocs.find(d => String(d.id) === String(selectedDoc));
    if (doc) {
      setDocExpiryDate(doc.validity ? doc.validity.split("T")[0] : "");
      setDocClientEmail(doc.client_email || "");
    }
  }, [selectedDoc, customerDocs]);

  // â”€â”€â”€ When team member changes â†’ fetch their tasks â”€â”€â”€â”€â”€
  useEffect(() => {
    setSelectedTask("");
    setTaskName("");
    setExpiryDate("");
    setUserTasks([]);
    if (!selectedUser) return;

    const loadTasks = async () => {
      setLoadingTasks(true);
      try {
        const res = await api.get(`/notifications/user-tasks?user_id=${selectedUser}`);
        setUserTasks(res.data.tasks || []);
      } catch { /* silent */ }
      setLoadingTasks(false);
    };
    loadTasks();
  }, [selectedUser]);

  // â”€â”€â”€ When task changes â†’ auto-fill expiry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (!selectedTask) { setTaskName(""); setExpiryDate(""); return; }
    const t = userTasks.find(ts => String(ts.id) === String(selectedTask));
    if (t) {
      setTaskName(t.task_name || "");
      setExpiryDate(t.expiry_date ? t.expiry_date.split("T")[0] : "");
    }
  }, [selectedTask, userTasks]);

  // â”€â”€â”€ Template actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const openEditTemplate = (tpl) => {
    setEditingTemplate(tpl);
    setIsCreating(false);
    setTemplateForm({ name: tpl.name, type: tpl.type, subject: tpl.subject, body: tpl.body });
  };

  const openCreateTemplate = () => {
    setEditingTemplate(null);
    setIsCreating(true);
    setTemplateForm({ name: "", type: "general", subject: "", body: "" });
  };

  const saveTemplate = async () => {
    if (!templateForm.name || !templateForm.subject || !templateForm.body) {
      showToast("Please fill all required fields", "error");
      return;
    }
    setSavingTemplate(true);
    try {
      if (isCreating) {
        await api.post("/notifications/templates", templateForm);
        showToast("Template created successfully");
        setIsCreating(false);
      } else {
        await api.put(`/notifications/templates/${editingTemplate.id}`, templateForm);
        showToast("Template saved successfully");
        setEditingTemplate(null);
      }
      fetchTemplates();
    } catch { showToast("Failed to save template", "error"); }
    setSavingTemplate(false);
  };

  const deleteTemplate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this master template?")) return;
    try {
      await api.delete(`/notifications/templates/${id}`);
      showToast("Template deleted successfully");
      fetchTemplates();
    } catch { showToast("Failed to delete template", "error"); }
  };

  // â”€â”€â”€ SMTP actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const saveSmtp = async (e) => {
    e.preventDefault();
    if (!smtpForm.smtp_password) { showToast("Please enter your SMTP password", "error"); return; }
    setSavingSmtp(true);
    try {
      await api.post("/notifications/smtp-settings", smtpForm);
      showToast("SMTP settings saved successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save SMTP settings", "error");
    }
    setSavingSmtp(false);
  };

  const sendTestEmail = async () => {
    if (!testEmail) { showToast("Enter a test email address", "error"); return; }
    setTestingEmail(true);
    try {
      await api.post("/notifications/smtp-settings/test", { test_email: testEmail });
      showToast(`Test email sent to ${testEmail}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send test email", "error");
    }
    setTestingEmail(false);
  };

  // â”€â”€â”€ Team notification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sendTaskNotification = async () => {
    if (!selectedUser) { showToast("Select a team member", "error"); return; }
    if (!selectedTask) { showToast("Select a task", "error"); return; }
    if (!expiryDate) { showToast("Task has no expiry date", "error"); return; }
    setSendingTask(true);
    try {
      const res = await api.post("/notifications/send-task-expiry", {
        user_ids: [selectedUser],
        task_name: taskName.trim(),
        expiry_date: expiryDate
      });
      showToast(`Sent to 1 member`);
      setSelectedUser(""); setSelectedTask(""); setTaskName(""); setExpiryDate("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send", "error");
    }
    setSendingTask(false);
  };

  // â”€â”€â”€ Document notification â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const sendDocumentNotification = async () => {
    if (!selectedDoc) { showToast("Select a document", "error"); return; }
    setSendingDoc(true);
    try {
      const res = await api.post("/notifications/send-document-expiry", { document_id: Number(selectedDoc) });
      showToast(res.data.message || "Notification sent");
      setSelectedCustomer(""); setSelectedDoc(""); setDocExpiryDate(""); setDocClientEmail("");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to send", "error");
    }
    setSendingDoc(false);
  };

  const VARS_TASK = ["{{name}}", "{{email}}", "{{task_name}}", "{{task_expiry}}", "{{task_desc}}"];
  const VARS_DOC  = ["{{name}}", "{{email}}", "{{document_name}}", "{{document_validity}}", "{{document_type}}"];

  // â”€â”€ Selected customer info
  const selCustomerObj = customers.find(c => String(c.id) === String(selectedCustomer));
  const selDocObj = customerDocs.find(d => String(d.id) === String(selectedDoc));

  // â”€â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-[0.875rem] font-bold
          ${toast.type === "error" ? "bg-rose-600 text-white" : "bg-[#10b981] text-white"}`}>
          {toast.type === "error" ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-10">
        <div className="hidden sm:flex items-center gap-[0.5rem] text-[0.7rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Notification Templates</span>
        </div>
        <div className="flex items-center gap-[1rem] ml-auto sm:ml-0">
          <button className="flex items-center gap-[0.5rem] px-[0.75rem] py-[0.375rem] border border-slate-200 rounded-lg text-[0.75rem] font-semibold bg-white">
            <Globe size={14} className="text-blue-500" /> EN 
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-[1rem]" />
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.75rem]">C</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem] mb-[1.5rem]">
          <div>
            <h1 className="text-[1.5rem] font-bold text-slate-900 flex items-center gap-3">
               Notifications & SMTP
            </h1>
            <p className="text-[0.875rem] text-slate-500 mt-1 font-medium">Manage email templates, SMTP settings, and send notifications to your team and clients.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Tab active={activeTab === "templates"} onClick={() => setActiveTab("templates")} icon={FileText} label="Email Templates" />
          <Tab active={activeTab === "smtp"} onClick={() => setActiveTab("smtp")} icon={Settings} label="SMTP Settings" />
          <Tab active={activeTab === "send"} onClick={() => setActiveTab("send")} icon={Send} label="Send Notifications" />
          <Tab active={activeTab === "logs"} onClick={() => setActiveTab("logs")} icon={History} label="Logs" />
        </div>

        {/* â•â•â• TAB 1: EMAIL TEMPLATES â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "templates" && (
          <div>
            {(editingTemplate || isCreating) ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[1.25rem] font-bold text-slate-900">
                    {isCreating ? "Create New Master Template" : `Edit: ${editingTemplate.name}`}
                  </h2>
                  <button onClick={() => { setEditingTemplate(null); setIsCreating(false); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[0.875rem] font-bold hover:bg-slate-50 shadow-sm transition-all active:scale-95">
                    <ArrowLeft size={16} /> Back
                  </button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-[1.25rem] border border-slate-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-slate-50 rounded-lg">
                             <FileText size={20} className="text-slate-700" />
                          </div>
                          <h3 className="font-bold text-slate-900">Template Definition</h3>
                        </div>
                        <button onClick={saveTemplate} disabled={savingTemplate}
                          className="flex items-center gap-2 bg-[#10b981] text-white px-6 py-2.5 rounded-xl text-[0.875rem] font-bold hover:bg-[#0da975] shadow-lg shadow-emerald-100 disabled:opacity-60 transition-all active:scale-95">
                          {savingTemplate ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                          {savingTemplate ? "Saving..." : "Save Master Template"}
                        </button>
                      </div>
                      <div className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1.5">
                            <label className="text-[0.875rem] font-bold text-slate-700">Internal Name</label>
                            <input type="text" value={templateForm.name}
                              onChange={e => setTemplateForm({ ...templateForm, name: e.target.value })}
                              placeholder="e.g. Birthday Card v1"
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[0.875rem] font-bold text-slate-700">Category / Type</label>
                            <select value={templateForm.type}
                              onChange={e => setTemplateForm({ ...templateForm, type: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]">
                              <option value="general">General Notification</option>
                              <option value="birthday">Birthday Wish</option>
                              <option value="task_expiry">Task Deadline</option>
                              <option value="document_expiry">Document Expiry</option>
                            </select>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.875rem] font-bold text-slate-700">Email Subject</label>
                          <input type="text" value={templateForm.subject}
                            onChange={e => setTemplateForm({ ...templateForm, subject: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[0.875rem] font-bold text-slate-700">Email Body (HTML supported)</label>
                          <textarea rows={12} value={templateForm.body}
                            onChange={e => setTemplateForm({ ...templateForm, body: e.target.value })}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem] font-mono resize-y" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-[1.25rem] border border-slate-100 shadow-sm self-start sticky top-24">
                    <div className="flex items-center gap-2 mb-4">
                       <Activity size={18} className="text-blue-500" />
                       <h3 className="font-bold text-slate-900">Universal Keywords</h3>
                    </div>
                    <p className="text-[0.75rem] text-slate-400 mb-4 font-medium uppercase tracking-wider">Click to copy</p>
                    <div className="space-y-2">
                      {["{{name}}", "{{client_name}}", "{{document_name}}", "{{document_validity}}", "{{task_name}}", "{{task_expiry}}", "{{employee_name}}"].map(v => (
                        <button key={v} onClick={() => { navigator.clipboard.writeText(v); showToast(`Copied ${v}`); }}
                          className="w-full p-4 border border-slate-100 rounded-xl hover:border-emerald-300 hover:bg-emerald-50 text-left transition-all group">
                          <code className="text-emerald-600 text-[0.875rem] font-bold font-mono group-hover:scale-105 inline-block transition-transform">{v}</code>
                        </button>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-amber-50 border border-amber-100 rounded-xl text-[0.75rem] text-amber-700 font-medium leading-relaxed">
                      <strong>Tip:</strong> These variables are replaced automatically using the <strong>Universal Keyword Engine</strong>. Wrap them in double curly braces.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between bg-white">
                  <div>
                    <h2 className="font-bold text-slate-900">Master Notification Templates</h2>
                    <p className="text-[0.75rem] text-slate-500 font-medium">Unified repository for all Email and SMS content</p>
                  </div>
                  <button onClick={openCreateTemplate}
                    className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[0.875rem] font-bold hover:bg-black shadow-lg shadow-slate-200 transition-all active:scale-95">
                    <Mail size={16} className="text-[#10b981]" /> Add New Template
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b border-slate-100">
                      <tr className="text-[0.6875rem] uppercase tracking-wider font-extrabold text-slate-400">
                        <th className="px-6 py-4">Template Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Subject Preview</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-[0.8125rem] divide-y divide-slate-50">
                      {templates.length === 0 ? (
                        <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-medium">No templates found.</td></tr>
                      ) : templates.map(t => (
                        <tr key={t.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-6 py-4 space-y-0.5">
                             <div className="font-bold text-slate-900">{t.name}</div>
                             <div className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">ID: MASTER_{t.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-md text-[0.6875rem] font-bold border uppercase
                              ${t.type === "task_expiry" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : 
                                t.type === "document_expiry" ? "bg-blue-50 text-blue-600 border-blue-100" :
                                t.type === "birthday" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                "bg-slate-50 text-slate-600 border-slate-100"}`}>
                              {t.type?.replace("_", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-medium max-w-xs truncate">{t.subject}</td>
                          <td className="px-6 py-4 text-right space-x-2">
                            <button onClick={() => openEditTemplate(t)}
                              className="px-[1rem] py-[0.5rem] bg-[#10b981] text-white rounded-lg text-[0.8125rem] font-bold hover:bg-[#0da975] shadow-sm transition-all active:scale-95 inline-flex items-center gap-2">
                              <Eye size={14} /> Edit
                            </button>
                            <button onClick={() => deleteTemplate(t.id)}
                              className="p-2.5 bg-white border border-slate-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all active:scale-90">
                              <XCircle size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* â•â•â• TAB 2: SMTP SETTINGS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "smtp" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-50 bg-white">
                  <h2 className="font-bold text-slate-900">SMTP Server Configuration</h2>
                  <p className="text-[0.75rem] text-slate-500 font-medium">Configure the outgoing email server for TaskVerse</p>
                </div>
                <form onSubmit={saveSmtp} className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[0.875rem] font-bold text-slate-700">SMTP Host *</label>
                      <input type="text" placeholder="smtp.gmail.com" value={smtpForm.smtp_host}
                        onChange={e => setSmtpForm({ ...smtpForm, smtp_host: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" required />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.875rem] font-bold text-slate-700">SMTP Port *</label>
                      <input type="number" placeholder="587" value={smtpForm.smtp_port}
                        onChange={e => setSmtpForm({ ...smtpForm, smtp_port: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.875rem] font-bold text-slate-700">SMTP Username / Email *</label>
                    <input type="email" placeholder="your@gmail.com" value={smtpForm.smtp_user}
                      onChange={e => setSmtpForm({ ...smtpForm, smtp_user: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[0.875rem] font-bold text-slate-700">SMTP Password / App Password *</label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="App password (not your Gmail password)"
                        value={smtpForm.smtp_password}
                        onChange={e => setSmtpForm({ ...smtpForm, smtp_password: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem] pr-12" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors">
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-[0.875rem] font-bold text-slate-700">From Name</label>
                      <input type="text" placeholder="TaskVerse" value={smtpForm.from_name}
                        onChange={e => setSmtpForm({ ...smtpForm, from_name: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[0.875rem] font-bold text-slate-700">From Email *</label>
                      <input type="email" placeholder="noreply@yourcompany.com" value={smtpForm.from_email}
                        onChange={e => setSmtpForm({ ...smtpForm, from_email: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" required />
                    </div>
                  </div>
                  <div className="flex justify-end pt-4">
                    <button type="submit" disabled={savingSmtp}
                      className="flex items-center gap-2 bg-[#10b981] text-white px-8 py-3 rounded-xl text-[0.875rem] font-bold hover:bg-[#0da975] shadow-lg shadow-emerald-100 disabled:opacity-60 transition-all active:scale-95">
                      {savingSmtp ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      {savingSmtp ? "Saving..." : "Save Configuration"}
                    </button>
                  </div>
                </form>
              </div>

              <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-2 bg-blue-50 rounded-lg">
                     <TestTube2 size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Send Test Email</h3>
                    <p className="text-[0.75rem] text-slate-500 font-medium">Verify your SMTP settings with a single click</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input type="email" placeholder="your@email.com" value={testEmail}
                    onChange={e => setTestEmail(e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]" />
                  <button onClick={sendTestEmail} disabled={testingEmail}
                    className="flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-3 rounded-xl text-[0.875rem] font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-60 whitespace-nowrap">
                    {testingEmail ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    {testingEmail ? "Sending..." : "Send Test"}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                   <Shield size={18} className="text-indigo-600" /> Gmail Setup
                </h3>
                <ol className="text-[0.8125rem] text-slate-600 space-y-3 font-medium">
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">1</span>
                    Enable 2-Step Verification
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">2</span>
                    Create an App Password
                  </li>
                  <li className="flex gap-3">
                    <span className="shrink-0 w-5 h-5 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-[10px] font-black">3</span>
                    Use the 16-char password here
                  </li>
                </ol>
                <div className="mt-6 p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                   <div className="flex justify-between text-[0.7rem] font-bold text-slate-400 uppercase">
                     <span>Host</span>
                     <span className="text-slate-900">smtp.gmail.com</span>
                   </div>
                   <div className="flex justify-between text-[0.7rem] font-bold text-slate-400 uppercase">
                     <span>Port</span>
                     <span className="text-slate-900">587</span>
                   </div>
                </div>
              </div>
              
              <div className="bg-emerald-50 border border-emerald-100 rounded-[1.25rem] p-6">
                <div className="flex items-center gap-2 text-emerald-800 font-bold mb-2">
                  <Clock size={16} />
                  <span className="text-[0.875rem]">Auto Scheduler</span>
                </div>
                <p className="text-[0.75rem] text-emerald-700/80 font-medium leading-relaxed">
                  System automatically scans records daily at <strong>8:00 AM IST</strong> to notify relevant parties.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* â•â•â• TAB 3: SEND NOTIFICATIONS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "send" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* â”€â”€ Team / Employee â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-emerald-50 bg-emerald-50/30">
                <h2 className="font-bold text-emerald-900 flex items-center gap-2 text-[1.125rem]">
                  <Users size={20} /> Team Notification
                </h2>
                <p className="text-[0.75rem] text-emerald-700 font-medium">Manual task expiry alerts for team members</p>
              </div>

              <div className="p-6 space-y-6">

                {/* Step 1 "” Select Team Member */}
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-black text-slate-400 uppercase tracking-widest">1. Select Team Member</label>
                  <select value={selectedUser} onChange={e => setSelectedUser(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]">
                    <option value="">Choose team member...</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.username}</option>
                    ))}
                  </select>
                </div>

                {/* Step 2 "” Select Task */}
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-black text-slate-400 uppercase tracking-widest">2. Select Task</label>
                  <div className="relative">
                    <select value={selectedTask} onChange={e => setSelectedTask(e.target.value)}
                      disabled={!selectedUser}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem] disabled:opacity-50 appearance-none">
                      <option value="">
                        {!selectedUser ? "Select a team member first" : userTasks.length === 0 ? "No tasks found" : "Choose task..."}
                      </option>
                      {userTasks.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.task_name}
                        </option>
                      ))}
                    </select>
                    {loadingTasks && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-emerald-400" size={16} />}
                  </div>
                </div>

                {/* Step 3 "” Expiry Date (auto-filled, read-only) */}
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-black text-slate-400 uppercase tracking-widest flex justify-between">
                    <span>3. Expiry Date</span>
                    <span className="text-[0.7rem] text-slate-400 font-normal italic lowercase">Auto-filled</span>
                  </label>
                  <input type="date" value={expiryDate} readOnly
                    className="w-full px-4 py-3 bg-slate-50 opacity-70 border border-dashed border-slate-200 rounded-xl focus:outline-none text-[0.875rem] text-slate-500 cursor-not-allowed" />
                </div>

                <div className="pt-2">
                  <button onClick={sendTaskNotification} disabled={sendingTask || !selectedTask}
                    className="w-full flex items-center justify-center gap-3 bg-[#10b981] text-white py-4 rounded-xl text-[0.875rem] font-bold hover:bg-[#0da975] shadow-lg shadow-emerald-100 disabled:opacity-60 transition-all active:scale-95">
                    {sendingTask ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                    {sendingTask ? "Processing..." : "Notify Team Member"}
                  </button>
                </div>
              </div>
            </div>

            {/* â”€â”€ Client / Document â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-emerald-50 bg-emerald-50/30">
                <h2 className="font-bold text-emerald-900 flex items-center gap-2 text-[1.125rem]">
                  <FileText size={20} /> Client Notification
                </h2>
                <p className="text-[0.75rem] text-emerald-700 font-medium">Send document validity reminders</p>
              </div>

              <div className="p-6 space-y-6">

                {/* Step 1 "” Select Customer */}
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-black text-slate-400 uppercase tracking-widest">1. Select Customer</label>
                  <select value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem]">
                    <option value="">Choose customer...</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Step 2 "” Select Document */}
                <div className="space-y-1.5">
                  <label className="text-[0.8125rem] font-black text-slate-400 uppercase tracking-widest">2. Select Document</label>
                  <div className="relative">
                    <select value={selectedDoc} onChange={e => setSelectedDoc(e.target.value)}
                      disabled={!selectedCustomer}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[0.875rem] disabled:opacity-50 appearance-none">
                      <option value="">
                        {!selectedCustomer ? "Select a customer first" : customerDocs.length === 0 ? "No documents found" : "Choose document..."}
                      </option>
                      {customerDocs.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.document_path?.split("/").pop() || "Untitled Document"}
                        </option>
                      ))}
                    </select>
                    {loadingDocs && <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-emerald-400" size={16} />}
                  </div>
                </div>

                {/* Info Card */}
                {selDocObj ? (
                  <div className="p-5 bg-white border border-slate-100 rounded-[1rem] shadow-sm flex items-start gap-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-3 bg-emerald-50 rounded-xl">
                       <Calendar size={24} className="text-emerald-600" />
                    </div>
                    <div className="min-w-0 space-y-1">
                      <h4 className="text-[0.875rem] font-bold text-slate-900 truncate">Reminder Details</h4>
                      <p className="text-[0.75rem] text-slate-400 font-medium">Valid until: <span className="text-slate-900 font-bold">{docExpiryDate ? new Date(docExpiryDate).toLocaleDateString("en-IN") : "N/A"}</span></p>
                      <p className="text-[0.75rem] text-slate-400 font-medium truncate">Sending to: <span className="text-emerald-600 font-bold">{docClientEmail || "No email address"}</span></p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 bg-slate-50/50 border border-dashed border-slate-200 rounded-[1rem] flex items-center justify-center">
                    <p className="text-[0.75rem] text-slate-400 font-bold uppercase tracking-widest">Select document to preview</p>
                  </div>
                )}

                <div className="pt-2">
                  <button onClick={sendDocumentNotification} disabled={sendingDoc || !selectedDoc}
                    className="w-full flex items-center justify-center gap-3 bg-[#10b981] text-white py-4 rounded-xl text-[0.875rem] font-bold hover:bg-[#0da975] shadow-lg shadow-emerald-100 disabled:opacity-60 transition-all active:scale-95">
                    {sendingDoc ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
                    {sendingDoc ? "Sending..." : "Notify Client"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* â•â•â• TAB 4: LOGS â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
        {activeTab === "logs" && (
          <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-300">
            <div className="px-6 py-5 border-b border-slate-50 bg-white flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Notification Logs</h2>
                <p className="text-[0.75rem] text-slate-500 font-medium">History of messages sent from TaskVerse</p>
              </div>
              <button onClick={fetchLogs}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[0.8125rem] font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95 shadow-sm flex items-center gap-2">
                <History size={14} /> Refresh Logs
              </button>
            </div>
            {logsLoading ? (
              <div className="p-16 text-center text-slate-400 font-medium flex items-center justify-center gap-3">
                <Loader2 size={20} className="animate-spin text-emerald-500" /> Fetching latest logs...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr className="text-[0.6875rem] uppercase tracking-wider font-extrabold text-slate-400">
                      <th className="px-6 py-4 text-center w-12">#</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Recipient</th>
                      <th className="px-6 py-4">Subject</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Sent At</th>
                    </tr>
                  </thead>
                  <tbody className="text-[0.8125rem] divide-y divide-slate-50">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-slate-400 font-medium italic">No activity recorded yet.</td>
                      </tr>
                    ) : logs.map((log, idx) => (
                      <tr key={log.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-6 py-4 text-center font-bold text-slate-900">{idx + 1}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[0.6875rem] font-bold border uppercase
                            ${log.type === "task_expiry" ? "bg-indigo-50 text-indigo-600 border-indigo-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>
                            {log.type === "task_expiry" ? "Task" : "Doc"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{log.recipient_name}</div>
                          <div className="text-[0.7rem] text-slate-400 font-medium font-mono">{log.recipient_email}</div>
                        </td>
                        <td className="px-6 py-4 text-slate-600 font-medium max-w-xs truncate">{log.subject}</td>
                        <td className="px-6 py-4">
                           <span className={`px-3 py-1 rounded-md text-[0.6875rem] font-bold border uppercase inline-flex items-center gap-1
                            ${log.status === "sent" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"}`}>
                            {log.status === "sent" ? <CheckCircle size={10} /> : <XCircle size={10} />}
                            {log.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400 font-medium whitespace-nowrap italic text-xs">
                          {new Date(log.sent_at).toLocaleString("en-IN", { 
                            dateStyle: 'medium', 
                            timeStyle: 'short' 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationTemplates;
