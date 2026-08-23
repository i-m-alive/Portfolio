"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Planet from "./Planet";
import { motion } from "framer-motion";
import Image from "next/image";

type PlanetDef = {
  id: string;
  label: string;
  icon: string;
  distance: number;
  size: number;
  themeClass?: string;
  goto?: string;
  behindSun?: boolean;
};

const BASE_PLANETS: PlanetDef[] = [
  { id: "ai", label: "AIML Career", icon: "/orbit_icons/icon-ai.svg", distance: 100, size: 56, themeClass: "theme-ai", goto: "/professional-ai" },
  { id: "professional", label: "Professional Summary", icon: "/orbit_icons/icon-summary.svg", distance: 180, size: 68, themeClass: "theme-ai", goto: "/professional" },
  { id: "work", label: "Work Experience", icon: "/orbit_icons/icon-work.svg", distance: 220, size: 88, themeClass: "theme-ai", goto: "/work-experience" },
  { id: "skills", label: "Skills", icon: "/orbit_icons/icon-skills.svg", distance: 260, size: 78, themeClass: "theme-ai", goto: "/skills" },
  { id: "certificates", label: "Certificates", icon: "/orbit_icons/icon-certificates.svg", distance: 300, size: 94, themeClass: "theme-sketch", goto: "/certificates" },
  { id: "edu", label: "Education", icon: "/orbit_icons/icon-edu.svg", distance: 340, size: 100, themeClass: "theme-ai", goto: "/education" },
  { id: "contact", label: "Contact", icon: "/orbit_icons/icon-contact.svg", distance: 380, size: 52, themeClass: "theme-sketch", goto: "/contact" },
  { id: "projects", label: "Projects", icon: "/orbit_icons/icon-projects.svg", distance: 420, size: 110, themeClass: "theme-ai", goto: "/projects" },
];

/**
 * @param asHeading  Render the name as the page <h1>. True on the home page,
 *   false when embedded in SolarPreview — otherwise every inner page shipped a
 *   second <h1> that was not its own title.
 */
export default function HeroSolar({ asHeading = true }: { asHeading?: boolean } = {}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const elapsedRef = useRef(0);
  const [t, setT] = useState(0);
  const [scaleFactor, setScaleFactor] = useState(1);
  const [stageHalf, setStageHalf] = useState<number>(300);

  // adjust this offset (px) if you want the heading lower/higher
  const headingTopOffset = 260; // px base offset from center

  const hash01 = (s: string) => {
    let h = 2166136261 >>> 0;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return (h % 1000) / 1000;
  };

  const maxDesignDist = Math.max(...BASE_PLANETS.map((p) => p.distance));
  const minDesignDist = Math.min(...BASE_PLANETS.map((p) => p.distance));

  const params = useMemo(() => {
    const n = BASE_PLANETS.length;
    return BASE_PLANETS.map((p, i) => {
      const h = hash01(p.id + String(p.distance));
      const baseSpeed = 0.6 + h * 1.4;
      const dir = i % 2 === 0 ? 1 : -1;
      const evenly = (i / n) * Math.PI * 2;
      const offset = (h - 0.5) * 0.6;
      const phase = evenly + offset;
      const eccentricity = 0.01 + h * 0.06;
      const radialJitter = 0.98 + h * 0.08;
      const speedAmp = 0.94 + h * 0.12;
      const speedFreq = 0.08 + h * 0.22;
      return { baseSpeed, dir, phase, eccentricity, radialJitter, speedAmp, speedFreq };
    });
  }, []);

  useLayoutEffect(() => {
    function recompute() {
      const el = rootRef.current;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const stageW = el?.clientWidth ?? Math.min(vw, 1100);
      const stageH = el?.clientHeight ?? Math.min(600, vh * 0.66);
      const safeRadius = Math.min(stageW, stageH) * 0.44;
      const sf = safeRadius / maxDesignDist;
      setScaleFactor(Math.max(0.52, Math.min(1, sf)));
      setStageHalf(Math.min(stageW, stageH) / 2);
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, [maxDesignDist]);

  useEffect(() => {
    let raf = 0;
    let lastNow = performance.now();
    let lastStateSet = lastNow;
    const stateThrottleMs = 33;
    function step(now: number) {
      const dt = (now - lastNow) / 1000;
      lastNow = now;
      elapsedRef.current += dt;
      if (now - lastStateSet >= stateThrottleMs) {
        setT(elapsedRef.current);
        lastStateSet = now;
      }
      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  function clampToBounds(x: number, y: number, max: number) {
    const mag = Math.sqrt(x * x + y * y);
    if (mag <= max) return { x, y };
    const s = max / (mag + 1e-9);
    return { x: x * s, y: y * s };
  }

  const planetLayouts = useMemo(() => {
    const computed: Array<{
      id: string;
      left: string;
      top: string;
      zIndex: number;
      ang: number;
      x: number;
      y: number;
    }> = [];

    for (let i = 0; i < BASE_PLANETS.length; i++) {
      const p = BASE_PLANETS[i];
      const pr = params[i];

      const distanceScale =
        0.45 + 0.55 * (1 - (p.distance - minDesignDist) / Math.max(1, maxDesignDist - minDesignDist));
      const speedModulator = 1 + Math.sin(t * pr.speedFreq * 2 * Math.PI + pr.phase) * 0.06;
      const degPerSec = pr.baseSpeed * distanceScale * pr.speedAmp * speedModulator;

      const ang = pr.phase + (t * degPerSec * pr.dir * Math.PI) / 180;

      const ecc = pr.eccentricity;
      const rBase = p.distance * scaleFactor * pr.radialJitter;

      const sunRadius = 70;
      const planetRadius = p.size / 2;
      const padding = 26;
      const minOrbit = sunRadius + planetRadius + padding;

      const rx = rBase * (1 + ecc * Math.cos(ang * 1.05));
      const ry = rBase * (1 - ecc * Math.sin(ang * 1.25));

      let x = Math.cos(ang) * rx;
      let y = Math.sin(ang) * ry;

      const mag = Math.sqrt(x * x + y * y);
      if (mag < minOrbit) {
        x = (x / (mag + 1e-9)) * minOrbit;
        y = (y / (mag + 1e-9)) * minOrbit;
      }

      const stageHalfLocal = stageHalf || 300;
      const maxSafe = Math.max(120, stageHalfLocal - p.size * 0.6);

      const mag2 = Math.sqrt(x * x + y * y);
      if (mag2 > maxSafe + 6) {
        const cl = clampToBounds(x, y, maxSafe);
        x = cl.x;
        y = cl.y;
      }

      const left = `calc(50% + ${Math.round(x)}px)`;
      const top = `calc(50% + ${Math.round(y)}px)`;
      // keep planets z below the heading stack by capping maximum (so heading can safely be above)
      const baseZ = p.behindSun ? 40 : 60 + Math.round(p.size / 4);
      const cappedZ = Math.min(baseZ, 100); // ensure not massive
      computed.push({ id: p.id, left, top, zIndex: cappedZ, ang: (ang * 180) / Math.PI, x: Math.round(x), y: Math.round(y) });
    }

    return computed;
  }, [t, params, scaleFactor, stageHalf, minDesignDist, maxDesignDist]);

  // meteors — improved direction & short tails (keeps subtle)
  const meteors = useMemo(() => {
    const arr = Array.from({ length: 6 }, (_, i) => {
      const s = hash01("meteor" + i + "stable");
      const angleDeg = Math.round(s * 360);
      const angleRad = (angleDeg * Math.PI) / 180;
      const vx = Math.cos(angleRad) * (60 + s * 140);
      const vy = Math.sin(angleRad) * (20 + s * 120);
      const duration = 1.2 + s * 2.2;
      const delay = s * 2.0;
      const headSize = Math.round(4 + s * 6);
      const tailLen = Math.round(12 + s * 22);
      const tailWidth = Math.max(1, Math.round(1 + s * 2));
      const opacity = 0.18 + s * 0.36;
      return {
        angleDeg,
        dx: `${Math.round(vx)}vw`,
        dy: `${Math.round(vy)}vh`,
        duration: duration.toFixed(2),
        delay: delay.toFixed(2),
        headSize,
        tailLen,
        tailWidth,
        opacity: Number(opacity.toFixed(2)),
      };
    });
    return arr;
  }, []);

  // stable typewriter
  const roles = ["AI Engineer", "ML Developer", "Full Stack Builder"];
  const [typeText, setTypeText] = useState("");
  const [currentRole, setCurrentRole] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typingForward, setTypingForward] = useState(true);

  useEffect(() => {
    let mounted = true;
    const typingSpeed = 70;
    const pauseAfterFull = 900;
    let timer: number | null = null;

    function step() {
      if (!mounted) return;
      const role = roles[currentRole];
      if (typingForward) {
        if (charIndex < role.length) {
          setCharIndex((c) => c + 1);
          setTypeText(role.slice(0, charIndex + 1));
          timer = window.setTimeout(step, typingSpeed);
        } else {
          timer = window.setTimeout(() => {
            setTypingForward(false);
            timer = window.setTimeout(step, typingSpeed);
          }, pauseAfterFull);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((c) => c - 1);
          setTypeText(role.slice(0, charIndex - 1 >= 0 ? charIndex - 1 : 0));
          timer = window.setTimeout(step, typingSpeed);
        } else {
          setTypingForward(true);
          setCurrentRole((r) => (r + 1) % roles.length);
          timer = window.setTimeout(step, typingSpeed);
        }
      }
    }

    timer = window.setTimeout(step, typingSpeed);
    return () => {
      mounted = false;
      if (timer) window.clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charIndex, currentRole, typingForward]);

  function handlePlanetClick(p: PlanetDef, e?: React.MouseEvent<HTMLButtonElement>) {
    const root = document.documentElement;
    root.classList.remove("theme-sketch", "theme-rap", "theme-ai");
    if (p.themeClass) root.classList.add(p.themeClass);

    let xPerc = 50;
    let yPerc = 50;
    if (e && typeof e.clientX === "number") {
      xPerc = (e.clientX / window.innerWidth) * 100;
      yPerc = (e.clientY / window.innerHeight) * 100;
    }

    const overlay = document.createElement("div");
    overlay.className = "orbit-radial-overlay";
    overlay.style.setProperty("--x", `${xPerc}%`);
    overlay.style.setProperty("--y", `${yPerc}%`);
    overlay.style.opacity = "1";
    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.style.opacity = "0";
      setTimeout(() => overlay.remove(), 420);
    }, 360);

    const theme =
      p.id === "professional" || p.id === "ai"
        ? "ai"
        : p.id === "sketch"
        ? "sketch"
        : "default";

    window.dispatchEvent(
      new CustomEvent("planet-transition", {
        detail: { id: p.id, label: p.label, theme, goto: p.goto ?? undefined, xPerc, yPerc },
      })
    );
  }

  return (
    <div ref={rootRef} className="relative overflow-visible orbit-hero rounded-2xl">
      <style>{`
        @keyframes shimmerPulse {
          0% { transform: scale(0.95); opacity: 0.08; }
          50% { transform: scale(1.03); opacity: 0.18; }
          100% { transform: scale(0.95); opacity: 0.08; }
        }
        .space-shimmer {
          position: absolute;
          width: 520px;
          height: 100px;
          left: 50%;
          top: calc(50% + 140px);
          transform: translateX(-50%);
          border-radius: 999px;
          background: radial-gradient(60% 60% at 50% 40%, rgba(96,165,250,0.09), rgba(124,58,237,0.05) 30%, rgba(0,0,0,0));
          filter: blur(22px) saturate(110%);
          pointer-events: none;
          animation: shimmerPulse 5.2s ease-in-out infinite;
          z-index: 30;
          mix-blend-mode: screen;
        }

        .holo-float { animation: floaty 6s ease-in-out infinite; }
        @keyframes floaty {
          0% { transform: translateY(0px); opacity: 0.98; }
          50% { transform: translateY(-5px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.98; }
        }

        @keyframes meteorMove {
          0% { transform: translate3d(0,0,0) rotate(var(--rot)); opacity: 0; }
          6% { opacity: 1; }
          100% { transform: translate3d(var(--dx), var(--dy), 0) rotate(var(--rot)); opacity: 0; }
        }

        .meteor { position: absolute; pointer-events: none; z-index: 10; mix-blend-mode: screen; display: block; }

        .meteor-head {
          position: absolute;
          left: 0; top: 0;
          border-radius: 50%;
          box-shadow: 0 0 8px 2px rgba(255,255,255,0.9);
          background: linear-gradient(180deg, rgba(255,255,255,1), rgba(200,200,255,0.9));
          transform-origin: center;
        }

        .meteor-tail {
          position: absolute;
          right: 100%; top: 50%;
          transform-origin: right center;
          background: linear-gradient(90deg, rgba(255,255,255,0.0), rgba(255,255,255,0.28));
          border-radius: 999px;
          filter: blur(1px);
        }

        .constellation-line { stroke: rgba(255,255,255,0.035); stroke-width: 1; stroke-linecap: round; }
        .constellation-line-strong { stroke: rgba(96,165,250,0.06); stroke-width: 1.1; }

        .type-caret {
          display: inline-block;
          width: 6px;
          height: 16px;
          background: linear-gradient(180deg,#ffffff,#e8e8e8);
          margin-left: 8px;
          border-radius: 2px;
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink { 50% { opacity: 0; } 100% { opacity: 1; } }

        @media (prefers-reduced-motion: reduce) {
          .holo-float, .space-shimmer, .meteor { animation: none !important; }
        }

        /* responsive adjustments for heading to avoid overlap on small screens */
        @media (max-width: 640px) {
          .heading-block { top: calc(50% + ${headingTopOffset + 20}px) !important; }
          .heading-title { font-size: 1.6rem !important; }
        }
      `}</style>

      <div
        className="relative w-full max-w-6xl h-[560px] mx-auto flex items-center justify-center orbit-stage"
        style={{ overflow: "visible" }}
      >
        {/* central profile */}
        <motion.div
          layoutId="profile-pic"
          className="relative z-50 rounded-full cursor-pointer orbit-sun"
          initial={{ scale: 1 }}
          animate={{ scale: 1 }}
          onClick={(e) => {
            const el = e.currentTarget as HTMLElement;
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const r = Math.max(rect.width, rect.height) / 2;
            window.dispatchEvent(
              new CustomEvent("planet-transition", {
                detail: { id: "profile", label: "Home", theme: "ai", goto: "/", cx, cy, r },
              })
            );
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") (e.currentTarget as HTMLElement).click();
          }}
          role="button"
          tabIndex={0}
        >
          <div id="profile-inner" className="w-[140px] h-[140px] rounded-full overflow-hidden border-4 border-white/10">
            <Image src="/profile.png" alt="Profile picture" width={140} height={140} priority style={{ objectFit: "cover", display: "block" }} />
          </div>
        </motion.div>

        {/* decorative orbits */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" aria-hidden>
          <circle cx="400" cy="210" r={60 * scaleFactor} stroke="#ffffff06" strokeWidth="1" fill="none" />
          <circle cx="400" cy="210" r={110 * scaleFactor} stroke="#ffffff05" strokeWidth="1" fill="none" />
          <circle cx="400" cy="210" r={170 * scaleFactor} stroke="#ffffff04" strokeWidth="1" fill="none" />
          <circle cx="400" cy="210" r={230 * scaleFactor} stroke="#ffffff03" strokeWidth="1" fill="none" />
        </svg>

        {/* constellation lines */}
        <svg
          className="absolute inset-0 z-10 pointer-events-none"
          viewBox={`${-stageHalf} ${-stageHalf} ${stageHalf * 2} ${stageHalf * 2}`}
          preserveAspectRatio="xMidYMid meet"
          aria-hidden
        >
          {planetLayouts.map((pl) => (
            <line key={`spoke-${pl.id}`} x1={0} y1={0} x2={pl.x} y2={pl.y} className="constellation-line" />
          ))}

          <polyline
            points={planetLayouts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            className="constellation-line-strong"
            opacity={0.04}
          />
        </svg>

        {/* meteors */}
        {meteors.map((m, i) => (
          <div
            key={`meteor-${i}`}
            className="meteor"
            style={{
              left: `${6 + (i * 12) % 80}%`,
              top: `${6 + (i * 9) % 60}%`,
              animation: `meteorMove ${m.duration}s linear ${m.delay}s infinite`,
              // inline CSS variables for animation target & rotation
              // @ts-ignore
              ["--dx" as any]: m.dx,
              // @ts-ignore
              ["--dy" as any]: m.dy,
              // @ts-ignore
              ["--rot" as any]: `${m.angleDeg}deg`,
              opacity: m.opacity,
            }}
            aria-hidden
          >
            <div
              className="meteor-head"
              style={{
                width: `${m.headSize}px`,
                height: `${m.headSize}px`,
                transform: `translate(-50%,-50%)`,
                left: 0,
                top: 0,
              }}
            />
            <div
              className="meteor-tail"
              style={{
                width: `${m.tailLen}px`,
                height: `${m.tailWidth}px`,
                marginTop: `${-Math.round(m.tailWidth / 2)}px`,
                right: `${m.headSize + 2}px`,
              }}
            />
          </div>
        ))}

        {/* planets (kept under the heading by z-index cap above) */}
        <div className="absolute inset-0">
          {BASE_PLANETS.map((p) => {
            const layout = planetLayouts.find((pl) => pl.id === p.id);
            const left = layout?.left ?? "50%";
            const top = layout?.top ?? "50%";
            const zIndex = layout?.zIndex ?? 60;
            const ang = layout?.ang ?? 0;
            return (
              <div
                key={p.id}
                style={{ position: "absolute", left, top, transform: "translate(-50%,-50%)", pointerEvents: "auto", zIndex }}
              >
                <Planet
                  id={p.id}
                  label={p.label}
                  icon={p.icon}
                  goto={p.goto}
                  size={p.size}
                  angle={ang}
                  ariaLabel={`Open ${p.label}`}
                />
              </div>
            );
          })}
        </div>

        {/* subtle shimmer behind heading */}
        <div className="space-shimmer" aria-hidden />

        {/* heading block: moved lower and given a very high z-index so text is always legible */}
        <div
          className="absolute text-center -translate-x-1/2 select-none heading-block left-1/2"
          style={{
            top: `calc(50% + ${headingTopOffset}px)`,
            pointerEvents: "none",
            width: "min(760px, 86%)",
            zIndex: 220, // ensure heading sits above planets
          }}
        >
          {asHeading ? (
            <h1
              className="text-3xl font-extrabold leading-tight tracking-wide text-white heading-title md:text-4xl"
              style={{ textShadow: "0 6px 18px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.02)", margin: 0 }}
            >
              Kumar Shivraj Bhakat
            </h1>
          ) : (
            <p
              className="text-3xl font-extrabold leading-tight tracking-wide text-white heading-title md:text-4xl"
              style={{ textShadow: "0 6px 18px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.02)", margin: 0 }}
            >
              Kumar Shivraj Bhakat
            </p>
          )}

          <p className="mt-1 text-sm text-white/60" style={{ marginTop: 6 }}>
            Welcome to My Portfolio Universe 🚀
          </p>

          <div className="flex items-center justify-center gap-4 mt-3 pointer-events-none">
            <div className="flex items-center text-sm text-white/70">
              <span className="hidden mr-2 md:inline">I am</span>
              <strong className="text-sm text-white md:text-base">{typeText}</strong>
              <span className="type-caret" aria-hidden />
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <div
              className="inline-block px-4 py-2 border shadow-lg holo-float rounded-2xl bg-gradient-to-r from-white/4 to-white/6 backdrop-blur-md border-white/6"
              style={{ pointerEvents: "none" }}
            >
              <div className="text-xs tracking-wide text-white/60">🔭 Exploring Skills · Projects · Experience</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
