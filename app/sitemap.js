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
    // Core pages
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${BASE_URL}/journal`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/tools`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },

    // AI Tools — high SEO priority (traffic magnets)
    { url: `${BASE_URL}/caption-generator`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/caption-generator/instagram-captions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/caption-generator/linkedin-post-generator`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.85 },
    { url: `${BASE_URL}/caption-generator/aesthetic-captions`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.80 },
    { url: `${BASE_URL}/ai-humanizer`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.95 },
    { url: `${BASE_URL}/cyber-safety`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.90 },
    { url: `${BASE_URL}/cyber-safety/password-tips`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.80 },

    // Existing tools
    { url: `${BASE_URL}/focus-timer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/prompt-optimizer`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.75 },
    { url: `${BASE_URL}/converter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.70 },
    { url: `${BASE_URL}/salary-check`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.70 },
    { url: `${BASE_URL}/discovery`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.65 },

    // Auth & misc (low priority)
    { url: `${BASE_URL}/write`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.2 },

    // NOTE: /diary/* is intentionally excluded (robots.txt also disallows it)
  ];

  return [...staticRoutes, ...blogUrls];
}
