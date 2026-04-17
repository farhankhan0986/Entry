import { getAllBlogs } from "@/lib/actions/blogActions";

const BASE_URL = "https://entry-azure.vercel.app";

export default async function sitemap() {
  const blogs = await getAllBlogs();

  const blogUrls = blogs.map((blog) => ({
    url: `${BASE_URL}/blog/${blog.slug}`,
    lastModified: new Date(blog.createdAt),
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const staticRoutes = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/write`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
  ];

  return [...staticRoutes, ...blogUrls];
}
