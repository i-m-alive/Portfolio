// src/app/projects/ProjectsSection.tsx
"use client";

import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from "framer-motion";
import {
  AiOutlineSearch,
  AiOutlineStar,
  AiFillGithub,
} from "react-icons/ai";
import {
  SiPytorch,
  SiTensorflow,
  SiKubernetes,
  SiDocker,
  SiLangchain,
} from "react-icons/si";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import clsx from "clsx";

// IMPORTANT: make sure you have `"resolveJsonModule": true` in tsconfig
import projectsData from "@/data/projects.json";

// --- Dynamic client-only components ---
const SolarPreview = dynamic(
  () => import("@/app/components/orbit/SolarPreview"),
  { ssr: false }
);
const DynamicCosmic = dynamic(
  () => import("@/app/components/DynamicCosmic"),
  { ssr: false }
);

// --------------------
// Types
// --------------------
export type Project = {
  slug: string;
  title: string;
  short?: string;
  excerpt?: string;
  desc?: string;
  cover?: string;
  images?: string[];
  tech?: string[];
  status?: string;
  featured?: boolean;
  category?: string;
  metric?: string;
  ops?: string;
  architecture?: string[];
  github?: string;
  recommendations?: string[];
  related?: string[];
};

const jsonProjects = projectsData as unknown as Project[];

const DEFAULT_PROJECTS: Project[] =
  Array.isArray(jsonProjects) && jsonProjects.length > 0
    ? jsonProjects
    : [
        {
          slug: "minddocs",
          title: "MindDocs AI",
          short: "Multi-modal doc intelligence",
          desc: "",
          tech: ["LangChain", "Hugging Face"],
          featured: true,
          category: "LLM / RAG",
          metric: "18% uplift",
          recommendations: ["aiims"],
          github: "https://github.com/your/minddocs",
        },
      ];

const CATEGORY_ORDER = ["AI/ML", "MLOps", "Data Engineering", "LLM / RAG"];

const CATEGORY_COLORS: Record<string, string> = {
  "AI/ML": "from-cyan-400 to-teal-300",
  MLOps: "from-blue-400 to-indigo-400",
  "Data Engineering": "from-purple-400 to-pink-400",
  "LLM / RAG": "from-green-400 to-emerald-300",
};

// ---------------------------
// SpotlightSearch
// ---------------------------
function SpotlightSearch(props: {
  value: string;
  onChange: (v: string) => void;
  suggestions: string[];
  onPick: (s: string) => void;
}) {
  const { value, onChange, suggestions, onPick } = props;
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    setOpen(value.trim().length > 0);
  }, [value]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-3xl mx-auto">
      <div
        className={clsx(
          "flex items-center gap-3 px-4 py-3 rounded-2xl border bg-black/35 border-white/6 shadow-sm",
          open ? "ring-2 ring-cyan-400/30" : "hover:ring-1 hover:ring-white/8"
        )}
      >
        <AiOutlineSearch className="text-cyan-300" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder="Search projects, tech or keywords (e.g. LangChain, CI/CD)"
          className="flex-1 text-sm bg-transparent outline-none text-cyan-100 placeholder:text-cyan-300/60"
          aria-label="Search projects"
        />
        <button
          type="button"
          onClick={() => (value ? onPick(value) : onChange("RAG"))}
          aria-label="Execute search"
          className="px-3 py-1 text-sm font-semibold text-black rounded-md bg-cyan-400/90"
        >
          Search
        </button>
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: reduced ? 0 : 0.16 },
            }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute left-0 right-0 z-50 p-1 mt-2 overflow-auto border shadow-lg max-h-48 rounded-xl bg-black/90 border-white/6"
          >
            {suggestions.slice(0, 8).map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => onPick(s)}
                  className="w-full px-3 py-2 text-sm text-left rounded hover:bg-white/4 text-cyan-100"
                >
                  {s}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------
// FloatingCategoryDock
// ---------------------------
function FloatingCategoryDock(props: {
  categories: string[];
  active: string | null;
  onSelect: (c: string) => void;
}) {
  const { categories, active, onSelect } = props;
  if (!categories.length) return null;

  return (
    <nav className="fixed right-6 top-[35%] z-40 hidden flex-col gap-3 md:flex pointer-events-auto">
      {categories.map((c) => {
        const isActive = active === c;
        return (
          <button
            key={c}
            type="button"
            onClick={() => onSelect(c)}
            className={clsx(
              "flex items-center gap-3 px-3 py-2 rounded-full border backdrop-blur-sm transition-transform",
              isActive
                ? "bg-gradient-to-r from-cyan-400 to-teal-300 text-black shadow-lg"
                : "bg-black/30 border-white/6 text-cyan-100 hover:scale-105"
            )}
            title={c}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-300" />
            <span className="text-sm font-medium">{c}</span>
          </button>
        );
      })}
    </nav>
  );
}

// ---------------------------
// TechPills
// ---------------------------
function TechPills(props: {
  techList: string[];
  active: string | null;
  onToggle: (t: string | null) => void;
  maxVisible?: number;
}) {
  const { techList, active, onToggle, maxVisible = 8 } = props;
  const [expanded, setExpanded] = useState(false);

  const mapIcon = (t: string) => {
    if (/pytorch/i.test(t)) return <SiPytorch />;
    if (/tensor/i.test(t)) return <SiTensorflow />;
    if (/kube|kubernetes/i.test(t)) return <SiKubernetes />;
    if (/docker/i.test(t)) return <SiDocker />;
    if (/langchain/i.test(t)) return <SiLangchain />;
    return <AiOutlineStar />;
  };

  const visible = expanded ? techList : techList.slice(0, maxVisible);
  const hiddenCount = Math.max(0, techList.length - maxVisible);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {visible.map((t) => {
        const isActive = active === t;
        return (
          <button
            key={t}
            type="button"
            onClick={() => onToggle(isActive ? null : t)}
            className={clsx(
              "flex items-center gap-2 px-3 py-1 rounded-full text-sm border transition-all",
              isActive
                ? "bg-gradient-to-r from-cyan-400 to-teal-300 text-black shadow"
                : "bg-black/20 border-white/6 text-cyan-200/80 hover:bg-black/30"
            )}
            aria-pressed={isActive}
          >
            <span className="text-lg">{mapIcon(t)}</span>
            <span>{t}</span>
          </button>
        );
      })}

      {hiddenCount > 0 && !expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex items-center gap-2 px-3 py-1 text-sm border rounded-full bg-black/10 border-white/6 text-cyan-200/80 hover:bg-black/20"
          aria-label={`Show ${hiddenCount} more technologies`}
        >
          +{hiddenCount} more
        </button>
      )}

      {expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(false)}
          className="flex items-center gap-2 px-3 py-1 text-sm border rounded-full bg-black/10 border-white/6 text-cyan-200/80 hover:bg-black/20"
          aria-label="Show fewer technologies"
        >
          Show fewer
        </button>
      )}
    </div>
  );
}

// ---------------------------
// ProjectCard
// ---------------------------
function ProjectCard(props: {
  p: Project;
  onOpen: (p: Project) => void;
  layoutId: string;
}) {
  const { p, onOpen, layoutId } = props;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, r: 0 });
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = cardRef.current;
    if (!el || reduced) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const rx = Math.max(-8, Math.min(8, (dy / rect.height) * 10));
      const ry = Math.max(-10, Math.min(10, (dx / rect.width) * 10));
      setTilt({ x: rx, y: ry, r: ry / 3 });
    };

    const onLeave = () => setTilt({ x: 0, y: 0, r: 0 });

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [reduced]);

  const handleOpen = () => onOpen(p);

  const onKey = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  const metricLine = p.metric ? (
    <div className="mt-2 text-xs text-cyan-200/60">{p.metric}</div>
  ) : null;
  const excerpt = p.excerpt ?? p.short ?? "";

  return (
    <motion.article
      ref={cardRef}
      layoutId={`card-${layoutId}`}
      whileHover={!reduced ? { scale: 1.02 } : {}}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 160, damping: 18 }}
      className="relative w-full p-4 border shadow-xl rounded-2xl border-white/8"
      style={{
        background:
          "linear-gradient(180deg, rgba(6,10,13,0.9), rgba(6,7,12,0.95))",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotateZ(${tilt.r}deg)`,
        willChange: "transform",
        zIndex: 20,
        cursor: "pointer",
      }}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={onKey}
      aria-label={`Open project ${p.title}`}
    >
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{
          boxShadow:
            "0 14px 40px rgba(34,197,94,0.04), inset 0 1px 0 rgba(255,255,255,0.02)",
        }}
      />

      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-16 h-12 overflow-hidden border rounded-md bg-black/20 border-white/6">
          {p.cover ? (
            <Image
              src={p.cover}
              alt={p.title}
              width={160}
              height={108}
              style={{ objectFit: "cover" }}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-xs text-cyan-100/70">
              cover
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className="text-base font-semibold leading-tight truncate text-cyan-50">
                {p.title}
              </h4>
              <div className="mt-1 text-xs break-words text-cyan-200/70 line-clamp-3">
                {excerpt}
              </div>
            </div>

            <div className="ml-3 shrink-0" aria-hidden />
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {(p.tech || [])
              .slice(0, 6)
              .map((t) => (
                <span
                  key={t}
                  className="px-2 py-1 text-xs border rounded-full border-white/6 bg-white/2 text-cyan-100/90"
                >
                  {t}
                </span>
              ))}
          </div>

          {metricLine}

          <div className="flex items-center justify-between mt-3">
            <div className="text-xs text-cyan-200/70">{p.category}</div>

            <div className="flex items-center gap-3">
              {p.github && (
                <a
                  href={p.github}
                  onClick={(e) => e.stopPropagation()}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-3 py-1 text-sm font-semibold border rounded-md bg-white/5 border-white/6 text-cyan-100 hover:bg-white/8"
                  aria-label={`Open GitHub repo for ${p.title}`}
                >
                  <AiFillGithub />
                  <span className="text-xs">Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

// ---------------------------
// ProjectModal (case-study modal)
// ---------------------------
function ProjectModal(props: {
  project: Project | null;
  onClose: () => void;
}) {
  const { project, onClose } = props;
  useReducedMotion(); // currently no special handling, but kept for future tweaks

  if (!project) return null;

  const related = project.recommendations ?? project.related ?? [];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6 sm:px-6"
      aria-modal="true"
      role="dialog"
      aria-labelledby={`proj-${project.slug}-title`}
    >
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <motion.div
        layoutId={`card-${project.slug}`}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ type: "spring", stiffness: 220, damping: 22 }}
        className="relative z-10 w-full max-w-3xl md:max-w-4xl mx-auto rounded-2xl border border-white/6 bg-gradient-to-b from-[#06080C]/95 to-[#040609]/98"
        style={{ boxShadow: "0 30px 80px rgba(2,6,10,0.6)" }}
      >
        {/* Header */}
        <div className="flex flex-col gap-3 px-4 pt-4 pb-2 sm:px-6 sm:pt-6 sm:pb-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start w-full gap-4">
            <div className="flex-shrink-0 w-[92px] h-[70px] sm:w-[140px] sm:h-[110px] rounded-md overflow-hidden border bg-black/20 border-white/6">
              {project.cover ? (
                <Image
                  src={project.cover}
                  alt={project.title}
                  width={320}
                  height={180}
                  style={{
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs text-cyan-100/70">
                  cover
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3
                id={`proj-${project.slug}-title`}
                className="text-lg font-semibold truncate sm:text-2xl text-cyan-100"
              >
                {project.title}
              </h3>
              <div className="mt-1 text-xs truncate sm:text-sm text-cyan-200/70">
                {project.category ?? ""}
                {project.metric ? (
                  <span className="hidden sm:inline">
                    {" "}
                    · {project.metric}
                  </span>
                ) : null}
              </div>
              {project.ops && (
                <div className="mt-1 text-[11px] sm:text-xs text-cyan-200/60 line-clamp-2">
                  {project.ops}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 mt-2 sm:mt-0 sm:items-start sm:flex-col sm:justify-start">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center justify-center w-full gap-2 px-3 py-2 text-sm rounded-md sm:w-auto bg-white/6 hover:bg-white/8"
              >
                <AiFillGithub />
                <span>View Code</span>
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-full px-3 py-2 text-sm rounded-md sm:w-auto bg-white/6 hover:bg-white/8"
            >
              Close
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mx-4 bg-white/6 sm:mx-6" />

        {/* Body */}
        <div className="px-4 pb-4 sm:px-6 sm:pb-6">
          <div className="max-h-[60vh] sm:max-h-[65vh] overflow-auto pr-2">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Overview + tech */}
              <div>
                <h4 className="text-sm font-semibold text-cyan-100">
                  Overview
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-cyan-200/80">
                  {project.desc ?? project.excerpt ?? project.short}
                </p>

                <h4 className="mt-4 text-sm font-semibold text-cyan-100">
                  Tech &amp; Tools
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {(project.tech || []).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-1 text-xs border rounded-md bg-black/10 border-white/6"
                    >
                      {t}
                    </span>
                  ))}
                  {(!project.tech || project.tech.length === 0) && (
                    <div className="text-xs text-cyan-200/70">—</div>
                  )}
                </div>
              </div>

              {/* Architecture / results */}
              <div>
                <h4 className="text-sm font-semibold text-cyan-100">
                  Architecture / Results
                </h4>

                <div className="mt-2 text-sm text-cyan-200/80">
                  {project.architecture && project.architecture.length > 0 ? (
                    <ul className="ml-4 space-y-2 list-disc">
                      {project.architecture.map((line, i) => (
                        <li
                          key={i}
                          className="text-sm leading-relaxed"
                        >
                          {line}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-cyan-200/70">
                      Architecture details not provided.
                    </div>
                  )}

                  <div className="mt-3 text-sm text-cyan-200/70 space-y-1">
                    <div>
                      <strong className="text-xs text-cyan-100">
                        Key metric:
                      </strong>
                      <span className="ml-1">
                        {project.metric ?? "—"}
                      </span>
                    </div>
                    {project.ops && (
                      <div>
                        <strong className="text-xs text-cyan-100">
                          Ops:
                        </strong>
                        <span className="ml-1">{project.ops}</span>
                      </div>
                    )}
                  </div>
                </div>

                <h4 className="mt-4 text-sm font-semibold text-cyan-100">
                  Related
                </h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {related.length > 0 ? (
                    related.map((r) => (
                      <span
                        key={r}
                        className="px-3 py-1 text-sm border rounded-full bg-black/20 border-white/6"
                      >
                        {r}
                      </span>
                    ))
                  ) : (
                    <div className="text-sm text-cyan-200/70">—</div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-4 sm:hidden" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// ---------------------------
// PinnedStrip
// ---------------------------
function PinnedStrip(props: {
  items: Project[];
  onOpen: (p: Project) => void;
}) {
  const { items, onOpen } = props;
  if (!items || !items.length) return null;

  return (
    <div className="my-6">
      <h3 className="mb-3 text-xl font-semibold text-cyan-100">
        Pinned Projects
      </h3>
      <div className="flex gap-3 py-2 overflow-x-auto">
        {items.map((p) => (
          <div key={p.slug} className="min-w-[280px]">
            <motion.div
              whileHover={{ y: -6 }}
              className="p-3 border rounded-lg bg-black/20 border-white/6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-cyan-200/70">
                    {p.category}
                  </div>
                  <div className="mt-1 font-semibold text-cyan-100">
                    {p.title}
                  </div>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => onOpen(p)}
                    className="px-3 py-1 text-black rounded-md bg-cyan-400"
                  >
                    Open
                  </button>
                </div>
              </div>
              <div className="mt-3 text-sm text-cyan-200/80">
                {p.excerpt ?? p.short}
              </div>
              {p.metric && (
                <div className="mt-2 text-xs text-cyan-200/60">
                  {p.metric}
                </div>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------
// Main ProjectsSection
// ---------------------------
export default function ProjectsSection() {
  const allProjects = useMemo(() => DEFAULT_PROJECTS, []);
  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [openProject, setOpenProject] = useState<Project | null>(null);
  const [activeCategoryOnDock, setActiveCategoryOnDock] =
    useState<string | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const suggestions = [
    "RAG Projects",
    "MLOps Projects",
    "LangChain",
    "Fine-tuning",
    "FAISS",
    "CI/CD",
  ];

  const allTechs = useMemo(() => {
    const s = new Set<string>();
    allProjects.forEach((p) =>
      (p.tech || []).forEach((t) => s.add(t))
    );
    return Array.from(s).sort();
  }, [allProjects]);

  const pinned = allProjects.filter((p) => p.featured).slice(0, 4);

  const filtered = useMemo(
    () =>
      allProjects.filter((p) => {
        const q = query.toLowerCase();
        const passQuery =
          !q ||
          p.title.toLowerCase().includes(q) ||
          (p.short || "").toLowerCase().includes(q) ||
          (p.desc || "").toLowerCase().includes(q) ||
          (p.excerpt || "").toLowerCase().includes(q);
        const passTech =
          !techFilter || (p.tech || []).includes(techFilter);
        const passCat = !categoryFilter || p.category === categoryFilter;
        return passQuery && passTech && passCat;
      }),
    [allProjects, query, techFilter, categoryFilter]
  );

  const categories = useMemo(() => {
    const set = new Set(
      allProjects.map((p) => p.category).filter(Boolean) as string[]
    );
    return CATEGORY_ORDER.filter((c) => set.has(c));
  }, [allProjects]);

  // Dock category highlight based on scroll
  useEffect(() => {
    if (!categories || !categories.length) return;
    if (typeof window === "undefined") return;

    const observers: IntersectionObserver[] = [];

    categories.forEach((cat) => {
      const el = document.querySelector<HTMLElement>(
        `[data-cat="${cat}"]`
      );
      if (!el) return;
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) setActiveCategoryOnDock(cat);
          });
        },
        { root: null, threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [categories]);

  return (
    <section
      id="projects"
      className="relative min-h-[80vh] py-20 px-6 md:px-12 lg:px-20"
    >
      {/* cosmic background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
        <DynamicCosmic />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* header row */}
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-cyan-100">
              Projects
            </h1>
            <p className="max-w-2xl mt-2 text-sm text-cyan-200/70">
              Selected case studies and code — click a card to open a
              case-study modal.
            </p>

            <div className="mt-6">
              <SpotlightSearch
                value={query}
                onChange={setQuery}
                suggestions={suggestions}
                onPick={(s) => setQuery(s)}
              />
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <div className="min-w-[220px] flex-1">
                <TechPills
                  techList={allTechs}
                  active={techFilter}
                  onToggle={setTechFilter}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setTechFilter(null);
                    setCategoryFilter(null);
                  }}
                  className="px-3 py-1 border rounded-md bg-black/20 border-white/6 text-cyan-100/90 text-sm"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Solar preview on the right */}
          <div className="hidden w-52 md:block shrink-0">
            <div className="p-2 border rounded-xl border-white/6 bg-black/30">
              <div className="overflow-hidden" style={{ height: 250 }}>
                <SolarPreview scale={0.6} height="250px" />
              </div>
            </div>
          </div>
        </div>

        {/* pinned strip */}
        <PinnedStrip
          items={pinned}
          onOpen={(p) => setOpenProject(p)}
        />

        {/* category filter pills */}
        <div className="flex flex-wrap gap-3 mt-6">
          {categories.map((c) => {
            const active = categoryFilter === c;
            const color =
              CATEGORY_COLORS[c] ?? "from-cyan-400 to-teal-300";
            return (
              <button
                key={c}
                type="button"
                onClick={() =>
                  setCategoryFilter(active ? null : c)
                }
                className={clsx(
                  "px-4 py-2 rounded-full text-sm font-medium border transition",
                  active
                    ? `bg-gradient-to-r ${color} text-black`
                    : "bg-black/20 border-white/6 text-cyan-200/80"
                )}
              >
                {c}
              </button>
            );
          })}
        </div>

        {/* featured carousel */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xl font-semibold text-cyan-100">
              Featured AI Projects
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCarouselIndex((i) => Math.max(0, i - 1))
                }
                aria-label="Previous featured project"
                className="p-2 border rounded-full bg-black/20 border-white/6"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCarouselIndex((i) =>
                    Math.min(Math.max(0, pinned.length - 1), i + 1)
                  )
                }
                aria-label="Next featured project"
                className="p-2 border rounded-full bg-black/20 border-white/6"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>

          <div className="overflow-hidden">
            <motion.div
              className="flex gap-4"
              animate={{ x: -carouselIndex * 336 }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            >
              {pinned.map((p, i) => (
                <div
                  key={p.slug}
                  className="min-w-[320px]"
                  aria-hidden={i !== carouselIndex ? "true" : undefined}
                >
                  <button
                    type="button"
                    onClick={() => setOpenProject(p)}
                    className="w-full text-left cursor-pointer"
                  >
                    <div className="p-4 border rounded-xl border-white/6 bg-black/20">
                      <div className="text-sm text-cyan-200/70">
                        {p.category}
                      </div>
                      <div className="mt-2 font-semibold text-cyan-100">
                        {p.title}
                      </div>
                      <div className="mt-2 text-sm text-cyan-200/80">
                        {p.excerpt ?? p.short}
                      </div>
                      <div className="flex gap-2 mt-3">
                        {(p.tech || [])
                          .slice(0, 4)
                          .map((t) => (
                            <span
                              key={t}
                              className="px-2 py-1 text-xs border rounded bg-black/25"
                            >
                              {t}
                            </span>
                          ))}
                      </div>
                      {p.metric && (
                        <div className="mt-2 text-xs text-cyan-200/60">
                          {p.metric}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* project grid */}
        <div className="grid grid-cols-1 gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && (
            <div className="p-6 border rounded-lg col-span-full border-white/6 bg-black/20 text-cyan-200">
              No projects match your filters.
            </div>
          )}

          {filtered.map((p) => (
            <div key={p.slug} data-cat={p.category ?? ""}>
              <ProjectCard
                p={p}
                onOpen={(pp) => setOpenProject(pp)}
                layoutId={p.slug}
              />
            </div>
          ))}
        </div>

        {/* recommended sets */}
        <div className="mt-10">
          <h4 className="mb-3 text-lg font-semibold text-cyan-100">
            Recommended sets
          </h4>
          <div className="flex gap-3 py-2 overflow-x-auto">
            <div className="min-w-[280px] rounded-lg border p-3 bg-black/20 border-white/6">
              <div className="text-sm text-cyan-200/70">
                Because you viewed RAG
              </div>
              <div className="mt-2 font-semibold text-cyan-100">
                MindDocs AI
              </div>
            </div>
            <div className="min-w-[280px] rounded-lg border p-3 bg-black/20 border-white/6">
              <div className="text-sm text-cyan-200/70">Popular</div>
              <div className="mt-2 font-semibold text-cyan-100">
                AIIMS Resident Manual
              </div>
            </div>
          </div>
        </div>

        <div className="h-20" />
      </div>

      <FloatingCategoryDock
        categories={categories}
        active={activeCategoryOnDock}
        onSelect={(c) => {
          setCategoryFilter(c);
          if (typeof window !== "undefined") {
            const el =
              document.querySelector<HTMLElement>(
                `[data-cat="${c}"]`
              );
            if (el) {
              el.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }
        }}
      />

      <AnimatePresence>
        {openProject && (
          <ProjectModal
            project={openProject}
            onClose={() => setOpenProject(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
