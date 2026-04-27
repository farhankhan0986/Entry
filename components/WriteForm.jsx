"use client";

import { createBlog } from "@/lib/actions/blogActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import FormattedTextarea from "@/components/FormattedTextarea";
import { PenLine, ImageIcon, Tag, ChevronDown, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const CATEGORIES = [
  "General", "Technology", "Travel", "Business", "Career",
  "Country", "Biographies", "Celebrity", "Entertainment", "Food", "World Affairs", "Facts",
  "Lifestyle", "Health", "Finance", "Education", "Mysteries",
  "Sports", "Politics", "Psychology", "Fashion", "Society",
];

export default function WriteForm({ session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Banner image — resolved URL (either typed or uploaded)
  const [bannerUrl, setBannerUrl] = useState("");      // what goes to the server
  const [previewSrc, setPreviewSrc] = useState("");    // what the <img> shows
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);

  // ── Handle file selection: upload immediately via /api/upload ──────────────
  async function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show local blob preview instantly
    const localBlob = URL.createObjectURL(file);
    setPreviewSrc(localBlob);
    setFileName(file.name);
    setBannerUrl(""); // clear until upload done

    setUploading(true);
    const toastId = toast.loading("Uploading banner...");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Upload failed");

      setBannerUrl(data.url);  // Cloudinary URL — will be sent to server action
      setPreviewSrc(data.url); // replace blob with real URL
      toast.success("Banner uploaded!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Upload failed", { id: toastId });
      setPreviewSrc("");
      setFileName("");
    } finally {
      setUploading(false);
    }
  }

  // ── Form submit: only text + resolved URL reach the server action ──────────
  async function handleSubmit(e) {
    e.preventDefault();
    if (uploading) { toast.error("Please wait for the image to finish uploading."); return; }

    setLoading(true);
    try {
      const form = e.currentTarget;
      const fd = new FormData(form);
      // Inject resolved banner URL (file upload OR typed URL)
      const typedUrl = fd.get("bannerImage");
      fd.set("bannerImage", bannerUrl || typedUrl || "");

      await createBlog(fd);
      toast.success("Entry published!");
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("Something went wrong. Please try again.");
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
          <form onSubmit={handleSubmit} className="space-y-10">

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

            {/* Banner Image — URL or File Upload */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1 flex items-center gap-2">
                <ImageIcon size={12} /> Banner Image
              </label>

              {/* URL input — disabled when a file has been uploaded */}
              <input
                name="bannerImage"
                type="url"
                placeholder="Paste an image URL — https://..."
                value={bannerUrl && fileName ? "" : bannerUrl}
                disabled={!!fileName}
                onChange={e => {
                  setBannerUrl(e.target.value);
                  setPreviewSrc(e.target.value);
                }}
                className="w-full bg-[var(--input)] border border-[var(--border)] rounded-xl px-4 py-3 text-[var(--foreground)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)] transition-all italic disabled:opacity-40 disabled:cursor-not-allowed"
              />

              <span className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--muted)] ml-1 flex justify-center mt-4 mb-4 items-center gap-2">OR</span>

              {/* File upload zone */}
              <label
                htmlFor="banner-file"
                className={`group w-full cursor-pointer border-2 border-dashed rounded-2xl px-6 py-8 flex flex-col items-center justify-center gap-3 transition-all duration-300 hover:shadow-md ${
                  uploading
                    ? "border-[var(--accent)] bg-[var(--accent)]/5 cursor-wait"
                    : bannerUrl && fileName
                    ? "border-[var(--accent)] bg-[var(--accent)]/5"
                    : "border-[var(--border)] hover:border-[var(--accent)] bg-[var(--input)]"
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${
                  bannerUrl && fileName ? "bg-[var(--accent)]/20" : "bg-[var(--accent)]/10"
                }`}>
                  {uploading
                    ? <Loader2 size={20} className="text-[var(--accent)] animate-spin" />
                    : bannerUrl && fileName
                    ? <CheckCircle size={20} className="text-[var(--accent)]" />
                    : <ImageIcon size={20} className="text-[var(--accent)]" />
                  }
                </div>
                <div className="text-center">
                  {uploading ? (
                    <p className="text-sm font-semibold text-[var(--accent)]">Uploading...</p>
                  ) : bannerUrl && fileName ? (
                    <>
                      <p className="text-sm font-semibold text-[var(--accent)]">{fileName}</p>
                      <p className="text-xs text-[var(--muted)] mt-1">Click to change file</p>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-[var(--foreground)]">Click to upload image</p>
                      <p className="text-xs text-[var(--muted)] mt-1">PNG, JPG, WEBP up to 10MB</p>
                    </>
                  )}
                </div>
              </label>

              <input
                type="file"
                id="banner-file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {/* Preview */}
              {previewSrc && (
                <div className="mt-3 rounded-2xl overflow-hidden border border-[var(--border)] h-48 relative">
                  <img
                    src={previewSrc}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                    onError={() => { setPreviewSrc(""); setBannerUrl(""); setFileName(""); }}
                  />
                  {bannerUrl && fileName && (
                    <span className="absolute top-2 left-2 text-[10px] uppercase tracking-widest bg-[var(--accent)] text-white px-2 py-1 rounded-full font-bold">
                      Cloudinary ✓
                    </span>
                  )}
                  {uploading && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Loader2 size={28} className="text-white animate-spin" />
                    </div>
                  )}
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
              disabled={loading || uploading}
              className="btn-primary w-full py-5 text-xl tracking-widest uppercase hover:bg-[var(--accent)] hover:text-white duration-300 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Publishing..." : uploading ? "Waiting for upload..." : "Publish Entry"}
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
