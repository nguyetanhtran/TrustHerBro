"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";
import { useLanguage } from "../../lib/i18n/LanguageContext";

const pageStyle: CSSProperties = {
  maxWidth: 420,
  margin: "0 auto",
  padding: "72px 24px",
};

const cardStyle: CSSProperties = {
  padding: 28,
  borderRadius: 22,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  fontSize: 15,
  boxSizing: "border-box",
};

const buttonStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: 14,
  border: "none",
  background: "#1d4ed8",
  color: "#ffffff",
  fontWeight: 700,
  fontSize: 16,
  cursor: "pointer",
};

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // If email confirmation is off, we get a session and can continue.
        if (data.session) {
          router.refresh();
          router.push("/welcome");
        } else {
          setNotice(t("login.confirmationNotice"));
          setMode("signin");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.refresh();
        router.push("/"); // middleware routes to /welcome if not onboarded
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("login.genericError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={{ marginTop: 0, fontSize: 28 }}>
          {mode === "signin" ? t("login.titleSignin") : t("login.titleSignup")}
        </h1>
        <p style={{ color: "#64748b", marginTop: 0 }}>{t("login.subtitle")}</p>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 8 }}>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={t("login.emailPlaceholder")}
            style={inputStyle}
            autoComplete="email"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("login.passwordPlaceholder")}
            style={inputStyle}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
          />
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading
              ? t("login.pleaseWait")
              : mode === "signin"
                ? t("login.signIn")
                : t("login.createAccount")}
          </button>
        </form>

        {error ? (
          <p style={{ color: "#b91c1c", marginBottom: 0 }}>{error}</p>
        ) : null}
        {notice ? (
          <p style={{ color: "#166534", marginBottom: 0 }}>{notice}</p>
        ) : null}

        <p style={{ marginTop: 18, marginBottom: 0, color: "#475569" }}>
          {mode === "signin" ? t("login.newHere") : t("login.alreadyHaveAccount")}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError(null);
              setNotice(null);
            }}
            style={{
              border: "none",
              background: "none",
              color: "#1d4ed8",
              fontWeight: 700,
              cursor: "pointer",
              padding: 0,
            }}
          >
            {mode === "signin" ? t("login.createAccount") : t("login.signIn")}
          </button>
        </p>
      </div>
    </main>
  );
}
