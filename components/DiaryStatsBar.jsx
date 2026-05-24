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
      icon: <Flame size={18} />,
      value: currentStreak,
      label: "Day Streak",
      sublabel: `Best: ${longestStreak}`,
      accent: currentStreak >= 7 ? "text-orange-400" : "text-[var(--accent)]",
      highlight: currentStreak >= 3,
    },
    {
      icon: <BookOpen size={18} />,
      value: totalEntries,
      label: "Entries",
      sublabel: "All time",
      accent: "text-[var(--accent)]",
      highlight: false,
    },
    {
      icon: <Type size={18} />,
      value: totalWords.toLocaleString(),
      label: "Words",
      sublabel: "Written",
      accent: "text-[var(--accent)]",
      highlight: false,
    },
    {
      icon: <TrendingUp size={18} />,
      value: dominantMood ? MOOD_EMOJI[dominantMood] : "—",
      label: "This Week",
      sublabel: dominantMood ? MOOD_LABEL[dominantMood] : "No entries yet",
      accent: "text-[var(--accent)]",
      highlight: false,
      isEmoji: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      {statItems.map((item, i) => (
        <div
          key={i}
          className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-300 group hover:shadow-md ${
            item.highlight
              ? "border-[var(--accent)]/40 bg-[var(--accent)]/5"
              : "border-[var(--border)] bg-[var(--card)]/10"
          }`}
        >
          {/* Subtle glow for active streak */}
          {item.highlight && (
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent pointer-events-none" />
          )}

          <div className={`flex items-center gap-1.5 mb-2 ${item.accent} opacity-70`}>
            {item.icon}
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">
              {item.label}
            </span>
          </div>

          <div
            className={`font-bold leading-none mb-1 ${
              item.isEmoji ? "text-3xl" : "text-2xl text-[var(--foreground)]"
            }`}
          >
            {item.value}
          </div>

          <div className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-bold">
            {item.sublabel}
          </div>

          {/* Streak fire animation */}
          {item.highlight && currentStreak >= 7 && (
            <div className="absolute top-3 right-3 text-orange-400 animate-bounce text-lg">
              🔥
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
