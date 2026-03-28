"use client";
import { useState } from "react";
import { PageShell } from "@/components/dashboard/PageShell";
import { motion } from "framer-motion";
import {
  User, Building2, Bell, Key, Shield, CheckCircle2, Copy, Eye, EyeOff,
} from "lucide-react";

const CRM_URL = process.env.NEXT_PUBLIC_CRM_URL ?? "";

const TABS = ["Profile", "Business", "Notifications", "API & Security"] as const;
type Tab = typeof TABS[number];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5 mb-4"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}>
      <h3 className="text-sm font-bold mb-4" style={{ color: "var(--text-secondary)", letterSpacing: "0.02em" }}>{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, defaultValue, placeholder, type = "text", disabled }: {
  label: string; defaultValue?: string; placeholder?: string; type?: string; disabled?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="text-xs font-semibold block mb-1.5" style={{ color: "var(--text-muted)" }}>{label}</label>
      <input type={type} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled}
        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors"
        style={{
          background: disabled ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.04)",
          border: "1px solid var(--glass-border)",
          color: disabled ? "var(--text-muted)" : "var(--text-primary)",
          cursor: disabled ? "not-allowed" : "text",
        }}
        onFocus={e => { if (!disabled) e.currentTarget.style.borderColor = "var(--primary)"; }}
        onBlur={e => { e.currentTarget.style.borderColor = "var(--glass-border)"; }}
      />
    </div>
  );
}

function Toggle({ label, description, defaultChecked }: {
  label: string; description?: string; defaultChecked?: boolean;
}) {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0" style={{ borderColor: "var(--border)" }}>
      <div>
        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
        {description && <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{description}</p>}
      </div>
      <button onClick={() => setOn(!on)}
        className="relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0"
        style={{ background: on ? "var(--primary)" : "rgba(255,255,255,0.12)" }}>
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all duration-200"
          style={{ left: on ? "calc(100% - 22px)" : "2px" }} />
      </button>
    </div>
  );
}

function SaveButton({ onClick }: { onClick?: () => void }) {
  const [saved, setSaved] = useState(false);
  const handle = () => {
    setSaved(true);
    onClick?.();
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <motion.button whileTap={{ scale: 0.97 }} onClick={handle}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
      style={{ background: saved ? "#16a34a" : "var(--primary)" }}>
      {saved ? <><CheckCircle2 size={14} /> Saved!</> : "Save Changes"}
    </motion.button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Profile");
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const apiKey = "353d47822cd9c6b3a3b382c099d36f3cf4331dce238cafe225218ab119d0c26f";

  const copyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageShell title="Settings" subtitle="Configure your CRM">
      <div className="max-w-2xl">
        {/* Tab bar */}
        <div className="flex items-center gap-1 mb-5 p-1 rounded-xl w-fit"
          style={{ background: "var(--bg-elevated)", border: "1px solid var(--glass-border)" }}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: activeTab === tab ? "var(--primary)" : "transparent",
                color: activeTab === tab ? "white" : "var(--text-muted)",
              }}>
              {tab}
            </button>
          ))}
        </div>

        {/* Profile */}
        {activeTab === "Profile" && (
          <>
            <Section title="Personal Information">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
                  style={{ background: "var(--primary)" }}>RC</div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Viknesh Geevan</p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Administrator</p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-0">
                <Field label="First Name" defaultValue="Viknesh" />
                <Field label="Last Name" defaultValue="Geevan" />
              </div>
              <Field label="Email Address" defaultValue="admin@indianlifememorial.com" type="email" />
              <Field label="Phone" defaultValue="+65 9687 5688" />
            </Section>
            <div className="flex justify-end"><SaveButton /></div>
          </>
        )}

        {/* Business */}
        {activeTab === "Business" && (
          <>
            <Section title="Business Details">
              <Field label="Business Name" defaultValue="Indian Life Memorial Singapore" />
              <Field label="Business Email" defaultValue="admin@indianlifememorial.com" type="email" />
              <Field label="Phone" defaultValue="+65 9687 5688" />
              <Field label="Website" defaultValue="https://indian-life-memorial.vercel.app" />
              <Field label="Address" defaultValue="Singapore" />
            </Section>
            <Section title="Response SLA">
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>
                Set your target response time. Leads exceeding this will appear in Alerts.
              </p>
              <div className="flex items-center gap-3">
                <input type="number" defaultValue={30} min={1} max={1440}
                  className="w-24 px-3 py-2 rounded-xl text-sm outline-none text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--glass-border)", color: "var(--text-primary)" }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)" }}>minutes</span>
              </div>
            </Section>
            <div className="flex justify-end"><SaveButton /></div>
          </>
        )}

        {/* Notifications */}
        {activeTab === "Notifications" && (
          <>
            <Section title="Email Notifications">
              <Toggle label="New lead received" description="Email to admin@indianlifememorial.com when a new lead comes in" defaultChecked />
              <Toggle label="Urgent lead alert" description="Alert when a lead has been waiting over 30 minutes" defaultChecked />
              <Toggle label="Daily summary" description="Morning digest of yesterday's leads and metrics" />
              <Toggle label="Weekly report" description="Monday morning performance summary" />
            </Section>
            <Section title="Delivery">
              <Field label="Notification email" defaultValue="admin@indianlifememorial.com" type="email" />
              <Field label="WhatsApp alerts (optional)" placeholder="+65 XXXX XXXX" />
            </Section>
            <div className="flex justify-end"><SaveButton /></div>
          </>
        )}

        {/* API & Security */}
        {activeTab === "API & Security" && (
          <>
            <Section title="API Key">
              <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                This key authenticates requests from your memorial site to this CRM. Keep it secret — never share it publicly.
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-xl text-xs font-mono overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", color: "var(--text-secondary)" }}>
                  {showKey ? apiKey : "•".repeat(32)}
                </div>
                <button onClick={() => setShowKey(!showKey)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border"
                  style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}>
                  {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <button onClick={copyKey}
                  className="w-9 h-9 flex items-center justify-center rounded-xl border transition-colors"
                  style={{
                    borderColor: copied ? "rgba(16,185,129,0.4)" : "var(--border)",
                    color: copied ? "#10b981" : "var(--text-muted)",
                    background: copied ? "rgba(16,185,129,0.1)" : "var(--bg-elevated)",
                  }}>
                  {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </Section>

            <Section title="CRM Endpoint">
              <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>Use this URL in your memorial site to send leads.</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 px-3 py-2.5 rounded-xl text-xs font-mono"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--glass-border)", color: "var(--primary-light)" }}>
                  {CRM_URL || "https://last-rites-lead.vercel.app"}/api/leads
                </div>
              </div>
            </Section>

            <Section title="Security">
              <div className="space-y-3">
                {[
                  { icon: Shield, label: "API key authentication", desc: "All requests require x-api-key header", ok: true },
                  { icon: Shield, label: "CORS restriction", desc: "Only your memorial site can call the API", ok: true },
                  { icon: Shield, label: "HTTPS only", desc: "All traffic encrypted via TLS", ok: true },
                  { icon: Key, label: "Database encryption", desc: "Neon Postgres encrypts data at rest", ok: true },
                ].map(({ icon: Icon, label, desc, ok }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(16,185,129,0.1)" }}>
                      <Icon size={13} style={{ color: "#10b981" }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                        {ok && <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold"
                          style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>Active</span>}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}
      </div>
    </PageShell>
  );
}
