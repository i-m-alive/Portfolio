// src/app/education/components/EducationBookModal.tsx
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { BOOK_PAGES, PAGE_COUNT, type PageContext } from "../bookPages";

type Props = { onClose: () => void };

/** Direction and the spread we are leaving. */
type Flip = { dir: "next" | "prev"; from: number };

const FLIP_MS = 620;
const EASE = [0.32, 0.72, 0.28, 1] as const;

const FOCUSABLE =
  'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

/* ---------------------------------------------------------------- viewport */

/**
 * Two-page spread on md+, single page below it. A phone cannot show a readable
 * spread — the old version tried, which is why each half ended up with its own
 * nested scrollbar.
 */
function useIsSpread() {
  // Read the real value up front. The modal only ever mounts on the client (it
  // renders behind `open`, which starts false), so there is no hydration
  // mismatch to worry about — and defaulting to `true` meant a phone painted
  // the wide 3/2 spread box for one frame before snapping to the tall 3/4 one,
  // which looked like the book resizing as it opened.
  const [isSpread, setIsSpread] = useState(() =>
    typeof window === "undefined"
      ? true
      : window.matchMedia("(min-width: 768px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsSpread(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return isSpread;
}

/* -------------------------------------------------------------------- page */

function PageFace({
  page,
  side,
  ctx,
}: {
  page: number;
  side: "left" | "right" | "solo";
  ctx: PageContext;
}) {
  const entry = BOOK_PAGES[page];
  if (!entry) return null;

  const gutter = side === "left" ? "right" : "left";

  return (
    <div className="relative flex flex-col w-full h-full overflow-hidden">
      {/* paper */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(160deg, rgba(9,22,30,0.96), rgba(3,11,16,0.98))",
        }}
      />
      {/* gutter shading — the page curves into the spine */}
      {side !== "solo" && (
        <div
          className="absolute inset-y-0 w-8 pointer-events-none"
          aria-hidden="true"
          style={{
            [gutter]: 0,
            background: `linear-gradient(to ${side === "left" ? "left" : "right"}, rgba(0,0,0,0.55), rgba(0,0,0,0))`,
          }}
        />
      )}

      <div className="relative flex-1 min-h-0 overflow-y-auto book-page-scroll">
        <div className="px-5 py-5 md:px-6 md:py-6">{entry.render(ctx)}</div>
      </div>

      {/* folio */}
      <div
        className={`relative flex h-7 shrink-0 items-center px-5 text-[10px] tabular-nums text-cyan-300/30 md:px-6 ${
          side === "left" ? "justify-start" : "justify-end"
        }`}
        aria-hidden="true"
      >
        {page + 1}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- flip sheet */

/**
 * The single sheet that physically moves during a turn.
 *
 * The spread underneath has *already* advanced to the destination, so this
 * sheet only has to carry the outgoing face away and land the incoming one.
 * That ordering is what removes the end-of-turn content pop: previously the
 * index changed in a setTimeout tuned to match the animation, and the two
 * drifted.
 *
 *   next: sheet sits on the right half, hinges at the spine, swings to -180.
 *         front = outgoing right page, back = incoming left page.
 *   prev: sheet sits on the left half, hinges at the spine, swings to +180.
 *         front = outgoing left page, back = incoming right page.
 */
function FlipSheet({
  flip,
  ctx,
  onDone,
}: {
  flip: Flip;
  ctx: PageContext;
  onDone: () => void;
}) {
  const next = flip.dir === "next";
  const to = next ? -180 : 180;
  const mid = to / 2;

  const angle = useMotionValue(0);
  /** Specular sheen peaks when the sheet is edge-on. */
  const sheen = useTransform(angle, [0, mid, to], [0, 0.28, 0]);
  /** Shadow the sheet casts on the page it is uncovering. */
  const cast = useTransform(angle, [0, mid, to], [0.5, 0.22, 0]);

  const frontPage = next ? flip.from + 1 : flip.from;
  const backPage = next ? flip.from + 2 : flip.from - 1;

  const face: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
  };

  return (
    <>
      {/* cast shadow on the half being revealed */}
      <motion.div
        className="absolute inset-y-0 z-20 pointer-events-none"
        aria-hidden="true"
        style={{
          [next ? "right" : "left"]: 0,
          width: "50%",
          opacity: cast,
          background: `linear-gradient(to ${next ? "left" : "right"}, rgba(0,0,0,0.85), rgba(0,0,0,0) 62%)`,
        }}
      />

      <motion.div
        className="absolute inset-y-0 z-30"
        aria-hidden="true"
        // Duplicated content must not be reachable by pointer or Tab.
        inert
        initial={{ rotateY: 0 }}
        animate={{ rotateY: to }}
        transition={{ duration: FLIP_MS / 1000, ease: EASE }}
        onUpdate={(latest) => {
          const r = latest.rotateY;
          angle.set(typeof r === "number" ? r : parseFloat(String(r)) || 0);
        }}
        onAnimationComplete={onDone}
        style={{
          width: "50%",
          [next ? "left" : "right"]: "50%",
          transformOrigin: next ? "left center" : "right center",
          transformStyle: "preserve-3d",
          pointerEvents: "none",
          filter: "drop-shadow(0 24px 48px rgba(0,0,0,0.6))",
        }}
      >
        {/* FRONT — the page being lifted */}
        <div style={face}>
          <PageFace
            page={frontPage}
            side={next ? "right" : "left"}
            ctx={ctx}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: sheen,
              background: `linear-gradient(${next ? 100 : 260}deg, rgba(255,255,255,0.5), rgba(255,255,255,0) 55%)`,
            }}
          />
        </div>

        {/* BACK — the page being laid down (pre-mirrored) */}
        <div style={{ ...face, transform: "rotateY(180deg)" }}>
          <PageFace
            page={backPage}
            side={next ? "left" : "right"}
            ctx={ctx}
          />
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: sheen,
              background: `linear-gradient(${next ? 260 : 100}deg, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`,
            }}
          />
        </div>
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------- modal */

export default function EducationBookModal({ onClose }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const isSpread = useIsSpread();
  const step = isSpread ? 2 : 1;

  const [rawIndex, setRawIndex] = useState(0);
  const [flip, setFlip] = useState<Flip | null>(null);
  const [viewer, setViewer] = useState<{ src: string; alt: string } | null>(
    null
  );

  const dialogRef = useRef<HTMLDivElement | null>(null);

  const lastIndex = Math.max(0, PAGE_COUNT - step);

  /**
   * Crossing the md breakpoint changes the step from 2 to 1 (or back), which
   * can leave the stored index off a valid boundary. Derived rather than
   * synced in an effect so there is no cascading re-render, and no frame where
   * the book renders a spread starting on an odd page.
   */
  const index = Math.min(lastIndex, Math.floor(rawIndex / step) * step);

  const rightPage = Math.min(index + 1, PAGE_COUNT - 1);
  const spreadNo = Math.floor(index / step) + 1;
  const spreadTotal = Math.ceil(PAGE_COUNT / step);

  const canPrev = index > 0;
  const canNext = index + step < PAGE_COUNT;

  const go = useCallback(
    (dir: "next" | "prev") => {
      if (flip) return;
      const target = dir === "next" ? index + step : index - step;
      if (target < 0 || target > lastIndex) return;
      // Advance the spread first, then hand the outgoing pages to the sheet.
      if (!reduceMotion) setFlip({ dir, from: index });
      setRawIndex(target);
    },
    [flip, index, step, lastIndex, reduceMotion]
  );

  const goToPage = useCallback(
    (page: number) => {
      if (flip) return;
      const target = Math.min(lastIndex, Math.floor(page / step) * step);
      if (target === index) return;
      if (!reduceMotion) {
        setFlip({ dir: target > index ? "next" : "prev", from: index });
      }
      setRawIndex(target);
    },
    [flip, index, step, lastIndex, reduceMotion]
  );

  const ctx: PageContext = useMemo(
    () => ({
      onOpenImage: (src, alt) => setViewer({ src, alt }),
      onGoToPage: goToPage,
    }),
    [goToPage]
  );

  /* ----------------------------------------------------------- keyboard */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        if (viewer) setViewer(null);
        else onClose();
        return;
      }
      if (viewer) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault();
        go("next");
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go("prev");
      }
      if (e.key === "Home") {
        e.preventDefault();
        goToPage(0);
      }
      if (e.key === "End") {
        e.preventDefault();
        goToPage(PAGE_COUNT - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, goToPage, viewer, onClose]);

  /* ------------------------------------------- scroll lock + focus trap */
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const el = dialogRef.current;
    el?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !el) return;
      const nodes = Array.from(
        el.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((n) => n.offsetParent !== null);
      if (!nodes.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    el?.addEventListener("keydown", trap);

    return () => {
      document.body.style.overflow = prevOverflow;
      el?.removeEventListener("keydown", trap);
      previouslyFocused?.focus?.();
    };
  }, []);

  /* -------------------------------------------------------------- swipe */
  const onPanEnd = (_e: unknown, info: PanInfo) => {
    if (viewer || flip) return;
    const { offset, velocity } = info;
    // Ignore mostly-vertical drags so page scrolling still works.
    if (Math.abs(offset.x) < Math.abs(offset.y) * 1.4) return;
    if (Math.abs(offset.x) < 55 && Math.abs(velocity.x) < 420) return;
    go(offset.x < 0 ? "next" : "prev");
  };

  /* ------------------------------------------------------------- render */

  const openTransition = reduceMotion
    ? { duration: 0.18 }
    : { duration: 0.62, ease: EASE };

  /* Single-page (small screen) turn: a slide, because one page has no spine to
     hinge on — a full-width rotate about the outer edge just swings offscreen. */
  const slideDir = flip?.dir === "prev" ? -1 : 1;
  const shift = reduceMotion ? 0 : 70;
  const slideVariants = {
    enter: (d: number) => ({ opacity: 0, x: d > 0 ? shift : -shift }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: d > 0 ? -shift : shift }),
  };

  const announcement = isSpread
    ? `Pages ${index + 1} and ${rightPage + 1} of ${PAGE_COUNT}: ${BOOK_PAGES[index]?.label}, ${BOOK_PAGES[rightPage]?.label}`
    : `Page ${index + 1} of ${PAGE_COUNT}: ${BOOK_PAGES[index]?.label}`;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.24 }}
      style={{ background: "rgba(1,6,9,0.86)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edu-book-title"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.98 }}
        transition={{ duration: 0.28, ease: EASE }}
        className="flex flex-col w-full max-w-5xl"
      >
        {/* ------------------------------------------------------ header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/50">
              Shivraj&rsquo;s Education
            </p>
            <h2
              id="edu-book-title"
              className="text-lg font-bold tracking-tight truncate md:text-xl text-cyan-100"
            >
              A Visual Education Book
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            data-autofocus
            aria-label="Close the education book"
            className="grid transition-colors border rounded-full shrink-0 h-9 w-9 place-items-center border-cyan-400/20 text-cyan-100/70 hover:border-cyan-300/50 hover:text-cyan-100"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>

        {/* -------------------------------------------------------- book */}
        <motion.div
          onPanEnd={onPanEnd}
          className="relative mx-auto"
          style={{
            // Cap width so height (width / ratio) also fits the viewport.
            width: isSpread
              ? "min(94vw, 880px, 105vh)"
              : "min(92vw, 420px, 52vh)",
            aspectRatio: isSpread ? "3 / 2" : "3 / 4",
            // Flex items get `min-height: auto` and are shrinkable by default;
            // pin both so the stage box is decided by the two lines above and
            // nothing else.
            flexShrink: 0,
            perspective: 2000,
            perspectiveOrigin: "center center",
            touchAction: "pan-y",
          }}
        >
          {/* board / edge stack behind the pages */}
          <div
            className="absolute rounded-lg -inset-2 md:-inset-3"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, rgba(10,26,34,0.9), rgba(2,8,12,0.95))",
              border: "1px solid rgba(6,246,255,0.10)",
              boxShadow:
                "0 40px 120px rgba(0,0,0,0.75), inset 0 1px 0 rgba(6,246,255,0.06)",
            }}
          />

          {isSpread ? (
            /* ------------------------------- two-page spread (md and up) */
            <div
              className="relative flex w-full h-full overflow-hidden rounded"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* The two halves swing shut/open around the spine, which reads
                  as a book opening. The old cover-peel faded out in 180ms
                  while rotating for 720ms, so it vanished before it moved. */}
              <motion.div
                className="w-1/2 h-full"
                initial={reduceMotion ? { opacity: 0 } : { rotateY: 62 }}
                animate={reduceMotion ? { opacity: 1 } : { rotateY: 0 }}
                transition={openTransition}
                style={{
                  transformOrigin: "right center",
                  transformStyle: "preserve-3d",
                }}
              >
                <PageFace page={index} side="left" ctx={ctx} />
              </motion.div>

              <motion.div
                className="w-1/2 h-full"
                initial={reduceMotion ? { opacity: 0 } : { rotateY: -62 }}
                animate={reduceMotion ? { opacity: 1 } : { rotateY: 0 }}
                transition={openTransition}
                style={{
                  transformOrigin: "left center",
                  transformStyle: "preserve-3d",
                }}
              >
                <PageFace page={rightPage} side="right" ctx={ctx} />
              </motion.div>

              {/* spine */}
              <div
                className="absolute inset-y-0 z-20 -translate-x-1/2 pointer-events-none left-1/2 w-7"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.15) 35%, rgba(6,246,255,0.05) 50%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0.6))",
                }}
              />

              {flip && (
                <FlipSheet
                  flip={flip}
                  ctx={ctx}
                  onDone={() => setFlip(null)}
                />
              )}

              {/* edge affordances — the real controls are the buttons below */}
              <div
                className="absolute inset-y-0 left-0 z-10 w-[14%] cursor-w-resize"
                aria-hidden="true"
                onClick={() => canPrev && go("prev")}
              />
              <div
                className="absolute inset-y-0 right-0 z-10 w-[14%] cursor-e-resize"
                aria-hidden="true"
                onClick={() => canNext && go("next")}
              />
            </div>
          ) : (
            /* ------------------------------- single page (small screens) */
            <div className="relative w-full h-full overflow-hidden rounded">
              {/*
                Direction comes through AnimatePresence's `custom`, not from
                reading `flip` inside the child: AnimatePresence renders the
                exiting child with the props it had *before* the turn, when
                `flip` was still null, so a "prev" turn would have slid the old
                page out the wrong way.
              */}
              <AnimatePresence
                initial={false}
                mode="popLayout"
                custom={slideDir}
              >
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  custom={slideDir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.34, ease: EASE }}
                  onAnimationComplete={() => setFlip(null)}
                >
                  <PageFace page={index} side="solo" ctx={ctx} />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* ------------------------------------------------------ footer */}
        <div className="flex items-center justify-center gap-3 mt-5 md:gap-4">
          <button
            type="button"
            onClick={() => go("prev")}
            disabled={!canPrev || !!flip}
            aria-label="Previous page"
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 px-3 py-1.5 text-xs text-cyan-100/85 transition-colors hover:border-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-30 md:text-sm"
          >
            <ChevronLeft size={14} aria-hidden="true" /> Prev
          </button>

          {/* spread dots */}
          <div className="flex items-center gap-1.5" role="presentation">
            {Array.from({ length: spreadTotal }, (_, i) => {
              const active = i === spreadNo - 1;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => goToPage(i * step)}
                  aria-label={`Go to ${isSpread ? "spread" : "page"} ${i + 1}`}
                  aria-current={active ? "true" : undefined}
                  className="p-1 group"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all ${
                      active
                        ? "w-5 bg-cyan-300/80"
                        : "w-1.5 bg-cyan-300/25 group-hover:bg-cyan-300/50"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => go("next")}
            disabled={!canNext || !!flip}
            aria-label="Next page"
            className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 px-3 py-1.5 text-xs text-cyan-100/85 transition-colors hover:border-cyan-300/50 disabled:cursor-not-allowed disabled:opacity-30 md:text-sm"
          >
            Next <ChevronRight size={14} aria-hidden="true" />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-cyan-200/35">
          {isSpread
            ? "Arrow keys, page edges, or swipe to turn"
            : "Swipe or use the arrows to turn"}
        </p>

        <div className="sr-only" aria-live="polite" aria-atomic="true">
          {announcement}
        </div>
      </motion.div>

      {/* ------------------------------------------------ document viewer */}
      <AnimatePresence>
        {viewer && (
          <motion.div
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              e.stopPropagation();
              setViewer(null);
            }}
            style={{ background: "rgba(0,0,0,0.94)" }}
            role="dialog"
            aria-modal="true"
            aria-label={viewer.alt}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="relative w-full max-w-4xl"
              style={{ height: "min(86vh, 900px)" }}
            >
              <Image
                src={viewer.src}
                alt={viewer.alt}
                fill
                sizes="(max-width: 768px) 92vw, min(90vw, 896px)"
                style={{ objectFit: "contain" }}
                priority
              />
              <button
                type="button"
                onClick={() => setViewer(null)}
                aria-label="Close document"
                className="absolute grid rounded-full h-9 w-9 place-items-center border border-cyan-400/25 bg-black/70 text-cyan-100/85 transition-colors -top-1 right-0 hover:border-cyan-300/60 md:-top-2"
              >
                <X size={16} aria-hidden="true" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
