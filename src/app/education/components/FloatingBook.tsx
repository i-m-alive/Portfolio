// src/app/education/components/FloatingBook.tsx
"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function FloatingBook({
  book,
  index,
  onClick,
}: {
  book: {
    id: string;
    title: string;
    description?: string;
    previewImg: string;
  };
  index: number;
  onClick: () => void;
}) {
  const floatDelay = index * 0.25;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0],
        rotateY: [-6, 6, -6],
      }}
      transition={{
        repeat: Infinity,
        duration: 6,
        delay: floatDelay,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.06 }}
      onClick={onClick}
      className="relative cursor-pointer select-none"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      {/* subtle holographic glow */}
      <div
        className="absolute inset-0 pointer-events-none rounded-xl"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(6,246,255,0.12) 0%, rgba(6,246,255,0.02) 25%, transparent 40%)",
          filter: "blur(12px)",
        }}
      />

      {/* book body */}
      <div
        className="relative w-56 h-72 p-3 rounded-xl border border-cyan-300/30
          bg-black/20 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.06)]
          hover:shadow-[0_0_40px_rgba(0,255,255,0.14)] transition-all"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-md">
          <Image
            src={book.previewImg}
            alt={book.title}
            fill
            className="object-contain"
            priority={index === 0}
          />
        </div>
      </div>

      {/* hover label (always slightly visible on focus/hover) */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1, y: 0 }}
        whileFocus={{ opacity: 1, y: 0 }}
        className="absolute px-3 py-1 mt-3 text-sm text-center -translate-x-1/2 border rounded-md left-1/2 text-cyan-100 bg-black/40 backdrop-blur-md border-cyan-300/40"
        style={{ opacity: 0 }}
      >
        {book.title}
      </motion.div>
    </motion.div>
  );
}
