"use client";

import React from "react";

type Project = {
  title: string;
  summary: string;
  tech?: string[];
  metric?: string;
};

export default function ProjectsGrid({ projects }: { projects: Project[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section>
      <h3 className="mb-4 text-lg font-semibold text-cyan-100">Key Projects</h3>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <article
            key={p.title}
            className="flex flex-col rounded-lg border border-cyan-400/6 bg-black/20 p-4 h-full min-h-[220px] overflow-hidden"
            aria-labelledby={`project-${p.title}`}
          >
            <div className="flex-1 overflow-hidden">
              <h4 id={`project-${p.title}`} className="text-base font-semibold leading-tight md:text-lg text-cyan-100">
                {p.title}
              </h4>

              <p className="mt-3 text-sm text-cyan-200/80 leading-relaxed max-h-[7.5rem] overflow-hidden">
                {p.summary}
              </p>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex flex-wrap gap-2">
                {(p.tech || []).slice(0, 6).map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 text-xs border rounded-full border-cyan-400/8 bg-black/10 text-cyan-100/90"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {p.metric && (
                <div className="hidden ml-3 text-xs md:inline-block text-cyan-200/70">
                  <div className="text-[11px]">Metric</div>
                  <div className="mt-1 text-sm font-semibold text-cyan-100">{p.metric}</div>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
