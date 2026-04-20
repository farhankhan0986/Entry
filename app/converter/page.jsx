"use client";

import { TextForm } from "@/components/TextForm";
import { Toaster } from "sonner";
import Link from "next/link";
import {
    ArrowLeft, Type, Hash, Braces, Link2, AlignLeft,
    Search, DownloadCloud, RefreshCcw, FileText, Pen
} from "lucide-react";

const features = [
    { icon: Type, label: "Case Conversion", desc: "Upper, lower, title, sentence, alternating" },
    { icon: RefreshCcw, label: "Transform", desc: "Reverse, trim, remove punctuation/numbers" },
    { icon: AlignLeft, label: "Sort & Number", desc: "Sort lines A→Z, Z→A, add line numbers" },
    { icon: Hash, label: "Slug & Hashtags", desc: "Convert to URL slug or #hashtag list" },
    { icon: Braces, label: "Encode / Decode", desc: "Base64 and URL encoding in one click" },
    { icon: Search, label: "Find & Replace", desc: "Replace all occurrences instantly" },
    { icon: DownloadCloud, label: "Download", desc: "Export your text as a .txt file" },
    { icon: FileText, label: "Live Statistics", desc: "Words, chars, vowels, read time & more" },
];

export default function ConverterPage() {
    return (
        <>
            <Toaster position="top-right" richColors />

            <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">

                {/* ── Hero ─────────────────────────────────────────────────────────── */}
                <header className="container mx-auto px-6 pt-16 pb-12">
                    <Link
                        href="/journal"
                        className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors mb-12 font-bold uppercase tracking-widest text-xs"
                    >
                        <ArrowLeft size={14} /> Back to Journal
                    </Link>

                    <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">

                        <div className="flex items-center justify-center gap-4 mb-6">
                            <Pen className="w-6 h-6 text-[var(--accent)]" />
                            <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
                                Text Utility
                            </p>
                        </div>

                        <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
                            The Text<br />
                            <span className="text-[var(--accent)]">Converter</span>
                            <span className="text-[var(--muted)]">.</span>
                        </h1>
                        <p className="text-xl text-[var(--muted)] leading-relaxed italic max-w-xl">
                            20+ transformations, live statistics, find & replace, encode/decode, and instant export. Everything your text needs — in one place.
                        </p>
                    </div>

                    {/* Feature grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-4xl mx-auto">
                        {features.map(({ icon: Icon, label, desc }) => (
                            <div
                                key={label}
                                className="rounded-2xl border border-[var(--border)] p-4 bg-[var(--card)] hover:border-[var(--accent)]/50 transition-all"
                            >
                                <Icon size={16} className="text-[var(--accent)] mb-2" />
                                <p className="text-sm font-bold mb-0.5">{label}</p>
                                <p className="text-[11px] text-[var(--muted)] leading-snug">{desc}</p>
                            </div>
                        ))}
                    </div>
                </header>

                {/* ── Tool ─────────────────────────────────────────────────────────── */}
                <main className="container mx-auto px-6 pb-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
                                    <Type size={18} className="text-[var(--accent)]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold leading-none">Text Workspace</h2>
                                    <p className="text-xs text-[var(--muted)] mt-0.5">Paste, type, and transform</p>
                                </div>
                            </div>
                            <TextForm />
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}