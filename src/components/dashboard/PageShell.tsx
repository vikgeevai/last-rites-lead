"use client";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Bell, RefreshCw, LogOut } from "lucide-react";
import { useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export function PageShell({ title, subtitle, actions, children }: PageShellProps) {
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Hard redirect — forces a fresh browser request so the proxy
    // re-evaluates the now-cleared session cookie
    window.location.href = "/login";
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
    window.location.reload();
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
            <h1 className="text-base font-bold font-display" style={{ letterSpacing: "-0.01em" }}>
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {actions}
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
            >
              <Bell size={14} />
              <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ background: "var(--primary)" }} />
            </button>
            <div className="w-9 h-9 flex items-center justify-center text-xs font-bold text-white" style={{ background: "var(--primary)" }}>
              A
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="w-9 h-9 flex items-center justify-center border transition-colors duration-150"
              style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "var(--bg-elevated)" }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6" style={{ background: "var(--bg-base)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
