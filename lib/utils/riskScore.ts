const highRiskTerms = [
  "follow",
  "grab",
  "attack",
  "unsafe",
  "scared",
  "threat",
  "stalk",
  "trapped",
];

const mediumRiskTerms = [
  "stranger",
  "taxi",
  "dark",
  "lost",
  "pressure",
  "argue",
  "alone",
];

export function calculateRiskScore(input: string) {
  const text = input.toLowerCase();

  let score = 2;
  for (const term of highRiskTerms) {
    if (text.includes(term)) score += 2.5;
  }
  for (const term of mediumRiskTerms) {
    if (text.includes(term)) score += 1;
  }

  return Math.min(10, Number(score.toFixed(1)));
}

export function scoreToLevel(score: number): "low" | "medium" | "high" {
  if (score >= 7) return "high";
  if (score >= 4) return "medium";
  return "low";
}
