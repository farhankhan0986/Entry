"use client";

import { useState, useRef, useCallback } from "react";
import { Sparkles, ChevronDown, ChevronUp, Wand2, FileText, Minimize2, Maximize2, RefreshCw, Lightbulb, Loader2, Copy, Check, X, BookOpen, Mic, Type } from "lucide-react";

// ── Modes available in the refine API ────────────────────────────────────────
const REFINE_MODES = [
  { id: "rewrite",           label: "Rewrite",       icon: RefreshCw,  desc: "Make it more compelling" },
  { id: "expand",            label: "Expand",        icon: Maximize2,  desc: "Add more detail & depth" },
  { id: "shorten",           label: "Shorten",       icon: Minimize2,  desc: "Cut to the core" },
  { id: "headlines",         label: "Headlines",     icon: Type,       desc: "5 title variations" },
  { id: "tone_professional", label: "Professional",  icon: BookOpen,   desc: "Formal & authoritative" },
  { id: "tone_casual",       label: "Casual",        icon: Mic,        desc: "Warm & conversational" },
  { id: "tone_poetic",       label: "Poetic",        icon: Sparkles,   desc: "Lyrical & evocative" },
  { id: "intro",             label: "Hook Intro",    icon: Lightbulb,  desc: "Write an opening hook" },
  { id: "conclusion",        label: "Conclusion",    icon: FileText,   desc: "End with impact" },
];

// ── Blog Writer fields ─────────────────────────────────────────────────────
const TONES    = ["conversational", "professional", "educational", "motivational", "storytelling", "humorous"];
const LENGTHS  = ["short (400–600w)", "medium (700–900w)", "long (1100–1400w)"];
const STYLES   = ["storytelling", "how-to guide", "listicle", "op-ed", "personal essay"];
const AUDIENCES = ["general readers", "students", "professionals", "entrepreneurs", "tech enthusiasts", "creative writers"];

export default function AIWritingPanel({ onInsert, defaultTitle = "", defaultCategory = "General" }) {
  const [open, setOpen]                 = useState(false);
  const [activeTab, setActiveTab]       = useState("generate"); // "generate" | "refine"

  // ── Generate state ──────────────────────────────────────────────────────
  const [gTitle, setGTitle]             = useState(defaultTitle);
  const [gTone, setGTone]               = useState("conversational");
  const [gLength, setGLength]           = useState("medium (700–900w)");
  const [gStyle, setGStyle]             = useState("storytelling");
  const [gAudience, setGAudience]       = useState("general readers");
  const [gKeywords, setGKeywords]       = useState("");
  const [generating, setGenerating]     = useState(false);
  const [genResult, setGenResult]       = useState("");
  const [genError, setGenError]         = useState("");

  // ── Refine state ────────────────────────────────────────────────────────
  const [refineText, setRefineText]     = useState("");
  const [refineMode, setRefineMode]     = useState("rewrite");
  const [refining, setRefining]         = useState(false);
  const [refineResult, setRefineResult] = useState("");
  const [refineError, setRefineError]   = useState("");

  // ── Copy state ──────────────────────────────────────────────────────────
  const [copied, setCopied]             = useState(false);

  // ── Generate blog ───────────────────────────────────────────────────────
  async function handleGenerate() {
    if (!gTitle.trim()) { setGenError("Title is required."); return; }
    setGenerating(true); setGenResult(""); setGenError("");
    try {
      const res  = await fetch("/api/ai/blog-writer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:    gTitle,
          category: defaultCategory,
          tone:     gTone,
          length:   gLength.split(" ")[0],
          style:    gStyle,
          audience: gAudience,
          keywords: gKeywords,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed.");
      setGenResult(data.blog || "");
    } catch (err) {
      setGenError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  // ── Refine text ──────────────────────────────────────────────────────────
  async function handleRefine() {
    if (!refineText.trim()) { setRefineError("Paste some text to refine."); return; }
    setRefining(true); setRefineResult(""); setRefineError("");
    try {
      const res  = await fetch("/api/ai/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: refineText, mode: refineMode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refinement failed.");
      setRefineResult(data.result || "");
    } catch (err) {
      setRefineError(err.message);
    } finally {
      setRefining(false);
    }
  }

  // ── Copy result ──────────────────────────────────────────────────────────
  async function handleCopy(text) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const activeResult = activeTab === "generate" ? genResult : refineResult;

  return (
    <div className="rounded-2xl border border-[var(--border)] overflow-hidden mb-6 bg-[var(--background)]">
      {/* ── Header toggle ──────────────────────────────────────────────── */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-[var(--accent)]/10 to-transparent hover:from-[var(--accent)]/15 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-[var(--accent)]/20 text-[var(--accent)]">
            <Wand2 size={14} />
          </div>
          <span className="text-sm font-bold text-[var(--foreground)] uppercase tracking-[0.15em]">
            AI Writing Assistant
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[var(--accent)] px-2 py-0.5 rounded-full">
            Beta
          </span>
        </div>
        {open ? <ChevronUp size={16} className="text-[var(--muted)]" /> : <ChevronDown size={16} className="text-[var(--muted)]" />}
      </button>

      {/* ── Panel body ─────────────────────────────────────────────────── */}
      {open && (
        <div className="p-5 space-y-5 border-t border-[var(--border)]">

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-[var(--input)] rounded-xl w-fit">
            {["generate", "refine"].map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-[0.15em] transition-all ${
                  activeTab === tab
                    ? "bg-[var(--accent)] text-white shadow-sm"
                    : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {tab === "generate" ? "✨ Generate" : "🔧 Refine"}
              </button>
            ))}
          </div>

          {/* ── GENERATE tab ─────────────────────────────────────────── */}
          {activeTab === "generate" && (
            <div className="space-y-4">
              <div>
                <label className="ai-label">Blog Title / Topic *</label>
                <input
                  type="text"
                  value={gTitle}
                  onChange={e => setGTitle(e.target.value)}
                  placeholder="e.g. Why mornings are secretly your superpower..."
                  className="ai-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="ai-label">Tone</label>
                  <select value={gTone} onChange={e => setGTone(e.target.value)} className="ai-input">
                    {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ai-label">Length</label>
                  <select value={gLength} onChange={e => setGLength(e.target.value)} className="ai-input">
                    {LENGTHS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ai-label">Style</label>
                  <select value={gStyle} onChange={e => setGStyle(e.target.value)} className="ai-input">
                    {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="ai-label">Audience</label>
                  <select value={gAudience} onChange={e => setGAudience(e.target.value)} className="ai-input">
                    {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="ai-label">Keywords (optional)</label>
                <input
                  type="text"
                  value={gKeywords}
                  onChange={e => setGKeywords(e.target.value)}
                  placeholder="e.g. productivity, habits, mindset"
                  className="ai-input"
                />
              </div>

              {genError && (
                <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{genError}</p>
              )}

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {generating ? <><Loader2 size={14} className="animate-spin" /> Generating…</> : <><Sparkles size={14} /> Generate Blog</>}
              </button>
            </div>
          )}

          {/* ── REFINE tab ───────────────────────────────────────────── */}
          {activeTab === "refine" && (
            <div className="space-y-4">
              <div>
                <label className="ai-label">Paste text to refine</label>
                <textarea
                  value={refineText}
                  onChange={e => setRefineText(e.target.value)}
                  rows={5}
                  placeholder="Paste a paragraph, intro, or full draft section here..."
                  className="ai-input resize-none"
                />
                <p className="text-[10px] text-[var(--muted)] mt-1 ml-1">{refineText.length}/8000 chars</p>
              </div>

              <div>
                <label className="ai-label">Mode</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {REFINE_MODES.map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setRefineMode(m.id)}
                      className={`flex flex-col items-start gap-1 p-2.5 rounded-xl border text-left transition-all ${
                        refineMode === m.id
                          ? "border-[var(--accent)] bg-[var(--accent)]/10"
                          : "border-[var(--border)] hover:border-[var(--accent)]/40"
                      }`}
                    >
                      <m.icon size={12} className={refineMode === m.id ? "text-[var(--accent)]" : "text-[var(--muted)]"} />
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${refineMode === m.id ? "text-[var(--accent)]" : "text-[var(--foreground)]"}`}>
                        {m.label}
                      </span>
                      <span className="text-[9px] text-[var(--muted)] leading-snug">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {refineError && (
                <p className="text-xs text-red-500 bg-red-500/10 rounded-lg px-3 py-2">{refineError}</p>
              )}

              <button
                type="button"
                onClick={handleRefine}
                disabled={refining}
                className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold uppercase tracking-[0.2em] text-xs hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {refining ? <><Loader2 size={14} className="animate-spin" /> Refining…</> : <><Wand2 size={14} /> Refine Text</>}
              </button>
            </div>
          )}

          {/* ── Result Box ───────────────────────────────────────────── */}
          {activeResult && (
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--accent)]/20">
                <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)]">
                  AI Result
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(activeResult)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {copied ? <><Check size={10} className="text-green-500" /> Copied!</> : <><Copy size={10} /> Copy</>}
                  </button>
                  {onInsert && (
                    <button
                      type="button"
                      onClick={() => { onInsert(activeResult); setGenResult(""); setRefineResult(""); }}
                      className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-[var(--accent)] px-2.5 py-1 rounded-lg hover:opacity-90 transition-opacity"
                    >
                      ↓ Insert
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => { setGenResult(""); setRefineResult(""); }}
                    className="text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-72 overflow-y-auto">
                <pre className="text-sm text-[var(--foreground)] whitespace-pre-wrap font-sans leading-relaxed">
                  {activeResult}
                </pre>
              </div>
            </div>
          )}

          <p className="text-[10px] text-[var(--muted)] text-center leading-relaxed">
            AI can make mistakes. Always review output before publishing.
            <br />Generate: 10/day · Refine: 20/day per account.
          </p>
        </div>
      )}

      {/* ── Inline styles ─────────────────────────────────────────────── */}
      <style jsx>{`
        .ai-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--muted);
          margin-bottom: 6px;
          margin-left: 2px;
        }
        .ai-input {
          width: 100%;
          background: var(--input);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 10px 14px;
          color: var(--foreground);
          font-size: 13px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ai-input:focus {
          border-color: var(--accent);
        }
        .ai-input::placeholder {
          color: var(--muted);
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
