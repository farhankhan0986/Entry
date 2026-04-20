import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Countries",
  description: "Explore the world through the eyes of our community. Discover stories, ideas, and reflections from every corner of the globe.",
  alternates: { canonical: "https://entry-azure.vercel.app/countries" },
  openGraph: {
    title: "Countries | Entry",
    description: "Explore the world through the eyes of our community. Discover stories, ideas, and reflections from every corner of the globe.",
    url: "https://entry-azure.vercel.app/countries",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Countries | Entry",
    description: "Explore the world through the eyes of our community. Discover stories, ideas, and reflections from every corner of the globe.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Countries() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="country" hot={false} journal={false} />;
}
