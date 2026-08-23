// src/app/professional/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { AiOutlineDownload } from "react-icons/ai";

// dynamic background + solar preview (client-only)
const DynamicCosmic = dynamic(
  () => import("@/app/components/DynamicCosmic"),
  { ssr: false }
);
const SolarPreview = dynamic(
  () => import("@/app/components/orbit/SolarPreview"),
  { ssr: false }
);

// smaller building-block components (from your repo)
import SkillPanel from "./components/SkillPanel";
import ProjectsCarousel from "./components/ProjectsCarousel";
import ExperienceTimeline from "./components/ExperienceTimeline";
import FooterBar from "./components/FooterBar";

/* ---------------------------
   Typing text helper component
   - respects prefers-reduced-motion
   - simple, dependency-free implementation
   --------------------------- */
function TypingText({
  text,
  speed = 30,
  className = "",
  cursor = true,
}: {
  text: string;
  speed?: number;
  className?: string;
  cursor?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState<string>(reduceMotion ? text : "");
  const idxRef = useRef(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // Reduced motion: show the finished text immediately. Returning early
    // without setting it left the summary paragraph permanently empty.
    if (reduceMotion) {
      setVisible(text);
      return undefined;
    }

    // reset
    idxRef.current = 0;
    setVisible("");

    const tick = () => {
      idxRef.current += 1;
      setVisible(text.slice(0, idxRef.current));

      if (idxRef.current < text.length) {
        timerRef.current = window.setTimeout(tick, speed);
      }
    };

    timerRef.current = window.setTimeout(tick, speed);

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [text, speed, reduceMotion]);

  return (
    // Announce the finished string once rather than on every character tick.
    <span className={`typing-text ${className}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
      {visible}
      {cursor && !reduceMotion && (
        <span className="typing-cursor" aria-hidden>
          ▍
        </span>
      )}
      </span>
      <style jsx>{`
        .typing-text {
          white-space: pre-wrap;
        }
        .typing-cursor {
          display: inline-block;
          margin-left: 6px;
          transform: translateY(-2px);
          animation: blink 1s steps(2, start) infinite;
        }
        @keyframes blink {
          to {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
}

/**
 * Page-level motion configuration
 *
 * - `staggerChildren` is used to reveal groups in a pleasing sequence.
 * - timings chosen to feel snappy but not twitchy (0.16 - 0.44s range).
 */
const pageVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.46,
      // use a named easing to satisfy motion-dom typings
      ease: "easeOut",
    },
  },
};

const subtleScale: Variants = {
  hidden: { opacity: 0, y: 6, scale: 0.992 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      // let motion pick spring behaviour; no explicit `type` to keep types happy
      stiffness: 160,
      damping: 16,
      mass: 0.45,
    },
  },
};

/* ---------------------------
   Sample data (same as your project)
   --------------------------- */
const SKILL_GROUPS = [
  {
    title: "AI & Machine Learning",
    items: [
      { name: "Deep Learning", score: 92 },
      { name: "NLP", score: 94 },
      { name: "LLMs", score: 90 },
      { name: "Transformers", score: 88 },
      { name: "Reinforcement Learning", score: 72 },
      { name: "Multi-Agent Systems", score: 66 },
    ],
  },
  {
    title: "MLOps & Deployment",
    items: [
      { name: "CI/CD", score: 86 },
      { name: "Docker", score: 90 },
      { name: "Kubernetes", score: 72 },
      { name: "Azure DevOps", score: 88 },
      { name: "A/B Testing", score: 80 },
    ],
  },
  {
    title: "Data Engineering",
    items: [
      { name: "FAISS", score: 82 },
      { name: "Pandas / NumPy", score: 90 },
      { name: "SQL Optimization", score: 86 },
      { name: "Data Pipelines", score: 84 },
    ],
  },
  {
    title: "Tools & Frameworks",
    items: [
      { name: "LangChain", score: 86 },
      { name: "Hugging Face", score: 89 },
      { name: "PyTorch", score: 90 },
      { name: "TensorFlow", score: 78 },
      { name: "scikit-learn", score: 88 },
    ],
  },
];

const TIMELINE = [
  {
    id: "navikenz-fulltime",
    company: "Navikenz",
    role: "Software Engineer — AI/ML & Cloud",
    period: "Oct 2025 – Present",
    detail:
      "Full-time AI/ML and cloud engineering: production model integration, RAG pipelines and Azure deployment.",
    logo: "/education/navikenz-intern.png",
    bullets: [
      "Production LLM and RAG systems on Azure",
      "MLOps: containerized delivery and CI/CD",
    ],
  },
  {
    id: "navikenz-intern",
    company: "Navikenz",
    role: "Software Engineer (Intern)",
    period: "Mar 2025 – Sep 2025",
    detail:
      "7-month internship: backend services, model integration, data pipelines. Promoted to full-time Oct 2025.",
    logo: "/education/navikenz-intern.png",
    bullets: ["Designed ML pipelines on Azure", "Built RAG retrieval using FAISS"],
  },
  {
    id: "futurense",
    company: "Futurense",
    role: "Data Science Intern",
    period: "Jun 2024 – Aug 2024",
    detail:
      "Worked on LLM prototypes, SQL optimization and data visualizations.",
    logo: "/education/futurense.png",
    bullets: ["NLP preprocessing", "EDA & dashboards"],
  },
  {
    id: "capabl",
    company: "Capabl",
    role: "Full Stack Intern",
    period: "Jul 2023 – Aug 2023",
    detail: "Frontend-backend integration and DB schema design.",
    logo: "/education/capabl.png",
    bullets: ["Schema design", "API integration"],
  },
];

// Strongly type PROJECTS so metrics is Record<string, string>
const PROJECTS: {
  id: string;
  title: string;
  desc: string;
  tech: string[];
  metrics: Record<string, string>;
}[] = [
  {
    id: "minddocs",
    title: "MindDocs AI — Document Intelligence (Navikenz)",
    desc:
      "Multi-modal doc intelligence: summarization, translation, RAG chatbots. Azure Blob + LangChain + Hugging Face embeddings. Containerized with CI/CD.",
    tech: ["LangChain", "Hugging Face", "Azure Blob", "Docker"],
    metrics: { "Accuracy uplift": "18%" },
  },
  {
    id: "tourist-buddy",
    title: "Tourist Buddy — AI Trip & Vacation Planner",
    desc:
      "Agentic AI system for personalized trip planning: budget-based itineraries, day-wise scheduling, route mapping, and expenditure estimation. Built with open-source LLMs (Gorq), weather + maps APIs, DuckDuckGo search, web scraping, and LangChain/LangGraph workflow orchestration.",
    tech: [
      "LangChain",
      "LangGraph",
      "FastAPI",
      "React.js",
      "Open-source LLMs",
      "Weather & Maps API",
    ],
    metrics: { "End-to-end automation": "Yes" },
  },
  {
    id: "aiims",
    title: "AIIMS Resident Manual Chatbot",
    desc:
      "Custom LLM chatbot achieving 92% domain accuracy using FAISS and fine-tuned models.",
    tech: ["FAISS", "RAG", "PyTorch"],
    metrics: { Accuracy: "92%" },
  },
  {
    id: "legal-sage",
    title: "Legal Sage (Summarization)",
    desc:
      "BERT / T5 summarization and structured extraction for legal workflows.",
    tech: ["BERT", "T5", "Keras"],
    metrics: { "Multi-lang": "Yes" },
  },
];

const CERTS = [
  {
    title: "Microsoft Certified: Azure AI Fundamentals (AI-900)",
    img: "/education/ai-900.png",
    url:
      "https://www.credly.com/badges/5e43b189-902b-426a-ba0a-5a141908cfb5/linked_in?t=saugaq",
  },
  {
    title: "Microsoft Certified: Azure AI Engineer Associate (AI-102)",
    img: "/education/ai-102.png",
    url:
      "https://learn.microsoft.com/en-us/users/kumarshivrajbhakat-7771/credentials/c516dbfcc6b92838",
  },
  {
    title: "Navikenz internship",
    img: "/education/navikenz-intern.png",
    url:
      "https://drive.google.com/file/d/19GwKBgWsVqE0u6fDeGkpQ6wa8WkHCThK/view",
  },
  {
    title: "Futurense Internship Certificate",
    img: "/education/futurense.png",
    url:
      "https://drive.google.com/file/d/1DxPI33iw-Xk-_z5puOTJ8-D9J_zwfcL8/view?usp=sharing",
  },
];

function IconButton({
  onClick,
  children,
  label,
}: {
  onClick: () => void;
  children: React.ReactNode;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="grid transition-transform border rounded-full shadow-lg w-11 h-11 place-items-center bg-cyan-400/95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
    >
      {children}
    </button>
  );
}

export default function ProfessionalPage() {
  const reduceMotion = useReducedMotion();

  // small local state for modals / accessibility if needed later
  const [showDetailsFor, setShowDetailsFor] = useState<string | null>(null);

  useEffect(() => {
    if (reduceMotion) {
      // If reduceMotion true, we might want to reduce the number of animated effects
      // (ProjectsCarousel component will respect its own useReducedMotion)
    }
  }, [reduceMotion]);

  const summaryText = `AI/ML Engineer with experience designing, developing and deploying cloud-based ML pipelines and deep learning models at production scale. Skilled in transformer architectures, LangChain, Hugging Face and production MLOps.`;

  return (
    <main className="relative min-h-screen px-6 py-10 overflow-hidden bg-[#041014] text-cyan-50">
      {/* --- Canvas background (the dynamic cosmic background you provided) --- */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <DynamicCosmic />
      </div>

      {/* --- Page content container (z-index above canvas) --- */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto"
        initial="hidden"
        animate="show"
        variants={pageVariants}
      >
        {/* PAGE HEADING: Professional Summary */}
        <motion.div variants={fadeUp} className="mb-6">
          <h2 className="text-xl font-semibold tracking-wide text-cyan-200">
            Professional Summary
          </h2>
        </motion.div>

        {/* =======================
            Header (left: solar preview, right: text + actions)
           ======================= */}
        <motion.header
          className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 items-start"
          variants={fadeUp}
        >
          <motion.div variants={subtleScale} className="w-full">
            <div className="p-2 overflow-hidden border rounded-2xl border-cyan-400/6 bg-black/20">
              {/* Solar preview — interactive 3D-ish element */}
              <SolarPreview scale={0.88} height="340px" />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="pt-4 md:pt-1">
            <motion.h1
              variants={fadeUp}
              className="text-3xl font-extrabold md:text-4xl text-cyan-100"
            >
              Kumar Shivraj Bhakat
            </motion.h1>

            <motion.div
              variants={fadeUp}
              className="mt-2 text-lg text-cyan-200"
            >
              AI/ML Engineer · Bengaluru, India
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="max-w-3xl mt-4 leading-relaxed text-cyan-200/80"
            >
              {/* Typing effect applied here */}
              <TypingText text={summaryText} speed={28} />
            </motion.p>

            <motion.div variants={fadeUp} className="flex gap-3 mt-5">
              <motion.a
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                href="/Kumar_Shivraj_Bhakat_Resume.docx"
                download
                className="inline-flex items-center gap-2 px-4 py-2 font-semibold text-black rounded bg-cyan-400"
                aria-label="Download resume"
              >
                <AiOutlineDownload /> Download Resume
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                href="https://github.com/i-m-alive"
                className="px-4 py-2 border rounded border-cyan-400/8"
              >
                GitHub
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.03 }}
                href="https://www.linkedin.com/in/kumar-shivraj-bhakat-6403b7236"
                className="px-4 py-2 border rounded border-cyan-400/8"
              >
                LinkedIn
              </motion.a>
            </motion.div>
          </motion.div>
        </motion.header>

        {/* =======================
            Main three-column grid
           ======================= */}
        <motion.section
          className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr_360px]"
          variants={pageVariants}
        >
          {/* LEFT column */}
          <motion.div variants={fadeUp} className="space-y-6">
            {/* Skill panel (component handles its own motion / transitions) */}
            <div className="max-w-[420px]">
              <SkillPanel groups={SKILL_GROUPS} />
            </div>

            {/* Projects carousel — arrows rendered above the cards by the component */}
            <div className="max-w-[420px]">
              {/* ProjectsCarousel contains its own motion/variants and will respect reduced-motion */}
              <ProjectsCarousel projects={PROJECTS} />
            </div>
          </motion.div>

          {/* CENTER column: timeline (highest z to overlay right column popovers) */}
          <motion.div
            variants={fadeUp}
            className="relative z-40 overflow-visible"
          >
            <ExperienceTimeline entries={TIMELINE} />
          </motion.div>

          {/* RIGHT column: Quick facts + certifications (lower z so timeline popovers sit above) */}
          <motion.aside
            variants={fadeUp}
            className="relative z-10 space-y-6"
          >
            <motion.div
              className="p-4 border rounded-2xl border-cyan-400/6 bg-black/20"
              whileHover={{ translateY: -3 }}
              transition={{ stiffness: 160, damping: 16 }}
            >
              <h3 className="text-lg font-semibold">Quick Facts</h3>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div className="p-3 border rounded bg-black/25 border-cyan-400/6">
                  <div className="text-xs text-cyan-200/60">Education</div>
                  <div className="mt-1 font-semibold">
                    BTech (AI & ML) — Jain University
                  </div>
                </div>

                <div className="p-3 border rounded bg-black/25 border-cyan-400/6">
                  <div className="text-xs text-cyan-200/60">Graduation</div>
                  <div className="mt-1 font-semibold">
                    Jun 2025 • CGPA 8.20
                  </div>
                </div>

                <div className="p-3 border rounded bg-black/25 border-cyan-400/6">
                  <div className="text-xs text-cyan-200/60">Contact</div>
                  <div className="mt-1 font-semibold">+91 8329788136</div>
                </div>

                <div className="p-3 border rounded bg-black/25 border-cyan-400/6">
                  <div className="text-xs text-cyan-200/60">Email</div>
                  <div className="mt-1 font-semibold break-words">
                    bhakatshivraj2@gmail.com
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="p-4 border rounded-2xl border-cyan-400/6 bg-black/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.12, duration: 0.42, ease: "easeOut" }}
            >
              <h3 className="text-lg font-semibold">Certifications</h3>

              <div className="mt-3 space-y-3">
                {CERTS.map((c) => (
                  <motion.a
                    key={c.title}
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 p-3 border rounded bg-black/30 border-white/6"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div style={{ width: 56, height: 56, position: "relative" }}>
                      <Image
                        src={c.img}
                        alt={c.title}
                        fill
                        style={{ objectFit: "contain" }}
                      />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{c.title}</div>
                      <div className="text-xs text-cyan-200/60">
                        View certificate
                      </div>
                    </div>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.aside>
        </motion.section>

        {/* Footer (small animation on load) */}
        <motion.div variants={fadeUp} className="mt-10">
          <FooterBar />
        </motion.div>
      </motion.div>

      {/* ============================================
          Accessibility & keyboard behaviour notes:
          - ProjectsCarousel uses Arrow keys too (component-level)
          - ExperienceTimeline nodes are keyboard-focusable (component-level)
          - All interactive elements have aria-labels or semantic tags
          ============================================ */}
      <style jsx global>{`
        /* Focus ring is inherited from globals.css (#00e6ff, 13.4:1).
           A page-scoped override here previously set rgba(3,218,197,0.14),
           which composited to 1.29:1 — effectively invisible. */

        /* make sure the background canvas always sits behind content */
        .dynamic-cosmic {
          z-index: 0;
        }

        /* optionally limit card widths for smaller screens to avoid overflow */
        @media (max-width: 1024px) {
        }
      `}</style>
    </main>
  );
}
