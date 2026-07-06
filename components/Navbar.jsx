"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { SunMedium, Moon, Flame, Droplets, Leaf, Palette, PenLine, Menu, X, LayoutDashboard, LogIn, BookLock, Wrench, ChevronDown, ChevronRight, Zap, Type, Timer, Brain, Shield, Sparkles, Hash, BookOpen, Search } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();

  useEffect(() => setMounted(true), []);

  // On the homepage: hide navbar over the hero, reveal it once scrolled past
  const isHome = pathname === "/";
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      const hero = document.getElementById("hero");
      const threshold = hero
        ? hero.offsetTop + hero.offsetHeight - 100
        : window.innerHeight * 0.8;
      setPastHero(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const navHidden = isHome && !pastHero && !isMenuOpen;

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

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
    <nav
      className={`bg-[var(--background)]/80 border-b border-[var(--border)] top-0 z-50 backdrop-blur-xl font-playfair ${
        isHome
          ? `fixed left-0 right-0 transition-transform duration-500 ease-out ${
              navHidden ? "-translate-y-full" : "translate-y-0"
            }`
          : "sticky"
      }`}
    >
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
          <div className="hidden md:flex items-center gap-1 lg:gap-2">

            {/* Journal */}
            <Link href="/journal" className="group relative px-3 py-2">
              <span className={`text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname === "/journal" ? "text-[var(--accent)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]"
              }`}>
                Journal
              </span>
              <span className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-[var(--accent)] rounded-full origin-left transition-transform duration-300 ${
                pathname === "/journal" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>

            {/* Diary */}
            <Link href="/diary" className="group relative px-3 py-2">
              <span className={`flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname.startsWith("/diary") ? "text-[var(--accent)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]"
              }`}>
                <BookLock size={13} /> Diary
              </span>
              <span className={`absolute bottom-0.5 left-3 right-3 h-[2px] bg-[var(--accent)] rounded-full origin-left transition-transform duration-300 ${
                pathname.startsWith("/diary") ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>

            {/* Tools dropdown */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                className="group relative px-3 py-2 flex items-center"
              >
                <span className={`flex items-center gap-1.5 text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                  toolsOpen ? "text-[var(--accent)]" : "text-[var(--foreground)] group-hover:text-[var(--accent)]"
                }`}>
                  <Wrench size={13} /> Tools
                  <ChevronDown size={12} className={`transition-transform duration-200 ${toolsOpen ? "rotate-180" : ""}`} />
                </span>
                <span className={`absolute bottom-0.5 left-3 right-6 h-[2px] bg-[var(--accent)] rounded-full origin-left transition-transform duration-300 ${
                  toolsOpen ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full right-0 mt-3 w-[340px] bg-[var(--background)]/95 backdrop-blur-xl border border-[var(--border)] rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* editorial overline header */}
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent)] mb-3 px-1">
                    <span className="h-[1.5px] w-5 bg-[var(--accent)]" />
                    Tools &amp; Utilities
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {TOOLS.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-transparent hover:border-[var(--accent)]/30 hover:bg-[var(--accent)]/5 transition-all group"
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
                  <div className="mt-3 pt-3 border-t border-[var(--border)]">
                    <Link
                      href="/tools"
                      onClick={() => setToolsOpen(false)}
                      className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] hover:gap-2.5 transition-all py-1"
                    >
                      View All Tools <ChevronRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <span className="hidden lg:block w-px h-6 bg-[var(--border)] mx-1" />

            {/* Ctrl+K Command Palette trigger */}
            <button
              onClick={() => {
                const evt = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
                document.dispatchEvent(evt);
              }}
              className="hidden lg:flex items-center gap-2 pl-3 pr-2 py-2 rounded-xl border border-[var(--border)] bg-[var(--card)]/40 text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)]/50 transition-all text-[10px] font-bold uppercase tracking-widest"
              aria-label="Open command palette"
            >
              <Search size={12} />
              <span>Search</span>
              <kbd className="flex items-center gap-0.5 text-[9px] px-1.5 py-0.5 rounded-md bg-[var(--border)]/60 opacity-70">
                <span>⌘</span><span>K</span>
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={cycleTheme}
              className="w-10 h-10 flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]/40 text-[var(--foreground)] hover:text-[var(--accent)] hover:border-[var(--accent)]/50 transition-all"
              aria-label="Toggle Theme"
            >
              {ThemeIcon ? <ThemeIcon size={18} /> : <div className="w-[18px] h-[18px]" />}
            </button>

            {/* Auth-aware section */}
            {status === "loading" ? (
              <div className="w-10 h-10 rounded-full bg-[var(--border)] animate-pulse ml-1" />
            ) : (
              <div className="flex items-center gap-3 ml-1">
                <Link
                  href="/write"
                  className="group/cta relative overflow-hidden flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-5 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300"
                >
                  <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                  <PenLine size={14} />
                  New Entry
                </Link>

                {session?.user ? (
                  <Link href="/dashboard" title="Dashboard" className="relative group">
                    {session.user.image ? (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-xl border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-[var(--accent)] flex items-center justify-center font-bold text-white text-sm border-2 border-[var(--border)] group-hover:border-[var(--accent)] transition-colors">
                        {session.user.name?.[0]?.toUpperCase()}
                      </div>
                    )}
                    <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 text-[10px] text-[var(--muted)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold uppercase tracking-widest">
                      Dashboard
                    </span>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-2 border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)] px-4 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all"
                  >
                    <LogIn size={14} /> Sign In
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="md:hidden relative w-11 h-11 flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card)]/40 text-[var(--foreground)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)] active:scale-95 transition-all"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <>
          {/* Backdrop scrim */}
          <button
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
            className="md:hidden fixed inset-0 top-20 z-30 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
          />

          {/* Sheet */}
          <div className="md:hidden fixed top-20 left-0 right-0 z-40 bg-[var(--background)] border-b border-[var(--border)] rounded-b-3xl shadow-2xl px-5 pt-6 pb-8 animate-in fade-in slide-in-from-top-4 duration-300 overflow-y-auto max-h-[calc(100vh-5rem)]">

            {/* Signed-in chip */}
            {session?.user && (
              <Link
                href="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 mb-5 p-3 rounded-2xl border border-[var(--border)] bg-[var(--card)]/30"
              >
                {session.user.image ? (
                  <Image src={session.user.image} alt={session.user.name || "User"} width={40} height={40} className="rounded-full border border-[var(--border)]" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-white">
                    {session.user.name?.[0]?.toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[var(--foreground)] truncate">{session.user.name}</p>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--accent)] font-bold">View Dashboard</p>
                </div>
                <ChevronRight size={16} className="text-[var(--muted)]" />
              </Link>
            )}

            {/* Primary nav */}
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] font-bold mb-2 ml-1">
              <span className="h-[1.5px] w-5 bg-[var(--accent)]" /> Navigate
            </p>
            <div className="space-y-1.5">
              {[
                { href: "/journal", icon: BookOpen, label: "Journal", active: pathname === "/journal" },
                { href: "/diary", icon: BookLock, label: "Dear Diary", active: pathname.startsWith("/diary") },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                    link.active
                      ? "border-[var(--accent)]/40 bg-[var(--accent)]/10"
                      : "border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/40"
                  }`}
                >
                  <span className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${link.active ? "bg-[var(--accent)] text-white" : "bg-[var(--accent)]/10 text-[var(--accent)]"}`}>
                    <link.icon size={16} />
                  </span>
                  <span className="text-lg font-bold text-[var(--foreground)] flex-1">{link.label}</span>
                  <ChevronRight size={16} className="text-[var(--muted)]" />
                </Link>
              ))}
            </div>

            {/* Tools */}
            <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] font-bold mt-6 mb-2 ml-1">
              <span className="h-[1.5px] w-5 bg-[var(--accent)]" /> Tools
            </p>
            <div className="grid grid-cols-2 gap-2">
              {TOOLS.slice(1).map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="group flex items-center gap-2.5 p-3 rounded-2xl border border-[var(--border)] hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/40 transition-all"
                >
                  <span className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] flex items-center justify-center shrink-0 group-hover:bg-[var(--accent)] group-hover:text-white transition-colors">
                    <tool.icon size={14} />
                  </span>
                  <span className="text-xs font-bold text-[var(--foreground)] leading-tight">{tool.label}</span>
                </Link>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-6 space-y-2.5">
              <Link
                href="/write"
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-[var(--foreground)] text-[var(--background)] py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all"
              >
                <PenLine size={15} /> New Entry
              </Link>
              {!session?.user && (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 border border-[var(--border)] text-[var(--foreground)] py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
                >
                  <LogIn size={15} /> Sign In
                </Link>
              )}
            </div>

            {/* Theme switcher */}
            <button
              onClick={cycleTheme}
              className="w-full flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)] text-[var(--muted)]"
            >
              <span className="text-xs uppercase tracking-widest font-bold">Appearance</span>
              <span className="flex items-center gap-2 text-[var(--foreground)]">
                {ThemeIcon && <ThemeIcon size={18} />}
                <span className="text-xs font-bold capitalize">{mounted ? theme : ""}</span>
              </span>
            </button>
          </div>
        </>
      )}
    </nav>
  );
}
