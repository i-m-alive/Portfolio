// src/app/work-experience/components/ExperienceModal.tsx
"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

type Exp = {
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

export default function ExperienceModal({
  exp,
  onClose,
}: {
  exp: Exp | null;
  onClose: () => void;
}) {
  if (!exp) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          initial={{ y: 24, scale: 0.98, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          exit={{ y: 10, scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="relative w-[92%] max-w-md md:max-w-2xl rounded-2xl p-4 md:p-6 max-h-[90vh] overflow-y-auto flex flex-col"
          style={{
            background:
              "linear-gradient(180deg, rgba(3,12,18,0.86), rgba(2,8,12,0.9))",
            border: "1px solid rgba(6,246,255,0.04)",
            boxShadow: "0 30px 120px rgba(0,0,0,0.8)",
          }}
        >
          {/* portrait preview on top */}
          <div className="relative w-full h-60 overflow-hidden border rounded-lg border-cyan-400/8 bg-black/10">
            {exp.previewImg ? (
              <Image
                src={exp.previewImg}
                alt={exp.company}
                fill
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="w-full h-full bg-black/20" />
            )}
          </div>

          {/* text */}
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[1fr,96px] items-start">
            <div>
              <div className="text-xs text-cyan-200/60">
                {exp.type} • {exp.period}
              </div>
              <h3 className="mt-1 text-2xl font-bold md:text-3xl text-cyan-100">
                {exp.title}
              </h3>
              <div className="mt-1 text-sm text-cyan-200/60">
                {exp.company}
                {exp.location ? ` • ${exp.location}` : ""}
              </div>

              {exp.summary && (
                <p className="mt-4 leading-relaxed text-cyan-200/70">
                  {exp.summary}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {(exp.skills || []).map((s) => (
                  <span
                    key={s}
                    className="px-2 py-1 text-xs border rounded-md border-cyan-400/8 bg-black/10"
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-6">
                {exp.attachment && (
                  <a
                    href={exp.attachment}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block px-4 py-2 border rounded-md bg-black/20 border-cyan-400/10 text-sm"
                  >
                    Open attachment
                  </a>
                )}

                <button
                  onClick={onClose}
                  className="inline-block px-4 py-2 text-sm border rounded-md border-cyan-400/10 text-cyan-100/90 bg-black/60"
                >
                  Close
                </button>
              </div>
            </div>

            {/* company logo on right column */}
            <aside className="flex items-start justify-end col-span-1">
              <div className="w-20 h-20 overflow-hidden border rounded-md border-cyan-400/8 bg-black/8">
                {exp.companyLogo ? (
                  <Image
                    src={exp.companyLogo}
                    alt={exp.company}
                    width={80}
                    height={80}
                    style={{ objectFit: "contain", padding: 6 }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-cyan-200/60">
                    Logo
                  </div>
                )}
              </div>
            </aside>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
