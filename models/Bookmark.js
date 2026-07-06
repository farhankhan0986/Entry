import mongoose from "mongoose";

/**
 * Bookmarks reference articles by `articleSlug`, not a Mongo ObjectId.
 * This app renders two kinds of articles through the same UI: real
 * documents in the Blog collection AND a large set of static seed posts
 * (lib/staticData.js) that only ever exist as JS objects with a
 * "static-N" id. Slug is the one identifier every article — static or
 * DB-backed — actually has and is already how /blog/[slug], BlogStats,
 * and comments key their lookups. `articleId` is kept alongside it so a
 * real Mongo _id is available whenever the article does live in the DB
 * (e.g. for cascade-deletes), but it's null for static articles.
 *
 * Title/thumbnail/author/publishedAt are denormalized snapshots taken at
 * bookmark time — static articles can't be `populate()`-d since they
 * aren't Mongo documents, so this is what makes GET /api/bookmarks fast
 * and self-contained without re-resolving every article on every read.
 */
const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    articleSlug: {
      type: String,
      required: true,
    },
    articleId: {
      type: String,
      default: null,
    },
    title: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    authorName: { type: String, default: "" },
    category: { type: String, default: "" },
    publishedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// A user can only bookmark the same article once.
bookmarkSchema.index({ userId: 1, articleSlug: 1 }, { unique: true });

const Bookmark =
  mongoose.models.Bookmark || mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
