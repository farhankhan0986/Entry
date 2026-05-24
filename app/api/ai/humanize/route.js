import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory rate limit store: { ip -> { count, resetAt } }
const rateLimitStore = new Map();
const RATE_LIMIT = 10;
const WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

function getRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitStore.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  if (entry.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  entry.count += 1;
  return { allowed: true, remaining: RATE_LIMIT - entry.count };
}

const MODE_PROMPTS = {
  professional: `You are a world-class business writer. Rewrite this text to sound polished, confident, and executive-level. No fluff, maximum clarity. Short decisive sentences. Active voice. Authoritative but not arrogant. Strip corporate clichés. The reader should feel like a sharp CEO wrote this.`,

  casual: `You are writing like you're texting a smart friend. Rewrite this to sound genuine and relaxed. Short sentences. Use contractions (don't, it's, you're). Drop the formality entirely. Add personality. If something's weird, say it's weird. Write how real people actually talk — not how they think they should talk.`,

  emotional: `You are a warm, empathetic human writer. Rewrite this to feel genuinely felt. Use first person where it's natural. Acknowledge complexity and nuance. Let the emotion breathe without being melodramatic. Relatable, real, never performative. Write to connect, not impress.`,

  storytelling: `You are a narrative writer. Rewrite this with storytelling craft. Open with a hook. Use vivid, specific scenes and details. Vary sentence rhythm — short punches, long flows. Show, don't tell. Build tension or curiosity. Make the reader feel something, not just understand something.`,

  genz: `You are writing for a Gen Z audience who will instantly clock anything trying too hard. Rewrite this to be current, punchy, and real. Lowercase is fine. Short paragraphs. Self-aware humor where it fits. References that feel natural, not forced. Direct. Skip the boomer formality. Keep it authentic — never cringey, never tryhard.`,

  reddit: `You are a seasoned Reddit commenter with strong opinions and self-awareness. Rewrite this as if posting a top comment. Conversational, slightly self-deprecating. Takes a clear stance. Uses "honestly," "tbh," "ngl" sparingly. Acknowledges counterpoints briefly. Feels like real talk from someone who's thought about this, not a corporate press release.`,

  founder: `You are a founder who's shipped things. Rewrite this with insight-driven confidence. Slightly humble but clearly capable. Drop the buzzwords, keep the substance. The tone: you've learned something real and you're sharing it plainly. Startup energy without startup BS. Smart, direct, a little magnetic.`,

  academic: `You are a clear-thinking academic writer. Rewrite this to be structured, evidence-aware, and formally clear. Use precise language — but no jargon for its own sake. Build arguments logically. Cite reasoning. Formal register without being stiff or impenetrable. The goal is intellectual clarity, not vocabulary flexing.`,
};

const UNIVERSAL_INSTRUCTION = `
UNIVERSAL RULES — apply on top of the mode above:
- Remove ALL em-dashes (—). Replace with commas, periods, or restructure the sentence.
- Reduce bullet point overuse. Prose is preferred unless bullets are truly needed.
- Vary sentence length deliberately. Mix short punchy sentences with longer flowing ones.
- Add natural transitions between ideas (instead of starting every sentence fresh).
- ELIMINATE these AI tells absolutely: certainly, delve, leverage, utilize, in conclusion, it is important to note, it is worth noting, furthermore, moreover, thus, hence, in the realm of, a tapestry of, nuanced, multifaceted, underscore, comprehensive, crucial, vital, streamline, foster, facilitate.
- Do not add commentary or explanations. Return ONLY the rewritten text.
- Preserve the core meaning and information — only change voice, style, and flow.
- Do not make the text longer than 130% of the original length.
`;

/**
 * Compute a naturalness score (0–100) from the output text.
 * Based on: sentence length variety + avg word length (shorter = more natural).
 */
function computeNaturalScore(text) {
  if (!text || text.trim().length === 0) return 0;

  // Split into sentences
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (sentences.length === 0) return 50;

  // Word lengths per sentence
  const wordCounts = sentences.map((s) => s.split(/\s+/).filter(Boolean).length);

  // Sentence variety: std deviation of word counts (higher variety = more natural)
  const avgWords = wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length;
  const variance =
    wordCounts.reduce((sum, c) => sum + Math.pow(c - avgWords, 2), 0) / wordCounts.length;
  const stdDev = Math.sqrt(variance);

  // Clamp variety score: 0 = no variety (all same length), 100 = great variety
  // A std dev of ~6+ words is natural, <2 is robotic
  const varietyScore = Math.min(100, (stdDev / 6) * 100);

  // Avg word length: 4-5 chars = casual/natural, 7+ = formal/AI
  const allWords = text.split(/\s+/).filter(Boolean);
  const avgWordLen =
    allWords.reduce((sum, w) => sum + w.replace(/[^a-zA-Z]/g, "").length, 0) / allWords.length;

  // Score: shorter avg word length = higher naturalness
  // 4 chars -> 100, 8+ chars -> 0
  const wordLenScore = Math.max(0, Math.min(100, ((8 - avgWordLen) / 4) * 100));

  // Weighted blend: 60% variety, 40% word length
  const raw = varietyScore * 0.6 + wordLenScore * 0.4;

  // Normalize into a pleasing 45–97 range (even "robotic" output gets some score)
  return Math.round(Math.max(20, Math.min(98, raw * 0.55 + 42)));
}

export async function POST(request) {
  try {
    // Get IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    const { allowed, remaining } = getRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        {
          error:
            "You've reached the daily limit of 10 humanizations. Come back tomorrow!",
          rateLimited: true,
        },
        {
          status: 429,
          headers: { "X-RateLimit-Remaining": "0" },
        }
      );
    }

    const body = await request.json();
    const { text, mode } = body;

    // Validation
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required." }, { status: 400 });
    }

    const trimmedText = text.trim();
    if (trimmedText.length === 0) {
      return NextResponse.json(
        { error: "Please paste some text to humanize." },
        { status: 400 }
      );
    }

    if (trimmedText.length > 5000) {
      return NextResponse.json(
        { error: "Text must be 5000 characters or fewer." },
        { status: 400 }
      );
    }

    const validModes = Object.keys(MODE_PROMPTS);
    const selectedMode = validModes.includes(mode) ? mode : "casual";

    const systemPrompt = `${MODE_PROMPTS[selectedMode]}\n\n${UNIVERSAL_INSTRUCTION}`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Rewrite the following text in the specified style:\n\n${trimmedText}`,
        },
      ],
      max_tokens: 2048,
      temperature: 0.75,
    });

    const humanized = completion.choices[0]?.message?.content?.trim();

    if (!humanized) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    const naturalScore = computeNaturalScore(humanized);
    const wordCount = humanized.split(/\s+/).filter(Boolean).length;

    return NextResponse.json(
      {
        humanized,
        naturalScore,
        wordCount,
        mode: selectedMode,
      },
      {
        headers: { "X-RateLimit-Remaining": String(remaining) },
      }
    );
  } catch (err) {
    console.error("Humanizer API error:", err);
    return NextResponse.json(
      { error: "Failed to humanize text. Please try again." },
      { status: 500 }
    );
  }
}
