import mongoose from "mongoose";

/**
 * WritingStats Model
 *
 * Aggregated writing analytics per user.
 * Updated on every diary entry create/update.
 * Powers the streak system, word count dashboard, and retention gamification.
 */
const writingStatsSchema = new mongoose.Schema(
  {
    authorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    // Current consecutive writing streak (in days)
    currentStreak: {
      type: Number,
      default: 0,
    },

    // All-time longest streak
    longestStreak: {
      type: Number,
      default: 0,
    },

    // Total number of diary entries ever written
    totalEntries: {
      type: Number,
      default: 0,
    },

    // Total words written across all entries
    totalWords: {
      type: Number,
      default: 0,
    },

    // Last entry date (YYYY-MM-DD) — used to calculate streak continuity
    lastEntryDate: {
      type: String,
      default: null,
    },

    // Array of entry dates (YYYY-MM-DD) for calendar heatmap rendering
    // Capped at 365 most recent entries for performance
    entryDates: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const WritingStats =
  mongoose.models.WritingStats ||
  mongoose.model("WritingStats", writingStatsSchema);

export default WritingStats;
