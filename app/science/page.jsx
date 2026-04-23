import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Science | Entry",
  description: "Discover fascinating scientific discoveries, theories, and explorations of the natural world.",
  alternates: { canonical: "https://entry-azure.vercel.app/science" },
  openGraph: {
    title: "Science | Entry",
    description: "Discover fascinating scientific discoveries, theories, and explorations of the natural world.",
    url: "https://entry-azure.vercel.app/science",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Science | Entry",
    description: "Discover fascinating scientific discoveries, theories, and explorations of the natural world.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Science() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Science" hot={false} journal={false} />;
}
