import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Biographies",
  description: "Explore the lives of influential people that changed the world.",
  alternates: { canonical: "https://entry-azure.vercel.app/biographies" },
  openGraph: {
    title: "Biographies | Entry",
    description: "Explore the lives of influential people that changed the world.",
    url: "https://entry-azure.vercel.app/biographies",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biographies | Entry",
    description: "Explore the lives of influential people that changed the world.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Biographies() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Biographies" hot={false} journal={false} />;
}
