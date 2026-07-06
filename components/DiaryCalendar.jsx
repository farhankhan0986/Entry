"use client";

import { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function DiaryCalendar({ entryDates = [], onDateClick }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  // Build a Set of entry dates for O(1) lookup
  const entrySet = useMemo(() => new Set(entryDates), [entryDates]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // First day of month (0=Sun → adjust to Monday-first)
  const firstDay = new Date(year, month, 1).getDay();
  const startOffset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function toDateKey(d) {
    const mm = String(month + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${year}-${mm}-${dd}`;
  }

  function prevMonth() {
    setViewDate(new Date(year, month - 1, 1));
  }
  function nextMonth() {
    setViewDate(new Date(year, month + 1, 1));
  }

  const todayKey = today.toISOString().slice(0, 10);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-[var(--foreground)] tracking-tight">
          {MONTHS[month]} <span className="text-[var(--muted)] italic font-medium">{year}</span>
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/50 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            onClick={() => setViewDate(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] px-2 py-1 rounded hover:bg-[var(--accent)]/10 transition-colors"
          >
            Today
          </button>
          <button
            onClick={nextMonth}
            disabled={viewDate >= new Date(today.getFullYear(), today.getMonth(), 1)}
            className="p-1.5 rounded-lg text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]/50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="Next month"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d, i) => (
          <div
            key={i}
            className="text-center text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;

          const dateKey = toDateKey(day);
          const hasEntry = entrySet.has(dateKey);
          const isToday = dateKey === todayKey;
          const isFuture = dateKey > todayKey;

          return (
            <button
              key={dateKey}
              onClick={() => !isFuture && onDateClick?.(dateKey)}
              disabled={isFuture}
              title={hasEntry ? `Entry on ${dateKey}` : dateKey}
              className={`
                relative w-full aspect-square rounded-lg flex items-center justify-center
                text-xs font-bold transition-all duration-200
                ${isFuture ? "opacity-20 cursor-not-allowed" : "cursor-pointer"}
                ${isToday && !hasEntry
                  ? "ring-1 ring-[var(--accent)] text-[var(--accent)]"
                  : ""}
                ${hasEntry
                  ? "bg-[var(--accent)] text-white shadow-sm hover:opacity-90"
                  : !isFuture
                  ? "text-[var(--muted)] hover:bg-[var(--border)]/50 hover:text-[var(--foreground)]"
                  : "text-[var(--muted)]"}
              `}
            >
              {day}
              {/* Dot indicator for today with entry */}
              {isToday && hasEntry && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full border border-[var(--accent)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[var(--border)]">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-[var(--accent)]" />
          <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-bold">Entry written</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded ring-1 ring-[var(--accent)]" />
          <span className="text-[10px] text-[var(--muted)] uppercase tracking-widest font-bold">Today</span>
        </div>
      </div>
    </div>
  );
}
