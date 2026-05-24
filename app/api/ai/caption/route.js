import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Simple in-memory rate limiter: max 20 requests per IP per day
const rateLimitStore = new Map();

function getRateLimitKey(ip) {
  const today = new Date().toDateString();
  return `${ip}::${today}`;
}

function checkRateLimit(ip) {
  const key = getRateLimitKey(ip);
  const count = rateLimitStore.get(key) || 0;
  if (count >= 20) return false;
  rateLimitStore.set(key, count + 1);
  // Cleanup old keys to avoid memory bloat
  if (rateLimitStore.size > 5000) {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    for (const [k] of rateLimitStore) {
      if (k.includes(yesterday)) rateLimitStore.delete(k);
    }
  }
  return true;
}

const PLATFORM_PERSONAS = {
  instagram: {
    name: "Instagram",
    style:
      "visually evocative, emotionally resonant, story-driven captions that feel authentic and personal. Use line breaks for rhythm. Include a question or micro-story. Feel relatable and human — not brand-speak.",
    lengthGuide: { short: "40-80 words", medium: "80-150 words", long: "150-220 words" },
  },
  linkedin: {
    name: "LinkedIn",
    style:
      "professional yet conversational, thought-leadership captions. Use a bold hook line. Include a personal insight or lesson learned. No fluff, no corporate jargon — real, direct, and value-packed.",
    lengthGuide: { short: "50-100 words", medium: "100-200 words", long: "200-300 words" },
  },
  twitter: {
    name: "Twitter/X",
    style:
      "punchy, witty, scroll-stopping captions. Keep it tight — every word earns its place. Use a bold opener. Threads-friendly if long. Conversational and direct. Often provocative or insightful.",
    lengthGuide: { short: "15-30 words", medium: "30-60 words", long: "60-90 words" },
  },
  youtube: {
    name: "YouTube",
    style:
      "compelling video descriptions that spark curiosity and drive clicks. Start with a hook sentence. Explain what viewers will learn or experience. Use natural, enthusiastic language.",
    lengthGuide: { short: "60-100 words", medium: "100-180 words", long: "180-280 words" },
  },
  reels: {
    name: "Instagram Reels",
    style:
      "energetic, trend-aware, short and punchy captions that complement video content. Hook in first line. Uses casual slang when appropriate. Encourages saves/shares. Feels native to the platform.",
    lengthGuide: { short: "20-50 words", medium: "50-100 words", long: "100-150 words" },
  },
};

const MOOD_DESCRIPTORS = {
  happy: "joyful, uplifting, celebratory",
  professional: "polished, authoritative, credible",
  aesthetic: "dreamy, poetic, visually sensory, slow-paced",
  funny: "humorous, witty, playful, self-aware",
  inspirational: "motivating, empowering, deep, forward-looking",
  bold: "confident, direct, unapologetic, powerful",
};

const TONE_DESCRIPTORS = {
  friendly: "warm, approachable, like talking to a good friend",
  formal: "professional and structured, no contractions",
  casual: "laid-back, natural, conversational",
  witty: "clever wordplay, unexpected angles, smart humor",
};

const CTA_MAP = {
  none: "",
  follow: "End with a natural call to follow the account.",
  "link-in-bio": "End with a subtle nudge to check the link in bio.",
  comment: "End with a question or prompt to leave a comment.",
  save: "End with a gentle reminder to save this post for later.",
  subscribe: "End with a warm call to subscribe to the channel.",
};

const EMOJI_MAP = {
  none: "Use absolutely no emojis.",
  minimal: "Use 1-2 emojis maximum, placed strategically.",
  moderate: "Use 3-6 emojis naturally woven throughout.",
  heavy: "Use emojis generously (8-15) to add energy and personality.",
};

function buildSystemPrompt(platform, mood, tone, length, cta, emojiLevel) {
  const p = PLATFORM_PERSONAS[platform] || PLATFORM_PERSONAS.instagram;
  const moodDesc = MOOD_DESCRIPTORS[mood] || mood;
  const toneDesc = TONE_DESCRIPTORS[tone] || tone;
  const ctaText = CTA_MAP[cta] || "";
  const emojiText = EMOJI_MAP[emojiLevel] || EMOJI_MAP.minimal;
  const wordCount = p.lengthGuide[length] || p.lengthGuide.medium;

  return `You are an elite ${p.name} content strategist and copywriter who crafts captions that drive real engagement. You understand platform culture, psychology, and what makes people stop scrolling.

PLATFORM: ${p.name}
STYLE GUIDE: ${p.style}
MOOD: ${moodDesc}
TONE: ${toneDesc}
LENGTH: Each caption should be ${wordCount}
EMOJI RULE: ${emojiText}
${ctaText ? `CTA INSTRUCTION: ${ctaText}` : ""}

YOUR TASK:
Generate exactly 3 distinct caption variations for the given topic. Each variation must feel like it was written by a different human content creator with a slightly different voice — NOT three versions of the same caption.

IMPORTANT RULES:
- Each caption must feel HUMAN and authentic — never robotic, never templated
- Vary the structure: one might start with a question, one with a bold statement, one with a mini-story
- No generic filler phrases like "In a world where..." or "Are you ready to..."
- Make every word earn its place

Return your response as valid JSON in this EXACT format (no markdown, no code fences, just raw JSON):
{
  "captions": [
    {
      "hook": "A single compelling hook line (10-15 words max) that would work as the first sentence",
      "text": "The full caption text here",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7", "hashtag8"]
    },
    {
      "hook": "Second hook line",
      "text": "Second caption text",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6"]
    },
    {
      "hook": "Third hook line",
      "text": "Third caption text",
      "hashtags": ["hashtag1", "hashtag2", "hashtag3", "hashtag4", "hashtag5", "hashtag6", "hashtag7"]
    }
  ]
}

Hashtag rules:
- Include 5-10 relevant hashtags per caption (without the # prefix, just the word)
- Mix: 2-3 high-volume general tags, 3-4 niche-specific tags, 1-2 branded/unique tags
- No hashtag spam — make them genuinely relevant to the topic and platform`;
}

export async function POST(request) {
  try {
    // Get IP for rate limiting
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Daily limit reached. You can generate up to 20 caption sets per day. Come back tomorrow!" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const {
      platform = "instagram",
      mood = "happy",
      tone = "friendly",
      topic,
      cta = "none",
      emojiLevel = "minimal",
      length = "medium",
    } = body;

    if (!topic || topic.trim().length < 3) {
      return NextResponse.json(
        { error: "Please describe your topic or content (at least 3 characters)." },
        { status: 400 }
      );
    }

    if (topic.trim().length > 500) {
      return NextResponse.json(
        { error: "Topic is too long. Please keep it under 500 characters." },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt(platform, mood, tone, length, cta, emojiLevel);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate 3 ${PLATFORM_PERSONAS[platform]?.name || "Instagram"} caption variations for: ${topic.trim()}`,
        },
      ],
      max_tokens: 1800,
      temperature: 0.85,
    });

    const rawContent = completion.choices[0]?.message?.content?.trim();

    if (!rawContent) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    // Parse JSON response — strip potential markdown fences if present
    let parsed;
    try {
      const cleaned = rawContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      console.error("JSON parse error. Raw content:", rawContent);
      return NextResponse.json(
        { error: "Failed to parse AI response. Please try again." },
        { status: 500 }
      );
    }

    if (!parsed.captions || !Array.isArray(parsed.captions) || parsed.captions.length === 0) {
      return NextResponse.json(
        { error: "Unexpected AI response format. Please try again." },
        { status: 500 }
      );
    }

    // Sanitize: ensure each caption has required fields
    const captions = parsed.captions.slice(0, 3).map((c) => ({
      hook: typeof c.hook === "string" ? c.hook.trim() : "",
      text: typeof c.text === "string" ? c.text.trim() : "",
      hashtags: Array.isArray(c.hashtags)
        ? c.hashtags
            .filter((h) => typeof h === "string")
            .map((h) => h.replace(/^#/, "").trim())
            .filter(Boolean)
            .slice(0, 10)
        : [],
    }));

    return NextResponse.json({ captions, platform });
  } catch (err) {
    console.error("Caption generation error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again in a moment." },
      { status: 500 }
    );
  }
}
