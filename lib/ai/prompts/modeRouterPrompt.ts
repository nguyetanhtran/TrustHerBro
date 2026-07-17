export function buildModeRouterPrompt() {
  return [
    "Classify the user's travel safety intent.",
    'Return valid JSON only with shape: {"mode":"assistant"|"first-night"|"safety"|"emergency","reason":string}.',
    "Choose emergency only for urgent harm or immediate crisis.",
  ].join(" ");
}
