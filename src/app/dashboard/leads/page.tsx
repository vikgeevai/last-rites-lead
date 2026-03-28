"use client";
import { useState, useEffect, useCallback } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { LeadStatus } from "@/lib/mock-data";
import {
  Plus, Search, Filter, ChevronDown, X, Phone, Mail, MapPin,
  MessageCircle, CheckCircle2, Clock, Archive, Trash2, Calendar,
  DollarSign, Tag, Home, Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL ?? "";
const API_KEY = process.env.NEXT_PUBLIC_CRM_API_KEY ?? "";

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#10b981", bg: "rgba(16,185,129,0.12)"  },
  contacted: { label: "Contacted", color: "#3b82f6", bg: "rgba(59,130,246,0.12)"  },
  qualified: { label: "Qualified", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)"  },
  junk:      { label: "Junk",      color: "#ef4444", bg: "rgba(239,68,68,0.12)"   },
  archived:  { label: "Archived",  color: "#6b7280", bg: "rgba(107,114,128,0.12)" },
};
const STATUS_ORDER: LeadStatus[] = ["new", "contacted", "qualified", "junk", "archived"];

interface Lead {
  id: string;
  date?: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  service: string;
  source: string;
  status: LeadStatus;
  notes?: string;
  responseTime?: string;
  planning_type?: string;
  arrangement_type?: string;
  disposition_type?: string;
  wake_duration?: string;
  location?: string;
  coffin_choice?: string;
  high_end_interest?: string;
  tentage_selected?: string;
  floral_photo_frame?: string;
  estimated_cost?: string;
  deceased_name?: string;
  death_cert_no?: string;
}

function StatusBadge({ status }: { status: LeadStatus }) {
  const { label, color, bg } = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap"
      style={{ background: bg, color }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
      {label}
    </span>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
      <div className="w-7 h-7 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: "rgba(37,99,235,0.1)" }}>
        <Icon size={13} style={{ color: "var(--primary-light)" }} />
      </div>
      <div className="min-w-0">
        <p className="text-xs mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{value}</p>
      </div>
    </div>
  );
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${CRM_URL}/api/leads`, { headers: { "x-api-key": API_KEY } });
      const data = await res.json();
      setLeads(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const updateStatus = async (id: string, status: LeadStatus) => {
    setUpdatingId(id);
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (selectedLead?.id === id) setSelectedLead(prev => prev ? { ...prev, status } : null);
    await fetch(`${CRM_URL}/api/leads`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-api-key": API_KEY },
      body: JSON.stringify({ id, status }),
    });
    setUpdatingId(null);
  };

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const matchSearch = !search || l.name.toLowerCase().includes(q) || l.email?.toLowerCase().includes(q) || l.phone?.includes(q) || l.service?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const countByStatus = (s: LeadStatus | "all") =>
    s === "all" ? leads.length : leads.filter(l => l.status === s).length;

  const waLink = (phone: string, name: string) =>
    `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi ${name}, this is Indian Life Memorial. We received your enquiry and would like to assist you.`)}`;

  return (
    <PageShell title="Leads Pipeline" subtitle={`${leads.length} total leads`}>
      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
        {/* Status pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["all", ...STATUS_ORDER] as (LeadStatus | "all")[]).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className="text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-150 flex items-center gap-1.5"
              style={{
                background: filterStatus === s
                  ? s === "all" ? "rgba(124,92,252,0.2)" : STATUS_CONFIG[s as LeadStatus].bg
                  : "rgba(255,255,255,0.04)",
                color: filterStatus === s
                  ? s === "all" ? "var(--primary-light)" : STATUS_CONFIG[s as LeadStatus].color
                  : "var(--text-muted)",
                border: filterStatus === s ? "1px solid transparent" : "1px solid rgba(255,255,255,0.06)",
              }}>
              {s === "all" ? "All" : STATUS_CONFIG[s as LeadStatus].label}
              <span className="text-xs px-1 rounded-sm" style={{ background: "rgba(255,255,255,0.1)" }}>
                {countByStatus(s)}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name, phone, service…"
            className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-64 transition-colors"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }}
            onFocus={e => (e.currentTarget.style.borderColor = "var(--primary)")}
            onBlur={e => (e.currentTarget.style.borderColor = "var(--glass-border)")}
          />
        </div>
      </div>

      {/* Table + Drawer */}
      <div className="flex gap-4 h-[calc(100vh-220px)]">
        {/* Table */}
        <div className="flex-1 rounded-2xl border overflow-hidden flex flex-col"
          style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}>
          <div className="overflow-y-auto flex-1">
            <table className="w-full min-w-[700px]">
              <thead className="sticky top-0 z-10" style={{ background: "var(--bg-elevated)" }}>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Date", "Contact", "Service", "Est. Cost", "Status", "Action"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: "var(--primary)", borderTopColor: "transparent" }} />
                      <p className="text-sm">Loading leads…</p>
                    </div>
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16" style={{ color: "var(--text-muted)" }}>
                    <Search size={28} style={{ opacity: 0.3, margin: "0 auto 8px" }} />
                    <p className="text-sm">No leads found</p>
                  </td></tr>
                ) : filtered.map((lead, i) => (
                  <tr key={lead.id}
                    className="cursor-pointer transition-colors"
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                      background: selectedLead?.id === lead.id ? "rgba(37,99,235,0.08)" : "transparent",
                    }}
                    onClick={() => setSelectedLead(selectedLead?.id === lead.id ? null : lead)}
                    onMouseEnter={e => { if (selectedLead?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { if (selectedLead?.id !== lead.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                  >
                    <td className="px-4 py-3.5">
                      <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
                        {lead.date ? new Date(lead.date).toLocaleDateString("en-SG", { day: "numeric", month: "short" }) : "—"}
                      </div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                        {lead.date ? new Date(lead.date).toLocaleTimeString("en-SG", { hour: "2-digit", minute: "2-digit" }) : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                          style={{ background: "var(--gradient, var(--primary))" }}>
                          {lead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{lead.name}</div>
                          <div className="text-xs" style={{ color: "var(--text-muted)" }}>{lead.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{lead.service || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold" style={{ color: "#10b981" }}>{lead.estimated_cost || "—"}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3.5">
                      <a href={waLink(lead.phone, lead.name)} target="_blank" rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                        style={{ background: "#16a34a" }}>
                        <MessageCircle size={12} />
                        WhatsApp
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 border-t flex items-center" style={{ borderColor: "var(--border)" }}>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Showing {filtered.length} of {leads.length} leads
            </span>
          </div>
        </div>

        {/* Lead detail drawer */}
        <AnimatePresence>
          {selectedLead && (
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-80 flex-shrink-0 rounded-2xl border overflow-y-auto flex flex-col"
              style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}
            >
              {/* Drawer header */}
              <div className="p-4 border-b flex items-center justify-between sticky top-0 z-10"
                style={{ background: "var(--bg-elevated)", borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "var(--primary)" }}>
                    {selectedLead.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{selectedLead.name}</p>
                    <StatusBadge status={selectedLead.status} />
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="w-7 h-7 flex items-center justify-center rounded-lg"
                  style={{ color: "var(--text-muted)" }}>
                  <X size={15} />
                </button>
              </div>

              {/* Quick actions */}
              <div className="p-4 border-b grid grid-cols-2 gap-2" style={{ borderColor: "var(--border)" }}>
                <a href={waLink(selectedLead.phone, selectedLead.name)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors"
                  style={{ background: "#16a34a" }}>
                  <MessageCircle size={13} /> WhatsApp
                </a>
                <a href={`tel:${selectedLead.phone}`}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold text-white transition-colors"
                  style={{ background: "var(--primary)" }}>
                  <Phone size={13} /> Call
                </a>
              </div>

              {/* Update status */}
              <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Update Status</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {STATUS_ORDER.map(s => (
                    <button key={s} onClick={() => updateStatus(selectedLead.id, s)}
                      disabled={updatingId === selectedLead.id}
                      className="py-1.5 px-2 rounded-lg text-xs font-semibold transition-all"
                      style={{
                        background: selectedLead.status === s ? STATUS_CONFIG[s].bg : "rgba(255,255,255,0.04)",
                        color: selectedLead.status === s ? STATUS_CONFIG[s].color : "var(--text-muted)",
                        border: selectedLead.status === s ? `1px solid ${STATUS_CONFIG[s].color}40` : "1px solid transparent",
                      }}>
                      {STATUS_CONFIG[s].label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Details */}
              <div className="p-4 flex flex-col gap-0">
                <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Contact</p>
                <DetailRow icon={Phone} label="Phone" value={selectedLead.phone} />
                <DetailRow icon={Mail} label="Email" value={selectedLead.email} />
                <DetailRow icon={MapPin} label="Address" value={selectedLead.address} />

                <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-1" style={{ color: "var(--text-muted)" }}>Funeral Plan</p>
                <DetailRow icon={Tag} label="Arrangement" value={selectedLead.arrangement_type} />
                <DetailRow icon={Tag} label="Planning Type" value={selectedLead.planning_type} />
                <DetailRow icon={Tag} label="Disposition" value={selectedLead.disposition_type} />
                <DetailRow icon={Clock} label="Duration" value={selectedLead.wake_duration} />
                <DetailRow icon={Home} label="Location" value={selectedLead.location} />
                <DetailRow icon={Tag} label="Casket" value={selectedLead.coffin_choice} />

                {selectedLead.estimated_cost && (
                  <div className="mt-4 p-3 rounded-xl text-center" style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.2)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>Estimated Value</p>
                    <p className="text-xl font-bold" style={{ color: "#60a5fa" }}>{selectedLead.estimated_cost}</p>
                  </div>
                )}

                {selectedLead.deceased_name && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-wider mt-4 mb-1" style={{ color: "var(--text-muted)" }}>Deceased</p>
                    <DetailRow icon={Tag} label="Name" value={selectedLead.deceased_name} />
                    <DetailRow icon={Tag} label="Death Cert No." value={selectedLead.death_cert_no} />
                  </>
                )}

                <div className="mt-4 pb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Submitted</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                    {selectedLead.date ? new Date(selectedLead.date).toLocaleString("en-SG", { dateStyle: "medium", timeStyle: "short" }) : "—"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
