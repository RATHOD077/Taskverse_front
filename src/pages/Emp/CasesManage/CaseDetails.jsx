import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ArrowLeft, Globe, Search, Filter, ChevronDown, ChevronsUpDown,
  Eye, Edit2, Trash2, Plus, Download, RefreshCw
} from 'lucide-react';
import api from '../../../api/api';

const TABS = ['Timeline', 'Documents', 'Notes', 'Research Projects'];

export default function CaseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Timeline');

  // Fetch real case data from DB
  useEffect(() => {
    async function fetchCase() {
      try {
        const res = await api.get(`/cases/${id}`);
        if (res.data.success) {
          setCaseData(res.data.case);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCase();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-[#fcfcfc] flex items-center justify-center p-8 text-slate-400 font-bold tracking-widest uppercase text-sm">
        Loading Case Details...
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="flex-1 min-h-screen bg-[#fcfcfc] flex items-center justify-center flex-col gap-4 p-8">
        <h2 className="text-xl font-bold text-slate-700">Case not found.</h2>
        <button onClick={() => navigate('/emp/cases')} className="px-4 py-2 bg-[#10b981] text-white rounded-lg font-bold text-sm">Return to Cases</button>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans relative flex flex-col">
      {/* BREADCRUMB HEADER */}
      <header className="h-16 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 shrink-0">
        <div className="flex items-center gap-1 md:gap-2 text-[0.6875rem] text-slate-400 font-medium whitespace-nowrap">
          <span>Dashboard</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate('/emp/cases')}>Case Management</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="cursor-pointer hover:text-slate-600" onClick={() => navigate('/emp/cases')}>Cases</span>
          <ChevronRight size={12} className="shrink-0" />
          <span className="text-slate-900 font-bold">{caseData.case_id}</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 transition-all">
            <Globe size={14} className="text-blue-500" /> English
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4 h-2.5" />
          </button>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[100rem] mx-auto w-full flex-1 flex flex-col gap-6 overflow-x-hidden">
        
        {/* TOP TITLE ROW */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold text-slate-900">
            {caseData.title} <span className="text-slate-500 font-medium">({caseData.case_id})</span>
          </h1>
          <button 
            onClick={() => navigate('/emp/cases')}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
          >
            <ArrowLeft size={16} /> Back
          </button>
        </div>

        {/* DETAILS CARD */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {/* General Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 p-6 border-b border-slate-100">
            <div>
              <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Client:</p>
              <p className="text-sm font-semibold text-slate-700">{caseData.client_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Case Type:</p>
              <p className="text-sm font-semibold text-slate-700">{caseData.case_type || 'N/A'}</p>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Filing Date:</p>
              <p className="text-sm font-semibold text-slate-700">
                {caseData.filing_date ? new Date(caseData.filing_date).toISOString().split('T')[0] : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Expected Completion:</p>
              <p className="text-sm font-semibold text-slate-700">2025-09-28</p> {/* Mocked for UI parity */}
            </div>
            <div className="flex flex-col gap-3">
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Status:</p>
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-green-50 text-green-600 border border-green-200">
                  {caseData.active_status || 'Active'}
                </span>
              </div>
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Priority:</p>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${caseData.priority === 'High' ? 'bg-red-50 text-red-500 border-red-200' : 'bg-orange-50 text-orange-500 border-orange-200'}`}>
                  {caseData.priority || 'Medium'}
                </span>
              </div>
            </div>
          </div>

          {/* General Row 2 (Court Details - Mocked for UI Parity) */}
          <div className="p-6 border-b border-slate-100">
            <h4 className="text-[0.8rem] text-slate-500 font-bold mb-4">Court Details:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Court Name:</p>
                <p className="text-sm font-semibold text-slate-700">Family Court North #8</p>
              </div>
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Court Type:</p>
                <p className="text-sm font-semibold text-slate-700">Tax Court</p>
              </div>
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Address:</p>
                <p className="text-sm font-semibold text-slate-700">800 Justice Avenue, District 8, NY 10008</p>
              </div>
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Phone:</p>
                <p className="text-sm font-semibold text-slate-700">+1-555-0028</p>
              </div>
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Jurisdiction:</p>
                <p className="text-sm font-semibold text-slate-700">Richmond County</p>
              </div>
              <div>
                <p className="text-[0.7rem] font-medium text-slate-400 mb-1">Email:</p>
                <p className="text-sm font-semibold text-slate-700">court8@company.gov</p>
              </div>
            </div>
          </div>

          {/* General Row 3 (Description) */}
          <div className="p-6">
            <h4 className="text-[0.8rem] text-slate-500 font-bold mb-2">Description:</h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {caseData.description || 'Legal case #1 for Company. This case involves complex legal matters requiring professional attention and expertise.'}
            </p>
          </div>
        </div>

        {/* TABS HEADER */}
        <div className="flex items-center gap-6 border-b border-slate-200 mt-2">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`pb-3 text-sm font-bold transition-all relative ${
                activeTab === t ? 'text-[#10b981]' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {t}
              {activeTab === t && (
                <span className="absolute bottom-[-1px] left-0 w-full h-[2px] bg-[#10b981] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          {activeTab === 'Timeline' && <TimelineTab />}
          {activeTab === 'Documents' && <DocumentsTab />}
          {activeTab === 'Notes' && <NotesTab />}
          {activeTab === 'Research Projects' && <div className="p-16 text-center text-slate-400 font-bold uppercase text-sm">Under Construction</div>}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ TAB COMPONENTS (MOCKED EXACTLY AS IMAGES) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TimelineTab() {
  const events = [
    { title: 'Final Hearing', type: 'Hearing', date: '2025-09-20', completed: 'No', status: 'Active', color: 'bg-red-50 text-red-500' },
    { title: 'Document Submission', type: 'Deadline', date: '2025-08-28', completed: 'No', status: 'Active', color: 'bg-yellow-50 text-yellow-600' },
    { title: 'First Hearing', type: 'Hearing', date: '2025-08-06', completed: 'Yes', status: 'Active', color: 'bg-red-50 text-red-500' },
    { title: 'Case Filed', type: 'Milestone', date: '2025-07-22', completed: 'Yes', status: 'Active', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="flex flex-col flex-1">
      <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 w-full sm:w-auto">Timeline</h2>
        <button className="bg-[#10b981] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0da975] self-end sm:self-auto shrink-0 w-full sm:w-auto">
          <Plus size={16} /> Add Event
        </button>
      </div>

      <Toolbar />

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[0.6875rem] uppercase tracking-wider font-bold text-slate-500">
              <th className="px-6 py-4 w-10">#</th>
              <th className="px-4 py-4 cursor-pointer hover:text-slate-700">Title <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
              <th className="px-4 py-4">Event Type</th>
              <th className="px-4 py-4 cursor-pointer hover:text-slate-700">Event Date <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
              <th className="px-4 py-4">Completed</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {events.map((e, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{i + 1}</td>
                <td className="px-4 py-4 font-bold text-slate-700">{e.title}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-[0.65rem] font-bold ${e.color}`}>{e.type}</span>
                </td>
                <td className="px-4 py-4 text-slate-500 font-medium">{e.date}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-2 py-0.5 rounded text-[0.65rem] font-bold border ${e.completed === 'Yes' ? 'border-green-200 bg-green-50 text-green-600' : 'border-yellow-200 bg-yellow-50 text-yellow-600'}`}>
                    {e.completed}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="inline-block px-2.5 py-0.5 rounded-full border border-green-200 bg-green-50 text-[0.65rem] font-bold text-green-600">
                    {e.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-right">
                  <ActionButtons />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination label={`Showing 1 to ${events.length} of ${events.length} timeline events`} />
    </div>
  );
}

function DocumentsTab() {
  const docs = [
    { name: 'Witness Statements', type: '-', limit: 'Privileged', date: '2025-08-21', color: 'bg-red-50 text-red-500' },
    { name: 'Legal Research Report', type: '-', limit: 'Confidential', date: '2025-08-21', color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Financial Records', type: '-', limit: 'Confidential', date: '2025-08-21', color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Correspondence', type: '-', limit: 'Confidential', date: '2025-08-21', color: 'bg-yellow-50 text-yellow-600' },
    { name: 'Evidence Collection', type: '-', limit: 'Privileged', date: '2025-08-21', color: 'bg-red-50 text-red-500' },
    { name: 'Court Filing Documents', type: '-', limit: 'Public', date: '2025-08-21', color: 'bg-green-50 text-green-600' },
  ];

  return (
    <div className="flex flex-col flex-1">
      <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 w-full sm:w-auto">Documents</h2>
        <button className="bg-[#10b981] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0da975] self-end sm:self-auto shrink-0 w-full sm:w-auto">
          <Plus size={16} /> Add Document
        </button>
      </div>

      <Toolbar />

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[0.6875rem] uppercase tracking-wider font-bold text-slate-500">
              <th className="px-6 py-4 w-10">#</th>
              <th className="px-4 py-4 cursor-pointer hover:text-slate-700">Document Name <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
              <th className="px-4 py-4">Document Type</th>
              <th className="px-4 py-4">Confidentiality</th>
              <th className="px-4 py-4 cursor-pointer hover:text-slate-700">Created At <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {docs.map((d, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{i + 1}</td>
                <td className="px-4 py-4 font-bold text-slate-700">{d.name}</td>
                <td className="px-4 py-4 text-slate-500 font-bold">{d.type}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full border text-[0.65rem] font-bold ${d.color} border-${d.color.split(' ')[0].split('-')[1]}-200`}>
                    {d.limit}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-500 font-medium">{d.date}</td>
                <td className="px-4 py-4 text-right">
                  <ActionButtons download />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination label={`Showing 1 to ${docs.length} of ${docs.length} documents`} />
    </div>
  );
}

function NotesTab() {
  const notes = [
    { title: 'Case Progress Update', type: 'General', priority: 'Medium', author: 'Company', date: '2025-08-21', color: 'bg-blue-50 text-blue-600', pcolor: 'bg-blue-50 text-blue-600' },
    { title: 'Court Hearing Preparation', type: 'General', priority: 'High', author: 'James Wilson', date: '2025-08-21', color: 'bg-blue-50 text-blue-600', pcolor: 'bg-orange-50 text-orange-500' },
    { title: 'Initial Client Meeting Notes', type: 'General', priority: 'High', author: 'Linda Davis', date: '2025-08-21', color: 'bg-blue-50 text-blue-600', pcolor: 'bg-orange-50 text-orange-500' },
    { title: 'Strategy Discussion', type: 'General', priority: 'High', author: 'Linda Davis', date: '2025-08-21', color: 'bg-blue-50 text-blue-600', pcolor: 'bg-orange-50 text-orange-500' },
  ];

  return (
    <div className="flex flex-col flex-1">
      <div className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100">
        <h2 className="text-xl font-bold text-slate-900 w-full sm:w-auto">Notes</h2>
        <button className="bg-[#10b981] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0da975] self-end sm:self-auto shrink-0 w-full sm:w-auto">
          <Plus size={16} /> Add Note
        </button>
      </div>

      <Toolbar />

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr className="text-[0.6875rem] uppercase tracking-wider font-bold text-slate-500">
              <th className="px-6 py-4 w-10">#</th>
              <th className="px-4 py-4 cursor-pointer hover:text-slate-700">Title <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
              <th className="px-4 py-4">Type</th>
              <th className="px-4 py-4">Priority</th>
              <th className="px-4 py-4">Created By</th>
              <th className="px-4 py-4 cursor-pointer hover:text-slate-700">Created At <ChevronsUpDown size={11} className="inline ml-1 opacity-50" /></th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-slate-100">
            {notes.map((n, i) => (
              <tr key={i} className="hover:bg-slate-50/30 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-900">{i + 1}</td>
                <td className="px-4 py-4 font-bold text-slate-700">{n.title}</td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-[0.65rem] font-bold ${n.color}`}>{n.type}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-block px-3 py-1 rounded-md border text-[0.65rem] font-bold ${n.pcolor} border-${n.pcolor.split(' ')[0].split('-')[1]}-200`}>
                    {n.priority}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700 font-medium">{n.author}</td>
                <td className="px-4 py-4 text-slate-500 font-medium">{n.date}</td>
                <td className="px-4 py-4 text-right">
                  <ActionButtons />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination label={`Showing 1 to ${notes.length} of ${notes.length} notes`} />
    </div>
  );
}

// â”€â”€â”€ SHARED SUB-COMPONENTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function Toolbar() {
  return (
    <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-1 min-w-[18.75rem]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#10b981]/10"
          />
        </div>
        <button className="bg-[#10b981] text-white px-5 py-2 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#0da975] transition-all">
          <Search size={15} /> Search
        </button>
        <button className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-600">
          <Filter size={15} /> Filters
        </button>
      </div>
      <div className="flex items-center gap-2 text-xs text-slate-400 font-medium whitespace-nowrap">
        <span>Per Page:</span>
        <div className="relative">
          <select className="border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none text-slate-600 cursor-pointer appearance-none pr-7 text-sm">
            <option>10</option><option>25</option><option>50</option>
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ download }) {
  return (
    <div className="flex items-center justify-end gap-3 pr-2">
      <Eye size={17} className="text-blue-500 cursor-pointer hover:scale-110 transition-transform" />
      <Edit2 size={16} className="text-orange-400 cursor-pointer hover:scale-110 transition-transform" />
      {download && <Download size={16} className="text-emerald-500 cursor-pointer hover:scale-110 transition-transform" />}
      <Trash2 size={16} className="text-red-500 cursor-pointer hover:scale-110 transition-transform" />
    </div>
  );
}

function Pagination({ label }) {
  return (
    <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3 mt-auto">
      <span className="text-sm text-slate-500 font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button disabled className="px-4 py-1.5 text-sm font-semibold text-slate-400 border border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed">
          Previous
        </button>
        <button className="w-8 h-8 text-sm font-bold rounded-lg transition-all bg-[#10b981] text-white shadow-sm">
          1
        </button>
        <button disabled className="px-4 py-1.5 text-sm font-semibold text-slate-400 border border-slate-200 rounded-lg bg-slate-50 cursor-not-allowed">
          Next
        </button>
      </div>
    </div>
  );
}
