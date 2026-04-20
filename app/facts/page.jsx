import { getAllBlogs } from '@/lib/actions/blogActions';
import BlogsGrid from "@/components/BlogsGrid";

export const metadata = {
    title: "Facts | Entry",
    description: "Discover surprising, viral, and mind-blowing facts about countries, people, history, psychology, science, space, and more. Explore top 10 facts that educate and entertain.",
    alternates: { canonical: "https://entry-azure.vercel.app/facts" },
    openGraph: {
        title: "Facts | Entry",
        description: "Discover surprising, viral, and mind-blowing facts about countries, people, history, psychology, science, space, and more. Explore top 10 facts that educate and entertain.",
        url: "https://entry-azure.vercel.app/facts",
        siteName: "Entry",
        images: [{ url: "https://entry-azure.vercel.app/og-default.jpg", width: 1200, height: 630 }],
    },
    twitter: {
        card: "summary_large_image",
        title: "facts | Entry",
        description: "Discover surprising, viral, and mind-blowing facts about countries, people, history, psychology, science, space, and more. Explore top 10 facts that educate and entertain.",
        images: ["https://entry-azure.vercel.app/og-default.jpg"],
    },
};

export default async function Countries() {
    const blogs = await getAllBlogs();
    return <BlogsGrid blogs={blogs} categoryPage="facts" />;
}
