import { auth } from "@/auth";
import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory rate limit: 10 AI blog generations per user per day
const rateLimitMap = new Map();
function checkRateLimit(userId) {
  const key = `${userId}:${new Date().toISOString().slice(0, 10)}`;
  const count = rateLimitMap.get(key) || 0;
  if (count >= 10) return false;
  rateLimitMap.set(key, count + 1);
  if (rateLimitMap.size > 1000) {
    const today = new Date().toISOString().slice(0, 10);
    for (const [k] of rateLimitMap) {
      if (!k.includes(today)) rateLimitMap.delete(k);
    }
  }
  return true;
}

// ── POST /api/ai/blog-writer ──────────────────────────────────────────────────
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Sign in to use AI blog writer." }, { status: 401 });
    }

    if (!checkRateLimit(session.user.id)) {
      return NextResponse.json(
        { error: "Daily limit reached (10 generations). Try again tomorrow." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      title = "",
      category = "General",
      tone = "conversational",
      audience = "general readers",
      length = "medium",
      keywords = "",
      style = "storytelling",
    } = body;

    if (!title.trim()) {
      return NextResponse.json({ error: "Title is required." }, { status: 400 });
    }

    const wordTargets = {
      short: "400–600 words",
      medium: "700–900 words",
      long: "1100–1400 words",
    };
    const wordTarget = wordTargets[length] || wordTargets.medium;

    const systemPrompt = `You are an expert blog writer known for writing content that feels deeply human, emotionally engaging, and genuinely useful. You write for real people, not search engines.

Your writing hallmarks:
- Opens with a hook that makes readers stop scrolling
- Uses concrete, specific examples instead of vague generalities  
- Varies sentence length: short punchy ones. Then longer, flowing explanations that build context and texture.
- Writes in second person ("you") to feel personal and direct
- Never uses AI clichés: no "delve into", no "it's worth noting", no "in today's fast-paced world", no "game-changer", no em-dashes as connectors
- Uses subheadings that tease the next section (not just descriptive labels)
- Ends with a memorable insight or action — not a generic CTA paragraph
- Format: clean markdown with ## headings, no unnecessary bullets

Tone profile for "${tone}":
- conversational: like a smart friend explaining something over coffee
- professional: expert insights delivered with authority, no fluff
- inspirational: story-driven, emotional truth, motivational without being preachy
- educational: clear explanations, analogies, step-by-step when needed
- humorous: wit balanced with substance, self-aware

Category context: ${category}
Target audience: ${audience}`;

    const userPrompt = `Write a complete blog post with this brief:

Title: ${title}
Category: ${category}  
Tone: ${tone}
Target audience: ${audience}
Target length: ${wordTarget}
${keywords ? `Keywords to naturally weave in: ${keywords}` : ""}
Writing style: ${style}

Requirements:
1. Start with a compelling hook (first 2-3 sentences must make someone want to keep reading)
2. Use ## for main sections, ### for subsections
3. Include at least one concrete example, story, or scenario
4. The conclusion must end with a specific insight or memorable line — not "In conclusion..."
5. Write in ${tone} tone throughout
6. Feel 100% human-written — vary rhythm, use natural transitions

Output ONLY the blog post content in markdown. No meta-commentary, no "Here's your post:", just the content.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.82,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content?.trim() || "";

    return NextResponse.json({ content, wordCount: content.split(/\s+/).filter(Boolean).length });
  } catch (err) {
    console.error("[POST /api/ai/blog-writer]", err);
    return NextResponse.json({ error: "AI unavailable. Try again." }, { status: 500 });
  }
}
