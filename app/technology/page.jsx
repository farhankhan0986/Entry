import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Technology | Entry",
  description: "Explore the latest in tech, software engineering, AI, and the future of innovation.",
  alternates: { canonical: "https://entry-azure.vercel.app/technology" },
  openGraph: {
    title: "Technology | Entry",
    description: "Explore the latest in tech, software engineering, AI, and the future of innovation.",
    url: "https://entry-azure.vercel.app/technology",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Technology | Entry",
    description: "Explore the latest in tech, software engineering, AI, and the future of innovation.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Technology() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Technology" hot={false} journal={false} />;
}
