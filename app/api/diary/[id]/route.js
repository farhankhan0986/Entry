import { auth } from "@/auth";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DiaryEntry from "@/models/DiaryEntry";
import { encryptContent, decryptContent } from "@/lib/diaryEncryption";

// ── GET /api/diary/[id] ───────────────────────────────────────────────────────
export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const entry = await DiaryEntry.findById(id).lean();

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    if (entry.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({
      id: entry._id.toString(),
      title: entry.title,
      content: decryptContent(entry.content),
      mood: entry.mood,
      tags: entry.tags,
      wordCount: entry.wordCount,
      entryDate: entry.entryDate,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    });
  } catch (err) {
    console.error("[GET /api/diary/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ── PUT /api/diary/[id] ───────────────────────────────────────────────────────
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const existing = await DiaryEntry.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { title, content, mood, tags } = body;

    const VALID_MOODS = ["happy", "calm", "anxious", "sad", "excited", "neutral"];

    const updateFields = {};
    if (title !== undefined) updateFields.title = String(title).trim().slice(0, 200);
    if (content !== undefined) {
      updateFields.content = encryptContent(content);
      updateFields.wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    }
    if (mood !== undefined && VALID_MOODS.includes(mood)) {
      updateFields.mood = mood;
    }
    if (tags !== undefined) {
      updateFields.tags = Array.isArray(tags)
        ? tags.map((t) => String(t).trim().toLowerCase().slice(0, 30)).filter(Boolean).slice(0, 10)
        : [];
    }

    await DiaryEntry.findByIdAndUpdate(id, updateFields);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[PUT /api/diary/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// ── DELETE /api/diary/[id] ────────────────────────────────────────────────────
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { id } = await params;
    const existing = await DiaryEntry.findById(id);

    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }
    if (existing.authorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await DiaryEntry.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/diary/[id]]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
