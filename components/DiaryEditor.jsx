"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Sparkles, X, Tag, ChevronDown, Loader2,
  CheckCircle2, Eye, EyeOff, Lightbulb, RefreshCw,
  Lock, ArrowLeft
} from "lucide-react";
import { toast } from "sonner";

const MOODS = [
  { key: "happy",   emoji: "😊", label: "Happy",      color: "bg-amber-400/20 border-amber-400/40 text-amber-600" },
  { key: "calm",    emoji: "😌", label: "Calm",       color: "bg-blue-400/20 border-blue-400/40 text-blue-600" },
  { key: "anxious", emoji: "😰", label: "Anxious",    color: "bg-purple-400/20 border-purple-400/40 text-purple-600" },
  { key: "sad",     emoji: "😢", label: "Reflective", color: "bg-slate-400/20 border-slate-400/40 text-slate-500" },
  { key: "excited", emoji: "🤩", label: "Excited",    color: "bg-green-400/20 border-green-400/40 text-green-600" },
  { key: "neutral", emoji: "😐", label: "Neutral",    color: "bg-gray-400/20 border-gray-400/40 text-gray-500" },
];

function countWords(text) {
  return text ? text.trim().split(/\s+/).filter(Boolean).length : 0;
}

export default function DiaryEditor({ initialEntry = null }) {
  const router = useRouter();
  const isEditing = !!initialEntry;

  const [title, setTitle] = useState(initialEntry?.title || "");
  const [content, setContent] = useState(initialEntry?.content || "");
  const [mood, setMood] = useState(initialEntry?.mood || "neutral");
  const [tagInput, setTagInput] = useState(initialEntry?.tags?.join(", ") || "");
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle"); // idle | saving | saved | error
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const autoSaveTimer = useRef(null);
  const contentRef = useRef(content);
  contentRef.current = content;

  const wordCount = countWords(content);

  // ── Auto-save ──────────────────────────────────────────────────────────────
  const triggerAutoSave = useCallback(() => {
    if (!contentRef.current && !title) return;
    setSaveStatus("saving");

    clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(async () => {
      try {
        if (isEditing) {
          await fetch(`/api/diary/${initialEntry.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title,
              content: contentRef.current,
              mood,
              tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
            }),
          });
        }
        setSaveStatus("saved");
        setTimeout(() => setSaveStatus("idle"), 2000);
      } catch {
        setSaveStatus("error");
      }
    }, 2000);
  }, [isEditing, initialEntry?.id, title, mood, tagInput]);

  useEffect(() => {
    if (isEditing) {
      triggerAutoSave();
    }
  }, [content, title, mood, tagInput]);

  useEffect(() => {
    return () => clearTimeout(autoSaveTimer.current);
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!content.trim()) {
      toast.error("Write something first.");
      return;
    }

    setIsSaving(true);
    try {
      const tags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);

      if (isEditing) {
        const res = await fetch(`/api/diary/${initialEntry.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, tags }),
        });
        if (!res.ok) throw new Error();
        toast.success("Entry saved.");
      } else {
        const res = await fetch("/api/diary", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content, mood, tags }),
        });
        if (!res.ok) throw new Error();
        toast.success("Entry written. 🔒 Encrypted and saved.");
      }

      router.push("/diary");
      router.refresh();
    } catch {
      toast.error("Failed to save. Try again.");
    } finally {
      setIsSaving(false);
    }
  }

  // ── AI Insights ─────────────────────────────────────────────────────────────
  async function fetchAIInsight() {
    setAiLoading(true);
    try {
      const res = await fetch("/api/diary/ai-insights", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setAiInsight(data);
    } catch (err) {
      toast.error(err.message || "AI unavailable right now.");
    } finally {
      setAiLoading(false);
    }
  }

  // ── Markdown preview (simple) ───────────────────────────────────────────────
  function renderMarkdown(text) {
    return text
      .replace(/^### (.+)/gm, "<h3 class='text-lg font-bold mt-4 mb-1'>$1</h3>")
      .replace(/^## (.+)/gm, "<h2 class='text-xl font-bold mt-6 mb-2'>$1</h2>")
      .replace(/^# (.+)/gm, "<h1 class='text-2xl font-bold mt-6 mb-2'>$1</h1>")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/^- (.+)/gm, "<li class='ml-4 list-disc'>$1</li>")
      .replace(/\n/g, "<br/>");
  }

  const selectedMood = MOODS.find((m) => m.key === mood) || MOODS[5];

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair">
      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ── Top Bar ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/diary")}
            className="flex items-center gap-2 text-[var(--muted)] hover:text-[var(--foreground)] transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={14} />
            Diary
          </button>

          <div className="flex items-center gap-3">
            {/* Save status */}
            <div className="text-xs uppercase tracking-widest font-bold flex items-center gap-1.5">
              {saveStatus === "saving" && (
                <span className="text-[var(--muted)] flex items-center gap-1">
                  <Loader2 size={10} className="animate-spin" /> Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="text-green-500 flex items-center gap-1">
                  <CheckCircle2 size={10} /> Saved
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-400">Save failed</span>
              )}
            </div>

            {/* Privacy badge */}
            <div className="flex items-center gap-1.5 text-[var(--muted)] text-[10px] uppercase tracking-widest font-bold border border-[var(--border)] rounded-full px-3 py-1">
              <Lock size={9} />
              Encrypted
            </div>

            {/* Preview toggle */}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="p-2 rounded-lg text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors"
              title={showPreview ? "Hide preview" : "Show preview"}
            >
              {showPreview ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {/* AI Panel toggle */}
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`p-2 rounded-lg transition-colors ${
                showAIPanel
                  ? "bg-[var(--accent)]/20 text-[var(--accent)]"
                  : "text-[var(--muted)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10"
              }`}
              title="AI Insights"
            >
              <Sparkles size={16} />
            </button>
          </div>
        </div>

        {/* ── Main layout (editor + optional AI panel) ─────────────────────── */}
        <div className={`flex gap-6 transition-all duration-300 ${showAIPanel ? "lg:flex-row" : ""}`}>

          {/* ── Editor Column ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Date */}
            <div className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--accent)] mb-3">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long", year: "numeric", month: "long", day: "numeric",
              })}
            </div>

            {/* Title */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give this entry a title... (optional)"
              className="w-full bg-transparent border-none outline-none text-2xl md:text-3xl font-bold text-[var(--foreground)] placeholder:text-[var(--muted)]/30 mb-4 resize-none leading-tight"
            />

            {/* Mood selector */}
            <div className="flex flex-wrap gap-2 mb-6">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMood(m.key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all duration-200 ${
                    mood === m.key
                      ? m.color + " scale-105 shadow-sm"
                      : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/40 hover:text-[var(--foreground)]"
                  }`}
                >
                  <span>{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-[var(--border)] to-transparent mb-6" />

            {/* Content editor / preview */}
            {showPreview ? (
              <div
                className="min-h-[400px] text-[var(--foreground)] leading-relaxed text-lg prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) || "<em class='text-[var(--muted)]'>Nothing written yet...</em>" }}
              />
            ) : (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin writing... your thoughts are safe here."
                className="w-full bg-transparent border-none outline-none resize-none text-[var(--foreground)] leading-[1.9] text-lg placeholder:text-[var(--muted)]/30 min-h-[400px] font-playfair"
                autoFocus
              />
            )}

            {/* Word count */}
            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-4">
              <span className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold">
                {wordCount.toLocaleString()} {wordCount === 1 ? "word" : "words"}
              </span>

              {/* Tags */}
              <div className="flex items-center gap-2">
                <Tag size={11} className="text-[var(--muted)]" />
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="tags, comma separated"
                  className="bg-transparent border-none outline-none text-xs text-[var(--muted)] placeholder:text-[var(--muted)]/40 w-40 text-right"
                />
              </div>
            </div>

            {/* Save button */}
            <button
              onClick={handleSubmit}
              disabled={isSaving || !content.trim()}
              className="mt-6 w-full py-4 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <><Loader2 size={14} className="animate-spin" /> Saving...</>
              ) : (
                <><Lock size={14} /> {isEditing ? "Save Changes" : "Save Entry"}</>
              )}
            </button>

            <p className="text-center mt-3 text-[10px] text-[var(--muted)] uppercase tracking-widest">
              Encrypted · Private · Only you can read this
            </p>
          </div>

          {/* ── AI Insights Panel ─────────────────────────────────────────── */}
          {showAIPanel && (
            <div className="w-full lg:w-72 shrink-0">
              <div className="sticky top-24 rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-[var(--accent)]" />
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--foreground)]">
                      AI Companion
                    </span>
                  </div>
                  <button
                    onClick={() => setShowAIPanel(false)}
                    className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <p className="text-xs text-[var(--muted)] leading-relaxed mb-4">
                  Based on your recent entries (mood + titles only — your words stay private).
                </p>

                {!aiInsight ? (
                  <button
                    onClick={fetchAIInsight}
                    disabled={aiLoading}
                    className="w-full py-3 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)]/20 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {aiLoading ? (
                      <><Loader2 size={12} className="animate-spin" /> Thinking...</>
                    ) : (
                      <><Lightbulb size={12} /> Get Insights</>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    {/* Emotional insight */}
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] mb-1.5">
                        Emotional Pattern
                      </div>
                      <p className="text-sm text-[var(--foreground)] leading-relaxed">
                        {aiInsight.insight}
                      </p>
                    </div>

                    {/* Mindfulness */}
                    <div>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] mb-1.5">
                        Mindfulness Nudge
                      </div>
                      <p className="text-sm text-[var(--muted)] leading-relaxed italic">
                        {aiInsight.productivity}
                      </p>
                    </div>

                    {/* Title suggestion */}
                    {aiInsight.titleSuggestion && (
                      <div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] mb-1.5">
                          Title Suggestion
                        </div>
                        <button
                          onClick={() => setTitle(aiInsight.titleSuggestion)}
                          className="w-full text-left text-sm text-[var(--foreground)] italic border border-dashed border-[var(--border)] rounded-lg px-3 py-2 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
                        >
                          "{aiInsight.titleSuggestion}"
                          <span className="block text-[10px] text-[var(--accent)] mt-1 uppercase tracking-widest not-italic">
                            Click to use →
                          </span>
                        </button>
                      </div>
                    )}

                    {/* Regenerate */}
                    <button
                      onClick={fetchAIInsight}
                      disabled={aiLoading}
                      className="w-full py-2 text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] hover:text-[var(--accent)] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40"
                    >
                      <RefreshCw size={10} />
                      Refresh Insights
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
