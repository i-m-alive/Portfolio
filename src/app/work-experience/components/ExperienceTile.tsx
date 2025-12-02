// src/app/work-experience/components/ExperienceTimeline.tsx (or ExperienceTile.tsx)
"use client";

import React, { useEffect, useRef, useState } from "react";
import ExperienceCard from "./ExperienceCard";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Exp } from "./ExperienceModalParallax"; // <-- reuse shared type

export type Experience = Exp; // alias for clarity

type Props = {
  experiences: Experience[];
  onOpen: (id: string) => void;
  onClose: () => void;
  openId: string | null;
};

export default function ExperienceTimeline({
  experiences,
  onOpen,
  onClose,
  openId,
}: Props) {
  const svgRef = useRef<SVGPathElement | null>(null);
  const arrowRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [pathLength, setPathLength] = useState(0);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [hidePath, setHidePath] = useState(false);

  // performance / reduced motion checks (guard against SSR)
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowDPR =
    typeof window !== "undefined" &&
    (window.devicePixelRatio || 1) < 1.25;
  const reducedVisuals = prefersReducedMotion || lowDPR;

  // Hide/show path on resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    function updateVisibility() {
      const w = window.innerWidth;
      // hide path on small screens
      setHidePath(w < 640);
    }
    updateVisibility();
    window.addEventListener("resize", updateVisibility);
    return () => window.removeEventListener("resize", updateVisibility);
  }, []);

  // compute path from node positions
  useEffect(() => {
    const pathEl = svgRef.current;
    if (!pathEl) return;

    const pts: { x: number; y: number }[] = [];
    experiences.forEach((ex) => {
      const el = nodeRefs.current[ex.id];
      if (!el) return;
      const r = el.getBoundingClientRect();
      // use viewport coords
      pts.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    });

    if (pts.length === 0) return;

    // Build smooth zig-zag cubic path
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const prev = pts[i - 1];
      const cur = pts[i];
      const midX = (prev.x + cur.x) / 2;
      const offsetY = i % 2 === 0 ? -60 : 60;
      const cp1x = midX;
      const cp1y = prev.y + offsetY;
      const cp2x = midX;
      const cp2y = cur.y - offsetY;
      d += ` C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${cur.x} ${cur.y}`;
    }

    pathEl.setAttribute("d", d);
    const L = Math.round(pathEl.getTotalLength() || 0);
    setPathLength(L);
  }, [experiences, hidePath]);

  // arrow follow animation
  useEffect(() => {
    const pathEl = svgRef.current;
    const arrowEl = arrowRef.current;
    if (!pathEl || !arrowEl) return;

    if (hidePath) {
      arrowEl.style.opacity = "0";
      return;
    }

    // find nearest path length for a node center
    function findLengthForNode(id: string): number {
      const target = nodeRefs.current[id];
      if (!target) return 0;
      const r = target.getBoundingClientRect();
      const tx = r.left + r.width / 2;
      const ty = r.top + r.height / 2;
      const L = pathEl!.getTotalLength();
      const samples = 300;
      let best = { dist: Infinity, t: 0 };
      for (let i = 0; i <= samples; i++) {
        const at = (i / samples) * L;
        const p = pathEl!.getPointAtLength(at);
        const dx = p.x - tx;
        const dy = p.y - ty;
        const d2 = dx * dx + dy * dy;
        if (d2 < best.dist) {
          best = { dist: d2, t: at };
        }
      }
      return best.t;
    }

    if (!openId) {
      arrowEl.style.opacity = "0";
      return;
    }

    const targetLen = findLengthForNode(openId);
    let start = performance.now();
    const duration = reducedVisuals ? 160 : 600;
    const startLen = parseFloat(arrowEl.dataset["pos"] || "0") || 0;

    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    function animate(now: number) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const curLen = startLen + (targetLen - startLen) * eased;
      const p = pathEl!.getPointAtLength(curLen);
      arrowEl!.style.transform = `translate(${p.x - 14}px, ${
        p.y - 14
      }px)`; // arrow 28x28
      arrowEl!.dataset["pos"] = String(curLen);
      arrowEl!.style.opacity = "1";

      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [openId, hidePath, reducedVisuals]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative">
      {/* SVG overlay (absolute) — hidden on small screens */}
      <svg
        className={`pointer-events-none absolute inset-0 z-10 ${
          hidePath ? "hidden" : ""
        }`}
        style={{ overflow: "visible" }}
        width="100%"
        height="100%"
      >
        <defs>
          <linearGradient id="pathGrad" x1="0" x2="1">
            <stop offset="0%" stopColor="rgba(6,246,255,0.14)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0.06)" />
          </linearGradient>
        </defs>

        <path
          ref={svgRef as any}
          stroke="url(#pathGrad)"
          strokeWidth={2}
          fill="none"
          strokeDasharray={reducedVisuals ? "0" : "6 8"}
          style={{
            filter: reducedVisuals
              ? "none"
              : "drop-shadow(0 6px 12px rgba(6,246,255,0.04))",
          }}
        />
      </svg>

      {/* arrow DOM element */}
      <div
        ref={arrowRef}
        style={{
          width: 28,
          height: 28,
          borderRadius: 999,
          background:
            "linear-gradient(180deg, rgba(6,246,255,0.95), rgba(59,130,246,0.95))",
          boxShadow: reducedVisuals
            ? "none"
            : "0 8px 20px rgba(6,246,255,0.12)",
          position: "fixed",
          left: 0,
          top: 0,
          transform: "translate(-9999px, -9999px)",
          opacity: 0,
          zIndex: 30,
          pointerEvents: "none",
        }}
        aria-hidden
      />

      {/* Nodes */}
      <div className="relative z-20 grid gap-10 md:gap-16">
        {experiences.map((ex, i) => {
          const side: "left" | "right" = i % 2 === 0 ? "left" : "right";
          return (
            <div
              key={ex.id}
              className={`flex ${
                side === "left" ? "justify-start" : "justify-end"
              } px-2 md:px-6`}
            >
              <div
                ref={(el) => {
                  nodeRefs.current[ex.id] = el;
                }}
                className="relative w-full max-w-[520px] md:max-w-[420px] lg:max-w-[480px]"
                onClick={() => onOpen(ex.id)}
              >
                {/* decorative neural node near card */}
                <div
                  className={`absolute ${
                    side === "left"
                      ? "-left-10 md:-left-16"
                      : "-right-10 md:-right-16"
                  } top-6 md:top-8 z-0`}
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    className="rounded-full"
                    style={{
                      width: 36,
                      height: 36,
                      boxShadow: reducedVisuals
                        ? "0 0 6px rgba(6,246,255,0.12)"
                        : "0 0 18px rgba(6,246,255,0.18), inset 0 0 8px rgba(255,255,255,0.02)",
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(6,246,255,0.98), rgba(0,0,0,0.06))",
                      border: "1px solid rgba(6,246,255,0.18)",
                      animation: reducedVisuals
                        ? undefined
                        : "pulseGlow 2.2s infinite",
                    }}
                    aria-hidden
                  />
                </div>

                {/* Experience card — props now match ExperienceCard's signature */}
                <ExperienceCard
                  exp={ex}
                  index={i}
                  onOpen={(e) => onOpen(e.id)}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* detail modal/panel */}
      <AnimatePresence>
        {openId && (
          <DetailPanel
            key="detail"
            experience={experiences.find((e) => e.id === openId)!}
            onClose={onClose}
            reducedVisuals={reducedVisuals}
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        @keyframes pulseGlow {
          0% {
            transform: scale(1);
            opacity: 0.9;
          }
          50% {
            transform: scale(1.18);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 0.9;
          }
        }

        @media (max-width: 640px) {
          svg {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

/* Detail sliding panel */
function DetailPanel({
  experience,
  onClose,
  reducedVisuals,
}: {
  experience: Experience;
  onClose: () => void;
  reducedVisuals: boolean;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-end justify-center p-4 md:items-center md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      style={{ background: "rgba(0,0,0,0.6)" }}
    >
      <motion.div
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 40, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: reducedVisuals ? 0.18 : 0.4 }}
        className="relative w-full max-w-4xl p-6 rounded-2xl md:p-8"
        style={{
          background:
            "linear-gradient(180deg, rgba(3,10,14,0.95), rgba(6,12,18,0.95))",
          border: "1px solid rgba(6,246,255,0.04)",
          boxShadow: reducedVisuals
            ? "none"
            : "0 30px 90px rgba(0,0,0,0.7)",
        }}
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div
            style={{ minHeight: 220 }}
            className="p-4 overflow-hidden border rounded border-cyan-400/6"
          >
            <div className="flex items-center justify-center w-full h-full">
              <Image
                src={
                  experience.avatar || "/work/avatar-placeholder.png"
                }
                alt="avatar"
                width={380}
                height={220}
                style={{ objectFit: "cover", borderRadius: 8 }}
              />
            </div>
          </div>

          <div className="text-cyan-200">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-cyan-300/60">
                  {experience.company}
                </div>
                <h3 className="text-2xl font-bold md:text-3xl text-cyan-100">
                  {/* FIX: Exp has only title, not role */}
                  {experience.title}
                </h3>
                <div className="mt-2 text-sm text-cyan-200/70">
                  {experience.period}
                </div>
              </div>

              <div>
                <button
                  onClick={onClose}
                  className="px-3 py-1 border rounded-md border-cyan-400/10 text-cyan-100/90"
                  type="button"
                >
                  Close
                </button>
              </div>
            </div>

            <p className="mt-6 leading-relaxed text-cyan-200/70">
              {experience.summary}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {(experience.skills || []).map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 text-xs border rounded-full border-cyan-400/8 bg-black/10"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-8">
              <div className="h-8 rounded bg-black/10" />
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
