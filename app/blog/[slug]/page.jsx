
import { getBlogBySlug, getRelatedPosts, getComments } from "@/lib/actions/blogActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar, Clock, Share2, ChevronRight, Mail, Link2
} from "lucide-react";
import Subscribe from "@/components/Subscribe";
import CommentsSection from "@/components/CommentsSection";
import Share from "@/components/Share";
import SocialButton from "@/components/SocialButton";
import Follow from "@/components/Follow";
import AuthorFollowButton from "@/components/AuthorFollowButton";
import GenericPoll from "@/components/GenericPoll";
import BlogInteractions from "@/components/BlogInteractions";
import BookmarkButton from "@/components/BookmarkButton";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import RelatedTools from "@/components/RelatedTools";
import { getAuthorBySlug, getAuthorSlug } from "@/lib/staticData";

// Strip markdown characters for clean meta descriptions
function stripMarkdown(text = "") {
  return text
    .replace(/#{1,6}\s+/g, "")   // headings
    .replace(/\*\*/g, "")         // bold
    .replace(/\*/g, "")           // italic
    .replace(/`/g, "")            // code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "")  // images
    .replace(/\n+/g, " ")         // newlines → space
    .replace(/\s{2,}/g, " ")      // collapse spaces
    .trim();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Not Found",
      description: "This entry does not exist.",
    };
  }

  const cleanDescription = stripMarkdown(blog.content).slice(0, 160);
  const fallbackOg = "https://entry-azure.vercel.app/og-default.jpg";
  const rawImage = blog.bannerImage?.trim();
  const imageUrl = rawImage
    ? rawImage.startsWith("http")
      ? rawImage
      : `https://entry-azure.vercel.app${rawImage}`
    : fallbackOg;
  const url = `https://entry-azure.vercel.app/blog/${blog.slug}`;
  const publishedTime = new Date(blog.createdAt).toISOString();

  return {
    title: blog.title,
    description: cleanDescription,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      type: "article",
      url,
      siteName: "Entry",
      title: blog.title,
      description: cleanDescription,
      publishedTime,
      authors: [blog.authorName],
      section: blog.category,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@entryjournal",
      title: blog.title,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) notFound();

  const [relatedPosts, initialComments] = await Promise.all([
    getRelatedPosts(blog.category, blog.id || blog.slug),
    getComments(blog.id || blog.slug),
  ]);

  const date = new Date(blog.createdAt).toLocaleDateString("en-IN", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const contentLines = blog.content.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  // Calculate real read time based on word count at 200 wpm
  const wordCount = blog.content.trim().split(/\s+/).length;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Resolve static author profile data (for Follow button + profile link)
  const authorSlug = getAuthorSlug(blog.authorName);
  const staticAuthor = getAuthorBySlug(authorSlug);

  // Generate Table of Contents from markdown-style headers in content
  const toc = contentLines
    .filter(line => line.trim().startsWith("## ")) // Only catch main headings
    .map(line => {
      const text = line.trim().replace(/^##\s+/, ""); // Remove the "## " prefix
      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
      return { text, id }; // Level is always 2, so we don't need it
    });

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
      <ReadingProgressBar />
      {/* JSON-LD: Article + Breadcrumb structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: blog.title,
              description: stripMarkdown(blog.content).slice(0, 160),
              image: blog.bannerImage,
              datePublished: new Date(blog.createdAt).toISOString(),
              author: { "@type": "Person", name: blog.authorName },
              publisher: {
                "@type": "Organization",
                name: "Entry",
                url: "https://entry-azure.vercel.app",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://entry-azure.vercel.app/blog/${blog.slug}`,
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://entry-azure.vercel.app" },
                { "@type": "ListItem", position: 2, name: "Journal", item: "https://entry-azure.vercel.app/journal" },
                { "@type": "ListItem", position: 3, name: blog.title, item: `https://entry-azure.vercel.app/blog/${blog.slug}` },
              ],
            },
          ]),
        }}
      />

      {/* 1. Breadcrumbs */}
      <nav className="container mx-auto px-4 pt-12 max-w-7xl flex items-center gap-2 text-sm text-[var(--muted)]">
        <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
        <ChevronRight size={14} />
        <Link href="/journal" className="hover:text-[var(--accent)] transition-colors">Journal</Link>
        <ChevronRight size={14} />
        <span className="italic truncate">{blog.title}</span>
      </nav>

      <article className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 relative">

          {/* 2. Left Sticky Social Share (Desktop) */}
          <aside className="hidden xl:flex flex-col gap-4 sticky top-32 h-fit shrink-0">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] [writing-mode:vertical-lr] rotate-180 mb-2">Share Story</p>
            <SocialButton />
            <div className="w-10 border-b border-border my-2"></div>
            <Share post={blog} variant="icon" />
          </aside>

          {/* 3. Main Content Column */}
          <div className="flex-1 min-w-0">
            <header className="mb-12 text-center lg:text-left">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--accent)] border border-[var(--accent)] px-4 py-1.5 rounded-full">
                  {blog.category}
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-[var(--foreground)]">
                {blog.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 py-6 border-y border-[var(--border)] text-[var(--muted)]">
                <div className="flex items-center gap-3">
                  <Link href={`/authors/${authorSlug}`}>
                    <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold hover:opacity-80 transition-opacity">
                      {blog.authorName[0]}
                    </div>
                  </Link>
                  <Link href={`/authors/${authorSlug}`} className="font-bold text-[var(--foreground)] hover:text-[var(--accent)] transition-colors">{blog.authorName}</Link>
                </div>
                <div className="flex items-center gap-2"><Calendar size={16} /> {date}</div>
                <div className="flex items-center gap-2"><Clock size={16} /> {readTime} min read</div>
                <Share post={blog} variant="inline" />
                <BookmarkButton slug={blog.slug} size="lg" />
              </div>
              <BlogInteractions slug={blog.slug} />
            </header>

            {blog.bannerImage && (
              <div className="w-full h-[300px] md:h-[500px] mb-12 rounded-[40px] overflow-hidden shadow-2xl">
                <img src={blog.bannerImage} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Poll Example */}
            {blog.poll && (
              <GenericPoll
                question={blog.poll.question}
                options={blog.poll.options}
              />
            )}
            {/* Article Body */}
            <div className="max-w-3xl">
              <div className="text-lg md:text-xl leading-8 md:leading-9">
                {(() => {
                  let firstParaSeen = false;

                  /* ── Inline formatter: bold, italic, inline-code, links ── */
                  const formatInline = (text) => {
                    // Split on **bold**, *italic*, `code`, [link](url) tokens
                    const parts = text.split(/(\*\*.*?\*\*|\*[^*]+?\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g);
                    return parts.map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**"))
                        return <strong key={i} className="font-bold text-[var(--foreground)]">{part.slice(2, -2)}</strong>;
                      if (part.startsWith("*") && part.endsWith("*"))
                        return <em key={i} className="italic text-[var(--foreground)]/80">{part.slice(1, -1)}</em>;
                      if (part.startsWith("`") && part.endsWith("`"))
                        return <code key={i} className="font-mono text-sm bg-[var(--card)] border border-[var(--border)] text-[var(--accent)] rounded px-1.5 py-0.5 mx-0.5">{part.slice(1, -1)}</code>;

                      // Links
                      if (part.startsWith("[") && part.includes("](") && part.endsWith(")")) {
                        const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
                        if (match) {
                          const [, label, url] = match;
                          return (
                            <a
                              key={i}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--accent)] underline underline-offset-4 hover:opacity-80 transition-opacity font-medium"
                            >
                              {label}
                            </a>
                          );
                        }
                      }

                      return part;
                    });
                  };

                  /* ── Group consecutive list lines into <ul> blocks ── */
                  const grouped = [];
                  let i = 0;
                  while (i < contentLines.length) {
                    const trimmed = contentLines[i].trim();
                    if (trimmed.startsWith("- ")) {
                      const items = [];
                      while (i < contentLines.length && contentLines[i].trim().startsWith("- ")) {
                        items.push(contentLines[i].trim().slice(2));
                        i++;
                      }
                      grouped.push({ type: "list", items });
                    } else {
                      grouped.push({ type: "line", text: contentLines[i] });
                      i++;
                    }
                  }

                  return grouped.map((block, index) => {
                    /* ── Bullet list ── */
                    if (block.type === "list") {
                      return (
                        <ul key={index} className="my-6 space-y-3 pl-6 list-none">
                          {block.items.map((item, j) => (
                            <li
                              key={j}
                              className="flex items-start gap-3 leading-7 text-[var(--foreground)]/90"
                            >
                              <span className="mt-[11px] w-2 h-2 rounded-full bg-[var(--accent)] shrink-0" />
                              <span>{formatInline(item)}</span>
                            </li>
                          ))}
                        </ul>
                      );
                    }

                    const trimmed = block.text.trim();

                    /* ── Horizontal rule ── */
                    if (trimmed === "---") {
                      return <hr key={index} className="my-10 border-0 h-px bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />;
                    }

                    /* ── H2 ── */
                    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
                      const text = trimmed.slice(3);
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                      return (
                        <h2 key={index} id={id} className="scroll-mt-28 text-3xl md:text-4xl font-extrabold tracking-tight mt-16 mb-6 pb-4 text-[var(--accent)] relative">
                          {text}
                          <span className="absolute left-0 bottom-0 h-[2px] w-full bg-gradient-to-r from-[var(--accent)]/10 via-[var(--accent)] to-[var(--accent)]/10 rounded-full" />
                        </h2>
                      );
                    }

                    /* ── H3 ── */
                    if (trimmed.startsWith("### ")) {
                      const text = trimmed.slice(4);
                      const id = text.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");
                      return (
                        <h3 key={index} id={id} className="scroll-mt-28 text-2xl md:text-3xl font-bold mt-10 mb-4 text-[var(--foreground)]">
                          {text}
                        </h3>
                      );
                    }

                    /* ── Blockquote ── */
                    if (trimmed.startsWith("> ")) {
                      return (
                        <blockquote key={index} className="my-8 border-l-4 border-[var(--accent)] pl-5 italic text-[var(--foreground)]/80 text-xl">
                          {formatInline(trimmed.slice(2))}
                        </blockquote>
                      );
                    }

                    /* ── Inline image ── */
                    const imgMatch = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);

if (imgMatch) {
  const [, alt, src] = imgMatch;

  const styles =
    alt === "style2"
      ? "w-full h-[240px] sm:h-[280px] md:max-w-md md:h-[320px] mx-auto rounded-2xl"
      : alt === "style3"
      ? "w-full max-w-xs sm:max-w-sm md:max-w-md h-auto mx-auto rounded-2xl p-4"
      : "w-full h-[300px] sm:h-[400px] md:max-w-2xl md:h-[500px] md:w-[500px] mx-auto rounded-3xl";

  const imageClass =
    alt === "style3"
      ? "w-full h-full object-contain"
      : "w-full h-full object-cover transition duration-500 group-hover:scale-105";

  return (
    <figure
      key={index}
      className={`group my-10 overflow-hidden border border-[var(--border)] bg-[var(--card)] shadow-xl ${styles}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={imageClass}
      />
    </figure>
  );
}
                    /* ── Empty line ── */
                    if (!trimmed) {
                      return <div key={index} className="h-6" />;
                    }

                    /* ── Paragraph ── */
                    const isFirst = !firstParaSeen;
                    firstParaSeen = true;
                    return (
                      <p key={index} className={`text-[var(--foreground)]/90 mb-6 whitespace-pre-wrap tracking-[0.01em] ${isFirst ? "first-letter:text-6xl first-letter:font-black first-letter:mr-3 first-letter:float-left first-letter:leading-none first-letter:text-[var(--accent)]" : ""}`}>
                        {formatInline(trimmed)}
                      </p>
                    );
                  });
                })()}
              </div>

              {/* 4. Newsletter Section (Inline) */}
              <Subscribe />

              {/* 4b. Related Tools (category-aware) */}
              <RelatedTools category={blog.category} />

              {/* 5. Live Comments */}
              <CommentsSection
                blogId={blog.id || blog.slug}
                initialComments={initialComments}
              />

              <footer className="mt-16 pt-10 border-t border-[var(--border)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[var(--card)]/10 p-8 rounded-3xl border border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <Link href={`/authors/${authorSlug}`}>
                      {blog.authorImage ? (
                        <img
                          src={blog.authorImage}
                          alt={blog.authorName}
                          className="w-20 h-20 rounded-full object-cover border-4 border-[var(--background)] shadow-lg hover:opacity-80 transition-opacity"
                        />
                      ) : (
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-[var(--primary)] text-[var(--primary-foreground)] border-4 border-[var(--background)] shadow-lg hover:opacity-80 transition-opacity">
                          {blog.authorName[0].toUpperCase()}
                        </div>
                      )}
                    </Link>
                    <div>
                      <Link href={`/authors/${authorSlug}`} className="hover:text-[var(--accent)] transition-colors">
                        <h4 className="font-bold text-2xl">{blog.authorName}</h4>
                      </Link>
                      <p className="text-[var(--muted)] italic">
                        {staticAuthor ? staticAuthor.tagline : "Community Writer · Entry Member"}
                      </p>
                    </div>
                  </div>
                  <AuthorFollowButton
                    authorId={staticAuthor ? staticAuthor.id : (blog.authorId || `db_${authorSlug}`)}
                    authorName={blog.authorName}
                    baseFollowers={staticAuthor ? staticAuthor.baseFollowers : 0}
                    size="md"
                    showCount={true}
                  />
                </div>
              </footer>
            </div>
          </div>

          {/* 6. Right Column: Sidebar */}
          <aside className="w-full lg:w-[350px] shrink-0">
            <div className="sticky top-32 space-y-12">

              {/* In This Article (Table of Contents) */}
              {toc.length > 0 && (
                <div className="p-8 bg-[var(--card)]/10 border border-[var(--border)] rounded-[32px] shadow-sm">
                  <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--accent)] mb-6">In This Article</h4>
                  <ul className="space-y-4">
                    {toc.map((item, i) => (
                      <li key={i}>
                        <a
                          href={`#${item.id}`}
                          className="text-[var(--foreground)]/70 hover:text-[var(--accent)] transition-colors text-sm font-medium leading-snug block"
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Related Stories */}
              <div className="space-y-6">
                <h4 className="text-xs uppercase tracking-[0.3em] font-bold text-[var(--accent)] ml-2">Related Stories</h4>
                <div className="grid gap-6">
                  {relatedPosts?.map((post) => (
                    <Link key={post._id ?? post.id ?? post.slug} href={`/blog/${post.slug}`} className="group flex gap-4 items-center p-2 rounded-2xl hover:bg-[var(--card)] transition-all">
                      <div className="h-20 w-20 bg-[var(--border)] rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <img src={post.bannerImage} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <h5 className="font-bold leading-tight text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                          {post.title}
                        </h5>
                        <p className="text-[10px] uppercase tracking-widest text-[var(--muted)] mt-2 italic">Read Story</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Footer Links */}
              {/* <div className="pt-8 border-t border-[var(--border)] flex gap-4 text-xs text-[var(--muted)] uppercase tracking-widest font-bold">
                <Link href="/privacy" className="hover:text-[var(--accent)]">Privacy</Link>
                <Link href="/terms" className="hover:text-[var(--accent)]">Terms</Link>
              </div> */}
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}