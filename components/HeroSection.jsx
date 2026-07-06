"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useInView,
  animate,
} from "framer-motion";
import { ArrowRight, Star, PenLine } from "lucide-react";

/* ── Config ──────────────────────────────────────────────── */

const FLIP_WORDS = ["thoughts", "stories", "emotions", "questions", "memories"];

const CATEGORIES = [
  "Technology",
  "Psychology",
  "Mysteries",
  "Biographies",
  "Science",
  "Culture",
  "Philosophy",
  "World Affairs",
];

const EASE = [0.22, 1, 0.36, 1];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11, delayChildren: 0.15 } },
};

const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

/* ── Flip words (rotating word with blur transition) ─────── */

function FlipWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % FLIP_WORDS.length),
      2600
    );
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block align-baseline">
      <AnimatePresence mode="wait">
        <motion.span
          key={FLIP_WORDS[index]}
          initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -18, filter: "blur(8px)" }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="inline-block italic text-[var(--accent)]"
        >
          {FLIP_WORDS[index]}
        </motion.span>
      </AnimatePresence>
      {/* hand-drawn underline that redraws with each word */}
      <svg
        className="absolute -bottom-2 left-0 w-full overflow-visible"
        viewBox="0 0 200 10"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          key={index}
          d="M3 7 C 45 2, 90 3, 125 5.5 S 185 8.5, 197 4"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{ pathLength: 1, opacity: 0.9 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
        />
      </svg>
    </span>
  );
}

/* ── Animated counter ────────────────────────────────────── */

function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>{display}</span>;
}

/* ── Decorative illustrations (hand-drawn ink style) ─────── */

const draw = (delay = 0, duration = 1.6) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration, delay, ease: "easeInOut" },
});

/* A quill writing a flowing line of ink */
function QuillSketch({ className, style }) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <svg viewBox="0 0 140 130" fill="none" className="w-full h-full overflow-visible">
        {/* feather body */}
        <motion.path
          d="M118 8 C 96 14, 70 36, 56 72 L 51 86 L 63 80 C 96 64, 114 36, 118 8 Z"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          {...draw(0.6, 1.8)}
        />
        {/* feather spine */}
        <motion.path
          d="M56 72 C 76 44, 98 24, 118 8"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
          {...draw(1.2, 1.2)}
        />
        {/* feather barbs */}
        <motion.path
          d="M72 52 C 80 50, 88 44, 94 36 M64 64 C 74 61, 84 54, 91 45"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
          {...draw(1.6, 1)}
        />
        {/* nib tip */}
        <motion.path
          d="M51 86 L 44 98"
          stroke="var(--foreground)"
          strokeWidth="2.5"
          strokeLinecap="round"
          {...draw(2, 0.4)}
        />
        {/* ink line being written — loops forever */}
        <motion.path
          d="M10 116 q 12 -10 24 0 t 24 0 t 24 0 t 24 0"
          stroke="var(--muted)"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0] }}
          transition={{
            duration: 4,
            delay: 2.4,
            times: [0, 0.6, 1],
            repeat: Infinity,
            repeatDelay: 0.8,
            ease: "easeInOut",
          }}
        />
      </svg>
    </div>
  );
}

/* An open book with rising sparkle */
function BookSketch({ className, style }) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <svg viewBox="0 0 130 110" fill="none" className="w-full h-full overflow-visible">
        {/* covers */}
        <motion.path
          d="M8 32 C 24 22, 46 22, 63 32 C 80 22, 102 22, 118 32 L 118 88 C 102 78, 80 78, 63 88 C 46 78, 24 78, 8 88 Z"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          {...draw(0.9, 2)}
        />
        {/* spine */}
        <motion.path
          d="M63 32 L 63 88"
          stroke="var(--accent)"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.6"
          {...draw(1.8, 0.8)}
        />
        {/* text lines, left page */}
        <motion.path
          d="M20 42 C 32 37, 44 37, 54 41 M20 54 C 32 49, 44 49, 54 53 M20 66 C 30 62, 40 61, 48 64"
          stroke="var(--muted)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
          {...draw(2.2, 1.4)}
        />
        {/* text lines, right page */}
        <motion.path
          d="M72 41 C 82 37, 94 37, 106 42 M72 53 C 82 49, 94 49, 106 54 M72 64 C 80 61, 90 62, 98 65"
          stroke="var(--muted)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.55"
          {...draw(2.5, 1.4)}
        />
        {/* sparkle drifting out of the pages */}
        <motion.path
          d="M63 20 L 65 14 L 67 20 L 73 22 L 67 24 L 65 30 L 63 24 L 57 22 Z"
          fill="var(--accent)"
          initial={{ opacity: 0, y: 8, scale: 0.6 }}
          animate={{ opacity: [0, 0.9, 0], y: [8, -14, -26], scale: [0.6, 1, 0.7] }}
          transition={{ duration: 3.2, delay: 2.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}

/* A thought bubble with pulsing dots */
function ThoughtSketch({ className, style }) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <svg viewBox="0 0 120 110" fill="none" className="w-full h-full overflow-visible">
        {/* cloud */}
        <motion.path
          d="M34 52 C 24 52, 16 44, 18 34 C 20 25, 29 20, 38 22 C 41 12, 52 6, 63 9 C 73 11, 80 19, 80 28 C 90 27, 99 33, 100 42 C 101 52, 92 59, 82 58 C 78 64, 70 68, 61 66 C 54 72, 42 71, 37 64 C 35 60, 34 56, 34 52 Z"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          {...draw(1.1, 2)}
        />
        {/* trailing dots */}
        {[
          { cx: 36, cy: 80, r: 5, d: 0 },
          { cx: 26, cy: 92, r: 3.5, d: 0.3 },
          { cx: 18, cy: 101, r: 2.2, d: 0.6 },
        ].map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            stroke="var(--accent)"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0.3, 0.9, 0.3], scale: 1 }}
            transition={{
              scale: { duration: 0.4, delay: 2.6 + dot.d },
              opacity: { duration: 2.4, delay: 2.6 + dot.d, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
        {/* little idea star inside */}
        <motion.path
          d="M56 32 L 59 24 L 62 32 L 70 35 L 62 38 L 59 46 L 56 38 L 48 35 Z"
          fill="var(--accent)"
          initial={{ opacity: 0, scale: 0, rotate: -40 }}
          animate={{ opacity: 0.9, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 3, type: "spring", stiffness: 180, damping: 10 }}
          style={{ transformOrigin: "59px 35px" }}
        />
      </svg>
    </div>
  );
}

/* A paper plane with a dashed flight trail */
function PlaneSketch({ className, style }) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <svg viewBox="0 0 170 100" fill="none" className="w-full h-full overflow-visible">
        {/* dashed trail */}
        <motion.path
          d="M6 88 C 40 92, 60 70, 74 52 C 86 38, 102 28, 122 24"
          stroke="var(--muted)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="5 7"
          opacity="0.55"
          {...draw(1.4, 2.2)}
        />
        {/* plane */}
        <motion.g
          initial={{ opacity: 0, x: -14, y: 10, rotate: -6 }}
          animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
          transition={{ duration: 1, delay: 2.6, ease: EASE }}
        >
          <path
            d="M128 22 L 162 8 L 148 42 L 138 30 Z M138 30 L 136 40 L 141 33"
            stroke="var(--accent)"
            strokeWidth="2.2"
            strokeLinejoin="round"
            fill="color-mix(in srgb, var(--accent) 12%, transparent)"
          />
        </motion.g>
      </svg>
    </div>
  );
}

/* Tiny four-point sparkle */
function Spark({ className, style, size = 16, delay = 0 }) {
  return (
    <motion.svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="var(--accent)"
      className={className}
      style={style}
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: [0.25, 0.85, 0.25], scale: [0.8, 1.1, 0.8], rotate: [0, 20, 0] }}
      transition={{ duration: 3.4, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <path d="M12 1 L 14.2 9.8 L 23 12 L 14.2 14.2 L 12 23 L 9.8 14.2 L 1 12 L 9.8 9.8 Z" />
    </motion.svg>
  );
}

/* ── Hero ────────────────────────────────────────────────── */

export default function HeroSection({ blogCount }) {
  return (
    <section id="hero" className="relative top-1 w-full overflow-hidden">
      {/* ── Ambient background layers ── */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        {/* dotted paper grid, faded at edges */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(var(--border) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 50% 45%, black 25%, transparent 75%)",
          }}
        />
        {/* drifting ink blots */}
        <div
          className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full blur-3xl bg-[var(--accent)]/10"
          style={{ animation: "hero-blob 18s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-3xl bg-[var(--accent)]/8"
          style={{ animation: "hero-blob 22s ease-in-out infinite reverse" }}
        />
        {/* giant ghost quotation marks framing the composition */}
        <div
          className="absolute top-[4%] left-[3%] font-playfair text-[16rem] leading-none text-[var(--accent)]/6 select-none hidden xl:block"
          style={{ animation: "ink-pulse 9s ease-in-out infinite" }}
        >
          &ldquo;
        </div>
        <div
          className="absolute bottom-[6%] right-[3%] font-playfair text-[16rem] leading-none text-[var(--accent)]/6 select-none hidden xl:block"
          style={{ animation: "ink-pulse 9s ease-in-out infinite", animationDelay: "4.5s" }}
        >
          &rdquo;
        </div>
        {/* film grain */}
        <div
          className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Floating story illustrations ── */}
      <QuillSketch
        className="absolute left-[5%] top-[24%] w-32 md:w-40 hidden md:block opacity-90"
        style={{ animation: "float-slow 7s ease-in-out infinite" }}
      />
      <BookSketch
        className="absolute right-[5%] bottom-[22%] w-32 md:w-40 hidden md:block opacity-90"
        style={{ animation: "float-slow 8s ease-in-out infinite", animationDelay: "1.5s" }}
      />
      <ThoughtSketch
        className="absolute right-[9%] top-[14%] w-24 md:w-28 hidden md:block opacity-90"
        style={{ animation: "float-slow 6.5s ease-in-out infinite", animationDelay: "0.8s" }}
      />
      <PlaneSketch
        className="absolute left-[7%] bottom-[18%] w-36 md:w-44 hidden md:block opacity-90"
        style={{ animation: "float-slow 9s ease-in-out infinite", animationDelay: "2.2s" }}
      />
      <Spark className="absolute left-[22%] top-[16%] hidden lg:block" delay={1.8} size={14} />
      <Spark className="absolute right-[24%] top-[30%] hidden lg:block" delay={2.6} size={18} />
      <Spark className="absolute left-[28%] bottom-[20%] hidden lg:block" delay={3.4} size={12} />
      <Spark className="absolute right-[18%] bottom-[34%] hidden lg:block" delay={1.2} size={15} />

      {/* ── Main hero content (centered) ── */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative w-full min-h-[calc(100vh-3.5rem)] flex flex-col items-center justify-center text-center container mx-auto px-6 py-16"
      >
        {/* overline */}
        <motion.div
          variants={item}
          className="flex items-center gap-3 text-[var(--accent)] font-bold tracking-[0.35em] uppercase text-xs mb-7"
        >
          <span className="h-[1.5px] w-8 bg-[var(--accent)]" />
          <Star size={13} fill="currentColor" />
          <span>Journal Edition 2026</span>
          <Star size={13} fill="currentColor" />
          <span className="h-[1.5px] w-8 bg-[var(--accent)]" />
        </motion.div>

        {/* brand headline */}
        <motion.h1
          variants={item}
          className="group text-7xl md:text-9xl font-bold text-[var(--foreground)] tracking-tight leading-[0.85]"
        >
          Entry
          <motion.span
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 220,
              damping: 11,
              delay: 0.85,
            }}
            className="text-[var(--accent)] inline-block group-hover:-translate-y-3 transition-transform duration-500"
          >
            .
          </motion.span>
        </motion.h1>

        {/* flip-word statement */}
        <motion.h2
          variants={item}
          className="mt-8 text-2xl md:text-4xl text-[var(--foreground)] font-medium leading-snug"
        >
          Where <FlipWord /> find their words.
        </motion.h2>

        {/* quote */}
        <motion.p
          variants={item}
          className="mt-6 text-base md:text-lg text-[var(--muted)] leading-relaxed italic opacity-80 max-w-xl"
        >
          &ldquo;Emotions meet understanding, and every story feels a little
          less alone.&rdquo;
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/journal"
            className="group/cta relative flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-9 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
          >
            {/* shine sweep */}
            <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            Start Reading
            <ArrowRight
              size={15}
              className="group-hover/cta:translate-x-1.5 transition-transform"
            />
          </Link>
          <Link
            href="/write"
            className="flex items-center gap-2 px-9 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all duration-300 hover:scale-[1.03] bg-[var(--card)]/40 backdrop-blur-sm"
          >
            <PenLine size={15} />
            Write Yours
          </Link>
        </motion.div>

        {/* stats strip */}
        <motion.div
          variants={item}
          className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0 sm:divide-x divide-[var(--border)]"
        >
          <div className="px-10 text-center">
            <div className="flex items-center justify-center gap-2 text-[var(--accent)] font-bold tracking-[0.25em] uppercase text-[10px] mb-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]" />
              </span>
              Live Archive
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)] tracking-tight tabular-nums">
              <Counter value={blogCount} />
              <span className="text-[var(--muted)] font-playfair italic font-medium text-lg ml-2">
                Entries
              </span>
            </div>
          </div>
          <div className="px-10 text-center">
            <div className="text-[var(--muted)] font-bold tracking-[0.25em] uppercase text-[10px] mb-1.5">
              Voices
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)] tracking-tight tabular-nums">
              2.3k
              <span className="text-[var(--muted)] font-playfair italic font-medium text-lg ml-2">
                Reflections
              </span>
            </div>
          </div>
          <div className="px-10 text-center">
            <div className="text-[var(--muted)] font-bold tracking-[0.25em] uppercase text-[10px] mb-1.5">
              Worlds to explore
            </div>
            <div className="text-3xl font-bold text-[var(--foreground)] tracking-tight tabular-nums">
              {CATEGORIES.length}+
              <span className="text-[var(--muted)] font-playfair italic font-medium text-lg ml-2">
                Categories
              </span>
            </div>
          </div>
        </motion.div>

        {/* scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
        >
          <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-[var(--muted)]">
            Scroll
          </span>
          <motion.span
            animate={{ y: [0, 8, 0], opacity: [0.9, 0.3, 0.9] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="block w-[1.5px] h-8 bg-gradient-to-b from-[var(--accent)] to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* ── Category marquee ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.8 }}
        className="relative border-y border-[var(--border)] bg-[var(--card)]/30 backdrop-blur-sm overflow-hidden"
      >
        {/* edge fades */}
        <div className="absolute inset-y-0 left-0 w-24 z-10 bg-gradient-to-r from-[var(--background)] to-transparent pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 z-10 bg-gradient-to-l from-[var(--background)] to-transparent pointer-events-none" />

        <div
          className="flex w-max py-4 hover:[animation-play-state:paused]"
          style={{ animation: "marquee 30s linear infinite" }}
        >
          {[...CATEGORIES, ...CATEGORIES].map((cat, i) => (
            <span
              key={`${cat}-${i}`}
              className="flex items-center gap-6 mx-6 text-xs font-bold uppercase tracking-[0.3em] text-[var(--muted)] whitespace-nowrap"
            >
              {cat}
              <span className="text-[var(--accent)] text-base leading-none">
                ✦
              </span>
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
