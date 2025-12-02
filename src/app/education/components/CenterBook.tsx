// src/app/education/components/CenterBook.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CenterBook({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.button
      onClick={onOpen}
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: [10, -8, 10], opacity: 1, rotateY: [0, 5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      whileHover={{ scale: 1.03 }}
      className="relative w-[320px] sm:w-[420px] md:w-[520px] h-[420px] sm:h-[520px] md:h-[680px] rounded-3xl p-6 flex items-center justify-center cursor-pointer select-none"
      style={{
        backdropFilter: "blur(8px)",
        background: "linear-gradient(180deg, rgba(0,0,0,0.18), rgba(3,12,18,0.35))",
        border: "1px solid rgba(6,246,255,0.06)",
        boxShadow: "0 30px 90px rgba(0,0,0,0.8), inset 0 0 40px rgba(6,246,255,0.02)",
      }}
      aria-label="Open Shivraj's Education"
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl" style={{ background: "radial-gradient(circle at 50% 35%, rgba(6,246,255,0.06), rgba(6,246,255,0.01) 20%, transparent 40%)", filter: "blur(18px)", zIndex: 0 }} />

      <div className="relative w-[74%] h-[86%] rounded-xl flex flex-col items-center justify-center text-center p-6 z-10" style={{ transformStyle: "preserve-3d", background: "linear-gradient(180deg, rgba(2,30,40,0.9), rgba(0,0,0,0.6))", border: "1px solid rgba(6,246,255,0.08)", boxShadow: "0 18px 60px rgba(0,0,0,0.6)" }}>
        <div className="text-2xl font-bold tracking-wide text-cyan-100 md:text-3xl">Shivraj's</div>
        <div className="mt-1 text-3xl font-extrabold text-cyan-200/70 md:text-4xl">Education</div>
        <div className="px-6 mt-6 text-sm md:text-base text-cyan-200/60">Click to open — a visual book containing education chapters, marksheets and degree.</div>
        <div className="px-4 py-2 mt-6 text-xs border rounded-full md:text-sm" style={{ borderColor: "rgba(6,246,255,0.08)", color: "rgba(6,246,255,0.9)", background: "linear-gradient(90deg, rgba(6,246,255,0.02), rgba(0,0,0,0.02))" }}>Open Book</div>
      </div>
    </motion.button>
  );
}
