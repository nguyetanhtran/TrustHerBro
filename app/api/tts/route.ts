import { NextResponse } from "next/server";
import { synthesizeSpeech } from "../../../lib/ai/vbee";

export async function POST(request: Request) {
  const body = await request.json();
  const text = String(body?.text ?? "");
  const voice = String(body?.voice ?? "female_north");

  if (!text.trim()) {
    return NextResponse.json(
      { error: "Text is required." },
      { status: 400 },
    );
  }

  const result = await synthesizeSpeech({ text, voice });
  return NextResponse.json(result);
}
