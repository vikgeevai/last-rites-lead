"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { motion, useInView, useScroll, useTransform, animate, stagger } from "framer-motion";
import {
  ArrowRight, Bell, Shield, BarChart3, Bot, FileDown, Zap,
  CheckCircle2, ChevronDown, Menu, X, Target, Clock,
  TrendingUp, Star, Lock, Globe, MessageSquare,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────
   MOTION VARIANTS
──────────────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer = (delay = 0, staggerDelay = 0.12) => ({
  hidden: {},
  show:   { transition: { staggerChildren: staggerDelay, delayChildren: delay } },
});

const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

/* ────────────────────────────────────────────────────────────
   COUNTER
──────────────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.4, 0, 0.2, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v) + suffix;
      },
    });
    return () => controls.stop();
  }, [inView, to, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ────────────────────────────────────────────────────────────
   LOGO
──────────────────────────────────────────────────────────── */
function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-base", md: "text-lg", lg: "text-2xl" };
  return (
    <div className={`flex items-center gap-3 select-none ${sizes[size]}`}>
      <div
        className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
        style={{ background: "var(--primary)", boxShadow: "0 0 20px rgba(37,99,235,0.4)" }}
      >
        <Target size={15} color="white" />
      </div>
      <span
        className="font-bold tracking-tight whitespace-nowrap"
        style={{ fontFamily: "'Playfair Display', serif", letterSpacing: "-0.01em" }}
      >
        Last Rites <span style={{ color: "var(--accent-light)" }}>Lead</span>
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────
   NAV
──────────────────────────────────────────────────────────── */
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 inset-x-0 z-50 h-16"
    >
      <div
        className="absolute inset-0 border-b transition-all duration-500"
        style={{
          background: scrolled ? "rgba(8, 8, 8, 0.94)" : "transparent",
          backdropFilter: scrolled ? "blur(24px)" : "none",
          borderColor: scrolled ? "var(--border)" : "transparent",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-6 h-full flex items-center justify-between">
        <Link href="/"><Logo /></Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works", "Pricing", "FAQ"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm transition-colors duration-200 font-medium"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
            >
              {l}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded font-medium transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="text-sm px-5 py-2.5 rounded font-semibold text-white transition-all duration-200"
            style={{ background: "var(--primary)", boxShadow: "0 0 20px rgba(37,99,235,0.25)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--primary-light)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(37,99,235,0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--primary)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 20px rgba(37,99,235,0.25)";
            }}
          >
            Get Access
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={22} style={{ color: "var(--text-primary)" }} /> : <Menu size={22} style={{ color: "var(--text-primary)" }} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden absolute top-16 inset-x-0 border-b p-6 space-y-4"
          style={{ background: "rgba(8,8,8,0.98)", borderColor: "var(--border)", backdropFilter: "blur(24px)" }}
        >
          {["Features", "How It Works", "Pricing", "FAQ"].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, "-")}`} className="block text-sm font-medium" style={{ color: "var(--text-secondary)" }} onClick={() => setOpen(false)}>{l}</a>
          ))}
          <Link href="/login" className="block w-full text-center text-sm px-5 py-3 rounded font-semibold text-white mt-4" style={{ background: "var(--primary)" }} onClick={() => setOpen(false)}>
            Get Access
          </Link>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ────────────────────────────────────────────────────────────
   HERO
──────────────────────────────────────────────────────────── */
const heroWords = ["Every", "Lead", "Has", "a", "Deadline."];

function Hero() {
  const { scrollY } = useScroll();
  const yParallax = useTransform(scrollY, [0, 500], [0, -80]);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      {/* Grid */}
      <div className="absolute inset-0 grid-bg opacity-60 pointer-events-none" />

      {/* Radial glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(37,99,235,0.08) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Second ambient blob */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none animate-drift"
        style={{ background: "radial-gradient(ellipse, rgba(56,189,248,0.05) 0%, transparent 70%)" }}
      />

      <motion.div
        style={{ y: yParallax }}
        className="relative z-10 mx-auto max-w-5xl px-6 text-center"
      >
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-10 font-mono-data text-xs tracking-widest uppercase"
          style={{ color: "var(--primary-light)" }}
        >
          <span className="w-8 h-px inline-block" style={{ background: "var(--primary)" }} />
          Precision Lead Intelligence
          <span className="w-8 h-px inline-block" style={{ background: "var(--primary)" }} />
        </motion.div>

        {/* Headline — staggered word reveal */}
        <div className="overflow-hidden mb-6">
          <motion.h1
            className="text-6xl md:text-8xl lg:text-[108px] font-bold leading-none tracking-tight font-display"
            variants={staggerContainer(0.25, 0.1)}
            initial="hidden"
            animate="show"
          >
            {heroWords.map((word, i) => (
              <motion.span
                key={i}
                variants={{
                  hidden: { opacity: 0, y: "40%" },
                  show:   { opacity: 1, y: "0%", transition: { duration: 0.65, ease: [0.4, 0, 0.2, 1] } },
                }}
                className="inline-block mr-[0.22em]"
                style={word === "Deadline." ? { color: "var(--primary-light)" } : {}}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.85, ease: [0.4, 0, 0.2, 1] }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ color: "var(--text-secondary)", fontWeight: 300 }}
        >
          The first business to respond wins —{" "}
          <em style={{ fontStyle: "italic", color: "var(--text-primary)", fontFamily: "'Playfair Display', serif" }}>always.</em>{" "}
          Last Rites Lead captures every enquiry, fires instant alerts, and surfaces exactly who needs to hear from you next.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.05 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
        >
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded text-base font-semibold text-white"
              style={{
                background: "var(--primary)",
                boxShadow: "0 0 40px rgba(37,99,235,0.35), 0 2px 0 rgba(255,255,255,0.08) inset",
              }}
            >
              Claim Your Territory
              <ArrowRight size={18} />
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-8 py-4 rounded text-base font-medium border transition-all duration-200"
              style={{ borderColor: "var(--border-hover)", color: "var(--text-secondary)" }}
            >
              See the System
              <ChevronDown size={16} />
            </a>
          </motion.div>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-10 md:gap-16"
        >
          {[
            { label: "Businesses using LRL", n: 500, suffix: "+" },
            { label: "Leads captured daily", n: 1200, suffix: "+" },
            { label: "Avg response improvement", n: 94, suffix: "%" },
          ].map(({ label, n, suffix }) => (
            <div key={label} className="text-center">
              <div
                className="text-4xl font-bold font-display mb-1"
                style={{ color: "var(--accent-light)" }}
              >
                <Counter to={n} suffix={suffix} />
              </div>
              <div className="text-xs uppercase tracking-widest font-mono-data" style={{ color: "var(--text-muted)" }}>
                {label}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Bottom scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "var(--text-muted)" }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   TRUTH SECTION
──────────────────────────────────────────────────────────── */
function TruthSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const truths = [
    {
      n: "01",
      stat: "9×",
      statLabel: "higher conversion",
      title: "Speed is the only edge.",
      body: "Respond within 5 minutes and you are 9× more likely to convert. 47 hours later? That lead belongs to someone else.",
    },
    {
      n: "02",
      stat: "62%",
      statLabel: "of leads ghost you",
      title: "Most leads require 3 touch-points.",
      body: "Without an automated follow-up system, 62% of enquiries disappear into silence — not because they didn't want to buy, but because you stopped showing up.",
    },
    {
      n: "03",
      stat: "$0",
      statLabel: "value of a missed lead",
      title: "An inbox is not a CRM.",
      body: "Scattered across WhatsApp, email, and spreadsheets, your leads have no home. No pipeline, no priority, no close.",
    },
  ];

  return (
    <section
      ref={ref}
      className="py-32 relative"
      style={{ background: "var(--bg-surface)" }}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 font-mono-data text-xs tracking-widest uppercase flex items-center gap-4"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="w-12 h-px" style={{ background: "var(--primary)", display: "inline-block" }} />
          The Problem
        </motion.div>

        {/* Headline */}
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-4xl md:text-6xl font-bold font-display mb-20 max-w-3xl"
          style={{ lineHeight: 1.05 }}
        >
          Your leads are dying while you check your inbox.
        </motion.h2>

        {/* Truth cards */}
        <motion.div
          variants={staggerContainer(0.2)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-0 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {truths.map(({ n, stat, statLabel, title, body }) => (
            <motion.div
              key={n}
              variants={fadeUp}
              className="py-10 pr-8 group"
              style={{ borderRight: "1px solid var(--border)" }}
            >
              {/* Editorial number */}
              <div className="editorial-number text-8xl mb-4" style={{ color: "rgba(255,255,255,0.04)" }}>
                {n}
              </div>

              {/* Stat */}
              <div className="mb-6">
                <div
                  className="text-5xl font-bold font-display"
                  style={{ color: "var(--primary-light)" }}
                >
                  {stat}
                </div>
                <div className="text-xs font-mono-data uppercase tracking-widest mt-1" style={{ color: "var(--accent)" }}>
                  {statLabel}
                </div>
              </div>

              <h3 className="text-xl font-bold font-display mb-3">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontWeight: 300 }}>
                {body}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   FEATURES
──────────────────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Bell size={20} />,
    label: "Real-Time Alerts",
    title: "You know before they close the tab.",
    body: "Sub-second Telegram and email alerts the moment any form is submitted. Day or night, weekend or holiday — zero lag, zero excuses.",
    tag: "< 1s delivery",
    accent: "var(--primary-light)",
    accentBg: "rgba(37,99,235,0.1)",
  },
  {
    icon: <MessageSquare size={20} />,
    label: "Auto-Reply Engine",
    title: "Your first impression, automated.",
    body: "A branded, personal reply lands in their inbox before your competitor even opens their CRM. Buy goodwill. Buy time. Buy the deal.",
    tag: "Instant reply",
    accent: "var(--accent-light)",
    accentBg: "rgba(56,189,248,0.1)",
  },
  {
    icon: <BarChart3 size={20} />,
    label: "Pipeline Dashboard",
    title: "See every deal. Miss nothing.",
    body: "Filterable stages, inline notes, drag-and-drop status updates, and full lead history — your entire pipeline in a single ruthlessly clean view.",
    tag: "Full visibility",
    accent: "var(--primary-light)",
    accentBg: "rgba(37,99,235,0.1)",
  },
  {
    icon: <Bot size={20} />,
    label: "AI Intelligence",
    title: "Your silent analyst. Always on.",
    body: "Pattern recognition across every lead — sources, timings, conversion windows. Actionable weekly reports that tell you exactly where to put your energy.",
    tag: "AI-powered",
    accent: "var(--accent-light)",
    accentBg: "rgba(56,189,248,0.1)",
  },
  {
    icon: <Star size={20} />,
    label: "Review Routing",
    title: "Happy clients go to Google. Feedback stays private.",
    body: "Smart conditional routing sends satisfied clients directly to your Google review page. Negative feedback is captured privately so you can fix it first.",
    tag: "Reputation guard",
    accent: "var(--primary-light)",
    accentBg: "rgba(37,99,235,0.1)",
  },
  {
    icon: <Shield size={20} />,
    label: "Spam Elimination",
    title: "Only real leads. Nothing else.",
    body: "Multi-layer bot detection, IP reputation checks, and ML scoring keep your pipeline clean. 99.2% accuracy. Your time is too valuable for junk.",
    tag: "99.2% accuracy",
    accent: "var(--accent-light)",
    accentBg: "rgba(56,189,248,0.1)",
  },
];

function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="features" ref={ref} className="py-32" style={{ background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="font-mono-data text-xs tracking-widest uppercase flex items-center gap-4 mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="w-12 h-px inline-block" style={{ background: "var(--accent)" }} />
            The Arsenal
          </motion.div>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="text-4xl md:text-6xl font-bold font-display"
            style={{ lineHeight: 1.05 }}
          >
            Six weapons.<br />
            <span style={{ color: "var(--accent-light)", fontStyle: "italic" }}>One mission.</span>
          </motion.h2>
        </div>

        {/* Feature grid */}
        <motion.div
          variants={staggerContainer(0.1, 0.09)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: "var(--border)", border: "1px solid var(--border)" }}
        >
          {FEATURES.map(({ icon, label, title, body, tag, accent, accentBg }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="p-8 flex flex-col gap-5 group cursor-default transition-all duration-300"
              style={{ background: "var(--bg-base)" }}
              whileHover={{
                background: "var(--bg-elevated)",
                transition: { duration: 0.2 },
              }}
            >
              {/* Icon + tag row */}
              <div className="flex items-center justify-between">
                <div
                  className="w-10 h-10 rounded flex items-center justify-center"
                  style={{ background: accentBg, color: accent }}
                >
                  {icon}
                </div>
                <span
                  className="text-xs font-mono-data uppercase tracking-widest px-2 py-1"
                  style={{ background: accentBg, color: accent }}
                >
                  {tag}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold font-display mb-2 leading-tight">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontWeight: 300 }}>
                  {body}
                </p>
              </div>

              {/* Bottom accent */}
              <div
                className="mt-auto h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   HOW IT WORKS
──────────────────────────────────────────────────────────── */
function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    {
      n: "I",
      title: "Connect your forms",
      body: "One line of code. Or connect Typeform, Tally, Gravity Forms, and 40+ others natively. You are live in under 5 minutes.",
      icon: <Globe size={18} />,
    },
    {
      n: "II",
      title: "Every lead flows in",
      body: "Submissions are captured, enriched, and filed automatically. Instant alerts fire. Auto-replies land. You look responsive — even at 2 AM.",
      icon: <Zap size={18} />,
    },
    {
      n: "III",
      title: "Track. Qualify. Close.",
      body: "Manage your pipeline with surgical precision. AI surfaces your hottest prospects. Every deal gets the attention it deserves.",
      icon: <TrendingUp size={18} />,
    },
  ];

  return (
    <section id="how-it-works" ref={ref} className="py-32" style={{ background: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono-data text-xs tracking-widest uppercase flex items-center gap-4 mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="w-12 h-px inline-block" style={{ background: "var(--primary)" }} />
          The System
        </motion.div>
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-4xl md:text-6xl font-bold font-display mb-20"
          style={{ lineHeight: 1.05 }}
        >
          Operational in{" "}
          <span style={{ color: "var(--primary-light)", fontStyle: "italic" }}>five minutes.</span>
        </motion.h2>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div
            className="absolute left-6 top-0 bottom-0 w-px hidden md:block"
            style={{ background: "linear-gradient(to bottom, var(--primary), var(--accent), transparent)" }}
          />

          <motion.div
            variants={staggerContainer(0.2, 0.18)}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="space-y-0"
          >
            {steps.map(({ n, title, body, icon }, i) => (
              <motion.div
                key={n}
                variants={slideLeft}
                className="flex gap-10 py-10 border-b"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Roman numeral */}
                <div className="flex-shrink-0 hidden md:flex items-start">
                  <div
                    className="w-12 h-12 rounded border flex items-center justify-center font-display font-bold text-lg relative z-10"
                    style={{
                      background: "var(--bg-surface)",
                      borderColor: i === 0 ? "var(--primary)" : "var(--border)",
                      color: i === 0 ? "var(--primary-light)" : "var(--text-muted)",
                    }}
                  >
                    {n}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div style={{ color: "var(--accent)" }}>{icon}</div>
                    <span className="font-mono-data text-xs uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-display mb-3">{title}</h3>
                  <p className="text-sm leading-relaxed max-w-lg" style={{ color: "var(--text-secondary)", fontWeight: 300 }}>
                    {body}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   TESTIMONIALS
──────────────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "We went from a 47-hour average response to under 6 minutes in the first week. Last Rites Lead paid for itself with the first booking it saved.",
    name: "Rachel Lim",
    role: "The Serenity Spa, Singapore",
    initials: "RL",
    metric: "↑ 94% response rate",
  },
  {
    quote: "The AI told me Tuesday mornings were killing our conversions. We adjusted our schedule and bookings jumped 31% the next month. Chilling. Accurate.",
    name: "Darren Chew",
    role: "CleanPro Services",
    initials: "DC",
    metric: "+31% bookings",
  },
  {
    quote: "I was drowning in my inbox. Now I log in once a day, see everything, and get on with running my business. It's the first CRM that actually fits how I work.",
    name: "Priscilla Yong",
    role: "LUMI Aesthetics",
    initials: "PY",
    metric: "3h/week saved",
  },
];

function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-32" style={{ background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="text-4xl md:text-5xl font-bold font-display max-w-sm"
            style={{ lineHeight: 1.1 }}
          >
            From the field.
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} style={{ color: "var(--accent-light)" }} fill="var(--accent-light)" />
            ))}
            <span className="text-sm ml-1 font-mono-data" style={{ color: "var(--text-muted)" }}>4.9 / 5.0</span>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer(0.1, 0.12)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-3 gap-px"
          style={{ background: "var(--border)", border: "1px solid var(--border)" }}
        >
          {TESTIMONIALS.map(({ quote, name, role, initials, metric }) => (
            <motion.div
              key={name}
              variants={fadeUp}
              className="p-8 flex flex-col gap-6"
              style={{ background: "var(--bg-base)" }}
            >
              {/* Quote mark */}
              <div
                className="text-6xl font-display leading-none -mb-4"
                style={{ color: "var(--primary-dark)", fontStyle: "italic" }}
              >
                "
              </div>

              <p
                className="text-base leading-relaxed flex-1"
                style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, color: "var(--text-primary)", fontStyle: "italic" }}
              >
                {quote}
              </p>

              <div
                className="self-start font-mono-data text-xs px-3 py-1.5"
                style={{ background: "rgba(37,99,235,0.1)", color: "var(--primary-light)", border: "1px solid rgba(37,99,235,0.2)" }}
              >
                {metric}
              </div>

              <div className="flex items-center gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                <div
                  className="w-10 h-10 rounded flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: "var(--primary)" }}
                >
                  {initials}
                </div>
                <div>
                  <div className="font-semibold text-sm">{name}</div>
                  <div className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>{role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   PRICING
──────────────────────────────────────────────────────────── */
function Pricing() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="pricing" ref={ref} className="py-32" style={{ background: "var(--bg-surface)" }}>
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="font-mono-data text-xs tracking-widest uppercase flex items-center justify-center gap-4 mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            <span className="w-8 h-px inline-block" style={{ background: "var(--accent)" }} />
            Investment
            <span className="w-8 h-px inline-block" style={{ background: "var(--accent)" }} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="text-4xl md:text-6xl font-bold font-display"
          >
            One price.<br />
            <span style={{ fontStyle: "italic", color: "var(--accent-light)" }}>Everything included.</span>
          </motion.h2>
        </div>

        <motion.div
          variants={staggerContainer(0.1, 0.15)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid md:grid-cols-2 gap-4"
        >
          {/* Annual */}
          <motion.div
            variants={fadeUp}
            className="relative p-10 border group"
            style={{
              background: "var(--bg-elevated)",
              borderColor: "rgba(37,99,235,0.35)",
              boxShadow: "0 0 60px rgba(37,99,235,0.06)",
            }}
            whileHover={{ borderColor: "rgba(37,99,235,0.6)", transition: { duration: 0.2 } }}
          >
            {/* Best value tag */}
            <div
              className="absolute top-0 right-8 -translate-y-1/2 font-mono-data text-xs uppercase tracking-widest px-3 py-1 text-white"
              style={{ background: "var(--primary)" }}
            >
              Best Value
            </div>

            <div className="mb-8">
              <div className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--accent)" }}>
                Annual Plan
              </div>
              <div className="flex items-end gap-3 mb-1">
                <span className="text-6xl font-bold font-display">$179</span>
                <span className="text-xl mb-2" style={{ color: "var(--text-muted)" }}>/yr</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm line-through" style={{ color: "var(--text-muted)" }}>$499/yr</span>
                <span className="font-mono-data text-xs uppercase" style={{ color: "#10b981" }}>Save $320</span>
              </div>
            </div>

            {[
              "Unlimited leads & forms",
              "Real-time alerts (Telegram + email)",
              "AI analytics & weekly reports",
              "Smart review routing",
              "Spam & bot protection",
              "CSV import / export",
              "Priority support",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <CheckCircle2 size={14} style={{ color: "var(--primary-light)", flexShrink: 0 }} />
                <span className="text-sm" style={{ fontWeight: 300 }}>{f}</span>
              </div>
            ))}

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/login"
                className="mt-8 flex items-center justify-center gap-2 w-full py-4 text-base font-semibold text-white"
                style={{ background: "var(--primary)", boxShadow: "0 0 30px rgba(37,99,235,0.3)" }}
              >
                Claim Your Spot
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>

          {/* Monthly */}
          <motion.div
            variants={fadeUp}
            className="p-10 border"
            style={{ background: "var(--bg-base)", borderColor: "var(--glass-border)" }}
          >
            <div className="mb-8">
              <div className="font-mono-data text-xs uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
                Monthly Plan
              </div>
              <div className="flex items-end gap-3 mb-1">
                <span className="text-6xl font-bold font-display">$24</span>
                <span className="text-xl mb-2" style={{ color: "var(--text-muted)" }}>/mo</span>
              </div>
              <div className="font-mono-data text-xs" style={{ color: "var(--text-muted)" }}>Cancel anytime</div>
            </div>

            {[
              "Unlimited leads & forms",
              "Real-time alerts (Telegram + email)",
              "AI analytics",
              "Smart review routing",
              "Spam & bot protection",
              "CSV import / export",
              "Standard support",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 py-3 border-b" style={{ borderColor: "var(--border)" }}>
                <CheckCircle2 size={14} style={{ color: "var(--text-muted)", flexShrink: 0 }} />
                <span className="text-sm" style={{ color: "var(--text-secondary)", fontWeight: 300 }}>{f}</span>
              </div>
            ))}

            <Link
              href="/login"
              className="mt-8 flex items-center justify-center gap-2 w-full py-4 text-base font-medium border transition-colors duration-200"
              style={{ borderColor: "var(--border-hover)", color: "var(--text-primary)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border-active)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border-hover)")}
            >
              Start Monthly
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   FAQ
──────────────────────────────────────────────────────────── */
const FAQS = [
  { q: "How does form integration work?", a: "Paste one line of JavaScript into any website — or connect via Zapier, Make, or our native integrations with Typeform, Tally, and Gravity Forms. Most businesses are live in under 5 minutes." },
  { q: "Can I manage multiple clients?", a: "Yes. Each client gets their own isolated workspace with separate forms, folders, and dashboards. White-label options are available on the annual plan." },
  { q: "How accurate is spam filtering?", a: "Our multi-layer filter blocks 99.2% of bots while keeping false positives below 0.1%. Every flagged lead is reviewable so nothing falls through the cracks." },
  { q: "Is my data secure?", a: "All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified and GDPR compliant. Your data is never sold or used for model training." },
  { q: "What happens if I cancel?", a: "Full access until your billing period ends. Export all your data as CSV at any time. No lock-in. No penalties. No nonsense." },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" ref={ref} className="py-32" style={{ background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono-data text-xs tracking-widest uppercase flex items-center gap-4 mb-8"
          style={{ color: "var(--text-muted)" }}
        >
          <span className="w-12 h-px inline-block" style={{ background: "var(--primary)" }} />
          Questions
        </motion.div>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-4xl md:text-5xl font-bold font-display mb-14"
          style={{ lineHeight: 1.1 }}
        >
          Answered.
        </motion.h2>

        <motion.div
          variants={staggerContainer(0.1, 0.08)}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="space-y-0 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          {FAQS.map(({ q, a }, i) => (
            <motion.div
              key={q}
              variants={fadeUp}
              className="border-b overflow-hidden"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                className="w-full flex items-center justify-between px-0 py-6 text-left group"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span
                  className="font-semibold pr-8 text-base group-hover:text-white transition-colors duration-200"
                  style={{ color: open === i ? "var(--text-primary)" : "var(--text-secondary)" }}
                >
                  {q}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                  style={{ color: open === i ? "var(--primary-light)" : "var(--text-muted)" }}
                >
                  <span className="text-xl font-light">+</span>
                </motion.div>
              </button>
              <motion.div
                initial={false}
                animate={{ height: open === i ? "auto" : 0, opacity: open === i ? 1 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                style={{ overflow: "hidden" }}
              >
                <p className="pb-6 text-sm leading-relaxed" style={{ color: "var(--text-secondary)", fontWeight: 300 }}>
                  {a}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   CTA BANNER
──────────────────────────────────────────────────────────── */
function CTABanner() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-40 relative overflow-hidden" style={{ background: "var(--bg-surface)" }}>
      {/* Ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(37,99,235,0.07) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          className="font-mono-data text-xs tracking-widest uppercase flex items-center justify-center gap-4 mb-10"
          style={{ color: "var(--primary-light)" }}
        >
          <span className="w-12 h-px inline-block" style={{ background: "var(--primary)" }} />
          No second chances in this business.
          <span className="w-12 h-px inline-block" style={{ background: "var(--primary)" }} />
        </motion.div>

        <motion.h2
          variants={fadeUp}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="text-5xl md:text-7xl font-bold font-display mb-6"
          style={{ lineHeight: 1.0 }}
        >
          Stop losing leads.
          <br />
          <span style={{ color: "var(--primary-light)", fontStyle: "italic" }}>Start closing them.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.65 }}
          className="text-lg max-w-xl mx-auto mb-12"
          style={{ color: "var(--text-secondary)", fontWeight: 300 }}
        >
          14-day free trial. No credit card required. Setup in under 5 minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/login"
              className="flex items-center gap-2 px-10 py-5 text-lg font-bold text-white"
              style={{ background: "var(--primary)", boxShadow: "0 0 60px rgba(37,99,235,0.4)" }}
            >
              Begin Free Trial
              <ArrowRight size={20} />
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7 }}
          className="flex flex-wrap items-center justify-center gap-8 mt-10 text-xs font-mono-data uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}
        >
          {["No credit card", "Cancel anytime", "SOC 2 certified", "GDPR compliant"].map((t) => (
            <div key={t} className="flex items-center gap-2">
              <CheckCircle2 size={12} style={{ color: "var(--accent)" }} />
              {t}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────────
   FOOTER
──────────────────────────────────────────────────────────── */
function Footer() {
  return (
    <footer className="py-16 border-t" style={{ borderColor: "var(--border)", background: "var(--bg-base)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-14">
          <div className="md:col-span-2">
            <Logo />
            <p className="text-sm mt-5 max-w-xs leading-relaxed" style={{ color: "var(--text-muted)", fontWeight: 300 }}>
              The precision CRM for service businesses that cannot afford to lose a single lead.
            </p>
            <p
              className="text-xs mt-4 font-mono-data italic"
              style={{ color: "rgba(37,99,235,0.5)" }}
            >
              "Every lead has a deadline."
            </p>
          </div>

          <div>
            <div className="font-mono-data text-xs uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>Product</div>
            {["Features", "Pricing", "Integrations", "Changelog"].map((l) => (
              <a key={l} href="#" className="block text-sm py-1.5 transition-colors duration-150" style={{ color: "var(--text-secondary)", fontWeight: 300 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
              >
                {l}
              </a>
            ))}
          </div>

          <div>
            <div className="font-mono-data text-xs uppercase tracking-widest mb-5" style={{ color: "var(--text-muted)" }}>Company</div>
            {["About", "Blog", "Privacy Policy", "Terms"].map((l) => (
              <a key={l} href="#" className="block text-sm py-1.5 transition-colors duration-150" style={{ color: "var(--text-secondary)", fontWeight: 300 }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--border)" }}>
          <p className="text-xs font-mono-data" style={{ color: "var(--text-muted)" }}>
            © 2026 Last Rites Lead. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { icon: Lock, label: "SOC 2" },
              { icon: Shield, label: "GDPR" },
              { icon: FileDown, label: "Data Export" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 font-mono-data text-xs" style={{ color: "var(--text-muted)" }}>
                <Icon size={11} />
                {label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ────────────────────────────────────────────────────────────
   PAGE
──────────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TruthSection />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}
