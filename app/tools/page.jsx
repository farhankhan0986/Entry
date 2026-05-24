import Link from "next/link";
import { BookLock, Hash, Sparkles, Shield, Timer, Brain, Type, Zap, ArrowRight, Wrench, Star } from "lucide-react";

export const metadata = {
  title: "Free AI & Productivity Tools | Entry",
  description: "Explore Entry's free tools: AI caption generator, password checker, focus timer, AI humanizer, prompt optimizer, text converter, salary checker, and private encrypted diary.",
  keywords: ["free ai tools", "caption generator", "password checker", "focus timer", "ai humanizer", "prompt optimizer", "text converter", "salary checker", "online diary"],
  alternates: { canonical: "https://entry-azure.vercel.app/tools" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/tools",
    title: "Free AI & Productivity Tools | Entry",
    description: "10+ free browser-based tools for writing, security, productivity, and creativity.",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
};

const TOOLS = [
  {
    id: "diary",
    label: "Dear Diary",
    desc: "Your private, encrypted digital journal. Write daily entries, track mood, build writing streaks, and get AI-powered reflections.",
    href: "/diary",
    icon: BookLock,
    badge: "Private",
    badgeColor: "from-purple-500 to-indigo-500",
    accent: "#8b5cf6",
    features: ["AES-256 encryption", "Mood tracking", "Writing streaks", "AI insights"],
    category: "Journaling",
  },
  {
    id: "captions",
    label: "Caption Generator",
    desc: "AI-powered captions for Instagram, Twitter, LinkedIn, Facebook & Pinterest. Generate multiple variations instantly.",
    href: "/caption-generator",
    icon: Hash,
    badge: "Popular",
    badgeColor: "from-pink-500 to-rose-500",
    accent: "#ec4899",
    features: ["5 platforms", "Multiple tones", "Hashtag suggestions", "100% free"],
    category: "Social Media",
  },
  {
    id: "humanizer",
    label: "AI Natural Writer",
    desc: "Transform robotic AI-generated text into warm, natural, human-sounding writing. 8 distinct humanization modes.",
    href: "/ai-humanizer",
    icon: Sparkles,
    badge: "AI",
    badgeColor: "from-amber-500 to-orange-500",
    accent: "#f59e0b",
    features: ["8 rewrite modes", "Tone control", "Preserves meaning", "Instant results"],
    category: "AI Writing",
  },
  {
    id: "cyber",
    label: "Cyber Safety Center",
    desc: "Password strength checker, secure password generator, breach awareness, and security tips — all 100% in your browser.",
    href: "/cyber-safety",
    icon: Shield,
    badge: "Free",
    badgeColor: "from-emerald-500 to-teal-500",
    accent: "#10b981",
    features: ["Password checker", "Generator", "No data sent", "Security tips"],
    category: "Security",
  },
  {
    id: "focus",
    label: "Focus Timer",
    desc: "Pomodoro-based deep work timer with ambient soundscapes. Boost productivity with structured work and break sessions.",
    href: "/focus-timer",
    icon: Timer,
    badge: null,
    accent: "#06b6d4",
    features: ["Pomodoro method", "Custom intervals", "Ambient sounds", "Session stats"],
    category: "Productivity",
  },
  {
    id: "prompt",
    label: "Prompt Optimizer",
    desc: "Transform vague prompts into precise, powerful instructions that get dramatically better results from any AI.",
    href: "/prompt-optimizer",
    icon: Brain,
    badge: null,
    accent: "#6366f1",
    features: ["Multi-AI support", "Context boost", "Role injection", "Instant optimize"],
    category: "AI Writing",
  },
  {
    id: "converter",
    label: "Text Converter",
    desc: "Transform text between formats instantly: uppercase, lowercase, title case, camelCase, slug, and more.",
    href: "/converter",
    icon: Type,
    badge: null,
    accent: "#14b8a6",
    features: ["10+ formats", "Copy instantly", "No sign-in", "Free forever"],
    category: "Utilities",
  },
  {
    id: "salary",
    label: "Salary Checker",
    desc: "Compare salaries across roles, industries, and countries. Get real insights into global compensation benchmarks.",
    href: "/salary-check",
    icon: Zap,
    badge: null,
    accent: "#f97316",
    features: ["Global data", "Role comparison", "Industry filters", "Free to use"],
    category: "Finance",
  },
];

const CATEGORIES = [...new Set(TOOLS.map(t => t.category))];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Free AI & Productivity Tools",
  description: "Free browser-based tools for writing, security, productivity, and creativity.",
  url: "https://entry-azure.vercel.app/tools",
  provider: { "@type": "Organization", name: "Entry", url: "https://entry-azure.vercel.app" },
  hasPart: TOOLS.map(t => ({
    "@type": "SoftwareApplication",
    name: t.label,
    description: t.desc,
    url: `https://entry-azure.vercel.app${t.href}`,
    applicationCategory: "WebApplication",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  })),
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <div className="container mx-auto px-6 pt-20 pb-12 text-center">
        <div className="inline-flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-[10px] mb-5">
          <Wrench size={12} />
          <span>10+ Tools · All Free</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-[var(--foreground)] tracking-tight mb-5">
          Tools that work<span className="text-[var(--accent)]">.</span>
        </h1>
        <p className="text-xl text-[var(--muted)] italic max-w-xl mx-auto leading-relaxed">
          Free, browser-based tools for writing, security, productivity, and creativity — no sign-up required for most.
        </p>

        {/* Stats strip */}
        <div className="flex items-center justify-center gap-8 mt-10">
          {[["8+", "Free Tools"], ["100%", "Browser-based"], ["0", "Ads or paywalls"]].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-[var(--foreground)]">{num}</div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mt-1">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tools grid */}
      <div className="container mx-auto px-6 pb-24">
        {CATEGORIES.map(cat => {
          const catTools = TOOLS.filter(t => t.category === cat);
          return (
            <div key={cat} className="mb-14">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-[var(--muted)] whitespace-nowrap">
                  {cat}
                </span>
                <div className="h-px flex-1 bg-[var(--border)]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catTools.map(tool => (
                  <Link
                    key={tool.id}
                    href={tool.href}
                    className="group relative rounded-3xl border border-[var(--border)] bg-[var(--card)]/10 p-7 overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {/* Glow */}
                    <div
                      className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500 -mr-12 -mt-12 pointer-events-none"
                      style={{ background: tool.accent }}
                    />

                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-5">
                        <div
                          className="p-3 rounded-2xl transition-transform duration-300 group-hover:scale-110"
                          style={{ background: `${tool.accent}20` }}
                        >
                          <tool.icon size={22} style={{ color: tool.accent }} />
                        </div>
                        {tool.badge && (
                          <span className={`text-[9px] font-bold uppercase tracking-[0.2em] text-white px-2.5 py-1 rounded-full bg-gradient-to-r ${tool.badgeColor}`}>
                            {tool.badge}
                          </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-[var(--foreground)] mb-2 group-hover:text-[var(--accent)] transition-colors">
                        {tool.label}
                      </h2>
                      <p className="text-[var(--muted)] text-sm leading-relaxed mb-5">
                        {tool.desc}
                      </p>

                      {/* Feature pills */}
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {tool.features.map(f => (
                          <span
                            key={f}
                            className="text-[9px] uppercase tracking-wider font-bold px-2 py-1 rounded-full border border-[var(--border)] text-[var(--muted)]"
                          >
                            {f}
                          </span>
                        ))}
                      </div>

                      <div
                        className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 group-hover:gap-3"
                        style={{ color: tool.accent }}
                      >
                        Try it free <ArrowRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
