export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: "https://entry-azure.vercel.app/sitemap.xml",
    host: "https://entry-azure.vercel.app",
  };
}
