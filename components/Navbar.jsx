"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { SunMedium, Moon, PenLine, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="bg-[var(--background)]/80 border-b border-[var(--border)] sticky top-0 z-50 backdrop-blur-xl font-playfair">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo - Elegant Serif */}
          <Link
            href="/"
            className="text-3xl font-bold text-[var(--foreground)] tracking-tighter hover:text-[var(--accent)] transition-colors"
          >
            Entry<span className="text-[var(--accent)]">.</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/journal"
              className={`text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname === "/journal" ? "text-[var(--accent)]" : "text-[var(--foreground)] hover:text-[var(--accent)]"
              }`}
            >
              Journal
            </Link>

            {/* <Link
              href="/entries"
              className={`text-sm uppercase tracking-[0.2em] font-bold transition-colors ${
                pathname === "/entries" ? "text-[var(--accent)]" : "text-[var(--foreground)] hover:text-[var(--accent)]"
              }`}
            >
              Archives
            </Link> */}

            {/* Theme Toggle - Minimalist */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 text-[var(--foreground)] hover:text-[var(--accent)] transition-all"
              aria-label="Toggle Theme"
            >
              {mounted ? (
                theme === "dark" ? <SunMedium size={20} /> : <Moon size={20} />
              ) : <div className="w-5 h-5" />}
            </button>

            {/* CTA Button - Journal Style */}
            <Link
              href="/write"
              className="bg-[var(--foreground)] rounded hover:bg-[var(--accent)] font-bold text-[var(--background)] hover:text-[var(--foreground)] flex items-center gap-2 px-6 py-2.5 uppercase duration-300 transition-colors"
            >
              <PenLine size={14} />
              New Entry
            </Link>
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

      {/* Mobile Menu - Full Screen Overlay Style */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-20 bg-[var(--background)] border border-[var(--border)] h-[calc(100vh-70vh)] z-40 px-6 py-12 animate-in fade-in slide-in-from-top-4 duration-300">
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
          
            <div className="pt-8 flex justify-center">
              <button
                onClick={() => {
                  setTheme(theme === "dark" ? "light" : "dark");
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 text-lg font-bold text-[var(--muted)]"
              >
                {theme === "dark" ? <SunMedium /> : <Moon />}
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}