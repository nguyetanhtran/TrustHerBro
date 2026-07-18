"use client";

import type { CSSProperties } from "react";
import { AlertTriangle, GitCompareArrows, MapPinned, ShieldAlert } from "lucide-react";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import type { TranslationKey } from "../../lib/i18n/translations";
import { theme } from "../../lib/theme";

export type AssistantSuggestionId = "scam" | "directions" | "compare" | "situation";

const wrapStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
  gap: 8,
  width: "100%",
  marginBottom: 4,
  boxSizing: "border-box",
};

const chipStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  minWidth: 0,
  padding: "10px 8px",
  borderRadius: theme.borderRadius.button,
  background: theme.colors.card,
  border: `1px solid ${theme.colors.border}`,
  color: theme.colors.text,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 13,
  fontWeight: 600,
  lineHeight: 1.2,
  boxShadow: "none",
  boxSizing: "border-box",
};

const iconWrap: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 22,
  height: 22,
  borderRadius: 7,
  background: "rgba(155, 44, 31, 0.1)",
  color: theme.colors.primary,
  flexShrink: 0,
};

type CardDef = {
  id: AssistantSuggestionId;
  icon: typeof ShieldAlert;
  titleKey: TranslationKey;
  promptKey: TranslationKey;
};

const CARDS: CardDef[] = [
  {
    id: "scam",
    icon: ShieldAlert,
    titleKey: "assistant.cardScam",
    promptKey: "assistant.promptScam",
  },
  {
    id: "directions",
    icon: MapPinned,
    titleKey: "assistant.cardDirections",
    promptKey: "assistant.promptDirections",
  },
  {
    id: "compare",
    icon: GitCompareArrows,
    titleKey: "assistant.cardCompare",
    promptKey: "assistant.promptCompare",
  },
  {
    id: "situation",
    icon: AlertTriangle,
    titleKey: "assistant.cardSituation",
    promptKey: "assistant.promptSituation",
  },
];

export function AssistantActionCards({
  active,
  onPick,
}: {
  active?: AssistantSuggestionId | null;
  onPick: (id: AssistantSuggestionId, prompt: string) => void;
}) {
  const { t } = useLanguage();

  return (
    <div style={wrapStyle} role="group" aria-label="Question suggestions">
      {CARDS.map((card) => {
        const Icon = card.icon;
        const selected = active === card.id;
        return (
          <button
            key={card.titleKey}
            type="button"
            onClick={() => onPick(card.id, t(card.promptKey))}
            style={{
              ...chipStyle,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
            }}
          >
            <span style={iconWrap}>
              <Icon size={13} strokeWidth={2.25} />
            </span>
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t(card.titleKey)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
