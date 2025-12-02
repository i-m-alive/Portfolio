"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

type Project = {
  id: string | number;
  title: string;
  desc: string;
  tech: string[];
  href: string;
};

type ProjectDeckProps = {
  projects: Project[];
};

export default function ProjectDeck({ projects }: ProjectDeckProps) {
  const [index, setIndex] = useState<number>(0);

  // scroll to shift cards
  useEffect(() => {
    const handler = () => {
      const scrollPos = window.scrollY;
      const next = Math.floor(scrollPos / 180); // adjust sensitivity

      if (next !== index && next >= 0 && next < projects.length) {
        setIndex(next);
      }
    };

    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [index, projects.length]);

  return (
    <div className="relative h-[480px] w-full flex items-center justify-center mt-10">
      {projects.map((p: Project, i: number) => {
        // distance from top card
        const offset = i - index;

        // top card
        const isActive = offset === 0;

        return (
          <motion.div
            key={p.id}
            className="absolute w-[360px]"
            style={{ perspective: 1200, zIndex: 20 - i }}
            animate={{
              rotate: isActive ? 0 : offset * 12,
              y: isActive ? 0 : offset * -18,
              scale: isActive ? 1 : 0.92,
              opacity: isActive ? 1 : 0.55,
              filter: isActive ? "none" : "blur(1px)",
            }}
            transition={{ type: "spring", stiffness: 140, damping: 18 }}
          >
            <motion.div className="p-5 border shadow-xl rounded-2xl border-white/10 bg-white/5 backdrop-blur-xl">
              <h3 className="text-xl font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm text-white/70">{p.desc}</p>

              <div className="flex flex-wrap gap-2 mt-3">
                {p.tech.map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-1 text-xs rounded bg-white/10"
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="flex justify-end mt-4">
                <a
                  href={p.href}
                  className="px-4 py-1 text-sm font-semibold text-black rounded bg-cyan-400/80"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open
                </a>
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
