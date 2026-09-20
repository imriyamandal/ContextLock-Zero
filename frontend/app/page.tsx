"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Sparkles,
  Zap,
  ArrowRight,
  Network,
  Flame,
  History,
  Activity,
  MessageSquareQuote,
  FileText,
  UploadCloud,
  CheckCircle2,
  Lock,
  Layers,
  FileCode,
  Users,
  Terminal,
  ChevronRight,
  Play,
  RotateCcw,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import confetti from "canvas-confetti";

export default function LandingPage() {
  const [demoParadigm, setDemoParadigm] = useState<"jwt" | "oauth" | "firebase">("jwt");
  const [simulatedBlast, setSimulatedBlast] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.3 },
      colors: ["#7C3AED", "#22D3EE", "#10B981"]
    });
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0F1C] text-slate-100 flex flex-col font-sans selection:bg-primary selection:text-white">
      
      {/* 1. Sleek Landing Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-[#1E293B]/80 bg-[#0A0F1C]/85 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-primary-hover to-accent flex items-center justify-center shadow-lg shadow-primary/25 group-hover:scale-105 transition-all">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-tight text-white group-hover:text-accent transition-colors">
                  ContextLock <span className="text-accent">Zero</span>
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-primary/20 text-accent border border-primary/40 font-bold">
                  v2.0
                </span>
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
            <a href="#demo" className="hover:text-white transition-colors">Interactive Sandbox</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <Link href="/graph" className="hover:text-white transition-colors">Decision Graph</Link>
            <Link href="/conflicts" className="hover:text-white transition-colors">Conflict Radar</Link>
          </nav>

          {/* CTA Actions */}
          <div className="flex items-center space-x-3">
            <Link
              href="/workspace"
              className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-primary/25 border border-primary/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>Launch Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden px-4 sm:px-6 lg:px-8">
        
        {/* Ambient Glow Orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#111827]/90 border border-primary/40 text-xs font-mono text-slate-300 shadow-2xl backdrop-blur-xl">
            <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
            <span className="text-white font-semibold">AI Decision Immune System</span>
            <span className="text-slate-600">·</span>
            <span className="text-accent font-bold">100% Grounded Citations</span>
          </div>

          {/* Hero Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Git Tracks Code. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary-hover to-emerald-400">
                We Protect Project Decisions.
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Stop architectural drift before it turns into production outages. Ingest PRDs, meeting minutes, and git commits to automatically reconstruct decision topology graphs, detect 3-way contradictions, and calculate downstream blast radius.
            </p>
          </div>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/workspace"
              onClick={triggerConfetti}
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-primary-hover to-accent hover:opacity-95 text-white text-sm font-bold shadow-xl shadow-primary/30 border border-primary/50 flex items-center justify-center space-x-2.5 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 text-accent fill-accent" />
              <span>Launch Decision Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/graph"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-[#111827] hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold border border-[#1E293B] hover:border-accent/40 shadow-xl flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <Network className="w-4 h-4 text-accent" />
              <span>Explore Decision Graph</span>
            </Link>

            <Link
              href="/conflicts"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 text-sm font-semibold border border-rose-500/30 shadow-xl flex items-center justify-center space-x-2 transition-all hover:scale-105"
            >
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Conflict Radar (2 Alerts)</span>
            </Link>
          </div>

          {/* Quick Stat Highlights */}
          <div className="pt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#111827]/80 border border-[#1E293B] backdrop-blur-md space-y-1">
              <span className="text-2xl font-extrabold text-white font-mono">100%</span>
              <span className="text-xs text-slate-400 block font-mono">Grounded Citations</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#111827]/80 border border-[#1E293B] backdrop-blur-md space-y-1">
              <span className="text-2xl font-extrabold text-accent font-mono">&lt; 1 sec</span>
              <span className="text-xs text-slate-400 block font-mono">1-Click Demo Ingestion</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#111827]/80 border border-[#1E293B] backdrop-blur-md space-y-1">
              <span className="text-2xl font-extrabold text-rose-400 font-mono">3-Way</span>
              <span className="text-xs text-slate-400 block font-mono">Conflict Triangulation</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#111827]/80 border border-[#1E293B] backdrop-blur-md space-y-1">
              <span className="text-2xl font-extrabold text-emerald-400 font-mono">5-Dim</span>
              <span className="text-xs text-slate-400 block font-mono">Explainable Health Index</span>
            </div>
          </div>

        </div>

      </section>

      {/* 3. Live Interactive Sandbox Preview */}
      <section id="demo" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D1322]/80 border-y border-[#1E293B]">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center justify-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Decision Sandbox</span>
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Experience ContextLock In Action
            </h2>
            <p className="text-xs text-slate-400">
              Toggle between the conflicting architectural specifications below to observe how the AI Immune System pinpoints discrepancies and calculates downstream blast radius.
            </p>
          </div>

          {/* Interactive Simulation Dashboard Card */}
          <div className="rounded-3xl border border-[#1E293B] bg-[#111827] shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Top Toolbar Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Select Paradigm:</span>
                <div className="inline-flex rounded-xl bg-[#0B101D] p-1 border border-[#1E293B]">
                  <button
                    onClick={() => setDemoParadigm("jwt")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      demoParadigm === "jwt" ? "bg-primary text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    1. PRD Spec (JWT)
                  </button>
                  <button
                    onClick={() => setDemoParadigm("oauth")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      demoParadigm === "oauth" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    2. Meeting Sync (OAuth 2.0)
                  </button>
                  <button
                    onClick={() => setDemoParadigm("firebase")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                      demoParadigm === "firebase" ? "bg-amber-600 text-white shadow" : "text-slate-400 hover:text-white"
                    }`}
                  >
                    3. Git Commits (Firebase)
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setSimulatedBlast(!simulatedBlast)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center space-x-1.5 border transition-all ${
                    simulatedBlast 
                      ? "bg-rose-500/20 text-rose-400 border-rose-500/40" 
                      : "bg-[#0B101D] text-slate-300 border-[#1E293B] hover:border-accent/40"
                  }`}
                >
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>{simulatedBlast ? "Blast Radius: ACTIVE" : "Simulate Blast Radius"}</span>
                </button>

                <Link
                  href="/workspace"
                  className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent-hover text-slate-900 text-xs font-bold transition-all"
                >
                  Open Full Studio ➔
                </Link>
              </div>
            </div>

            {/* 3-Column Preview Display */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Col 1: Extracted Decision Profile */}
              <div className="p-5 rounded-2xl bg-[#0B101D] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-accent uppercase font-bold">Decision DNA Profile</span>
                  <span className="text-emerald-400">94% Conf</span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  {demoParadigm === "jwt" && "Stateless JWT Authentication (RSA-256)"}
                  {demoParadigm === "oauth" && "Adopt OAuth 2.0 with Auth0 Enterprise"}
                  {demoParadigm === "firebase" && "Implement Firebase Authentication SDK"}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {demoParadigm === "jwt" && "Mandated in PRD Section 2 for decentralized verification at ingress gateways and offline mobile cryptographic validation."}
                  {demoParadigm === "oauth" && "Agreed in Sept 12 Security Sync for enterprise SOC2 compliance and Okta SAML SSO federation."}
                  {demoParadigm === "firebase" && "Implemented in commit 8f3a9b1 by frontend developer for rapid prototyping velocity."}
                </p>
                <div className="pt-2 border-t border-[#1E293B] text-[11px] font-mono text-slate-400">
                  DRI: {demoParadigm === "jwt" ? "Sarah Chen (Backend)" : (demoParadigm === "oauth" ? "Mike Ross (Security)" : "Lisa Wong (Frontend)")}
                </div>
              </div>

              {/* Col 2: Conflict Radar Alert */}
              <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/40 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-rose-400 uppercase font-bold flex items-center space-x-1">
                    <AlertTriangle className="w-3.5 h-3.5 inline" />
                    <span>Contradiction Alert</span>
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[9px] font-bold">
                    CRITICAL
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">
                  3-Way Authentication Paradigm Conflict
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  PRD mandates custom JWT for offline cryptographic token validation, Meeting sync approved Auth0 OAuth 2.0, while Git commits integrated Firebase SDK.
                </p>
                <div className="p-2 rounded bg-[#0B101D] border border-rose-500/20 text-[10px] font-mono text-rose-300">
                  <b>Ingress Risk:</b> Envoy API Gateway RS256 filter will reject Firebase ID tokens.
                </div>
              </div>

              {/* Col 3: Blast Radius Simulation */}
              <div className="p-5 rounded-2xl bg-[#0B101D] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-accent uppercase font-bold">Downstream Blast Radius</span>
                  <span className="text-rose-400 font-bold">84% Risk</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-between">
                    <span className="text-white font-medium">1. Envoy API Gateway</span>
                    <span className="text-[10px] font-mono text-rose-400">RS256 Filter</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-between">
                    <span className="text-white font-medium">2. Mobile Client Login</span>
                    <span className="text-[10px] font-mono text-amber-400">Auth Header</span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111827] border border-[#1E293B] flex items-center justify-between">
                    <span className="text-white font-medium">3. Offline Verification</span>
                    <span className="text-[10px] font-mono text-rose-400">Breaks Sync</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 font-mono pt-1">
                  Modifying this decision breaks 3 downstream production services.
                </p>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 4. Key Features Bento Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
            Core Immune Capabilities
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Engineered To Defend Against Architectural Drift
          </h2>
          <p className="text-sm text-slate-400">
            Every feature is designed to bridge the gap between product specifications, team agreements, and committed code.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Bento 1: Decision Graph */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-[#1E293B] hover:border-primary/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-accent border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-all">
              <Network className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Interactive Decision Graph
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Synthesizes raw artifacts into an interactive topology network with colored typed nodes (Decisions, Meetings, Commits, DRIs, Components) and animated dependency vectors.
            </p>
            <Link href="/graph" className="text-xs font-mono text-accent hover:underline flex items-center space-x-1 pt-2">
              <span>Explore Graph Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento 2: Conflict Radar */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-[#1E293B] hover:border-rose-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center group-hover:scale-110 transition-all">
              <Flame className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Cross-Document Conflict Radar
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Continuously triangulates specifications to highlight discrepancies between PRDs, meeting minutes, and git commits before conflicts merge into master.
            </p>
            <Link href="/conflicts" className="text-xs font-mono text-rose-400 hover:underline flex items-center space-x-1 pt-2">
              <span>View Contradiction Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento 3: Decision Replay */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-[#1E293B] hover:border-accent/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-accent/20 text-accent border border-accent/30 flex items-center justify-center group-hover:scale-110 transition-all">
              <History className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Decision Replay Scrubber
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Step through project history chronologically. Identify architectural reversals and flip-flop patterns (JWT → OAuth → Firebase) with automated milestone animation.
            </p>
            <Link href="/timeline" className="text-xs font-mono text-accent hover:underline flex items-center space-x-1 pt-2">
              <span>Launch Timeline Theater</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento 4: Explainable Health */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-[#1E293B] hover:border-emerald-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-all">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Explainable Health Scorecard
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Transparent 5-dimension index measuring Stability, Conflicts, Ownership Coverage, Documentation Sync, and Dependency Risk with diagnostic "Why" rationale.
            </p>
            <Link href="/health" className="text-xs font-mono text-emerald-400 hover:underline flex items-center space-x-1 pt-2">
              <span>Inspect Health Scorecard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento 5: Grounded Copilot */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-[#1E293B] hover:border-primary/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 text-primary-300 border border-primary/30 flex items-center justify-center group-hover:scale-110 transition-all">
              <MessageSquareQuote className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Grounded Evidence Copilot
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Conversational intelligence strictly constrained: <i>"Only explain what uploaded evidence supports. Never invent reasons without verifiable source citations."</i>
            </p>
            <Link href="/chat" className="text-xs font-mono text-primary-300 hover:underline flex items-center space-x-1 pt-2">
              <span>Open Copilot Studio</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Bento 6: Decision Passport */}
          <div className="p-6 rounded-3xl bg-[#0D1322] border border-[#1E293B] hover:border-teal-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center group-hover:scale-110 transition-all">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">
              Executive Decision Passport
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Generates executive-ready architectural audit documentation with 1-click official PDF export via ReportLab for sprint gates and compliance reviews.
            </p>
            <Link href="/report" className="text-xs font-mono text-teal-400 hover:underline flex items-center space-x-1 pt-2">
              <span>View Decision Passport</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </section>

      {/* 5. Comparison Table */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#0D1322]/80 border-t border-[#1E293B]">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent">
              The Architectural Shift
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              Traditional Tracking vs. ContextLock Zero
            </h2>
          </div>

          <div className="rounded-2xl border border-[#1E293B] bg-[#111827] overflow-hidden shadow-2xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0B101D] text-slate-400 font-mono text-[11px] uppercase border-b border-[#1E293B]">
                <tr>
                  <th className="p-4">Capability</th>
                  <th className="p-4 text-slate-400">Git / Confluence / Jira</th>
                  <th className="p-4 text-accent">ContextLock Zero</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]/70">
                <tr>
                  <td className="p-4 font-bold text-white">Contradiction Detection</td>
                  <td className="p-4 text-slate-400">None (Passive text storage)</td>
                  <td className="p-4 font-bold text-emerald-400">Automated 3-Way Triangulation</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Decision Topology</td>
                  <td className="p-4 text-slate-400">Linear commit history</td>
                  <td className="p-4 font-bold text-accent">Interactive Graph with Typed Vectors</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Blast Radius Simulation</td>
                  <td className="p-4 text-slate-400">Manual guesswork in meetings</td>
                  <td className="p-4 font-bold text-rose-400">Algorithmic Downstream Impact</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Ownership DRI Enforcement</td>
                  <td className="p-4 text-slate-400">Often unassigned in docs</td>
                  <td className="p-4 font-bold text-amber-400">Automated Ownership Gap Detector</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">AI Grounding & Citations</td>
                  <td className="p-4 text-slate-400">Hallucinates without context</td>
                  <td className="p-4 font-bold text-emerald-400">100% Strict Paragraph Evidence</td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* 6. Bottom Call To Action */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-br from-[#111827] via-[#1A2234] to-[#0D1322] border border-primary/40 shadow-2xl space-y-6 relative overflow-hidden">
          
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto shadow-xl">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Ready To Lock Down Your Decisions?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
              Drop your repository or try the 1-click authentication dispute scenario in under one second.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              href="/workspace"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-primary-hover to-accent hover:opacity-95 text-white text-sm font-bold shadow-xl shadow-primary/30 flex items-center space-x-2 transition-all hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 text-accent fill-accent" />
              <span>Launch Command Center</span>
            </Link>

            <Link
              href="/upload"
              className="px-7 py-3.5 rounded-2xl bg-[#0B101D] hover:bg-slate-800 text-slate-200 hover:text-white text-sm font-semibold border border-[#1E293B] hover:border-accent/40 flex items-center space-x-2 transition-all"
            >
              <UploadCloud className="w-4 h-4 text-accent" />
              <span>Ingest Project Files</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-[#1E293B] py-8 px-4 sm:px-6 lg:px-8 text-center text-xs font-mono text-slate-400 bg-[#080C16]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-accent" />
            <span className="text-white font-bold">ContextLock Zero</span>
            <span className="text-slate-600">·</span>
            <span>AI Decision Immune System</span>
          </div>

          <div className="flex items-center space-x-4 text-slate-400">
            <Link href="/workspace" className="hover:text-white">Workspace</Link>
            <Link href="/graph" className="hover:text-white">Graph</Link>
            <Link href="/conflicts" className="hover:text-white">Conflicts</Link>
            <Link href="/timeline" className="hover:text-white">Timeline</Link>
            <Link href="/health" className="hover:text-white">Health</Link>
            <Link href="/chat" className="hover:text-white">Copilot</Link>
            <Link href="/report" className="hover:text-white">Passport</Link>
          </div>

          <div className="text-slate-400">
            MIT License · Built for Next-Gen Engineering Teams
          </div>
        </div>
      </footer>

    </div>
  );
}
