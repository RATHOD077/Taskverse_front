import React, { useState, useEffect } from "react";
import { Search, Filter, Eye, Edit, ChevronLeft, ChevronRight, Globe, LayoutGrid, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get("/customers/emp");
      if (res.data.success) {
        setClients(res.data.customers);
      }
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.id?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc] font-sans text-slate-900">
      {/* Breadcrumbs / Header Area */}
      <div className="px-8 py-4 bg-white border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[0.7rem] text-slate-400 font-medium">
          <LayoutGrid size={14} className="text-slate-300" />
          <span>Dashboard</span>
          <ChevronRight size={12} />
          <span>Client Management</span>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-bold">Clients</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-[0.7rem] font-semibold bg-white hover:bg-slate-50 transition-all">
            <Globe size={14} className="text-blue-500" /> English
            <img src="https://flagcdn.com/w20/gb.png" alt="UK" className="w-4 h-2.5" />
          </button>
          <div className="flex items-center gap-2 cursor-pointer">
            <span className="text-[0.75rem] font-bold text-slate-700">Linda Davis</span>
            <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border border-slate-100">
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" alt="User" />
            </div>
          </div>
        </div>
      </div>

      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Clients</h1>
          {/* Note: Employees generally don't "Add Client", admin gives them. 
              But I'll keep the UI similar to image for aesthetics if needed. 
              Usually admin adds. */}
        </div>

        {/* Search & Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg text-sm font-bold hover:bg-emerald-600 transition-all flex items-center gap-2">
              <Search size={16} /> Search
            </button>
            <button className="px-4 py-2 border border-slate-100 bg-white text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
              <Filter size={16} /> Filters
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Per Page:</span>
            <select className="bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold p-1.5 focus:outline-none">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">#</th>
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Client ID</th>
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Name</th>
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Email</th>
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[0.65rem] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400 text-sm italic">Loading clients...</td>
                </tr>
              ) : filteredClients.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-400 text-sm italic">No clients found assigned to you.</td>
                </tr>
              ) : (
                filteredClients.map((client, index) => (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-medium text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-900">{client.id}</td>
                    <td className="px-6 py-4 text-sm font-bold text-slate-800">{client.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{client.email || ""}</td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">{client.contact}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[0.65rem] font-bold uppercase tracking-tighter">Individual</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[0.65rem] font-bold uppercase tracking-tighter border border-emerald-100">Active</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => navigate(`/emp/clients/${client.id}`)}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                        >
                          <Eye size={16} />
                        </button>
                        <button className="p-1.5 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors border border-transparent hover:border-amber-100">
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
              Showing 1 to {filteredClients.length} of {filteredClients.length} clients
            </p>
            <div className="flex items-center gap-1">
               <button className="p-2 text-slate-400 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"><ChevronLeft size={16} /></button>
               <button className="w-8 h-8 bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20">1</button>
               <button className="p-2 text-slate-400 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
