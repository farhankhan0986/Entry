"use server";
import Blog from "@/models/Blog";
import UserProfile from "@/models/UserProfile";
import Bookmark from "@/models/Bookmark";
import dbConnect from "../db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getBlogBySlug } from "./blogActions";

// Dashboard's "Saved" tab renders everything at once (same as "My Entries"
// does today) rather than paginating client-side, so this is a sane cap
// rather than a real page size. GET /api/bookmarks is the paginated route.
const DASHBOARD_SAVED_CAP = 60;

export async function getDashboardData() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    await dbConnect();

    const [blogs, profileDoc, bookmarkDocs] = await Promise.all([
        Blog.find({ authorId: session.user.id }).sort({ createdAt: -1 }).lean(),
        UserProfile.findOne({ authorId: session.user.id }).lean(),
        Bookmark.find({ userId: session.user.id })
            .sort({ createdAt: -1 })
            .limit(DASHBOARD_SAVED_CAP)
            .lean(),
    ]);

    const serialized = blogs.map(b => ({
        ...b,
        _id: b._id.toString(),
        id: b._id.toString(),
        createdAt: b.createdAt.toISOString(),
        updatedAt: b.updatedAt?.toISOString() || null,
    }));

    const profile = profileDoc ? {
        ...profileDoc,
        _id: profileDoc._id.toString(),
        createdAt: profileDoc.createdAt?.toISOString() || null,
        updatedAt: profileDoc.updatedAt?.toISOString() || null,
    } : null;

    // Hydrate each bookmark into a full article (static or DB) so the
    // Saved tab can render the same BlogCard used everywhere else on the
    // site. Bookmarks whose article was since deleted are quietly skipped.
    const savedBlogs = (
        await Promise.all(bookmarkDocs.map(b => getBlogBySlug(b.articleSlug)))
    ).filter(Boolean);

    return {
        user: session.user,
        blogs: serialized,
        totalPosts: serialized.length,
        profile,
        savedBlogs,
        totalSaved: savedBlogs.length,
    };
}

export async function deleteBlog(blogId) {
    const session = await auth();
    if (!session?.user?.id) throw new Error("Unauthorized");

    await dbConnect();

    const blog = await Blog.findById(blogId);
    if (!blog) throw new Error("Blog not found");

    // Only author can delete
    if (blog.authorId !== session.user.id) {
        throw new Error("You are not authorized to delete this blog.");
    }

    await Blog.findByIdAndDelete(blogId);
    // Cascade: nobody should keep a bookmark pointing at a deleted article.
    await Bookmark.deleteMany({ articleSlug: blog.slug });
    revalidatePath("/", "layout");
}
