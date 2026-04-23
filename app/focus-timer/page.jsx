import FocusTimerTool from "@/components/FocusTimerTool";
import Link from "next/link";
import { ArrowLeft, Timer, Brain, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Focus Timer | Pomodoro Technique | Entry",
  description: "A minimalist Pomodoro focus timer to help you enter deep work, minimize distractions, and track your productivity sessions.",
  alternates: { canonical: "https://entry-azure.vercel.app/focus-timer" },
  openGraph: {
    title: "Focus Timer | Pomodoro Technique | Entry",
    description: "A minimalist Pomodoro focus timer to help you enter deep work, minimize distractions, and track your productivity sessions.",
    url: "https://entry-azure.vercel.app/focus-timer",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
};

const features = [
  { icon: Brain, label: "Deep Work", desc: "25-minute focus blocks" },
  { icon: Timer, label: "Structured Breaks", desc: "Avoid burnout" },
  { icon: CheckCircle2, label: "Session Tracking", desc: "See what you accomplish" },
];

export default function FocusTimerPage() {
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
            <Timer className="w-6 h-6 text-[var(--accent)]" />
            <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
              Productivity Tool
            </p>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
            Focus
            <br />
            <span className="text-[var(--accent)]">Timer</span>
            <span className="text-[var(--muted)]">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
            Enter a state of flow. A minimalist Pomodoro timer designed for deep work and structured reflection.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {features.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="rounded-2xl border border-[var(--border)] p-5 bg-[var(--card)]/10 text-center flex flex-col items-center gap-2"
            >
              <Icon size={20} className="text-[var(--accent)]" />
              <p className="text-sm font-bold text-[var(--foreground)]">{label}</p>
              <p className="text-xs text-[var(--muted)]">{desc}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Tool */}
      <main className="container mx-auto px-6 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
            <FocusTimerTool />
          </div>
        </div>
      </main>
    </div>
  );
}
