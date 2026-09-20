"use client";

import React from "react";
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Sparkles,
  ExternalLink
} from "lucide-react";
import { HealthScoreBreakdown, Conflict } from "../lib/types";
import { getReportDownloadUrl } from "../lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  health: HealthScoreBreakdown | null;
  conflicts: Conflict[];
}

export const PassportDrawer: React.FC<Props> = ({ isOpen, onClose, health, conflicts }) => {
  if (!isOpen || !health) return null;

  const handleDownloadPdf = () => {
    window.open(getReportDownloadUrl(), "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl h-full bg-slate-950 border-l border-surfaceBorder shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-surfaceBorder flex items-center justify-between bg-surface/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm font-bold text-white tracking-tight">
                  Decision Passport: Executive Audit Report
                </h2>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Page 11 Spec
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                CLZ-2026-0915 · Grounding Verified
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleDownloadPdf}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-xs leading-relaxed">
          
          {/* Executive Header Banner */}
          <div className="rounded-xl bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 p-5 border border-teal-500/30 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-teal-400 font-bold">
                  PROJECT REPORT · FY 2026
                </span>
                <h3 className="text-lg font-extrabold mt-0.5">
                  Strategic Initiative Review: Project Pulse
                </h3>
              </div>
              <div className="text-right font-mono text-[10px] text-slate-300">
                <div>Health: <span className="text-teal-300 font-bold text-sm">{health.overall_score}/100</span></div>
                <div>Status: <span className="text-emerald-400 font-bold">AUDITED</span></div>
              </div>
            </div>
            <p className="text-[11px] text-slate-300">
              Evaluated <b>{health.total_decisions} architectural decisions</b> across PRDs, meeting minutes, and git commits. Identified <b>{conflicts.length} critical contradictions</b> and <b>{health.unowned_decisions} ownership gap</b>.
            </p>
          </div>

          {/* 1. Health Breakdown Scorecard */}
          <div className="space-y-2.5">
            <h4 className="font-mono uppercase font-bold text-teal-400 text-[11px] border-b border-surfaceBorder pb-1">
              Decision Health Scorecard & Explainability (The "Why")
            </h4>
            <div className="rounded-xl border border-surfaceBorder overflow-hidden bg-surface/60">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-surface text-slate-400 font-mono text-[10px] uppercase border-b border-surfaceBorder">
                  <tr>
                    <th className="p-2.5">Dimension</th>
                    <th className="p-2.5">Score</th>
                    <th className="p-2.5">Explanation (The "Why")</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surfaceBorder/60">
                  <tr>
                    <td className="p-2.5 font-bold text-white">Stability</td>
                    <td className="p-2.5 font-mono text-amber-400 font-bold">{health.stability}%</td>
                    <td className="p-2.5 text-slate-300">{health.stability_why}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Conflict Level</td>
                    <td className="p-2.5 font-mono text-rose-400 font-bold">{health.conflict_level}%</td>
                    <td className="p-2.5 text-slate-300">{health.conflict_why}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Ownership</td>
                    <td className="p-2.5 font-mono text-teal-400 font-bold">{health.ownership}%</td>
                    <td className="p-2.5 text-slate-300">{health.ownership_why}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Doc Sync</td>
                    <td className="p-2.5 font-mono text-slate-300 font-bold">{health.documentation_sync}%</td>
                    <td className="p-2.5 text-slate-300">{health.documentation_why}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold text-white">Dependency Risk</td>
                    <td className="p-2.5 font-mono text-slate-300 font-bold">{health.dependency_risk}%</td>
                    <td className="p-2.5 text-slate-300">{health.dependency_why}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. Contradiction Ledger */}
          <div className="space-y-2.5">
            <h4 className="font-mono uppercase font-bold text-rose-400 text-[11px] border-b border-surfaceBorder pb-1">
              Active Contradictions Matrix ({conflicts.length})
            </h4>
            <div className="space-y-2">
              {conflicts.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{c.title}</span>
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40">
                      {c.severity}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{c.description}</p>
                  <div className="p-2 rounded bg-background/80 text-[10px] font-mono text-teal-300 border border-surfaceBorder">
                    <b>Recommendation:</b> {c.recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Open Action Items & Roadmap */}
          <div className="space-y-2 pt-2 border-t border-surfaceBorder text-[11px]">
            <span className="font-mono uppercase font-bold text-slate-400">Open Action Items:</span>
            <ul className="list-disc pl-4 space-y-1 text-slate-300">
              <li>Convene architecture lock sync between Sarah Chen (Backend) and Mike Ross (Security).</li>
              <li>Assign DRI Lead to the Notification Subsystem in architecture_doc.md.</li>
              <li>Future scope integrations: Slack, Jira, GitHub Webhooks, Notion.</li>
            </ul>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-surfaceBorder bg-surface/90 flex items-center justify-between">
          <span className="text-[10px] font-mono text-slate-400">
            Powered by ContextLock Zero AI Decision Immune System
          </span>
          <button
            onClick={handleDownloadPdf}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Official PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
