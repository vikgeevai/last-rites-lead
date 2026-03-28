"use client";
import {
  ResponsiveContainer,
  LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { LEAD_VOLUME_DATA, STATUS_DISTRIBUTION, TOP_SOURCES, CALENDAR_DATA } from "@/lib/mock-data";
import { useState } from "react";

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm"
      style={{
        background: "var(--bg-elevated)",
        borderColor: "var(--glass-border)",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}
    >
      <div className="font-medium mb-2" style={{ color: "var(--text-secondary)" }}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "var(--text-muted)" }}>{p.name}:</span>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Lead Volume Chart ── */
export function LeadVolumeChart() {
  const [range, setRange] = useState<"7" | "30" | "90">("30");
  const ranges: Array<"7" | "30" | "90"> = ["7", "30", "90"];

  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-bold text-base">Lead Volume</h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>New leads vs contacted</p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}>
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="text-xs px-3 py-1.5 rounded-md font-medium transition-all duration-150"
              style={{
                background: range === r ? "rgba(37,99,235,0.2)" : "transparent",
                color: range === r ? "var(--primary-light)" : "var(--text-muted)",
              }}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={LEAD_VOLUME_DATA} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
          <defs>
            <linearGradient id="leadsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#2563EB" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="contactGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#38BDF8" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#38BDF8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.08)", strokeWidth: 1 }} />
          <Area type="monotone" dataKey="leads" name="Leads" stroke="#2563EB" strokeWidth={2} fill="url(#leadsGrad)" dot={false} activeDot={{ r: 4, fill: "#2563EB" }} />
          <Area type="monotone" dataKey="contacted" name="Contacted" stroke="#38BDF8" strokeWidth={2} fill="url(#contactGrad)" dot={false} activeDot={{ r: 4, fill: "#38BDF8" }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Status Donut ── */
const STATUS_LABEL: Record<string, string> = {
  New: "New",
  Contacted: "Contacted",
  Qualified: "Qualified",
  Junk: "Junk",
  Archived: "Archived",
};

function DonutTooltip({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full" style={{ background: payload[0].payload.color }} />
        <span style={{ color: "var(--text-secondary)" }}>{payload[0].name}:</span>
        <span className="font-bold" style={{ color: "var(--text-primary)" }}>{payload[0].value}%</span>
      </div>
    </div>
  );
}

export function StatusDonut() {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}
    >
      <div className="mb-4">
        <h3 className="font-bold text-base">Status Breakdown</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Lead distribution by stage</p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={STATUS_DISTRIBUTION}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
          >
            {STATUS_DISTRIBUTION.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="space-y-2 mt-2">
        {STATUS_DISTRIBUTION.map(({ name, value, color }) => (
          <div key={name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs flex-1" style={{ color: "var(--text-secondary)" }}>{STATUS_LABEL[name]}</span>
            <div className="flex items-center gap-2">
              <div
                className="h-1.5 rounded-full"
                style={{ width: `${value * 1.2}px`, background: color, opacity: 0.6 }}
              />
              <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Top Sources ── */
export function TopSources() {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}
    >
      <div className="mb-5">
        <h3 className="font-bold text-base">Top Sources</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Lead origin breakdown</p>
      </div>
      <div className="space-y-4">
        {TOP_SOURCES.map(({ source, leads, pct }, i) => (
          <div key={source}>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold w-4" style={{ color: "var(--text-muted)" }}>{i + 1}</span>
                <span className="text-sm font-medium">{source}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{leads} leads</span>
                <span className="text-xs font-bold w-10 text-right">{pct}%</span>
              </div>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background: ["var(--primary)", "var(--accent-light)", "#10b981", "#38BDF8", "#6b7280"][i],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Calendar Heatmap ── */
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function heatColor(count: number): string {
  if (count === 0) return "rgba(255,255,255,0.04)";
  if (count <= 3)  return "rgba(37,99,235,0.2)";
  if (count <= 6)  return "rgba(37,99,235,0.4)";
  if (count <= 9)  return "rgba(37,99,235,0.65)";
  return "rgba(37,99,235,0.9)";
}

export function CalendarHeatmap() {
  return (
    <div
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg-elevated)", borderColor: "var(--glass-border)" }}
    >
      <div className="mb-5">
        <h3 className="font-bold text-base">Activity Heatmap</h3>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Daily lead volume — last 35 days</p>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-xs" style={{ color: "var(--text-muted)" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1">
        {CALENDAR_DATA.map(({ day, count }) => (
          <div
            key={day}
            className="aspect-square rounded-md transition-all duration-150 cursor-default"
            style={{ background: heatColor(count) }}
            title={`${count} leads`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-4 justify-end">
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>Less</span>
        {[0, 0.2, 0.4, 0.65, 0.9].map((o, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-sm"
            style={{ background: o === 0 ? "rgba(255,255,255,0.04)" : `rgba(37,99,235,${o})` }}
          />
        ))}
        <span className="text-xs" style={{ color: "var(--text-muted)" }}>More</span>
      </div>
    </div>
  );
}
