// src/app/education/components/CenterBook.tsx
"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen } from "lucide-react";

/**
 * The closed book that opens the education modal.
 *
 * Built as an actual 3D object — cover, spine, fore-edge page stack — so the
 * hover state can crack the cover open and telegraph what clicking does. The
 * previous version put an infinite `animate` keyframe loop and a `whileHover`
 * scale on the same element (framer resolves that by letting the loop win, so
 * hover barely registered) and rotated on Y with no ancestor perspective, which
 * renders as a flat horizontal squash rather than a rotation.
 */
export default function CenterBook({ onOpen }: { onOpen: () => void }) {
  const reduceMotion = useReducedMotion() ?? false;

  return (
    <div
      className="relative"
      style={{ perspective: 1400, perspectiveOrigin: "50% 45%" }}
    >
      {/* ground shadow */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 left-1/2 h-10 w-[70%] -translate-x-1/2 rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.75), rgba(0,0,0,0) 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* idle float lives on its own wrapper so it cannot fight the hover state */}
      <motion.div
        animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
        transition={
          reduceMotion
            ? undefined
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <motion.button
          type="button"
          onClick={onOpen}
          aria-label="Open Shivraj's education book"
          initial={
            reduceMotion ? { opacity: 0 } : { opacity: 0, rotateY: -22, y: 18 }
          }
          animate={
            reduceMotion ? { opacity: 1 } : { opacity: 1, rotateY: -14, y: 0 }
          }
          transition={{ duration: 0.8, ease: [0.32, 0.72, 0.28, 1] }}
          whileHover={reduceMotion ? undefined : { rotateY: -6, scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.985 }}
          className="relative block h-[420px] w-[300px] cursor-pointer select-none rounded-r-md sm:h-[500px] sm:w-[360px] md:h-[540px] md:w-[400px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* aura */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none -inset-10"
            style={{
              background:
                "radial-gradient(circle at 45% 40%, rgba(6,246,255,0.12), rgba(6,246,255,0) 62%)",
              filter: "blur(24px)",
            }}
          />

          {/* first page, revealed as the cover cracks open on hover */}
          <div
            aria-hidden="true"
            className="absolute inset-y-2 left-4 right-1 rounded-r-md"
            style={{
              background:
                "linear-gradient(120deg, rgba(16,38,48,0.98), rgba(5,16,22,1))",
              border: "1px solid rgba(6,246,255,0.10)",
              transform: "translateZ(-6px)",
            }}
          />

          {/* fore-edge: the stack of pages */}
          <div
            aria-hidden="true"
            className="absolute inset-y-3 right-0 w-2.5 rounded-r-sm"
            style={{
              background:
                "repeating-linear-gradient(180deg, rgba(190,225,235,0.30) 0 1px, rgba(6,20,28,0.85) 1px 3px)",
              boxShadow: "inset -2px 0 6px rgba(0,0,0,0.7)",
            }}
          />

          {/* front cover — hinged at the spine */}
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-r-md"
            whileHover={reduceMotion ? undefined : { rotateY: -17 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0.28, 1] }}
            style={{
              transformOrigin: "left center",
              transformStyle: "preserve-3d",
              background:
                "linear-gradient(135deg, #0b2530 0%, #061620 45%, #030d13 100%)",
              border: "1px solid rgba(6,246,255,0.14)",
              boxShadow:
                "0 40px 90px rgba(0,0,0,0.85), inset 0 1px 0 rgba(6,246,255,0.10)",
            }}
          >
            {/* spine */}
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-7"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0.85), rgba(6,246,255,0.06) 55%, rgba(0,0,0,0.45))",
                borderRight: "1px solid rgba(6,246,255,0.10)",
              }}
            />

            {/* embossed border */}
            <div
              aria-hidden="true"
              className="absolute rounded-sm inset-x-10 inset-y-8"
              style={{ border: "1px solid rgba(6,246,255,0.13)" }}
            />

            {/* cover type */}
            <div className="relative flex flex-col items-center justify-center h-full px-12 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-cyan-300/55">
                Shivraj&rsquo;s
              </p>
              <h2 className="mt-3 text-3xl font-extrabold leading-none tracking-tight md:text-4xl text-cyan-100">
                Education
              </h2>

              <div
                aria-hidden="true"
                className="w-12 h-px mt-5 bg-cyan-300/30"
              />

              <p className="mt-5 text-[12px] leading-relaxed text-cyan-200/50">
                Chapters, marksheets and the degree — bound as one volume.
              </p>

              <span className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200/85">
                <BookOpen size={12} aria-hidden="true" />
                Open the book
              </span>
            </div>

            {/* sheen */}
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(115deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 38%)",
              }}
            />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}
