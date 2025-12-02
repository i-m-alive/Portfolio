// src/app/work-experience/components/ExperienceCard.tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Exp } from "./ExperienceModalParallax";

export default function ExperienceCard({
  exp,
  index,
  onOpen,
}: {
  exp: Exp;
  index: number;
  onOpen: (e: Exp) => void;
}) {
  return (
    <motion.button
      onClick={() => onOpen(exp)}
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ duration: 0.22 }}
      className="relative block w-full text-left cursor-pointer"
      aria-label={`Open ${exp.title}`}
      type="button"
      style={{ background: "transparent", border: "none", padding: 0 }}
    >
      <div data-anchor={exp.id} className="relative w-full card-anchor">
        <div
          className="relative p-6 overflow-visible border rounded-2xl bg-black/12"
          style={{
            boxShadow:
              "inset 0 0 26px rgba(6,246,255,0.02), 0 18px 42px rgba(0,0,0,0.65)",
            minHeight: 160,
          }}
        >
          <div className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 left-1/2">
            <div
              className="overflow-hidden border-2 rounded-full border-cyan-400/10"
              style={{ width: 96, height: 96, background: "#041015" }}
            >
              {exp.avatar ? (
                <Image
                  key={exp.avatar}
                  src={exp.avatar}
                  alt={`${exp.title} avatar`}
                  width={180}
                  height={180}
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <div className="w-full h-full bg-black/20" />
              )}
            </div>
          </div>

          <div className="relative z-10 pt-14">
            <div className="text-xs text-cyan-300/60">
              {exp.company} · {exp.type}
            </div>
            <h3 className="mt-2 text-lg font-bold leading-snug md:text-xl text-cyan-100">
              {exp.title}
            </h3>
            <div className="mt-1 text-xs md:text-sm text-cyan-200/70">
              {exp.period}
              {exp.location ? ` · ${exp.location}` : ""}
            </div>
          </div>

          <div
            className="absolute inset-0 pointer-events-none rounded-2xl"
            style={{ border: "1px dashed rgba(6,246,255,0.03)" }}
          />
        </div>
      </div>
    </motion.button>
  );
}
