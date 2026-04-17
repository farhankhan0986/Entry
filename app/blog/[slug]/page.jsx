
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

  const contentLines = blog.content.split("\n");

  // Generate Table of Contents from markdown-style headers in content
  const toc = contentLines
    .filter(line => line.startsWith("## ")) // Only catch main headings
    .map(line => {
      const text = line.replace(/^##\s+/, ""); // Remove the "## " prefix
      const id = text.toLowerCase().replace(/[^\w-]/g, "-");
      return { text, id }; // Level is always 2, so we don't need it
    });

  return (
    <div className="min-h-screen bg-[var(--background)] font-playfair text-[var(--foreground)]">
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
            <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] [writing-mode:vertical-lr] rotate-180 mb-4">Share Story</p>
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
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] flex items-center justify-center font-bold">
                    {blog.authorName[0]}
                  </div>
                  <span className="font-bold text-[var(--foreground)]">{blog.authorName}</span>
                </div>
                <div className="flex items-center gap-2"><Calendar size={16} /> {date}</div>
                <div className="flex items-center gap-2"><Clock size={16} /> 8 min read</div>
                <Share post={blog} variant="inline" />
              </div>
            </header>

            {blog.bannerImage && (
              <div className="w-full h-[300px] md:h-[500px] mb-12 rounded-[40px] overflow-hidden shadow-2xl">
                <img src={blog.bannerImage} alt={blog.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Article Body */}
            <div className="max-w-3xl">
              <div className="text-lg md:text-xl leading-relaxed space-y-8">
                {(() => {
                  let firstParaSeen = false;
                  return contentLines.map((line, index) => {
                    // Heading parsing for ToC IDs
                    if (line.startsWith("## ") || line.startsWith("### ")) {
                      const level = line.startsWith("### ") ? 3 : 2;
                      const text = line.replace(/^###?\s+/, "");
                      const id = text.toLowerCase().replace(/[^\w-]/g, "-");
                      return level === 2 ? (
                        <h2 key={index} id={id} className="text-3xl text-amber-300 font-bold mt-12 mb-4 pt-4">{text}</h2>
                      ) : (
                        <h3 key={index} id={id} className="text-2xl font-bold mt-8 mb-2 text-[var(--foreground)]">{text}</h3>
                      );
                    }

                    if (line.includes("**")) {
                      const parts = line.split("**");

                      return (
                        <p key={index} className="text-[var(--foreground)]/90 whitespace-pre-wrap">
                          {parts.map((part, i) =>
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </p>
                      );
                    }

                    const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                    if (imgMatch) {
                      const [, alt, src] = imgMatch;
                      return (
                        <figure key={index} className="my-12 w-[300px] h-[300px] rounded-3xl mx-auto overflow-hidden border border-[var(--border)] shadow-sm bg-[var(--input)]">
                          <img src={src} alt={alt} className="w-full h-full object-cover" loading="lazy" />
                          {alt && <figcaption className="text-center text-sm text-[var(--muted)] py-4 bg-[var(--card)] italic">{alt}</figcaption>}
                        </figure>
                      );
                    }

                    if (line.trim() === "") return <div key={index} className="h-4" />;

                    const isFirst = !firstParaSeen;
                    firstParaSeen = true;

                    return (
                      <p key={index} className={`text-[var(--foreground)]/90 whitespace-pre-wrap${isFirst ? " first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-[var(--accent)]" : ""}`}>
                        {line}
                      </p>
                    );
                  });
                })()}
              </div>

              {/* 4. Newsletter Section (Inline) */}
              <Subscribe />


              {/* 5. Live Comments */}
              <CommentsSection
                blogId={blog.id || blog.slug}
                initialComments={initialComments}
              />

              <footer className="mt-16 pt-10 border-t border-[var(--border)]">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-[var(--card)]/10 p-8 rounded-3xl border border-[var(--border)]">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold bg-[var(--primary)] text-[var(--primary-foreground)] border-4 border-[var(--background)] shadow-lg">
                      {blog.authorName[0].toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-2xl">{blog.authorName}</h4>
                      <p className="text-[var(--muted)] italic">Contributor & Curator</p>
                    </div>
                  </div>
                  <Follow authorName={blog.authorName} />
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
              <div className="pt-8 border-t border-[var(--border)] flex gap-4 text-xs text-[var(--muted)] uppercase tracking-widest font-bold">
                <Link href="/privacy" className="hover:text-[var(--accent)]">Privacy</Link>
                <Link href="/terms" className="hover:text-[var(--accent)]">Terms</Link>
              </div>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}