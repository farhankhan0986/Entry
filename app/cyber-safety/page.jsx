import CyberSafetyHub from "@/components/CyberSafetyHub";
import { Shield, Lock, RefreshCw, Eye } from "lucide-react";

export const metadata = {
  title: "Cyber Safety Center — Password Checker, Generator & Security Tools | Entry",
  description:
    "Free online password strength checker, secure password generator, and cybersecurity tips. Check how strong your password is and generate unbreakable ones — all in your browser.",
  keywords: [
    "password strength checker",
    "strong password generator",
    "password security",
    "how secure is my password",
    "cyber safety",
    "online security tools",
    "password tips",
  ],
  alternates: { canonical: "https://entry-azure.vercel.app/cyber-safety" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/cyber-safety",
    title: "Cyber Safety Center | Entry",
    description:
      "Password checker, generator, breach awareness, and security tips — all free, all in your browser.",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cyber Safety Center | Entry",
    description: "Check your password strength, generate secure passwords, and learn to stay safe online.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Cyber Safety Center",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  description:
    "A free browser-based cyber safety hub: password strength checker, password generator, and security education.",
  provider: { "@type": "Organization", name: "Entry", url: "https://entry-azure.vercel.app" },
  featureList: [
    "Password strength analysis",
    "Entropy calculation",
    "Crack time estimation",
    "Secure password generation",
    "Security tips and FAQ",
    "Breach awareness education",
  ],
};

const FEATURES = [
  {
    icon: Shield,
    title: "100% Private",
    desc: "All analysis happens in your browser. Your password is never sent to any server.",
  },
  {
    icon: Lock,
    title: "Strength Analysis",
    desc: "Real-time entropy calculation with crack time estimate and actionable suggestions.",
  },
  {
    icon: RefreshCw,
    title: "Password Generator",
    desc: "Generate cryptographically secure passwords with configurable length and character sets.",
  },
  {
    icon: Eye,
    title: "Breach Awareness",
    desc: "Learn how attacks happen so you can protect yourself before it's too late.",
  },
];

export default function CyberSafetyPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair py-16 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-[var(--accent)] mb-4">
            <Shield size={15} />
            <span className="text-[10px] uppercase tracking-[0.35em] font-bold">
              Free · Private · Browser-Based
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] tracking-tight leading-tight mb-4">
            Cyber Safety
            <span className="text-[var(--accent)]">.</span>
          </h1>

          <p className="text-xl text-[var(--muted)] italic max-w-2xl mx-auto leading-relaxed">
            Your password strength checker, generator, and cybersecurity companion.
            Everything runs locally — nothing is ever sent to our servers.
          </p>

          {/* Privacy guarantee */}
          <div className="mt-6 inline-flex items-center gap-2 border border-green-500/30 bg-green-500/5 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">
              Zero data transmission — all processing is local
            </span>
          </div>
        </div>

        {/* ── Feature grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="border border-[var(--border)] bg-[var(--card)]/10 rounded-2xl p-4 hover:border-[var(--accent)]/30 transition-colors"
            >
              <f.icon size={18} className="text-[var(--accent)] mb-3" />
              <div className="text-xs font-bold text-[var(--foreground)] mb-1">{f.title}</div>
              <div className="text-[11px] text-[var(--muted)] leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>

        {/* ── Main Tool ────────────────────────────────────────────────── */}
        <div className="border border-[var(--border)] rounded-[40px] bg-[var(--card)]/10 p-8 md:p-12 shadow-sm">
          <CyberSafetyHub />
        </div>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "Is my password safe to type into this tool?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes — completely. All strength analysis runs in your browser using JavaScript. Your password is never sent to any server, stored in a database, or logged anywhere. You can verify this by checking the Network tab in DevTools while using the tool.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How is password strength calculated?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "We calculate Shannon entropy — the mathematical measure of unpredictability. It's based on the character pool size (lowercase, uppercase, numbers, symbols) multiplied by password length. Higher entropy = exponentially harder to crack.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "How accurate is the crack time estimate?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "The estimate assumes 10 billion guesses per second — a realistic figure for modern GPU-based attacks. Real-world crack time depends on the attacker's hardware and whether they have the hash. It's a theoretical worst-case estimate, not a guarantee.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What makes a password truly strong?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Length is the single most important factor — each additional character multiplies cracking time exponentially. 16+ characters with mixed types (upper, lower, numbers, symbols) is excellent. Avoid dictionary words, names, and dates. Use our generator for instant strong passwords.",
                    },
                  },
                ],
              }),
            }}
          />
        </section>
      </div>
    </div>
  );
}
