import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import dbConnect from "@/lib/db";
import DiaryEntry from "@/models/DiaryEntry";
import MoodAnalytics from "@/models/MoodAnalytics";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple rate limit: max 3 AI insight calls per user per day (in-memory)
const rateLimitMap = new Map();

function checkRateLimit(userId) {
  const key = `${userId}:${new Date().toISOString().slice(0, 10)}`;
  const count = rateLimitMap.get(key) || 0;
  if (count >= 3) return false;
  rateLimitMap.set(key, count + 1);
  // Clean old keys periodically
  if (rateLimitMap.size > 500) {
    const today = new Date().toISOString().slice(0, 10);
    for (const [k] of rateLimitMap) {
      if (!k.includes(today)) rateLimitMap.delete(k);
    }
  }
  return true;
}

function getWeekStart() {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  return d.toISOString().slice(0, 10);
}

// ── POST /api/diary/ai-insights ───────────────────────────────────────────────
// Generates AI emotional summary + productivity/mindfulness insights.
// Uses only: entry titles + moods + word counts (NEVER decrypted content).
// Privacy first.
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const userName = session.user.name?.split(" ")[0] || "there";

    // Rate limiting
    if (!checkRateLimit(userId)) {
      return NextResponse.json(
        { error: "Rate limit reached. Try again tomorrow." },
        { status: 429 }
      );
    }

    await dbConnect();

    // Get last 7 entries: titles + moods only (NOT content — privacy preserved)
    const recentEntries = await DiaryEntry.find(
      { authorId: userId },
      { title: 1, mood: 1, wordCount: 1, entryDate: 1 }
    )
      .sort({ entryDate: -1 })
      .limit(7)
      .lean();

    if (recentEntries.length === 0) {
      return NextResponse.json({
        insight: "Start writing your first diary entry to unlock AI insights about your emotional patterns.",
        titleSuggestion: "My First Entry",
        productivity: "Your journey starts with a single thought. What's on your mind today?",
      });
    }

    // Build a safe, non-content summary for the AI
    const moodSummary = recentEntries
      .map((e) => `- ${e.entryDate}: mood="${e.mood}", words=${e.wordCount}, title="${e.title || "Untitled"}"`)
      .join("\n");

    const totalWords = recentEntries.reduce((s, e) => s + (e.wordCount || 0), 0);
    const dominantMood = recentEntries
      .reduce((acc, e) => {
        acc[e.mood] = (acc[e.mood] || 0) + 1;
        return acc;
      }, {});
    const topMood = Object.entries(dominantMood).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

    const systemPrompt = `You are a warm, emotionally intelligent journaling companion for a private diary app called Entry.
Your role is to provide brief, empathetic, and insightful observations about someone's recent journaling activity.

CRITICAL PRIVACY RULE: You only see entry metadata (dates, moods, word counts, titles). You NEVER see the actual diary content. Do not ask about or reference diary content.

Tone: Warm, human, non-clinical. Like a wise friend — not a therapist.
Length: Keep each section to 2-3 sentences max. Be concise.`;

    const userPrompt = `Here is ${userName}'s journaling activity from the past week:

${moodSummary}

Total words written: ${totalWords}
Most frequent mood: ${topMood}

Please provide:
1. **Emotional Pattern** (2-3 sentences): What emotional pattern do you notice? Be warm and observational.
2. **Mindfulness Nudge** (1-2 sentences): One gentle, actionable mindfulness or reflection suggestion.
3. **Title Suggestion**: One poetic, evocative title they could use for their next entry today.

Format your response as JSON:
{
  "insight": "...",
  "productivity": "...",
  "titleSuggestion": "..."
}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.85,
      max_tokens: 400,
      response_format: { type: "json_object" },
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        insight: "Keep writing — your consistency is building something beautiful.",
        productivity: "Try writing for just 5 minutes today without stopping.",
        titleSuggestion: "Notes to Myself",
      };
    }

    // Cache insight in MoodAnalytics
    const weekStart = getWeekStart();
    await MoodAnalytics.findOneAndUpdate(
      { authorId: userId, weekStart },
      {
        aiInsight: parsed.insight || "",
        insightGeneratedAt: new Date(),
      },
      { upsert: true }
    );

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("[POST /api/diary/ai-insights]", err);
    return NextResponse.json({ error: "AI unavailable. Try again later." }, { status: 500 });
  }
}
