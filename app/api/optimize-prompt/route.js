import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(request) {
  try {
    const { prompt, targetModel = "General" } = await request.json();

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please enter a prompt with at least 5 characters." },
        { status: 400 }
      );
    }

    const modelContext = {
      ChatGPT: "ChatGPT (GPT-4o)",
      Claude: "Claude (Anthropic)",
      General: "any large language model",
    }[targetModel] || "any large language model";

    const systemPrompt = `You are an expert prompt engineer. Your job is to take a basic, vague, or underdeveloped prompt from a user and rewrite it into a clear, specific, well-structured prompt optimized for ${modelContext}.

Guidelines for your rewrite:
1. Add context and role-setting (e.g., "You are an expert in...")
2. Make the goal explicit and unambiguous
3. Specify the output format (e.g., "Respond in bullet points", "Write in 3 paragraphs")
4. Add constraints or tone guidance where helpful
5. Include examples in the prompt if the task benefits from them
6. Keep it concise but comprehensive

Return ONLY the refined prompt — no explanations, no preamble, no "Here is your refined prompt:". Just the prompt itself.`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Original prompt: ${prompt.trim()}` },
      ],
      max_tokens: 600,
      temperature: 0.7,
    });

    const refined = completion.choices[0]?.message?.content?.trim();

    if (!refined) {
      return NextResponse.json(
        { error: "No response from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ refined });
  } catch (err) {
    console.error("Groq API error:", err);
    return NextResponse.json(
      { error: "Failed to optimize prompt. Please try again." },
      { status: 500 }
    );
  }
}
