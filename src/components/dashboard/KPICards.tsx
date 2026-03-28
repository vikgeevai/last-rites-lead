"use client";
import { useRef, useEffect } from "react";
import { Users, TrendingUp, Clock, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { KPI_METRICS } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { animate } from "framer-motion";

function AnimatedNumber({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.4, 0, 0.2, 1],
      delay: 0.3,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

const CARDS = [
  {
    icon: Users,
    label: "Total Leads",
    value: KPI_METRICS.totalLeads,
    suffix: "",
    display: KPI_METRICS.totalLeads.toString(),
    delta: KPI_METRICS.totalLeadsDelta,
    deltaPositive: true,
    accent: "var(--primary-light)",
    accentBg: "rgba(37,99,235,0.1)",
    subtitle: "All time",
  },
  {
    icon: Zap,
    label: "This Month",
    value: KPI_METRICS.thisMonth,
    suffix: "",
    display: KPI_METRICS.thisMonth.toString(),
    delta: KPI_METRICS.thisMonthDelta,
    deltaPositive: true,
    accent: "var(--accent-light)",
    accentBg: "rgba(56,189,248,0.1)",
    subtitle: "March 2026",
  },
  {
    icon: TrendingUp,
    label: "Conversion Rate",
    value: KPI_METRICS.conversionRate,
    suffix: "%",
    display: `${KPI_METRICS.conversionRate}%`,
    delta: KPI_METRICS.conversionDelta,
    deltaPositive: true,
    accent: "#10b981",
    accentBg: "rgba(16,185,129,0.1)",
    subtitle: "Lead → Qualified",
  },
  {
    icon: Clock,
    label: "Avg. Response",
    value: 6,
    suffix: "m",
    display: "6m",
    delta: KPI_METRICS.responseDelta,
    deltaPositive: true,
    accent: "var(--accent)",
    accentBg: "rgba(56,189,248,0.08)",
    subtitle: "Industry avg: 47h",
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {CARDS.map(({ icon: Icon, label, value, suffix, delta, deltaPositive, accent, accentBg, subtitle }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] }}
          className="p-5 border transition-all duration-300 cursor-default group"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--glass-border)",
          }}
          whileHover={{
            borderColor: `${accent}40`,
            y: -2,
            transition: { duration: 0.2 },
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded flex items-center justify-center" style={{ background: accentBg }}>
              <Icon size={17} style={{ color: accent }} />
            </div>
            <div
              className="flex items-center gap-1 text-xs font-semibold font-mono-data px-2 py-1"
              style={{
                background: deltaPositive ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
                color: deltaPositive ? "#10b981" : "#ef4444",
              }}
            >
              {deltaPositive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {delta}
            </div>
          </div>

          <div
            className="text-3xl font-bold font-display mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            <AnimatedNumber to={value} suffix={suffix} />
          </div>

          <div className="text-sm font-medium mb-0.5" style={{ color: "var(--text-secondary)" }}>{label}</div>
          <div className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>{subtitle}</div>
        </motion.div>
      ))}
    </div>
  );
}
