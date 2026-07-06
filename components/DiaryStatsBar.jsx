"use client";

import { Flame, BookOpen, Type, TrendingUp } from "lucide-react";

const MOOD_EMOJI = {
  happy: "😊",
  calm: "😌",
  anxious: "😰",
  sad: "😢",
  excited: "🤩",
  neutral: "😐",
};

const MOOD_LABEL = {
  happy: "Happy",
  calm: "Calm",
  anxious: "Anxious",
  sad: "Reflective",
  excited: "Excited",
  neutral: "Neutral",
};

function getDominantMood(weeklyMoods) {
  if (!weeklyMoods) return null;
  const entries = Object.entries(weeklyMoods).filter(([, v]) => v > 0);
  if (entries.length === 0) return null;
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

/* Postage-stamp icon frame — matches the tools section aesthetic */
function Stamp({ icon: Icon, hot }) {
  return (
    <div
      className={`inline-flex items-center justify-center p-2 border-[1.5px] border-dashed rounded-lg -rotate-3 group-hover:rotate-2 group-hover:scale-105 transition-transform duration-500 ${
        hot
          ? "border-orange-400/60 bg-orange-400/10 text-orange-400"
          : "border-[var(--accent)]/50 bg-[var(--accent)]/8 text-[var(--accent)]"
      }`}
    >
      <Icon size={16} strokeWidth={2} />
    </div>
  );
}

export default function DiaryStatsBar({ stats }) {
  const {
    currentStreak = 0,
    longestStreak = 0,
    totalEntries = 0,
    totalWords = 0,
    weeklyMoods = {},
  } = stats || {};

  const dominantMood = getDominantMood(weeklyMoods);

  const statItems = [
    {
      no: "01",
      icon: Flame,
      value: currentStreak,
      label: "Day Streak",
      sublabel: `Best · ${longestStreak}`,
      hot: currentStreak >= 3,
    },
    {
      no: "02",
      icon: BookOpen,
      value: totalEntries,
      label: "Entries",
      sublabel: "All time",
    },
    {
      no: "03",
      icon: Type,
      value: totalWords.toLocaleString(),
      label: "Words",
      sublabel: "Written down",
    },
    {
      no: "04",
      icon: TrendingUp,
      value: dominantMood ? MOOD_EMOJI[dominantMood] : "—",
      label: "This Week",
      sublabel: dominantMood ? MOOD_LABEL[dominantMood] : "No entries yet",
      isEmoji: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {statItems.map((item) => (
        <div
          key={item.no}
          className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ${
            item.hot
              ? "border-orange-400/40 bg-orange-400/5"
              : "border-[var(--border)] bg-[var(--card)]/10 hover:border-[var(--accent)]/40"
          }`}
        >
          {/* ghost index number */}
          <span className="absolute -top-3 right-2 font-playfair text-[4.5rem] leading-none font-bold text-[var(--foreground)]/[0.04] select-none pointer-events-none">
            {item.no}
          </span>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <Stamp icon={item.icon} hot={item.hot} />
              {item.hot && currentStreak >= 7 && (
                <span className="text-orange-400 animate-bounce text-base">🔥</span>
              )}
            </div>

            <div className={`font-bold leading-none mb-1.5 ${item.isEmoji ? "text-3xl" : "text-3xl text-[var(--foreground)] tabular-nums"}`}>
              {item.value}
            </div>

            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--foreground)]/70">
              {item.label}
            </div>
            <div className="text-[10px] text-[var(--muted)] italic mt-0.5">
              {item.sublabel}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
