"use client";

import React from "react";

export default function Timeline({ steps }: { steps: { title: string; date?: string; desc: string }[] }) {
  return (
    <ol className="border-l border-white/10 ml-2 pl-6 space-y-6">
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-cyan-400/80 border border-white/10" />
          <div className="text-sm font-semibold">{s.title} <span className="text-xs text-white/50 ml-2">{s.date}</span></div>
          <div className="mt-1 text-sm text-white/75">{s.desc}</div>
        </li>
      ))}
    </ol>
  );
}
