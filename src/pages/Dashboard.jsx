import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import {
  LayoutGrid, Briefcase, Users, DollarSign,
  Target, Gavel, Clock, CheckCircle2,
  Globe, History, Menu, Calendar, LogOut, User as UserIcon
} from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); // For Logout Dropdown
  const profileRef = useRef(null);

  // --- BACKEND STATE ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeTasks: 0,
    totalProjects: 0,
    totalRevenue: 0
  });
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
        // Corrected to the employee-specific stats route
        const res = await api.get('/dashboard/emp-stats'); 
        if (res.data && res.data.success && res.data.stats) {
          setStats(res.data.stats);
          setActivities(res.data.recentActivity || []);
        }
      } catch (err) {
        console.error("Backend fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    getDashboardData();

    // Close dropdown when clicking outside
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
      <header className="h-[3.5rem] bg-white border-b border-slate-100 flex items-center justify-between px-[1.5rem] shrink-0">
        <div className="flex items-center gap-3 text-slate-500">
          <button className="lg:hidden p-1" onClick={() => setIsMobileMenuOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="hidden md:flex items-center gap-2 text-[0.75rem] font-medium">
            <LayoutGrid size={14} /> <span>Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 border border-slate-100 rounded-md text-[0.75rem] font-medium cursor-pointer hover:bg-slate-50">
            <Globe size={14} /> <span>English</span>
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-3.5" />
          </div>

          {/* PROFILE SECTION WITH LOGOUT */}
          <div className="relative" ref={profileRef}>
            <div 
              className="flex items-center gap-2 cursor-pointer p-1 rounded-lg hover:bg-slate-50 transition-colors"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <span className="hidden sm:block text-[0.75rem] font-semibold text-slate-600">
                {user?.username || 'Employee'}
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-[0.7rem] font-bold text-emerald-600 uppercase">
                {user?.username?.substring(0, 2) || 'EM'}
              </div>
            </div>

            {/* LOGOUT DROPDOWN MENU */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-[100] py-2 overflow-hidden">
                <div className="px-4 py-2 border-b border-slate-50">
                  <p className="text-[0.75rem] font-bold text-slate-900 truncate">{user?.username}</p>
                  <p className="text-[0.6rem] text-slate-400 truncate">{user?.email || 'User Account'}</p>
                </div>
                <button className="w-full flex items-center gap-2 px-4 py-2 text-[0.75rem] text-slate-600 hover:bg-slate-50 transition-colors">
                  <UserIcon size={14} /> Profile
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
      </header>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-y-auto p-[1.5rem] lg:p-[2rem] bg-slate-50/30">
        <h1 className="text-[1.25rem] font-bold mb-6 text-slate-900 tracking-tight">Dashboard</h1>

        {/* Stats - CONNECTED TO BACKEND */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Users"    value={stats.totalUsers}    icon={<Users size={18} className="text-blue-500" />}      iconBg="bg-blue-50" />
          <StatCard label="Active Tasks"   value={stats.activeTasks}   subValue="assigned to me" icon={<CheckCircle2 size={18} className="text-emerald-500" />} iconBg="bg-emerald-50" />
          <StatCard label="Total Projects" value={stats.totalProjects} icon={<Briefcase size={18} className="text-purple-500" />} iconBg="bg-purple-50" />
          <StatCard label="Total Revenue"  value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<DollarSign size={18} className="text-amber-500" />} iconBg="bg-amber-50" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 h-full">
            <DashboardCard icon={<Target size={18} />} title="Priority Tasks" badge="3">
              <TaskItem name="Conduct legal analysis" due="8/17/2025" />
              <TaskItem name="Review contract amendments" due="8/27/2025" />
              <TaskItem name="Draft motion for summary jud..." due="1/1/2026" />
            </DashboardCard>
          </div>

          <div className="lg:col-span-4 h-full">
            <DashboardCard icon={<Gavel size={18} />} title="Upcoming Hearings" badge="5">
              <HearingItem title="Smith vs. Johnson Construction" location="Superior Court of California" date="3/29/2026 at 09:30" />
              <HearingItem title="Estate of Williams" location="Probate Court" date="4/2/2026 at 14:00" />
              <HearingItem title="Tech Corp vs. Innovation Ltd" location="Federal District Court" date="4/7/2026 at 10:00" />
            </DashboardCard>
          </div>

          <div className="lg:col-span-4 h-full">
            <DashboardCard icon={<LayoutGrid size={18} />} title="My Performance">
              <PerformanceBar label="Task Completion" value={20} />
              <PerformanceBar label="Hours This Month" value={0} labelVal="0h" />
              <PerformanceBar label="Cases Handled" value={100} labelVal="9" color="bg-emerald-500" />
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50 mt-2">
                <div className="text-center">
                  <p className="text-[1.25rem] font-bold text-[#10b981]">{stats.totalProjects}</p>
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-tighter">Active Projects</p>
                </div>
                <div className="text-center border-l border-slate-100">
                  <p className="text-[1.25rem] font-bold text-blue-500">{stats.activeTasks}</p>
                  <p className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-tighter">Pending Tasks</p>
                </div>
              </div>
            </DashboardCard>
          </div>

          <div className="lg:col-span-7">
            <DashboardCard icon={<History size={18} />} title="Recent Activity">
              {/* CONNECTED TO BACKEND ACTIVITIES */}
              {activities.map((act, index) => (
                <TimeEntry key={index} title={act.action} sub="Task Activity" time={act.time} />
              ))}
              {activities.length === 0 && <p className="text-[0.7rem] text-slate-400 p-4">No recent activity</p>}
            </DashboardCard>
          </div>

          <div className="lg:col-span-5">
            <DashboardCard icon={<Target size={18} />} title="Quick Actions">
              <div className="grid grid-cols-2 gap-3">
                <ActionButton icon={<CheckCircle2 size={16} />} label="View Tasks" />
                <ActionButton icon={<Clock size={16} />} label="Log Time" />
                <ActionButton icon={<ScaleIcon size={16} />} label="My Cases" />
                <ActionButton icon={<Gavel size={16} />} label="Hearings" />
              </div>
            </DashboardCard>
          </div>
        </div>
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

function TaskItem({ name, due }) {
  return (
    <div className="flex items-center gap-3 p-3 border border-slate-50 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="w-7 h-7 rounded-full border border-red-100 bg-red-50 flex items-center justify-center text-red-500 shrink-0">
        <CheckCircle2 size={14} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2">
          <p className="font-bold text-slate-800 text-[0.75rem] truncate">{name}</p>
          <span className="text-[0.55rem] font-black uppercase text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 shrink-0">high</span>
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

function ActionButton({ icon, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-5 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
      <div className="text-slate-600">{icon}</div>
      <span className="text-[0.7rem] font-bold text-slate-700">{label}</span>
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
