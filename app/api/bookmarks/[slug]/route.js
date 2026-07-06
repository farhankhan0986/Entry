import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Bookmark from "@/models/Bookmark";
import { checkRateLimit } from "@/lib/rateLimit";

// ── DELETE /api/bookmarks/:slug ──────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to manage saved articles." }, { status: 401 });
    }

    if (!checkRateLimit(`${session.user.id}:bookmarks:write`, 30, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Slow down a little." }, { status: 429 });
    }

    const { slug } = await params;
    if (!slug) {
      return NextResponse.json({ error: "Article slug is required." }, { status: 400 });
    }

    await dbConnect();

    const deleted = await Bookmark.findOneAndDelete({
      userId: session.user.id,
      articleSlug: slug,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Bookmark not found." }, { status: 404 });
    }

    return NextResponse.json({ bookmarked: false });
  } catch (err) {
    console.error("[DELETE /api/bookmarks/[slug]]", err);
    return NextResponse.json({ error: "Could not remove this bookmark." }, { status: 500 });
  }
}
