import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiaryEntry from "@/models/DiaryEntry";
import { encryptContent, decryptContent } from "@/lib/diaryEncryption";

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

// ── GET /api/diary ────────────────────────────────────────────────────────────
// Returns all diary entries for the authenticated user (decrypted).
export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
    const skip = parseInt(searchParams.get("skip") || "0");

    const entries = await DiaryEntry.find(
      { authorId: session.user.id },
      { authorId: 0 }
    )
      .sort({ entryDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const decrypted = entries.map((entry) => ({
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

    return NextResponse.json({ entries: decrypted });
  } catch (err) {
    console.error("[GET /api/diary]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ── POST /api/diary ───────────────────────────────────────────────────────────
// Creates a new diary entry with encrypted content.
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title = "", content = "", mood = "neutral", tags = [], entryDate } = body;

    // Validate mood
    const VALID_MOODS = ["happy", "calm", "anxious", "sad", "excited", "neutral"];
    const safeMood = VALID_MOODS.includes(mood) ? mood : "neutral";

    // Sanitize tags
    const safeTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim().toLowerCase().slice(0, 30)).filter(Boolean).slice(0, 10)
      : [];

    // Count words before encrypting
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

    // Encrypt content
    const encryptedContent = encryptContent(content);

    const dateKey = entryDate || getTodayKey();

    await dbConnect();

    const entry = await DiaryEntry.create({
      authorId: session.user.id,
      title: String(title).trim().slice(0, 200),
      content: encryptedContent,
      mood: safeMood,
      tags: safeTags,
      wordCount,
      entryDate: dateKey,
    });

    return NextResponse.json(
      {
        id: entry._id.toString(),
        title: entry.title,
        mood: entry.mood,
        tags: entry.tags,
        wordCount: entry.wordCount,
        entryDate: entry.entryDate,
        createdAt: entry.createdAt,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/diary]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
