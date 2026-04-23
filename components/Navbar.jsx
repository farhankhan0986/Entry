"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { SunMedium, Moon, Flame, Droplets, Leaf, Palette, PenLine, Menu, X, LayoutDashboard, LogIn } from "lucide-react";
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
            className="text-3xl font-bold text-[var(--foreground)] tracking-tighter hover:text-[var(--accent)] transition-colors"
          >
            Entry<span className="text-[var(--accent)]">.</span>
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
  <div className="md:hidden fixed top-20 left-0 right-0 bg-[var(--background)] border border-[var(--border)] z-40 px-6 py-12 animate-in fade-in slide-in-from-top-4 duration-300">
    <div className="flex flex-col space-y-8 text-center">
      <Link
        href="/journal"
        onClick={() => setIsMenuOpen(false)}
        className="text-2xl font-bold text-[var(--foreground)]"
      >
        Journal
      </Link>

      <Link
        href="/write"
        onClick={() => setIsMenuOpen(false)}
        className="text-2xl font-bold text-[var(--accent)]"
      >
        New Entry
      </Link>

      {session?.user ? (
        <Link
          href="/dashboard"
          onClick={() => setIsMenuOpen(false)}
          className="text-2xl font-bold text-[var(--foreground)] flex items-center justify-center gap-3"
        >
          <LayoutDashboard size={20} /> Dashboard
        </Link>
      ) : (
        <Link
          href="/login"
          onClick={() => setIsMenuOpen(false)}
          className="text-2xl font-bold text-[var(--foreground)] flex items-center justify-center gap-3"
        >
          <LogIn size={20} /> Sign In
        </Link>
      )}

      <div className="pt-8 flex justify-center">
        <button
          onClick={() => {
            cycleTheme();
            setIsMenuOpen(false);
          }}
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
