import { NextResponse } from "next/server";
import { buildTranslatePrompt } from "../../../lib/ai/prompts/translatePrompt";

const OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";

type TranslateResult = {
  translation: string;
  suggestedPlace: string | null;
};

async function callTranslation({
  text,
  image,
  sourceLanguage,
  targetLanguage,
}: {
  text: string;
  image: string | null;
  sourceLanguage: string;
  targetLanguage: string;
}): Promise<TranslateResult> {
  const fallback: TranslateResult = {
    translation: text || "Could not translate right now — try again in a moment.",
    suggestedPlace: null,
  };

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return fallback;

  const userContent = image
    ? [
        {
          type: "text",
          text: text || "Read the text in this image and translate it.",
        },
        { type: "image_url", image_url: { url: image } },
      ]
    : text;

  try {
    const response = await fetch(OPENAI_CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.2,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: buildTranslatePrompt(sourceLanguage, targetLanguage) },
          { role: "user", content: userContent },
        ],
      }),
    });

    if (!response.ok) return fallback;

    const data = await response.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string") return fallback;

    const parsed = JSON.parse(content) as Partial<TranslateResult>;
    return {
      translation: typeof parsed.translation === "string" ? parsed.translation : fallback.translation,
      suggestedPlace: typeof parsed.suggestedPlace === "string" ? parsed.suggestedPlace : null,
    };
  } catch {
    return fallback;
  }
}

export async function POST(request: Request) {
  const body = await request.json();
  const text = String(body?.text ?? "");
  const image = typeof body?.image === "string" ? body.image : null;
  const sourceLanguage = String(body?.sourceLanguage ?? "the source language");
  const targetLanguage = String(body?.targetLanguage ?? "English");

  if (!text.trim() && !image) {
    return NextResponse.json({ error: "Text or an image is required." }, { status: 400 });
  }

  const result = await callTranslation({ text, image, sourceLanguage, targetLanguage });
  return NextResponse.json(result);
}
