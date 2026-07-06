"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";
import { useBookmarks } from "./BookmarksProvider";

const SIZES = {
  sm: { box: "w-8 h-8", icon: 14 },
  md: { box: "w-9 h-9", icon: 16 },
  lg: { box: "w-11 h-11", icon: 19 },
};

/**
 * Bookmark toggle icon. Used on BlogCard (list/grid contexts) and on the
 * blog detail page. Optimistic — flips instantly via BookmarksProvider,
 * rolls back if the API call fails.
 */
export default function BookmarkButton({ slug, size = "md", variant = "overlay", className = "" }) {
  const { bookmarkedSlugs, isAuthenticated, toggleBookmark } = useBookmarks();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, setPending] = useState(false);

  const bookmarked = bookmarkedSlugs.has(slug);
  const { box, icon } = SIZES[size] || SIZES.md;

  async function handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname || "/")}`);
      return;
    }
    if (pending) return;

    setPending(true);
    const willBookmark = !bookmarked;
    const ok = await toggleBookmark(slug);
    setPending(false);

    if (!ok) {
      toast.error(willBookmark ? "Couldn't save this article." : "Couldn't remove this bookmark.");
    }
  }

  const baseClasses =
    variant === "overlay"
      ? `${box} flex items-center justify-center rounded-full bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)] text-[var(--foreground)] hover:border-[var(--accent)] transition-all duration-300 hover:scale-105`
      : `${box} flex items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-300`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      aria-pressed={bookmarked}
      aria-label={bookmarked ? "Remove bookmark" : "Save for later"}
      title={bookmarked ? "Remove bookmark" : "Save for later"}
      className={`${baseClasses} disabled:opacity-60 ${className}`}
    >
      <Bookmark
        size={icon}
        className={bookmarked ? "fill-[var(--accent)] text-[var(--accent)]" : ""}
      />
    </button>
  );
}
