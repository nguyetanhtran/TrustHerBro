import { NextResponse } from "next/server";
import { buildCompanionPrompt } from "../../../lib/ai/prompts/companionPrompt";
import type { AppMode } from "../../../lib/ai/types";

type CompanionResult = {
  reply: string;
  suggestedMode: AppMode | null;
  suggestedLabel: string | null;
};

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

// Lightweight keyword router for the no-key / error fallback.
function detectMode(input: string): AppMode | null {
  const text = input.toLowerCase();
  if (/(danger|attack|help now|emergency|sos|hurt|scream)/.test(text)) return "emergency";
  if (/(unsafe|uncomfortable|following|scared|empty street|creep)/.test(text)) return "safety";
  if (/(just landed|just arrived|first night|airport|checked in|arriving)/.test(text)) return "first-night";
  if (/(price|much|scam|taxi|fare|normal|translate|direction|where)/.test(text)) return "assistant";
  return null;
}

function fallback(message: string, hasImage: boolean): CompanionResult {
  if (hasImage) {
    return {
      reply:
        "I can't analyze the photo right now, but if it's a price, the Assistant can help you check whether it's fair.",
      suggestedMode: "assistant",
      suggestedLabel: "Check it in Assistant",
    };
  }
  const mode = detectMode(message);
  return {
    reply: "I'm right here with you. Tell me what's happening and I'll point you to the right place.",
    suggestedMode: mode,
    suggestedLabel: mode ? `Open ${mode.replace("-", " ")} mode` : null,
  };
}

export async function POST(request: Request) {
  const body = await request.json();
  const message = String(body?.message ?? "").trim();
  const image = typeof body?.image === "string" ? body.image : null;

  if (!message && !image) {
    return NextResponse.json({ error: "Say something or add a photo." }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const fb = fallback(message, Boolean(image));

  if (!apiKey) {
    return NextResponse.json(fb);
  }

  // Build a vision-capable message when an image is attached.
  const userContent = image
    ? [
        { type: "text", text: message || "What is in this photo? Is any price reasonable?" },
        { type: "image_url", image_url: { url: image } },
      ]
    : message;

  try {
    const response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildCompanionPrompt() },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) return NextResponse.json(fb);

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return NextResponse.json(fb);

    const parsed = JSON.parse(content) as Partial<CompanionResult>;
    const validModes: AppMode[] = ["first-night", "assistant", "safety", "emergency"];
    const suggestedMode =
      parsed.suggestedMode && validModes.includes(parsed.suggestedMode as AppMode)
        ? (parsed.suggestedMode as AppMode)
        : null;

    return NextResponse.json({
      reply: parsed.reply || fb.reply,
      suggestedMode,
      suggestedLabel: suggestedMode ? parsed.suggestedLabel ?? null : null,
    } satisfies CompanionResult);
  } catch {
    return NextResponse.json(fb);
  }
}
