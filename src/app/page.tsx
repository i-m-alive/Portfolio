// src/app/page.tsx
"use client"; // <-- required for usePathname and other client hooks

import React from "react";
import { usePathname } from "next/navigation";
import ShipCursor from "@/app/components/ShipCursor";
import CrosshairOverlay from "@/app/components/CrosshairOverlay";
import HeroSolar from "@/app/components/orbit/HeroSolar";
import DynamicCosmic from "@/app/components/DynamicCosmic";

export default function Home() {
  const pathname = usePathname();
  const showOverlays = pathname === "/";

  return (
    <main className="relative w-full min-h-screen overflow-hidden home">
      <DynamicCosmic />
      {showOverlays && <ShipCursor />}
      <HeroSolar />
      {showOverlays && <CrosshairOverlay />}
      <DynamicCosmic />
    </main>
  );
}
