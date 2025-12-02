// src/components/AccessibilityToggle.tsx
"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function AccessibilityToggle() {
  // server-safe lazy init for highContrast (no setState in effect needed)
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    try {
      if (typeof window === "undefined") return false;
      return localStorage.getItem("site_high_contrast") === "true";
    } catch {
      return false;
    }
  });

  // Apply DOM changes and persist preference when highContrast changes
  useEffect(() => {
    try {
      if (highContrast) {
        document.documentElement.style.setProperty("--site-text-size", "18px");
        document.documentElement.classList.add("high-contrast");
        localStorage.setItem("site_high_contrast", "true");
      } else {
        document.documentElement.style.setProperty("--site-text-size", "16px");
        document.documentElement.classList.remove("high-contrast");
        localStorage.setItem("site_high_contrast", "false");
      }
    } catch {
      // ignore DOM/localStorage errors in odd environments
    }
  }, [highContrast]);

  return (
    <button
      aria-pressed={highContrast}
      onClick={() => setHighContrast((s) => !s)}
      title="Toggle high contrast / larger text"
      className="fixed right-6 top-6 z-50 p-2 rounded-md border border-white/10 bg-black/60 hover:bg-white/5 transition flex items-center gap-2"
    >
      {highContrast ? <Sun size={16} /> : <Moon size={16} />}
      <span className="text-xs">A11y</span>
      <style jsx>{`
        :global(.high-contrast) {
          --tw-bg-opacity: 1;
          color: #000 !important;
          background: #fff !important;
        }
      `}</style>
    </button>
  );
}
