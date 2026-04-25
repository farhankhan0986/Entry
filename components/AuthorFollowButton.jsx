"use client";
import { useState, useEffect } from "react";
import { Check, UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

const STORAGE_KEY = "entry_followed_authors";

function getFollowedSet() {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveFollowedSet(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

/**
 * authorId   — unique stable id (e.g. "sa_vikram-malhotra_7f3a2b1c")
 * authorName — display name
 * baseFollowers — deterministic number from staticAuthors
 * size       — "md" (default on profile page) | "sm" (blog card / footer)
 * showCount  — whether to show the live follower count
 */
export default function AuthorFollowButton({
  authorId,
  authorName,
  baseFollowers = 0,
  size = "md",
  showCount = false,
}) {
  const [followed, setFollowed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkFollow = () => {
      const set = getFollowedSet();
      setFollowed(set.has(authorId));
    };
    checkFollow();
    
    window.addEventListener("entry_follow_change", checkFollow);
    return () => window.removeEventListener("entry_follow_change", checkFollow);
  }, [authorId]);

  const handleFollow = () => {
    const set = getFollowedSet();

    if (followed) {
      set.delete(authorId);
      setFollowed(false);
      saveFollowedSet(set);
      window.dispatchEvent(new Event("entry_follow_change"));
      toast(`Unfollowed ${authorName}`);
    } else {
      set.add(authorId);
      setFollowed(true);
      saveFollowedSet(set);
      window.dispatchEvent(new Event("entry_follow_change"));
      toast.success(`You're now following ${authorName}!`);
    }
  };

  // Avoid hydration mismatch — render neutral state on server
  const isFollowed = mounted && followed;
  const followerCount = baseFollowers + (isFollowed ? 1 : 0);

  if (size === "sm") {
    return (
      <button
        id={`follow-author-${authorId}`}
        onClick={handleFollow}
        className={`text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 border-b pb-0.5 transition-all duration-300
          ${
            isFollowed
              ? "text-[var(--accent)] border-[var(--accent)]/40"
              : "text-[var(--accent)] border-[var(--accent)] hover:opacity-70"
          }`}
      >
        {isFollowed ? <Check size={10} strokeWidth={3} /> : null}
        {isFollowed ? "Following" : "Follow +"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button
        id={`follow-author-${authorId}`}
        onClick={handleFollow}
        className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all duration-300 border
          ${
            isFollowed
              ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/40 hover:bg-[var(--accent)]/20"
              : "btn-primary border-transparent hover:opacity-90"
          }`}
      >
        {isFollowed ? (
          <>
            <Check size={13} strokeWidth={3} />
            Following
          </>
        ) : (
          <>
            <UserPlus size={13} strokeWidth={2.5} />
            Follow
          </>
        )}
      </button>

      {showCount && mounted && (
        <span className="flex items-center gap-1.5 text-xs text-[var(--muted)] font-semibold">
          <Users size={13} />
          {followerCount.toLocaleString()} followers
        </span>
      )}
    </div>
  );
}
