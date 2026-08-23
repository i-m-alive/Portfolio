// src/app/skills/page.tsx
"use client";

import React, { useMemo, useState, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import Categories from "./hud/Categories";
import LeftPanel from "./hud/LeftPanel";
import TopRightPanel from "./hud/TopRightPanel";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "./skillsData";
import DynamicCosmic from "@/app/components/DynamicCosmic";

export default function SkillsHUDPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  // header fixed
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState<number>(72);
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const resize = () => setHeaderHeight(Math.max(56, Math.round(el.getBoundingClientRect().height)));
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const categories = useMemo(() => CATEGORIES.map((c) => ({ id: c.id, label: c.label, icon: c.icon })), []);
  const selectedCategory = useMemo(() => CATEGORIES.find((c) => c.id === selected) ?? null, [selected]);

  // center video wrapper ref so we can pass width/height as fallback
  const videoRef = useRef<HTMLDivElement | null>(null);
  const [videoSize, setVideoSize] = useState({ width: 640, height: 680 });
  useLayoutEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setVideoSize({ width: Math.round(r.width), height: Math.round(r.height) });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  // small tuning values used by Categories
  const frameHalf = Math.round(videoSize.width / 2);

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white">
      {/* The visible title bar shows the site owner's name, not this page's
          subject, so the page heading is provided for AT and search engines. */}
      <h1 className="sr-only">Skills</h1>

      {/* background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <DynamicCosmic />
      </div>

      {/* header fixed */}
      <div ref={headerRef} className="fixed z-50 transform -translate-x-1/2 left-1/2 top-6">
        <div
          className="px-6 py-2 font-extrabold text-center rounded-tl-xl rounded-tr-xl text-cyan-50"
          style={{
            background: "linear-gradient(90deg, rgba(3,43,46,0.85), rgba(2,30,40,0.55))",
            border: "1px solid rgba(34,203,255,0.28)",
            boxShadow: "0 8px 40px rgba(0,200,255,0.06)",
            pointerEvents: "none",
          }}
        >
          <span style={{ letterSpacing: 1 }}>Kumar Shivraj Bhakat</span>
        </div>
      </div>

      {/* main content */}
      <div className="relative z-10 px-6" style={{ paddingTop: headerHeight + 18 }}>
        <div className="mx-auto max-w-7xl">
          <div className="grid items-start grid-cols-1 gap-6 lg:grid-cols-12">
            {/* LEFT side panel */}
            <div className="col-span-1 lg:col-span-3">
              <LeftPanel category={selectedCategory} onClose={() => setSelected(null)} />
            </div>

            {/* CENTER (we will center the inner wrapper explicitly to viewport center) */}
            <div className="relative flex items-start justify-center col-span-1 lg:col-span-6">
              {/* center wrapper is positioned centrally in the viewport using left:50% + translateX(-50%) */}
              <div
                style={{
                  position: "relative",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "min(1200px, 100vw)",
                  maxWidth: "120vw",
                }}
                className="flex flex-col items-center"
              >
                {/* VIDEO WRAPPER */}
                <div
                  ref={videoRef}
                  className="relative mx-auto overflow-hidden rounded-xl"
                  style={{
                    width: "100%",
                    height: "min(760px, 68vh)",
                    maxHeight: "78vh",
                    background: "rgba(0,0,0,0.12)",
                    border: "1px solid rgba(6,200,255,0.06)",
                  }}
                  onContextMenu={(e) => e.preventDefault()}
                >
                  <video
                    src="/center-loop.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "50% 50%",
                      // subtle left-right crop mask so hologram remains centered visually
                      WebkitMaskImage:
                        "linear-gradient(to right, transparent 6%, black 18%, black 82%, transparent 94%)",
                      maskImage:
                        "linear-gradient(to right, transparent 6%, black 18%, black 82%, transparent 94%)",
                    }}
                    className="pointer-events-none select-none"
                  />
                </div>

                {/* Connect button directly below video (in flow) */}
                <div className="flex justify-center w-full mt-5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => router.push("/contact")}
                    className="relative px-10 py-3 font-semibold rounded-2xl text-cyan-100"
                    style={{
                      background: "linear-gradient(180deg, rgba(2,12,18,0.85), rgba(0,0,0,0.45))",
                      border: "1px solid rgba(6,200,255,0.22)",
                      boxShadow: "0 12px 42px rgba(6,200,255,0.10), inset 0 -8px 24px rgba(6,200,255,0.03)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    Connect
                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        left: -14,
                        right: -14,
                        bottom: -12,
                        height: 12,
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        background: "linear-gradient(90deg,#06f6ff,#0ea5ff)",
                        opacity: 0.12,
                        pointerEvents: "none",
                      }}
                    />
                  </motion.button>
                </div>

                {/* Categories overlay positioned relative to this centered wrapper */}
                <div className="absolute inset-0 pointer-events-none">
                  <Categories
                    categories={categories}
                    onSelect={(id) => setSelected(id)}
                    videoWidth={videoSize.width}
                    videoHeight={videoSize.height}
                    sideGap={28}
                    itemHeight={88}
                    frameHalf={frameHalf}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-span-1 lg:col-span-3">
              <TopRightPanel />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
