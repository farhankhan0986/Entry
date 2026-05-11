"use client";
import { useState, useEffect } from "react";
import { CheckCircle2, RotateCcw } from "lucide-react";

export default function GenericPoll({ question, options }) {
    const [voted, setVoted] = useState(false);
    const [animated, setAnimated] = useState(false);

    const [votes, setVotes] = useState(
        options.reduce((acc, item, index) => {
            acc[`opt${index + 1}`] = item.votes;
            return acc;
        }, {})
    );

    const handleVote = (choice) => {
        if (voted) return;

        setVotes((prev) => ({
            ...prev,
            [choice]: prev[choice] + 1,
        }));

        setVoted(true);
    };

    useEffect(() => {
        if (voted) {
            const t = setTimeout(() => setAnimated(true), 30);
            return () => clearTimeout(t);
        } else {
            setAnimated(false);
        }
    }, [voted]);

    const total = Object.values(votes).reduce((sum, val) => sum + val, 0);

    const getPct = (count) =>
        total === 0 ? 0 : Math.round((count / total) * 100);

    const results = options.map((item, index) => ({
        ...item,
        key: `opt${index + 1}`,
        pct: getPct(votes[`opt${index + 1}`]),
    }));

    return (
        <div className="my-12 p-8 border border-[var(--border)] rounded-[32px] bg-[var(--card)]/10 shadow-sm max-w-lg mx-auto font-playfair relative overflow-hidden">

            <div className="absolute top-0 right-0 w-20 h-20 bg-[var(--accent)]/5 rounded-bl-full -mr-6 -mt-6 pointer-events-none" />

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
                    <div key={opt.key}>
                        <button
                            disabled={voted}
                            onClick={() => handleVote(opt.key)}
                            className={`w-full h-[auto] text-left group relative flex flex-col items-start p-5 rounded-2xl border overflow-hidden transition-colors duration-300 ${
                                voted
                                    ? "border-[var(--border)] cursor-default"
                                    : "border-[var(--border)] bg-transparent hover:border-[var(--accent)] active:scale-[0.99]"
                            }`}
                        >
                            <div
                                className="absolute inset-y-0 left-0 z-0"
                                style={{
                                    width: animated ? `${opt.pct}%` : "0%",
                                    backgroundColor: opt.color || "var(--accent)",
                                    opacity: 0.12,
                                    transition:
                                        "width 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
                                    borderRadius: "inherit",
                                }}
                            />

                            <div className="w-full flex justify-between items-center z-10 relative">
                                <span
                                    className={`text-lg font-bold text-[var(--foreground)] transition-transform duration-300 ${
                                        !voted && "group-hover:translate-x-1"
                                    }`}
                                >
                                    {opt.name}
                                </span>

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

                            <div className="w-full bg-[var(--border)]/40 h-[2px] mt-3 relative overflow-hidden rounded-full z-10">
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        left: 0,
                                        width: animated ? `${opt.pct}%` : "0%",
                                        height: "100%",
                                        backgroundColor:
                                            opt.color || "var(--accent)",
                                        borderRadius: "9999px",
                                        transition:
                                            "width 1.1s cubic-bezier(0.16, 1, 0.3, 1)",
                                    }}
                                />
                            </div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center">
                <button
                    onClick={() => {
                        setVoted(false);

                        setVotes(
                            options.reduce((acc, item, index) => {
                                acc[`opt${index + 1}`] = item.votes;
                                return acc;
                            }, {})
                        );
                    }}
                    className="group flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                >
                    <RotateCcw
                        size={12}
                        className="group-hover:rotate-[-45deg] transition-transform duration-300"
                    />
                    Reset Perspective
                </button>
            </div>

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