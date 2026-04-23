import PromptOptimizer from "@/components/PromptOptimizer";
import Link from "next/link";
import { ArrowLeft, Wand2, Sparkles, Zap, Target, FileText, MessageSquare } from "lucide-react";

export const metadata = {
  title: "AI Prompt Optimizer | Refine Your ChatGPT & Claude Prompts | Entry",
  description:
    "Paste any basic prompt and get a professionally refined version for ChatGPT, Claude, or any AI model. Free AI prompt optimizer powered by Groq — no sign-up required.",
  alternates: { canonical: "https://entry-azure.vercel.app/prompt-optimizer" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app/prompt-optimizer",
    siteName: "Entry",
    title: "AI Prompt Optimizer | Refine Your ChatGPT & Claude Prompts | Entry",
    description:
      "Paste any basic prompt and get a professionally refined version for ChatGPT, Claude, or any AI model. Free AI prompt optimizer powered by Groq — no sign-up required.",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Prompt Optimizer | Entry",
    description:
      "Paste any basic prompt and get a professionally refined version for ChatGPT, Claude, or any AI model.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

const features = [
  {
    icon: Target,
    label: "Goal Clarity",
    desc: "Makes your intent crystal clear",
  },
  {
    icon: Wand2,
    label: "Role Assignment",
    desc: "Adds expert persona context",
  },
  {
    icon: FileText,
    label: "Output Format",
    desc: "Specifies structure and length",
  },
  {
    icon: MessageSquare,
    label: "Tone Guidance",
    desc: "Sets the right voice & style",
  },
  {
    icon: Sparkles,
    label: "Specificity",
    desc: "Removes vague language",
  },
  {
    icon: Zap,
    label: "Constraints",
    desc: "Prevents unwanted outputs",
  },
];

export default function PromptOptimizerPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
      {/* Hero */}
      <header className="container mx-auto px-6 pt-16 pb-12">
        <Link
          href="/journal"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={14} /> Back to Journal
        </Link>

        <div className="w-full flex flex-col items-center justify-center mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Wand2 className="w-6 h-6 text-[var(--accent)]" />
            <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
              AI Tool
            </p>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
            Prompt
            <br />
            <span className="text-[var(--accent)]">Optimizer</span>
            <span className="text-[var(--muted)]">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
            Paste a basic prompt. Get a refined, structured version that gets
            dramatically better results from ChatGPT or Claude.
          </p>

          <div className="flex items-center gap-2 mt-6 text-xs font-bold uppercase tracking-widest text-[var(--muted)]">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
            Powered by Groq · Llama 3.3 70B
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 max-w-5xl mx-auto">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)]/10 hover:border-[var(--accent)]/50 transition-all duration-300 group text-center"
            >
              <Icon
                size={18}
                className="text-[var(--accent)] mb-2 mx-auto group-hover:scale-110 transition-transform duration-300"
              />
              <p className="text-xs font-bold mb-0.5">{label}</p>
              <p className="text-[10px] text-[var(--muted)] leading-snug">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </header>

      {/* Tool */}
      <main className="container mx-auto px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                <Wand2 size={18} className="text-[var(--accent)]" />
              </div>
              <div>
                <h2 className="text-xl font-bold leading-none">
                  Prompt Workspace
                </h2>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Paste, optimize, and copy
                </p>
              </div>
            </div>
            <PromptOptimizer />
          </div>
        </div>
      </main>
    </div>
  );
}
