"use client";
import { useState } from "react";
import { toast } from "sonner";
import { Check } from "lucide-react";

export default function Follow({ authorName }) {
  const [followed, setFollowed] = useState(false);

  const handleFollow = () => {
    if (followed) return;
    const target = authorName || "Entry";
    toast.success(`You're now following ${target}!`);
    setFollowed(true);
  };

  const label = followed ? "Followed" : authorName ? "Follow Author" : "Follow";

  return (
    <>
      {authorName ? (
        <button
          id="follow-author-btn"
          onClick={handleFollow}
          disabled={followed}
          className={`px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs flex items-center gap-2 transition-all duration-300
            ${
              followed
                ? "bg-[var(--accent)]/15 text-[var(--accent)] border border-[var(--accent)]/40 cursor-default"
                : "btn-primary"
            }`}
        >
          {followed && <Check size={13} strokeWidth={3} />}
          {label}
        </button>
      ) : (
        <button
          id="follow-entry-btn"
          onClick={handleFollow}
          disabled={followed}
          className={`text-[10px] uppercase tracking-widest font-bold border-b-2 pb-1 transition-all flex items-center gap-1
            ${
              followed
                ? "text-[var(--accent)] border-[var(--accent)]/40 cursor-default opacity-80"
                : "text-[var(--accent)] border-[var(--accent)] hover:opacity-70"
            }`}
        >
          {followed && <Check size={11} strokeWidth={3} />}
          {label}
        </button>
      )}
    </>
  );
}