"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

type Entry = {
  id: string;
  company: string;
  role: string;
  period: string;
  short?: string;
  bullets?: string[];
  logo?: string; // local public path, e.g. "/education/navikenz-intern.png"
};

export default function ExperienceTimeline({ entries }: { entries: Entry[] }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <h3 className="mb-4 text-lg font-semibold text-cyan-100">Career Timeline</h3>

      <div className="relative">
        {/* center vertical line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-800/20 to-cyan-400/8 z-0 rounded" />

        <div className="space-y-12">
          {entries.map((e, idx) => {
            const leftSide = idx % 2 === 0; // alternate side
            const isActive = activeId === e.id;
            const isHover = hoverId === e.id;

            return (
              <div key={e.id} className="relative z-10">
                <div className="flex items-center w-full">
                  {/* left placeholder / spacing */}
                  <div className="w-1/2 pr-6" />

                  {/* center: checkpoint */}
                  <div className="w-[90px] flex flex-col items-center justify-center relative z-20">
                    <div
                      role="button"
                      tabIndex={0}
                      onMouseEnter={() => setHoverId(e.id)}
                      onMouseLeave={() => setHoverId(null)}
                      onClick={() => setActiveId((prev) => (prev === e.id ? null : e.id))}
                      onKeyDown={(ev) => {
                        if (ev.key === "Enter" || ev.key === " ") {
                          ev.preventDefault();
                          setActiveId((prev) => (prev === e.id ? null : e.id));
                        }
                      }}
                      className="cursor-pointer select-none"
                      aria-pressed={isActive}
                    >
                      <div
                        className={`relative w-16 h-16 rounded-full flex items-center justify-center border-2
                          ${isActive ? "border-cyan-300/80 shadow-[0_8px_30px_rgba(2,209,197,0.06)]" : "border-cyan-400/8"}
                          bg-black/10`}
                      >
                        {/* logo fitted inside circle */}
                        {e.logo ? (
                          <div className="flex items-center justify-center w-12 h-12 overflow-hidden rounded-full">
                            <Image
                              src={e.logo}
                              alt={`${e.company} logo`}
                              width={48}
                              height={48}
                              style={{ objectFit: "contain" }}
                              priority={false}
                            />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-cyan-400/10" />
                        )}

                        {/* small dot below the circle */}
                        <div
                          className={`absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-3 h-3 rounded-full ${
                            isActive ? "bg-cyan-400" : "bg-cyan-700/40"
                          }`}
                        />
                      </div>

                      {/* duration text */}
                      <div className="mt-2 text-xs text-cyan-200/70 text-center max-w-[90px] break-words">
                        {e.period}
                      </div>
                    </div>

                    {/* hover tooltip (short) */}
                    <AnimatePresence>
                      {isHover && !isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.12 }}
                          className="absolute left-1/2 -translate-x-1/2 top-[-86px] z-30 max-w-[220px]"
                        >
                          <div className="p-2 text-xs border rounded-md bg-black/88 border-cyan-400/8 text-cyan-200">
                            <div className="font-semibold text-cyan-100">{e.role}</div>
                            <div className="mt-1 text-xs text-cyan-200/70">{e.company}</div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* right placeholder / spacing */}
                  <div className="w-1/2 pl-6" />
                </div>

                {/* details panel for active node (centered below the node) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      key={e.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      transition={{ duration: 0.18 }}
                      className="flex justify-center mt-4"
                    >
                      <div className="w-full max-w-[920px] px-4">
                        <div className="p-4 border rounded-lg border-cyan-400/6 bg-black/20">
                          <div className="flex items-start gap-4">
                            <div className="flex items-center justify-center overflow-hidden rounded-md w-14 h-14 bg-gradient-to-br from-cyan-600/8 to-black/10 ring-1 ring-cyan-400/8">
                              {e.logo ? (
                                <Image src={e.logo} alt={`${e.company} logo`} width={52} height={52} style={{ objectFit: "contain" }} />
                              ) : null}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-4">
                                <div>
                                  <div className="text-lg font-bold text-cyan-100">{e.role}</div>
                                  <div className="text-xs text-cyan-200/70">{e.company} · {e.period}</div>
                                </div>

                                <div className="text-xs text-cyan-200/70">
                                  Quick view <span className="block font-semibold text-cyan-100">{e.bullets?.length ?? 0} points</span>
                                </div>
                              </div>

                              <div className="mt-3 text-sm text-cyan-200/80">
                                <ul className="ml-5 space-y-2 list-disc">
                                  {e.bullets?.map((b, i) => (
                                    <li key={i}>{b}</li>
                                  ))}
                                </ul>
                              </div>

                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
