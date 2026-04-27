/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // Google profile images
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // GitHub profile images
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com", // Cloudinary uploads
      },
    ],
  },
};

export default nextConfig;
