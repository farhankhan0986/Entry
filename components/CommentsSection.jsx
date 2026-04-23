"use client";

import { useState, useTransition, useOptimistic } from "react";
import { addComment } from "@/lib/actions/blogActions";
import { MessageSquare, Send, Loader2, LogIn } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

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
      {/* Avatar — real photo if available */}
      <div className="shrink-0">
        {comment.authorImage ? (
          <Image
            src={comment.authorImage}
            alt={comment.authorName || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm">
            {initials}
          </div>
        )}
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
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [optimisticComments, addOptimistic] = useOptimistic(
    initialComments,
    (current, newComment) => [newComment, ...current]
  );

  async function handleSubmit(formData) {
    const body = formData.get("body");
    if (!body?.trim()) {
      setError("Please write something before posting.");
      return;
    }

    setError("");
    setSuccess(false);

    addOptimistic({
      _id: `temp-${Date.now()}`,
      authorName: session?.user?.name || "Anonymous",
      authorImage: session?.user?.image || null,
      body,
      createdAt: new Date().toISOString(),
    });

    startTransition(async () => {
      try {
        await addComment(blogId, formData);
        setSuccess(true);
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
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

      {/* ── Compose: Auth gate ── */}
      {status === "loading" ? (
        <div className="mb-12 p-6 border border-[var(--border)] rounded-3xl animate-pulse bg-[var(--card)]/10 h-24" />
      ) : session?.user ? (
        /* Signed-in compose form */
        <form
          action={handleSubmit}
          className="mb-12 p-6 md:p-8 bg-[var(--card)]/10 border border-[var(--border)] rounded-3xl space-y-5 shadow-sm"
        >
          {/* Author info */}
          <div className="flex items-center gap-3">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center font-bold text-white text-sm">
                {session.user.name?.[0]?.toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-xs font-bold text-[var(--foreground)]">{session.user.name}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--accent)] font-bold">Leave a Reflection</p>
            </div>
          </div>

          {/* Body */}
          <textarea
            name="body"
            required
            rows={4}
            placeholder="Share your thoughts on this piece..."
            className="w-full bg-[var(--input)] border border-[var(--border)] rounded-2xl px-5 py-4 text-[var(--foreground)] placeholder:text-[var(--muted)] outline-none focus:ring-2 focus:ring-[var(--accent)]/30 resize-none transition-all leading-relaxed"
          />

          {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
          {success && <p className="text-sm text-emerald-500 font-medium">Your reflection has been posted!</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex cursor-pointer items-center gap-2 px-6 py-3 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] font-bold text-sm uppercase tracking-widest hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Posting...</>
              ) : (
                <>Post Reflection</>
              )}
            </button>
          </div>
        </form>
      ) : (
        /* Not signed in — sign-in prompt */
        <div className="mb-12 p-8 bg-[var(--card)]/10 border border-[var(--border)] rounded-3xl text-center">
          <MessageSquare size={28} className="mx-auto text-[var(--accent)] mb-3" />
          <h4 className="font-bold text-lg text-[var(--foreground)] mb-1">Join the conversation</h4>
          <p className="text-[var(--muted)] text-sm mb-5">
            Sign in to share your reflection on this piece.
          </p>
          <Link
            href={`/login?callbackUrl=${encodeURIComponent(pathname + "#comments")}`}
            className="inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[var(--accent)] transition-colors"
          >
            <LogIn size={14} /> Sign In to Comment
          </Link>
        </div>
      )}

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
