// src/components/orbit/Planet.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, PanInfo } from "framer-motion";
import Image from "next/image";

export default function Planet({
  id,
  label,
  icon,
  goto,
  size = 56,
  angle: _angle = 0,
  onClick,
  ariaLabel,
}: {
  id: string;
  label: string;
  icon: string;
  goto?: string;
  size?: number;
  angle?: number;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel?: string;
}) {
  const controls = useAnimation();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  async function handleDragEnd(_: PointerEvent | TouchEvent | MouseEvent | undefined, info?: PanInfo) {
    const vx = Math.abs(info?.velocity?.x ?? 0);
    const vy = Math.abs(info?.velocity?.y ?? 0);
    const stiffness = Math.max(220, Math.round(380 - Math.min(180, vx + vy)));
    await controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness, damping: 24 },
    });
  }

  useEffect(() => {
    controls.set({ x: 0, y: 0 });
  }, [controls]);

  // mouse handlers
  function handleMouseEnter(e: React.MouseEvent) {
    window.dispatchEvent(new CustomEvent("planet-hover", { detail: { label, show: true, x: e.clientX, y: e.clientY } }));
  }
  function handleMouseMove(e: React.MouseEvent) {
    window.dispatchEvent(new CustomEvent("planet-hover", { detail: { label, show: true, x: e.clientX, y: e.clientY } }));
  }
  function handleMouseLeave() {
    window.dispatchEvent(new CustomEvent("planet-hover", { detail: { label: "", show: false } }));
  }

  // keyboard focus handlers
  function handleFocus(_: React.FocusEvent<HTMLButtonElement>) {
    const el = btnRef.current;
    if (!el) {
      window.dispatchEvent(new CustomEvent("planet-hover", { detail: { label, show: true, x: window.innerWidth / 2, y: window.innerHeight / 2 } }));
      return;
    }
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    window.dispatchEvent(new CustomEvent("planet-hover", { detail: { label, show: true, x: cx, y: cy } }));
  }
  function handleBlur(_: React.FocusEvent<HTMLButtonElement>) {
    window.dispatchEvent(new CustomEvent("planet-hover", { detail: { label: "", show: false } }));
  }

  // click: stop propagation and send event WITH imgSrc AND goto (if provided)
  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();

    const el = btnRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = Math.max(rect.width, rect.height) / 2;

      // prefer actual <img> src if present; otherwise fallback to data-img-src attribute
      let imgSrc: string | null = null;
      const imgEl = el.querySelector("img") as HTMLImageElement | null;
      if (imgEl?.src) imgSrc = imgEl.src;
      if (!imgSrc) imgSrc = el.getAttribute("data-img-src");

      const theme =
        id === "professional" || id === "ai"
          ? "ai"
          : id === "rap"
          ? "rap"
          : id === "sketch"
          ? "sketch"
          : "default";

      window.dispatchEvent(
        new CustomEvent("planet-transition", {
          detail: {
            id,
            label,
            theme,
            goto: goto ?? undefined,
            cx,
            cy,
            r,
            imgSrc,
          },
        })
      );
    }

    if (onClick) onClick(e);
  }

  return (
    <div
      className="orbit-planet-wrapper"
      data-planet-id={id}
      style={{
        width: size,
        height: size + 28,
        display: "inline-block",
        position: "relative",
        pointerEvents: "auto",
      }}
    >
      <motion.button
        ref={btnRef}
        aria-label={ariaLabel ?? label}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className="flex items-center justify-center border rounded-full shadow-md orbit-planet bg-white/6 border-white/8"
        style={{
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        drag
        dragElastic={0.18}
        dragMomentum
        onDragEnd={handleDragEnd}
        animate={controls}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 1.04 }}
        data-img-src={icon}
      >
        <div
          className="orbit-planet-inner"
          style={{
            transform: "none",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            src={icon}
            alt={`${label} icon`}
            width={Math.round(size * 0.45)}
            height={Math.round(size * 0.45)}
            unoptimized={true}
            style={{ display: "block", pointerEvents: "none", width: Math.round(size * 0.45), height: Math.round(size * 0.45) }}
          />
        </div>
      </motion.button>
    </div>
  );
}
