// src/app/components/orbit/SolarPreview.tsx
"use client";

import React, { useEffect, useRef } from "react";
import HeroSolar from "./HeroSolar";

type Detail = {
  id?: string;
  cx?: number;
  cy?: number;
  r?: number;
  goto?: string;
  label?: string;
  xPerc?: number;
  yPerc?: number;
  theme?: string;
  imgSrc?: string | null;
  __forwarded?: boolean; // internal marker to avoid re-forwarding loops
};

/**
 * SolarPreview (forwarding mode, loop-safe)
 *
 * Forwards local planet-transition events into a single global event for the top-level overlay.
 * Uses `__forwarded` flag to avoid forwarding events that were already forwarded.
 */
export default function SolarPreview({ scale = 0.72, height = "360px" }: { scale?: number; height?: string }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPlanetTransition(e: Event) {
      const ev = e as CustomEvent<Detail>;
      const d: Detail = ev?.detail ?? {};

      // If this event already has been forwarded by us, ignore it here (prevents loops)
      if (d && (d as any).__forwarded) {
        return;
      }

      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // If the event contains xPerc/yPerc prefer to compute absolute coordinates
      let cx = typeof d.cx === "number" ? d.cx : undefined;
      let cy = typeof d.cy === "number" ? d.cy : undefined;

      if ((typeof cx !== "number" || typeof cy !== "number") && typeof d.xPerc === "number") {
        cx = (d.xPerc / 100) * vw;
        cy = ((d.yPerc ?? 50) / 100) * vh;
      }

      // If still undefined, default to viewport center
      if (typeof cx !== "number" || typeof cy !== "number") {
        cx = Math.round(vw / 2);
        cy = Math.round(vh / 2);
      }

      // Build a normalized detail object for forwarding.
      const forwardDetail: Detail = {
        id: d?.id,
        cx,
        cy,
        r: Math.max(12, d?.r ?? 22),
        goto: d?.goto,
        label: d?.label,
        theme: d?.theme,
        imgSrc: d?.imgSrc ?? null,
        __forwarded: true, // mark as forwarded so listeners (including us) can ignore re-forwarding
      };

      // Dispatch the same event globally (the top-level overlay listens to this)
      // microtask delay so other listeners can run predictably
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("planet-transition", { detail: forwardDetail }));
      }, 8);

      // Return (do not render a preview-local overlay here; the global overlay will show)
      return;
    }

    // Listen for planet-transition fired by the HeroSolar inside the preview
    window.addEventListener("planet-transition", onPlanetTransition as EventListener);

    return () => {
      window.removeEventListener("planet-transition", onPlanetTransition as EventListener);
    };
  }, []);

  // Preview markup (no overlay — global overlay handles it)
  //
  // The preview scales a 560px-tall hero into a 220-360px clipped box, which
  // left ~8 focusable planet buttons per page reachable by keyboard but
  // invisible (WCAG 2.4.11). It is a decorative echo of the home page — real
  // navigation lives in the site header — so it is removed from the tab order
  // and the accessibility tree entirely.
  return (
    <div ref={rootRef} style={{ width: "100%" }} aria-hidden="true" inert>
      <div
        style={{ height, display: "flex", alignItems: "center", justifyContent: "center" }}
        className="relative w-full overflow-hidden border solar-preview-box rounded-xl border-white/6 bg-black/60"
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "50% 50%",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
      >
          <HeroSolar asHeading={false} />
        </div>
      </div>

      <style jsx>{`
        /* subtle particle CSS kept for preview consistency */
        .sp::before,
        .sp::after {
          content: "";
          position: absolute;
          left: 50%;
          top: 50%;
          width: 8px;
          height: 8px;
          background: rgba(3, 218, 197, 0.16);
          border-radius: 999px;
          transform-origin: center;
          animation: burst 1.2s cubic-bezier(.2, .9, .2, 1) infinite;
          opacity: 0.9;
        }
        .sp::after {
          background: rgba(59, 130, 246, 0.1);
          animation-delay: 0.18s;
        }
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(0.2) translateY(0);
            opacity: 1;
          }
          40% {
            transform: translate(-50%, -50%) scale(1.1) translateY(-46px);
            opacity: 0.9;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.6) translateY(-120px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
