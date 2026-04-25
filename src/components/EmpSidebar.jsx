// src/components/EmpSidebar.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutGrid, Briefcase, Users, DollarSign, CheckSquare,
  Calendar, BookOpen, FileText, Mail, Image as ImageIcon,
  ChevronRight, ChevronDown, X, LogOut, User as UserIcon, Gavel, Scale
} from 'lucide-react';

export default function EmpSidebar({ isMobileOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState({ cases: true, clients: false });
  const profileRef = useRef(null);

  const userData = localStorage.getItem('user');
  let user = null;
  try {
    user = userData && userData !== "undefined" ? JSON.parse(userData) : null;
  } catch (err) {
    console.error("Error parsing user data:", err);
  }

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleDropdown = (key) => {
    setOpenDropdown(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-[16rem] bg-white border-r border-slate-100
        flex flex-col transition-transform duration-300
        lg:translate-x-0 lg:static lg:block
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6 shrink-0">
          <div className="flex items-center">
            <span className="text-[#10b981] text-[1.5rem] font-black tracking-tighter">A</span>
            <span className="text-[#0f172a] text-[1.3rem] font-bold tracking-tight">DVOCATE</span>
          </div>
          <button
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {/* Section Label */}
        <p className="text-slate-400 text-[0.65rem] font-bold tracking-widest mb-2 uppercase px-6">
          Platform
        </p>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-0.5">

          {/* Dashboard */}
          <NavItem
            icon={<LayoutGrid size={16} />}
            label="Dashboard"
            active={isActive('/emp/dashboard')}
            onClick={() => navigate('/emp/dashboard')}
          />

          {/* Case Management - Expandable */}
         

          {/* Client Management - Expandable */}
          <div>
            <button
              onClick={() => toggleDropdown('clients')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                openDropdown.clients ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={openDropdown.clients ? 'text-blue-500' : 'text-slate-400'}>
                  <Users size={16} />
                </span>
                <span className="text-[0.75rem] font-semibold">Client Management</span>
              </div>
              {openDropdown.clients
                ? <ChevronDown size={13} className="text-slate-400" />
                : <ChevronRight size={13} className="text-slate-300" />
              }
            </button>

            {openDropdown.clients && (
              <div className="mt-0.5 ml-6 pl-3 border-l border-slate-100 space-y-0.5">
                <SubNavItem
                  icon={<UserIcon size={13} />}
                  label="Clients"
                  active={isActive('/emp/clients') || location.pathname.startsWith('/emp/clients/')}
                  onClick={() => navigate('/emp/clients')}
                />
              </div>
            )}
          </div>
          
          <NavItem 
            icon={<CheckSquare size={16} />} 
            label="Task " 
            hasChevron 
            active={isActive('/emp/tasks')}
            onClick={() => navigate('/emp/tasks')}
          />
          <NavItem 
            icon={<Calendar size={16} />} 
            label="Calendar" 
            active={isActive('/emp/calendar')} 
            onClick={() => navigate('/emp/calendar')} 
          />
          
         
          
          <NavItem 
            icon={<ImageIcon size={16} />} 
            label="Document Management" 
            active={isActive('/emp/media')}
            onClick={() => navigate('/emp/media')}
          />
        </nav>

        {/* Profile + Logout */}
        <div className="px-3 pt-3 pb-4 border-t border-slate-100 shrink-0 relative" ref={profileRef}>
          <div
            className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[0.7rem] font-bold text-emerald-600 uppercase shrink-0">
              {user?.username?.substring(0, 2) || 'LD'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[0.75rem] font-semibold text-slate-700 truncate">
                {user?.username || 'Employee'}
              </p>
              <p className="text-[0.6rem] text-slate-400 truncate">
                {user?.email || ''}
              </p>
            </div>
            <ChevronDown size={13} className="text-slate-400 shrink-0" />
          </div>

          {isProfileOpen && (
            <div className="absolute bottom-full left-2 right-2 mb-2 bg-white border border-slate-100 rounded-xl shadow-xl z-[100] py-2 overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-50">
                <p className="text-[0.75rem] font-bold text-slate-900 truncate">{user?.username}</p>
                <p className="text-[0.6rem] text-slate-400 truncate">{user?.email || ''}</p>
              </div>
              <button className="w-full flex items-center gap-2 px-4 py-2 text-[0.75rem] text-slate-600 hover:bg-slate-50 transition-colors">
                <UserIcon size={14} /> Profile Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-[0.75rem] text-red-500 hover:bg-red-50 transition-colors font-semibold"
              >
                <LogOut size={14} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, hasChevron, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-slate-50 text-slate-900' : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? 'text-[#10b981]' : 'text-slate-400'}>{icon}</span>
        <span className="text-[0.75rem] font-semibold">{label}</span>
      </div>
      {hasChevron && <ChevronRight size={12} className="text-slate-300" />}
    </div>
  );
}

function SubNavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-lg text-[0.72rem] font-semibold transition-colors ${
        active
          ? 'text-[#10b981] bg-emerald-50'
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <span className={active ? 'text-[#10b981]' : 'text-slate-400'}>{icon}</span>
      {label}
    </button>
  );
}
