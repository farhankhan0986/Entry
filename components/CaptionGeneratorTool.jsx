"use client";

import { useState, useCallback } from "react";
import { Copy, Check, Loader2, Sparkles, Hash, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";
import { toast } from "sonner";

// ─── Platform config ──────────────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: "instagram",
    label: "Instagram",
    Icon: FaInstagram,
    color: "#E1306C",
    gradient: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
  },
  {
    id: "reels",
    label: "Reels",
    Icon: FaInstagram,
    color: "#C13584",
    gradient: "linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    Icon: FaLinkedin,
    color: "#0A66C2",
    gradient: "linear-gradient(135deg, #0A66C2 0%, #0077b5 100%)",
  },
  {
    id: "twitter",
    label: "Twitter/X",
    Icon: FaXTwitter,
    color: "#000000",
    gradient: "linear-gradient(135deg, #14171A 0%, #333 100%)",
  },
  {
    id: "youtube",
    label: "YouTube",
    Icon: FaYoutube,
    color: "#FF0000",
    gradient: "linear-gradient(135deg, #FF0000 0%, #cc0000 100%)",
  },
];

const MOODS = ["happy", "professional", "aesthetic", "funny", "inspirational", "bold"];
const TONES = ["friendly", "formal", "casual", "witty"];
const CTAS = [
  { id: "none", label: "No CTA" },
  { id: "follow", label: "Follow Me" },
  { id: "link-in-bio", label: "Link in Bio" },
  { id: "comment", label: "Comment Below" },
  { id: "save", label: "Save This" },
  { id: "subscribe", label: "Subscribe" },
];
const EMOJI_LEVELS = [
  { id: "none", label: "None" },
  { id: "minimal", label: "Minimal" },
  { id: "moderate", label: "Moderate" },
  { id: "heavy", label: "Heavy" },
];
const LENGTHS = [
  { id: "short", label: "Short" },
  { id: "medium", label: "Medium" },
  { id: "long", label: "Long" },
];

// ─── Small reusable pill selector ────────────────────────────────────────────
function PillSelector({ options, value, onChange, renderLabel }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const id = typeof opt === "string" ? opt : opt.id;
        const label = typeof opt === "string" ? opt : opt.label;
        const isActive = value === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
              isActive
                ? "bg-[var(--foreground)] text-[var(--background)] border-[var(--foreground)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--foreground)] hover:text-[var(--foreground)] bg-transparent"
            }`}
          >
            {renderLabel ? renderLabel(opt) : label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Skeleton loader for caption cards ───────────────────────────────────────
function CaptionSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-6 space-y-3"
        >
          <div className="skeleton-shimmer h-4 w-2/3 rounded-full" />
          <div className="skeleton-shimmer h-3 w-full rounded-full" />
          <div className="skeleton-shimmer h-3 w-5/6 rounded-full" />
          <div className="skeleton-shimmer h-3 w-4/6 rounded-full" />
          <div className="flex gap-2 pt-2">
            <div className="skeleton-shimmer h-6 w-20 rounded-full" />
            <div className="skeleton-shimmer h-6 w-24 rounded-full" />
            <div className="skeleton-shimmer h-6 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Individual caption card ─────────────────────────────────────────────────
function CaptionCard({ caption, index, platformColor, platformGradient }) {
  const [copied, setCopied] = useState(false);
  const [copiedHash, setCopiedHash] = useState(null);
  const [showHashtags, setShowHashtags] = useState(true);

  const handleCopyFull = useCallback(async () => {
    const hashtagsLine = caption.hashtags.length
      ? `\n\n${caption.hashtags.map((h) => `#${h}`).join(" ")}`
      : "";
    const fullText = `${caption.text}${hashtagsLine}`;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      toast.success("Caption copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy. Please try manually.");
    }
  }, [caption]);

  const handleCopyHashtag = useCallback(async (tag) => {
    try {
      await navigator.clipboard.writeText(`#${tag}`);
      setCopiedHash(tag);
      setTimeout(() => setCopiedHash(null), 1500);
    } catch {
      toast.error("Failed to copy hashtag.");
    }
  }, []);

  return (
    <div
      className="rounded-2xl border bg-[var(--card)]/10 overflow-hidden transition-shadow hover:shadow-md"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Colored top accent bar */}
      <div className="h-1 w-full" style={{ background: platformGradient }} />

      <div className="p-6 space-y-4">
        {/* Card header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{
                color: platformColor,
                backgroundColor: `${platformColor}18`,
                border: `1px solid ${platformColor}30`,
              }}
            >
              Variation {index + 1}
            </span>
          </div>
          <button
            onClick={handleCopyFull}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] transition-all cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check size={13} className="text-green-500" />
                <span className="text-green-500">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                Copy All
              </>
            )}
          </button>
        </div>

        {/* Hook line */}
        {caption.hook && (
          <div className="flex items-start gap-2">
            <Zap size={14} className="text-[var(--accent)] mt-0.5 shrink-0" />
            <p className="text-sm font-bold text-[var(--accent)] italic leading-snug">
              {caption.hook}
            </p>
          </div>
        )}

        {/* Caption text */}
        <p className="text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-line">
          {caption.text}
        </p>

        {/* Hashtags section */}
        {caption.hashtags.length > 0 && (
          <div className="pt-2 border-t border-[var(--border)]">
            <button
              onClick={() => setShowHashtags((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[var(--muted)] hover:text-[var(--foreground)] transition-colors mb-3 cursor-pointer"
            >
              <Hash size={12} />
              Hashtags ({caption.hashtags.length})
              {showHashtags ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showHashtags && (
              <div className="flex flex-wrap gap-1.5">
                {caption.hashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleCopyHashtag(tag)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--accent)] transition-all cursor-pointer group"
                    title={`Click to copy #${tag}`}
                  >
                    {copiedHash === tag ? (
                      <Check size={10} className="text-green-500" />
                    ) : (
                      <Hash size={10} className="group-hover:text-[var(--accent)]" />
                    )}
                    {copiedHash === tag ? (
                      <span className="text-green-500">Copied!</span>
                    ) : (
                      tag
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CaptionGeneratorTool({ defaultPlatform = "instagram", defaultMood = "happy" }) {
  const [platform, setPlatform] = useState(defaultPlatform);
  const [mood, setMood] = useState(defaultMood);
  const [tone, setTone] = useState("friendly");
  const [topic, setTopic] = useState("");
  const [cta, setCta] = useState("none");
  const [emojiLevel, setEmojiLevel] = useState("minimal");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [captions, setCaptions] = useState([]);
  const [error, setError] = useState("");

  const activePlatform = PLATFORMS.find((p) => p.id === platform) || PLATFORMS[0];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please describe your content topic first.");
      return;
    }
    setError("");
    setLoading(true);
    setCaptions([]);

    try {
      const res = await fetch("/api/ai/caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, mood, tone, topic: topic.trim(), cta, emojiLevel, length }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setCaptions(data.captions || []);
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleGenerate();
  };

  return (
    <div className="space-y-8">
      {/* ── Platform selector ── */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Platform
        </label>
        <div className="flex flex-wrap gap-2">
          {PLATFORMS.map(({ id, label, Icon, color }) => {
            const isActive = platform === id;
            return (
              <button
                key={id}
                onClick={() => setPlatform(id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${
                  isActive
                    ? "border-transparent text-white shadow-md"
                    : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)] hover:border-[var(--foreground)] bg-transparent"
                }`}
                style={isActive ? { backgroundColor: color } : {}}
              >
                <Icon size={15} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Mood ── */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Mood</label>
        <PillSelector
          options={MOODS}
          value={mood}
          onChange={setMood}
          renderLabel={(opt) => opt.charAt(0).toUpperCase() + opt.slice(1)}
        />
      </div>

      {/* ── Tone ── */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Tone</label>
        <PillSelector
          options={TONES}
          value={tone}
          onChange={setTone}
          renderLabel={(opt) => opt.charAt(0).toUpperCase() + opt.slice(1)}
        />
      </div>

      {/* ── Topic input ── */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
          Topic / Content Description
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Morning coffee routine, new product launch, travel photo in Santorini, gym progress..."
          rows={3}
          maxLength={500}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--input)] text-[var(--foreground)] placeholder-[var(--muted)] px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <p className="text-xs text-[var(--muted)] text-right">{topic.length}/500</p>
      </div>

      {/* ── CTA + Emoji + Length row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">CTA</label>
          <PillSelector options={CTAS} value={cta} onChange={setCta} />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Emojis</label>
          <PillSelector options={EMOJI_LEVELS} value={emojiLevel} onChange={setEmojiLevel} />
        </div>
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Length</label>
          <PillSelector options={LENGTHS} value={length} onChange={setLength} />
        </div>
      </div>

      {/* ── Error message ── */}
      {error && (
        <div className="text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* ── Generate button ── */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-base bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-white disabled:opacity-60 disabled:cursor-not-allowed transition-all cursor-pointer active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Crafting your captions…
          </>
        ) : (
          <>
            <Sparkles size={18} />
            Generate Captions
          </>
        )}
      </button>

      {/* ── Results ── */}
      {loading && (
        <div className="pt-2">
          <CaptionSkeleton />
        </div>
      )}

      {!loading && captions.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-[var(--accent)]" />
            <p className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              {captions.length} Caption Variations Generated
            </p>
          </div>
          {captions.map((caption, i) => (
            <CaptionCard
              key={i}
              caption={caption}
              index={i}
              platformColor={activePlatform.color}
              platformGradient={activePlatform.gradient}
            />
          ))}
          <p className="text-center text-xs text-[var(--muted)] pt-2 italic">
            Click any hashtag to copy it · Use Ctrl+Enter to generate again
          </p>
        </div>
      )}
    </div>
  );
}
