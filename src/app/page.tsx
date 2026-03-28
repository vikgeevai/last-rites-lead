"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  motion, useInView, useScroll, useTransform,
  animate, useMotionValue, useSpring, AnimatePresence,
} from "framer-motion";
import {
  ArrowRight, Bell, Shield, BarChart3, Bot, FileDown, Zap,
  CheckCircle2, ChevronDown, Menu, X, Target, Clock,
  TrendingUp, Star, Lock, Phone, Users, Activity,
  ChevronRight, AlertTriangle, Download, Settings, MessageCircle,
  Sparkles, Eye, Filter, Search,
} from "lucide-react";

/* ─── helpers ──────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};
const staggerWrap = (delay = 0, gap = 0.12) => ({
  hidden: {},
  show:   { transition: { staggerChildren: gap, delayChildren: delay } },
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  useEffect(() => {
    if (!inView || !ref.current) return;
    const c = animate(0, to, { duration: 2, ease: [0.4,0,0.2,1],
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; },
    });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

/* ─── 3-D tilt wrapper ────────────────────────────────────── */
function Tilt3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), { stiffness: 260, damping: 28 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 260, damping: 28 });

  return (
    <motion.div
      style={{ perspective: 1200, rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Dashboard Mockup ───────────────────────────────────────
   A pixel-perfect recreation of the actual CRM dashboard UI
──────────────────────────────────────────────────────────── */
const LEADS = [
  { name: "Rajan Kumar",      type: "Hindu",     value: "$8,500",  status: "new",       time: "2m ago" },
  { name: "Mary Fernandez",   type: "Catholic",  value: "$12,200", status: "contacted", time: "18m ago" },
  { name: "David Lee",        type: "Christian", value: "$6,800",  status: "new",       time: "32m ago" },
  { name: "Priya Nair",       type: "Hindu",     value: "$9,100",  status: "qualified", time: "1h ago" },
  { name: "Thomas Ang",       type: "Freethinker", value: "$5,400", status: "archived", time: "3h ago" },
];
const STATUS_STYLE: Record<string, string> = {
  new:       "bg-emerald-500/15 text-emerald-400",
  contacted: "bg-blue-500/15 text-blue-400",
  qualified: "bg-sky-400/15 text-sky-300",
  archived:  "bg-slate-500/15 text-slate-400",
};

function DashboardMockup({ activeTab = "leads" }: { activeTab?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-white/10 shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
         style={{ background: "#0a0a0a", transformStyle: "preserve-3d" }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/8" style={{ background: "#151515" }}>
        <div className="flex gap-1.5 flex-shrink-0">
          {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
            <div key={c} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
          ))}
        </div>
        <div className="flex-1 flex justify-center">
          <div className="bg-[#1a1a1a] rounded px-3 py-0.5 text-[10px] text-gray-500 font-mono max-w-[220px] w-full text-center border border-white/5">
            last-rites-lead.vercel.app
          </div>
        </div>
      </div>

      {/* App shell */}
      <div className="flex" style={{ minHeight: 320 }}>
        {/* Sidebar */}
        <div className="w-36 flex-shrink-0 border-r border-white/6 flex flex-col py-3 px-2 gap-0.5" style={{ background: "#0e0e0e" }}>
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Target size={10} color="white" />
            </div>
            <span className="text-[10px] font-bold text-white truncate" style={{ fontFamily: "serif" }}>Last Rites</span>
          </div>
          {[
            { icon: Activity,   label: "Dashboard",  active: activeTab === "dash" },
            { icon: Users,      label: "Leads",      active: activeTab === "leads", dot: true },
            { icon: BarChart3,  label: "Analytics",  active: activeTab === "analytics" },
            { icon: Sparkles,   label: "AI Insights",active: activeTab === "ai" },
            { icon: AlertTriangle, label: "Alerts",  active: activeTab === "alerts", badge: "3" },
            { icon: Download,   label: "Export",     active: false },
            { icon: Settings,   label: "Settings",   active: false },
          ].map(({ icon: Icon, label, active, dot, badge }) => (
            <div key={label}
              className={`flex items-center gap-2 px-2 py-1.5 rounded text-[10px] font-medium relative ${
                active ? "bg-blue-600/15 text-blue-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <Icon size={11} />
              <span className="truncate">{label}</span>
              {dot && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto flex-shrink-0" />}
              {badge && <div className="ml-auto text-[8px] bg-red-500 text-white rounded-full w-3.5 h-3.5 flex items-center justify-center flex-shrink-0">{badge}</div>}
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-3 overflow-hidden" style={{ background: "#080808" }}>
          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-2 mb-3">
            {[
              { label: "Total Leads", value: "247", delta: "+12%", color: "#60a5fa" },
              { label: "This Month",  value: "34",  delta: "+8",   color: "#34d399" },
              { label: "Conversion",  value: "23%", delta: "+3%",  color: "#a78bfa" },
            ].map((s) => (
              <div key={s.label} className="rounded-lg p-2.5 border border-white/6" style={{ background: "#111" }}>
                <div className="text-[9px] text-gray-500 mb-1">{s.label}</div>
                <div className="text-base font-bold" style={{ color: s.color, fontFamily: "serif" }}>{s.value}</div>
                <div className="text-[8px] text-emerald-400 mt-0.5">{s.delta}</div>
              </div>
            ))}
          </div>

          {/* Lead table */}
          <div className="rounded-lg border border-white/6 overflow-hidden" style={{ background: "#0d0d0d" }}>
            <div className="flex items-center gap-2 px-3 py-1.5 border-b border-white/6">
              <Search size={9} className="text-gray-600" />
              <span className="text-[9px] text-gray-600">Search leads…</span>
              <div className="ml-auto flex gap-1">
                <div className="px-1.5 py-0.5 rounded text-[8px] border border-white/8 text-gray-500 flex items-center gap-1">
                  <Filter size={7} /> Filter
                </div>
              </div>
            </div>
            {LEADS.map((l, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 border-b border-white/4 last:border-0">
                <div className="w-5 h-5 rounded-full bg-blue-900 flex items-center justify-center text-[8px] font-bold text-blue-300 flex-shrink-0">
                  {l.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[9px] font-semibold text-white/90 truncate">{l.name}</div>
                  <div className="text-[8px] text-gray-600">{l.type}</div>
                </div>
                <div className="text-[9px] font-bold text-emerald-400 flex-shrink-0">{l.value}</div>
                <div className={`text-[7px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${STATUS_STYLE[l.status]}`}>
                  {l.status}
                </div>
                <div className="text-[8px] text-gray-600 flex-shrink-0">{l.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Floating notification popup ────────────────────────── */
function FloatingAlert({ delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 60, y: 20 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.4,0,0.2,1] }}
      className="absolute bottom-8 right-4 z-20 rounded-xl shadow-2xl p-3 flex items-start gap-3 max-w-[200px]"
      style={{ background: "#111", border: "1px solid rgba(16,185,129,0.4)" }}
    >
      <div className="w-7 h-7 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
        <Bell size={12} className="text-emerald-400" />
      </div>
      <div>
        <div className="text-[10px] font-bold text-white">New Lead!</div>
        <div className="text-[9px] text-gray-400">Rajan Kumar · Hindu · $8,500</div>
        <div className="text-[8px] text-emerald-400 mt-0.5">Just now</div>
      </div>
    </motion.div>
  );
}

/* ─── Mini Analytics Chart ────────────────────────────────── */
function MiniChart() {
  const bars = [35, 55, 40, 70, 50, 85, 65, 90, 75, 100, 80, 95];
  return (
    <div className="flex items-end gap-1 h-16 pt-2">
      {bars.map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: i * 0.05, duration: 0.5, ease: [0.4,0,0.2,1] }}
          className="flex-1 rounded-sm"
          style={{ background: i === bars.length - 1 ? "#2563eb" : "rgba(37,99,235,0.25)" }}
        />
      ))}
    </div>
  );
}

/* ─── Logo ───────────────────────────────────────────────── */
function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
        <Target size={15} color="white" />
      </div>
      <span className={`font-bold text-lg tracking-tight ${dark ? "text-slate-900" : "text-white"}`}
            style={{ fontFamily: "serif", letterSpacing: "-0.01em" }}>
        Last Rites <span className="text-blue-600">Lead</span>
      </span>
    </div>
  );
}

/* ─── Nav ────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 inset-x-0 z-50 h-16"
    >
      <div className={`absolute inset-0 border-b transition-all duration-400 ${
        scrolled ? "bg-white/95 backdrop-blur-xl border-slate-200 shadow-sm" : "bg-transparent border-transparent"
      }`} />
      <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
        <Link href="/"><Logo dark={scrolled} /></Link>
        <div className="hidden md:flex items-center gap-8">
          {["Features","Dashboard","How It Works","Pricing"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`}
               className={`text-sm font-medium transition-colors duration-200 ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/70 hover:text-white"}`}>
              {l}
            </a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Link href="/login"
                className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${scrolled ? "text-slate-600 hover:text-slate-900" : "text-white/70 hover:text-white"}`}>
            Log in
          </Link>
          <Link href="/login"
                className="text-sm px-5 py-2.5 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all duration-200">
            Get Access →
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} className={scrolled ? "text-slate-900" : "text-white"} />
                : <Menu size={22} className={scrolled ? "text-slate-900" : "text-white"} />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="md:hidden absolute top-16 inset-x-0 bg-white/98 backdrop-blur-xl border-b border-slate-200 p-6 space-y-4 shadow-xl">
            {["Features","Dashboard","How It Works","Pricing"].map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g,"-")}`}
                 className="block text-sm font-medium text-slate-700" onClick={() => setOpen(false)}>{l}</a>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}
                  className="block w-full text-center text-sm px-5 py-3 rounded-lg font-semibold text-white bg-blue-600 mt-4">
              Get Access
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────── */
function Hero() {
  const { scrollY } = useScroll();
  const yMockup = useTransform(scrollY, [0, 600], [0, 60]);

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden"
             style={{ background: "linear-gradient(135deg, #0f1729 0%, #0a0f1e 40%, #050810 100%)" }}>
      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px)",
                    backgroundSize: "64px 64px" }} />

      {/* Glow blobs */}
      <motion.div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(37,99,235,0.15) 0%,transparent 70%)" }}
        animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(56,189,248,0.1) 0%,transparent 70%)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 2 }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <motion.div variants={staggerWrap(0.1, 0.15)} initial="hidden" animate="show">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300 text-xs font-medium mb-8">
            <Sparkles size={12} /> Built exclusively for Singapore funeral businesses
          </motion.div>
          <motion.h1 variants={fadeUp}
            className="text-5xl md:text-6xl xl:text-7xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "serif", letterSpacing: "-0.02em" }}>
            Every lead<br />
            has a{" "}
            <span style={{ backgroundImage: "linear-gradient(135deg,#60a5fa,#38bdf8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              deadline.
            </span>
          </motion.h1>
          <motion.p variants={fadeUp} className="text-lg text-white/60 leading-relaxed mb-10 max-w-lg font-light">
            The first funeral home to respond wins — <em className="text-white/80 not-italic">always.</em>{" "}
            Last Rites Lead captures every enquiry, fires instant WhatsApp alerts, and tells you exactly who to call next.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 mb-14">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/login"
                    className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white shadow-xl shadow-blue-600/30 transition-all duration-200"
                    style={{ background: "linear-gradient(135deg,#2563eb,#1d4ed8)" }}>
                Start Managing Leads <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <a href="#dashboard"
                 className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-medium text-white/70 border border-white/15 hover:border-white/30 hover:text-white transition-all duration-200">
                <Eye size={16} /> See the Dashboard
              </a>
            </motion.div>
          </motion.div>
          {/* Social proof */}
          <motion.div variants={fadeUp} className="flex items-center gap-6 flex-wrap">
            {[
              { n: "247", label: "Leads tracked" },
              { n: "5 min", label: "Avg response time" },
              { n: "94%", label: "Response rate" },
            ].map(({ n, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl font-bold text-white" style={{ fontFamily: "serif" }}>{n}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            ))}
            <div className="h-8 w-px bg-white/10 hidden sm:block" />
            <div className="flex -space-x-2">
              {["#f97316","#22c55e","#3b82f6","#a855f7"].map((c) => (
                <div key={c} className="w-8 h-8 rounded-full border-2 border-[#0a0f1e] flex items-center justify-center text-xs text-white font-bold"
                     style={{ background: c }}>
                  {c === "#f97316" ? "ILM" : ""}
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Right — 3D Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.4,0,0.2,1] }}
          style={{ y: yMockup }}
          className="relative hidden lg:block"
        >
          <Tilt3D>
            <DashboardMockup activeTab="leads" />
          </Tilt3D>
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute -left-6 top-1/3 rounded-xl p-3 shadow-2xl flex items-center gap-3"
            style={{ background: "#111827", border: "1px solid rgba(16,185,129,0.4)" }}
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Bell size={14} className="text-emerald-400" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">🔥 New Lead</div>
              <div className="text-[10px] text-gray-400">Rajan · Hindu · $8,500</div>
            </div>
          </motion.div>
          {/* Response badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute -right-4 bottom-16 rounded-xl p-3 shadow-2xl"
            style={{ background: "#111827", border: "1px solid rgba(37,99,235,0.4)" }}
          >
            <div className="text-[10px] text-gray-400 mb-1">Response time</div>
            <div className="text-lg font-bold text-blue-400" style={{ fontFamily: "serif" }}>4:32</div>
            <div className="text-[9px] text-emerald-400">↓ 83% faster</div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/30">
        <span className="text-[10px] uppercase tracking-widest font-mono">Scroll</span>
        <motion.div animate={{ y: [0,6,0] }} transition={{ duration: 1.6, repeat: Infinity }}>
          <ChevronDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ─── Trust Bar ─────────────────────────────────────────── */
function TrustBar() {
  const items = [
    "Indian Life Memorial", "24/7 Lead Capture", "WhatsApp Alerts",
    "AI Lead Scoring", "Real-Time Analytics", "CSV Export", "Secure Admin Login",
    "Neon Database", "Singapore-Based",
  ];
  return (
    <div className="bg-slate-50 border-y border-slate-200 py-4 overflow-hidden">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 whitespace-nowrap"
      >
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-slate-500 font-medium flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Feature Cards ──────────────────────────────────────── */
const FEATURES = [
  {
    icon: Bell,
    color: "#16a34a",
    bg: "from-emerald-50 to-white",
    label: "Instant Alerts",
    title: "Never miss a lead again",
    desc: "Every form submission from your website triggers an instant WhatsApp + email alert. Know within seconds — not hours.",
    preview: "alert",
  },
  {
    icon: BarChart3,
    color: "#2563eb",
    bg: "from-blue-50 to-white",
    label: "Live Analytics",
    title: "See where your leads come from",
    desc: "Track conversion rates, lead volume over time, service type breakdown, and revenue pipeline in real time.",
    preview: "chart",
  },
  {
    icon: Sparkles,
    color: "#7c3aed",
    bg: "from-violet-50 to-white",
    label: "AI Insights",
    title: "Know who to call first",
    desc: "Our AI scores every lead by estimated value and urgency, so you always know which enquiry deserves your immediate attention.",
    preview: "ai",
  },
  {
    icon: Shield,
    color: "#0ea5e9",
    bg: "from-sky-50 to-white",
    label: "Secure & Private",
    title: "Your data stays yours",
    desc: "HMAC-signed sessions, HTTP-only cookies, API key authentication, and CORS-restricted access. Enterprise-grade security.",
    preview: "security",
  },
  {
    icon: FileDown,
    color: "#f97316",
    bg: "from-orange-50 to-white",
    label: "CSV Export",
    title: "Take your data anywhere",
    desc: "Export any selection of leads with 20 customisable fields, date range filters, and status filters. One click.",
    preview: "export",
  },
  {
    icon: MessageCircle,
    color: "#16a34a",
    bg: "from-green-50 to-white",
    label: "WhatsApp CTA",
    title: "Convert faster via WhatsApp",
    desc: "One-click WhatsApp buttons pre-fill a personalised message to each lead. Respond while competitors are still logging in.",
    preview: "whatsapp",
  },
];

function FeaturePreview({ type }: { type: string }) {
  if (type === "alert") return (
    <div className="space-y-2">
      {[
        { name: "Rajan Kumar", val: "$8,500", ago: "2m", color: "#16a34a" },
        { name: "Mary Fernandez", val: "$12,200", ago: "18m", color: "#2563eb" },
      ].map((l) => (
        <motion.div key={l.name} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.4 }}
          className="flex items-center gap-3 bg-white rounded-xl p-3 shadow-sm border border-slate-100">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
               style={{ background: l.color }}>{l.name[0]}</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-slate-800 truncate">{l.name}</div>
            <div className="text-[10px] text-slate-500">New lead · {l.ago} ago</div>
          </div>
          <div className="text-xs font-bold text-emerald-600">{l.val}</div>
        </motion.div>
      ))}
      <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }} transition={{ delay: 0.3 }}
        className="flex items-center gap-2 bg-green-50 rounded-xl p-3 border border-green-200">
        <MessageCircle size={14} className="text-green-600 flex-shrink-0" />
        <span className="text-xs text-green-700 font-medium">WhatsApp alert sent instantly</span>
      </motion.div>
    </div>
  );

  if (type === "chart") return (
    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-slate-700">Lead Volume</span>
        <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Last 30 days</span>
      </div>
      <MiniChart />
      <div className="flex justify-between mt-2">
        {["Jan","Feb","Mar","Apr","May","Jun"].map((m) => (
          <span key={m} className="text-[8px] text-slate-400">{m}</span>
        ))}
      </div>
    </div>
  );

  if (type === "ai") return (
    <div className="space-y-2">
      {[
        { name: "Rajan Kumar",    score: 94, tag: "Hot",    color: "#dc2626" },
        { name: "Mary Fernandez", score: 81, tag: "Warm",   color: "#ea580c" },
        { name: "David Lee",      score: 67, tag: "Medium", color: "#ca8a04" },
      ].map((l, i) => (
        <motion.div key={l.name} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 bg-white rounded-lg p-2.5 shadow-sm border border-slate-100">
          <div className="text-xs font-bold w-6 text-center" style={{ color: l.color }}>{l.score}</div>
          <div className="flex-1 text-xs text-slate-700 truncate">{l.name}</div>
          <div className="text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: l.color }}>
            {l.tag}
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (type === "security") return (
    <div className="space-y-2">
      {[
        { label: "HMAC-SHA256 Sessions", ok: true },
        { label: "HTTP-Only Cookies", ok: true },
        { label: "API Key Authentication", ok: true },
        { label: "CORS Restrictions", ok: true },
        { label: "Env-stored Credentials", ok: true },
      ].map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-slate-600">{item.label}</span>
        </div>
      ))}
    </div>
  );

  if (type === "export") return (
    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
      <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Export Fields</div>
      <div className="flex flex-wrap gap-1">
        {["Name","Email","Phone","Service","Casket","Value","Status","Date"].map((f) => (
          <div key={f} className="text-[9px] px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-medium">{f}</div>
        ))}
      </div>
      <motion.div whileHover={{ scale: 1.02 }}
        className="mt-3 flex items-center justify-center gap-1.5 bg-blue-600 text-white text-xs font-semibold py-1.5 rounded-lg cursor-pointer">
        <Download size={11} /> Export CSV
      </motion.div>
    </div>
  );

  if (type === "whatsapp") return (
    <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm">
      <div className="text-[10px] text-slate-500 mb-2">Pre-filled message</div>
      <div className="bg-slate-50 rounded-lg p-2 text-[10px] text-slate-700 border border-slate-200 leading-relaxed">
        "Hi Rajan, this is Indian Life Memorial. Thank you for your enquiry for a Hindu funeral. We are here to help. May we speak with you?"
      </div>
      <motion.div whileHover={{ scale: 1.02 }}
        className="mt-2 flex items-center justify-center gap-1.5 text-white text-xs font-semibold py-1.5 rounded-lg cursor-pointer"
        style={{ background: "#25d366" }}>
        <MessageCircle size={11} /> Send via WhatsApp
      </motion.div>
    </div>
  );

  return null;
}

function FeaturesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section id="features" ref={ref} className="py-28 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div variants={staggerWrap()} initial="hidden" animate={inView ? "show" : "hidden"}
          className="text-center mb-16">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium mb-4 border border-blue-100">
            <Zap size={12} /> Everything you need
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "serif" }}>
            A CRM built for the<br />funeral industry
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-xl mx-auto font-light">
            Not a generic CRM you have to configure. Every feature is purpose-built for Indian funeral services in Singapore.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => {
            const ref2 = useRef(null);
            const inView2 = useInView(ref2, { once: true, margin: "-60px" });
            return (
              <motion.div key={f.label} ref={ref2}
                initial={{ opacity: 0, y: 32 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.4,0,0.2,1] }}
                whileHover={{ y: -4, boxShadow: "0 20px 60px rgba(0,0,0,0.1)" }}
                className={`rounded-2xl bg-gradient-to-br ${f.bg} p-6 border border-slate-100 transition-shadow duration-300`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                       style={{ background: f.color + "18" }}>
                    <f.icon size={16} style={{ color: f.color }} />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: f.color }}>
                    {f.label}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2" style={{ fontFamily: "serif" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5 font-light">{f.desc}</p>
                <FeaturePreview type={f.preview} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─── Dashboard Preview ──────────────────────────────────── */
function DashboardSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [tab, setTab] = useState<"leads"|"analytics"|"alerts">("leads");
  const TABS = [
    { key: "leads",     label: "📋 Leads" },
    { key: "analytics", label: "📊 Analytics" },
    { key: "alerts",    label: "🔔 Alerts" },
  ] as const;

  return (
    <section id="dashboard" ref={ref} className="py-28 bg-slate-50 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div variants={staggerWrap()} initial="hidden" animate={inView ? "show" : "hidden"}
          className="text-center mb-12">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-medium mb-4 border border-violet-100">
            <Eye size={12} /> Live product preview
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "serif" }}>
            Your command centre
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-xl mx-auto font-light">
            Every lead from Indian Life Memorial flows into one clean dashboard. See exactly what you're getting.
          </motion.p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8 gap-2">
          {TABS.map((t) => (
            <motion.button key={t.key} onClick={() => setTab(t.key)}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                tab === t.key
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-blue-300"
              }`}>
              {t.label}
            </motion.button>
          ))}
        </div>

        {/* Browser window */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4,0,0.2,1] }}
          className="max-w-5xl mx-auto"
        >
          {/* Browser chrome */}
          <div className="rounded-t-2xl border border-b-0 border-slate-200 bg-white px-5 py-4 flex items-center gap-3 shadow-sm">
            <div className="flex gap-1.5">
              {["#FF5F57","#FEBC2E","#28C840"].map((c) => (
                <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
              ))}
            </div>
            <div className="flex-1 bg-slate-100 rounded-lg px-3 py-1 text-xs text-slate-500 font-mono max-w-xs mx-auto text-center">
              last-rites-lead.vercel.app/dashboard/{tab}
            </div>
            <div className="flex gap-2">
              <div className="w-5 h-5 rounded bg-slate-100" />
              <div className="w-5 h-5 rounded bg-slate-100" />
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              {/* Dashboard app shell */}
              <div className="rounded-b-2xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200">
                <div className="flex" style={{ minHeight: 400, background: "#080808" }}>
                  {/* Sidebar */}
                  <div className="w-44 flex-shrink-0 border-r border-white/6 flex flex-col py-4 px-3 gap-0.5" style={{ background: "#0e0e0e" }}>
                    <div className="flex items-center gap-2 px-2 py-2 mb-3">
                      <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Target size={12} color="white" />
                      </div>
                      <span className="text-xs font-bold text-white" style={{ fontFamily: "serif" }}>Last Rites Lead</span>
                    </div>
                    {[
                      { icon: Activity,   label: "Dashboard" },
                      { icon: Users,      label: "Leads",     active: tab === "leads",     dot: true },
                      { icon: BarChart3,  label: "Analytics", active: tab === "analytics" },
                      { icon: Sparkles,   label: "AI Insights" },
                      { icon: AlertTriangle, label: "Alerts",  active: tab === "alerts", badge: "3" },
                      { icon: Download,   label: "Export" },
                      { icon: Settings,   label: "Settings" },
                    ].map(({ icon: Icon, label, active, dot, badge }: any) => (
                      <div key={label}
                        className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-xs font-medium ${
                          active ? "bg-blue-600/20 text-blue-400" : "text-gray-500"
                        }`}>
                        <Icon size={13} />
                        <span>{label}</span>
                        {dot && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-auto" />}
                        {badge && <div className="ml-auto text-[8px] bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">{badge}</div>}
                      </div>
                    ))}
                  </div>

                  {/* Main area */}
                  <div className="flex-1 p-5" style={{ background: "#080808" }}>
                    {/* Stats row */}
                    <div className="grid grid-cols-4 gap-3 mb-5">
                      {[
                        { label: "Total Leads",  value: "247", sub: "+12 this week",  color: "#60a5fa" },
                        { label: "This Month",   value: "34",  sub: "+8 vs last mo",  color: "#34d399" },
                        { label: "Conversion",   value: "23%", sub: "+3% vs last mo", color: "#a78bfa" },
                        { label: "Pipeline",     value: "$124k",sub: "Estimated",     color: "#fbbf24" },
                      ].map((s) => (
                        <div key={s.label} className="rounded-xl p-3 border border-white/6" style={{ background: "#111" }}>
                          <div className="text-[9px] text-gray-500 mb-1.5">{s.label}</div>
                          <div className="text-lg font-bold mb-0.5" style={{ color: s.color, fontFamily: "serif" }}>{s.value}</div>
                          <div className="text-[9px] text-emerald-400">{s.sub}</div>
                        </div>
                      ))}
                    </div>

                    {tab === "leads" && (
                      <div className="rounded-xl border border-white/6 overflow-hidden" style={{ background: "#0d0d0d" }}>
                        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/6">
                          <Search size={11} className="text-gray-600" />
                          <span className="text-xs text-gray-600">Search leads…</span>
                          <div className="ml-auto flex gap-1.5">
                            {["All","New","Contacted","Qualified"].map((s) => (
                              <div key={s} className={`px-2 py-0.5 rounded-full text-[9px] font-medium border ${s === "All" ? "bg-blue-600 text-white border-blue-600" : "border-white/10 text-gray-500"}`}>{s}</div>
                            ))}
                          </div>
                        </div>
                        {LEADS.map((l, i) => (
                          <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-3 px-4 py-2.5 border-b border-white/4 last:border-0 hover:bg-white/3 transition-colors">
                            <div className="w-7 h-7 rounded-full bg-blue-900 flex items-center justify-center text-xs font-bold text-blue-300">
                              {l.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-semibold text-white/90 truncate">{l.name}</div>
                              <div className="text-[10px] text-gray-500">{l.type} · {l.time}</div>
                            </div>
                            <div className="text-xs font-bold text-emerald-400">{l.value}</div>
                            <div className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[l.status]}`}>{l.status}</div>
                            <div className="flex gap-1.5">
                              <div className="w-6 h-6 rounded-lg bg-green-900/40 flex items-center justify-center">
                                <MessageCircle size={10} className="text-green-400" />
                              </div>
                              <div className="w-6 h-6 rounded-lg bg-blue-900/40 flex items-center justify-center">
                                <Phone size={10} className="text-blue-400" />
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}

                    {tab === "analytics" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-white/6 p-4" style={{ background: "#0d0d0d" }}>
                          <div className="text-xs text-gray-400 font-medium mb-3">Lead Volume (30 days)</div>
                          <div className="flex items-end gap-1 h-20">
                            {[40,55,35,70,50,85,65,90,75,100,80,95].map((h,i) => (
                              <motion.div key={i} initial={{ height:0 }} animate={{ height:`${h}%` }}
                                transition={{ delay: i*0.04, duration:0.5 }}
                                className="flex-1 rounded-sm" style={{ background: i===11 ? "#2563eb" : "rgba(37,99,235,0.3)" }} />
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl border border-white/6 p-4" style={{ background: "#0d0d0d" }}>
                          <div className="text-xs text-gray-400 font-medium mb-3">Service Breakdown</div>
                          <div className="space-y-2">
                            {[
                              { label: "Hindu / Indian", pct: 52, color: "#f97316" },
                              { label: "Catholic",        pct: 23, color: "#8b5cf6" },
                              { label: "Christian",       pct: 15, color: "#3b82f6" },
                              { label: "Freethinker",     pct: 10, color: "#10b981" },
                            ].map((s) => (
                              <div key={s.label}>
                                <div className="flex justify-between text-[9px] text-gray-500 mb-0.5">
                                  <span>{s.label}</span><span>{s.pct}%</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                                  <motion.div initial={{ width:0 }} animate={{ width:`${s.pct}%` }}
                                    transition={{ duration:0.7, delay:0.2 }}
                                    className="h-full rounded-full" style={{ background: s.color }} />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {tab === "alerts" && (
                      <div className="space-y-3">
                        {[
                          { name: "Rajan Kumar",    level: "Critical", time: "2h 15m", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
                          { name: "Mary Fernandez", level: "High",     time: "1h 42m", color: "#f97316", bg: "rgba(249,115,22,0.1)" },
                          { name: "David Lee",      level: "Medium",   time: "45m",    color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
                        ].map((a) => (
                          <div key={a.name} className="flex items-center gap-3 p-3 rounded-xl border border-white/6"
                               style={{ background: a.bg }}>
                            <AlertTriangle size={14} style={{ color: a.color }} className="flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-xs font-semibold text-white">{a.name}</div>
                              <div className="text-[10px] text-gray-500">No response for {a.time}</div>
                            </div>
                            <div className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ color: a.color, background: a.bg, border: `1px solid ${a.color}40` }}>
                              {a.level}
                            </div>
                            <div className="flex gap-1.5">
                              <div className="px-2 py-1 rounded-lg text-[9px] font-medium text-white" style={{ background: "#25d366" }}>WhatsApp</div>
                              <div className="px-2 py-1 rounded-lg text-[9px] font-medium text-white bg-blue-600">Call</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── How It Works ───────────────────────────────────────── */
function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const steps = [
    { n: "01", icon: Users, color: "#2563eb", title: "Customer submits a quote", desc: "Visitor completes the Get a Quote journey on Indian Life Memorial — service type, casket choice, estimated cost." },
    { n: "02", icon: Zap,   color: "#16a34a", title: "Instant alert fires", desc: "You receive a WhatsApp + email notification within seconds. The full lead — name, phone, service, budget — is at your fingertips." },
    { n: "03", icon: TrendingUp, color: "#7c3aed", title: "Track, score & close", desc: "Log into the dashboard to view all leads, update statuses, see AI scores, and export reports. Close faster than anyone else." },
  ];
  return (
    <section id="how-it-works" ref={ref} className="py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div variants={staggerWrap()} initial="hidden" animate={inView ? "show" : "hidden"}
          className="text-center mb-16">
          <motion.div variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium mb-4 border border-emerald-100">
            <Activity size={12} /> Simple 3-step process
          </motion.div>
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-slate-900 mb-4" style={{ fontFamily: "serif" }}>
            How it works
          </motion.h2>
          <motion.p variants={fadeUp} className="text-lg text-slate-500 max-w-lg mx-auto font-light">
            From customer enquiry to your follow-up call — the whole loop is automated.
          </motion.p>
        </motion.div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-16 left-[calc(50%/3+16%)] right-[calc(50%/3+16%)] h-px bg-slate-200" />
          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((s, i) => {
              const ref2 = useRef(null);
              const inView2 = useInView(ref2, { once: true, margin: "-60px" });
              return (
                <motion.div key={s.n} ref={ref2}
                  initial={{ opacity: 0, y: 32 }}
                  animate={inView2 ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: i * 0.15, ease: [0.4,0,0.2,1] }}
                  className="text-center">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                         style={{ background: s.color + "15", border: `2px solid ${s.color}25` }}>
                      <s.icon size={22} style={{ color: s.color }} />
                      <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[9px] font-bold text-white flex items-center justify-center"
                           style={{ background: s.color, fontSize: "9px" }}>{s.n}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3" style={{ fontFamily: "serif" }}>{s.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-light">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Stats Section ─────────────────────────────────────── */
function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="py-24 bg-slate-900 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none"
           style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
                    backgroundSize:"64px 64px" }} />
      <motion.div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse,rgba(37,99,235,0.12) 0%,transparent 70%)" }} />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div variants={staggerWrap()} initial="hidden" animate={inView ? "show" : "hidden"}
          className="text-center mb-16">
          <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "serif" }}>
            The numbers speak
          </motion.h2>
          <motion.p variants={fadeUp} className="text-slate-400 text-lg font-light">Why response speed defines who wins in the funeral industry.</motion.p>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { n: 9,   suffix: "×", label: "more conversions when you respond in 5 minutes", color: "#60a5fa" },
            { n: 62,  suffix: "%", label: "of funeral leads never get a timely response", color: "#f87171" },
            { n: 5,   suffix: "m", label: "is our guaranteed lead-to-alert delivery time", color: "#34d399" },
            { n: 247, suffix: "+", label: "leads processed through Last Rites Lead", color: "#a78bfa" },
          ].map(({ n, suffix, label, color }) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 border border-white/8" style={{ background: "#111" }}>
              <div className="text-5xl font-bold mb-3" style={{ color, fontFamily: "serif" }}>
                <Counter to={n} suffix={suffix} />
              </div>
              <p className="text-slate-400 text-sm leading-relaxed font-light">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ───────────────────────────────────────── */
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="py-28 bg-white">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.4,0,0.2,1] }}
          className="rounded-3xl p-12 relative overflow-hidden"
          style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #0369a1 100%)" }}
        >
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none"
               style={{ backgroundImage:"linear-gradient(rgba(255,255,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
                        backgroundSize:"32px 32px" }} />
          <motion.div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none opacity-30"
            style={{ background: "radial-gradient(ellipse,rgba(56,189,248,0.5) 0%,transparent 70%)" }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 5, repeat: Infinity }} />
          <div className="relative z-10">
            <motion.div initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}} transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 text-white text-xs font-medium mb-6 border border-white/20">
              <Lock size={12} /> Secure · Private · Purpose-built
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6" style={{ fontFamily: "serif", lineHeight: 1.15 }}>
              Your next lead is<br />waiting right now.
            </h2>
            <p className="text-xl text-blue-100 mb-10 font-light leading-relaxed max-w-2xl mx-auto">
              Log in and see every enquiry from Indian Life Memorial — past and present — in one clean, beautiful dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link href="/login"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold text-blue-700 bg-white shadow-2xl hover:bg-blue-50 transition-all duration-200">
                  Enter Dashboard <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a href="https://wa.me/6596875688"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium text-white border border-white/30 hover:bg-white/10 transition-all duration-200">
                  <MessageCircle size={18} /> WhatsApp Us
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-white/8 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo />
          <p className="text-sm text-slate-500 text-center">
            Built for Indian Life Memorial Singapore · {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-slate-500 hover:text-white transition-colors">Dashboard</Link>
            <a href="mailto:admin@indianlifememorial.com" className="text-sm text-slate-500 hover:text-white transition-colors">Contact</a>
            <a href="https://indian-life-memorial.vercel.app" className="text-sm text-slate-500 hover:text-white transition-colors">Main Site</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
      <Nav />
      <Hero />
      <TrustBar />
      <FeaturesSection />
      <DashboardSection />
      <HowItWorks />
      <StatsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
