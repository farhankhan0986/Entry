import { notFound } from "next/navigation";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Globe,
  X,
  FileText,
  Eye,
  Users,
  ArrowLeft,
  Clock,
  ThumbsUp,
  User,
} from "lucide-react";
import {
  getAuthorBySlug,
  getBlogsByAuthor,
  staticAuthors,
} from "@/lib/staticData";
import {
  getDbBlogsByAuthorName,
  getStatsForSlugs,
  getAuthorProfile,
} from "@/lib/actions/authorActions";
import AuthorFollowButton from "@/components/AuthorFollowButton";
import FollowerCount from "@/components/FollowerCount";
import { getAuthorSlug } from "@/lib/authorUtils";

export const dynamic = "force-dynamic";

/* ─── Static params (pre-renders known static authors) ─────────────── */
export async function generateStaticParams() {
  return staticAuthors.map((a) => ({ slug: a.slug }));
}

/* ─── Metadata ─────────────────────────────────────────────────────── */
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const staticAuthor = getAuthorBySlug(slug);

  if (staticAuthor) {
    return {
      title: `${staticAuthor.name} — Author Profile | Entry`,
      description: staticAuthor.bio.slice(0, 160),
      alternates: {
        canonical: `https://entry-azure.vercel.app/authors/${slug}`,
      },
    };
  }

  // Dynamic author: derive display name from slug ("rahul-jain" → "Rahul Jain")
  const displayName = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${displayName} — Author`,
    description: `Read all published articles by ${displayName} on Entry.`,
  };
}

/* ─── Helpers ──────────────────────────────────────────────────────── */
function formatNumber(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function slugToName(slug) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/* ─── Shared Article Card ──────────────────────────────────────────── */
function ArticleCard({ blog }) {
  const wordCount = blog.content?.trim().split(/\s+/).length || 200;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const excerpt =
    blog.content.replace(/[#*\[\]!]/g, "").slice(0, 140).trim() + "…";
  const date = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-300 flex flex-col"
    >
      {blog.bannerImage && (
        <div className="relative w-full h-52 overflow-hidden">
          <img
            src={blog.bannerImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-3 left-3">
            <span className="bg-[var(--background)]/90 backdrop-blur-md text-[var(--foreground)] text-[9px] uppercase tracking-[0.2em] font-bold px-3 py-1.5 rounded-full border border-[var(--border)]">
              {blog.category}
            </span>
          </div>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-bold text-base leading-snug text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors line-clamp-2 mb-3">
          {blog.title}
        </h3>
        <p className="text-sm text-[var(--muted)] leading-relaxed line-clamp-2 flex-grow mb-5">
          {excerpt}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]/50 text-[10px] uppercase tracking-widest font-bold text-[var(--muted)]">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {readTime} min
          </span>
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}

/* ─── Stats Bar ────────────────────────────────────────────────────── */
function StatsBar({ items }) {
  return (
    <div className="grid max-sm:grid-cols-1 grid-cols-3 gap-4">
      {items.map(({ label, value, icon: Icon }) => (
        <div
          key={label}
          className="bg-[var(--background)] border border-[var(--border)] rounded-2xl p-5 text-center"
        >
          <Icon size={18} className="mx-auto mb-2 text-[var(--accent)]" />
          <p className="text-2xl font-extrabold text-[var(--foreground)]">
            {value}
          </p>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] mt-1">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   PAGE
   ══════════════════════════════════════════════════════════════════ */
export default async function AuthorProfilePage({ params }) {
  const { slug } = await params;

  /* ── 1. Try static author ───────────────────────────────────────── */
  const staticAuthor = getAuthorBySlug(slug);

  if (staticAuthor) {
    const blogs = getBlogsByAuthor(staticAuthor.name);

    return (
      <StaticAuthorPage
        author={staticAuthor}
        blogs={blogs}
      />
    );
  }

  /* ── 2. Try dynamic (DB) author ─────────────────────────────────── */
  // Convert slug back to a display name to query the DB
  const guessedName = slugToName(slug);
  const dbBlogs = await getDbBlogsByAuthorName(guessedName);

  if (dbBlogs.length === 0) {
    notFound();
  }

  // Pick metadata from the first blog written by this user
  const firstBlog = dbBlogs[0];
  const authorImage = firstBlog.authorImage || null;
  const authorName = firstBlog.authorName;
  const authorId = firstBlog.authorId || `db_${slug}`;

  // Fetch saved profile + real view stats in parallel
  const [{ totalViews, totalLikes }, userProfile] = await Promise.all([
    getStatsForSlugs(dbBlogs.map((b) => b.slug)),
    getAuthorProfile(authorId),
  ]);

  const joinedAt = dbBlogs[dbBlogs.length - 1]?.createdAt || firstBlog.createdAt;

  return (
    <DynamicAuthorPage
      authorName={authorName}
      authorImage={authorImage}
      authorId={authorId}
      slug={slug}
      blogs={dbBlogs}
      totalViews={totalViews}
      totalLikes={totalLikes}
      joinedAt={joinedAt}
      userProfile={userProfile}
    />
  );
}

/* ════════════════════════════════════════════════════════════════════
   STATIC AUTHOR LAYOUT
   ══════════════════════════════════════════════════════════════════ */
function StaticAuthorPage({ author, blogs }) {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-playfair">
      <div className="container mx-auto px-6 pt-10 max-w-6xl">
        <Link
          href="/authors"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={15} />
          All Authors
        </Link>
      </div>

      <section className="container mx-auto px-6 pt-10 pb-16 max-w-6xl">
        <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-[40px] overflow-hidden">
          {/* Accent banner — uses theme accent color */}
          <div className="h-40 w-full relative bg-gradient-to-br from-[var(--accent)]/20 via-[var(--accent)]/10 to-transparent">
            <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4 bg-[var(--accent)]" />
          </div>

          <div className="px-8 md:px-14 pb-12">
            <div className="-mt-14 mb-6 flex items-end gap-6 flex-wrap">
              <div className="w-28 h-28 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-[var(--background)] shrink-0 relative z-10 bg-[var(--accent)]">
                {author.avatarInitials}
              </div>
              <div className="mb-2">
                <AuthorFollowButton
                  authorId={author.id}
                  authorName={author.name}
                  baseFollowers={author.baseFollowers}
                  size="md"
                  showCount={true}
                />
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
              {author.name}
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--accent)] mb-6">
              {author.tagline}
            </p>
            <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed max-w-3xl mb-8">
              {author.bio}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-5 mb-8">
              {author.location && (
                <span className="flex items-center gap-1.5 text-sm text-[var(--muted)] font-semibold">
                  <MapPin size={14} /> {author.location}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-[var(--muted)] font-semibold">
                <Calendar size={14} /> Member since {formatDate(author.joinedAt)}
              </span>
              {author.website && (
                <a
                  href={`https://${author.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] font-semibold hover:underline"
                >
                  <Globe size={14} /> {author.website}
                </a>
              )}
              {author.twitter && (
                <a
                  href={`https://twitter.com/${author.twitter.replace("@", "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] font-semibold hover:underline"
                >
                  <X size={14} /> {author.twitter}
                </a>
              )}
            </div>

            {/* Expertise tags — themed with accent */}
            <div className="flex flex-wrap gap-2 mb-8">
              {author.expertise.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/25"
                >
                  {tag}
                </span>
              ))}
            </div>

            <StatsBar
              items={[
                { label: "Articles", value: blogs.length, icon: FileText },
                {
                  label: "Total Views",
                  value: formatNumber(author.baseViews),
                  icon: Eye,
                },
                {
                  label: "Followers",
                  value: <FollowerCount authorId={author.id} baseFollowers={author.baseFollowers} />,
                  icon: Users,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      <ArticlesSection blogs={blogs} authorName={author.name} />
    </main>
  );
}

/* ════════════════════════════════════════════════════════════════════
   DYNAMIC (DB) AUTHOR LAYOUT
   ══════════════════════════════════════════════════════════════════ */
function DynamicAuthorPage({
  authorName,
  authorImage,
  authorId,
  slug,
  blogs,
  totalViews,
  totalLikes,
  joinedAt,
  userProfile,
}) {
  // Deterministic accent color from authorId
  const PALETTE = [
    "#6366f1", "#0891b2", "#059669", "#d97706",
    "#dc2626", "#7c3aed", "#be123c", "#0f766e",
  ];
  const colorIdx =
    authorId.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) %
    PALETTE.length;
  const accentColor = userProfile?.accentColor || PALETTE[colorIdx];

  const initials = authorName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Prefer saved profile data, fall back to generic
  const tagline = userProfile?.tagline || "Community Writer · Entry Member";
  const bio = userProfile?.bio || null;
  const location = userProfile?.location || null;
  const website = userProfile?.website || null;
  const twitter = userProfile?.twitter || null;
  const instagram = userProfile?.instagram || null;
  const linkedin = userProfile?.linkedin || null;
  const github = userProfile?.github || null;
  const tags = userProfile?.tags?.length ? userProfile.tags : [];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-playfair">
      <div className="container mx-auto px-6 pt-10 max-w-6xl">
        <Link
          href="/authors"
          className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors text-sm font-semibold"
        >
          <ArrowLeft size={15} />
          All Authors
        </Link>
      </div>

      <section className="container mx-auto px-6 pt-10 pb-16 max-w-6xl">
        <div className="relative bg-[var(--card)] border border-[var(--border)] rounded-[40px] overflow-hidden">
          {/* Accent banner */}
          <div
            className="h-40 w-full relative"
            style={{
              background: `linear-gradient(135deg, ${accentColor}33 0%, ${accentColor}11 100%)`,
            }}
          >
            <div
              className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10 -translate-y-1/2 translate-x-1/4"
              style={{ background: accentColor }}
            />
          </div>

          <div className="px-8 md:px-14 pb-12">
            {/* Avatar + Follow */}
            <div className="-mt-14 mb-6 flex items-end gap-6 flex-wrap">
              {authorImage ? (
                <img
                  src={authorImage}
                  alt={authorName}
                  className="w-28 h-28 rounded-3xl object-cover shadow-2xl border-4 border-[var(--background)] shrink-0 relative z-10"
                />
              ) : (
                <div
                  className="w-28 h-28 rounded-3xl flex items-center justify-center text-4xl font-black text-white shadow-2xl border-4 border-[var(--background)] shrink-0 relative z-10"
                  style={{ background: accentColor }}
                >
                  {initials}
                </div>
              )}
              <div className="mb-2">
                <AuthorFollowButton
                  authorId={authorId}
                  authorName={authorName}
                  baseFollowers={0}
                  size="md"
                  showCount={true}
                />
              </div>
            </div>

            {/* Name & tagline */}
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-2">
              {authorName}
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--accent)] mb-6">
              {tagline}
            </p>

            {/* Bio */}
            <p className="text-[var(--muted)] text-base md:text-lg leading-relaxed max-w-3xl mb-8" style={{ fontStyle: bio ? "normal" : "italic" }}>
              {bio ||
                `${authorName} is a member of the Entry community. Explore their published articles below and follow along for more.`}
            </p>

            {/* Meta row */}
            <div className="flex flex-wrap gap-5 mb-8">
              {location && (
                <span className="flex items-center gap-1.5 text-sm text-[var(--muted)] font-semibold">
                  <MapPin size={14} /> {location}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm text-[var(--muted)] font-semibold">
                <Calendar size={14} />
                Writing since {formatDate(joinedAt)}
              </span>
              {website && (
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] font-semibold hover:underline"
                >
                  <Globe size={14} />
                  {website.replace(/^https?:\/\//, "")}
                </a>
              )}
              {twitter && (
                <a
                  href={`https://twitter.com/${twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] font-semibold hover:underline"
                >
                  <X size={14} /> @{twitter}
                </a>
              )}
              {instagram && (
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] font-semibold hover:underline"
                >
                  <User size={14} /> @{instagram}
                </a>
              )}
              {linkedin && (
                <a
                  href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] font-semibold hover:underline"
                >
                  <Globe size={14} /> LinkedIn
                </a>
              )}
              {github && (
                <a
                  href={`https://github.com/${github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-[var(--accent)] font-semibold hover:underline"
                >
                  <User size={14} /> {github}
                </a>
              )}
            </div>

            {/* Expertise tags (from saved profile) */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full"
                    style={{
                      background: `${accentColor}18`,
                      color: accentColor,
                      border: `1px solid ${accentColor}30`,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <StatsBar
              items={[
                { label: "Articles", value: blogs.length, icon: FileText },
                { label: "Total Views", value: formatNumber(totalViews), icon: Eye },
                { label: "Total Likes", value: formatNumber(totalLikes), icon: ThumbsUp },
              ]}
            />
          </div>
        </div>
      </section>

      <div className="w-full h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      <ArticlesSection blogs={blogs} authorName={authorName} />
    </main>
  );
}

/* ─── Shared Articles Grid ─────────────────────────────────────────── */
function ArticlesSection({ blogs, authorName }) {
  return (
    <section className="container mx-auto px-6 py-16 max-w-6xl">
      <div className="mb-10">
        <h2 className="text-3xl font-bold text-[var(--foreground)]">
          Published Articles
        </h2>
        <p className="text-[var(--muted)] text-sm mt-1">
          {blogs.length} {blogs.length === 1 ? "entry" : "entries"} by{" "}
          {authorName}
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-20 border-2 border-dashed border-[var(--border)] rounded-3xl">
          <p className="text-xl text-[var(--muted)]">
            No published articles yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <ArticleCard key={blog.id ?? blog.slug} blog={blog} />
          ))}
        </div>
      )}
    </section>
  );
}
