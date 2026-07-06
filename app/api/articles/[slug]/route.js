import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import { getBlogBySlug } from "@/lib/actions/blogActions";

/**
 * GET /api/articles/:slug
 *
 * Spec calls this `/api/articles/:id`, but articles on this site come from
 * two sources — real Blog documents in MongoDB and a large static seed set
 * (lib/staticData.js) that never gets a Mongo _id at all. `slug` is the one
 * identifier both kinds of articles share (it's already what /blog/[slug]
 * routes on), so it's used here as the ":id" param.
 */
export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const article = await getBlogBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: "Article not found." }, { status: 404 });
    }

    let isBookmarked = false;
    const session = await auth();
    if (session?.user?.id) {
      await dbConnect();
      const bookmark = await Bookmark.findOne({
        userId: session.user.id,
        articleSlug: article.slug,
      })
        .select("_id")
        .lean();
      isBookmarked = !!bookmark;
    }

    return NextResponse.json({ ...article, isBookmarked });
  } catch (err) {
    console.error("[GET /api/articles/[slug]]", err);
    return NextResponse.json({ error: "Could not load this article." }, { status: 500 });
  }
}
