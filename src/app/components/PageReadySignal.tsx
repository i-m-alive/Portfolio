// src/components/PageReadySignal.tsx
"use client";

import { useEffect } from "react";

export default function PageReadySignal() {
  useEffect(() => {
    // small timeout to let React finish painting — adjust if you want
    const t = window.setTimeout(() => {
      window.dispatchEvent(new Event("page-rendered"));
    }, 80); // 80ms is usually fine; increase to 160ms if you have heavy synchronous renders
    return () => clearTimeout(t);
  }, []);

  return null;
}
