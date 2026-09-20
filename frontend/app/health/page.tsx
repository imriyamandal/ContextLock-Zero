"use client";

import React, { useState, useEffect } from "react";
import { VetraAppShell } from "@/components/VetraAppShell";
import { fetchHealth } from "@/lib/api";
import { HealthScoreBreakdown } from "@/lib/types";
import {
  Activity,
  ShieldCheck,
  UserX,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Layers,
  FileText,
  User
} from "lucide-react";

export default function HealthScorecardPage() {
  const [health, setHealth] = useState<HealthScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const data = await fetchHealth();
      setHealth(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overallScore = health?.overall_score || 74;

  return (
    <VetraAppShell pageTitle="Decision Health Scorecard" pageDescription="5-dimension explainable architectural health index" onRefresh={loadData}>
      <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#0A0F1C]">
        
        {/* Hero Gauge & Overview Card */}
        {health && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0D1322] border border-[#1E293B] shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-accent flex items-center justify-center md:justify-start space-x-1.5">
                <Activity className="w-4 h-4 text-accent" />
                <span>Executive Decision Health Index</span>
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {overallScore}/100 Decision Health
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Evaluated <b>{health.total_decisions} active architectural decisions</b>. Identified <b>{health.total_conflicts} contradictions</b> and <b>{health.unowned_decisions} unowned DRI gap</b> before sprint release.
              </p>
            </div>

            {/* Radial SVG Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke="#1E293B"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="56"
                  stroke={overallScore >= 80 ? "#10B981" : overallScore >= 60 ? "#F59E0B" : "#EF4444"}
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 - (overallScore / 100) * (2 * Math.PI * 56)}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-mono text-2xl font-extrabold text-white block">
                  {overallScore}%
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {overallScore >= 80 ? "Healthy" : overallScore >= 60 ? "At Risk" : "Critical"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 5 Explainable Dimension Breakdown */}
        {health && (
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
              Explainable Dimension Diagnostic ("The Why")
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Dim 1: Stability */}
              <div className="p-5 rounded-2xl bg-[#0D1322] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">1. Decision Stability</span>
                  <span className="font-mono text-amber-400 font-bold">{health.stability}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-400" style={{ width: `${health.stability}%` }} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <b>Diagnostic:</b> {health.stability_why}
                </p>
              </div>

              {/* Dim 2: Conflict Level */}
              <div className="p-5 rounded-2xl bg-[#0D1322] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">2. Conflict Level</span>
                  <span className="font-mono text-rose-400 font-bold">{health.conflict_level}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-rose-400" style={{ width: `${health.conflict_level}%` }} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <b>Diagnostic:</b> {health.conflict_why}
                </p>
              </div>

              {/* Dim 3: Ownership Coverage */}
              <div className="p-5 rounded-2xl bg-[#0D1322] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">3. Ownership & DRI Coverage</span>
                  <span className="font-mono text-teal-400 font-bold">{health.ownership}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-teal-400" style={{ width: `${health.ownership}%` }} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <b>Diagnostic:</b> {health.ownership_why}
                </p>
              </div>

              {/* Dim 4: Documentation Sync */}
              <div className="p-5 rounded-2xl bg-[#0D1322] border border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">4. Documentation Sync</span>
                  <span className="font-mono text-cyan-400 font-bold">{health.documentation_sync}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-400" style={{ width: `${health.documentation_sync}%` }} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <b>Diagnostic:</b> {health.documentation_why}
                </p>
              </div>

              {/* Dim 5: Dependency Risk */}
              <div className="p-5 rounded-2xl bg-[#0D1322] border border-[#1E293B] space-y-3 md:col-span-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-white">5. Downstream Dependency Blast Risk</span>
                  <span className="font-mono text-indigo-400 font-bold">{health.dependency_risk}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-indigo-400" style={{ width: `${health.dependency_risk}%` }} />
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  <b>Diagnostic:</b> {health.dependency_why}
                </p>
              </div>

            </div>
          </div>
        )}

        {/* Ownership Gap Detector Card */}
        {health && health.unowned_decisions > 0 && (
          <div className="p-5 rounded-2xl bg-amber-950/20 border border-amber-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase flex items-center space-x-1.5">
                <UserX className="w-4 h-4" />
                <span>Ownership Gap Alert: Unassigned Subsystem</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
                HIGH RISK
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">
              Multi-Channel Pub/Sub Notification Architecture
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              architecture_doc.md Section 5 introduces a multi-channel Pub/Sub alert pipeline but lacks an assigned Technical DRI or engineering owner.
            </p>
            <div className="text-[11px] font-mono text-amber-300 pt-1">
              Required Action: Assign an engineering lead before deployment sprint kickoff.
            </div>
          </div>
        )}

      </div>
    </VetraAppShell>
  );
}
