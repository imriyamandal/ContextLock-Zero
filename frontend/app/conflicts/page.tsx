"use client";

import React, { useState, useEffect } from "react";
import { VetraAppShell } from "@/components/VetraAppShell";
import { fetchConflicts, fetchGhostDecisions } from "@/lib/api";
import { Conflict } from "@/lib/types";
import {
  Flame,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  FileText,
  GitCommit,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Ghost,
  Lock,
  ArrowRight,
  ShieldAlert,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";

export default function ConflictsPage() {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [ghostDecisions, setGhostDecisions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [severityFilter, setSeverityFilter] = useState<"all" | "Critical" | "High">("all");

  const loadData = async () => {
    try {
      const [c, g] = await Promise.all([fetchConflicts(), fetchGhostDecisions()]);
      setConflicts(c);
      setGhostDecisions(g);
      if (c.length > 0) setExpandedId(c[0].id);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResolve = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResolvedIds((prev) => new Set(prev).add(id));
    confetti({
      particleCount: 85,
      spread: 70,
      origin: { y: 0.3 },
      colors: ["#10B981", "#22D3EE", "#7C3AED"]
    });
  };

  const filteredConflicts = conflicts.filter((c) => {
    if (severityFilter === "all") return true;
    return c.severity === severityFilter;
  });

  return (
    <VetraAppShell pageTitle="Conflict Radar & Triage" pageDescription="Cross-artifact architectural contradiction scanner" onRefresh={loadData}>
      <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#0A0F1C]">
        
        {/* Top Header Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400">
                Active Contradictions
              </span>
              <div className="text-2xl font-extrabold text-white font-mono">
                {conflicts.length - resolvedIds.size} <span className="text-xs text-rose-400 font-sans">Alerts</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0D1322] border border-[#1E293B] flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-accent">
                3-Way Triangulation
              </span>
              <div className="text-xs font-mono text-slate-300">
                PRD ⇄ Meeting ⇄ Git Commits
              </div>
            </div>
            <div className="p-3 rounded-xl bg-primary/20 text-accent">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
                Resolution Status
              </span>
              <div className="text-2xl font-extrabold text-white font-mono">
                {resolvedIds.size}/{conflicts.length} <span className="text-xs text-emerald-400 font-sans">Locked</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* 3-Way Evidence Comparison Matrix */}
        <div className="rounded-3xl border border-[#1E293B] bg-[#0D1322] p-6 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E293B] pb-3">
            <div>
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>Cross-Artifact Evidence Matrix (Auth Dispute)</span>
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">
                Authentication Paradigm Contradiction
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 w-fit">
              Ingress Filter Rejection Risk
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* PRD Spec */}
            <div className="p-4 rounded-xl bg-[#111827] border border-primary/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                <span className="font-bold">1. PRD.md (Spec)</span>
                <span>94% Conf</span>
              </div>
              <div className="text-xs font-bold text-white">Stateless JWT (RSA-256)</div>
              <p className="text-[11px] text-slate-300 font-mono italic">
                "All client applications MUST use Stateless JSON Web Tokens (JWT) with RSA-256 signatures for edge verification."
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-[#1E293B]">
                Owner: Sarah Chen (Backend Lead)
              </div>
            </div>

            {/* Meeting Notes */}
            <div className="p-4 rounded-xl bg-[#111827] border border-blue-500/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-blue-300">
                <span className="font-bold">2. Meeting Sync</span>
                <span>92% Conf</span>
              </div>
              <div className="text-xs font-bold text-white">OAuth 2.0 with Auth0</div>
              <p className="text-[11px] text-slate-300 font-mono italic">
                "The team agreed to pivot away from standalone JWT to centralized OAuth 2.0 with Auth0 enterprise federation."
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-[#1E293B]">
                Owner: Mike Ross (Security Architect)
              </div>
            </div>

            {/* Git Commits */}
            <div className="p-4 rounded-xl bg-[#111827] border border-amber-500/40 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-amber-300">
                <span className="font-bold">3. Git Commits</span>
                <span>89% Conf</span>
              </div>
              <div className="text-xs font-bold text-white">Firebase Auth SDK</div>
              <p className="text-[11px] text-slate-300 font-mono italic">
                "Commit 8f3a9b1: integrate Firebase Authentication SDK for rapid prototyping. Bypassed custom JWT headers."
              </p>
              <div className="text-[10px] text-slate-400 pt-1 border-t border-[#1E293B]">
                Author: Lisa Wong (Frontend Dev)
              </div>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center justify-between text-xs font-mono">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 uppercase">Severity Filter:</span>
            <button
              onClick={() => setSeverityFilter("all")}
              className={`px-3 py-1 rounded-lg ${severityFilter === "all" ? "bg-primary text-white font-bold" : "bg-[#111827] text-slate-400"}`}
            >
              All ({conflicts.length})
            </button>
            <button
              onClick={() => setSeverityFilter("Critical")}
              className={`px-3 py-1 rounded-lg ${severityFilter === "Critical" ? "bg-rose-600 text-white font-bold" : "bg-[#111827] text-slate-400"}`}
            >
              Critical
            </button>
            <button
              onClick={() => setSeverityFilter("High")}
              className={`px-3 py-1 rounded-lg ${severityFilter === "High" ? "bg-amber-600 text-white font-bold" : "bg-[#111827] text-slate-400"}`}
            >
              High
            </button>
          </div>
        </div>

        {/* Conflicts List */}
        <div className="space-y-4">
          {filteredConflicts.map((c) => {
            const isResolved = resolvedIds.has(c.id);
            const isExpanded = expandedId === c.id;

            return (
              <div
                key={c.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isResolved
                    ? "border-emerald-500/30 bg-emerald-950/10 opacity-75"
                    : "border-rose-500/40 bg-[#0D1322] shadow-2xl hover:border-rose-400"
                }`}
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : c.id)}
                  className="p-5 flex items-center justify-between cursor-pointer select-none"
                >
                  <div className="flex items-start space-x-3.5">
                    <div className={`p-2.5 rounded-xl ${isResolved ? "bg-emerald-500/20 text-emerald-400" : "bg-rose-500/20 text-rose-400"}`}>
                      {isResolved ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2.5">
                        <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                          c.severity === "Critical" ? "bg-rose-500/20 text-rose-400 border-rose-500/40" : "bg-amber-500/20 text-amber-400 border-amber-500/40"
                        }`}>
                          {isResolved ? "Resolved & Locked" : `${c.severity} Conflict`}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400">{c.source_a} vs {c.source_b}</span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-1">{c.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {!isResolved ? (
                      <button
                        onClick={(e) => handleResolve(c.id, e)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-xs font-mono font-bold transition-all"
                      >
                        Lock Resolution
                      </button>
                    ) : (
                      <span className="text-xs font-mono text-emerald-400 flex items-center space-x-1">
                        <Check className="w-4 h-4" />
                        <span>Resolved</span>
                      </span>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 pt-2 border-t border-[#1E293B] space-y-4 text-xs animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-xl bg-[#0B101D] border border-[#1E293B] space-y-1">
                      <span className="font-bold text-accent font-mono uppercase text-[10px]">Contradiction Details:</span>
                      <p className="text-slate-200 leading-relaxed font-sans">{c.description}</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-primary/10 border border-primary/30 space-y-1">
                      <span className="font-bold text-accent font-mono uppercase text-[10px] flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent" />
                        <span>Immune Recommendation:</span>
                      </span>
                      <p className="text-slate-200 leading-relaxed font-sans">{c.recommendation}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Ghost Decisions Detector */}
        {ghostDecisions.length > 0 && (
          <div className="pt-4 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase text-purple-400">
              <Ghost className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Ghost Decision Detector (Unimplemented Meeting Agreements)</span>
            </div>

            {ghostDecisions.map((g, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{g.title}</span>
                  <span className="font-mono text-[10px] text-purple-300">{g.discussed_date}</span>
                </div>
                <p className="text-slate-300 leading-relaxed font-sans">{g.explanation}</p>
                <div className="text-[10px] font-mono text-purple-300">
                  Discussed by: {g.proposed_by} · Source: {g.discussed_in}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </VetraAppShell>
  );
}
