"use client";

import Link from "next/link";
import { BookLock, Hash, Sparkles, Shield, Timer, Brain, Type, Zap, ArrowRight, Wrench } from "lucide-react";

const ALL_TOOLS = [
  { id: "diary",     href: "/diary",             icon: BookLock,  label: "Dear Diary",        desc: "Private encrypted journal",    accent: "#8b5cf6" },
  { id: "captions",  href: "/caption-generator",  icon: Hash,      label: "Caption Generator", desc: "AI captions for social",       accent: "#ec4899" },
  { id: "humanizer", href: "/ai-humanizer",        icon: Sparkles,  label: "AI Natural Writer", desc: "Humanise AI text in 8 modes",  accent: "#f59e0b" },
  { id: "cyber",     href: "/cyber-safety",        icon: Shield,    label: "Cyber Safety",      desc: "Password tools, all in-browser",accent: "#10b981" },
  { id: "timer",     href: "/focus-timer",         icon: Timer,     label: "Focus Timer",       desc: "Deep work Pomodoro sessions",  accent: "#06b6d4" },
  { id: "prompt",    href: "/prompt-optimizer",    icon: Brain,     label: "Prompt Optimizer",  desc: "Better AI prompts, instantly", accent: "#6366f1" },
  { id: "converter", href: "/converter",           icon: Type,      label: "Text Converter",    desc: "Transform text formats",       accent: "#14b8a6" },
  { id: "salary",    href: "/salary-check",        icon: Zap,       label: "Salary Checker",    desc: "Compare salaries globally",    accent: "#f97316" },
];

// Map blog categories to relevant tools
const CATEGORY_MAP = {
  Technology:    ["humanizer", "prompt", "converter"],
  Psychology:    ["diary", "timer", "captions"],
  Lifestyle:     ["diary", "timer", "captions"],
  Health:        ["diary", "timer"],
  "Social Media":["captions", "humanizer"],
  Business:      ["salary", "prompt", "humanizer"],
  Career:        ["salary", "prompt"],
  Finance:       ["salary"],
  General:       ["captions", "diary", "humanizer"],
  Education:     ["prompt", "humanizer", "converter"],
  Mysteries:     ["captions", "humanizer"],
  History:       ["humanizer", "prompt"],
  Science:       ["prompt", "converter"],
  Fiction:       ["humanizer", "diary"],
};

export default function RelatedTools({ category = "General", exclude = [], max = 3 }) {
  const ids = (CATEGORY_MAP[category] || CATEGORY_MAP.General)
    .filter(id => !exclude.includes(id))
    .slice(0, max);

  const tools = ids.map(id => ALL_TOOLS.find(t => t.id === id)).filter(Boolean);

  if (!tools.length) return null;

  return (
    <aside className="my-8 rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-5 overflow-hidden relative">
      {/* Subtle gradient */}
      <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl bg-[var(--accent)]/5 -mr-16 -mt-16 pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
            <Wrench size={12} />
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">
            Related Tools
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {tools.map(tool => (
            <Link
              key={tool.id}
              href={tool.href}
              className="group flex items-start gap-2.5 p-3 rounded-xl border border-[var(--border)] hover:border-[var(--accent)]/40 bg-[var(--background)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className="p-1.5 rounded-lg shrink-0 transition-transform duration-200 group-hover:scale-110"
                style={{ background: `${tool.accent}20` }}
              >
                <tool.icon size={13} style={{ color: tool.accent }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors truncate">
                  {tool.label}
                </div>
                <div className="text-[10px] text-[var(--muted)] leading-snug mt-0.5 truncate">
                  {tool.desc}
                </div>
              </div>
              <ArrowRight
                size={11}
                className="shrink-0 mt-0.5 text-[var(--muted)] transition-all duration-200 group-hover:text-[var(--accent)] group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
