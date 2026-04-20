"use client";

import { useState, useRef, useCallback } from "react";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link, Image, Quote, Code, Minus, Eye, EyeOff,
  AlignLeft, Undo2, Redo2, Type,
} from "lucide-react";

// ── Tiny markdown → HTML renderer (no external deps) ─────────────────────────
function renderMarkdown(md) {
  if (!md) return "";
  let html = md
    // Images before links so ![...](...) is caught first
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl max-w-full my-3" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--accent)] underline" target="_blank">$1</a>')
    // H2
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-2 text-[var(--foreground)]">$1</h2>')
    // H3
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-[var(--foreground)]">$1</h3>')
    // Blockquote
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[var(--accent)] pl-4 italic text-[var(--muted)] my-3">$1</blockquote>')
    // Unordered lists
    .replace(/^\- (.+)$/gm, '<li class="ml-5 list-disc text-[var(--foreground)]">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-[var(--foreground)]">$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr class="border-[var(--border)] my-6" />')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="bg-[var(--border)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Blank lines → paragraph breaks
    .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed text-[var(--foreground)]">')

  return `<p class="mb-3 leading-relaxed text-[var(--foreground)]">${html}</p>`;
}

// ── Toolbar Button ────────────────────────────────────────────────────────────
function ToolBtn({ icon: Icon, label, onClick, active }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all text-xs font-bold
        ${active
          ? "bg-[var(--accent)] text-[var(--background)]"
          : "text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--border)]"
        }`}
    >
      <Icon size={14} />
    </button>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export default function FormattedTextarea({ name = "content", required = true }) {
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const taRef = useRef(null);

  // ── History ─────────────────────────────────────────────────────────────────
  const pushHistory = useCallback((newVal) => {
    setHistory((h) => [...h, value]);
    setRedoStack([]);
    setValue(newVal);
  }, [value]);

  const undo = () => {
    if (!history.length) return;
    setRedoStack((r) => [value, ...r]);
    setValue(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
  };

  const redo = () => {
    if (!redoStack.length) return;
    setHistory((h) => [...h, value]);
    setValue(redoStack[0]);
    setRedoStack((r) => r.slice(1));
  };

  // ── Wrap selection helper ────────────────────────────────────────────────────
  const wrap = (before, after = before) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = value.slice(s, e);
    const newVal = value.slice(0, s) + before + selected + after + value.slice(e);
    pushHistory(newVal);
    // restore cursor
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, e + before.length);
    });
  };

  // ── Prefix line helper ────────────────────────────────────────────────────────
  const prefixLine = (prefix) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s } = ta;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    pushHistory(newVal);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, s + prefix.length); });
  };

  // ── Insert at cursor ─────────────────────────────────────────────────────────
  const insertAt = (str) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s } = ta;
    const newVal = value.slice(0, s) + str + value.slice(s);
    pushHistory(newVal);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + str.length, s + str.length); });
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;
    const label = prompt("Link label:", "Link") || "Link";
    insertAt(`[${label}](${url})`);
  };

  const insertImage = () => {
    const url = prompt("Image URL:");
    if (!url) return;
    const alt = prompt("Alt text:", "Image") || "Image";
    insertAt(`![${alt}](${url})\n`);
  };

  // ── Stats ────────────────────────────────────────────────────────────────────
  const wc = value.trim().split(/\s+/).filter(Boolean).length;
  const cc = value.length;
  const readMin = wc ? `${Math.ceil(wc / 200)} min read` : "—";

  // ── Toolbar items ────────────────────────────────────────────────────────────
  const toolbarGroups = [
    [
      { icon: Heading2, label: "Heading (##)", onClick: () => prefixLine("## ") },
      { icon: Heading3, label: "Subheading (###)", onClick: () => prefixLine("### ") },
      { icon: Type, label: "Paragraph", onClick: () => prefixLine("") },
    ],
    [
      { icon: Bold, label: "Bold (**text**)", onClick: () => wrap("**") },
      { icon: Italic, label: "Italic (*text*)", onClick: () => wrap("*") },
      { icon: Code, label: "Inline Code", onClick: () => wrap("`") },
    ],
    [
      { icon: List, label: "Bullet List", onClick: () => prefixLine("- ") },
      { icon: ListOrdered, label: "Numbered List", onClick: () => prefixLine("1. ") },
      { icon: Quote, label: "Blockquote", onClick: () => prefixLine("> ") },
      { icon: Minus, label: "Horizontal Rule", onClick: () => insertAt("\n---\n") },
    ],
    [
      { icon: Link, label: "Link", onClick: insertLink },
      { icon: Image, label: "Image", onClick: insertImage },
    ],
    [
      { icon: Undo2, label: "Undo", onClick: undo },
      { icon: Redo2, label: "Redo", onClick: redo },
    ],
  ];

  return (
    <div className="w-full border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--input)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex items-center flex-wrap gap-1 px-3 py-2 border-b border-[var(--border)] bg-[var(--card)]">
        {toolbarGroups.map((group, gi) => (
          <span key={gi} className="flex items-center gap-0.5">
            {gi > 0 && <span className="w-px h-5 bg-[var(--border)] mx-1" />}
            {group.map((btn) => (
              <ToolBtn key={btn.label} {...btn} />
            ))}
          </span>
        ))}

        {/* Spacer */}
        <span className="flex-1" />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setPreview((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
            preview
              ? "bg-[var(--accent)] text-[var(--background)]"
              : "text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
          }`}
        >
          {preview ? <><EyeOff size={12} /> Edit</> : <><Eye size={12} /> Preview</>}
        </button>
      </div>

      {/* ── Cheat Sheet strip ────────────────────────────────────────────────── */}
      {!value && !preview && (
        <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--card)]/40 flex flex-wrap gap-x-5 gap-y-1">
          {[
            ["## Heading", "H2"], ["### Sub", "H3"], ["**bold**", "Bold"],
            ["*italic*", "Italic"], ["- item", "List"], ["> quote", "Quote"],
            ["`code`", "Code"], ["---", "Hr"],
          ].map(([syntax, label]) => (
            <span key={label} className="text-[10px] text-[var(--muted)]">
              <code className="font-mono text-[var(--foreground)]/70">{syntax}</code>
              <span className="ml-1 opacity-50">= {label}</span>
            </span>
          ))}
        </div>
      )}

      {/* ── Editor / Preview ─────────────────────────────────────────────────── */}
      {preview ? (
        <div
          className="w-full min-h-[320px] px-6 py-5 prose-sm font-playfair overflow-auto"
          style={{ minHeight: "320px" }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-[var(--muted)] italic">Nothing to preview yet...</p>' }}
        />
      ) : (
        <textarea
          ref={taRef}
          name={name}
          required={required}
          rows={14}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Begin your story here..."
          className="w-full bg-transparent px-6 py-5 text-[var(--foreground)] text-base leading-8 focus:outline-none resize-y font-arvo placeholder:text-[var(--muted)] placeholder:italic"
          style={{ minHeight: "320px" }}
          spellCheck
        />
      )}

      {/* ── Footer stats bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--border)] bg-[var(--card)] text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
        <div className="flex gap-4">
          <span>{wc} words</span>
          <span>{cc} chars</span>
          <span>{readMin}</span>
        </div>
        <div className="flex gap-3 items-center">
          <span className={`w-2 h-2 rounded-full ${value ? "bg-green-400" : "bg-[var(--border)]"}`} />
          <span>{value ? "Content ready" : "Empty"}</span>
        </div>
      </div>
    </div>
  );
}