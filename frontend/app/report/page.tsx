"use client";

import React, { useState, useEffect } from "react";
import { VetraAppShell } from "@/components/VetraAppShell";
import { fetchHealth, fetchConflicts, getReportDownloadUrl } from "@/lib/api";
import { HealthScoreBreakdown, Conflict } from "@/lib/types";
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Calendar,
  Lock
} from "lucide-react";

export default function ReportPage() {
  const [health, setHealth] = useState<HealthScoreBreakdown | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [h, c] = await Promise.all([fetchHealth(), fetchConflicts()]);
      setHealth(h);
      setConflicts(c);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDownloadPdf = () => {
    window.open(getReportDownloadUrl(), "_blank");
  };

  return (
    <VetraAppShell pageTitle="Decision Passport & Audit" pageDescription="Executive-ready architectural audit documentation & PDF generator" onRefresh={loadData}>
      <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#0A0F1C] max-w-5xl mx-auto">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Decision Passport: Executive Audit Report
              </h1>
              <span className="text-xs font-mono text-slate-400">
                CLZ-2026-0915 · 100% Grounding Verification
              </span>
            </div>
          </div>

          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Export Official PDF Report</span>
          </button>
        </div>

        {/* Report Document Sheet */}
        {health && (
          <div className="rounded-3xl border border-[#1E293B] bg-[#0D1322] p-6 sm:p-10 shadow-2xl space-y-8 text-xs text-slate-200">
            
            {/* Document Header Banner */}
            <div className="rounded-2xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 p-6 border border-teal-500/30 text-white shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                    STRATEGIC INITIATIVE REVIEW
                  </span>
                  <h2 className="text-xl font-extrabold mt-0.5">
                    Project Pulse: Authentication Architecture Audit
                  </h2>
                </div>
                <div className="text-right font-mono text-xs">
                  <div>Health: <span className="text-teal-300 font-bold text-base">{health.overall_score}/100</span></div>
                  <div>Status: <span className="text-emerald-400 font-bold">IMMUNE AUDITED</span></div>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                ContextLock Zero continuously evaluated project artifacts (PRDs, meeting transcripts, architecture specs, and git commits). Indexed <b>{health.total_decisions} decisions</b>, flagged <b>{conflicts.length} critical contradictions</b>, and identified <b>{health.unowned_decisions} unowned DRI gap</b>.
              </p>
            </div>

            {/* 1. Health Scorecard Table */}
            <div className="space-y-3">
              <h3 className="font-mono uppercase font-bold text-teal-400 text-xs border-b border-[#1E293B] pb-1.5 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>1. Decision Health Scorecard & Explainability</span>
              </h3>
              <div className="rounded-xl border border-[#1E293B] overflow-hidden bg-[#111827]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0B101D] text-slate-400 font-mono text-[10px] uppercase border-b border-[#1E293B]">
                    <tr>
                      <th className="p-3">Dimension</th>
                      <th className="p-3">Score</th>
                      <th className="p-3">Explainability ("The Why")</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E293B]">
                    <tr>
                      <td className="p-3 font-bold text-white">Stability</td>
                      <td className="p-3 font-mono text-amber-400 font-bold">{health.stability}%</td>
                      <td className="p-3 text-slate-300">{health.stability_why}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Conflict Level</td>
                      <td className="p-3 font-mono text-rose-400 font-bold">{health.conflict_level}%</td>
                      <td className="p-3 text-slate-300">{health.conflict_why}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Ownership Coverage</td>
                      <td className="p-3 font-mono text-teal-400 font-bold">{health.ownership}%</td>
                      <td className="p-3 text-slate-300">{health.ownership_why}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Documentation Sync</td>
                      <td className="p-3 font-mono text-cyan-400 font-bold">{health.documentation_sync}%</td>
                      <td className="p-3 text-slate-300">{health.documentation_why}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-white">Dependency Risk</td>
                      <td className="p-3 font-mono text-indigo-400 font-bold">{health.dependency_risk}%</td>
                      <td className="p-3 text-slate-300">{health.dependency_why}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. Critical Contradictions Radar */}
            <div className="space-y-3">
              <h3 className="font-mono uppercase font-bold text-rose-400 text-xs border-b border-[#1E293B] pb-1.5 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>2. Critical Contradictions Ledger ({conflicts.length})</span>
              </h3>
              <div className="space-y-3">
                {conflicts.map((c) => (
                  <div key={c.id} className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">{c.title}</span>
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 leading-relaxed font-sans">{c.description}</p>
                    <div className="p-2.5 rounded-xl bg-[#0B101D] text-xs font-mono text-teal-300 border border-[#1E293B]">
                      <b>Recommendation:</b> {c.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Open Action Items */}
            <div className="space-y-2 pt-2 border-t border-[#1E293B]">
              <span className="font-mono uppercase font-bold text-slate-400 text-xs">
                3. Open Action Items & Sprint Readiness
              </span>
              <ul className="list-disc pl-5 space-y-1 text-slate-300 leading-relaxed font-sans">
                <li>Convene an urgent architecture lock session to standardize on Stateless JWT vs OAuth 2.0.</li>
                <li>Assign Technical DRI to the Multi-Channel Pub/Sub Notification subsystem in architecture_doc.md.</li>
                <li>Re-run ContextLock CI/CD gate prior to release branch merge.</li>
              </ul>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-[#1E293B] flex justify-end">
              <button
                onClick={handleDownloadPdf}
                className="flex items-center space-x-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Download Executive Decision Passport PDF</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </VetraAppShell>
  );
}
