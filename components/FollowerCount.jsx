"use client";
import { useState, useEffect } from "react";

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

/**
 * Renders a live follower count pulled from the DB.
 * Falls back to baseFollowers until the API responds.
 */
export default function FollowerCount({ authorId, baseFollowers = 0 }) {
  const [count, setCount] = useState(baseFollowers);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const refresh = () => {
      fetch(`/api/author-stats?authorId=${encodeURIComponent(authorId)}`)
        .then((r) => r.json())
        .then((data) => {
          if (typeof data.followers === "number") {
            setCount(data.followers);
          }
        })
        .catch(() => {});
    };

    refresh();

    // Re-fetch whenever a follow/unfollow fires anywhere on the page
    window.addEventListener("entry_follow_change", refresh);
    return () => window.removeEventListener("entry_follow_change", refresh);
  }, [authorId]);

  if (!mounted) return <>{formatNumber(baseFollowers)}</>;
  return <>{formatNumber(count)}</>;
}
