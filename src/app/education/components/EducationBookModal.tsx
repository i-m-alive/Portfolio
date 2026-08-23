// src/app/education/components/EducationBookModal.tsx
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type Props = { onClose: () => void };
const PAGES = 7;

export default function EducationBookModal({ onClose }: Props) {
  const [leftIndex, setLeftIndex] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [fullImage, setFullImage] = useState<string | null>(null);
  const [coverOpened, setCoverOpened] = useState(false);
  const [flipDirection, setFlipDirection] = useState<"next" | "prev" | null>(null);

  // flip functions declared *before* keyboard effect so ESLint won't complain
  const maxLeft = PAGES - 1;

  const flipNext = useCallback(() => {
    if (isFlipping) return;
    if (leftIndex + 2 >= PAGES) return;
    setIsFlipping(true);
    setFlipDirection("next");
    // animation length
    setTimeout(() => {
      setLeftIndex((i) => Math.min(maxLeft, i + 2));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 560);
  }, [leftIndex, isFlipping]);

  const flipPrev = useCallback(() => {
    if (isFlipping) return;
    if (leftIndex - 2 < 0) return;
    setIsFlipping(true);
    setFlipDirection("prev");
    setTimeout(() => {
      setLeftIndex((i) => Math.max(0, i - 2));
      setIsFlipping(false);
      setFlipDirection(null);
    }, 560);
  }, [leftIndex, isFlipping]);

  // Run cover-open animation on mount
  useEffect(() => {
    setCoverOpened(false);
    const t = setTimeout(() => setCoverOpened(true), 220);
    return () => clearTimeout(t);
  }, []);

  // keyboard nav (declared after flipNext/flipPrev)
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "ArrowRight") flipNext();
      if (e.key === "ArrowLeft") flipPrev();
      if (e.key === "Escape") {
        if (fullImage) setFullImage(null);
        else onClose();
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipNext, flipPrev, fullImage, onClose]);

  // drag heuristics
  function handleDragEnd(info: { offset: { x: number }; velocity: { x: number } }, side: "left" | "right") {
    const { offset, velocity } = info;
    const vx = velocity.x;
    const dx = offset.x;
    const strong = Math.abs(vx) > 600 || Math.abs(dx) > 120;
    if (!strong) return;

    if (side === "right") {
      if (dx < 0 || vx < -400) flipNext();
      else if (dx > 0 || vx > 400) flipPrev();
    } else {
      if (dx > 0 || vx > 400) flipPrev();
      else if (dx < 0 || vx < -400) flipNext();
    }
  }

  // CONTENT helpers (smaller text on small screens)
  const headingClass = "text-lg md:text-xl font-bold text-cyan-100";
  const bodyClass = "mt-3 leading-relaxed text-cyan-200/70 text-sm md:text-base";
  const labelClass = "font-semibold text-cyan-100 text-sm md:text-sm";

  function leftPageContent(idx: number) {
    switch (idx) {
      case 0:
        return (
          <div className="flex flex-col items-center justify-center p-4 md:p-6">
            <div className="overflow-hidden border rounded-full w-28 h-28 md:w-40 md:h-40 border-cyan-300/18">
              <Image src="/education/profile.png" alt="Profile" width={480} height={480} style={{ objectFit: "cover" }} />
            </div>
            <div className="mt-3 text-base font-semibold text-center md:text-lg text-cyan-100">Kumar Shivraj Bhakat</div>
            <div className="mt-1 text-xs md:text-sm text-cyan-200/70">Nagpur, India</div>
          </div>
        );
      case 2:
        return (
          <div className="p-4 md:p-6">
            <h3 className={headingClass}>Introduction</h3>
            <p className={bodyClass}>
              I am Kumar Shivraj Bhakat, a Computer Science graduate specializing in AI &amp; ML, now working as an AI/ML Engineer.
              This book contains my educational records and a summary of my academic journey.
            </p>
          </div>
        );
      case 4:
        return (
          <div className="p-4 md:p-6">
            <h3 className={headingClass}>Chapter 2 — Advancement (12th Grade)</h3>
            <div className={bodyClass}>
              <p><span className={labelClass}>School:</span> Shirinbai Neterwala School</p>
              <p><span className={labelClass}>Board:</span> CBSE</p>
              <p><span className={labelClass}>Stream:</span> Physics, Chemistry, Mathematics</p>
              <p><span className={labelClass}>Year of pass out:</span> 2020</p>
              <p className="mt-2"><span className="font-bold text-cyan-200">Percentage Obtained:</span> <span className="ml-2 text-xl md:text-2xl text-cyan-100">92.2%</span></p>
            </div>

            <div className="mt-3">
              <div className="mb-2 text-xs md:text-sm text-cyan-200/60">Marks sheet preview (tap to enlarge)</div>
              <button
                onClick={() => setFullImage("/education/12th-marksheet.png")}
                className="w-full overflow-hidden border rounded-md border-cyan-400/8 bg-black/20"
                aria-label="Open 12th marksheet"
                type="button"
              >
                {/* make thumbnails use viewport-relative heights so they remain visible on small screens */}
                <div style={{ height: "min(22vh,160px)", position: "relative" }}>
                  <Image src="/education/12th-marksheet.png" alt="12th marksheet" fill style={{ objectFit: "contain" }} />
                </div>
              </button>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="p-4 md:p-6">
            <h3 className={headingClass}>Summary</h3>
            <p className={bodyClass}>
              Strong academic performance through secondary and higher secondary education, culminating in a B.Tech in CSE with a focus on AI &amp; ML.
            </p>
          </div>
        );
      default:
        return <div className="p-4 text-sm md:p-6 text-cyan-200">—</div>;
    }
  }

  function rightPageContent(idx: number) {
    switch (idx) {
      case 1:
        return (
          <div className="p-4 md:p-6">
            <h3 className={headingClass}>Table of Contents</h3>
            <ol className="mt-3 space-y-2 text-sm list-decimal list-inside md:text-base text-cyan-200/80">
              <li>Introduction</li>
              <li>Foundations — 10th Grade</li>
              <li>Advancement — 12th Grade</li>
              <li>Engineering — B.Tech CSE</li>
              <li>Summary</li>
            </ol>
          </div>
        );
      case 3:
        return (
          <div className="p-4 md:p-6">
            <h3 className={headingClass}>Chapter 1 — Foundations (10th Grade)</h3>
            <div className={bodyClass}>
              <p><span className={labelClass}>School:</span> Shirinbai Neterwala School</p>
              <p><span className={labelClass}>Board:</span> CBSE</p>
              <p><span className={labelClass}>Year of pass out:</span> 2018</p>
              <p className="mt-2"><span className="font-bold text-cyan-200">Percentage Obtained:</span> <span className="ml-2 text-xl md:text-2xl text-cyan-100">84.6%</span></p>
            </div>

            <div className="mt-3">
              <div className="mb-2 text-xs md:text-sm text-cyan-200/60">Marks sheet preview (tap to enlarge)</div>
              <button
                onClick={() => setFullImage("/education/10th-marksheet.png")}
                className="w-full overflow-hidden border rounded-md border-cyan-400/8 bg-black/20"
                aria-label="Open 10th marksheet"
                type="button"
              >
                <div style={{ height: "min(22vh,160px)", position: "relative" }}>
                  <Image src="/education/10th-marksheet.png" alt="10th marksheet" fill style={{ objectFit: "contain" }} />
                </div>
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="p-4 md:p-6">
            <h3 className={headingClass}>Chapter 3 — Engineering (B.Tech CSE)</h3>
            <div className={bodyClass}>
              <p><span className={labelClass}>University:</span> JAIN (Deemed-to-be University)</p>
              <p><span className={labelClass}>Degree:</span> B.Tech - Computer Science &amp; Engineering</p>
              <p><span className={labelClass}>Year of pass out:</span> 2025</p>
              <p className="mt-2"><span className="font-bold text-cyan-200">CGPA Obtained:</span> <span className="ml-2 text-xl md:text-2xl text-cyan-100">8.20</span></p>
            </div>

            <div className="mt-3">
              <div className="mb-2 text-xs md:text-sm text-cyan-200/60">Degree preview (tap to enlarge)</div>
              <button
                onClick={() => setFullImage("/education/degree-certificate.png")}
                className="w-full overflow-hidden border rounded-md border-cyan-400/8 bg-black/20"
                aria-label="Open degree certificate"
                type="button"
              >
                <div style={{ height: "min(22vh,160px)", position: "relative" }}>
                  <Image src="/education/degree-certificate.png" alt="degree certificate" fill style={{ objectFit: "contain" }} />
                </div>
              </button>
            </div>
          </div>
        );
      default:
        return <div className="p-4 text-sm md:p-6 text-cyan-200">—</div>;
    }
  }

  const rightIndex = Math.min(leftIndex + 1, PAGES - 1);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => {
          if (!isFlipping && !fullImage) onClose();
          else if (fullImage) setFullImage(null);
        }}
        style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.22 }}
          className="relative w-[95%] max-w-3xl rounded-2xl p-4 md:p-6"
          style={{ maxHeight: "92vh" }}
        >
          {/* header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-cyan-200/60">Shivraj's Education</div>
              <h2 className="text-xl font-bold md:text-2xl text-cyan-100">A Visual Education Book</h2>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-xs md:text-sm text-cyan-200/60">Spread {Math.floor(leftIndex / 2) + 1} of {Math.ceil(PAGES / 2)}</div>
              <button onClick={flipPrev} disabled={leftIndex <= 0 || isFlipping} className="px-2 py-1 text-xs border rounded-md md:px-3 md:py-1 border-cyan-400/10 text-cyan-100/90 disabled:opacity-40" type="button">← Prev</button>
              <button onClick={() => { if (!fullImage) onClose(); else setFullImage(null); }} className="px-2 py-1 text-xs border rounded-md md:px-3 md:py-1 border-cyan-400/10 text-cyan-100/90" type="button">{fullImage ? "Close Image" : "Close"}</button>
              <button onClick={flipNext} disabled={leftIndex + 2 >= PAGES || isFlipping} className="px-2 py-1 text-xs border rounded-md md:px-3 md:py-1 border-cyan-400/10 text-cyan-100/90 disabled:opacity-40" type="button">Next →</button>
            </div>
          </div>

          {/* Book container: responsive width + fixed aspect-ratio */}
          <div
            className="relative mx-auto rounded-lg"
            style={{
              width: "min(92vw, 760px)",
              aspectRatio: "3 / 2",
              maxHeight: "82vh",
              background: "linear-gradient(180deg, rgba(2,8,12,0.95), rgba(3,12,18,0.95))",
              border: "1px solid rgba(6,246,255,0.03)",
              padding: 12,
              boxShadow: "0 30px 120px rgba(0,0,0,0.7)",
              overflow: "hidden",
            }}
          >
            {/* hinge / spine visual (md+) */}
            <div className="absolute z-40 flex items-center justify-center w-10 -translate-x-1/2 pointer-events-none left-1/2 top-8 bottom-8">
              <motion.div initial={{ scaleY: 0.9, opacity: 0 }} animate={{ scaleY: coverOpened ? 1 : 0.9, opacity: coverOpened ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }} style={{ width: 10, height: "86%", borderRadius: 8, background: "linear-gradient(180deg,#1b2225,#071114)", boxShadow: "inset 0 2px 8px rgba(0,0,0,0.6)", border: "1px solid rgba(6,246,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }} className="relative hidden md:flex" />
            </div>

            {/* Cover peel (hidden on very small screens) */}
            <motion.div className="absolute inset-0 z-30 flex" initial={{ opacity: 1 }} animate={{ opacity: coverOpened ? 0 : 1 }} transition={{ duration: 0.18 }} style={{ pointerEvents: "none" }}>
              <motion.div className="hidden w-1/2 h-full rounded-l-md md:block" initial={{ rotateY: 0 }} animate={{ rotateY: coverOpened ? -170 : 0, opacity: coverOpened ? 0 : 1 }} transition={{ duration: 0.72, ease: "easeInOut" }} style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden", background: "linear-gradient(180deg,#071018,#021216)", borderRight: "1px solid rgba(6,246,255,0.03)", boxShadow: "0 22px 80px rgba(0,0,0,0.7)" }} />
              <motion.div className="w-1/2 h-full rounded-r-md" initial={{ opacity: 1 }} animate={{ opacity: coverOpened ? 0 : 1 }} transition={{ duration: 0.5 }} style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.02))", borderLeft: "1px solid rgba(6,246,255,0.02)" }} />
            </motion.div>

            {/* Inner spreads */}
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: coverOpened ? 1 : 0, scale: coverOpened ? 1 : 0.98 }} transition={{ delay: coverOpened ? 0.12 : 0, duration: 0.32 }} className="relative h-full">
              <div className="flex flex-row items-stretch h-full gap-3">
                {/* LEFT PAGE */}
                <div className="relative flex-shrink-0 w-1/2 min-w-0 overflow-auto border rounded-md border-cyan-400/6 bg-black/20" style={{ transformStyle: "preserve-3d" }}>
                  <div className="p-3 md:p-4">{leftPageContent(leftIndex)}</div>

                  <motion.div drag="x" dragConstraints={{ left: -80, right: 80 }} onDragEnd={(e, info) => handleDragEnd(info, "left")} className="absolute inset-y-0 left-0 w-1/2 bg-transparent" />
                </div>

                {/* SPINE for md */}
                <div className="relative items-center justify-center hidden w-10 rounded-md md:flex" style={{ borderLeft: "1px solid rgba(6,246,255,0.03)", borderRight: "1px solid rgba(6,246,255,0.03)", background: "linear-gradient(90deg, rgba(0,0,0,0.04), rgba(6,246,255,0.01))" }}>
                  <div style={{ width: 1.5, height: "64%", background: "rgba(6,246,255,0.02)", borderRadius: 2 }} />
                </div>

                {/* RIGHT PAGE */}
                <div className="relative flex-shrink-0 w-1/2 min-w-0 overflow-auto border rounded-md border-cyan-400/6 bg-black/20" style={{ perspective: 1200 }}>
                  <div className="p-3 md:p-4">{rightPageContent(rightIndex)}</div>

                  {/* overlay flip: pointer-events enabled only on md+ to avoid overlay/white artifact on small screens */}
                  <motion.div className="absolute inset-0 overflow-hidden origin-left rounded-md pointer-events-none md:pointer-events-auto" style={{ transformStyle: "preserve-3d", zIndex: 20 }} key={`${leftIndex}-${flipDirection || "idle"}`} initial={{ rotateY: flipDirection === "prev" ? -180 : 0 }} animate={{ rotateY: flipDirection === "next" ? -180 : (flipDirection === "prev" ? 0 : 0) }} transition={{ duration: 0.56, ease: [0.2, 0.85, 0.25, 1] }} onClick={() => { if (!isFlipping && leftIndex + 2 < PAGES) flipNext(); }} drag="x" dragConstraints={{ left: -120, right: 120 }} onDragEnd={(e, info) => handleDragEnd(info, "right")}>
                    {/* FRONT FACE (only shown on md to avoid small-screen conflict) */}
                    <div className="absolute inset-0 hidden p-4 md:block" style={{ backfaceVisibility: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", background: "linear-gradient(180deg,#071018,#061014)" }}>
                      <div className="relative w-full h-full">
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(120deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0) 25%, rgba(0,0,0,0.06) 60%)" }} />
                        {rightPageContent(rightIndex)}
                        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 12, pointerEvents: "none", background: "linear-gradient(90deg, rgba(0,0,0,0.18), rgba(0,0,0,0))" }} />
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div className="absolute inset-0 hidden p-4 md:block" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.65)", background: "linear-gradient(180deg,#071018,#061014)" }}>
                      <div className="relative w-full h-full">
                        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(60deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.00) 25%, rgba(0,0,0,0.06) 60%)" }} />
                        <div style={{ width: "100%", height: "100%" }}>{rightPageContent(Math.min(rightIndex + 1, PAGES - 1))}</div>
                        <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: 12, pointerEvents: "none", background: "linear-gradient(270deg, rgba(0,0,0,0.28), rgba(0,0,0,0))" }} />
                      </div>
                    </div>
                  </motion.div>

                  {/* clickable overlay always active but prevents focus issues */}
                  <button
                    onClick={(e) => { if (!isFlipping && leftIndex + 2 < PAGES) flipNext(); (e.currentTarget as HTMLButtonElement).blur(); }}
                    onMouseDown={(e) => e.preventDefault()}
                    onTouchStart={(e) => e.preventDefault()}
                    type="button"
                    tabIndex={-1}
                    aria-label="Next page"
                    className="absolute inset-y-0 right-0 w-1/2 bg-transparent focus:outline-none"
                    style={{ cursor: leftIndex + 2 >= PAGES ? "not-allowed" : "pointer", outline: "none", border: "none" }}
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* small page indicator */}
          <div className="mt-3 text-xs text-center md:text-sm text-cyan-200/60">Left page: {leftIndex + 1} — Right page: {rightIndex + 1}</div>
        </motion.div>

        {/* Full-screen image viewer (constrained) */}
        <AnimatePresence>
          {fullImage && (
            <motion.div className="fixed inset-0 z-[100] flex items-center justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setFullImage(null)} style={{ background: "rgba(0,0,0,0.9)" }}>
              <motion.div onClick={(e) => e.stopPropagation()} initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.98, opacity: 0 }} className="relative w-[92%] max-w-3xl rounded-lg overflow-hidden" style={{ maxHeight: "90vh" }}>
                <div className="absolute z-20 top-3 right-3">
                  <button onClick={() => setFullImage(null)} className="px-3 py-1 border rounded-md border-cyan-400/20 text-cyan-100/90 bg-black/30" type="button">Close</button>
                </div>

                <div className="relative flex items-center justify-center w-full h-full p-4 bg-black/90" style={{ minHeight: "56vh" }}>
                  <Image src={fullImage} alt="document" fill style={{ objectFit: "contain" }} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}
