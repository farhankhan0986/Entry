"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

const BookmarksContext = createContext(null);

/**
 * Loads the signed-in user's bookmarked article slugs ONCE per session
 * (not once per card) so BookmarkButton instances across a page of 20+
 * BlogCards don't each fire their own request. Toggling optimistically
 * updates the shared set and rolls back on a failed API call.
 */
export function BookmarksProvider({ children }) {
  const { data: session, status } = useSession();
  const [slugs, setSlugs] = useState(() => new Set());
  const [loaded, setLoaded] = useState(false);
  const fetchedFor = useRef(null);

  useEffect(() => {
    if (status !== "authenticated") {
      setSlugs(new Set());
      setLoaded(status !== "loading");
      fetchedFor.current = null;
      return;
    }
    if (fetchedFor.current === session.user.id) return;
    fetchedFor.current = session.user.id;

    fetch("/api/bookmarks?compact=1")
      .then((res) => (res.ok ? res.json() : { slugs: [] }))
      .then((data) => setSlugs(new Set(data.slugs || [])))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [status, session?.user?.id]);

  const setBookmarked = useCallback((slug, value) => {
    setSlugs((prev) => {
      const next = new Set(prev);
      if (value) next.add(slug);
      else next.delete(slug);
      return next;
    });
  }, []);

  const toggleBookmark = useCallback(
    async (slug) => {
      const wasBookmarked = slugs.has(slug);
      setBookmarked(slug, !wasBookmarked);

      try {
        const res = wasBookmarked
          ? await fetch(`/api/bookmarks/${encodeURIComponent(slug)}`, { method: "DELETE" })
          : await fetch("/api/bookmarks", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            });

        if (!res.ok) throw new Error("Request failed");
        return true;
      } catch (err) {
        setBookmarked(slug, wasBookmarked); // roll back
        return false;
      }
    },
    [slugs, setBookmarked]
  );

  return (
    <BookmarksContext.Provider
      value={{ bookmarkedSlugs: slugs, loaded, isAuthenticated: status === "authenticated", toggleBookmark }}
    >
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  const ctx = useContext(BookmarksContext);
  if (!ctx) throw new Error("useBookmarks must be used within a BookmarksProvider");
  return ctx;
}
