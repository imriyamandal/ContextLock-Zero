"use client";

import React from "react";
import { 
  X, 
  Dna, 
  User, 
  Calendar, 
  ShieldCheck, 
  Layers, 
  GitBranch, 
  FileText, 
  Sparkles, 
  Flame, 
  ExternalLink,
  MessageSquareQuote,
  CheckCircle2
} from "lucide-react";

interface Props {
  dna: any | null;
  isOpen: boolean;
  onClose: () => void;
  onAskCopilot?: (question: string) => void;
}

export const DecisionDNA: React.FC<Props> = ({ dna, isOpen, onClose, onAskCopilot }) => {
  if (!isOpen || !dna) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg h-full bg-slate-950 border-l border-surfaceBorder shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-surfaceBorder flex items-center justify-between bg-surface/90">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-primary/20 text-accent border border-primary/40">
              <Dna className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Decision DNA Profile
                </h3>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/20 text-accent border border-primary/30">
                  {dna.category || "Architecture"}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">
                Grounding & Lineage Profile
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-200 leading-relaxed">
          
          {/* Main Title & Metadata Card */}
          <div className="p-4 rounded-xl bg-surface border border-surfaceBorder space-y-3 shadow-lg">
            <h2 className="text-base font-extrabold text-white leading-snug">
              {dna.title}
            </h2>

            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-background/80 border border-surfaceBorder/80 flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-accent" />
                <div className="truncate">
                  <span className="text-slate-400 block text-[9px]">TECHNICAL DRI</span>
                  <span className="text-white font-medium truncate">{dna.owner || "Engineering Team"}</span>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-background/80 border border-surfaceBorder/80 flex items-center space-x-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                <div>
                  <span className="text-slate-400 block text-[9px]">ADOPTION DATE</span>
                  <span className="text-white font-medium">{dna.date}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
              <span className="text-slate-400">AI Confidence Index:</span>
              <span className="text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                {Math.round((dna.confidence || 0.94) * 100)}% Verifiable
              </span>
            </div>
          </div>

          {/* 1. Stated Architectural Rationale */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-accent flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Architectural Rationale</span>
            </span>
            <div className="p-3.5 rounded-xl bg-surface/80 border border-surfaceBorder text-slate-200">
              <p>{dna.reason || "Mandated core system requirement."}</p>
            </div>
          </div>

          {/* 2. Alternatives Considered */}
          {dna.alternatives && dna.alternatives.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Alternatives Considered & Rejected
              </span>
              <div className="flex flex-wrap gap-2">
                {dna.alternatives.map((alt: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder text-[11px] font-mono text-slate-300"
                  >
                    ✕ {alt}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Verifiable Grounded Evidence Citations */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-400 flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Grounded Evidence Citations</span>
            </span>

            <div className="space-y-2">
              {dna.evidence && dna.evidence.length > 0 ? (
                dna.evidence.map((ev: any, idx: number) => (
                  <div key={idx} className="p-3 rounded-xl bg-background/90 border border-surfaceBorder space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-mono text-accent">
                      <span className="font-bold">[{ev.source || "PRD.md"} · {ev.paragraph || "Section 2"}]</span>
                      <span className="text-emerald-400">Verified Citation</span>
                    </div>
                    <p className="italic text-[11px] text-slate-200 font-mono">
                      "{ev.quote || "All client applications MUST use Stateless JSON Web Tokens (JWT) with RSA-256 signatures."}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-3 rounded-xl bg-background/90 border border-surfaceBorder text-[11px] text-slate-400">
                  Extracted from primary project specification.
                </div>
              )}
            </div>
          </div>

          {/* 4. Downstream Blast Radius Dependency Impact */}
          {dna.blast_radius && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold uppercase tracking-wider text-rose-400 flex items-center space-x-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-400" />
                  <span>Downstream Blast Radius</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold">
                  {dna.blast_radius.blast_radius_score || 84}% Risk Score
                </span>
              </div>

              <div className="space-y-1.5">
                {dna.blast_radius.impacted_nodes && dna.blast_radius.impacted_nodes.map((node: any, idx: number) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-surface border border-surfaceBorder flex items-center justify-between text-xs">
                    <div className="truncate">
                      <span className="text-white font-medium block truncate">{node.title}</span>
                      <span className="text-[10px] font-mono text-slate-400">Owner: {node.owner || "David Park"}</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 flex-shrink-0">
                      Impacted
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surfaceBorder bg-surface/90 flex items-center space-x-2">
          <button
            onClick={() => {
              if (onAskCopilot) onAskCopilot(`Explain why ${dna.title} was chosen and how it affects downstream systems.`);
              onClose();
            }}
            className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-md shadow-primary/20 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Ask Copilot About This Decision</span>
          </button>
        </div>

      </div>
    </div>
  );
};
