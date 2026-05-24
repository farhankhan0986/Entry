"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, X, BookLock, Hash, Sparkles, Shield, Timer,
  Brain, Type, Zap, PenLine, Home, BookOpen, Users,
  Mail, ArrowRight, Loader2, Command,
} from "lucide-react";

const ALL_ITEMS = [
  // Pages
  { id: "home",           label: "Home",             desc: "Go to homepage",                href: "/",                  icon: Home,      group: "Pages" },
  { id: "journal",        label: "Journal",          desc: "Browse all entries",            href: "/journal",           icon: BookOpen,  group: "Pages" },
  { id: "write",          label: "New Entry",        desc: "Write a new blog post",         href: "/write",             icon: PenLine,   group: "Pages" },
  { id: "dashboard",      label: "Dashboard",        desc: "Your posts & account",          href: "/dashboard",         icon: Users,     group: "Pages" },
  { id: "authors",        label: "Authors",          desc: "Discover writers on Entry",     href: "/authors",           icon: Users,     group: "Pages" },
  { id: "contact",        label: "Contact",          desc: "Get in touch",                  href: "/contact",           icon: Mail,      group: "Pages" },
  // Tools
  { id: "diary",          label: "Dear Diary",       desc: "Private encrypted journal",     href: "/diary",             icon: BookLock,  group: "Tools" },
  { id: "captions",       label: "Caption Generator",desc: "AI captions for social media",  href: "/caption-generator", icon: Hash,      group: "Tools" },
  { id: "humanizer",      label: "AI Natural Writer",desc: "Make AI text sound human",      href: "/ai-humanizer",      icon: Sparkles,  group: "Tools" },
  { id: "cyber",          label: "Cyber Safety",     desc: "Password checker & generator",  href: "/cyber-safety",      icon: Shield,    group: "Tools" },
  { id: "timer",          label: "Focus Timer",      desc: "Deep work Pomodoro timer",      href: "/focus-timer",       icon: Timer,     group: "Tools" },
  { id: "prompt",         label: "Prompt Optimizer", desc: "Improve your AI prompts",       href: "/prompt-optimizer",  icon: Brain,     group: "Tools" },
  { id: "converter",      label: "Text Converter",   desc: "Transform text formats",        href: "/converter",         icon: Type,      group: "Tools" },
  { id: "salary",         label: "Salary Checker",   desc: "Compare global salaries",       href: "/salary-check",      icon: Zap,       group: "Tools" },
  { id: "tools",          label: "All Tools",        desc: "Browse every Entry tool",       href: "/tools",             icon: Command,   group: "Tools" },
  // Categories
  { id: "technology",     label: "Technology",       desc: "Tech articles & insights",      href: "/technology",        icon: Brain,     group: "Categories" },
  { id: "psychology",     label: "Psychology",       desc: "Mind, behaviour & society",     href: "/psychology",        icon: Brain,     group: "Categories" },
  { id: "mysteries",      label: "Mysteries",        desc: "Unsolved & unexplained",        href: "/mysteries",         icon: Search,    group: "Categories" },
  { id: "biographies",    label: "Biographies",      desc: "Remarkable life stories",       href: "/biographies",       icon: Users,     group: "Categories" },
  { id: "facts",          label: "Facts",            desc: "Fascinating facts",             href: "/facts",             icon: BookOpen,  group: "Categories" },
];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-[var(--accent)]/20 text-[var(--accent)] rounded-sm px-0.5">
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function CommandPalette() {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState("");
  const [active, setActive] = useState(0);
  const inputRef            = useRef(null);
  const listRef             = useRef(null);
  const router              = useRouter();

  // ── Filter items ─────────────────────────────────────────────────────────────
  const filtered = query.trim()
    ? ALL_ITEMS.filter(
        item =>
          item.label.toLowerCase().includes(query.toLowerCase()) ||
          item.desc.toLowerCase().includes(query.toLowerCase()) ||
          item.group.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_ITEMS;

  // ── Keyboard shortcut to open ─────────────────────────────────────────────────
  useEffect(() => {
    function handler(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // ── Reset state on open ───────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ── Keyboard navigation ───────────────────────────────────────────────────────
  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(a => Math.min(a + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(a => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[active]) {
        router.push(filtered[active].href);
        setOpen(false);
      }
    }
  }

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.children[active];
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  // Reset active on query change
  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  // Group filtered results
  const groups = {};
  for (const item of filtered) {
    if (!groups[item.group]) groups[item.group] = [];
    groups[item.group].push(item);
  }

  let globalIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-lg bg-[var(--background)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
          <Search size={16} className="text-[var(--muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, tools, categories..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm text-[var(--foreground)] placeholder:text-[var(--muted)] focus:outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-1 text-[10px] font-bold text-[var(--muted)] border border-[var(--border)] rounded px-1.5 py-0.5">
            ESC
          </kbd>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1 rounded-lg hover:bg-[var(--border)] text-[var(--muted)] transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-4 py-8 text-center text-sm text-[var(--muted)] italic">
              No results for &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(groups).map(([groupName, items]) => (
              <div key={groupName}>
                <div className="px-4 pt-3 pb-1.5 text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">
                  {groupName}
                </div>
                {items.map((item) => {
                  const idx = globalIdx++;
                  const isActive = idx === active;
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      onMouseEnter={() => setActive(idx)}
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                        isActive
                          ? "bg-[var(--accent)]/10"
                          : "hover:bg-[var(--border)]/40"
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${
                        isActive ? "bg-[var(--accent)] text-white" : "bg-[var(--border)] text-[var(--muted)]"
                      }`}>
                        <item.icon size={12} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-[var(--foreground)] truncate">
                          {highlight(item.label, query)}
                        </div>
                        <div className="text-[11px] text-[var(--muted)] truncate">
                          {highlight(item.desc, query)}
                        </div>
                      </div>
                      {isActive && (
                        <ArrowRight size={12} className="text-[var(--accent)] shrink-0" />
                      )}
                    </Link>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-[var(--border)] bg-[var(--card)]/30">
          <div className="flex items-center gap-3 text-[9px] uppercase tracking-widest font-bold text-[var(--muted)]">
            <span className="flex items-center gap-1"><kbd className="border border-[var(--border)] rounded px-1 py-0.5">↑↓</kbd> Navigate</span>
            <span className="flex items-center gap-1"><kbd className="border border-[var(--border)] rounded px-1 py-0.5">↵</kbd> Open</span>
            <span className="flex items-center gap-1"><kbd className="border border-[var(--border)] rounded px-1 py-0.5">ESC</kbd> Close</span>
          </div>
          <span className="text-[9px] text-[var(--muted)] font-bold uppercase tracking-widest">
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
