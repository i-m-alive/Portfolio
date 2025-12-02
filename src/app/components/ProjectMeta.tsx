"use client";

import React from "react";
import { ExternalLink } from "lucide-react";

export default function ProjectMeta({ github, tech = [], roles = [], last_updated, status }: { github?: string; tech?: string[]; roles?: string[]; last_updated?: string; status?: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-white/3 p-4 rounded-xl border border-white/6">
        <div className="text-sm text-white/60">Status</div>
        <div className="font-semibold">{status ?? "code-only"}</div>

        {github && (
          <a href={github} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm px-3 py-2 rounded-md border border-white/8 bg-white/3">
            <ExternalLink size={14} /> View Code
          </a>
        )}

        {last_updated && <div className="mt-3 text-xs text-white/60">Last updated: {last_updated}</div>}
      </div>

      <div className="bg-white/3 p-4 rounded-xl border border-white/6">
        <div className="text-sm text-white/60">Tech</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tech.map((t) => <span key={t} className="text-xs px-2 py-1 rounded-md bg-white/5">{t}</span>)}
        </div>
      </div>

      <div className="bg-white/3 p-4 rounded-xl border border-white/6">
        <div className="text-sm text-white/60">My roles</div>
        <div className="mt-2">
          {roles.map((r) => <div key={r} className="text-sm">{r}</div>)}
        </div>
      </div>
    </div>
  );
}
