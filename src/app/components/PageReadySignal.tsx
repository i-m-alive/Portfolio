// src/components/PageReadySignal.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PageReadySignal() {
  const pathname = usePathname();

  useEffect(() => {
    // Keyed on pathname: the root layout never remounts across App Router
    // navigations, so with an empty dep array this fired exactly once on first
    // load and the transition overlay then hung on its blind fallback timers
    // for every subsequent navigation.
    const t = window.setTimeout(() => {
      window.dispatchEvent(new Event("page-rendered"));
    }, 80);
    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
