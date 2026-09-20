"use client";

import React, { useState } from "react";
import { VetraAppShell } from "@/components/VetraAppShell";
import { sendChatMessage } from "@/lib/api";
import { ChatResponse } from "@/lib/types";
import {
  MessageSquareQuote,
  Send,
  Bot,
  User,
  Sparkles,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  HelpCircle
} from "lucide-react";

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "bot"; text: string; evidence?: ChatResponse }>>([
    {
      sender: "bot",
      text: "I am your AI Decision Copilot. Ask any question about your project's architectural decisions, contradictions, or history. Every single answer is strictly grounded in verifiable source paragraphs from your uploaded documents.",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    "Why did we switch authentication?",
    "What caused the 3-way authentication dispute?",
    "Who owns the notification architecture?",
    "What database was selected and why?",
    "What systems are impacted by reverting to JWT?"
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setMessages((prev) => [...prev, { sender: "user", text: query }]);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(query);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: res.answer,
          evidence: res
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "An error occurred querying the evidence engine."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VetraAppShell pageTitle="Evidence AI Copilot" pageDescription="Strictly grounded conversational reasoning engine with verifiable citations">
      <div className="flex-1 w-full h-full flex flex-col p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto overflow-hidden bg-[#0A0F1C]">
        
        {/* Preset Prompt Suggestion Pills */}
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#1E293B] flex-shrink-0">
          <span className="text-[11px] font-mono text-slate-400 mr-1 flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            <span>Try Prompt:</span>
          </span>
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="px-3 py-1.5 rounded-xl bg-[#0D1322] hover:bg-[#111827] border border-[#1E293B] hover:border-accent/40 text-xs font-mono text-slate-300 transition-all text-left"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto py-6 space-y-5 pr-2">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}>
              <div className={`p-4 rounded-2xl text-xs sm:text-sm max-w-[90%] sm:max-w-[80%] leading-relaxed ${
                m.sender === "user"
                  ? "bg-primary text-white font-medium shadow-lg shadow-primary/20"
                  : "bg-[#0D1322] border border-[#1E293B] text-slate-200 shadow-xl"
              }`}>
                <div className="flex items-center space-x-2 mb-1.5 text-[10px] font-mono">
                  {m.sender === "user" ? (
                    <span className="text-primary-200">You</span>
                  ) : (
                    <span className="text-accent flex items-center space-x-1 font-bold">
                      <Bot className="w-3.5 h-3.5 inline" />
                      <span>AI Decision Copilot</span>
                    </span>
                  )}
                </div>

                <p className="font-sans">{m.text}</p>

                {/* Evidence Citations Box */}
                {m.evidence && (
                  <div className="mt-3 pt-3 border-t border-[#1E293B] space-y-2 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-accent font-bold">
                      <span className="flex items-center space-x-1">
                        <FileText className="w-3.5 h-3.5" />
                        <span>[{m.evidence.supporting_file} · {m.evidence.supporting_paragraph}]</span>
                      </span>
                      <span className="text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30">
                        {Math.round(m.evidence.confidence * 100)}% Verifiable
                      </span>
                    </div>

                    {m.evidence.citations && m.evidence.citations.map((cite, cIdx) => (
                      <div key={cIdx} className="p-3 rounded-xl bg-[#0B101D] text-slate-300 border border-[#1E293B] italic">
                        "{cite.quote}"
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center space-x-2 text-xs font-mono text-accent animate-pulse p-3 rounded-xl bg-[#0D1322] border border-[#1E293B] w-fit">
              <Bot className="w-4 h-4" />
              <span>Grounding answer in uploaded document citations...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="pt-3 border-t border-[#1E293B] flex-shrink-0">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything about decisions, contradictions, or architecture history..."
              className="flex-1 bg-[#0D1322] border border-[#1E293B] rounded-xl px-4 py-3 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent shadow-xl font-sans"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold text-xs flex items-center space-x-2 transition-all disabled:opacity-50 shadow-lg shadow-primary/25"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </VetraAppShell>
  );
}
