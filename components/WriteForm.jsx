"use client";

import { createBlog } from "@/lib/actions/blogActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormattedTextarea from "@/components/FormattedTextarea";
import { PenLine, ImageIcon, Tag, User, ChevronDown } from "lucide-react";
import Image from "next/image";

const CATEGORIES = [
  "General", "Technology", "Travel", "Business", "Career",
  "Country", "Biographies", "Celebrity", "Entertainment", "Food", "World Affairs", "Facts",
  "Lifestyle", "Health", "Finance", "Education", "Mysteries",
  "Sports", "Politics", "Psychology", "Fashion", "Society",
];

export default function WriteForm({ session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState("");

  async function handleSubmit(formData) {
    setLoading(true);
    try {
      await createBlog(formData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-16 px-4 font-playfair">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <header className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 text-[var(--accent)] mb-4">
            <PenLine size={16} />
            <span className="text-xs uppercase tracking-[0.3em] font-bold">New Entry</span>
          </div>
          <h1 className="text-5xl font-bold text-[var(--foreground)] mb-3">New Draft</h1>
          <div className="h-1 w-20 bg-[var(--accent)] mx-auto rounded-full" />

          {/* Author chip */}
          <div className="mt-6 inline-flex items-center gap-3 bg-[var(--card)]/20 border border-[var(--border)] rounded-full px-4 py-2">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={28}
                height={28}
                className="rounded-full"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[var(--accent)] flex items-center justify-center text-white text-xs font-bold">
                {session.user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-sm font-bold text-[var(--foreground)]">
              Writing as {session.user.name}
            </span>
          </div>
        </header>

        {/* Form */}
        <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm">
          <form action={handleSubmit} className="space-y-10">

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                Headline
              </label>
              <input
                name="title"
                required
                type="text"
                placeholder="Title of your story..."
                className="w-full bg-transparent border-b-2 border-[var(--border)] py-4 text-3xl font-bold text-[var(--foreground)] placeholder:text-[var(--muted)] placeholder:opacity-30 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1 flex items-center gap-2">
                <Tag size={12} /> Section
              </label>
              <div className="relative">
                <select
                  name="category"
                  required
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--muted)] pointer-events-none" />
              </div>
            </div>

            {/* Banner Image URL */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1 flex items-center gap-2">
                <ImageIcon size={12} /> Banner Image URL
              </label>
              <input
                name="bannerImage"
                type="url"
                placeholder="https://..."
                onChange={e => setBannerPreview(e.target.value)}
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all italic"
              />
              {bannerPreview && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-[var(--border)] h-40">
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={() => setBannerPreview("")}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                The Narrative
              </label>
              <FormattedTextarea />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-5 text-xl tracking-widest uppercase hover:bg-[var(--accent)] hover:text-white duration-300 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Publishing..." : "Publish Entry"}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-[var(--muted)] text-sm italic">
          Your story will be published under your account and appear in your dashboard.
        </p>
      </div>
    </div>
  );
}
