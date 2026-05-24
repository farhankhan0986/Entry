/**
 * auth.js — Full server-side auth configuration
 *
 * This file includes the MongoDB adapter and all providers.
 * It must ONLY be imported in server-side code (Server Components,
 * Server Actions, API routes).
 *
 * For middleware, use auth.config.js instead (edge-safe, no adapter).
 *
 * Pattern based on NextAuth v5 official docs:
 * https://authjs.dev/guides/edge-compatibility
 */

import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "./lib/dbClient";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // The adapter uses MongoDB — Node.js only, never runs in edge/middleware
  adapter: MongoDBAdapter(clientPromise),

  // Full providers for actual sign-in (not used in middleware's edge check)
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    // Spread the base authorized() from auth.config.js, then extend
    ...authConfig.callbacks,

    async jwt({ token, user }) {
      // On first sign-in, persist the user's DB id into the JWT token
      if (user) {
        token.id = user.id;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      // Expose id and image to the client session object
      if (token && session.user) {
        session.user.id = token.id;
        session.user.image = token.image;
      }
      return session;
    },
  },
});