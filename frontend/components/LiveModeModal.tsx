"use client";

import React, { useState } from "react";
import { 
  Radio, 
  X, 
  Zap, 
  Send, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2 
} from "lucide-react";
import { injectLiveEvent } from "../lib/api";
import confetti from "canvas-confetti";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onEventInjected: () => void;
}

export const LiveModeModal: React.FC<Props> = ({ isOpen, onClose, onEventInjected }) => {
  const [title, setTitle] = useState("Emergency Hotfix: Reversion to Stateless JWT");
  const [owner, setOwner] = useState("Alex Rivera (EM)");
  const [description, setDescription] = useState("Immediate reversion back to custom JWT Authentication due to Firebase rate-limiting and offline verification bugs on mobile client.");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleInject = async () => {
    setLoading(true);
    try {
      await injectLiveEvent({ title, description, owner, category: "Authentication" });
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.3 },
        colors: ["#EF4444", "#F59E0B", "#7C3AED"]
      });
      onEventInjected();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPreset = () => {
    setTitle("Emergency Hotfix: Revert to Stateless JWT");
    setOwner("Alex Rivera (Engineering Manager)");
    setDescription("Firebase SDK failed offline cryptographic verification on mobile. Immediate reversion to RS256 JWT.");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl glass-panel border border-accent/40 bg-surface/95 shadow-2xl p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-xl bg-accent/20 text-accent border border-accent/30">
            <Radio className="w-5 h-5 text-accent animate-pulse" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Live Mode: Real-Time Event Injection
            </h3>
            <p className="text-xs text-slate-400">
              Inject a new meeting note or decision to watch graph & health score shift live!
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Event / Decision Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-surfaceBorder text-slate-100 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Author / Decision DRI
            </label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-surfaceBorder text-slate-100 focus:outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-300 uppercase mb-1">
              Details / Meeting Note Snippet
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-background border border-surfaceBorder text-slate-100 focus:outline-none focus:border-accent resize-none font-mono text-[11px]"
            />
          </div>
        </div>

        {/* Quick Demo Preset Button */}
        <div className="mt-4 pt-3 border-t border-surfaceBorder flex items-center justify-between">
          <button
            type="button"
            onClick={handleQuickPreset}
            className="text-[11px] font-mono text-accent hover:underline flex items-center space-x-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Load Auth Reversion Preset</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-surface hover:bg-slate-800 text-xs font-medium text-slate-300 border border-surfaceBorder"
            >
              Cancel
            </button>
            <button
              onClick={handleInject}
              disabled={loading}
              className="px-4 py-1.5 rounded-lg bg-accent hover:bg-accent-hover text-slate-900 text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-accent/20 transition-all"
            >
              <Zap className="w-3.5 h-3.5 fill-slate-900" />
              <span>{loading ? "Injecting..." : "Inject Live Event"}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
