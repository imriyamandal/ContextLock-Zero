"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { 
  Zap, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  User, 
  GitCommit, 
  FileText, 
  Layers, 
  Play, 
  Pause, 
  RotateCcw, 
  Radio, 
  ChevronRight,
  ShieldAlert,
  Flame
} from "lucide-react";
import { simulateImpact } from "../lib/api";
import { SimulationResult, ReplayMilestone } from "../lib/types";

// Custom Node Components
const DecisionNode = ({ data, selected }: { data: any; selected?: boolean }) => {
  const isConflicted = data.status === "conflicted";
  return (
    <div className={`px-4 py-3 rounded-xl border transition-all duration-200 shadow-xl min-w-[220px] max-w-[280px] ${
      selected 
        ? "border-accent ring-2 ring-accent/40 bg-surface shadow-accent/20" 
        : isConflicted
        ? "border-rose-500/50 bg-rose-950/20 hover:border-rose-400"
        : "border-primary/50 bg-surface/90 hover:border-primary"
    }`}>
      <Handle type="target" position={Position.Left} className="!bg-primary" />
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-primary/20 text-accent border border-primary/30">
          {data.category || "Decision"}
        </span>
        {data.confidence && (
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            {Math.round(data.confidence * 100)}% Conf
          </span>
        )}
      </div>
      <div className="text-xs font-bold text-white tracking-tight leading-snug">
        {data.title || data.label}
      </div>
      {data.owner && (
        <div className="flex items-center space-x-1.5 mt-2 text-[11px] text-slate-400">
          <User className="w-3 h-3 text-slate-400" />
          <span className="truncate">{data.owner}</span>
        </div>
      )}
      <Handle type="source" position={Position.Right} className="!bg-accent" />
    </div>
  );
};

const MeetingNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className={`px-4 py-3 rounded-xl border border-blue-500/50 bg-blue-950/20 hover:border-blue-400 transition-all duration-200 shadow-xl min-w-[220px] max-w-[280px] ${
    selected ? "ring-2 ring-blue-400 bg-surface" : ""
  }`}>
    <Handle type="target" position={Position.Left} className="!bg-blue-400" />
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
        Meeting Sync
      </span>
      <span className="text-[10px] font-mono text-slate-400">{data.date}</span>
    </div>
    <div className="text-xs font-bold text-white leading-snug">
      {data.title || data.label}
    </div>
    <div className="text-[11px] text-slate-400 mt-1 truncate">
      Proposed by: {data.owner || "Security Team"}
    </div>
    <Handle type="source" position={Position.Right} className="!bg-blue-400" />
  </div>
);

const CommitNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className={`px-4 py-3 rounded-xl border border-amber-500/50 bg-amber-950/20 hover:border-amber-400 transition-all duration-200 shadow-xl min-w-[220px] max-w-[280px] ${
    selected ? "ring-2 ring-amber-400 bg-surface" : ""
  }`}>
    <Handle type="target" position={Position.Left} className="!bg-amber-400" />
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
        <GitCommit className="w-3 h-3 inline" />
        <span>Git Commit</span>
      </span>
      <span className="text-[10px] font-mono text-slate-400">{data.date?.slice(0, 10)}</span>
    </div>
    <div className="text-xs font-bold text-white leading-snug">
      {data.title || data.label}
    </div>
    <div className="text-[11px] text-amber-300/80 mt-1 truncate">
      Author: {data.owner}
    </div>
    <Handle type="source" position={Position.Right} className="!bg-amber-400" />
  </div>
);

const RequirementNode = ({ data, selected }: { data: any; selected?: boolean }) => (
  <div className={`px-4 py-3 rounded-xl border border-cyan-500/50 bg-cyan-950/20 hover:border-cyan-400 transition-all duration-200 shadow-xl min-w-[200px] max-w-[260px] ${
    selected ? "ring-2 ring-cyan-400 bg-surface scale-105" : ""
  }`}>
    <Handle type="target" position={Position.Left} className="!bg-accent" />
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-500/20 text-accent border border-cyan-500/30">
        System Component
      </span>
    </div>
    <div className="text-xs font-bold text-white leading-snug">
      {data.title || data.label}
    </div>
    <div className="text-[10px] font-mono text-slate-400 mt-1">
      Subsystem Owner: {data.owner || "David Park"}
    </div>
    <Handle type="source" position={Position.Right} className="!bg-accent" />
  </div>
);

const PersonNode = ({ data }: { data: any }) => (
  <div className="px-3 py-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs font-semibold flex items-center space-x-1.5 shadow-lg">
    <Handle type="source" position={Position.Right} className="!bg-emerald-400" />
    <User className="w-3.5 h-3.5 text-emerald-400" />
    <span>{data.label}</span>
  </div>
);

const nodeTypes = {
  Decision: DecisionNode,
  Meeting: MeetingNode,
  Commit: CommitNode,
  Requirement: RequirementNode,
  Person: PersonNode,
};

interface Props {
  initialNodes: any[];
  initialEdges: any[];
  replayMilestones?: ReplayMilestone[];
  onOpenDNA?: (nodeId: string) => void;
}

export const DecisionGraph: React.FC<Props> = ({ 
  initialNodes, 
  initialEdges, 
  replayMilestones = [],
  onOpenDNA
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  
  // Decision Replay State
  const [replayStep, setReplayStep] = useState<number>(replayMilestones.length || 5);
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);

  // Sync when initial props change
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  // Handle Node Click & Embedded Impact Simulator (Change 1)
  const onNodeClick = useCallback(async (_: any, node: Node) => {
    setSelectedNode(node);
    setSimulating(true);
    try {
      const res = await simulateImpact(node.id);
      setSimulationResult(res);

      // Highlight impacted nodes & edges in React Flow
      const impactedIds = new Set(res.impacted_nodes.map(n => n.id));
      impactedIds.add(node.id);

      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === node.id,
          style: {
            ...n.style,
            opacity: impactedIds.has(n.id) ? 1 : 0.35,
            transition: "all 0.3s ease",
          },
        }))
      );

      setEdges((eds) =>
        eds.map((e) => ({
          ...e,
          animated: e.source === node.id || impactedIds.has(e.target),
          style: {
            ...e.style,
            stroke: e.source === node.id ? "#EF4444" : (impactedIds.has(e.target) ? "#22D3EE" : "#334155"),
            strokeWidth: e.source === node.id ? 3 : 1.5,
            opacity: e.source === node.id || (impactedIds.has(e.source) && impactedIds.has(e.target)) ? 1 : 0.25,
          },
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  }, [setNodes, setEdges]);

  // Reset Highlight
  const handleResetHighlight = () => {
    setSelectedNode(null);
    setSimulationResult(null);
    setNodes(initialNodes.map(n => ({ ...n, selected: false, style: { opacity: 1 } })));
    setEdges(initialEdges.map(e => ({ ...e, style: { stroke: "#7C3AED", strokeWidth: 2, opacity: 1 } })));
  };

  // Replay scrubber effect
  const handleReplayChange = (step: number) => {
    setReplayStep(step);
    if (!replayMilestones || replayMilestones.length === 0) return;
    const currentMilestone = replayMilestones.find(m => m.step === step) || replayMilestones[step - 1];
    if (currentMilestone) {
      const activeIds = new Set(currentMilestone.active_node_ids);
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          style: {
            ...n.style,
            opacity: activeIds.has(n.id) ? 1 : 0.15,
            transform: activeIds.has(n.id) ? "scale(1)" : "scale(0.95)",
            transition: "all 0.4s ease",
          }
        }))
      );
    }
  };

  // Auto-play replay animation
  useEffect(() => {
    let interval: any = null;
    if (isPlayingReplay && replayMilestones.length > 0) {
      interval = setInterval(() => {
        setReplayStep((prev) => {
          if (prev >= replayMilestones.length) {
            setIsPlayingReplay(false);
            return prev;
          }
          const next = prev + 1;
          handleReplayChange(next);
          return next;
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlayingReplay, replayMilestones]);

  const currentMilestone = replayMilestones.find(m => m.step === replayStep) || replayMilestones[replayStep - 1];

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden glass-panel border border-surfaceBorder/80 bg-background/95 shadow-2xl flex flex-col">
      
      {/* Top Controls Toolbar */}
      <div className="h-12 border-b border-surfaceBorder/60 px-4 flex items-center justify-between bg-surface/80 z-10 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Interactive Decision Graph & Impact Simulator
            </span>
          </div>
          <span className="hidden sm:inline text-[11px] text-slate-400 font-mono">
            ({nodes.length} Nodes · {edges.length} Dependencies)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {simulationResult && (
            <button
              onClick={handleResetHighlight}
              className="text-[11px] font-mono px-2.5 py-1 rounded bg-surface hover:bg-slate-800 text-slate-300 border border-surfaceBorder transition-all"
            >
              Reset Simulation
            </button>
          )}
          <div className="text-[11px] font-mono px-2.5 py-1 rounded bg-primary/20 text-accent border border-primary/30">
            Click any node to simulate blast radius
          </div>
        </div>
      </div>

      {/* Main Graph Canvas */}
      <div className="relative flex-1 w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.4}
          maxZoom={1.5}
        >
          <Background color="#1E293B" gap={16} size={1} />
          <Controls className="!bg-surface !border-surfaceBorder !fill-white" />
          <MiniMap 
            className="!bg-surface/90 !border !border-surfaceBorder !rounded-xl"
            nodeColor={(n) => {
              if (n.type === "Decision") return "#7C3AED";
              if (n.type === "Meeting") return "#3B82F6";
              if (n.type === "Commit") return "#F59E0B";
              if (n.type === "Requirement") return "#22D3EE";
              return "#10B981";
            }}
          />
        </ReactFlow>

        {/* Embedded Impact Blast Radius Side Drawer (Change 1) */}
        {simulationResult && (
          <div className="absolute top-4 right-4 w-84 sm:w-96 glass-panel rounded-xl p-5 border border-accent/40 shadow-2xl z-20 backdrop-blur-2xl animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-rose-400 animate-pulse" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-tight font-mono">
                    Impact Blast Radius
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    What-If Dependency Simulator
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  {simulationResult.blast_radius_score}% Blast Score
                </span>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-surface/80 border border-surfaceBorder text-xs text-slate-200">
              <div className="font-bold text-accent mb-1 truncate">
                Target: {simulationResult.target_title}
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {simulationResult.technical_summary}
              </p>
            </div>

            <div className="mt-3">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5">
                Downstream Impacted Subsystems ({simulationResult.impacted_count}):
              </span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {simulationResult.impacted_nodes.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded bg-surface/50 border border-surfaceBorder/80 text-xs">
                    <div className="truncate">
                      <span className="text-white font-medium block truncate">{item.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">Owner: {item.owner}</span>
                    </div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      Impacted
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (onOpenDNA && selectedNode) onOpenDNA(selectedNode.id);
                }}
                className="py-1.5 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow transition-all flex items-center justify-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Decision DNA</span>
              </button>

              <button
                onClick={handleResetHighlight}
                className="py-1.5 rounded-lg bg-surface hover:bg-slate-800 text-xs font-medium text-slate-300 border border-surfaceBorder transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Secret Weapon: Decision Replay Scrubber (Page bottom) */}
      <div className="border-t border-surfaceBorder/80 p-3 sm:p-4 bg-surface/90 backdrop-blur-xl z-10 flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Secret Weapon: Decision Replay
            </span>
            <span className="text-[11px] text-slate-400 font-sans hidden md:inline">
              (Drag slider to replay historical decision milestones)
            </span>
          </div>

          {/* Play/Pause/Reset Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsPlayingReplay(!isPlayingReplay)}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-primary/20 hover:bg-primary/30 text-accent text-xs font-mono border border-primary/40 transition-all"
            >
              {isPlayingReplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-accent" />}
              <span>{isPlayingReplay ? "Pause" : "Play Replay"}</span>
            </button>
            <button
              onClick={() => handleReplayChange(1)}
              className="p-1 rounded bg-surface hover:bg-slate-800 text-slate-400 hover:text-white border border-surfaceBorder"
              title="Reset to Step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Slider */}
        <div className="flex items-center space-x-4">
          <span className="text-[11px] font-mono text-slate-400">Step {replayStep}/{replayMilestones.length || 5}</span>
          <input
            type="range"
            min={1}
            max={replayMilestones.length || 5}
            value={replayStep}
            onChange={(e) => handleReplayChange(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
          />
          {currentMilestone && (
            <span className="text-xs font-mono text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/30 flex-shrink-0">
              {currentMilestone.date}
            </span>
          )}
        </div>

        {/* Milestone info pill */}
        {currentMilestone && (
          <div className="text-xs text-slate-300 flex items-center space-x-2 truncate">
            <span className="text-accent font-bold">Milestone #{currentMilestone.step}:</span>
            <span className="text-white font-medium truncate">{currentMilestone.event_title}</span>
            <span className="text-slate-400 text-[11px] font-mono hidden sm:inline truncate">({currentMilestone.rationale})</span>
          </div>
        )}
      </div>

    </div>
  );
};
