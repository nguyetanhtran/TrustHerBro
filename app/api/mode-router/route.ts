import { NextResponse } from "next/server";
import { runOpenAIJson } from "../../../lib/ai/openai";
import { buildModeRouterPrompt } from "../../../lib/ai/prompts/modeRouterPrompt";
import type { AppMode } from "../../../lib/ai/types";

function detectMode(input: string): AppMode {
  const text = input.toLowerCase();
  if (/(unsafe|followed|scared|help now|danger|emergency)/.test(text)) {
    return "safety";
  }
  if (/(first night|just arrived|new city|arrive|landing)/.test(text)) {
    return "first-night";
  }
  if (/(sos|ambulance|police|attack)/.test(text)) {
    return "emergency";
  }
  return "assistant";
}

export async function POST(request: Request) {
  const body = await request.json();
  const input = String(body?.input ?? "");

  if (!input.trim()) {
    return NextResponse.json(
      { error: "Input is required." },
      { status: 400 },
    );
  }

  const fallback = detectMode(input);

  try {
    const result = await runOpenAIJson<{ mode: AppMode; reason: string }>({
      systemPrompt: buildModeRouterPrompt(),
      userPrompt: input,
      fallback: {
        mode: fallback,
        reason: "Keyword-based fallback router.",
      },
    });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({
      mode: fallback,
      reason: "Keyword-based fallback router.",
    });
  }
}
