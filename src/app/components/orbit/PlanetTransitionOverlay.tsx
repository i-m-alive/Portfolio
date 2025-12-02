// src/app/components/orbit/PlanetTransitionOverlay.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

/**
 * PlanetTransitionOverlay (navigation-starts-immediately-on-lottie)
 *
 * Behavior:
 *  - move to center -> expand -> start lottie phase
 *  - WHEN lottie phase starts we immediately call router.push (so navigation begins)
 *  - overlay remains until destination fires `window.dispatchEvent(new CustomEvent('page-rendered'))`
 *    or until MAX_WAIT_FOR_RENDERED fallback expires
 *
 * Requirements:
 *  - public/Rocket.json available at /Rocket.json
 *  - (optional) lottie-web installed; but failure to import will degrade gracefully
 */

type Detail = {
  id?: string;
  cx?: number;
  cy?: number;
  r?: number;
  goto?: string;
  label?: string;
  theme?: string;
  xPerc?: number;
  yPerc?: number;
  imgSrc?: string | null;
};

const MOVE_DUR = 700;
const EXPAND_DUR = 700;
const ZOOM_TO_LOTTIE_DELAY = 120;
const MAX_WAIT_FOR_RENDERED = 16000;
const LOTTIE_SHORT_FALLBACK = 1400;

function clampNum(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function PlanetTransitionOverlay() {
  const router = useRouter();

  // state
  const [active, setActive] = useState(false);
  const [meta, setMeta] = useState<Detail | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "move" | "expand" | "lottie">(
    "idle"
  );

  // refs for timers + lottie + nav-start flag
  const moveTimerRef = useRef<number | null>(null);
  const expandTimerRef = useRef<number | null>(null);
  const maxWaitRef = useRef<number | null>(null);
  const fallbackTimerRef = useRef<number | null>(null);
  const lottiePlayerRef = useRef<any>(null);
  const lottieContainerRef = useRef<HTMLDivElement | null>(null);
  const navStartedRef = useRef(false);

  function clearAllTimers() {
    if (moveTimerRef.current !== null) window.clearTimeout(moveTimerRef.current);
    if (expandTimerRef.current !== null)
      window.clearTimeout(expandTimerRef.current);
    if (maxWaitRef.current !== null) window.clearTimeout(maxWaitRef.current);
    if (fallbackTimerRef.current !== null)
      window.clearTimeout(fallbackTimerRef.current);
    moveTimerRef.current =
      expandTimerRef.current =
      maxWaitRef.current =
      fallbackTimerRef.current =
        null;
  }

  function cleanup() {
    clearAllTimers();
    try {
      lottiePlayerRef.current?.destroy?.();
    } catch {
      // ignore
    }
    lottiePlayerRef.current = null;
    navStartedRef.current = false;
    setPhase("idle");
    setActive(false);
    setMeta(null);
    setImgSrc(null);
  }

  // find profile image in DOM if needed
  function findProfileImageSrc(): string | null {
    try {
      const el = document.getElementById("profile-inner");
      if (el) {
        const img = el.querySelector("img");
        if (img && img.src) return img.src;
      }
      const imgs = Array.from(document.querySelectorAll("img"));
      const cand = imgs.find((i) =>
        (i.src || "").toLowerCase().includes("profile")
      );
      if (cand?.src) return cand.src;
    } catch {
      // ignore
    }
    return null;
  }

  // Incoming event -> start timeline: move -> expand -> lottie (and trigger navigation on lottie)
  useEffect(() => {
    const onTransition = (event: Event) => {
      const ev = event as CustomEvent<Detail>;
      const d = ev?.detail ?? {};
      const vw = window.innerWidth;
      const vh = window.innerHeight;

      // robust coords resolution
      let cx = typeof d.cx === "number" ? d.cx : undefined;
      let cy = typeof d.cy === "number" ? d.cy : undefined;
      if (
        (typeof cx !== "number" || typeof cy !== "number") &&
        typeof d.xPerc === "number"
      ) {
        cx = (d.xPerc / 100) * vw;
        cy = ((d.yPerc ?? 50) / 100) * vh;
      }
      if (typeof cx !== "number" || typeof cy !== "number") {
        cx = Math.round(vw / 2);
        cy = Math.round(vh / 2);
      }

      const r = Math.max(8, d.r ?? 24);
      const detail: Detail = { ...d, cx, cy, r };

      // image selection fallback
      let chosen = d.imgSrc ?? null;
      if (!chosen && d.id === "profile") {
        const f = findProfileImageSrc();
        if (f) chosen = f;
      }

      // reset any previous timeline
      clearAllTimers();
      navStartedRef.current = false;

      setImgSrc(chosen);
      setMeta(detail);
      setActive(true);
      setPhase("move");

      // prefetch if available
      if (detail.goto && typeof (router as any)?.prefetch === "function") {
        try {
          (router as any).prefetch(detail.goto);
        } catch {
          // ignore
        }
      }

      // timeline: move -> expand -> lottie
      moveTimerRef.current = window.setTimeout(() => {
        setPhase("expand");

        expandTimerRef.current = window.setTimeout(() => {
          setPhase("lottie");

          // start navigation immediately when we enter lottie phase (so router begins loading)
          if (detail.goto && !navStartedRef.current) {
            try {
              navStartedRef.current = true;
              void router.push(detail.goto);
            } catch {
              try {
                window.location.href = detail.goto ?? "/";
              } catch {
                // ignore
              }
            }
          }

          // ultimate fallback if destination never dispatches page-rendered
          if (maxWaitRef.current !== null)
            window.clearTimeout(maxWaitRef.current);
          maxWaitRef.current = window.setTimeout(() => {
            cleanup();
          }, MAX_WAIT_FOR_RENDERED);
        }, EXPAND_DUR + ZOOM_TO_LOTTIE_DELAY);
      }, MOVE_DUR);
    };

    window.addEventListener("planet-transition", onTransition);
    return () => {
      window.removeEventListener("planet-transition", onTransition);
      clearAllTimers();
    };
  }, [router]);

  // destination page will dispatch `page-rendered` when it's ready — hide overlay then
  useEffect(() => {
    const onPageRendered = () => {
      clearAllTimers();
      try {
        lottiePlayerRef.current?.destroy?.();
      } catch {
        // ignore
      }
      lottiePlayerRef.current = null;
      navStartedRef.current = false;

      // small smoothing buffer
      window.setTimeout(() => {
        setPhase("idle");
        setActive(false);
        setMeta(null);
        setImgSrc(null);
      }, 140);
    };

    window.addEventListener("page-rendered", onPageRendered);
    return () => window.removeEventListener("page-rendered", onPageRendered);
  }, []);

  // Start Lottie when phase becomes "lottie"
  useEffect(() => {
    if (phase !== "lottie" || !meta) return;
    let mounted = true;
    let started = false;

    (async () => {
      // load animation JSON from public folder
      let animData: any = null;
      try {
        const resp = await fetch("/Rocket.json", { cache: "no-store" });
        if (resp.ok) animData = await resp.json();
      } catch {
        animData = null;
      }
      if (!animData || !mounted) return;

      try {
        const lottieLib = await import("lottie-web");
        const lottie: any = (lottieLib as any).default ?? lottieLib;
        const container = lottieContainerRef.current;
        if (!container) return;

        // destroy any previous instance
        try {
          lottiePlayerRef.current?.destroy?.();
        } catch {
          // ignore
        }

        lottiePlayerRef.current = lottie.loadAnimation({
          container,
          renderer: "svg",
          autoplay: true,
          loop: false,
          animationData: animData,
          rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
        });

        started = true;

        // when animation completes, set a short fallback cleanup (but still we rely on page-rendered)
        lottiePlayerRef.current?.addEventListener?.("complete", () => {
          if (fallbackTimerRef.current !== null) {
            window.clearTimeout(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
          }
          // small delayed cleanup so user sees final frame (unless page-rendered triggers earlier)
          fallbackTimerRef.current = window.setTimeout(() => {
            cleanup();
          }, 1200);
        });

        // small additional fallback (in case complete not fired)
        if (fallbackTimerRef.current !== null)
          window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = window.setTimeout(() => {
          cleanup();
        }, LOTTIE_SHORT_FALLBACK + 1600);
      } catch {
        // if lottie import fails, overlay still waits for page-rendered or MAX_WAIT_FOR_RENDERED
      }
    })();

    return () => {
      mounted = false;
      if (started) {
        try {
          lottiePlayerRef.current?.destroy?.();
        } catch {
          // ignore
        }
        lottiePlayerRef.current = null;
      }
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    };
  }, [phase, meta]);

  if (!active || !meta) return null;

  // client-only geometry
  const vw =
    typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh =
    typeof window !== "undefined" ? window.innerHeight : 800;
  const cx = clampNum(meta.cx ?? Math.round(vw / 2), 0, vw);
  const cy = clampNum(meta.cy ?? Math.round(vh / 2), 0, vh);
  const initDiameter = (meta.r ?? 24) * 2;
  const ENLARGED_MULTIPLIER = 3.2;
  const enlargedDiameter = initDiameter * ENLARGED_MULTIPLIER;
  const centerX = vw / 2;
  const centerY = vh / 2;

  function computeRevealScale(currentMeta: Detail | null) {
    if (!currentMeta) return 1;
    const maxX = Math.max(cx, vw - cx);
    const maxY = Math.max(cy, vh - cy);
    const dist = Math.sqrt(maxX * maxX + maxY * maxY);
    const finalR = dist + 32;
    const baseR = Math.max(8, currentMeta.r ?? 24);
    return Math.max(1, finalR / baseR);
  }

  const motionInitial = {
    width: initDiameter,
    height: initDiameter,
    left: cx - initDiameter / 2,
    top: cy - initDiameter / 2,
    borderRadius: "50%",
    opacity: 1,
  };

  const motionMove = {
    left: centerX - initDiameter / 2,
    top: centerY - initDiameter / 2,
    width: initDiameter,
    height: initDiameter,
    borderRadius: "50%",
    transition: { duration: MOVE_DUR / 1000 },
  };

  const motionExpand = {
    left: centerX - enlargedDiameter / 2,
    top: centerY - enlargedDiameter / 2,
    width: enlargedDiameter,
    height: enlargedDiameter,
    borderRadius: 20,
    transition: { duration: EXPAND_DUR / 1000 },
  };

  const motionHiddenDuringLottie = {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.28 },
  };

  const blurVisible =
    phase === "move" || phase === "expand" || phase === "lottie";

  return (
    <AnimatePresence>
      {active && meta ? (
        <div
          className="planet-transition-root fixed inset-0 z-[9999]"
          style={{ pointerEvents: "none" }}
          aria-hidden
        >
          {/* blur/dim backdrop */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{
              opacity: blurVisible ? 0.64 : 0,
              backdropFilter: blurVisible ? "blur(8px)" : "blur(0px)",
            }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9990,
              background: "rgba(2,6,10,0.28)",
              WebkitBackdropFilter: blurVisible
                ? "blur(8px)"
                : "blur(0px)",
              backdropFilter: blurVisible ? "blur(8px)" : "blur(0px)",
              pointerEvents: "none",
            }}
          />

          {/* zoom element (planet/profile) */}
          <motion.div
            initial={motionInitial}
            animate={
              phase === "move"
                ? motionMove
                : phase === "expand"
                ? motionExpand
                : phase === "lottie"
                ? { ...motionExpand, ...motionHiddenDuringLottie }
                : motionInitial
            }
            exit={{ opacity: 0 }}
            style={{
              position: "absolute",
              zIndex: 10010,
              overflow: "hidden",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 40px 140px rgba(0,0,0,0.6)",
              background:
                imgSrc == null
                  ? "radial-gradient(circle at 30% 30%, rgba(36,198,180,0.08), rgba(7,10,14,0.96))"
                  : "transparent",
            }}
          >
            {imgSrc ? (
              <motion.img
                src={imgSrc}
                alt={meta.label ?? "planet"}
                initial={{ width: initDiameter, height: initDiameter }}
                animate={
                  phase === "move"
                    ? {
                        width: initDiameter,
                        height: initDiameter,
                        transition: { duration: MOVE_DUR / 1000 },
                      }
                    : phase === "expand"
                    ? {
                        width: enlargedDiameter,
                        height: enlargedDiameter,
                        transition: { duration: EXPAND_DUR / 1000 },
                      }
                    : {
                        width: enlargedDiameter,
                        height: enlargedDiameter,
                        opacity: 0,
                        transition: { duration: 0.28 },
                      }
                }
                style={{
                  display: "block",
                  pointerEvents: "none",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div
                style={{
                  width: "60%",
                  height: "60%",
                  borderRadius: 999,
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(3,218,197,0.14), rgba(30,41,59,0.85))",
                  filter: "blur(6px)",
                }}
              />
            )}
          </motion.div>

          {/* reveal circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: computeRevealScale(meta),
              opacity: 1,
              transition: {
                delay: MOVE_DUR / 1400,
                duration: 0.9,
              },
            }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: "absolute",
              width: initDiameter,
              height: initDiameter,
              left: cx - initDiameter / 2,
              top: cy - initDiameter / 2,
              borderRadius: "50%",
              transformOrigin: "center",
              zIndex: 9995,
              background:
                "radial-gradient(circle at 30% 20%, rgba(36,198,180,0.08), rgba(7,10,14,0.96))",
              boxShadow: "0 24px 120px rgba(0,0,0,0.6)",
              pointerEvents: "none",
            }}
          />

          {/* full-screen Lottie */}
          <AnimatePresence>
            {phase === "lottie" ? (
              <motion.div
                key="lottie-full"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.36 },
                }}
                exit={{ opacity: 0, transition: { duration: 0.18 } }}
                style={{
                  position: "fixed",
                  left: 0,
                  top: 0,
                  width: "100vw",
                  height: "100vh",
                  zIndex: 10020,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              >
                <div
                  ref={lottieContainerRef}
                  style={{
                    width: "100%",
                    height: "100%",
                    overflow: "hidden",
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
