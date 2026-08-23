// src/app/education/bookPages.tsx
"use client";

import React from "react";
import Image from "next/image";
import { Maximize2 } from "lucide-react";

/**
 * Content model for the education book.
 *
 * Extracted from EducationBookModal because the modal used to map indices to
 * content with two switch statements — one for left pages (even indices), one
 * for right pages (odd). Any index the wrong switch received fell through to a
 * "—" placeholder, which is exactly what the flip animation rendered on its
 * back face on every single turn. A flat, gap-free array makes that class of
 * bug unrepresentable: every index 0..PAGE_COUNT-1 has real content.
 */

export type PageContext = {
  /** Opens the full-screen document viewer. */
  onOpenImage: (src: string, alt: string) => void;
  /** Jumps the book to the spread holding `page`. */
  onGoToPage: (page: number) => void;
};

export type BookPage = {
  /** Used by the contents list and the screen-reader spread announcement. */
  label: string;
  render: (ctx: PageContext) => React.ReactNode;
};

/* ------------------------------------------------------------------ shared */

const H = "text-base md:text-lg font-bold tracking-tight text-cyan-100";
const EYEBROW =
  "text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-300/55";
const BODY = "mt-3 text-sm leading-relaxed text-cyan-100/70 md:text-[15px]";

type Milestone = {
  /** Page this milestone lives on — contents and timeline both link to it. */
  page: number;
  chapter: string;
  title: string;
  /** Compact descriptor for the contents list. */
  short: string;
  institution: string;
  facts: [string, string][];
  scoreLabel: string;
  score: string;
  year: string;
  doc: { src: string; alt: string; caption: string };
};

/**
 * Single source of truth for the academic record: the chapter pages and the
 * closing timeline both read from here, so a score cannot drift between them.
 */
const MILESTONES: Milestone[] = [
  {
    page: 3,
    chapter: "Chapter 1",
    title: "Foundations",
    short: "10th Grade",
    institution: "Shirinbai Neterwala School",
    facts: [
      ["Qualification", "Secondary — 10th Grade"],
      ["Board", "CBSE"],
      ["Year of pass out", "2018"],
    ],
    scoreLabel: "Percentage",
    score: "84.6%",
    year: "2018",
    doc: {
      src: "/education/10th-marksheet.png",
      alt: "Class 10 CBSE marksheet",
      caption: "CBSE Class 10 marksheet",
    },
  },
  {
    page: 4,
    chapter: "Chapter 2",
    title: "Advancement",
    short: "12th Grade",
    institution: "Shirinbai Neterwala School",
    facts: [
      ["Qualification", "Higher Secondary — 12th Grade"],
      ["Board", "CBSE"],
      ["Stream", "Physics, Chemistry, Mathematics"],
      ["Year of pass out", "2020"],
    ],
    scoreLabel: "Percentage",
    score: "92.2%",
    year: "2020",
    doc: {
      src: "/education/12th-marksheet.png",
      alt: "Class 12 CBSE marksheet",
      caption: "CBSE Class 12 marksheet",
    },
  },
  {
    page: 5,
    chapter: "Chapter 3",
    title: "Engineering",
    short: "B.Tech CSE",
    institution: "JAIN (Deemed-to-be University)",
    facts: [
      ["Degree", "B.Tech — Computer Science & Engineering"],
      ["Specialization", "Artificial Intelligence & Machine Learning"],
      ["Year of pass out", "2025"],
    ],
    scoreLabel: "CGPA",
    score: "8.20",
    year: "2025",
    doc: {
      src: "/education/degree-certificate.png",
      alt: "B.Tech degree certificate",
      caption: "B.Tech degree certificate",
    },
  },
];

/* -------------------------------------------------------------- components */

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 py-[3px]">
      <dt className="shrink-0 text-cyan-300/50">{label}</dt>
      <dd className="min-w-0 text-cyan-100/85">{value}</dd>
    </div>
  );
}

function Score({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2.5 px-3 py-2 mt-4 border rounded-lg border-cyan-400/15 bg-cyan-400/[0.04]">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-cyan-300/60">
        {label}
      </span>
      <span className="text-xl font-bold tabular-nums text-cyan-100 md:text-2xl">
        {value}
      </span>
    </div>
  );
}

/**
 * Document thumbnail.
 *
 * The box height is a fixed pixel value per breakpoint, NOT an aspect ratio.
 * With `aspect-ratio: 4/3` the thumbnail height was a function of the page
 * width (392px wide -> 294px tall), which pushed the chapter pages ~37px past
 * the page box while the short pages sat well inside it. The result was a
 * scrollbar that appeared only on some pages, so the text column width — and
 * with it the whole page — visibly changed from one turn to the next.
 */
function DocumentThumb({
  doc,
  onOpenImage,
}: {
  doc: Milestone["doc"];
  onOpenImage: PageContext["onOpenImage"];
}) {
  return (
    <figure className="mt-4">
      <button
        type="button"
        onClick={() => onOpenImage(doc.src, doc.alt)}
        aria-label={`Enlarge ${doc.alt}`}
        className="relative block w-full overflow-hidden transition-colors border rounded-lg group border-cyan-400/15 bg-black/40 hover:border-cyan-300/45 focus-visible:border-cyan-300/60"
      >
        <div className="relative h-36 md:h-50">
          <Image
            src={doc.src}
            alt={doc.alt}
            fill
            sizes="(max-width: 768px) 78vw, 320px"
            className="p-1"
            style={{ objectFit: "contain" }}
          />
        </div>
        <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/85 to-transparent px-2 py-1.5 text-[11px] text-transparent transition-colors group-hover:text-cyan-100/90 group-focus-visible:text-cyan-100/90">
          <Maximize2 size={11} aria-hidden="true" /> Enlarge
        </span>
      </button>
      <figcaption className="mt-1.5 text-[11px] text-cyan-200/45">
        {doc.caption}
      </figcaption>
    </figure>
  );
}

function ChapterPage({
  m,
  onOpenImage,
}: {
  m: Milestone;
  onOpenImage: PageContext["onOpenImage"];
}) {
  return (
    <div>
      <p className={EYEBROW}>
        {m.chapter} · {m.year}
      </p>
      <h3 className={`${H} mt-1.5`}>{m.title}</h3>
      <p className="mt-1 text-[13px] text-cyan-200/60">{m.institution}</p>

      <dl className="mt-4 text-[13px] md:text-sm">
        {m.facts.map(([label, value]) => (
          <Fact key={label} label={label} value={value} />
        ))}
      </dl>

      <Score label={m.scoreLabel} value={m.score} />
      <DocumentThumb doc={m.doc} onOpenImage={onOpenImage} />
    </div>
  );
}

/* ------------------------------------------------------------------- pages */

export const BOOK_PAGES: BookPage[] = [
  /* 0 — frontispiece */
  {
    label: "Title",
    render: () => (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="relative w-24 h-24 overflow-hidden border rounded-full border-cyan-300/25 md:h-32 md:w-32">
          <Image
            src="/education/profile.png"
            alt="Kumar Shivraj Bhakat"
            fill
            sizes="128px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <h2 className="mt-4 text-lg font-bold tracking-tight text-cyan-100 md:text-xl">
          Kumar Shivraj Bhakat
        </h2>
        <p className="mt-1 text-[13px] text-cyan-200/60">AI / ML Engineer</p>
        <p className="mt-0.5 text-[12px] text-cyan-200/40">Bengaluru, India</p>
        <div className="w-16 h-px mt-5 bg-cyan-300/25" aria-hidden="true" />
        <p className={`${EYEBROW} mt-4`}>A Visual Education Book</p>
      </div>
    ),
  },

  /* 1 — contents */
  {
    label: "Contents",
    render: ({ onGoToPage }) => (
      <div>
        <p className={EYEBROW}>Contents</p>
        <h3 className={`${H} mt-1.5`}>What this book holds</h3>

        <ol className="mt-4 space-y-1">
          {[
            { label: "Introduction", page: 2 },
            ...MILESTONES.map((m) => ({
              label: `${m.title} · ${m.short}`,
              page: m.page,
            })),
            { label: "Summary", page: 6 },
            { label: "At a glance", page: 7 },
          ].map((entry, i) => (
            <li key={entry.page}>
              <button
                type="button"
                onClick={() => onGoToPage(entry.page)}
                className="group flex w-full items-baseline gap-2 rounded px-1 py-1 text-left text-[13px] transition-colors hover:bg-cyan-400/[0.06] md:text-sm"
              >
                <span className="tabular-nums text-cyan-300/45">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-cyan-100/80 group-hover:text-cyan-100">
                  {entry.label}
                </span>
                <span
                  className="self-center flex-1 h-px mx-1 min-w-3 bg-cyan-300/15"
                  aria-hidden="true"
                />
                <span className="tabular-nums text-[11px] text-cyan-300/40">
                  p.{entry.page + 1}
                </span>
              </button>
            </li>
          ))}
        </ol>
      </div>
    ),
  },

  /* 2 — introduction */
  {
    label: "Introduction",
    render: () => (
      <div>
        <p className={EYEBROW}>Introduction</p>
        <h3 className={`${H} mt-1.5`}>How this book reads</h3>
        <p className={BODY}>
          I am Kumar Shivraj Bhakat, a Computer Science graduate specializing in
          Artificial Intelligence &amp; Machine Learning, now working as an
          AI/ML Engineer.
        </p>
        <p className={BODY}>
          The chapters that follow trace my academic record in order — secondary
          school, higher secondary, then engineering — each with the original
          marksheet or certificate attached. Tap any document to read it at full
          size.
        </p>
      </div>
    ),
  },

  /* 3, 4, 5 — the three chapters */
  ...MILESTONES.map((m) => ({
    label: `${m.chapter} — ${m.title}`,
    render: ({ onOpenImage }: PageContext) => (
      <ChapterPage m={m} onOpenImage={onOpenImage} />
    ),
  })),

  /* 6 — summary */
  {
    label: "Summary",
    render: () => (
      <div>
        <p className={EYEBROW}>Summary</p>
        <h3 className={`${H} mt-1.5`}>Closing note</h3>
        <p className={BODY}>
          Consistent academic performance through secondary and higher secondary
          education, culminating in a B.Tech in Computer Science &amp;
          Engineering with a focus on AI &amp; ML.
        </p>
        <p className={BODY}>
          Every score on the preceding pages is backed by the scanned document
          alongside it — nothing here is summarised without its source.
        </p>
      </div>
    ),
  },

  /* 7 — at a glance (replaces the dead "—" half of the old last spread) */
  {
    label: "At a glance",
    render: ({ onGoToPage }) => (
      <div>
        <p className={EYEBROW}>At a glance</p>
        <h3 className={`${H} mt-1.5`}>Three milestones</h3>

        <ol className="mt-5 space-y-0">
          {MILESTONES.map((m, i) => (
            <li key={m.page} className="relative flex gap-3 pb-5 last:pb-0">
              {i < MILESTONES.length - 1 && (
                <span
                  className="absolute left-[5px] top-3 bottom-0 w-px bg-cyan-300/20"
                  aria-hidden="true"
                />
              )}
              <span
                className="mt-1.5 h-[11px] w-[11px] shrink-0 rounded-full border border-cyan-300/50 bg-cyan-400/25"
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <button
                  type="button"
                  onClick={() => onGoToPage(m.page)}
                  className="text-left group"
                >
                  <span className="flex items-baseline gap-2">
                    <span className="tabular-nums text-[11px] font-semibold text-cyan-300/60">
                      {m.year}
                    </span>
                    <span className="text-[13px] font-semibold text-cyan-100/85 underline decoration-cyan-300/0 underline-offset-2 transition group-hover:decoration-cyan-300/50 md:text-sm">
                      {m.title}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[12px] text-cyan-200/50">
                    {m.institution}
                  </span>
                </button>
                <span className="mt-1 inline-block text-[12px] tabular-nums text-cyan-100/70">
                  {m.scoreLabel} {m.score}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    ),
  },
];

export const PAGE_COUNT = BOOK_PAGES.length;
