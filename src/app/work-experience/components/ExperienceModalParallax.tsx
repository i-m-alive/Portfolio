// src/app/education/components/ExperienceModalParallax.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export type Exp = {
  id: string;
  company: string;
  title: string;
  type?: string;
  period?: string;
  location?: string;
  summary?: string;
  skills?: string[];
  previewImg?: string;
  avatar?: string;
  companyLogo?: string;
  attachment?: string;
};

export default function ExperienceModalParallax({
  exp,
  onClose,
}: {
  exp: Exp | null;
  onClose: () => void;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const layerRefs = useRef<HTMLDivElement[]>([]);

  /* ---------- parallax ---------- */
  useEffect(() => {
    if (!rootRef.current) return;
    const root = rootRef.current;

    function handleMove(e: MouseEvent | TouchEvent) {
      let clientX = 0,
        clientY = 0;
      if (e instanceof TouchEvent) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as MouseEvent).clientX;
        clientY = (e as MouseEvent).clientY;
      }
      const { left, top, width, height } = root.getBoundingClientRect();
      const nx = (clientX - left) / width - 0.5;
      const ny = (clientY - top) / height - 0.5;

      layerRefs.current.forEach((el, idx) => {
        if (!el) return;
        const depth = (idx + 1) / (layerRefs.current.length + 1);
        const tx = -nx * (6 + depth * 12);
        const ty = -ny * (4 + depth * 8);
        const rz = nx * (4 * depth);
        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotateZ(${rz}deg)`;
      });
    }

    function handleLeave() {
      layerRefs.current.forEach((el) => {
        if (el) el.style.transform = "";
      });
    }

    root.addEventListener("mousemove", handleMove);
    root.addEventListener("touchmove", handleMove, { passive: true });
    root.addEventListener("mouseleave", handleLeave);
    root.addEventListener("touchend", handleLeave);

    return () => {
      root.removeEventListener("mousemove", handleMove);
      root.removeEventListener("touchmove", handleMove as any);
      root.removeEventListener("mouseleave", handleLeave);
      root.removeEventListener("touchend", handleLeave as any);
    };
  }, []);

  if (!exp) return null;

  /* ---------- data / derived fields ---------- */
  const companyAvatarMap: Record<string, string> = {
    Navikenz: "/models/avatar1.png",
    "Futurense Technologies": "/models/avatar3.png",
    Futurense: "/models/avatar3.png",
    "Capabl India": "/models/avatar2.png",
    Capabl: "/models/avatar2.png",
  };

  const avatarBackground =
    exp.avatar ??
    companyAvatarMap[exp.company] ??
    exp.previewImg ??
    "/models/avatar1.png";

  const resumeDescription =
    "AI/ML Engineer with experience designing, developing, and deploying ML pipelines and deep learning models. Skilled in Transformer architectures, RAG pipelines (LangChain / Hugging Face), production MLOps (Docker, Azure/AWS), and building scalable model integrations.";

  const resumeSkills = [
    "APIs",
    "Docker",
    "ML Ops",
    "Deep Learning",
    "NLP",
    "LLMs",
    "Transformers",
    "RAG / LangChain",
    "Hugging Face",
    "PyTorch",
    "TensorFlow",
    "MLOps",
    "Azure",
    "AWS",
    "Python",
    "REST APIs",
    "Data Pipelines",
    "Model Serving",
  ];

  const mergedSkills = (() => {
    const seen = new Set<string>();
    const out: string[] = [];
    (exp.skills ?? []).forEach((s) => {
      const t = s.trim();
      if (t && !seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    });
    resumeSkills.forEach((s) => {
      const t = s.trim();
      if (t && !seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    });
    return out;
  })();

  const displaySummary =
    exp.summary && exp.summary.trim().length ? exp.summary : resumeDescription;
  const displaySkills = mergedSkills;
  const skillsCount = displaySkills.length;

  const yearStat = (() => {
    const m = (exp.period || "").match(/\b(19|20)\d{2}\b/);
    return m ? Number(m[0]) : new Date().getFullYear();
  })();

  const certLinks: { label: string; url: string }[] = [];
  if (exp.company === "Navikenz" && /Intern/i.test(exp.title)) {
    certLinks.push({
      label: "Navikenz internship certificate",
      url: "https://drive.google.com/file/d/19GwKBgWsVqE0u6fDeGkpQ6wa8WkHCThK/view",
    });
  }
  if (exp.company.includes("Futurense")) {
    certLinks.push({
      label: "Futurense internship certificate",
      url: "https://drive.google.com/file/d/1DxPI33iw-Xk-_z5puOTJ8-D9J_zwfcL8/view",
    });
  }
  if (exp.company.includes("Capabl")) {
    certLinks.push({
      label: "Capabl internship certificate",
      url: "https://drive.google.com/file/d/1fDks3bgCS22VGnErsQ1DY5uZFQ4WWBE1/view?usp=sharing",
    });
  }

  const logoSize =
    exp.company === "Navikenz" || exp.company.includes("Capabl") ? 80 : 56;

  /* ---------- UI ---------- */
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(6px)" }}
    >
      <div
        ref={rootRef}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[520px]"
      >
        {/* soft blur decoration */}
        <div
          ref={(el) => {
            if (el) layerRefs.current[0] = el;
          }}
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div
            style={{
              position: "absolute",
              right: -60,
              top: -40,
              width: 260,
              height: 360,
              borderRadius: 14,
              background:
                "radial-gradient(circle at 20% 20%, rgba(6,246,255,0.03), transparent 30%)",
              filter: "blur(18px)",
            }}
          />
        </div>

        {/* main card */}
        <div
          ref={(el) => {
            if (el) layerRefs.current[1] = el;
          }}
          className="relative flex max-h-[90vh] flex-col overflow-hidden rounded-2xl"
          style={{
            border: "1px solid rgba(6,246,255,0.04)",
            background: "#041014",
            boxShadow: "0 30px 90px rgba(0,0,0,0.85)",
          }}
        >
          {/* background image + gradient */}
          <div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${avatarBackground})`,
              backgroundSize: "contain",
              backgroundPosition: "top center",
              backgroundRepeat: "no-repeat",
              backgroundColor: "#021015",
              filter: "brightness(0.62) contrast(1.05)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 z-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(0,0,0,0.28), rgba(0,0,0,0.9) 78%)",
            }}
          />

          {/* scrollable content */}
          <div className="relative z-10 flex-1 overflow-y-auto px-3 py-4 text-[13px] text-teal-50/95 md:px-4 md:py-5 space-y-4">
            {/* header row */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="rounded-full border px-3 py-1 text-xs font-semibold"
                  style={{
                    background: "rgba(0,0,0,0.45)",
                    borderColor: "rgba(6,246,255,0.08)",
                    color: "#9FF3EE",
                  }}
                >
                  {exp.type || "Role"}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div
                  className="rounded-lg px-3 py-1 text-xs font-semibold tracking-wide"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.5), rgba(6,246,255,0.04))",
                    border: "1px solid rgba(6,246,255,0.18)",
                    color: "#BFFFEF",
                  }}
                >
                  {exp.period}
                </div>

                <div
                  className="flex items-center justify-center rounded-md bg-black/20 p-2"
                  style={{
                    width: logoSize,
                    height: logoSize,
                    border: "1px solid rgba(6,246,255,0.06)",
                  }}
                >
                  {exp.companyLogo ? (
                    <Image
                      src={exp.companyLogo}
                      alt={`${exp.company} logo`}
                      width={logoSize - 16}
                      height={logoSize - 16}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <span className="text-[11px] text-teal-100/70">
                      {exp.company}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* title + company */}
            <div>
              <div className="text-[22px] font-extrabold leading-tight text-teal-50">
                {exp.title}
              </div>
              <div className="mt-2 text-[13px] text-teal-100/80">
                {exp.company}
                {exp.location ? ` · ${exp.location}` : ""}
              </div>
            </div>

            {/* description */}
            <div className="rounded-lg border border-teal-50/5 bg-black/30 p-3 leading-relaxed text-teal-50/90">
              {displaySummary}
            </div>

            {/* stats */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,90,90,0.06), rgba(0,0,0,0.12))",
                    border: "1px solid rgba(255,110,110,0.06)",
                    color: "#FFD8D8",
                    fontWeight: 800,
                  }}
                >
                  {skillsCount}
                </div>
                <span className="text-[13px] text-teal-100/90">Skills</span>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-16 items-center justify-center rounded-xl text-sm font-extrabold"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(90,255,180,0.04), rgba(0,0,0,0.12))",
                    border: "1px solid rgba(80,255,200,0.06)",
                    color: "#BFFFEF",
                  }}
                >
                  {yearStat}
                </div>
                <span className="text-[13px] text-teal-100/90">Year</span>
              </div>
            </div>

            {/* skills chips */}
            <div className="flex flex-wrap gap-2">
              {displaySkills.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-teal-50/10 bg-black/40 px-3 py-1 text-[11px] text-teal-50"
                >
                  {s}
                </span>
              ))}
            </div>

            {/* certificates */}
            {certLinks.length > 0 && (
              <div className="space-y-2">
                <div className="text-[12px] text-teal-100/80">
                  Certificates
                </div>
                <div className="flex flex-col gap-2">
                  {certLinks.map((c) => (
                    <a
                      key={c.url}
                      href={c.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-3 rounded-lg border border-teal-100/15 bg-black/40 px-3 py-2 text-[13px] text-teal-50"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-black/40 text-[11px] text-teal-100/80">
                        PDF
                      </span>
                      <span>{c.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* footer – always visible, not scrolling */}
          <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/5 bg-black/60 px-3 py-3 md:px-4 md:py-4">
            <div>
              {exp.attachment && (
                <a
                  href={exp.attachment}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-teal-50/15 bg-black/40 px-3 py-2 text-[13px] text-teal-50"
                >
                  Open attachment
                </a>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg border border-teal-50/25 bg-black/70 px-4 py-2 text-[13px] font-medium text-teal-50"
            >
              Close
            </button>
          </div>
        </div>

        {/* tiny foreground highlight */}
        <div
          ref={(el) => {
            if (el) layerRefs.current[2] = el;
          }}
          className="pointer-events-none absolute left-8 bottom-8 z-20"
        >
          <div
            style={{
              width: 96,
              height: 28,
              borderRadius: 10,
              background:
                "linear-gradient(90deg, rgba(6,246,255,0.03), rgba(2,30,40,0.03))",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
