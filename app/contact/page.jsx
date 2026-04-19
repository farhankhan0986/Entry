"use client";

import { useState } from "react";
import { Mail, MessageSquare, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
        });

        const data = await res.json();

        setLoading(false);

        if (data.success) {
            setSuccess(true);
            toast.success("Message sent successfully!");
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
            {/* 1. Header Section */}
            <header className="container mx-auto px-6 pt-24 pb-16 border-b border-[var(--border)]">
                <div className="max-w-5xl">
                    <div className="flex items-center gap-3 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs mb-6">
                        <MessageSquare size={16} />
                        <span>Open for Dialogue</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight leading-[0.85] mb-8">
                        Get in <br /> Touch<span className="text-[var(--accent)]">.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80 max-w-2xl">
                        "We value the stories you tell and the questions you ask. Reach out, and let's turn conversation into connection."
                    </p>
                </div>
            </header>

            {/* 2. Content Area */}
            <main className="container mx-auto px-6 py-20 flex flex-col lg:flex-row gap-20">

                {/* Contact Details */}
                <div className="lg:w-1/3 space-y-12">
                    <section>
                        <h4 className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] mb-6">Direct Channels</h4>
                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <Mail className="text-[var(--accent)] mt-1" />
                                <div>
                                    <h5 className="font-bold text-lg">Editorial</h5>
                                    <p className="text-[var(--muted)] italic">farhankhan080304@gmail.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <MapPin className="text-[var(--accent)] mt-1" />
                                <div>
                                    <h5 className="font-bold text-lg">Headquarters</h5>
                                    <p className="text-[var(--muted)] italic">Lucknow, Uttar Pradesh, India</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Contact Form */}
                <div className="flex-1 bg-[var(--card)] border border-[var(--border)] rounded-[40px] p-8 md:p-12 shadow-sm">
                    {success ? (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-700">
                            <div className="w-20 h-20 bg-[var(--accent)]/10 rounded-full flex items-center justify-center text-[var(--accent)]">
                                <MessageSquare size={32} />
                            </div>
                            <h3 className="text-3xl font-bold">Message Received</h3>
                            <p className="text-[var(--muted)] italic">We'll get back to you as soon as the ink dries.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                                        Name
                                    </label>
                                    <input
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                                        Email
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                                    className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 focus:ring-1 focus:ring-[var(--accent)] outline-none transition-all resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-5 text-lg tracking-widest uppercase hover:bg-[var(--accent)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                            >
                                {loading ? "Sending..." : "Send Message"} <Send size={16} />
                            </button>
                        </form>
                    )}
                </div>
            </main>
        </div>
    );
}