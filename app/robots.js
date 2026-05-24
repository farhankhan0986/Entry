export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/_next/",
          "/diary/",      // Private journaling — never index
          "/dashboard/",  // User dashboard — private
        ],
      },
    ],
    sitemap: "https://entry-azure.vercel.app/sitemap.xml",
    host: "https://entry-azure.vercel.app",
  };
}
