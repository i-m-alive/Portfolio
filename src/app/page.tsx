// src/app/page.tsx
"use client";

import React from "react";
import ShipCursor from "@/app/components/ShipCursor";
import CrosshairOverlay from "@/app/components/CrosshairOverlay";
import HeroSolar from "@/app/components/orbit/HeroSolar";
import DynamicCosmic from "@/app/components/DynamicCosmic";

export default function Home() {
  return (
    <main className="relative w-full min-h-screen home">
      {/* One canvas only — this was previously rendered twice, stacking two
          full-screen rAF loops where the second painted over the first. */}
      <DynamicCosmic />
      <ShipCursor />
      <HeroSolar />
      <CrosshairOverlay />
    </main>
  );
}
