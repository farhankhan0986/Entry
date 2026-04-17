"use client";
import { Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

/**
 * variant="inline"  → pill button only (for the article header meta row)
 * variant="icon"    → circle icon-only button (for the sticky sidebar)
 * no variant        → responsive: pill on mobile, icon on xl+
 */
export default function Share({ post, variant }) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt || post?.content?.slice(0, 100),
          url,
        });
      } catch (err) {
        // User cancelled or browser blocked — silently ignore
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard!");
    }
  };

  // ── Sidebar: icon-only circle button ───────────────────────────────────────
  if (variant === "icon") {
    return (
      <button
        onClick={handleShare}
        title="Copy link"
        className="w-10 h-10 cursor-pointer rounded-full flex items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all shadow-sm"
      >
        <Link2 className="w-4 h-4" />
      </button>
    );
  }

  // ── Header meta row: pill button only ─────────────────────────────────────
  if (variant === "inline") {
    return (
      <button
        onClick={handleShare}
        className="xl:hidden ml-auto flex items-center gap-2 text-[var(--accent)] font-bold uppercase text-xs tracking-widest border border-[var(--border)] px-4 py-2 rounded-full active:scale-95 transition-all shadow-sm bg-[var(--card)]/10 hover:bg-[var(--accent)] hover:text-[var(--background)]"
      >
        <Share2 size={14} />
        Share
      </button>
    );
  }

  // ── Default: responsive (pill on mobile, icon on xl+) ──────────────────────
  return (
    <>
      <button
        onClick={handleShare}
        className="xl:hidden flex items-center gap-2 text-[var(--accent)] font-bold uppercase text-xs tracking-widest border border-[var(--border)] px-4 py-2 rounded-full active:scale-95 transition-all shadow-sm bg-[var(--card)]/10"
      >
        <Share2 size={14} />
        Share
      </button>
      <button
        onClick={handleShare}
        title="Copy link"
        className="hidden xl:flex w-10 h-10 cursor-pointer rounded-full items-center justify-center border border-[var(--border)] bg-[var(--card)]/10 hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all shadow-sm"
      >
        <Link2 className="w-4 h-4" />
      </button>
    </>
  );
}