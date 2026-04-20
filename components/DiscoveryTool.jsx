// components/DiscoveryTool.jsx
"use client";
import { useState, useEffect, useRef } from "react";
import {
    RotateCcw, Sparkles, Share2, Check, Brain, Zap, Moon,
    Users, Shield, Crown, Flame, Leaf, Wind, Mountain, Star,
    Heart, Target, Lightbulb, Eye, ArrowRight, Trophy, Sword, Feather
} from "lucide-react";

// ─── Question Bank (15 questions, 6 trait axes) ───────────────────────────────
// Axes: I/E (Introvert/Extrovert), V/P (Visionary/Pragmatist),
//       A/C (Analytical/Creative), L/F (Leader/Follower),
//       Alpha/Beta/Gamma score, Bold/Calm temperament
const questions = [
    {
        id: 1,
        q: "After a long, exhausting week — what truly restores you?",
        emoji: "🌙",
        a: [
            { txt: "Deep silence, alone with my thoughts", traits: { I: 2 } },
            { txt: "Sometimes alone, sometimes with close people", traits: { I: 1, E: 1 } },
            { txt: "Being surrounded by energy and people", traits: { E: 2 } },
        ],
    },
    {
        id: 2,
        q: "When you walk into a room full of strangers, you naturally…",
        emoji: "🚪",
        a: [
            { txt: "Observe quietly and wait to be approached", traits: { I: 2, Calm: 1 } },
            { txt: "Find one interesting person and connect", traits: { I: 1, E: 1 } },
            { txt: "Introduce yourself confidently to multiple people", traits: { E: 2, Alpha: 1, Bold: 1 } },
        ],
    },
    {
        id: 3,
        q: "You have a massive, undefined project ahead. Your first instinct?",
        emoji: "🗺️",
        a: [
            { txt: "Map out the entire vision first — then execute", traits: { V: 2, Alpha: 1 } },
            { txt: "Find the most critical task and dive in", traits: { P: 2, Bold: 1 } },
            { txt: "Brainstorm freely and see what emerges", traits: { C: 2 } },
        ],
    },
    {
        id: 4,
        q: "When you face a major setback or failure, your inner voice says…",
        emoji: "💥",
        a: [
            { txt: "Break it down — what can I learn?", traits: { A: 2, V: 1, Alpha: 1 } },
            { txt: "Feel it fully, then push forward", traits: { Bold: 1, Gamma: 1 } },
            { txt: "Reevaluate — maybe the goal needs to change", traits: { P: 2, Beta: 1 } },
        ],
    },
    {
        id: 5,
        q: "In a group that needs a decision, you tend to…",
        emoji: "🧭",
        a: [
            { txt: "Step up and guide the process", traits: { L: 2, Alpha: 2 } },
            { txt: "Contribute ideas but let others decide", traits: { L: 1, Beta: 1 } },
            { txt: "Support whatever the group decides", traits: { F: 2, Beta: 1 } },
        ],
    },
    {
        id: 6,
        q: "Your hidden superpower is most likely…",
        emoji: "✨",
        a: [
            { txt: "Seeing patterns and connections others miss", traits: { A: 2, V: 1 } },
            { txt: "Inspiring people to move and believe", traits: { E: 1, Alpha: 1, Bold: 1 } },
            { txt: "Keeping calm when everything is on fire", traits: { Calm: 2, Beta: 1 } },
        ],
    },
    {
        id: 7,
        q: "Your ideal creative environment looks like…",
        emoji: "🎨",
        a: [
            { txt: "Solo, deep work — headphones on, world off", traits: { I: 2, A: 1 } },
            { txt: "A small trusted team feeding off each other", traits: { I: 1, E: 1, C: 1 } },
            { txt: "Open, loud, collaborative chaos", traits: { E: 2, C: 1 } },
        ],
    },
    {
        id: 8,
        q: "When someone challenges your idea publicly, you…",
        emoji: "⚡",
        a: [
            { txt: "Defend it with logic and data", traits: { A: 2, Alpha: 1, Bold: 1 } },
            { txt: "Stay open — they might have a point", traits: { Beta: 2, Calm: 1 } },
            { txt: "Find a creative middle-ground", traits: { C: 1, Gamma: 1 } },
        ],
    },
    {
        id: 9,
        q: "How do you move through high-pressure situations?",
        emoji: "🌊",
        a: [
            { txt: "Ice cold. Pressure makes me sharper", traits: { Alpha: 2, Bold: 2 } },
            { txt: "I manage — I've built mental tools for it", traits: { Beta: 1, A: 1, Calm: 1 } },
            { txt: "I step back, breathe, and find my rhythm", traits: { Gamma: 1, Calm: 2 } },
        ],
    },
    {
        id: 10,
        q: "You prefer to solve problems by…",
        emoji: "🔍",
        a: [
            { txt: "Deep research and structured analysis", traits: { A: 2, P: 1 } },
            { txt: "Intuition and creative leaps", traits: { C: 2, V: 1 } },
            { txt: "Testing quickly and iterating fast", traits: { P: 2, Bold: 1 } },
        ],
    },
    {
        id: 11,
        q: "What drives you more than anything?",
        emoji: "🔥",
        a: [
            { txt: "Legacy — being remembered for something great", traits: { Alpha: 2, V: 1 } },
            { txt: "Mastery — being truly excellent at what I do", traits: { A: 1, Gamma: 1, P: 1 } },
            { txt: "Harmony — peace, balance, and connection", traits: { Beta: 2, I: 1, Calm: 1 } },
        ],
    },
    {
        id: 12,
        q: "Your relationship with rules and systems is…",
        emoji: "📐",
        a: [
            { txt: "I respect them — they exist for a reason", traits: { Beta: 2, P: 1 } },
            { txt: "I break them strategically when needed", traits: { Alpha: 1, Bold: 2 } },
            { txt: "I rewrite them when they're broken", traits: { V: 2, C: 1, Gamma: 1 } },
        ],
    },
    {
        id: 13,
        q: "When you listen to someone, you're mostly…",
        emoji: "👂",
        a: [
            { txt: "Analyzing their words carefully", traits: { A: 2, I: 1 } },
            { txt: "Feeling the emotion behind them", traits: { C: 1, Beta: 1, Calm: 1 } },
            { txt: "Already forming a response or solution", traits: { Bold: 1, P: 1, Alpha: 1 } },
        ],
    },
    {
        id: 14,
        q: "You would describe your energy as…",
        emoji: "💫",
        a: [
            { txt: "Focused and intense — burns slow, burns deep", traits: { I: 1, A: 1, Gamma: 1 } },
            { txt: "Magnetic and explosive — sparks at the right time", traits: { Alpha: 2, E: 1 } },
            { txt: "Steady and warm — people feel safe around me", traits: { Beta: 2, Calm: 1 } },
        ],
    },
    {
        id: 15,
        q: "In 10 years, your ideal self is…",
        emoji: "🌟",
        a: [
            { txt: "Leading something that changes an industry", traits: { Alpha: 2, L: 2, V: 1 } },
            { txt: "The world's best at one specific craft", traits: { Gamma: 2, A: 1, P: 1 } },
            { txt: "Living intentionally with deep relationships", traits: { Beta: 2, I: 1, Calm: 1 } },
        ],
    },
];

// ─── Personality Computation ───────────────────────────────────────────────────
function computeResult(answers) {
    // Social type
    const socialType =
        answers.I > answers.E + 2
            ? "Introvert"
            : answers.E > answers.I + 2
                ? "Extrovert"
                : "Ambivert";

    // Archetype
    const maxArchetype = Math.max(answers.Alpha, answers.Beta, answers.Gamma);
    const archetype =
        answers.Alpha === maxArchetype
            ? "Alpha"
            : answers.Beta === maxArchetype
                ? "Beta"
                : "Gamma";

    // Mind style
    const mindStyle = answers.A >= answers.C ? "Analytical" : "Creative";

    // Leadership
    const leaderStyle =
        answers.V > answers.P ? "Visionary" : "Pragmatist";

    // Temperament
    const temperament = answers.Bold >= answers.Calm ? "Bold" : "Calm";

    // Leadership role
    const leadership = answers.L > answers.F + 1 ? "Natural Leader" : "Strategic Collaborator";

    return { socialType, archetype, mindStyle, leaderStyle, temperament, leadership };
}

// ─── Archetype meta ────────────────────────────────────────────────────────────
const archetypeMeta = {
    Alpha: {
        icon: Crown,
        color: "#ef4444",
        bg: "rgba(239,68,68,0.12)",
        label: "The Alpha",
        desc: "You lead from the front. Driven by ambition, presence, and the will to dominate any room. People naturally follow your energy.",
        traits: ["Natural Authority", "High Ambition", "Commanding Presence", "Risk Taker"],
    },
    Beta: {
        icon: Shield,
        color: "#6366f1",
        bg: "rgba(99,102,241,0.12)",
        label: "The Beta",
        desc: "You lead through trust. Your strength is reliability, emotional intelligence, and building the systems that let others thrive.",
        traits: ["Deep Loyalty", "High Empathy", "Systems Thinker", "Peacekeeper"],
    },
    Gamma: {
        icon: Star,
        color: "#10b981",
        bg: "rgba(16,185,129,0.12)",
        label: "The Gamma",
        desc: "You lead through mastery. Independent, self-aware, and driven by excellence. You define your own success metrics.",
        traits: ["Master of Craft", "Self-Directed", "Deep Thinker", "Unconventional"],
    },
};

const socialMeta = {
    Introvert: { icon: Moon, color: "#818cf8", label: "Introvert", desc: "You think deeply, speak carefully, and recharge alone." },
    Extrovert: { icon: Flame, color: "#f97316", label: "Extrovert", desc: "You energize others, thrive in social settings, and think out loud." },
    Ambivert: { icon: Wind, color: "#06b6d4", label: "Ambivert", desc: "Fluid and adaptable — you move between worlds effortlessly." },
};

const mindMeta = {
    Analytical: { icon: Brain, color: "#8b5cf6", label: "Analytical Mind" },
    Creative: { icon: Lightbulb, color: "#eab308", label: "Creative Mind" },
};

const leaderMeta = {
    Visionary: { icon: Eye, color: "#ec4899", label: "Visionary Leader" },
    Pragmatist: { icon: Target, color: "#14b8a6", label: "Pragmatist Leader" },
};

const tempMeta = {
    Bold: { icon: Sword, color: "#ef4444", label: "Bold Temperament" },
    Calm: { icon: Feather, color: "#64748b", label: "Calm Temperament" },
};

const leadershipMeta = {
    "Natural Leader": { icon: Trophy, color: "#f59e0b", label: "Natural Leader" },
    "Strategic Collaborator": { icon: Users, color: "#6366f1", label: "Strategic Collaborator" },
};

// ─── Confetti Particle ─────────────────────────────────────────────────────────
function ConfettiParticle({ color, delay, x }) {
    return (
        <div
            className="confetti-particle"
            style={{
                position: "absolute",
                left: `${x}%`,
                top: "-10px",
                width: "8px",
                height: "8px",
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                background: color,
                animationDelay: `${delay}ms`,
            }}
        />
    );
}

// ─── Progress Bar ──────────────────────────────────────────────────────────────
function ProgressBar({ current, total }) {
    const pct = Math.round((current / total) * 100);
    return (
        <div className="w-full mb-8">
            <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)] mb-2">
                <span>Progress</span>
                <span>{pct}%</span>
            </div>
            <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[var(--accent)] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

// ─── Trait Badge ───────────────────────────────────────────────────────────────
function TraitBadge({ icon: Icon, label, color, bg }) {
    return (
        <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold"
            style={{ color, borderColor: color, background: bg || `${color}15` }}
        >
            <Icon size={15} />
            <span>{label}</span>
        </div>
    );
}

// ─── Result Card Section ───────────────────────────────────────────────────────
function ResultSection({ title, children }) {
    return (
        <div className="border border-[var(--border)] rounded-3xl p-6 mb-4" style={{ background: "var(--card)" }}>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--muted)] mb-3">{title}</p>
            {children}
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function DiscoveryTool() {
    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState({
        I: 0, E: 0, V: 0, P: 0, A: 0, C: 0, L: 0, F: 0,
        Alpha: 0, Beta: 0, Gamma: 0, Bold: 0, Calm: 0,
    });
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [revealing, setRevealing] = useState(false);
    const [confetti, setConfetti] = useState([]);
    const [animStep, setAnimStep] = useState(0); // for staggered reveal
    const [selected, setSelected] = useState(null); // highlight selected answer
    const containerRef = useRef(null);

    const total = questions.length;

    const handleSelect = (traits, idx) => {
        if (selected !== null) return; // prevent double-click
        setSelected(idx);

        setTimeout(() => {
            const next = { ...answers };
            Object.entries(traits).forEach(([k, v]) => {
                next[k] = (next[k] || 0) + v;
            });

            setSelected(null);
            if (step < total - 1) {
                setAnswers(next);
                setStep((s) => s + 1);
            } else {
                setAnswers(next);
                triggerReveal(next);
            }
        }, 420);
    };

    const triggerReveal = (finalAnswers) => {
        setRevealing(true);
        // spawn confetti
        const particles = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            color: ["#f59e0b", "#6366f1", "#10b981", "#ec4899", "#06b6d4", "#ef4444"][i % 6],
            delay: Math.random() * 800,
            x: Math.random() * 100,
        }));
        setConfetti(particles);

        setTimeout(() => {
            const res = computeResult(finalAnswers);
            setResult(res);
            setRevealing(false);
            setConfetti([]);
            // stagger sections into view
            let i = 0;
            const iv = setInterval(() => {
                setAnimStep((s) => s + 1);
                i++;
                if (i >= 6) clearInterval(iv);
            }, 180);
        }, 1800);
    };

    const reset = () => {
        setStep(0);
        setResult(null);
        setAnimStep(0);
        setCopied(false);
        setAnswers({ I: 0, E: 0, V: 0, P: 0, A: 0, C: 0, L: 0, F: 0, Alpha: 0, Beta: 0, Gamma: 0, Bold: 0, Calm: 0 });
    };

    // ── Revealing loader ────────────────────────────────────────────────────────
    if (revealing) {
        return (
            <div className="relative overflow-hidden bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-16 text-center shadow-sm min-h-[400px] flex flex-col items-center justify-center">
                {confetti.map((p) => (
                    <ConfettiParticle key={p.id} {...p} />
                ))}
                <div className="relative">
                    <Sparkles className="text-[var(--accent)] animate-spin mb-6 mx-auto" size={48} />
                </div>
                <p className="text-2xl font-bold animate-pulse">Decoding your nature…</p>
                <p className="text-[var(--muted)] mt-3 text-sm italic">Mapping your personality profile</p>
                <style>{`
          @keyframes fall {
            0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
            100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
          }
          .confetti-particle { animation: fall 1.8s ease-in forwards; }
        `}</style>
            </div>
        );
    }

    // ── Result view ─────────────────────────────────────────────────────────────
    if (result) {
        const arch = archetypeMeta[result.archetype];
        const social = socialMeta[result.socialType];
        const mind = mindMeta[result.mindStyle];
        const leader = leaderMeta[result.leaderStyle];
        const temp = tempMeta[result.temperament];
        const leadership = leadershipMeta[result.leadership];
        const ArchIcon = arch.icon;
        const SocialIcon = social.icon;

        const shareText = `My personality profile:\n✦ ${arch.label} ${result.archetype}\n✦ ${result.socialType}\n✦ ${mind.label}\n✦ ${leader.label}\n✦ ${leadership.label}\nDiscover yours at Entry.`;

        const visibleSections = animStep;

        return (
            <div className="space-y-4">
                {/* Hero Archetype Card */}
                <div
                    className={`relative overflow-hidden rounded-[40px] p-8 md:p-12 text-center border transition-all duration-700 ${visibleSections >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                    style={{ background: arch.bg, borderColor: arch.color }}
                >
                    <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 50% 0%, ${arch.color}, transparent 70%)` }} />
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border-2" style={{ background: arch.bg, borderColor: arch.color }}>
                            <ArchIcon size={36} style={{ color: arch.color }} />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold mb-2" style={{ color: arch.color }}>Your Archetype</p>
                        <h2 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: arch.color }}>{arch.label}</h2>
                        <p className="text-[var(--muted)] italic leading-relaxed max-w-lg mx-auto text-lg">{arch.desc}</p>
                        <div className="flex flex-wrap gap-2 justify-center mt-6">
                            {arch.traits.map((t) => (
                                <span key={t} className="px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider border" style={{ borderColor: arch.color, color: arch.color, background: arch.bg }}>
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Social + Temperament row */}
                <div className={`grid grid-cols-2 gap-4 transition-all duration-700 ${visibleSections >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <ResultSection title="Social Type">
                        <div className="flex items-center justify-center flex-col lg:flex-row gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${social.color}20` }}>
                                <SocialIcon size={20} style={{ color: social.color }} />
                            </div>
                            <div>
                                <p className="font-bold text-xl" style={{ color: social.color }}>{social.label}</p>
                                <p className="text-xs text-[var(--muted)]">{social.desc}</p>
                            </div>
                        </div>
                    </ResultSection>
                    <ResultSection title="Temperament">
                        <div className="flex items-center justify-center flex-col lg:flex-row gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${temp.color}20` }}>
                                <temp.icon size={20} style={{ color: temp.color }} />
                            </div>
                            <p className="font-bold text-xl" style={{ color: temp.color }}>{temp.label}</p>
                        </div>
                    </ResultSection>
                </div>

                {/* Mind + Leadership row */}
                <div className={`grid grid-cols-2 gap-4 transition-all duration-700 ${visibleSections >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <ResultSection title="Mind Style">
                        <div className="flex items-center justify-center flex-col lg:flex-row gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${mind.color}20` }}>
                                <mind.icon size={20} style={{ color: mind.color }} />
                            </div>
                            <p className="font-bold text-xl" style={{ color: mind.color }}>{mind.label}</p>
                        </div>
                    </ResultSection>
                    <ResultSection title="Leader Style">
                        <div className="flex items-center justify-center flex-col lg:flex-row gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${leader.color}20` }}>
                                <leader.icon size={20} style={{ color: leader.color }} />
                            </div>
                            <p className="font-bold text-xl" style={{ color: leader.color }}>{leader.label}</p>
                        </div>
                    </ResultSection>
                </div>

                {/* Leadership Role full width */}
                <div className={`transition-all duration-700 ${visibleSections >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <ResultSection title="Group Role">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${leadership.color}20` }}>
                                <leadership.icon size={20} style={{ color: leadership.color }} />
                            </div>
                            <div>
                                <p className="font-bold text-xl" style={{ color: leadership.color }}>{leadership.label}</p>
                                <p className="text-xs text-[var(--muted)] mt-0.5">
                                    {result.leadership === "Natural Leader"
                                        ? "You step forward under pressure. Others look to you for direction."
                                        : "You amplify teams through insight, trust, and strategic thinking."}
                                </p>
                            </div>
                        </div>
                    </ResultSection>
                </div>

                {/* Full trait summary strip */}
                <div className={`border border-[var(--border)] rounded-3xl p-6 transition-all duration-700 ${visibleSections >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ background: "var(--card)" }}>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-bold text-[var(--muted)] mb-4">Full Trait Profile</p>
                    <div className="flex flex-wrap gap-2">
                        <TraitBadge icon={ArchIcon} label={result.archetype} color={arch.color} />
                        <TraitBadge icon={SocialIcon} label={result.socialType} color={social.color} />
                        <TraitBadge icon={mind.icon} label={result.mindStyle} color={mind.color} />
                        <TraitBadge icon={leader.icon} label={result.leaderStyle} color={leader.color} />
                        <TraitBadge icon={temp.icon} label={result.temperament} color={temp.color} />
                        <TraitBadge icon={leadership.icon} label={result.leadership} color={leadership.color} />
                    </div>
                </div>

                {/* Actions */}
                <div className={`flex gap-3 justify-center pt-2 transition-all duration-700 ${visibleSections >= 6 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                    <button
                        onClick={reset}
                        className="px-6 py-3 rounded-full border border-[var(--border)] text-xs font-bold uppercase tracking-widest hover:bg-[var(--background)] transition-all flex items-center gap-2"
                    >
                        <RotateCcw size={13} /> Take Again
                    </button>
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(shareText);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2500);
                        }}
                        className="btn-primary px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                    >
                        {copied ? <><Check size={13} /> Copied!</> : <><Share2 size={13} /> Share Profile</>}
                    </button>
                </div>
            </div>
        );
    }

    // ── Question view ───────────────────────────────────────────────────────────
    const q = questions[step];
    return (
        <div ref={containerRef} className="bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
            <ProgressBar current={step} total={total} />

            <div className="mb-10 text-center">
                <div className="text-5xl mb-5">{q.emoji}</div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[var(--accent)] mb-3 block">
                    Question {step + 1} of {total}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold leading-tight">{q.q}</h3>
            </div>

            <div className="grid gap-3">
                {q.a.map((opt, i) => (
                    <button
                        key={i}
                        onClick={() => handleSelect(opt.traits, i)}
                        className={`group relative p-6 rounded-2xl border text-left transition-all duration-300 font-semibold text-base md:text-lg overflow-hidden
              ${selected === i
                                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--background)] scale-[1.02]"
                                : selected !== null
                                    ? "opacity-40 cursor-not-allowed border-[var(--border)]"
                                    : "border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--background)] cursor-pointer"
                            }`}
                    >
                        <div className="flex items-center justify-between gap-4">
                            <span>{opt.txt}</span>
                            <ArrowRight
                                size={16}
                                className={`shrink-0 opacity-0 group-hover:opacity-100 transition-opacity ${selected === i ? "opacity-100" : ""}`}
                            />
                        </div>
                    </button>
                ))}
            </div>

            <div className="mt-8 flex justify-center gap-1.5">
                {questions.map((_, i) => (
                    <div
                        key={i}
                        className="h-1 rounded-full transition-all duration-500"
                        style={{
                            width: i === step ? "28px" : "8px",
                            background: i < step ? "var(--accent)" : i === step ? "var(--foreground)" : "var(--border)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}