// src/components/skills/SkillsHUD.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import SkillCard from "./SkillCard";

type Skill = { name: string; level: number; tag?: string };
type Category = {
  id: string;
  title: string;
  subtitle: string;
  updated?: string;
  items: Skill[];
};

export default function SkillsHUD({ categories }: { categories: Category[] }) {
  return (
    <div className="relative grid grid-cols-12 gap-8">
      {/* Left column: spacer (SolarPreview already in header) */}
      <div className="col-span-12 lg:col-span-3">
        {/* Show a large HUD panel with avatar and circular meter */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))] border border-white/6 p-6 shadow-xl"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="w-48 h-48 rounded-full bg-gradient-to-tr from-[#07222b] to-[#021019] flex items-center justify-center border border-white/6 shadow-inner">
              {/* replace with Lottie or image if you prefer */}
              <img src="/orbit_icons/icon-ship-big.svg" alt="ship" className="w-28 h-28" />
            </div>

            <div className="w-full text-center">
              <h3 className="text-xl font-semibold">Focal HUD</h3>
              <p className="mt-1 text-sm text-cyan-300/70">Interactive jump animation placeholder</p>
            </div>

            <div className="grid w-full grid-cols-2 gap-3">
              <MiniMeter label="ML" value={86} />
              <MiniMeter label="Infra" value={78} />
              <MiniMeter label="DL" value={84} />
              <MiniMeter label="Data" value={90} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right column: big grid of skill cards */}
      <div className="col-span-12 lg:col-span-9">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.06 + i * 0.03 }}
            >
              <SkillCard category={c} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniMeter({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-3 border rounded-md bg-white/2 border-white/6">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-white/80">{label}</div>
        <div className="text-sm font-semibold text-cyan-200">{value}%</div>
      </div>
      <div className="h-2 mt-2 overflow-hidden rounded bg-white/6">
        <div
          className="h-full bg-gradient-to-r from-[#07cbbf] to-[#2dd4bf] rounded"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
