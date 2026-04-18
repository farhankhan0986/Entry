"use client";
import { toast } from "sonner";

export default function Follow({ authorName }) {
  const handleFollow = () => {
    { authorName && toast.success(`You've followed ${authorName}`); }
    {!authorName && toast.success(`You've followed Farhan Abid`);}
  };

  return (
    <>
      {authorName && (
        <button
          onClick={handleFollow}
          className="btn-primary px-10 py-4 rounded-full font-bold uppercase tracking-widest text-xs"
        >
          Follow Author
        </button>
      )}
      {!authorName && (
        <button
          onClick={handleFollow}
          className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] border-b-2 border-[var(--accent)] pb-1 hover:opacity-70 transition-all"
        >
          Follow
        </button>
      )}
    </>
  );
}