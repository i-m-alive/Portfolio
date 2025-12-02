"use client";

import React from "react";

export default function ArchitectureDiagram({ project }: { project: any }) {
  // Simple reusable SVG with labelled blocks. You can expand this for each project.
  // For more complex diagrams: embed Mermaid or draw an exported image.
  return (
    <div className="w-full">
      <svg viewBox="0 0 600 260" width="100%" height="160" role="img" aria-label="Architecture diagram">
        {/* Data ingestion */}
        <rect x="20" y="20" rx="8" ry="8" width="140" height="60" fill="#071A1C" stroke="#00E6FF" />
        <text x="90" y="55" fill="#fff" fontSize="12" textAnchor="middle">Data / Docs</text>

        {/* Preprocessing */}
        <rect x="190" y="20" rx="8" ry="8" width="140" height="60" fill="#071A1C" stroke="#00E6FF" />
        <text x="260" y="55" fill="#fff" fontSize="12" textAnchor="middle">Preprocessing</text>

        {/* Embeddings */}
        <rect x="360" y="20" rx="8" ry="8" width="200" height="60" fill="#071A1C" stroke="#00E6FF" />
        <text x="460" y="55" fill="#fff" fontSize="12" textAnchor="middle">Embeddings / Vector DB (FAISS)</text>

        {/* arrows */}
        <line x1="160" y1="50" x2="190" y2="50" stroke="#00E6FF" strokeWidth="2" markerEnd="url(#arrow)"/>
        <line x1="330" y1="50" x2="360" y2="50" stroke="#00E6FF" strokeWidth="2" markerEnd="url(#arrow)"/>

        {/* LLM / RAG */}
        <rect x="190" y="110" rx="8" ry="8" width="220" height="80" fill="#071A1C" stroke="#00E6FF" />
        <text x="300" y="150" fill="#fff" fontSize="12" textAnchor="middle">LLM (Fine-tuned / LLaMA) + RAG</text>

        {/* UI */}
        <rect x="20" y="110" rx="8" ry="8" width="140" height="80" fill="#071A1C" stroke="#00E6FF" />
        <text x="90" y="150" fill="#fff" fontSize="12" textAnchor="middle">UI / Dashboard</text>

        <line x1="160" y1="150" x2="190" y2="150" stroke="#00E6FF" strokeWidth="2" markerEnd="url(#arrow)"/>
        <line x1="410" y1="150" x2="360" y2="110" stroke="#00E6FF" strokeWidth="2" markerEnd="url(#arrow)"/>

        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="#00E6FF" />
          </marker>
        </defs>
      </svg>

      <div className="mt-2 text-xs text-white/60">
        Typical architecture: ingestion → preprocessing → embeddings → vector store → LLM + RAG → UI. Replace with your real infra.
      </div>
    </div>
  );
}
