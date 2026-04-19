"use client";

import { useState, useEffect, useRef } from "react";
import { Eye, Heart } from "lucide-react";
import { incrementView, toggleLike } from "@/lib/actions/blogStatsActions";

export default function BlogInteractions({ slug }) {
  const [stats, setStats] = useState({ views: 0, likes: 0, hasLiked: false });
  const [loading, setLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);
  const fetched = useRef(false);

  useEffect(() => {
    // Only increment view once per mount (React Strict Mode prevention)
    if (fetched.current) return;
    fetched.current = true;

    async function recordView() {
      try {
        const result = await incrementView(slug);
        setStats(result);
      } catch (err) {
        console.error("Failed to record view", err);
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      recordView();
    }
  }, [slug]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic UI Update
    const prevStats = { ...stats };
    setStats((prev) => ({
      ...prev,
      likes: prev.hasLiked ? Math.max(0, prev.likes - 1) : prev.likes + 1,
      hasLiked: !prev.hasLiked,
    }));

    try {
      const result = await toggleLike(slug);
      // Ensure state is perfectly synced with DB
      setStats(result);
    } catch (err) {
      console.error("Failed to toggle like", err);
      // Revert optimistic update on failure
      setStats(prevStats);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="flex items-center gap-6 mt-4">
      {/* Views */}
      <div className="flex items-center gap-2 text-[var(--muted)]">
        <Eye size={18} className="text-[var(--accent)]" />
        <span className="text-sm font-semibold">
          {loading ? "..." : stats.views} {stats.views === 1 ? "View" : "Views"}
        </span>
      </div>

      {/* Likes */}
      <button 
        onClick={handleLike} 
        disabled={isLiking || loading}
        className={`flex items-center gap-2 group transition-all duration-300 ${isLiking ? "opacity-50" : ""}`}
        aria-label={stats.hasLiked ? "Unlike post" : "Like post"}
      >
        <Heart 
          size={18} 
          className={`transition-colors duration-300 ${
            stats.hasLiked 
              ? "fill-red-500 text-red-500 cursor-pointer" 
              : "text-[var(--muted)] group-hover:text-[var(--accent)] cursor-pointer"
          }`} 
        />
        <span className={`text-sm font-semibold transition-colors duration-300 ${
            stats.hasLiked 
              ? "text-[var(--muted)]" 
              : "text-[var(--muted)] "
          }`}>
          {loading ? "..." : stats.likes} {stats.likes === 1 ? "Like" : "Likes"}
        </span>
      </button>
    </div>
  );
}
