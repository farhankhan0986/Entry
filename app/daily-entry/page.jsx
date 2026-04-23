import DailyEntryTool from "@/components/DailyEntryTool";
import Link from "next/link";
import { ArrowLeft, BookOpen, PenTool, BrainCircuit } from "lucide-react";

export const metadata = {
  title: "Daily Entry Habit Tracker | Entry",
  description: "A minimalist daily journaling tool. Write one line a day, build a streak, and track your thoughts over time.",
  alternates: { canonical: "https://entry-azure.vercel.app/daily-entry" },
  openGraph: {
    title: "Daily Entry Habit Tracker | Entry",
    description: "A minimalist daily journaling tool. Write one line a day, build a streak, and track your thoughts over time.",
    url: "https://entry-azure.vercel.app/daily-entry",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
};

const features = [
  { icon: PenTool, label: "One Line a Day", desc: "Keep it simple. No pressure." },
  { icon: Zap, label: "Build Streaks", desc: "Stay consistent with visual streaks." },
  { icon: BrainCircuit, label: "Private", desc: "Stored locally in your browser." },
];
import { Zap } from "lucide-react";

export default function DailyEntryPage() {
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
            <BookOpen className="w-6 h-6 text-[var(--accent)]" />
            <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
              Habit Tracker
            </p>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
            Daily
            <br />
            <span className="text-[var(--accent)]">Entry</span>
            <span className="text-[var(--muted)]">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
            A minimalist space to write one line a day. Build the habit of reflection without the pressure of a blank page.
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
            <DailyEntryTool />
          </div>
        </div>
      </main>
    </div>
  );
}
