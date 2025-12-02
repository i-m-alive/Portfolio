"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function HeroProfile({
  name,
  role,
  location,
  avatar,
  stats,
}: {
  name: string;
  role: string;
  location?: string;
  avatar?: string;
  stats: { label: string; value: string | number }[];
}) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="relative overflow-hidden border rounded-2xl border-cyan-700/10"
      style={{ background: "linear-gradient(180deg, rgba(2,8,12,0.6), rgba(2,6,8,0.9))" }}
    >
      <div className="relative overflow-hidden">
        {/* Avatar background (large) */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${avatar ?? "/models/avatar1.png"})`,
            backgroundSize: "contain",
            backgroundPosition: "top center",
            backgroundRepeat: "no-repeat",
            filter: "brightness(0.45) contrast(1.05)",
            zIndex: 0,
          }}
        />
        {/* dark overlay */}
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/20 to-black/80" />

        <div className="relative z-20 flex items-center gap-6 px-6 py-8 md:py-12">
          <div className="flex-shrink-0 overflow-hidden rounded-full w-28 h-28 ring-2 ring-cyan-400/20">
            <Image src={avatar ?? "/models/avatar1.png"} alt={name} width={160} height={160} style={{ objectFit: "cover" }} />
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold leading-tight md:text-3xl text-cyan-100">{name}</h1>
                <p className="mt-1 text-sm text-cyan-200/80">{role} {location ? `· ${location}` : ""}</p>
              </div>

              <div className="hidden space-x-3 md:flex">
                {stats.map((s) => (
                  <div key={s.label} className="px-3 py-2 text-right border rounded-md bg-black/30 border-cyan-400/6">
                    <div className="text-xs text-cyan-200/60">{s.label}</div>
                    <div className="text-lg font-semibold text-cyan-50">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>

            <p className="max-w-3xl mt-4 text-sm md:text-base text-cyan-200/75">
              AI/ML Engineer with expertise in designing, developing, and deploying cloud-based machine learning pipelines and deep learning models for production at scale. Skilled in Transformer architectures, LangChain, Hugging Face, and production MLOps.
            </p>

            {/* small action row */}
            <div className="flex gap-3 mt-4">
              <a href="/resume.pdf" className="px-3 py-2 text-sm border rounded-md bg-cyan-700/10 border-cyan-400/8 hover:bg-cyan-700/6">Download Resume</a>
              <a href="https://github.com/i-m-alive" target="_blank" rel="noreferrer" className="px-3 py-2 text-sm border rounded-md bg-black/20 border-cyan-400/6">GitHub</a>
              <a href="https://www.linkedin.com/in/kumar-shivraj-bhakat-6403b7236" target="_blank" rel="noreferrer" className="px-3 py-2 text-sm border rounded-md bg-black/20 border-cyan-400/6">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
