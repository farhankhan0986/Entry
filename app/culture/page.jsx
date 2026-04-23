import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Culture | Entry",
  description: "Deep dives into society, art, human connection, and cultural phenomena.",
  alternates: { canonical: "https://entry-azure.vercel.app/culture" },
  openGraph: {
    title: "Culture | Entry",
    description: "Deep dives into society, art, human connection, and cultural phenomena.",
    url: "https://entry-azure.vercel.app/culture",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Culture | Entry",
    description: "Deep dives into society, art, human connection, and cultural phenomena.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Culture() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Culture" hot={false} journal={false} />;
}
