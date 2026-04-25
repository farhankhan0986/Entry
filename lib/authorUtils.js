// lib/authorUtils.js
// Lightweight client-safe utility — no server-only code, no large data imports.
// Used by client components (BlogCard, AuthorFollowButton) to resolve author slugs.

/** Convert an author name to its URL slug. Must stay in sync with staticAuthors slugs. */
const AUTHOR_NAME_TO_SLUG = {
  "Vikram Malhotra": "vikram-malhotra",
  "Rajesh Pillai": "rajesh-pillai",
  "Ishaan Sharma": "ishaan-sharma",
  "Riya Sen": "riya-sen",
  "Dr. Anjali Rao": "dr-anjali-rao",
  "Rajesh Mehta": "rajesh-mehta",
  "Aditya Sisodia": "aditya-sisodia",
  "Arvind Subramanian": "arvind-subramanian",
  "K.S. Chatterjee": "ks-chatterjee",
  "Rahul Jain": "rahul-jain",
};

/** Map an author name to their profile slug. Falls back to kebab-case conversion. */
export function getAuthorSlug(authorName) {
  if (!authorName) return null;
  if (AUTHOR_NAME_TO_SLUG[authorName]) return AUTHOR_NAME_TO_SLUG[authorName];
  // Fallback: "Dr. Anjali Rao" → "dr-anjali-rao"
  return authorName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
