"use client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { KPICards } from "@/components/dashboard/KPICards";
import { LeadsTable } from "@/components/dashboard/LeadsTable";
import { LeadVolumeChart, StatusDonut, TopSources, CalendarHeatmap } from "@/components/dashboard/Charts";
import { AIInsights } from "@/components/dashboard/AIInsights";
import { Bell, Calendar, RefreshCw, ChevronDown, Target } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const TABS = ["Overview", "Leads", "Analytics", "AI Insights"] as const;
type Tab = typeof TABS[number];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 800));
    setRefreshing(false);
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg-base)" }}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="h-16 flex items-center justify-between px-6 border-b flex-shrink-0"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          <div>
            <h1
              className="text-base font-bold font-display"
              style={{ letterSpacing: "-0.01em" }}
            >
              Command Centre
            </h1>
            <p className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
              Last synced: just now
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="hidden sm:flex items-center gap-2 text-sm px-4 py-2 border transition-colors duration-150"
              style={{ borderColor: "var(--border)", color: "var(--text-secondary)", background: "var(--bg-elevated)" }}
            >
              <Calendar size={13} />
              <span className="font-mono-data text-xs">Mar 2026</span>
              <ChevronDown size={12} />
            </button>

            <button
              onClick={handleRefresh}
              className="w-9 h-9 flex items-center justify-center border transition-colors duration-150"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              aria-label="Refresh"
            >
              <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            </button>

            <button
              className="relative w-9 h-9 flex items-center justify-center border transition-colors duration-150"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
              aria-label="Notifications"
            >
              <Bell size={14} />
              <span
                className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--primary)" }}
              />
            </button>

            <div
              className="w-9 h-9 flex items-center justify-center text-xs font-bold text-white cursor-pointer"
              style={{ background: "var(--primary)" }}
            >
              RC
            </div>
          </div>
        </header>

        {/* Tab bar */}
        <div
          className="flex items-center gap-0 px-6 border-b flex-shrink-0"
          style={{ background: "var(--bg-surface)", borderColor: "var(--border)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-5 py-3.5 text-sm font-medium transition-all duration-150 relative font-mono-data text-xs uppercase tracking-wider"
              style={{ color: activeTab === tab ? "var(--text-primary)" : "var(--text-muted)" }}
            >
              {tab}
              {activeTab === tab && (
                <motion.span
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5"
                  style={{ background: "var(--primary)" }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--bg-base)" }}>
          {/* Welcome banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-5 mb-6 border flex items-center justify-between overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, rgba(37,99,235,0.07) 0%, rgba(56,189,248,0.03) 100%)",
              borderColor: "rgba(37,99,235,0.2)",
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 0% 50%, rgba(37,99,235,0.08) 0%, transparent 55%)" }}
            />
            <div className="relative z-10">
              <h2
                className="font-bold text-base font-display mb-1"
                style={{ letterSpacing: "-0.01em" }}
              >
                Good morning, Rachel{" "}
                <span aria-label="wave" role="img">👋</span>
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)", fontWeight: 300 }}>
                You have{" "}
                <span className="font-bold" style={{ color: "var(--primary-light)" }}>
                  6 new leads
                </span>{" "}
                since yesterday. 2 need immediate follow-up.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative z-10 hidden sm:flex items-center gap-2 text-sm px-5 py-2.5 font-semibold text-white flex-shrink-0"
              style={{ background: "var(--primary)", boxShadow: "0 0 20px rgba(37,99,235,0.3)" }}
            >
              <Target size={14} />
              Quick Follow-Up
            </motion.button>
          </motion.div>

          {/* KPIs */}
          <div className="mb-6">
            <KPICards />
          </div>

          {(activeTab === "Overview" || activeTab === "Analytics") && (
            <>
              <div className="grid lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2"><LeadVolumeChart /></div>
                <StatusDonut />
              </div>
              <div className="grid lg:grid-cols-3 gap-4 mb-6">
                <TopSources />
                <div className="lg:col-span-2"><CalendarHeatmap /></div>
              </div>
            </>
          )}

          {(activeTab === "Overview" || activeTab === "Leads") && (
            <div className="mb-6"><LeadsTable /></div>
          )}

          {(activeTab === "Overview" || activeTab === "AI Insights") && (
            <div className="mb-6"><AIInsights /></div>
          )}
        </main>
      </div>
    </div>
  );
}
