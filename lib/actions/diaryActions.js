"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import DiaryEntry from "@/models/DiaryEntry";
import WritingStats from "@/models/WritingStats";
import MoodAnalytics from "@/models/MoodAnalytics";
import { encryptContent, decryptContent } from "@/lib/diaryEncryption";

// ── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns today's date as YYYY-MM-DD in local time.
 */
function getTodayKey() {
  const now = new Date();
  return now.toISOString().slice(0, 10);
}

/**
 * Returns the ISO week's Monday as YYYY-MM-DD.
 */
function getWeekStart(dateStr = null) {
  const d = dateStr ? new Date(dateStr) : new Date();
  const day = d.getUTCDay(); // 0=Sun
  const diff = (day === 0 ? -6 : 1 - day);
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

/**
 * Recalculates and saves WritingStats for a user after any diary mutation.
 * @param {string} authorId
 */
async function refreshStats(authorId) {
  // Get all entry dates for this user, sorted ascending
  const entries = await DiaryEntry.find(
    { authorId },
    { entryDate: 1, wordCount: 1, mood: 1 }
  ).sort({ entryDate: 1 }).lean();

  const totalEntries = entries.length;
  const totalWords = entries.reduce((sum, e) => sum + (e.wordCount || 0), 0);

  // Build unique sorted dates array
  const uniqueDates = [...new Set(entries.map((e) => e.entryDate))].sort();

  // Calculate streaks
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  const today = getTodayKey();
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const yesterdayKey = yesterday.toISOString().slice(0, 10);

  for (let i = 0; i < uniqueDates.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(uniqueDates[i - 1]);
      const curr = new Date(uniqueDates[i]);
      const diffDays = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
  }

  // Current streak: only active if last entry is today or yesterday
  const lastDate = uniqueDates[uniqueDates.length - 1] || null;
  if (lastDate === today || lastDate === yesterdayKey) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  // Keep only last 365 dates for heatmap
  const recentDates = uniqueDates.slice(-365);

  await WritingStats.findOneAndUpdate(
    { authorId },
    {
      currentStreak,
      longestStreak,
      totalEntries,
      totalWords,
      lastEntryDate: lastDate,
      entryDates: recentDates,
    },
    { upsert: true, new: true }
  );

  // Update mood analytics for current week
  await refreshMoodAnalytics(authorId);
}

/**
 * Aggregates mood counts for the current week into MoodAnalytics.
 */
async function refreshMoodAnalytics(authorId) {
  const weekStart = getWeekStart();
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekEnd.getUTCDate() + 7);
  const weekEndKey = weekEnd.toISOString().slice(0, 10);

  const entries = await DiaryEntry.find(
    { authorId, entryDate: { $gte: weekStart, $lt: weekEndKey } },
    { mood: 1 }
  ).lean();

  const moodCounts = {
    happy: 0, calm: 0, anxious: 0,
    sad: 0, excited: 0, neutral: 0,
  };
  for (const e of entries) {
    if (e.mood && moodCounts.hasOwnProperty(e.mood)) {
      moodCounts[e.mood]++;
    }
  }

  await MoodAnalytics.findOneAndUpdate(
    { authorId, weekStart },
    { moodCounts },
    { upsert: true, new: true }
  );
}

// ── CRUD Actions ─────────────────────────────────────────────────────────────

/**
 * Create a new diary entry.
 * Content is AES-256-GCM encrypted before saving.
 */
export async function createDiaryEntry({ title, content, mood, tags, entryDate }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const authorId = session.user.id;

  await dbConnect();

  // Count words from plaintext BEFORE encrypting
  const wordCount = content
    ? content.trim().split(/\s+/).filter(Boolean).length
    : 0;

  // Encrypt content
  const encryptedContent = encryptContent(content || "");

  // Normalize tags
  const normalizedTags = Array.isArray(tags)
    ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean)
    : typeof tags === "string"
    ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const dateKey = entryDate || getTodayKey();

  const entry = await DiaryEntry.create({
    authorId,
    title: title?.trim() || "",
    content: encryptedContent,
    mood: mood || "neutral",
    tags: normalizedTags,
    wordCount,
    entryDate: dateKey,
  });

  // Refresh stats in background (non-blocking)
  refreshStats(authorId).catch(console.error);

  return {
    id: entry._id.toString(),
    title: entry.title,
    mood: entry.mood,
    tags: entry.tags,
    wordCount: entry.wordCount,
    entryDate: entry.entryDate,
    createdAt: entry.createdAt,
  };
}

/**
 * Update an existing diary entry.
 * Re-encrypts content on save.
 */
export async function updateDiaryEntry(entryId, { title, content, mood, tags }) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const existing = await DiaryEntry.findById(entryId);
  if (!existing) throw new Error("Entry not found");
  if (existing.authorId !== session.user.id) throw new Error("Forbidden");

  const wordCount = content
    ? content.trim().split(/\s+/).filter(Boolean).length
    : existing.wordCount;

  const encryptedContent = content !== undefined
    ? encryptContent(content)
    : undefined;

  const normalizedTags = tags !== undefined
    ? (Array.isArray(tags)
        ? tags.map((t) => t.trim().toLowerCase()).filter(Boolean)
        : typeof tags === "string"
        ? tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [])
    : undefined;

  const updateFields = {
    ...(title !== undefined && { title: title.trim() }),
    ...(encryptedContent !== undefined && { content: encryptedContent }),
    ...(mood !== undefined && { mood }),
    ...(normalizedTags !== undefined && { tags: normalizedTags }),
    ...(content !== undefined && { wordCount }),
  };

  await DiaryEntry.findByIdAndUpdate(entryId, updateFields);

  refreshStats(session.user.id).catch(console.error);

  return { success: true };
}

/**
 * Delete a diary entry.
 */
export async function deleteDiaryEntry(entryId) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const existing = await DiaryEntry.findById(entryId);
  if (!existing) throw new Error("Entry not found");
  if (existing.authorId !== session.user.id) throw new Error("Forbidden");

  await DiaryEntry.findByIdAndDelete(entryId);
  refreshStats(session.user.id).catch(console.error);

  return { success: true };
}

/**
 * Get all diary entries for the current user.
 * Decrypts content server-side and returns plaintext to the client.
 *
 * Security: Only the authenticated owner sees their own entries.
 */
export async function getDiaryEntries({ limit = 50, skip = 0 } = {}) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const entries = await DiaryEntry.find(
    { authorId: session.user.id },
    { authorId: 0 } // Don't expose authorId to client
  )
    .sort({ entryDate: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Decrypt content for each entry
  return entries.map((entry) => ({
    id: entry._id.toString(),
    title: entry.title,
    content: decryptContent(entry.content),
    mood: entry.mood,
    tags: entry.tags,
    wordCount: entry.wordCount,
    entryDate: entry.entryDate,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  }));
}

/**
 * Get a single diary entry by ID — owner only.
 */
export async function getDiaryEntry(entryId) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const entry = await DiaryEntry.findById(entryId).lean();
  if (!entry) throw new Error("Entry not found");
  if (entry.authorId !== session.user.id) throw new Error("Forbidden");

  return {
    id: entry._id.toString(),
    title: entry.title,
    content: decryptContent(entry.content),
    mood: entry.mood,
    tags: entry.tags,
    wordCount: entry.wordCount,
    entryDate: entry.entryDate,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

/**
 * Get writing stats for the current user.
 */
export async function getDiaryStats() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbConnect();

  const stats = await WritingStats.findOne(
    { authorId: session.user.id }
  ).lean();

  const weekStart = getWeekStart();
  const moodData = await MoodAnalytics.findOne(
    { authorId: session.user.id, weekStart }
  ).lean();

  return {
    currentStreak: stats?.currentStreak || 0,
    longestStreak: stats?.longestStreak || 0,
    totalEntries: stats?.totalEntries || 0,
    totalWords: stats?.totalWords || 0,
    lastEntryDate: stats?.lastEntryDate || null,
    entryDates: stats?.entryDates || [],
    weeklyMoods: moodData?.moodCounts || {
      happy: 0, calm: 0, anxious: 0, sad: 0, excited: 0, neutral: 0,
    },
    weeklyAiInsight: moodData?.aiInsight || null,
  };
}
