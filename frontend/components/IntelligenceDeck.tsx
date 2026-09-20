"use client";

import React, { useState, useEffect } from "react";
import { 
  Flame, 
  ShieldCheck, 
  Activity, 
  MessageSquareQuote, 
  AlertTriangle, 
  CheckCircle2, 
  UserX, 
  FileText, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Zap,
  ArrowRight,
  ShieldAlert,
  Ghost,
  Eye,
  Check
} from "lucide-react";
import { Conflict, HealthScoreBreakdown, ChatResponse } from "../lib/types";
import { sendChatMessage, fetchGhostDecisions } from "../lib/api";
import confetti from "canvas-confetti";

interface Props {
  health: HealthScoreBreakdown | null;
  conflicts: Conflict[];
  onOpenPassport: () => void;
  onSelectNodeForDNA?: (nodeId: string) => void;
}

export const IntelligenceDeck: React.FC<Props> = ({ 
  health, 
  conflicts, 
  onOpenPassport,
  onSelectNodeForDNA
}) => {
  const [activeTab, setActiveTab] = useState<"conflicts" | "health" | "chat">("conflicts");
  const [reviewedConflictIds, setReviewedConflictIds] = useState<Set<string>>(new Set());
  const [expandedConflictId, setExpandedConflictId] = useState<string | null>(conflicts[0]?.id || null);
  const [ghostDecisions, setGhostDecisions] = useState<any[]>([]);

  useEffect(() => {
    fetchGhostDecisions().then(setGhostDecisions);
  }, []);

  // Chat State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string; evidence?: ChatResponse }>>([
    {
      sender: "bot",
      text: "I am your AI Decision Copilot. Ask anything about your project's decisions, contradictions, or architecture history. Every response is strictly grounded in verifiable source paragraphs.",
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const quickPrompts = [
    "Why did we switch authentication?",
    "What caused the 3-way dispute?",
    "Who owns the notification architecture?",
    "What database was selected and why?"
  ];

  const handleMarkReviewed = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReviewedConflictIds((prev) => new Set(prev).add(id));
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.4 },
      colors: ["#10B981", "#22D3EE", "#7C3AED"]
    });
  };

  const handleSendChat = async (msgText?: string) => {
    const textToSend = msgText || chatInput;
    if (!textToSend.trim() || chatLoading) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: textToSend }]);
    setChatInput("");
    setChatLoading(true);

    try {
      const res = await sendChatMessage(textToSend);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.answer,
          evidence: res
        }
      ]);
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "An error occurred querying the evidence engine."
        }
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  const activeConflicts = conflicts.filter(c => !reviewedConflictIds.has(c.id));
  const currentScore = health?.overall_score || 74;

  return (
    <aside className="w-full lg:w-[380px] xl:w-[410px] h-full flex flex-col bg-surface/95 border-l border-surfaceBorder overflow-hidden flex-shrink-0 select-none">
      
      {/* Copilot Header Tabs */}
      <div className="h-12 border-b border-surfaceBorder px-3 flex items-center justify-between bg-background/50">
        <div className="grid grid-cols-3 gap-1 w-full font-mono text-xs">
          
          {/* Tab 1: Conflicts */}
          <button
            onClick={() => setActiveTab("conflicts")}
            className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all ${
              activeTab === "conflicts"
                ? "bg-surface border border-rose-500/40 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface/50"
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${activeTab === "conflicts" ? "text-rose-400" : "text-slate-400"}`} />
            <span>Contradictions</span>
            {activeConflicts.length > 0 && (
              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/40">
                {activeConflicts.length}
              </span>
            )}
          </button>

          {/* Tab 2: Health */}
          <button
            onClick={() => setActiveTab("health")}
            className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all ${
              activeTab === "health"
                ? "bg-surface border border-accent/40 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface/50"
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${activeTab === "health" ? "text-accent" : "text-slate-400"}`} />
            <span>Health & DRIs</span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/20 text-accent font-bold">
              {currentScore}%
            </span>
          </button>

          {/* Tab 3: Chat */}
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center justify-center space-x-1.5 py-1.5 px-2 rounded-lg font-semibold transition-all ${
              activeTab === "chat"
                ? "bg-surface border border-primary/40 text-white shadow"
                : "text-slate-400 hover:text-slate-200 hover:bg-surface/50"
            }`}
          >
            <Bot className={`w-3.5 h-3.5 ${activeTab === "chat" ? "text-primary-300" : "text-slate-400"}`} />
            <span>Copilot</span>
          </button>

        </div>
      </div>

      {/* Main Copilot Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {/* TAB 1: CONFLICT RADAR */}
        {activeTab === "conflicts" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                <span>Active Contradictions</span>
              </span>
              <span className="text-[10px] font-mono text-rose-400">
                {activeConflicts.length} Require Review
              </span>
            </div>

            {conflicts.length === 0 ? (
              <div className="p-6 rounded-2xl bg-surface/50 border border-surfaceBorder text-center space-y-2">
                <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">No Contradictions Detected</h4>
                <p className="text-xs text-slate-400">
                  Project specifications and git commits are aligned.
                </p>
              </div>
            ) : (
              conflicts.map((c) => {
                const isReviewed = reviewedConflictIds.has(c.id);
                const isExpanded = expandedConflictId === c.id;

                return (
                  <div
                    key={c.id}
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isReviewed
                        ? "border-emerald-500/30 bg-emerald-950/10 opacity-75"
                        : "border-rose-500/40 bg-surface/90 hover:border-rose-400 shadow-xl"
                    }`}
                  >
                    <div
                      onClick={() => setExpandedConflictId(isExpanded ? null : c.id)}
                      className="p-3.5 cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white leading-snug">
                          {c.title}
                        </span>
                        <span className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                          c.severity === "Critical" 
                            ? "bg-rose-500/20 text-rose-400 border-rose-500/40 font-bold" 
                            : "bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold"
                        }`}>
                          {c.severity}
                        </span>
                      </div>

                      {/* Evidence Comparison Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] text-slate-300">
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-accent border border-primary/30">
                          {c.source_a}
                        </span>
                        <span className="text-slate-500">vs</span>
                        <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {c.source_b}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-sans">
                        {c.description}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-surfaceBorder/60">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          Confidence: 94%
                        </span>

                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedConflictId(isExpanded ? null : c.id);
                            }}
                            className="px-2 py-1 rounded bg-surface hover:bg-slate-800 text-slate-300 border border-surfaceBorder text-[10px] font-mono transition-all"
                          >
                            Compare Evidence
                          </button>

                          {!isReviewed ? (
                            <button
                              onClick={(e) => handleMarkReviewed(c.id, e)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] font-mono font-bold transition-all"
                              title="Acknowledge & mark reviewed"
                            >
                              Mark Reviewed
                            </button>
                          ) : (
                            <span className="text-[10px] font-mono text-emerald-400 flex items-center space-x-1">
                              <Check className="w-3.5 h-3.5 inline" />
                              <span>Reviewed</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-3 bg-background/80 border-t border-surfaceBorder/80 space-y-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-surface border border-surfaceBorder font-mono text-[10px] space-y-1">
                          <div className="text-accent font-bold">Review Recommendation:</div>
                          <div className="text-slate-200">{c.recommendation}</div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {/* Ghost Decisions Detector Card (Change 4) */}
            {ghostDecisions.length > 0 && (
              <div className="pt-2">
                <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 mb-2">
                  <span className="flex items-center space-x-1.5">
                    <Ghost className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                    <span>Ghost Decisions ({ghostDecisions.length})</span>
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    Unimplemented Spec
                  </span>
                </div>

                {ghostDecisions.map((g, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{g.title}</span>
                      <span className="font-mono text-[9px] text-purple-300">{g.discussed_date}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {g.explanation}
                    </p>
                    <div className="text-[10px] font-mono text-purple-300 pt-1">
                      Discussed by: {g.proposed_by} · Status: Missing in Git
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: HEALTH SCORECARD & DRIs */}
        {activeTab === "health" && health && (
          <div className="space-y-4">
            {/* Radial Health Gauge Card */}
            <div className="p-4 rounded-xl bg-surface border border-surfaceBorder flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase font-bold text-accent">
                  Decision Health Index
                </span>
                <h3 className="text-lg font-extrabold text-white">
                  {health.overall_score}/100
                </h3>
                <p className="text-[11px] text-slate-400">
                  {health.total_decisions} verified decisions indexed.
                </p>
              </div>

              <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke="#1E293B"
                    strokeWidth="6"
                    fill="transparent"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="30"
                    stroke={health.overall_score >= 80 ? "#10B981" : health.overall_score >= 60 ? "#F59E0B" : "#EF4444"}
                    strokeWidth="6"
                    strokeDasharray={2 * Math.PI * 30}
                    strokeDashoffset={2 * Math.PI * 30 - (health.overall_score / 100) * (2 * Math.PI * 30)}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-700 ease-out"
                  />
                </svg>
                <span className="absolute font-mono text-sm font-extrabold text-white">
                  {health.overall_score}%
                </span>
              </div>
            </div>

            {/* 5 Dimensions with "Why" */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                Explainable Scorecard Dimensions
              </span>

              {[
                { name: "Decision Stability", score: health.stability, why: health.stability_why, color: "bg-amber-400" },
                { name: "Conflict Level", score: health.conflict_level, why: health.conflict_why, color: "bg-rose-400" },
                { name: "Ownership Coverage", score: health.ownership, why: health.ownership_why, color: "bg-teal-400" },
                { name: "Documentation Sync", score: health.documentation_sync, why: health.documentation_why, color: "bg-cyan-400" },
                { name: "Dependency Risk", score: health.dependency_risk, why: health.dependency_why, color: "bg-indigo-400" },
              ].map((dim, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-surface border border-surfaceBorder space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-slate-200">{dim.name}</span>
                    <span className="font-mono text-slate-300 font-bold">{dim.score}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className={`h-full ${dim.color}`} style={{ width: `${dim.score}%` }} />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-snug">
                    {dim.why}
                  </p>
                </div>
              ))}
            </div>

            {/* Ownership Gap Detector */}
            {health.unowned_decisions > 0 && (
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-1 text-xs">
                <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                  <UserX className="w-4 h-4" />
                  <span>Ownership Gap: Notification Subsystem</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  architecture_doc.md Section 5 lacks an assigned Technical DRI owner.
                </p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GROUNDED EVIDENCE CHAT */}
        {activeTab === "chat" && (
          <div className="flex flex-col h-[510px]">
            {/* Quick Prompts */}
            <div className="flex flex-wrap gap-1.5 pb-2.5">
              {quickPrompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendChat(p)}
                  className="px-2 py-1 rounded bg-surface hover:bg-slate-800 border border-surfaceBorder hover:border-accent/40 text-[10px] font-mono text-slate-300 transition-all text-left"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {chatMessages.map((m, idx) => (
                <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`p-3 rounded-xl text-xs max-w-[95%] leading-relaxed ${
                    m.sender === "user"
                      ? "bg-primary text-white font-medium"
                      : "bg-surface border border-surfaceBorder text-slate-200"
                  }`}>
                    <p>{m.text}</p>

                    {/* Citations Card */}
                    {m.evidence && (
                      <div className="mt-2 pt-2 border-t border-surfaceBorder/80 space-y-1.5 font-mono text-[10px]">
                        <div className="flex items-center justify-between text-accent font-bold">
                          <span>[{m.evidence.supporting_file} · {m.evidence.supporting_paragraph}]</span>
                          <span className="text-emerald-400">{Math.round(m.evidence.confidence * 100)}% Conf</span>
                        </div>
                        {m.evidence.citations && m.evidence.citations.map((cite, cIdx) => (
                          <div key={cIdx} className="p-2 rounded bg-background/90 text-slate-300 italic">
                            "{cite.quote}"
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex items-center space-x-2 text-xs font-mono text-accent animate-pulse p-2">
                  <Bot className="w-4 h-4" />
                  <span>Grounding response in evidence quotes...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-2.5 border-t border-surfaceBorder flex items-center space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
                placeholder="Ask decision copilot..."
                className="flex-1 bg-surface border border-surfaceBorder rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent"
              />
              <button
                onClick={() => handleSendChat()}
                disabled={chatLoading || !chatInput.trim()}
                className="p-2 rounded-lg bg-primary hover:bg-primary-hover text-white transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Footer Passport Action */}
      <div className="p-3 border-t border-surfaceBorder bg-background/50">
        <button
          onClick={onOpenPassport}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center justify-center space-x-1.5 transition-all hover:scale-[1.01]"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Decision Passport PDF</span>
        </button>
      </div>

    </aside>
  );
};
