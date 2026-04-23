import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Psychology | Mind, Behavior & Human Nature | Entry",
  description: "Explore psychology articles on human behavior, cognitive biases, mental health, personality types, and the science of the mind. Deep reads that change how you think.",
  alternates: { canonical: "https://entry-azure.vercel.app/psychology" },
  openGraph: {
    title: "Psychology | Mind, Behavior & Human Nature | Entry",
    description: "Explore psychology articles on human behavior, cognitive biases, mental health, personality types, and the science of the mind. Deep reads that change how you think.",
    url: "https://entry-azure.vercel.app/psychology",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Psychology | Mind, Behavior & Human Nature | Entry",
    description: "Explore psychology articles on human behavior, cognitive biases, mental health, personality types, and the science of the mind. Deep reads that change how you think.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Psychology() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Psychology" hot={false} journal={false} />;
}
