"use client";

import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";
import {
  Bold, Italic, Heading2, Heading3, List, ListOrdered,
  Link, Image, Quote, Code, Minus, Eye, EyeOff,
  Type, Undo2, Redo2, X, Upload, ExternalLink,
} from "lucide-react";

// ── Tiny markdown → HTML renderer ────────────────────────────────────────────
function renderMarkdown(md) {
  if (!md) return "";
  let html = md
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$2" class="max-w-2xl h-[300px] w-[500px] mx-auto rounded-3xl object-cover my-3" />')
.replace(
  /\[([^\]]+)\]\(([^)]+)\)/g,
  '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[var(--accent)] font-semibold underline underline-offset-4 hover:opacity-80 transition">$1</a>'
)
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-6 mb-2 text-[var(--foreground)]">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-[var(--foreground)]">$1</h3>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-[var(--accent)] pl-4 italic text-[var(--muted)] my-3">$1</blockquote>')
    .replace(/^\- (.+)$/gm, '<li class="ml-5 list-disc text-[var(--foreground)]">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-5 list-decimal text-[var(--foreground)]">$1</li>')
    .replace(/^---$/gm, '<hr class="border-[var(--border)] my-6" />')
    .replace(/`([^`]+)`/g, '<code class="bg-[var(--border)] px-1.5 py-0.5 rounded text-sm font-mono">$1</code>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p class="mb-3 leading-relaxed text-[var(--foreground)]">');
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

// ── Inline Floating Modal ─────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm bg-[var(--card)] border border-[var(--border)] rounded-2xl shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-[var(--foreground)] text-base">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full flex items-center justify-center text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)] transition-all"
          >
            <X size={14} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function FormattedTextarea({ name = "content", required = true }) {
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState(false);
  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const taRef = useRef(null);

  // Modal state
  const [modal, setModal] = useState(null); // "link" | "image" | null

  // Link modal fields
  const [linkUrl, setLinkUrl] = useState("");
  const [linkLabel, setLinkLabel] = useState("");

  // Image modal fields
  const [imgUrl, setImgUrl] = useState("");
  const [imgAlt, setImgAlt] = useState("");
  const [imgUploading, setImgUploading] = useState(false);
  const imgFileRef = useRef(null);

  // ── History ──────────────────────────────────────────────────────────────────
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

  // ── Helpers ──────────────────────────────────────────────────────────────────
  const wrap = (before, after = before) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s, selectionEnd: e } = ta;
    const selected = value.slice(s, e);
    const newVal = value.slice(0, s) + before + selected + after + value.slice(e);
    pushHistory(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(s + before.length, e + before.length);
    });
  };

  const prefixLine = (prefix) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s } = ta;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    pushHistory(newVal);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, s + prefix.length); });
  };

  const insertAt = (str) => {
    const ta = taRef.current;
    if (!ta) return;
    const { selectionStart: s } = ta;
    const newVal = value.slice(0, s) + str + value.slice(s);
    pushHistory(newVal);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + str.length, s + str.length); });
  };

  // ── Link modal ───────────────────────────────────────────────────────────────
  const openLinkModal = () => {
    setLinkUrl("");
    setLinkLabel("");
    setModal("link");
  };

const confirmLink = () => {
  if (!linkUrl.trim()) {
    toast.error("Please enter a URL");
    return;
  }

  const label = linkLabel.trim();
  const markdown = label
    ? `[${label}](${linkUrl.trim()})`
    : `[${linkUrl.trim()}](${linkUrl.trim()})`;

  insertAt(markdown);
  toast.success("Link inserted");
  setModal(null);
};

  // ── Image modal ──────────────────────────────────────────────────────────────
  const openImageModal = () => {
    setImgUrl("");
    setImgAlt("");
    setModal("image");
  };

  const handleImageFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImgUploading(true);
    const toastId = toast.loading("Uploading image...");
    try {
      const fd = new FormData();
      fd.append("file", file);

      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Upload failed");

      setImgUrl(data.url);
      if (!imgAlt) setImgAlt(file.name.replace(/\.[^.]+$/, ""));
      toast.success("Image uploaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed", { id: toastId });
    } finally {
      setImgUploading(false);
    }
  };

  const confirmImage = () => {
    if (!imgUrl.trim()) { toast.error("Please enter or upload an image URL"); return; }
    const alt = imgAlt.trim() || "Image";
    insertAt(`![${alt}](${imgUrl.trim()})\n`);
    toast.success("Image inserted");
    setModal(null);
  };

  // ── Stats ─────────────────────────────────────────────────────────────────────
  const wc = value.trim().split(/\s+/).filter(Boolean).length;
  const cc = value.length;
  const readMin = wc ? `${Math.ceil(wc / 200)} min read` : "—";

  // ── Toolbar groups ────────────────────────────────────────────────────────────
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
      { icon: Link, label: "Insert Link", onClick: openLinkModal },
      { icon: Image, label: "Insert Image", onClick: openImageModal },
    ],
    [
      { icon: Undo2, label: "Undo", onClick: undo },
      { icon: Redo2, label: "Redo", onClick: redo },
    ],
  ];

  return (
    <>
      <div className="w-full border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--input)] focus-within:ring-1 focus-within:ring-[var(--accent)] transition-all">

        {/* ── Toolbar ───────────────────────────────────────────────────────── */}
        <div className="flex items-center flex-wrap gap-1 px-3 py-2 border-b border-[var(--border)] bg-[var(--card)]">
          {toolbarGroups.map((group, gi) => (
            <span key={gi} className="flex items-center gap-0.5">
              {gi > 0 && <span className="w-px h-5 bg-[var(--border)] mx-1" />}
              {group.map((btn) => (
                <ToolBtn key={btn.label} {...btn} />
              ))}
            </span>
          ))}

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

        {/* ── Cheat Sheet strip ──────────────────────────────────────────────── */}
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

        {/* Hidden input — always in FormData regardless of preview mode */}
        <input type="hidden" name={name} value={value} />

        {/* ── Editor / Preview ───────────────────────────────────────────────── */}
        {preview ? (
          <div
            className="w-full min-h-[320px] px-6 py-5 prose-sm font-playfair overflow-auto"
            style={{ minHeight: "320px" }}
            dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p class="text-[var(--muted)] italic">Nothing to preview yet...</p>' }}
          />
        ) : (
          <textarea
            ref={taRef}
            rows={14}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Begin your story here..."
            className="w-full bg-transparent px-6 py-5 text-[var(--foreground)] text-base leading-8 focus:outline-none resize-y font-arvo placeholder:text-[var(--muted)] placeholder:italic"
            style={{ minHeight: "320px" }}
            spellCheck
          />
        )}

        {/* ── Footer stats ───────────────────────────────────────────────────── */}
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

      {/* ── Link Modal ──────────────────────────────────────────────────────────── */}
      {modal === "link" && (
        <Modal title="Insert Link" onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest font-bold text-[var(--muted)]">URL</label>
              <div className="relative">
                <ExternalLink size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                <input
                  autoFocus
                  type="url"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmLink(); } }}
                  className="w-full pl-9 pr-4 py-2.5 bg-[var(--input)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest font-bold text-[var(--muted)]">Label (optional)</label>
              <input
                type="text"
                placeholder="Link text"
                value={linkLabel}
                onChange={(e) => setLinkLabel(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmLink(); } }}
                className="w-full px-4 py-2.5 bg-[var(--input)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>
            <button
              type="button"
              onClick={confirmLink}
              className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-all"
            >
              Insert Link
            </button>
          </div>
        </Modal>
      )}

      {/* ── Image Modal ─────────────────────────────────────────────────────────── */}
      {modal === "image" && (
        <Modal title="Insert Image" onClose={() => setModal(null)}>
          <div className="space-y-4">
            {/* File upload zone */}
            <label
              htmlFor="ft-img-file"
              className={`group w-full cursor-pointer border-2 border-dashed rounded-2xl px-5 py-6 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                imgUrl
                  ? "border-[var(--accent)] bg-[var(--accent)]/5"
                  : "border-[var(--border)] hover:border-[var(--accent)] bg-[var(--input)]"
              }`}
            >
              {imgUploading ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-6 h-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs text-[var(--muted)]">Uploading...</span>
                </div>
              ) : imgUrl ? (
                <>
                  <img src={imgUrl} alt="" className="w-full h-28 object-cover rounded-xl" />
                  <span className="text-xs text-[var(--accent)] font-bold">Click to replace</span>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Upload size={18} className="text-[var(--accent)]" />
                  </div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">Upload from device</p>
                  <p className="text-xs text-[var(--muted)]">PNG, JPG, WEBP up to 5MB</p>
                </>
              )}
            </label>
            <input
              ref={imgFileRef}
              id="ft-img-file"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />

            {/* Divider */}
            <div className="flex items-center gap-3">
              <span className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)]">or paste URL</span>
              <span className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* URL input */}
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imgUrl}
              onChange={(e) => setImgUrl(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmImage(); } }}
              className="w-full px-4 py-2.5 bg-[var(--input)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
            />

            {/* Alt text */}
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-widest font-bold text-[var(--muted)]">Alt text (optional)</label>
              <input
                type="text"
                placeholder="Describe the image"
                value={imgAlt}
                onChange={(e) => setImgAlt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); confirmImage(); } }}
                className="w-full px-4 py-2.5 bg-[var(--input)] border border-[var(--border)] rounded-xl text-sm text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
              />
            </div>

            <button
              type="button"
              onClick={confirmImage}
              disabled={imgUploading}
              className="w-full py-2.5 rounded-xl bg-[var(--accent)] text-white text-sm font-bold tracking-widest uppercase hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Insert Image
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}