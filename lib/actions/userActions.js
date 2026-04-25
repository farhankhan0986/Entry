"use server";
import Blog from "@/models/Blog";
import UserProfile from "@/models/UserProfile";
import { dbConnect } from "../db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getDashboardData() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    await dbConnect();

    const [blogs, profileDoc] = await Promise.all([
        Blog.find({ authorId: session.user.id }).sort({ createdAt: -1 }).lean(),
        UserProfile.findOne({ authorId: session.user.id }).lean(),
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

    return {
        user: session.user,
        blogs: serialized,
        totalPosts: serialized.length,
        profile,
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
    revalidatePath("/dashboard");
    revalidatePath("/");
}
