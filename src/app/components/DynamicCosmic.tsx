"use client";

import React, { useEffect, useRef } from "react";

export default function DynamicCosmic() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<Element | null>(null);
  // ensure finite defaults
  const mouseRef = useRef({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current!;
    if (!canvas) return;
    parentRef.current = canvas.parentElement;
    const ctx = canvas.getContext("2d")!;
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    const DPR = Math.max(1, window.devicePixelRatio || 1);

    // star and blob containers
    let stars: any[] = [];
    let blobs: any[] = [];

    function initParticles() {
      stars = [];
      blobs = [];
      const baseStars = window.innerWidth > 1400 ? 220 : window.innerWidth > 900 ? 160 : 90;
      const starLayers = 3;
      for (let i = 0; i < baseStars; i++) {
        const layer = i % starLayers;
        const z = 0.5 + (layer / Math.max(1, starLayers - 1)) * 1.6;
        stars.push({
          x: Math.random(),
          y: Math.random(),
          z,
          baseAlpha: 0.16 + Math.random() * 0.8,
          tw: Math.random() * Math.PI * 2,
          size: 0.6 + Math.random() * (1.6 - layer * 0.35),
        });
      }

      const nebulaCount = Math.max(2, Math.round((baseStars / 120) * 2));
      for (let i = 0; i < nebulaCount; i++) {
        blobs.push({
          x: Math.random(),
          y: Math.random(),
          radius: 0.12 + Math.random() * 0.26,
          hue: 180 + Math.random() * 160,
          sx: (Math.random() - 0.5) * 0.002,
          sy: (Math.random() - 0.5) * 0.002,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    function resizeCanvas() {
      const parent = parentRef.current;
      const rect = parent ? parent.getBoundingClientRect() : document.documentElement.getBoundingClientRect();
      width = Math.max(100, Math.round(rect.width));
      height = Math.max(100, Math.round(rect.height));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(height * DPR);
      // set transform so we can draw using CSS pixel coordinates
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // recreate particles for new density
      initParticles();
    }

    function onMove(e: MouseEvent) {
      const parent = parentRef.current ?? document.documentElement;
      const rect = parent.getBoundingClientRect();
      // compute normalized pointer and clamp to [0,1]
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseRef.current.x = Number.isFinite(nx) ? Math.max(0, Math.min(1, nx)) : 0.5;
      mouseRef.current.y = Number.isFinite(ny) ? Math.max(0, Math.min(1, ny)) : 0.5;
    }

    function tick(now = performance.now()) {
      if (!running) return;
      // clear
      ctx.clearRect(0, 0, width, height);

      // subtle background gradient
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, "rgba(5,8,14,1)");
      g.addColorStop(1, "rgba(8,6,18,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // draw nebula blobs
      blobs.forEach((b) => {
        b.x += b.sx;
        b.y += b.sy;
        b.phase += 0.01;
        if (b.x < -0.6) b.x = 1.6;
        if (b.x > 1.6) b.x = -0.6;
        if (b.y < -0.6) b.y = 1.6;
        if (b.y > 1.6) b.y = -0.6;

        const cx = b.x * width;
        const cy = b.y * height;
        const r = Math.max(width, height) * b.radius;

        // Guard: ensure finite values
        if (!Number.isFinite(cx) || !Number.isFinite(cy) || !Number.isFinite(r) || r <= 0) {
          return;
        }

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `hsla(${b.hue},70%,60%,0.12)`);
        grad.addColorStop(0.35, `hsla(${(b.hue + 40) % 360},60%,40%,0.08)`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      });

      // stars with parallax from mouse
      const px = (mouseRef.current.x - 0.5) * 40;
      const py = (mouseRef.current.y - 0.5) * 40;
      const nowMs = performance.now();

      stars.forEach((s) => {
        // defensive defaults if properties missing
        const sxVal = typeof s.x === "number" ? s.x : 0;
        const syVal = typeof s.y === "number" ? s.y : 0;
        const zVal = typeof s.z === "number" ? s.z : 1;
        const baseAlpha = typeof s.baseAlpha === "number" ? s.baseAlpha : 0.5;
        const tw = typeof s.tw === "number" ? s.tw : 0;
        const sz = typeof s.size === "number" ? s.size : 1;

        const twv = 0.6 + 0.4 * Math.sin(nowMs / 500 + tw);
        const alpha = Math.max(0.05, Math.min(1, baseAlpha * twv));
        const sx = sxVal * width + px * (zVal - 0.6);
        const sy = syVal * height + py * (zVal - 0.6);
        const size = Math.max(0.3, sz * (1 + (zVal - 0.6) * 0.6));

        // Only attempt gradient if all numbers are finite
        if (alpha > 0.22) {
          const gsizeRaw = size * 6;
          const gsize = Number.isFinite(gsizeRaw) ? Math.max(1, gsizeRaw) : 1;

          if (Number.isFinite(sx) && Number.isFinite(sy) && Number.isFinite(gsize)) {
            try {
              const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, gsize);
              g2.addColorStop(0, `rgba(255,255,255,${alpha})`);
              g2.addColorStop(0.4, `rgba(255,255,255,${alpha * 0.3})`);
              g2.addColorStop(1, "rgba(255,255,255,0)");
              ctx.fillStyle = g2;
              ctx.beginPath();
              ctx.arc(sx, sy, gsize, 0, Math.PI * 2);
              ctx.fill();
            } catch (err) {
              // In the rare case createRadialGradient throws, skip drawing gradient
              // (prevents crash). You could optionally log to console in dev builds.
              // console.warn("Skipping star gradient due to invalid values", { sx, sy, gsize, err });
            }
          }
        }

        // draw the star core (only if finite)
        if (Number.isFinite(sx) && Number.isFinite(sy) && Number.isFinite(size)) {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(tick);
    }

    // start
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMove);

    raf = requestAnimationFrame(tick);

    // cleanup
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none dynamic-cosmic"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
