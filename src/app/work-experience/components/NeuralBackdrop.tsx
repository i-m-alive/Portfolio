// src/app/education/components/NeuralBackdrop.tsx
"use client";

import React from "react";

export default function NeuralBackdrop({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`} aria-hidden>
      {/* subtle moving grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(6,246,255,0.03), transparent 6%), radial-gradient(ellipse at 80% 80%, rgba(59,130,246,0.02), transparent 8%)",
          mixBlendMode: "screen",
          zIndex: 0,
        }}
      />
      {/* animated neural net SVG (nodes + connecting lines drawn with stroke-dashoffset animation) */}
      <svg
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
        className="w-full h-full"
        style={{ zIndex: 1 }}
      >
        <defs>
          <linearGradient id="nglow" x1="0" x2="1">
            <stop offset="0%" stopColor="#00fff0" stopOpacity="0.12" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#00f6ff" stopOpacity="0.12" />
          </linearGradient>
          <filter id="soft" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* example network of nodes */}
        {/* lines (animated stroke) */}
        <g stroke="url(#nglow)" strokeWidth="1.3" fill="none" opacity="0.9" style={{ filter: "url(#soft)" }}>
          <path className="nn-line" d="M120 520 C260 420, 340 380, 430 300" />
          <path className="nn-line" d="M430 300 C540 210, 640 200, 760 160" />
          <path className="nn-line" d="M760 160 C860 120, 980 160, 1060 220" />
          <path className="nn-line" d="M430 300 C560 340, 650 420, 760 480" />
        </g>

        {/* nodes */}
        <g fill="#06f6ff" fillOpacity="0.14" stroke="#08f6ff" strokeOpacity="0.28" strokeWidth="1.2" style={{ filter: "url(#soft)" }}>
          <circle cx="120" cy="520" r="8" className="nn-node" />
          <circle cx="430" cy="300" r="8" className="nn-node" />
          <circle cx="760" cy="160" r="8" className="nn-node" />
          <circle cx="1060" cy="220" r="8" className="nn-node" />
          <circle cx="760" cy="480" r="7" className="nn-node" />
        </g>

        <style jsx>{`
          .nn-line {
            stroke-dasharray: 300;
            stroke-dashoffset: 300;
            animation: slide 6s linear infinite;
            animation-delay: calc(-0.8s * var(--i, 0));
          }
          .nn-node {
            transform-origin: center;
            animation: pulse 3s ease-in-out infinite;
          }
          @keyframes slide {
            0% { stroke-dashoffset: 300; opacity: 0.08; }
            50% { stroke-dashoffset: 0; opacity: 0.6; }
            100% { stroke-dashoffset: -300; opacity: 0.08; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.9; }
            50% { transform: scale(1.25); opacity: 1; }
            100% { transform: scale(1); opacity: 0.9; }
          }
        `}</style>
      </svg>
    </div>
  );
}
