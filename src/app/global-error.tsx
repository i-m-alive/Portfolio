"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          background: "#000",
          color: "#fff",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", color: "#7dd3fc" }}>
          Something went wrong
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)" }}>
          The application failed to load.
        </p>
        {error.digest && (
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.35)" }}>
            ref {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: 4,
            border: "none",
            background: "#22d3ee",
            color: "#000",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
