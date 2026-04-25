import Link from "next/link";
import { staticAuthors, getBlogsByAuthor } from "@/lib/staticData";
import { MapPin, FileText, Eye, Users, PenLine } from "lucide-react";
import FollowerCount from "@/components/FollowerCount";

export const metadata = {
  title: "Authors",
  description:
    "Meet the writers behind Entry — sports analysts, cinema critics, AI researchers, and more. Follow your favorite authors and never miss a new entry.",
  alternates: { canonical: "https://entry-azure.vercel.app/authors" },
};

function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

export default function AuthorsPage() {
  // Attach blog counts to each author at build time (server component)
  const authorsWithStats = staticAuthors.map((author) => {
    const blogs = getBlogsByAuthor(author.name);
    return { ...author, articleCount: blogs.length };
  });

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-playfair">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
          />
        </div>
        <div className="container mx-auto px-6 py-24 text-center relative z-10 max-w-4xl">
          <div className="flex items-center justify-center gap-4 mb-6">
                        <PenLine className="w-6 h-6 text-[var(--accent)]" />
                        <p className="text-[13px] font-bold uppercase tracking-[0.4em] text-[var(--accent)] leading-none">
                            The Writers Behind Entry
                        </p>
                    </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 text-[var(--foreground)]">
            Meet Our <span className="text-[var(--accent)]">Featured</span> Authors
          </h1>
          <p className="text-[var(--muted)] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Sports analysts, cinema critics, AI builders, physicians, founders — a collective of distinct voices writing about what they know best.
          </p>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      {/* ── Authors Grid ── */}
      <section className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {authorsWithStats.map((author) => (
            <Link
              key={author.id}
              href={`/authors/${author.slug}`}
              className="group relative bg-[var(--card)] border border-[var(--border)] rounded-3xl p-8 flex flex-col gap-5 hover:border-[var(--accent)]/40 hover:shadow-xl transition-all duration-400 overflow-hidden"
            >
              {/* Subtle hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl pointer-events-none bg-[var(--accent)]"
              />

              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white shrink-0 shadow-lg bg-[var(--accent)]"
                >
                  {author.avatarInitials}
                </div>
                <div>
                  <h2 className="font-bold text-lg text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {author.name}
                  </h2>
                  <p className="text-xs text-[var(--muted)] mt-0.5 flex items-center gap-1">
                    <MapPin size={10} />
                    {author.location}
                  </p>
                </div>
              </div>

              {/* Tagline */}
              <p className="text-[11px] uppercase tracking-widest font-bold text-[var(--accent)] leading-relaxed">
                {author.tagline}
              </p>

              {/* Bio excerpt */}
              <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-3 flex-grow">
                {author.bio}
              </p>

              {/* Expertise tags */}
              <div className="flex flex-wrap gap-2">
                {author.expertise.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[9px] uppercase tracking-widest font-bold px-2.5 py-1 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-5 pt-4 border-t border-[var(--border)]/60">
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted)] font-semibold">
                  <FileText size={12} />
                  {author.articleCount} articles
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted)] font-semibold">
                  <Eye size={12} />
                  {formatNumber(author.baseViews)} views
                </span>
                <span className="flex items-center gap-1.5 text-xs text-[var(--muted)] font-semibold">
                  <Users size={12} />
                  <FollowerCount authorId={author.id} baseFollowers={author.baseFollowers} /> followers
                </span>
              </div>

              {/* Read more indicator */}
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors mt-1">
                View Profile
                <span className="w-5 h-[1px] bg-current transition-all duration-300 group-hover:w-8" />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
