// lib/rateLimit.js — tiny in-memory sliding-window limiter.
// Mirrors the pattern already used in app/api/ai/blog-writer/route.js,
// pulled out so other routes (e.g. bookmarks) can reuse it.
//
// In-memory only: fine for light abuse-prevention on a single Vercel
// worker/dev server. Not a substitute for a real distributed limiter
// (Redis/Upstash) if this ever needs to hold across instances.

const buckets = new Map();

/**
 * @param {string} key      unique key, e.g. `${userId}:bookmarks`
 * @param {number} limit    max requests allowed within the window
 * @param {number} windowMs window size in milliseconds
 * @returns {boolean} true if the request is allowed
 */
export function checkRateLimit(key, limit, windowMs) {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { windowStart: now, count: 1 });
    return true;
  }

  if (bucket.count >= limit) return false;

  bucket.count += 1;
  return true;
}

// Periodic cleanup so the map doesn't grow unbounded across a long-lived process.
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > 5 * 60 * 1000) buckets.delete(key);
  }
}, 5 * 60 * 1000).unref?.();
