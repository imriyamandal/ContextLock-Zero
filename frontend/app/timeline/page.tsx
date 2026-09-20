"use client";

import React, { useState, useEffect } from "react";
import { VetraAppShell } from "@/components/VetraAppShell";
import { fetchTimeline } from "@/lib/api";
import { ReplayMilestone } from "@/lib/types";
import {
  History,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Calendar,
  User,
  ShieldAlert,
  ArrowRight,
  Flame,
  CheckCircle2,
  TrendingDown
} from "lucide-react";

export default function TimelinePage() {
  const [timelineData, setTimelineData] = useState<{ stability: any; replay_milestones: ReplayMilestone[]; total_events: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const data = await fetchTimeline();
      setTimelineData(data);
      if (data.replay_milestones && data.replay_milestones.length > 0) {
        setCurrentStep(data.replay_milestones.length);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auto-play interval
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && timelineData?.replay_milestones?.length) {
      interval = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= timelineData.replay_milestones.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timelineData]);

  const milestones = timelineData?.replay_milestones || [];
  const stability = timelineData?.stability;
  const activeMilestone = milestones.find((m) => m.step === currentStep) || milestones[currentStep - 1];

  return (
    <VetraAppShell pageTitle="Decision Replay & Timeline" pageDescription="Chronological milestone scrubber and technology flip-flop analyzer" onRefresh={loadData}>
      <div className="flex-1 w-full h-full overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 bg-[#0A0F1C]">
        
        {/* Top Stability Score Card */}
        {stability && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-[#0D1322] border border-[#1E293B] space-y-1">
              <span className="text-[10px] font-mono uppercase font-bold text-accent">
                Stability Churn Score
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-amber-400 font-mono">
                  {stability.stability_score}%
                </span>
                <span className="text-xs text-amber-400/80 font-mono">High Instability</span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Detected 3 rapid paradigm switches across 4 days.
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-amber-950/20 border border-amber-500/30 md:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-amber-300">
                <span className="font-bold flex items-center space-x-1.5">
                  <TrendingDown className="w-4 h-4" />
                  <span>Paradigm Flip-Flop Sequence Detected</span>
                </span>
                <span>Category: Authentication</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold pt-1">
                <span className="px-3 py-1 rounded-xl bg-primary/20 text-accent border border-primary/30">1. JWT</span>
                <span className="text-slate-500">➔</span>
                <span className="px-3 py-1 rounded-xl bg-blue-500/20 text-blue-300 border border-blue-500/30">2. OAuth 2.0</span>
                <span className="text-slate-500">➔</span>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">3. Firebase</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Frequent paradigm switching threatens mobile offline capabilities and gateway ingress filters.
              </p>
            </div>
          </div>
        )}

        {/* Decision Replay Theater Scrubber */}
        <div className="rounded-3xl border border-[#1E293B] bg-[#0D1322] p-6 shadow-2xl space-y-6">
          
          {/* Scrubber Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-primary/20 text-accent border border-primary/30">
                <History className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Decision Replay Scrubber
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Step {currentStep} of {milestones.length || 5} Historical Milestones
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-bold font-mono shadow-md shadow-primary/20 transition-all hover:scale-105"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlaying ? "Pause Replay" : "Play History"}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStep(1);
                }}
                className="p-2 rounded-xl bg-[#111827] hover:bg-slate-800 text-slate-300 border border-[#1E293B]"
                title="Reset to Step 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Range Slider */}
          <div className="space-y-2">
            <input
              type="range"
              min={1}
              max={milestones.length || 5}
              value={currentStep}
              onChange={(e) => {
                setIsPlaying(false);
                setCurrentStep(parseInt(e.target.value));
              }}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              {milestones.map((m) => (
                <span
                  key={m.step}
                  onClick={() => setCurrentStep(m.step)}
                  className={`cursor-pointer transition-colors ${currentStep === m.step ? "text-accent font-bold" : "hover:text-slate-300"}`}
                >
                  Step {m.step} ({m.date})
                </span>
              ))}
            </div>
          </div>

          {/* Active Highlighted Milestone Box */}
          {activeMilestone && (
            <div className="p-5 rounded-2xl bg-[#111827] border border-accent/40 shadow-xl space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-accent border border-primary/30 font-bold">
                  Milestone #{activeMilestone.step} · {activeMilestone.category}
                </span>
                <span className="text-slate-400 font-bold flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 inline" />
                  <span>{activeMilestone.date}</span>
                </span>
              </div>

              <h2 className="text-lg font-extrabold text-white">
                {activeMilestone.event_title}
              </h2>

              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                <b>Rationale:</b> {activeMilestone.rationale}
              </p>

              {activeMilestone.quote && (
                <div className="p-3 rounded-xl bg-[#0B101D] border border-[#1E293B] font-mono text-xs text-slate-300 italic">
                  "{activeMilestone.quote}"
                </div>
              )}

              <div className="pt-2 border-t border-[#1E293B] text-xs font-mono text-slate-400 flex items-center space-x-2">
                <User className="w-3.5 h-3.5 text-accent" />
                <span>Owner: {activeMilestone.owner}</span>
              </div>
            </div>
          )}

        </div>

        {/* Milestone Chronology Cards List */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Complete Milestone Ledger ({milestones.length} Events)
          </span>

          <div className="space-y-2.5">
            {milestones.map((m) => (
              <div
                key={m.step}
                onClick={() => setCurrentStep(m.step)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                  currentStep === m.step
                    ? "bg-[#111827] border-accent/60 shadow-lg"
                    : "bg-[#0D1322] border-[#1E293B] hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 text-accent font-mono text-xs font-bold flex items-center justify-center">
                      {m.step}
                    </span>
                    <div>
                      <span className="text-xs font-bold text-white block">{m.event_title}</span>
                      <span className="text-[10px] font-mono text-slate-400">DRI: {m.owner} · {m.category}</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-accent">{m.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </VetraAppShell>
  );
}
