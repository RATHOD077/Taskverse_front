import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import {
  LayoutGrid, Briefcase, Users, DollarSign,
  Target, Gavel, Clock, CheckCircle2,
  Globe, History, Menu, Calendar, LogOut, User as UserIcon
} from 'lucide-react';
import EmpCalendarWidget from './EmpCalendarWidget';

export default function EmpDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const [stats, setStats] = useState({
    totalCases: 0,
    activeTasks: 0,
    totalClients: 0,
    totalDocuments: 0
  });
  const [priorityTasks, setPriorityTasks] = useState([]);
  const [hearings, setHearings] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token || !userData || userData === "undefined") { navigate('/login'); return; }
    try {
      setUser(JSON.parse(userData));
    } catch (err) {
      console.error("Error parsing user data:", err);
      navigate('/login');
      return;
    }

    const getDashboardData = async () => {
      try {
        const res = await api.get('/dashboard/emp-stats');
        if (res.data.success) {
          setStats(res.data.stats);
          setPriorityTasks(res.data.priorityTasks || []);
          setHearings(res.data.hearings || []);
          setActivities(res.data.recentActivity || []);
        }
      } catch (err) {
        console.error("Backend fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();

    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white text-slate-400 text-[0.7rem] uppercase font-bold tracking-widest">
      Loading Platform...
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden font-sans text-slate-900">

      {/* TOP HEADER */}
      <header className="page-topbar">
        <div className="flex items-center gap-[0.5rem] text-[var(--text-xs)] text-slate-400 font-medium">
          <LayoutGrid size={14} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
          <span className="text-slate-900 font-bold">Dashboard</span>
        </div>

        <div className="flex items-center gap-[0.75rem]">
          <button className="flex items-center gap-[0.375rem] px-[0.625rem] py-[0.375rem] border border-slate-200 rounded-[0.5rem] text-[0.75rem] font-semibold bg-white hover:bg-slate-50 transition-all hide-xs">
            <Globe size={13} className="text-blue-500" />
            <span>English</span>
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-[1rem] h-[0.625rem]" />
          </button>

          <div className="relative" ref={profileRef}>
            <div
              className="flex items-center gap-[0.5rem] cursor-pointer p-[0.25rem] rounded-[0.5rem] hover:bg-slate-50 transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="hidden sm:block text-[0.75rem] font-semibold text-slate-600">
                {user?.username || 'Employee'}
              </span>
              <div className="w-[2rem] h-[2rem] rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[0.7rem] font-bold text-emerald-600 uppercase">
                {user?.username?.substring(0, 2) || 'EM'}
              </div>
            </div>

            {isProfileOpen && (
              <div className="absolute right-0 mt-[0.5rem] w-[12rem] bg-white border border-slate-100 rounded-[0.75rem] shadow-xl z-[100] py-[0.5rem] overflow-hidden">
                <div className="px-[1rem] py-[0.5rem] border-b border-slate-50">
                  <p className="text-[0.75rem] font-bold text-slate-900 truncate">{user?.username}</p>
                  <p className="text-[0.6rem] text-slate-400 truncate">{user?.email || 'User Account'}</p>
                </div>
                <button className="w-full flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] text-[0.75rem] text-slate-600 hover:bg-slate-50 transition-colors">
                  <UserIcon size={14} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-[0.5rem] px-[1rem] py-[0.5rem] text-[0.75rem] text-red-500 hover:bg-red-50 transition-colors font-semibold"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-[var(--page-px)] bg-[#fcfcfc]">
        <h1 className="text-[var(--text-page-title)] font-bold mb-[1.25rem] text-slate-900 tracking-tight">Dashboard</h1>

        {/* Stats */}
        <div className="stat-grid mb-[1.25rem]">
          <StatCard label="Assigned Cases"   value={stats.totalCases}      icon={<Briefcase size={18} className="text-purple-500" />}  iconBg="bg-purple-50" />
          <StatCard label="Pending Tasks"    value={stats.activeTasks}     icon={<CheckCircle2 size={18} className="text-emerald-500" />} iconBg="bg-emerald-50" />
          <StatCard label="My Clients"       value={stats.totalClients}    icon={<Users size={18} className="text-blue-500" />}         iconBg="bg-blue-50" />
          <StatCard label="My Documents"     value={stats.totalDocuments}  icon={<Target size={18} className="text-amber-500" />}       iconBg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[1rem] md:gap-[1.5rem]">
          <div className="lg:col-span-4 h-full">
            <DashboardCard icon={<Target size={18} />} title="Priority Tasks" badge={priorityTasks.length}>
              {priorityTasks.map((t, i) => (
                <TaskItem key={i} name={t.name} due={t.due} priority={t.priority} />
              ))}
              {priorityTasks.length === 0 && <p className="text-[0.7rem] text-slate-400 p-4 italic text-center">No pending tasks</p>}
            </DashboardCard>
          </div>

          <div className="lg:col-span-4 h-full">
            <DashboardCard icon={<Gavel size={18} />} title="Upcoming Hearings" badge={hearings.length}>
              {hearings.map((h, i) => (
                <HearingItem key={i} title={h.title} location={h.court} date={`${h.date} at ${h.time}`} />
              ))}
              {hearings.length === 0 && <p className="text-[0.7rem] text-slate-400 p-4 italic text-center">No upcoming hearings</p>}
            </DashboardCard>
          </div>

          <div className="lg:col-span-4 h-full">
            <DashboardCard icon={<LayoutGrid size={18} />} title="My Performance">
              <PerformanceBar label="Task Completion" value={stats.activeTasks > 0 ? Math.min(100 - stats.activeTasks * 10, 100) : 0} />
              <PerformanceBar label="Cases Handled" value={stats.totalCases > 0 ? Math.min(stats.totalCases * 10, 100) : 0} labelVal={String(stats.totalCases)} color="bg-emerald-500" />
              <PerformanceBar label="Clients Managed" value={stats.totalClients > 0 ? Math.min(stats.totalClients * 20, 100) : 0} labelVal={String(stats.totalClients)} color="bg-blue-500" />
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 mt-2">
                <div className="text-center">
                  <p className="text-[1.25rem] font-bold text-[#10b981]">{stats.totalCases}</p>
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-tighter">My Cases</p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-[1.25rem] font-bold text-blue-500">{stats.activeTasks}</p>
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-tighter">Open Tasks</p>
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="lg:col-span-7">
            <DashboardCard icon={<History size={18} />} title="Recent Activity">
              {activities.map((act, index) => (
                <TimeEntry key={index} title={act.action} sub="Task Activity" time={act.time} />
              ))}
              {activities.length === 0 && <p className="text-[0.7rem] text-slate-400 p-4">No recent activity</p>}
            </DashboardCard>
          </div>

          <div className="lg:col-span-5">
            <DashboardCard icon={<Target size={18} />} title="Quick Actions">
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                <ActionButton icon={<CheckCircle2 size={18} />} label="My Tasks" onClick={() => navigate('/emp/tasks')} color="text-emerald-500" />
                <ActionButton icon={<Briefcase size={18} />} label="My Cases" onClick={() => navigate('/emp/cases')} color="text-purple-500" />
                <ActionButton icon={<Gavel size={18} />} label="Hearings" onClick={() => navigate('/emp/hearings')} color="text-indigo-500" />
                <ActionButton icon={<Users size={18} />} label="Clients" onClick={() => navigate('/emp/clients')} color="text-blue-500" />
                <ActionButton icon={<LayoutGrid size={18} />} label="Media" onClick={() => navigate('/emp/media')} color="text-amber-500" />
                <ActionButton icon={<Calendar size={18} />} label="Calendar" onClick={() => navigate('/emp/calendar')} color="text-pink-500" />
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* CALENDAR WIDGET */}
        <EmpCalendarWidget />
      </div>
    </div>
  );
}

// --- UI COMPONENTS ---

function StatCard({ label, value, subValue, icon, iconBg }) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start justify-between">
      <div>
        <p className="text-slate-400 font-bold text-[0.65rem] uppercase tracking-wider mb-1">{label}</p>
        <p className="text-[1.5rem] font-bold text-slate-900 leading-none">{value}</p>
        {subValue && <p className={`text-[0.65rem] font-bold mt-1 text-slate-400`}>{subValue}</p>}
      </div>
      <div className={`p-2.5 rounded-full ${iconBg}`}>{icon}</div>
    </div>
  );
}

function DashboardCard({ icon, title, badge, children }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span className="text-slate-800">{icon}</span>
          <h2 className="text-[0.95rem] font-bold tracking-tight">{title}</h2>
        </div>
        {badge && <span className="w-5 h-5 bg-slate-50 border border-slate-100 rounded flex items-center justify-center text-[0.6rem] font-bold text-slate-500">{badge}</span>}
      </div>
      <div className="space-y-3 flex-1">{children}</div>
    </div>
  );
}

function TaskItem({ name, due, priority }) {
  const isHigh = String(priority).toLowerCase() === 'high';
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
      <div className={`w-7 h-7 rounded-full border ${isHigh ? 'border-red-100 bg-red-50 text-red-500' : 'border-blue-100 bg-blue-50 text-blue-500'} flex items-center justify-center shrink-0`}>
        <CheckCircle2 size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p className="font-bold text-slate-800 text-[0.75rem] truncate">{name}</p>
          <span className={`text-[0.55rem] font-black uppercase ${isHigh ? 'text-red-500 bg-red-50 border-red-100' : 'text-blue-500 bg-blue-50 border-blue-100'} px-1.5 py-0.5 rounded border shrink-0`}>{priority || 'Medium'}</span>
        </div>
        <p className="text-[0.65rem] font-semibold text-slate-400">Due: {due}</p>
      </div>
    </div>
  );
}

function HearingItem({ title, location, date }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
        <Calendar size={16} />
      </div>
      <div className="overflow-hidden">
        <p className="font-bold text-slate-800 text-[0.75rem] truncate">{title}</p>
        <p className="text-[0.65rem] font-semibold text-slate-400 truncate">{location}</p>
        <p className="text-[0.65rem] font-bold text-slate-500 mt-0.5">{date}</p>
      </div>
    </div>
  );
}

function PerformanceBar({ label, value, labelVal, color = "bg-[#10b981]" }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[0.7rem] font-bold text-slate-600 mb-1.5">
        <span>{label}</span>
        <span className="text-slate-400">{labelVal || value + '%'}</span>
      </div>
      <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function TimeEntry({ title, sub, time }) {
  return (
    <div className="flex items-center justify-between p-3 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer gap-4">
      <div className="min-w-0">
        <p className="font-bold text-slate-800 text-[0.75rem] truncate">{title}</p>
        <p className="text-[0.65rem] font-semibold text-slate-400 mt-0.5 truncate">{sub}</p>
      </div>
      <span className="text-[0.6rem] font-bold bg-white border border-slate-100 px-2 py-0.5 rounded text-slate-600 shrink-0">{time}</span>
    </div>
  );
}

function ActionButton({ icon, label, onClick, color = "text-slate-600" }) {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 py-4 border border-slate-100 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group active:scale-95 shadow-sm hover:shadow-md"
    >
      <div className={`${color} group-hover:scale-110 transition-transform`}>{icon}</div>
      <span className="text-[0.65rem] font-bold text-slate-500 group-hover:text-slate-900 uppercase tracking-tighter text-center">{label}</span>
    </div>
  );
}

const ScaleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
    <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
    <path d="M7 21h10"/><path d="M12 3v18"/>
    <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
  </svg>
);
