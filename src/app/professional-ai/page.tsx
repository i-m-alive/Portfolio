// src/app/professional-ai/page.tsx
"use client";

import React, { useEffect, useRef, useState, ReactNode, ReactElement } from "react";

import { motion, useReducedMotion } from "framer-motion";
import NextImage from "next/image";
import dynamic from "next/dynamic";
import { Award } from "lucide-react";
import DynamicCosmic from "@/app/components/DynamicCosmic";

// lazy load interactive solar (client-only)
const HeroSolarClient = dynamic(() => import("@/app/components/orbit/HeroSolar"), {
  ssr: false,
  loading: () => <div style={{ height: 360 }} />,
});
const SolarPreview = dynamic(() => import("@/app/components/orbit/SolarPreview"), {
  ssr: false,
  loading: () => <div style={{ height: 360 }} />,
});

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center px-3 py-2 bg-white/3 rounded-lg border border-white/6 min-w-[96px]">
      <div className="text-xs text-white/70">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}

/* helper: normalize certificate URL for iframe embedding */
function normalizeCertUrl(url: string) {
  if (!url) return url;
  try {
    const u = new URL(url);
    if (u.hostname.includes("drive.google.com")) {
      const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/file/d/${match[1]}/preview`;
      }
      const id = u.searchParams.get("id");
      if (id) {
        return `https://drive.google.com/file/d/${id}/preview`;
      }
    }
    return url;
  } catch {
    return url;
  }
}

/* -------------------------
   Animation variants (Option A: Subtle Pro UI)
   - NOTE: transitions use `duration` only (no string eases) for strict typing
   ------------------------- */
const buildVariants = (reduceMotion: boolean) => {
  if (reduceMotion) {
    const tiny = { hidden: { opacity: 0 }, show: { opacity: 1 } };
    return {
      left: tiny,
      right: tiny,
      up: tiny,
      subtleSpring: tiny,
      staggerContainer: { hidden: {}, show: {} },
    };
  }

  const left = {
    hidden: { opacity: 0, x: -24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.56 } },
    exit: { opacity: 0, x: -12, transition: { duration: 0.32 } },
  } as const;

  const right = {
    hidden: { opacity: 0, x: 24 },
    show: { opacity: 1, x: 0, transition: { duration: 0.56 } },
    exit: { opacity: 0, x: 12, transition: { duration: 0.32 } },
  } as const;

  const up = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.56 } },
    exit: { opacity: 0, y: 12, transition: { duration: 0.32 } },
  } as const;

  const subtleSpring = {
    hidden: { opacity: 0, y: 10, scale: 0.995 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 180, damping: 18, mass: 0.5 },
    },
    exit: { opacity: 0, y: 8, transition: { duration: 0.28 } },
  } as const;

  const staggerContainer = {
    hidden: { opacity: 1 },
    show: { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
  } as const;

  return { left, right, up, subtleSpring, staggerContainer };
};

/* -------------------------
   Certificate Modal
   ------------------------- */
function CertModal({ url, onClose }: { url: string | null; onClose: () => void }) {
  useEffect(() => {
    if (!url) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [url, onClose]);

  if (!url) return null;

  const embed = normalizeCertUrl(url);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Certificate preview"
      className="fixed inset-0 z-[2000] flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} aria-hidden />
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 } as any}
        className="relative w-full max-w-4xl h-[80vh] bg-black/90 rounded-2xl border border-white/6 overflow-hidden shadow-2xl"
      >
        <div className="flex items-center justify-between p-3 border-b border-white/6">
          <div className="text-sm text-white/80">Certificate preview</div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-xs rounded bg-white/6 hover:bg-white/8"
            >
              Open in new tab
            </a>
            <button onClick={onClose} aria-label="Close preview" className="px-3 py-1 text-sm rounded bg-white/6 hover:bg-white/8">
              Close
            </button>
          </div>
        </div>

        <div className="h-full bg-black/85">
          <iframe src={embed} title="Certificate preview" className="w-full h-full border-0" />
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------
   Timeline (logos, progress, modal)
   ------------------------- */
function Timeline({ items, onOpenCert }: { items: any[]; onOpenCert: (url: string) => void }) {
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});
  const [viewed, setViewed] = useState<Record<string, boolean>>({});
  const [visibleId, setVisibleId] = useState<string | null>(null);
  const reduceMotion = !!useReducedMotion();
  const variants = buildVariants(reduceMotion);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setViewed((prev) => {
          const next = { ...prev };
          entries.forEach((e) => {
            const id = e.target.getAttribute("data-id");
            if (!id) return;
            if (e.intersectionRatio >= 0.5) {
              next[id] = true;
              setVisibleId(id);
            }
          });
          return next;
        });
      },
      { threshold: [0.5] }
    );

    Object.values(itemRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  const viewedCount = Object.values(viewed).filter(Boolean).length;
  const progress = items.length === 0 ? 0 : Math.round((viewedCount / items.length) * 100);

  return (
    <section className="relative py-6">
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={variants.staggerContainer as any}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <motion.h3 variants={variants.left as any} className="text-2xl font-semibold">
              Experience — AI/ML & Data Science
            </motion.h3>
            <motion.p variants={variants.left as any} className="mt-1 text-sm text-white/60">
              Timeline of roles, internships and certificates.
            </motion.p>
          </div>

          <div className="items-center hidden gap-4 md:flex">
            <div className="text-sm text-white/60">Timeline progress</div>
            <div className="w-56 h-2 overflow-hidden rounded-full bg-white/6">
              <div className="h-full transition-all rounded-full bg-cyan-400" style={{ width: `${progress}%`, minWidth: "6%" }} aria-hidden />
            </div>
          </div>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute left-6 md:left-12 top-0 bottom-0 w-[2px] bg-white/6" aria-hidden />

        <div className="space-y-8">
          {items.map((it, idx) => {
            const staggerLeft = idx % 2 === 0 ? "pl-14 md:pl-20" : "pl-14 md:pl-24";
            const variant = idx % 2 === 0 ? variants.right : variants.left;

            return (
              <motion.article
                key={it.id}
                data-id={it.id}
                ref={(el) => {
                  itemRefs.current[it.id] = el ?? null;
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.32 }}
                variants={variant as any}
                transition={{ duration: 0.56 }}
                className={`relative ${staggerLeft}`}
                aria-labelledby={`exp-${it.id}`}
              >
                <div className="absolute left-0 flex items-center gap-3 md:left-2 top-2">
                  <motion.div
                    animate={viewed[it.id] ? { scale: [1, 1.18, 1] } : {}}
                    transition={{ repeat: viewed[it.id] ? 1 : 0, duration: 1.1 }}
                    className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${viewed[it.id] ? "bg-cyan-400" : "bg-white/10"} shadow-md`}
                    aria-hidden
                    title={viewed[it.id] ? "Viewed" : "Not viewed"}
                  />

                  {it.logo ? (
                    <button
                      onClick={() => (it.asset ? onOpenCert(it.asset.href) : undefined)}
                      aria-label={`${it.company} logo`}
                      className="items-center justify-center hidden w-10 h-10 p-1 transition border rounded-sm md:inline-flex bg-white/3 border-white/6 hover:scale-105"
                    >
                      <div style={{ width: 48, height: 48, position: "relative", display: "inline-block" }}>
                        <NextImage src={it.logo} alt={`${it.company} logo`} fill sizes="36px" style={{ objectFit: "contain" }} />
                      </div>
                    </button>
                  ) : null}
                </div>

                <motion.div whileHover={reduceMotion ? undefined : ({ translateY: -6, scale: 1.01 } as any)} transition={{ type: "spring", stiffness: 220, damping: 18 } as any} className="rounded-lg" style={{ boxShadow: "0 14px 40px rgba(0,0,0,0.55)" }}>
                  <div id={`exp-${it.id}`} className="p-4 border rounded-lg bg-gradient-to-b from-black/80 to-black/66 md:p-6 border-white/6" style={{ backdropFilter: "blur(6px)" }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-semibold leading-tight text-white md:text-xl">{it.role}</h4>
                          <span className="text-xs text-white/60">· {it.type}</span>
                        </div>

                        <div className="mt-2 text-sm text-white/70">
                          <div className="font-medium text-white/90">{it.company}</div>
                          <div className="mt-1 text-xs text-white/60">{it.location}</div>
                          <div className="inline-flex items-center gap-2 mt-2">
                            <span className="px-2 py-1 text-xs rounded bg-white/6 text-white/80">{it.period}</span>
                          </div>
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-white/80">{it.summary}</p>

                        {it.skills && it.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {it.skills.map((s: string) => (
                              <span key={s} className="px-2 py-1 text-xs border rounded bg-white/6 text-white/90 border-white/6">
                                {s}
                              </span>
                            ))}
                          </div>
                        )}

                        {it.asset && (
                          <div className="mt-3">
                            <button onClick={() => onOpenCert(it.asset.href)} className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300 hover:underline" aria-label={`Open ${it.company} certificate`}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                                <path d="M14 3h7v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M21 21H3V3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              {it.asset.label}
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="hidden md:flex flex-col items-end min-w-[120px]">
                        <div className="text-xs text-white/60">Category</div>
                        <div className="mt-2 font-semibold text-white">{it.category}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* -------------------------
   Deck component (compact)
   - now supports swipe on touch devices
   ------------------------- */
function Deck({
  items,
  renderContent,
}: {
  items: any[];
  renderContent: (item: any, index: number) => ReactElement | null;
}) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);
  const lockRef = useRef(false);
  const moveRef = useRef<(dir: number) => void>(() => {});
  const reduceMotion = !!useReducedMotion();
  const variants = buildVariants(reduceMotion);

  // 👇 touch state for swipe
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const clamp = (v: number) => Math.max(0, Math.min(v, items.length - 1));

  const move = (dir: number) => {
    if (lockRef.current) return;
    lockRef.current = true;
    setIndex((prev) => {
      const next = clamp(prev + dir);
      indexRef.current = next;
      return next;
    });
    window.setTimeout(() => {
      lockRef.current = false;
    }, 320);
  };
  moveRef.current = move;

  // Arrow keys are scoped to this widget: it must contain focus or be
  // hovered. PageUp/PageDown are deliberately NOT bound — they are the
  // primary keyboard page-scroll keys and binding them broke scrolling.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const t = e.target as HTMLElement | null;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      const root = deckRef.current;
      if (!root) return;
      const active =
        root.contains(document.activeElement) || root.matches(":hover");
      if (!active) return;
      e.preventDefault();
      moveRef.current(e.key === "ArrowRight" ? 1 : -1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 👉 swipe handlers (horizontal swipe like mobile card decks)
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
    const THRESHOLD = 40; // px

    // Only trigger on horizontal swipes
    if (absDx > THRESHOLD && absDx > absDy) {
      if (dx < 0) {
        // swipe left => next card
        move(1);
      } else {
        // swipe right => previous card
        move(-1);
      }
    }

    touchStartRef.current = null;
  };

  const atStart = index === 0;
  const atEnd = index === items.length - 1;
  const ARROW_Z = 1200;

  return (
    <div ref={deckRef} className="flex items-center justify-center w-full">
      <div
        className="relative h-[420px] w-full max-w-4xl flex items-center justify-center select-none"
        style={{ overflow: "visible" }}
        // 👇 swipe region for phone users
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <button
          aria-label="Previous"
          onClick={() => move(-1)}
          disabled={atStart}
          style={{ zIndex: ARROW_Z, pointerEvents: "auto" }}
          className={`absolute left-0 md:left-[-56px] top-1/2 -translate-y-1/2 rounded-full p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ${
            atStart
              ? "opacity-30 cursor-not-allowed"
              : "bg-white/6 hover:bg-white/10"
          }`}
        >
          <span className="sr-only">Previous</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M15 6L9 12L15 18"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          aria-label="Next"
          onClick={() => move(1)}
          disabled={atEnd}
          style={{ zIndex: ARROW_Z, pointerEvents: "auto" }}
          className={`absolute right-0 md:right-[-56px] top-1/2 -translate-y-1/2 rounded-full p-3 md:p-4 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ${
            atEnd
              ? "opacity-30 cursor-not-allowed"
              : "bg-white/6 hover:bg-white/10"
          }`}
        >
          <span className="sr-only">Next</span>
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden
          >
            <path
              d="M9 6L15 12L9 18"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {items.map((item: any, i: number) => {
          const offset = i - index;
          if (offset < -5 || offset > 5) return null;
          const isActive = offset === 0;

          const rotate = isActive ? 0 : offset * 8.5;
          const x = offset * 24;
          const y = isActive ? 0 : offset * -14;
          const scale =
            isActive ? 1 : 0.94 - Math.min(0.03, Math.abs(offset) * 0.008);
          const blur = isActive ? "none" : "blur(2px)";
          const cardZ = 200 - Math.abs(offset) * 10;

          const content: React.ReactNode = renderContent(
            item,
            i
          ) as React.ReactNode | null;

          return (
            <motion.div
              key={(item as any).id ?? i}
              initial={
                reduceMotion
                  ? ({} as any)
                  : ({ opacity: 0, y: 12 } as any)
              }
              animate={
                {
                  rotate,
                  x,
                  y,
                  scale,
                  filter: blur,
                  opacity: isActive ? 1 : 0.22,
                } as any
              }
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 16,
              } as any}
              style={{ zIndex: cardZ, pointerEvents: "auto" }}
              className="absolute"
            >
              <div className="w-[320px] md:w-[380px] lg:w-[440px]">
                <motion.div
                  whileHover={
                    isActive && !reduceMotion
                      ? ({ translateY: -6 } as any)
                      : undefined
                  }
                  className="rounded-2xl border border-white/12 bg-gradient-to-b from-white/6 to-white/5 shadow-2xl"
                  style={{
                    padding: 6,
                    boxShadow: isActive
                      ? "0 18px 36px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.02)"
                      : "0 10px 26px rgba(0,0,0,0.5)",
                  }}
                  role="group"
                >
                  <div
                    className="overflow-hidden rounded-xl"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(0,0,0,0.78), rgba(0,0,0,0.62))",
                      padding: 18,
                      minHeight: 220,
                      width: "100%",
                    }}
                  >
                    <motion.div
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, amount: 0.25 }}
                      variants={
                        isActive
                          ? (variants.subtleSpring as any)
                          : (variants.up as any)
                      }
                    >
                      <div className="relative z-10">{content}</div>
                    </motion.div>

                    <div
                      aria-hidden
                      style={{
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(0,0,0,0.12) 100%)",
                        mixBlendMode: "overlay",
                        borderRadius: 12,
                      }}
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          );
        })}

        <div className="absolute z-40 flex gap-2 -translate-x-1/2 bottom-4 left-1/2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to ${i + 1}`}
              className={`w-2 h-2 rounded-full transition ${
                i === index ? "bg-cyan-400" : "bg-white/10"
              }`}
              style={{ pointerEvents: "auto" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Card contents
   ------------------------- */
function ProjectCardContent({ p }: { p: any }): ReactElement{
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-lg font-bold leading-tight text-white md:text-xl drop-shadow-md">{p.title}</h3>

        <div className="mt-2">
          <p className="text-sm leading-relaxed text-white/85 line-clamp-5">{p.desc}</p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {p.tech?.map((t: string) => (
            <span key={t} className="px-2 py-1 text-xs border rounded bg-white/10 border-white/10 text-white/90">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-5 border-t border-white/6">
        <div className="space-y-1 text-sm text-white/80">
          {p.metrics ? (
            Object.entries(p.metrics).map(([k, v]) => (
              <div key={k}>
                <div className="text-xs text-white/60">{k}</div>
                <div className="font-semibold text-white">{String(v)}</div>
              </div>
            ))
          ) : (
            <div className="text-xs text-white/60">No metrics</div>
          )}
        </div>
      </div>
    </div>
  );
}

function ModelCardContent({ m }: { m: any }) : ReactElement {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <h3 className="text-lg font-bold leading-tight text-white md:text-xl drop-shadow-md">{m.title}</h3>

        <div className="mt-2">
          <p className="text-sm leading-relaxed text-white/85 line-clamp-4">{m.desc}</p>
        </div>

        <ul className="pl-5 mt-3 space-y-1 text-sm list-disc text-white/80">
          {m.details?.map((d: string, idx: number) => (
            <li key={idx}>{d}</li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between pt-3 mt-5 border-t border-white/6">
        <div className="text-sm text-white/80">
          <div className="text-xs text-white/60">Latency</div>
          <div className="font-semibold text-white">{m.latency}</div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Main Page (single default export)
   ------------------------- */
export default function ProfessionalAIPage() {
  const name = "Kumar Shivraj Bhakat";
  const resumeLink = "/Kumar_Shivraj_Bhakat_Resume.docx";
  const certifications = ["Microsoft Azure AI-102", "Microsoft Azure AI-900", "Python Programming Certification"];

  const roles = ["AI/ML Engineer", "Deep Learning & NLP Specialist", "Graphite & Charcoal Artist", "Rapper & Lyricist", "Sports Enthusiast"];
  const [roleIndex, setRoleIndex] = useState<number>(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = window.setTimeout(() => {
      setStarted(true);
      setRoleIndex(0);
      const id = window.setInterval(() => setRoleIndex((i) => (i + 1) % roles.length), 2000);
      (window as any).__roleInterval = id;
    }, 2000);

    return () => {
      clearTimeout(startTimer as unknown as number);
      const id = (window as any).__roleInterval;
      if (id) clearInterval(id);
    };
  }, [roles.length]);

  const featured = [
    {
      id: "minddocs",
      title: "MindDocs AI — Document Intelligence Platform (Navikenz)",
      desc:
        "Multi-modal document intelligence: summarization, translation, and domain-specific RAG chatbots. Integrated Azure Blob + LangChain + Hugging Face embeddings. Containerized services with CI/CD.",
      tech: ["LangChain", "Hugging Face", "Azure Blob", "Docker", "Azure Container Apps"],
      href: "/projects/minddocs-ai",
      metrics: { "Accuracy uplift": "18% (domain models)" },
    },
    {
      id: "tourist-buddy",
      title: "Tourist Buddy — AI-powered Trip & Vacation Planner",
      desc:
        "Agentic AI travel planner that generates personalized itineraries, budget-optimized plans, route maps, weather-aware scheduling, and daily expenditure estimates. Built with open-source LLMs (Gorq), LangChain/LangGraph workflows, and integrated weather + maps APIs, DuckDuckGo search, and web scraping.",
      tech: [
        "LangChain",
        "LangGraph",
        "FastAPI",
        "React.js",
        "Open-source LLMs",
        "Weather API",
        "Maps API",
        "DuckDuckGo Search",
        "Web Scraping"
      ],
      href: "/projects/tourist-buddy",
      metrics: { "End-to-end planning": "Automated" },
    },
    {
      id: "aiims",
      title: "AIIMS Resident Manual — Domain-specific Chatbot",
      desc:
        "Custom LLM chatbot for AIIMS resident manual (healthcare domain). Achieved 92% domain accuracy with FAISS-backed RAG retrieval.",
      tech: ["FAISS", "RAG", "Transformer fine-tuning"],
      href: "/projects/aiims-chatbot",
      metrics: { Accuracy: "92%" },
    },
    {
      id: "legal-sage",
      title: "Legal Sage — Legal Document Summarization",
      desc:
        "Fine-tuned BERT, GPT-2, and T5 for summarization & translation workflows. Added structured extraction pipelines used in legal workflows.",
      tech: ["BERT", "T5", "Data Extraction"],
      href: "/projects/legal-sage",
      metrics: { "Multi-lang support": "Yes" },
    },
  ];

  const modelCards = [
    {
      id: "bert-domain",
      title: "BERT — Domain Classifier",
      desc: "Fine-tuned BERT for domain classification; productionized in Azure pipeline.",
      details: ["Dataset: ~30k labeled domain examples (internal)", "Training: AdamW, lr=2e-5, batch=32, 3 epochs", "Eval: F1 = 0.87; improved domain accuracy by ~18% vs baseline"],
      latency: "~120 ms",
    },
    {
      id: "llama-rag",
      title: "LLaMA RAG Agent",
      desc: "Retrieval-augmented generation with chunking, dense retrieval and rerankers.",
      details: ["Retriever: FAISS", "Pipeline: chunk → embed → retrieve → generate", "Ops: Hugging Face endpoints / Azure"],
      latency: "150-220 ms (depending on model)",
    },
  ];

  const experiences = [
    {
      id: "navikenz-ft",
      company: "Navikenz",
      role: "Software Engineer",
      type: "Full-time",
      period: "Oct 2025 - Present",
      location: "Bengaluru, Karnataka, India · On-site",
      summary: "Promoted to full-time Software Engineer after a successful 7-month internship. Building AI-driven solutions and agentic AI projects to deliver production impact.",
      skills: ["AIML", "Artificial Intelligence (AI)", "Data Science"],
      category: "AI/ML",
      logo: "/navikenz.png",
    },
    {
      id: "navikenz-intern",
      company: "Navikenz",
      role: "Software Engineer",
      type: "Internship",
      period: "Mar 2025 - Sep 2025 · 7 mos",
      location: "Bengaluru, Karnataka, India · Hybrid",
      summary: "Completed a 7-month internship focused on productionizing ML models and data workflows for domain-specific applications.",
      skills: ["AIML", "Data Visualization"],
      category: "AI/ML",
      logo: "/navikenz.png",
      asset: {
        href: "https://drive.google.com/file/d/19GwKBgWsVqE0u6fDeGkpQ6wa8WkHCThK/view?usp=sharing",
        label: "Navikenz Internship Certificate (Drive)",
      },
    },
    {
      id: "futurense",
      company: "Futurense Technologies",
      role: "Intern",
      type: "Internship",
      period: "Jun 2024 - Aug 2024 · 3 mos",
      location: "On-site",
      summary: "Worked as a software engineering intern focusing on Python-based tooling, exploratory data analysis, and automation.",
      skills: ["Python (Programming Language)", "EDA"],
      category: "Data Science",
      logo: "/futurense.png",
      asset: {
        href: "https://drive.google.com/file/d/1DxPI33iw-Xk-_z5puOTJ8-D9J_zwfcL8/view?usp=sharing",
        label: "Futurense Internship Certificate (Drive)",
      },
    },
  ];

  const [modalUrl, setModalUrl] = useState<string | null>(null);
  const reduceMotion = !!useReducedMotion();
  const variants = buildVariants(reduceMotion);

  return (
    <main className="relative min-h-screen px-6 py-12 overflow-hidden text-white bg-gradient-to-b from-black/88 to-black/96 md:px-12 lg:px-24">
      <DynamicCosmic />
      <div className="relative z-10 max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <header className="flex flex-col items-stretch w-full gap-4 md:flex-row">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.22 }} variants={variants.staggerContainer as any} className="flex-shrink-0 w-full md:w-[380px] lg:w-[440px]">
            <motion.div variants={variants.left as any} className="h-full">
              <SolarPreview scale={0.88} />
            </motion.div>
          </motion.div>

          <div className="flex flex-col justify-center flex-1">
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.22 }} variants={variants.staggerContainer as any}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {/* Page heading */}
                  <motion.h1 variants={variants.left as any} className="text-3xl font-bold leading-tight md:text-4xl">
                    AIML Career
                  </motion.h1>

                  <motion.h2 variants={variants.up as any} className="mt-1 text-lg text-cyan-300">
                    {name}
                  </motion.h2>

                  <div className="mt-2">
                    {started ? (
                      <motion.h3 key={roleIndex} variants={variants.up as any} initial="hidden" animate="show" transition={{ duration: 0.6 } as any} className="text-base text-white/80">
                        {roles[roleIndex]}
                      </motion.h3>
                    ) : (
                      <div className="h-5" />
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <motion.div variants={variants.right as any}>
                    <Stat label="Projects" value={featured.length} />
                  </motion.div>
                  <motion.div variants={variants.right as any}>
                    <Stat label="Certs" value={certifications.length} />
                  </motion.div>
                </div>
              </div>

              <motion.div variants={variants.up as any} className="max-w-md mt-4">
                <div className="p-3 border bg-white/3 rounded-2xl border-white/6">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center w-10 h-10 overflow-hidden bg-black rounded-full">
                      <div className="flex items-center justify-center w-10 h-10">
                        <span className="sr-only">Certificate icon</span>
                        <Award size={28} aria-hidden className="text-yellow-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 text-sm font-semibold text-white/70">Certifications</div>
                      <ul className="pl-5 space-y-1 text-sm list-disc text-white/80">
                        {certifications.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </header>

        {/* EXPERIENCE TIMELINE */}
        <Timeline items={experiences} onOpenCert={(u) => setModalUrl(u)} />

        {/* PROJECTS - DECK VIEW */}
        <motion.section id="projects" className="space-y-3" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={variants.staggerContainer as any}>
          <motion.h3 variants={variants.left as any} className="mb-2 text-2xl font-semibold">
            Featured AI Projects
          </motion.h3>

          <Deck items={featured} renderContent={(item: any) => <ProjectCardContent p={item} />} />
        </motion.section>

        {/* MODEL CARDS (deck) */}
        <motion.section className="space-y-3" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={variants.staggerContainer as any}>
          <motion.h3 variants={variants.left as any} className="mb-2 text-2xl font-semibold">
            Model Cards & Technical Notes
          </motion.h3>

          <Deck items={modelCards} renderContent={(item: any) => <ModelCardContent m={item} />} />
        </motion.section>

        {/* INFRA & MLOPS */}
        <motion.section className="space-y-4" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.22 }} variants={variants.staggerContainer as any}>
          <motion.h3 variants={variants.left as any} className="text-2xl font-semibold">
            Infrastructure & MLOps
          </motion.h3>
          <motion.div variants={variants.up as any} className="p-4 border bg-white/3 rounded-2xl border-white/6">
            <p className="text-sm text-white/70">Production & deployment notes (summary of the practices I used while building & shipping models).</p>

            <div className="grid grid-cols-1 gap-4 mt-3 md:grid-cols-2">
              <div>
                <h4 className="font-semibold">Cloud & Hosting</h4>
                <ul className="pl-5 mt-2 text-sm list-disc text-white/70">
                  <li>Azure Blob Storage for large document storage (MindDocs AI)</li>
                  <li>Azure Container Apps / Docker for containerized service hosting</li>
                  <li>AWS (S3 & EC2) for experimentation & batch jobs</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold">MLOps</h4>
                <ul className="pl-5 mt-2 text-sm list-disc text-white/70">
                  <li>CI/CD with Azure DevOps / GitHub Actions (automated image builds; model deployment triggers)</li>
                  <li>FAISS vector store for fast similarity search in RAG pipelines</li>
                  <li>Monitoring: logging, A/B testing, performance evaluation</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.section>

        {/* CTA */}
        <motion.section className="mt-4 mb-16" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} variants={variants.up as any}>
          <div className="flex items-center justify-between p-5 border bg-gradient-to-tr from-white/6 to-white/4 rounded-2xl border-white/6">
            <div>
              <div className="text-sm text-white/70">Interested in collaborating?</div>
              <div className="mt-1 text-lg font-semibold">Let’s build production-grade AI systems together.</div>
            </div>

            <div className="flex items-center gap-3">
              <a href="/contact" className="px-4 py-2 font-semibold text-black rounded bg-cyan-500/90">
                Contact Me
              </a>
              <a href={resumeLink} download className="px-4 py-2 border rounded bg-white/6">
                Download Resume
              </a>
            </div>
          </div>
        </motion.section>
      </div>

      {/* certificate modal */}
      <CertModal url={modalUrl} onClose={() => setModalUrl(null)} />
    </main>
  );
}
