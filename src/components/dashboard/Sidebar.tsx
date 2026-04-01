"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Target, LayoutDashboard, Users, BarChart3, Bell, Settings,
  LogOut, ChevronLeft, ChevronRight, Bot, FileDown,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard",  href: "/dashboard",            badge: null },
  { icon: Users,           label: "Leads",       href: "/dashboard/leads",       badge: "43" },
  { icon: BarChart3,       label: "Analytics",   href: "/dashboard/analytics",   badge: null },
  { icon: Bot,             label: "AI Insights", href: "/dashboard/ai",          badge: "4"  },
  { icon: Bell,            label: "Alerts",      href: "/dashboard/alerts",      badge: "2"  },
  { icon: FileDown,        label: "Export",      href: "/dashboard/export",      badge: null },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="relative flex flex-col h-screen border-r transition-all duration-300 flex-shrink-0"
      style={{
        width: collapsed ? "64px" : "220px",
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b shrink-0 overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "var(--primary)", boxShadow: "0 0 16px rgba(37,99,235,0.3)" }}
          >
            <Target size={15} color="white" />
          </div>
          {!collapsed && (
            <span
              className="font-bold text-sm whitespace-nowrap"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Last Rites <span style={{ color: "var(--accent-light)" }}>Lead</span>
            </span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-hidden">
        {NAV.map(({ icon: Icon, label, href, badge }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150 relative overflow-hidden"
              )}
              style={{
                background: active ? "rgba(37,99,235,0.12)" : "transparent",
                borderLeft: active ? "2px solid var(--primary)" : "2px solid transparent",
                color: active ? "var(--text-primary)" : "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                }
              }}
              title={collapsed ? label : undefined}
            >
              <Icon size={17} className="flex-shrink-0" style={{ color: active ? "var(--primary-light)" : "inherit" }} />
              {!collapsed && <span className="truncate">{label}</span>}
              {!collapsed && badge && (
                <span
                  className="ml-auto text-xs font-mono-data px-1.5 py-0.5"
                  style={{ background: "rgba(37,99,235,0.15)", color: "var(--primary-light)" }}
                >
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="py-4 px-2 border-t space-y-0.5 shrink-0" style={{ borderColor: "var(--border)" }}>
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"; (e.currentTarget as HTMLElement).style.color = "var(--text-primary)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={17} className="flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-150"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.07)"; (e.currentTarget as HTMLElement).style.color = "#fca5a5"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
          title={collapsed ? "Log out" : undefined}
        >
          <LogOut size={17} className="flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-200 z-10"
        style={{
          background: "var(--bg-elevated)",
          borderColor: "var(--border)",
          color: "var(--text-muted)",
        }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  );
}
