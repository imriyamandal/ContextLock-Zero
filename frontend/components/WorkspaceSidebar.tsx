"use client";

import React, { useRef } from "react";
import { 
  FolderOpen, 
  FileText, 
  FileCode, 
  GitBranch, 
  Plus, 
  Zap, 
  Radio, 
  CheckCircle2, 
  Sparkles,
  FileSpreadsheet,
  Trash2,
  RefreshCw
} from "lucide-react";

interface Props {
  uploadedFiles: any[];
  onDataRefresh: () => void;
  onOpenLiveMode: () => void;
  onSelectFiles: (files: File[]) => void;
  onLoadDemo: () => void;
  isAnalyzing: boolean;
}

export const WorkspaceSidebar: React.FC<Props> = ({
  uploadedFiles,
  onDataRefresh,
  onOpenLiveMode,
  onSelectFiles,
  onLoadDemo,
  isAnalyzing,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selected = Array.from(e.target.files);
      onSelectFiles(selected);
    }
  };

  const getFileIcon = (filetype: string, filename: string) => {
    const ext = filename.split(".").pop()?.toLowerCase();
    if (ext === "pdf") return <FileText className="w-4 h-4 text-rose-400 flex-shrink-0" />;
    if (ext === "docx" || ext === "doc") return <FileSpreadsheet className="w-4 h-4 text-blue-400 flex-shrink-0" />;
    if (ext === "json") return <GitBranch className="w-4 h-4 text-amber-400 flex-shrink-0" />;
    return <FileCode className="w-4 h-4 text-accent flex-shrink-0" />;
  };

  return (
    <aside className="w-full lg:w-72 h-full flex flex-col bg-surface/95 border-r border-surfaceBorder select-none overflow-hidden flex-shrink-0">
      
      {/* Explorer Top Bar */}
      <div className="h-12 border-b border-surfaceBorder px-4 flex items-center justify-between bg-background/50">
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-4 h-4 text-accent" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Explorer
          </span>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1 rounded-md hover:bg-surface text-slate-400 hover:text-white transition-all"
            title="Upload Files"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => folderInputRef.current?.click()}
            className="p-1 rounded-md hover:bg-surface text-slate-400 hover:text-white transition-all"
            title="Upload Folder / Repo"
          >
            <FolderOpen className="w-3.5 h-3.5 text-accent" />
          </button>
          <button
            onClick={onDataRefresh}
            className="p-1 rounded-md hover:bg-surface text-slate-400 hover:text-white transition-all"
            title="Refresh Explorer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

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
      </div>

      {/* Files List Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        
        {/* Project Files Header */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-tight px-1">
          <span>Project Artifacts</span>
          <span>{uploadedFiles.length} Ingested</span>
        </div>

        <div className="space-y-1">
          {uploadedFiles.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-surfaceBorder text-center space-y-2 text-slate-500">
              <span className="text-xs block">No artifacts loaded</span>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[11px] font-mono text-accent hover:underline block mx-auto"
              >
                + Ingest files
              </button>
            </div>
          ) : (
            uploadedFiles.map((file, idx) => (
              <div
                key={file.id || idx}
                className="p-2 rounded-lg bg-surface/80 hover:bg-surface border border-surfaceBorder/80 hover:border-accent/40 flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-2.5 truncate">
                  {getFileIcon(file.filetype, file.filename)}
                  <div className="truncate">
                    <span className="text-xs font-medium text-slate-200 block truncate group-hover:text-white">
                      {file.filename}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {file.filetype || "File"} · {file.size ? `${(file.size / 1024).toFixed(1)} KB` : "ready"}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-emerald-400 opacity-90 flex items-center space-x-1 flex-shrink-0 ml-1">
                  <CheckCircle2 className="w-3 h-3 inline" />
                  <span>Parsed</span>
                </span>
              </div>
            ))
          )}
        </div>

        {/* Quick Upload Add Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-2 rounded-lg bg-surface hover:bg-slate-800 text-xs font-mono text-slate-300 hover:text-white border border-dashed border-surfaceBorder hover:border-accent/40 flex items-center justify-center space-x-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ingest More Files</span>
        </button>

        {/* 1-Click Demo Scenario */}
        <div className="pt-2 border-t border-surfaceBorder space-y-2">
          <button
            onClick={onLoadDemo}
            disabled={isAnalyzing}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:opacity-95 text-white text-xs font-bold shadow-md shadow-primary/20 border border-primary/40 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
          >
            <Zap className="w-3.5 h-3.5 text-accent fill-accent" />
            <span>Load Auth Dispute Demo</span>
          </button>

          <button
            onClick={onOpenLiveMode}
            className="w-full py-2 rounded-xl bg-surface hover:bg-slate-800 text-xs font-medium text-slate-300 border border-surfaceBorder hover:border-accent/40 flex items-center justify-center space-x-1.5 transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span>Inject Live Event</span>
          </button>
        </div>

      </div>

      {/* Footer Status */}
      <div className="h-10 border-t border-surfaceBorder px-4 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-background/50">
        <span className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>Engine: Ready</span>
        </span>
        <span className="text-accent">SQLite ACID</span>
      </div>

    </aside>
  );
};
