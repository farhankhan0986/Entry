"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Wrench, BookLock, Hash, Sparkles, Shield, Timer, Brain, Type, Zap,
  X, ChevronUp,
} from "lucide-react";

const TOOLS = [
  { href: "/diary",             icon: BookLock,  label: "Diary",    accent: "#8b5cf6" },
  { href: "/caption-generator", icon: Hash,      label: "Captions", accent: "#ec4899" },
  { href: "/ai-humanizer",      icon: Sparkles,  label: "Humanize", accent: "#f59e0b" },
  { href: "/cyber-safety",      icon: Shield,    label: "Security", accent: "#10b981" },
  { href: "/focus-timer",       icon: Timer,     label: "Timer",    accent: "#06b6d4" },
  { href: "/prompt-optimizer",  icon: Brain,     label: "Prompt",   accent: "#6366f1" },
];

export default function FloatingToolsButton() {
  const [open, setOpen]       = useState(false);
  const [visible, setVisible] = useState(false);

  // Only show after scrolling 300px
  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > 300);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2">
      {/* Tool links */}
      {open && (
        <div className="flex flex-col gap-2 mb-1 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setOpen(false)}
              title={tool.label}
              className="flex items-center gap-2.5 pr-4 pl-3 py-2.5 rounded-2xl border border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-x-0.5 group"
            >
              <div
                className="p-1.5 rounded-xl transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${tool.accent}20` }}
              >
                <tool.icon size={14} style={{ color: tool.accent }} />
              </div>
              <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                {tool.label}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 ${
          open
            ? "bg-[var(--foreground)] text-[var(--background)] rotate-45"
            : "bg-[var(--accent)] text-white hover:scale-110"
        }`}
        aria-label="Tools menu"
      >
        {open ? <X size={18} /> : <Wrench size={18} />}
      </button>
    </div>
  );
}
