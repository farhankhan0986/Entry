import mongoose from "mongoose";

const blogStatsSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
    viewedIps: [{ type: String }],
    likedIps: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const BlogStats =
  mongoose.models.BlogStats || mongoose.model("BlogStats", blogStatsSchema);

export default BlogStats;
