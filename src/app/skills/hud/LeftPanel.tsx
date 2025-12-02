// src/app/skills/hud/LeftPanel.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";

export default function LeftPanel({
  category,
  onClose,
}: {
  category:
    | {
        id: string;
        title: string;
        description?: string;
        skills: { id: string; label: string; icon?: string; pct: number }[];
      }
    | null;
  onClose: () => void;
}) {
  if (!category) {
    return (
      <aside className="w-full p-5 border rounded-2xl bg-black/50 border-cyan-400/6">
        <div className="text-sm font-semibold text-cyan-200/70">Select a category</div>
        <div className="mt-4 text-xs text-cyan-100/60">Hover and click a square around the center to view skills.</div>
      </aside>
    );
  }

  return (
    <aside className="w-full p-5 border rounded-2xl bg-gradient-to-b from-black/60 to-black/40 border-cyan-400/6">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-cyan-100">{category.title}</h3>
          {category.description ? <p className="mt-1 text-xs text-cyan-200/60">{category.description}</p> : null}
        </div>
        <button onClick={onClose} className="text-xs text-cyan-200/70">Close</button>
      </header>

      <div className="mt-4 space-y-3">
        {category.skills.map((s) => (
          <motion.div key={s.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.34 }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 border rounded-md bg-cyan-900/20 border-cyan-400/10">
                  <span className="text-lg">{s.icon ?? "🔹"}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-cyan-100">{s.label}</div>
                  <div className="text-xs text-cyan-200/60">{s.pct}%</div>
                </div>
              </div>

              <div className="w-40 ml-4">
                <div className="w-full h-2 rounded-full bg-white/6">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${s.pct}%` }}
                    transition={{ duration: 0.9, ease: [0.22, 0.9, 0.2, 1] }}
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-sky-400"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}
