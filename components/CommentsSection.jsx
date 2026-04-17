"use client";

import { useState, useTransition, useOptimistic } from "react";
import { addComment } from "@/lib/actions/blogActions";
import { MessageSquare, Send, User, Loader2 } from "lucide-react";

// ─── Single Comment Card ──────────────────────────────────────────────────────

function CommentCard({ comment }) {
  const initials = (comment.authorName || "A")[0].toUpperCase();
  const date = new Date(comment.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="flex gap-4 group/comment">
      {/* Avatar */}
      <div className="w-10 h-10 rounded-full shrink-0 flex items-center justify-center font-bold text-sm bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm">
        {initials}
      </div>

      {/* Body */}
      <div className="flex-1 border-b border-[var(--border)] pb-6">
        <div className="flex items-baseline gap-3 mb-2">
          <span className="font-bold text-[var(--foreground)]">
            {comment.authorName || "Anonymous"}
          </span>
          <span className="text-xs text-[var(--muted)] tabular-nums">{date}</span>
        </div>
        <p className="text-[var(--foreground)]/80 leading-relaxed whitespace-pre-wrap">
          {comment.body}
        </p>
      </div>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export default function CommentsSection({ blogId, initialComments }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Optimistic state: prepend new comment instantly
  const [optimisticComments, addOptimistic] = useOptimistic(
    initialComments,
    (current, newComment) => [newComment, ...current]
  );

  async function handleSubmit(formData) {
    const authorName = formData.get("authorName") || "Anonymous";
    const body = formData.get("body");
    if (!body?.trim()) {
      setError("Please write something before posting.");
      return;
    }

    setError("");
    setSuccess(false);

    // Optimistically add the comment to the UI
    addOptimistic({
      _id: `temp-${Date.now()}`,
      authorName,
      body,
      createdAt: new Date().toISOString(),
    });

    startTransition(async () => {
      try {
        await addComment(blogId, formData);
        setSuccess(true);
      } catch (err) {
        setError("Something went wrong. Please try again.");
      }
    });
  }

  return (
    <section className="mt-16 pt-16 border-t border-[var(--border)]" id="comments">
      {/* Heading */}
      <h3 className="text-3xl font-bold flex items-center gap-4 mb-10 text-[var(--foreground)]">
        <MessageSquare className="text-[var(--accent)]" />
        Reflections
        {optimisticComments.length > 0 && (
          <span className="ml-auto text-base font-normal text-[var(--muted)]">
            {optimisticComments.length} comment{optimisticComments.length !== 1 ? "s" : ""}
          </span>
        )}
      </h3>

      {/* ── Compose Form ── */}
      <form
        action={handleSubmit}
        className="mb-12 p-6 md:p-8 bg-[var(--card)]/10 border border-[var(--border)] rounded-3xl space-y-5 shadow-sm"
      >
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-[var(--accent)]">
          Leave a Reflection
        </p>

        {/* Name */}
        <div className="flex items-center gap-3 border border-[var(--border)] rounded-2xl px-4 h-12 bg-[var(--input)] focus-within:ring-2 focus-within:ring-[var(--accent)]/30 transition-all">
          <User className="w-4 h-4 text-[var(--muted)] shrink-0" />
          <input
            name="authorName"
            type="text"
            placeholder="Your name (optional)"
            className="flex-1 bg-transparent outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
          />
        </div>

        {/* Body */}
        <textarea
          name="body"
          required
          rows={4}
          placeholder="Share your thoughts on this piece..."
          className="w-full bg-[var(--input)] border border-[var(--border)] rounded-2xl px-5 py-4 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none transition-all leading-relaxed"
        />

        {/* Feedback messages */}
        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}
        {success && (
          <p className="text-sm text-emerald-500 font-medium">
            Your reflection has been posted!
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                Post Reflection
              </>
            )}
          </button>
        </div>
      </form>

      {/* ── Comments List ── */}
      {optimisticComments.length === 0 ? (
        <div className="py-12 text-center text-[var(--muted)] italic">
          No reflections yet. Be the first to share your thoughts!
        </div>
      ) : (
        <div className="space-y-8">
          {optimisticComments.map((comment) => (
            <CommentCard key={comment._id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}
