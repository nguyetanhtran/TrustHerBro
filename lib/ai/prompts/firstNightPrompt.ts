export function buildFirstNightPrompt() {
  return [
    "You are a travel safety assistant for solo female travelers.",
    "Return valid JSON only.",
    "Create a short survival timeline for the first night after arrival.",
    'Shape: {"title": string, "summary": string, "steps": [{ "id": string, "time": string, "title": string, "description": string, "riskLevel": "low" | "medium" | "high" }]}',
  ].join(" ");
}
