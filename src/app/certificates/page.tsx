"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { Transition } from "framer-motion";

/* Shared transition for cards */
const ACTION_TRANS: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 20,
};

/* Lazy SolarPreview (client-only) */
const SolarPreview = dynamic(
  () => import("@/app/components/orbit/SolarPreview"),
  {
    ssr: false,
    // Smaller placeholder height now
    loading: () => <div style={{ height: 140 }} />,
  }
);

/* ---------------------------
   DynamicCosmic - inlined background canvas (client only)
   --------------------------- */
function DynamicCosmic() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const parentRef = useRef<Element | null>(null);
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

    let stars: any[] = [];
    let blobs: any[] = [];

    function initParticles() {
      stars = [];
      blobs = [];
      const baseStars =
        window.innerWidth > 1400
          ? 220
          : window.innerWidth > 900
          ? 160
          : 90;
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
      const rect = parent
        ? parent.getBoundingClientRect()
        : document.documentElement.getBoundingClientRect();
      width = Math.max(100, Math.round(rect.width));
      height = Math.max(100, Math.round(rect.height));
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      canvas.width = Math.round(width * DPR);
      canvas.height = Math.round(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      initParticles();
    }

    function onMove(e: MouseEvent) {
      const parent = parentRef.current ?? document.documentElement;
      const rect = parent.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width;
      const ny = (e.clientY - rect.top) / rect.height;
      mouseRef.current.x = Number.isFinite(nx)
        ? Math.max(0, Math.min(1, nx))
        : 0.5;
      mouseRef.current.y = Number.isFinite(ny)
        ? Math.max(0, Math.min(1, ny))
        : 0.5;
    }

    function tick() {
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, "rgba(5,8,14,1)");
      g.addColorStop(1, "rgba(8,6,18,1)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

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

        if (
          !Number.isFinite(cx) ||
          !Number.isFinite(cy) ||
          !Number.isFinite(r) ||
          r <= 0
        )
          return;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `hsla(${b.hue},70%,60%,0.12)`);
        grad.addColorStop(
          0.35,
          `hsla(${(b.hue + 40) % 360},60%,40%,0.08)`
        );
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.globalCompositeOperation = "lighter";
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
      });

      const px = (mouseRef.current.x - 0.5) * 40;
      const py = (mouseRef.current.y - 0.5) * 40;
      const nowMs = performance.now();

      stars.forEach((s) => {
        const sxVal = typeof s.x === "number" ? s.x : 0;
        const syVal = typeof s.y === "number" ? s.y : 0;
        const zVal = typeof s.z === "number" ? s.z : 1;
        const baseAlpha =
          typeof s.baseAlpha === "number" ? s.baseAlpha : 0.5;
        const tw = typeof s.tw === "number" ? s.tw : 0;
        const sz = typeof s.size === "number" ? s.size : 1;

        const twv = 0.6 + 0.4 * Math.sin(nowMs / 500 + tw);
        const alpha = Math.max(0.05, Math.min(1, baseAlpha * twv));
        const sx = sxVal * width + px * (zVal - 0.6);
        const sy = syVal * height + py * (zVal - 0.6);
        const size = Math.max(0.3, sz * (1 + (zVal - 0.6) * 0.6));

        if (alpha > 0.22) {
          const gsizeRaw = size * 6;
          const gsize = Number.isFinite(gsizeRaw)
            ? Math.max(1, gsizeRaw)
            : 1;

          if (
            Number.isFinite(sx) &&
            Number.isFinite(sy) &&
            Number.isFinite(gsize)
          ) {
            try {
              const g2 = ctx.createRadialGradient(sx, sy, 0, sx, sy, gsize);
              g2.addColorStop(0, `rgba(255,255,255,${alpha})`);
              g2.addColorStop(
                0.4,
                `rgba(255,255,255,${alpha * 0.3})`
              );
              g2.addColorStop(1, "rgba(255,255,255,0)");
              ctx.fillStyle = g2;
              ctx.beginPath();
              ctx.arc(sx, sy, gsize, 0, Math.PI * 2);
              ctx.fill();
            } catch {
              // skip if gradient creation fails
            }
          }
        }

        if (Number.isFinite(sx) && Number.isFinite(sy) && Number.isFinite(size)) {
          ctx.fillStyle = `rgba(255,255,255,${alpha})`;
          ctx.beginPath();
          ctx.arc(sx, sy, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      raf = requestAnimationFrame(tick);
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    window.addEventListener("mousemove", onMove);

    raf = requestAnimationFrame(tick);

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
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}

/* ---------------------------
   Certificates data
   --------------------------- */
const CERTS = [
  {
    id: "azure-ai-900",
    title: "Microsoft Certified: Azure AI Fundamentals (AI-900)",
    issuer: "Microsoft",
    issued: "Mar 23, 2024",
    hours: null,
    desc: "Earners of the Azure AI Fundamentals certification have foundational knowledge of ML/AI concepts and Azure services.",
    credentialId: null,
    credentialUrl:
      "https://www.credly.com/badges/5e43b189-902b-426a-ba0a-5a141908cfb5/linked_in?t=saugaq",
    image: "/badges/ai-900-card.png",
  },
  {
    id: "cloud-law",
    title: "Cloud Computing Law: Transactions",
    issuer: "Queen Mary University of London",
    issued: "Nov 21, 2024",
    hours: "19 hours (approx.)",
    desc: "Coursera verified completion of Cloud Computing Law: Transactions.",
    credentialId: "WD79CXVGW1HK",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/WD79CXVGW1HK",
    image: "/certs/cloud-law-qmul.png",
  },
  {
    id: "cybersecurity-domains",
    title: "Cybersecurity and Its Ten Domains",
    issuer: "Kennesaw State University",
    issued: "Nov 20, 2024",
    hours: "23 hours (approx.)",
    desc: "Coursera verified completion of Cybersecurity and Its Ten Domains.",
    credentialId: "VA88NJNBLRYN",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/VA88NJNBLRYN",
    image: "/certs/domains.png",
  },
  {
    id: "data-analytics",
    title: "Introduction to Data Analytics",
    issuer: "IBM",
    issued: "Nov 21, 2024",
    hours: "10 hours (approx.)",
    desc: "Coursera verified completion of Introduction to Data Analytics.",
    credentialId: "KKQ0QTO45YWM",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/KKQ0QTO45YWM",
    image: "/certs/ibm.png",
  },
  {
    id: "leading-teams",
    title: "Challenges of Leading Technical Teams",
    issuer: "University of Colorado Boulder",
    issued: "Sep 25, 2024",
    hours: "8 hours (approx.)",
    desc: "Coursera verified completion of Challenges of Leading Technical Teams.",
    credentialId: "UMDXYF05R4SI",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/UMDXYF05R4SI",
    image: "/certs/leading.png",
  },
  {
    id: "transformer-bert",
    title: "Transformer Models and BERT Model",
    issuer: "Google Cloud",
    issued: "Sep 2, 2024",
    hours: null,
    desc: "Coursera verified completion of Transformer Models and BERT Model.",
    credentialId: "IBU0ZF7E8Y7L",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/verify/IBU0ZF7E8Y7L",
    image: "/certs/transformer-bert.png",
  },
  {
    id: "azure-ai-102",
    title: "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
    issuer: "Microsoft",
    issued: "Jun 30, 2024",
    hours: null,
    desc: "Design and implement Azure AI solutions — includes computer vision, language, and conversational AI services.",
    credentialId: "C516DBFCC6B92838",
    credentialUrl:
      "https://learn.microsoft.com/en-us/users/kumarshivrajbhakat-7771/credentials/c516dbfcc6b92838?ref=https%3A%2F%2Fwww.linkedin.com%2F",
    image: "/badges/ai-102-card.png",
  },
  {
    id: "fullstack-internship",
    title: "Full Stack Development — Internship (Capabl India)",
    issuer: "Capabl India",
    issued: "Jul 31, 2023",
    hours: "1 month internship",
    desc: "Completed a one month internship specializing in Full Stack Development at Capabl India.",
    credentialId: null,
    credentialUrl: "#",
    image: "/certs/capabl-internship.png",
  },
];

const CARD_MAX_WIDTH = 720;
const CARD_MIN_WIDTH = 340;

/* Image helpers */
function FullCoverImage({
  src,
  alt,
  interactive = true,
}: {
  src: string;
  alt?: string;
  interactive?: boolean;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: interactive ? undefined : "none",
      }}
    >
      <NextImage
        src={src}
        alt={alt || ""}
        fill
        style={{
          objectFit: "cover",
          objectPosition: "center",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
function BadgeImage({
  src,
  alt,
  scale = 0.62,
}: {
  src: string;
  alt?: string;
  scale?: number;
}) {
  const s = Math.max(0.2, Math.min(0.95, scale));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        pointerEvents: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        style={{
          maxWidth: `${Math.round(s * 100)}%`,
          maxHeight: `${Math.round(s * 100)}%`,
          objectFit: "contain",
          display: "block",
        }}
      />
    </div>
  );
}

/* Modal showing details */
function CertModal({
  cert,
  onClose,
}: {
  cert: any | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!cert) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cert, onClose]);

  if (!cert) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[6000] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-black/75" onClick={onClose} />
      <motion.div
        initial={{ y: 12, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative w-full max-w-4xl overflow-visible border bg-black/92 rounded-2xl border-white/6"
        style={{ zIndex: 10 }}
      >
        <div className="flex items-start gap-4 p-4 border-b border-white/6">
          <div className="relative w-32 h-32 overflow-hidden border rounded bg-black/60 border-white/6">
            {cert.image ? (
              cert.id?.startsWith("azure-ai") ? (
                <BadgeImage src={cert.image} alt={cert.title} scale={0.9} />
              ) : (
                <FullCoverImage
                  src={cert.image}
                  alt={cert.title}
                  interactive={false}
                />
              )
            ) : (
              <div className="flex items-center justify-center w-full h-full text-white/70">
                —
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="text-lg font-semibold">{cert.title}</div>
            <div className="text-xs text-white/60">
              {cert.issuer} · {cert.issued}
            </div>
            {cert.hours ? (
              <div className="mt-1 text-xs text-white/60">{cert.hours}</div>
            ) : null}
          </div>

          <div className="flex items-start gap-2 ml-auto">
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="px-3 py-2 rounded bg-white/6 hover:bg-white/8"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="relative z-20 p-4">
          <p className="text-sm whitespace-pre-line text-white/80">
            {cert.desc}
          </p>

          {cert.credentialId && (
            <div className="mt-3 text-sm text-white/60">
              Credential ID:{" "}
              <span className="text-white/90">{cert.credentialId}</span>
            </div>
          )}

          <div className="flex items-center gap-3 mt-6">
            {cert.credentialUrl && cert.credentialUrl !== "#" ? (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black rounded shadow bg-cyan-400"
              >
                Show credential <ExternalLink size={14} />
              </a>
            ) : (
              <button className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded bg-white/6 text-white/90">
                Show credential
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* Main page (with DynamicCosmic background) */
export default function CertificatePage() {
  const reduceMotion = useReducedMotion();
  const rightSectionRef = useRef<HTMLDivElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);

  // Touch state for swipe
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [modalCert, setModalCert] = useState<any | null>(null);
  const len = CERTS.length;

  const [cardSize, setCardSize] = useState({ w: 560, h: 320 });

  useEffect(() => {
    setMounted(true);
    const compute = () => {
      const parentWidth =
        rightSectionRef.current?.clientWidth ??
        Math.min(window.innerWidth * 0.66, 900);
      const w = Math.max(
        CARD_MIN_WIDTH,
        Math.min(CARD_MAX_WIDTH, Math.floor(parentWidth * 0.9))
      );
      const h = Math.floor(w * 0.55);
      setCardSize({ w, h });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (rightSectionRef.current) ro.observe(rightSectionRef.current);
    window.addEventListener("resize", compute);
    return () => {
      if (rightSectionRef.current) ro.unobserve(rightSectionRef.current);
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, []);

  const clampIndex = (i: number) => (i + len) % len;
  const next = () => setIndex((i) => clampIndex(i + 1));
  const prev = () => setIndex((i) => clampIndex(i - 1));
  const bringToFront = (i: number) => setIndex(i);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape" && modalCert) setModalCert(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalCert]);

  // Swipe handlers (for phone-like swapping)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const start = touchStartRef.current;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    const THRESHOLD = 40; // minimum px swipe

    // Only trigger for horizontal, strong swipe
    if (absDx > THRESHOLD && absDx > absDy) {
      if (dx < 0) {
        // swipe left => next certificate
        next();
      } else {
        // swipe right => previous certificate
        prev();
      }
    }

    touchStartRef.current = null;
  };

  const H_SPREAD_FACTOR = 0.08;
  const ROTATE_FACTOR = 4.0;

  const leftCalc = `calc(50% - ${cardSize.w / 2 + 72}px)`;
  const rightCalc = `calc(50% + ${cardSize.w / 2 + 24}px)`;

  return (
    <main
      className="min-h-screen px-6 py-12 text-white bg-gradient-to-b from-black/88 to-black/96 md:px-12 lg:px-24"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <DynamicCosmic />

      <div className="relative mx-auto max-w-7xl" style={{ zIndex: 10 }}>
        <div className="grid items-start grid-cols-1 gap-8 md:grid-cols-3">
          <aside className="md:col-span-1">
            <div className="sticky space-y-6 top-24">
              {/* Reduced height and SolarPreview scale */}
              <div
                className="p-4 border border-white/8 rounded-2xl bg-black/40 backdrop-blur-md"
                style={{ height: 260 }}
              >
                {/* you can tweak scale further (0.6 / 0.7) if you want it even smaller */}
                <SolarPreview scale={0.7} height="240px"/>
              </div>

              <div className="p-4 border rounded-2xl bg-white/3 border-white/6">
                <div className="text-sm font-semibold">Certificates</div>
                <div className="mt-2 text-xs text-white/70">
                  Tap the front card to open details, or swipe left/right on
                  mobile to swap certificates.
                </div>
              </div>
            </div>
          </aside>

          <section className="md:col-span-2" ref={rightSectionRef}>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">My Certificates</h1>
            </div>

            {!mounted ? (
              <div className="relative">
                <div
                  className="border rounded-2xl border-white/6 bg-black/70"
                  style={{ height: 360 }}
                >
                  <div className="flex items-center justify-center h-full text-white/40">
                    Loading certificates…
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  height: cardSize.h + 120,
                  overflow: "hidden",
                  position: "relative",
                }}
                className="relative"
              >
                <div
                  style={{ height: cardSize.h + 80 }}
                  className="relative"
                  ref={deckRef}
                  // swipe region
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                >
                  {!modalCert && (
                    <>
                      <button
                        onClick={prev}
                        aria-label="Prev card"
                        className="absolute items-center justify-center hidden w-12 h-12 border md:inline-flex rounded-xl bg-black/80 border-white/10 hover:bg-black/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                          left: leftCalc,
                          zIndex: 9999,
                          pointerEvents: "auto",
                        }}
                      >
                        <ChevronLeft size={22} />
                      </button>

                      <button
                        onClick={next}
                        aria-label="Next card"
                        className="absolute items-center justify-center hidden w-12 h-12 border md:inline-flex rounded-xl bg-black/80 border-white/10 hover:bg-black/70 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        style={{
                          top: "50%",
                          transform: "translateY(-50%)",
                          left: rightCalc,
                          zIndex: 9999,
                          pointerEvents: "auto",
                        }}
                      >
                        <ChevronRight size={22} />
                      </button>
                    </>
                  )}

                  {CERTS.map((c, i) => {
                    let rel = i - index;
                    if (rel > Math.floor(len / 2)) rel -= len;
                    if (rel < -Math.floor(len / 2)) rel += len;

                    const abs = Math.abs(rel);
                    const isActive = rel === 0;

                    const baseScale = isActive
                      ? 1
                      : Math.max(0.82, 1 - 0.06 * abs);
                    const scale = baseScale;
                    const x = rel * (cardSize.w * H_SPREAD_FACTOR);
                    const y = isActive ? 0 : 12 * abs;
                    const rotate = rel * -ROTATE_FACTOR;
                    const zIndex = 200 - abs;
                    const opacity = isActive
                      ? 1
                      : Math.max(0.5, 1 - 0.12 * abs);

                    const isBadge = c.id?.startsWith("azure-ai");
                    const left = "50%";
                    const marginLeft = -cardSize.w / 2;

                    const hoverMotion = reduceMotion
                      ? undefined
                      : { y: y - 8, scale: scale + 0.03 };

                    return (
                      <motion.div
                        key={c.id}
                        initial={false}
                        animate={{ x, y, rotate, scale, opacity }}
                        transition={
                          reduceMotion ? { duration: 0.08 } : ACTION_TRANS
                        }
                        style={{
                          position: "absolute",
                          left,
                          top: 16,
                          width: cardSize.w,
                          height: cardSize.h,
                          marginLeft,
                          zIndex,
                          cursor: isActive ? "pointer" : "grab",
                          touchAction: "manipulation",
                          borderRadius: 14,
                          overflow: "hidden",
                          border: "1px solid rgba(255,255,255,0.06)",
                          boxShadow: isActive
                            ? "0 36px 90px rgba(0,0,0,0.72), 0 6px 18px rgba(0,0,0,0.45)"
                            : "0 8px 22px rgba(0,0,0,0.45)",
                          background: isBadge
                            ? "linear-gradient(180deg,#060606,#090909)"
                            : "#070707",
                          filter: isActive
                            ? "none"
                            : "grayscale(0.06) contrast(0.94)",
                          opacity,
                        }}
                        onClick={() => {
                          if (isActive) setModalCert(c);
                          else bringToFront(i);
                        }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            if (isActive) setModalCert(c);
                            else bringToFront(i);
                          }
                        }}
                        whileHover={hoverMotion}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            position: "relative",
                          }}
                        >
                          {c.image ? (
                            isBadge ? (
                              <BadgeImage src={c.image} alt={c.title} />
                            ) : (
                              <FullCoverImage
                                src={c.image}
                                alt={c.title}
                                interactive={true}
                              />
                            )
                          ) : (
                            <div className="flex items-center justify-center w-full h-full text-cyan-300">
                              No image
                            </div>
                          )}

                          {!isActive && (
                            <div
                              aria-hidden
                              style={{
                                position: "absolute",
                                inset: 0,
                                background:
                                  "linear-gradient(180deg, rgba(0,0,0,0.0) 10%, rgba(0,0,0,0.36) 100%)",
                                pointerEvents: "none",
                                mixBlendMode: "normal",
                              }}
                            />
                          )}

                          <div
                            className="absolute bottom-0 left-0 right-0 px-4 py-4"
                            style={{
                              background:
                                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.72) 100%)",
                            }}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 24,
                    transform: "translateX(-50%)",
                    width: Math.min(cardSize.w * 0.86, 700),
                    height: 36,
                    borderRadius: 999,
                    background:
                      "radial-gradient(closest-side, rgba(0,0,0,0.56), rgba(0,0,0,0.0))",
                    pointerEvents: "none",
                    zIndex: 40,
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-center gap-3 mt-6">
              {CERTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`w-3 h-3 rounded-full ${
                    i === index ? "bg-cyan-400" : "bg-white/10"
                  }`}
                  aria-label={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          </section>
        </div>
      </div>

      <CertModal cert={modalCert} onClose={() => setModalCert(null)} />
    </main>
  );
}
