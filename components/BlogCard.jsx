"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthorFollowButton from "./AuthorFollowButton";
import { getAuthorSlug } from "@/lib/authorUtils";
import { Check, Star } from "lucide-react";

export default function BlogCard({ blog }) {
  const { title, content, authorName, authorImage, createdAt, bannerImage, slug, category } = blog;
  const router = useRouter();

  // Deterministic "random" so SSR and client always match
  const mockedFollowers = ((title.length * 37 + authorName.charCodeAt(0) * 13) % 500) + 1;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const mockedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const excerpt = content.replace(/[#*]/g, "");

  // Resolve author slug for profile link
  const authorSlug = getAuthorSlug(authorName);
  const authorHref = `/authors/${authorSlug}`;

  // Unique author id used by AuthorFollowButton (matches staticAuthors convention)
  const authorId = blog.authorId || `sa_${authorSlug}_fallback`;

  return (
    <div className="font-playfair h-full">

      {/* ── MOBILE: Medium-style horizontal row ─────────────────── */}
      <Link
        href={`/blog/${slug}`}
        className="sm:hidden flex flex-col group border-b border-[var(--border)] px-4 py-5 hover:bg-[var(--card)] transition-colors duration-200"
      >
        {/* Author row */}
        <div className="flex items-center gap-2 mb-2.5">
          {authorImage ? (
            <img src={authorImage} alt={authorName} className="w-5 h-5 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[var(--primary)] text-[var(--primary-foreground)] shrink-0">
              {authorName[0].toUpperCase()}
            </div>
          )}
          {/* Use button+router.push to avoid nested <a> inside the outer card <Link> */}
          <button
            className="text-[12px] font-semibold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(authorHref); }}
          >
            {authorName}
          </button>
          <span className="text-[var(--muted)] text-[12px]">·</span>
          <span className="text-[11px] text-[var(--muted)]">{mockedDate}</span>
        </div>

        {/* Title + Thumbnail row */}
        <div className="flex items-start gap-3 justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-[15px] font-bold leading-snug text-[var(--foreground)] group-hover:text-[var(--accent)] line-clamp-3 transition-colors duration-200">
              {title}
            </h2>
          </div>
          {bannerImage && (
            <div className="w-[80px] h-[56px] rounded-md overflow-hidden shrink-0 bg-[var(--border)]">
              <img
                src={bannerImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mt-3">
          <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--accent)] bg-[var(--accent)]/10 px-2 py-0.5 rounded-full">
            {category || "Journal"}
          </span>
          <span className="text-[11px] text-[var(--muted)]">{readTime} min read</span>
        </div>
      </Link>

      {/* ── DESKTOP: original vertical card ─────────────────────── */}
      <div className="hidden sm:flex w-full items-center justify-center py-3 px-3 h-full">
        <div className="max-w-2xl w-full h-full bg-[var(--card)]/10 border border-[var(--border)] rounded-2xl shadow-sm overflow-hidden flex flex-col group transition-all duration-500 hover:shadow-lg hover:border-[var(--accent)]/30">

          {/* Banner Image */}
          {bannerImage && (
            <Link href={`/blog/${slug}`} className="relative w-full h-72 overflow-hidden block">
              <img
                src={bannerImage}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[var(--background)]/90 backdrop-blur-md text-[var(--foreground)] text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full border border-[var(--border)]">
                  {category || "Journal"}
                </span>
              </div>
            </Link>
          )}

          <div className="p-5 flex flex-col flex-grow">
            {/* Author Row */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Link href={authorHref} onClick={e => e.stopPropagation()}>
                  {authorImage ? (
                    <img src={authorImage} alt={authorName} className="w-9 h-9 rounded-full object-cover border border-[var(--border)] shrink-0 hover:opacity-80 transition-opacity" />
                  ) : (
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-[var(--primary)] text-[var(--primary-foreground)] border border-[var(--border)] shrink-0 hover:opacity-80 transition-opacity">
                      {authorName[0].toUpperCase()}
                    </div>
                  )}
                </Link>
                <div>
                  <Link href={authorHref} onClick={e => e.stopPropagation()}>
                    <h3 className="text-sm font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors leading-none">{authorName}</h3>
                  </Link>
                  <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold mt-1">{mockedDate}</p>
                </div>
              </div>
              {/* <AuthorFollowButton
                authorId={authorId}
                authorName={authorName}
                baseFollowers={mockedFollowers}
                size="sm"
              /> */}
              {/* <div className="inline-flex items-center gap-2">

  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--accent-foreground)] border border-[var(--accent)]">
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M5 0.5L6.12 2.76L8.63 3.12L6.81 4.88L7.24 7.38L5 6.2L2.76 7.38L3.19 4.88L1.37 3.12L3.88 2.76L5 0.5Z"
        fill="var(--accent)"
      />
    </svg>
    <span className="text-[11px] font-medium text-[var(--accent)]">
      Verified
    </span>
  </span>
</div> */}
              <button
                id={`follow-author-${authorId}`}
                className="group text-[9px] uppercase tracking-[0.18em] font-bold flex items-center gap-1.5 border-b pb-0.5 transition-all duration-300 disabled:opacity-60 text-[var(--accent)] border-[var(--accent)]/30 hover:border-[var(--accent)] hover:gap-2"
              >
                <span className="inline-flex transition-all duration-300 group-hover:scale-110 group-hover:animate-[spin_1s_linear_infinite]">
                  <Star size={9} fill="currentColor" className="text-[var(--accent)]" />
                </span>

                <span className="group-hover:tracking-[0.22em] transition-all duration-300">
                  Verified
                </span>
              </button>
            </div>

            {/* Title + Excerpt */}
            <div className="space-y-2 mb-5 flex-grow">
              <Link href={`/blog/${slug}`}>
                <h2 className="text-lg leading-snug font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] line-clamp-2 transition-colors duration-300">
                  {title}
                </h2>
              </Link>
              <p className="text-[var(--muted)] text-sm leading-relaxed italic line-clamp-2 opacity-80">
                {excerpt}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border)]/50">
              <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">
                {mockedFollowers} readers
              </span>
              <Link
                href={`/blog/${slug}`}
                className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--foreground)] flex items-center gap-2 group/link"
              >
                Read Story
                <span className="w-6 h-[1px] bg-[var(--foreground)] transition-all duration-300 group-hover/link:w-10 group-hover/link:bg-[var(--accent)]" />
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}