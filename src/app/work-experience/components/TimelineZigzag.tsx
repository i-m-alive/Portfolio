// src/app/education/components/TimelineZigzag.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import NeuralBackdrop from "./NeuralBackdrop";
import ExperienceCard from "./ExperienceCard";
import type { Exp } from "./ExperienceModalParallax"; // <-- FIX: import Exp from ExperienceModalParallax
import { motion } from "framer-motion";

type AnchorRect = {
  cx: number;
  cy: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  width: number;
  height: number;
};

export default function TimelineZigzag({
  experiences = [],
  onOpen,
}: {
  experiences?: Exp[];
  onOpen?: (e: Exp) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [anchorRects, setAnchorRects] = useState<Record<string, AnchorRect>>({});

  useEffect(() => {
    function updateRects() {
      const container = containerRef.current;
      if (!container) return;
      const cRect = container.getBoundingClientRect();

      const next: Record<string, AnchorRect> = {};
      experiences.forEach((exp) => {
        const el = container.querySelector(
          `[data-anchor="${exp.id}"]`
        ) as HTMLElement | null;
        if (!el) return;
        const r = el.getBoundingClientRect();
        next[exp.id] = {
          cx: r.left + r.width / 2 - cRect.left,
          cy: r.top + r.height / 2 - cRect.top,
          left: r.left - cRect.left,
          right: r.left + r.width - cRect.left,
          top: r.top - cRect.top,
          bottom: r.top + r.height - cRect.top,
          width: r.width,
          height: r.height,
        };
      });

      setAnchorRects((prev) => {
        const k1 = Object.keys(prev).sort().join(",");
        const k2 = Object.keys(next).sort().join(",");
        if (k1 !== k2) return next;
        for (const k of Object.keys(next)) {
          const a = prev[k];
          const b = next[k];
          if (!a) return next;
          if (Math.abs(a.cx - b.cx) > 2 || Math.abs(a.cy - b.cy) > 2) return next;
        }
        return prev;
      });
    }

    updateRects();
    const onResize = () => updateRects();
    window.addEventListener("resize", onResize);

    const int = setInterval(updateRects, 700);

    let observer: MutationObserver | null = null;
    if (containerRef.current && typeof MutationObserver !== "undefined") {
      observer = new MutationObserver(() => updateRects());
      observer.observe(containerRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
      });
    }

    return () => {
      window.removeEventListener("resize", onResize);
      clearInterval(int);
      if (observer) observer.disconnect();
    };
  }, [experiences]);

  function buildSpinePath(): string {
    const ids = experiences.map((e) => e.id).filter((id) => anchorRects[id]);
    if (ids.length < 2) return "";
    const pts = ids.map((id) => ({
      x: anchorRects[id].cx,
      y: anchorRects[id].cy,
    }));

    const d: string[] = [];
    d.push(`M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`);
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] ?? pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] ?? p2;
      const t = 0.5;
      const c1x = p1.x + ((p2.x - p0.x) * t) / 3;
      const c1y = p1.y + ((p2.y - p0.y) * t) / 3;
      const c2x = p2.x - ((p3.x - p1.x) * t) / 3;
      const c2y = p2.y - ((p3.y - p1.y) * t) / 3;
      d.push(
        `C ${c1x.toFixed(1)} ${c1y.toFixed(
          1
        )}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2.x.toFixed(
          1
        )} ${p2.y.toFixed(1)}`
      );
    }
    return d.join(" ");
  }

  const spineD = buildSpinePath();
  const idsOrdered = experiences
    .map((e) => e.id)
    .filter((id) => anchorRects[id]);
  const showSpine = Boolean(spineD);

  return (
    <section className="relative w-full" aria-label="Zig-zag timeline section">
      <div
        ref={containerRef}
        className="relative z-10 w-full px-6 py-6 md:py-12"
      >
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-col gap-12">
            {experiences.map((exp, idx) => {
              const left = idx % 2 === 0;
              const delay = 0.12 * idx;

              return (
                // make the card layer above the spine overlay to avoid overlay dots covering card content
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.22 }}
                  transition={{
                    duration: 0.62,
                    ease: [0.2, 0.8, 0.2, 1],
                    delay,
                  }}
                  className="relative z-30 w-full"
                  data-anchor={exp.id}
                >
                  <div
                    className={`flex ${
                      left ? "justify-start" : "justify-end"
                    } items-center`}
                  >
                    <div
                      className={`w-full md:w-[55%] ${
                        left ? "md:pl-6" : "md:pr-6"
                      }`}
                    >
                      <ExperienceCard
                        exp={exp}
                        index={idx}
                        onOpen={(e) => onOpen?.(e)}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* overlay uses anchorRects computed from the containerRef above */}
      {showSpine && (
        // lower z so cards (z-30) visually sit *above* these nodes
        <svg
          className="absolute inset-0 z-10 w-full h-full pointer-events-none"
          aria-hidden
        >
          <defs>
            <linearGradient id="zzNg" x1="0" x2="1">
              <stop offset="0%" stopColor="#00fff0" stopOpacity="0.12" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#00f6ff" stopOpacity="0.12" />
            </linearGradient>

            <filter id="zzSoft" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <radialGradient id="zzNodeGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#66fff2" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#06f6ff" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#06f6ff" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* soft main glow path */}
          <path
            d={spineD}
            stroke="rgba(6,246,255,0.08)"
            strokeWidth={8}
            fill="none"
            strokeLinecap="round"
            style={{ filter: "url(#zzSoft)" }}
          />

          {/* animated spine line */}
          <path
            d={spineD}
            stroke="url(#zzNg)"
            strokeWidth={2.6}
            strokeLinecap="round"
            fill="none"
            strokeDasharray="1200"
            strokeDashoffset="1200"
            style={{ animation: "zzSpineDash 10s linear infinite" }}
          />

          <style>{`
            @keyframes zzSpineDash {
              0% { stroke-dashoffset: 1200; opacity: 0.08; }
              50% { stroke-dashoffset: 0; opacity: 1; }
              100% { stroke-dashoffset: -1200; opacity: 0.08; }
            }
          `}</style>

          {idsOrdered.map((id, idx) => {
            const rect = anchorRects[id];
            if (!rect) return null;
            const leftCard = idx % 2 === 0;
            const sx = rect.cx;
            const sy = rect.cy;
            const cardEdgeX = leftCard ? rect.right : rect.left;
            const cardEdgeY = rect.top + rect.height / 2;
            const midX = (sx + cardEdgeX) / 2;
            const midY = sy - 26;

            // slightly smaller nodes and softer glow
            const nodeR = 4 + (idx % 3 === 0 ? 0.8 : 0);

            return (
              <g key={id}>
                {/* connector from spine to card edge */}
                <path
                  d={`M ${sx.toFixed(1)} ${sy.toFixed(
                    1
                  )} Q ${midX.toFixed(1)} ${midY.toFixed(
                    1
                  )}, ${cardEdgeX.toFixed(1)} ${cardEdgeY.toFixed(1)}`}
                  stroke="rgba(6,246,255,0.06)"
                  strokeWidth={1.6}
                  fill="none"
                  strokeDasharray="6 6"
                />

                {/* glow halo */}
                <circle
                  cx={sx}
                  cy={sy}
                  r={nodeR * 2.2}
                  fill="url(#zzNodeGlow)"
                  opacity={0.18}
                />

                {/* core node */}
                <circle
                  cx={sx}
                  cy={sy}
                  r={nodeR}
                  fill="#06f6ff"
                  stroke="#08f6ff"
                  strokeWidth={1.0}
                  style={{ filter: "url(#zzSoft)" }}
                />

                {/* tiny node at card edge */}
                <circle
                  cx={cardEdgeX}
                  cy={cardEdgeY}
                  r={2.0}
                  fill="rgba(6,246,255,0.12)"
                />
              </g>
            );
          })}
        </svg>
      )}
    </section>
  );
}
