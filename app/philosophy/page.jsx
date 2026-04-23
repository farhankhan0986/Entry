import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Philosophy | Entry",
  description: "Reflections on meaning, existence, ethics, and the way we live our lives.",
  alternates: { canonical: "https://entry-azure.vercel.app/philosophy" },
  openGraph: {
    title: "Philosophy | Entry",
    description: "Reflections on meaning, existence, ethics, and the way we live our lives.",
    url: "https://entry-azure.vercel.app/philosophy",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Philosophy | Entry",
    description: "Reflections on meaning, existence, ethics, and the way we live our lives.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Philosophy() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Philosophy" hot={false} journal={false} />;
}
