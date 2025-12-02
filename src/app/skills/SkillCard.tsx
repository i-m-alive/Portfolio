// src/components/skills/SkillCard.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

type Skill = { name: string; level: number; tag?: string };

export default function SkillCard({ category }: { category: any }) {
  return (
    <div className="rounded-2xl p-6 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-semibold text-white">{category.title}</h3>
          <p className="max-w-xl mt-2 text-cyan-300/70">{category.subtitle}</p>
        </div>
        <div className="text-xs text-white/40">{category.updated}</div>
      </div>

      <div className="grid grid-cols-1 gap-4 mt-6">
        {category.items.map((s: Skill, i: number) => (
          <div key={s.name} className="flex items-center gap-4">
            <div className="w-28">
              <div className="text-sm text-white/80">{s.name}</div>
              <div className="text-xs text-white/40">{s.tag}</div>
            </div>

            <div className="flex-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max(6, Math.min(100, s.level))}%` }}
                transition={{ duration: 0.9, delay: 0.08 + i * 0.03 }}
                className="h-3 rounded bg-gradient-to-r from-[#06c3b3] to-[#3fe1c9]"
                style={{ maxWidth: "100%" }}
              />
            </div>

            <div className="w-12 text-sm font-medium text-right text-white/80">{s.level}%</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-4 mt-6 border-t border-white/6">
        {category.items.slice(0, 6).map((s: Skill) => (
          <SkillChip key={s.name} label={s.name} />
        ))}
      </div>
    </div>
  );
}

function SkillChip({ label }: { label: string }) {
  return (
    <div className="px-3 py-1 text-xs border rounded-full bg-white/4 border-white/6 text-white/80">
      {label}
    </div>
  );
}
