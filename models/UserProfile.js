import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    // Links to the NextAuth user ID
    authorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Display info
    tagline: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    website: { type: String, default: "" },
    // Social handles (store without the @ / URL prefix — just the handle)
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    instagram: { type: String, default: "" },
    github: { type: String, default: "" },
    // Expertise/interest tags (array of strings)
    tags: { type: [String], default: [] },
    // Profile accent color chosen by user (hex string, e.g. "#6366f1")
    accentColor: { type: String, default: "" },
  },
  { timestamps: true }
);

const UserProfile =
  mongoose.models.UserProfile ||
  mongoose.model("UserProfile", userProfileSchema);

export default UserProfile;
