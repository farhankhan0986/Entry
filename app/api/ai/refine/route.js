import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ── Rate limit: 20 refinements per user per day ──────────────────────────────
const rateLimitMap = new Map();
function checkRateLimit(userId) {
  const key = `refine:${userId}:${new Date().toISOString().slice(0, 10)}`;
  const count = rateLimitMap.get(key) || 0;
  if (count >= 20) return false;
  rateLimitMap.set(key, count + 1);
  if (rateLimitMap.size > 2000) {
    const today = new Date().toISOString().slice(0, 10);
    for (const [k] of rateLimitMap) {
      if (!k.includes(today)) rateLimitMap.delete(k);
    }
  }
  return true;
}

const MODE_PROMPTS = {
  rewrite: `Rewrite the following blog section to be more compelling and vivid. Preserve the core ideas but improve clarity, flow, and engagement. Output only the rewritten text, no commentary.`,

  expand: `Expand the following text by adding detail, examples, and richer description. Make it approximately 50–80% longer. Keep the same voice. Output only the expanded text.`,

  shorten: `Condense the following text to roughly half its length. Preserve the key points and the author's voice. Output only the shortened text.`,

  headlines: `Generate 5 compelling, click-worthy blog post title variations for the following content. Return them as a numbered list (1. ..., 2. ..., etc.), nothing else.`,

  tone_professional: `Rewrite the following text in a professional, authoritative tone. Maintain the content and ideas. Output only the rewritten text.`,

  tone_casual: `Rewrite the following text in a warm, conversational, casual tone. Maintain the content and ideas. Output only the rewritten text.`,

  tone_poetic: `Rewrite the following text in a more lyrical, evocative, poetic style. Use imagery and metaphor where appropriate. Output only the rewritten text.`,

  intro: `Write a compelling blog post introduction for the following content. It should hook readers within the first sentence and make them want to keep reading. Output only the introduction paragraph.`,

  conclusion: `Write a strong, memorable conclusion for the following blog content. It should leave the reader with a clear takeaway or emotional resonance. Output only the conclusion paragraph.`,
};

// ── POST /api/ai/refine ──────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Sign in to use AI refinement." },
        { status: 401 }
      );
    }

    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Daily refinement limit reached (20). Try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { text = "", mode = "rewrite" } = body;

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Text is required." },
        { status: 400 }
      );
    }

    if (text.length > 8000) {
      return NextResponse.json(
        { error: "Text too long. Max 8000 characters." },
        { status: 400 }
      );
    }

    const systemPrompt = MODE_PROMPTS[mode] || MODE_PROMPTS.rewrite;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      max_tokens: 1500,
      temperature: 0.75,
    });

    const result = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ result, mode });
  } catch (err) {
    console.error("[refine] error:", err);
    return NextResponse.json(
      { error: "Refinement failed. Please try again." },
      { status: 500 }
    );
  }
}
