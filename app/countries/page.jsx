import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Countries | World Stories & Culture | Entry",
  description: "Explore the world through storytelling. Discover fascinating facts, cultural insights, history, and stories about countries from every continent on Entry.",
  alternates: { canonical: "https://entry-azure.vercel.app/countries" },
  openGraph: {
    title: "Countries | World Stories & Culture | Entry",
    description: "Explore the world through storytelling. Discover fascinating facts, cultural insights, history, and stories about countries from every continent on Entry.",
    url: "https://entry-azure.vercel.app/countries",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Countries | World Stories & Culture | Entry",
    description: "Explore the world through storytelling. Discover fascinating facts, cultural insights, history, and stories about countries from every continent on Entry.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Countries() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="country" hot={false} journal={false} />;
}
