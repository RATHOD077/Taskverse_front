// src/components/UserLayout.jsx
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import EmpSidebar from '../components/EmpSidebar';
import { Menu } from 'lucide-react';

export default function UserLayout({ children }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <EmpSidebar
        isMobileOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      {/* Right Content Area */}
      <div className="flex-1 overflow-auto bg-[#f8fafc] flex flex-col min-w-0">

        {/* Mobile top bar */}
        <div className="lg:hidden h-[3.5rem] bg-white border-b border-slate-100 flex items-center px-[var(--page-px)] sticky top-0 z-30">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-[0.5rem] text-slate-500 hover:bg-slate-50 rounded-[0.5rem] transition-colors"
          >
            <Menu size={18} />
          </button>
          <span className="ml-[0.75rem] text-[0.8125rem] font-bold text-slate-700">ADVOCATE</span>
        </div>

        <div className="flex-1 overflow-auto">
          {children || <Outlet />}
        </div>
      </div>
    </div>
  );
}
