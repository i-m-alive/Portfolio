"use client";

import { motion } from "framer-motion";
import Link from "next/link";

type SkillTagProps = {
  name: string;
  level?: number; // 0-100
  href?: string; // optional link to project/case-study
};

export default function SkillTag({ name, level = 70, href }: SkillTagProps) {
  const content = (
    <div className="w-60 p-3 bg-white/3 backdrop-blur-sm rounded-xl border border-white/6 hover:scale-[1.02] transform transition">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-white/60">{level}%</div>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-white/6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(6, level)}%` }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
        />
      </div>
    </div>
  );

  if (href) {
    // Use Link for internal navigation; external links will open in new tab
    const isExternal = href.startsWith("http");
    return isExternal ? (
      <a href={href} target="_blank" rel="noreferrer" aria-label={`Open ${name} details`}>
        {content}
      </a>
    ) : (
      <Link href={href} aria-label={`Open ${name} details`}>
        {content}
      </Link>
    );
  }

  return content;
}
