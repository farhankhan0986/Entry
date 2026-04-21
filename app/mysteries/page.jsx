import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Mysteries",
  description: "Explore mysterious incidents, unsolved disappearances, unexplained events, strange cases, and shocking mysteries from around the world.",
  alternates: { canonical: "https://entry-azure.vercel.app/mysteries" },
  openGraph: {
    title: "Mysteries | Entry",
    description: "Explore mysterious incidents, unsolved disappearances, unexplained events, strange cases, and shocking mysteries from around the world.",
    url: "https://entry-azure.vercel.app/mysteries",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mysteries | Entry",
    description: "Explore mysterious incidents, unsolved disappearances, unexplained events, strange cases, and shocking mysteries from around the world.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Mysteries() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Mysteries" hot={false} journal={false} />;
}