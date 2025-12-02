// src/app/components/ClientOverlays.tsx
"use client";

import React from "react";
import PlanetTransitionOverlay from "./orbit/PlanetTransitionOverlay";

/**
 * ClientOverlays
 * A tiny client component that mounts global overlays which need client runtime.
 * Import this in app/layout.tsx so the overlay exists site-wide.
 */
export default function ClientOverlays() {
  return (
    <>
      {/* Global planet transition overlay (listens to window planet-transition events) */}
      <PlanetTransitionOverlay />
    </>
  );
}
