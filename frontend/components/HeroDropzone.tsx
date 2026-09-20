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
  FileSpreadsheet,
  Lock
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
    <div className="flex-1 w-full h-full flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-[#070B14] select-none">
      
      {/* Ambient lighting glows */}
      <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-[#8B5CF6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-[450px] h-[450px] bg-[#22D3EE]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl w-full space-y-8 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Top Product Badge */}
        <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-[#101827]/90 border border-[#8B5CF6]/40 text-xs font-mono text-slate-300 shadow-2xl backdrop-blur-xl">
          <div className="w-2 h-2 rounded-full bg-[#22D3EE] animate-ping" />
          <span className="text-[#F8FAFC] font-semibold">ContextLock Zero</span>
          <span className="text-[#94A3B8]">·</span>
          <span className="text-[#8B5CF6] font-bold">AI Decision Immune System</span>
          <span className="text-[#94A3B8]">·</span>
          <span className="text-[#10B981] font-bold">YC Ready</span>
        </div>

        {/* Hero Heading (Exact Phase 4 Specs) */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-tight">
            Git Tracks Code. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#22D3EE] via-[#8B5CF6] to-[#10B981]">
              We Protect Project Decisions.
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-sans">
            Drop PDFs, DOCX, Markdown or Git history. Reconstruct decision topology, detect cross-document contradictions, and calculate downstream impact blast radius in real time.
          </p>
        </div>

        {/* Glowing Dropzone Area */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-8 sm:p-12 rounded-3xl border-2 border-dashed transition-all duration-300 cursor-pointer shadow-2xl relative overflow-hidden backdrop-blur-xl ${
            isDragging
              ? "border-[#22D3EE] bg-[#22D3EE]/10 scale-[1.02] shadow-[#22D3EE]/25"
              : "border-[#1E293B] hover:border-[#8B5CF6]/70 bg-[#101827]/80 hover:bg-[#101827] animate-pulse-glow"
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B5CF6]/30 to-[#22D3EE]/20 border border-[#8B5CF6]/40 flex items-center justify-center text-[#22D3EE] shadow-2xl">
              <UploadCloud className="w-8 h-8 animate-bounce" />
            </div>

            <div className="space-y-1">
              <span className="text-lg sm:text-xl font-bold text-[#F8FAFC] block">
                Drop your project repository or specification files here
              </span>
              <span className="text-xs text-[#94A3B8] block font-sans">
                Drag and drop PRDs, architecture docs, meeting minutes, and Git commit logs
              </span>
            </div>

            {/* Supported Format Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-[#F8FAFC]">
              <span className="px-3 py-1 rounded-xl bg-[#070B14] border border-[#1E293B] flex items-center space-x-1.5">
                <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                <span>PDF (.pdf)</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#070B14] border border-[#1E293B] flex items-center space-x-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-[#22D3EE]" />
                <span>Word (.docx)</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#070B14] border border-[#1E293B] flex items-center space-x-1.5">
                <FileCode className="w-3.5 h-3.5 text-[#8B5CF6]" />
                <span>Markdown (.md)</span>
              </span>
              <span className="px-3 py-1 rounded-xl bg-[#070B14] border border-[#1E293B] flex items-center space-x-1.5">
                <GitBranch className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Git Commits (.json / .log)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Buttons (Upload Project + Load Demo) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:opacity-95 text-white text-xs sm:text-sm font-bold shadow-xl shadow-[#8B5CF6]/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Project</span>
          </button>

          <button
            onClick={() => folderInputRef.current?.click()}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#101827] hover:bg-slate-800 text-slate-200 hover:text-white text-xs sm:text-sm font-bold border border-[#1E293B] hover:border-[#22D3EE]/40 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <FolderArchive className="w-4 h-4 text-[#22D3EE]" />
            <span>Upload Repo Folder</span>
          </button>

          <button
            onClick={onLoadDemo}
            disabled={isAnalyzing}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#10B981]/20 to-[#22D3EE]/20 hover:from-[#10B981]/30 hover:to-[#22D3EE]/30 text-[#10B981] hover:text-white text-xs sm:text-sm font-bold border border-[#10B981]/40 shadow-xl transition-all hover:scale-105 active:scale-95 flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-[#10B981] fill-[#10B981]" />
            <span>Load Demo (Auth Dispute)</span>
          </button>
        </div>

        {/* Trust Guarantee note */}
        <div className="text-xs font-mono text-[#94A3B8] flex items-center justify-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span>Universal multi-format parser · Zero hardcoded scripts · 100% evidence-grounded</span>
        </div>

      </div>
    </div>
  );
};
