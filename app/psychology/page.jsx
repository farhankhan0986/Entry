import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Psychology",
  description: "Explore the human mind and behavior and unlock your potential.",
  alternates: { canonical: "https://entry-azure.vercel.app/psychology" },
  openGraph: {
    title: "Psychology | Entry",
    description: "Explore the human mind and behavior and unlock your potential.",
    url: "https://entry-azure.vercel.app/psychology",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Psychology | Entry",
    description: "Explore the human mind and behavior and unlock your potential.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Psychology() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Psychology" hot={false} journal={false} />;
}
