import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
  title: "Biographies | Life Stories of Legends | Entry",
  description: "Read in-depth biographies of the world's most influential people — scientists, leaders, innovators, and visionaries who changed history. Discover their stories on Entry.",
  alternates: { canonical: "https://entry-azure.vercel.app/biographies" },
  openGraph: {
    title: "Biographies | Life Stories of Legends | Entry",
    description: "Read in-depth biographies of the world's most influential people — scientists, leaders, innovators, and visionaries who changed history. Discover their stories on Entry.",
    url: "https://entry-azure.vercel.app/biographies",
    siteName: "Entry",
    images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Biographies | Life Stories of Legends | Entry",
    description: "Read in-depth biographies of the world's most influential people — scientists, leaders, innovators, and visionaries who changed history. Discover their stories on Entry.",
    images: ["https://entry-azure.vercel.app/og-default.jpg"],
  },
};

export default async function Biographies() {
  const blogs = await getAllBlogs();
  return <BlogsGrid blogs={blogs} categoryPage="Biographies" hot={false} journal={false} />;
}
