"use client";

import React, { useState, useEffect } from "react";
import { VetraAppShell } from "@/components/VetraAppShell";
import { DecisionGraph } from "@/components/DecisionGraph";
import { DecisionDNA } from "@/components/DecisionDNA";
import { fetchGraph, fetchTimeline, fetchDecisionDNA } from "@/lib/api";
import { 
  Network, 
  Layers, 
  Filter, 
  Zap, 
  Sparkles, 
  Maximize2, 
  RotateCcw,
  CheckCircle2,
  Flame,
  User,
  GitCommit,
  FileText
} from "lucide-react";

export default function DecisionGraphPage() {
  const [graphData, setGraphData] = useState<{ nodes: any[]; edges: any[]; summary: any } | null>(null);
  const [timelineData, setTimelineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  
  // Decision DNA Drawer
  const [selectedDNA, setSelectedDNA] = useState<any | null>(null);
  const [isDNAOpen, setIsDNAOpen] = useState(false);

  const loadData = async () => {
    try {
      const [g, t] = await Promise.all([fetchGraph(), fetchTimeline()]);
      setGraphData(g);
      setTimelineData(t);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
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

  const filteredNodes = React.useMemo(() => {
    if (!graphData || !graphData.nodes) return [];
    if (selectedFilter === "all") return graphData.nodes;
    if (selectedFilter === "decisions") return graphData.nodes.filter(n => n.type === "Decision");
    if (selectedFilter === "meetings") return graphData.nodes.filter(n => n.type === "Meeting");
    if (selectedFilter === "commits") return graphData.nodes.filter(n => n.type === "Commit");
    if (selectedFilter === "components") return graphData.nodes.filter(n => n.type === "Requirement");
    if (selectedFilter === "people") return graphData.nodes.filter(n => n.type === "Person");
    return graphData.nodes;
  }, [graphData, selectedFilter]);

  return (
    <VetraAppShell pageTitle="Decision Graph Studio" pageDescription="Interactive topology network, dependency vectors & blast radius simulator" onRefresh={loadData}>
      <div className="flex-1 w-full h-full flex flex-col p-3 sm:p-4 overflow-hidden bg-[#0A0F1C] relative">
        
        {/* Graph Studio Header Toolbar */}
        <div className="h-12 rounded-2xl bg-[#0D1322] border border-[#1E293B] px-4 flex items-center justify-between flex-shrink-0 mb-3 z-10 shadow-lg">
          
          {/* Left: Filter Buttons */}
          <div className="flex items-center space-x-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] font-mono text-slate-400 mr-2 flex items-center space-x-1 hidden sm:flex">
              <Filter className="w-3.5 h-3.5 text-accent" />
              <span>Filter:</span>
            </span>

            {[
              { id: "all", label: "All Nodes" },
              { id: "decisions", label: "PRD Specs" },
              { id: "meetings", label: "Meetings" },
              { id: "commits", label: "Commits" },
              { id: "components", label: "Systems" },
              { id: "people", label: "DRIs" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1 rounded-lg font-mono text-[11px] transition-all whitespace-nowrap ${
                  selectedFilter === f.id
                    ? "bg-primary text-white font-bold shadow-md shadow-primary/20"
                    : "bg-[#111827] text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Right: Legend & Quick Tip */}
          <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
            <div className="hidden md:flex items-center space-x-2 text-[10px]">
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-primary" /><span>Decision</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-blue-500" /><span>Meeting</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-amber-500" /><span>Commit</span></span>
              <span className="flex items-center space-x-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /><span>Component</span></span>
            </div>
          </div>

        </div>

        {/* Main Canvas Area */}
        <div className="flex-1 w-full h-full min-h-0 rounded-2xl overflow-hidden relative">
          {loading ? (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 border-3 border-primary/30 border-t-accent rounded-full animate-spin" />
              <span className="text-xs font-mono text-slate-400">Synthesizing Decision Graph...</span>
            </div>
          ) : (
            graphData && (
              <DecisionGraph
                initialNodes={filteredNodes}
                initialEdges={graphData.edges}
                replayMilestones={timelineData?.replay_milestones || []}
                onOpenDNA={handleOpenDNA}
              />
            )
          )}
        </div>

      </div>

      {/* Decision DNA Drawer */}
      <DecisionDNA
        dna={selectedDNA}
        isOpen={isDNAOpen}
        onClose={() => setIsDNAOpen(false)}
      />

    </VetraAppShell>
  );
}
