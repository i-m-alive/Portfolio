"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SkillItem = { name: string; score: number };
type Group = { title: string; items: SkillItem[] };

export default function SkillPanel({ groups }: { groups: Group[] }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!groups || groups.length === 0) return;
    setActiveIdx((i) => Math.min(i, groups.length - 1));
  }, [groups]);

  const active = groups && groups[activeIdx];

  return (
    <div className="w-full">
      {/* Buttons row — centered */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-wrap gap-3 max-w-[900px]">
          {groups.map((g, i) => (
            <button
              key={g.title}
              onClick={() => setActiveIdx(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActiveIdx(i);
                }
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all select-none
              ${
                i === activeIdx
                  ? "bg-gradient-to-r from-cyan-400/20 to-teal-300/8 border border-cyan-400/20 text-cyan-100 shadow-[0_6px_18px_rgba(2,209,197,0.06)]"
                  : "bg-black/20 border border-cyan-400/6 text-cyan-200/70 hover:bg-black/25"
              }`}
              aria-pressed={i === activeIdx}
            >
              {g.title}
            </button>
          ))}
        </div>
      </div>

      {/* Single compact card display */}
      <div className="mx-auto max-w-[900px] rounded-lg border border-cyan-400/6 bg-black/20 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-lg font-semibold text-cyan-100">{active?.title ?? "Skills"}</h4>
            <div className="mt-1 text-xs text-cyan-200/60">{active ? `${active.items.length} items` : ""}</div>
          </div>

          <div className="hidden text-sm text-cyan-200/70 md:block">Hover bars to see values</div>
        </div>

        <div className="mt-4 space-y-4">
          <AnimatePresence initial={false} mode="popLayout">
            {active?.items.map((it) => (
              <motion.div
                key={it.name}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.28 }}
                className="group"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm text-cyan-200/85">{it.name}</div>
                  <div className="text-sm font-semibold text-cyan-100">{it.score}%</div>
                </div>

                <div className="mt-2 w-full bg-[#021416] rounded-full h-2 overflow-hidden border border-cyan-400/4">
                  <motion.div
                    className="h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${it.score}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    style={{ background: "linear-gradient(90deg,#00f2ff,#2dd4bf)" }}
                    title={`${it.name}: ${it.score}%`}
                  />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
