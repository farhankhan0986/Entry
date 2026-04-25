"use client";
import { useState, useEffect, useCallback } from "react";
import { Check, UserPlus, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Module-level in-memory deduplication cache.
// When multiple components for the SAME authorId mount simultaneously
// (e.g. 10 BlogCards on a listing page), only one fetch is fired.
// All others await the same promise. Entries expire after 30 seconds.
// ---------------------------------------------------------------------------
const CACHE_TTL_MS = 30_000;
const fetchCache = new Map(); // authorId -> { promise, expiresAt }

function fetchAuthorStats(authorId) {
  const cached = fetchCache.get(authorId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise;
  }
  const promise = fetch(
    `/api/author-stats?authorId=${encodeURIComponent(authorId)}`
  ).then((r) => r.json());
  fetchCache.set(authorId, { promise, expiresAt: Date.now() + CACHE_TTL_MS });
  return promise;
}

function getLocalSet() {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(LS_KEY) || "[]"));
  } catch {
    return new Set();
  }
}
function saveLocalSet(set) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify([...set]));
  } catch {}
}

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

/**
 * authorId       — unique stable id
 * authorName     — display name
 * baseFollowers  — static baseline from staticData (used as seed if no DB record yet)
 * size           — "md" | "sm"
 * showCount      — render follower count
 */
export default function AuthorFollowButton({
  authorId,
  authorName,
  baseFollowers = 0,
  size = "md",
  showCount = false,
}) {
  const [mounted, setMounted] = useState(false);
  const [followed, setFollowed] = useState(false);
  const [followers, setFollowers] = useState(baseFollowers);
  const [pending, setPending] = useState(false);

  // On mount: fetch real DB state, seed UI from localStorage in the meantime
  useEffect(() => {
    setMounted(true);
    // Optimistic local state while we wait for API
    const localSet = getLocalSet();
    setFollowed(localSet.has(authorId));

    // Fetch real state from DB (deduplicated via module-level cache)
    fetchAuthorStats(authorId)
      .then((data) => {
        setFollowers(data.followers ?? baseFollowers);
        setFollowed(data.hasFollowed ?? localSet.has(authorId));
      })
      .catch(() => {
        // Keep local state on network error
      });
  }, [authorId, baseFollowers]);

  // Listen for other instances toggling follow on the same page
  useEffect(() => {
    const handler = () => {
      const localSet = getLocalSet();
      setFollowed(localSet.has(authorId));
    };
    window.addEventListener("entry_follow_change", handler);
    return () => window.removeEventListener("entry_follow_change", handler);
  }, [authorId]);

  const handleFollow = useCallback(async () => {
    if (pending) return;
    setPending(true);

    // Optimistic update
    const wasFollowed = followed;
    const newFollowed = !wasFollowed;
    setFollowed(newFollowed);
    setFollowers((c) => c + (newFollowed ? 1 : -1));

    // Update localStorage
    const localSet = getLocalSet();
    if (newFollowed) {
      localSet.add(authorId);
      toast.success(`You're now following ${authorName}!`);
    } else {
      localSet.delete(authorId);
      toast(`Unfollowed ${authorName}`);
    }
    saveLocalSet(localSet);
    window.dispatchEvent(new Event("entry_follow_change"));

    // Persist to DB
    try {
      const res = await fetch("/api/author-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ authorId, baseFollowers }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      // Reconcile with server truth
      setFollowers(data.followers);
      setFollowed(data.hasFollowed);
    } catch {
      // Revert on failure
      setFollowed(wasFollowed);
      setFollowers((c) => c + (wasFollowed ? 1 : -1));
      toast.error("Couldn't save follow — try again.");
    } finally {
      setPending(false);
    }
  }, [authorId, authorName, baseFollowers, followed, pending]);

  const isFollowed = mounted && followed;

  if (size === "sm") {
    return (
      <button
        id={`follow-author-${authorId}`}
        onClick={handleFollow}
        disabled={pending}
        className={`text-[9px] uppercase tracking-widest font-bold flex items-center gap-1 border-b pb-0.5 transition-all duration-300 disabled:opacity-60
          ${isFollowed
            ? "text-[var(--accent)] border-[var(--accent)]/40"
            : "text-[var(--accent)] border-[var(--accent)] hover:opacity-70"
          }`}
      >
        {pending ? (
          <Loader2 size={9} className="animate-spin" />
        ) : isFollowed ? (
          <Check size={10} strokeWidth={3} />
        ) : null}
        {isFollowed ? "Following" : "Follow +"}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <button
        id={`follow-author-${authorId}`}
        onClick={handleFollow}
        disabled={pending}
        className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all duration-300 border disabled:opacity-60
          ${isFollowed
            ? "bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/40 hover:bg-[var(--accent)]/20"
            : "btn-primary border-transparent hover:opacity-90"
          }`}
      >
        {pending ? (
          <Loader2 size={13} className="animate-spin" />
        ) : isFollowed ? (
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
          {formatNumber(followers)} followers
        </span>
      )}
    </div>
  );
}
