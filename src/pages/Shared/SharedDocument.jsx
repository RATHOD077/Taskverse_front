import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/api";
import { Download, Copy } from "lucide-react";

const SharedDocument = () => {
  const { token } = useParams();

  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState(null);
  const [error, setError] = useState("");
  const [blocked, setBlocked] = useState(false);
  const triggerBlocked = () => {
    setBlocked(true);
    setTimeout(() => setBlocked(false), 2000);
  };

  const API_BASE_URL = api.defaults.baseURL + "/media-library";

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/media-library/shared/${token}/meta`);
        if (res.data?.success) setMeta(res.data);
        else setError(res.data?.message || "Failed to load shared document");
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load shared document");
      } finally {
        setLoading(false);
      }
    };

    if (token) run();
  }, [token]);

  const previewUrl = meta?.fileUrl || (token ? `${API_BASE_URL}/shared/${token}/file` : "");
  const downloadUrl = meta?.downloadUrl || (token ? `${API_BASE_URL}/shared/${token}/download` : "");

  const isExpired = useMemo(() => {
    if (!meta) return false;
    return meta.remainingMinutes <= 0;
  }, [meta]);

  const remainingText = useMemo(() => {
    if (!meta) return "";
    if (meta.remainingMinutes <= 0) return "Expired";
    return `Expires in ${meta.remainingMinutes} minute(s)`;
  }, [meta]);

  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
    } catch {
      // ignore; user still sees download/view
    }
  };

  useEffect(() => {
    // Optional: live countdown refresh (no extra API calls)
    if (!meta?.expiresAt) return;
    const id = setInterval(() => {
      // force a re-render by touching state with same value
      setMeta((m) => {
        if (!m) return m;
        const expMs = new Date(m.expiresAt).getTime();
        const remainingMinutes = Math.ceil((expMs - Date.now()) / 60000);
        return { ...m, remainingMinutes };
      });
    }, 30000);
    return () => clearInterval(id);
  }, [meta?.expiresAt]);

  useEffect(() => {
    // Block context menu (right click) and common save/print shortcuts
    // on the shared link page.
    const onContextMenu = (e) => {
      e.preventDefault();
      triggerBlocked();
    };

    const onKeyDown = (e) => {
      const key = String(e.key || "").toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && (key === "s" || key === "p")) {
        e.preventDefault();
        triggerBlocked();
      }
    };

    document.addEventListener("contextmenu", onContextMenu);
    document.addEventListener("keydown", onKeyDown, { capture: true });
    return () => {
      document.removeEventListener("contextmenu", onContextMenu);
      document.removeEventListener("keydown", onKeyDown, { capture: true });
    };
  }, []);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm max-w-xl w-full">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">Share Document</h2>
          </div>
          <div className="mt-3 text-sm text-rose-600 font-semibold">{error}</div>
        </div>
      </div>
    );
  }

  const type = String(meta?.type || "").toLowerCase();
  const name = meta?.name || "Shared document";

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <style>{`
        .shared-no-scrollbar {
          scrollbar-width: none;        /* Firefox */
          -ms-overflow-style: none;     /* IE/Edge old */
        }
        .shared-no-scrollbar::-webkit-scrollbar {
          width: 0; height: 0;         /* Chrome/Safari */
        }
      `}</style>
      {blocked ? (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg">
          Access blocked: downloading/printing is not allowed on this shared view.
        </div>
      ) : null}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="text-slate-500 text-xs font-bold uppercase tracking-wider">Shared Document</div>
              <h1 className="text-xl font-bold text-slate-900 truncate">{name}</h1>
              <div className="text-xs text-slate-500 font-medium mt-1">
                {remainingText}
              </div>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {isExpired ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 font-semibold">
                This link has expired. Document can't be opened.
              </div>
            ) : (
              <div onClickCapture={() => triggerBlocked()}>
                {type.includes("image") ? (
                  <img
                    src={previewUrl}
                    alt={name}
                    className="w-full h-auto max-h-[70vh] object-contain rounded-xl border border-slate-200 bg-white"
                  />
                ) : type.includes("pdf") ? (
                  // "Scroll-only" wrapper:
                  // Scrolling will be done using the wrapper (vertical only).
                  <div
                    className="w-full rounded-xl border border-slate-200 bg-white overflow-y-scroll overflow-x-hidden shared-no-scrollbar"
                    style={{ height: "70vh" }}
                  >
                    <iframe
                      title="Shared PDF"
                      src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                      className="w-full rounded-xl bg-white"
                      style={{ height: "1200px", pointerEvents: "none" }}
                    />
                  </div>
                ) : type.includes("video") ? (
                  <video
                    controls
                    src={previewUrl}
                    className="w-full max-h-[70vh] rounded-xl border border-slate-200 bg-black"
                  />
                ) : type.includes("audio") ? (
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <audio controls src={previewUrl} className="w-full" />
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center">
                    <div className="font-bold text-slate-800">Preview not available for this type</div>
                    <div className="text-xs text-slate-500 font-medium mt-2">
                      You can download this document if download access is enabled.
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">File Name</div>
                  <div className="text-sm font-bold text-slate-800 truncate">{name}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">File Type</div>
                  <div className="text-sm font-bold text-slate-800">{meta?.type}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">File Size</div>
                  <div className="text-sm font-bold text-slate-800">{meta?.fileSize}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Uploaded</div>
                  <div className="text-sm font-bold text-slate-800">{meta?.uploadedAt}</div>
                </div>
              </div>

              <div className="flex gap-3 mt-4 flex-col sm:flex-row">
                <button
                  type="button"
                  onClick={() => copyToClipboard(window.location.href)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Copy size={16} />
                  Copy Link
                </button>

                {meta?.allowDownload && !isExpired ? (
                  <a
                    href={downloadUrl}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Download size={16} />
                    Download
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedDocument;

