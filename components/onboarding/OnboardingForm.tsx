"use client";

import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { OnboardingAnswers } from "../../lib/ai/types";
import { saveOnboardingAnswers } from "../../lib/store";
import { findNearestCity, normalizeCoordinates } from "../../lib/utils/geolocation";

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
  background: "#ffffff",
  padding: 24,
  borderRadius: 24,
  border: "1px solid #e2e8f0",
};

const inputStyle: CSSProperties = {
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  width: "100%",
  fontSize: 15,
};

function chipStyle(selected: boolean): CSSProperties {
  return {
    padding: "10px 16px",
    borderRadius: 999,
    border: selected ? "2px solid #ea580c" : "1px solid #cbd5e1",
    background: selected ? "#fff7ed" : "#ffffff",
    fontWeight: selected ? 700 : 500,
    cursor: "pointer",
  };
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label style={{ display: "grid", gap: 8 }}>
      <span style={{ fontWeight: 600 }}>{label}</span>
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
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <Field label={label}>
      <div style={{ display: "flex", gap: 8 }}>
        <button type="button" onClick={() => onChange(true)} style={chipStyle(value === true)}>
          Yes
        </button>
        <button type="button" onClick={() => onChange(false)} style={chipStyle(value === false)}>
          No
        </button>
      </div>
    </Field>
  );
}

export function OnboardingForm() {
  const router = useRouter();
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
      <Field label="Bạn đến thành phố nào?">
        <ChipGroup
          options={CITY_OPTIONS}
          value={answers.city}
          onChange={(value) => updateField("city", value)}
        />
      </Field>

      <Field label="Bạn đến lúc mấy giờ?">
        <input
          type="time"
          value={answers.arrivalTime}
          onChange={(event) => updateField("arrivalTime", event.target.value)}
          style={inputStyle}
        />
      </Field>

      <Field label="Bạn ở đâu tối nay?">
        <input
          value={answers.accommodation}
          onChange={(event) => updateField("accommodation", event.target.value)}
          placeholder="Tên khách sạn / hostel"
          style={inputStyle}
        />
      </Field>

      <YesNoField
        label="Bạn đi một mình?"
        value={answers.travelingAlone}
        onChange={(value) => updateField("travelingAlone", value)}
      />
      <YesNoField
        label="Đây là lần đầu bạn ở Việt Nam?"
        value={answers.firstTimeInVN}
        onChange={(value) => updateField("firstTimeInVN", value)}
      />
      <YesNoField
        label="Bạn đã có phương tiện di chuyển chưa?"
        value={answers.hasTransport}
        onChange={(value) => updateField("hasTransport", value)}
      />
      <YesNoField
        label="Bạn có mạng data chưa?"
        value={answers.hasMobileData}
        onChange={(value) => updateField("hasMobileData", value)}
      />

      <button
        type="submit"
        style={{
          padding: "14px 16px",
          borderRadius: 14,
          border: "none",
          background: "#ea580c",
          color: "#ffffff",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        Tạo Survival Timeline
      </button>
    </form>
  );
}
