"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookLock, Hash, Sparkles, Shield, Timer, ArrowRight, Star,
} from "lucide-react";

/* ── The tools, written like a person wrote them ─────────── */

const TOOLS = [
  {
    id: "diary",
    no: "01",
    label: "Dear Diary",
    desc: "Some pages aren't meant for readers. This is where they go — locked, encrypted, entirely yours. Track your moods, keep a streak going, come back on the heavy days.",
    href: "/diary",
    icon: BookLock,
    tag: "private, always",
    note: "Only you hold the key",
    size: "large",
  },
  {
    id: "captions",
    no: "02",
    label: "Caption Generator",
    desc: "Staring at a finished photo with nothing to say? Borrow a line. Tuned for Instagram, X, LinkedIn — wherever you speak.",
    href: "/caption-generator",
    icon: Hash,
    tag: "well-loved",
    note: "Five platforms, one box",
  },
  {
    id: "humanizer",
    no: "03",
    label: "AI Natural Writer",
    desc: "For when the draft sounds like a machine wrote it — because one did. Give it back its pulse, in eight different voices.",
    href: "/ai-humanizer",
    icon: Sparkles,
    tag: "for drafts",
    note: "Eight rewrite voices",
  },
  {
    id: "cyber",
    no: "04",
    label: "Cyber Safety",
    desc: "Find out how strong your passwords really are — right here in your browser. Nothing ever leaves your device. A little paranoia, well spent.",
    href: "/cyber-safety",
    icon: Shield,
    tag: "stays offline",
    note: "Runs entirely in-browser",
  },
  {
    id: "focus",
    no: "05",
    label: "Focus Timer",
    desc: "Twenty-five quiet minutes at a time, with soft soundscapes. For the days the writing simply won't come out on its own.",
    href: "/focus-timer",
    icon: Timer,
    tag: "deep work",
    note: "The pomodoro method",
  },
];

const EASE = [0.22, 1, 0.36, 1];

/* ── Hand-drawn locked diary sketch (for the large card) ─── */

function DiarySketch({ className }) {
  return (
    <svg
      viewBox="0 0 140 130"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {/* book cover */}
      <path
        d="M28 22 C 27 18, 30 14, 35 14 L 100 12 C 106 12, 110 16, 110 22 L 112 100 C 112 106, 108 110, 102 110 L 38 112 C 32 112, 28 108, 28 102 Z"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* spine stitching */}
      <path
        d="M40 15 L 42 111 M47 30 L 51 30 M47 48 L 51 48 M47 66 L 51 66 M47 84 L 51 84"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* clasp strap */}
      <path
        d="M110 52 C 120 52, 122 60, 116 64 L 96 66"
        stroke="var(--accent)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* padlock body */}
      <rect
        x="82"
        y="58"
        width="20"
        height="17"
        rx="4"
        stroke="var(--foreground)"
        strokeWidth="2.2"
      />
      {/* padlock shackle */}
      <path
        d="M86 58 L 86 52 C 86 46, 98 46, 98 52 L 98 58"
        stroke="var(--foreground)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      {/* keyhole */}
      <circle cx="92" cy="65" r="2" fill="var(--foreground)" />
      {/* little heart on cover */}
      <path
        d="M64 36 C 61 32, 55 33, 55 38 C 55 42, 60 45, 64 48 C 68 45, 73 42, 73 38 C 73 33, 67 32, 64 36 Z"
        stroke="var(--accent)"
        strokeWidth="1.6"
        opacity="0.6"
      />
      {/* sparkle */}
      <path
        d="M120 24 L 122 18 L 124 24 L 130 26 L 124 28 L 122 34 L 120 28 L 114 26 Z"
        fill="var(--accent)"
        opacity="0.7"
      />
    </svg>
  );
}

/* ── Ink underline that draws on hover ───────────────────── */

function InkUnderline() {
  return (
    <svg
      className="absolute -bottom-1.5 left-0 w-full overflow-visible scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out"
      viewBox="0 0 200 8"
      fill="none"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M2 5 C 50 1, 110 2, 145 4 S 190 7, 198 3"
        stroke="var(--accent)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
    </svg>
  );
}

/* ── Postage-stamp icon frame ────────────────────────────── */

function Stamp({ icon: Icon, large = false }) {
  return (
    <div
      className={`inline-flex items-center justify-center border-[1.5px] border-dashed border-[var(--accent)]/60 rounded-xl bg-[var(--accent)]/8 text-[var(--accent)] -rotate-3 group-hover:rotate-2 group-hover:scale-105 transition-transform duration-500 ${
        large ? "p-4" : "p-3"
      }`}
    >
      <Icon size={large ? 24 : 18} strokeWidth={2} />
    </div>
  );
}

/* ── Card entrance animation ─────────────────────────────── */

const cardMotion = (i) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.7, delay: i * 0.08, ease: EASE },
});

/* ── Section ─────────────────────────────────────────────── */

export default function ToolSpotlightGrid() {
  const large = TOOLS.find((t) => t.size === "large");
  const small = TOOLS.filter((t) => t.size !== "large");

  return (
    <section className="container mx-auto px-6 py-16">
      {/* Section header — editorial, matches the hero */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div>
          <div className="flex items-center gap-3 text-[var(--accent)] font-bold tracking-[0.35em] uppercase text-[10px] mb-4">
            <span className="h-[1.5px] w-8 bg-[var(--accent)]" />
            <Star size={11} fill="currentColor" />
            <span>Our Little Instruments</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--foreground)] tracking-tight">
            From the writer&apos;s desk<span className="text-[var(--accent)]">.</span>
          </h2>
          <p className="text-[var(--muted)] mt-3 italic text-lg max-w-xl leading-relaxed">
            Tools we built for ourselves while making Entry — then decided to
            leave on the desk for you. Free, quiet, no sign-up walls.
          </p>
        </div>
        <Link
          href="/tools"
          className="hidden md:flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--accent)] hover:gap-4 transition-all shrink-0 pb-1 border-b-2 border-[var(--accent)]/40 hover:border-[var(--accent)]"
        >
          Browse the full drawer <ArrowRight size={14} />
        </Link>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Large card — Dear Diary */}
        <motion.div {...cardMotion(0)} className="md:col-span-2">
          <Link
            href={large.href}
            className="group relative flex h-full rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-8 md:p-10 overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-xl hover:-translate-y-1"
          >
            {/* ghost index number */}
            <span className="absolute -top-6 right-4 font-playfair text-[9rem] leading-none font-bold text-[var(--foreground)]/[0.045] select-none pointer-events-none">
              {large.no}
            </span>
            {/* soft accent glow */}
            <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full blur-3xl bg-[var(--accent)]/6 group-hover:bg-[var(--accent)]/12 transition-all duration-700 -ml-20 -mb-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8 w-full">
              <div className="flex-1">
                <Stamp icon={large.icon} large />
                <h3 className="relative inline-block text-3xl font-bold text-[var(--foreground)] mt-6 mb-4">
                  {large.label}
                  <InkUnderline />
                </h3>
                <p className="text-[var(--muted)] leading-relaxed italic max-w-md mb-6">
                  {large.desc}
                </p>
                <div className="flex items-center justify-between max-w-md">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--accent)]">
                    {large.note}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--foreground)] group-hover:text-[var(--accent)] group-hover:gap-3 transition-all duration-300">
                    Step inside{" "}
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </div>

              {/* hand-drawn locked diary */}
              <DiarySketch
                className="hidden md:block w-36 lg:w-44 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>
          </Link>
        </motion.div>

        {/* Small cards */}
        {small.map((tool, i) => (
          <motion.div {...cardMotion(i + 1)} key={tool.id}>
            <Link
              href={tool.href}
              className="group relative flex flex-col h-full rounded-3xl border border-[var(--border)] bg-[var(--card)]/40 p-7 overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/50 hover:shadow-xl hover:-translate-y-1"
            >
              {/* ghost index number */}
              <span className="absolute -top-4 right-3 font-playfair text-[6.5rem] leading-none font-bold text-[var(--foreground)]/[0.045] select-none pointer-events-none">
                {tool.no}
              </span>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-5">
                  <Stamp icon={tool.icon} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--accent)] border border-[var(--accent)]/30 bg-[var(--accent)]/5 px-2.5 py-1 rounded-full mt-1">
                    {tool.tag}
                  </span>
                </div>

                <h3 className="relative inline-block self-start text-lg font-bold text-[var(--foreground)] mb-2.5">
                  {tool.label}
                  <InkUnderline />
                </h3>
                <p className="text-sm text-[var(--muted)] leading-relaxed italic flex-1">
                  {tool.desc}
                </p>

                <div className="flex items-center justify-between mt-5 pt-4 border-t border-dashed border-[var(--border)]">
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">
                    {tool.note}
                  </span>
                  <ArrowRight
                    size={13}
                    className="text-[var(--accent)] transition-transform duration-300 group-hover:translate-x-1.5"
                  />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Mobile "All Tools" CTA */}
      <div className="mt-8 flex md:hidden justify-center">
        <Link
          href="/tools"
          className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[var(--accent)] pb-1 border-b-2 border-[var(--accent)]/40"
        >
          Browse the full drawer <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}
