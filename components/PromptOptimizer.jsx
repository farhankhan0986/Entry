"use client";
import { useState } from "react";
import { Wand2, Copy, Check, Loader2, Sparkles, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const MODELS = ["General", "ChatGPT", "Claude"];

const EXAMPLES = [
  "Write me a blog post about AI",
  "Help me learn Python",
  "Make a marketing plan",
  "Explain machine learning",
  "Write a cover letter",
];

export default function PromptOptimizer() {
  const [prompt, setPrompt] = useState("");
  const [refined, setRefined] = useState("");
  const [model, setModel] = useState("General");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const charCount = prompt.length;
  const maxChars = 1000;

  const handleOptimize = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt to optimize.");
      return;
    }
    if (prompt.trim().length < 5) {
      setError("Prompt must be at least 5 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setRefined("");

    try {
      const res = await fetch("/api/optimize-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, targetModel: model }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setRefined(data.refined);
    } catch (err) {
      setError(err.message || "Failed to optimize. Please try again.");
      toast.error("Optimization failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!refined) return;
    await navigator.clipboard.writeText(refined);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExample = (ex) => {
    setPrompt(ex);
    setRefined("");
    setError("");
  };

  return (
    <div className="space-y-8">
      {/* Model Selector */}
      <div className="flex items-center gap-3 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Optimize for:
        </span>
        <div className="flex gap-2">
          {MODELS.map((m) => (
            <button
              key={m}
              onClick={() => setModel(m)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold border transition-all duration-200 cursor-pointer ${
                model === m
                  ? "bg-[var(--accent)] text-white border-[var(--accent)]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Example prompts */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-3">
          Try an example:
        </p>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => handleExample(ex)}
              className="text-xs px-3 py-1.5 rounded-full border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all cursor-pointer"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* Input Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Your Prompt
            </label>
            <span
              className={`text-xs font-medium ${
                charCount > maxChars * 0.9
                  ? "text-red-500"
                  : "text-[var(--muted)]"
              }`}
            >
              {charCount}/{maxChars}
            </span>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => {
              if (e.target.value.length <= maxChars) setPrompt(e.target.value);
              if (error) setError("");
            }}
            placeholder="Write me something about AI and the future of work..."
            rows={10}
            className={`w-full bg-[var(--input)] border rounded-2xl px-5 py-4 text-[var(--foreground)] placeholder:text-[var(--muted)]/50 outline-none focus:ring-2 transition-all resize-none text-sm leading-relaxed ${
              error
                ? "border-red-500 focus:ring-red-400/20"
                : "border-[var(--border)] focus:ring-[var(--accent)]/20"
            }`}
          />
          {error && (
            <p className="text-sm text-red-500 font-medium px-1">{error}</p>
          )}
          <button
            onClick={handleOptimize}
            disabled={loading || !prompt.trim()}
            id="optimize-prompt-btn"
            className="btn-primary h-12 px-8 rounded-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all text-sm font-bold tracking-widest uppercase"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Optimizing...
              </>
            ) : (
              <>
                <Wand2 size={16} />
                Optimize Prompt
              </>
            )}
          </button>
        </div>

        {/* Right: Output */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Refined Prompt
            </label>
            {refined && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-bold text-[var(--accent)] hover:opacity-70 transition-opacity cursor-pointer"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>

          <div
            className={`flex-1 min-h-[240px] bg-[var(--card)]/20 border border-[var(--border)] rounded-2xl px-5 py-4 text-sm leading-relaxed transition-all ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? (
              <div className="space-y-3 pt-2">
                <div className="h-3 bg-[var(--border)] rounded-full w-full animate-pulse" />
                <div className="h-3 bg-[var(--border)] rounded-full w-4/5 animate-pulse" />
                <div className="h-3 bg-[var(--border)] rounded-full w-5/6 animate-pulse" />
                <div className="h-3 bg-[var(--border)] rounded-full w-3/4 animate-pulse" />
                <div className="h-3 bg-[var(--border)] rounded-full w-5/6 animate-pulse" />
              </div>
            ) : refined ? (
              <p className="text-[var(--foreground)]/90 whitespace-pre-wrap">
                {refined}
              </p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-8">
                <div className="w-12 h-12 rounded-2xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <Sparkles size={20} className="text-[var(--accent)]" />
                </div>
                <p className="text-[var(--muted)] text-sm italic max-w-[200px]">
                  Your refined prompt will appear here
                </p>
              </div>
            )}
          </div>

          {refined && (
            <button
              onClick={handleCopy}
              className="h-12 px-8 rounded-full border border-[var(--border)] flex items-center justify-center gap-2 text-sm font-bold tracking-widest uppercase hover:border-[var(--accent)] hover:text-[var(--accent)] transition-all cursor-pointer"
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied to Clipboard!" : "Copy Refined Prompt"}
            </button>
          )}
        </div>
      </div>

      {/* How it works */}
      <div className="border-t border-[var(--border)] pt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-4">
          What gets improved:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Role Setting", desc: "Assigns expert context" },
            { label: "Clarity", desc: "Makes goals explicit" },
            { label: "Output Format", desc: "Defines the response shape" },
            { label: "Constraints", desc: "Adds tone & length guidance" },
            { label: "Examples", desc: "Includes sample outputs" },
            { label: "Specificity", desc: "Eliminates ambiguity" },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl border border-[var(--border)] bg-[var(--card)]/10"
            >
              <p className="text-xs font-bold text-[var(--foreground)] mb-0.5">
                {item.label}
              </p>
              <p className="text-[11px] text-[var(--muted)]">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
