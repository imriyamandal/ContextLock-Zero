"use client";

import React, { useState, useRef } from "react";
import { 
  UploadCloud, 
  FileText, 
  FileCode, 
  GitBranch, 
  Sparkles, 
  Zap, 
  FolderGit2, 
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet
} from "lucide-react";

interface Props {
  onFilesSelected: (files: File[]) => void;
  onLoadDemo: () => void;
  isAnalyzing: boolean;
}

export const HeroDropzone: React.FC<Props> = ({ onFilesSelected, onLoadDemo, isAnalyzing }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      onFilesSelected(droppedFiles);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      onFilesSelected(selectedFiles);
    }
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background select-none">
      
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full space-y-7 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Product Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-surface/80 border border-surfaceBorder text-xs font-mono text-slate-300 shadow-xl backdrop-blur-md">
          <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span className="text-white font-semibold">ContextLock Zero</span>
          <span className="text-slate-500">·</span>
          <span className="text-accent font-bold">AI Decision Intelligence Workspace</span>
          <span className="text-slate-500">·</span>
          <span className="text-emerald-400 font-bold">v2.0</span>
        </div>

        {/* Hero Heading (Large Typography) */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Analyze Your Project Decisions <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-primary-300 to-emerald-400">
              With Verifiable Evidence
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Drop your project folder, PRDs, architecture docs, or git commit history. ContextLock reconstructs the decision graph, detects contradictions, and calculates downstream blast radius.
          </p>
        </div>

        {/* Main Large Dropzone Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 sm:p-10 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer shadow-2xl relative overflow-hidden backdrop-blur-xl ${
            isDragging
              ? "border-accent bg-accent/10 scale-[1.02] shadow-accent/20"
              : "border-surfaceBorder hover:border-primary/60 bg-surface/60 hover:bg-surface/80"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.docx,.doc,.md,.markdown,.txt,.json,.log"
          />
          <input
            ref={folderInputRef}
            type="file"
            multiple
            {...({ webkitdirectory: "" } as any)}
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/40 flex items-center justify-center text-accent shadow-2xl">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-base sm:text-lg font-bold text-white block">
                Drop your project repository or files here
              </span>
              <span className="text-xs text-slate-400 block font-sans">
                Drag a project directory, PRD specs, or click to browse
              </span>
            </div>

            {/* Supported Format Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-[11px] font-mono text-slate-300">
              <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder flex items-center space-x-1.5">
                <FolderGit2 className="w-3.5 h-3.5 text-primary-300" />
                <span>Repo Folder (README, docs/, commits)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder flex items-center space-x-1">
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>PDF (.pdf)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder flex items-center space-x-1">
                <FileSpreadsheet className="w-3.5 h-3.5 text-blue-400" />
                <span>Word (.docx)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder flex items-center space-x-1">
                <FileCode className="w-3.5 h-3.5 text-accent" />
                <span>Markdown (.md)</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-surface border border-surfaceBorder flex items-center space-x-1">
                <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                <span>Git Logs (.json)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold shadow-lg shadow-primary/25 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Custom Files</span>
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-bold border border-surfaceBorder hover:border-accent/40 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <FolderArchive className="w-4 h-4 text-accent" />
            <span>Upload Repository Folder</span>
          </button>

          <button
            onClick={onLoadDemo}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600/30 to-teal-600/30 hover:from-emerald-600/40 hover:to-teal-600/40 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/40 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            <span>1-Click Auth Dispute Demo</span>
          </button>
        </div>

        {/* Guarantee footer note */}
        <div className="text-[11px] font-mono text-slate-500 flex items-center justify-center space-x-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Universal multi-format parser · Zero hardcoded scripts · 100% evidence-grounded</span>
        </div>

      </div>
    </div>
  );
};

