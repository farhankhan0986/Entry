/**
 * middleware.js — Next.js Middleware (Edge Runtime)
 *
 * IMPORTANT: Imports from auth.config.js — NOT from auth.js.
 * auth.js imports MongoDBAdapter which uses Node.js 'crypto' module.
 * auth.config.js is edge-safe (no Node.js built-ins).
 *
 * The authorized() callback in auth.config.js handles /diary/* protection
 * by reading the JWT session cookie — no DB calls required.
 */

import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth;

export const config = {
  matcher: [
    // Only run middleware on diary routes
    "/diary/:path*",
  ],
};
