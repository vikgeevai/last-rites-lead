"use client";
import { Target, TrendingUp, AlertTriangle, Info, ChevronRight, Zap } from "lucide-react";
import { AI_INSIGHTS } from "@/lib/mock-data";
import { motion } from "framer-motion";

const TYPE_CONFIG = {
  positive: { icon: TrendingUp,    color: "#10b981", bg: "rgba(16,185,129,0.08)",  border: "rgba(16,185,129,0.2)" },
  warning:  { icon: AlertTriangle, color: "var(--accent-light)", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)" },
  info:     { icon: Info,          color: "#3b82f6", bg: "rgba(59,130,246,0.08)",   border: "rgba(59,130,246,0.2)" },
};

export function AIInsights() {
  return (
    <div
      className="border p-6"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center"
            style={{ background: "rgba(37,99,235,0.1)", border: "1px solid rgba(37,99,235,0.25)" }}
          >
            <Target size={17} style={{ color: "var(--primary-light)" }} />
          </div>
          <div>
            <h3 className="font-bold text-base font-display">AI Insights</h3>
            <p className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>Updated just now</p>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 text-xs font-mono-data uppercase tracking-widest px-3 py-1.5"
          style={{ background: "rgba(37,99,235,0.1)", color: "var(--primary-light)", border: "1px solid rgba(37,99,235,0.2)" }}
        >
          <Zap size={10} />
          Live
        </div>
      </div>

      {/* Insights */}
      <div className="space-y-2">
        {AI_INSIGHTS.map(({ type, headline, detail }, i) => {
          const { icon: Icon, color, bg, border } = TYPE_CONFIG[type];
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="p-4 border transition-all duration-200 cursor-pointer group"
              style={{ background: bg, borderColor: border }}
              whileHover={{ x: 4, transition: { duration: 0.15 } }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="w-7 h-7 flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${color}15` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-tight mb-1">{headline}</p>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)", fontWeight: 300 }}>{detail}</p>
                </div>
                <ChevronRight size={13} className="flex-shrink-0 mt-1 transition-transform duration-150 group-hover:translate-x-1" style={{ color: "var(--text-muted)" }} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Generate */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="mt-5 w-full py-3 text-sm font-semibold border transition-all duration-200 flex items-center justify-center gap-2 font-mono-data uppercase tracking-wider"
        style={{ borderColor: "rgba(37,99,235,0.25)", color: "var(--primary-light)", background: "rgba(37,99,235,0.05)" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.1)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(37,99,235,0.05)"; }}
      >
        <Zap size={13} />
        Generate Full Report
      </motion.button>
    </div>
  );
}
