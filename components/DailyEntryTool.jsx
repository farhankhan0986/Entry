"use client";

import { useState, useEffect } from "react";
import { Check, Edit2, CalendarDays, Zap, PenLine } from "lucide-react";
import { toast } from "sonner";

export default function DailyEntryTool() {
  const [entries, setEntries] = useState([]);
  const [todayEntry, setTodayEntry] = useState("");
  const [streak, setStreak] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [hasEntryToday, setHasEntryToday] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("entry_daily_tracker");
    if (saved) {
      const parsed = JSON.parse(saved);
      setEntries(parsed);
      calculateStreak(parsed);
      checkToday(parsed);
    }
  }, []);

  const getTodayString = () => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  };

  const checkToday = (entriesList) => {
    const todayStr = getTodayString();
    const todayRecord = entriesList.find((e) => e.date === todayStr);
    if (todayRecord) {
      setHasEntryToday(true);
      setTodayEntry(todayRecord.text);
    } else {
      setHasEntryToday(false);
      setTodayEntry("");
    }
  };

  const calculateStreak = (entriesList) => {
    if (entriesList.length === 0) return setStreak(0);
    
    // Sort descending by date
    const sorted = [...entriesList].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstEntryDate = new Date(sorted[0].date);
    firstEntryDate.setHours(0,0,0,0);

    // If the most recent entry isn't today or yesterday, streak is 0
    const diffDays = Math.floor((today - firstEntryDate) / (1000 * 60 * 60 * 24));
    if (diffDays > 1) {
        setStreak(0);
        return;
    }

    currentStreak = 1;
    for (let i = 1; i < sorted.length; i++) {
        const d1 = new Date(sorted[i-1].date);
        const d2 = new Date(sorted[i].date);
        d1.setHours(0,0,0,0);
        d2.setHours(0,0,0,0);
        
        const diff = Math.floor((d1 - d2) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
            currentStreak++;
        } else {
            break;
        }
    }
    setStreak(currentStreak);
  };

  const handleSave = () => {
    if (!todayEntry.trim()) {
        toast.error("Please write something before saving.");
        return;
    }

    const todayStr = getTodayString();
    let updatedEntries = [...entries];
    
    const existingIndex = updatedEntries.findIndex(e => e.date === todayStr);
    
    if (existingIndex >= 0) {
        updatedEntries[existingIndex].text = todayEntry.trim();
        toast.success("Entry updated.");
    } else {
        updatedEntries.push({ date: todayStr, text: todayEntry.trim() });
        toast.success("Saved! Great job showing up today.");
    }

    localStorage.setItem("entry_daily_tracker", JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
    setHasEntryToday(true);
    setIsEditing(false);
    calculateStreak(updatedEntries);
  };

  if (!mounted) return <div className="min-h-[400px] animate-pulse bg-[var(--card)]/10 rounded-[40px]" />;

  return (
    <div className="space-y-10">
      {/* Header Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <CalendarDays size={24} className="text-[var(--accent)]" />
            Today's Entry
          </h2>
          <p className="text-[var(--muted)] text-sm italic mt-1">
            {new Date().toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[var(--card)]/50 border border-[var(--border)] px-4 py-2 rounded-2xl">
            <Zap size={18} className="text-[var(--accent)]" />
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] leading-none mb-1">Streak</p>
                <p className="font-bold text-lg leading-none">{streak} Days</p>
            </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        {hasEntryToday && !isEditing ? (
            <div className="bg-[var(--card)]/20 border border-[var(--border)] rounded-3xl p-8 relative group transition-all hover:border-[var(--accent)]/50">
                <p className="text-[var(--foreground)] text-lg leading-relaxed italic border-l-2 border-[var(--accent)] pl-6">
                    "{todayEntry}"
                </p>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="absolute top-4 right-4 p-2 rounded-full bg-[var(--background)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all opacity-0 group-hover:opacity-100"
                    title="Edit today's entry"
                >
                    <Edit2 size={14} />
                </button>
            </div>
        ) : (
            <div className="space-y-4">
                <textarea
                    value={todayEntry}
                    onChange={(e) => setTodayEntry(e.target.value)}
                    placeholder="Write one sentence about today. What's on your mind?"
                    className="w-full min-h-[160px] bg-[var(--input)] border border-[var(--border)] rounded-3xl p-6 text-lg leading-relaxed focus:ring-2 focus:ring-[var(--accent)]/20 outline-none resize-none transition-all placeholder:italic"
                />
                <div className="flex justify-end gap-3">
                    {hasEntryToday && (
                        <button 
                            onClick={() => {
                                setIsEditing(false);
                                checkToday(entries); // reset to saved
                            }}
                            className="px-6 py-3 rounded-full text-sm font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSave}
                        className="btn-primary flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase"
                    >
                        <Check size={16} /> {hasEntryToday ? "Update Entry" : "Save Entry"}
                    </button>
                </div>
            </div>
        )}
      </div>

      {/* History */}
      {entries.length > 0 && (
          <div className="pt-10">
              <h3 className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--muted)] mb-6 flex items-center gap-2">
                  <PenLine size={14} />
                  Past Entries
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...entries].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(hasEntryToday ? 1 : 0).map((entry) => (
                      <div key={entry.date} className="p-5 rounded-2xl border border-[var(--border)] bg-[var(--card)]/5 hover:bg-[var(--card)]/20 transition-colors">
                          <p className="text-[10px] font-bold text-[var(--accent)] uppercase tracking-widest mb-2">
                              {new Date(entry.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                          <p className="text-sm text-[var(--muted)] line-clamp-3 italic">"{entry.text}"</p>
                      </div>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}
