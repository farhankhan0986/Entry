"use client";
import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Type, ArrowUpDown, ArrowDownUp, Trash2, Copy, Scissors,
  AlignLeft, Hash, RefreshCcw, FileText, Search, Replace,
  Minus, LetterText, Braces, DownloadCloud, Clipboard, Wand2,
  ChevronDown, ChevronUp, Link2, BookOpen, EyeOff, Check,
} from "lucide-react";

// ─── Utility helpers ────────────────────────────────────────────────────────────
const wordCount = (t) => t.trim().split(/\s+/).filter(Boolean).length;
const charCount = (t) => t.length;
const charNoSpaces = (t) => t.replace(/\s/g, "").length;
const sentenceCount = (t) => (t.match(/[^.!?]*[.!?]+/g) || []).length;
const paragraphCount = (t) => t.split(/\n\s*\n/).filter(Boolean).length;
const vowelCount = (t) => (t.match(/[aeiou]/gi) || []).length;
const avgWordLen = (t) => {
  const words = t.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return 0;
  return (words.reduce((s, w) => s + w.length, 0) / words.length).toFixed(1);
};
const readTime = (t) => {
  const wc = wordCount(t);
  if (!wc) return "0 sec";
  const mins = wc / 200;
  if (mins < 1) return `${Math.round(mins * 60)} sec`;
  return `${mins.toFixed(1)} min`;
};

// ─── Action Button ───────────────────────────────────────────────────────────────
function ActionBtn({ icon: Icon, label, onClick, disabled, variant = "default", danger = false }) {
  const base = "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed";
  const styles = {
    default: "border border-[var(--border)] bg-[var(--card)] text-[var(--foreground)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
    primary: "bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)]",
    danger: "border border-red-500/30 text-red-400 hover:bg-red-500/10",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${danger ? styles.danger : styles[variant]}`}
      title={label}
    >
      <Icon size={14} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── Stat Card ───────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className="flex flex-col items-center justify-center p-4 rounded-2xl border border-[var(--border)] bg-[var(--background)] min-w-[90px]">
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────────
export function TextForm() {
  const [text, setText] = useState("");
  const [findStr, setFindStr] = useState("");
  const [replaceStr, setReplaceStr] = useState("");
  const [findOpen, setFindOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [copiedIdx, setCopiedIdx] = useState(null);
  const textareaRef = useRef(null);

  // ── History management ───────────────────────────────────────────────────────
  const push = useCallback((newText) => {
    setHistory((h) => [...h, text]);
    setRedoStack([]);
    setText(newText);
  }, [text]);

  const undo = () => {
    if (!history.length) return;
    setRedoStack((r) => [text, ...r]);
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, -1));
    setText(prev);
    toast("Undo");
  };

  const redo = () => {
    if (!redoStack.length) return;
    setHistory((h) => [...h, text]);
    const next = redoStack[0];
    setRedoStack((r) => r.slice(1));
    setText(next);
    toast("Redo");
  };

  // ── Transformations ──────────────────────────────────────────────────────────
  const transform = (fn, msg) => () => { push(fn(text)); toast.success(msg); };

  const toUpper = transform((t) => t.toUpperCase(), "→ UPPERCASE");
  const toLower = transform((t) => t.toLowerCase(), "→ lowercase");
  const toTitle = transform((t) =>
    t.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
    "→ Title Case"
  );
  const toSentence = transform((t) =>
    t.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, (c) => c.toUpperCase()),
    "→ Sentence case"
  );
  const toAlternating = transform((t) =>
    t.split("").map((c, i) => i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()).join(""),
    "→ aLtErNaTiNg"
  );
  const reverseText = transform((t) => t.split("").reverse().join(""), "Text reversed");
  const reverseWords = transform((t) => t.split(/\s+/).reverse().join(" "), "Words reversed");
  const trimSpaces = transform((t) => t.split(/\s+/).filter(Boolean).join(" "), "Spaces trimmed");
  const removePunctuation = transform((t) => t.replace(/[^\w\s]/g, ""), "Punctuation removed");
  const removeNumbers = transform((t) => t.replace(/\d/g, ""), "Numbers removed");
  const removeLines = transform((t) => t.replace(/\r?\n/g, " "), "Line breaks removed");
  const removeDuplicateLines = transform((t) => {
    const seen = new Set();
    return t.split("\n").filter((l) => { if (seen.has(l)) return false; seen.add(l); return true; }).join("\n");
  }, "Duplicate lines removed");
  const sortLines = transform((t) => t.split("\n").sort().join("\n"), "Lines sorted A→Z");
  const sortLinesDesc = transform((t) => t.split("\n").sort().reverse().join("\n"), "Lines sorted Z→A");
  const toSlug = transform((t) =>
    t.trim().toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-"),
    "→ slug-format"
  );
  const toHashtags = transform((t) =>
    t.trim().split(/\s+/).map((w) => `#${w.replace(/[^\w]/g, "")}`).join(" "),
    "→ #hashtags"
  );
  const encodeUrl = transform((t) => encodeURIComponent(t), "URL encoded");
  const decodeUrl = transform((t) => { try { return decodeURIComponent(t); } catch { return t; } }, "URL decoded");
  const base64Encode = transform((t) => btoa(unescape(encodeURIComponent(t))), "Base64 encoded");
  const base64Decode = transform((t) => { try { return decodeURIComponent(escape(atob(t))); } catch { return t; } }, "Base64 decoded");
  const wrapInQuotes = transform((t) => `"${t}"`, 'Wrapped in "quotes"');
  const addNumbering = transform((t) => t.split("\n").map((l, i) => `${i + 1}. ${l}`).join("\n"), "Lines numbered");
  const clearAll = () => { push(""); toast.success("Cleared"); };

  // ── Find & Replace ────────────────────────────────────────────────────────────
  const doReplace = () => {
    if (!findStr) return;
    const replaced = text.split(findStr).join(replaceStr);
    push(replaced);
    toast.success(`Replaced "${findStr}" → "${replaceStr}"`);
  };

  const findCount = findStr ? (text.split(findStr).length - 1) : 0;

  // ── Copy ─────────────────────────────────────────────────────────────────────
  const copy = (str = text, idx = 0) => {
    navigator.clipboard.writeText(str);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1800);
    toast.success("Copied to clipboard");
  };

  // ── Download ──────────────────────────────────────────────────────────────────
  const download = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "entry-text.txt"; a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded as .txt");
  };

  // ── Paste from clipboard ──────────────────────────────────────────────────────
  const paste = async () => {
    const clipped = await navigator.clipboard.readText();
    push(clipped);
    toast.success("Pasted from clipboard");
  };

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const stats = [
    { label: "Words", value: wordCount(text), color: "var(--accent)" },
    { label: "Chars", value: charCount(text), color: "#6366f1" },
    { label: "No Spaces", value: charNoSpaces(text), color: "#f59e0b" },
    { label: "Sentences", value: sentenceCount(text), color: "#10b981" },
    { label: "Paragraphs", value: paragraphCount(text), color: "#ec4899" },
    { label: "Vowels", value: vowelCount(text), color: "#06b6d4" },
    { label: "Avg Word", value: `${avgWordLen(text)}`, color: "#8b5cf6" },
    { label: "Read Time", value: readTime(text), color: "#f97316" },
  ];

  const hasText = text.length > 0;

  // ── Button groups ─────────────────────────────────────────────────────────────
  const groups = [
    {
      label: "Case",
      icon: Type,
      btns: [
        { icon: ArrowUpDown, label: "UPPER", onClick: toUpper },
        { icon: ArrowDownUp, label: "lower", onClick: toLower },
        { icon: LetterText, label: "Title", onClick: toTitle },
        { icon: AlignLeft, label: "Sentence", onClick: toSentence },
        { icon: Wand2, label: "aLtErNaTe", onClick: toAlternating },
      ],
    },
    {
      label: "Transform",
      icon: RefreshCcw,
      btns: [
        { icon: RefreshCcw, label: "Reverse", onClick: reverseText },
        { icon: RefreshCcw, label: "Rev Words", onClick: reverseWords },
        { icon: Scissors, label: "Trim", onClick: trimSpaces },
        { icon: Minus, label: "No Punct.", onClick: removePunctuation },
        { icon: Hash, label: "No Numbers", onClick: removeNumbers },
        { icon: AlignLeft, label: "Join Lines", onClick: removeLines },
        { icon: EyeOff, label: "Dedup Lines", onClick: removeDuplicateLines },
      ],
    },
    {
      label: "Sort",
      icon: AlignLeft,
      btns: [
        { icon: ChevronUp, label: "Sort A→Z", onClick: sortLines },
        { icon: ChevronDown, label: "Sort Z→A", onClick: sortLinesDesc },
        { icon: Hash, label: "Number Lines", onClick: addNumbering },
      ],
    },
    {
      label: "Format",
      icon: Braces,
      btns: [
        { icon: Hash, label: "→ Slug", onClick: toSlug },
        { icon: Hash, label: "→ Hashtags", onClick: toHashtags },
        { icon: Link2, label: "URL Encode", onClick: encodeUrl },
        { icon: Link2, label: "URL Decode", onClick: decodeUrl },
        { icon: Braces, label: "Base64 ↑", onClick: base64Encode },
        { icon: Braces, label: "Base64 ↓", onClick: base64Decode },
        { icon: BookOpen, label: "Add Quotes", onClick: wrapInQuotes },
      ],
    },
  ];

  return (
    <div className="space-y-6 font-playfair">
      {/* ── Textarea ──────────────────────────────────────────────────────────── */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste or type your text here..."
          rows={12}
          className="w-full p-5 rounded-2xl border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] text-base leading-relaxed resize-y outline-none focus:ring-2 focus:ring-[var(--accent)]/40 focus:border-[var(--accent)] transition-all placeholder:text-[var(--muted)] font-arvo"
          spellCheck={false}
          style={{ minHeight: "260px" }}
        />
        {/* char counter badge */}
        <div className="absolute bottom-3 right-4 text-[10px] font-bold text-[var(--muted)] tracking-widest select-none">
          {charCount(text)} chars
        </div>
      </div>

      {/* ── Toolbar row ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2">
        <ActionBtn icon={copiedIdx === 0 ? Check : Copy} label="Copy" onClick={() => copy(text, 0)} disabled={!hasText} variant="primary" />
        <ActionBtn icon={Clipboard} label="Paste" onClick={paste} />
        <ActionBtn icon={DownloadCloud} label="Download" onClick={download} disabled={!hasText} />
        <ActionBtn icon={RefreshCcw} label="Undo" onClick={undo} disabled={!history.length} />
        <ActionBtn icon={RefreshCcw} label="Redo" onClick={redo} disabled={!redoStack.length} />
        <ActionBtn icon={Trash2} label="Clear" onClick={clearAll} disabled={!hasText} danger />
        <button
          onClick={() => setFindOpen((v) => !v)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border transition-all ${findOpen ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)]"}`}
        >
          <Search size={14} /> Find & Replace
        </button>
      </div>

      {/* ── Find & Replace panel ─────────────────────────────────────────────── */}
      {findOpen && (
        <div className="border border-[var(--accent)]/30 rounded-2xl p-5 bg-[var(--card)] space-y-3">
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--accent)]">Find & Replace</p>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end">
            <div>
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-1 block">Find</label>
              <input
                value={findStr}
                onChange={(e) => setFindStr(e.target.value)}
                placeholder='e.g. "hello"'
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm outline-none focus:border-[var(--accent)] transition-all"
              />
              {findStr && (
                <p className="text-[10px] text-[var(--muted)] mt-1">
                  {findCount} match{findCount !== 1 ? "es" : ""} found
                </p>
              )}
            </div>
            <div>
              <label className="text-[10px] text-[var(--muted)] uppercase tracking-widest mb-1 block">Replace with</label>
              <input
                value={replaceStr}
                onChange={(e) => setReplaceStr(e.target.value)}
                placeholder='e.g. "world"'
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] text-sm outline-none focus:border-[var(--accent)] transition-all"
              />
            </div>
            <button
              onClick={doReplace}
              disabled={!findStr || !hasText}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] disabled:opacity-30 transition-all"
            >
              <Replace size={13} /> Replace All
            </button>
          </div>
        </div>
      )}

      {/* ── Button groups ─────────────────────────────────────────────────────── */}
      {groups.map((g) => {
        const GIcon = g.icon;
        return (
          <div key={g.label} className="border border-[var(--border)] rounded-2xl p-5 bg-[var(--card)]">
            <div className="flex items-center gap-2 mb-3">
              <GIcon size={14} className="text-[var(--accent)]" />
              <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--muted)]">{g.label}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {g.btns.map((b) => (
                <ActionBtn key={b.label} {...b} disabled={!hasText} />
              ))}
            </div>
          </div>
        );
      })}

      {/* ── Live Stats Dashboard ──────────────────────────────────────────────── */}
      <div className="border border-[var(--border)] rounded-2xl p-5 bg-[var(--card)]">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={14} className="text-[var(--accent)]" />
          <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--muted)]">Live Statistics</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </div>

      {/* ── Formatted Preview ─────────────────────────────────────────────────── */}
      <div className="border border-[var(--border)] rounded-2xl p-5 bg-[var(--card)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[var(--accent)]" />
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--muted)]">Formatted Preview</p>
          </div>
          {hasText && (
            <button
              onClick={() => copy(text, 99)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all"
            >
              {copiedIdx === 99 ? <><Check size={11} /> Copied</> : <><Copy size={11} /> Copy</>}
            </button>
          )}
        </div>
        <div
          className="min-h-[80px] text-[var(--foreground)] font-arvo leading-relaxed text-base whitespace-pre-wrap break-words p-4 rounded-xl bg-[var(--background)] border border-[var(--border)]"
        >
          {hasText
            ? text
            : <span className="text-[var(--muted)] italic">Your formatted text will appear here...</span>
          }
        </div>
      </div>
    </div>
  );
}