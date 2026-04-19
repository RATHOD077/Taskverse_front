import React from 'react';
import { 
  ChevronRight, 
  Globe, 
  ArrowLeft, 
  FileText, 
  Download, 
  ShieldCheck, 
  MessageSquare,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';

const DocumentDetail = () => {
  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] text-slate-700 font-sans pb-10">
      
      {/* Top Navbar */}
      <header className="h-14 border-b border-slate-100 bg-white flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
        <div className="flex items-center gap-1 md:gap-2 text-[10px] md:text-[11px] text-slate-400 font-medium overflow-hidden">
           <MoreHorizontal size={14} className="bg-slate-50 p-0.5 rounded cursor-pointer shrink-0" />
           <ChevronRight size={10} className="shrink-0" />
           <span className="hidden md:inline">Dashboard</span>
           <ChevronRight size={10} className="hidden md:inline shrink-0" />
           <span className="hidden sm:inline">Document Management</span>
           <ChevronRight size={10} className="sm:inline shrink-0" />
           <span className="text-slate-900 font-bold truncate">Research Memorandum</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
           <button className="flex items-center gap-1.5 px-2 py-1.5 border border-slate-200 rounded-lg text-[10px] md:text-xs font-semibold bg-white hover:bg-slate-50 transition-all shrink-0">
             <Globe size={14} className="text-blue-500" /> 
             <span className="hidden xs:inline">English</span> 
             <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4 h-2.5" />
           </button>
           <div className="flex items-center gap-2 text-xs font-semibold shrink-0">
             <span className="text-slate-500 hidden sm:inline">Company</span>
             <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold">C</div>
           </div>
        </div>
      </header>

      <div className="p-4 md:p-8 max-w-[1200px] mx-auto space-y-6">
        
        {/* Back Button */}
        <div className="flex justify-end">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold bg-white hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft size={16} /> Back to Documents
          </button>
        </div>

        {/* 1. Main Document Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <FileText size={28} className="text-slate-400" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">Research Memorandum</h1>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <span className="px-3 py-1 bg-white border border-slate-200 text-slate-500 rounded-md text-sm font-medium">Draft</span>
              <button className="flex flex-1 md:flex-none items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold hover:bg-slate-50 transition-all shadow-sm">
                <Download size={16} /> Download
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Version:</p>
              <p className="text-sm font-medium text-slate-700">1.0</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created:</p>
              <p className="text-sm font-medium text-slate-700">2025-08-21 13:48</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Updated:</p>
              <p className="text-sm font-medium text-slate-700">2025-08-21 13:48</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Confidentiality:</p>
              <span className="px-2 py-0.5 bg-rose-50 text-rose-500 border border-rose-100 rounded text-xs font-bold">Restricted</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description:</p>
            <p className="text-sm text-slate-600">Legal research memorandum for Company.</p>
          </div>
        </div>

        {/* 2. Access Permissions Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck size={20} className="text-slate-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Access Permissions</h2>
              <p className="text-xs text-slate-400">2 users have access</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Michael Brown', email: 'michael_brown_2@example.com', initial: 'M' },
              { name: 'Emily Davis', email: 'emily_davis_2@example.com', initial: 'E' }
            ].map((user, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50/50 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold border border-white">
                    {user.initial}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-400">{user.email}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all">View</button>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recent Comments Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center gap-3 mb-6">
            <MessageSquare size={20} className="text-slate-400" />
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recent Comments</h2>
              <p className="text-xs text-slate-400">1 recent comments</p>
            </div>
          </div>

          <div className="relative pl-6 border-l-2 border-slate-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 text-[10px] font-bold border border-white shrink-0">
                  C
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Company</p>
                  <p className="text-[10px] text-slate-400">2025-08-21 13:48</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-md shrink-0 self-start sm:self-center">
                <CheckCircle2 size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Resolved</span>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600 italic pl-11 sm:pl-11">
              "Please review the terms in section 3"
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentDetail;
