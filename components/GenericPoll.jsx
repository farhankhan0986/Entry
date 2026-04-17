"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function GenericPoll({ question, option1, option2, vote1, vote2 }) {
    const [voted, setVoted] = useState(false);
    const [animated, setAnimated] = useState(false);
    const [votes, setVotes] = useState({ opt1: vote1, opt2: vote2 });

    const handleVote = (choice) => {
        if (voted) return;
        setVotes((prev) => ({ ...prev, [choice]: prev[choice] + 1 }));
        setVoted(true);
    };

    // Two-step trick: render at 0% first, then set animated=true after
    // one paint so the browser sees a width change and plays the transition
    useEffect(() => {
        if (voted) {
            const t = setTimeout(() => setAnimated(true), 30);
            return () => clearTimeout(t);
        } else {
            setAnimated(false);
        }
    }, [voted]);

    const total = votes.opt1 + votes.opt2;
    const getPct = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

    const results = [
        { ...option1, key: "opt1", pct: getPct(votes.opt1) },
        { ...option2, key: "opt2", pct: getPct(votes.opt2) },
    ];

    return (
        <div className="my-12 p-8 border border-[var(--border)] rounded-[32px] bg-[var(--card)]/10 shadow-sm max-w-lg mx-auto font-playfair relative overflow-hidden">

            {/* Decorative Accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent)]/5 rounded-bl-full -mr-6 -mt-6 pointer-events-none" />

            {/* Header */}
            <div className="text-center mb-8 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-[var(--accent)]">
                    Public Reflection
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] leading-tight px-4">
                    {question}
                </h3>
            </div>

            {/* Options */}
            <div className="space-y-4">
                {results.map((opt) => (
                    <div key={opt.key}>
                        <button
                            disabled={voted}
                            onClick={() => handleVote(opt.key)}
                            className={`w-full h-18 group relative flex flex-col items-start p-5 rounded-2xl border overflow-hidden transition-colors duration-300 ${
                                voted
                                    ? "border-[var(--border)] cursor-default"
                                    : "border-[var(--border)] bg-transparent hover:border-[var(--accent)] active:scale-[0.99]"
                            }`}
                        >
                            {/* ── Wave fill: always rendered at 0%, animates to pct% on vote ── */}
                            <div
                                className="absolute inset-y-0 left-0 z-0"
                                style={{
                                    width: animated ? `${opt.pct}%` : "0%",
                                    backgroundColor: opt.color || "var(--accent)",
                                    opacity: 0.12,
                                    transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
                                    borderRadius: "inherit",
                                }}
                            />

                            {/* Label row */}
                            <div className="w-full flex justify-between items-center z-10 relative">
                                <span className={`text-lg font-bold text-[var(--foreground)] transition-transform duration-300 ${!voted && "group-hover:translate-x-1"}`}>
                                    {opt.name}
                                </span>

                                {/* Percentage — fades in after bar finishes */}
                                <span
                                    className="text-xl font-black tabular-nums z-10"
                                    style={{
                                        color: opt.color || "var(--accent)",
                                        opacity: animated ? 1 : 0,
                                        transition: "opacity 0.4s ease",
                                        transitionDelay: animated ? "0.9s" : "0s",
                                        minWidth: "3ch",
                                        textAlign: "right",
                                    }}
                                >
                                    {voted ? `${opt.pct}%` : ""}
                                </span>
                            </div>

                            {/* ── Progress bar: always rendered at 0%, animates to pct% on vote ── */}
                            <div className="w-full bg-[var(--border)]/40 h-[2px] mt-3 relative overflow-hidden rounded-full z-10">
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        left: 0,
                                        width: animated ? `${opt.pct}%` : "0%",
                                        height: "100%",
                                        backgroundColor: opt.color || "var(--accent)",
                                        borderRadius: "9999px",
                                        transition: "width 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
                                    }}
                                />
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            {/* Reset */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => {
                        setVoted(false);
                        setVotes({ opt1: vote1, opt2: vote2 });
                    }}
                    className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <RotateCcw size={12} className="group-hover:rotate-[-45deg] transition-transform duration-300" />
                    Reset Perspective
                </button>
            </div>

            {/* Status */}
            <div className="mt-6 pt-6 border-t border-[var(--border)]/50 flex justify-center">
                {voted ? (
                    <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest animate-in fade-in zoom-in-95">
                        <CheckCircle2 size={14} />
                        Reflection Captured
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[10px] uppercase tracking-widest">
                        <CheckCircle2 size={14} />
                        Cast your vote
                    </div>
                )}
            </div>
        </div>
    );
}