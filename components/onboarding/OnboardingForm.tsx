"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingAnswers } from "../../lib/ai/types";
import { saveOnboardingAnswers } from "../../lib/store";
import { findNearestCity, normalizeCoordinates } from "../../lib/utils/geolocation";
import { useLanguage } from "../../lib/i18n/LanguageContext";
import { LanguageSwitcher } from "../shared/LanguageSwitcher";
import { theme } from "../../lib/theme";

const CITY_OPTIONS = [
  "Hà Nội",
  "TP. Hồ Chí Minh",
  "Đà Nẵng",
  "Nha Trang",
  "Phú Quốc",
  "Huế",
  "Đà Lạt",
];

function currentTimeLabel() {
  return new Date().toTimeString().slice(0, 5); // "HH:MM"
}

function defaultAnswers(): OnboardingAnswers {
  return {
    city: "",
    arrivalTime: currentTimeLabel(),
    accommodation: "",
    travelingAlone: true,
    firstTimeInVN: true,
    hasTransport: false,
    hasMobileData: false,
  };
}

const formStyle: CSSProperties = {
  display: "grid",
  gap: 20,
  background: theme.colors.card,
  padding: 24,
  borderRadius: theme.borderRadius.card,
  border: `1px solid ${theme.colors.border}`,
  boxShadow: theme.shadows.soft,
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "100%",
  overflow: "hidden",
  color: theme.colors.text,
};

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: theme.borderRadius.button,
  border: `1px solid ${theme.colors.border}`,
  width: "100%",
  maxWidth: "100%",
  boxSizing: "border-box",
  fontSize: 15,
  fontFamily: "inherit",
  background: "#FAF7F2",
  color: theme.colors.text,
  outline: "none",
};

function chipStyle(selected: boolean): CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: 999,
    border: selected ? `2px solid ${theme.colors.primary}` : `1px solid ${theme.colors.border}`,
    background: selected ? "rgba(155, 44, 31, 0.08)" : theme.colors.card,
    color: theme.colors.text,
    fontWeight: selected ? 700 : 500,
    cursor: "pointer",
    fontFamily: "inherit",
    maxWidth: "100%",
    boxSizing: "border-box",
  };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 8, minWidth: 0 }}>
      <span style={{ fontWeight: 600, color: theme.colors.text }}>{label}</span>
      {children}
    </label>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", minWidth: 0, maxWidth: "100%" }}>
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          style={chipStyle(value === option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function YesNoField({
  label,
  value,
  onChange,
  yesLabel,
  noLabel,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
  yesLabel: string;
  noLabel: string;
}) {
  return (
    <Field label={label}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => onChange(true)} style={chipStyle(value === true)}>
          {yesLabel}
        </button>
        <button type="button" onClick={() => onChange(false)} style={chipStyle(value === false)}>
          {noLabel}
        </button>
      </div>
    </Field>
  );
}

export function OnboardingForm() {
  const router = useRouter();
  const { t } = useLanguage();
  const [answers, setAnswers] = useState<OnboardingAnswers>(defaultAnswers);

  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = normalizeCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        const nearestCity = coords ? findNearestCity(coords) : null;
        if (nearestCity) {
          setAnswers((current) => ({ ...current, city: nearestCity }));
        }
      },
      () => {
        // Permission denied or unavailable — city stays empty, traveler picks a chip manually.
      },
      { timeout: 5000 },
    );
  }, []);

  function updateField<K extends keyof OnboardingAnswers>(key: K, value: OnboardingAnswers[K]) {
    setAnswers((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveOnboardingAnswers(answers);
    router.push("/timeline");
  }

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <LanguageSwitcher />

      <Field label={t("onboarding.city")}>
        <ChipGroup
          options={CITY_OPTIONS}
          value={answers.city}
          onChange={(value) => updateField("city", value)}
        />
      </Field>

      <Field label={t("onboarding.arrivalTime")}>
        <input
          type="time"
          value={answers.arrivalTime}
          onChange={(event) => updateField("arrivalTime", event.target.value)}
          style={inputStyle}
        />
      </Field>

      <Field label={t("onboarding.accommodation")}>
        <input
          value={answers.accommodation}
          onChange={(event) => updateField("accommodation", event.target.value)}
          placeholder={t("onboarding.accommodationPlaceholder")}
          style={inputStyle}
        />
      </Field>

      <YesNoField
        label={t("onboarding.travelingAlone")}
        value={answers.travelingAlone}
        onChange={(value) => updateField("travelingAlone", value)}
        yesLabel={t("onboarding.yes")}
        noLabel={t("onboarding.no")}
      />
      <YesNoField
        label={t("onboarding.firstTimeInVN")}
        value={answers.firstTimeInVN}
        onChange={(value) => updateField("firstTimeInVN", value)}
        yesLabel={t("onboarding.yes")}
        noLabel={t("onboarding.no")}
      />
      <YesNoField
        label={t("onboarding.hasTransport")}
        value={answers.hasTransport}
        onChange={(value) => updateField("hasTransport", value)}
        yesLabel={t("onboarding.yes")}
        noLabel={t("onboarding.no")}
      />
      <YesNoField
        label={t("onboarding.hasMobileData")}
        value={answers.hasMobileData}
        onChange={(value) => updateField("hasMobileData", value)}
        yesLabel={t("onboarding.yes")}
        noLabel={t("onboarding.no")}
      />

      <button
        type="submit"
        style={{
          padding: "14px 16px",
          borderRadius: theme.borderRadius.button,
          border: "none",
          background: theme.colors.primary,
          color: "#ffffff",
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "inherit",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {t("onboarding.submit")}
      </button>
    </form>
  );
}
