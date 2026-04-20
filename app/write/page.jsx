"use client";

import { createBlog } from "@/lib/actions/blogActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormattedTextarea from "@/components/FormattedTextarea";

export default function WritePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData) {
    setLoading(true);
    try {
      await createBlog(formData);
      router.push("/");
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  }

  return (
    // font-playfair applied to the entire container
    <div className="min-h-screen bg-[var(--background)] py-16 px-4 font-playfair">
      <div className="max-w-2xl mx-auto">

        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-[var(--foreground)] mb-3">
            New Draft
          </h1>
          <div className="h-1 w-20 bg-[var(--accent)] mx-auto rounded-full" />
        </header>

        {/* Form Container */}
        <div className="bg-[var(--card)]/10 border border-[var(--border)] rounded-3xl p-8 md:p-12 shadow-sm">
          <form action={handleSubmit} className="space-y-10">

            {/* Title - Large Serif Input */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Author */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                  Byline
                </label>
                <input
                  name="authorName"
                  type="text"
                  placeholder="Your Name"
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                  Section
                </label>
                <select
                  name="category"
                  required
                  className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Category</option>
                  <option value="General">General</option>
                  <option value="Technology">Technology</option>
                  <option value="Travel">Travel</option>
                  <option value="Country">Country</option>
                  <option value="Biography">Biography</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Food">Food</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="Sports">Sports</option>
                  <option value="Politics">Politics</option>
                  <option value="Business">Business</option>
                  <option value="Fashion">Fashion</option>
                </select>
              </div>
            </div>

            {/* Banner URL */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1">
                Banner Image URL
              </label>
              <input
                name="bannerImage"
                type="url"
                placeholder="https://..."
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all italic"
              />
            </div>

            {/* Main Content */}
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
              className="btn-primary w-full py-5 text-xl tracking-widest uppercase hover:bg-[var(--accent)] hover:text-white duration-300 transition-all cursor-pointer"
            >
              {loading ? "Publishing..." : "Publish Entry"}
            </button>
          </form>
        </div>

        {/* Footer Accent */}
        <p className="text-center mt-10 text-[var(--muted)] text-sm italic">
          Drafts are saved automatically to your local memory.
        </p>
      </div>
    </div>
  );
}