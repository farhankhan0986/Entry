/**
 * auth.config.js — Edge-compatible auth configuration
 *
 * This file contains ONLY the providers, pages, and callbacks that are
 * safe to run in the Next.js edge runtime (middleware).
 *
 * CRITICAL: Do NOT import anything that uses Node.js built-ins here.
 * No MongoDB adapter, no crypto, no fs, no path.
 *
 * This is the NextAuth v5 recommended pattern for edge-compatible middleware.
 * The full auth.js (with MongoDBAdapter) is used only in server-side code.
 */

const authConfig = {
  providers: [],  // No providers needed in middleware — only JWT is checked
  pages: {
    signIn: "/login",
  },
  callbacks: {
    /**
     * authorized() is called by middleware on matched routes.
     * JWT token is read from the session cookie — no DB calls needed.
     * Returning false triggers a redirect to the signIn page.
     */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDiary = nextUrl.pathname.startsWith("/diary");

      if (isOnDiary) {
        if (isLoggedIn) return true;
        // Redirect unauthenticated users to /login with callbackUrl
        return Response.redirect(
          new URL(
            `/login?callbackUrl=${encodeURIComponent(nextUrl.pathname)}`,
            nextUrl
          )
        );
      }

      // All other routes are public
      return true;
    },
  },
};

export default authConfig;
