"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export default function ShipCursor() {
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [scale, setScale] = useState(1);
  const rafRef = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    // auto-hide when not on home
    if (pathname !== "/") {
      setPos({ x: -9999, y: -9999 });
      return;
    }
  }, [pathname]);

  useEffect(() => {
    let last = { x: pos.x, y: pos.y };

    function onMove(e: MouseEvent) {
      last = { x: e.clientX, y: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setPos({ x: last.x, y: last.y });
          rafRef.current = null;
        });
      }
    }

    function onPlanetHover(e: Event) {
      const ev = e as CustomEvent;
      const d = ev.detail as { show?: boolean };
      setScale(d?.show ? 0.86 : 1);
    }

    window.addEventListener("mousemove", onMove);
    window.addEventListener("planet-hover", onPlanetHover as EventListener);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("planet-hover", onPlanetHover as EventListener);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // don't render if not on home — prevents leaking
  if (pathname !== "/") return null;

  const style: React.CSSProperties = {
    left: pos.x,
    top: pos.y,
    transform: `translate(-50%, -50%) scale(${scale})`,
    transition: "transform 120ms cubic-bezier(.2,.9,.2,1)",
    willChange: "transform",
  };

  return (
    <div aria-hidden className="fixed pointer-events-none z-[99999]">
      <div style={style} className="absolute -translate-x-1/2 -translate-y-1/2">
        <img src="/ship.png" alt="" width={36} height={36} style={{ display: "block" }} />
      </div>
    </div>
  );
}
