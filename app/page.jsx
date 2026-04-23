import { getAllBlogs } from "@/lib/actions/blogActions";

export const metadata = {
  title: "Entry — The Journal | Stories, Ideas & Reflections",
  description: "Entry is a modern editorial platform publishing authentic stories on tech, psychology, world history, biographies, mysteries, and more. Start reading today.",
  alternates: { canonical: "https://entry-azure.vercel.app" },
  openGraph: {
    type: "website",
    url: "https://entry-azure.vercel.app",
    siteName: "Entry",
    title: "Entry — The Journal | Stories, Ideas & Reflections",
    description: "Entry is a modern editorial platform publishing authentic stories on tech, psychology, world history, biographies, mysteries, and more. Start reading today.",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630, alt: "Entry — The Journal" }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@entryjournal",
    title: "Entry — The Journal | Stories, Ideas & Reflections",
    description: "Entry is a modern editorial platform publishing authentic stories on tech, psychology, world history, biographies, mysteries, and more. Start reading today.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};
import Blogs from '@/components/Blogs'
import { ArrowRight, Star } from "lucide-react";
import Follow from "@/components/Follow";
import Button from "@/components/Button";
import Link from "next/link";
import { FaLinkedin,FaFacebook, FaInstagram, FaTwitter, FaGithub } from "react-icons/fa6";

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <div className="bg-[var(--background)] font-playfair overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <div className="w-full min-h-[calc(100vh-5rem)] flex lg:flex-row flex-col items-center justify-between container mx-auto px-6 py-12 lg:py-0">

        {/* Left Side: Editorial Typography */}
        <div className="w-full lg:w-1/2 flex flex-col items-start justify-center text-left space-y-6 lg:pr-12">
          <div className="flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-xs">
            <Star size={14} fill="currentColor" />
            <span>Journal Edition 2026</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold text-[var(--foreground)] tracking-tight leading-[0.9]">
            Entry<span className="text-[var(--accent)]">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-[var(--muted)] leading-relaxed italic opacity-80">
            "Where thoughts find words, emotions meet understanding, and every story feels a little less alone."
          </p>

          <div className="pt-8 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[var(--border)] mb-12">

            {/* Wording: Instead of "Number of Blogs", use "Total Entries" or "Manuscripts" */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.2em] uppercase text-[10px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                </span>
                Live Archive
              </div>
              <h2 className="text-4xl font-bold text-[var(--foreground)] tracking-tight">
                {blogs.length} <span className="text-[var(--muted)] font-playfair italic font-medium text-2xl ml-2">Published Entries</span>
              </h2>
            </div>

            {/* Added Content: Dynamic filter info or sub-wording */}
            <div className="flex flex-col md:items-end gap-2">
              <p className="text-sm text-[var(--muted)] italic max-w-[200px] md:text-right leading-snug">
                "A growing collection of narratives, captured in time."
              </p>
            </div>

          </div>
        </div>

        {/* Right Side: Featured "Author Spotlight" Card */}
        <div className="w-full lg:w-1/2 flex items-center justify-center lg:justify-end mt-12 lg:mt-0">
          <div className="max-w-xl w-full bg-[var(--card)]/10 border border-[var(--border)] rounded-[40px] shadow-2xl p-10 relative overflow-hidden group">
            {/* Subtle Texture Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--accent)]/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:bg-[var(--accent)]/10 transition-all duration-700" />

            {/* User Info Header */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex flex-wrap items-center gap-5">
                <div className="relative">
                  <img
                    src="entry.png"
                    alt="Entry"
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent)] shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-[var(--accent)] w-5 h-5 rounded-full border-2 border-[var(--card)]" />
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-[var(--foreground)] leading-none">
                    Entry
                  </h3>
                  <p className="text-xs uppercase tracking-widest text-[var(--muted)] font-bold mt-2">
                    GLOBAL STORIES
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <a href="https://www.instagram.com/entry_blogs/" target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    <FaInstagram size={20} />
                  </a>
                  <a href="https://www.facebook.com/entry.blogs" target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    <FaFacebook size={20} />
                  </a>
                  <a href="https://x.com/Entry_Blogs" target="_blank" className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
                    <FaTwitter size={20} />
                  </a>
                </div>
              </div>

              <Follow />
            </div>

            {/* Content Body */}
            <div className="space-y-6">
              <p className="text-3xl md:text-4xl leading-snug font-bold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors duration-500">
                A sanctuary for authentic voices and creative minds.
              </p>

              <p className="text-[var(--muted)] text-lg leading-relaxed italic opacity-80">
                Discover meaningful writings that transcend the digital noise.
                Whether you're chronicling your journey or building the future, your entry starts here.
              </p>
            </div>

            {/* Footer Metrics */}
            <div className="mt-10 flex items-center justify-between pt-8 border-t border-[var(--border)]">
              <div className="text-sm">
                <span className="font-bold text-[var(--foreground)]">2.3k</span>
                <span className="text-[var(--muted)] ml-1 uppercase tracking-tighter text-xs font-bold">Reflections</span>
              </div>
              <Button href="/journal" />
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Divider */}
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 py-8">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[var(--muted)] whitespace-nowrap">Latest Entries</span>
          <div className="h-[1px] w-full bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>
      </div>

      {/* 2. BLOGS FEED */}
      <section id="blogs" className="pb-6">
        <Blogs limit={6} hot={true} />
      {/* <div className="pt-6 border-t border-[var(--border)] flex items-center justify-center gap-4 text-xs text-[var(--muted)] uppercase tracking-widest font-bold">
        <Link href="/privacy" className="hover:text-[var(--accent)]">Privacy</Link>
        <Link href="/terms" className="hover:text-[var(--accent)]">Terms</Link>
      </div> */}
      </section>
    </div>
  );
}