// src/app/skills/SkillSection.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import SkillCard from "./SkillCard";

type SkillItem = {
  id: string;
  label: string;
  tags?: string[];
  icon?: string;
};

type SkillSectionProps = {
  title: string;
  subtitle?: string;
  items: SkillItem[];
  delay?: number;
  clusterVariant?: "orbit" | "list";
};

export default function SkillSection({
  title,
  subtitle,
  items,
  delay = 0,
  clusterVariant = "orbit",
}: SkillSectionProps) {
  // orbit render: arrange items around a circle (visually like a tiny cluster)
  const orbitRender = (
    <div className="relative w-full h-[260px] flex items-center justify-center">
      {/* central node (a subtle ring) */}
      <div className="absolute flex items-center justify-center border rounded-full w-28 h-28 bg-gradient-to-br from-sky-900/40 to-transparent border-white/6">
        <div className="w-12 h-12 rounded-full bg-white/6" />
      </div>

      {/* items placed around circle */}
      {items.map((it, i) => {
        const angle = (i / items.length) * Math.PI * 2;
        const radius = 94;
        const x = Math.round(Math.cos(angle) * radius);
        const y = Math.round(Math.sin(angle) * radius);

        return (
          <motion.div
            key={it.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: delay + i * 0.04,
              duration: 0.46,
              ease: [0.22, 0.9, 0.2, 1],
            }}
            style={{
              position: "absolute",
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: "translate(-50%,-50%)",
            }}
          >
            {/* SkillCard expects `category` prop, so we wrap the values */}
            <SkillCard
              category={{
                label: it.label,
                tags: it.tags,
                icon: it.icon,
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );

  // list render for dense sections
  const listRender = (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
      {items.map((it, i) => (
        <motion.div
          key={it.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + i * 0.03 }}
        >
          <SkillCard
            category={{
              label: it.label,
              tags: it.tags,
              icon: it.icon,
              // if your SkillCard looks at category.small, this will work
              small: true,
            }}
          />
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="p-5 border shadow-xl rounded-2xl bg-black/40 border-white/6">
      <header className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-sky-300/60">{subtitle}</p>
          ) : null}
        </div>
        <div className="text-xs text-white/60">Updated · 2025</div>
      </header>

      <div className="mt-4">
        {clusterVariant === "orbit" ? orbitRender : listRender}
      </div>
    </section>
  );
}
