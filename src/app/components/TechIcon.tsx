"use client";

import React from "react";
import { SiPython, SiPytorch, SiTensorflow, SiHuggingface } from "react-icons/si";

type Props = { name: string };

export default function TechIcon({ name }: Props) {
  const size = 36;

  const icons: Record<string, React.ReactNode> = {
    python: <SiPython size={size} />,
    pytorch: <SiPytorch size={size} />,
    tensorflow: <SiTensorflow size={size} />,
    huggingface: <SiHuggingface size={size} />,
    // add more mappings as needed
  };

  const key = name.toLowerCase();

  return (
    <div className="flex flex-col items-center gap-2 w-28">
      <div
        className="flex items-center justify-center p-2 border rounded-lg bg-white/3 border-white/6 w-14 h-14"
        title={name} // simple native tooltip on hover
      >
        {icons[key] ?? <div className="text-xs">{name}</div>}
      </div>
      <div className="text-xs text-white/60">{name}</div>
    </div>
  );
}
