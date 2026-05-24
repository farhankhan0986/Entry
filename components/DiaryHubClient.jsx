"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PenLine, Search, Lock, Trash2, Edit2, Filter, X } from "lucide-react";
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

function getExcerpt(content = "", len = 120) {
  const plain = content.replace(/[#*_`>\-]/g, "").trim();
  return plain.length > len ? plain.slice(0, len) + "…" : plain;
}

function formatDate(dateStr) {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short", month: "long", day: "numeric",
  });
}

export default function DiaryHubClient({ entries: initialEntries, stats, userName }) {
  const router = useRouter();
  const [entries, setEntries] = useState(initialEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDate, setFilterDate] = useState(null);
  const [filterMood, setFilterMood] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Client-side search (because content is decrypted server-side and passed here)
  const filtered = useMemo(() => {
    let result = entries;

    if (filterDate) {
      result = result.filter((e) => e.entryDate === filterDate);
    }

    if (filterMood) {
      result = result.filter((e) => e.mood === filterMood);
    }

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
    if (!confirm("Delete this entry? This cannot be undone.")) return;
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
    }
  }

  const hasFilters = filterDate || filterMood || searchQuery;

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-[var(--accent)] mb-2">
              <Lock size={13} />
              <span className="text-[10px] uppercase tracking-[0.35em] font-bold">Private · Encrypted</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-[var(--foreground)] tracking-tight leading-none">
              Dear Diary
              <span className="text-[var(--accent)]">.</span>
            </h1>
            <p className="text-[var(--muted)] mt-2 italic text-lg">
              {entries.length === 0
                ? `Your private sanctuary awaits, ${userName}.`
                : `${entries.length} ${entries.length === 1 ? "entry" : "entries"} — your thoughts, your way.`}
            </p>
          </div>

          <Link
            href="/diary/new"
            className="inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300 shrink-0"
          >
            <PenLine size={15} />
            Write Today
          </Link>
        </div>

        {/* ── Stats Bar ──────────────────────────────────────────────────── */}
        <DiaryStatsBar stats={stats} />

        {/* ── Main Layout ────────────────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-6">

          {/* Left: Calendar + Mood Filter */}
          <div className="w-full lg:w-72 shrink-0 space-y-4">
            <DiaryCalendar
              entryDates={stats?.entryDates || []}
              onDateClick={(date) => setFilterDate(date === filterDate ? null : date)}
            />

            {/* Mood filter */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-4">
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)] mb-3">
                Filter by Mood
              </div>
              <div className="flex flex-wrap gap-2">
                {Object.entries(MOOD_EMOJI).map(([key, emoji]) => (
                  <button
                    key={key}
                    onClick={() => setFilterMood(filterMood === key ? null : key)}
                    className={`px-2.5 py-1.5 rounded-full border text-xs font-bold transition-all ${
                      filterMood === key
                        ? MOOD_COLORS[key] + " scale-105"
                        : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/30"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Search + Entries feed */}
          <div className="flex-1 min-w-0">
            {/* Search */}
            <div className="relative mb-5">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your entries..."
                className="w-full pl-10 pr-4 py-3 bg-[var(--card)]/10 border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] placeholder:text-[var(--muted)]/50 focus:outline-none focus:border-[var(--accent)] transition-colors"
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

            {/* Active filters banner */}
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
              <div className="text-center py-20">
                <div className="text-5xl mb-4">📖</div>
                {entries.length === 0 ? (
                  <>
                    <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
                      Your diary is waiting
                    </h2>
                    <p className="text-[var(--muted)] italic mb-6">
                      Write your first entry. Your thoughts are encrypted and safe here.
                    </p>
                    <Link
                      href="/diary/new"
                      className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-opacity"
                    >
                      <PenLine size={14} /> Start Writing
                    </Link>
                  </>
                ) : (
                  <p className="text-[var(--muted)] italic">No entries match your search.</p>
                )}
              </div>
            )}

            {/* Entries list */}
            <div className="space-y-3">
              {filtered.map((entry) => (
                <article
                  key={entry.id}
                  className="group relative rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-5 hover:border-[var(--accent)]/30 hover:bg-[var(--card)]/20 transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Date + mood */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)]">
                          {formatDate(entry.entryDate)}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${MOOD_COLORS[entry.mood] || MOOD_COLORS.neutral}`}
                        >
                          {MOOD_EMOJI[entry.mood]} {entry.mood}
                        </span>
                        <span className="text-[10px] text-[var(--muted)] ml-auto">
                          {entry.wordCount} words
                        </span>
                      </div>

                      {/* Title */}
                      {entry.title && (
                        <h3 className="text-base font-bold text-[var(--foreground)] mb-1 truncate">
                          {entry.title}
                        </h3>
                      )}

                      {/* Excerpt */}
                      <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2 italic">
                        {getExcerpt(entry.content) || "No content preview..."}
                      </p>

                      {/* Tags */}
                      {entry.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {entry.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[9px] uppercase tracking-widest bg-[var(--border)] text-[var(--muted)] px-2 py-0.5 rounded-full font-bold"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <Link
                        href={`/diary/${entry.id}/edit`}
                        className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </Link>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        disabled={deletingId === entry.id}
                        className="p-2 rounded-lg text-[var(--muted)] hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-40"
                        title="Delete"
                      >
                        {deletingId === entry.id ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={13} />
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
