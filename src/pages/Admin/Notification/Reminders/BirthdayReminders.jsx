import React, { useState, useEffect } from 'react';
import {
  Cake,
  FileText,
  Clock,
  CalendarDays,
  Mail,
  Smartphone,
  Play,
  Save,
  ToggleLeft,
  ToggleRight,
  BookOpen,
  ChevronRight,
  MoreHorizontal,
  Info,
  RefreshCw,
  CheckCircle,
  XCircle,
  Zap,
  Bell,
  Settings,
} from 'lucide-react';
import api from '../../../../api/api';

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const KEYWORD_DICTIONARY = [
  {
    group: 'Universal',
    keywords: [
      { key: '{{name}}',    desc: 'Full name (Customer or Employee)' },
      { key: '{{email}}',   desc: 'Email address' },
      { key: '{{contact}}', desc: 'Phone number' },
    ],
  },
  {
    group: 'Document',
    keywords: [
      { key: '{{document_name}}',     desc: 'Name of the expiring file' },
      { key: '{{document_validity}}', desc: 'Expiry date of document' },
      { key: '{{document_type}}',     desc: 'Category (e.g. GST, PAN)' },
    ],
  },
  {
    group: 'Task',
    keywords: [
      { key: '{{task_name}}',   desc: 'Title of the task' },
      { key: '{{task_expiry}}', desc: 'Task deadline date' },
      { key: '{{task_desc}}',   desc: 'Task description' },
    ],
  },
  {
    group: 'System',
    keywords: [
      { key: '{{system_date}}', desc: "Today's date" },
    ],
  },
];

const REMINDER_METADATA = {
  birthday_client: {
    label: 'Client Birthdays',
    desc:  'Sent to clients on their birth date.',
    icon:  <Cake size={20} />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  birthday_employee: {
    label: 'Employee Birthdays',
    desc:  'Sent to employees on their birth date.',
    icon:  <Cake size={20} />,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  },
  document_expiry_15d: {
    label: 'Document Expiry (15 days)',
    desc:  'Notifies clients 15 days before document validity ends.',
    icon:  <FileText size={20} />,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  document_expiry_10d: {
    label: 'Document Expiry (10 days)',
    desc:  'Notifies clients 10 days before document validity ends.',
    icon:  <FileText size={20} />,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  document_expiry_5d: {
    label: 'Document Expiry (5 days)',
    desc:  'Notifies clients 5 days before document validity ends.',
    icon:  <FileText size={20} />,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-100',
  },
  task_reminder_7d: {
    label: 'Task Deadline (7 days)',
    desc:  'Reminds employees 7 days before task is due.',
    icon:  <CalendarDays size={20} />,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    badge: 'bg-blue-50 text-blue-700 border-blue-100',
  },
  task_reminder_1d: {
    label: 'Final Task Reminder (24h)',
    desc:  'Last-minute reminder sent 1 day before deadline.',
    icon:  <Clock size={20} />,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-100',
  },
};

// â”€â”€â”€ Toast â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const useToast = () => {
  const [toast, setToast] = useState(null);
  const show = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };
  return { toast, show };
};

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AutomatedReminders = () => {
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(null); // id of saving row
  const [testing, setTesting]     = useState(false);
  const [templates, setTemplates] = useState([]);
  const [settings, setSettings]   = useState([]);
  const [showDict, setShowDict]   = useState(false);
  const { toast, show: showToast } = useToast();

  useEffect(() => { fetchInitialData(); }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [tplRes, setRes] = await Promise.all([
        api.get('/notifications/templates'),
        api.get('/reminders/settings'),
      ]);
      if (tplRes.data.success) setTemplates(tplRes.data.templates);
      if (setRes.data.success)  setSettings(setRes.data.settings);
    } catch {
      showToast('Failed to load reminder data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (setting) => {
    const updated = { ...setting, is_enabled: !setting.is_enabled };
    setSettings(prev => prev.map(s => s.id === setting.id ? updated : s));
    try {
      await api.put(`/reminders/settings/${setting.id}`, updated);
      showToast(updated.is_enabled ? 'Automation enabled' : 'Automation disabled');
    } catch {
      // revert
      setSettings(prev => prev.map(s => s.id === setting.id ? setting : s));
      showToast('Failed to update', 'error');
    }
  };

  const handleSave = async (setting) => {
    setSaving(setting.id);
    try {
      await api.put(`/reminders/settings/${setting.id}`, setting);
      showToast('Settings saved successfully');
    } catch {
      showToast('Failed to save settings', 'error');
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (id, field, value) => {
    setSettings(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleTestNow = async () => {
    if (!window.confirm('This will scan the database and dispatch matching notifications for all enabled automations right now. Continue?')) return;
    setTesting(true);
    try {
      const res = await api.post('/reminders/test-trigger');
      showToast(res.data.message || 'Automation scan complete. Check logs for results.');
    } catch {
      showToast('Test trigger failed', 'error');
    } finally {
      setTesting(false);
    }
  };

  const getMeta = (type) => REMINDER_METADATA[type] || {
    label:      type.replace(/_/g, ' '),
    desc:       'Automated notification.',
    icon:       <Bell size={20} />,
    iconBg:     'bg-slate-50',
    iconColor:  'text-slate-600',
    badge:      'bg-slate-50 text-slate-700 border-slate-100',
  };

  const enabledCount = settings.filter(s => s.is_enabled).length;

  // â”€â”€â”€ Loading skeleton â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-[#FDFDFD]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#10b981]" />
          <p className="text-[0.8125rem] font-bold text-slate-400 uppercase tracking-widest">Loading Automations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#FDFDFD] font-sans text-[#1A1C1E]">

      {/* â”€â”€ Toast â”€â”€ */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl text-[0.875rem] font-bold transition-all
          ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-[#10b981] text-white'}`}>
          {toast.type === 'error' ? <XCircle size={18} /> : <CheckCircle size={18} />}
          {toast.msg}
        </div>
      )}

      {/* â”€â”€ Sticky Header â”€â”€ */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-10">
        <div className="hidden sm:flex items-center gap-[0.5rem] text-[0.7rem] text-slate-400 font-medium">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer" />
          <ChevronRight size={12} />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span>Notifications</span>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Automatic Reminders</span>
        </div>
        <div className="flex items-center gap-3 ml-auto sm:ml-0">
          <button
            onClick={() => setShowDict(!showDict)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-[0.75rem] font-bold transition-all
              ${showDict ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
          >
            <BookOpen size={14} /> Keyword Guide
          </button>
          <button
            onClick={fetchInitialData}
            className="p-2 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-all text-slate-500"
          >
            <RefreshCw size={16} />
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.75rem]">A</div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[100rem] mx-auto">

        {/* â”€â”€ Page Title â”€â”€ */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[1rem] mb-[2rem]">
          <div>
            <div className="flex items-center gap-[0.5rem] mb-[0.5rem] text-slate-400">
              <Zap size={16} />
              <span className="text-[0.8125rem] font-semibold uppercase tracking-wider">Automation Engine</span>
            </div>
            <h1 className="text-[1.5rem] md:text-[1.875rem] font-bold text-[#1A1C1E]">
              Automatic Reminders
            </h1>
            <p className="text-[0.875rem] text-slate-400 font-medium mt-1">
              Background bots that scan your database daily at <strong className="text-slate-600">8:00 AM</strong> and deliver Email / SMS alerts automatically.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {/* Live Indicator */}
            <div className="bg-white border border-slate-100 rounded-[0.75rem] px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse ring-4 ring-emerald-100" />
              <div>
                <p className="text-[0.6rem] font-black text-slate-400 uppercase tracking-widest leading-none">Status</p>
                <p className="text-[0.8125rem] font-bold text-slate-800">Operational</p>
              </div>
            </div>

            {/* Trigger Now */}
            <button
              onClick={handleTestNow}
              disabled={testing}
              className="flex items-center gap-2 px-[1rem] py-[0.625rem] bg-slate-900 text-white rounded-[0.75rem] text-[0.875rem] font-bold hover:bg-black transition-all shadow-sm active:scale-95 disabled:opacity-60"
            >
              {testing
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <Play size={16} />}
              {testing ? 'Scanning...' : 'Trigger Now'}
            </button>
          </div>
        </div>

        {/* â”€â”€ Stats Row â”€â”€ */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-[1rem] mb-[2rem]">
          {[
            { label: 'Total Bots',    value: settings.length,   sub: 'configured',    iconBg: 'bg-slate-50',    icon: <Settings size={22} className="text-slate-600" /> },
            { label: 'Active',        value: enabledCount,       sub: 'running daily', iconBg: 'bg-emerald-50',  icon: <CheckCircle size={22} className="text-emerald-600" /> },
            { label: 'Inactive',      value: settings.length - enabledCount, sub: 'paused', iconBg: 'bg-slate-50', icon: <XCircle size={22} className="text-slate-400" /> },
            { label: 'Templates',     value: templates.length,  sub: 'master templates', iconBg: 'bg-blue-50',  icon: <FileText size={22} className="text-blue-600" /> },
          ].map((c, i) => (
            <div key={i} className="bg-white p-[1.25rem] rounded-[1.25rem] border border-slate-100 shadow-sm flex justify-between items-start hover:shadow-md transition-all">
              <div>
                <p className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-wider mb-[0.375rem]">{c.label}</p>
                <p className="text-[1.75rem] font-black text-slate-900">{c.value}</p>
                <p className="text-[0.6875rem] text-slate-400 font-medium mt-1">{c.sub}</p>
              </div>
              <div className={`w-[3rem] h-[3rem] shrink-0 rounded-[0.875rem] ${c.iconBg} flex items-center justify-center`}>
                {c.icon}
              </div>
            </div>
          ))}
        </div>

        {/* â”€â”€ Main Layout â”€â”€ */}
        <div className="flex flex-col lg:flex-row gap-[1.5rem] items-start">

          {/* TABLE */}
          <div className="flex-1 bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden min-w-0">
            <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900">Reminder Configurations</h2>
                <p className="text-[0.75rem] text-slate-400 font-medium mt-0.5">Select a Master Template and delivery channel for each bot</p>
              </div>
              <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[0.75rem] font-black">
                {enabledCount}/{settings.length} Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr className="text-[0.6875rem] uppercase tracking-wider font-extrabold text-slate-400">
                    <th className="px-6 py-4">Automation Bot</th>
                    <th className="px-6 py-4">Master Template</th>
                    <th className="px-6 py-4">Channel</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-[0.8125rem]">
                  {settings.map((setting) => {
                    const meta = getMeta(setting.type);
                    return (
                      <tr key={setting.id} className="hover:bg-slate-50/30 transition-colors group">

                        {/* Bot Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-[2.5rem] h-[2.5rem] shrink-0 rounded-[0.75rem] ${meta.iconBg} flex items-center justify-center ${meta.iconColor} group-hover:scale-105 transition-transform`}>
                              {meta.icon}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 leading-tight">{meta.label}</p>
                              <p className="text-[0.6875rem] text-slate-400 font-medium mt-0.5 max-w-[12rem] truncate">{meta.desc}</p>
                            </div>
                          </div>
                        </td>

                        {/* Template Picker */}
                        <td className="px-6 py-4">
                          <select
                            value={setting.template_id || ''}
                            onChange={(e) => handleChange(setting.id, 'template_id', e.target.value)}
                            className={`px-3 py-2.5 border rounded-xl outline-none text-[0.8125rem] font-semibold bg-slate-50/50 transition-all w-full max-w-[200px]
                              ${setting.template_id ? 'border-slate-200 text-slate-800' : 'border-dashed border-slate-200 text-slate-400'}
                              focus:bg-white focus:border-[#10b981]`}
                          >
                            <option value="">-- Select Template --</option>
                            {templates.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                          </select>
                        </td>

                        {/* Channel Pills */}
                        <td className="px-6 py-4">
                          <div className="flex gap-1.5">
                            {['email', 'sms', 'both'].map(ch => (
                              <button
                                key={ch}
                                onClick={() => handleChange(setting.id, 'channel', ch)}
                                className={`px-3 py-1.5 rounded-lg text-[0.6875rem] font-black uppercase tracking-tight transition-all border
                                  ${setting.channel === ch
                                    ? 'bg-slate-900 border-slate-900 text-white'
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}
                              >
                                {ch === 'email' ? <Mail size={10} className="inline mr-1" /> : ch === 'sms' ? <Smartphone size={10} className="inline mr-1" /> : null}
                                {ch}
                              </button>
                            ))}
                          </div>
                        </td>

                        {/* Toggle */}
                        <td className="px-6 py-4 text-center">
                          <button onClick={() => handleToggle(setting)} className="transition-all">
                            {setting.is_enabled
                              ? <ToggleRight size={36} className="text-[#10b981]" />
                              : <ToggleLeft  size={36} className="text-slate-200 hover:text-slate-300" />}
                          </button>
                        </td>

                        {/* Save */}
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => handleSave(setting)}
                            disabled={saving === setting.id}
                            className="inline-flex items-center gap-2 px-[1rem] py-[0.5rem] bg-[#10b981] text-white rounded-lg text-[0.8125rem] font-bold hover:bg-[#0da975] shadow-sm transition-all active:scale-95 disabled:opacity-60 whitespace-nowrap"
                          >
                            {saving === setting.id
                              ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              : <Save size={13} />}
                            {saving === setting.id ? 'Saving...' : 'Save'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}

                  {settings.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-16 text-center text-slate-400 font-medium italic">
                        No automations configured yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* â”€â”€ Keyword Dictionary Sidebar â”€â”€ */}
          {showDict && (
            <div className="lg:w-[280px] w-full bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden sticky top-24 animate-in slide-in-from-right-4 duration-300">
              <div className="px-5 py-4 border-b border-slate-50 flex items-center gap-2">
                <BookOpen size={16} className="text-indigo-500" />
                <h3 className="font-bold text-slate-900 text-[0.9375rem]">Keyword Guide</h3>
              </div>
              <div className="p-5 space-y-5 max-h-[500px] overflow-y-auto">
                <p className="text-[0.75rem] text-slate-400 font-medium leading-relaxed">
                  Use these in your templates. The engine resolves them from the database at send time.
                </p>
                {KEYWORD_DICTIONARY.map(grp => (
                  <div key={grp.group}>
                    <p className="text-[0.6875rem] font-black text-slate-400 uppercase tracking-widest mb-2">{grp.group}</p>
                    <div className="space-y-1.5">
                      {grp.keywords.map(k => (
                        <button
                          key={k.key}
                          onClick={() => { navigator.clipboard.writeText(k.key); showToast(`Copied ${k.key}`); }}
                          className="w-full p-3 border border-slate-100 rounded-xl hover:border-emerald-200 hover:bg-emerald-50 text-left transition-all group/kw"
                        >
                          <code className="text-emerald-600 text-[0.8125rem] font-black font-mono block">{k.key}</code>
                          <p className="text-[0.6875rem] text-slate-400 font-medium mt-0.5">{k.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl flex gap-2">
                  <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-[0.6875rem] text-amber-700 font-medium leading-relaxed">
                    Wrap all keywords in <strong>{"{{double braces}}"}</strong>. They are case-sensitive.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* â”€â”€ Info Footer Banner â”€â”€ */}
        <div className="mt-[2rem] bg-white rounded-[1.25rem] border border-slate-100 p-[1.5rem] shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-[1.25rem]">
          <div className="p-[0.875rem] bg-emerald-50 rounded-[1rem] shrink-0">
            <CalendarDays size={28} className="text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Zero-Input Smart Delivery</h3>
            <p className="text-[0.8125rem] text-slate-400 font-medium leading-relaxed max-w-3xl">
              When a bot triggers, it automatically looks up related records "” fetching the client name from the Customer table, the expiry date from the Document record "” and populates your template flawlessly. No manual data entry needed.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AutomatedReminders;
