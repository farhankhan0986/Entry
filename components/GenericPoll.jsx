"use client";
import { useState } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function GenericPoll({ question, option1, option2, vote1, vote2 }) {
    const [voted, setVoted] = useState(false);
    const [votes, setVotes] = useState({ opt1: vote1, opt2: vote2 });

    const handleVote = (choice) => {
        if (voted) return;
        setVotes((prev) => ({
            ...prev,
            [choice]: prev[choice] + 1
        }));
        setVoted(true);
    };

    const total = votes.opt1 + votes.opt2;
    const getPct = (count) => (total === 0 ? 0 : Math.round((count / total) * 100));

    const results = [
        { ...option1, key: "opt1", pct: getPct(votes.opt1) },
        { ...option2, key: "opt2", pct: getPct(votes.opt2) },
    ];

    return (
        <div className="my-12 p-8 border border-[var(--border)] rounded-[32px] bg-[var(--card)]/10 shadow-sm max-w-lg mx-auto font-playfair relative overflow-hidden">

            {/* Decorative Accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent)]/5 rounded-bl-full -mr-6 -mt-6" />

            <div className="text-center mb-8 space-y-1">
                <span className="text-[9px] uppercase tracking-[0.4em] font-bold text-[var(--accent)]">
                    Public Reflection
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] leading-tight px-4">
                    {question}
                </h3>
            </div>

            <div className="space-y-4">
                {results.map((opt) => (
                    <div key={opt.key} className="relative">
                        <button
                            disabled={voted}
                            onClick={() => handleVote(opt.key)}
                            className={`w-full h- group relative flex flex-col items-start p-5 rounded-2xl border transition-all duration-500 overflow-hidden ${voted
                                ? "border-[var(--border)] cursor-default"
                                : "border-[var(--border)] bg-transparent hover:border-[var(--accent)] active:scale-[0.99]"
                                }`}
                        >
                            {voted && (
                                <div
                                    className="absolute inset-0 transition-all duration-1000 ease-out z-0"
                                    style={{
                                        width: `${opt.pct}%`,
                                        backgroundColor: opt.color || 'var(--accent)',
                                        opacity: 0.08
                                    }}
                                />
                            )}

                            <div className="w-full flex justify-between items-center z-10 relative">
                                <span className={`text-lg font-bold transition-all ${voted ? "text-[var(--foreground)]" : "group-hover:translate-x-1"}`}>
                                    {opt.name}
                                </span>

                                {voted && (
                                    <span className="text-xl font-black text-[var(--foreground)] tabular-nums animate-in fade-in duration-700">
                                        {opt.pct}%
                                    </span>
                                )}
                            </div>

                            {voted && (
                                <div className="w-full bg-[var(--border)]/40 h-[1.5px] mt-3 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-1000 ease-in-out"
                                        style={{ width: `${opt.pct}%` }}
                                    />
                                </div>
                            )}
                            {!voted && (
                                <div className="w-full bg-[var(--border)]/40 h-[1.5px] mt-3 relative overflow-hidden">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-1000 ease-in-out"
                                    // style={{ width: `${opt.pct}%` }}
                                    />
                                </div>
                            )}
                        </button>
                    </div>
                ))}
            </div>

            {/* Refined Reset Action */}
            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => {
                        // 1. Un-mark the user as 'voted'
                        setVoted(false);

                        // 2. Reset the state back to your starting numbers
                        // This automatically makes 'total' update because total = opt1 + opt2
                        setVotes({ opt1: vote1, opt2: vote2 });
                    }}
                    className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <RotateCcw size={12} className="group-hover:rotate-[-45deg] transition-transform duration-300" />
                    Reset Perspective
                </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]/50 flex flex-col items-center gap-3">
                {/* <div className="flex items-center gap-2 text-xs text-[var(--muted)] italic">
                    <span className="font-bold not-italic text-[var(--foreground)]">{total.toLocaleString()}</span> entries recorded
                </div> */}

                {voted && (
                    <div className="flex items-center gap-2 text-green-500 font-bold text-[10px] uppercase tracking-widest animate-in fade-in zoom-in-95">
                        <CheckCircle2 size={14} />
                        Reflection Captured
                    </div>
                )}
                {!voted && (
                    <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-[10px] uppercase tracking-widest animate-in fade-in zoom-in-95">
                        <CheckCircle2 size={14} />
                        Cast your vote
                    </div>
                )}
            </div>
        </div>
    );
}