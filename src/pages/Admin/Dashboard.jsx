import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { 
  Scale, Users, DollarSign, Clock, 
  Calendar, Shield, Gavel, RefreshCw, BarChart2,
  Globe, Plus, MessageSquare, CheckSquare, Files, UserCircle, Image as ImageIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    activeCases: 0,
    totalCases: 0,
    activeClients: 0,
    totalRevenue: 0,
    pendingTasks: 0,
    hearingsDue: 0
  });
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('admin') || localStorage.getItem('user');
    if (stored) {
      const data = JSON.parse(stored);
      setAdminName(data.admin_name || data.username || 'Admin');
    }
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dashboard/stats');
      setStats({
        activeCases: res.data.stats.activeTasks || 0,
        totalCases: res.data.stats.totalProjects || 0,
        activeClients: res.data.stats.totalUsers || 0,
        totalRevenue: res.data.stats.totalRevenue || 0,
        pendingTasks: 0,
        hearingsDue: 0 
      });
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Active Cases",
      value: stats.activeCases,
      subtext: `${stats.totalCases} total`,
      icon: <Scale className="text-blue-600" />,
      iconBg: "bg-blue-50"
    },
    {
      title: "Active Clients",
      value: stats.activeClients,
      subtext: "+0% this month",
      subtextColor: "text-green-500",
      icon: <Users className="text-green-600" />,
      iconBg: "bg-green-50"
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      subtext: "This year",
      icon: <DollarSign className="text-emerald-600" />,
      iconBg: "bg-emerald-50",
      isCurrency: true
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks,
      subtext: `${stats.hearingsDue} hearings due`,
      subtextColor: "text-red-500",
      icon: <Clock className="text-orange-600" />,
      iconBg: "bg-orange-50"
    },
  ];

  return (
    <div className="p-[1rem] md:p-[2rem] bg-[#FDFDFD] min-h-screen font-sans text-[#1A1C1E]">
      
      {/* Internal Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-[1rem] mb-[2rem]">
        <div>
          <div className="flex items-center gap-[0.5rem] mb-[0.5rem] text-gray-500">
             <BarChart2 size={16} />
             <span className="text-[0.8125rem] font-semibold uppercase tracking-wider">Overview</span>
          </div>
          <h1 className="text-[1.5rem] md:text-[1.875rem] font-bold text-[#1A1C1E]">
            Welcome back, {adminName}
          </h1>
        </div>
        
        <div className="flex gap-[0.5rem] w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-[0.5rem] px-[1rem] py-[0.625rem] border border-gray-200 rounded-[0.75rem] bg-white text-[0.875rem] font-bold hover:bg-gray-50 transition-all shadow-sm">
             <Globe size={16} /> Language
          </button>
          <button 
            onClick={fetchDashboardStats}
            className="flex-1 sm:flex-none flex items-center justify-center gap-[0.5rem] px-[1rem] py-[0.625rem] border border-gray-200 rounded-[0.75rem] bg-white text-[0.875rem] font-bold hover:bg-gray-50 transition-all shadow-sm"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>
      </div>

      {/* 4-Column Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1.5rem] mb-[2.5rem]">
        {statCards.map((card, index) => (
          <StatCard 
            key={index}
            {...card}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[1.5rem] md:gap-[2rem]">
        
        {/* Upcoming Hearings */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 p-[1.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-[1.5rem]">
            <div className="flex items-center gap-[0.75rem]">
              <div className="p-[0.5rem] bg-slate-50 rounded-[0.5rem]">
                <Gavel size={20} className="rotate-45 text-slate-700" />
              </div>
              <h2 className="text-[1.125rem] font-bold">Upcoming Hearings</h2>
            </div>
            <span className="bg-slate-100 text-slate-600 px-[0.625rem] py-[0.25rem] rounded-[0.5rem] text-[0.75rem] font-black">15</span>
          </div>
          
          <div className="space-y-[1rem] max-h-[25rem] overflow-y-auto pr-[0.5rem] custom-scrollbar">
            <HearingItem 
              title="Smith vs. Johnson Constr..." 
              court="Superior Court of California" 
              date="Mar 28, 2026 at 09:30 AM" 
              type="Motion Hearing" 
            />
            <HearingItem 
              title="Estate of Williams" 
              court="Probate Court" 
              date="Apr 01, 2026 at 14:00 PM" 
              type="Probate Hearing" 
            />
          </div>
        </div>

        {/* Plan Status */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 p-[1.5rem] shadow-sm">
          <div className="flex justify-between items-center mb-[2rem]">
            <div className="flex items-center gap-[0.75rem]">
              <div className="w-[1.25rem] h-[1.25rem] border-[0.1875rem] border-black rounded-full flex items-center justify-center">
                <div className="w-[0.375rem] h-[0.375rem] bg-black rounded-full"></div>
              </div>
              <h2 className="text-[1.125rem] font-bold">Plan Status</h2>
            </div>
            <span className="bg-emerald-50 text-emerald-700 px-[0.75rem] py-[0.25rem] rounded-[0.5rem] text-[0.75rem] font-black uppercase tracking-wider">Free Plan</span>
          </div>

          <div className="space-y-[1.5rem]">
            <ProgressBar label="Team Members" current={17} total={50} color="bg-emerald-500" />
            <ProgressBar label="Storage" current={0} total={1} unit="GB" color="bg-slate-200" />
            <ProgressBar label="Cases" current={stats.totalCases} total={100} color="bg-emerald-500" />
            <ProgressBar label="Clients" current={stats.activeClients} total={50} color="bg-emerald-500" />
          </div>

          <div className="mt-[2rem] pt-[1.5rem] border-t border-slate-50">
            <div className="flex justify-between items-center flex-wrap gap-[1rem]">
              <div className="text-[1.5rem] font-black text-slate-900">$0.00<span className="text-[0.875rem] text-slate-400 font-medium">/mo</span></div>
              <button className="text-[0.8125rem] font-bold text-blue-600 hover:underline underline-offset-4">Upgrade Pro â†’</button>
            </div>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 p-[1.5rem] shadow-sm">
          <div className="flex items-center gap-[0.75rem] mb-[2rem]">
             <div className="p-[0.5rem] bg-slate-50 rounded-[0.5rem]">
                <Shield size={20} className="text-slate-700" />
              </div>
            <h2 className="text-[1.125rem] font-bold">Tasks by Priority</h2>
          </div>
          <div className="space-y-[1.5rem]">
            <PriorityItem label="High Priority" count={4} color="bg-red-500" />
            <PriorityItem label="Medium Priority" count={1} color="bg-orange-400" />
            <PriorityItem label="Low Priority" count={2} color="bg-emerald-500" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 p-[1.5rem] shadow-sm">
          <div className="flex items-center gap-[0.75rem] mb-[2rem]">
            <div className="p-[0.5rem] bg-slate-50 rounded-[0.5rem]">
                <Plus size={20} className="text-slate-700" />
              </div>
            <h2 className="text-[1.125rem] font-bold">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-[1rem]">
            <ActionButton icon={<CheckSquare size={20}/>} label="Tasks" onClick={() => navigate('/admin/tasks')} color="text-emerald-500" />
            <ActionButton icon={<Files size={20}/>} label="Documents" onClick={() => navigate('/admin/documents')} color="text-blue-500" />
            <ActionButton icon={<Users size={20}/>} iconBg="bg-blue-50" label="Employees" onClick={() => navigate('/admin/users')} color="text-indigo-500" />
            <ActionButton icon={<UserCircle size={20}/>} label="Customers" onClick={() => navigate('/admin/customers')} color="text-amber-500" />
            <ActionButton icon={<ImageIcon size={20}/>} label="Media" onClick={() => navigate('/admin/media')} color="text-purple-500" />
            <ActionButton icon={<MessageSquare size={20}/>} label="Send Email" onClick={() => navigate('/admin/notifications/email/send')} color="text-pink-500" />
            <ActionButton icon={<MessageSquare size={20}/>} label="Send SMS" onClick={() => navigate('/admin/notifications/sms/send')} color="text-orange-500" />
            <ActionButton icon={<Files size={20}/>} label="Physical" onClick={() => navigate('/admin/physical-files')} color="text-slate-600" />
          </div>
        </div>

      </div>
    </div>
  );
}

// ==================== SUB COMPONENTS ====================

const StatCard = ({ title, value, subtext, subtextColor = "text-slate-400", icon, iconBg }) => (
  <div className="bg-white p-[1.5rem] rounded-[1.25rem] border border-slate-100 shadow-sm relative overflow-hidden transition-all hover:shadow-md">
    <div className="flex justify-between items-start">
      <div className="min-w-0">
        <p className="text-[0.8125rem] font-bold text-slate-400 mb-[0.5rem] uppercase tracking-wider">{title}</p>
        <h3 className="text-[1.75rem] font-black text-slate-900 truncate">
          {value}
        </h3>
        <p className={`text-[0.75rem] mt-[0.5rem] font-bold ${subtextColor}`}>{subtext}</p>
      </div>
      <div className={`w-[3.25rem] h-[3.25rem] shrink-0 rounded-[1rem] ${iconBg} flex items-center justify-center shadow-inner`}>
        {React.cloneElement(icon, { size: 24, strokeWidth: 2 })}
      </div>
    </div>
  </div>
);

const HearingItem = ({ title, court, date, type }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-[1rem] border border-slate-50 rounded-[1rem] hover:bg-slate-50 transition-all cursor-pointer group gap-[1rem]">
    <div className="flex gap-[1rem]">
      <div className="w-[2.75rem] h-[2.75rem] shrink-0 rounded-[0.75rem] bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
        <Calendar size={18} className="text-indigo-600" />
      </div>
      <div className="min-w-0">
        <h4 className="text-[0.875rem] font-bold text-slate-800 truncate">{title}</h4>
        <p className="text-[0.75rem] text-slate-400 font-medium truncate">{court}</p>
        <p className="text-[0.75rem] text-slate-500 mt-[0.125rem] font-medium italic">{date}</p>
      </div>
    </div>
    <span className="self-start sm:self-center text-[0.6875rem] font-black text-slate-500 bg-white px-[0.75rem] py-[0.375rem] rounded-full border border-slate-100 whitespace-nowrap shadow-sm">
      {type}
    </span>
  </div>
);

const ProgressBar = ({ label, current, total, unit = "", color }) => (
  <div className="space-y-[0.625rem]">
    <div className="flex justify-between text-[0.8125rem] font-black text-slate-700">
      <span>{label}</span>
      <span className="text-slate-400 font-bold">{current}{unit} / {total}{unit}</span>
    </div>
    <div className="w-full h-[0.625rem] bg-slate-50 rounded-full overflow-hidden border border-slate-100">
      <div 
        className={`h-full ${color} rounded-full transition-all duration-700 ease-out`} 
        style={{ width: `${Math.min((current / total) * 100, 100)}%` }} 
      />
    </div>
  </div>
);

const PriorityItem = ({ label, count, color }) => (
  <div className="flex justify-between items-center p-[0.75rem] hover:bg-slate-50 rounded-[0.75rem] transition-colors">
    <div className="flex items-center gap-[1rem]">
      <div className={`w-[0.625rem] h-[0.625rem] rounded-full ${color} ring-4 ring-opacity-20 ${color.replace('bg-', 'ring-')}`}></div>
      <span className="text-[0.875rem] font-bold text-slate-700">{label}</span>
    </div>
    <div className="flex items-center gap-[0.25rem]">
      <span className="text-[1.25rem] font-black text-slate-900">{count}</span>
      <span className="text-[0.75rem] text-slate-400 font-bold">TASKS</span>
    </div>
  </div>
);

const ActionButton = ({ icon, label, onClick, color = "text-slate-700" }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-[0.75rem] p-[1.25rem] border border-slate-100 rounded-[1rem] hover:border-slate-300 hover:shadow-md transition-all bg-white group active:scale-95"
  >
    <div className={`${color} group-hover:scale-110 transition-all`}>
      {icon}
    </div>
    <span className="text-[0.7rem] font-black text-slate-500 group-hover:text-slate-900 uppercase tracking-tight truncate w-full text-center">{label}</span>
  </button>
);
