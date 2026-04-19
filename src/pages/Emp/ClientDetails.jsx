import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronRight, MoreHorizontal, ArrowLeft,
  FileText, RefreshCw
} from "lucide-react";
import api from "../../api/api";

// â”€â”€â”€ Sub-components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const InfoField = ({ label, value, isLink }) => (
  <div className="space-y-1">
    <p className="text-[0.75rem] text-slate-400 font-medium">{label}</p>
    {isLink && value && value !== '"”' ? (
      <a href={`mailto:${value}`} className="text-[0.875rem] font-semibold text-[#10b981] hover:underline">
        {value}
      </a>
    ) : (
      <p className="text-[0.9375rem] font-bold text-slate-900">{value || '"”'}</p>
    )}
  </div>
);

const getFileIcon = (path = '') => {
  const ext = path.split('.').pop()?.toLowerCase();
  const color =
    ext === 'pdf' ? 'text-rose-400' :
    ['jpg','jpeg','png','webp'].includes(ext) ? 'text-blue-400' :
    'text-slate-400';
  return <FileText size={22} className={color} />;
};

const getFileName = (path = '') => path.split('/').pop() || path;

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ClientDetails = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const [client, setClient]     = useState(null);
  const [docs, setDocs]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [docsLoading, setDocsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');

  // â”€â”€ Fetch client profile â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/customers/${id}`);
        if (res.data.success) setClient(res.data.customer);
      } catch (err) {
        console.error("Error fetching client:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  // â”€â”€ Fetch customer documents â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        setDocsLoading(true);
        const res = await api.get(`/customer-documents/by-customer/${id}`);
        if (res.data.success) setDocs(res.data.documents || []);
      } catch (err) {
        console.error("Error fetching documents:", err);
      } finally {
        setDocsLoading(false);
      }
    };
    if (id) fetchDocs();
  }, [id]);

  // â”€â”€ Loading state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 border-[3px] border-[#10b981] border-t-transparent rounded-full animate-spin" />
          <p className="text-[0.75rem] font-bold text-slate-400 uppercase tracking-widest">
            Loading Client Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fcfcfc]">
        <div className="text-center">
          <p className="text-[1.25rem] font-bold text-slate-400">Client not found</p>
          <button onClick={() => navigate(-1)}
            className="mt-4 flex items-center gap-2 mx-auto px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold">
            <ArrowLeft size={16} /> Go Back
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'numeric', year: 'numeric' })
    : '"”';

  return (
    <div className="flex-1 min-h-screen bg-[#fcfcfc] font-sans text-slate-900">

      {/* â”€â”€ Sticky Header â”€â”€ */}
      <header className="h-[4rem] border-b border-slate-100 bg-white flex items-center justify-between px-[1rem] md:px-[2rem] sticky top-0 z-10">
        <div className="flex items-center gap-[0.5rem] text-[0.7rem] text-slate-400 font-medium overflow-hidden">
          <MoreHorizontal size={16} className="bg-slate-100 p-0.5 rounded cursor-pointer shrink-0" />
          <ChevronRight size={12} className="shrink-0" />
          <span className="hidden sm:inline">Dashboard</span>
          <ChevronRight size={12} className="hidden sm:inline shrink-0" />
          <span
            onClick={() => navigate('/emp/clients')}
            className="hidden sm:inline text-[#10b981] font-bold cursor-pointer hover:underline"
          >
            Clients
          </span>
          <ChevronRight size={12} className="hidden sm:inline shrink-0" />
          <span className="text-slate-900 font-bold truncate uppercase">{client.name}</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/emp/clients')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[0.8125rem] font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <ArrowLeft size={15} /> Back to Clients
          </button>
          <div className="w-[1.75rem] h-[1.75rem] bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 text-slate-700 font-bold text-[0.75rem]">
            E
          </div>
        </div>
      </header>

      <div className="p-[1rem] md:p-[2rem] max-w-[75rem] mx-auto">

        {/* â”€â”€ Page Title â”€â”€ */}
        <div className="mb-6">
          <h1 className="text-[1.75rem] font-black text-slate-900 tracking-tight">
            Client: <span className="font-black">{client.name}</span>
          </h1>
          <p className="text-[0.875rem] font-bold text-slate-400 mt-0.5">{client.id}</p>
        </div>

        {/* â”€â”€ Info Card (3-column) â”€â”€ */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm p-8 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:divide-x md:divide-slate-100">

            {/* Column 1: Basic Information */}
            <div className="space-y-6">
              <h2 className="text-[1rem] font-bold text-slate-900">Basic Information</h2>
              <div className="space-y-5">
                <InfoField label="Client ID"      value={client.id} />
                <InfoField label="Name"           value={client.name} />
                <InfoField label="Email"          value={client.email}  isLink />
                <InfoField label="Phone"          value={client.contact} />
                <InfoField label="Date of Birth"  value={formatDate(client.dob)} />
                <div className="space-y-1">
                  <p className="text-[0.75rem] text-slate-400 font-medium">Status</p>
                  <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full text-[0.75rem] font-bold">
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Column 2: Contact Information */}
            <div className="space-y-6 md:pl-8">
              <h2 className="text-[1rem] font-bold text-slate-900">Contact Information</h2>
              <div className="space-y-5">
                <InfoField label="Address"  value={client.address} />
                <div className="grid grid-cols-2 gap-4">
                  <InfoField label="City"   value={client.city} />
                  <InfoField label="State"  value={client.state} />
                </div>
                <InfoField label="Pincode"  value={client.pincode} />
                <InfoField label="Referred By" value={client.referred_by} />
              </div>
            </div>

            {/* Column 3: Additional Information */}
            <div className="space-y-6 md:pl-8">
              <h2 className="text-[1rem] font-bold text-slate-900">Additional Information</h2>
              <div className="space-y-5">
                <InfoField label="Aadhar Number" value={client.aadhar_card_number} />
                <InfoField label="PAN Number"    value={client.pan_card_number} />
                <InfoField label="Created At"    value={formatDate(client.created_at)} />
              </div>
            </div>

          </div>
        </div>

        {/* â”€â”€ Tabs â”€â”€ */}
        <div className="bg-white rounded-[1.25rem] border border-slate-100 shadow-sm overflow-hidden">

          {/* Tab Headers */}
          <div className="flex border-b border-slate-100 px-6 pt-2">
            {[
              { key: 'documents', label: `Documents (${docs.length})` },
              { key: 'billing',   label: 'Billing Info' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-3 text-[0.875rem] font-bold transition-all border-b-2 mr-4
                  ${activeTab === tab.key
                    ? 'border-[#10b981] text-[#10b981]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="p-6">
              {docsLoading ? (
                <div className="flex items-center justify-center py-12 gap-3">
                  <RefreshCw size={18} className="animate-spin text-slate-300" />
                  <p className="text-slate-400 text-[0.875rem] font-medium">Loading documents...</p>
                </div>
              ) : docs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText size={40} className="text-slate-200 mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-slate-400 font-bold text-[0.875rem]">No documents found for this client.</p>
                  <p className="text-slate-300 text-[0.8125rem] mt-1">Documents uploaded for this client will appear here.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {docs.map(doc => {
                    const fileName  = getFileName(doc.document_path);
                    const uploadDate = formatDate(doc.validity || doc.created_at);
                    return (
                      <div key={doc.id}
                        className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all">
                        {/* File icon */}
                        <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          {getFileIcon(doc.document_path)}
                        </div>
                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-[0.9375rem] truncate">{fileName}</p>
                          {doc.validity && (
                            <p className="text-[0.75rem] text-slate-400 font-medium mt-0.5">
                              Valid until: {uploadDate}
                            </p>
                          )}
                          {doc.doc_type && doc.doc_type !== 'general' && (
                            <p className="text-[0.75rem] text-[#10b981] font-semibold mt-0.5 capitalize">
                              {doc.doc_type.replace(/_/g, ' ')}
                            </p>
                          )}
                        </div>
                        {/* Doc ID badge */}
                        <span className="text-[0.6875rem] font-bold text-slate-300 font-mono shrink-0">
                          #{doc.id}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Billing Tab (placeholder) */}
          {activeTab === 'billing' && (
            <div className="p-6 text-center py-12">
              <p className="text-slate-400 font-bold text-[0.875rem]">No billing information available.</p>
              <p className="text-slate-300 text-[0.8125rem] mt-1">Billing records for this client will appear here.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
