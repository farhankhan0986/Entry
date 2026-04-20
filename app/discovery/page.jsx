// app/discovery/page.jsx
import DiscoveryTool from "@/components/DiscoveryTool";
import { ArrowLeft, Brain, Crown, Shield, Star, Moon, Flame, Wind, Telescope } from "lucide-react";
import Link from "next/link";

export const metadata = {
    title: "The Reflection Engine | Entry",
    description: "Discover your personality archetype — Alpha, Beta, or Gamma — and uncover your social type, mind style, and leadership traits.",
};

const archetypes = [
    {
        icon: Crown,
        color: "#ef4444",
        bg: "rgba(239,68,68,0.12)",
        title: "Alpha",
        desc: "Commands rooms. Leads from the front. Driven by ambition and presence.",
    },
    {
        icon: Shield,
        color: "#6366f1",
        bg: "rgba(99,102,241,0.1)",
        title: "Beta",
        desc: "Builds trust. Leads through empathy. The backbone of every great team.",
    },
    {
        icon: Star,
        color: "#10b981",
        bg: "rgba(16,185,129,0.1)",
        title: "Gamma",
        desc: "Masters craft. Self-directed. Defines success on their own terms.",
    },
];

const socialTypes = [
    { icon: Moon, color: "#818cf8", title: "Introvert", desc: "Thinks deeply. Recharges alone." },
    { icon: Flame, color: "#f97316", title: "Extrovert", desc: "Energizes others. Thrives socially." },
    { icon: Wind, color: "#06b6d4", title: "Ambivert", desc: "Fluid. Moves between both worlds." },
];

export default function DiscoveryPage() {
    return (
        <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">

            {/* ─── Hero ────────────────────────────────────────────────────────────── */}
            <header className="container mx-auto px-6 pt-16 pb-12">
                <Link
                    href="/journal"
                    className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
                >
                    <ArrowLeft size={14} /> Back to Journal
                </Link>

                <div className="w-full flex flex-col items-center justify-center mb-24">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <Telescope className="w-6 h-6 text-[var(--accent)]" />
                        <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
                            Personality Discovery
                        </p>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
                        The Reflection<br />
                        <span className="text-[var(--accent)]">Engine</span>
                        <span className="text-[var(--muted)]">.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
                        15 questions. Your full personality map — archetype, social type, leadership style,
                        mindset, and temperament. No sign-up. Pure reflection.
                    </p>
                </div>
            </header>

            {/* ─── Archetype Preview Strip ─────────────────────────────────────────── */}
            <section className="container flex items-center justify-center mx-auto px-6 mb-16">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
                    {archetypes.map((a) => {
                        const Icon = a.icon;
                        return (
                            <div
                                key={a.title}
                                className="rounded-3xl border p-6 flex items-start gap-4"
                                style={{ background: a.bg, borderColor: a.color }}
                            >
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ background: a.bg, border: `1px solid ${a.color}` }}
                                >
                                    <Icon size={18} style={{ color: a.color }} />
                                </div>
                                <div>
                                    <p className="font-bold text-lg" style={{ color: a.color }}>{a.title}</p>
                                    <p className="text-xs text-[var(--muted)] leading-relaxed mt-0.5">{a.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── Main Quiz ───────────────────────────────────────────────────────── */}
            <main className="container flex items-center justify-center mx-auto px-6 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 max-w-5xl">

                    {/* Quiz */}
                    <div>
                        <DiscoveryTool />
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-5">

                        {/* Social types */}
                        <div className="border border-[var(--border)] rounded-3xl p-6 bg-[var(--card)]/10">
                            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--muted)] mb-4">Social Types</p>
                            <div className="space-y-4">
                                {socialTypes.map((s) => {
                                    const Icon = s.icon;
                                    return (
                                        <div key={s.title} className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                                                <Icon size={16} style={{ color: s.color }} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm" style={{ color: s.color }}>{s.title}</p>
                                                <p className="text-[11px] text-[var(--muted)]">{s.desc}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* What you'll discover */}
                        <div className="border border-[var(--border)] rounded-3xl p-6 bg-[var(--card)]/10">
                            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--muted)] mb-4">What You'll Discover</p>
                            <ul className="space-y-3">
                                {[
                                    { label: "Archetype", detail: "Alpha · Beta · Gamma" },
                                    { label: "Social Type", detail: "Introvert · Extrovert · Ambivert" },
                                    { label: "Mind Style", detail: "Analytical or Creative" },
                                    { label: "Leader Style", detail: "Visionary or Pragmatist" },
                                    { label: "Temperament", detail: "Bold or Calm" },
                                    { label: "Group Role", detail: "Leader or Collaborator" },
                                ].map((item) => (
                                    <li key={item.label} className="flex items-start gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                                        <div>
                                            <p className="text-sm font-bold">{item.label}</p>
                                            <p className="text-[11px] text-[var(--muted)]">{item.detail}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Quote */}
                        <div className="border border-[var(--border)] rounded-3xl p-6 bg-[var(--card)]/10">
                            <Brain size={20} className="text-[var(--accent)] mb-3" />
                            <p className="text-sm italic text-[var(--muted)] leading-relaxed">
                                "Know yourself and you will win all battles. This engine is your mirror — not your judge."
                            </p>
                        </div>

                    </aside>
                </div>
            </main>

        </div>
    );
}