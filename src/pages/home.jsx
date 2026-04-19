import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Shield, 
  Layout, 
  Zap, 
  ArrowRight, 
  CheckCircle, 
  Globe, 
  Users, 
  Briefcase, 
  Lock
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-700 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-emerald-50/50 rounded-full blur-[8rem] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-blue-50/50 rounded-full blur-[8rem] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-6 bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200">
            <Zap size={22} className="text-white fill-current" />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
            Task<span className="text-emerald-500">Verse</span>
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <a href="#insights" className="hover:text-emerald-600 transition-colors">Insights</a>
          <a href="#about" className="hover:text-emerald-600 transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/login")}
            className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-200 transition-all active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold mb-8 animate-bounce">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Next-Gen Workflow management is here
        </div>

        <h2 className="text-4xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight max-w-4xl">
          Manage Work in Your <span className="text-emerald-500">Own Universe.</span>
        </h2>

        <p className="mt-8 text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed">
          The ultimate futuristic workspace for task management, employee monitoring, and secure document storage. 
          Everything you need, in one powerful galaxy.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-10 py-4 rounded-2xl bg-slate-900 text-white text-base font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 active:scale-95">
            Get Started Free <ArrowRight size={18} />
          </button>
          <button className="px-10 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 text-base font-bold hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95">
            Watch Demo
          </button>
        </div>

       
      </section>

      {/* Key Features */}
      <section id="features" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="max-w-xl">
              <h3 className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-4">Core Ecosystem</h3>
              <h4 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Designed for speed, built for <span className="text-emerald-500">security.</span>
              </h4>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Shield size={28} />}
              title="Admin Universe"
              desc="Full-scale control over your organization. Manage roles, assign permissions, and oversee every task movement."
              color="emerald"
            />
            <FeatureCard 
              icon={<Briefcase size={28} />}
              title="Task Galaxy"
              desc="Precision tracking for every individual. Break down complex workflows into simple, manageable steps."
              color="blue"
            />
            <FeatureCard 
              icon={<Lock size={28} />}
              title="Secure Vault"
              desc="Bank-level encryption for your documents. Role-based access ensures sensitive data stays in the right hands."
              color="slate"
            />
          </div>
        </div>
      </section>

      {/* System Insights */}
      <section id="insights" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 relative z-10">Real-Time Insights</h2>
          
          <div className="grid md:grid-cols-3 gap-12 relative z-10">
            <StatItem 
              value="1.2M+" 
              label="Tasks Completed" 
              icon={<CheckCircle size={24} className="text-emerald-400" />}
            />
            <StatItem 
              value="50k+" 
              label="Active Professionals" 
              icon={<Users size={24} className="text-blue-400" />}
            />
            <StatItem 
              value="99.9%" 
              label="System Uptime" 
              icon={<Globe size={24} className="text-emerald-400" />}
            />
          </div>
        </div>
      </section>

      {/* Footer */}... */}
      <footer id="about" className="py-20 px-6 border-t border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="max-w-sm">
             <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Zap size={18} className="text-white fill-current" />
                </div>
                <h1 className="text-lg font-black text-slate-900">TaskVerse</h1>
             </div>
             <p className="text-sm text-slate-500 leading-relaxed">
               The futuristic workflow platform built for modern agencies, legal firms, and corporate teams. 
               Manage work, the way it should be.
             </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
            <FooterCol title="Product" links={['Features', 'Security', 'Roadmap']} />
            <FooterCol title="Company" links={['About Us', 'Careers', 'Contact']} />
            <FooterCol title="Legal" links={['Privacy', 'Terms', 'Security']} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
          <div>© 2026 TaskVerse Inc.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-emerald-600 transition-colors">Twitter</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, desc, color }) => {
  const colorMap = {
    emerald: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white",
    blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-500 group-hover:text-white",
    slate: "bg-slate-100 text-slate-600 group-hover:bg-slate-900 group-hover:text-white"
  };

  return (
    <div className="p-10 rounded-[2rem] bg-[#fcfcfc] border border-slate-200 hover:border-white hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 ${colorMap[color]}`}>
        {icon}
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 text-base leading-relaxed">
        {desc}
      </p>
    </div>
  );
};

const StatItem = ({ value, label, icon }) => (
  <div className="flex flex-col items-center">
    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-6">
      {icon}
    </div>
    <div className="text-4xl md:text-5xl font-black text-white mb-2">{value}</div>
    <div className="text-slate-400 font-bold uppercase tracking-widest text-[0.625rem]">{label}</div>
  </div>
);

const FooterCol = ({ title, links }) => (
  <div className="space-y-6">
    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{title}</h4>
    <ul className="space-y-4">
      {links.map(link => (
        <li key={link}>
          <a href="#" className="text-sm text-slate-500 hover:text-emerald-600 transition-colors">{link}</a>
        </li>
      ))}
    </ul>
  </div>
);
