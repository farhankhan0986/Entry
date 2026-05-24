import mongoose from "mongoose";

/**
 * DiaryEntry Model
 *
 * Content is AES-256-GCM encrypted at rest.
 * The `content` field stores: iv:authTag:encryptedData (all hex-encoded).
 * Decryption happens server-side using DIARY_ENCRYPTION_KEY env var.
 * Search is client-side only (after decryption).
 *
 * Privacy promise: "Your thoughts stay yours."
 */
const diaryEntrySchema = new mongoose.Schema(
  {
    // Links to NextAuth user ID
    authorId: {
      type: String,
      required: true,
      index: true,
    },

    // Plain text title (not sensitive, not encrypted)
    title: {
      type: String,
      default: "",
      trim: true,
    },

    // AES-256-GCM encrypted content: "iv:authTag:ciphertext" (all hex)
    content: {
      type: String,
      default: "",
    },

    // Mood at time of writing
    mood: {
      type: String,
      enum: ["happy", "calm", "anxious", "sad", "excited", "neutral"],
      default: "neutral",
    },

    // User-defined tags for organization
    tags: {
      type: [String],
      default: [],
    },

    // Precomputed word count for analytics (from plaintext before encryption)
    wordCount: {
      type: Number,
      default: 0,
    },

    // Date key — day granularity for calendar view / streak tracking
    // Stored as YYYY-MM-DD string for easy indexing
    entryDate: {
      type: String,
      required: true,
      index: true,
    },

    // Always private — never public indexed
    isPrivate: {
      type: Boolean,
      default: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient per-user sorted queries
diaryEntrySchema.index({ authorId: 1, entryDate: -1 });

const DiaryEntry =
  mongoose.models.DiaryEntry ||
  mongoose.model("DiaryEntry", diaryEntrySchema);

export default DiaryEntry;
