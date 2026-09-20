"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShieldAlert,
  Layers,
  Network,
  AlertTriangle,
  History,
  Activity,
  MessageSquareQuote,
  FileText,
  UploadCloud,
  Zap,
  Radio,
  RefreshCw,
  Home,
  Menu,
  X,
  ChevronRight,
  Search,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
  Lock
} from "lucide-react";
import { 
  fetchHealth, 
  fetchConflicts, 
  loadDemoProject,
  fetchDecisionDNA 
} from "../lib/api";
import { HealthScoreBreakdown, Conflict } from "../lib/types";
import { PassportDrawer } from "./PassportDrawer";
import { LiveModeModal } from "./LiveModeModal";
import { DecisionDNA } from "./DecisionDNA";
import confetti from "canvas-confetti";

interface VetraAppShellProps {
  children: React.ReactNode;
  pageTitle?: string;
  pageDescription?: string;
  onRefresh?: () => void;
}

export const VetraAppShell: React.FC<VetraAppShellProps> = ({
  children,
  pageTitle,
  pageDescription,
  onRefresh,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [health, setHealth] = useState<HealthScoreBreakdown | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(false);

  // Modals
  const [isPassportOpen, setIsPassportOpen] = useState(false);
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [selectedDNA, setSelectedDNA] = useState<any | null>(null);
  const [isDNAOpen, setIsDNAOpen] = useState(false);

  const loadNavData = async () => {
    try {
      const [h, c] = await Promise.all([fetchHealth(), fetchConflicts()]);
      setHealth(h);
      setConflicts(c);
    } catch (err) {
      console.warn("Error fetching nav data:", err);
    }
  };

  useEffect(() => {
    loadNavData();
  }, [pathname]);

  const handleLoadDemo = async () => {
    setLoadingDemo(true);
    try {
      await loadDemoProject();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.2 },
        colors: ["#7C3AED", "#22D3EE", "#10B981"]
      });
      await loadNavData();
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDemo(false);
    }
  };

  const navItems = [
    {
      name: "Command Center",
      href: "/workspace",
      icon: Layers,
      description: "Unified 3-panel decision studio",
      badge: "Main"
    },
    {
      name: "Decision Graph",
      href: "/graph",
      icon: Network,
      description: "Interactive topology & blast radius",
    },
    {
      name: "Conflict Radar",
      href: "/conflicts",
      icon: Flame,
      description: "3-way artifact contradiction triage",
      badge: conflicts.length > 0 ? `${conflicts.length} Alert` : undefined,
      badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/40"
    },
    {
      name: "Decision Replay",
      href: "/timeline",
      icon: History,
      description: "Chronological milestone scrubber",
    },
    {
      name: "Health Scorecard",
      href: "/health",
      icon: Activity,
      description: "5-dimension explainable scorecard",
      badge: health ? `${health.overall_score}%` : "74%",
      badgeColor: health && health.overall_score >= 80 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30"
    },
    {
      name: "Evidence Copilot",
      href: "/chat",
      icon: MessageSquareQuote,
      description: "Strictly grounded citation AI",
    },
    {
      name: "Decision Passport",
      href: "/report",
      icon: FileText,
      description: "Executive audit & 1-click PDF",
    },
    {
      name: "Artifact Ingestion",
      href: "/upload",
      icon: UploadCloud,
      description: "Universal multi-format parser",
    },
  ];

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-[#0A0F1C] text-slate-100 font-sans select-none">
      
      {/* 1. Vetra Modern Left Sidebar (Desktop) */}
      <aside className="hidden lg:flex w-64 xl:w-72 h-full flex-col bg-[#0D1322] border-r border-[#1E293B]/80 flex-shrink-0 z-30">
        
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-[#1E293B]/80 flex items-center justify-between bg-[#0B101D]/70">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary-hover to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-all duration-200">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white group-hover:text-accent transition-colors">
                  ContextLock <span className="text-accent">Zero</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-primary/20 text-accent border border-primary/40">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-tight block">
                AI Decision Immune System
              </span>
            </div>
          </Link>
        </div>

        {/* Quick Search & Filter Bar */}
        <div className="px-4 pt-3 pb-1">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search decisions, DRIs, specs..."
              className="w-full bg-[#111827]/90 border border-[#1E293B] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent/60 transition-all font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Immune Architecture
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === "/workspace" && pathname === "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                  isActive
                    ? "bg-[#1A2234] text-white border border-accent/30 shadow-md shadow-accent/5 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#111827]/70"
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <div className={`p-1.5 rounded-lg transition-colors ${
                    isActive ? "bg-primary/20 text-accent" : "bg-[#111827] text-slate-400 group-hover:text-slate-200"
                  }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                  </div>
                  <div className="truncate">
                    <span className="block truncate">{item.name}</span>
                  </div>
                </div>

                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full border ${item.badgeColor || "bg-primary/20 text-accent border-primary/30"}`}>
                    {item.badge}
                  </span>
                )}

                {isActive && (
                  <span className="absolute left-0 top-2 bottom-2 w-1 bg-gradient-to-b from-primary to-accent rounded-r-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Workspace Control Footer */}
        <div className="p-3 border-t border-[#1E293B]/80 bg-[#0B101D]/70 space-y-2">
          {/* Quick 1-Click Demo & Live Action */}
          <button
            onClick={handleLoadDemo}
            disabled={loadingDemo}
            className="w-full py-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 text-white text-xs font-bold shadow-md shadow-primary/20 border border-primary/40 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            {loadingDemo ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-accent fill-accent" />
            )}
            <span>{loadingDemo ? "Analyzing..." : "1-Click Demo"}</span>
          </button>

          {/* Engine Status */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 px-1 pt-1">
            <span className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Immune: Online</span>
            </span>
            <span className="text-accent">SQLite ACID</span>
          </div>
        </div>

      </aside>

      {/* 2. Main Center Body with Top Command Header */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative min-w-0">
        
        {/* Top Command Bar */}
        <header className="h-14 border-b border-[#1E293B]/80 bg-[#0D1322]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-20 flex-shrink-0">
          
          {/* Left: Mobile Toggle & Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 rounded-lg bg-surface border border-surfaceBorder text-slate-300"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div className="flex items-center space-x-2 text-xs">
              <Link href="/" className="text-slate-400 hover:text-white flex items-center space-x-1 font-mono">
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">ContextLock</span>
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-bold text-white font-mono uppercase tracking-wider">
                {pageTitle || "Command Center"}
              </span>
            </div>
          </div>

          {/* Center: Live Health Metric Pill */}
          {health && (
            <div 
              onClick={() => setIsPassportOpen(true)}
              className="cursor-pointer hidden md:flex items-center space-x-2.5 px-3.5 py-1 rounded-full bg-[#111827] border border-[#1E293B] hover:border-accent/50 transition-all font-mono text-[11px]"
              title="Click to view full Decision Passport report"
            >
              <span className={`w-2 h-2 rounded-full ${health.overall_score >= 80 ? "bg-emerald-400" : health.overall_score >= 60 ? "bg-amber-400" : "bg-rose-500"} animate-pulse`} />
              <span className="text-slate-200 font-bold">Health: {health.overall_score}/100</span>
              <span className="text-slate-600">·</span>
              <span className="text-rose-400 font-semibold">{conflicts.length} Contradictions</span>
              <span className="text-slate-600">·</span>
              <span className="text-amber-400 font-medium">{health.unowned_decisions} DRI Gap</span>
            </div>
          )}

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Live Mode Trigger */}
            <button
              onClick={() => setIsLiveModalOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111827] hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-[#1E293B] hover:border-accent/40 transition-all"
              title="Inject real-time meeting decisions without reload"
            >
              <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span className="hidden sm:inline">Live Mode</span>
            </button>

            {/* Decision Passport Button */}
            <button
              onClick={() => setIsPassportOpen(true)}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all hover:scale-105"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Decision Passport</span>
            </button>

            {/* Refresh */}
            <button
              onClick={() => {
                loadNavData();
                if (onRefresh) onRefresh();
              }}
              className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#1E293B] transition-all"
              title="Refresh Engine"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            {/* Link to Landing Page */}
            <Link
              href="/"
              className="p-2 rounded-lg bg-[#111827] hover:bg-slate-800 text-slate-400 hover:text-white border border-[#1E293B] transition-all"
              title="Return to Product Landing Page"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
          </div>

        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-14 left-0 right-0 z-40 bg-[#0D1322] border-b border-[#1E293B] p-4 space-y-2 shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl text-xs font-medium border ${
                      isActive
                        ? "bg-[#1A2234] text-white border-accent/40 font-bold"
                        : "bg-[#111827] text-slate-300 border-[#1E293B]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-accent" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 w-full h-full overflow-hidden relative flex flex-col">
          {children}
        </main>

      </div>

      {/* Global Slide-Over Drawers */}
      <PassportDrawer
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        health={health}
        conflicts={conflicts}
      />

      <LiveModeModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        onEventInjected={() => {
          loadNavData();
          if (onRefresh) onRefresh();
        }}
      />

      <DecisionDNA
        dna={selectedDNA}
        isOpen={isDNAOpen}
        onClose={() => setIsDNAOpen(false)}
      />

    </div>
  );
};
