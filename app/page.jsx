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
import ToolSpotlightGrid from '@/components/ToolSpotlightGrid'
import HeroSection from '@/components/HeroSection'
import { BookLock } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const blogs = await getAllBlogs();

  return (
    <div className="bg-[var(--background)] font-playfair overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <HeroSection blogCount={blogs.length} />

      {/* Decorative Divider */}
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-4 py-8">
          <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-[var(--muted)] whitespace-nowrap">Our Tools</span>
          <div className="h-[1px] w-full bg-gradient-to-r from-[var(--border)] to-transparent" />
        </div>
      </div>

      {/* 2. TOOLS SPOTLIGHT */}
      <ToolSpotlightGrid />

      {/* 3. DIARY CTA STRIP */}
      <div className="container mx-auto px-6 py-10">
        <div className="relative rounded-3xl overflow-hidden border border-[var(--border)] bg-gradient-to-br from-[var(--card)]/20 to-[var(--accent)]/5 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          {/* BG glow */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl bg-[var(--accent)]/8 -mr-20 -mt-20 pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-[var(--accent)] font-bold tracking-[0.3em] uppercase text-[10px] mb-4">
              <BookLock size={12} />
              <span>Private & Encrypted</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--foreground)] mb-3 max-w-lg">
              Your thoughts deserve a{" "}
              <span className="text-[var(--accent)] italic">safe space</span>.
            </h2>
            <p className="text-[var(--muted)] text-lg italic leading-relaxed max-w-md">
              Dear Diary is your private, encrypted journal — mood tracking, writing streaks, and AI-powered reflections. Only you can read it.
            </p>
          </div>
          <div className="relative z-10 flex flex-col items-center gap-3 shrink-0">
            <Link
              href="/diary"
              className="flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] hover:bg-[var(--accent)] hover:text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <BookLock size={16} /> Start My Diary
            </Link>
            <span className="text-[10px] uppercase tracking-widest text-[var(--muted)] font-bold">Free · No ads · End-to-end encrypted</span>
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

      {/* 4. BLOGS FEED */}
      <section id="blogs" className="pb-6">
        <Blogs limit={6} hot={true} />
      </section>
    </div>
  );
}