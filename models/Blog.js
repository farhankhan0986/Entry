import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: [true, "Content cannot be empty"],
    },
    category: {
      type: String,
      required: [true, "Please select a category"],
      default: "General",
    },
    // For Guests: They provide a name
    authorName: {
      type: String,
      default: "Anonymous",
    },
    // For OAuth Users: links to the NextAuth User collection
    authorId: {
      type: String,
      default: null,
    },
    authorEmail: {
      type: String,
      default: null,
    },
    authorImage: {
      type: String,
      default: null,
    },
    bannerImage: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["published", "draft"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema);

export default Blog;
