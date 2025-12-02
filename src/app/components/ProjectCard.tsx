"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

type Props = {
  title: string;
  slug: string;
  short: string;
  cover?: string;
  status?: "deployed" | "code-only";
  github?: string;
  tech?: string[];
};

export default function ProjectCard({
  title,
  slug,
  short,
  cover = "/projects/placeholder.jpg",
  status = "code-only",
  github,
  tech = [],
}: Props) {
  // Ensure cover path is a string and falls back to placeholder
  const coverSrc = typeof cover === "string" && cover.length > 0 ? cover : "/projects/placeholder.jpg";

  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group bg-white/3 border border-white/6 rounded-2xl overflow-hidden shadow-md focus-within:ring-2 focus-within:ring-cyan-300"
    >
      <div className="h-48 w-full relative">
        {/* Next/Image requires width/height when not using fill */}
        <Image
          src={coverSrc}
          alt={`${title} cover`}
          fill={false}
          width={1200}
          height={720}
          className="w-full h-full object-cover"
          priority={false}
        />

        <div className="absolute left-4 top-4 px-3 py-1 rounded-full bg-black/60 text-xs border border-white/10">
          {status === "deployed" ? "Live" : "Code"}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-white/75">{short}</p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2 flex-wrap" aria-hidden>
            {(tech || []).slice(0, 4).map((t) => (
              <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/6">
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs px-3 py-1 rounded-md border border-white/6 bg-white/3 hover:bg-white/5 flex items-center gap-2"
                aria-label={`Open ${title} repository on GitHub`}
                title="View code on GitHub"
              >
                <ExternalLink size={14} /> Code
              </a>
            )}

            <Link
              href={`/projects/${slug}`}
              className="text-xs px-3 py-1 rounded-md border border-cyan-400 bg-cyan-500/10 hover:bg-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-300"
              aria-label={`Open ${title} case study`}
            >
              View
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
