"use server";
import Blog from "@/models/Blog";
import { dbConnect } from "../db";
import { revalidatePath } from "next/cache";
import { staticBlogs } from "../staticData";

export async function getAllBlogs() {
    await dbConnect();

    // 1. Fetch from MongoDB (no DB-level sort; we'll sort everything together)
    const dbBlogsRaw = await Blog.find().lean();
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
  // IMPORTANT: Make sure your MongoDB field is actually named 'slug'
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
    // 1. Fetch DB posts in the same category
    await dbConnect();
    const dbRelated = await Blog.find({ category }).lean();
    const dbPosts = dbRelated.map(post => ({
      ...post,
      id: post._id.toString(),
      _id: post._id.toString(),
    }));

    // 2. Merge with static blogs of the same category
    const staticRelated = staticBlogs.filter(post => post.category === category);
    const all = [...staticRelated, ...dbPosts];

    // 3. Exclude the current post and return up to 3
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

    // Extracting fields manually from FormData
    const title = formData.get("title");
    const content = formData.get("content");
    const category = formData.get("category");
    const authorName = formData.get("authorName") || "Anonymous";
    const bannerImage = formData.get("bannerImage");

    // Generate the Slug
    const slug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

    // Create the entry
    await Blog.create({
        title,
        slug,
        content,
        category,
        authorName,
        bannerImage
    });

    revalidatePath('/');
}

export async function getBlogs() {
    await dbConnect();

    // Fetch and convert to plain JS objects for the frontend
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
  const authorName = (formData.get("authorName") || "Anonymous").trim();
  const body = (formData.get("body") || "").trim();

  if (!body) throw new Error("Comment body is required.");

  await Comment.create({ blogId, authorName, body });
  revalidatePath(`/blog`);
}