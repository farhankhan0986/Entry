"use client";
import { useState, useRef, useEffect } from "react";
import {
  Briefcase,
  MessageCircle,
  Heart,
  BookOpen,
  Zap,
  MessageSquare,
  Rocket,
  GraduationCap,
  Sparkles,
  Copy,
  Check,
  Loader2,
  ArrowLeftRight,
  RefreshCw,
  Shield,
} from "lucide-react";
import { toast } from "sonner";

const MODES = [
  {
    key: "professional",
    label: "Professional",
    icon: Briefcase,
    desc: "Exec-level clarity",
  },
  {
    key: "casual",
    label: "Casual",
    icon: MessageCircle,
    desc: "Like texting a friend",
  },
  {
    key: "emotional",
    label: "Emotional",
    icon: Heart,
    desc: "Warm & empathetic",
  },
  {
    key: "storytelling",
    label: "Storytelling",
    icon: BookOpen,
    desc: "Narrative & vivid",
  },
  {
    key: "genz",
    label: "Gen Z",
    icon: Zap,
    desc: "Current & punchy",
  },
  {
    key: "reddit",
    label: "Reddit",
    icon: MessageSquare,
    desc: "Real talk, opinions",
  },
  {
    key: "founder",
    label: "Founder",
    icon: Rocket,
    desc: "Startup energy",
  },
  {
    key: "academic",
    label: "Academic",
    icon: GraduationCap,
    desc: "Structured & clear",
  },
];

function getScoreLabel(score) {
  if (score <= 40) return { label: "Sounds AI-written", color: "#ef4444" };
  if (score <= 70) return { label: "Getting there", color: "#f59e0b" };
  if (score <= 90) return { label: "Naturally human", color: "#22c55e" };
  return { label: "Undetectably human", color: "#10b981" };
}

function ScoreMeter({ score, animating }) {
  const [displayScore, setDisplayScore] = useState(0);
  const { label, color } = getScoreLabel(score);

  useEffect(() => {
    if (!animating) return;
    setDisplayScore(0);
    const start = performance.now();
    const duration = 1000;

    const step = (timestamp) => {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [score, animating]);

  // Gradient: red -> amber -> green
  const gradientColor =
    displayScore <= 40
      ? `hsl(${Math.round((displayScore / 40) * 30)}, 90%, 55%)`
      : displayScore <= 70
      ? `hsl(${Math.round(30 + ((displayScore - 40) / 30) * 60)}, 90%, 52%)`
      : `hsl(${Math.round(90 + ((displayScore - 70) / 30) * 50)}, 80%, 40%)`;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
          Naturalness Score
        </span>
        <span
          className="text-sm font-bold tabular-nums transition-colors duration-300"
          style={{ color: gradientColor }}
        >
          {displayScore}%
        </span>
      </div>

      {/* Track */}
      <div className="relative h-2.5 rounded-full bg-[var(--border)]/60 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-75"
          style={{
            width: `${displayScore}%`,
            background: `linear-gradient(to right, #ef4444, #f59e0b, #22c55e)`,
            backgroundSize: "200% 100%",
            backgroundPosition: `${100 - displayScore}% 0`,
          }}
        />
      </div>

      <p
        className="text-xs font-bold transition-colors duration-500"
        style={{ color: gradientColor }}
      >
        {getScoreLabel(displayScore).label}
      </p>
    </div>
  );
}

export default function AIHumanizerTool() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("casual");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [splitView, setSplitView] = useState(false);
  const [scoreAnimating, setScoreAnimating] = useState(false);
  const outputRef = useRef(null);
  const MAX_CHARS = 5000;

  const inputWordCount = inputText.trim()
    ? inputText.trim().split(/\s+/).length
    : 0;

  const handleHumanize = async () => {
    if (!inputText.trim()) {
      setError("Please paste some text to humanize.");
      return;
    }
    if (inputText.length > MAX_CHARS) {
      setError(`Text must be under ${MAX_CHARS.toLocaleString()} characters.`);
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setScoreAnimating(false);

    try {
      const res = await fetch("/api/ai/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText, mode }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
      setTimeout(() => {
        setScoreAnimating(true);
        outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }, 100);
    } catch (err) {
      const msg = err.message || "Failed to humanize. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.humanized) return;
    await navigator.clipboard.writeText(result.humanized);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTryMode = (newMode) => {
    setMode(newMode);
    setResult(null);
    setScoreAnimating(false);
    setError("");
  };

  const handleReset = () => {
    setInputText("");
    setResult(null);
    setError("");
    setScoreAnimating(false);
    setSplitView(false);
  };

  return (
    <div className="space-y-8">
      {/* Privacy badge */}
      <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
        <Shield size={12} className="text-green-500" />
        <span>Your text is never stored</span>
      </div>

      {/* Mode Selector */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Choose your style:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {MODES.map(({ key, label, icon: Icon, desc }) => {
            const isActive = mode === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setMode(key);
                  if (result) setResult(null);
                  setError("");
                }}
                className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                    : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--foreground)] hover:bg-[var(--card)]/20"
                }`}
              >
                <Icon
                  size={15}
                  className={`shrink-0 transition-transform duration-200 ${
                    isActive ? "text-[var(--accent)]" : "group-hover:scale-110"
                  }`}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold leading-none truncate">{label}</p>
                  <p className="text-[10px] opacity-70 mt-0.5 leading-none truncate">{desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input + Output */}
      {result && splitView ? (
        /* Split view */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5" ref={outputRef}>
          {/* Original */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Original
              </label>
              <span className="text-xs text-[var(--muted)]">
                {inputWordCount} words
              </span>
            </div>
            <div className="min-h-[280px] max-h-[400px] overflow-y-auto bg-[var(--input)]/60 border border-[var(--border)] rounded-2xl px-5 py-4 text-sm leading-relaxed text-[var(--foreground)]/70 whitespace-pre-wrap">
              {inputText}
            </div>
          </div>

          {/* Humanized */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
                Humanized ({result.mode})
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:opacity-70 transition-opacity cursor-pointer"
              >
                {copied ? <Check size={12} /> : <Copy size={12} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="min-h-[280px] max-h-[400px] overflow-y-auto bg-[var(--card)]/20 border border-[var(--accent)]/30 rounded-2xl px-5 py-4 text-sm leading-relaxed text-[var(--foreground)] whitespace-pre-wrap">
              {result.humanized}
            </div>
          </div>
        </div>
      ) : (
        /* Single panel layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Left: Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Your AI Text
              </label>
              <span
                className={`text-xs font-medium tabular-nums ${
                  inputText.length > MAX_CHARS * 0.9
                    ? "text-red-500"
                    : "text-[var(--muted)]"
                }`}
              >
                {inputText.length.toLocaleString()}/{MAX_CHARS.toLocaleString()}
              </span>
            </div>

            <textarea
              value={inputText}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setInputText(e.target.value);
                if (error) setError("");
              }}
              placeholder="Paste your AI-generated text here..."
              rows={12}
              className={`w-full bg-[var(--input)] border rounded-2xl px-5 py-4 text-[var(--foreground)] placeholder:text-[var(--muted)]/40 outline-none focus:ring-2 transition-all resize-none text-sm leading-relaxed ${
                error
                  ? "border-red-500 focus:ring-red-400/20"
                  : "border-[var(--border)] focus:ring-[var(--accent)]/20"
              }`}
            />

            {error && (
              <p className="text-sm text-red-500 font-medium px-1">{error}</p>
            )}

            {inputText.trim() && (
              <p className="text-xs text-[var(--muted)] px-1">
                {inputWordCount} words
              </p>
            )}

            <button
              onClick={handleHumanize}
              disabled={loading || !inputText.trim()}
              className="btn-primary h-12 px-8 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all text-sm font-bold tracking-widest uppercase"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Humanizing...
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Make It Human
                </>
              )}
            </button>
          </div>

          {/* Right: Output */}
          <div className="flex flex-col gap-3" ref={outputRef}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Humanized Text
              </label>
              {result && (
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:opacity-70 transition-opacity cursor-pointer"
                >
                  {copied ? <Check size={12} /> : <Copy size={12} />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              )}
            </div>

            <div
              className={`flex-1 min-h-[280px] bg-[var(--card)]/20 border rounded-2xl px-5 py-4 text-sm leading-relaxed transition-all overflow-y-auto ${
                result
                  ? "border-[var(--accent)]/30"
                  : "border-[var(--border)]"
              } ${loading ? "animate-pulse" : ""}`}
            >
              {loading ? (
                <div className="space-y-3 pt-2">
                  <div className="h-3 bg-[var(--border)] rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-[var(--border)] rounded-full w-4/5 animate-pulse" />
                  <div className="h-3 bg-[var(--border)] rounded-full w-11/12 animate-pulse" />
                  <div className="h-3 bg-[var(--border)] rounded-full w-3/4 animate-pulse" />
                  <div className="h-3 bg-[var(--border)] rounded-full w-full animate-pulse" />
                  <div className="h-3 bg-[var(--border)] rounded-full w-5/6 animate-pulse" />
                  <div className="h-3 bg-[var(--border)] rounded-full w-2/3 animate-pulse" />
                </div>
              ) : result ? (
                <p className="text-[var(--foreground)]/90 whitespace-pre-wrap">
                  {result.humanized}
                </p>
              ) : (
                <div className="h-full min-h-[240px] flex flex-col items-center justify-center text-center gap-3 py-8">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                    <Sparkles size={20} className="text-[var(--accent)]" />
                  </div>
                  <p className="text-[var(--muted)] text-sm italic max-w-[220px] leading-relaxed">
                    Your humanized text will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Score + stats */}
            {result && (
              <div className="space-y-4 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)]/10">
                <ScoreMeter score={result.naturalScore} animating={scoreAnimating} />

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--muted)] font-medium">
                    Word count:{" "}
                    <span className="text-[var(--foreground)] font-bold">
                      {result.wordCount}
                    </span>
                    {inputWordCount > 0 && (
                      <span className="text-[var(--muted)] ml-1">
                        (was {inputWordCount})
                      </span>
                    )}
                  </span>
                  <span className="text-[var(--muted)] font-medium capitalize">
                    Mode:{" "}
                    <span className="text-[var(--accent)] font-bold">
                      {result.mode}
                    </span>
                  </span>
                </div>
              </div>
            )}

            {/* Action buttons */}
            {result && (
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 h-10 px-4 rounded-full border border-[var(--border)] flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
                <button
                  onClick={() => setSplitView((v) => !v)}
                  className="flex-1 h-10 px-4 rounded-full border border-[var(--border)] flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
                >
                  <ArrowLeftRight size={13} />
                  {splitView ? "Single View" : "Compare"}
                </button>
                <button
                  onClick={handleReset}
                  className="h-10 px-4 rounded-full border border-[var(--border)] flex items-center justify-center gap-2 text-xs font-bold tracking-widest uppercase hover:border-red-500/50 hover:text-red-500 transition-all cursor-pointer"
                >
                  <RefreshCw size={13} />
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Try another mode - shown after result */}
      {result && (
        <div className="border-t border-[var(--border)] pt-6 space-y-3">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
            Try another style:
          </p>
          <div className="flex flex-wrap gap-2">
            {MODES.filter((m) => m.key !== result.mode).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTryMode(key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[var(--border)] text-xs font-bold text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all cursor-pointer"
              >
                <Icon size={11} />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
