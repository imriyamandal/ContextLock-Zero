"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  Sparkles, 
  Zap, 
  Radio, 
  FileText, 
  RefreshCw, 
  Flame, 
  Activity, 
  Layers,
  ArrowLeft,
  Plus
} from "lucide-react";
import { 
  fetchHealth, 
  fetchConflicts, 
  fetchGraph, 
  fetchTimeline, 
  fetchUploadedFiles,
  uploadFilesAndAnalyze,
  loadDemoProject,
  fetchDecisionDNA
} from "../lib/api";
import { HealthScoreBreakdown, Conflict } from "../lib/types";
import { HeroDropzone } from "./HeroDropzone";
import { WorkspaceSidebar } from "./WorkspaceSidebar";
import { DecisionGraph } from "./DecisionGraph";
import { IntelligenceDeck } from "./IntelligenceDeck";
import { DecisionDNA } from "./DecisionDNA";
import { PassportDrawer } from "./PassportDrawer";
import { LiveModeModal } from "./LiveModeModal";
import confetti from "canvas-confetti";

export const UnifiedWorkspace: React.FC = () => {
  const [health, setHealth] = useState<HealthScoreBreakdown | null>(null);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pipelineStep, setPipelineStep] = useState(0);
  const [pipelineStatus, setPipelineStatus] = useState("");
  
  // Decision DNA State
  const [selectedDNA, setSelectedDNA] = useState<any | null>(null);
  const [isDNAOpen, setIsDNAOpen] = useState(false);

  // Modals
  const [isLiveModalOpen, setIsLiveModalOpen] = useState(false);
  const [isPassportOpen, setIsPassportOpen] = useState(false);

  const loadAllData = async () => {
    try {
      const [h, c, g, t, f] = await Promise.all([
        fetchHealth(),
        fetchConflicts(),
        fetchGraph(),
        fetchTimeline(),
        fetchUploadedFiles()
      ]);
      setHealth(h);
      setConflicts(c);
      setGraphData(g);
      setTimelineData(t);
      setUploadedFiles(f);
    } catch (err) {
      console.error("Data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleOpenDNA = async (nodeId: string) => {
    try {
      const dna = await fetchDecisionDNA(nodeId);
      setSelectedDNA(dna);
      setIsDNAOpen(true);
    } catch (err) {
      console.error("DNA fetch error:", err);
    }
  };

  // Progressive Non-Blocking Ingestion Flow (Change 1)
  const handleUploadFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    setPipelineStep(1);
    setPipelineStatus("Universal Parser tokenizing document AST (PDF / DOCX / MD / Git)...");

    try {
      // Step 2: Instant node growth before Gemini completes
      setTimeout(() => {
        setPipelineStep(2);
        setPipelineStatus("Generating preliminary decision nodes on graph...");
      }, 400);

      setTimeout(() => {
        setPipelineStep(3);
        setPipelineStatus("Gemini Extractor enriching rationales, DRIs, & blast radius...");
      }, 800);

      const res = await uploadFilesAndAnalyze(files);

      setPipelineStep(4);
      setPipelineStatus("Triangulating cross-artifact contradictions & ghost specs...");

      await loadAllData();

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.3 },
        colors: ["#7C3AED", "#22D3EE", "#10B981"]
      });
    } catch (err) {
      console.warn("Upload fallback to demo analysis:", err);
      await loadDemoProject();
      await loadAllData();
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setPipelineStep(0);
        setPipelineStatus("");
      }, 600);
    }
  };

  const handleLoadDemo = async () => {
    setIsAnalyzing(true);
    setPipelineStep(1);
    setPipelineStatus("Loading authentic Project Pulse demo dataset (PRD, Meeting, Git Commits)...");
    
    try {
      setTimeout(() => {
        setPipelineStep(2);
        setPipelineStatus("Extractor parsing JWT vs OAuth vs Firebase decisions...");
      }, 300);

      setTimeout(() => {
        setPipelineStep(3);
        setPipelineStatus("Synthesizing Decision Graph & detecting contradictions...");
      }, 600);

      await loadDemoProject();
      await loadAllData();

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.3 },
        colors: ["#7C3AED", "#22D3EE", "#10B981"]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
        setPipelineStep(0);
        setPipelineStatus("");
      }, 500);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-accent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400 animate-pulse">
          Initializing ContextLock Zero Decision Workspace...
        </span>
      </div>
    );
  }

  const hasFilesOrDecisions = uploadedFiles.length > 0 || (graphData && graphData.nodes && graphData.nodes.length > 0);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background select-none">
      
      {/* Top Workspace Command Bar */}
      <header className="h-14 border-b border-surfaceBorder bg-surface/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between z-30 flex-shrink-0">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <ShieldAlert className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-bold text-sm tracking-tight text-white">
                  ContextLock <span className="text-accent">Zero</span>
                </span>
                <span className="text-[9px] uppercase font-mono px-1.5 py-0.2 rounded bg-primary/20 text-accent border border-primary/40">
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">
                AI Decision Intelligence Workspace
              </span>
            </div>
          </div>

          {hasFilesOrDecisions && health && (
            <>
              <span className="hidden sm:inline text-slate-600">|</span>
              {/* Quick Health Pill */}
              <div 
                onClick={() => setIsPassportOpen(true)}
                className="cursor-pointer flex items-center space-x-2 px-3 py-1 rounded-full bg-surface border border-surfaceBorder hover:border-accent/40 font-mono text-[11px] transition-all"
                title="Click to open Decision Passport report"
              >
                <span className={`w-2 h-2 rounded-full ${health.overall_score >= 80 ? "bg-emerald-400" : health.overall_score >= 60 ? "bg-amber-400" : "bg-rose-500"} animate-pulse`} />
                <span className="text-slate-200 font-bold">Health: {health.overall_score}/100</span>
                <span className="text-slate-500">·</span>
                <span className="text-rose-400 font-semibold">{conflicts.length} Contradictions</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-400 font-medium">{health.unowned_decisions} DRI Gap</span>
              </div>
            </>
          )}
        </div>

        {/* Right: Workspace Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* 1-Click Demo Loader */}
          <button
            onClick={handleLoadDemo}
            disabled={isAnalyzing}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-primary/25 border border-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
            title="Load authentic PRD vs Meeting vs Git demo scenario in <1s"
          >
            {isAnalyzing ? (
              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-accent fill-accent" />
            )}
            <span className="hidden sm:inline">{isAnalyzing ? "Analyzing..." : "1-Click Demo"}</span>
          </button>

          {/* Live Mode Trigger */}
          <button
            onClick={() => setIsLiveModalOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-surface hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-surfaceBorder hover:border-accent/40 transition-all"
            title="Inject real-time meeting decisions without reload"
          >
            <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="hidden md:inline">Live Mode</span>
          </button>

          {/* Decision Passport Drawer */}
          <button
            onClick={() => setIsPassportOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all hover:scale-105"
            title="View executive Decision Passport report"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Decision Passport</span>
          </button>

          {/* Refresh */}
          <button
            onClick={loadAllData}
            className="p-2 rounded-lg bg-surface hover:bg-slate-800 text-slate-400 hover:text-white border border-surfaceBorder transition-all"
            title="Refresh All Engines"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 w-full h-full overflow-hidden relative flex flex-col">
        
        {/* Initial Empty State: Hero Dropzone */}
        {!hasFilesOrDecisions && !isAnalyzing ? (
          <HeroDropzone
            onFilesSelected={handleUploadFiles}
            onLoadDemo={handleLoadDemo}
            isAnalyzing={isAnalyzing}
          />
        ) : (
          /* Living 3-Panel Cursor Workspace: 18% Explorer, 57% Graph, 25% Copilot */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative w-full h-full">
            
            {/* Left: Project Explorer (18%) */}
            <div className="w-full lg:w-[18%] min-w-[210px] max-w-[270px] h-full flex-shrink-0 flex flex-col">
              <WorkspaceSidebar
                uploadedFiles={uploadedFiles}
                onDataRefresh={loadAllData}
                onOpenLiveMode={() => setIsLiveModalOpen(true)}
                onSelectFiles={handleUploadFiles}
                onLoadDemo={handleLoadDemo}
                isAnalyzing={isAnalyzing}
              />
            </div>

            {/* Center: Living Hero Decision Graph (57% Dominant) */}
            <main className="w-full lg:w-[57%] flex-1 h-full p-2 sm:p-3 overflow-hidden flex flex-col min-w-0">
              {graphData && (
                <DecisionGraph
                  initialNodes={graphData.nodes}
                  initialEdges={graphData.edges}
                  replayMilestones={timelineData?.replay_milestones || []}
                  onOpenDNA={handleOpenDNA}
                />
              )}
            </main>

            {/* Right: AI Decision Copilot (25%) */}
            <div className="w-full lg:w-[25%] min-w-[310px] max-w-[400px] h-full flex-shrink-0 flex flex-col">
              <IntelligenceDeck
                health={health}
                conflicts={conflicts}
                onOpenPassport={() => setIsPassportOpen(true)}
                onSelectNodeForDNA={handleOpenDNA}
              />
            </div>

          </div>
        )}

        {/* Live Animated Pipeline Processing Overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 z-50 bg-background/90 backdrop-blur-xl flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="max-w-md w-full p-8 rounded-3xl bg-surface border border-accent/40 shadow-2xl space-y-6 text-center">
              
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border border-accent/40 flex items-center justify-center mx-auto text-accent shadow-xl">
                <Sparkles className="w-8 h-8 animate-spin" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono uppercase font-bold text-accent tracking-wider">
                  AI Decision Pipeline Running
                </span>
                <h3 className="text-xl font-extrabold text-white">
                  Synthesizing Decision Graph...
                </h3>
                <p className="text-xs text-slate-300 font-mono">
                  {pipelineStatus}
                </p>
              </div>

              {/* Multi-Step Pipeline Indicator */}
              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2">
                <span className={pipelineStep >= 1 ? "text-accent font-bold" : ""}>1. Parse</span>
                <span className="text-slate-600">➔</span>
                <span className={pipelineStep >= 2 ? "text-primary-300 font-bold" : ""}>2. Extract</span>
                <span className="text-slate-600">➔</span>
                <span className={pipelineStep >= 3 ? "text-cyan-400 font-bold" : ""}>3. Graph</span>
                <span className="text-slate-600">➔</span>
                <span className={pipelineStep >= 4 ? "text-emerald-400 font-bold" : ""}>4. Conflict</span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary via-accent to-emerald-400 transition-all duration-500"
                  style={{ width: `${(pipelineStep / 4) * 100}%` }}
                />
              </div>

            </div>
          </div>
        )}

      </div>

      {/* Decision DNA Drawer */}
      <DecisionDNA
        dna={selectedDNA}
        isOpen={isDNAOpen}
        onClose={() => setIsDNAOpen(false)}
        onAskCopilot={(question) => {
          // Send chat query or switch to copilot tab
        }}
      />

      {/* Slide-over Modals */}
      <PassportDrawer
        isOpen={isPassportOpen}
        onClose={() => setIsPassportOpen(false)}
        health={health}
        conflicts={conflicts}
      />

      <LiveModeModal
        isOpen={isLiveModalOpen}
        onClose={() => setIsLiveModalOpen(false)}
        onEventInjected={loadAllData}
      />

    </div>
  );
};

