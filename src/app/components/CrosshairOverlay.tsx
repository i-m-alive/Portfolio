"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function CrosshairOverlay() {
  const [pos, setPos] = useState<{ x: number; y: number }>({ x: -9999, y: -9999 });
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY });
    }

    function onPlanetHover(e: Event) {
      const ev = e as CustomEvent;
      const d = ev?.detail ?? {};
      if (d && d.show) {
        setActive(true);
        setLabel(d.label ?? null);
        if (typeof d.x === "number" && typeof d.y === "number") {
          setPos({ x: d.x, y: d.y });
        }
      } else {
        setActive(false);
        setLabel(null);
      }
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("planet-hover", onPlanetHover as EventListener);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("planet-hover", onPlanetHover as EventListener);
    };
  }, []);

  // Defensive: clear active/label when not on home
  useEffect(() => {
    if (pathname !== "/") {
      setActive(false);
      setLabel(null);
    }
  }, [pathname]);

  if (pathname !== "/") return null;

  const left = pos.x;
  const top = pos.y;

  return (
    <div aria-hidden className="crosshair-root">
      <div className={`crosshair-dot ${active ? "crosshair-dot--active" : ""}`} style={{ left, top }} />
      <div className={`crosshair-ring ${active ? "crosshair-ring--active" : ""}`} style={{ left, top }} />
      {active && label && (
        <div className="crosshair-label" style={{ left: left + 36, top: top - 8 }}>
          <div className="label-box">{label}</div>
        </div>
      )}
    </div>
  );
}
