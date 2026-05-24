"use server";
import Blog from "@/models/Blog";
import BlogStats from "@/models/BlogStats";
import UserProfile from "@/models/UserProfile";
import dbConnect from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ─── Public: fetch DB blogs by authorName ─────────────────────────────────────

/**
 * Fetch all published DB blogs by a given author name (case-insensitive).
 */
export async function getDbBlogsByAuthorName(authorName) {
  try {
    await dbConnect();
    const blogs = await Blog.find({
      authorName: { $regex: new RegExp(`^${authorName.trim()}$`, "i") },
      status: "published",
    })
      .sort({ createdAt: -1 })
      .lean();

    return blogs.map((b) => ({
      ...b,
      id: b._id.toString(),
      _id: b._id.toString(),
      createdAt: b.createdAt?.toISOString() || new Date().toISOString(),
      isStatic: false,
    }));
  } catch {
    return [];
  }
}

/**
 * Get total view + like counts for a list of slugs from BlogStats.
 */
export async function getStatsForSlugs(slugs) {
  if (!slugs.length) return { totalViews: 0, totalLikes: 0 };
  try {
    await dbConnect();
    const stats = await BlogStats.find({ slug: { $in: slugs } }).lean();
    const totalViews = stats.reduce((s, r) => s + (r.views || 0), 0);
    const totalLikes = stats.reduce((s, r) => s + (r.likes || 0), 0);
    return { totalViews, totalLikes };
  } catch {
    return { totalViews: 0, totalLikes: 0 };
  }
}

// ─── Public: get a user's saved profile by authorId ──────────────────────────

/**
 * Fetch a saved UserProfile by authorId. Returns plain object or null.
 */
export async function getAuthorProfile(authorId) {
  if (!authorId) return null;
  try {
    await dbConnect();
    const profile = await UserProfile.findOne({ authorId }).lean();
    if (!profile) return null;
    return {
      ...profile,
      _id: profile._id.toString(),
      createdAt: profile.createdAt?.toISOString() || null,
      updatedAt: profile.updatedAt?.toISOString() || null,
    };
  } catch {
    return null;
  }
}

// ─── Authenticated: get current user's profile ───────────────────────────────

/**
 * Get the signed-in user's profile (for dashboard).
 */
export async function getMyProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return getAuthorProfile(session.user.id);
}

// ─── Authenticated: save / upsert current user's profile ─────────────────────

/**
 * Save (upsert) the signed-in user's profile from a plain object.
 * Returns { success: true } or { error: string }.
 */
export async function saveMyProfile(data) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  const authorId = session.user.id;

  // Sanitise tags: filter empties, limit to 8, max 30 chars each
  const tags = (data.tags || [])
    .map((t) => String(t).trim().slice(0, 30))
    .filter(Boolean)
    .slice(0, 8);

  const update = {
    tagline: String(data.tagline || "").trim().slice(0, 120),
    bio: String(data.bio || "").trim().slice(0, 800),
    location: String(data.location || "").trim().slice(0, 80),
    website: String(data.website || "").trim().slice(0, 200),
    twitter: String(data.twitter || "").replace(/^@/, "").trim().slice(0, 50),
    linkedin: String(data.linkedin || "").trim().slice(0, 100),
    instagram: String(data.instagram || "").replace(/^@/, "").trim().slice(0, 50),
    github: String(data.github || "").trim().slice(0, 50),
    accentColor: data.accentColor ? String(data.accentColor).trim().slice(0, 7) : "",
    tags,
  };

  try {
    await dbConnect();
    await UserProfile.findOneAndUpdate(
      { authorId },
      { $set: update },
      { upsert: true, new: true }
    );
    revalidatePath(`/dashboard`);
    // Revalidate will be dynamic for the author page
    return { success: true };
  } catch (e) {
    return { error: e.message || "Failed to save profile" };
  }
}
