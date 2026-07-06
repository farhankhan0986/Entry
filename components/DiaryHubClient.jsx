"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PenLine, Search, Lock, Trash2, Edit2, Filter, X, Star } from "lucide-react";
import DiaryStatsBar from "@/components/DiaryStatsBar";
import DiaryCalendar from "@/components/DiaryCalendar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const MOOD_EMOJI = {
  happy: "😊", calm: "😌", anxious: "😰",
  sad: "😢", excited: "🤩", neutral: "😐",
};

const MOOD_COLORS = {
  happy:   "bg-amber-400/10 border-amber-400/30 text-amber-600",
  calm:    "bg-blue-400/10 border-blue-400/30 text-blue-500",
  anxious: "bg-purple-400/10 border-purple-400/30 text-purple-500",
  sad:     "bg-slate-400/10 border-slate-400/30 text-slate-500",
  excited: "bg-green-400/10 border-green-400/30 text-green-500",
  neutral: "bg-gray-400/10 border-gray-400/30 text-gray-500",
};

const EASE = [0.22, 1, 0.36, 1];

function getExcerpt(content = "", len = 140) {
  const plain = content.replace(/[#*_`>\-]/g, "").trim();
  return plain.length > len ? plain.slice(0, len) + "…" : plain;
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "long", day: "numeric",
  });
}

/* ── Hand-drawn locked journal with a quill ──────────────── */
function JournalSketch({ className, style }) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <svg viewBox="0 0 150 140" fill="none" className="w-full h-full overflow-visible">
        {/* book cover */}
        <path
          d="M30 24 C 29 19, 33 15, 39 15 L 108 13 C 115 13, 119 18, 119 24 L 121 108 C 121 114, 117 118, 110 118 L 41 120 C 34 120, 30 116, 30 110 Z"
          stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round"
        />
        {/* spine binding rings */}
        <path
          d="M43 16 L 45 119 M49 32 L 53 32 M49 52 L 53 52 M49 72 L 53 72 M49 92 L 53 92"
          stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"
        />
        {/* clasp strap */}
        <path
          d="M119 58 C 130 58, 132 68, 125 72 L 103 74"
          stroke="var(--accent)" strokeWidth="2.2" strokeLinecap="round"
        />
        {/* padlock */}
        <rect x="88" y="64" width="22" height="18" rx="4" stroke="var(--foreground)" strokeWidth="2.2" />
        <path d="M92 64 L 92 58 C 92 51, 105 51, 105 58 L 105 64" stroke="var(--foreground)" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="99" cy="72" r="2" fill="var(--foreground)" />
        {/* heart on cover */}
        <path
          d="M69 40 C 66 35, 59 36, 59 42 C 59 47, 65 51, 69 54 C 73 51, 79 47, 79 42 C 79 36, 72 35, 69 40 Z"
          stroke="var(--accent)" strokeWidth="1.6" opacity="0.55"
        />
        {/* quill resting across the corner */}
        <path
          d="M112 96 C 128 88, 140 74, 145 58"
          stroke="var(--muted)" strokeWidth="2" strokeLinecap="round" opacity="0.6"
        />
        <path
          d="M145 58 C 140 66, 134 72, 126 78 L 118 84"
          stroke="var(--muted)" strokeWidth="1.3" strokeLinecap="round" opacity="0.4"
        />
      </svg>
    </div>
  );
}

/* ── Small four-point sparkle ────────────────────────────── */
function Spark({ className, style, size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="var(--accent)" className={className} style={style} aria-hidden="true">
      <path d="M12 1 L 14.2 9.8 L 23 12 L 14.2 14.2 L 12 23 L 9.8 14.2 L 1 12 L 9.8 9.8 Z" />
    </svg>
  );
}

export default function DiaryHubClient({ entries: initialEntries, stats, userName }) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [filterMood, setFilterMood] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  // Client-side search (content is decrypted server-side and passed here)
  const filtered = useMemo(() => {
    let result = entries;
    if (filterDate) result = result.filter((e) => e.entryDate === filterDate);
    if (filterMood) result = result.filter((e) => e.mood === filterMood);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.content?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.includes(q))
      );
    }
    return result;
  }, [entries, searchQuery, filterDate, filterMood]);

  async function handleDelete(id) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/diary/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Entry deleted.");
      router.refresh();
    } catch {
      toast.error("Failed to delete. Try again.");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  const hasFilters = filterDate || filterMood || searchQuery;

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair overflow-x-hidden">

      {/* ── Atmospheric header ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        {/* ambient layers */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(ellipse 70% 80% at 30% 20%, black 20%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(ellipse 70% 80% at 30% 20%, black 20%, transparent 75%)",
            }}
          />
          <div className="absolute -top-28 -left-24 w-[420px] h-[420px] rounded-full blur-3xl bg-[var(--accent)]/10"
            style={{ animation: "hero-blob 20s ease-in-out infinite" }} />
          <div className="absolute -bottom-32 right-[8%] w-[360px] h-[360px] rounded-full blur-3xl bg-[var(--accent)]/8"
            style={{ animation: "hero-blob 24s ease-in-out infinite reverse" }} />
          <div className="absolute top-2 left-[4%] font-playfair text-[14rem] leading-none text-[var(--accent)]/6 select-none hidden lg:block"
            style={{ animation: "ink-pulse 9s ease-in-out infinite" }}>
            &ldquo;
          </div>
        </div>

        {/* floating illustration + sparkles */}
        <JournalSketch
          className="absolute right-[6%] top-1/2 -translate-y-1/2 w-40 xl:w-52 hidden lg:block opacity-90"
          style={{ animation: "float-slow 8s ease-in-out infinite" }}
        />
        <Spark className="absolute right-[26%] top-[24%] hidden lg:block" size={16} style={{ animation: "ink-pulse 4s ease-in-out infinite" }} />
        <Spark className="absolute right-[9%] bottom-[22%] hidden lg:block" size={12} style={{ animation: "ink-pulse 5s ease-in-out infinite", animationDelay: "1s" }} />

        <div className="relative container mx-auto max-w-5xl px-6 py-16 md:py-20">
          <motion.div
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } } }}
          >
            {/* overline */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } }}
              className="flex items-center gap-3 text-[var(--accent)] font-bold tracking-[0.35em] uppercase text-[10px] mb-5"
            >
              <span className="h-[1.5px] w-8 bg-[var(--accent)]" />
              <Lock size={12} />
              <span>Private · Encrypted · Only Yours</span>
            </motion.div>

            {/* headline */}
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
              className="text-6xl md:text-8xl font-bold text-[var(--foreground)] tracking-tight leading-[0.85]"
            >
              Dear Diary<span className="text-[var(--accent)]">.</span>
            </motion.h1>

            {/* greeting */}
            <motion.p
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
              className="mt-5 text-lg md:text-xl text-[var(--muted)] italic leading-relaxed max-w-lg border-l-2 border-[var(--accent)]/40 pl-4"
            >
              {entries.length === 0
                ? `A blank page and a locked cover, ${userName}. Whatever you write here stays with you.`
                : `Welcome back, ${userName}. ${entries.length} ${entries.length === 1 ? "page" : "pages"} written, and the ink's still wet.`}
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } } }}
              className="mt-8"
            >
              <Link
                href="/diary/new"
                className="group/cta relative inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-8 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest overflow-hidden transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl"
              >
                <span className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                <PenLine size={15} />
                Write Today&apos;s Page
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-5xl px-6 py-10">

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.7, ease: EASE }}
        >
          <DiaryStatsBar stats={stats} />
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Calendar + Mood filter */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <DiaryCalendar
              entryDates={stats?.entryDates || []}
              onDateClick={(date) => setFilterDate(date === filterDate ? null : date)}
            />

            {/* Mood filter */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-4">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)] mb-3">
                <Star size={10} className="text-[var(--accent)]" fill="currentColor" />
                Filter by Mood
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(MOOD_EMOJI).map(([key, emoji]) => (
                  <button
                    key={key}
                    onClick={() => setFilterMood(filterMood === key ? null : key)}
                    title={key}
                    className={`w-9 h-9 rounded-full border text-base flex items-center justify-center transition-all ${
                      filterMood === key
                        ? MOOD_COLORS[key] + " scale-110 shadow-sm"
                        : "border-[var(--border)] grayscale opacity-70 hover:opacity-100 hover:grayscale-0 hover:border-[var(--accent)]/40"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Search + Entries */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-5">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your pages…"
                className="w-full pl-11 pr-4 py-3.5 bg-[var(--card)]/10 border border-[var(--border)] rounded-2xl text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/50 placeholder:italic focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted)] hover:text-[var(--foreground)]"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Active filters */}
            {hasFilters && (
              <div className="flex items-center gap-2 mb-4 text-xs">
                <Filter size={11} className="text-[var(--accent)]" />
                <span className="text-[var(--muted)]">
                  Showing {filtered.length} {filtered.length === 1 ? "entry" : "entries"}
                </span>
                <button
                  onClick={() => { setFilterDate(null); setFilterMood(null); setSearchQuery(""); }}
                  className="text-[var(--accent)] hover:underline uppercase tracking-widest font-bold"
                >
                  Clear filters
                </button>
              </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
                {entries.length === 0 ? (
                  <>
                    <JournalSketch className="w-28 mx-auto mb-6 opacity-80" />
                    <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
                      The first page is always the hardest
                    </h2>
                    <p className="text-[var(--muted)] italic mb-8 max-w-sm mx-auto leading-relaxed">
                      Write a line, a paragraph, or a whole story. It&apos;s encrypted the moment you save — no one else can read it.
                    </p>
                    <Link
                      href="/diary/new"
                      className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      <PenLine size={14} /> Start Writing
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-3 opacity-60">🔍</div>
                    <p className="text-[var(--muted)] italic">No pages match your search.</p>
                  </>
                )}
              </div>
            )}

            {/* Entries */}
            <div className="space-y-3">
              {filtered.map((entry, i) => (
                <motion.article
                  key={entry.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: Math.min(i * 0.04, 0.3), ease: EASE }}
                  className="group relative rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-5 pl-6 hover:border-[var(--accent)]/40 hover:bg-[var(--card)]/20 hover:shadow-md transition-all duration-300"
                >
                  {/* left "binding" spine */}
                  <span className="absolute left-0 top-4 bottom-4 w-1 rounded-full bg-[var(--accent)]/20 group-hover:bg-[var(--accent)]/60 transition-colors" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Date + mood + words */}
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">
                          {formatDate(entry.entryDate)}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${MOOD_COLORS[entry.mood] || MOOD_COLORS.neutral}`}>
                          {MOOD_EMOJI[entry.mood]} {entry.mood}
                        </span>
                        <span className="text-[10px] text-[var(--muted)] ml-auto italic">
                          {entry.wordCount} words
                        </span>
                      </div>

                      {/* Title */}
                      {entry.title && (
                        <h3 className="text-lg font-bold text-[var(--foreground)] mb-1 truncate group-hover:text-[var(--accent)] transition-colors">
                          {entry.title}
                        </h3>
                      )}

                      {/* Excerpt */}
                      <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2 italic opacity-80">
                        {getExcerpt(entry.content) || "No content preview…"}
                      </p>

                      {/* Tags */}
                      {entry.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] uppercase tracking-widest border border-[var(--border)] text-[var(--muted)] px-2 py-0.5 rounded-full font-bold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {confirmId === entry.id ? (
                        <div className="flex items-center gap-1 bg-red-500/5 rounded-lg p-1">
                          <button
                            onClick={() => handleDelete(entry.id)}
                            disabled={deletingId === entry.id}
                            className="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-red-400 hover:bg-red-500/15 transition-colors disabled:opacity-50"
                          >
                            {deletingId === entry.id ? (
                              <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : "Delete"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-2 py-1 rounded-md text-[10px] font-bold uppercase text-[var(--muted)] hover:bg-[var(--border)]/50 transition-colors"
                          >
                            Keep
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/diary/${entry.id}/edit`}
                            className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </Link>
                          <button
                            onClick={() => setConfirmId(entry.id)}
                            className="p-2 rounded-lg text-[var(--muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
