"use client";
import { useState, useEffect } from "react";

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

export default function FollowerCount({ authorId, baseFollowers = 0 }) {
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

  if (!mounted) {
    return <>{baseFollowers.toLocaleString()}</>;
  }

  const followerCount = baseFollowers + (followed ? 1 : 0);

  function formatNumber(n) {
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
    if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
    return String(n);
  }

  return <>{formatNumber(followerCount)}</>;
}

