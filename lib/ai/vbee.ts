type VbeeRequest = {
  text: string;
  voice: string;
};

type VbeeResponse = {
  audioUrl: string | null;
  text: string;
  voice: string;
  mocked: boolean;
};

export async function synthesizeSpeech({
  text,
  voice,
}: VbeeRequest): Promise<VbeeResponse> {
  const apiKey = process.env.VBEE_API_KEY;

  if (!apiKey) {
    return {
      audioUrl: null,
      text,
      voice,
      mocked: true,
    };
  }

  return {
    audioUrl: null,
    text,
    voice,
    mocked: false,
  };
}
