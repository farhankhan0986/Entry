"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { SunMedium, Moon, Flame, Droplets, Leaf, Palette, PenLine, Menu, X, LayoutDashboard, LogIn, BookLock, Wrench, ChevronDown, Zap, Type, Timer, Brain, Shield, Sparkles, Hash } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => setMounted(true), []);

  const themes = ["light", "dark", "red", "blue", "green", "purple"];
  function cycleTheme() {
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  }

  const [toolsOpen, setToolsOpen] = useState(false);
  const toolsRef = useRef(null);

  // Close tools dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (toolsRef.current && !toolsRef.current.contains(e.target)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const TOOLS = [
    { href: "/diary", icon: BookLock, label: "Dear Diary", desc: "Private encrypted journal" },
    { href: "/caption-generator", icon: Hash, label: "Caption Generator", desc: "AI captions for social" },
    { href: "/ai-humanizer", icon: Sparkles, label: "AI Natural Writer", desc: "Make AI text feel human" },
    { href: "/cyber-safety", icon: Shield, label: "Cyber Safety", desc: "Password & security tools" },
    { href: "/focus-timer", icon: Timer, label: "Focus Timer", desc: "Deep work sessions" },
    { href: "/prompt-optimizer", icon: Brain, label: "Prompt Optimizer", desc: "Better AI prompts" },
    { href: "/converter", icon: Type, label: "Text Converter", desc: "Transform text formats" },
    { href: "/salary-check", icon: Zap, label: "Salary Checker", desc: "Compare salaries" },
  ];

  const ThemeIcon = mounted
    ? theme === "light" ? SunMedium
    : theme === "dark" ? Moon
    : theme === "red" ? Flame
    : theme === "blue" ? Droplets
    : theme === "green" ? Leaf
    : Palette
    : null;

  return (
    <nav className="bg-[var(--background)]/80 border-b border-[var(--border)] sticky top-0 z-50 backdrop-blur-xl font-playfair">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
         <Link
  href="/"
  className="group text-3xl font-bold text-[var(--foreground)] tracking-tighter hover:text-[var(--accent)] transition-colors"
>
  Entry
  <span className="text-[var(--accent)] inline-block transition-transform duration-500 group-hover:-translate-y-1">
  .
</span>
</Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/journal"
              className={`text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname === "/journal" ? "text-[var(--accent)]" : "text-[var(--foreground)] hover:text-[var(--accent)]"
              }`}
            >
              Journal
            </Link>

            {/* Diary link */}
            <Link
              href="/diary"
              className={`flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname.startsWith("/diary") ? "text-[var(--accent)]" : "text-[var(--foreground)] hover:text-[var(--accent)]"
              }`}
            >
              <BookLock size={13} />
              Diary
            </Link>

            {/* Tools dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className={`flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                  toolsOpen ? "text-[var(--accent)]" : "text-[var(--foreground)] hover:text-[var(--accent)]"
                }`}
              >
                <Wrench size={13} />
                Tools
                <ChevronDown size={12} className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[320px] bg-[var(--background)]/95 backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="grid grid-cols-2 gap-1.5">
                    {TOOLS.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl hover:bg-[var(--accent)]/10 transition-colors group"
                      >
                        <div className="mt-0.5 p-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-colors shrink-0">
                          <tool.icon size={12} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[var(--foreground)] truncate">{tool.label}</div>
                          <div className="text-[10px] text-[var(--muted)] truncate">{tool.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-2 pt-2 border-t border-[var(--border)]">
                    <Link
                      href="/tools"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] hover:opacity-80 py-1"
                    >
                      View All Tools →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Ctrl+K Command Palette trigger */}
            <button
              onClick={() => {
                const evt = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
                document.dispatchEvent(evt);
              }}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/50 transition-all text-[10px] font-bold uppercase tracking-widest"
              aria-label="Open command palette"
            >
              <span>Search</span>
              <kbd className="flex items-center gap-0.5 opacity-60">
                <span>⌘</span><span>K</span>
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="p-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-all"
              aria-label="Toggle Theme"
            >
              {ThemeIcon ? <ThemeIcon size={20} /> : <div className="w-5 h-5" />}
            </button>

            {/* Auth-aware section */}
            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-[var(--border)] animate-pulse" />
            ) : session?.user ? (
              /* Signed in: avatar → dashboard */
              <div className="flex items-center gap-3">
                <Link
                  href="/write"
                  className="bg-[var(--foreground)] rounded hover:bg-[var(--accent)] font-bold text-[var(--background)] hover:text-[var(--foreground)] flex items-center gap-2 px-6 py-2.5 uppercase duration-300 transition-colors text-sm tracking-widest"
                >
                  <PenLine size={14} />
                  New Entry
                </Link>
                <Link
                  href="/dashboard"
                  title="Dashboard"
                  className="relative group"
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      width={38}
                      height={38}
                      className="rounded-full border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors"
                    />
                  ) : (
                    <div className="w-[38px] h-[38px] rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-white text-sm border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors">
                      {session.user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold uppercase tracking-widest">
                    Dashboard
                  </span>
                </Link>
              </div>
            ) : (
              /* Not signed in */
              <div className="flex items-center gap-3">
                <Link
                  href="/write"
                  className="bg-[var(--foreground)] rounded hover:bg-[var(--accent)] font-bold text-[var(--background)] hover:text-[var(--foreground)] flex items-center gap-2 px-6 py-2.5 uppercase duration-300 transition-colors text-sm tracking-widest"
                >
                  <PenLine size={14} />
                  New Entry
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-4 py-2.5 rounded font-bold text-sm uppercase tracking-widest transition-all"
                >
                  <LogIn size={14} /> Sign In
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[var(--foreground)]"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
  <div className="md:hidden fixed top-20 left-0 right-0 bg-[var(--background)] border border-[var(--border)] z-40 px-6 py-12 animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto max-h-[80vh]">
    <div className="flex flex-col space-y-6 text-center">
      <Link href="/journal" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-[var(--foreground)]">
        Journal
      </Link>
      <Link href="/diary" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-[var(--foreground)] flex items-center justify-center gap-2">
        <BookLock size={20} /> Dear Diary
      </Link>
      <div className="border-t border-[var(--border)] pt-4">
        <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-4">Tools</p>
        <div className="grid grid-cols-2 gap-2">
          {TOOLS.slice(1).map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 p-3 rounded-xl border border-[var(--border)] text-left hover:border-[var(--accent)]/40 transition-colors"
            >
              <tool.icon size={14} className="text-[var(--accent)] shrink-0" />
              <span className="text-xs font-bold text-[var(--foreground)]">{tool.label}</span>
            </Link>
          ))}
        </div>
      </div>
      <Link href="/write" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-[var(--accent)]">
        New Entry
      </Link>
      {session?.user ? (
        <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-[var(--foreground)] flex items-center justify-center gap-3">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
      ) : (
        <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-2xl font-bold text-[var(--foreground)] flex items-center justify-center gap-3">
          <LogIn size={20} /> Sign In
        </Link>
      )}
      <div className="pt-4 flex justify-center">
        <button
          onClick={() => { cycleTheme(); setIsMenuOpen(false); }}
          className="flex items-center gap-3 text-lg font-bold text-[var(--muted)]"
        >
          {ThemeIcon && <ThemeIcon />}
          Switch Theme
        </button>
      </div>
    </div>
  </div>
)}
    </nav>
  );
}
