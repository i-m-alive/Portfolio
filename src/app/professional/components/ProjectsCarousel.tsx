// app/components/ProjectsCarousel.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Project = {
  id: string;
  title: string;
  desc?: string;
  summary?: string;
  tech?: string[];
  href?: string;
  metrics?: Record<string, string>;
};

const buildVariants = (reduceMotion: boolean | null) => {
  if (reduceMotion) {
    const tiny = { hidden: { opacity: 0 }, show: { opacity: 1 } };
    return { up: tiny, subtleSpring: tiny };
  }
  const up = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.44, ease: "easeOut" } },
  };
  const subtleSpring = {
    hidden: { opacity: 0, y: 8, scale: 0.995 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 160, damping: 16, mass: 0.5 },
    },
  };
  return { up, subtleSpring };
};

export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const moveRef = useRef<(dir: number) => void>(() => {});
  const reduceMotion = useReducedMotion();
  const variants = buildVariants(reduceMotion);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const clamp = (v: number) => Math.max(0, Math.min(v, projects.length - 1));

  const move = (dir: number) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setIndex((prev) => {
      const next = clamp(prev + dir);
      indexRef.current = next;
      return next;
    });
    setTimeout(() => {
      lockRef.current = false;
    }, 300);
  };
  moveRef.current = move;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "PageDown") moveRef.current(1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") moveRef.current(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const atStart = index === 0;
  const atEnd = index === projects.length - 1;

  // card width used in CSS calc for arrow placement; adjust if you change card widths
  const CARD_WIDTH = 320;

  return (
    <section className="space-y-4">
      <h3 className="mb-1 text-2xl font-semibold text-cyan-100">Featured AI Projects</h3>

      {/* Arrow row above the cards */}
      <div className="relative flex items-center justify-center w-full mb-2" style={{ minHeight: 44 }}>
        {/* left arrow (placed above and slightly outside the left edge of the card stack) */}
        <button
          aria-label="Previous project"
          onClick={() => move(-1)}
          disabled={atStart}
          className={`p-3 rounded-full transition transform shadow-lg focus:outline-none ${
            atStart ? "opacity-40 cursor-not-allowed bg-white/6" : "bg-cyan-400/95 hover:scale-105"
          }`}
          style={{
            position: "absolute",
            left: `calc(50% - ${CARD_WIDTH / 2 + 64}px)`, // placed left of the centered deck
            top: 0,
            zIndex: 80,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M15 6L9 12L15 18" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* right arrow (placed above and slightly outside the right edge of the card stack) */}
        <button
          aria-label="Next project"
          onClick={() => move(1)}
          disabled={atEnd}
          className={`p-3 rounded-full transition transform shadow-lg focus:outline-none ${
            atEnd ? "opacity-40 cursor-not-allowed bg-white/6" : "bg-cyan-400/95 hover:scale-105"
          }`}
          style={{
            position: "absolute",
            right: `calc(50% - ${CARD_WIDTH / 2 + 64}px)`, // symmetric to left arrow
            top: 0,
            zIndex: 80,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M9 6L15 12L9 18" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* optional small caption or spacer (center) */}
        <div className="text-sm text-white/60">Use arrows or keyboard to navigate</div>
      </div>

      {/* Deck row: cards sit directly below arrows */}
      <div className="relative w-full">
        <div className="relative flex items-center justify-center w-full h-[300px] select-none" style={{ overflow: "visible" }}>
          {projects.map((item, i) => {
            const offset = i - index;
            if (offset < -5 || offset > 5) return null;

            const isActive = offset === 0;
            // stacked transform values
            const rotate = isActive ? 0 : offset * 6.5;
            const x = offset * 18;
            const y = isActive ? 0 : offset * -10;
            const scale = isActive ? 1 : 0.945 - Math.min(0.02, Math.abs(offset) * 0.005);
            const blur = isActive ? "none" : "blur(1.8px)";
            const z = 300 - Math.abs(offset) * 10;

            return (
              <motion.div
                key={item.id || i}
                initial={reduceMotion ? {} : { opacity: 0, y: 12 }}
                animate={{
                  rotate,
                  x,
                  y,
                  scale,
                  filter: blur,
                  opacity: isActive ? 1 : 0.24,
                }}
                transition={{ type: "spring", stiffness: 110, damping: 16 }}
                style={{ zIndex: z, pointerEvents: "auto", position: "absolute" }}
                className="w-[280px] md:w-[320px] lg:w-[340px]"
              >
                <motion.div
                  whileHover={!reduceMotion && isActive ? { translateY: -6 } : {}}
                  transition={{ type: "spring", stiffness: 220, damping: 18 }}
                  className={`rounded-2xl border border-white/12 shadow-2xl`}
                  style={{
                    padding: 6,
                    boxShadow: isActive
                      ? "0 18px 36px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.02)"
                      : "0 8px 22px rgba(0,0,0,0.45)",
                  }}
                >
                  <div
                    className="overflow-hidden rounded-xl"
                    style={{
                      background: "linear-gradient(180deg, rgba(0,0,0,0.78), rgba(0,0,0,0.62))",
                      padding: 14,
                      minHeight: 180,
                      width: "100%",
                    }}
                  >
                    <motion.div initial="hidden" animate="show" variants={isActive ? variants.subtleSpring : variants.up}>
                      <ProjectCardContent p={item} />
                    </motion.div>

                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.12) 100%)",
                        mixBlendMode: "overlay",
                        borderRadius: 12,
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}

          {/* dots */}
          <div className="absolute z-50 flex gap-2 -translate-x-1/2 bottom-3 left-1/2">
            {projects.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Go to ${i + 1}`}
                className={`w-2 h-2 rounded-full transition ${i === index ? "bg-cyan-400" : "bg-white/10"}`}
                style={{ pointerEvents: "auto" }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Project card UI (compact) - Open button removed
   ------------------------- */
function ProjectCardContent({ p }: { p: Project }) {
  const title = p.title;
  const desc = p.desc ?? p.summary ?? "";
  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-1">
        <h3 className="text-lg font-bold leading-tight md:text-xl drop-shadow-md">{title}</h3>

        <div className="mt-2">
          <p
            className="text-sm leading-relaxed text-white/85"
            style={{ lineHeight: 1.45, maxHeight: "6.6rem", overflow: "hidden" }}
          >
            {desc}
          </p>
        </div>

        {p.tech && p.tech.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {p.tech.map((t) => (
              <span key={t} className="px-2 py-1 text-xs border rounded bg-white/10 border-white/10 text-white/90">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-4 border-t border-white/6">
        <div className="space-y-1 text-sm text-white/80">
          {p.metrics && Object.keys(p.metrics).length > 0 ? (
            Object.entries(p.metrics).map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-white/60">{k}</div>
                <div className="font-semibold text-white">{v}</div>
              </div>
            ))
          ) : (
            <div className="text-xs text-white/60">No metrics</div>
          )}
        </div>

        <div style={{ width: 72 }} />
      </div>
    </div>
  );
}
