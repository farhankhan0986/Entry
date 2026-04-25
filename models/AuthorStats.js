import mongoose from "mongoose";

const authorStatsSchema = new mongoose.Schema(
  {
    // Unique stable author ID (e.g. "sa_vikram-malhotra_7f3a2b1c" or a DB user's auth ID)
    authorId: {
      type: String,
      required: true,
      unique: true,
    },
    // Total follower count (DB source of truth)
    followers: {
      type: Number,
      default: 0,
    },
    // IPs that have followed this author (for deduplication)
    followerIps: [{ type: String }],
  },
  { timestamps: true }
);

const AuthorStats =
  mongoose.models.AuthorStats ||
  mongoose.model("AuthorStats", authorStatsSchema);

export default AuthorStats;
