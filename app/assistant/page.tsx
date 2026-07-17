import type { CSSProperties } from "react";

const cardStyle: CSSProperties = {
  padding: 20,
  borderRadius: 18,
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  marginTop: 16,
};

export default function AssistantPage() {
  return (
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 72px" }}>
      <h1>Assistant Stub</h1>
      <p>Static examples for the future assistant flow.</p>

      <section style={cardStyle}>
        <strong>Q:</strong> Is this taxi price normal from the airport?
        <p>
          <strong>A:</strong> Ask the driver to confirm meter or fixed total
          price before departure, then compare with a ride-hailing estimate.
        </p>
      </section>

      <section style={cardStyle}>
        <strong>Q:</strong> A stranger says my hotel is closed and offers help.
        <p>
          <strong>A:</strong> Treat it as suspicious. Verify directly with your
          hotel and avoid handing over your phone, bag, or booking details.
        </p>
      </section>
    </main>
  );
}
