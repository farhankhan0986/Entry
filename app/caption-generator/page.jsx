import CaptionGeneratorTool from "@/components/CaptionGeneratorTool";
import Link from "next/link";
import { ArrowLeft, Sparkles, Zap, Hash, Copy } from "lucide-react";
import { FaInstagram, FaLinkedin, FaXTwitter, FaYoutube } from "react-icons/fa6";

export const metadata = {
  title: "Free AI Instagram Caption Generator | Entry",
  description:
    "Generate scroll-stopping captions for Instagram, LinkedIn, Twitter/X, YouTube & Reels in seconds. Free AI caption generator — 3 unique variations, hashtags included.",
  keywords: [
    "AI caption generator",
    "Instagram caption generator",
    "free caption generator",
    "LinkedIn caption generator",
    "YouTube caption generator",
    "social media captions",
    "AI social media tool",
    "hashtag generator",
    "caption maker",
    "Instagram captions 2025",
  ],
  alternates: { canonical: "https://entry-azure.vercel.app/caption-generator" },
  openGraph: {
    title: "Free AI Caption Generator — Instagram, LinkedIn, YouTube & More | Entry",
    description:
      "Generate 3 unique, human-sounding captions for any social media platform. Free, no signup. Includes hashtags.",
    url: "https://entry-azure.vercel.app/caption-generator",
    siteName: "Entry",
    images: [
      {
        url: "https://entry-azure.vercel.app/android-chrome-512x512.png",
        width: 512,
        height: 512,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Caption Generator | Entry",
    description:
      "Generate scroll-stopping captions for Instagram, LinkedIn, Twitter/X & more. Free AI tool — 3 variations, hashtags included.",
    images: ["https://entry-azure.vercel.app/android-chrome-512x512.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Caption Generator by Entry",
  description:
    "Free AI-powered caption generator for Instagram, LinkedIn, Twitter/X, YouTube, and Reels. Generates 3 unique caption variations with platform-optimized hashtags.",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Web",
  url: "https://entry-azure.vercel.app/caption-generator",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "3 unique caption variations per generation",
    "Platform-specific tone for Instagram, LinkedIn, Twitter/X, YouTube, Reels",
    "Mood and tone customization",
    "5-10 relevant hashtags per caption",
    "Hook line per caption",
    "One-click copy to clipboard",
    "No account required",
  ],
};

const features = [
  { icon: Sparkles, label: "3 Variations", desc: "Every generation gives you 3 distinct styles" },
  { icon: Hash, label: "Smart Hashtags", desc: "5-10 relevant tags included per caption" },
  { icon: Zap, label: "Hook Lines", desc: "Scroll-stopping opener for each caption" },
  { icon: Copy, label: "One-Click Copy", desc: "Copy full caption or individual hashtags" },
];

const faqs = [
  {
    q: "Is this AI caption generator free?",
    a: "Yes — completely free to use. No account, no credit card, no sign-up required. You can generate up to 20 sets of captions per day.",
  },
  {
    q: "Which platforms does it support?",
    a: "The generator supports Instagram, Instagram Reels, LinkedIn, Twitter/X, and YouTube. Each platform gets its own tone, style, and length guidance baked into the AI prompts.",
  },
  {
    q: "How is this different from other caption generators?",
    a: "Most caption generators produce templated, robotic text. Entry's generator is tuned to write like a real human content creator — varying sentence structure, using platform-native language, and generating 3 genuinely different variations instead of slight rewrites of one caption.",
  },
  {
    q: "Can I use these captions directly?",
    a: "Absolutely. The captions are ready to post. We do recommend reading through them and adding your personal touch — a specific detail from your life or content makes captions even more engaging. The hashtags are curated to mix broad reach and niche targeting.",
  },
];

const PLATFORM_ICONS = [
  { Icon: FaInstagram, color: "#E1306C", label: "Instagram" },
  { Icon: FaLinkedin, color: "#0A66C2", label: "LinkedIn" },
  { Icon: FaXTwitter, color: "#14171A", label: "Twitter/X" },
  { Icon: FaYoutube, color: "#FF0000", label: "YouTube" },
];

export default function CaptionGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
        {/* ── Hero ── */}
        <header className="container mx-auto px-6 pt-16 pb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={14} /> Back to Entry
          </Link>

          <div className="w-full flex flex-col items-center justify-center mb-16 text-center">
            {/* Platform icons row */}
            <div className="flex items-center justify-center gap-4 mb-8">
              {PLATFORM_ICONS.map(({ Icon, color, label }) => (
                <div
                  key={label}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}18`, border: `1px solid ${color}30` }}
                  title={label}
                >
                  <Icon size={20} style={{ color }} />
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
                AI Tool
              </p>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-6">
              Caption
              <br />
              <span className="text-[var(--accent)]">Generator</span>
              <span className="text-[var(--muted)]">.</span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
              Generate 3 scroll-stopping captions for any platform — Instagram, LinkedIn, Twitter/X,
              YouTube & Reels. Hashtags and hook lines included.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {features.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]/10 text-center flex flex-col items-center gap-2"
              >
                <Icon size={18} className="text-[var(--accent)]" />
                <p className="text-sm font-bold text-[var(--foreground)]">{label}</p>
                <p className="text-xs text-[var(--muted)] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </header>

        {/* ── Tool ── */}
        <main className="container mx-auto px-6 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
              <CaptionGeneratorTool />
            </div>
          </div>
        </main>

        {/* ── Subpage links ── */}
        <section className="container mx-auto px-6 pb-16">
          <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/caption-generator/instagram-captions"
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-5 hover:border-[#E1306C]/40 hover:bg-[#E1306C]/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <FaInstagram size={18} style={{ color: "#E1306C" }} />
                <p className="font-bold text-sm text-[var(--foreground)]">Instagram Captions</p>
              </div>
              <p className="text-xs text-[var(--muted)] leading-snug">
                Captions tuned specifically for Instagram's culture — aesthetic, storytelling, community-driven.
              </p>
            </Link>
            <Link
              href="/caption-generator/aesthetic-captions"
              className="group rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-5 hover:border-[var(--accent)]/40 hover:bg-[var(--accent)]/5 transition-all"
            >
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={18} className="text-[var(--accent)]" />
                <p className="font-bold text-sm text-[var(--foreground)]">Aesthetic Captions</p>
              </div>
              <p className="text-xs text-[var(--muted)] leading-snug">
                Dreamy, poetic, visually evocative captions with that soft aesthetic vibe.
              </p>
            </Link>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="container mx-auto px-6 pb-24">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-[var(--muted)] mb-3">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-bold">Common Questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map(({ q, a }) => (
                <div
                  key={q}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-6"
                >
                  <h3 className="font-bold text-base mb-2 text-[var(--foreground)]">{q}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
