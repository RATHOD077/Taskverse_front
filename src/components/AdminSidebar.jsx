import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Files, 
  UserCircle, 
  ChevronDown, 
  ChevronRight,
  LogOut,
  Image as ImageIcon,
  Menu,
  X,
  Bell
} from "lucide-react";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const [openDropdown, setOpenDropdown] = useState({
    user: true,
    task: false,
    document: false,
    customer: false,
    notifications: false,     // New
  });

  const [openSubDropdown, setOpenSubDropdown] = useState({
    email: false,
    sms: false,
  });

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleSubDropdown = (key) => {
    setOpenSubDropdown(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isActive = (path) => location.pathname === path;

  const adminData = localStorage.getItem('admin');
  let admin = null;
  try {
    admin = adminData && adminData !== "undefined" ? JSON.parse(adminData) : null;
  } catch (err) {
    console.error("Error parsing admin data:", err);
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin');  // Admin login page
  };

  return (
    <>
      {/* --- Mobile Header & Toggle --- */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-[4rem] bg-white border-b border-slate-100 px-[1rem] flex items-center justify-between z-[50]">
        <h1 className="text-[1.25rem] font-black text-[#1e293b] tracking-tighter uppercase">Taskverse</h1>
        <button 
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-[0.5rem] text-slate-600 hover:bg-slate-50 rounded-[0.5rem]"
        >
          {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* --- Mobile Overlay --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- Sidebar Aside --- */}
      <aside className={`
        fixed top-0 left-0 z-[60] h-full bg-white border-r border-slate-100 flex flex-col overflow-hidden font-sans transition-transform duration-300 ease-in-out
        w-[18rem] 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}>
        
        {/* Brand Header */}
        <div className="px-[1.5rem] py-[2rem] hidden lg:block">
          <div className="flex items-center gap-[0.25rem]">
            <h1 className="text-[1.5rem] font-black text-[#1e293b] tracking-tighter uppercase">Taskverse</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-[0.75rem] py-[1rem] lg:py-0 overflow-y-auto space-y-[0.25rem] scrollbar-thin scrollbar-thumb-slate-200">
          
          <p className="px-[1rem] text-[0.8125rem] font-semibold text-slate-400 mb-[1rem] mt-[0.5rem] uppercase tracking-wider">Platform</p>

          {/* Dashboard */}
          <button
            onClick={() => navigate("/admin/dashboard")}
            className={`w-full flex items-center justify-between px-[1rem] py-[0.625rem] rounded-[0.75rem] transition-all
              ${isActive("/admin/dashboard") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <div className="flex items-center gap-[0.75rem]">
              <LayoutDashboard size={20} strokeWidth={1.5} />
              <span className="text-[0.9375rem] font-medium">Dashboard</span>
            </div>
          </button>

          {/* User Management */}
          <div>
            <button
              onClick={() => toggleDropdown('user')}
              className={`w-full flex justify-between items-center px-[1rem] py-[0.625rem] rounded-[0.75rem] transition-all
                ${openDropdown.user ? "text-slate-900" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-[0.75rem]">
                <Users size={20} strokeWidth={1.5} />
                <span className="text-[0.9375rem] font-medium">User</span>
              </div>
              {openDropdown.user ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            {openDropdown.user && (
              <div className="mt-[0.25rem] space-y-[0.25rem]">
                {[
                  { label: "All Employees", path: "/admin/users" },
                  { label: "User Roles", path: "/admin/users/roles" },
                
                ].map((item) => (
                  <button 
                    key={item.path}
                    onClick={() => navigate(item.path)} 
                    className={`w-full text-left pl-[3rem] pr-[1rem] py-[0.5rem] rounded-[0.5rem] text-[0.875rem] transition-all
                      ${isActive(item.path) ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Task Management */}
          <div>
            <button
              onClick={() => toggleDropdown('task')}
              className="w-full flex justify-between items-center px-[1rem] py-[0.625rem] rounded-[0.75rem] text-slate-600 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-[0.75rem]">
                <CheckSquare size={20} strokeWidth={1.5} />
                <span className="text-[0.9375rem] font-medium">Task</span>
              </div>
              {openDropdown.task ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            {openDropdown.task && (
              <div className="mt-[0.25rem] space-y-[0.25rem]">
                {[
                  { label: "All Tasks", path: "/admin/tasks" },
                  { label: "Task Stages", path: "/admin/task-stages" },
                  { label: "Task Types", path: "/admin/task-types" },
                  { label: "Task Statuses", path: "/admin/task-status" }
                ].map((item) => (
                  <button 
                    key={item.path} 
                    onClick={() => navigate(item.path)} 
                    className={`w-full text-left pl-[3rem] pr-[1rem] py-[0.5rem] rounded-[0.5rem] text-[0.875rem] 
                      ${isActive(item.path) ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Document Management */}
          <div>
            <button
              onClick={() => toggleDropdown('document')}
              className="w-full flex justify-between items-center px-[1rem] py-[0.625rem] rounded-[0.75rem] text-slate-600 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-[0.75rem]">
                <Files size={20} strokeWidth={1.5} />
                <span className="text-[0.9375rem] font-medium">Document</span>
              </div>
              {openDropdown.document ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            {openDropdown.document && (
              <div className="mt-[0.25rem] space-y-[0.25rem]">
                {[
                  { label: "All Documents", path: "/admin/documents" },
                  { label: "Physical Files", path: "/admin/physical-files" },
                  { label: "Categories", path: "/admin/documents-categories" },
                  { label: "Versions", path: "/admin/document-versions" },
                  { label: "Permissions", path: "/admin/documents-permissions" },
                ].map((item) => (
                  <button 
                    key={item.path} 
                    onClick={() => navigate(item.path)} 
                    className={`w-full text-left pl-[3rem] pr-[1rem] py-[0.5rem] rounded-[0.5rem] text-[0.875rem] 
                      ${isActive(item.path) ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Customer Management */}
          <div>
            <button
              onClick={() => toggleDropdown('customer')}
              className="w-full flex justify-between items-center px-[1rem] py-[0.625rem] rounded-[0.75rem] text-slate-600 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-center gap-[0.75rem]">
                <UserCircle size={20} strokeWidth={1.5} />
                <span className="text-[0.9375rem] font-medium">Customer</span>
              </div>
              {openDropdown.customer ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            {openDropdown.customer && (
              <div className="mt-[0.25rem] space-y-[0.25rem]">
                <button onClick={() => navigate("/admin/customers")} className={`w-full text-left pl-[3rem] pr-[1rem] py-[0.5rem] rounded-[0.5rem] text-[0.875rem] ${isActive("/admin/customers") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
                  Customers
                </button>
                <button onClick={() => navigate("/admin/customers-types")} className={`w-full text-left pl-[3rem] pr-[1rem] py-[0.5rem] rounded-[0.5rem] text-[0.875rem] ${isActive("/admin/customers-types") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}>
                  Customer Types
                </button>
              </div>
            )}
          </div>

          {/* Media Library */}
          <button 
            onClick={() => navigate("/admin/media")} 
            className={`w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.625rem] rounded-[0.75rem] transition-all
              ${isActive("/admin/media") 
                ? "bg-slate-100 text-slate-900" 
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <ImageIcon size={20} strokeWidth={1.5} />
            <span className="text-[0.9375rem] font-medium">Media Library</span>
          </button>

          {/* ==================== NOTIFICATIONS DROPDOWN ==================== */}
          <div>
            <button
              onClick={() => toggleDropdown('notifications')}
              className={`w-full flex justify-between items-center px-[1rem] py-[0.625rem] rounded-[0.75rem] transition-all
                ${openDropdown.notifications ? "text-slate-900 bg-slate-50" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <div className="flex items-center gap-[0.75rem]">
                <Bell size={20} strokeWidth={1.5} />
                <span className="text-[0.9375rem] font-medium">Notifications</span>
              </div>
              {openDropdown.notifications ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
            </button>

            {openDropdown.notifications && (
              <div className="mt-[0.25rem] space-y-[0.25rem] pl-[0.75rem]">
                
                {/* Email Section */}
                <div>
                  <button
                    onClick={() => toggleSubDropdown('email')}
                    className="w-full flex justify-between items-center px-[1rem] py-[0.5rem] rounded-[0.5rem] text-slate-600 hover:bg-slate-50 text-[0.9rem]"
                  >
                    <span>Email</span>
                    {openSubDropdown.email ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>

                  {openSubDropdown.email && (
                    <div className="ml-4 mt-1 space-y-[0.25rem]">
                      <button 
                        onClick={() => navigate("/admin/notifications/email/templates")}
                        className={`w-full text-left pl-[1.25rem] py-[0.45rem] rounded-[0.5rem] text-[0.875rem] transition-all
                          ${isActive("/admin/notifications/email/templates") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                         Email Templates
                      </button>
                      <button 
                        onClick={() => navigate("/admin/notifications/email/send")}
                        className={`w-full text-left pl-[1.25rem] py-[0.45rem] rounded-[0.5rem] text-[0.875rem] transition-all
                          ${isActive("/admin/notifications/email/send") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                        Send Email
                      </button>
                      <button 
                        onClick={() => navigate("/admin/notifications/email/history")}
                        className={`w-full text-left pl-[1.25rem] py-[0.45rem] rounded-[0.5rem] text-[0.875rem] transition-all
                          ${isActive("/admin/notifications/email/history") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                         History
                      </button>
                    </div>
                  )}
                </div>

                {/* SMS Section */}
                <div>
                  <button
                    onClick={() => toggleSubDropdown('sms')}
                    className="w-full flex justify-between items-center px-[1rem] py-[0.5rem] rounded-[0.5rem] text-slate-600 hover:bg-slate-50 text-[0.9rem]"
                  >
                    <span>SMS</span>
                    {openSubDropdown.sms ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>

                  {openSubDropdown.sms && (
                    <div className="ml-4 mt-1 space-y-[0.25rem]">
                      <button 
                        onClick={() => navigate("/admin/notifications/sms/send")}
                        className={`w-full text-left pl-[1.25rem] py-[0.45rem] rounded-[0.5rem] text-[0.875rem] transition-all
                          ${isActive("/admin/notifications/sms/send") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                        Send SMS
                      </button>
                      <button 
                        onClick={() => navigate("/admin/notifications/sms/history")}
                        className={`w-full text-left pl-[1.25rem] py-[0.45rem] rounded-[0.5rem] text-[0.875rem] transition-all
                          ${isActive("/admin/notifications/sms/history") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                        SMS History
                      </button>
                    </div>
                  )}
                </div>

                {/* Automated Reminders */}
                <div>
                  <button
                    onClick={() => toggleSubDropdown('reminders')}
                    className="w-full flex justify-between items-center px-[1rem] py-[0.5rem] rounded-[0.5rem] text-slate-600 hover:bg-slate-50 text-[0.9rem]"
                  >
                    <span>Reminders</span>
                    {openSubDropdown.reminders ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                  </button>

                  {openSubDropdown.reminders && (
                    <div className="ml-4 mt-1 space-y-[0.25rem]">
                      <button 
                        onClick={() => navigate("/admin/notifications/reminders")}
                        className={`w-full text-left pl-[1.25rem] py-[0.45rem] rounded-[0.5rem] text-[0.875rem] transition-all
                          ${isActive("/admin/notifications/reminders") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                        Settings
                      </button>
                      <button 
                        onClick={() => navigate("/admin/notifications/reminders/history")}
                        className={`w-full text-left pl-[1.25rem] py-[0.45rem] rounded-[0.5rem] text-[0.875rem] transition-all
                          ${isActive("/admin/notifications/reminders/history") ? "text-[#10b981] font-semibold" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"}`}
                      >
                        Audit History
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

        </nav>

        {/* Profile & Logout */}
        <div className="p-[1rem] border-t border-slate-50">
          <div className="flex items-center gap-[0.75rem] p-[0.5rem] mb-[0.5rem]">
            <div className="w-[2.25rem] h-[2.25rem] rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-[0.875rem] border border-slate-200">
              {admin?.admin_name?.[0] || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.875rem] font-bold text-slate-900 truncate leading-tight">{admin?.admin_name || 'Admin'}</p>
              <p className="text-[0.75rem] text-slate-400 truncate">{admin?.email || 'admin@advocate.com'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-[0.75rem] px-[1rem] py-[0.5rem] text-rose-500 hover:bg-rose-50 rounded-[0.75rem] text-[0.875rem] font-semibold transition-all"
          >
            <LogOut size={18} strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
