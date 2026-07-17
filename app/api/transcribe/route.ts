import { NextResponse } from "next/server";
import { transcribeAudio } from "../../../lib/ai/whisper";

export async function POST(request: Request) {
  const form = await request.formData();
  const audio = form.get("audio");

  if (!(audio instanceof File)) {
    return NextResponse.json(
      { error: "Audio file is required." },
      { status: 400 },
    );
  }

  const result = await transcribeAudio(audio);
  return NextResponse.json(result);
}
