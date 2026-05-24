import CaptionGeneratorTool from "@/components/CaptionGeneratorTool";
import Link from "next/link";
import { ArrowLeft, Sparkles, Star, Heart, Image } from "lucide-react";
import { FaInstagram } from "react-icons/fa6";

export const metadata = {
  title: "Free Instagram Caption Generator — AI Captions for IG | Entry",
  description:
    "Generate perfect Instagram captions in seconds with AI. Get 3 unique caption variations with hashtags, hook lines, and mood control. Free Instagram caption generator.",
  keywords: [
    "instagram caption generator",
    "IG captions",
    "Instagram captions AI",
    "free instagram captions",
    "caption generator instagram",
    "auto caption instagram",
    "best instagram captions",
    "instagram hashtag generator",
  ],
  alternates: { canonical: "https://entry-azure.vercel.app/caption-generator/instagram-captions" },
  openGraph: {
    title: "Free Instagram Caption Generator — AI Captions for IG | Entry",
    description:
      "Generate 3 unique Instagram captions with hashtags in seconds. Free AI tool, no signup required.",
    url: "https://entry-azure.vercel.app/caption-generator/instagram-captions",
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
    title: "Free Instagram Caption Generator | Entry",
    description:
      "AI Instagram captions in seconds. 3 unique variations, hashtags included. Free, no signup.",
    images: ["https://entry-azure.vercel.app/android-chrome-512x512.png"],
  },
};

const instagramTips = [
  {
    icon: Heart,
    title: "Hook in the first line",
    desc: "Instagram truncates after ~125 characters. Your first line must stop the scroll.",
  },
  {
    icon: Star,
    title: "Line breaks matter",
    desc: "Use short paragraphs. White space is your friend — it makes captions feel more readable.",
  },
  {
    icon: Image,
    title: "Complement your visual",
    desc: "The best captions add context or emotion to your image — not just describe it.",
  },
];

export default function InstagramCaptionsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
      {/* ── Hero ── */}
      <header className="container mx-auto px-6 pt-16 pb-12">
        <Link
          href="/caption-generator"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={14} /> All Platforms
        </Link>

        <div className="w-full flex flex-col items-center justify-center mb-14 text-center">
          {/* IG icon hero */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            }}
          >
            <FaInstagram size={32} color="white" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-5">
            <Sparkles className="w-5 h-5 text-[var(--accent)]" />
            <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
              Instagram · AI Tool
            </p>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[0.9] mb-5">
            Instagram
            <br />
            <span className="text-[var(--accent)]">Caption Generator</span>
            <span className="text-[var(--muted)]">.</span>
          </h1>

          <p className="text-base md:text-lg text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
            Stop staring at a blank caption box. Describe your photo or moment and get 3
            ready-to-post Instagram captions — complete with hashtags and a hook line that stops
            the scroll.
          </p>
        </div>

        {/* Instagram-specific tips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
          {instagramTips.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-2xl border border-[var(--border)] p-5 bg-[var(--card)]/10 flex flex-col gap-2"
            >
              <Icon size={17} className="text-[#E1306C] opacity-80" />
              <p className="text-sm font-bold text-[var(--foreground)]">{title}</p>
              <p className="text-xs text-[var(--muted)] leading-snug">{desc}</p>
            </div>
          ))}
        </div>
      </header>

      {/* ── Tool (pre-selected to Instagram) ── */}
      <main className="container mx-auto px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
            <CaptionGeneratorTool defaultPlatform="instagram" />
          </div>
        </div>
      </main>

      {/* ── Contextual SEO content ── */}
      <section className="container mx-auto px-6 pb-24">
        <div className="max-w-3xl mx-auto prose prose-sm">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)]/10 p-8 space-y-4">
            <h2 className="text-2xl font-bold text-[var(--foreground)] m-0">
              Why Your Instagram Caption Matters
            </h2>
            <p className="text-sm text-[var(--muted)] leading-relaxed m-0">
              Instagram's algorithm weighs engagement signals heavily — saves, shares, and comments
              all push your post to more people. A strong caption is what converts a casual viewer
              into someone who comments, saves, or follows.
            </p>
            <p className="text-sm text-[var(--muted)] leading-relaxed m-0">
              Entry's AI caption generator is trained to write captions that feel like they came
              from a real human creator, not a template. Each generation gives you 3 genuinely
              different variations — different structures, different emotional angles, different CTAs.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
