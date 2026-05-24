"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookLock, Hash, Sparkles, Shield, Timer, Brain, Type, Zap,
  ArrowRight, Star, Lock, Cpu,
} from "lucide-react";

const TOOLS = [
  {
    id: "diary",
    label: "Dear Diary",
    desc: "Your private, encrypted digital journal. Mood tracking, streak calendar, and AI-powered reflections.",
    href: "/diary",
    icon: BookLock,
    badge: "Private",
    badgeColor: "from-purple-500/80 to-indigo-500/80",
    accent: "#8b5cf6",
    size: "large",   // col-span-2 on desktop
    stat: "Encrypted with AES-256",
  },
  {
    id: "captions",
    label: "Caption Generator",
    desc: "AI captions for Instagram, Twitter, LinkedIn & more.",
    href: "/caption-generator",
    icon: Hash,
    badge: "Popular",
    badgeColor: "from-pink-500/80 to-rose-500/80",
    accent: "#ec4899",
    size: "small",
    stat: "5 platforms",
  },
  {
    id: "humanizer",
    label: "AI Natural Writer",
    desc: "Turn robotic AI text into warm, human writing in 8 distinct styles.",
    href: "/ai-humanizer",
    icon: Sparkles,
    badge: "AI",
    badgeColor: "from-amber-500/80 to-orange-500/80",
    accent: "#f59e0b",
    size: "small",
    stat: "8 rewrite modes",
  },
  {
    id: "cyber",
    label: "Cyber Safety",
    desc: "Password strength checker, secure generator, and security tips. All client-side.",
    href: "/cyber-safety",
    icon: Shield,
    badge: "Free",
    badgeColor: "from-emerald-500/80 to-teal-500/80",
    accent: "#10b981",
    size: "small",
    stat: "100% in-browser",
  },
  {
    id: "focus",
    label: "Focus Timer",
    desc: "Pomodoro deep work sessions with ambient soundscapes.",
    href: "/focus-timer",
    icon: Timer,
    badge: null,
    accent: "#06b6d4",
    size: "small",
    stat: "Pomodoro method",
  },
];

export default function ToolSpotlightGrid() {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="container mx-auto px-6 py-16">
      {/* Section header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-[10px] mb-3">
            <Cpu size={12} />
            <span>Tools & Utilities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] tracking-tight">
            Beyond the blog
          </h2>
          <p className="text-[var(--muted)] mt-2 italic text-lg">
            Free tools built for curious, creative minds.
          </p>
        </div>
        <Link
          href="/tools"
          className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--accent)] hover:opacity-70 transition-opacity"
        >
          All tools <ArrowRight size={14} />
        </Link>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto">

        {/* Large card — Dear Diary */}
        {TOOLS.filter(t => t.size === "large").map(tool => (
          <Link
            key={tool.id}
            href={tool.href}
            onMouseEnter={() => setHovered(tool.id)}
            onMouseLeave={() => setHovered(null)}
            className="md:col-span-2 group relative rounded-3xl border border-[var(--border)] bg-[var(--card)]/10 p-8 overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-xl hover:-translate-y-0.5"
            style={{ "--tool-accent": tool.accent }}
          >
            {/* Glow orb */}
            <div
              className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl transition-opacity duration-500 -mr-16 -mt-16 pointer-events-none"
              style={{
                background: tool.accent,
                opacity: hovered === tool.id ? 0.12 : 0.05,
              }}
            />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div
                  className="p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${tool.accent}20` }}
                >
                  <tool.icon size={24} style={{ color: tool.accent }} />
                </div>
                {tool.badge && (
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] text-white px-2.5 py-1 rounded-full bg-gradient-to-r ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-bold text-[var(--foreground)] mb-3 group-hover:text-[var(--accent)] transition-colors">
                {tool.label}
              </h3>
              <p className="text-[var(--muted)] leading-relaxed mb-6 max-w-sm">
                {tool.desc}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold" style={{ color: tool.accent }}>
                  <Lock size={10} />
                  <span>{tool.stat}</span>
                </div>
                <div
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:gap-3"
                  style={{ color: tool.accent }}
                >
                  Open <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </Link>
        ))}

        {/* Small cards */}
        {TOOLS.filter(t => t.size === "small").map(tool => (
          <Link
            key={tool.id}
            href={tool.href}
            onMouseEnter={() => setHovered(tool.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative rounded-3xl border border-[var(--border)] bg-[var(--card)]/10 p-6 overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-xl hover:-translate-y-0.5"
          >
            {/* Glow orb */}
            <div
              className="absolute bottom-0 right-0 w-32 h-32 rounded-full blur-3xl transition-opacity duration-500 -mr-10 -mb-10 pointer-events-none"
              style={{
                background: tool.accent,
                opacity: hovered === tool.id ? 0.12 : 0.04,
              }}
            />

            <div className="relative z-10 h-full flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-2.5 rounded-xl transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${tool.accent}20` }}
                >
                  <tool.icon size={18} style={{ color: tool.accent }} />
                </div>
                {tool.badge && (
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] text-white px-2 py-0.5 rounded-full bg-gradient-to-r ${tool.badgeColor}`}>
                    {tool.badge}
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                {tool.label}
              </h3>
              <p className="text-sm text-[var(--muted)] leading-relaxed flex-1">
                {tool.desc}
              </p>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]/60">
                <span className="text-[9px] uppercase tracking-widest font-bold text-[var(--muted)]">
                  {tool.stat}
                </span>
                <ArrowRight
                  size={13}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                  style={{ color: tool.accent }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile "All Tools" CTA */}
      <div className="mt-6 flex md:hidden justify-center">
        <Link
          href="/tools"
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--accent)] hover:opacity-70 transition-opacity"
        >
          View all tools <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
