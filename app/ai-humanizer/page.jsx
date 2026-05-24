import AIHumanizerTool from "@/components/AIHumanizerTool";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  ShieldCheck,
  BarChart2,
  Layers,
} from "lucide-react";

export const metadata = {
  title: "AI Natural Writer — Make AI Text Sound Human | Entry",
  description:
    "Transform AI-generated text into natural, human writing. 8 unique styles. No sign-up required. Free AI humanizer powered by Groq.",
  keywords: [
    "humanize ai text",
    "make ai text sound human",
    "remove ai tone",
    "chatgpt humanizer",
    "ai writing humanizer",
    "bypass ai detection",
    "ai to human text",
    "natural ai text",
  ],
  alternates: { canonical: "https://entry-azure.vercel.app/ai-humanizer" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/ai-humanizer",
    siteName: "Entry",
    title: "AI Natural Writer — Make AI Text Sound Human | Entry",
    description:
      "Transform AI-generated text into natural, human writing. 8 unique styles. No sign-up required.",
    images: [
      {
        url: "https://entry-azure.vercel.app/og-default.jpg",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Natural Writer | Entry",
    description:
      "Transform AI-generated text into natural, human writing. 8 styles. Free.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI Natural Writer — Humanizer",
  applicationCategory: "WritingApplication",
  url: "https://entry-azure.vercel.app/ai-humanizer",
  description:
    "Transform AI-generated text into natural, human writing with 8 distinct writing styles. Free AI humanizer powered by Groq and Llama 3.3.",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "8 writing style modes",
    "Naturalness score meter",
    "Before/after comparison",
    "No sign-up required",
    "Privacy-first: no content stored",
  ],
  provider: {
    "@type": "Organization",
    name: "Entry",
    url: "https://entry-azure.vercel.app",
  },
};

const FEATURES = [
  {
    icon: Layers,
    label: "8 Unique Modes",
    desc: "Professional, casual, emotional, Gen Z, and more",
  },
  {
    icon: BarChart2,
    label: "Naturalness Score",
    desc: "See how human your text reads, 0–100",
  },
  {
    icon: ShieldCheck,
    label: "Total Privacy",
    desc: "Your text is never logged or stored",
  },
  {
    icon: Zap,
    label: "Instant Results",
    desc: "Powered by Groq · Llama 3.3 70B",
  },
];

const FAQS = [
  {
    q: "What is an AI humanizer?",
    a: "An AI humanizer rewrites AI-generated text to sound more natural and human. It removes telltale signs of AI writing — like overused phrases, em-dashes, robotic transitions, and predictable structure — replacing them with the flow, rhythm, and voice of a real person.",
  },
  {
    q: "How does it work?",
    a: "Paste your AI-generated text, choose a writing style (casual, professional, storytelling, etc.), and click 'Make It Human.' The tool uses Groq's Llama 3.3 70B model with specialized prompts that reshape the text's voice, sentence variety, and word choice for each style.",
  },
  {
    q: "Is it free to use?",
    a: "Yes, completely free. No account required, no payment. You can humanize up to 10 pieces of text per day (per device), and each piece can be up to 5,000 characters.",
  },
  {
    q: "Does it remove AI detection?",
    a: "It significantly improves naturalness by varying sentence structure, removing AI tells, and matching your chosen voice. However, no tool can guarantee bypassing every AI detector — results depend on the original text and chosen style. Our naturalness score helps you gauge how human the output reads.",
  },
];

export default function AIHumanizerPage() {
  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
        {/* Hero Header */}
        <header className="container mx-auto px-6 pt-16 pb-12">
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
          >
            <ArrowLeft size={14} />
            Back to Journal
          </Link>

          <div className="w-full flex flex-col items-center justify-center mb-14 text-center">
            {/* Tag */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sparkles className="w-5 h-5 text-[var(--accent)]" />
              <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
                AI Tool
              </p>
            </div>

            {/* H1 */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[0.88] mb-7">
              Stop sounding
              <br />
              <span className="text-[var(--accent)]">like a robot</span>
              <span className="text-[var(--muted)]">.</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl mb-6">
              Transform AI-generated text into natural, human writing.
              <br className="hidden md:block" />
              8 unique styles. No sign-up required.
            </p>

            {/* Live badge */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
              Powered by Groq · Llama 3.3 70B · Free
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {FEATURES.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]/10 hover:border-[var(--accent)]/40 transition-all duration-300 group text-center"
              >
                <Icon
                  size={18}
                  className="text-[var(--accent)] mb-2 mx-auto group-hover:scale-110 transition-transform duration-300"
                />
                <p className="text-xs font-bold mb-0.5">{label}</p>
                <p className="text-[10px] text-[var(--muted)] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </header>

        {/* Tool Section */}
        <main className="container mx-auto px-6 pb-24">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                  <Sparkles size={18} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-none">
                    Humanizer Workspace
                  </h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    Paste, choose a style, humanize
                  </p>
                </div>
              </div>

              <AIHumanizerTool />
            </div>
          </div>
        </main>

        {/* FAQ Section */}
        <section className="container mx-auto px-6 pb-28">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3">
              Frequently asked
              <span className="text-[var(--accent)]"> questions</span>
              <span className="text-[var(--muted)]">.</span>
            </h2>
            <p className="text-center text-[var(--muted)] italic text-sm mb-12 opacity-70">
              Everything you need to know about the AI humanizer
            </p>

            <div className="space-y-4">
              {FAQS.map(({ q, a }) => (
                <div
                  key={q}
                  className="border border-[var(--border)] rounded-2xl p-6 bg-[var(--card)]/10 hover:border-[var(--accent)]/30 transition-all duration-300"
                >
                  <h3 className="text-base font-bold mb-3 leading-snug">{q}</h3>
                  <p className="text-sm text-[var(--muted)] leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA / info */}
        <section className="border-t border-[var(--border)] py-16">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <ShieldCheck
              size={28}
              className="text-[var(--accent)] mx-auto mb-4"
            />
            <h3 className="text-xl font-bold mb-2">
              Privacy-first by design
            </h3>
            <p className="text-sm text-[var(--muted)] leading-relaxed">
              We never store, log, or train on the text you paste. Your content
              is sent directly to Groq&apos;s API and returned to you — nothing
              persists on our servers.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
