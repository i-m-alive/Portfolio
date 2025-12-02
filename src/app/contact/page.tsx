"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import NextImage from "next/image";
import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";
import {
  Mail,
  Phone,
  ExternalLink,
  MapPin,
  DownloadCloud,
  X,
} from "lucide-react";
import DynamicCosmic from "@/app/components/DynamicCosmic";

/* ---------------------------
   SolarPreview dynamic import
   - Explicit props so we can pass offsetY, onProfileClick
   --------------------------- */
type SolarPreviewProps = {
  scale?: number;
  height?: string;
  offsetY?: number;
  onProfileClick?: () => void;
};

const SolarPreview = dynamic<SolarPreviewProps>(
  () => import("@/app/components/orbit/SolarPreview"),
  {
    ssr: false,
    loading: () => <div style={{ height: 220 }} />,
  }
);

/* ---------------------------
   TypingText: small, accessible typing effect
   - respects prefers-reduced-motion
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
  const prefersReduced = useReducedMotion() ?? false;
  const [visible, setVisible] = React.useState<string>(
    prefersReduced ? text : ""
  );
  const idxRef = React.useRef(0);
  const timerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (prefersReduced) {
      setVisible(text);
      return;
    }

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
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [text, speed, prefersReduced]);

  return (
    <span className={className} aria-live="polite">
      {visible}
      {cursor && !prefersReduced && (
        <span className="ml-2 animate-blink" aria-hidden>
          ▍
        </span>
      )}
      <style jsx>{`
        .animate-blink {
          display: inline-block;
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

/* -------------------------
   Page & section animation variants
   ------------------------- */

const pageVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      // no string "ease" to satisfy motion-dom types
      staggerChildren: 0.12,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.4 },
  },
  profile: {
    opacity: 1,
    y: 0,
    scale: 0.985,
    transition: { duration: 0.45 },
    // filter is allowed at runtime; TS is okay as part of style
    filter: "none",
  },
};

const buildVariants = (reduceMotion: boolean) => {
  if (reduceMotion) {
    const t: Variants = {
      hidden: { opacity: 0 },
      show: { opacity: 1 },
    };
    const stagger: Variants = {
      hidden: {},
      show: {},
    };
    return { left: t, up: t, staggerContainer: stagger };
  }

  const left: Variants = {
    hidden: { opacity: 0, x: -24 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5 },
    },
  };

  const up: Variants = {
    hidden: { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const staggerContainer: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.06,
      },
    },
  };

  return { left, up, staggerContainer };
};

/* small design constants */
const ACTION_TRANS: Transition = {
  type: "spring",
  stiffness: 200,
  damping: 20,
};

/* -------------------------
   Small reusable motion wrappers
   ------------------------- */
function Hoverable({
  children,
  reduceMotion,
  className,
  style,
  whileHover,
  whileTap,
  onClick,
  as = "div",
  glow = true,
  ...rest
}: any) {
  const Comp: any = (motion as any)[as] || motion.div;

  if (reduceMotion) {
    return (
      <Comp className={className} style={style} onClick={onClick} {...rest}>
        {children}
      </Comp>
    );
  }

  const defaultHover = glow
    ? {
        y: -6,
        scale: 1.02,
        boxShadow:
          "0 22px 48px rgba(6,182,212,0.06), 0 0 48px rgba(6,182,212,0.06)",
        transition: { duration: 0.28 },
      }
    : {
        y: -6,
        scale: 1.02,
        transition: { duration: 0.28 },
      };

  return (
    <Comp
      className={className}
      style={style}
      whileHover={whileHover || defaultHover}
      whileTap={whileTap || { scale: 0.995 }}
      transition={ACTION_TRANS}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/* -------------------------
   Main Contact Page
   ------------------------- */
export default function ContactPage() {
  const reduceMotion = (useReducedMotion() ?? false) as boolean;
  const variants = buildVariants(reduceMotion);

  const emails = ["bhakatshivraj2@gmail.com", "shivkum277@gmail.com"];
  const phones = ["8329788136", "8073628351"];
  const linkedInUrl =
    "https://www.linkedin.com/in/kumar-shivraj-bhakat-6403b7236/";
  const githubUrl = "https://github.com/i-m-alive";
  const locationLabel = "Nagpur, Maharashtra";

  const [profileActive, setProfileActive] = useState(false);
  const onProfileClick = useCallback(() => setProfileActive(true), []);
  const closeProfileActive = useCallback(() => setProfileActive(false), []);

  const introText =
    "Reach out for collaborations, internships or just to say hi — I respond to email and LinkedIn fairly quickly.";

  return (
    <>
      <motion.main
        initial="hidden"
        animate={profileActive ? "profile" : "show"}
        exit="exit"
        variants={pageVariants}
        className="relative min-h-screen px-6 py-12 text-white bg-gradient-to-b from-black/88 to-black/96 md:px-8 lg:px-20"
        style={{
          filter: profileActive ? "blur(0.6px)" : undefined,
          transformOrigin: "center top",
        }}
      >
        <DynamicCosmic />

        <div className="relative z-10 max-w-6xl mx-auto space-y-8">
          {/* HEADER */}
          <motion.header
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants.staggerContainer}
            className="grid items-center grid-cols-1 gap-6 md:grid-cols-3 md:gap-12"
          >
            {/* SOLAR PREVIEW */}
            <motion.div
              variants={variants.up}
              className="flex justify-center md:justify-start"
            >
              <Hoverable
                as="div"
                reduceMotion={reduceMotion}
                className="relative w-full max-w-[380px] border border-white/10 rounded-2xl p-3 bg-black/40 backdrop-blur-md"
                style={{
                  height: 300,
                  overflow: "hidden",
                  boxShadow: "0 0 40px rgba(0,0,0,0.45)",
                }}
                whileHover={
                  !reduceMotion
                    ? {
                        scale: 1.0,
                        boxShadow:
                          "0 22px 50px rgba(0,0,0,0.6), 0 0 80px rgba(6,182,212,0.06)",
                      }
                    : undefined
                }
                glow={true}
              >
                <div className="absolute inset-0">
                  <SolarPreview
                    scale={0.78}
                    offsetY={18}
                    onProfileClick={onProfileClick}
                  />
                </div>
              </Hoverable>
            </motion.div>

            {/* CONTACT HEADER & ACTIONS */}
            <motion.div
              variants={variants.left}
              className="flex flex-col justify-center md:col-span-2"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl">
                    Contact Me
                  </h1>

                  <p className="max-w-lg mt-2 text-sm text-white/70 md:text-base">
                    <TypingText text={introText} speed={28} />
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Hoverable
                    as="a"
                    reduceMotion={reduceMotion}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black rounded shadow bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    style={{ transformOrigin: "center" }}
                    href="/Kumar_Shivraj_Bhakat_Resume.docx"
                    download
                    glow={true}
                  >
                    <DownloadCloud size={16} /> Download Resume
                  </Hoverable>

                  <Hoverable
                    as="a"
                    reduceMotion={reduceMotion}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded bg-white/6"
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    glow={true}
                  >
                    LinkedIn <ExternalLink size={14} />
                  </Hoverable>
                </div>
              </div>
            </motion.div>
          </motion.header>

          {/* CONTACT CARD */}
          <motion.section
            variants={variants.up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.18 }}
            className="p-5 border bg-white/3 border-white/6 rounded-2xl"
          >
            <motion.h2 variants={variants.left} className="text-lg font-semibold">
              Direct contact
            </motion.h2>

            <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2">
              {/* Emails */}
              <motion.div
                variants={variants.up}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Mail size={16} />{" "}
                  <span className="font-medium text-white">Email</span>
                </div>

                <div className="flex flex-col gap-2">
                  {emails.map((e) => (
                    <HoverableRow
                      key={e}
                      leftIcon={<Mail size={16} />}
                      title={e}
                      actionLabel="Send"
                      href={`mailto:${e}`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Phones */}
              <motion.div
                variants={variants.up}
                className="flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 text-sm text-white/70">
                  <Phone size={16} />{" "}
                  <span className="font-medium text-white">Phone</span>
                </div>

                <div className="flex flex-col gap-2">
                  {phones.map((p) => (
                    <HoverableRow
                      key={p}
                      leftIcon={<Phone size={16} />}
                      title={`+91 ${p}`}
                      actionLabel="Call"
                      href={`tel:+91${p}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>

          {/* PROFILES */}
          <motion.section
            variants={variants.up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="p-5 border bg-white/3 border-white/6 rounded-2xl"
          >
            <motion.h2 variants={variants.left} className="text-lg font-semibold">
              Profiles
            </motion.h2>

            <motion.div
              variants={variants.up}
              className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2"
            >
              {/* LinkedIn */}
              <Hoverable
                as="div"
                reduceMotion={reduceMotion}
                className="flex items-center justify-between gap-4 p-3 border rounded bg-black/70 border-white/6"
                glow={true}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 overflow-hidden border rounded bg-black/80 border-white/6">
                    <NextImage
                      src="/linkedin.png"
                      alt="LinkedIn"
                      width={36}
                      height={36}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">LinkedIn</div>
                    <div className="text-xs text-white/60">Professional</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={linkedInUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded bg-white/6"
                  >
                    Open in new tab <ExternalLink size={14} />
                  </a>
                </div>
              </Hoverable>

              {/* GitHub */}
              <Hoverable
                as="div"
                reduceMotion={reduceMotion}
                className="flex items-center justify-between gap-4 p-3 border rounded bg-black/70 border-white/6"
                glow={true}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 overflow-hidden border rounded bg-black/80 border-white/6">
                    <NextImage
                      src="/social.png"
                      alt="GitHub"
                      width={36}
                      height={36}
                      style={{ objectFit: "contain" }}
                    />
                  </div>
                  <div>
                    <div className="text-sm font-medium">GitHub</div>
                    <div className="text-xs text-white/60">
                      Code & Projects
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm border rounded bg-white/6"
                  >
                    Open in new tab <ExternalLink size={14} />
                  </a>
                </div>
              </Hoverable>
            </motion.div>
          </motion.section>

          {/* LOCATION */}
          <motion.section
            variants={variants.up}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            className="p-5 border bg-white/3 border-white/6 rounded-2xl"
          >
            <motion.h2 variants={variants.left} className="text-lg font-semibold">
              Location
            </motion.h2>

            <motion.div
              variants={variants.up}
              className="flex items-center gap-4 mt-4"
            >
              <Hoverable
                as="div"
                reduceMotion={reduceMotion}
                className="relative flex items-center justify-center w-12 h-12 border rounded-lg bg-black/70 border-white/6"
                glow={true}
              >
                <div style={{ width: 44, height: 44, position: "relative" }}>
                  <NextImage
                    src="/location.png"
                    alt="location logo"
                    width={44}
                    height={44}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </Hoverable>

              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <MapPin size={18} className="text-cyan-300" />
                  <div className="text-base font-medium">{locationLabel}</div>
                </div>
                <div className="mt-1 text-sm text-white/70">
                  Available for opportunities in and around Nagpur. Willing to
                  relocate / remote work as needed.
                </div>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </motion.main>

      {profileActive && (
        <div className="fixed inset-0 z-[3000] pointer-events-none">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
          <button
            onClick={closeProfileActive}
            className="pointer-events-auto fixed top-6 right-6 z-[3100] inline-flex items-center gap-2 px-3 py-2 rounded bg-white/6 hover:bg-white/8 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            aria-label="Close profile animation"
          >
            <X size={16} /> Close
          </button>
        </div>
      )}
    </>
  );
}

/* -------------------------
   Small subcomponents
   ------------------------- */
function HoverableRow({
  leftIcon,
  title,
  actionLabel,
  href,
}: {
  leftIcon: React.ReactNode;
  title: string;
  actionLabel: string;
  href: string;
}) {
  const rm = (useReducedMotion() ?? false) as boolean;
  return (
    <Hoverable
      as="div"
      reduceMotion={rm}
      className="flex items-center justify-between w-full px-4 py-3 border rounded bg-black/70 border-white/6"
      whileHover={
        !rm
          ? {
              scale: 1.01,
              y: -4,
              boxShadow:
                "0 16px 40px rgba(6,182,212,0.06), 0 0 36px rgba(6,182,212,0.05)",
            }
          : undefined
      }
      glow={true}
    >
      <div className="flex items-center gap-3">
        <div className="text-white/90">{leftIcon}</div>
        <div className="text-sm break-words">{title}</div>
      </div>

      <a
        href={href}
        className="px-2 py-1 text-sm rounded text-cyan-300 hover:underline focus:outline-none focus:ring-2 focus:ring-cyan-400"
      >
        {actionLabel}
      </a>
    </Hoverable>
  );
}
