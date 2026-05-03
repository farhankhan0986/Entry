import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Cars | Performance, Specs & Automotive Insights | Entry",
  description: "Explore the world's most popular cars with complete specs, top speed, performance stats, pricing, and in-depth automotive insights.",
  alternates: { canonical: "https://entry-azure.vercel.app/cars" },
  openGraph: {
    title: "Cars | Performance, Specs & Automotive Insights | Entry",
    description: "Explore the world's most popular cars with complete specs, top speed, performance stats, pricing, and in-depth automotive insights.",
    url: "https://entry-azure.vercel.app/cars",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cars | Performance, Specs & Automotive Insights | Entry",
    description: "Explore the world's most popular cars with complete specs, top speed, performance stats, pricing, and in-depth automotive insights.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Cars() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Cars" hot={false} journal={false} />;
}