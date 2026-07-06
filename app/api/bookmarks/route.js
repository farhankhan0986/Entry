import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import { getBlogBySlug } from "@/lib/actions/blogActions";
import { checkRateLimit } from "@/lib/rateLimit";

// ── POST /api/bookmarks ──────────────────────────────────────────────────────
// body: { slug } — creates a bookmark for the signed-in user.
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to save articles." }, { status: 401 });
    }

    if (!checkRateLimit(`${session.user.id}:bookmarks:write`, 30, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Slow down a little." }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    // Accept `slug` (this app's real article identifier) and `articleId` as an alias.
    const slug = (body.slug || body.articleId || "").trim();
    if (!slug) {
      return NextResponse.json({ error: "Article slug is required." }, { status: 400 });
    }

    const article = await getBlogBySlug(slug);
    if (!article) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    await dbConnect();

    try {
      const bookmark = await Bookmark.create({
        userId: session.user.id,
        articleSlug: article.slug,
        articleId: article.isStatic ? null : article._id,
        title: article.title,
        thumbnail: article.bannerImage || "",
        authorName: article.authorName || "Anonymous",
        category: article.category || "",
        publishedAt: article.createdAt ? new Date(article.createdAt) : null,
      });

      return NextResponse.json({ bookmarked: true, bookmark }, { status: 201 });
    } catch (err) {
      // Duplicate bookmark (unique userId+articleSlug index) — treat as success, it's idempotent.
      if (err.code === 11000) {
        return NextResponse.json({ bookmarked: true, alreadyExisted: true }, { status: 200 });
      }
      throw err;
    }
  } catch (err) {
    console.error("[POST /api/bookmarks]", err);
    return NextResponse.json({ error: "Could not save this article." }, { status: 500 });
  }
}

// ── GET /api/bookmarks ────────────────────────────────────────────────────────
// Paginated list of the user's bookmarks, populated with title/thumbnail/author/date.
// ?compact=1 returns only the user's bookmarked slugs (used to hydrate bookmark
// icon state across a page without re-sending full article data per card).
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to view your saved articles." }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);

    if (searchParams.get("compact") === "1") {
      const slugs = await Bookmark.find({ userId: session.user.id })
        .select("articleSlug -_id")
        .lean();
      return NextResponse.json({ slugs: slugs.map((s) => s.articleSlug) });
    }

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "12", 10)));

    const [items, total] = await Promise.all([
      Bookmark.find({ userId: session.user.id })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Bookmark.countDocuments({ userId: session.user.id }),
    ]);

    const bookmarks = items.map((b) => ({
      id: b._id.toString(),
      slug: b.articleSlug,
      title: b.title,
      thumbnail: b.thumbnail,
      authorName: b.authorName,
      category: b.category,
      publishedAt: b.publishedAt,
      bookmarkedAt: b.createdAt,
    }));

    return NextResponse.json({
      bookmarks,
      page,
      limit,
      total,
      pages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (err) {
    console.error("[GET /api/bookmarks]", err);
    return NextResponse.json({ error: "Could not load your saved articles." }, { status: 500 });
  }
}
