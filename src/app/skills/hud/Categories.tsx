"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";

type Cat = { id: string; label: string; icon?: string };

export default function Categories({
  categories,
  sideGap = 28,
  itemHeight = 100, // increased to give room for larger icons + label
  onSelect,
  videoWidth = 640,
  videoHeight = 680,
  frameHalf = 320,
}: {
  categories: Cat[];
  sideGap?: number;
  itemHeight?: number;
  onSelect: (id: string) => void;
  videoWidth?: number;
  videoHeight?: number;
  frameHalf?: number;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // split into two columns
  const mid = Math.ceil(categories.length / 2);
  const left = categories.slice(0, mid);
  const right = categories.slice(mid);

  const SIDE_OFFSET_PCT = 14;
  const H_TOP_PERCENT = 10;

  // increased visual sizes
  const ITEM_BOX = 84;   // outer card size (increased)
  const ITEM_INNER = 68; // inner "liquid" area (increased)
  const ICON_FONT = 26;  // font-size for emoji fallback / simple icons

  const handleSelect = (id: string) => {
    setSelectedId((prev) => (prev === id ? null : id));
    onSelect(id);
  };

  const IconButton = ({
    c,
    isLeft,
    idx,
  }: {
    c: Cat;
    isLeft?: boolean;
    idx: number;
  }) => {
    const isSelected = selectedId === c.id;

    return (
      <motion.button
        key={c.id}
        onClick={() => handleSelect(c.id)}
        initial={{ opacity: 0, x: isLeft ? -6 : 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: idx * 0.03, duration: 0.22 }}
        className="mb-4 pointer-events-auto group"
        style={{
          width: ITEM_BOX + 16,
          height: itemHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          position: "relative",
        }}
        aria-label={c.label}
        aria-pressed={isSelected}
      >
        {/* outer card (selected scales) */}
        <motion.div
          whileHover={{ translateY: -6 }}
          animate={isSelected ? { scale: 1.14 } : { scale: 1 }}
          transition={{ type: "spring", stiffness: 280, damping: 24 }}
          style={{
            width: ITEM_BOX,
            height: ITEM_BOX,
            borderRadius: 14,
            background: "rgba(3,18,25,0.08)",
            border: "1px solid rgba(6,200,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 10px 26px rgba(2,20,28,0.22)",
            position: "relative",
            overflow: "visible",
          }}
        >
          {/* inner liquid glass */}
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.18 }}
            style={{
              width: ITEM_INNER,
              height: ITEM_INNER,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.02), 0 8px 22px rgba(2,10,14,0.25)",
            }}
          >
            {/* icon: emoji fallback or provided string */}
            <div style={{ fontSize: ICON_FONT, lineHeight: 1 }}>{c.icon ?? "⚙️"}</div>
          </motion.div>

          {/* subtle cyan rim to emphasize selected state */}
          <motion.div
            animate={isSelected ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18 }}
            style={{
              position: "absolute",
              left: -6,
              top: -6,
              right: -6,
              bottom: -6,
              borderRadius: 18,
              pointerEvents: "none",
              boxShadow: isSelected
                ? "0 10px 40px rgba(6,200,255,0.12), 0 4px 12px rgba(6,200,255,0.06)"
                : "none",
              border: "1px solid rgba(6,200,255,0.10)",
            }}
          />
        </motion.div>

        {/* label below the icon (liquid-glass) */}
        <div
          style={{
            position: "absolute",
            bottom: -40,
            left: "50%",
            transform: "translateX(-50%)",
            minWidth: 160,
            maxWidth: 260, // increased width
            padding: "8px 12px",
            borderRadius: 12,
            background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(2,6,8,0.35))",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            border: "1px solid rgba(6,200,255,0.08)",
            textAlign: "center",
            color: "rgba(200,255,255,0.94)",
            fontSize: 13,
            fontWeight: 700,
            boxShadow: "0 8px 18px rgba(2,10,14,0.45)",
            transformOrigin: "center top",
            opacity: 0,
            transition: "opacity 160ms ease, transform 160ms ease",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
          className="group-hover:!opacity-100"
        >
          <div style={{ opacity: 1 }}>{c.label}</div>
        </div>
      </motion.button>
    );
  };

  return (
    <div className="relative w-full h-full pointer-events-none">
      {/* LEFT column */}
      <div
        className="absolute"
        style={{
          left: `${SIDE_OFFSET_PCT}%`,
          top: `${H_TOP_PERCENT}%`,
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {left.map((c, i) => (
          <IconButton c={c} isLeft idx={i} key={c.id} />
        ))}
      </div>

      {/* RIGHT column */}
      <div
        className="absolute"
        style={{
          right: `${SIDE_OFFSET_PCT}%`,
          top: `${H_TOP_PERCENT}%`,
          zIndex: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pointerEvents: "none",
        }}
      >
        {right.map((c, i) => (
          <IconButton c={c} isLeft={false} idx={i} key={c.id} />
        ))}
      </div>
    </div>
  );
}
