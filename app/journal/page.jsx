import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "The Journal",
  description: "Browse the full archive of stories, ideas, and reflections from our community of writers.",
  alternates: { canonical: "https://entry-azure.vercel.app/journal" },
  openGraph: {
    title: "The Journal | Entry",
    description: "Browse the full archive of stories, ideas, and reflections from our community of writers.",
    url: "https://entry-azure.vercel.app/journal",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Journal | Entry",
    description: "Browse the full archive of stories, ideas, and reflections from our community of writers.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Blogs() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} journal={true} />;
}