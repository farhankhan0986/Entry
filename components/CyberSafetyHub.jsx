"use client";

import { useState, useCallback } from "react";
import { Shield, Copy, Check, RefreshCw, Eye, EyeOff, Info } from "lucide-react";

// ── Password Strength Engine ─────────────────────────────────────────────────

function calcEntropy(password) {
  if (!password) return 0;
  const chars = {
    lower: /[a-z]/.test(password) ? 26 : 0,
    upper: /[A-Z]/.test(password) ? 26 : 0,
    digit: /[0-9]/.test(password) ? 10 : 0,
    symbol: /[^a-zA-Z0-9]/.test(password) ? 32 : 0,
  };
  const pool = Object.values(chars).reduce((a, b) => a + b, 0);
  return pool > 0 ? Math.log2(pool) * password.length : 0;
}

function getStrengthLevel(entropy) {
  if (entropy < 28) return 0; // Terrible
  if (entropy < 40) return 1; // Weak
  if (entropy < 56) return 2; // Fair
  if (entropy < 72) return 3; // Strong
  return 4;                   // Unbreakable
}

const STRENGTH_META = [
  { label: "Terrible",     color: "#ef4444", bg: "bg-red-500",    desc: "Change this immediately." },
  { label: "Weak",         color: "#f97316", bg: "bg-orange-500", desc: "Easily guessed. Add complexity." },
  { label: "Fair",         color: "#eab308", bg: "bg-yellow-500", desc: "Getting there. Make it longer." },
  { label: "Strong",       color: "#22c55e", bg: "bg-green-500",  desc: "Good. Consider a passphrase." },
  { label: "Unbreakable",  color: "#6366f1", bg: "bg-indigo-500", desc: "Excellent! Save it in a password manager." },
];

function getCrackTime(entropy) {
  // Assuming 10 billion guesses/sec (modern GPU)
  const guesses = Math.pow(2, entropy);
  const seconds = guesses / 1e10;

  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31536000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 3.15e9) return `${Math.round(seconds / 31536000)} years`;
  if (seconds < 3.15e12) return `${(seconds / 3.15e9).toFixed(0)}K years`;
  return "Millions of years";
}

function getSuggestions(password) {
  const suggestions = [];
  if (!password) return suggestions;
  if (password.length < 12) suggestions.push("Make it at least 12 characters long");
  if (!/[A-Z]/.test(password)) suggestions.push("Add uppercase letters (A-Z)");
  if (!/[a-z]/.test(password)) suggestions.push("Add lowercase letters (a-z)");
  if (!/[0-9]/.test(password)) suggestions.push("Include numbers (0-9)");
  if (!/[^a-zA-Z0-9]/.test(password)) suggestions.push("Add symbols (!@#$%^&*)");
  if (/(.)\1{2,}/.test(password)) suggestions.push("Avoid repeating characters");
  if (/^[a-zA-Z]+$/.test(password)) suggestions.push("Mix in numbers and symbols");
  const commonWords = ["password", "123456", "qwerty", "admin", "letmein", "welcome"];
  if (commonWords.some((w) => password.toLowerCase().includes(w))) {
    suggestions.push("Avoid common words or patterns");
  }
  return suggestions;
}

// ── Password Generator ────────────────────────────────────────────────────────

function generatePassword(length = 16, options = {}) {
  const { upper = true, lower = true, digits = true, symbols = true, noAmbiguous = true } = options;

  let chars = "";
  if (upper) chars += noAmbiguous ? "ABCDEFGHJKLMNPQRSTUVWXYZ" : "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lower) chars += noAmbiguous ? "abcdefghjkmnpqrstuvwxyz" : "abcdefghijklmnopqrstuvwxyz";
  if (digits) chars += noAmbiguous ? "23456789" : "0123456789";
  if (symbols) chars += "!@#$%^&*-_=+";
  if (!chars) chars = "abcdefghijklmnopqrstuvwxyz";

  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => chars[x % chars.length]).join("");
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function CyberSafetyHub() {
  const [tab, setTab] = useState("checker");

  const TABS = [
    { id: "checker",   label: "Password Checker" },
    { id: "generator", label: "Password Generator" },
    { id: "tips",      label: "Security Tips" },
    { id: "breaches",  label: "Breach Awareness" },
  ];

  return (
    <div className="font-playfair">
      {/* Tab Bar */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-[var(--border)] pb-4">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
              tab === t.id
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "checker"   && <PasswordChecker />}
      {tab === "generator" && <PasswordGenerator />}
      {tab === "tips"      && <SecurityTips />}
      {tab === "breaches"  && <BreachAwareness />}
    </div>
  );
}

// ── Password Checker Tab ──────────────────────────────────────────────────────

function PasswordChecker() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);

  const entropy = calcEntropy(password);
  const level = getStrengthLevel(entropy);
  const meta = STRENGTH_META[level];
  const crackTime = password ? getCrackTime(entropy) : null;
  const suggestions = getSuggestions(password);
  const strengthPct = Math.min(100, (entropy / 80) * 100);

  function copyPassword() {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        How strong is your password?
      </h2>
      <p className="text-[var(--muted)] text-sm mb-6 italic">
        All analysis happens in your browser. Nothing is sent to our servers.
      </p>

      {/* Input */}
      <div className="relative mb-6">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Type or paste your password..."
          className="w-full px-4 py-4 pr-20 bg-[var(--input)] border border-[var(--border)] rounded-xl text-[var(--foreground)] text-lg focus:outline-none focus:border-[var(--accent)] transition-colors font-mono"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {password && (
            <button onClick={copyPassword} className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          )}
          <button onClick={() => setShowPassword(!showPassword)} className="p-1.5 text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      {password && (
        <>
          {/* Strength meter */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold" style={{ color: meta.color }}>
                {meta.label}
              </span>
              <span className="text-xs text-[var(--muted)] uppercase tracking-widest font-bold">
                {Math.round(entropy)} bits entropy
              </span>
            </div>
            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div
                className={`h-full ${meta.bg} rounded-full transition-all duration-700`}
                style={{ width: `${strengthPct}%` }}
              />
            </div>
            <p className="text-xs text-[var(--muted)] mt-1 italic">{meta.desc}</p>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Length", value: password.length },
              { label: "Crack Time", value: crackTime },
              { label: "Strength", value: `${Math.round(strengthPct)}%` },
              { label: "Entropy", value: `${Math.round(entropy)} bits` },
            ].map((s) => (
              <div key={s.label} className="border border-[var(--border)] rounded-xl p-3 bg-[var(--card)]/10">
                <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mb-1">{s.label}</div>
                <div className="text-sm font-bold text-[var(--foreground)]">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--card)]/10">
              <div className="text-xs uppercase tracking-widest font-bold text-[var(--muted)] mb-3">Suggestions</div>
              <ul className="space-y-2">
                {suggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-[var(--foreground)]">
                    <span className="text-orange-400 mt-0.5 shrink-0">→</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {level >= 3 && (
            <div className="mt-4 border border-green-500/30 rounded-xl p-4 bg-green-500/5 text-sm text-green-600">
              ✓ Great password! Store it safely in a password manager like Bitwarden or 1Password.
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ── Password Generator Tab ────────────────────────────────────────────────────

function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const p = generatePassword(length, { upper, lower, digits, symbols, noAmbiguous });
    setPassword(p);
    setCopied(false);
  }, [length, upper, lower, digits, symbols, noAmbiguous]);

  function copyPassword() {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const entropy = calcEntropy(password);
  const level = getStrengthLevel(entropy);
  const meta = STRENGTH_META[level];

  const Toggle = ({ checked, onChange, label }) => (
    <label className="flex items-center gap-2 cursor-pointer select-none">
      <div
        onClick={() => onChange(!checked)}
        className={`w-8 h-4 rounded-full transition-all relative ${checked ? "bg-[var(--accent)]" : "bg-[var(--border)]"}`}
      >
        <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${checked ? "left-4" : "left-0.5"}`} />
      </div>
      <span className="text-xs font-bold text-[var(--foreground)]">{label}</span>
    </label>
  );

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Generate a Strong Password</h2>
      <p className="text-[var(--muted)] text-sm mb-6 italic">Generated locally in your browser. Never transmitted.</p>

      {/* Options */}
      <div className="border border-[var(--border)] rounded-xl p-5 mb-5 bg-[var(--card)]/10 space-y-4">
        {/* Length slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-widest font-bold text-[var(--muted)]">Length</span>
            <span className="text-sm font-bold text-[var(--foreground)]">{length} characters</span>
          </div>
          <input
            type="range" min="8" max="64" value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full accent-[var(--accent)]"
          />
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 gap-3">
          <Toggle checked={upper} onChange={setUpper} label="Uppercase A-Z" />
          <Toggle checked={lower} onChange={setLower} label="Lowercase a-z" />
          <Toggle checked={digits} onChange={setDigits} label="Numbers 0-9" />
          <Toggle checked={symbols} onChange={setSymbols} label="Symbols !@#$" />
          <Toggle checked={noAmbiguous} onChange={setNoAmbiguous} label="No ambiguous chars" />
        </div>
      </div>

      <button
        onClick={generate}
        className="w-full py-3.5 rounded-xl bg-[var(--foreground)] text-[var(--background)] font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all mb-5 flex items-center justify-center gap-2"
      >
        <RefreshCw size={14} />
        Generate Password
      </button>

      {password && (
        <div className="border border-[var(--border)] rounded-xl p-4 bg-[var(--card)]/10">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-widest font-bold text-[var(--muted)]">Your Password</div>
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${meta.bg}`} />
              <span className="text-xs font-bold" style={{ color: meta.color }}>{meta.label}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <code className="flex-1 text-[var(--foreground)] font-mono text-sm break-all leading-relaxed">
              {password}
            </code>
            <div className="flex flex-col gap-2">
              <button onClick={copyPassword} className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors" title="Copy">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
              <button onClick={generate} className="p-2 rounded-lg border border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors" title="Regenerate">
                <RefreshCw size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Security Tips Tab ────────────────────────────────────────────────────────

const TIPS = [
  {
    q: "How do I create a strong password?",
    a: "Use at least 12 characters with a mix of uppercase, lowercase, numbers, and symbols. Avoid real words, names, or dates. A passphrase like 'Coffee!Mountain$Bird22' is both strong and memorable.",
  },
  {
    q: "What is two-factor authentication (2FA)?",
    a: "2FA adds a second verification step after your password — typically a code from an app like Google Authenticator or sent via SMS. Even if your password is stolen, your account stays safe.",
  },
  {
    q: "Why should I use a password manager?",
    a: "Password managers (like Bitwarden, 1Password, or Dashlane) generate and store unique passwords for every site. You only need to remember one master password. This eliminates the biggest risk: reusing passwords.",
  },
  {
    q: "How does phishing work and how do I avoid it?",
    a: "Phishing tricks you into giving credentials via fake websites or emails that look legitimate. Always check the URL before entering credentials. Look for https:// and the correct domain. If in doubt, go directly to the website instead of clicking links.",
  },
  {
    q: "How often should I change my password?",
    a: "Modern security advice: don't change passwords on a schedule unless you suspect a breach. Instead, use unique, strong passwords for every account. Change immediately if you're notified of a data breach.",
  },
];

function SecurityTips() {
  const [open, setOpen] = useState(null);
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Security Tips</h2>
      <p className="text-[var(--muted)] text-sm mb-6 italic">Everything you need to stay safe online.</p>
      <div className="space-y-2">
        {TIPS.map((tip, i) => (
          <div key={i} className="border border-[var(--border)] rounded-xl overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--card)]/20 transition-colors"
            >
              <span className="text-sm font-bold text-[var(--foreground)]">{tip.q}</span>
              <span className={`text-[var(--accent)] transition-transform duration-200 ${open === i ? "rotate-180" : ""}`}>
                ▾
              </span>
            </button>
            {open === i && (
              <div className="px-4 pb-4 text-sm text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-3">
                {tip.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Breach Awareness Tab ─────────────────────────────────────────────────────

const BREACH_ARTICLES = [
  {
    title: "The Anatomy of a Data Breach",
    desc: "How attackers steal millions of passwords at once — and what happens to your data after.",
    tag: "Education",
    readTime: "4 min",
  },
  {
    title: "Social Engineering: The Human Hack",
    desc: "You're often the weakest link. Here's how manipulators trick people into handing over access.",
    tag: "Social Engineering",
    readTime: "5 min",
  },
  {
    title: "Phishing in 2026: Harder to Spot",
    desc: "AI has made phishing emails almost indistinguishable from real ones. Here's what to look for.",
    tag: "Phishing",
    readTime: "3 min",
  },
  {
    title: "Credential Stuffing Attacks Explained",
    desc: "Why using the same password on multiple sites is catastrophically dangerous.",
    tag: "Passwords",
    readTime: "4 min",
  },
];

function BreachAwareness() {
  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">Breach Awareness</h2>
      <p className="text-[var(--muted)] text-sm mb-6 italic">
        Understanding how breaches happen is the first step to protecting yourself.
      </p>
      <div className="space-y-3">
        {BREACH_ARTICLES.map((a, i) => (
          <div key={i} className="border border-[var(--border)] rounded-xl p-4 bg-[var(--card)]/10 hover:border-[var(--accent)]/30 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[9px] uppercase tracking-widest bg-[var(--accent)]/10 text-[var(--accent)] px-2 py-0.5 rounded-full font-bold">
                {a.tag}
              </span>
              <span className="text-[10px] text-[var(--muted)]">{a.readTime} read</span>
            </div>
            <h3 className="text-sm font-bold text-[var(--foreground)] mb-1">{a.title}</h3>
            <p className="text-xs text-[var(--muted)] leading-relaxed">{a.desc}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 border border-[var(--border)] rounded-xl p-4 bg-[var(--accent)]/5">
        <div className="flex items-start gap-3">
          <Info size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
          <p className="text-xs text-[var(--muted)] leading-relaxed">
            <strong className="text-[var(--foreground)]">Check if you've been breached:</strong> Visit{" "}
            <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
              haveibeenpwned.com
            </a>{" "}
            to see if your email appeared in a known data breach. It's free and trustworthy.
          </p>
        </div>
      </div>
    </div>
  );
}
