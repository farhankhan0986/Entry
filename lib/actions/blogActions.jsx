"use server";
import Blog from "@/models/Blog";
import dbConnect from "../db";
import { revalidatePath } from "next/cache";
import { staticBlogs } from "../staticData";
import { auth } from "@/auth";

export async function getAllBlogs() {
  await dbConnect();

  // 1. Fetch from MongoDB
  const dbBlogsRaw = await Blog.find({ status: "published" }).lean();
  const dbBlogs = dbBlogsRaw.map(blog => ({
    ...blog,
    id: blog._id.toString(),
    _id: blog._id.toString(),
    isStatic: false
  }));

  // 2. Merge static + DB, then sort the full list by date (newest first)
  const all = [...staticBlogs, ...dbBlogs];
  all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return all;
}


export async function getBlogBySlug(slug) {
  // 1. Check Static Data
  const staticMatch = staticBlogs.find(b => b.slug === slug);
  if (staticMatch) return staticMatch;

  // 2. Check Database
  await dbConnect();
  const dbMatch = await Blog.findOne({ slug: slug }).lean();

  if (dbMatch) {
    return {
      ...dbMatch,
      _id: dbMatch._id.toString(),
      id: dbMatch._id.toString()
    };
  }

  return null;
}

export async function getRelatedPosts(category, currentId) {
  try {
    await dbConnect();
    const dbRelated = await Blog.find({ category }).lean();
    const dbPosts = dbRelated.map(post => ({
      ...post,
      id: post._id.toString(),
      _id: post._id.toString(),
    }));

    const staticRelated = staticBlogs.filter(post => post.category === category);
    const all = [...staticRelated, ...dbPosts];

    const filtered = all.filter(
      post => post.id !== currentId && post._id !== currentId && post.slug !== currentId
    );

    return filtered.slice(0, 3);
  } catch (error) {
    console.error("Error fetching related posts:", error);
    return [];
  }
}

export async function createBlog(formData) {
  await dbConnect();

  // Get authenticated user
  const session = await auth();

  const title = formData.get("title");
  const content = formData.get("content");
  const category = formData.get("category");
  const bannerUrlInput = formData.get("bannerImage");

  // Use session name if available, else form field, else Anonymous
  const authorName = session?.user?.name
    || formData.get("authorName")
    || "Anonymous";

  // Generate the Slug
  const slug = title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');

  // Banner image: client pre-uploads the file and sends the resolved URL
  const bannerImage = bannerUrlInput?.trim() || "/default.png";

  await Blog.create({
    title,
    slug,
    content,
    category,
    authorName,
    authorId: session?.user?.id || null,
    authorEmail: session?.user?.email || null,
    authorImage: session?.user?.image || null,
    bannerImage,
    status: "published",
  });

  revalidatePath('/', 'layout');
}

export async function getBlogs() {
  await dbConnect();

  const blogs = await Blog.find().sort({ createdAt: -1 }).lean();

  return blogs.map(blog => ({
    ...blog,
    _id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
  }));
}

export async function getBlogById(id) {
  await dbConnect();
  const blog = await Blog.findById(id).lean();
  if (!blog) return null;

  return {
    ...blog,
    _id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
  };
}

// ─── Get blogs by author (for dashboard) ─────────────────────────────────────

export async function getBlogsByAuthor(authorId) {
  await dbConnect();
  const blogs = await Blog.find({ authorId })
    .sort({ createdAt: -1 })
    .lean();

  return blogs.map(blog => ({
    ...blog,
    _id: blog._id.toString(),
    id: blog._id.toString(),
    createdAt: blog.createdAt.toISOString(),
  }));
}

// ─── Comment Actions ──────────────────────────────────────────────────────────

import Comment from "@/models/Comment";

export async function getComments(blogId) {
  await dbConnect();
  const comments = await Comment.find({ blogId })
    .sort({ createdAt: -1 })
    .lean();
  return comments.map((c) => ({
    ...c,
    _id: c._id.toString(),
    createdAt: c.createdAt.toISOString(),
  }));
}

export async function addComment(blogId, formData) {
  await dbConnect();

  // Require auth for comments
  const session = await auth();
  if (!session?.user) throw new Error("You must be signed in to comment.");

  const authorName = session.user.name || "Anonymous";
  const authorId = session.user.id || null;
  const authorImage = session.user.image || null;
  const authorEmail = session.user.email || null;
  const body = (formData.get("body") || "").trim();

  if (!body) throw new Error("Comment body is required.");

  await Comment.create({ blogId, authorName, authorId, authorImage, authorEmail, body });
  revalidatePath(`/blog`);
}
