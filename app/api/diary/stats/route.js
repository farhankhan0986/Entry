import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { getDiaryStats } from "@/lib/actions/diaryActions";

// ── GET /api/diary/stats ──────────────────────────────────────────────────────
// Returns writing stats + mood analytics for the current user.
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getDiaryStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("[GET /api/diary/stats]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
